"use client";

import { useEffect, useMemo, useState } from "react";
import { planText } from "../src/data/plan";

const BIBLE_BASE_URL = "https://www.bible.ru/bible/rst78";

const BOOKS = [
  ["Бытие","gen",["Быт","Быт.","Бытие"]],
  ["Исход","exo",["Исх","Исх.","Исход"]],
  ["Левит","lev",["Лев","Лев.","Левит"]],
  ["Числа","num",["Чис","Чис.","Числа"]],
  ["Второзаконие","deu",["Втор","Втор.","Второзаконие"]],
  ["Иисус Навин","jos",["Нав","Нав.","Иисус Навин"]],
  ["Судьи","jdg",["Суд","Суд.","Судьи"]],
  ["Руфь","rut",["Руф","Руф.","Руфь"]],
  ["1 Царств","1sa",["1 Цар","1Цар","1 Цар.","1 Царств"]],
  ["2 Царств","2sa",["2 Цар","2Цар","2 Цар.","2 Царств"]],
  ["3 Царств","1ki",["3 Цар","3Цар","3 Цар.","3 Царств"]],
  ["4 Царств","2ki",["4 Цар","4Цар","4 Цар.","4 Царств"]],
  ["1 Паралипоменон","1ch",["1 Пар","1Пар","1 Пар.","1 Паралипоменон"]],
  ["2 Паралипоменон","2ch",["2 Пар","2Пар","2 Пар.","2 Паралипоменон"]],
  ["Ездра","ezr",["Езд","Езд.","Ездра"]],
  ["Неемия","neh",["Неем","Неем.","Неемия"]],
  ["Есфирь","est",["Есф","Есф.","Есфирь"]],
  ["Иов","job",["Иов","Иов."]],
  ["Псалтирь","psa",["Пс","Пс.","Псалом","Псалмы","Псалтирь"]],
  ["Притчи","pro",["Притч","Притч.","Прит","Прит.","Притчи"]],
  ["Екклесиаст","ecc",["Еккл","Еккл.","Екклесиаст"]],
  ["Песня Песней","sng",["Песн","Песн.","Песня Песней"]],
  ["Исаия","isa",["Ис","Ис.","Исаия"]],
  ["Иеремия","jer",["Иер","Иер.","Иеремия"]],
  ["Плач Иеремии","lam",["Плач","Плач.","Плач Иеремии"]],
  ["Иезекииль","eze",["Иез","Иез.","Иезекииль"]],
  ["Даниил","dan",["Дан","Дан.","Даниил"]],
  ["Осия","hos",["Ос","Ос.","Осия"]],
  ["Иоиль","joe",["Иоил","Иоил.","Иоиль"]],
  ["Амос","amo",["Ам","Ам.","Амос"]],
  ["Авдий","oba",["Авд","Авд.","Авдий"]],
  ["Иона","jon",["Иона","Иона."]],
  ["Михей","mic",["Мих","Мих.","Михей"]],
  ["Наум","nah",["Наум","Наум."]],
  ["Аввакум","hab",["Авв","Авв.","Аввакум"]],
  ["Софония","zep",["Соф","Соф.","Софония"]],
  ["Аггей","hag",["Агг","Агг.","Аггей"]],
  ["Захария","zec",["Зах","Зах.","Захария"]],
  ["Малахия","mal",["Мал","Мал.","Малахия"]],
  ["Матфея","mat",["Мф","Мф.","Матфея"]],
  ["Марка","mrk",["Мк","Мк.","Марка"]],
  ["Луки","luk",["Лк","Лк.","Луки"]],
  ["Иоанна","jhn",["Ин","Ин.","Иоанна"]],
  ["Деяния","act",["Деян","Деян.","Деяния"]],
  ["Римлянам","rom",["Рим","Рим.","Римлянам"]],
  ["1 Коринфянам","1co",["1 Кор","1Кор","1 Кор.","1 Коринфянам"]],
  ["2 Коринфянам","2co",["2 Кор","2Кор","2 Кор.","2 Коринфянам"]],
  ["Галатам","gal",["Гал","Гал.","Галатам"]],
  ["Ефесянам","eph",["Еф","Еф.","Ефесянам"]],
  ["Филиппийцам","php",["Флп","Флп.","Филиппийцам"]],
  ["Колоссянам","col",["Кол","Кол.","Колоссянам"]],
  ["1 Фессалоникийцам","1th",["1 Фес","1Фес","1 Фес."]],
  ["2 Фессалоникийцам","2th",["2 Фес","2Фес","2 Фес."]],
  ["1 Тимофею","1ti",["1 Тим","1Тим","1 Тим."]],
  ["2 Тимофею","2ti",["2 Тим","2Тим","2 Тим."]],
  ["Титу","tit",["Тит","Тит."]],
  ["Филимону","phm",["Флм","Флм."]],
  ["Евреям","heb",["Евр","Евр."]],
  ["Иакова","jas",["Иак","Иак."]],
  ["1 Петра","1pe",["1 Пет","1Пет","1 Пет."]],
  ["2 Петра","2pe",["2 Пет","2Пет","2 Пет."]],
  ["1 Иоанна","1jn",["1 Ин","1Ин","1 Ин."]],
  ["2 Иоанна","2jn",["2 Ин","2Ин","2 Ин."]],
  ["3 Иоанна","3jn",["3 Ин","3Ин","3 Ин."]],
  ["Иуды","jud",["Иуд","Иуд."]],
  ["Откровение","rev",["Откр","Откр.","Откровение"]]
].map(([title, slug, aliases]) => ({ title, slug, aliases }));

