const ui = {
  ru:{hero:"Ежедневное чтение Библии",plan:"План победы",full:"☰ Весь план ›",language:"Языки пользования",todayReading:"Чтение на сегодня",read:"✓ Я прочитал",readDone:"Прочитано ✅",notes:"▣ Мои заметки",placeholder:"Что Бог сказал мне сегодня?",save:"▣ Сохранить заметку",saved:"Заметка сохранена",noteInfo:"Ваши заметки сохраняются только на этом устройстве.",progress:"▣ Календарь прогресса",readCount:"Прочитано",missed:"Пропущено",total:"Всего",calendar:"▣ Показать календарь",navToday:"⌂ Сегодня",navCalendar:"▣ Календарь прогресса",navNotes:"▣ Заметки",day:"День",of:"из",todayLabel:"Сегодня:",missing:"Этот день ещё нужно добавить в план.",winner:"Ты победитель!",winnerText:"Сегодня ты сделал важный духовный шаг.",amen:"Аминь",quote:"Не хвались завтрашним днем, потому что не знаешь, что родит тот день.",quoteRef:"Притчи 27:1"},
  uk:{hero:"Щоденне читання Біблії",plan:"План перемоги",full:"☰ Весь план ›",language:"Мови користування",todayReading:"Читання на сьогодні",read:"✓ Я прочитав",readDone:"Прочитано ✅",notes:"▣ Мої нотатки",placeholder:"Що Бог сказав мені сьогодні?",save:"▣ Зберегти нотатку",saved:"Нотатку збережено",noteInfo:"Ваші нотатки зберігаються тільки на цьому пристрої.",progress:"▣ Календар прогресу",readCount:"Прочитано",missed:"Пропущено",total:"Усього",calendar:"▣ Показати календар",navToday:"⌂ Сьогодні",navCalendar:"▣ Календар прогресу",navNotes:"▣ Нотатки",day:"День",of:"з",todayLabel:"Сьогодні:",missing:"Цей день ще потрібно додати в план.",winner:"Ти переможець!",winnerText:"Сьогодні ти зробив важливий духовний крок.",amen:"Амінь",quote:"Не хвалися завтрашнім днем, бо не знаєш, що той день принесе.",quoteRef:"Приповісті 27:1"},
  en:{hero:"Daily Bible Reading",plan:"Victory Plan",full:"☰ Full plan ›",language:"User languages",todayReading:"Today’s reading",read:"✓ I read today",readDone:"Read ✅",notes:"▣ My notes",placeholder:"What did God speak to me today?",save:"▣ Save note",saved:"Note saved",noteInfo:"Your notes are saved only on this device.",progress:"▣ Progress calendar",readCount:"Read",missed:"Missed",total:"Total",calendar:"▣ Show calendar",navToday:"⌂ Today",navCalendar:"▣ Progress calendar",navNotes:"▣ Notes",day:"Day",of:"of",todayLabel:"Today:",missing:"This day still needs to be added to the plan.",winner:"You are a winner!",winnerText:"Today you made an important spiritual step.",amen:"Amen",quote:"Do not boast about tomorrow, for you do not know what a day may bring.",quoteRef:"Proverbs 27:1"}
};

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
  "3 Цар":"1kgs","3 Царств":"1kgs",
  "4 Цар":"2kgs","4 Царств":"2kgs",

  "1 Пар":"1chron","1 Паралипоменон":"1chron",
  "2 Пар":"2chron","2 Паралипоменон":"2chron",

  "Езд":"ezra","Ездра":"ezra",
  "Неем":"neh","Неемия":"neh",
  "Есф":"esth","Есфирь":"esth",
  "Иов":"job",

  "Пс":"ps","Псалтирь":"ps","Псалом":"ps",
  "Притч":"proverbs","Притчи":"proverbs","Притчи Соломона":"proverbs",

  "Еккл":"eccl","Екклесиаст":"eccl",
  "Песн":"song","Песня Песней":"song",

  "Ис":"isa","Исаия":"isa",
  "Иер":"jer","Иеремия":"jer",
  "Плач":"lam","Плач Иеремии":"lam",
  "Иез":"ezek","Иезекииль":"ezek",
  "Дан":"dan","Даниил":"dan",

  "Ос":"hos","Осия":"hos",
  "Иоил":"joel",
  "Ам":"amos","Амос":"amos",
  "Авд":"obad","Авдий":"obad",
  "Иона":"jonah",
  "Мих":"mic","Михей":"mic",
  "Наум":"nah",
  "Авв":"hab","Аввакум":"hab",
  "Соф":"zeph","Софония":"zeph",
  "Агг":"hag","Аггей":"hag",
  "Зах":"zech","Захария":"zech",
  "Мал":"mal","Малахия":"mal",

  "Мф":"matthew","Матфея":"matthew",
  "Мк":"mark","Марка":"mark",
  "Лк":"luke","Луки":"luke",
  "Ин":"john","Иоанна":"john",
  "Деян":"acts","Деяния":"acts","Деяния Апостолов":"acts",

  "Рим":"romans","Римлянам":"romans",
  "1 Кор":"1corinthians","1 Коринфянам":"1corinthians",
  "2 Кор":"2corinthians","2 Коринфянам":"2corinthians",
  "Гал":"galatians","Галатам":"galatians",
  "Еф":"ephesians","Ефесянам":"ephesians",
  "Флп":"philippians","Филиппийцам":"philippians",
  "Кол":"colossians","Колоссянам":"colossians",

  "1 Фес":"1thessalonians","1 Фессалоникийцам":"1thessalonians",
  "2 Фес":"2thessalonians","2 Фессалоникийцам":"2thessalonians",
  "1 Тим":"1timothy","1 Тимофею":"1timothy",
  "2 Тим":"2timothy","2 Тимофею":"2timothy",

  "Тит":"titus","Титу":"titus",
  "Флм":"philemon","Филимону":"philemon",
  "Евр":"hebrews","Евреям":"hebrews",
  "Иак":"james","Иакова":"james",

  "1 Пет":"1peter","1 Петра":"1peter",
  "2 Пет":"2peter","2 Петра":"2peter",
  "1 Ин":"1john","1 Иоанна":"1john",
  "2 Ин":"2john","2 Иоанна":"2john",
  "3 Ин":"3john","3 Иоанна":"3john",

  "Иуд":"jude","Иуды":"jude",
  "Откр":"revelation","Откровение":"revelation"
};

