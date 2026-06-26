const APP_ID = "920a332c-006b-4d18-a33b-86cac4b2d273";
const SITE_URL = "https://exodus-bible-plan.vercel.app";

const messages = {
  ru: {
    title: "📖 План Победы",
    text: "Доброе утро! Сегодня Бог приготовил для тебя Слово. Открой приложение и начни чтение."
  },
  uk: {
    title: "📖 План Перемоги",
    text: "Доброго ранку! Сьогодні Бог приготував для тебе Слово. Відкрий застосунок і почни читання."
  },
  en: {
    title: "📖 Victory Plan",
    text: "Good morning! God has a message for you today. Open the app and begin today’s reading."
  }
};

async function sendForLanguage(language) {
  const msg = messages[language];

  const response = await fetch("https://api.onesignal.com/notifications", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Key ${process.env.ONESIGNAL_REST_API_KEY}`
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
      headings: { en: msg.title },
      contents: { en: msg.text },
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
      return res.status(500).json({
        error: "ONESIGNAL_REST_API_KEY is missing"
      });
    }

    const results = await Promise.all([
      sendForLanguage("ru"),
      sendForLanguage("uk"),
      sendForLanguage("en")
    ]);

    return res.status(200).json({
      ok: true,
      results
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: error.message
    });
  }
};
