// Alt Labs: lê conteudo.json e monta a página. Textos e trabalhos vivem lá.
const reduz = matchMedia("(prefers-reduced-motion: reduce)").matches;

// Proteção básica das imagens e vídeos: bloqueia clique direito e arrastar. Só dificulta; print e ferramentas do navegador continuam possíveis.
document.addEventListener("contextmenu", (e) => { if (e.target.closest("img, video, .card, .zoom, .capitulo__video, .hero__video")) e.preventDefault(); });
document.addEventListener("dragstart", (e) => { if (e.target.closest("img, video")) e.preventDefault(); });
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

fetch("conteudo.json").then((r) => r.json()).then(iniciar).catch((e) => {
  document.body.insertAdjacentHTML("afterbegin",
    '<p style="padding:90px 24px;font:16px system-ui">Não foi possível carregar o conteúdo. Abra o site pelo <b>iniciar.bat</b> (servidor local).</p>');
  console.error(e);
});

function iniciar(c) {
  const ig = c.instagram;
  const map = {
    logo: c.marca.logo, heroTitulo: c.hero.titulo, heroTexto: c.hero.texto, heroBotao: c.hero.botao,
    contatoTitulo: c.contato.titulo, contatoTexto: c.contato.texto, contatoBotao: c.contato.botao,
    perfilBotao: c.contato.perfilBotao, usuario: ig.usuario, direct: ig.direct, perfil: ig.perfil,
  };
  $$("[data-bind]").forEach((n) => { const v = map[n.dataset.bind]; n.tagName === "IMG" ? (n.src = v) : (n.textContent = v); });
  $$("[data-bind-text]").forEach((n) => (n.textContent = map[n.dataset.bindText]));
  $$("[data-bind-href]").forEach((n) => (n.href = map[n.dataset.bindHref]));
  $("#ano").textContent = new Date().getFullYear();

  // serviços
  const sv = $("#listaServicos");
  c.servicos.forEach((s) => sv.append(el("article", `servico servico--${s.cor} rev`, `<h3>${esc(s.titulo)}</h3><p>${esc(s.texto)}</p>`)));

  // trabalhos
  Object.entries(c.trabalhos).forEach(([chave, lista]) => {
    const g = $(`[data-grade="${chave}"]`);
    lista.forEach((t) => {
      const b = el("button", "card rev");
      b.type = "button";
      const cls = t.tipo === "Cliente" ? "cliente" : "autoral";
      b.innerHTML = `<div class="card__img"><img loading="lazy" src="${esc(t.imagem)}" alt="${esc(t.nome)}"></div>
        <div class="card__info"><span class="tag tag--${cls}">${esc(t.tipo)}</span><span class="card__nome">${esc(t.nome)}</span><span class="card__leg">${esc(t.legenda)}</span></div>`;
      b.addEventListener("click", () => abrirZoom(t));
      g.append(b);
    });
  });

  // processo
  const lp = $("#listaProcesso");
  c.processo.forEach((cap) => {
    const sec = el("div", "capitulo");
    sec.innerHTML = `<div class="capitulo__video"><video muted loop playsinline preload="metadata" aria-hidden="true"></video><div class="vazio">${esc(cap.titulo)}</div></div>
      <div><h3>${esc(cap.titulo)}</h3>${cap.passos.map((p, i) => `<div class="passo${i === 0 ? " ativo" : ""}"><h4>${esc(p.t)}</h4><p>${esc(p.d)}</p></div>`).join("")}</div>`;
    lp.append(sec);
    ligarVideo($("video", sec), cap.video, $(".vazio", sec));
  });

  // vídeo de fundo do hero (só aparece se o arquivo existir)
  ligarVideo($("#heroVideo video"), c.videos.hero, null, () => ($("#heroVideo").hidden = false));

  ligarVideo($("#contatoVideo video"), c.videos.hero, null, () => ($("#contatoVideo").hidden = false));

  abas();
  efeitos();
}

function ligarVideo(v, src, vazio, ok) {
  v.addEventListener("loadeddata", () => { vazio && vazio.remove(); ok && ok(); if (!reduz) v.play().catch(() => {}); }, { once: true });
  v.addEventListener("error", () => v.remove(), { once: true });
  v.src = src;
  // só toca quando visível
  new IntersectionObserver((es) => es.forEach((e) => (e.isIntersecting ? !reduz && v.play().catch(() => {}) : v.pause()))).observe(v);
}

function abas() {
  const tabs = $$('[role="tab"]');
  const sel = (t) => {
    tabs.forEach((x) => { const on = x === t; x.setAttribute("aria-selected", on); x.tabIndex = on ? 0 : -1; $("#" + x.getAttribute("aria-controls")).hidden = !on; });
  };
  tabs.forEach((t, i) => {
    t.addEventListener("click", () => sel(t));
    t.addEventListener("keydown", (e) => {
      const d = { ArrowRight: 1, ArrowLeft: -1 }[e.key]; if (!d) return;
      const n = tabs[(i + d + tabs.length) % tabs.length]; n.focus(); sel(n);
    });
  });
}

function abrirZoom(t) {
  const z = $("#zoom"); $("img", z).src = t.imagem; $("img", z).alt = t.nome;
  $(".zoom__leg", z).textContent = `${t.nome} · ${t.tipo}`;
  z.showModal();
}
$("#zoom").addEventListener("click", (e) => { if (e.target.id === "zoom") e.target.close(); });

function efeitos() {
  // menu: sombra ao rolar e link ativo
  const topo = $("#topo");
  const links = $$(".topo__nav a");
  const secs = links.map((a) => $(a.getAttribute("href")));
  // entrada por scroll
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("visto"); io.unobserve(e.target); } }), { threshold: .15 });
  $$(".rev").forEach((n, i) => { n.style.transitionDelay = (i % 3) * 90 + "ms"; io.observe(n); });
  // passos do processo
  const po = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { $$(".passo", e.target.parentElement).forEach((p) => p.classList.toggle("ativo", p === e.target)); }
  }), { rootMargin: "-45% 0px -45% 0px" });
  $$(".passo").forEach((p) => po.observe(p));

  // parallax das colagens (transform apenas)
  const par = $$("[data-speed]");
  let tick = false;
  const atualiza = () => {
    tick = false;
    const y = scrollY, vh = innerHeight;
    topo.classList.toggle("rolou", y > 10);
    secs.forEach((s, i) => { const r = s.getBoundingClientRect(); links[i].classList.toggle("ativo", r.top < vh * .4 && r.bottom > vh * .4); });
    if (reduz) return;
    par.forEach((n) => {
      const r = n.parentElement.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) return;
      const centro = r.top + r.height / 2 - vh / 2;
      n.style.transform = `translate3d(0,${(centro * parseFloat(n.dataset.speed)).toFixed(1)}px,0) rotate(${(centro * .008).toFixed(2)}deg)`;
    });
  };
  addEventListener("scroll", () => { if (!tick) { tick = true; requestAnimationFrame(atualiza); } }, { passive: true });
  atualiza();
}
