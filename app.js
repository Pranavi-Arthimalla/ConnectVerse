

const INTERESTS = ["Chess", "Coding", "Painting", "Music", "Movies", "Fitness", "Cooking", "Photography"];
const TAGS = ["tournaments", "open-source", "leetcode", "watercolor", "anime", "indie-films", "lofi", "startup", "mentorship", "beginner-friendly"];
const SKILL_LEVELS = ["Beginner", "Intermediate", "Advanced"];
const QUOTES = [
  "You don't need to be loud to be powerful.",
  "Calm mind. Strong heart.",
  "Progress is still progress, even quietly.",
  "Silence is sometimes the best answer.",
  "Small steps daily become big wins."
];


const QUIZ = {
  Chess: [
    { q:"Best opening principle?", a:["Attack immediately", "Develop pieces & control center", "Move queen early", "Only move pawns"], correct:1 },
    { q:"A fork is…", a:["A sacrifice", "Double attack", "A draw offer", "A checkmate"], correct:1 },
  ],
  Coding: [
    { q:"Which is a loop?", a:["if", "for", "switch", "case"], correct:1 },
    { q:"What does HTML do?", a:["Styles", "Logic", "Structure", "Database"], correct:2 },
  ],
  Painting: [
    { q:"Primary colors are…", a:["Red, Blue, Yellow", "Green, Orange, Purple", "Black, White, Gray", "Pink, Brown, Cyan"], correct:0 },
    { q:"Watercolor works best with…", a:["Very oily paper", "Thick plastic", "Water-friendly paper", "Metal sheets"], correct:2 },
  ],
  Music: [
    { q:"Tempo means…", a:["Volume", "Speed", "Lyrics", "Instrument"], correct:1 },
    { q:"A chord is…", a:["Single note", "Two or more notes together", "Only drums", "A pause"], correct:1 },
  ],
  Movies: [
    { q:"A screenplay is…", a:["Movie poster", "Story script", "Camera", "Lighting"], correct:1 },
    { q:"Genre is…", a:["A color", "A movie category", "A brand", "A ticket"], correct:1 },
  ],
  Fitness: [
    { q:"Progressive overload means…", a:["Same workout forever", "Gradually increasing challenge", "Never rest", "Only cardio"], correct:1 },
    { q:"Warm-up helps…", a:["Injury risk down", "Zero benefits", "Only for pros", "Only at night"], correct:0 },
  ],
  Cooking: [
    { q:"Sauté means…", a:["Cook quickly in a little oil", "Boil for hours", "Freeze food", "Eat raw"], correct:0 },
    { q:"Umami is…", a:["Sweet", "Sour", "Savory", "Bitter"], correct:2 },
  ],
  Photography: [
    { q:"ISO affects…", a:["Light sensitivity", "Zoom", "Color only", "Battery"], correct:0 },
    { q:"Rule of thirds helps…", a:["Composition", "Charging", "Speed", "Storage"], correct:0 },
  ]
};

const LS = {
  ME: "cv_me",
  PARTNER: "cv_partner",
  STATS: "cv_stats",
  HISTORY: "cv_history",
  DM: "cv_dm",
  CLUBS: "cv_clubs",
  SESSIONS: "cv_sessions",
  THEME: "cv_theme",
  DARK: "cv_dark",
  SHIELD: "cv_shield",
  STREAK_DATE: "cv_streak_date"
};

const $ = (id)=>document.getElementById(id);


document.querySelectorAll(".tab").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    document.querySelectorAll(".tab").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");

    const v = btn.dataset.view;
    document.querySelectorAll(".view").forEach(sec=>sec.classList.remove("active"));
    $(v).classList.add("active");

    if(v==="clubsView") renderClubs();
    if(v==="gamesView") renderProgressAndBadges();
    if(v==="profileView") renderProfile();
    if(v==="teachView") renderTeach();
  });
});

$("themeSelect").addEventListener("change", (e)=>{
  setTheme(e.target.value);
});
$("darkBtn").addEventListener("click", ()=>{
  const isDark = document.body.classList.toggle("dark");
  localStorage.setItem(LS.DARK, isDark ? "1":"0");
});
$("shieldBtn").addEventListener("click", ()=>{
  const current = localStorage.getItem(LS.SHIELD)==="1";
  localStorage.setItem(LS.SHIELD, current ? "0":"1");
  applyShield();
});

