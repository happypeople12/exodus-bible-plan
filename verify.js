const api = require("./api/today.js");

const failures = [];

for (const book of api.BOOKS) {
  for (const name of book.names) {
    const first = api.chapterLink(`${name} 1`);
    const last = api.chapterLink(`${name} ${book.chapters}`);
    const tooHigh = api.chapterLink(`${name} ${book.chapters + 1}`);

    if (!first || first.url !== `https://bibleplan.ru/bible/${book.slug}/1`) {
      failures.push(`Ошибка первой главы: ${name}`);
    }

    if (!last || last.url !== `https://bibleplan.ru/bible/${book.slug}/${book.chapters}`) {
      failures.push(`Ошибка последней главы: ${name}`);
    }

    if (tooHigh !== null) {
      failures.push(`Не отклонена несуществующая глава: ${name}`);
    }
  }
}

const currentDayCases = [
  ["Псалом 10", "https://bibleplan.ru/bible/psalms/10"],
  ["Матфея 10", "https://bibleplan.ru/bible/matthew/10"],
  ["2 Паралипоменон 22", "https://bibleplan.ru/bible/2chron/22"]
];

for (const [title, expected] of currentDayCases) {
  const actual = api.chapterLink(title)?.url;
  if (actual !== expected) {
    failures.push(`${title}: ожидалось ${expected}, получено ${actual}`);
  }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`Проверено книг: ${api.BOOKS.length}`);
console.log("Проверены первая и последняя главы каждой книги.");
console.log("Проверен сегодняшний пример: Псалом 10, Матфея 10, 2 Паралипоменон 22.");
console.log("Все локальные тесты пройдены.");
