"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import rulesData from "./rules-data.json";

type Rule = {
  group: string;
  subgroup: string;
  title: string;
  text: string;
};

const OFFICIAL_DISCORD = "https://discord.gg/SBHdfSjqaH";
const TICKET_DISCORD = "https://discord.gg/4R4z9NAXX7";
const SUPPORT_CHANNEL = "https://discord.com/channels/1521577809938743396/1521987328225050724";
const INSTAGRAM = "https://www.instagram.com/sunnyvalleyrp/";

function DiscordIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M20.32 4.37a19.8 19.8 0 0 0-4.89-1.52c-.21.38-.45.89-.62 1.28a18.3 18.3 0 0 0-5.42 0 13 13 0 0 0-.63-1.28 19.7 19.7 0 0 0-4.89 1.52C.78 9.17-.18 13.85.25 18.46a19.9 19.9 0 0 0 6 3.03c.49-.66.92-1.37 1.29-2.12a13 13 0 0 1-2.03-.97l.5-.39a14.2 14.2 0 0 0 11.98 0l.5.39c-.65.38-1.33.7-2.03.97.37.75.8 1.46 1.29 2.12a19.8 19.8 0 0 0 6-3.03c.5-5.35-.85-9.99-3.43-14.09ZM8.02 15.63c-1.17 0-2.13-1.08-2.13-2.41s.94-2.42 2.13-2.42c1.2 0 2.15 1.09 2.13 2.42 0 1.33-.94 2.41-2.13 2.41Zm7.96 0c-1.17 0-2.13-1.08-2.13-2.41s.94-2.42 2.13-2.42c1.2 0 2.15 1.09 2.13 2.42 0 1.33-.93 2.41-2.13 2.41Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 2.16c3.2 0 3.58.02 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.67 4.77-4.92 4.92-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92A83.4 83.4 0 0 1 2.16 12c0-3.2.02-3.58.07-4.85.15-3.23 1.67-4.77 4.92-4.92C8.42 2.18 8.8 2.16 12 2.16ZM12 0C8.74 0 8.33.01 7.05.07 2.7.27.27 2.69.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.2 4.36 2.62 6.78 6.98 6.98 1.28.06 1.69.07 4.95.07s3.67-.01 4.95-.07c4.35-.2 6.78-2.62 6.98-6.98.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95C23.73 2.7 21.31.27 16.95.07 15.67.01 15.26 0 12 0Zm0 5.84A6.16 6.16 0 1 0 12 18.16 6.16 6.16 0 0 0 12 5.84Zm0 10.16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.41-11.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88Z" />
    </svg>
  );
}

const additionalRules: Rule[] = [
  {
    group: "3. Acesso, voz, recursos técnicos e segurança",
    subgroup: "Voz e recursos narrativos",
    title: "Proibido se passar por entidade sem autorização",
    text: "É proibido usar modificador de voz, soundpad, áudio, gritos, sussurros ou qualquer efeito para fingir ser uma entidade, aparição ou personagem oficial da lore sem autorização expressa da equipe responsável.",
  },
  {
    group: "7. Regras de ações, assaltos e sequestros",
    subgroup: "7.1 Sequestros com contexto",
    title: "Construção obrigatória",
    text: "Sequestros são permitidos somente quando existir motivo narrativo coerente e construção prévia dentro do RP. Sequestrar aleatoriamente para gerar ação, humilhar ou impedir outra pessoa de jogar caracteriza abuso e fail RP.",
  },
  {
    group: "7. Regras de ações, assaltos e sequestros",
    subgroup: "7.1 Sequestros com contexto",
    title: "Comunicação temporariamente cortada",
    text: "Durante a cena, o sequestrador pode recolher o celular do personagem e exigir silêncio no rádio. A restrição vale somente dentro do RP e enquanto a ação estiver ativa; nunca pode impedir contato OOC com suporte, administração ou pedido real de ajuda.",
  },
  {
    group: "7. Regras de ações, assaltos e sequestros",
    subgroup: "7.1 Sequestros com contexto",
    title: "Limites e segurança",
    text: "É proibido usar sequestro para assédio, tortura gráfica, conteúdo sexual, discriminação, exposição de dados ou constrangimento pessoal. Uma palavra de pausa ou orientação da equipe encerra imediatamente qualquer conteúdo sensível.",
  },
  {
    group: "7. Regras de ações, assaltos e sequestros",
    subgroup: "7.1 Sequestros com contexto",
    title: "Valor à vida e encerramento",
    text: "Todas as partes devem valorizar a vida e interpretar medo, risco e consequências. O sequestrador precisa oferecer uma saída narrativa; não pode impor morte permanente, apagar memória, retirar patrimônio ou manter a vítima indefinidamente.",
  },
  {
    group: "7. Regras de ações, assaltos e sequestros",
    subgroup: "7.1 Sequestros com contexto",
    title: "Sem combat logging",
    text: "Nenhuma parte pode desconectar, trocar de personagem ou usar falhas para escapar da ação. Em caso de queda, avise no canal indicado e retorne assim que possível.",
  },
  {
    group: "7. Regras de ações, assaltos e sequestros",
    subgroup: "7.2 Corrupção narrativa",
    title: "Corrupção é permitida dentro do RP",
    text: "Personagens podem desenvolver corrupção com contexto, progressão e consequências. A história deve permanecer dentro do RP e não pode servir para favorecer amigos, vender cargo, fraudar sistemas, manipular denúncias ou obter vantagem administrativa.",
  },
  {
    group: "7. Regras de ações, assaltos e sequestros",
    subgroup: "7.2 Corrupção narrativa",
    title: "Cargos públicos e provas",
    text: "Médicos, xerifes, funcionários e proprietários corruptos continuam sujeitos à investigação e às consequências da cidade. Provas administrativas, logs, tickets e decisões da equipe nunca podem ser alterados ou tratados como parte da corrupção IC.",
  },
];

const rules = [
  ...additionalRules,
  ...(rulesData as Rule[])
    .filter((rule) => ![
      "Sequestro e cárcere",
      "Corrupção",
      "Sem corrupção",
      "Regra rápida 5",
      "Orientação 5",
    ].includes(rule.title))
    .map((rule) => ({
      ...rule,
      group: rule.group === "7. Regras de assalto e proibição total de crimes"
        ? "7. Regras de ações, assaltos e sequestros"
        : rule.group,
      text: rule.title === "RDM"
        ? "Atacar ou matar sem construção narrativa. SunnyValley não possui PVP livre; agressões precisam de contexto válido, consentimento quando aplicável e respeito às regras da ação."
        : rule.text,
    })),
];
const groups = ["Todas", ...Array.from(new Set(rules.map((rule) => rule.group)))];

const shortGroup = (group: string) => group.replace(/^\d+\.\s*/, "");

const attractions = [
  { id: "pousadas", icon: "⌂", title: "Pousadas", text: "Quartos acolhedores, café fresco e belas vistas para as montanhas. Os prédios são antigos; trate seus ruídos com a devida educação." },
  { id: "gastronomia", icon: "◈", title: "Gastronomia local", text: "Restaurantes familiares, lanchonetes e experiências à beira da água — do almoço costeiro ao jantar cinco estrelas." },
  { id: "aguas", icon: "≈", title: "Águas calmas", text: "Pesca, natação, praia e passeios de lancha com a península inteira refletida no horizonte." },
  { id: "trilhas", icon: "△", title: "Trilhas e acampamentos", text: "Pinheiros, cachoeiras, mirantes, rotas sinalizadas e áreas preparadas para acampar em família." },
  { id: "paraquedismo", icon: "↟", title: "Paraquedismo", text: "Veja as montanhas, a floresta e a costa inteira em uma experiência inesquecível sobre o vale." },
  { id: "historia", icon: "✦", title: "História e fé", text: "Arquitetura preservada, arquivos desde 1898 e uma fé local tão antiga quanto inabalável." },
];

const tourismCategoryCopy: Record<string, { day: string; night: string }> = {
  pousadas: { day: "Escolha sua hospedagem entre cafés frescos, quartos confortáveis e vistas inesquecíveis para a serra.", night: "Escolha um quarto, tranque a porta e não responda caso a recepção ligue depois das três." },
  gastronomia: { day: "Da cozinha costeira ao jantar cinco estrelas, SunnyValley serve experiências para todos os gostos.", night: "Boletins da vigilância registram movimento em cozinhas já fechadas. Os proprietários atribuem os ruídos aos prédios antigos." },
  aguas: { day: "Praias, marina, pesca e passeios de barco para descobrir a península pelo melhor ângulo.", night: "Pescadores relatam uma luz parada além do píer em noites sem embarcações registradas." },
  trilhas: { day: "Rotas sinalizadas, cachoeiras, mirantes e áreas de acampamento em meio aos pinheiros do norte.", night: "A prefeitura recolheu placas não oficiais encontradas nas trilhas. Nenhum departamento assumiu a instalação delas." },
  paraquedismo: { day: "Voe sobre as montanhas e veja toda a costa de SunnyValley em uma experiência panorâmica.", night: "Relatórios de voo mencionam luzes em uma antiga estrada florestal retirada das rotas oficiais." },
  historia: { day: "Conheça a arquitetura, os arquivos e a fé inabalável das famílias que construíram o vale.", night: "Os moradores mantêm sua fé. Ninguém se lembra do que havia ali antes dela." },
};

type TourismPlace = {
  category: string;
  name: string;
  type: string;
  location: string;
  image: string;
  nightImage?: string;
  text: string;
  nightText: string;
};

