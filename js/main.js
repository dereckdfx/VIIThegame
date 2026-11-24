(() => {
  "use strict";

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const params = new URLSearchParams(location.search);
  const introMode = params.get("intro");
  const body = document.body;
  const intro = document.getElementById("intro");
  const menu = document.getElementById("menu");
  const navToggle = document.querySelector("[data-nav-toggle]");
  const poster = document.querySelector("[data-poster]");
  const heroImage = document.querySelector("[data-hero-image]");
  const lightbox = document.getElementById("lightbox");

  function closeIntro() {
    if (!intro || intro.classList.contains("is-out")) return;
    intro.classList.add("is-out");
    body.classList.remove("is-intro");
    intro.setAttribute("aria-hidden", "true");
    const hide = () => intro.classList.add("is-gone");
    if (reduce) hide();
    else setTimeout(hide, 850);
  }

  function setupStarStroke() {
    const draw = intro && intro.querySelector(".star-draw");
    const spark = intro && intro.querySelector(".star-spark");
    if (!draw) return;
    const len = Math.ceil(draw.getTotalLength());
    draw.style.strokeDasharray = String(len);
    draw.style.strokeDashoffset = String(len);
    if (spark) spark.style.strokeDasharray = `14 ${len}`;
  }

  function imageReady(img, ms) {
    if (!img) return Promise.resolve();
    if (img.complete && img.naturalWidth) return Promise.resolve();
    return new Promise((resolve) => {
      const done = () => {
        clearTimeout(t);
        resolve();
      };
      const t = setTimeout(done, ms);
      img.addEventListener("load", done, { once: true });
      img.addEventListener("error", done, { once: true });
      if (typeof img.decode === "function") {
        img.decode().then(done).catch(done);
      }
    });
  }

  async function startIntro() {
    if (!intro) {
      body.classList.remove("is-intro");
      return;
    }
    setupStarStroke();

    if (introMode === "hold") return;
    if (introMode === "0" || introMode === "skip") {
      intro.classList.add("is-out", "is-gone");
      body.classList.remove("is-intro");
      return;
    }
    if (reduce) {
      setTimeout(closeIntro, 400);
      return;
    }

    const started = performance.now();
    await imageReady(heroImage, 4000);
    const elapsed = performance.now() - started;
    const wait = Math.max(0, 4000 - elapsed);
    setTimeout(closeIntro, wait);
    setTimeout(closeIntro, 8000);
  }

  startIntro();

  const setMenu = (open) => {
    if (!menu || !navToggle) return;
    if (open) menu.hidden = false;
    requestAnimationFrame(() => {
      menu.classList.toggle("is-open", open);
      navToggle.classList.toggle("is-open", open);
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      body.classList.toggle("is-menu", open);
      if (!open) {
        const hide = () => {
          if (!menu.classList.contains("is-open")) menu.hidden = true;
        };
        if (reduce) hide();
        else setTimeout(hide, 450);
      }
    });
  };

  if (navToggle && menu) {
    navToggle.addEventListener("click", () => setMenu(!menu.classList.contains("is-open")));
    menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  }

  if (poster && !reduce) {
    let ticking = false;
    const update = () => {
      ticking = false;
      const y = window.scrollY;
      const h = Math.max(window.innerHeight, 1);
      const p = Math.min(1, Math.max(0, y / h));
      poster.style.setProperty("--poster-scale", (1 + p * 0.045).toFixed(4));
    };
    window.addEventListener(
      "scroll",
      () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(update);
      },
      { passive: true }
    );
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
  );
  const forceReveal = params.get("reveal") === "1" || reduce;
  document.querySelectorAll(".reveal").forEach((el) => {
    if (forceReveal) el.classList.add("is-in");
    else io.observe(el);
  });

  const scrollTo = params.get("scroll") || (location.hash || "");
  if (scrollTo && introMode === "0") {
    const target = document.querySelector(scrollTo.startsWith("#") ? scrollTo : "#" + scrollTo);
    if (target) target.scrollIntoView({ block: "start" });
  }

  const openLight = () => {
    if (!lightbox) return;
    lightbox.hidden = false;
    const closeBtn = lightbox.querySelector("[data-trailer-close]");
    if (closeBtn) closeBtn.focus();
    body.style.overflow = "hidden";
  };
  const closeLight = () => {
    if (!lightbox) return;
    lightbox.hidden = true;
    body.style.overflow = "";
    const play = document.querySelector("[data-trailer-open]");
    if (play) play.focus();
  };
  document.querySelectorAll("[data-trailer-open]").forEach((btn) => {
    btn.addEventListener("click", openLight);
  });
  document.querySelectorAll("[data-trailer-close]").forEach((btn) => {
    btn.addEventListener("click", closeLight);
  });
  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLight();
    });
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (lightbox && !lightbox.hidden) closeLight();
      if (menu && menu.classList.contains("is-open")) setMenu(false);
    }
  });

  const form = document.getElementById("aviso-form");
  const status = document.querySelector("[data-form-status]");
  if (form && status) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const nombre = String(data.get("nombre") || "").trim();
      const correo = String(data.get("correo") || "").trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
        status.textContent = "Escribe un correo válido.";
        return;
      }
      try {
        const key = "vii-the-game-avisos";
        const prev = JSON.parse(localStorage.getItem(key) || "[]");
        prev.push({ nombre, correo, at: new Date().toISOString() });
        localStorage.setItem(key, JSON.stringify(prev));
        form.reset();
        status.textContent = nombre
          ? `Listo, ${nombre}. Te guardamos el aviso en este dispositivo.`
          : "Listo. Te guardamos el aviso en este dispositivo.";
      } catch {
        status.textContent = "No se pudo guardar en este dispositivo, pero gracias por intentarlo.";
      }
    });
  }
})();
