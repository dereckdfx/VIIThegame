(() => {
  "use strict";

  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const params = new URLSearchParams(location.search);
  const introMode = params.get("intro");
  const body = document.body;
  const root = document.documentElement;
  const intro = document.getElementById("intro");
  const menu = document.getElementById("menu");
  const navToggle = document.querySelector("[data-nav-toggle]");
  const poster = document.querySelector("[data-poster]");
  const heroImage = document.querySelector("[data-hero-image]");
  const lightbox = document.getElementById("lightbox");
  const couple = document.querySelector("[data-couple]");
  const city = document.querySelector("[data-city]");

  const I18N = {
    es: {
      banner: "Grand Theft Auto VII · Próximamente",
      close: "Cerrar",
      editionLine: "Todo el mapa, todas las historias y el atardecer completo.",
      editionTitle: "Edición definitiva",
      explore: "Explorar →",
      exploreMore: "Explorar más →",
      extraLabel: "Contenido adicional",
      eyetape: "Cinta",
      galleryTitle: "La galería",
      glanceTitle: "Un vistazo más a fondo",
      mediaTitle: "Media y arte",
      menu: "Menú",
      motion: "Movimiento",
      motionFull: "Completo",
      motionOff: "Reducido",
      musicTitle: "Radio, banda sonora y música",
      navCast: "Personajes",
      navEdition: "Edición definitiva",
      navGlance: "Un vistazo",
      navHome: "Inicio",
      navMedia: "Media",
      navMusic: "Música",
      navOnly: "Solo en Vinewood",
      navPlaces: "Lugares",
      navShots: "Capturas",
      navStory: "Vinewood, USA",
      navTrailer: "Tráiler",
      navWatch: "Ver",
      neonLine: "Misiones, trajes y una radio que no apaga el centro.",
      neonTitle: "Paquete noches de neón",
      notify: "Quiero enterarme",
      play: "Reproducir",
      reserve: "Reservar ahora",
      seeAll: "Ver todo →",
      seeMore: "Ver más →",
      soon: "Próximamente",
      trailerLede: "Aún no hay un tráiler. Cuando exista, lo verás primero aquí.",
      welcome: "Bienvenido a Vinewood"
    },
    en: {
      banner: "Grand Theft Auto VII · Coming soon",
      close: "Close",
      editionLine: "The full map, every story, and the complete sunset.",
      editionTitle: "Definitive edition",
      explore: "Explore →",
      exploreMore: "Explore more →",
      extraLabel: "Extra content",
      eyetape: "Tape",
      galleryTitle: "The gallery",
      glanceTitle: "A closer look",
      mediaTitle: "Media and art",
      menu: "Menu",
      motion: "Motion",
      motionFull: "Full",
      motionOff: "Reduced",
      musicTitle: "Radio, score and music",
      navCast: "Characters",
      navEdition: "Definitive edition",
      navGlance: "A closer look",
      navHome: "Home",
      navMedia: "Media",
      navMusic: "Music",
      navOnly: "Only in Vinewood",
      navPlaces: "Places",
      navShots: "Captures",
      navStory: "Vinewood, USA",
      navTrailer: "Trailer",
      navWatch: "Watch",
      neonLine: "Missions, outfits, and a radio that never shuts off downtown.",
      neonTitle: "Neon nights pack",
      notify: "Keep me posted",
      play: "Play",
      reserve: "Reserve now",
      seeAll: "See all →",
      seeMore: "See more →",
      soon: "Coming soon",
      trailerLede: "There is no trailer yet. When there is, you will see it here first.",
      welcome: "Welcome to Vinewood"
    }
  };

  const langLabels = { es: "Español", en: "English" };

  function storedLang() {
    try {
      const v = localStorage.getItem("vii-lang");
      if (v === "en" || v === "es") return v;
    } catch {}
    return "es";
  }

  function storedMotion() {
    try {
      const v = localStorage.getItem("vii-motion");
      if (v === "reduced" || v === "full") return v;
    } catch {}
    return motionQuery.matches ? "reduced" : "full";
  }

  let lang = storedLang();
  let motionPref = storedMotion();

  function reduceOn() {
    return motionPref === "reduced" || motionQuery.matches;
  }

  function applyMotionClass() {
    root.classList.toggle("is-reduced-motion", reduceOn());
  }

  function applyLang() {
    const dict = I18N[lang] || I18N.es;
    root.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (key && dict[key]) el.textContent = dict[key];
    });
    document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
      const key = el.getAttribute("data-i18n-aria");
      if (key && dict[key]) el.setAttribute("aria-label", dict[key]);
    });
    document.querySelectorAll("[data-lang-label]").forEach((el) => {
      el.textContent = langLabels[lang];
    });
    document.querySelectorAll("[data-lang]").forEach((btn) => {
      btn.setAttribute("aria-pressed", btn.getAttribute("data-lang") === lang ? "true" : "false");
    });
  }

  applyMotionClass();
  applyLang();

  function closeIntro() {
    if (!intro || intro.classList.contains("is-out")) return;
    intro.classList.add("is-out");
    body.classList.remove("is-intro");
    intro.setAttribute("aria-hidden", "true");
    const hide = () => intro.classList.add("is-gone");
    if (reduceOn()) hide();
    else setTimeout(hide, 2000);
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
    if (reduceOn()) {
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

  const closeTools = () => {
    document.querySelectorAll(".tool-toggle").forEach((btn) => btn.setAttribute("aria-expanded", "false"));
    document.querySelectorAll(".tool-menu").forEach((el) => {
      el.hidden = true;
    });
  };

  const closeSubs = () => {
    document.querySelectorAll(".has-sub").forEach((li) => li.classList.remove("is-open"));
    document.querySelectorAll("[data-sub]").forEach((btn) => btn.setAttribute("aria-expanded", "false"));
  };

  const setMenu = (open) => {
    if (!menu || !navToggle) return;
    if (open) menu.hidden = false;
    else {
      closeTools();
    }
    requestAnimationFrame(() => {
      menu.classList.toggle("is-open", open);
      navToggle.classList.toggle("is-open", open);
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      body.classList.toggle("is-menu", open);
      if (!open) {
        const hide = () => {
          if (!menu.classList.contains("is-open")) menu.hidden = true;
        };
        if (reduceOn()) hide();
        else setTimeout(hide, 700);
      }
    });
  };

  if (navToggle && menu) {
    navToggle.addEventListener("click", () => setMenu(!menu.classList.contains("is-open")));
    menu.querySelectorAll("[data-menu-close]").forEach((el) => {
      el.addEventListener("click", () => setMenu(false));
    });
    menu.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => setMenu(false));
    });
    menu.querySelectorAll("[data-sub]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const item = btn.closest(".has-sub");
        if (!item) return;
        const open = !item.classList.contains("is-open");
        menu.querySelectorAll(".has-sub").forEach((li) => {
          if (li !== item) {
            li.classList.remove("is-open");
            const other = li.querySelector("[data-sub]");
            if (other) other.setAttribute("aria-expanded", "false");
          }
        });
        item.classList.toggle("is-open", open);
        btn.setAttribute("aria-expanded", open ? "true" : "false");
      });
    });
    document.querySelectorAll(".tool-toggle").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const wrap = btn.closest(".tool");
        const panel = wrap && wrap.querySelector(".tool-menu");
        if (!panel) return;
        const open = panel.hidden;
        closeTools();
        if (open) {
          panel.hidden = false;
          btn.setAttribute("aria-expanded", "true");
        }
      });
    });
  }

  document.querySelectorAll("[data-lang]").forEach((btn) => {
    btn.addEventListener("click", () => {
      lang = btn.getAttribute("data-lang") === "en" ? "en" : "es";
      try { localStorage.setItem("vii-lang", lang); } catch {}
      applyLang();
      closeTools();
    });
  });

  document.querySelectorAll("[data-motion]").forEach((btn) => {
    btn.addEventListener("click", () => {
      motionPref = btn.getAttribute("data-motion") === "reduced" ? "reduced" : "full";
      try { localStorage.setItem("vii-motion", motionPref); } catch {}
      applyMotionClass();
      closeTools();
    });
  });

  if (poster && !reduceOn()) {
    let tickingPoster = false;
    const updatePoster = () => {
      tickingPoster = false;
      const y = window.scrollY;
      const h = Math.max(window.innerHeight, 1);
      const p = Math.min(1, Math.max(0, y / h));
      poster.style.setProperty("--poster-scale", (1 + p * 0.045).toFixed(4));
    };
    window.addEventListener(
      "scroll",
      () => {
        if (tickingPoster) return;
        tickingPoster = true;
        requestAnimationFrame(updatePoster);
      },
      { passive: true }
    );
  }

  let tickingScene = false;
  const updateScenes = () => {
    tickingScene = false;
    if (reduceOn()) return;
    const vh = Math.max(window.innerHeight, 1);
    if (couple) {
      const rect = couple.getBoundingClientRect();
      const start = vh;
      const end = -rect.height;
      const p = Math.min(1, Math.max(0, (start - rect.top) / (start - end)));
      couple.style.setProperty("--couple-scale", (1.18 - p * 0.18).toFixed(4));
    }
    if (city) {
      const rect = city.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (vh - rect.top) / (vh + rect.height)));
      city.style.setProperty("--city-shift", `${((p - 0.5) * 80).toFixed(1)}px`);
    }
  };
  window.addEventListener(
    "scroll",
    () => {
      if (tickingScene) return;
      tickingScene = true;
      requestAnimationFrame(updateScenes);
    },
    { passive: true }
  );
  updateScenes();

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
  const forceReveal = params.get("reveal") === "1" || reduceOn();
  document.querySelectorAll(".reveal").forEach((el) => {
    if (forceReveal) el.classList.add("is-in");
    else io.observe(el);
  });

  const lineIo = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          lineIo.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.55, rootMargin: "0px 0px -10% 0px" }
  );
  document.querySelectorAll("[data-line]").forEach((el, i) => {
    if (forceReveal) {
      el.classList.add("is-in");
    } else {
      el.style.transitionDelay = `${i * 0.08}s`;
      lineIo.observe(el);
    }
  });

  const scrollTo = params.get("scroll") || location.hash || "";
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
    if (e.key !== "Escape") return;
    if (lightbox && !lightbox.hidden) {
      closeLight();
      return;
    }
    const openTool = document.querySelector(".tool-menu:not([hidden])");
    if (openTool) {
      closeTools();
      return;
    }
    if (menu && menu.classList.contains("is-open")) setMenu(false);
  });

  function bindLocalForm(form, statusSel, key, messages) {
    const status = document.querySelector(statusSel);
    if (!form || !status) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const nombre = String(data.get("nombre") || "").trim();
      const correo = String(data.get("correo") || "").trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
        status.textContent = messages.invalid;
        return;
      }
      try {
        const prev = JSON.parse(localStorage.getItem(key) || "[]");
        prev.push({ nombre, correo, at: new Date().toISOString() });
        localStorage.setItem(key, JSON.stringify(prev));
        form.reset();
        status.textContent = nombre
          ? messages.okName.replace("{name}", nombre)
          : messages.ok;
      } catch {
        status.textContent = messages.fail;
      }
    });
  }

  bindLocalForm(document.getElementById("aviso-form"), "[data-form-status]", "vii-the-game-avisos", {
    invalid: "Escribe un correo válido.",
    okName: "Listo, {name}. Te guardamos el aviso en este dispositivo.",
    ok: "Listo. Te guardamos el aviso en este dispositivo.",
    fail: "No se pudo guardar en este dispositivo, pero gracias por intentarlo."
  });

  bindLocalForm(document.getElementById("news-form"), "[data-news-status]", "vii-the-game-noticias", {
    invalid: "Escribe un correo válido.",
    okName: "Listo, {name}. Guardamos tu correo en este dispositivo.",
    ok: "Listo. Guardamos tu correo solo en este dispositivo.",
    fail: "No se pudo guardar en este dispositivo, pero gracias por intentarlo."
  });
})();
