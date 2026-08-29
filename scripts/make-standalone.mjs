import { readFile, readdir, writeFile } from "node:fs/promises";
import { extname, join, relative } from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const output = process.argv[2] ?? join(root, "index.html");
const workerUrl = pathToFileURL(join(root, "dist/server/index.js"));
workerUrl.searchParams.set("standalone", Date.now().toString());
const { default: worker } = await import(workerUrl.href);

const response = await worker.fetch(
  new Request("http://localhost/", { headers: { accept: "text/html" } }),
  { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
  { waitUntil() {}, passThroughOnException() {} },
);

if (!response.ok) throw new Error(`Falha ao renderizar HTML: ${response.status}`);
let html = await response.text();

const clientAssets = join(root, "dist/client/assets");
const cssFiles = (await readdir(clientAssets)).filter((file) => file.endsWith(".css"));
const css = (await Promise.all(cssFiles.map((file) => readFile(join(clientAssets, file), "utf8")))).join("\n");

html = html
  .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
  .replace(/<link\b[^>]*rel=["'](?:stylesheet|modulepreload|preload)["'][^>]*>/gi, "")
  .replace("</head>", `<style>${css}</style></head>`);

const mimeTypes = {
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".mp3": "audio/mpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(path));
    else files.push(path);
  }
  return files;
}

for (const file of await walk(join(root, "public"))) {
  const publicPath = `/${relative(join(root, "public"), file).replaceAll("\\", "/")}`;
  if (!html.includes(publicPath) && !css.includes(publicPath)) continue;
  const mime = mimeTypes[extname(file).toLowerCase()] ?? "application/octet-stream";
  const dataUrl = `data:${mime};base64,${(await readFile(file)).toString("base64")}`;
  html = html.split(publicPath).join(dataUrl);
}

const behavior = String.raw`
<script>
(() => {
  const audio = document.querySelector('audio');
  const musicButton = document.querySelector('.music-control');
  let musicOn = false;
  const refreshMusicButton = () => {
    musicButton.setAttribute('aria-pressed', String(musicOn));
    musicButton.setAttribute('aria-label', musicOn ? 'Pausar música ambiente' : 'Tocar música ambiente');
    musicButton.innerHTML = '<span aria-hidden="true">' + (musicOn ? '♫' : '♩') + '</span>' + (musicOn ? 'Música baixa' : 'Tocar ambiente');
  };
  const playMusic = () => {
    audio.volume = 0.07;
    audio.play().then(() => { musicOn = true; refreshMusicButton(); }).catch(() => {});
  };
  const startOnFirstGesture = (event) => {
    if (event.target.closest && event.target.closest('.music-control')) return;
    playMusic();
  };
  window.addEventListener('pointerdown', startOnFirstGesture, { once: true });
  window.addEventListener('keydown', startOnFirstGesture, { once: true });
  musicButton.addEventListener('click', () => {
    if (audio.paused) playMusic();
    else { audio.pause(); musicOn = false; refreshMusicButton(); }
  });

  const ticketLinks = document.querySelectorAll('a[href*="discord.com/channels/1521577809938743396/1521987328225050724"]');
  const ticketNotice = document.querySelector('.ticket-notice');
  ticketLinks.forEach((link) => {
    link.addEventListener('click', () => {
      const card = link.closest('.property-card, .vip-card, .lore-ticket-callout, .ticket-helper');
      const subject = card && card.querySelector('h3') ? card.querySelector('h3').textContent.trim() : 'atendimento em SunnyValley';
      const message = 'Olá! Quero falar com um responsável sobre ' + subject + '. Meu nome no Discord é: _____. Posso receber atendimento?';
      if (navigator.clipboard) navigator.clipboard.writeText(message).catch(() => {});
      if (ticketNotice) {
        ticketNotice.textContent = 'Mensagem copiada. Cole no ticket quando o canal abrir.';
        ticketNotice.hidden = false;
      }
    });
  });

  const input = document.querySelector('.search-box input');
  const select = document.querySelector('.group-select select');
  const groups = [...document.querySelectorAll('.rule-group')];
  const count = document.querySelector('.rules-count');
  const total = document.querySelectorAll('.rule-card').length;
  const normalize = (value) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const applyFilters = () => {
    const term = normalize(input.value.trim());
    const category = select.options[select.selectedIndex].text;
    let visible = 0;
    groups.forEach((group) => {
      const groupName = group.querySelector('summary span').textContent.trim();
      const categoryMatches = category === 'Todas' || groupName === category;
      let groupVisible = 0;
      group.querySelectorAll('.rule-card').forEach((card) => {
        const show = categoryMatches && (!term || normalize(card.textContent).includes(term));
        card.hidden = !show;
        if (show) { visible += 1; groupVisible += 1; }
      });
      group.hidden = groupVisible === 0;
      if (term || category !== 'Todas') group.open = groupVisible > 0;
      const badge = group.querySelector('summary small');
      if (badge) badge.textContent = groupVisible + ' itens';
    });
    count.textContent = visible + ' de ' + total + ' itens exibidos';
  };
  input.addEventListener('input', applyFilters);
  select.addEventListener('change', applyFilters);
})();
</script>`;

html = html.replace("</body>", `${behavior}</body>`);
await writeFile(output, html);
console.log(`${output} criado (${(Buffer.byteLength(html) / 1024 / 1024).toFixed(2)} MB)`);
