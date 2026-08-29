const body = document.body;
const themeToggle = document.getElementById("themeToggle");
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const modalLabel = document.getElementById("modalLabel");
const modalText = document.getElementById("modalText");

document.getElementById("year").textContent = new Date().getFullYear();

const savedTheme = localStorage.getItem("sunnyvalley-theme");
if (savedTheme === "dark") {
  body.dataset.theme = "dark";
  themeToggle.textContent = "☀";
}

themeToggle.addEventListener("click", () => {
  const dark = body.dataset.theme === "dark";
  if (dark) {
    delete body.dataset.theme;
    localStorage.setItem("sunnyvalley-theme", "light");
    themeToggle.textContent = "☾";
  } else {
    body.dataset.theme = "dark";
    localStorage.setItem("sunnyvalley-theme", "dark");
    themeToggle.textContent = "☀";
  }
});

menuToggle.addEventListener("click", () => {
  nav.classList.toggle("mobile-open");
});

document.querySelectorAll(".nav a").forEach(link => {
  link.addEventListener("click", () => nav.classList.remove("mobile-open"));
});

const modalContent = {
  segredo: {
    label: "ARQUIVO LOCAL",
    title: "O Segredo de SunnyValley",
    text: "Os relatos mais antigos falam de uma neblina que chega sem aviso, de ruas que ficam silenciosas por alguns minutos e de um sino ouvido durante a madrugada. Moradores antigos raramente explicam o que sabem. A recomendação informal é simples: quando a cidade ficar quieta demais, não procure descobrir por quê."
  },
  leonora: {
    label: "SV-2004-1018",
    title: "O caso Leonora Johnson",
    text: "O desaparecimento de Leonora Johnson permanece entre os arquivos mais comentados da península. Documentos fragmentados, testemunhos contraditórios e uma cronologia incompleta alimentaram décadas de especulação. O arquivo oficial continua sem uma conclusão definitiva."
  },
  sylvandor: {
    label: "HISTÓRIA ANTIGA",
    title: "A Ordem de Sylvandor",
    text: "Registros antigos descrevem uma ordem ligada à floresta e aos rituais realizados antes da expansão da cidade. Alguns documentos associam a ordem ao nome Zafiraeth e ao ano de 1666. Para a maioria, são apenas lendas. Em SunnyValley, essa distinção nunca foi tão confortável."
  }
};

document.querySelectorAll("[data-modal]").forEach(button => {
  button.addEventListener("click", () => {
    const item = modalContent[button.dataset.modal];
    if (!item) return;
    modalLabel.textContent = item.label;
    modalTitle.textContent = item.title;
    modalText.textContent = item.text;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
  });
});

function closeModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
}
document.querySelector(".modal-close").addEventListener("click", closeModal);
document.querySelector(".modal-backdrop").addEventListener("click", closeModal);
document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeModal();
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", event => {
    const target = document.querySelector(anchor.getAttribute("href"));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});
