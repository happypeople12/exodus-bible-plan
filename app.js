const ui = {
  ru:{
    hero:"План Победы 2026", today:"Чтение на сегодня", read:"✓ Я прочитал", readDone:"Прочитано ✅",
    full:"Открыть весь план", notes:"Мои заметки", placeholder:"Что Бог сказал мне сегодня?",
    save:"Сохранить заметку", saved:"Заметка сохранена", noteInfo:"Заметки сохраняются на этом устройстве.",
    progress:"Мой прогресс", readCount:"Прочитано", missed:"Пропущено", total:"Всего",
    calendar:"Календарь года", allNotes:"Все заметки", noNotes:"Пока нет сохранённых заметок.",
    navToday:"Сегодня", navProgress:"Прогресс", navNotes:"Заметки", day:"День", of:"из",
    missing:"Этот день ещё нужно добавить в план.", winner:"Ты победитель!",
    winnerText:"Сегодня ты сделал важный духовный шаг.", amen:"Аминь", todayLabel:"Сегодня:"
  },
  uk:{
    hero:"План Перемоги 2026", today:"Читання на сьогодні", read:"✓ Я прочитав", readDone:"Прочитано ✅",
    full:"Відкрити весь план", notes:"Мої нотатки", placeholder:"Що Бог сказав мені сьогодні?",
    save:"Зберегти нотатку", saved:"Нотатку збережено", noteInfo:"Нотатки зберігаються на цьому пристрої.",
    progress:"Мій прогрес", readCount:"Прочитано", missed:"Пропущено", total:"Усього",
    calendar:"Календар року", allNotes:"Усі нотатки", noNotes:"Поки немає збережених нотаток.",
    navToday:"Сьогодні", navProgress:"Прогрес", navNotes:"Нотатки", day:"День", of:"з",
    missing:"Цей день ще потрібно додати в план.", winner:"Ти переможець!",
    winnerText:"Сьогодні ти зробив важливий духовний крок.", amen:"Амінь", todayLabel:"Сьогодні:"
  },
  en:{
    hero:"Victory Plan 2026", today:"Today’s Reading", read:"✓ I read today", readDone:"Read ✅",
    full:"Open full plan", notes:"My notes", placeholder:"What did God speak to me today?",
    save:"Save note", saved:"Note saved", noteInfo:"Notes are saved on this device.",
    progress:"My Progress", readCount:"Read", missed:"Missed", total:"Total",
    calendar:"Year Calendar", allNotes:"All Notes", noNotes:"No saved notes yet.",
    navToday:"Today", navProgress:"Progress", navNotes:"Notes", day:"Day", of:"of",
    missing:"This day still needs to be added to the plan.", winner:"You are a winner!",
    winnerText:"Today you made an important spiritual step.", amen:"Amen", todayLabel:"Today:"
  }
};

let lang = localStorage.getItem("lang") || "ru";
const now = new Date();
const key = String(now.getMonth()+1).padStart(2,"0") + "-" + String(now.getDate()).padStart(2,"0");
const dayOfYear = Math.floor((now - new Date(now.getFullYear(),0,0)) / 86400000);

function setLang(l){
  lang = l;
  localStorage.setItem("lang", l);
  applyLang();
}

function bibleUrl(bookKey, chapter){
  const passage = encodeURIComponent(books[bookKey].query + " " + chapter);
  return "https://www.biblegateway.com/passage/?search=" + passage + "&version=" + versions[lang];
}

function applyLang(){
  const t = ui[lang];
  document.documentElement.lang = lang;

  document.getElementById("heroTitle").innerText = t.hero;
  document.getElementById("todayTitle").innerText = t.today;
  document.getElementById("fullPlanBtn").innerText = t.full;
  document.getElementById("notesTitle").innerText = t.notes;
  document.getElementById("note").placeholder = t.placeholder;
  document.getElementById("saveNoteBtn").innerText = t.save;
  document.getElementById("noteInfo").innerText = t.noteInfo;
  document.getElementById("progressTitle").innerText = t.progress;
  document.getElementById("readText").innerText = t.readCount;
  document.getElementById("missedText").innerText = t.missed;
  document.getElementById("totalText").innerText = t.total;
  document.getElementById("calendarTitle").innerText = t.calendar;
  document.getElementById("allNotesTitle").innerText = t.allNotes;
  document.getElementById("navToday").innerText = t.navToday;
  document.getElementById("navProgress").innerText = t.navProgress;
  document.getElementById("navNotes").innerText = t.navNotes;
  document.getElementById("winnerTitle").innerText = t.winner;
  document.getElementById("winnerText").innerText = t.winnerText;
  document.getElementById("winnerBtn").innerText = t.amen;

  document.querySelectorAll(".lang button").forEach(b=>b.classList.remove("active"));
  document.getElementById("btn-"+lang).classList.add("active");

  document.getElementById("todayDate").innerText =
    t.todayLabel + " " + now.toLocaleDateString(lang==="en" ? "en-US" : lang==="uk" ? "uk-UA" : "ru-RU", {
      day:"numeric", month:"long", year:"numeric"
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

  renderReading();
  renderNotes();
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
    return `<a class="chapter-btn" target="_blank" href="${bibleUrl(bookKey, chapter)}">📖 ${title}</a>`;
  }).join("");
}

document.getElementById("readBtn").onclick = function(){
  localStorage.setItem("read-"+key,"yes");
  applyLang();
  renderProgress();
  document.getElementById("winnerModal").style.display = "flex";
};

function closeWinner(){
  document.getElementById("winnerModal").style.display = "none";
}

document.getElementById("note").value = localStorage.getItem("note-"+key) || "";

function saveNote(){
  localStorage.setItem("note-"+key, document.getElementById("note").value);
  alert(ui[lang].saved);
}

function showPage(id){
  document.querySelectorAll(".page").forEach(page => page.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
  renderProgress();
  renderNotes();
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

  document.getElementById("readCount").innerText = read;
  document.getElementById("missedCount").innerText = missed;
}

function renderNotes(){
  const box = document.getElementById("allNotes");
  box.innerHTML = "";

  for(let i=1; i<=365; i++){
    const date = new Date(2026,0,i);
    const k = String(date.getMonth()+1).padStart(2,"0") + "-" + String(date.getDate()).padStart(2,"0");
    const note = localStorage.getItem("note-"+k);

    if(note){
      box.innerHTML += `<div class="note-item"><b>${date.toLocaleDateString(lang==="en" ? "en-US" : lang==="uk" ? "uk-UA" : "ru-RU",{day:"numeric",month:"long"})}</b><p>${note}</p></div>`;
    }
  }

  if(!box.innerHTML){
    box.innerHTML = "<p>" + ui[lang].noNotes + "</p>";
  }
}

applyLang();
renderProgress();
