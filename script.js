const SOUNDS = {
  click: "assets/sounds/click.mp3",
  yes: "assets/sounds/Yayyy_ Sound Effect [8SoovMIylmA].mp3",
  no: "assets/sounds/Awh disappointed crowd sound effect [bR_wr5HRdl4].mp3",
  music: "assets/sounds/Funny Song (Original Version) by Funny Song Studio – Official Video [ORMRfFYMwVU].mp3",
};

const NAME = "Melina";

const steps = [
  { bear: "travel.png", text: `Hi ${NAME}! I'm David Bear. I have a little story for you. Shall we begin?`,
    buttons: [{ label: "Let's go!", next: true }] },
  { bear: "travel.png", text: "It started in Tainan, at NCKU Summer School. We explored Tainan, Alishan and Kenting together, and made so many unforgettable memories.",
    buttons: [{ label: "I remember!", next: true }] },
  { bear: "bubble-tea.png", text: "We drank so much bubble tea in Taiwan. I still smile when I think about it (you still owe me one by the way)",
    buttons: [{ label: "One more bubble tea?", next: true }] },
  { bear: "dumplings.png", text: "And we ate so much good food, especially jiaozi! That one place made good money from us.",
    buttons: [{ label: "Jiaozi was so good", next: true }] },
  { bear: "heat.png", text: "That Taiwan heat was intense, but suffering together made some pretty good memories too, I guess.",
    buttons: [{ label: "Worth it for the memories", next: true }] },
  { bear: "travel.png", text: "After that we texted so much, and learned even more about each other. But not everything yet.",
    buttons: [{ label: "Keep going, David Bear", next: true }] },
  { bear: "flowers.png", text: "Then we started sending each other all those flowers on Insta. I hope I get to give you a real bouquet one day.",
    buttons: [{ label: "A real bouquet would be lovely", next: true }] },
  { bear: "egypt.png", text: "Now I'm in Egypt too, and I really like spending time with you and seeing all these things together.",
    buttons: [{ label: "Me too", next: true }] },
  { bear: "ice-skating.png", text: "I hope we can go ice skating together sometime. I promise to try not to fall too much!",
    buttons: [{ label: "I'd hold your hand", next: true }] },
  { bear: "hiking.png", text: "I'd love to go hiking with you too and find a beautiful view to enjoy together.",
    buttons: [{ label: "Let's pick a trail", next: true }] },
  { bear: "movie-night.png", text: "And we should have a movie date: cozy seats, a good film, and snacks to share.",
    buttons: [{ label: "You choose the movie", next: true }] },
  { bear: "disneyland.png", text: "One day we'll make it to Disneyland together. That would be such a fun adventure!",
    buttons: [{ label: "Disneyland date!", next: true }] },
  { bear: "letter.png", text: `So, ${NAME}, would you like to make all those future memories with me as my girlfriend? 💖`,
    final: true,
    buttons: [{ label: "Yes!", yes: true }, { label: "No", no: true }] },
];

const noTexts = ["Are you sure? Please reconsider.", "Really sure? Please...", "Think again!", "David Bear is sad 🥺", "Pretty please?", "Just click Yes!"];

const $ = (id) => document.getElementById(id);
const bubble = $("bubble"), choices = $("choices"), photo = $("photo");
const bear = $("bear"), bearFiller = $("bearFiller");
const muteButton = $("mute"), musicVolume = $("musicVolume");

let muted = false;
let musicStarted = false;
let noCount = 0;
const audio = {};
for (const [k, src] of Object.entries(SOUNDS)) audio[k] = new Audio(src);
audio.music.loop = true;
audio.music.volume = Number(musicVolume.value) / 100;

function startMusic() {
  if (muted || musicStarted) return;
  musicStarted = true;
  audio.music.play().catch(() => { musicStarted = false; });
}

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
    if (b.next) el.onclick = () => { play("click"); startMusic(); render(i + 1); };
    if (b.yes) el.onclick = celebrate;
    if (b.no) {
      el.onclick = () => { play("no"); dodge(el); };
      el.onmouseenter = () => {
        if (noCount > 1) { play("no"); dodge(el); }
      };
    }
    choices.appendChild(el);
  });
}

function dodge(el) {
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

muteButton.onclick = () => {
  muted = !muted;
  muteButton.textContent = muted ? "🔇" : "🔊";
  muteButton.setAttribute("aria-label", muted ? "Turn sound on" : "Turn sound off");
  muteButton.setAttribute("aria-pressed", String(muted));
  Object.values(audio).forEach((sound) => { sound.muted = muted; });
  if (muted) audio.music.pause();
  else if (musicStarted) audio.music.play().catch(() => {});
  else startMusic();
};

musicVolume.addEventListener("input", () => {
  audio.music.volume = Number(musicVolume.value) / 100;
});

setInterval(() => !document.hidden && Math.random() < 0.3 && spawnHeart(), 1500);
render(0);
