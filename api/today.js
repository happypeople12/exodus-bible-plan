const MONTHS = [
  "jan","feb","mar","apr","may","jun",
  "jul","aug","sep","oct","nov","dec"
];

const BIBLE_BASE = "https://bibleplan.ru/bible";

/*
  Проверенные служебные адреса книг непосредственно с bibleplan.ru/bible.
  У каждой главы формируется отдельный адрес:
  https://bibleplan.ru/bible/{bookSlug}/{chapter}
*/
const BOOKS = [
  { names: ["Бытие"], slug: "genesis", chapters: 50 },
  { names: ["Исход"], slug: "exodus", chapters: 40 },
  { names: ["Левит"], slug: "leviticus", chapters: 27 },
  { names: ["Числа"], slug: "numbers", chapters: 36 },
  { names: ["Второзаконие"], slug: "deuteronomy", chapters: 34 },
  { names: ["Иисус Навин", "Иисуса Навина"], slug: "joshua", chapters: 24 },
  { names: ["Судьи"], slug: "judges", chapters: 21 },
  { names: ["Руфь"], slug: "rt", chapters: 4 },

  { names: ["1 Царств"], slug: "1samuel", chapters: 31 },
  { names: ["2 Царств"], slug: "2samuel", chapters: 24 },
  { names: ["3 Царств"], slug: "1kings", chapters: 22 },
  { names: ["4 Царств"], slug: "2kings", chapters: 25 },

  { names: ["1 Паралипоменон"], slug: "1chron", chapters: 29 },
  { names: ["2 Паралипоменон"], slug: "2chron", chapters: 36 },

  { names: ["Ездра"], slug: "ezra", chapters: 10 },
  { names: ["Неемия"], slug: "nehemiah", chapters: 13 },
  { names: ["Есфирь"], slug: "esther", chapters: 10 },
  { names: ["Иов"], slug: "jb", chapters: 42 },
  { names: ["Псалтирь", "Псалом", "Псалмы"], slug: "psalms", chapters: 150 },
  { names: ["Притчи", "Притчи Соломона"], slug: "proverbs", chapters: 31 },
  { names: ["Екклесиаст"], slug: "ecclesia", chapters: 12 },
  { names: ["Песни Песней", "Песня Песней"], slug: "sol", chapters: 8 },

  { names: ["Исаия"], slug: "isaiah", chapters: 66 },
  { names: ["Иеремия"], slug: "jeremiah", chapters: 52 },
  { names: ["Плач Иеремии"], slug: "lamentations", chapters: 5 },
  { names: ["Иезекииль"], slug: "ezekiel", chapters: 48 },
  { names: ["Даниил"], slug: "daniel", chapters: 14 },
  { names: ["Осия"], slug: "hosea", chapters: 14 },
  { names: ["Иоиль"], slug: "joe", chapters: 3 },
  { names: ["Амос"], slug: "amo", chapters: 9 },
  { names: ["Авдий"], slug: "oba", chapters: 1 },
  { names: ["Иона"], slug: "jonah", chapters: 4 },
  { names: ["Михей"], slug: "micah", chapters: 7 },
  { names: ["Наум"], slug: "nahum", chapters: 3 },
  { names: ["Аввакум"], slug: "habakkuk", chapters: 3 },
  { names: ["Софония"], slug: "zephaniah", chapters: 3 },
  { names: ["Аггей"], slug: "haggai", chapters: 2 },
  { names: ["Захария"], slug: "zechariah", chapters: 14 },
  { names: ["Малахия"], slug: "malachi", chapters: 4 },

  { names: ["Матфея"], slug: "matthew", chapters: 28 },
  { names: ["Марка"], slug: "mark", chapters: 16 },
  { names: ["Луки"], slug: "luke", chapters: 24 },
  { names: ["Иоанна"], slug: "john", chapters: 21 },
  { names: ["Деяния", "Деяния Апостолов"], slug: "acts", chapters: 28 },

  { names: ["Иакова"], slug: "james", chapters: 5 },
  { names: ["1 Петра"], slug: "1peter", chapters: 5 },
  { names: ["2 Петра"], slug: "2peter", chapters: 3 },
  { names: ["1 Иоанна"], slug: "1john", chapters: 5 },
  { names: ["2 Иоанна"], slug: "2john", chapters: 1 },
  { names: ["3 Иоанна"], slug: "3john", chapters: 1 },
  { names: ["Иуды"], slug: "jd", chapters: 1 },

  { names: ["Римлянам"], slug: "romans", chapters: 16 },
  { names: ["1 Коринфянам"], slug: "1corinthians", chapters: 16 },
  { names: ["2 Коринфянам"], slug: "2corinthians", chapters: 13 },
  { names: ["Галатам"], slug: "galatians", chapters: 6 },
  { names: ["Ефесянам"], slug: "ephesians", chapters: 6 },
  { names: ["Филиппийцам"], slug: "philippians", chapters: 4 },
  { names: ["Колоссянам"], slug: "colossians", chapters: 4 },
  { names: ["1 Фессалоникийцам"], slug: "1thessalonians", chapters: 5 },
  { names: ["2 Фессалоникийцам"], slug: "2thessalonians", chapters: 3 },
  { names: ["1 Тимофею"], slug: "1timothy", chapters: 6 },
  { names: ["2 Тимофею"], slug: "2timothy", chapters: 4 },
  { names: ["Титу"], slug: "titus", chapters: 3 },
  { names: ["Филимону"], slug: "philemon", chapters: 1 },
  { names: ["Евреям"], slug: "hebrews", chapters: 13 },
  { names: ["Откровение"], slug: "revelation", chapters: 22 }
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

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function chapterLink(title) {
  const normalized = String(title || "").replace(/\s+/g, " ").trim();

  for (const book of BOOKS) {
    for (const name of book.names) {
      const match = normalized.match(
        new RegExp(`^${escapeRegex(name)}\\s+(\\d+)$`, "i")
      );

      if (!match) continue;

      const chapter = Number(match[1]);

      if (!Number.isInteger(chapter) || chapter < 1 || chapter > book.chapters) {
        return null;
      }

      return {
        title: normalized,
        slug: book.slug,
        chapter,
        url: `${BIBLE_BASE}/${book.slug}/${chapter}`
      };
    }
  }

  return null;
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
        "User-Agent": "Mozilla/5.0 ExodusChurchBiblePlan/4.0",
        "Accept": "text/html,application/xhtml+xml"
      }
    });

    if (!response.ok) {
      return res.status(502).json({
        ok: false,
        error: `bibleplan.ru вернул ${response.status}`,
        officialUrl
      });
    }

    const html = await response.text();
    const readings = [];
    const unmapped = [];
    const seen = new Set();

    for (const match of html.matchAll(/<h3\b[^>]*>([\s\S]*?)<\/h3>/gi)) {
      const heading = stripHtml(match[1]);

      if (!heading) continue;
      if (/план победы|все планы|обратная связь/i.test(heading)) continue;
      if (!/\d/.test(heading)) continue;
      if (seen.has(heading)) continue;

      seen.add(heading);

      const reading = chapterLink(heading);

      if (reading) {
        readings.push(reading);
      } else {
        unmapped.push(heading);
      }
    }

    res.setHeader("Cache-Control", "s-maxage=1800, stale-while-revalidate=86400");

    return res.status(200).json({
      ok: true,
      officialUrl,
      readings,
      unmapped,
      found: readings.length
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: error.message || "Ошибка сервера"
    });
  }
};

/* Экспорт только для автоматических тестов. */
module.exports.BOOKS = BOOKS;
module.exports.chapterLink = chapterLink;