let lang = localStorage.getItem("lang") || "ru";
let now, key, dayOfYear;

function updateTodayData(){
  now = new Date();
  key = String(now.getMonth()+1).padStart(2,"0")+"-"+String(now.getDate()).padStart(2,"0");
  dayOfYear = Math.floor((now - new Date(now.getFullYear(),0,0)) / 86400000);
}

async function updateOneSignalLanguageTag(){
  if(typeof OneSignalDeferred === "undefined") return;

  OneSignalDeferred.push(async function(OneSignal){
    const savedLang = localStorage.getItem("lang") || "ru";
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "America/New_York";

    await OneSignal.User.addTag("language", savedLang);
    await OneSignal.User.addTag("timezone", timezone);
    await OneSignal.User.addTag("plan", "victory");
  });
}

function setLang(l){
  lang = l;
  localStorage.setItem("lang", l);
  refreshApp();
  updateOneSignalLanguageTag();
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
      chapters.forEach(ch=>out.push({book:currentBook, chapter:ch}));
    } else if(currentBook){
      const chapters = part.match(/\d+/g) || [];
      chapters.forEach(ch=>out.push({book:currentBook, chapter:ch}));
    }
  }

  return out;
}

function bibleUrl(book, chapter){
  const slug = biblePlanSlugs[book];
  return slug ? `https://bibleplan.ru/bible/${slug}/${chapter}` : "https://bibleplan.ru/bible";
}

function refreshApp(){
  updateTodayData();
  applyLang();
  renderReading();
  renderProgress();
  loadTodayNote();
}

