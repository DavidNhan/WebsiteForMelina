// Asset paths: replace files in /assets using the same names (see docs/ASSETS.md).
const SOUNDS = {
  click: "assets/sounds/click.mp3",
  yes: "assets/sounds/yes.mp3",
  music: "assets/sounds/music.mp3",
};

const NAME = "Melina";

// Each step: bear text, optional photo, and buttons. "next" advances; "no" runs away.
const steps = [
  { text: `Hi ${NAME}! I'm Bruno the bear. I have a little surprise for you!`,
    buttons: [{ label: "Ooh, tell me!", next: true }] },
  { text: `I heard you're in Cairo right now. The pyramids, the Nile, so much sun!`,
    photo: "assets/images/cairo.jpg",
    buttons: [{ label: "Yes, it's amazing!", next: true }] },
  { text: `Even that far away, someone is thinking of you all the time...`,
    buttons: [{ label: "Who? 👀", next: true }] },
  { text: `Someone who thinks you're kind, funny and wonderful. Can you guess what he wants to ask?`,
    photo: "assets/images/us.jpg",
    buttons: [{ label: "Maybe...", next: true }, { label: "No idea!", next: true }] },
  { text: `${NAME}, will you be my girlfriend? 💖`,
    final: true,
    buttons: [{ label: "Yes!", yes: true }, { label: "No", no: true }] },
];

const noTexts = ["Are you sure?", "Really sure?", "Think again!", "Bruno is sad 🥺", "Pretty please?", "Just click Yes!"];

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

// Show the real bear image if present, else the emoji filler.
bear.classList.add("hidden");
bear.onload = () => { bear.classList.remove("hidden"); bearFiller.classList.add("hidden"); };

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
  setPhoto("assets/images/celebrate.jpg");
  bubble.textContent = `Yaaay! Thank you ${NAME}! Bruno is the happiest bear in the world! 🎉💖`;
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

bear.src = "assets/images/bear.png";
setInterval(() => !document.hidden && Math.random() < 0.3 && spawnHeart(), 1500);
render(0);