const tourismPlaces: TourismPlace[] = [
  { category: "trilhas", name: "Mirante Raton Canyon", type: "Mirante e trilha", location: "Raton Canyon", image: "/assets/mirante-raton-canyon.webp", text: "Um mirante cercado por pinheiros, com vista panorâmica para os paredões do cânion e acesso pelas trilhas oficiais do vale.", nightText: "Guias antigos mencionam uma rota apagada dos mapas. Em noites de neblina, ainda surgem fitas de trilha amarradas naquela direção." },
  { category: "aguas", name: "Praia Aurora", type: "Praia", location: "Costa Norte", image: "/assets/praia-aurora.webp", text: "Areia clara, águas tranquilas e estrutura para passar o dia inteiro à beira-mar.", nightText: "Funcionários dizem encontrar as cadeiras voltadas para o mar pela manhã, mesmo após deixarem a praia organizada na noite anterior." },
  { category: "pousadas", name: "Stag's Lodge", type: "Pousada e loja", location: "Mount Chiliad", image: "/assets/stags-lodge-day.webp", nightImage: "/assets/stags-lodge-night.webp", text: "Quartos acolhedores, café da manhã caseiro e uma pequena loja para viajantes da serra.", nightText: "As luzes permanecem acesas. A recepção insiste que nenhum quarto está ocupado." },
  { category: "pousadas", name: "Stag's Motel", type: "Ala da Pousada Stag's", location: "Mount Chiliad", image: "/assets/stags-motel-atualizado.webp", text: "A ala de estrada da Pousada Stag's oferece quartos simples e silenciosos aos pés da floresta.", nightText: "Uma planta de 1977 registra um quarto que a administração afirma nunca ter existido." },
  { category: "gastronomia", name: "Mojito Inn", type: "Bar e restaurante", location: "Paleto Bay", image: "/assets/mojito-inn.webp", text: "Drinks tropicais, pratos rápidos e encontros descontraídos no centro de Paleto.", nightText: "O último cliente nunca aparece nas fotografias, embora sempre deixe a cadeira molhada." },
  { category: "gastronomia", name: "Marina Étoile", type: "Restaurante cinco estrelas", location: "Marina Crystal Bay", image: "/assets/restaurante-marina-5-estrelas.webp", text: "Alta gastronomia, menu degustação sazonal e serviço elegante diante da marina.", nightText: "A reserva das 23h nunca tem nome, mas a mesa permanece posta." },
  { category: "trilhas", name: "Trilha Mount Chiliad", type: "Trilha ecológica", location: "Floresta Norte", image: "/assets/trilha-mount-chiliad.webp", text: "Uma rota oficial entre pinheiros, formações rochosas e vistas do vale.", nightText: "A placa pede que você siga a trilha. A trilha, por outro lado, pede outra coisa." },
  { category: "gastronomia", name: "Hookies Seafood", type: "Restaurante de frutos do mar", location: "Costa Norte", image: "/assets/hookies-seafood.webp", text: "Peixes frescos, frutos do mar, mesas ao ar livre e o pôr do sol da estrada costeira.", nightText: "Não pergunte de onde veio o prato especial quando o mar estiver completamente quieto." },
  { category: "gastronomia", name: "The Hen House", type: "Bar e boate", location: "Paleto Bay", image: "/assets/hen-house-nightclub-4k.webp", text: "Bar, pista de dança e noites animadas para quem prefere conhecer o lado mais vibrante da cidade.", nightText: "A música termina no horário. Se continuar ouvindo passos na pista, não volte para buscar nada." },
  { category: "aguas", name: "Marina Crystal Bay", type: "Marina", location: "Sandy Shores", image: "/assets/marina-crystal-bay.webp", text: "Águas cristalinas, píeres, pesca e acesso para passeios de barco durante o dia.", nightText: "Nenhuma embarcação sai à noite. As que chegam não constam no registro da marina." },
  { category: "pousadas", name: "Pousada Sicilia", type: "Pousada histórica", location: "Sandy Shores", image: "/assets/pousada-sicilia.webp", text: "Arquitetura clássica, pátio interno, café fresco e quartos próximos à avenida principal.", nightText: "Uma planta encontrada na recepção desenha o pátio com dimensões diferentes das registradas pela prefeitura." },
  { category: "historia", name: "A Fé dos Moradores", type: "Tradição do vale", location: "Centro Histórico", image: "/assets/primeira-capela.webp", text: "A fé dos moradores de SunnyValley é silenciosa, antiga e inabalável. Em tempos difíceis, cada família coloca uma vela na janela.", nightText: "Fotografias de noites de neblina mostram velas acesas nas ruínas da Primeira Capela. Nenhum morador admite tê-las colocado ali." },
  { category: "historia", name: "Hospital de Sandy", type: "Patrimônio histórico", location: "Sandy Shores", image: "/assets/hospital-sandy-monumento-4k.webp", text: "O hospital preserva sua arquitetura histórica e o pátio dos primeiros atendimentos da região. Seu monumento homenageia o primeiro prefeito de SunnyValley, responsável por financiar os primeiros leitos da cidade.", nightText: "Uma fotografia antiga do monumento mostra, ao fundo, a entrada de uma ala que não aparece nas plantas atuais do hospital." },
  { category: "historia", name: "Universidade de Sandy", type: "Patrimônio educacional", location: "Sandy Shores", image: "/assets/universidade-sandy.webp", text: "A universidade reúne estudantes de toda SunnyValley e preserva parte importante da história acadêmica da região, unindo formação, memória e tradição comunitária.", nightText: "Os corredores ficam vazios depois da última aula. Ainda assim, algumas salas continuam marcando presença no livro de chamada." },
  { category: "paraquedismo", name: "SkyVale", type: "Base de paraquedismo e bondinho", location: "Mount Chiliad", image: "/assets/skyvale-bondinho.webp", text: "Suba de bondinho até a base e aproveite saltos panorâmicos sobre as montanhas, a floresta e toda a costa norte.", nightText: "O livro da estação registra uma cabine retirada de serviço em 1986. Alguns passageiros ainda descrevem seu número nos relatos de subida." },
  { category: "paraquedismo", name: "O Norte Visto do Alto", type: "Experiência panorâmica", location: "Paleto Bay", image: "/assets/paisagem-norte-4k.webp", text: "Veja o norte inteiro do alto, das montanhas de Chiliad até as praias de Paleto Bay.", nightText: "Pilotos relatam luzes em uma estrada abandonada ao norte. O xerifado atribui o fenômeno a acampamentos irregulares." },
  { category: "trilhas", name: "Trilha dos Pinheiros", type: "Trilha ecológica", location: "Floresta Norte", image: "/assets/trilha-pinheiros-4k.webp", text: "Uma subida tranquila entre pinheiros, flores silvestres e mirantes naturais do vale.", nightText: "Ao anoitecer, a trilha parece mais longa. Não siga pegadas que começam no meio do caminho." },
];

type Property = { category: string; name: string; label: string; location: string; rooms: string; images: string[]; text: string; nightText: string };

const properties: Property[] = [
  { category: "casas", name: "Mansão Blackwood", label: "Casa premium", location: "Paleto Bay", rooms: "", images: ["/assets/mansion-blackwood-exterior.webp", "/assets/mansion-blackwood-interior.webp"], text: "Arquitetura moderna integrada à montanha, interior amplo, deck privativo e acesso direto às águas do vale.", nightText: "Uma fotografia do antigo proprietário mostra uma porta hoje substituída por uma parede." },
  { category: "casas", name: "Mansão Serenity", label: "Mansão costeira", location: "Paleto Bay", rooms: "", images: ["/assets/azurecliff-estate-exterior.webp", "/assets/azurecliff-estate-interior.webp"], text: "Uma residência contemporânea à beira-mar, com fachada panorâmica, piscina, amplos terraços e interiores de pé-direito duplo voltados para a costa de Paleto.", nightText: "Uma fotografia noturna das paredes de vidro parece refletir outra fachada atrás do fotógrafo. A casa estava vazia quando a imagem foi registrada." },
  { category: "casas", name: "Mansão do Vinhedo", label: "Mansão clássica", location: "Paleto Bay", rooms: "", images: ["/assets/mansao-vinhedo-exterior.webp", "/assets/mansao-vinhedo-interior.webp"], text: "Uma propriedade clássica cercada por vinhedos, com jardins reservados, arquitetura mediterrânea e amplos salões para receber convidados.", nightText: "Vigias relatam uma figura atravessando as fileiras do vinhedo antes do fechamento. Nenhuma invasão foi confirmada." },
  { category: "casas", name: "Mansão Tropical", label: "Mansão contemporânea", location: "Paleto Bay", rooms: "", images: ["/assets/mansao-tropical-exterior-piscina.webp", "/assets/mansao-tropical-exterior-jardim.webp", "/assets/mansao-tropical-interior.webp"], text: "Arquitetura contemporânea cercada por palmeiras, áreas externas amplas, piscina panorâmica e ambientes internos pensados para lazer e recepções.", nightText: "Uma sequência de fotografias da piscina mostra luzes em cômodos que constavam como desocupados naquela noite." },
  { category: "penthouses", name: "Penthouse Grand Valley", label: "Cobertura familiar", location: "Sandy Shores", rooms: "4 quartos", images: ["/assets/penthouse-4-quartos.webp"], text: "Uma cobertura espaçosa com cozinha clássica e ambientes para receber todo o grupo.", nightText: "O anúncio confirma quatro quartos. Um inventário antigo, porém, descreve móveis pertencentes a um quinto dormitório." },
  { category: "penthouses", name: "Penthouse Vista Norte", label: "Cobertura compacta", location: "Sandy Shores", rooms: "1 quarto", images: ["/assets/penthouse-1-quarto.webp"], text: "Planta funcional, cozinha contemporânea e uma localização central para morar sozinho.", nightText: "O laudo de vistoria cita louça para duas pessoas, embora o antigo contrato tivesse apenas um morador." },
  { category: "penthouses", name: "Penthouse Sunset", label: "Cobertura contemporânea", location: "Sandy Shores", rooms: "2 quartos", images: ["/assets/penthouse-2-quartos.webp"], text: "Sala confortável, dois quartos e iluminação acolhedora próxima aos serviços de Sandy.", nightText: "Vizinhos relatam ver as cortinas fechadas em noites nas quais o imóvel consta como vazio." },
  { category: "casas", name: "Casas em Sandy e Paleto", label: "Coleção residencial", location: "Sandy Shores • Paleto Bay", rooms: "", images: ["/assets/casa-sandy-desert-rose.webp", "/assets/casa-sandy-palm-haven.webp", "/assets/casa-sandy-interior.webp"], text: "Mais de vinte casas estão disponíveis entre Sandy e Paleto. As fotografias mostram apenas alguns exemplos; cada imóvel possui fachada, localização e opções de interior próprias para você escolher.", nightText: "Mais de vinte casas continuam disponíveis. Algumas parecem ocupadas nas fotografias, mesmo quando os registros dizem o contrário." },
];

