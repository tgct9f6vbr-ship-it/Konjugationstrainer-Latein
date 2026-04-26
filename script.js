let score = 0;
let total = 0;
let current = null;

const PERSONS = [
  "1. Sg.", "2. Sg.", "3. Sg.",
  "1. Pl.", "2. Pl.", "3. Pl."
];

const TEMPUS_LABELS = {
  praesens: "Präsens",
  imperfekt: "Imperfekt",
  perfekt: "Perfekt",
  plusquamperfekt: "Plusquamperfekt",
  futur1: "Futur I"
};

const VERBS = [
  { infinitive: "amare", present1: "amo", perfect: "amavi", ppp: "amatum", type: "a" },
  { infinitive: "laudare", present1: "laudo", perfect: "laudavi", ppp: "laudatum", type: "a" },
  { infinitive: "parare", present1: "paro", perfect: "paravi", ppp: "paratum", type: "a" },
  { infinitive: "errare", present1: "erro", perfect: "erravi", ppp: "erratum", type: "a" },
  { infinitive: "vocare", present1: "voco", perfect: "vocavi", ppp: "vocatum", type: "a" },

  { infinitive: "videre", present1: "video", perfect: "vidi", ppp: "visum", type: "e" },
  { infinitive: "delere", present1: "deleo", perfect: "delevi", ppp: "deletum", type: "e" },
  { infinitive: "parere", present1: "pareo", perfect: "parui", ppp: "paritum", type: "e" },
  { infinitive: "sedere", present1: "sedeo", perfect: "sedi", ppp: "sessum", type: "e" },
  { infinitive: "movere", present1: "moveo", perfect: "movi", ppp: "motum", type: "e" },

  { infinitive: "audire", present1: "audio", perfect: "audivi", ppp: "auditum", type: "i" },
  { infinitive: "aperire", present1: "aperio", perfect: "aperui", ppp: "apertum", type: "i" },
  { infinitive: "scire", present1: "scio", perfect: "scivi", ppp: "scitum", type: "i" },
  { infinitive: "sentire", present1: "sentio", perfect: "sensi", ppp: "sensum", type: "i" },
  { infinitive: "servire", present1: "servio", perfect: "servivi", ppp: "servitum", type: "i" },

  { infinitive: "facere", present1: "facio", perfect: "feci", ppp: "factum", type: "mixed" },
  { infinitive: "accipere", present1: "accipio", perfect: "accepi", ppp: "acceptum", type: "mixed" },
  { infinitive: "capere", present1: "capio", perfect: "cepi", ppp: "captum", type: "mixed" },
  { infinitive: "cupere", present1: "cupio", perfect: "cupivi", ppp: "cupitum", type: "mixed" },
  { infinitive: "fugere", present1: "fugio", perfect: "fugi", ppp: "fugitum", type: "mixed" },

  { infinitive: "agere", present1: "ago", perfect: "egi", ppp: "actum", type: "consonant" },
  { infinitive: "gerere", present1: "gero", perfect: "gessi", ppp: "gestum", type: "consonant" },
  { infinitive: "mittere", present1: "mitto", perfect: "misi", ppp: "missum", type: "consonant" },
  { infinitive: "regere", present1: "rego", perfect: "rexi", ppp: "rectum", type: "consonant" },
  { infinitive: "scribere", present1: "scribo", perfect: "scripsi", ppp: "scriptum", type: "consonant" }
];

const ESSE = {
  indikativ: {
    praesens: ["sum", "es", "est", "sumus", "estis", "sunt"],
    imperfekt: ["eram", "eras", "erat", "eramus", "eratis", "erant"]
  },
  konjunktiv: {
    praesens: ["sim", "sis", "sit", "simus", "sitis", "sint"],
    imperfekt: ["essem", "esses", "esset", "essemus", "essetis", "essent"]
  }
};

function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function normalize(input) {
  return input.trim().toLowerCase().replace(/\s+/g, " ");
}

function presentStem(v) {
  if (v.type === "mixed") return v.present1.slice(0, -2);
  if (v.type === "consonant") return v.present1.slice(0, -1);
  return v.infinitive.slice(0, -3);
}

function perfectStem(v) {
  return v.perfect.slice(0, -1);
}

function pppForm(v, index) {
  const base = v.ppp.slice(0, -2);
  return index <= 2 ? base + "us" : base + "i";
}

function imperfectStem(v) {
  const s = presentStem(v);

  if (v.type === "a") return s + "a";
  if (v.type === "e") return s + "e";
  if (v.type === "i" || v.type === "mixed") return s + "ie";
  return s + "e";
}

