const ui = {
  ru:{
    hero:"Ежедневное чтение Библии",
    plan:"План Победы 2026",
    full:"☰ Весь план ›",
    language:"Языки пользования",
    read:"✓ Я прочитал",
    readDone:"Прочитано ✅",
    notes:"▣ Мои заметки",
    placeholder:"Что Бог сказал мне сегодня?",
    save:"Сохранить заметку",
    saved:"Заметка сохранена",
    noteInfo:"Ваши заметки сохраняются только на этом устройстве.",
    progress:"▣ Мой прогресс",
    readCount:"Прочитано дней",
    missed:"Пропущено дней",
    total:"Дней всего",
    calendar:"Посмотреть календарь прогресса",
    navToday:"Сегодня",
    navCalendar:"Календарь",
    navNotes:"Заметки",
    navProgress:"Прогресс",
    day:"День",
    of:"из",
    todayLabel:"Сегодня:",
    missing:"Этот день ещё нужно добавить в план.",
    winner:"Ты победитель!",
    winnerText:"Сегодня ты сделал важный духовный шаг.",
    amen:"Аминь",
    quote:"Не хвались завтрашним днем, потому что не знаешь, что родит тот день.",
    quoteRef:"Притчи 27:1"
  },
  uk:{
    hero:"Щоденне читання Біблії",
    plan:"План Перемоги 2026",
    full:"☰ Весь план ›",
    language:"Мови користування",
    read:"✓ Я прочитав",
    readDone:"Прочитано ✅",
    notes:"▣ Мої нотатки",
    placeholder:"Що Бог сказав мені сьогодні?",
    save:"Зберегти нотатку",
    saved:"Нотатку збережено",
    noteInfo:"Ваші нотатки зберігаються тільки на цьому пристрої.",
    progress:"▣ Мій прогрес",
    readCount:"Прочитано днів",
    missed:"Пропущено днів",
    total:"Днів усього",
    calendar:"Переглянути календар прогресу",
    navToday:"Сьогодні",
    navCalendar:"Календар",
    navNotes:"Нотатки",
    navProgress:"Прогрес",
    day:"День",
    of:"з",
    todayLabel:"Сьогодні:",
    missing:"Цей день ще потрібно додати в план.",
    winner:"Ти переможець!",
    winnerText:"Сьогодні ти зробив важливий духовний крок.",
    amen:"Амінь",
    quote:"Не хвалися завтрашнім днем, бо не знаєш, що той день принесе.",
    quoteRef:"Приповісті 27:1"
  },
  en:{
    hero:"Daily Bible Reading",
    plan:"Victory Plan 2026",
    full:"☰ Full plan ›",
    language:"User languages",
    read:"✓ I read today",
    readDone:"Read ✅",
    notes:"▣ My notes",
    placeholder:"What did God speak to me today?",
    save:"Save note",
    saved:"Note saved",
    noteInfo:"Your notes are saved only on this device.",
    progress:"▣ My Progress",
    readCount:"Days read",
    missed:"Days missed",
    total:"Total days",
    calendar:"View progress calendar",
    navToday:"Today",
    navCalendar:"Calendar",
    navNotes:"Notes",
    navProgress:"Progress",
    day:"Day",
    of:"of",
    todayLabel:"Today:",
    missing:"This day still needs to be added to the plan.",
    winner:"You are a winner!",
    winnerText:"Today you made an important spiritual step.",
    amen:"Amen",
    quote:"Do not boast about tomorrow, for you do not know what a day may bring.",
    quoteRef:"Proverbs 27:1"
  }
};

let lang = localStorage.getItem("lang") || "ru";
let now;
let key;
let dayOfYear;

function updateTodayData(){
  now = new Date();
  key = String(now.getMonth()+1).padStart(2,"0") + "-" + String(now.getDate()).padStart(2,"0");
  dayOfYear = Math.floor((now - new Date(now.getFullYear(),0,0)) / 86400000);
}

function setLang(l){
  lang = l;
  localStorage.setItem("lang", l);
  refreshApp();
}

