const SOUNDS = {
  click: "assets/sounds/click.mp3",
  yes: "assets/sounds/yes.mp3",
  music: "assets/sounds/music.mp3",
};

const NAME = "Melina";

const steps = [
  { bear: "travel.png", text: `Hi ${NAME}! I'm David Bear. I have a little story for you. Shall we begin?`,
    buttons: [{ label: "Let's go!", next: true }] },
  { bear: "travel.png", text: "It started in Taiwan, at Summer School. We explored Alishan and Kenting, and made so many lovely memories.",
    buttons: [{ label: "I remember!", next: true }] },
  { bear: "bubble-tea.png", text: "We drank so much bubble tea, ate such good food, and somehow survived that incredible summer heat together!",
    buttons: [{ label: "That heat!", next: true }] },
  { bear: "heat.png", text: "We really did suffer through that heat together. Somehow it just became another favorite memory of ours.",
    buttons: [{ label: "Worth it for the memories", next: true }] },
  { bear: "dumplings.png", text: "I loved how naturally we connected. We're so similar, and spending time together just felt right.",
    buttons: [{ label: "Keep going, David Bear", next: true }] },
  { bear: "flowers.png", text: "Then we started sending each other all those flowers on Instagram Reels. I hope I get to give you a real bouquet one day.",
    buttons: [{ label: "A real bouquet would be lovely", next: true }] },
  { bear: "egypt.png", text: "Now I'm in Egypt too, and I really like spending time with you and seeing all these things together.",
    buttons: [{ label: "Me too", next: true }] },
  { bear: "ice-skating.png", text: "I hope we have lots more dates ahead: ice skating, hiking, movie nights, and maybe even Disneyland!",
    buttons: [{ label: "That sounds wonderful", next: true }] },
  { bear: "letter.png", text: `So, ${NAME}, would you like to make all those future memories with me as my girlfriend? 💖`,
    final: true,
    buttons: [{ label: "Yes!", yes: true }, { label: "No", no: true }] },
];

const noTexts = ["Are you sure?", "Really sure?", "Think again!", "David Bear is sad 🥺", "Pretty please?", "Just click Yes!"];

const $ = (id) => document.getElementById(id);
const bubble = $("bubble"), choices = $("choices"), photo = $("photo");
const bear = $("bear"), bearFiller = $("bearFiller");

let muted = false;
let noCount = 0;
const audio = {};
for (const [k, src] of Object.entries(SOUNDS)) audio[k] = new Audio(src);
audio.music.loop = true;
audio.music.volume = 0.4;

function play(name) {
  if (muted) return;
  audio[name].currentTime = 0;
  audio[name].play().catch(() => {}); // file may not exist yet
}

function setBear(src) {
  bear.classList.add("hidden");
  bear.onload = () => { bear.classList.remove("hidden"); bearFiller.classList.add("hidden"); };
  bear.onerror = () => { bearFiller.classList.remove("hidden"); };
  bear.src = `assets/images/${src}`;
}

function setPhoto(src) {
  if (!src) { photo.classList.remove("show"); return; }
  const img = new Image();
  img.onload = () => { photo.style.backgroundImage = `url(${src})`; $("photoFiller").hidden = true; };
  img.onerror = () => { photo.style.backgroundImage = ""; $("photoFiller").hidden = false; };
  img.src = src;
  photo.classList.add("show");
}

function render(i) {
  const s = steps[i];
  bubble.textContent = s.text;
  bubble.style.animation = "none"; bubble.offsetWidth; bubble.style.animation = "";
  setBear(s.bear);
  setPhoto(s.photo);
  choices.innerHTML = "";
  s.buttons.forEach((b) => {
    const el = document.createElement("button");
    el.className = "btn" + (b.no ? " alt" : "");
    el.textContent = b.label;
    if (b.next) el.onclick = () => { play("click"); audio.music.paused && !muted && audio.music.play().catch(() => {}); render(i + 1); };
    if (b.yes) el.onclick = celebrate;
    if (b.no) {
      el.onclick = () => dodge(el);
      el.onmouseenter = () => noCount > 1 && dodge(el);
    }
    choices.appendChild(el);
  });
}

function dodge(el) {
  play("click");
  bubble.textContent = noTexts[Math.min(noCount, noTexts.length - 1)];
  noCount++;
  const yes = choices.querySelector(".btn:not(.alt)");
  yes.style.transform = `scale(${1 + noCount * 0.15})`;
  if (noCount > 1) {
    el.classList.add("runaway");
    el.style.left = Math.random() * (innerWidth - el.offsetWidth - 20) + 10 + "px";
    el.style.top = Math.random() * (innerHeight - el.offsetHeight - 20) + 10 + "px";
  }
}

function celebrate() {
  play("yes");
  [bear, bearFiller].forEach((e) => e.classList.add("happy"));
  setBear("heart.png");
  bubble.textContent = `Yaaay! Thank you, ${NAME}! David Bear is giving you his heart. I can't wait for all our little adventures together! 🎉💖`;
  choices.innerHTML = "";
  for (let i = 0; i < 60; i++) setTimeout(spawnHeart, i * 80);
}

function spawnHeart() {
  const h = document.createElement("span");
  h.className = "heart";
  h.textContent = ["💖", "💗", "💕", "🌹"][Math.floor(Math.random() * 4)];
  h.style.left = Math.random() * 100 + "vw";
  h.style.fontSize = 18 + Math.random() * 26 + "px";
  h.style.animationDuration = 4 + Math.random() * 4 + "s";
  $("hearts").appendChild(h);
  setTimeout(() => h.remove(), 8500);
}

$("mute").onclick = () => {
  muted = !muted;
  $("mute").textContent = muted ? "🔇" : "🔊";
  muted ? audio.music.pause() : audio.music.play().catch(() => {});
};

setInterval(() => !document.hidden && Math.random() < 0.3 && spawnHeart(), 1500);
render(0);