const vipPlans = [
  { name: "Turista", price: "R$ 100", period: "30 dias", inheritance: "3.000", mark: "Bilhete de entrada", benefits: ["1 veículo disponível no catálogo", "1 casa em Paleto", "Tag exclusiva no Discord", "Prioridade no atendimento de benefícios", "Participação em eventos para apoiadores"] },
  { name: "Morador", price: "R$ 250", period: "30 dias", inheritance: "5.000", mark: "Chaves do vale", benefits: ["2 veículos + 1 motocicleta do catálogo", "1 casa em Sandy ou Paleto", "Tag exclusiva no Discord", "Atendimento prioritário", "Reserva antecipada em eventos da cidade"] },
  { name: "Herdeiro do Vale", price: "R$ 400", period: "30 dias", inheritance: "10.000", mark: "Legado de família", featured: true, benefits: ["4 veículos + 1 motocicleta do catálogo", "1 barco disponível", "1 casa premium ou penthouse", "Consultoria para história do personagem", "Tag exclusiva e atendimento prioritário"] },
  { name: "O Pacto", price: "R$ 550", period: "até o wipe", inheritance: "20.000", mark: "Não pergunte o preço real", benefits: ["5 veículos + 2 motocicletas do catálogo", "Mansão e penthouse", "1 helicóptero + 2 barcos disponíveis", "Consultoria narrativa com a equipe de lore", "Tag exclusiva e prioridade máxima no atendimento"] },
];

const punishmentRows = [
  ["Orientação", "Dúvida ou primeira falha leve", "Conversa registrada e orientação formal"],
  ["Leve", "Spam, canal incorreto ou fail RP de baixo impacto", "Advertência, restrição temporária ou suspensão curta"],
  ["Grave", "Meta, powergaming, bug, combat log ou assédio persistente", "Suspensão prolongada, remoção de benefício/cargo ou banimento"],
  ["Gravíssima", "Ódio, exposição de dados, hack, fraude, crime RP ou evasão", "Banimento imediato ou permanente, conforme apuração"],
];

