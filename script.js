{\rtf1\ansi\ansicpg1252\cocoartf2869
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 let score = 0;\
let current = \{\};\
\
const persons = [\
  "1. Sg.","2. Sg.","3. Sg.",\
  "1. Pl.","2. Pl.","3. Pl."\
];\
\
// -------------------------\
// STORAGE\
// -------------------------\
\
function getVerbs() \{\
  return JSON.parse(localStorage.getItem("verbs") || "[]");\
\}\
\
function saveVerbs(list) \{\
  localStorage.setItem("verbs", JSON.stringify(list));\
\}\
\
// -------------------------\
// KONJUGATIONSTYP ERKENNUNG\
// -------------------------\
\
function detectType(verb) \{\
  if (verb.endsWith("are")) return "a";\
  if (verb.endsWith("ire")) return "i";\
\
  // -ere differenzieren\
  if (verb.endsWith("ere")) \{\
    if (["facere","capere","iacere"].includes(verb)) return "mixed";\
    return "consonant";\
  \}\
\
  return "consonant";\
\}\
\
function stem(verb) \{\
  return verb.slice(0, -3);\
\}\
\
// -------------------------\
// KONJUGATION PR\'c4SENS\
// -------------------------\
\
function conjugate(verb) \{\
  const type = detectType(verb);\
  const s = stem(verb);\
\
  let aktiv = [];\
  let passiv = [];\
\
  if (type === "a") \{\
    aktiv = [\
      s+"o", s+"s", s+"t",\
      s+"mus", s+"tis", s+"nt"\
    ];\
    passiv = [\
      s+"or", s+"ris", s+"tur",\
      s+"mur", s+"mini", s+"ntur"\
    ];\
  \}\
\
  if (type === "consonant") \{\
    aktiv = [\
      s+"o", s+"is", s+"it",\
      s+"imus", s+"itis", s+"unt"\
    ];\
    passiv = [\
      s+"or", s+"eris", s+"itur",\
      s+"imur", s+"imini", s+"untur"\
    ];\
  \}\
\
  if (type === "i") \{\
    aktiv = [\
      s+"io", s+"is", s+"it",\
      s+"imus", s+"itis", s+"iunt"\
    ];\
    passiv = [\
      s+"ior", s+"iris", s+"itur",\
      s+"imur", s+"imini", s+"iuntur"\
    ];\
  \}\
\
  if (type === "mixed") \{\
    // z. B. facere / capere\
    aktiv = [\
      s+"io", s+"is", s+"it",\
      s+"imus", s+"itis", s+"iunt"\
    ];\
    passiv = [\
      s+"ior", s+"eris", s+"itur",\
      s+"imur", s+"imini", s+"untur"\
    ];\
  \}\
\
  return \{ aktiv, passiv \};\
\}\
\
// -------------------------\
// UI\
// -------------------------\
\
function render() \{\
  const list = getVerbs();\
  document.getElementById("verbList").innerHTML =\
    list.length ? list.join("<br>") : "Keine Verben gespeichert";\
\}\
\
function addVerb() \{\
  const v = document.getElementById("newVerb").value.trim();\
  if (!v) return;\
\
  let list = getVerbs();\
\
  if (!list.includes(v)) \{\
    list.push(v);\
    saveVerbs(list);\
  \}\
\
  document.getElementById("newVerb").value = "";\
  render();\
\}\
\
// -------------------------\
// TRAINING\
// -------------------------\
\
function random(arr) \{\
  return arr[Math.floor(Math.random() * arr.length)];\
\}\
\
function generate() \{\
  const verbs = getVerbs();\
\
  if (verbs.length === 0) \{\
    alert("Bitte Verben hinzuf\'fcgen!");\
    return;\
  \}\
\
  const verb = random(verbs);\
  const mode = Math.random() < 0.5 ? "aktiv" : "passiv";\
  const index = Math.floor(Math.random() * 6);\
\
  const forms = conjugate(verb);\
\
  current = \{\
    solution: forms[mode][index],\
    label: `$\{verb\} \'96 $\{persons[index]\} Pr\'e4sens $\{mode\}`\
  \};\
\
  document.getElementById("task").innerText = current.label;\
  document.getElementById("answer").value = "";\
  document.getElementById("feedback").innerText = "";\
\}\
\
function check() \{\
  const input = document.getElementById("answer").value.trim().toLowerCase();\
\
  if (!input) return;\
\
  if (input === current.solution) \{\
    score++;\
    document.getElementById("feedback").innerText = "\uc0\u10004  Richtig!";\
  \} else \{\
    document.getElementById("feedback").innerText =\
      "\uc0\u10006  Falsch \'96 L\'f6sung: " + current.solution;\
  \}\
\
  document.querySelector("span").innerText = score;\
\
  setTimeout(generate, 1000);\
\}\
\
render();}