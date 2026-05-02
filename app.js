const rows = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l", ";"],
  ["z", "x", "c", "v", "b", "n", "m", ",", ".", "/"],
];

const layerNames = {
  base: "通常",
  aux: "Aux",
  k: "K",
  l: "L",
  i: "I",
  o: "O",
  d: "D",
  s: "S",
};

const labels = {
  q: "Q",
  w: "W",
  e: "E",
  r: "R",
  t: "T",
  y: "Y",
  u: "U",
  i: "I",
  o: "O",
  p: "P",
  a: "A",
  s: "S",
  d: "D",
  f: "F",
  g: "G",
  h: "H",
  j: "J",
  k: "K",
  l: "L",
  ";": ";",
  z: "Z",
  x: "X",
  c: "C",
  v: "V",
  b: "B",
  n: "N",
  m: "M",
  ",": ",",
  ".": ".",
  "/": "/",
};

const maps = {
  base: {
    q: "に",
    w: "は",
    e: "、",
    r: "ち",
    t: "ぐ",
    y: "ば",
    u: "こ",
    i: "が",
    o: "ひ",
    p: "げ",
    a: "の",
    s: "と",
    d: "か",
    f: "ん",
    g: "っ",
    h: "く",
    j: "う",
    k: "い",
    l: "し",
    ";": "な",
    z: "す",
    x: "ま",
    c: "き",
    v: "る",
    b: "つ",
    n: "て",
    m: "た",
    ",": "で",
    ".": "。",
    "/": "ぶ",
  },
  k: {
    q: "ふぁ",
    w: "ご",
    e: "ふ",
    r: "ふぃ",
    t: "ふぇ",
    a: "ほ",
    s: "じ",
    d: "れ",
    f: "も",
    g: "ゆ",
    z: "づ",
    x: "ぞ",
    c: "ぼ",
    v: "む",
    b: "ふぉ",
  },
  d: {
    y: "うぃ",
    u: "ぱ",
    i: "よ",
    o: "み",
    p: "うぇ",
    h: "へ",
    j: "あ",
    ";": "え",
    n: "せ",
    m: "ね",
    ",": "べ",
    ".": "ぷ",
    "/": "ヴ",
  },
  l: {
    q: "ぢ",
    w: "め",
    e: "け",
    r: "てぃ",
    t: "でぃ",
    a: "を",
    s: "さ",
    d: "お",
    f: "り",
    g: "ず",
    z: "ぜ",
    x: "ざ",
    c: "ぎ",
    v: "ろ",
    b: "ぬ",
  },
  s: {
    y: "しぇ",
    u: "ぺ",
    i: "ど",
    o: "や",
    p: "じぇ",
    h: "び",
    j: "ら",
    ";": "そ",
    n: "わ",
    m: "だ",
    ",": "ぴ",
    ".": "ぽ",
    "/": "ちぇ",
  },
  i: {
    q: "ひゅ",
    w: "しゅ",
    e: "しょ",
    r: "きゅ",
    t: "ちゅ",
    a: "ひょ",
    f: "きょ",
    g: "ちょ",
    z: "ひゃ",
    c: "しゃ",
    v: "きゃ",
    b: "ちゃ",
  },
  o: {
    q: "りゅ",
    w: "じゅ",
    e: "じょ",
    r: "ぎゅ",
    t: "にゅ",
    a: "りょ",
    f: "ぎょ",
    g: "にょ",
    z: "りゃ",
    c: "じゃ",
    v: "ぎゃ",
    b: "にゃ",
  },
  aux: {
    q: "ぁ",
    w: "ぃ",
    e: "ぅ",
    r: "ぇ",
    t: "ぉ",
    a: "ゃ",
    s: "ゅ",
    d: "ょ",
    f: "ゎ",
    g: "ー",
    z: "みゃ",
    x: "みゅ",
    c: "みょ",
    v: "びゃ",
    b: "びゅ",
    y: "びょ",
    u: "ぴゃ",
    i: "ぴゅ",
    o: "ぴょ",
    p: "ゔ",
    h: "，",
    j: "。",
    k: "「",
    l: "」",
    ";": "・",
    n: "（",
    m: "）",
    ",": "：",
    ".": "；",
    "/": "＊",
  },
};