export default function Home() {
  const [activeGroup, setActiveGroup] = useState("Todas");
  const [query, setQuery] = useState("");
  const [musicOn, setMusicOn] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [ticketNotice, setTicketNotice] = useState("");
  const [articleOpen, setArticleOpen] = useState(false);
  const [editionOpen, setEditionOpen] = useState(false);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [archiveReportOpen, setArchiveReportOpen] = useState(false);
  const [seaWitchOpen, setSeaWitchOpen] = useState(false);
  const [activeTourism, setActiveTourism] = useState("pousadas");
  const [tourismCategoryOpen, setTourismCategoryOpen] = useState<string | null>(null);
  const [activeProperty, setActiveProperty] = useState("todos");
  const [galleryOpen, setGalleryOpen] = useState<TourismPlace | null>(null);
  const [propertyOpen, setPropertyOpen] = useState<Property | null>(null);
  const [galleryImage, setGalleryImage] = useState(0);
  const [newspaperZoom, setNewspaperZoom] = useState(1);
  const [editionZoom, setEditionZoom] = useState(1);
  const [distortionActive, setDistortionActive] = useState(false);
  const [photoWhispersActive, setPhotoWhispersActive] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const nightSoundPlayedRef = useRef(false);

  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? "dark" : "light";
  }, [darkMode]);

  useEffect(() => {
    const modalOpen = articleOpen || editionOpen || archiveOpen || archiveReportOpen || seaWitchOpen || Boolean(tourismCategoryOpen) || Boolean(galleryOpen) || Boolean(propertyOpen);
    if (!modalOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setArticleOpen(false);
        setEditionOpen(false);
        setArchiveOpen(false);
        setArchiveReportOpen(false);
        setSeaWitchOpen(false);
        setTourismCategoryOpen(null);
        setGalleryOpen(null);
        setPropertyOpen(null);
      }
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [articleOpen, editionOpen, archiveOpen, archiveReportOpen, seaWitchOpen, tourismCategoryOpen, galleryOpen, propertyOpen]);

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.07;
    if (audio.paused) void audio.play().then(() => setMusicOn(true));
    else {
      audio.pause();
      setMusicOn(false);
    }
  };

  const playDistantSound = () => {
    if (nightSoundPlayedRef.current) return;
    nightSoundPlayedRef.current = true;
    try {
      const context = new window.AudioContext();
      const master = context.createGain();
      const low = context.createOscillator();
      const echo = context.createOscillator();
      master.gain.setValueAtTime(0.0001, context.currentTime);
      master.gain.exponentialRampToValueAtTime(0.025, context.currentTime + 0.35);
      master.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 2.8);
      low.type = "sine";
      low.frequency.setValueAtTime(82, context.currentTime);
      low.frequency.exponentialRampToValueAtTime(57, context.currentTime + 2.8);
      echo.type = "triangle";
      echo.frequency.setValueAtTime(164, context.currentTime);
      echo.detune.setValueAtTime(-18, context.currentTime);
      low.connect(master);
      echo.connect(master);
      master.connect(context.destination);
      low.start();
      echo.start();
      low.stop(context.currentTime + 2.85);
      echo.stop(context.currentTime + 2.85);
      echo.addEventListener("ended", () => void context.close(), { once: true });
    } catch {
      // O modo escuro continua funcionando mesmo quando o navegador bloqueia áudio.
    }
  };

  const toggleTheme = () => {
    if (!darkMode) playDistantSound();
    else setPhotoWhispersActive(false);
    setDarkMode((current) => !current);
  };

  const revealPhotoWhispers = () => {
    if (darkMode) setPhotoWhispersActive(true);
  };

  const playBellSound = () => {
    try {
      const context = new window.AudioContext();
      const master = context.createGain();
      const bell = [196, 392, 784].map((frequency, index) => {
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        oscillator.type = index === 0 ? "sine" : "triangle";
        oscillator.frequency.setValueAtTime(frequency, context.currentTime);
        oscillator.detune.setValueAtTime(index * -7, context.currentTime);
        gain.gain.setValueAtTime(0.0001, context.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.028 / (index + 1), context.currentTime + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 4.2);
        oscillator.connect(gain);
        gain.connect(master);
        return oscillator;
      });
      master.gain.setValueAtTime(0.68, context.currentTime);
      master.connect(context.destination);
      bell.forEach((oscillator) => {
        oscillator.start();
        oscillator.stop(context.currentTime + 4.25);
      });
      bell[0].addEventListener("ended", () => void context.close(), { once: true });
    } catch {
      // O arquivo continua acessível quando o navegador bloqueia áudio.
    }
  };

  const openArchive = () => {
    setDistortionActive(true);
    playBellSound();
    window.setTimeout(() => setDistortionActive(false), 1650);
    window.setTimeout(() => setArchiveOpen(true), 420);
  };

  const copyTicketMessage = async (subject: string) => {
    const message = subject.includes("imóvel") || subject.includes("compra de")
      ? "Olá! Quero falar com um responsável sobre a compra de um imóvel em SunnyValley."
      : `Olá! Quero falar com um responsável sobre ${subject} em SunnyValley.`;
    try {
      await navigator.clipboard.writeText(message);
      setTicketNotice("Mensagem copiada. Cole no ticket quando o canal abrir.");
    } catch {
      setTicketNotice("Abra o canal e envie a mensagem de atendimento exibida abaixo.");
    }
  };

  const openTourismPlace = (place: TourismPlace) => {
    setGalleryImage(0);
    setGalleryOpen(place);
  };

  const showTourismCategory = (category: string) => {
    setActiveTourism(category);
    setTourismCategoryOpen(category);
  };

  const openTenMistReport = () => {
    setArchiveOpen(false);
    setArchiveReportOpen(true);
  };

  const visibleProperties = properties.filter((property) => activeProperty === "todos" || property.category === activeProperty);

  const filteredRules = useMemo(() => {
    const term = query.trim().toLocaleLowerCase("pt-BR");
    return rules.filter((rule) => {
      const groupMatch = activeGroup === "Todas" || rule.group === activeGroup;
      const haystack = `${rule.group} ${rule.subgroup} ${rule.title} ${rule.text}`.toLocaleLowerCase("pt-BR");
      return groupMatch && (!term || haystack.includes(term));
    });
  }, [activeGroup, query]);

  const groupedRules = useMemo(() => {
    return groups.slice(1).map((group) => ({
      group,
      rules: filteredRules.filter((rule) => rule.group === group),
    })).filter((entry) => entry.rules.length > 0);
  }, [filteredRules]);

  return (
    <main className={`site-shell ${darkMode ? "dark-mode" : "light-mode"} ${distortionActive ? "archive-distorting" : ""}`}>
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
      <div className="dark-atmosphere" aria-hidden="true"><span /><span /><span /></div>
      <div className={`night-whisper-layer ${photoWhispersActive ? "whispers-active" : ""}`} aria-hidden="true">
        <span className="night-whisper whisper-one">NÃO OLHE PARA TRÁS</span>
        <span className="night-whisper whisper-two">A ESTRADA JÁ SE REPETIU</span>
        <span className="night-whisper whisper-three">HÁ ALGUÉM NO QUARTO</span>
        <span className="night-whisper whisper-four">VOCÊ CHEGOU TARDE DEMAIS</span>
        <span className="night-whisper whisper-five">NÃO CONTE O GRUPO DE NOVO</span>
        <span className="night-whisper whisper-six">A CIDADE ESTÁ ACORDADA</span>
        <span className="night-whisper whisper-seven">A PORTA NÃO ESTAVA ABERTA</span>
        <span className="night-whisper whisper-eight">ELA SABE SEU NOME</span>
      </div>
      {distortionActive && <div className="distortion-flash" aria-hidden="true"><span>VOCÊ FOI VISTO</span></div>}
      <audio ref={audioRef} src="/assets/velvet-dollhouse-low.ogg" loop preload="metadata" />
      <button className="music-control" type="button" onClick={toggleMusic} aria-pressed={musicOn} aria-label={musicOn ? "Pausar música ambiente" : "Tocar música ambiente"}>
        <span aria-hidden="true">{musicOn ? "♫" : "♩"}</span>{musicOn ? "Música baixa" : "Tocar ambiente"}
      </button>

      <nav className="nav" aria-label="Navegação principal">
        <a className="brand" href="#inicio" aria-label="SunnyValley — início">
          <span className="brand-lockup"><img className="brand-wordmark" src="/assets/sunnyvalley-wordmark.png" alt="SunnyValley" /><small>Desde 1898</small></span>
        </a>
        <div className="nav-links">
          <a href="#cidade">A cidade</a><a href="#turismo">Turismo</a><a href="#lore">Histórias do vale</a><a href="#imoveis">Imóveis</a><a href="#regras">Regras</a><a href="#vips">VIPs</a>
        </div>
        <details className="mobile-nav">
          <summary>Menu</summary>
          <div><a href="#cidade">A cidade</a><a href="#turismo">Turismo</a><a href="#lore">Histórias do vale</a><a href="#imoveis">Imóveis</a><a href="#regras">Regras</a><a href="#vips">VIPs</a></div>
        </details>
        <button className="theme-toggle" type="button" onClick={toggleTheme} aria-pressed={darkMode} aria-label={darkMode ? "Ativar modo claro" : "Ativar modo escuro"}>
          <img src={darkMode ? "/assets/sol-inteiro.webp" : "/assets/lua.webp"} alt="" aria-hidden="true" /><small>{darkMode ? "Modo claro" : "Modo escuro"}</small>
        </button>
      </nav>

      <header className="hero" id="inicio">
        <div className="hero-grain" />
        <img className="hero-sun" src="/assets/sol.webp" alt="" />
        <img className="hero-moon" src="/assets/lua.webp" alt="" />
        <div className="hero-content">
          <div className="hero-copy">
            <p className="eyebrow">{darkMode ? "REGISTRO DE CHEGADA • IDENTIDADE CONFIRMADA" : "Península Norte • San Andreas"}</p>
            <img className="hero-wordmark" src="/assets/logo-sunnyvalley.webp" alt="SunnyValley" />
            <h1>{darkMode ? <>Olá,<br /><em>novamente.</em></> : <>Olá,<br /><em>turista.</em></>}</h1>
            <p className="hero-lead">{darkMode ? "Você não recebeu um convite. Recebeu uma convocação. A estrada soube seu nome antes mesmo de você chegar." : "Desde 1898, SunnyValley recebe viajantes em busca de águas tranquilas, montanhas imponentes e férias que ninguém consegue esquecer."}</p>
            <div className="hero-actions">
              <a className="button primary" href={TICKET_DISCORD} target="_blank" rel="noreferrer">{darkMode ? "Entre antes que feche" : "Compre sua passagem"}</a>
              <a className="button ghost" href="#turismo">{darkMode ? "Não olhe para trás" : "Conheça o vale"}</a>
            </div>
            <div className="social-row" aria-label="Redes oficiais">
              <a className="social-link discord-link" href={OFFICIAL_DISCORD} target="_blank" rel="noreferrer">
                <span className="social-icon"><DiscordIcon /></span>
                <span className="social-copy"><strong>Discord da cidade</strong><small>Entre na comunidade oficial</small></span>
              </a>
              <a className="social-link instagram-link" href={INSTAGRAM} target="_blank" rel="noreferrer">
                <span className="social-icon"><InstagramIcon /></span>
                <span className="social-copy"><strong>Instagram oficial</strong><small>@sunnyvalleyrp</small></span>
              </a>
            </div>
          </div>
          <div className="postcard-wrap">
            <img src="/assets/cartao-postal-oficial.webp" alt="Cartão-postal oficial convidando turistas para SunnyValley" />
            <span className="postcard-shadow" />
          </div>
        </div>
      </header>

      <div id="conteudo">
        <section className="intro section" id="cidade">
          <div className="section-label">{darkMode ? "A cidade se lembra" : "Bem-vindo ao vale"}</div>
          <div className="intro-grid">
            <div>
              <h2>{darkMode ? "Você chegou antes. Só não se recorda." : "As férias perfeitas, desde 1898."}</h2>
              <p className="large-copy">{darkMode ? "O cartão-postal estava endereçado com a sua letra. Ninguém sabe quem o enviou, mas todos os moradores já esperavam por você." : "SunnyValley é aquele refúgio dos sonhos que parecia existir apenas em cartões-postais: praias de águas calmas, florestas densas, trilhas ecológicas e uma arquitetura histórica cheia de personalidade."}</p>
              <p>{darkMode ? "As lojas fecharam cedo. Um motorista registrou que a mesma silhueta apareceu em três curvas diferentes da estrada. O xerifado arquivou o relato como efeito da neblina." : "Durante o dia, o comércio se movimenta, as pousadas servem café fresco e os moradores recebem visitantes com uma hospitalidade impecável. Chegue pela estrada do norte e comece sua história no vale."}</p>
            </div>
            <div className="fact-board">
              <div><strong>1898</strong><span>recebendo turistas</span></div>
              <div><strong>06</strong><span>experiências oficiais</span></div>
              <div><strong>17</strong><span>lugares no guia</span></div>
              <div><strong>01</strong><span>viagem inesquecível</span></div>
              <blockquote>“Quem entra no vale simplesmente não quer ir embora.”</blockquote>
            </div>
          </div>
          <img className="tourism-collage" src="/assets/fotos-turisticas.webp" alt="Fotos turísticas de SunnyValley: placa de boas-vindas, rua principal, águas, trilha e píer" />
        </section>

        <section className="landscape-band" aria-label="Vista das montanhas e da costa de SunnyValley">
          <div className="landscape-copy"><span>Conheça a região norte</span><strong>Onde a montanha encontra o mar.</strong></div>
        </section>

        <section className="section attractions" id="turismo">
          <div className="section-heading">
            <div><span className="section-label">{darkMode ? "Todos os lugares estão abertos" : "Guia oficial de turismo"}</span><h2>{darkMode ? <>Há algo observando<br />todos. Sempre.</> : <>Há algo para todos.<br />Quase sempre.</>}</h2></div>
            <p>{darkMode ? "Escolha com cuidado. Alguns guias foram encontrados sem assinatura nos arquivos da recepção, e ninguém da prefeitura reconhece as rotas marcadas neles." : "Escolha seu passeio, pegue seu ingresso e siga as recomendações dos guias locais. Elas existem exclusivamente para o seu conforto."}</p>
          </div>
          <div className="attraction-grid tourism-categories" role="tablist" aria-label="Categorias turísticas">
            {attractions.map((item, index) => <button className={`attraction-card ${activeTourism === item.id ? "active" : ""}`} type="button" onClick={() => showTourismCategory(item.id)} key={item.title}><span className="card-number">0{index + 1}</span><span className="card-icon" aria-hidden="true">{item.icon}</span><h3>{item.title}</h3><p>{darkMode ? tourismCategoryCopy[item.id].night : item.text}</p><b>Ver lugares <span aria-hidden="true">→</span></b></button>)}
          </div>
          <div className="tourism-photo-grid" aria-label="Paisagens turísticas de SunnyValley">
            <figure onPointerEnter={revealPhotoWhispers} onPointerDown={revealPhotoWhispers}><img src="/assets/trilha-turistica-4k.webp" alt="Trilha entre pinheiros aos pés da montanha" /><figcaption><span>Montanhas do norte</span><strong>Trilhas para quem prefere manter os pés no chão.</strong></figcaption></figure>
            <figure onPointerEnter={revealPhotoWhispers} onPointerDown={revealPhotoWhispers}><img src="/assets/pier-turistico-4k.webp" alt="Píer de diversões sobre as águas de SunnyValley" /><figcaption><span>Costa de SunnyValley</span><strong>Águas tranquilas, diversão e uma vista inesquecível.</strong></figcaption></figure>
          </div>
          <p className="tourism-open-note">Escolha uma categoria acima para abrir seu guia ilustrado sem sair desta página.</p>
        </section>

        <section className="lore-section" id="lore">
          <div className="lore-hero">
            <div className="lore-hero-copy">
              <span className="section-label light">Arquivo oficial da cidade</span>
              <h2>“Quem entra no vale simplesmente não quer ir embora.”</h2>
              <p>Se você recebeu um cartão-postal de SunnyValley, considere-se oficialmente convidado. Pegue seu ingresso, siga pela estrada do norte e guarde a data da chegada. Os arquivos da cidade gostam de datas exatas.</p>
            </div>
          </div>

          <div className="section lore-content">
            <article className="lore-chapter lore-vacation">
              <span className="chapter-number">Capítulo I</span>
              <h3>As Férias Perfeitas</h3>
              <p>Fundada oficialmente em 1898, SunnyValley cresceu entre a pesca, as pousadas da estrada e as famílias que transformaram o norte em lar. Durante o dia, praias, trilhas, comércio e arquitetura histórica sustentam a imagem impecável impressa nos cartões-postais.</p>
              <p>Os moradores recebem turistas com educação, indicam os melhores pontos de pesca e respeitam a privacidade de quem chega. Só evitam conversar sobre os sinos da floresta, as manchas deixadas pela chuva e as ruínas da Primeira Capela.</p>
              <blockquote>Respire fundo, relaxe e aproveite…</blockquote>
            </article>

            <article className="lore-chapter lore-secret">
              <span className="chapter-number">Capítulo II</span>
              <h3>O Segredo de SunnyValley</h3>
              <p><em>Mas fique atento ao relógio, querido turista. Aqui, o tempo voa.</em></p>
              <p>Quando o sol começa a desaparecer atrás das grandes montanhas do norte, a atmosfera vibrante de SunnyValley muda drasticamente. O vento esfria, os pássaros ficam completamente em silêncio e uma neblina espessa começa a rastejar pelo horizonte, engolindo as ruas de paralelepípedo.</p>
              <p>É nesse momento que o primeiro som ecoa pela cidade. Não é um alarme. Não é um aviso moderno. É apenas um som atravessando a neblina.</p>
              <p>Se estiver na rua, você perceberá algo ainda mais estranho: os moradores não correm e não demonstram medo. Apenas interrompem o que estão fazendo com uma calma quase hipnótica, recolhem seus pertences e trancam as portas e janelas de madeira.</p>
              <p>Caso pergunte por que todos estão se escondendo, eles desviarão o olhar por alguns segundos. Depois, voltarão o rosto para você e abrirão aquele mesmo sorriso largo, simétrico e forçado — imóvel o suficiente para fazer sua espinha congelar.</p>
              <p>Então responderão com uma voz mansa, quase cantada, repetindo uma antiga cantiga que todos em SunnyValley parecem conhecer de cor. Antes que você compreenda as palavras, a porta será fechada.</p>
              <div className="lore-after-dark">
                <p>Depois disso, SunnyValley não fica deserta. Ela apenas parece estar… <em>esperando.</em></p>
                <p>Relatórios antigos descrevem motoristas que reconheceram a mesma placa várias vezes, relógios encontrados com horas de atraso e marcas molhadas em bancos de carros que viajavam vazios. O xerifado atribuiu os casos ao cansaço, à neblina e à desorientação nas estradas do norte.</p>
                <p><strong>Se conseguir retornar, recomendamos que não conte para ninguém o que viu enquanto tentava deixar SunnyValley.</strong> As pessoas de fora podem ser terrivelmente preconceituosas e acabar usando palavras tão desagradáveis como… bem… <em>louco.</em></p>
              </div>
              <blockquote>Naturalmente, tudo isso faz parte do folclore local.</blockquote>
              <h4>Então sorria, relaxe e aproveite sua estadia. Afinal, não existe motivo algum para querer ir embora.</h4>
            </article>

            <section className="local-guidance" aria-labelledby="recomendacoes-locais">
              <div className="guidance-heading"><span className="chapter-number">Guia do visitante</span><h3 id="recomendacoes-locais">Recomendações Locais</h3><p>Orientações cuidadosamente preparadas para tornar suas férias mais seguras e agradáveis.</p></div>
              <div className="guidance-grid">
                <article><strong>01</strong><p><b>Se a neblina aparecer acompanhada de um som grave, entre imediatamente em um lugar fechado.</b> Feche as portas e afaste-se das janelas. O som não avisa que alguma coisa vai chegar — <em>avisa que já chegou.</em></p></article>
                <article><strong>02</strong><p><b>Não entre na floresta depois do anoitecer.</b> Todas as trilhas oficiais fecham antes do pôr do sol. Nenhum funcionário da cidade trabalha naquela região à noite.</p></article>
                <article><strong>03</strong><p><b>Nunca ofereça carona para desconhecidos encontrados na estrada durante a neblina.</b> Um boletim de 1998 registra um carro abandonado com marcas de mãos molhadas no banco traseiro.</p></article>
                <article><strong>04</strong><p><b>Se um morador disser que você chegou tarde demais, apenas agradeça.</b> Perguntar “tarde demais para quê?” demonstra curiosidade, e SunnyValley sempre teve uma relação complicada com turistas curiosos.</p></article>
                <article><strong>05</strong><p><b>Se alguém bater três vezes, não abra a porta.</b> Funcionários das pousadas chamam os hóspedes pelo nome correto. Caso a voz use um apelido de infância, tenha certeza de que não é um funcionário.</p></article>
                <article><strong>06</strong><p><b>Não siga vozes, cantigas ou choros vindos da floresta.</b> Mesmo que pareçam pertencer a alguém conhecido. As árvores de SunnyValley são excelentes imitadoras e não oferecem reembolso pelo passeio.</p></article>
                <article><strong>07</strong><p><b>Antes de dormir em um acampamento, conte quantas pessoas estão no grupo.</b> Se houver alguém a mais, não demonstre que percebeu. Não ofereça comida e evite dizer seu nome.</p></article>
              </div>
              <p className="guidance-signoff">A administração de SunnyValley pede que você mantenha a calma, siga as orientações e, principalmente, não estrague a experiência dos outros turistas.</p>
            </section>

            <div className="lore-roles">
              <article>
                <span className="role-icon" aria-hidden="true">⌂</span><span className="chapter-number">Lore dos moradores</span>
                <h3>Famílias do vale</h3>
                <p>Os moradores representam trabalhadores, pescadores, comerciantes e famílias que vivem em SunnyValley há várias gerações.</p>
                <ol>
                  <li><strong>Conheça costumes, não todas as respostas.</strong> Cantigas, histórias e recomendações locais não revelam a verdade completa.</li>
                  <li><strong>Preserve a hospitalidade.</strong> Receba turistas com educação e mantenha a aparência tranquila da cidade.</li>
                  <li><strong>Faça o desconforto ser sutil.</strong> Sorrisos estranhos, mudanças de assunto e silêncios funcionam melhor que revelações imediatas.</li>
                  <li>Não invente parentesco com figuras importantes da lore sem autorização.</li>
                  <li>Não se declare entidade, criatura, cultista, imortal ou escolhido sem aprovação.</li>
                  <li>Conhecer a região não oferece autoridade para controlar turistas.</li>
                  <li>Segredos familiares que afetem a lore principal precisam de coerência e aprovação.</li>
                </ol>
              </article>
              <article>
                <span className="role-icon" aria-hidden="true">◇</span><span className="chapter-number">Lore dos turistas</span>
                <h3>Convidados do vale</h3>
                <p>Os turistas chegam por meio de um convite, ingresso ou cartão-postal de SunnyValley.</p>
                <ol>
                  <li><strong>Comece pela versão pública.</strong> Praias, montanhas, pousadas, trilhas, acampamentos e atividades turísticas.</li>
                  <li><strong>Não chegue sabendo todos os segredos.</strong> Descubra a lore através de documentos, relatos, eventos e investigações.</li>
                  <li>Não comece como caçador sobrenatural, criminoso ou investigador especialista sem aprovação.</li>
                  <li>Demonstre estranhamento naturalmente; não reconheça imediatamente todo fenômeno.</li>
                  <li>Investigar é permitido, mas a curiosidade traz consequências narrativas. Não exija respostas da equipe.</li>
                  <li>Um turista pode se tornar morador por meio do desenvolvimento do RP e dos processos da administração.</li>
                </ol>
              </article>
            </div>

            <div className="lore-participation">
              <div><span className="section-label light">Construa a história conosco</span><h3>Quer participar da lore?</h3><p>Moradores e turistas possuem a mesma importância. Abra um ticket, apresente sua ideia, disponibilidade e limites e aguarde a aprovação da equipe.</p></div>
              <a className="button primary" href={SUPPORT_CHANNEL} target="_blank" rel="noreferrer" onClick={() => void copyTicketMessage("participar da lore")}>Abrir ticket da lore</a>
            </div>
          </div>
        </section>

        <section className="newspaper-section" id="jornal" aria-labelledby="newspaper-title">
          <div className="section newspaper-inner">
            <div className="newspaper-masthead">
              <div className="newspaper-brand">
                <span className="section-label">Jornal de SunnyValley</span>
                <h2 id="newspaper-title">The Valley</h2>
                <p>“A verdade por trás do vale.”</p>
                <small>Fundado em 1898</small>
              </div>
              <div className="newspaper-meta" aria-label="Informações da edição">
                <span>Edição nº 6.307</span><span>19 de outubro de 2012</span>
              </div>
            </div>

            <header className="newspaper-feature-heading">
              <span className="newspaper-kicker">{darkMode ? "A edição não deveria existir" : "Matéria principal"}</span>
              <h3>{darkMode ? "A cidade continua escrevendo depois que a gráfica fecha" : "Moradores relatam estranhezas na região"}</h3>
              <p className="news-deck">{darkMode ? "Algumas letras foram encontradas impressas no verso das fotografias. Juntas, elas formam o nome de quem está lendo." : "Relatos sobre “mulher nas estradas”, luzes entre as árvores e vozes sem origem deixam moradores apreensivos."}</p>
            </header>

            <article className="newspaper-lead">
              <div className="lead-photo">
                <img src="/assets/mulher-da-floresta.webp" alt="Figura feminina entre as árvores da região norte de SunnyValley" />
              </div>
              <div className="lead-copy">
                <p>Moradores de diferentes pontos do norte afirmam ter presenciado acontecimentos incomuns nas últimas semanas. Segundo famílias antigas, as histórias atravessam gerações — embora as autoridades insistam que não existe prova concreta de atividade incomum.</p>
                <blockquote>“A gente aprende desde criança a não entrar naquela floresta depois que escurece. Não é medo. É costume.”</blockquote>
                <div className="news-actions">
                  <button className="news-read-more" type="button" onClick={() => setEditionOpen(true)}>Ler a edição <span aria-hidden="true">→</span></button>
                  <span>O xerife diz que é só uma lenda local. <b>Pelo menos oficialmente.</b></span>
                </div>
              </div>
            </article>

            <div className="newspaper-grid">
              <article className="news-card news-climate">
                <span>Clima</span><h3>Esta noite terá neblina.</h3><p>Evite deslocamentos desnecessários por estradas secundárias durante a madrugada.</p><strong>Fiquem em casa.</strong>
              </article>
              <article className="news-card news-image-card">
                <img src="/assets/costa-noturna.webp" alt="Costa de SunnyValley coberta pela neblina durante a noite" />
                <div><span>Região norte</span><h3>Lenda urbana da região?</h3><p>Luzes, vozes e figuras voltam a ser relatadas em trilhas que já não são utilizadas.</p></div>
              </article>
              <article className="news-card news-image-card">
                <img src="/assets/festa-colheita-nova.webp" alt="Moradores reunidos ao redor da fogueira na Festa da Colheita" />
                <div><span>Evento local</span><h3>Festa da Colheita neste final de semana</h3><p>Praia principal recebe fogueira, música, dança e celebração sábado e domingo, a partir das 18h.</p></div>
              </article>
              <article className="news-card news-image-card">
                <img src="/assets/pousada-antiga.webp" alt="Antiga pousada de SunnyValley iluminada durante a noite" />
                <div><span>Ocorrência</span><h3>Turista é internado após surto em pousada antiga</h3><p>Homem afirmava estar hospedado no local havia anos, apesar de ter passado apenas uma noite.</p></div>
              </article>
            </div>

            <article className="leonora-feature">
              <div className="leonora-photo" aria-label="Fotografia de Leonora Johnson">
                <img src="/assets/leonora-johnson-2004.webp" alt="Leonora Johnson com sua câmera em SunnyValley" />
                <span className="news-case">Caso SV-2004-1018</span>
              </div>
              <div className="news-teaser">
                <p className="newspaper-date">Arquivo • 19 de outubro de 2004</p>
                <h3>Mistério em SunnyValley: fotógrafa desaparecida</h3>
                <p className="news-deck">Leonora Johnson sumiu enquanto investigava antigos segredos da cidade.</p>
                <p className="night-caption night-only" aria-hidden="true">A CÂMERA VOLTOU SOZINHA. LEONORA, NÃO.</p>
                <p>A fotógrafa de 27 anos desapareceu após seguir para uma antiga trilha ao norte. Seu veículo, documentos e pertences foram encontrados; dentro da mata, restaram apenas uma câmera e uma lanterna.</p>
                <div className="news-actions">
                  <button className="news-read-more" type="button" onClick={() => { setNewspaperZoom(1); setArticleOpen(true); }}>Saiba mais <span aria-hidden="true">→</span></button>
                  <span><b>Status:</b> desaparecida desde 18/10/2004</span>
                </div>
              </div>
            </article>

            <div className="newspaper-signoff"><strong>The Valley</strong><span>{darkMode ? "A verdade encontrou você. • Não feche esta página." : "“A verdade por trás do vale.” • Jornal de SunnyValley • Fundado em 1898"}</span><button className="secret-trigger night-only" type="button" onClick={openArchive} aria-label="Abrir arquivo secreto">⟁ ⟡ ☽</button></div>
          </div>
        </section>

        <section className="property-section" id="imoveis">
          <div className="section property-inner">
            <div className="section-heading">
              <div><span className="section-label">{darkMode ? "Endereços disponíveis outra vez" : "Imóveis em SunnyValley"}</span><h2>{darkMode ? "Escolha onde deseja ser encontrado." : "Compre seu lugar no vale."}</h2></div>
              <p>{darkMode ? "Todas as casas têm proprietários anteriores. Algumas ainda não perceberam que foram vendidas." : "Casas, mansões e penthouses para quem chegou como turista e decidiu ficar. Clique para abrir o canal de atendimento, abra seu ticket e fale diretamente com um responsável."}</p>
            </div>
            <div className="property-tabs" role="tablist" aria-label="Tipos de imóveis">
              {[['todos', 'Todos'], ['casas', 'Casas em Sandy e Paleto'], ['penthouses', 'Penthouses']].map(([id, label]) => <button type="button" role="tab" aria-selected={activeProperty === id} className={activeProperty === id ? "active" : ""} onClick={() => setActiveProperty(id)} key={id}>{label}</button>)}
            </div>
            <p className="property-intro"><strong>Imóveis disponíveis — venha morar conosco.</strong> As casas de Paleto e Sandy possuem opções de interiores diferentes; você escolhe o estilo que melhor combina com sua história.</p>
            <div className="property-grid" aria-live="polite">
              {visibleProperties.map((property, index) => <article className="property-card" key={property.name}><div className="property-image-wrap" onPointerEnter={revealPhotoWhispers} onPointerDown={revealPhotoWhispers}><img src={property.images[0]} alt={`${property.name}, ${property.location}`} /><span>{String(index + 1).padStart(2, "0")}</span>{property.images.length > 1 && <b>{property.images.length} fotos</b>}</div><div className="property-copy"><span>{property.label} • {property.location}</span>{property.category === "penthouses" && <small>{property.rooms}</small>}<h3>{property.name}</h3><p>{darkMode ? property.nightText : property.text}</p><button type="button" onClick={() => { setGalleryImage(0); setPropertyOpen(property); }}>Ver imóvel e interiores →</button></div></article>)}
            </div>
            <div className="ticket-helper" aria-live="polite">
              <div><span>Mensagem pronta para o suporte</span><p>“Olá! Quero falar com um responsável sobre a compra de um imóvel em SunnyValley.”</p></div>
              <a className="button primary" href={SUPPORT_CHANNEL} target="_blank" rel="noreferrer" onClick={() => void copyTicketMessage("a compra de um imóvel")}>Copiar e abrir o canal</a>
            </div>
            <p className="ticket-notice" role="status" hidden={!ticketNotice}>{ticketNotice}</p>
          </div>
        </section>

        <section className="section rules-section" id="regras">
          <div className="section-heading rules-title">
            <div><span className="section-label">Manual oficial completo</span><h2>Regras de SunnyValley</h2></div>
            <p>O medo pertence à história. O respeito pertence aos jogadores. O manual completo e as novas regras narrativas estão disponíveis abaixo.</p>
          </div>
          <div className="rules-callout"><strong>NOSSA EXPERIÊNCIA</strong><span>SunnyValley foi criada para oferecer uma lore imersiva, misteriosa e agradável para todos. Cada cena deve contribuir com a história, respeitar os limites dos participantes e preservar a experiência coletiva. A liberdade narrativa existe, mas nunca acima do bom senso, do consentimento e do respeito ao próximo.</span></div>
          <div className="rule-tools">
            <label className="search-box"><span aria-hidden="true">⌕</span><span className="sr-only">Pesquisar regra</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Pesquisar: assalto, denúncia, neblina, personagem..." /></label>
            <label className="group-select"><span>Categoria</span><select value={activeGroup} onChange={(event) => setActiveGroup(event.target.value)}>{groups.map((group) => <option value={group} key={group}>{group === "Todas" ? group : shortGroup(group)}</option>)}</select></label>
          </div>
          <div className="rules-count">{filteredRules.length} de {rules.length} itens exibidos</div>
          <div className="rule-library" aria-live="polite">
            {groupedRules.map((entry, index) => (
              <details className="rule-group" key={entry.group} open={Boolean(query) || activeGroup !== "Todas" || index === 0}>
                <summary><span>{shortGroup(entry.group)}</span><small>{entry.rules.length} itens</small></summary>
                <div className="rules-grid">
                  {entry.rules.map((rule, ruleIndex) => <article className="rule-card" key={`${rule.group}-${rule.subgroup}-${ruleIndex}`}><span>{rule.subgroup || shortGroup(rule.group)}</span><h3>{rule.title}</h3><p>{rule.text}</p></article>)}
                </div>
              </details>
            ))}
            {filteredRules.length === 0 && <div className="empty-rules">Nenhuma regra encontrada. Tente outra palavra.</div>}
          </div>

          <div className="punishment-block"><span className="section-label">Sistema de medidas</span><div className="punishment-grid">{punishmentRows.map(([category, example, measure]) => <article key={category}><strong>{category}</strong><p>{example}</p><span>{measure}</span></article>)}</div></div>
          <div className="download-banner locked-manual"><div><span>Documento oficial • acesso protegido</span><strong>Manual de regras da cidade — versão 1.0.</strong></div><div className="manual-lock" aria-label="Documento bloqueado para edição"><span aria-hidden="true">▣</span><b>Somente leitura</b><small>Conteúdo protegido pela administração</small></div></div>
        </section>

        <section className="vip-section" id="vips">
          <div className="section vip-inner">
            <div className="section-heading vip-heading"><div><span className="section-label light">{darkMode ? "O vale cobra de outras formas" : "Apoie o projeto"}</span><h2>{darkMode ? "Escolha o que deseja deixar para trás." : "Passaportes VIP"}</h2></div><p>{darkMode ? "Alguns benefícios duram trinta dias. Outras escolhas permanecem por muito mais tempo." : "Benefícios para construir uma vida confortável no vale. Nenhum plano concede imunidade às regras, prioridade em denúncia ou controle da lore."}</p></div>
            <div className="vip-grid">{vipPlans.map((plan) => <article className={`vip-card ${plan.featured ? "featured" : ""}`} key={plan.name}>{plan.featured && <span className="recommended">Mais escolhido</span>}<div className="vip-top"><span>{plan.mark}</span><h3>{plan.name}</h3><div className="vip-price-row"><strong>{plan.price}</strong><small>{plan.period}</small></div><div className="vip-inheritance"><span>Herança inicial</span><b>{plan.inheritance}</b></div></div><ul>{plan.benefits.map((benefit) => <li key={benefit}>{benefit}</li>)}</ul><a href={SUPPORT_CHANNEL} target="_blank" rel="noreferrer" onClick={() => void copyTicketMessage(`o VIP ${plan.name}`)}>Solicitar no Discord</a></article>)}</div>
            <p className="vip-disclaimer">Todos os itens são entregues pela administração conforme o catálogo, a disponibilidade e os sistemas ativos da cidade. Nenhum benefício altera regras, investigações, resultados de RP ou decisões da equipe de lore.</p>
          </div>
        </section>

        <section className="section final-cta">
          <img src="/assets/emblema-sunnyvalley.webp" alt="Emblema de SunnyValley" />
          <div><span className="section-label">{darkMode ? "A neblina alcançou a estrada" : "Sua viagem está quase começando"}</span><h2>{darkMode ? "SunnyValley já encontrou você." : "SunnyValley espera por você."}</h2><p>{darkMode ? "Os boletins recomendam evitar a estrada norte depois do último aviso do xerifado." : "Pegue sua passagem, entre no Discord e comece sua história enquanto ainda há luz."}</p></div>
          <a className="button primary" href={TICKET_DISCORD} target="_blank" rel="noreferrer">{darkMode ? "Aceitar o convite" : "Compre sua passagem"}</a>
        </section>
      </div>

      {articleOpen && (
        <div className="site-modal" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setArticleOpen(false)}>
          <article className="article-modal" role="dialog" aria-modal="true" aria-labelledby="article-modal-title">
            <button className="modal-close" type="button" onClick={() => setArticleOpen(false)} aria-label="Fechar matéria">×</button>
            <header>
              <span>The Valley • Edição nº 4.821</span>
              <p>SunnyValley, 19 de outubro de 2004</p>
              <h2 id="article-modal-title">Mistério em SunnyValley: fotógrafa desaparecida</h2>
              <strong>Leonora Johnson sumiu enquanto investigava antigos segredos da cidade.</strong>
            </header>
            <div className="article-modal-grid">
              <div className="article-modal-copy">
                <p><b>A fotógrafa Leonora Johnson, de 27 anos, está desaparecida desde a noite de ontem, após seguir para a região norte de SunnyValley.</b></p>
                <p>Nas últimas semanas, Leonora vinha pesquisando histórias antigas, desaparecimentos e acontecimentos considerados inexplicáveis por moradores da região. Pessoas próximas afirmam que a fotógrafa demonstrava interesse especial pela antiga floresta ao norte da cidade e pretendia registrar alguns desses locais.</p>
                <p>Na madrugada desta terça-feira, seu veículo foi encontrado abandonado próximo à entrada de uma antiga trilha da floresta. Seus documentos e outros pertences pessoais permaneciam dentro do automóvel.</p>
                <p>As buscas seguiram para o interior da mata, onde foi encontrada uma câmera fotográfica pertencente a Leonora. Pouco distante dela, os investigadores localizaram também uma lanterna abandonada.</p>
                <blockquote>Não havia qualquer sinal da fotógrafa.</blockquote>
                <p>O Xerifado de SunnyValley, bombeiros e voluntários continuam realizando buscas pela região.</p>
                <p className="article-closing">Até o fechamento desta edição, Leonora Johnson permanece desaparecida.</p>
              </div>
              <div className="edition-media-stack">
                <figure className="edition-story-photo leonora-edition-photo">
                  <img src="/assets/leonora-johnson-2004.webp" alt="Leonora Johnson com sua câmera em SunnyValley" />
                  <figcaption>Leonora Johnson • Último registro conhecido</figcaption>
                </figure>
                <figure>
                  <div className="zoom-toolbar" aria-label="Controles de ampliação">
                    <button type="button" onClick={() => setNewspaperZoom((value) => Math.max(.75, value - .25))} aria-label="Diminuir jornal">−</button>
                    <output>{Math.round(newspaperZoom * 100)}%</output>
                    <button type="button" onClick={() => setNewspaperZoom((value) => Math.min(3, value + .25))} aria-label="Ampliar jornal">+</button>
                    <button type="button" onClick={() => setNewspaperZoom(1)}>Restaurar</button>
                  </div>
                  <div className="newspaper-zoom-viewport">
                    <img style={{ width: `${newspaperZoom * 100}%`, maxWidth: "none" }} src="/assets/jornal-leonora-2004.webp" alt="Primeira página do Jornal de SunnyValley sobre o desaparecimento de Leonora Johnson" />
                  </div>
                  <figcaption>Arquivo completo • Caso SV-2004-1018</figcaption>
                </figure>
              </div>
            </div>
          </article>
        </div>
      )}

      {editionOpen && (
        <div className="site-modal" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setEditionOpen(false)}>
          <article className="article-modal edition-modal" role="dialog" aria-modal="true" aria-labelledby="edition-modal-title">
            <button className="modal-close" type="button" onClick={() => setEditionOpen(false)} aria-label="Fechar edição">×</button>
            <header>
              <span>The Valley • Edição nº 6.307</span>
              <p>Sexta-feira, 19 de outubro de 2012</p>
              <h2 id="edition-modal-title">Moradores relatam estranhezas na região</h2>
              <strong>Relatos sobre “mulher nas estradas”, luzes entre as árvores e vozes sem origem deixam moradores apreensivos.</strong>
            </header>
            <div className="edition-layout">
              <section className="edition-copy">
                <article><span>Matéria principal</span><p><b>Moradores de diferentes pontos da região norte afirmam ter presenciado acontecimentos incomuns nas últimas semanas.</b></p><p>Entre os relatos mais frequentes estão luzes vistas entre as árvores durante a madrugada, vozes vindas da floresta e a aparição de uma figura feminina em trechos isolados da estrada.</p><p>Segundo moradores antigos, essas histórias não são novas. Há décadas, a região é cercada por relatos que atravessam gerações e continuam sendo mencionados em conversas discretas entre famílias locais.</p><blockquote>“A gente aprende desde criança a não entrar naquela floresta depois que escurece. Não é medo. É costume.”</blockquote><p>Apesar da frequência dos relatos, as autoridades afirmam não haver qualquer prova concreta de atividade incomum.</p></article>
                <article><span>Região norte</span><h3>Lenda urbana da região?</h3><p>A antiga mata ao norte sempre esteve cercada por histórias difíceis de explicar. Há registros informais sobre luzes vistas entre as árvores, vozes sem origem aparente e figuras observadas em trilhas já abandonadas. O desconforto permanece, principalmente após o anoitecer.</p></article>
                <article><span>Clima</span><h3>Esta noite terá neblina. Fiquem em casa.</h3><p>A previsão indica formação intensa de neblina nas áreas próximas à costa, mata e estradas secundárias. Moradores devem evitar deslocamentos desnecessários durante a madrugada.</p></article>
                <article><span>Tradição local</span><h3>Festa da Colheita neste final de semana</h3><p>A praia principal recebe uma grande fogueira, música, comidas típicas e confraternização. Todos estão convidados sábado e domingo, a partir das 18h.</p></article>
                <article><span>Ocorrência</span><h3>Pousada antiga: turista é internado após surto</h3><p>O visitante havia se hospedado por apenas um dia, mas insistia que estava no local havia anos. Confuso e desorientado, recusava-se a deixar o quarto e repetia que “não podia sair dali”. Ele permanece internado para avaliação.</p></article>
                <aside><strong>O xerife diz que é só uma lenda local.</strong><em>Pelo menos oficialmente.</em></aside>
              </section>
              <div className="edition-media-stack">
                <figure className="edition-story-photo residents-edition-photo">
                  <img src="/assets/mulher-da-floresta.webp" alt="Figura feminina entre as árvores da região norte de SunnyValley" />
                  <figcaption>Registro da região norte • Imagem vinculada à matéria principal</figcaption>
                </figure>
                <figure className="edition-newspaper">
                  <div className="zoom-toolbar" aria-label="Controles de ampliação">
                    <button type="button" onClick={() => setEditionZoom((value) => Math.max(.75, value - .25))} aria-label="Diminuir jornal">−</button>
                    <output>{Math.round(editionZoom * 100)}%</output>
                    <button type="button" onClick={() => setEditionZoom((value) => Math.min(3, value + .25))} aria-label="Ampliar jornal">+</button>
                    <button type="button" onClick={() => setEditionZoom(1)}>Restaurar</button>
                  </div>
                  <div className="newspaper-zoom-viewport edition-viewport">
                    <img style={{ width: `${editionZoom * 100}%`, maxWidth: "none" }} src="/assets/jornal-the-valley-2012.webp" alt="Edição completa do jornal The Valley de 19 de outubro de 2012" />
                  </div>
                  <figcaption>Use + e − para ler todos os detalhes da edição.</figcaption>
                </figure>
              </div>
            </div>
          </article>
        </div>
      )}

      {archiveOpen && (
        <div className="site-modal archive-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setArchiveOpen(false)}>
          <article className="archive-modal" role="dialog" aria-modal="true" aria-labelledby="archive-title">
            <button className="modal-close" type="button" onClick={() => setArchiveOpen(false)} aria-label="Fechar arquivo">×</button>
            <p className="archive-label">[ Documento que não deveria existir ]</p>
            <h2 id="archive-title">Arquivo sem registro</h2>
            <p className="archive-threat">Turista… nós sabemos exatamente o que você está procurando.</p>
            <p className="archive-copy">Você abriu uma edição que não deveria existir, ampliou fotografias que ninguém deveria rever e seguiu marcas que a cidade preferia manter escondidas.</p>
            <p className="archive-copy archive-signal">Não se preocupe. SunnyValley já sabe que você está aqui. <span>O som não anuncia a chegada de ninguém — apenas confirma que você foi encontrado.</span></p>
            <p className="archive-warning">Feche o arquivo antes das três batidas. Se a primeira já aconteceu, permaneça olhando para esta tela.</p>
            <button className="archive-follow" type="button" onClick={openTenMistReport}>Seguir</button>
            <small>SV-Ø • A cidade registrou sua presença.</small>
          </article>
        </div>
      )}

      {archiveReportOpen && (
        <div className="site-modal archive-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setArchiveReportOpen(false)}>
          <article className="archive-modal report-modal confidential-report-modal" role="dialog" aria-modal="true" aria-labelledby="smile-case-title">
            <button className="modal-close" type="button" onClick={() => setArchiveReportOpen(false)} aria-label="Fechar relatório">×</button>
            <section className="smile-case-file" aria-labelledby="smile-case-title">
              <header className="smile-case-header">
                <span>[ Documento que não deveria existir ]</span>
                <strong>Arquivo sem registro — confidencial</strong>
                <small>The Valley — desde 1898 • edição impressa cancelada</small>
                <h3 id="smile-case-title">Turista é internado após surto em pousada antiga</h3>
                <p>Homem afirmava estar hospedado no local havia anos, apesar de ter passado apenas uma noite.</p>
              </header>
              <div className="smile-case-layout">
                <div className="smile-case-copy">
                  <p><strong>Paleto Bay, outubro de 2010</strong> — Na manhã do último domingo, o resgate de um jovem turista movimentou a polícia de Paleto Bay. O rapaz foi encontrado em estado grave de desidratação e absoluto pavor em um dos quartos térreos da antiga hospedagem da Stag&apos;s.</p>
                  <p>A porta do quarto — que dá acesso direto ao estacionamento de cascalho — continuava trancada por dentro. Para os amigos e autoridades do lado de fora, o grupo havia chegado na tarde anterior e o jovem passara apenas <strong>uma única noite</strong> trancado ali. Para ele, no entanto, a percepção foi brutal: jurava ter ficado preso naquele cômodo por anos, testemunhando o ambiente retornar ao estado intacto toda vez que tentava dormir.</p>
                  <figure className="smile-polaroid" onPointerEnter={revealPhotoWhispers} onPointerDown={revealPhotoWhispers}>
                    <span aria-hidden="true" />
                    <img src="/assets/sr-sorriso-polaroid-4k.webp" alt="Polaroid dos dez amigos diante da Pousada Stag's em 2010" />
                    <figcaption>Material recuperado no quarto 4 • julho de 2010</figcaption>
                  </figure>
                  <p>Apegado a uma fotografia Polaroid tirada na tarde de sua chegada, o jovem repetia em pânico que o tempo lá fora havia congelado. Alegava que, a cada vez que olhava pela janela ou encarava a imagem, uma figura borrada, com roupas de funcionário e maquiagem distorcida de palhaço, aproximava-se um pouco mais do quarto.</p>
                  <p>A administração da Stag&apos;s negou a existência de qualquer funcionário com essas características. Os outros nove acompanhantes que aparecem sorrindo na fotografia original não souberam explicar o estado do amigo. Nenhum outro relato oficial foi registrado.</p>
                </div>
              </div>
              <aside className="handwritten-note">
                <strong>Nota adicionada a caneta no arquivo:</strong>
                <p>Sem identificação confirmada no boletim, o jovem foi transferido para o sanatório psicológico. Durante as triagens, repetia ter visto seus nove amigos serem levados, um a um, pelo homem de uniforme e maquiagem borrada de palhaço, e que sua única reação fora se trancar no quarto onde viveu o que pareceram anos de pesadelo.</p>
                <p>Exatamente três dias após a internação, o paciente foi encontrado morto dentro da cela. A porta permanecia trancada pelo lado de fora. Quando os nove amigos foram informados, nenhum deles chorou. Encararam os investigadores com olhos fixos e sorrisos vazios, murmurando em uníssono:</p>
                <blockquote>“Vocês não entenderam… o quarto já vinha com o Sr. Sorriso.”</blockquote>
                <p>O caso foi encerrado e sumariamente arquivado. Os nove amigos deixaram SunnyValley naquela mesma noite e nunca mais foram vistos.</p>
              </aside>
            </section>
          </article>
        </div>
      )}

      {tourismCategoryOpen && (() => {
        const attraction = attractions.find((item) => item.id === tourismCategoryOpen);
        const categoryPlaces = tourismPlaces.filter((place) => place.category === tourismCategoryOpen);
        if (!attraction) return null;
        return (
          <div className="site-modal catalog-backdrop tourism-window-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setTourismCategoryOpen(null)}>
            <article className="tourism-window" role="dialog" aria-modal="true" aria-labelledby="tourism-window-title">
              <button className="modal-close" type="button" onClick={() => setTourismCategoryOpen(null)} aria-label="Fechar guia turístico">×</button>
              <header className="tourism-window-header">
                <span>{darkMode ? "Guia encontrado na recepção" : "Guia oficial de SunnyValley"}</span>
                <div><i aria-hidden="true">{attraction.icon}</i><h2 id="tourism-window-title">{attraction.title}</h2></div>
                <p>{darkMode ? tourismCategoryCopy[attraction.id].night : tourismCategoryCopy[attraction.id].day}</p>
              </header>
              <div className="tourism-window-grid">
                {categoryPlaces.map((place, index) => (
                  <article className="place-card" key={place.name}>
                    <div className="place-image-wrap" onPointerEnter={revealPhotoWhispers} onPointerDown={revealPhotoWhispers}>
                      <img src={darkMode && place.nightImage ? place.nightImage : place.image} alt={`${place.name}, ${place.location}`} />
                      <span className="place-index">{String(index + 1).padStart(2, "0")}</span>
                    </div>
                    <div className="place-copy"><span>{place.type} • {place.location}</span><h3>{darkMode && place.name === "A Fé dos Moradores" ? "Primeira Capela ???" : place.name}</h3><p>{darkMode ? place.nightText : place.text}</p><button type="button" onClick={() => { setTourismCategoryOpen(null); openTourismPlace(place); }}>Ampliar fotografia →</button></div>
                  </article>
                ))}
              </div>
              {darkMode && attraction.id === "aguas" && <button className="sea-witch-trigger" type="button" onClick={() => { setTourismCategoryOpen(null); setSeaWitchOpen(true); }}><span aria-hidden="true">≈</span> Há uma cantiga sob a água</button>}
            </article>
          </div>
        );
      })()}

      {seaWitchOpen && (
        <div className="site-modal sea-witch-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setSeaWitchOpen(false)}>
          <article className="sea-witch-modal" role="dialog" aria-modal="true" aria-labelledby="sea-witch-title">
            <button className="modal-close" type="button" onClick={() => setSeaWitchOpen(false)} aria-label="Fechar lenda">×</button>
            <p className="archive-label">Lenda recolhida na costa • origem desconhecida</p>
            <span className="sea-mark" aria-hidden="true">☾ ≋ ☾</span>
            <h2 id="sea-witch-title">Alynny, a Bruxa do Mar</h2>
            <p className="sea-witch-lead">Quando a maré recua além do normal, as famílias de SunnyValley chamam as crianças para dentro sem explicar o motivo.</p>
            <div className="sea-witch-story">
              <p>Os pescadores contam que, antes de haver mapas da península, Alynny vivia numa cidade costeira com seus filhos. Em uma única noite, ela perdeu todos eles. Ninguém concorda sobre como: alguns dizem que o mar os levou; outros juram que foram escondidos por pessoas que temiam aquilo que a mãe já começava a se tornar.</p>
              <p>Consumida pela perda, Alynny teria feito um pacto que não podia ser desfeito. Em troca de poder para procurar as crianças, entregou ao mar outras crianças da cidade. A água subiu pelas ruas, cobriu casas, sinos e janelas, e a antiga cidade desapareceu sob as ondas. Ainda hoje, em noites muito calmas, marinheiros dizem enxergar luzes acesas no fundo e ouvir uma mulher chamando nomes que nenhuma família reconhece.</p>
              <p>A lenda afirma que Alynny caminha pelas praias procurando os filhos — ou alguém que possa ocupar o lugar deles. Primeiro vem o choro. Depois, uma cantiga. Por último, pequenas pegadas molhadas surgem na areia, saindo do mar em direção à cidade. Quem escuta seu próprio nome não deve responder. Quem encontra uma criança sozinha junto à água não deve perguntar onde está a mãe.</p>
              <p>Nenhum registro explica por que o brasão mais antigo de SunnyValley traz uma mulher cercada por ondas, nem por que certos documentos de nascimento desaparecem sempre que a maré deixa conchas negras na Praia Aurora. Talvez Alynny esteja apenas procurando. Talvez já tenha encontrado uma de suas crianças. O restante da história só é contado por quem voltou da praia antes do amanhecer — e essas pessoas raramente contam a mesma versão duas vezes.</p>
            </div>
            <small>Se a cantiga parar de repente, não olhe para a água.</small>
          </article>
        </div>
      )}

      {galleryOpen && (
        <div className="site-modal catalog-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setGalleryOpen(null)}>
          <article className="catalog-modal" role="dialog" aria-modal="true" aria-labelledby="catalog-title">
            <button className="modal-close" type="button" onClick={() => setGalleryOpen(null)} aria-label="Fechar detalhes">×</button>
            <img onPointerEnter={revealPhotoWhispers} onPointerDown={revealPhotoWhispers} src={darkMode && galleryOpen.nightImage ? galleryOpen.nightImage : galleryOpen.image} alt={galleryOpen.name} />
            <div><span>{galleryOpen.type} • {galleryOpen.location}</span><h2 id="catalog-title">{darkMode && galleryOpen.name === "A Fé dos Moradores" ? "Primeira Capela ???" : galleryOpen.name}</h2><p>{darkMode ? galleryOpen.nightText : galleryOpen.text}</p><a className="button primary" href={TICKET_DISCORD} target="_blank" rel="noreferrer">Compre sua passagem</a></div>
          </article>
        </div>
      )}

      {propertyOpen && (
        <div className="site-modal catalog-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setPropertyOpen(null)}>
          <article className="catalog-modal property-modal" role="dialog" aria-modal="true" aria-labelledby="property-modal-title">
            <button className="modal-close" type="button" onClick={() => setPropertyOpen(null)} aria-label="Fechar imóvel">×</button>
            <div className="catalog-image-view" onPointerEnter={revealPhotoWhispers} onPointerDown={revealPhotoWhispers}><img src={propertyOpen.images[galleryImage]} alt={`${propertyOpen.name} — foto ${galleryImage + 1}`} />{propertyOpen.images.length > 1 && <div className="catalog-thumbs">{propertyOpen.images.map((image, index) => <button type="button" className={galleryImage === index ? "active" : ""} onClick={() => setGalleryImage(index)} key={image}><img src={image} alt={`Ver foto ${index + 1}`} /></button>)}</div>}</div>
            <div><span>{propertyOpen.label} • {propertyOpen.location}</span><h2 id="property-modal-title">{propertyOpen.name}</h2>{propertyOpen.category === "penthouses" && <strong>{propertyOpen.rooms}</strong>}<p>{darkMode ? propertyOpen.nightText : propertyOpen.text}</p><p>Fale com um responsável para conhecer todas as opções.</p><a className="button primary" href={SUPPORT_CHANNEL} target="_blank" rel="noreferrer" onClick={() => void copyTicketMessage("a compra de um imóvel")}>Abrir ticket e consultar</a></div>
          </article>
        </div>
      )}

      <footer id="contato">
        <img className="footer-logo" src="/assets/emblema-sunnyvalley.webp" alt="" />
        <div><strong>SunnyValley</strong><p>Turismo, convivência e terror narrativo desde 1898.</p></div>
        <div className="footer-links"><a href={OFFICIAL_DISCORD} target="_blank" rel="noreferrer">Discord</a><a href={INSTAGRAM} target="_blank" rel="noreferrer">Instagram</a><a href="#jornal">The Valley</a><a href="#regras">Regras</a><a href="#inicio">Voltar ao topo</a></div>
        <div className="footer-note">SunnyValley • Links oficiais da cidade</div>
      </footer>
    </main>
  );
}
