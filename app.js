const biblePlanSlugs = {
  "Быт":"gen","Бытие":"gen",
  "Исх":"exod","Исход":"exod",
  "Лев":"lev","Левит":"lev",
  "Чис":"num","Числа":"num",
  "Втор":"deut","Второзаконие":"deut",
  "Нав":"josh","Иисус Навин":"josh",
  "Суд":"judg","Судьи":"judg",
  "Руф":"ruth","Руфь":"ruth",

  "1 Цар":"1sam","1 Царств":"1sam",
  "2 Цар":"2sam","2 Царств":"2sam",
  "3 Цар":"1kings","3 Царств":"1kings",
  "4 Цар":"2kings","4 Царств":"2kings",

  "1 Пар":"1chron","1 Паралипоменон":"1chron",
  "2 Пар":"2chron","2 Паралипоменон":"2chron",

  "Езд":"ezra","Ездра":"ezra",
  "Неем":"neh","Неемия":"neh",
  "Есф":"esth","Есфирь":"esth",
  "Иов":"job",

  "Пс":"ps","Псалтирь":"ps","Псалом":"ps",
  "Притч":"proverbs","Притчи":"proverbs","Притчи Соломона":"proverbs",

  "Ис":"isa","Иер":"jer","Плач":"lam","Иез":"ezek","Дан":"dan",
  "Ос":"hos","Иоил":"joel","Ам":"amos","Авд":"obad","Иона":"jonah",
  "Мих":"mic","Наум":"nah","Авв":"hab","Соф":"zeph","Агг":"hag","Зах":"zech","Мал":"mal",

  "Мф":"matthew","Мк":"mark","Лк":"luke","Ин":"john","Деян":"acts",
  "Рим":"romans","1 Кор":"1corinthians","2 Кор":"2corinthians",
  "Гал":"galatians","Еф":"ephesians","Флп":"philippians","Кол":"colossians",
  "1 Фес":"1thessalonians","2 Фес":"2thessalonians",
  "1 Тим":"1timothy","2 Тим":"2timothy",
  "Тит":"titus","Флм":"philemon","Евр":"hebrews","Иак":"james",
  "1 Пет":"1peter","2 Пет":"2peter",
  "1 Ин":"1john","2 Ин":"2john","3 Ин":"3john",
  "Иуд":"jude","Откр":"revelation"
};

let now, key, dayOfYear;

function updateTodayData(){
  now = new Date();

  key =
    String(now.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(now.getDate()).padStart(2, "0");

  dayOfYear = Math.floor(
    (now - new Date(now.getFullYear(), 0, 0)) / 86400000
  );
}

async function updateOneSignalTags(){
  if(typeof OneSignalDeferred === "undefined") return;

  OneSignalDeferred.push(async function(OneSignal){
    const timezone =
      Intl.DateTimeFormat().resolvedOptions().timeZone || "America/New_York";

    await OneSignal.User.addTag("language", "ru");
    await OneSignal.User.addTag("timezone", timezone);
    await OneSignal.User.addTag("plan", "victory");
  });
}

function parseReadings(text){
  if(!text) return [];

  const allBooks = Object.keys(biblePlanSlugs).sort((a,b)=>b.length-a.length);
  const out = [];
  let currentBook = null;

  const parts = text
    .replace(/;/g,",")
    .split(",")
    .map(x=>x.trim())
    .filter(Boolean);

  for(const part of parts){
    let foundBook = null;
    let rest = "";

    for(const book of allBooks){
      if(part === book || part.startsWith(book + " ")){
        foundBook = book;
        rest = part.slice(book.length).trim();
        break;
      }
    }

    if(foundBook){
      currentBook = foundBook;
      const chapters = rest.match(/\d+/g) || [];
      chapters.forEach(ch=>{
        out.push({book: currentBook, chapter: ch});
      });
    } else if(currentBook){
      const chapters = part.match(/\d+/g) || [];
      chapters.forEach(ch=>{
        out.push({book: currentBook, chapter: ch});
      });
    }
  }

  return out;
}

function bibleUrl(book, chapter){
  const slug = biblePlanSlugs[book];

  if(!slug){
    return "https://bibleplan.ru/bible";
  }

  return `https://bibleplan.ru/bible/${slug}/${chapter}`;
}

function refreshApp(){
  updateTodayData();
  renderTodayInfo();
  renderReading();
  renderProgress();
  loadTodayNote();
}

function renderTodayInfo(){
  todayDate.innerText = "Сегодня: " + now.toLocaleDateString("ru-RU", {
    day:"numeric",
    month:"long",
    year:"numeric"
  });

  dayNumber.innerText = `День ${dayOfYear} из 365`;

  if(localStorage.getItem("read-" + key)){
    readBtn.innerText = "Прочитано ✅";
    readBtn.classList.add("done");
  } else {
    readBtn.innerText = "✓ Я прочитал";
    readBtn.classList.remove("done");
  }
}

function renderReading(){
  const text = planText[key];

  if(!text){
    reading.innerHTML =
      `<div class="chapter-btn">Этот день ещё нужно добавить в план.</div>`;
    return;
  }

  const items = parseReadings(text);

  if(!items.length){
    reading.innerHTML = `<div class="chapter-btn">${text}</div>`;
    return;
  }

  reading.innerHTML = items.map(r=>{
    const title = (bookLabels?.ru?.[r.book] || r.book) + " " + r.chapter;

    return `
      <a class="chapter-btn" target="_blank" href="${bibleUrl(r.book,r.chapter)}">
        📖 ${title} ›
      </a>
    `;
  }).join("");
}

readBtn.onclick = function(){
  updateTodayData();
  localStorage.setItem("read-" + key, "yes");
  refreshApp();
  winnerModal.style.display = "flex";
};

function closeWinner(){
  winnerModal.style.display = "none";
}

function loadTodayNote(){
  note.value = localStorage.getItem("note-" + key) || "";
}

function saveNote(){
  updateTodayData();
  localStorage.setItem("note-" + key, note.value);
  alert("Заметка сохранена");
}

function renderProgress(){
  let read = 0;
  let missed = 0;
  calendar.innerHTML = "";

  for(let i = 1; i <= 365; i++){
    const date = new Date(now.getFullYear(), 0, i);

    const k =
      String(date.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(date.getDate()).padStart(2, "0");

    const div = document.createElement("div");
    div.className = "day";
    div.innerText = i;

    if(localStorage.getItem("read-" + k)){
      div.classList.add("read");
      read++;
    } else if(i < dayOfYear){
      div.classList.add("missed");
      missed++;
    }

    calendar.appendChild(div);
  }

  const percent = Math.round((read / 365) * 100);

  readCount.innerText = read;
  missedCount.innerText = missed;
  percentText.innerText = percent + "%";
  circleText.innerText = read + " из 365 дней";

  const circle = document.querySelector(".percent-circle");

  if(circle){
    circle.style.background =
      `conic-gradient(#d18a00 ${percent * 3.6}deg, #ece8e2 0deg)`;
  }
}

function toggleCalendar(){
  calendar.classList.toggle("hidden");
}

function scrollToToday(){
  todaySection.scrollIntoView({behavior:"smooth"});
}

function scrollToNotes(){
  notesSection.scrollIntoView({behavior:"smooth"});
}

function scrollToProgress(){
  progressSection.scrollIntoView({behavior:"smooth"});
  calendar.classList.remove("hidden");
}

window.addEventListener("pageshow", refreshApp);

document.addEventListener("visibilitychange", ()=>{
  if(!document.hidden) refreshApp();
});

setInterval(refreshApp, 60000);

refreshApp();
updateOneSignalTags();
