const fs = require("fs");
const path = require("path");
const vm = require("vm");

const APP_ID = process.env.ONESIGNAL_APP_ID;
const REST_API_KEY = process.env.ONESIGNAL_REST_API_KEY;
const SITE_URL = process.env.PLAN_URL || "https://exodus-bible-plan.vercel.app";

function loadPlan() {
  const code = fs.readFileSync(path.join(process.cwd(), "plan.js"), "utf8");
  const sandbox = {};
  vm.runInNewContext(`${code}\nresult={planText,bookLabels,bookOrder};`, sandbox);
  return sandbox.result;
}

function getTodayKey() {
  const now = new Date();
  return (
    String(now.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(now.getDate()).padStart(2, "0")
  );
}

function formatReading(text, lang, bookLabels) {
  if (!text) return "";

  return text
    .split(",")
    .map(x => x.trim())
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
  const t = notificationText[language];

  const response = await fetch("https://api.onesignal.com/notifications", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Key ${REST_API_KEY}`
    },
    body: JSON.stringify({
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
      headings: { en: t.title },
      contents: { en: t.message(reading) },
      url: SITE_URL,
      delayed_option: "timezone",
      delivery_time_of_day: "6:00AM"
    })
  });

  const data = await response.json();

  return {
    language,
    status: response.status,
    result: data
  };
}

module.exports = async function handler(req, res) {
  try {
    if (!APP_ID) {
      return res.status(500).json({ ok: false, error: "Missing ONESIGNAL_APP_ID" });
    }

    if (!REST_API_KEY) {
      return res.status(500).json({ ok: false, error: "Missing ONESIGNAL_REST_API_KEY" });
    }

    const { planText, bookLabels } = loadPlan();
    const todayKey = getTodayKey();
    const todayPlan = planText[todayKey] || "";

    const results = await Promise.all([
      sendNotification("ru", formatReading(todayPlan, "ru", bookLabels)),
      sendNotification("uk", formatReading(todayPlan, "uk", bookLabels)),
      sendNotification("en", formatReading(todayPlan, "en", bookLabels))
    ]);

    return res.status(200).json({
      ok: true,
      project: "Exodus Church",
      day: todayKey,
      plan: todayPlan,
      results
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: error.message
    });
  }
};
