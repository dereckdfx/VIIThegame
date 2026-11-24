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
  const couple = document.querySelector("[data-couple]");
  const city = document.querySelector("[data-city]");

  const I18N = {
    es: {
      banner: "Grand Theft Auto VII · Próximamente",
      close: "Cerrar",
      editionLine: "Todo el mapa, todas las historias y el atardecer completo.",
      editionTitle: "Edición especial",
      explore: "Explorar →",
      exploreMore: "Explorar más →",
      extraLabel: "Contenido adicional",
      eyetape: "Cinta",
      galleryTitle: "La galería",
      glanceTitle: "Un vistazo más a fondo",
      mediaTitle: "Media y arte",
      menu: "Menú",
      menuTitle: "Grand Theft Auto VII",
      motion: "Movimiento",
      motionFull: "Completo",
      motionOff: "Reducido",
      musicTitle: "Radio, banda sonora y música",
      navCast: "Personajes",
      navEdition: "Edición especial",
      navHome: "Inicio",
      navMedia: "Media",
      navMusic: "Música",
      navNews: "Novedades",
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
      pause: "Pausar",
      mute: "Silenciar",
      unmute: "Activar sonido",
      progress: "Progreso",
      reserve: "Reservar ahora",
      seeAll: "Ver todo →",
      seeMore: "Ver más →",
      soon: "Próximamente",
      soonToast: "Próximamente. Esta sección se publicará aquí.",
      trailerLede: "Mientras llega el tráiler, puedes reproducir este recorte animado de la portada.",
      welcome: "Bienvenido a Vinewood",
      privacy: "Aviso de privacidad",
      cookies: "Cookies",
      legal: "Legal",
      clubTitle: "Beneficios del VII Club",
      clubLine: "Una membresía de fan inventada: avisos, fondos y un rincón para quienes siguen la página.",
      clubBenefits: "Ver beneficios →",
      radioTitle: "Emisoras de Vinewood",
      formName: "Tu nombre",
      formEmail: "Tu correo",
      send: "Enviar",
      newsBoxTitle: "Recibe las noticias de VII",
      newsBoxNote: "Solo se guarda en este dispositivo. No es un boletín oficial.",
      formNote: "Este aviso es solo de esta página de fan. No está vinculado a un lanzamiento oficial.",
      soonLede: "Una visión de fan de lo que podría ser GTA VII. Fecha por anunciarse.",
      news1: "La página de fan ya muestra su primer cartel al atardecer",
      news2: "Así imaginamos las noches del centro, sin sirenas de verdad",
      news3: "Un muelle de papel: lo que hay detrás de esta visión de fan",
      merchTitle: "Ropa, coleccionables y más",
      boxTitle: "La colección Vinewood",
      shop: "Tienda",
      featuredNews: "Noticias destacadas",
      launch: "Lanzamiento",
      wallLede: "Un muro abierto de la comunidad de fans. No es un canal oficial.",
      wallName: "Nombre (opcional)",
      wallText: "¿Qué quieres contar?",
      wallPublish: "Publicar",
      wallEmpty: "Todavía no hay novedades. Sé el primero en escribir.",
      wallWait: "Espera 10 segundos antes de publicar otra vez.",
      wallError: "No se pudo publicar. Revisa el texto (hasta 280 caracteres) e inténtalo de nuevo.",
      wallOk: "Publicado. Ya está en el muro.",
      catGeneral: "General",
      catArte: "Arte",
      catMusica: "Música",
      catComunidad: "Comunidad",
      catRumor: "Rumor",
      skipTo: "Bajar al tráiler"
    },
    en: {
      banner: "Grand Theft Auto VII · Coming soon",
      close: "Close",
      editionLine: "The full map, every story, and the complete sunset.",
      editionTitle: "Special edition",
      explore: "Explore →",
      exploreMore: "Explore more →",
      extraLabel: "Extra content",
      eyetape: "Tape",
      galleryTitle: "The gallery",
      glanceTitle: "A closer look",
      mediaTitle: "Media and art",
      menu: "Menu",
      menuTitle: "Grand Theft Auto VII",
      motion: "Motion",
      motionFull: "Full",
      motionOff: "Reduced",
      musicTitle: "Radio, score and music",
      navCast: "Characters",
      navEdition: "Special edition",
      navHome: "Home",
      navMedia: "Media",
      navMusic: "Music",
      navNews: "News wall",
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
      pause: "Pause",
      mute: "Mute",
      unmute: "Unmute",
      progress: "Progress",
      reserve: "Reserve now",
      seeAll: "See all →",
      seeMore: "See more →",
      soon: "Coming soon",
      soonToast: "Coming soon. This section will be published here.",
      trailerLede: "Until there is a trailer, you can play this animated crop of the cover art.",
      welcome: "Welcome to Vinewood",
      privacy: "Privacy notice",
      cookies: "Cookies",
      legal: "Legal",
      clubTitle: "VII Club benefits",
      clubLine: "A fictional fan membership: updates, wallpapers, and a corner for people who follow the page.",
      clubBenefits: "See benefits →",
      radioTitle: "Vinewood stations",
      formName: "Your name",
      formEmail: "Your email",
      send: "Send",
      newsBoxTitle: "Get the VII news",
      newsBoxNote: "Saved only on this device. This is not an official newsletter.",
      formNote: "This notice belongs only to this fan page. It is not tied to an official release.",
      soonLede: "A fan vision of what GTA VII could be. Date to be announced.",
      news1: "The fan page already shows its first sunset poster",
      news2: "How we imagine downtown nights, with no real sirens",
      news3: "A paper pier: the story behind this fan vision",
      merchTitle: "Clothes, collectibles and more",
      boxTitle: "The Vinewood collection",
      shop: "Store",
      featuredNews: "Featured news",
      launch: "Release",
      wallLede: "An open wall for the fan community. This is not an official channel.",
      wallName: "Name (optional)",
      wallText: "What do you want to share?",
      wallPublish: "Publish",
      wallEmpty: "There are no posts yet. Be the first to write.",
      wallWait: "Wait 10 seconds before posting again.",
      wallError: "Could not publish. Check the text (up to 280 characters) and try again.",
      wallOk: "Published. It is now on the wall.",
      catGeneral: "General",
      catArte: "Art",
      catMusica: "Music",
      catComunidad: "Community",
      catRumor: "Rumor",
      skipTo: "Skip to the trailer"
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
    return null;
  }

  let lang = storedLang();
  let motionPref = storedMotion();

  function reduceOn() {
    if (motionPref === "reduced") return true;
    if (motionPref === "full") return false;
    return motionQuery.matches;
  }

  function t(key) {
    const dict = I18N[lang] || I18N.es;
    return dict[key] || I18N.es[key] || key;
  }

  function applyMotionClass() {
    root.classList.toggle("is-reduced-motion", reduceOn());
    document.querySelectorAll("[data-motion]").forEach((btn) => {
      const val = btn.getAttribute("data-motion");
      const current = reduceOn() ? "reduced" : "full";
      btn.setAttribute("aria-pressed", val === current ? "true" : "false");
    });
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
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (key && dict[key]) el.setAttribute("placeholder", dict[key]);
    });
    document.querySelectorAll("[data-lang-label]").forEach((el) => {
      el.textContent = langLabels[lang];
    });
    document.querySelectorAll("[data-lang]").forEach((btn) => {
      btn.setAttribute("aria-pressed", btn.getAttribute("data-lang") === lang ? "true" : "false");
    });
    document.querySelectorAll("[data-player]").forEach(syncPlayerLabels);
  }

  applyMotionClass();
  applyLang();
  motionQuery.addEventListener("change", () => {
    if (motionPref == null) applyMotionClass();
  });

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
        clearTimeout(timer);
        resolve();
      };
      const timer = setTimeout(done, ms);
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
    setTimeout(closeIntro, Math.max(0, 4000 - elapsed));
    setTimeout(closeIntro, 8000);
  }

  startIntro();

  const chrome = document.querySelectorAll("[data-chrome], .first-screen, main, .site-footer, #intro");

  function setChromeHidden(hidden) {
    chrome.forEach((el) => {
      if (el === menu || (menu && menu.contains(el))) return;
      if (hidden) el.setAttribute("aria-hidden", "true");
      else el.removeAttribute("aria-hidden");
    });
  }

  function focusables(rootEl) {
    return [...rootEl.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')].filter((el) => {
      if (el.hasAttribute("hidden") || el.closest("[hidden]")) return false;
      const style = window.getComputedStyle(el);
      if (style.display === "none" || style.visibility === "hidden") return false;
      return true;
    });
  }

  const closeTools = () => {
    document.querySelectorAll(".tool-toggle").forEach((btn) => btn.setAttribute("aria-expanded", "false"));
    document.querySelectorAll(".tool-menu").forEach((el) => {
      el.hidden = true;
    });
  };

  let lastFocus = null;

  const setMenu = (open) => {
    if (!menu || !navToggle) return;
    if (open) {
      lastFocus = document.activeElement;
      menu.hidden = false;
      menu.setAttribute("aria-hidden", "false");
    } else {
      closeTools();
    }
    requestAnimationFrame(() => {
      menu.classList.toggle("is-open", open);
      navToggle.classList.toggle("is-open", open);
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      body.classList.toggle("is-menu", open);
      setChromeHidden(open);
      if (open) {
        const closeBtn = menu.querySelector("[data-menu-close]");
        if (closeBtn) closeBtn.focus();
      } else {
        const hide = () => {
          if (!menu.classList.contains("is-open")) {
            menu.hidden = true;
            menu.setAttribute("aria-hidden", "true");
          }
        };
        if (reduceOn()) hide();
        else setTimeout(hide, 700);
        if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
        else navToggle.focus();
      }
    });
  };

  if (navToggle && menu) {
    menu.setAttribute("role", "dialog");
    menu.setAttribute("aria-modal", "true");
    navToggle.addEventListener("click", () => setMenu(!menu.classList.contains("is-open")));
    menu.querySelectorAll("[data-menu-close]").forEach((el) => {
      el.addEventListener("click", () => setMenu(false));
    });
    const art = menu.querySelector(".menu-art");
    if (art) {
      art.addEventListener("click", (e) => {
        if (e.target.closest("a, button, input, label")) return;
        setMenu(false);
      });
    }
    menu.addEventListener("click", (e) => {
      if (e.target === menu) setMenu(false);
    });
    menu.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", (e) => {
        const url = new URL(a.href, location.href);
        const samePage = url.pathname.replace(/\/$/, "/") === location.pathname.replace(/\/$/, "/");
        if (samePage && url.hash) {
          const target = document.querySelector(url.hash);
          if (target) {
            e.preventDefault();
            setMenu(false);
            target.scrollIntoView({ behavior: reduceOn() ? "auto" : "smooth", block: "start" });
            history.pushState(null, "", url.hash);
          }
        } else {
          setMenu(false);
        }
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
    window.addEventListener("scroll", () => {
      if (tickingPoster) return;
      tickingPoster = true;
      requestAnimationFrame(updatePoster);
    }, { passive: true });
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
  window.addEventListener("scroll", () => {
    if (tickingScene) return;
    tickingScene = true;
    requestAnimationFrame(updateScenes);
  }, { passive: true });
  updateScenes();

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });
  const forceReveal = params.get("reveal") === "1" || reduceOn();
  document.querySelectorAll(".reveal").forEach((el) => {
    if (forceReveal) el.classList.add("is-in");
    else io.observe(el);
  });

  const lineIo = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-in");
        lineIo.unobserve(entry.target);
      }
    });
  }, { threshold: 0.55, rootMargin: "0px 0px -10% 0px" });
  document.querySelectorAll("[data-line]").forEach((el, i) => {
    if (forceReveal) el.classList.add("is-in");
    else {
      el.style.transitionDelay = `${i * 0.08}s`;
      lineIo.observe(el);
    }
  });

  const scrollTo = params.get("scroll") || location.hash || "";
  if (scrollTo && (introMode === "0" || !intro)) {
    const target = document.querySelector(scrollTo.startsWith("#") ? scrollTo : "#" + scrollTo);
    if (target) target.scrollIntoView({ block: "start" });
  }

  const toastEl = document.getElementById("toast");
  let toastTimer = 0;
  function toast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.hidden = false;
    toastEl.classList.add("is-in");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.remove("is-in");
      toastEl.hidden = true;
    }, 3200);
  }
  window.viiToast = toast;
  window.viiT = t;

  document.querySelectorAll("[data-soon]").forEach((el) => {
    const soon = (e) => {
      e.preventDefault();
      toast(t("soonToast"));
    };
    el.addEventListener("click", soon);
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") soon(e);
    });
  });

  document.querySelectorAll("[data-open-dialog]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const dlg = document.getElementById(btn.getAttribute("data-open-dialog"));
      if (dlg && typeof dlg.showModal === "function") dlg.showModal();
    });
  });
  document.querySelectorAll("[data-close-dialog]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const dlg = btn.closest("dialog");
      if (dlg) dlg.close();
    });
  });

  function formatTime(s) {
    if (!Number.isFinite(s) || s < 0) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${String(sec).padStart(2, "0")}`;
  }

  function syncPlayerLabels(rootEl) {
    const video = rootEl.querySelector("video");
    const play = rootEl.querySelector("[data-play]");
    const mute = rootEl.querySelector("[data-mute]");
    if (play) play.setAttribute("aria-label", video && !video.paused && !video.ended ? t("pause") : t("play"));
    if (mute) mute.setAttribute("aria-label", video && video.muted ? t("unmute") : t("mute"));
    const progress = rootEl.querySelector("[data-progress]");
    if (progress) progress.setAttribute("aria-label", t("progress"));
  }

  function setupPlayer(rootEl) {
    const video = rootEl.querySelector("video");
    if (!video) return;
    const play = rootEl.querySelector("[data-play]");
    const mute = rootEl.querySelector("[data-mute]");
    const progress = rootEl.querySelector("[data-progress]");
    const time = rootEl.querySelector("[data-time]");
    const custom = video.getAttribute("data-src");
    if (custom) {
      const probe = new XMLHttpRequest();
      probe.open("HEAD", custom, true);
      probe.onload = () => {
        if (probe.status >= 200 && probe.status < 300) {
          video.querySelectorAll("source").forEach((s) => s.remove());
          video.src = custom;
          video.load();
        }
      };
      probe.send();
    }
    const update = () => {
      const dur = video.duration;
      const cur = video.currentTime || 0;
      if (progress && Number.isFinite(dur) && dur > 0 && !progress.matches(":active")) {
        progress.value = String(Math.round((cur / dur) * 1000));
      }
      if (time) {
        time.textContent = `${formatTime(cur)} / ${formatTime(Number.isFinite(dur) ? dur : 0)}`;
      }
      rootEl.classList.toggle("is-playing", !video.paused && !video.ended);
      if (play) {
        play.textContent = !video.paused && !video.ended ? "❚❚" : "▶";
      }
      if (mute) mute.textContent = video.muted || video.volume === 0 ? "🔇" : "🔊";
      syncPlayerLabels(rootEl);
    };
    if (play) {
      play.addEventListener("click", () => {
        if (video.paused || video.ended) video.play().catch(() => {});
        else video.pause();
      });
    }
    video.addEventListener("click", () => {
      if (video.paused || video.ended) video.play().catch(() => {});
      else video.pause();
    });
    if (mute) {
      mute.addEventListener("click", () => {
        video.muted = !video.muted;
        update();
      });
    }
    if (progress) {
      progress.addEventListener("input", () => {
        const dur = video.duration;
        if (!Number.isFinite(dur) || dur <= 0) return;
        video.currentTime = (Number(progress.value) / 1000) * dur;
      });
    }
    ["timeupdate", "play", "pause", "ended", "loadedmetadata", "volumechange"].forEach((ev) => {
      video.addEventListener(ev, update);
    });
    video.addEventListener("ended", () => {
      video.pause();
      update();
    });
    update();
  }

  document.querySelectorAll("[data-player]").forEach(setupPlayer);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Tab" && menu && menu.classList.contains("is-open")) {
      const items = focusables(menu);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
      return;
    }
    if (e.key !== "Escape") return;
    const openDlg = document.querySelector("dialog[open]");
    if (openDlg) {
      openDlg.close();
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
        status.textContent = lang === "en" ? "Enter a valid email." : "Escribe un correo válido.";
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
    okName: lang === "en" ? "Done, {name}. We saved the notice on this device." : "Listo, {name}. Te guardamos el aviso en este dispositivo.",
    ok: lang === "en" ? "Done. We saved the notice on this device." : "Listo. Te guardamos el aviso en este dispositivo.",
    fail: lang === "en" ? "Could not save on this device, but thank you for trying." : "No se pudo guardar en este dispositivo, pero gracias por intentarlo."
  });

  bindLocalForm(document.getElementById("news-form"), "[data-news-status]", "vii-the-game-noticias", {
    okName: lang === "en" ? "Done, {name}. We saved your email on this device." : "Listo, {name}. Guardamos tu correo en este dispositivo.",
    ok: lang === "en" ? "Done. We saved your email only on this device." : "Listo. Guardamos tu correo solo en este dispositivo.",
    fail: lang === "en" ? "Could not save on this device, but thank you for trying." : "No se pudo guardar en este dispositivo, pero gracias por intentarlo."
  });
})();