const aliases = BOOKS.flatMap((book) =>
  book.aliases.map((alias) => ({
    alias,
    normalized: normalize(alias),
    book
  }))
).sort((a, b) => b.normalized.length - a.normalized.length);

function normalize(value) {
  return String(value || "")
    .replace(/[–—−]/g, "-")
    .replace(/\u00a0/g, " ")
    .replace(/\./g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function expandChapters(value) {
  const source = String(value || "").replace(/[–—−]/g, "-");
  const found = [];
  const rangeRegex = /(\d+)\s*-\s*(\d+)/g;
  let match;

  while ((match = rangeRegex.exec(source)) !== null) {
    const start = Number(match[1]);
    const end = Number(match[2]);
    if (start > 0 && end >= start && end - start <= 150) {
      for (let chapter = start; chapter <= end; chapter += 1) found.push(chapter);
    }
  }

  const rest = source.replace(/(\d+)\s*-\s*(\d+)/g, " ");
  for (const item of rest.matchAll(/\b(\d+)(?::\d+(?:-\d+)?)?\b/g)) {
    const chapter = Number(item[1]);
    if (chapter > 0) found.push(chapter);
  }

  return [...new Set(found)];
}

function parseReadings(text) {
  if (!text) return [];

  const segments = String(text)
    .replace(/[;|]/g, ",")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  const result = [];
  let currentBook = null;

  for (const segment of segments) {
    const normalizedSegment = normalize(segment);
    const matched = aliases.find(
      (entry) =>
        normalizedSegment === entry.normalized ||
        normalizedSegment.startsWith(entry.normalized + " ")
    );

    let chapterText = segment;

    if (matched) {
      currentBook = matched.book;
      const wordsToRemove = matched.alias.trim().split(/\s+/).length;
      chapterText = segment.trim().split(/\s+/).slice(wordsToRemove).join(" ");
    }

    if (!currentBook) continue;

    for (const chapter of expandChapters(chapterText)) {
      result.push({ ...currentBook, chapter });
    }
  }

  const unique = new Map();
  for (const item of result) unique.set(`${item.slug}-${item.chapter}`, item);
  return [...unique.values()];
}

function dateKey(date) {
  return `${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;
}

function dayOfYear(date) {
  return Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000);
}

function bibleUrl(slug, chapter) {
  return `${BIBLE_BASE_URL}/${slug}-${chapter}/`;
}

export default function Home() {
  const [today, setToday] = useState(() => new Date());
  const [note, setNote] = useState("");
  const [read, setRead] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const key = dateKey(today);
  const day = dayOfYear(today);
  const plan = planText[key] || "";
  const readings = useMemo(() => parseReadings(plan), [plan]);

  useEffect(() => {
    setNote(localStorage.getItem(`note-${key}`) || "");
    setRead(Boolean(localStorage.getItem(`read-${key}`)));

    window.OneSignalDeferred = window.OneSignalDeferred || [];
    window.OneSignalDeferred.push(async function (OneSignal) {
      try {
        await OneSignal.init({
          appId: "920a332c-006b-4d18-a33b-86cac4b2d273",
          serviceWorkerPath: "/OneSignalSDKWorker.js"
        });
        await OneSignal.User.addTag("language", "ru");
        await OneSignal.User.addTag(
          "timezone",
          Intl.DateTimeFormat().resolvedOptions().timeZone || "America/New_York"
        );
        await OneSignal.User.addTag("plan", "victory");
      } catch (error) {
        console.error("OneSignal:", error);
      }
    });

    const timer = setInterval(() => setToday(new Date()), 60000);
    return () => clearInterval(timer);
  }, [key]);

  const readCount = useMemo(() => {
    if (typeof window === "undefined") return 0;
    let count = 0;
    for (let i = 1; i <= 365; i += 1) {
      const date = new Date(today.getFullYear(), 0, i);
      if (localStorage.getItem(`read-${dateKey(date)}`)) count += 1;
    }
    return count;
  }, [read, today]);

  function markRead() {
    localStorage.setItem(`read-${key}`, "yes");
    setRead(true);
  }

  function saveNote() {
    localStorage.setItem(`note-${key}`, note);
    alert("Заметка сохранена");
  }

  return (
    <main>
      <header className="header">
        <img src="/logo.jpeg" alt="Exodus Church" className="logo" />
        <div>
          <div className="eyebrow">EXODUS CHURCH</div>
          <h1>План Победы</h1>
          <p>Ежедневное чтение Библии</p>
        </div>
      </header>

      <section className="heroCard">
        <div>
          <span className="date">
            Сегодня: {today.toLocaleDateString("ru-RU", {
              day: "numeric",
              month: "long",
              year: "numeric"
            })}
          </span>
          <h2>День {day} из 365</h2>
          <p>{plan || "План на сегодня ещё не добавлен"}</p>
        </div>
        <div className="dayBadge">{day}</div>
      </section>

      <section className="grid">
        <article className="card readingCard">
          <div className="sectionTitle">
            <span>Чтение на сегодня</span>
            <span className="goldDot" />
          </div>

          <div className="readings">
            {readings.length ? (
              readings.map((item) => (
                <a
                  key={`${item.slug}-${item.chapter}`}
                  href={bibleUrl(item.slug, item.chapter)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="chapterLink"
                >
                  <span>📖 {item.title} {item.chapter}</span>
                  <span>→</span>
                </a>
              ))
            ) : (
              <div className="empty">Не удалось распознать сегодняшнее чтение.</div>
            )}
          </div>

          <button className={read ? "primary done" : "primary"} onClick={markRead}>
            {read ? "Прочитано ✓" : "Я прочитал сегодня"}
          </button>
        </article>

        <article className="card quoteCard">
          <div className="quoteMark">“</div>
          <blockquote>
            Не хвались завтрашним днем, потому что не знаешь, что родит тот день.
          </blockquote>
          <strong>Притчи 27:1</strong>
        </article>
      </section>

      <section className="card notesCard">
        <div className="sectionTitle">Мои заметки</div>
        <textarea
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="Что Бог сказал мне сегодня?"
          maxLength={1500}
        />
        <div className="noteFooter">
          <small>Заметка сохраняется только на этом устройстве.</small>
          <button className="secondary" onClick={saveNote}>Сохранить заметку</button>
        </div>
      </section>

      <section className="card progressCard">
        <div className="progressTop">
          <div>
            <div className="sectionTitle">Мой прогресс</div>
            <p>{readCount} из 365 дней прочитано</p>
          </div>
          <button className="secondary" onClick={() => setCalendarOpen(!calendarOpen)}>
            {calendarOpen ? "Скрыть календарь" : "Показать календарь"}
          </button>
        </div>
        <div className="progressTrack">
          <div style={{ width: `${Math.round((readCount / 365) * 100)}%` }} />
        </div>

        {calendarOpen && (
          <div className="calendar">
            {Array.from({ length: 365 }, (_, index) => {
              const date = new Date(today.getFullYear(), 0, index + 1);
              const completed =
                typeof window !== "undefined" &&
                Boolean(localStorage.getItem(`read-${dateKey(date)}`));
              return (
                <span key={index} className={completed ? "calendarDay completed" : "calendarDay"}>
                  {index + 1}
                </span>
              );
            })}
          </div>
        )}
      </section>

      <footer>Exodus Church · План Победы</footer>
    </main>
  );
}
