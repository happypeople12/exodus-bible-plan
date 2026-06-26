const fs = require("fs");
const path = require("path");
const vm = require("vm");

const APP_ID = process.env.ONESIGNAL_APP_ID;
const REST_API_KEY = process.env.ONESIGNAL_REST_API_KEY;
const SITE_URL = process.env.PLAN_URL || "https://exodus-bible-plan.vercel.app";

const LANGUAGES = ["ru", "uk", "en"];

function log(message, data = null) {
  if (data) {
    console.log(message, JSON.stringify(data, null, 2));
  } else {
    console.log(message);
  }
}

function loadPlan() {
  log("📖 Loading plan.js...");

  const planPath = path.join(process.cwd(), "plan.js");
  const code = fs.readFileSync(planPath, "utf8");

  const sandbox = {};
  vm.runInNewContext(
    `${code}\nresult = { planText, bookLabels, bookOrder };`,
    sandbox
  );

  log("✅ plan.js loaded");

  return sandbox.result;
}

function getTodayKey() {
  const now = new Date();

  const key =
    String(now.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(now.getDate()).padStart(2, "0");

  log("📅 Today key:", { key });

  return key;
}

function formatReading(text, lang, bookLabels) {
  if (!text) return "";

  return text
    .split(",")
    .map(item => item.trim())
    .filter(Boolean)
    .map(item => {
      const parts = item.split(" ");
      const chapter = parts[parts.length - 1];
      const book = parts.slice(0, -1).join(" ");
      const label = bookLabels?.[lang]?.[book] || book;

      return `${label} ${chapter}`;
    })
    .join(" • ");
}

const notificationText = {
  ru: {
    title: "📖 План Победы",
    message: reading =>
      reading
        ? `Доброе утро! Сегодня в плане: ${reading}. Открой приложение и начни чтение.`
        : "Доброе утро! Сегодня тебя ждёт новое чтение Библии."
  },

  uk: {
    title: "📖 План Перемоги",
    message: reading =>
      reading
        ? `Доброго ранку! Сьогодні в плані: ${reading}. Відкрий застосунок і почни читання.`
        : "Доброго ранку! Сьогодні на тебе чекає нове читання Біблії."
  },

  en: {
    title: "📖 Victory Plan",
    message: reading =>
      reading
        ? `Good morning! Today’s reading: ${reading}. Open the app and begin reading.`
        : "Good morning! Your daily Bible reading is ready."
  }
};

async function sendNotification(language, reading) {
  const text = notificationText[language];

  const payload = {
    app_id: APP_ID,
    target_channel: "push",

    filters: [
      {
        field: "tag",
        key: "language",
        relation: "=",
        value: language
      }
    ],

    headings: {
      en: text.title
    },

    contents: {
      en: text.message(reading)
    },

    url: SITE_URL,

    delayed_option: "timezone",
    delivery_time_of_day: "6:00AM"
  };

  log(`🌍 Sending ${language.toUpperCase()} notification...`, {
    title: text.title,
    message: text.message(reading),
    url: SITE_URL
  });

  const response = await fetch("https://api.onesignal.com/notifications", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Key ${REST_API_KEY}`
    },
    body: JSON.stringify(payload)
  });

  const result = await response.json();

  log(`📨 OneSignal response for ${language}:`, {
    status: response.status,
    result
  });

  return {
    language,
    status: response.status,
    result
  };
}

module.exports = async function handler(req, res) {
  log("🚀 Exodus Church daily notification cron started");

  try {
    if (!APP_ID) {
      log("❌ Missing ONESIGNAL_APP_ID");
      return res.status(500).json({
        ok: false,
        error: "Missing ONESIGNAL_APP_ID"
      });
    }

    if (!REST_API_KEY) {
      log("❌ Missing ONESIGNAL_REST_API_KEY");
      return res.status(500).json({
        ok: false,
        error: "Missing ONESIGNAL_REST_API_KEY"
      });
    }

    log("✅ Environment variables found");

    const { planText, bookLabels } = loadPlan();
    const todayKey = getTodayKey();
    const todayPlan = planText[todayKey] || "";

    log("📌 Today plan:", {
      dateKey: todayKey,
      rawPlan: todayPlan
    });

    const readings = {};

    for (const lang of LANGUAGES) {
      readings[lang] = formatReading(todayPlan, lang, bookLabels);
    }

    log("📚 Formatted readings:", readings);

    const results = await Promise.all(
      LANGUAGES.map(lang => sendNotification(lang, readings[lang]))
    );

    log("✅ All notifications processed", results);

    return res.status(200).json({
      ok: true,
      project: "Exodus Church",
      dateKey: todayKey,
      rawPlan: todayPlan,
      readings,
      results
    });
  } catch (error) {
    log("🔥 Cron failed:", {
      message: error.message,
      stack: error.stack
    });

    return res.status(500).json({
      ok: false,
      error: error.message
    });
  }
};
