const MONTHS = [
  "jan","feb","mar","apr","may","jun",
  "jul","aug","sep","oct","nov","dec"
];

function decode(value) {
  return String(value || "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&#160;/g, " ")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&quot;/gi, '"')
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}

function stripHtml(value) {
  return decode(
    String(value || "")
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  );
}

module.exports = async function handler(req, res) {
  try {
    const month = Number(req.query.month);
    const day = Number(req.query.day);

    if (
      !Number.isInteger(month) || month < 1 || month > 12 ||
      !Number.isInteger(day) || day < 1 || day > 31
    ) {
      return res.status(400).json({ ok: false, error: "Некорректная дата" });
    }

    const officialUrl = `https://bibleplan.ru/${MONTHS[month - 1]}-${day}`;

    const response = await fetch(officialUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 ExodusChurchBiblePlan/2.0",
        "Accept": "text/html,application/xhtml+xml"
      }
    });

    if (!response.ok) {
      return res.status(502).json({
        ok: false,
        error: `Официальный сайт вернул ${response.status}`,
        officialUrl
      });
    }

    const html = await response.text();
    const readings = [];
    const seen = new Set();

    // Daily pages expose each Bible chapter as an H3 heading.
    for (const match of html.matchAll(/<h3\b[^>]*>([\s\S]*?)<\/h3>/gi)) {
      const title = stripHtml(match[1]);

      if (!title) continue;
      if (/план победы|все планы|обратная связь/i.test(title)) continue;
      if (!/\d/.test(title)) continue;
      if (seen.has(title)) continue;

      seen.add(title);
      readings.push({ title, url: officialUrl });
    }

    // Fallback: the official page itself always remains clickable.
    res.setHeader("Cache-Control", "s-maxage=1800, stale-while-revalidate=86400");
    return res.status(200).json({
      ok: true,
      officialUrl,
      readings,
      found: readings.length
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: error.message || "Ошибка сервера"
    });
  }
};