function formFor(v, modus, tempus, genus, index) {
  const ps = perfectStem(v);

  if (genus === "passiv" && tempus === "perfekt") {
    const aux = modus === "indikativ"
      ? ESSE.indikativ.praesens
      : ESSE.konjunktiv.praesens;

    return pppForm(v, index) + " " + aux[index];
  }

  if (genus === "passiv" && tempus === "plusquamperfekt") {
    const aux = modus === "indikativ"
      ? ESSE.indikativ.imperfekt
      : ESSE.konjunktiv.imperfekt;

    return pppForm(v, index) + " " + aux[index];
  }

  if (modus === "indikativ") {
    if (tempus === "praesens") {
      return presentIndicative(v, genus, index);
    }

    if (tempus === "imperfekt") {
      const endings = genus === "aktiv"
        ? ["bam", "bas", "bat", "bamus", "batis", "bant"]
        : ["bar", "baris", "batur", "bamur", "bamini", "bantur"];

      return imperfectStem(v) + endings[index];
    }

    if (tempus === "perfekt") {
      const endings = ["i", "isti", "it", "imus", "istis", "erunt"];
      return ps + endings[index];
    }

    if (tempus === "plusquamperfekt") {
      const endings = ["eram", "eras", "erat", "eramus", "eratis", "erant"];
      return ps + endings[index];
    }

    if (tempus === "futur1") {
      return futureIndicative(v, genus, index);
    }
  }

  if (modus === "konjunktiv") {
    if (tempus === "futur1") {
      return null;
    }

    if (tempus === "praesens") {
      return presentSubjunctive(v, genus, index);
    }

    if (tempus === "imperfekt") {
      const endings = genus === "aktiv"
        ? ["m", "s", "t", "mus", "tis", "nt"]
        : ["r", "ris", "tur", "mur", "mini", "ntur"];

      return v.infinitive + endings[index];
    }

    if (tempus === "perfekt") {
      const endings = ["erim", "eris", "erit", "erimus", "eritis", "erint"];
      return ps + endings[index];
    }

    if (tempus === "plusquamperfekt") {
      const endings = ["issem", "isses", "isset", "issemus", "issetis", "issent"];
      return ps + endings[index];
    }
  }

  return null;
}

function presentIndicative(v, genus, index) {
  const s = presentStem(v);

  const aktiv = {
    a: ["o", "as", "at", "amus", "atis", "ant"],
    e: ["eo", "es", "et", "emus", "etis", "ent"],
    i: ["io", "is", "it", "imus", "itis", "iunt"],
    mixed: ["io", "is", "it", "imus", "itis", "iunt"],
    consonant: ["o", "is", "it", "imus", "itis", "unt"]
  };

  const passiv = {
    a: ["or", "aris", "atur", "amur", "amini", "antur"],
    e: ["eor", "eris", "etur", "emur", "emini", "entur"],
    i: ["ior", "iris", "itur", "imur", "imini", "iuntur"],
    mixed: ["ior", "eris", "itur", "imur", "imini", "iuntur"],
    consonant: ["or", "eris", "itur", "imur", "imini", "untur"]
  };

  return s + (genus === "aktiv" ? aktiv[v.type][index] : passiv[v.type][index]);
}

function futureIndicative(v, genus, index) {
  let stem = presentStem(v);

  if (v.type === "a" || v.type === "e") {
    stem = imperfectStem(v);
    const aktiv = ["bo", "bis", "bit", "bimus", "bitis", "bunt"];
    const passiv = ["bor", "beris", "bitur", "bimur", "bimini", "buntur"];
    return stem + (genus === "aktiv" ? aktiv[index] : passiv[index]);
  }

  if (v.type === "i" || v.type === "mixed") {
    stem = stem + "i";
  }

  const aktiv = ["am", "es", "et", "emus", "etis", "ent"];
  const passiv = ["ar", "eris", "etur", "emur", "emini", "entur"];

  return stem + (genus === "aktiv" ? aktiv[index] : passiv[index]);
}

function presentSubjunctive(v, genus, index) {
  const s = presentStem(v);

  const aktiv = {
    a: ["em", "es", "et", "emus", "etis", "ent"],
    e: ["eam", "eas", "eat", "eamus", "eatis", "eant"],
    i: ["iam", "ias", "iat", "iamus", "iatis", "iant"],
    mixed: ["iam", "ias", "iat", "iamus", "iatis", "iant"],
    consonant: ["am", "as", "at", "amus", "atis", "ant"]
  };

  const passiv = {
    a: ["er", "eris", "etur", "emur", "emini", "entur"],
    e: ["ear", "earis", "eatur", "eamur", "eamini", "eantur"],
    i: ["iar", "iaris", "iatur", "iamur", "iamini", "iantur"],
    mixed: ["iar", "iaris", "iatur", "iamur", "iamini", "iantur"],
    consonant: ["ar", "aris", "atur", "amur", "amini", "antur"]
  };

  return s + (genus === "aktiv" ? aktiv[v.type][index] : passiv[v.type][index]);
}

function generate() {
  const modus = document.getElementById("modus").value;
  const tempus = document.getElementById("tempus").value;
  const genus = document.getElementById("genus").value;

  if (modus === "konjunktiv" && tempus === "futur1") {
    current = null;
    document.getElementById("task").innerText =
      "Konjunktiv Futur I wird hier nicht abgefragt. Wähle bitte eine andere Zeit.";
    document.getElementById("feedback").innerText = "";
    return;
  }

  const verb = random(VERBS);
  const index = Math.floor(Math.random() * 6);
  const solution = formFor(verb, modus, tempus, genus, index);

  current = {
    solution,
    label: `${verb.infinitive} – ${PERSONS[index]} ${modus} ${TEMPUS_LABELS[tempus]} ${genus}`
  };

  document.getElementById("task").innerText = current.label;
  document.getElementById("answer").value = "";
  document.getElementById("feedback").innerText = "";
  document.getElementById("answer").focus();
}

function check() {
  if (!current) return;

  const input = normalize(document.getElementById("answer").value);

  if (!input) return;

  total++;

  if (input === current.solution) {
    score++;
    document.getElementById("feedback").innerHTML =
      "<span class='correct'>✔ Richtig!</span>";
  } else {
    document.getElementById("feedback").innerHTML =
      `<span class='wrong'>✖ Falsch. Richtig: ${current.solution}</span>`;
  }

  document.getElementById("score").innerText = score;
  document.getElementById("total").innerText = total;

  setTimeout(generate, 1400);
}

document.getElementById("newTaskBtn").addEventListener("click", generate);
document.getElementById("checkBtn").addEventListener("click", check);
document.getElementById("answer").addEventListener("keydown", function(e) {
  if (e.key === "Enter") check();
});
