const BIBLE_BASE="https://bible.ru/bible/rst78";
let planData=null;
let deferredInstallPrompt=null;

const el=id=>document.getElementById(id);
const pad=n=>String(n).padStart(2,"0");
const dayOfYear=d=>Math.floor((d-new Date(d.getFullYear(),0,0))/86400000);
const dateKey=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const readingUrl=r=>`${BIBLE_BASE}/${r.slug}-${r.chapter}/`;

function toast(message){
  const t=el("toast"); t.textContent=message; t.classList.add("show");
  setTimeout(()=>t.classList.remove("show"),2200);
}

async function loadPlan(){
  const response=await fetch("/plan.json",{cache:"no-store"});
  if(!response.ok) throw new Error(`Не удалось загрузить план: ${response.status}`);
  planData=await response.json();
}

function render(){
  const now=new Date();
  const day=dayOfYear(now);
  const key=dateKey(now);
  const readings=planData?.[String(day)]||[];

  el("date").textContent="Сегодня: "+now.toLocaleDateString("ru-RU",{day:"numeric",month:"long",year:"numeric"});
  el("day").textContent=`День ${day} из 365`;

  el("readings").innerHTML=readings.map(r=>`
    <a class="chapter" href="${readingUrl(r)}" target="_self">
      <span>📖 ${r.title} ${r.chapter}</span><span>›</span>
    </a>`).join("") || `<div>Чтение для этого дня не найдено.</div>`;

  const done=localStorage.getItem(`read:${key}`)==="1";
  el("readBtn").textContent=done?"Прочитано ✅":"✓ Я прочитал сегодня";
  el("readBtn").classList.toggle("done",done);
  el("note").value=localStorage.getItem(`note:${key}`)||"";
  renderProgress(now);
}

function renderProgress(now){
  const year=now.getFullYear(), currentDay=dayOfYear(now);
  let read=0,missed=0,html="";
  for(let i=1;i<=365;i++){
    const d=new Date(year,0,i), key=dateKey(d);
    const isRead=localStorage.getItem(`read:${key}`)==="1";
    if(isRead) read++; else if(i<currentDay) missed++;
    html+=`<div class="${isRead?"read":i<currentDay?"missed":""} ${i===currentDay?"today":""}">${i}</div>`;
  }
  el("readCount").textContent=read;
  el("missedCount").textContent=missed;
  el("percent").textContent=Math.round(read/365*100)+"%";
  el("calendar").innerHTML=html;
}

function initEvents(){
  el("readBtn").addEventListener("click",()=>{
    const key=dateKey(new Date());
    const done=localStorage.getItem(`read:${key}`)==="1";
    localStorage.setItem(`read:${key}`,done?"0":"1");
    render(); toast(done?"Отметка снята":"Отлично! День отмечен.");
  });
  el("saveNote").addEventListener("click",()=>{
    localStorage.setItem(`note:${dateKey(new Date())}`,el("note").value);
    toast("Заметка сохранена");
  });
  el("toggleCalendar").addEventListener("click",()=>{
    el("calendar").classList.toggle("hidden");
  });
  document.querySelectorAll(".bottom-nav button").forEach(b=>b.addEventListener("click",()=>{
    el(b.dataset.target)?.scrollIntoView({behavior:"smooth"});
  }));
  window.addEventListener("beforeinstallprompt",e=>{
    e.preventDefault(); deferredInstallPrompt=e; el("installBtn").classList.remove("hidden");
  });
  el("installBtn").addEventListener("click",async()=>{
    if(!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt(); await deferredInstallPrompt.userChoice;
    deferredInstallPrompt=null; el("installBtn").classList.add("hidden");
  });
}

async function initOneSignal(){
  if(!window.OneSignalDeferred) window.OneSignalDeferred=[];
  window.OneSignalDeferred.push(async OneSignal=>{
    try{
      await OneSignal.init({
        appId:"920a332c-006b-4d18-a33b-86cac4b2d273",
        serviceWorkerPath:"/OneSignalSDKWorker.js",
        serviceWorkerParam:{scope:"/"}
      });
      await OneSignal.User.addTag("language","ru");
      await OneSignal.User.addTag("timezone",Intl.DateTimeFormat().resolvedOptions().timeZone||"America/New_York");
      await OneSignal.User.addTag("plan","victory");
    }catch(e){console.warn("OneSignal:",e);}
  });
}

(async function(){
  try{
    initEvents();
    await loadPlan();
    render();
    if("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js");
    initOneSignal();
  }catch(error){
    console.error(error);
    el("readings").innerHTML=`<div>Ошибка загрузки приложения. Обновите страницу.</div>`;
  }
})();