function applyLang(){
  const t = ui[lang];

  heroTitle.innerText = t.hero;
  planTitle.innerText = t.plan;
  fullPlanBtn.innerText = t.full;
  languageTitle.innerText = t.language;
  todayReadingTitle.innerText = t.todayReading;
  notesTitle.innerText = t.notes;
  note.placeholder = t.placeholder;
  saveNoteBtn.innerText = t.save;
  noteInfo.innerText = t.noteInfo;
  progressTitle.innerText = t.progress;
  readText.innerText = t.readCount;
  missedText.innerText = t.missed;
  totalText.innerText = t.total;
  calendarBtn.innerText = t.calendar;
  navToday.innerText = t.navToday;
  navCalendar.innerText = t.navCalendar;
  navNotes.innerText = t.navNotes;
  winnerTitle.innerText = t.winner;
  winnerText.innerText = t.winnerText;
  winnerBtn.innerText = t.amen;
  quoteText.innerText = t.quote;
  quoteRef.innerText = t.quoteRef;

  document.querySelectorAll(".lang button").forEach(b=>b.classList.remove("active"));
  document.getElementById("btn-"+lang).classList.add("active");

  todayDate.innerText = t.todayLabel + " " + now.toLocaleDateString(
    lang==="en" ? "en-US" : lang==="uk" ? "uk-UA" : "ru-RU",
    {day:"numeric",month:"long",year:"numeric"}
  );

  dayNumber.innerText = `${t.day} ${dayOfYear} ${t.of} 365`;

  if(localStorage.getItem("read-"+key)){
    readBtn.innerText = t.readDone;
    readBtn.classList.add("done");
  } else {
    readBtn.innerText = t.read;
    readBtn.classList.remove("done");
  }
}

function renderReading(){
  const text = planText[key];

  if(!text){
    reading.innerHTML = `<div class="chapter-btn">${ui[lang].missing}</div>`;
    return;
  }

  const items = parseReadings(text);

  if(!items.length){
    reading.innerHTML = `<div class="chapter-btn">${text}</div>`;
    return;
  }

  reading.innerHTML = items.map(r=>{
    const title = (bookLabels?.[lang]?.[r.book] || r.book) + " " + r.chapter;
    return `<a class="chapter-btn" target="_blank" href="${bibleUrl(r.book,r.chapter)}">📖 ${title} ›</a>`;
  }).join("");
}

readBtn.onclick = function(){
  updateTodayData();
  localStorage.setItem("read-"+key,"yes");
  refreshApp();
  winnerModal.style.display = "flex";
};

function closeWinner(){
  winnerModal.style.display = "none";
}

function loadTodayNote(){
  note.value = localStorage.getItem("note-"+key) || "";
}

function saveNote(){
  updateTodayData();
  localStorage.setItem("note-"+key,note.value);
  alert(ui[lang].saved);
}

function renderProgress(){
  let read = 0;
  let missed = 0;
  calendar.innerHTML = "";

  for(let i=1;i<=365;i++){
    const date = new Date(now.getFullYear(),0,i);
    const k = String(date.getMonth()+1).padStart(2,"0")+"-"+String(date.getDate()).padStart(2,"0");

    const div = document.createElement("div");
    div.className = "day";
    div.innerText = i;

    if(localStorage.getItem("read-"+k)){
      div.classList.add("read");
      read++;
    } else if(i < dayOfYear){
      div.classList.add("missed");
      missed++;
    }

    calendar.appendChild(div);
  }

  const percent = Math.round((read/365)*100);

  readCount.innerText = read;
  missedCount.innerText = missed;
  percentText.innerText = percent + "%";
  circleText.innerText = read + " из 365 дней";

  const circle = document.querySelector(".percent-circle");
  if(circle){
    circle.style.background = `conic-gradient(#d18a00 ${percent*3.6}deg, #ece8e2 0deg)`;
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

document.addEventListener("visibilitychange",()=>{
  if(!document.hidden) refreshApp();
});

setInterval(refreshApp,60000);

refreshApp();
updateOneSignalLanguageTag();
