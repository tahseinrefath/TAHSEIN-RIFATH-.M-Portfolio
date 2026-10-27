// ----- Intro typing effect -----
const introUrl = document.getElementById("introUrl");
const urlText = "www.tahseinrifath.dev";
let i = 0;
function typeUrl() {
  if (i <= urlText.length) {
    introUrl.textContent = urlText.slice(0, i);
    i++;
    setTimeout(typeUrl, 70);
  }
}
setTimeout(typeUrl, 600);

// ----- Live clock -----
const clockEl = document.getElementById("clock");
function updateClock() {
  const now = new Date();
  let h = now.getHours();
  const m = now.getMinutes().toString().padStart(2, "0");
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  clockEl.textContent = `${h}:${m} ${ampm}`;
}
updateClock();
setInterval(updateClock, 1000 * 30);

// ----- Mobile menu -----
const menuBtn = document.getElementById("menuBtn");
const menu = document.getElementById("menu");
menuBtn.addEventListener("click", () => {
  const isOpen = menu.classList.toggle("show");
  menuBtn.setAttribute("aria-expanded", isOpen);
});
document.querySelectorAll("nav a").forEach((link) => {
  link.addEventListener("click", () => menu.classList.remove("show"));
});

// ----- About overlay -----
const aboutOverlay = document.getElementById("aboutOverlay");
document.getElementById("aboutMeBtn").addEventListener("click", () => {
  aboutOverlay.classList.add("open");
});
document.getElementById("aboutBackBtn").addEventListener("click", () => {
  aboutOverlay.classList.remove("open");
});
aboutOverlay.addEventListener("click", (e) => {
  if (e.target === aboutOverlay) aboutOverlay.classList.remove("open");
});
// Navbar "About" link opens the About Me overlay
document.querySelectorAll('a[href="#about"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
    aboutOverlay.classList.add("open");
  });
});

// ----- Scroll reveal -----
const revealEls = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          el.classList.add("in");
          revealObserver.unobserve(el);
          // once revealed, hand the element back to its normal hover styles
          setTimeout(() => {
            el.classList.remove("reveal", "in");
            el.style.transitionDelay = "";
          }, 1100);
        }
      });
    },
    { threshold: 0.12 }
  );
  revealEls.forEach((el, idx) => {
    // small stagger for cards that sit side by side
    el.style.transitionDelay = (idx % 3) * 80 + "ms";
    revealObserver.observe(el);
  });
} else {
  revealEls.forEach((el) => el.classList.add("in"));
}

// ----- Project detail modal -----
const projectModal = document.getElementById("projectModal");
const pmTitle = document.getElementById("pmTitle");
const pmKicker = document.getElementById("pmKicker");
const pmBody = document.getElementById("pmBody");
const pmClose = document.getElementById("pmClose");
let lastTrigger = null;

function openProject(templateId, trigger) {
  const tpl = document.getElementById(templateId);
  if (!tpl) return;
  lastTrigger = trigger;
  pmTitle.innerHTML = tpl.dataset.title;
  pmKicker.textContent = tpl.dataset.kicker;
  pmBody.innerHTML = "";
  pmBody.appendChild(tpl.content.cloneNode(true));
  projectModal.querySelector(".proj-modal-card").scrollTop = 0;
  projectModal.classList.add("open");
  projectModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  pmClose.focus();
}

function closeProject() {
  projectModal.classList.remove("open");
  projectModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  if (lastTrigger) lastTrigger.focus();
}

document.querySelectorAll(".js-open-project").forEach((btn) => {
  btn.addEventListener("click", () => openProject(btn.dataset.template, btn));
});
pmClose.addEventListener("click", closeProject);
projectModal.addEventListener("click", (e) => {
  if (e.target === projectModal) closeProject();
});
document.addEventListener("keydown", (e) => {
  if (!projectModal.classList.contains("open")) return;
  if (e.key === "Escape") closeProject();
  if (e.key === "Tab") {
    // keep keyboard focus inside the dialog
    const focusables = projectModal.querySelectorAll("button, a[href]");
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
});

// ----- Skill proficiency bars + counters -----
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function levelWord(n) {
  if (n >= 85) return "Advanced";
  if (n >= 70) return "Proficient";
  if (n >= 55) return "Intermediate";
  return "Beginner";
}
document.querySelectorAll(".prof-row").forEach((row) => {
  row.querySelector(".prof-level").textContent = levelWord(Number(row.dataset.level));
});

function countUp(el) {
  const target = Number(el.dataset.target);
  if (reduceMotion) { el.textContent = target; return; }
  const duration = 1200;
  const start = performance.now();
  el.textContent = "0";
  function tick(now) {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.round(target * eased);
    if (t < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

if ("IntersectionObserver" in window) {
  const animObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const box = entry.target;
        box.classList.add("in-view");
        box.querySelectorAll(".count").forEach(countUp);
        animObserver.unobserve(box);
      });
    },
    { threshold: 0.12 }
  );
  document.querySelectorAll(".prof-card, .counter-strip").forEach((el) => animObserver.observe(el));
} else {
  document.querySelectorAll(".prof-card").forEach((el) => el.classList.add("in-view"));
}

// ----- Contact form -> WhatsApp -----
const waForm = document.getElementById("waForm");
waForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("waName").value.trim();
  const msg = document.getElementById("waMsg").value.trim();
  const text = encodeURIComponent(`Hi, I'm ${name}.\n\n${msg}`);
  window.open(`https://wa.me/919789530496?text=${text}`, "_blank");
});