function bibleUrl(bookKey, chapter){
  const passage = encodeURIComponent(books[bookKey].query + " " + chapter);
  return "https://www.biblegateway.com/passage/?search=" + passage + "&version=" + versions[lang];
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

  document.documentElement.lang = lang;
  document.getElementById("heroTitle").innerText = t.hero;
  document.getElementById("planTitle").innerText = t.plan;
  document.getElementById("fullPlanBtn").innerText = t.full;
  document.getElementById("languageTitle").innerText = t.language;
  document.getElementById("notesTitle").innerText = t.notes;
  document.getElementById("note").placeholder = t.placeholder;
  document.getElementById("saveNoteBtn").innerText = t.save;
  document.getElementById("noteInfo").innerText = t.noteInfo;
  document.getElementById("progressTitle").innerText = t.progress;
  document.getElementById("readText").innerText = t.readCount;
  document.getElementById("missedText").innerText = t.missed;
  document.getElementById("totalText").innerText = t.total;
  document.getElementById("calendarBtn").innerText = t.calendar;
  document.getElementById("navToday").innerText = t.navToday;
  document.getElementById("navCalendar").innerText = t.navCalendar;
  document.getElementById("navNotes").innerText = t.navNotes;
  document.getElementById("navProgress").innerText = t.navProgress;
  document.getElementById("winnerTitle").innerText = t.winner;
  document.getElementById("winnerText").innerText = t.winnerText;
  document.getElementById("winnerBtn").innerText = t.amen;
  document.getElementById("quoteText").innerText = t.quote;
  document.getElementById("quoteRef").innerText = t.quoteRef;

  document.querySelectorAll(".lang button").forEach(b=>b.classList.remove("active"));
  document.getElementById("btn-"+lang).classList.add("active");

  document.getElementById("todayDate").innerText =
    "▣ " + t.todayLabel + " " + now.toLocaleDateString(lang==="en" ? "en-US" : lang==="uk" ? "uk-UA" : "ru-RU", {
      day:"numeric",
      month:"long",
      year:"numeric"
    });

  document.getElementById("dayNumber").innerText = t.day + " " + dayOfYear + " " + t.of + " 365";

  const readBtn = document.getElementById("readBtn");

  if(localStorage.getItem("read-"+key)){
    readBtn.innerText = t.readDone;
    readBtn.classList.add("done");
  }else{
    readBtn.innerText = t.read;
    readBtn.classList.remove("done");
  }
}

function renderReading(){
  const readingBox = document.getElementById("reading");

  if(!plan[key]){
    readingBox.innerHTML = "<div class='chapter-btn'>" + ui[lang].missing + "</div>";
    return;
  }

  readingBox.innerHTML = plan[key].map(([bookKey, chapter])=>{
    const b = books[bookKey];
    const title = b[lang] + " " + chapter;
    return `<a class="chapter-btn" target="_blank" href="${bibleUrl(bookKey, chapter)}">${title}</a>`;
  }).join("");
}

document.getElementById("readBtn").onclick = function(){
  updateTodayData();
  localStorage.setItem("read-"+key,"yes");
  refreshApp();
  document.getElementById("winnerModal").style.display = "flex";
};

function closeWinner(){
  document.getElementById("winnerModal").style.display = "none";
}

function loadTodayNote(){
  document.getElementById("note").value = localStorage.getItem("note-"+key) || "";
}

function saveNote(){
  updateTodayData();
  localStorage.setItem("note-"+key, document.getElementById("note").value);
  alert(ui[lang].saved);
}

function renderProgress(){
  let read = 0;
  let missed = 0;
  const calendar = document.getElementById("calendar");
  calendar.innerHTML = "";

  for(let i=1; i<=365; i++){
    const date = new Date(2026,0,i);
    const k = String(date.getMonth()+1).padStart(2,"0") + "-" + String(date.getDate()).padStart(2,"0");

    const div = document.createElement("div");
    div.className = "day";
    div.innerText = i;

    if(localStorage.getItem("read-"+k)){
      div.classList.add("read");
      read++;
    }else if(i < dayOfYear){
      div.classList.add("missed");
      missed++;
    }

    calendar.appendChild(div);
  }

  const percent = Math.round((read / 365) * 100);

  document.getElementById("readCount").innerText = read;
  document.getElementById("missedCount").innerText = missed;
  document.getElementById("percentText").innerText = percent + "%";
  document.getElementById("circleText").innerText = read + " из 365 дней";
}

function toggleCalendar(){
  document.getElementById("calendar").classList.toggle("hidden");
}

function scrollToTop(){
  window.scrollTo({top:0,behavior:"smooth"});
}

function scrollToNotes(){
  document.getElementById("notesTitle").scrollIntoView({behavior:"smooth"});
}

function scrollToProgress(){
  document.getElementById("progressTitle").scrollIntoView({behavior:"smooth"});
}

window.addEventListener("pageshow", refreshApp);
document.addEventListener("visibilitychange", function(){
  if(!document.hidden){
    refreshApp();
  }
});

setInterval(refreshApp, 60000);

refreshApp();