const shiftKeys = new Set(["k", "l", "i", "o", "d", "s"]);
const appKeys = new Set(rows.flat());
const output = document.querySelector("#output");
const keyboard = document.querySelector("#keyboard");
const activeLayer = document.querySelector("#activeLayer");
const lastStroke = document.querySelector("#lastStroke");
const charCount = document.querySelector("#charCount");
const strokeCount = document.querySelector("#strokeCount");
const strokeLog = document.querySelector("#strokeLog");
const clearButton = document.querySelector("#clearButton");
const sampleButton = document.querySelector("#sampleButton");
const copyButton = document.querySelector("#copyButton");
const clearLogButton = document.querySelector("#clearLogButton");
const modeButtons = Array.from(document.querySelectorAll(".mode"));

let viewMode = "base";
let held = new Set();
let auxHeld = false;
let auxUsed = false;
let pending = null;
let pendingTimer = 0;
let strokes = 0;

function printableKey(event) {
  if (event.key === " ") return "space";
  if (event.key.length === 1) return event.key.toLowerCase();
  return event.key.toLowerCase();
}

function renderKeyboard() {
  keyboard.innerHTML = "";

  rows.forEach((row) => {
    const rowElement = document.createElement("div");
    rowElement.className = "key-row";

    row.forEach((key) => {
      const button = document.createElement("button");
      const value = maps[viewMode][key] || "";
      button.type = "button";
      button.className = "key";
      button.dataset.key = key;
      if (!value) button.classList.add("empty");
      if (held.has(key)) button.classList.add("down");
      if (shiftKeys.has(key)) button.classList.add("shift-source");
      if (viewMode === "aux" && value) button.classList.add("aux-hit");
      button.innerHTML = `
        <span class="key-label">${labels[key]}</span>
        <span class="key-value">${value || "-"}</span>
      `;
      button.addEventListener("click", () => emitFromView(key));
      rowElement.append(button);
    });

    keyboard.append(rowElement);
  });
}

function setViewMode(mode) {
  viewMode = mode;
  modeButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.mode === mode);
  });
  renderKeyboard();
}

function setLayerReadout(text) {
  activeLayer.textContent = text;
}

function insertText(text) {
  const start = output.selectionStart;
  const end = output.selectionEnd;
  const before = output.value.slice(0, start);
  const after = output.value.slice(end);
  output.value = `${before}${text}${after}`;
  const next = start + text.length;
  output.setSelectionRange(next, next);
  updateStats();
}

function backspace() {
  const start = output.selectionStart;
  const end = output.selectionEnd;
  if (start !== end) {
    output.value = output.value.slice(0, start) + output.value.slice(end);
    output.setSelectionRange(start, start);
  } else if (start > 0) {
    output.value = output.value.slice(0, start - 1) + output.value.slice(start);
    output.setSelectionRange(start - 1, start - 1);
  }
  updateStats();
}

function emit(text, stroke) {
  if (!text) return;
  if (text === "{BS}") {
    backspace();
  } else {
    insertText(text);
  }
  strokes += 1;
  strokeCount.textContent = String(strokes);
  lastStroke.textContent = `${stroke} → ${text}`;
  addLog(stroke, text);
}

function addLog(stroke, text) {
  const item = document.createElement("li");
  const code = document.createElement("code");
  const value = document.createElement("span");
  code.textContent = stroke;
  value.textContent = text;
  item.append(code, value);
  strokeLog.prepend(item);
  while (strokeLog.children.length > 40) {
    strokeLog.lastElementChild.remove();
  }
}

function updateStats() {
  charCount.textContent = String([...output.value].length);
}

