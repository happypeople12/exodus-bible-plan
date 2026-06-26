const fs = require("fs");
const path = require("path");
const vm = require("vm");

const APP_ID = "920a332c-006b-4d18-a33b-86cac4b2d273";
const SITE_URL = "https://exodus-bible-plan.vercel.app";

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
    .map(item => {
      const parts = item.split(" ");
      const book = parts.slice(0, -1).join(" ");
      const chapter = parts[parts.length - 1];
      const label = bookLabels?.[lang]?.[book] || book;
      return `${label} ${chapter}`;
    })
    .join(" • ");
}

const texts = {
  ru: {
    title: "📖 План Победы",
    message: reading =>
      `Доброе утро! Сегодня в плане: ${reading}. Открой приложение и начни чтение.`
  },
  uk: {
    title: "📖 План Перемоги",
    message: reading =>
      `Доброго ранку! Сьогодні в плані: ${reading}. Відкрий застосунок і почни читання.`
  },
  en: {
    title: "📖 Victory Plan",
    message: reading =>
      `Good morning! Today’s reading: ${reading}. Open the app and begin reading.`
  }
};

async function sendNotification(language, reading) {
  const t = texts[language];

  const response = await fetch("https://api.onesignal.com/notifications", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Key ${process.env.ONESIGNAL_REST_API_KEY}`
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
      delivery_time_of_day: "6:00AM",
      throttle_rate_per_minute: 0
    })
  });

  return response.json();
}

module.exports = async function handler(req, res) {
  try {
    if (!process.env.ONESIGNAL_REST_API_KEY) {
      return res.status(500).json({ error: "Missing ONESIGNAL_REST_API_KEY" });
    }

    const { planText, bookLabels } = loadPlan();
    const todayKey = getTodayKey();
    const todayPlan = planText[todayKey];

    const results = await Promise.all([
      sendNotification("ru", formatReading(todayPlan, "ru", bookLabels)),
      sendNotification("uk", formatReading(todayPlan, "uk", bookLabels)),
      sendNotification("en", formatReading(todayPlan, "en", bookLabels))
    ]);

    return res.status(200).json({
      ok: true,
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
