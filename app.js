let deferredInstallPrompt = null;
let officialDays = null;

const el = id => document.getElementById(id);
const pad = n => String(n).padStart(2, "0");
const dateKey = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const dayOfYear = d => Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 86400000);

function toast(message) {
  const node = el("toast");
  node.textContent = message;
  node.classList.add("show");
  setTimeout(() => node.classList.remove("show"), 2200);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function loadOfficialDays() {
  const response = await fetch("/days.json", { cache: "no-store" });
  if (!response.ok) throw new Error("Не удалось загрузить календарь");
  officialDays = await response.json();
}

function officialUrl(date) {
  const entry = officialDays?.[String(dayOfYear(date))];
  if (entry?.url) return entry.url;

  const months = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"];
  return `https://bibleplan.ru/${months[date.getMonth()]}-${date.getDate()}`;
}

async function loadReadings(date) {
  const response = await fetch(
    `/api/today?month=${date.getMonth() + 1}&day=${date.getDate()}`,
    { cache: "no-store" }
  );
  if (!response.ok) throw new Error(`API ${response.status}`);
  return response.json();
}

function renderTodayInfo(date) {
  el("date").textContent =
    "Сегодня: " +
    date.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });

  el("day").textContent = `День ${dayOfYear(date)} из 365`;

  const key = dateKey(date);
  const done = localStorage.getItem(`read:${key}`) === "1";
  el("readBtn").textContent = done ? "Прочитано ✅" : "✓ Я прочитал сегодня";
  el("readBtn").classList.toggle("done", done);
  el("note").value = localStorage.getItem(`note:${key}`) || "";
}

function renderReadings(data, date) {
  const url = data?.officialUrl || officialUrl(date);
  const readings = Array.isArray(data?.readings) ? data.readings : [];

  if (!readings.length) {
    el("readings").innerHTML = `
      <a class="chapter" href="${url}" target="_self">
        <span>📖 Открыть официальный План Победы на сегодня</span>
        <span>›</span>
      </a>
    `;
    return;
  }

  el("readings").innerHTML = readings
    .map(item => `
      <a class="chapter" href="${url}" target="_self">
        <span>📖 ${escapeHtml(item.title)}</span>
        <span>›</span>
      </a>
    `)
    .join("");
}

function renderProgress(now) {
  const year = now.getFullYear();
  const currentDay = dayOfYear(now);
  let read = 0;
  let missed = 0;
  let html = "";

  for (let i = 1; i <= 365; i++) {
    const d = new Date(year, 0, i);
    const key = dateKey(d);
    const isRead = localStorage.getItem(`read:${key}`) === "1";

    if (isRead) read++;
    else if (i < currentDay) missed++;

    html += `
      <div class="${isRead ? "read" : i < currentDay ? "missed" : ""} ${i === currentDay ? "today" : ""}">
        ${i}
      </div>
    `;
  }

  el("readCount").textContent = read;
  el("missedCount").textContent = missed;
  el("percent").textContent = Math.round((read / 365) * 100) + "%";
  el("calendar").innerHTML = html;
}

async function refresh() {
  const now = new Date();
  renderTodayInfo(now);
  renderProgress(now);
  el("readings").innerHTML = `<div class="chapter">Загружаем точный План Победы…</div>`;

  try {
    const data = await loadReadings(now);
    renderReadings(data, now);
  } catch (error) {
    console.warn(error);
    renderReadings({ officialUrl: officialUrl(now), readings: [] }, now);
  }
}

function initEvents() {
  el("readBtn").addEventListener("click", () => {
    const key = dateKey(new Date());
    const done = localStorage.getItem(`read:${key}`) === "1";
    localStorage.setItem(`read:${key}`, done ? "0" : "1");
    refresh();
    toast(done ? "Отметка снята" : "Отлично! День отмечен.");
  });

  el("saveNote").addEventListener("click", () => {
    localStorage.setItem(`note:${dateKey(new Date())}`, el("note").value);
    toast("Заметка сохранена");
  });

  el("toggleCalendar").addEventListener("click", () => {
    el("calendar").classList.toggle("hidden");
  });

  document.querySelectorAll(".bottom-nav button").forEach(button => {
    button.addEventListener("click", () => {
      el(button.dataset.target)?.scrollIntoView({ behavior: "smooth" });
    });
  });

  window.addEventListener("beforeinstallprompt", event => {
    event.preventDefault();
    deferredInstallPrompt = event;
    el("installBtn").classList.remove("hidden");
  });

  el("installBtn").addEventListener("click", async () => {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    el("installBtn").classList.add("hidden");
  });
}

async function initOneSignal() {
  window.OneSignalDeferred = window.OneSignalDeferred || [];
  window.OneSignalDeferred.push(async OneSignal => {
    try {
      await OneSignal.init({
        appId: "920a332c-006b-4d18-a33b-86cac4b2d273",
        serviceWorkerPath: "/OneSignalSDKWorker.js",
        serviceWorkerParam: { scope: "/" }
      });
      await OneSignal.User.addTag("language", "ru");
      await OneSignal.User.addTag(
        "timezone",
        Intl.DateTimeFormat().resolvedOptions().timeZone || "America/New_York"
      );
      await OneSignal.User.addTag("plan", "victory");
    } catch (error) {
      console.warn("OneSignal:", error);
    }
  });
}

(async function init() {
  initEvents();
  await loadOfficialDays();
  await refresh();

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw.js");
  }

  initOneSignal();
})();
