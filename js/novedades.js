(() => {
  "use strict";

  const cfg = window.VII_SUPABASE;
  const feed = document.getElementById("wall-feed");
  const form = document.getElementById("wall-form");
  const status = document.querySelector("[data-wall-status]");
  const countEl = document.querySelector("[data-count]");
  const textEl = document.getElementById("wall-texto");
  if (!cfg || !window.supabase || !feed || !form) return;

  const client = window.supabase.createClient(cfg.url, cfg.anonKey);
  const seen = new Set();
  let categoria = "general";
  const COOLDOWN_MS = 10000;
  const COOLDOWN_KEY = "vii-novedades-last";

  const t = (key) => (window.viiT ? window.viiT(key) : key);
  const catLabel = (c) => t({
    general: "catGeneral",
    arte: "catArte",
    musica: "catMusica",
    comunidad: "catComunidad",
    rumor: "catRumor"
  }[c] || "catGeneral");

  function fmtDate(iso) {
    try {
      const d = new Date(iso);
      return d.toLocaleString(document.documentElement.lang === "en" ? "en-US" : "es-MX", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return "";
    }
  }

  function card(row, isNew) {
    const el = document.createElement("article");
    el.className = "nov-card" + (isNew ? " is-new" : "");
    el.dataset.id = row.id;
    const name = (row.nombre || "").trim() || "Anónimo";
    const text = document.createElement("p");
    text.className = "nov-text";
    text.textContent = row.texto || "";
    el.innerHTML = `<p class="nov-cat"></p>
      <div class="nov-top">
        <p class="nov-name"></p>
        <p class="nov-time"></p>
      </div>`;
    el.querySelector(".nov-cat").textContent = catLabel(row.categoria);
    el.querySelector(".nov-name").textContent = name;
    el.querySelector(".nov-time").textContent = fmtDate(row.created_at);
    el.appendChild(text);
    return el;
  }

  function prepend(row, isNew) {
    if (!row || !row.id || seen.has(row.id)) return;
    seen.add(row.id);
    const empty = feed.querySelector("[data-empty]");
    if (empty) empty.remove();
    feed.prepend(card(row, isNew));
  }

  function showEmpty() {
    if (feed.children.length) return;
    const p = document.createElement("p");
    p.dataset.empty = "1";
    p.className = "lede";
    p.textContent = t("wallEmpty");
    feed.appendChild(p);
  }

  if (textEl && countEl) {
    const sync = () => { countEl.textContent = String(textEl.value.length); };
    textEl.addEventListener("input", sync);
    sync();
  }

  document.querySelectorAll("[data-cat]").forEach((btn) => {
    btn.addEventListener("click", () => {
      categoria = btn.getAttribute("data-cat") || "general";
      document.querySelectorAll("[data-cat]").forEach((b) => {
        const on = b === btn;
        b.classList.toggle("is-on", on);
        b.setAttribute("aria-pressed", on ? "true" : "false");
      });
    });
  });

  async function load() {
    const { data, error } = await client
      .from("vii_novedades")
      .select("id, created_at, nombre, texto, categoria")
      .order("created_at", { ascending: false })
      .limit(80);
    if (error) {
      if (status) status.textContent = t("wallError");
      return;
    }
    (data || []).slice().reverse().forEach((row) => prepend(row, false));
    showEmpty();
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nombre = String(form.nombre.value || "").trim();
    const texto = String(form.texto.value || "").trim();
    if (texto.length < 1 || texto.length > 280) {
      if (status) status.textContent = t("wallError");
      return;
    }
    try {
      const last = Number(localStorage.getItem(COOLDOWN_KEY) || 0);
      if (Date.now() - last < COOLDOWN_MS) {
        if (status) status.textContent = t("wallWait");
        return;
      }
    } catch {}
    const payload = {
      nombre: nombre || null,
      texto,
      categoria: categoria || "general"
    };
    const { data, error } = await client.from("vii_novedades").insert(payload).select().single();
    if (error) {
      const msg = (error.message || "").toLowerCase();
      if (status) {
        status.textContent = msg.includes("espera") || msg.includes("10")
          ? t("wallWait")
          : t("wallError");
      }
      return;
    }
    try { localStorage.setItem(COOLDOWN_KEY, String(Date.now())); } catch {}
    form.texto.value = "";
    if (countEl) countEl.textContent = "0";
    if (data) prepend(data, true);
    if (status) status.textContent = t("wallOk");
    if (window.viiToast) window.viiToast(t("wallOk"));
  });

  client
    .channel("vii-novedades-wall")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "vii_novedades" },
      (payload) => prepend(payload.new, true)
    )
    .subscribe();

  load();
})();