function setTheme(themeClass){

  document.body.classList.remove("theme-mint","theme-sky","theme-blush","theme-sunset","theme-lavender");
  document.body.classList.add(themeClass);
  localStorage.setItem(LS.THEME, themeClass);
}
function applyThemeFromStorage(){
  const t = localStorage.getItem(LS.THEME) || "theme-mint";
  $("themeSelect").value = t;
  setTheme(t);
  const d = localStorage.getItem(LS.DARK)==="1";
  if(d) document.body.classList.add("dark");
}
function applyShield(){
  const on = localStorage.getItem(LS.SHIELD)==="1";
  $("shieldBtn").textContent = on ? "Comfort Shield ON" : "Comfort Shield";
  if(on){
    $("homeMsg").textContent = "🛡 Comfort Shield is ON. You can browse quietly without notifications pressure.";
  }
}

function buildChips(containerId, items, onToggle){
  const wrap = $(containerId);
  wrap.innerHTML = "";
  items.forEach(item=>{
    const chip = document.createElement("div");
    chip.className = "chip";
    chip.textContent = item;
    chip.addEventListener("click", ()=>{
      chip.classList.toggle("on");
      onToggle?.(item, chip.classList.contains("on"));
    });
    wrap.appendChild(chip);
  });
}
function selectedChips(containerId){
  return Array.from($(containerId).querySelectorAll(".chip.on")).map(c=>c.textContent);
}

function buildSkills(containerId, interests){
  const wrap = $(containerId);
  wrap.innerHTML = "";
  interests.forEach(name=>{
    const row = document.createElement("div");
    row.className = "skill-row";
    row.innerHTML = `
      <div class="label">${name}</div>
      <select data-skill="${name}">
        ${SKILL_LEVELS.map(s=>`<option value="${s}">${s}</option>`).join("")}
      </select>
    `;
    wrap.appendChild(row);
  });
}
function readSkills(containerId){
  const map = {};
  $(containerId).querySelectorAll("select").forEach(sel=>{
    map[sel.dataset.skill] = sel.value;
  });
  return map;
}
function setSkills(containerId, skillsMap){
  $(containerId).querySelectorAll("select").forEach(sel=>{
    const k = sel.dataset.skill;
    if(skillsMap?.[k]) sel.value = skillsMap[k];
  });
}