function clearPending() {
  if (pendingTimer) window.clearTimeout(pendingTimer);
  pendingTimer = 0;
  pending = null;
}

function flushPending() {
  if (!pending) return;
  const key = pending;
  clearPending();
  emit(maps.base[key], labels[key]);
}

function queuePending(key) {
  clearPending();
  pending = key;
  pendingTimer = window.setTimeout(flushPending, 115);
}

function activeShiftFor(target) {
  for (const key of held) {
    if (shiftKeys.has(key) && key !== target && maps[key]?.[target]) {
      return key;
    }
  }
  return "";
}

function handleAppKey(key, event) {
  event.preventDefault();
  output.focus();

  if (auxHeld) {
    clearPending();
    auxUsed = true;
    emit(maps.aux[key], `Aux+${labels[key]}`);
    setLayerReadout("Aux");
    renderKeyboard();
    return;
  }

  if (pending && shiftKeys.has(key) && maps[key]?.[pending]) {
    const first = pending;
    clearPending();
    held.add(key);
    emit(maps[key][first], `${labels[key]}+${labels[first]}`);
    setLayerReadout(layerNames[key]);
    renderKeyboard();
    return;
  }

  const shift = activeShiftFor(key);
  if (shift) {
    clearPending();
    emit(maps[shift][key], `${labels[shift]}+${labels[key]}`);
    setLayerReadout(layerNames[shift]);
    renderKeyboard();
    return;
  }

  if (pending && pending !== key) {
    flushPending();
  }
  queuePending(key);
  renderKeyboard();
}

function emitFromView(key) {
  output.focus();
  const text = maps[viewMode][key];
  if (!text) return;
  const stroke = viewMode === "base" ? labels[key] : `${layerNames[viewMode]}+${labels[key]}`;
  emit(text, stroke);
}

document.addEventListener("keydown", (event) => {
  if (event.metaKey || event.ctrlKey || event.altKey) return;
  const key = printableKey(event);
  if (event.repeat) return;

  if (key === "backspace") {
    event.preventDefault();
    clearPending();
    emit("{BS}", "Backspace");
    return;
  }

  if (key === "enter") {
    event.preventDefault();
    clearPending();
    emit("\n", "Enter");
    return;
  }

  if (key === "space") {
    event.preventDefault();
    flushPending();
    auxHeld = true;
    auxUsed = false;
    setViewMode("aux");
    setLayerReadout("Aux");
    return;
  }

  if (!appKeys.has(key)) return;
  held.add(key);
  handleAppKey(key, event);
});

document.addEventListener("keyup", (event) => {
  const key = printableKey(event);
  if (key === "space") {
    event.preventDefault();
    if (auxHeld && !auxUsed) emit(" ", "Space");
    auxHeld = false;
    auxUsed = false;
    setLayerReadout("通常");
    if (viewMode === "aux") setViewMode("base");
    return;
  }

  if (appKeys.has(key)) {
    held.delete(key);
    renderKeyboard();
  }
});

modeButtons.forEach((button) => {
  button.addEventListener("click", () => setViewMode(button.dataset.mode));
});

clearButton.addEventListener("click", () => {
  output.value = "";
  strokes = 0;
  strokeCount.textContent = "0";
  lastStroke.textContent = "-";
  updateStats();
  output.focus();
});

sampleButton.addEventListener("click", () => {
  output.value = "きょうは らくだで しゃしんを とった。\nぴょんと はねる ちいさな みゃくを ためす。";
  updateStats();
  output.focus();
});

copyButton.addEventListener("click", async () => {
  output.focus();
  try {
    await navigator.clipboard.writeText(output.value);
    lastStroke.textContent = "コピー済み";
  } catch {
    output.select();
    document.execCommand("copy");
    lastStroke.textContent = "コピー済み";
  }
});

clearLogButton.addEventListener("click", () => {
  strokeLog.innerHTML = "";
  output.focus();
});

output.addEventListener("input", updateStats);

renderKeyboard();
output.focus();