function loadJSON(key, fallback){
  try{ return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch{ return fallback; }
}
function saveJSON(key, val){
  localStorage.setItem(key, JSON.stringify(val));
}

function getStats(){
  return loadJSON(LS.STATS, { xp: 0, level: 1, streak: 0, helped: 0, gamesWon: 0 });
}
function setStats(s){
  saveJSON(LS.STATS, s);
}
function computeLevel(xp){
  return Math.floor(xp/100) + 1;
}
function badgesFor(stats){
  const badges = [];
  if(stats.level >= 3) badges.push("🥉 Explorer");
  if(stats.level >= 7) badges.push("🥈 Builder");
  if(stats.level >= 12) badges.push("🥇 Mentor");
  if(stats.level >= 20 && stats.gamesWon >= 10) badges.push("🏆 Pro");
  if(stats.helped >= 5) badges.push("💚 Helper");
  return badges;
}
function addXP(amount, reason){
  const s = getStats();
  s.xp += amount;
  s.level = computeLevel(s.xp);
  setStats(s);
  if(reason) toast(`${reason} (+${amount} XP)`);
}


function toast(msg){
  const el = document.createElement("div");
  el.className = "note";
  el.style.position = "fixed";
  el.style.right = "16px";
  el.style.bottom = "16px";
  el.style.zIndex = 50;
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(()=>el.remove(), 1800);
}


function initHome(){
  
  $("quoteBox").textContent = `🌿 ${QUOTES[Math.floor(Math.random()*QUOTES.length)]}`;

  buildChips("myInterests", INTERESTS, ()=>{
    buildSkills("mySkills", selectedChips("myInterests"));
  });
  buildChips("pInterests", INTERESTS, ()=>{
    buildSkills("pSkills", selectedChips("pInterests"));
  });

  buildChips("myTags", TAGS);
  buildChips("pTags", TAGS);

  buildSkills("mySkills", []);
  buildSkills("pSkills", []);

  
  const catSel = $("tCategory");
  const gameSel = $("gameTopic");
  catSel.innerHTML = INTERESTS.map(x=>`<option>${x}</option>`).join("");
  gameSel.innerHTML = INTERESTS.map(x=>`<option>${x}</option>`).join("");

 
  $("saveMeBtn").addEventListener("click", saveMe);
  $("loadDemoBtn").addEventListener("click", loadDemo);
  $("randomPartnerBtn").addEventListener("click", randomPartner);
  $("computeBtn").addEventListener("click", computeCompatibility);

  $("startChatBtn").addEventListener("click", ()=>toast("Chat ready ✅"));
  $("joinClubBtn").addEventListener("click", joinBestClub);

  $("dmSend").addEventListener("click", sendDM);
  $("clubSend").addEventListener("click", sendClubMsg);
  $("helpfulBtn").addEventListener("click", ()=>{
    const s = getStats();
    s.helped += 1;
    setStats(s);
    addXP(15, "Helpful contribution");
    renderProgressAndBadges();
  });

  $("newQBtn").addEventListener("click", renderQuestion);
  $("streakBtn").addEventListener("click", claimStreak);
  $("resetBtn").addEventListener("click", resetDemo);
  $("createSessionBtn").addEventListener("click", createSession);

  $("gameTopic").addEventListener("change", renderQuestion);

  loadProfilesToUI();
  renderQuestion();
  renderProgressAndBadges();
  renderProfile();
  renderTeach();
  renderClubs();
  renderDM();
}


function saveMe(){
  const me = {
    name: $("myName").value.trim(),
    style: $("myStyle").value,
    interests: selectedChips("myInterests"),
    skills: readSkills("mySkills"),
    tags: selectedChips("myTags").slice(0,3)
  };
  if(!me.name || me.interests.length===0){
    $("homeMsg").textContent = "Please add nickname + at least one interest.";
    return;
  }
  saveJSON(LS.ME, me);
  $("homeMsg").textContent = "✅ Saved your profile.";
  toast("Profile saved");
  ensureClubsSeed();
  renderClubs();
  renderProfile();
}

function loadProfilesToUI(){
  const me = loadJSON(LS.ME, null);
  const p = loadJSON(LS.PARTNER, null);

  if(me){
    $("myName").value = me.name || "";
    $("myStyle").value = me.style || "async";
    
    setChipSelection("myInterests", me.interests);
    buildSkills("mySkills", selectedChips("myInterests"));
    setSkills("mySkills", me.skills);
    setChipSelection("myTags", me.tags);
  }

  if(p){
    $("pName").value = p.name || "";
    $("pStyle").value = p.style || "async";
    setChipSelection("pInterests", p.interests);
    buildSkills("pSkills", selectedChips("pInterests"));
    setSkills("pSkills", p.skills);
    setChipSelection("pTags", p.tags);
  }
}

function setChipSelection(containerId, selected){
  const set = new Set(selected || []);
  $(containerId).querySelectorAll(".chip").forEach(ch=>{
    if(set.has(ch.textContent)) ch.classList.add("on");
    else ch.classList.remove("on");
  });
}

function loadDemo(){
  const me = {
    name: "SilentKnight",
    style: "async",
    interests: ["Chess","Coding","Music"],
    skills: { Chess:"Intermediate", Coding:"Intermediate", Music:"Beginner" },
    tags: ["tournaments","leetcode","lofi"]
  };
  saveJSON(LS.ME, me);

  const p = {
    name: "CodeMonk",
    style: "async",
    interests: ["Coding","Chess","Photography"],
    skills: { Coding:"Intermediate", Chess:"Beginner", Photography:"Beginner" },
    tags: ["open-source","tournaments","beginner-friendly"]
  };
  saveJSON(LS.PARTNER, p);

  loadProfilesToUI();
  $("homeMsg").textContent = "✅ Demo loaded. Compute compatibility now.";
  toast("Demo loaded");
  ensureClubsSeed();
  renderClubs();
}

function randomPartner(){
  const pick = (arr, n)=>{
    const a=[...arr].sort(()=>Math.random()-0.5);
    return a.slice(0,n);
  };
  const ints = pick(INTERESTS, 3);
  const tags = pick(TAGS, 3);
  const skills = {};
  ints.forEach(i=>skills[i]=SKILL_LEVELS[Math.floor(Math.random()*SKILL_LEVELS.length)]);
  const p = {
    name: ["QuietCoder","ArtMoss","ChessFox","PixelSage","CalmLearner"][Math.floor(Math.random()*5)],
    style: ["async","text","voice"][Math.floor(Math.random()*3)],
    interests: ints,
    skills,
    tags
  };
  saveJSON(LS.PARTNER, p);
  loadProfilesToUI();
  toast("Partner randomized");
}

function normalizeSkill(s){
  if(s==="Beginner") return 1;
  if(s==="Intermediate") return 2;
  if(s==="Advanced") return 3;
  return 1;
}

function computeCompatibility(){
  const me = loadJSON(LS.ME, null);
  const p = {
    name: $("pName").value.trim(),
    style: $("pStyle").value,
    interests: selectedChips("pInterests"),
    skills: readSkills("pSkills"),
    tags: selectedChips("pTags").slice(0,3)
  };

  if(!me){
    $("compatBox").textContent = "Save your profile first.";
    return;
  }
  if(!p.name || p.interests.length===0){
    $("compatBox").textContent = "Add partner nickname + at least one interest.";
    return;
  }
  saveJSON(LS.PARTNER, p);

  const a = new Set(me.interests);
  const b = new Set(p.interests);
  const shared = [...a].filter(x=>b.has(x));
  const union = new Set([...me.interests, ...p.interests]);
  const interestScore = union.size ? (shared.length / union.size) * 60 : 0;

 
  let skillScore = 0;
  if(shared.length){
    let sum = 0;
    shared.forEach(i=>{
      const d = Math.abs(normalizeSkill(me.skills[i]) - normalizeSkill(p.skills[i]));
    
      const closeness = Math.max(0, 1 - (d/3));
      sum += closeness;
    });
    skillScore = (sum / shared.length) * 20;
  }

  const mt = new Set(me.tags);
  const pt = new Set(p.tags);
  const sharedTags = [...mt].filter(x=>pt.has(x));
  const tagScore = (sharedTags.length / 3) * 10;

  const styleScore = (me.style === p.style) ? 10 : 4;

  const total = Math.round(interestScore + skillScore + tagScore + styleScore);
  const breakdown = {
    total,
    interest: Math.round(interestScore),
    skill: Math.round(skillScore),
    tags: Math.round(tagScore),
    style: Math.round(styleScore),
    sharedInterests: shared,
    sharedTags
  };

  renderCompatBox(me, p, breakdown);
  saveMatchHistory(me, p, breakdown);

  
  document.querySelector('[data-view="matchView"]').click();
}

function renderCompatBox(me, p, b){
  $("compatBox").innerHTML = `
    <div class="big">Compatibility: ${b.total}% 💚</div>
    <div class="muted">Shared interests: ${b.sharedInterests.join(", ") || "None yet"}</div>
    <div class="muted">Shared tags: ${b.sharedTags.join(", ") || "None yet"}</div>
  `;
  $("matchSummary").innerHTML = `
    ${me.name} 🤝 ${p.name}<br/>
    <span class="muted">You match best through: ${b.sharedInterests[0] || "new discovery"}</span>
  `;

  $("breakdown").innerHTML = `
    <div class="break-item"><b>Interests</b>${b.interest}/60</div>
    <div class="break-item"><b>Skill vibe</b>${b.skill}/20</div>
    <div class="break-item"><b>Tags</b>${b.tags}/10</div>
    <div class="break-item"><b>Chat style</b>${b.style}/10</div>
  `;

  renderDM();
}

function saveMatchHistory(me, p, b){
  const hist = loadJSON(LS.HISTORY, []);
  hist.unshift({
    when: new Date().toLocaleString(),
    me: me.name,
    partner: p.name,
    score: b.total,
    shared: b.sharedInterests.slice(0,3)
  });
  saveJSON(LS.HISTORY, hist.slice(0,10));
  renderHistory();
}

function joinBestClub(){
  const me = loadJSON(LS.ME, null);
  const p = loadJSON(LS.PARTNER, null);
  if(!me || !p) return toast("Compute compatibility first");
  const shared = me.interests.filter(x=>p.interests.includes(x));
  const club = shared[0] || me.interests[0] || "Coding";
  localStorage.setItem("cv_active_club", club);
  toast(`Joined ${club} Club`);
  document.querySelector('[data-view="clubsView"]').click();
  renderClubs();
}


function dmKey(){
  const me = loadJSON(LS.ME, {name:"Me"});
  const p = loadJSON(LS.PARTNER, {name:"Partner"});
  return `${LS.DM}_${me.name}_${p.name}`;
}
function renderDM(){
  const key = dmKey();
  const msgs = loadJSON(key, []);
  const chat = $("dmChat");
  chat.innerHTML = "";
  msgs.forEach(m=>{
    const div = document.createElement("div");
    div.className = `msg ${m.who}`;
    div.innerHTML = `
      <div class="bubble">
        ${escapeHTML(m.text)}
        <div class="meta">${m.time}</div>
      </div>
    `;
    chat.appendChild(div);
  });
  chat.scrollTop = chat.scrollHeight;
}
function sendDM(){
  const me = loadJSON(LS.ME, null);
  const p = loadJSON(LS.PARTNER, null);
  if(!me || !p) return toast("Create a match first");

  const text = $("dmInput").value.trim();
  if(!text) return;

  const key = dmKey();
  const msgs = loadJSON(key, []);
  msgs.push({ who:"me", text, time: new Date().toLocaleTimeString() });

  msgs.push({
    who:"them",
    text: autoReply(text),
    time: new Date().toLocaleTimeString()
  });

  saveJSON(key, msgs.slice(-40));
  $("dmInput").value = "";
  renderDM();

  addXP(5, "Sent a thoughtful message");
  renderProgressAndBadges();
}

function autoReply(text){
  const replies = [
    "That’s interesting — can you tell me more?",
    "I relate to that. What got you into it?",
    "Nice! Want to share a resource or example?",
    "I like that idea. What would be a next step?",
    "Cool perspective. What do you want to learn next?"
  ];

  if(text.toLowerCase().includes("hi")) return "Hi! 😊 What interest are you exploring today?";
  return replies[Math.floor(Math.random()*replies.length)];
}


function ensureClubsSeed(){
  const clubs = loadJSON(LS.CLUBS, null);
  if(clubs) return;

  const seed = {};
  INTERESTS.forEach(i=>{
    seed[i] = [
      { who:"them", text:`Welcome to ${i} Club! Share a goal for this week.`, time:"—" }
    ];
  });
  saveJSON(LS.CLUBS, seed);
}

function renderClubs(){
  ensureClubsSeed();
  const clubs = loadJSON(LS.CLUBS, {});
  const active = localStorage.getItem("cv_active_club") || "Coding";

  const list = $("clubList");
  list.innerHTML = "";
  INTERESTS.forEach(name=>{
    const item = document.createElement("div");
    item.className = "club-item";
    item.innerHTML = `
      <div>
        <div style="font-weight:800">${name} Club</div>
        <div class="muted tiny">${clubs[name]?.length || 0} messages</div>
      </div>
      <button class="btn small ${name===active ? "primary":""}">Open</button>
    `;
    item.querySelector("button").addEventListener("click", ()=>{
      localStorage.setItem("cv_active_club", name);
      renderClubs();
    });
    list.appendChild(item);
  });

  $("clubTitle").textContent = `${active} Club Chat`;
  renderClubChat(active);
}

function renderClubChat(clubName){
  const clubs = loadJSON(LS.CLUBS, {});
  const msgs = clubs[clubName] || [];
  const chat = $("clubChat");
  chat.innerHTML = "";
  msgs.forEach(m=>{
    const div = document.createElement("div");
    div.className = `msg ${m.who}`;
    div.innerHTML = `
      <div class="bubble">
        ${escapeHTML(m.text)}
        <div class="meta">${m.time}</div>
      </div>
    `;
    chat.appendChild(div);
  });
  chat.scrollTop = chat.scrollHeight;
}

function sendClubMsg(){
  const me = loadJSON(LS.ME, null);
  if(!me) return toast("Save your profile first");
  const club = localStorage.getItem("cv_active_club") || "Coding";

  const text = $("clubInput").value.trim();
  if(!text) return;

  const clubs = loadJSON(LS.CLUBS, {});
  clubs[club] = clubs[club] || [];
  clubs[club].push({ who:"me", text, time: new Date().toLocaleTimeString() });

  if(Math.random() < 0.55){
    clubs[club].push({ who:"them", text: autoReply(text), time: new Date().toLocaleTimeString() });
  }

  saveJSON(LS.CLUBS, clubs);
  $("clubInput").value = "";
  renderClubs();

  addXP(8, "Shared in a club");
  renderProgressAndBadges();
}

let currentQuestion = null;

function renderQuestion(){
  const topic = $("gameTopic").value || "Coding";
  const bank = QUIZ[topic] || QUIZ.Coding;
  currentQuestion = bank[Math.floor(Math.random()*bank.length)];

  $("qTitle").textContent = `${topic} Challenge`;
  $("qBody").textContent = currentQuestion.q;

  const wrap = $("qOptions");
  wrap.innerHTML = "";
  currentQuestion.a.forEach((opt, idx)=>{
    const btn = document.createElement("button");
    btn.className = "opt";
    btn.textContent = opt;
    btn.addEventListener("click", ()=>answerQuestion(idx, btn));
    wrap.appendChild(btn);
  });

  $("gameMsg").textContent = "Answer correctly to earn XP.";
}

function answerQuestion(idx, btn){
  const opts = Array.from($("qOptions").querySelectorAll(".opt"));
  opts.forEach(o=>o.disabled = true);

  if(idx === currentQuestion.correct){
    btn.classList.add("good");
    $("gameMsg").textContent = "✅ Correct! +20 XP";
    addXP(20, "Challenge completed");

    const s = getStats();
    s.gamesWon += 1;
    setStats(s);

  } else {
    btn.classList.add("bad");
    opts[currentQuestion.correct].classList.add("good");
    $("gameMsg").textContent = "❌ Not quite. +5 XP for trying";
    addXP(5, "Attempted challenge");
  }

  renderProgressAndBadges();
}

function renderProgressAndBadges(){
  const s = getStats();
  const b = badgesFor(s);

  $("progressBox").innerHTML = `
    <div><b>XP:</b> ${s.xp}</div>
    <div><b>Level:</b> ${s.level}</div>
    <div><b>Games Won:</b> ${s.gamesWon}</div>
    <div><b>Helpful Actions:</b> ${s.helped}</div>
    <div class="muted tiny">Next level at ${(s.level*100)} XP</div>
  `;

  $("badgeBox").innerHTML = b.length
    ? b.map(x=>`<span class="badge">${x}</span>`).join("")
    : `<span class="muted">No badges yet — play a challenge!</span>`;

  renderTeach();
  renderProfile();
}

function renderProfile(){
  const me = loadJSON(LS.ME, null);
  const s = getStats();
  const b = badgesFor(s);

  if(!me){
    $("profileCard").innerHTML = `<div class="muted">Save your profile on Home tab.</div>`;
    renderHistory();
    return;
  }

  $("profileCard").innerHTML = `
    <div class="big">${me.name} ${b.some(x=>x.includes("Pro")) ? "🏆" : ""}</div>
    <div class="muted">Chat style: ${me.style}</div>
    <div style="margin-top:8px"><b>Interests:</b> ${me.interests.join(", ")}</div>
    <div><b>Tags:</b> ${me.tags.join(", ") || "-"}</div>
    <div style="margin-top:8px"><b>Level:</b> ${s.level} • <b>XP:</b> ${s.xp} • <b>Streak:</b> ${s.streak}</div>
    <div style="margin-top:8px"><b>Badges:</b> ${b.length ? b.join(" • ") : "None yet"}</div>
  `;

  renderHistory();
}

function renderHistory(){
  const hist = loadJSON(LS.HISTORY, []);
  $("historyBox").innerHTML = hist.length
    ? hist.map(h=>`
        <div class="history-item">
          <div><b>${h.me}</b> ↔ <b>${h.partner}</b> • <b>${h.score}%</b></div>
          <div class="muted tiny">${h.when}</div>
          <div class="muted tiny">Shared: ${h.shared.join(", ") || "—"}</div>
        </div>
      `).join("")
    : `<div class="muted">No matches yet. Compute compatibility on Home.</div>`;
}


function canTeach(stats){
 
  const b = badgesFor(stats);
  return b.some(x=>x.includes("Mentor")) || b.some(x=>x.includes("Pro"));
}

function renderTeach(){
  const me = loadJSON(LS.ME, null);
  const s = getStats();

  if(!me){
    $("teachLock").textContent = "Save your profile first on Home.";
    $("teachForm").style.display = "none";
    renderSessions();
    return;
  }

  if(!canTeach(s)){
    $("teachLock").innerHTML = `🔒 Teach unlocks at <b>Mentor (Level 12)</b>. Keep playing challenges & helping in clubs!`;
    $("teachForm").style.display = "none";
  } else {
    $("teachLock").innerHTML = `✅ Unlocked! Create a session and teach others like Udemy.`;
    $("teachForm").style.display = "block";
  }

  renderSessions();
}

function createSession(){
  const me = loadJSON(LS.ME, null);
  if(!me) return;

  const title = $("tTitle").value.trim();
  const cat = $("tCategory").value;
  const dur = $("tDuration").value;
  const desc = $("tDesc").value.trim();

  if(!title || !desc){
    toast("Add title + description");
    return;
  }

  const sessions = loadJSON(LS.SESSIONS, []);
  sessions.unshift({
    title, cat, dur, desc,
    host: me.name,
    created: new Date().toLocaleString()
  });
  saveJSON(LS.SESSIONS, sessions.slice(0,20));

  $("tTitle").value = "";
  $("tDesc").value = "";

  addXP(50, "Hosted a session");
  renderSessions();
  renderProgressAndBadges();
}

function renderSessions(){
  const sessions = loadJSON(LS.SESSIONS, []);
  $("sessionList").innerHTML = sessions.length
    ? sessions.map(s=>`
      <div class="session">
        <div class="top">
          <div><b>${escapeHTML(s.title)}</b><div class="muted tiny">${s.cat} • ${s.dur}</div></div>
          <div class="badge">Host: ${escapeHTML(s.host)}</div>
        </div>
        <div style="margin-top:8px">${escapeHTML(s.desc)}</div>
        <div class="muted tiny" style="margin-top:8px">Created: ${escapeHTML(s.created)}</div>
      </div>
    `).join("")
    : `<div class="muted">No sessions yet. Unlock Mentor and create one!</div>`;
}


function claimStreak(){
  const last = localStorage.getItem(LS.STREAK_DATE);
  const today = new Date().toDateString();
  if(last === today){
    $("profileMsg").textContent = "You already claimed today's streak ✅";
    return;
  }
  localStorage.setItem(LS.STREAK_DATE, today);
  const s = getStats();
  s.streak += 1;
  setStats(s);
  addXP(10, "Daily streak");
  $("profileMsg").textContent = `🔥 Streak claimed! Current streak: ${s.streak}`;
  renderProgressAndBadges();
}

function resetDemo(){
  Object.values(LS).forEach(k=>{
   
    if(typeof k === "string") localStorage.removeItem(k);
  });

  Object.keys(localStorage).forEach(k=>{
    if(k.startsWith("cv_dm_") || k.startsWith("cv_dm")) localStorage.removeItem(k);
  });
  localStorage.removeItem("cv_active_club");
  location.reload();
}


function escapeHTML(str){
  return String(str)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}


function boot(){
  applyThemeFromStorage();
  ensureClubsSeed();
  applyShield();
  initHome();
  renderHistory();
}
boot();

