"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type PointerEvent as ReactPointerEvent } from "react";
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
  { id: "pousadas", icon: "⌂", image: "/assets/stags-lodge-day.webp", title: "Pousadas", text: "Quartos acolhedores, café fresco e belas vistas para as montanhas. Os prédios são antigos; trate seus ruídos com a devida educação." },
  { id: "gastronomia", icon: "◈", image: "/assets/restaurante-marina-5-estrelas.webp", title: "Gastronomia local", text: "Restaurantes familiares, lanchonetes e experiências à beira da água — do almoço costeiro ao jantar cinco estrelas." },
  { id: "aguas", icon: "≈", image: "/assets/marina-crystal-bay.webp", title: "Águas calmas", text: "Pesca, natação, praia e passeios de lancha com a península inteira refletida no horizonte." },
  { id: "trilhas", icon: "△", image: "/assets/trilha-pinheiros-4k.webp", title: "Trilhas e acampamentos", text: "Pinheiros, cachoeiras, mirantes, rotas sinalizadas e áreas preparadas para acampar em família." },
  { id: "paraquedismo", icon: "↟", image: "/assets/skyvale-paraquedismo.webp", title: "Paraquedismo", text: "Veja as montanhas, a floresta e a costa inteira em uma experiência inesquecível sobre o vale." },
  { id: "historia", icon: "✦", image: "/assets/primeira-capela.webp", title: "História e fé", text: "Arquitetura preservada, arquivos desde 1898 e uma fé local tão antiga quanto inabalável." },
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
  text: string;
  story: string;
  nightText: string;
};

const tourismPlaces: TourismPlace[] = [
  { category: "trilhas", name: "Mirante Raton Canyon", type: "Mirante e trilha", location: "Raton Canyon", image: "/assets/mirante-raton-canyon.webp", text: "Um mirante cercado por pinheiros, com vista panorâmica para os paredões do cânion e acesso pelas trilhas oficiais do vale.", story: "O caminho acompanha a borda do cânion até um antigo ponto de observação dos guias da serra. Bancos de madeira e placas de orientação recebem os caminhantes; ao entardecer, a luz percorre os paredões e transforma cada curva em um novo retrato do vale.", nightText: "Guias antigos mencionam uma rota apagada dos mapas. Em noites de neblina, ainda surgem fitas de trilha amarradas naquela direção." },
  { category: "aguas", name: "Praia Aurora", type: "Praia", location: "Costa Norte", image: "/assets/praia-aurora.webp", text: "Areia clara, águas tranquilas e estrutura para passar o dia inteiro à beira-mar.", story: "A praia ganhou o nome por receber os primeiros tons do amanhecer na costa norte. Famílias aproveitam a água rasa durante o dia, e as cadeiras voltadas para o horizonte formam a paisagem mais lembrada quando o sol começa a baixar.", nightText: "Funcionários dizem encontrar as cadeiras voltadas para o mar pela manhã, mesmo após deixarem a praia organizada na noite anterior." },
  { category: "pousadas", name: "Stag's Lodge", type: "Pousada e loja", location: "Mount Chiliad", image: "/assets/stags-lodge-day.webp", text: "Quartos acolhedores, café da manhã caseiro e uma pequena loja para viajantes da serra.", story: "Nascida como parada para quem cruzava Mount Chiliad, a hospedaria conserva madeira escura, mantas pesadas e café servido cedo. A loja reúne mapas, mantimentos e itens de trilha; muitos viajantes lembram do sino da recepção quando a neblina desce.", nightText: "As luzes permanecem acesas. A recepção insiste que nenhum quarto está ocupado." },
  { category: "pousadas", name: "Stag's Motel", type: "Ala da Pousada Stag's", location: "Mount Chiliad", image: "/assets/stags-motel-atualizado.webp", text: "A ala de estrada da Pousada Stag's oferece quartos simples e silenciosos aos pés da floresta.", story: "Criado para receber motoristas que chegam tarde à serra, o motel oferece acesso direto à estrada e estadias práticas. Os quartos ficam voltados para a mata, e a varanda comprida é o ponto preferido para tomar café antes de seguir viagem.", nightText: "Uma planta de 1977 registra um quarto que a administração afirma nunca ter existido." },
  { category: "gastronomia", name: "Mojito Inn", type: "Bar e restaurante", location: "Paleto Bay", image: "/assets/mojito-inn.webp", text: "Drinks tropicais, pratos rápidos e encontros descontraídos no centro de Paleto.", story: "O salão colorido virou ponto de encontro depois de um dia na costa. A casa serve mojitos, sanduíches e porções para dividir, com música leve e balcão movimentado; a tradição é brindar quando o último raio de sol atravessa as janelas.", nightText: "O último cliente nunca aparece nas fotografias, embora sempre deixe a cadeira molhada." },
  { category: "gastronomia", name: "Marina Étoile", type: "Restaurante cinco estrelas", location: "Marina Crystal Bay", image: "/assets/restaurante-marina-5-estrelas.webp", text: "Alta gastronomia, menu degustação sazonal e serviço elegante diante da marina.", story: "De frente para os píeres, o Étoile transforma ingredientes da costa em um menu que muda com a estação. O serviço acompanha o ritmo calmo da marina, e as mesas junto às janelas são disputadas pela vista dos barcos refletidos na água.", nightText: "A reserva das 23h nunca tem nome, mas a mesa permanece posta." },
  { category: "trilhas", name: "Trilha Mount Chiliad", type: "Trilha ecológica", location: "Floresta Norte", image: "/assets/trilha-mount-chiliad.webp", text: "Uma rota oficial entre pinheiros, formações rochosas e vistas do vale.", story: "A rota sobe pela floresta norte seguindo marcos de pedra e trechos abertos na encosta. Guias locais recomendam pausas nos mirantes naturais; perto do ponto mais alto, serra, cidade e costa cabem numa única vista.", nightText: "A placa pede que você siga a trilha. A trilha, por outro lado, pede outra coisa." },
  { category: "gastronomia", name: "Hookies Seafood", type: "Restaurante de frutos do mar", location: "Costa Norte", image: "/assets/hookies-seafood.webp", text: "Peixes frescos, frutos do mar, mesas ao ar livre e o pôr do sol da estrada costeira.", story: "À margem da estrada costeira, o Hookies prepara o pescado que chega no mesmo dia. Peixe grelhado e porções de frutos do mar acompanham um serviço simples; o detalhe favorito é jantar ao ar livre enquanto as luzes dos barcos aparecem ao longe.", nightText: "Não pergunte de onde veio o prato especial quando o mar estiver completamente quieto." },
  { category: "gastronomia", name: "The Hen House", type: "Bar e boate", location: "Paleto Bay", image: "/assets/hen-house-nightclub-4k.webp", text: "Bar, pista de dança e noites animadas para quem prefere conhecer o lado mais vibrante da cidade.", story: "O antigo salão de Paleto encontrou nova vida como bar e casa de dança, preservando o palco baixo e o letreiro que virou referência local. Drinks clássicos, música e uma pista sempre cheia recebem quem ainda não quer encerrar a noite.", nightText: "A música termina no horário. Se continuar ouvindo passos na pista, não volte para buscar nada." },
  { category: "aguas", name: "Marina Crystal Bay", type: "Marina", location: "Sandy Shores", image: "/assets/marina-crystal-bay.webp", text: "Águas cristalinas, píeres, pesca e acesso para passeios de barco durante o dia.", story: "A marina organiza a vida náutica de SunnyValley com atracação, apoio a pescadores e passeios pela península. Pela manhã, os píeres recebem caixas de pesca; à tarde, a baía transparente revela o fundo raso e o brilho que batizou Crystal Bay.", nightText: "Nenhuma embarcação sai à noite. As que chegam não constam no registro da marina." },
  { category: "pousadas", name: "Pousada Sicilia", type: "Pousada histórica", location: "Sandy Shores", image: "/assets/pousada-sicilia.webp", text: "Arquitetura clássica, pátio interno, café fresco e quartos próximos à avenida principal.", story: "A Sicilia ocupa uma construção preservada ao lado da avenida principal, organizada ao redor do pátio onde o café da manhã é servido. Os quartos guardam móveis de épocas diferentes, e o perfume do jardim entra pelas janelas no começo da manhã.", nightText: "Uma planta encontrada na recepção desenha o pátio com dimensões diferentes das registradas pela prefeitura." },
  { category: "historia", name: "A Fé dos Moradores", type: "Tradição do vale", location: "Centro Histórico", image: "/assets/primeira-capela.webp", text: "A fé dos moradores de SunnyValley é silenciosa, antiga e inabalável. Em tempos difíceis, cada família coloca uma vela na janela.", story: "A tradição remonta às primeiras famílias do vale e ainda une o centro histórico em momentos de perda ou esperança. A Primeira Capela preserva registros e objetos de devoção; nas datas importantes, pequenas luzes aparecem nas janelas antes do anoitecer.", nightText: "Fotografias de noites de neblina mostram velas acesas nas ruínas da Primeira Capela. Nenhum morador admite tê-las colocado ali." },
  { category: "historia", name: "Hospital de Sandy", type: "Patrimônio histórico", location: "Sandy Shores", image: "/assets/hospital-sandy-monumento-4k.webp", text: "O hospital preserva sua arquitetura histórica e o pátio dos primeiros atendimentos da região. Seu monumento homenageia o primeiro prefeito de SunnyValley, responsável por financiar os primeiros leitos da cidade.", story: "Erguido para atender uma comunidade distante dos grandes centros, o hospital tornou-se parte da memória de Sandy Shores. O pátio conserva traços dos primeiros atendimentos, e famílias ainda deixam flores no monumento dedicado ao início do cuidado público no vale.", nightText: "Uma fotografia antiga do monumento mostra, ao fundo, a entrada de uma ala que não aparece nas plantas atuais do hospital." },
  { category: "historia", name: "Universidade de Sandy", type: "Patrimônio educacional", location: "Sandy Shores", image: "/assets/universidade-sandy.webp", text: "A universidade reúne estudantes de toda SunnyValley e preserva parte importante da história acadêmica da região, unindo formação, memória e tradição comunitária.", story: "A instituição cresceu junto com Sandy Shores e abriu seus corredores a estudantes de todo o vale. Além das aulas, mantém arquivos e encontros públicos; o mural de fotografias antigas é parada certa para reconhecer rostos e lugares da história local.", nightText: "Os corredores ficam vazios depois da última aula. Ainda assim, algumas salas continuam marcando presença no livro de chamada." },
  { category: "paraquedismo", name: "SkyVale", type: "Base de paraquedismo e bondinho", location: "Mount Chiliad", image: "/assets/skyvale-bondinho.webp", text: "Suba de bondinho até a base e aproveite saltos panorâmicos sobre as montanhas, a floresta e toda a costa norte.", story: "A experiência começa no bondinho, que leva visitantes e equipamentos até a base em Mount Chiliad. Instrutores acompanham a preparação e escolhem a rota conforme o vento; poucos esquecem o instante em que a cabine fica pequena e a costa inteira se abre sob os pés.", nightText: "O livro da estação registra uma cabine retirada de serviço em 1986. Alguns passageiros ainda descrevem seu número nos relatos de subida." },
  { category: "paraquedismo", name: "O Norte Visto do Alto", type: "Experiência panorâmica", location: "Paleto Bay", image: "/assets/paisagem-norte-4k.webp", text: "Veja o norte inteiro do alto, das montanhas de Chiliad até as praias de Paleto Bay.", story: "O voo panorâmico segue a linha entre Paleto Bay e as montanhas antes de alcançar a área de salto. A equipe aponta praias, estradas e trilhas durante a subida; no retorno, cada passageiro recebe o registro da rota percorrida.", nightText: "Pilotos relatam luzes em uma estrada abandonada ao norte. O xerifado atribui o fenômeno a acampamentos irregulares." },
  { category: "trilhas", name: "Trilha dos Pinheiros", type: "Trilha ecológica", location: "Floresta Norte", image: "/assets/trilha-pinheiros-4k.webp", text: "Uma subida tranquila entre pinheiros, flores silvestres e mirantes naturais do vale.", story: "Mais leve que a rota de Chiliad, esta trilha acompanha o bosque por passagens floridas e clareiras protegidas do vento. Famílias e iniciantes costumam parar no pequeno mirante onde o aroma dos pinheiros se mistura à brisa da costa.", nightText: "Ao anoitecer, a trilha parece mais longa. Não siga pegadas que começam no meio do caminho." },
];

type Property = { category: string; name: string; label: string; location: string; rooms: string; images: string[]; text: string; nightText: string };

const properties: Property[] = [
  { category: "casas", name: "Mansão Blackwood", label: "Casa premium", location: "Paleto Bay", rooms: "", images: ["/assets/mansion-blackwood-exterior.webp", "/assets/mansion-blackwood-interior.webp"], text: "Arquitetura moderna integrada à montanha, interior amplo, deck privativo e acesso direto às águas do vale.", nightText: "Uma fotografia do antigo proprietário mostra uma porta hoje substituída por uma parede." },
  { category: "casas", name: "Mansão Serenity", label: "Mansão costeira", location: "Paleto Bay", rooms: "", images: ["/assets/azurecliff-estate-exterior.webp", "/assets/azurecliff-estate-interior.webp"], text: "Uma residência contemporânea à beira-mar, com fachada panorâmica, piscina, amplos terraços e interiores de pé-direito duplo voltados para a costa de Paleto.", nightText: "Uma fotografia noturna das paredes de vidro parece refletir outra fachada atrás do fotógrafo. A casa estava vazia quando a imagem foi registrada." },
  { category: "casas", name: "Mansion Red", label: "Mansão contemporânea", location: "Paleto Bay", rooms: "", images: ["/assets/mansion-red-exterior.webp", "/assets/mansion-red-interior.webp"], text: "Uma residência marcante de arquitetura contemporânea, fachada vermelha, piscina panorâmica e amplas áreas de convivência voltadas para a paisagem. O interior combina linhas elegantes, iluminação suave e grandes janelas para quem procura conforto com personalidade.", nightText: "Em algumas noites, o reflexo vermelho da piscina permanece aceso mesmo depois que toda a casa é desligada." },
  { category: "casas", name: "Mansão Tropical", label: "Mansão contemporânea", location: "Paleto Bay", rooms: "", images: ["/assets/mansao-tropical-exterior-piscina.webp", "/assets/mansao-tropical-exterior-jardim.webp", "/assets/mansao-tropical-interior.webp"], text: "Arquitetura contemporânea cercada por palmeiras, áreas externas amplas, piscina panorâmica e ambientes internos pensados para lazer e recepções.", nightText: "Uma sequência de fotografias da piscina mostra luzes em cômodos que constavam como desocupados naquela noite." },
  { category: "penthouses", name: "Penthouse Grand Valley", label: "Cobertura familiar", location: "Sandy Shores", rooms: "4 quartos", images: ["/assets/penthouse-4-quartos.webp"], text: "Uma cobertura espaçosa com cozinha clássica e ambientes para receber todo o grupo.", nightText: "O anúncio confirma quatro quartos. Um inventário antigo, porém, descreve móveis pertencentes a um quinto dormitório." },
  { category: "penthouses", name: "Penthouse Vista Norte", label: "Cobertura compacta", location: "Sandy Shores", rooms: "1 quarto", images: ["/assets/penthouse-1-quarto.webp"], text: "Planta funcional, cozinha contemporânea e uma localização central para morar sozinho.", nightText: "O laudo de vistoria cita louça para duas pessoas, embora o antigo contrato tivesse apenas um morador." },
  { category: "penthouses", name: "Penthouse Sunset", label: "Cobertura contemporânea", location: "Sandy Shores", rooms: "2 quartos", images: ["/assets/penthouse-2-quartos.webp"], text: "Sala confortável, dois quartos e iluminação acolhedora próxima aos serviços de Sandy.", nightText: "Vizinhos relatam ver as cortinas fechadas em noites nas quais o imóvel consta como vazio." },
  { category: "casas", name: "Casas em Sandy e Paleto", label: "Coleção residencial", location: "Sandy Shores • Paleto Bay", rooms: "", images: ["/assets/casa-sandy-desert-rose.webp", "/assets/casa-sandy-palm-haven.webp", "/assets/casa-sandy-interior.webp"], text: "Mais de vinte casas estão disponíveis entre Sandy e Paleto. As fotografias mostram apenas alguns exemplos; cada imóvel possui fachada, localização e opções de interior próprias para você escolher.", nightText: "Mais de vinte casas continuam disponíveis. Algumas parecem ocupadas nas fotografias, mesmo quando os registros dizem o contrário." },
];

const vipPlans = [
  { name: "Turista", price: "R$ 100", mark: "Primeira visita", description: "Para quem está chegando e quer conhecer SunnyValley com calma, descobrindo a cidade, seus encontros e os primeiros capítulos de uma nova história." },
  { name: "Morador", price: "R$ 250", mark: "Seu lugar no vale", description: "Para quem decidiu ficar, criar raízes e fazer parte da rotina, das histórias e da comunidade que mantém SunnyValley viva." },
  { name: "1998", price: "R$ 400", mark: "História da cidade", featured: true, description: "Um passe inspirado no ano que marcou SunnyValley, pensado para quem quer carregar a identidade e a tradição da cidade em sua própria jornada." },
  { name: "Férias Perfeitas", price: "R$ 550", mark: "Uma temporada inesquecível", description: "Para viver SunnyValley por inteiro, aproveitar cada paisagem e transformar a temporada no vale em uma lembrança difícil de deixar para trás." },
];

const secretPhrases = [
  "não olhe para trás.",
  "a estrada já se repetiu.",
  "há alguém no quarto.",
  "você chegou tarde demais.",
  "não conte o grupo de novo.",
  "a cidade está acordada.",
  "a porta não estava aberta.",
  "ela sabe seu nome.",
];

type NewspaperStoryKey = "leonora" | "carro" | "neblina" | "lenda" | "colheita" | "pousada";

const newspaperStories: Record<NewspaperStoryKey, { kicker: string; title: string; deck: string; date: string; image: string; caption: string; paragraphs: string[] }> = {
  leonora: {
    kicker: "Caso nº SV-2004-1018",
    title: "Desaparecimento de Leonora Johnson",
    deck: "Fotógrafa desapareceu durante uma investigação sobre antigos acontecimentos de SunnyValley.",
    date: "19 de outubro de 2004",
    image: "/assets/leonora-johnson-definitiva.png",
    caption: "Leonora Johnson • Último registro conhecido antes de seguir para a região norte.",
    paragraphs: [
      "Leonora Johnson, fotógrafa de 27 anos, desapareceu na noite de 18 de outubro enquanto investigava relatos antigos ligados à região norte de SunnyValley. Seu automóvel foi encontrado na entrada de uma trilha que segue em direção à floresta e à estrada da marina.",
      "Segundo informações reunidas pelo xerifado, Leonora deixou o centro da cidade pouco depois das 21h. Às 22h17, uma testemunha afirmou ter visto seu veículo parado próximo à mata. A fotógrafa carregava uma câmera, um gravador portátil e uma pasta com recortes de jornais antigos.",
      "O carro foi localizado na manhã seguinte. Não havia sinais de colisão ou arrombamento. A porta do motorista estava aberta, e alguns objetos pessoais permaneciam no banco. A câmera de Leonora, porém, não foi encontrada.",
      "Marcas de passos seguiam do automóvel até a entrada da floresta. Depois de poucos metros, desapareciam em uma área de terra úmida, sem qualquer indicação de que alguém tivesse retornado pelo mesmo caminho.",
      "Leonora pesquisava desaparecimentos antigos, aparições nas estradas e acontecimentos nunca esclarecidos da época colonial. Em suas anotações, uma frase aparecia repetida ao lado de diferentes datas: “A cidade se lembra de quem tenta esquecê-la.”",
      "As autoridades não confirmaram ligação entre essa investigação e o desaparecimento. Buscas foram realizadas na floresta, na marina e nas estradas próximas, mas nenhum vestígio da fotógrafa foi localizado.",
      "Leonora tem 1,68 metro de altura, cabelos ruivos e olhos castanhos. Qualquer informação deve ser comunicada imediatamente ao Xerifado de SunnyValley. Até o fechamento desta edição, Leonora Johnson continuava desaparecida.",
    ],
  },
  carro: {
    kicker: "Perícia no local",
    title: "Detalhes do veículo e perícia no local",
    deck: "O carro de Leonora foi encontrado abandonado na entrada da antiga trilha da floresta.",
    date: "18 de outubro de 2004",
    image: "/assets/jornal-carro-leonora.webp",
    caption: "Veículo encontrado próximo à trilha da floresta.",
    paragraphs: ["O automóvel pertencente à fotógrafa Leonora Johnson foi encontrado completamente deserto na entrada da antiga trilha da floresta. As autoridades relatam que o veículo não apresentava sinais diretos de arrombamento ou colisão, mas foi deixado em um ponto isolado da estrada de terra que leva à marina.", "A região é conhecida entre os moradores por seu histórico de histórias sombrias e relatos anteriores de pessoas perdidas na vegetação. A polícia isolou o perímetro para coleta de evidências e busca de pegadas ou pistas que indiquem para onde Leonora possa ter seguido após deixar o carro."],
  },
  neblina: {
    kicker: "Boletim meteorológico",
    title: "Esta noite terá neblina",
    deck: "A administração recomenda evitar estradas secundárias durante a madrugada.",
    date: "7 de julho de 2011",
    image: "/assets/jornal-neblina.webp",
    caption: "Neblina avançando sobre a costa norte de SunnyValley.",
    paragraphs: ["A previsão para esta noite indica queda acentuada de temperatura e baixa visibilidade depois das 23h. A neblina deve encobrir trechos da costa e das estradas secundárias, dificultando a identificação de curvas, entradas de propriedades e acessos às trilhas.", "À beira da água, o horizonte costuma desaparecer antes que a névoa alcance as áreas mais altas. Para quem passa o dia na marina ou na praia, a recomendação da administração é planejar o retorno antes da madrugada e evitar prolongar passeios em pontos isolados.", "Motoristas devem permanecer nas vias principais e respeitar os bloqueios temporários. O trajeto mais curto pelos caminhos da mata pode deixar de ser uma alternativa quando as placas e referências da paisagem já não estão visíveis.", "Pousadas e estabelecimentos da costa são os pontos de referência para visitantes que ainda não conhecem a região. Em caso de dúvida, procure um local fechado e aguarde o amanhecer, sem tentar reconhecer a estrada apenas pelas luzes ao longe.", "Entre moradores antigos, noites assim costumam terminar cedo: portas fechadas, uma bebida quente e a espera pela manhã. O costume também aparece nas histórias locais, mas o motivo deste boletim é concreto: a visibilidade reduzida exige cuidado e pode alterar o tempo de viagem."],
  },
  lenda: {
    kicker: "Região norte",
    title: "Moradores relatam estranhezas na região",
    deck: "Relatos sobre a “mulher nas estradas”, luzes entre as árvores e vozes sem origem deixam moradores apreensivos.",
    date: "3 de junho de 1998",
    image: "/assets/jornal-moradores.webp",
    caption: "Figura observada entre as árvores na região norte de SunnyValley.",
    paragraphs: ["Moradores de diversas áreas da região norte relatam experiências inexplicáveis que vêm se repetindo nos últimos meses. Luzes vistas entre as árvores durante a madrugada, vozes sem origem aparente e figuras observadas em trilhas antigas levantam dúvidas e aumentam o clima de apreensão.", "Muitos evitam sair de casa à noite e dizem ter medo das áreas isoladas, especialmente perto da floresta. Alguns afirmam ter ouvido sussurros ou passos seguindo de perto, mas não há explicação para o que testemunharam.", "Entre os relatos está o de uma mulher vista nas margens das estradas durante noites de chuva e neblina. Ela não pede carona nem tenta parar os veículos. Permanece imóvel entre as árvores ou caminha lentamente pela margem, repetindo palavras que ninguém consegue compreender.", "Alguns motoristas dizem ter visto a mesma figura em diferentes pontos da estrada durante uma única viagem. Outros relatam luzes atravessando a mata e uma voz baixa surgindo no rádio quando nenhuma estação estava sintonizada.", "“A gente aprende desde criança que não se entra naquela floresta depois que escurece”, contou um morador cuja família vive na região há gerações. “Não é medo. É costume. SunnyValley tem muitas lendas guardadas. Algumas estão na biblioteca; as outras vocês podem descobrir conversando com a gente. Temos o maior prazer em contar.”", "Durante décadas, essas ocorrências foram tratadas como lendas e histórias contadas pelos moradores locais. Uma fotografia feita por um visitante parece mostrar uma silhueta entre as árvores, mas a imagem não permite identificar quem estava no local.", "As autoridades informam que não há registros oficiais que comprovem qualquer atividade sobrenatural. Sombras, animais e a baixa visibilidade podem explicar parte das ocorrências. Ainda assim, reconhecem que os relatos se tornaram cada vez mais frequentes.", "Moradores antigos continuam usando essas histórias para alertar crianças e visitantes sobre os perigos das estradas, da mata e das trilhas abandonadas depois do anoitecer. Quando perguntados por que tantas testemunhas descrevem a mesma mulher, alguns apenas sorriem e mudam de assunto."],
  },
  colheita: {
    kicker: "Evento local",
    title: "Celebração anual da comunidade de SunnyValley",
    deck: "A cidade se reúne para celebrar suas tradições e receber visitantes.",
    date: "28 de setembro de 2012",
    image: "/assets/festa-colheita-nova.webp",
    caption: "Festival da Praia reúne moradores e visitantes ao redor da fogueira.",
    paragraphs: ["A comunidade de SunnyValley se prepara para a tradicional Festa da Colheita, que acontece neste final de semana na praia principal.", "Haverá fogueira, música ao vivo, comidas típicas, danças e muitas atrações para todas as idades.", "Traga sua família, chame os amigos e venha celebrar o que temos de melhor: nossa gente, nossas histórias e nossas tradições!", "Todos estão convidados! Sábado e domingo, a partir das 18h, na praia principal."],
  },
  pousada: {
    kicker: "Ocorrência",
    title: "Turista é internado após surto em pousada histórica",
    deck: "Jovem afirmou que era perseguido e que todas as estradas o levavam de volta ao mesmo lugar.",
    date: "16 de agosto de 2012",
    image: "/assets/jornal-quarto-4.webp",
    caption: "Polícia e equipe médica diante da pousada na noite da ocorrência.",
    paragraphs: ["Um turista foi hospitalizado depois de sofrer um grave episódio de desorientação durante uma estadia em uma antiga pousada de estrada de SunnyValley. O jovem fazia parte de um grupo de dez amigos que passaria alguns dias na cidade.", "A hospedaria fica diante da Praia Aurora e reúne um pequeno restaurante, uma loja e cerca de dez quartos com portas voltadas diretamente para o estacionamento. O grupo pretendia conhecer a praia, as festas locais e o bondinho que leva os visitantes ao Monte Chiliad.", "Na madrugada do segundo dia, os amigos perceberam que o jovem havia saído do quarto 4 e levado o carro. Horas depois, funcionários o encontraram atrás da pousada, caído no cascalho sob uma chuva intensa. Estava encharcado, desorientado e repetia que alguém havia voltado com ele.", "Segundo os amigos, o turista saiu de carro ao acreditar que estava sendo perseguido. Ele contou que dirigiu pela estrada principal e tentou atravessar o túnel ao norte, mas viu uma figura imóvel entre as luzes e decidiu continuar sem parar.", "Mesmo seguindo em frente, tornou a passar pela Praia Aurora, pelo bondinho e pela mesma placa iluminada da hospedaria. Quando olhou pelo retrovisor, disse ter visto alguém atrás dele sorrindo. Pouco depois, a estrada terminou novamente no estacionamento da pousada.", "Policiais, bombeiros e uma equipe médica foram chamados ao local. O jovem não apresentava ferimentos graves, mas não conseguia explicar como havia retornado ou onde deixara o veículo. Repetia apenas: “Eu tentei sair. Quando olhei pelo retrovisor, ele sorriu para mim.”", "Após uma avaliação médica, o turista foi encaminhado a uma instituição psiquiátrica para observação. Até o momento, não foram divulgadas novas informações sobre seu estado de saúde.", "Moradores afirmam que viagens longas, noites mal dormidas e a neblina intensa podem causar confusão em visitantes. A cidade também convive há décadas com boatos criados por turistas impressionados com suas lendas.", "Registros antigos, entretanto, mencionam outros hóspedes que tentaram deixar a região e disseram ter retornado repetidamente ao mesmo ponto da estrada. Nenhum desses relatos foi oficialmente relacionado ao episódio do quarto 4. A pousada continuou funcionando, mas o quarto permaneceu temporariamente indisponível."],
  },
};

export default function Home() {
  const editionDate = "sexta-feira, 19 de outubro de 2004";
  const [entered, setEntered] = useState(false);
  const [activeGroup, setActiveGroup] = useState("Todas");
  const [query, setQuery] = useState("");
  const [activeSection, setActiveSection] = useState("inicio");
  const [rulePage, setRulePage] = useState(0);
  const [newspaperTurning, setNewspaperTurning] = useState(false);
  const [newspaperPage, setNewspaperPage] = useState<NewspaperStoryKey | null>(null);
  useEffect(() => {
    if (!entered || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const elements = document.querySelectorAll<HTMLElement>(".section-heading, .property-card, .vip-card, .attraction-card, .lore-chapter");
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if(entry.isIntersecting){ entry.target.classList.add("revealed"); observer.unobserve(entry.target); } }), {threshold:.08});
    elements.forEach((el,index)=>{el.classList.add("scroll-reveal");el.style.setProperty("--reveal-delay",`${index%4*80}ms`);observer.observe(el);});
    return ()=>{observer.disconnect();elements.forEach(el=>el.classList.remove("scroll-reveal"));};
  }, [entered]);

  useEffect(() => {
    if (!entered) return;
    const sectionIds = ["inicio", "cidade", "turismo", "lore", "jornal", "imoveis", "regras", "vips"];
    const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target.id) setActiveSection(visible.target.id);
    }, { rootMargin: "-22% 0px -62%", threshold: [0, .1, .35, .65] });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [entered]);
  const [musicOn, setMusicOn] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [ticketNotice, setTicketNotice] = useState("");
  const [articleOpen, setArticleOpen] = useState(false);
  const [editionOpen, setEditionOpen] = useState(false);
  const [archiveReportOpen, setArchiveReportOpen] = useState(false);
  const [archivePhotoOpen, setArchivePhotoOpen] = useState(false);
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
  const [secretMoment, setSecretMoment] = useState<number | null>(null);
  const [secretRotation, setSecretRotation] = useState(0);
  const [secretDragging, setSecretDragging] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const smileAudioRef = useRef<HTMLAudioElement>(null);
  const nightSoundPlayedRef = useRef(false);
  const horrorContextRef = useRef<AudioContext | null>(null);
  const musicWasPlayingRef = useRef(false);
  const secretDragRef = useRef({ x: 0, rotation: 0, width: 1 });
  const tourismDeckRef = useRef<HTMLDivElement>(null);
  const tourismGestureRef = useRef({ x: 0, moved: false });
  const suppressTourismClickRef = useRef(false);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("editor-preview") === "1") {
      document.documentElement.dataset.editorPreview = "true";
      setEntered(true);
    }
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setDarkMode(window.localStorage.getItem("sunnyvalley-theme") === "dark");
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? "dark" : "light";
    window.localStorage.setItem("sunnyvalley-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    const applySavedDraft = () => {
      try {
        const raw = window.localStorage.getItem("sunnyvalley-editor-draft-v2");
        if (!raw) return;
        const draft = JSON.parse(raw) as {
          texts?: Record<string, string>;
          images?: Record<string, string>;
          hidden?: Record<string, boolean>;
          styles?: Record<string, { color?: string; fontSize?: string; fontFamily?: string; textAlign?: string; transform?: string; animation?: string; width?: string; opacity?: string; rotate?: string }>;
          customBlocks?: Array<{ id: string; title: string; text: string }>;
          customImages?: Array<{ id: string; src: string; caption: string }>;
        };
        const contentItems = Array.from(document.querySelectorAll<HTMLElement>("#conteudo h2,#conteudo h3,#conteudo h4,#conteudo p,#conteudo li,#conteudo blockquote,#conteudo figcaption,#conteudo img"));
        const topItems = Array.from(document.querySelectorAll<HTMLElement>(".nav img,.nav a,.hero h1,.hero p,.hero span,.hero em,.hero img"));
        const editable = [...contentItems, ...topItems];
        editable.forEach((element, index) => {
          const key = `element-${index}`;
          element.dataset.svEditId = key;
          if (element instanceof HTMLImageElement && draft.images?.[key]) element.src = draft.images[key];
          if (!(element instanceof HTMLImageElement) && draft.texts?.[key] !== undefined) element.textContent = draft.texts[key];
          if (draft.hidden?.[key]) element.style.display = "none";
          const savedStyle = draft.styles?.[key];
          if (savedStyle) {
            const protectedNavigationLink = element.matches(".nav-links a,.mobile-nav a");
            if (savedStyle.color) element.style.color = savedStyle.color;
            if (savedStyle.fontSize) element.style.fontSize = savedStyle.fontSize;
            if (savedStyle.fontFamily) element.style.fontFamily = savedStyle.fontFamily;
            if (savedStyle.textAlign) element.style.textAlign = savedStyle.textAlign;
            if (savedStyle.transform && !protectedNavigationLink) element.style.transform = savedStyle.transform;
            if (savedStyle.width && !protectedNavigationLink) element.style.width = savedStyle.width;
            if (savedStyle.opacity) element.style.opacity = savedStyle.opacity;
            if (savedStyle.rotate && !protectedNavigationLink) element.style.rotate = savedStyle.rotate;
            if (savedStyle.animation) element.dataset.editorAnimation = savedStyle.animation;
          }
        });
        const host = document.getElementById("conteudo");
        draft.customBlocks?.forEach((block) => {
          if (!host || document.querySelector(`[data-custom-block="${block.id}"]`)) return;
          const section = document.createElement("section");
          section.className = "section user-created-block";
          section.dataset.customBlock = block.id;
          section.innerHTML = `<span>CRIADO NO EDITOR</span><h2></h2><p></p>`;
          const title = section.querySelector("h2");
          const text = section.querySelector("p");
          if (title) title.textContent = block.title;
          if (text) text.textContent = block.text;
          host.appendChild(section);
        });
        draft.customImages?.forEach((item) => {
          if (!host || document.querySelector(`[data-custom-image="${item.id}"]`)) return;
          const figure = document.createElement("figure");
          figure.className = "section user-created-image";
          figure.dataset.customImage = item.id;
          const image = document.createElement("img");
          image.src = item.src;
          image.alt = item.caption || "Imagem adicionada no editor";
          const caption = document.createElement("figcaption");
          caption.textContent = item.caption;
          figure.append(image, caption);
          host.appendChild(figure);
        });
      } catch {
        // A malformed local draft must never stop the public site from loading.
      }
    };
    const timer = window.setTimeout(applySavedDraft, 120);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const request = window.indexedDB.open("sunnyvalley-editor-assets", 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains("assets")) request.result.createObjectStore("assets");
    };
    request.onsuccess = () => {
      const transaction = request.result.transaction("assets", "readonly");
      const getMusic = transaction.objectStore("assets").get("ambient-music");
      getMusic.onsuccess = () => {
        if (!(getMusic.result instanceof Blob) || !audioRef.current) return;
        audioRef.current.src = URL.createObjectURL(getMusic.result);
        audioRef.current.load();
      };
    };
  }, []);

  useEffect(() => {
    if (!darkMode || !entered) return;
    let hideTimer = 0;
    const reveal = () => {
      setSecretMoment((current) => {
        let next = Math.floor(Math.random() * secretPhrases.length);
        if (next === current) next = (next + 1) % secretPhrases.length;
        return next;
      });
      hideTimer = window.setTimeout(() => setSecretMoment(null), 4200);
    };
    const firstTimer = window.setTimeout(reveal, photoWhispersActive ? 500 : 4800);
    const interval = window.setInterval(reveal, 12000);
    return () => {
      window.clearTimeout(firstTimer);
      window.clearTimeout(hideTimer);
      window.clearInterval(interval);
    };
  }, [darkMode, entered, photoWhispersActive]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.07;

    const startMusic = (event: Event) => {
      if (event.target instanceof Element && event.target.closest(".music-control")) return;
      void audio.play().then(() => {
        setMusicOn(true);
        window.removeEventListener("pointerdown", startMusic);
        window.removeEventListener("keydown", startMusic);
      }).catch(() => undefined);
    };

    window.addEventListener("pointerdown", startMusic);
    window.addEventListener("keydown", startMusic);
    return () => {
      window.removeEventListener("pointerdown", startMusic);
      window.removeEventListener("keydown", startMusic);
    };
  }, []);

  useEffect(() => {
    const modalOpen = articleOpen || editionOpen || archiveReportOpen || archivePhotoOpen || seaWitchOpen || Boolean(tourismCategoryOpen) || Boolean(galleryOpen) || Boolean(propertyOpen);
    if (!modalOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setArticleOpen(false);
        setEditionOpen(false);
        setArchiveReportOpen(false);
        setArchivePhotoOpen(false);
        setSeaWitchOpen(false);
        setSecretDragging(false);
        stopHorrorAmbience();
        stopSmileMusic();
        const audio = audioRef.current;
        if (audio && musicWasPlayingRef.current) {
          audio.volume = 0.07;
          void audio.play().then(() => setMusicOn(true)).catch(() => setMusicOn(false));
        }
        musicWasPlayingRef.current = false;
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
  }, [articleOpen, editionOpen, archiveReportOpen, archivePhotoOpen, seaWitchOpen, tourismCategoryOpen, galleryOpen, propertyOpen]);

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.07;
    if (audio.paused) void audio.play().then(() => setMusicOn(true)).catch(() => setMusicOn(false));
    else {
      audio.pause();
      setMusicOn(false);
    }
  };

  function stopHorrorAmbience() {
    const context = horrorContextRef.current;
    horrorContextRef.current = null;
    if (context && context.state !== "closed") void context.close();
  }

  function stopSmileMusic() {
    const smileAudio = smileAudioRef.current;
    if (!smileAudio) return;
    smileAudio.pause();
    smileAudio.currentTime = 0;
  }

  function startHorrorAmbience() {
    stopHorrorAmbience();
    try {
      const context = new window.AudioContext();
      void context.resume();
      const master = context.createGain();
      const lowDrone = context.createOscillator();
      const distantTone = context.createOscillator();
      const lowFilter = context.createBiquadFilter();
      const noise = context.createBufferSource();
      const noiseFilter = context.createBiquadFilter();
      const noiseGain = context.createGain();
      const pulse = context.createOscillator();
      const pulseGain = context.createGain();

      master.gain.setValueAtTime(0.032, context.currentTime);
      lowFilter.type = "lowpass";
      lowFilter.frequency.value = 145;
      lowFilter.Q.value = 1.8;
      lowDrone.type = "sine";
      lowDrone.frequency.value = 46;
      distantTone.type = "triangle";
      distantTone.frequency.value = 73;
      distantTone.detune.value = -13;

      const noiseBuffer = context.createBuffer(1, context.sampleRate * 3, context.sampleRate);
      const noiseData = noiseBuffer.getChannelData(0);
      for (let index = 0; index < noiseData.length; index += 1) noiseData[index] = (Math.random() * 2 - 1) * 0.22;
      noise.buffer = noiseBuffer;
      noise.loop = true;
      noiseFilter.type = "bandpass";
      noiseFilter.frequency.value = 410;
      noiseFilter.Q.value = 0.55;
      noiseGain.gain.value = 0.12;

      pulse.type = "sine";
      pulse.frequency.value = 0.075;
      pulseGain.gain.value = 0.012;
      pulse.connect(pulseGain);
      pulseGain.connect(master.gain);
      lowDrone.connect(lowFilter);
      distantTone.connect(lowFilter);
      lowFilter.connect(master);
      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(master);
      master.connect(context.destination);
      lowDrone.start();
      distantTone.start();
      noise.start();
      pulse.start();
      horrorContextRef.current = context;
    } catch {
      // O documento continua funcionando quando o navegador bloqueia áudio.
    }
  }

  function startArchiveAmbience() {
    stopHorrorAmbience();
    try {
      const context = new window.AudioContext();
      void context.resume();
      const master = context.createGain();
      const whisper = context.createBufferSource();
      const whisperFilter = context.createBiquadFilter();
      const whisperGain = context.createGain();
      const breath = context.createOscillator();
      const breathDepth = context.createGain();
      const laugh = context.createOscillator();
      const laughFilter = context.createBiquadFilter();
      const laughGain = context.createGain();
      const laughPulse = context.createOscillator();
      const laughPulseDepth = context.createGain();
      const wobble = context.createOscillator();
      const wobbleDepth = context.createGain();
      const delay = context.createDelay(.8);
      const feedback = context.createGain();

      master.gain.setValueAtTime(.09, context.currentTime);
      const noiseBuffer = context.createBuffer(1, context.sampleRate * 5, context.sampleRate);
      const noiseData = noiseBuffer.getChannelData(0);
      for (let index = 0; index < noiseData.length; index += 1) noiseData[index] = (Math.random() * 2 - 1) * .28;
      whisper.buffer = noiseBuffer;
      whisper.loop = true;
      whisperFilter.type = "bandpass";
      whisperFilter.frequency.value = 1180;
      whisperFilter.Q.value = 1.3;
      whisperGain.gain.value = .14;
      breath.type = "sine";
      breath.frequency.value = .13;
      breathDepth.gain.value = .075;
      breath.connect(breathDepth);
      breathDepth.connect(whisperGain.gain);

      laugh.type = "triangle";
      laugh.frequency.value = 238;
      laughFilter.type = "bandpass";
      laughFilter.frequency.value = 520;
      laughFilter.Q.value = 1.15;
      laughGain.gain.value = .052;
      laughPulse.type = "square";
      laughPulse.frequency.value = .52;
      laughPulseDepth.gain.value = .047;
      laughPulse.connect(laughPulseDepth);
      laughPulseDepth.connect(laughGain.gain);
      wobble.type = "sine";
      wobble.frequency.value = 5.2;
      wobbleDepth.gain.value = 52;
      wobble.connect(wobbleDepth);
      wobbleDepth.connect(laugh.frequency);
      delay.delayTime.value = .24;
      feedback.gain.value = .16;
      delay.connect(feedback);
      feedback.connect(delay);

      whisper.connect(whisperFilter);
      whisperFilter.connect(whisperGain);
      whisperGain.connect(master);
      laugh.connect(laughFilter);
      laughFilter.connect(laughGain);
      laughGain.connect(master);
      laughGain.connect(delay);
      delay.connect(master);
      master.connect(context.destination);
      whisper.start();
      breath.start();
      laugh.start();
      laughPulse.start();
      wobble.start();
      horrorContextRef.current = context;
    } catch {
      // A folha continua acessível quando o navegador bloqueia áudio.
    }
  }

  function openSeaSecret() {
    const audio = audioRef.current;
    musicWasPlayingRef.current = Boolean(audio && !audio.paused);
    if (audio && !audio.paused) audio.pause();
    setSecretRotation(0);
    setSecretDragging(false);
    setSeaWitchOpen(true);
    startHorrorAmbience();
  }

  function closeSeaSecret() {
    setSeaWitchOpen(false);
    setSecretDragging(false);
    stopHorrorAmbience();
    const audio = audioRef.current;
    if (audio && musicWasPlayingRef.current) {
      audio.volume = 0.07;
      void audio.play().then(() => setMusicOn(true)).catch(() => setMusicOn(false));
    }
    musicWasPlayingRef.current = false;
  }

  const finishSecretDrag = (pointerId?: number, target?: EventTarget | null) => {
    setSecretDragging(false);
    setSecretRotation((current) => Math.round(current / 180) * 180);
    if (typeof pointerId === "number" && target instanceof Element && target.hasPointerCapture(pointerId)) target.releasePointerCapture(pointerId);
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

  const openSmileSecret = () => {
    const audio = audioRef.current;
    const smileAudio = smileAudioRef.current;
    musicWasPlayingRef.current = Boolean(audio && !audio.paused);
    if (audio && !audio.paused) audio.pause();
    stopHorrorAmbience();
    if (smileAudio) {
      smileAudio.pause();
      smileAudio.currentTime = 0;
      smileAudio.volume = .07;
      void smileAudio.play().catch(() => undefined);
    }
    setDistortionActive(true);
    window.setTimeout(() => setDistortionActive(false), 1650);
    window.setTimeout(() => setArchiveReportOpen(true), 420);
  };

  const closeSmileSecret = () => {
    setArchivePhotoOpen(false);
    setArchiveReportOpen(false);
    stopHorrorAmbience();
    stopSmileMusic();
    const audio = audioRef.current;
    if (audio && musicWasPlayingRef.current) {
      audio.volume = .07;
      void audio.play().then(() => setMusicOn(true)).catch(() => setMusicOn(false));
    }
    musicWasPlayingRef.current = false;
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

  const focusTourismCard = (category: string) => {
    setActiveTourism(category);
    const card = tourismDeckRef.current?.querySelector<HTMLElement>(`[data-tourism-id="${category}"]`);
    card?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "nearest", inline: "center" });
  };

  const handleTourismKeys = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const current = attractions.findIndex((item) => item.id === activeTourism);
    const next = event.key === "Home"
      ? 0
      : event.key === "End"
        ? attractions.length - 1
        : (current + (event.key === "ArrowRight" ? 1 : -1) + attractions.length) % attractions.length;
    const category = attractions[next].id;
    focusTourismCard(category);
    tourismDeckRef.current?.querySelector<HTMLButtonElement>(`[data-tourism-id="${category}"]`)?.focus();
  };

  const handleTourismPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch") tourismGestureRef.current = { x: event.clientX, moved: false };
  };

  const handleTourismPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch" && Math.abs(event.clientX - tourismGestureRef.current.x) > 12) tourismGestureRef.current.moved = true;
  };

  const handleTourismPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "touch" || !tourismGestureRef.current.moved) return;
    const distance = event.clientX - tourismGestureRef.current.x;
    if (Math.abs(distance) < 42) return;
    const current = attractions.findIndex((item) => item.id === activeTourism);
    const next = Math.max(0, Math.min(attractions.length - 1, current + (distance < 0 ? 1 : -1)));
    suppressTourismClickRef.current = true;
    focusTourismCard(attractions[next].id);
    window.setTimeout(() => { suppressTourismClickRef.current = false; }, 0);
  };

  const visibleProperties = properties.filter((property) => property.name !== "Mansão Blackwood" && (activeProperty === "todos" || property.category === activeProperty));

  const filteredRules = useMemo(() => {
    const term = query.trim().toLocaleLowerCase("pt-BR");
    return rules.filter((rule) => {
      const groupMatch = activeGroup === "Todas" || rule.group === activeGroup;
      const haystack = `${rule.group} ${rule.subgroup} ${rule.title} ${rule.text}`.toLocaleLowerCase("pt-BR");
      return groupMatch && (!term || haystack.includes(term));
    });
  }, [activeGroup, query]);

  const rulesPerPage = 7;
  const rulePageCount = Math.max(1, Math.ceil(filteredRules.length / rulesPerPage));
  const pagedRules = filteredRules.slice(rulePage * rulesPerPage, rulePage * rulesPerPage + rulesPerPage);
  const activeChapterNumber = activeGroup === "Todas" ? "00" : String(Math.max(1, groups.indexOf(activeGroup))).padStart(2, "0");
  const activeChapterTitle = activeGroup === "Todas" ? "Manual oficial completo" : shortGroup(activeGroup);

  const turnNewspaper = (action: () => void) => {
    if (newspaperTurning) return;
    setNewspaperTurning(true);
    window.setTimeout(() => {
      action();
      setNewspaperTurning(false);
    }, 520);
  };
  const showNewspaperStory = (story: NewspaperStoryKey) => turnNewspaper(() => setNewspaperPage(story));
  const showNewspaperCover = () => turnNewspaper(() => setNewspaperPage(null));
  return (
    <main className={`site-shell ${darkMode ? "dark-mode" : "light-mode"} ${distortionActive ? "archive-distorting" : ""} ${entered ? "site-entered" : "entrance-pending"}`}>
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
      {!entered && (
        <section className="postcard-entrance" aria-label="Convite para SunnyValley">
          <div className="entrance-grain" aria-hidden="true" />
          <div className="entrance-postcard">
            <img src="/assets/cartao-postal-oficial.webp" alt="Cartão-postal oficial de SunnyValley" />
          </div>
          <p>Você recebeu um cartão-postal de SunnyValley.</p>
          <button type="button" onClick={() => setEntered(true)}>Entrar em SunnyValley <span aria-hidden="true">→</span></button>
          <small>Turismo oficial <i>•</i> Est. 1898</small>
        </section>
      )}
      <div className="dark-atmosphere" aria-hidden="true"><span /><span /><span /></div>
      <div className={`night-whisper-layer ${darkMode && entered && secretMoment !== null ? "whispers-active" : ""}`} aria-hidden="true">
        {darkMode && entered && secretMoment !== null && <span className={`night-whisper whisper-${(secretMoment % 4) + 1}`}>{secretPhrases[secretMoment]}</span>}
      </div>
      {distortionActive && <div className="distortion-flash" aria-hidden="true"><span>VOCÊ FOI VISTO</span></div>}
      <audio ref={audioRef} src="/assets/velvet-dollhouse-low.ogg" loop preload="auto" playsInline />
      <audio ref={smileAudioRef} src="/assets/the-web-of-mr.mp3" loop preload="auto" playsInline />
      <button className="music-control" type="button" onClick={toggleMusic} aria-pressed={musicOn} aria-label={musicOn ? "Pausar música ambiente" : "Tocar música ambiente"}>
        <span aria-hidden="true">{musicOn ? "♫" : "♩"}</span>{musicOn ? "Música baixa" : "Tocar ambiente"}
      </button>

      <nav className="nav" aria-label="Navegação principal">
        <a className="brand" href="#inicio" aria-label="SunnyValley — início">
          <span className="brand-lockup"><img src="/assets/sunnyvalley-wordmark.png" alt="SunnyValley" /><strong>EST. 1898</strong></span>
        </a>
        <div className="nav-links">
          <a className={activeSection === "inicio" ? "active" : ""} href="#inicio">Início</a><a className={activeSection === "cidade" ? "active" : ""} href="#cidade">A cidade</a><a className={activeSection === "turismo" ? "active" : ""} href="#turismo">Turismo</a><a className={activeSection === "lore" ? "active" : ""} href="#lore">Histórias do vale</a><a className={activeSection === "jornal" ? "active" : ""} href="#jornal">Jornal</a><a className={activeSection === "imoveis" ? "active" : ""} href="#imoveis">Imóveis</a><a className={activeSection === "regras" ? "active" : ""} href="#regras">Regras</a><a className={activeSection === "vips" ? "active" : ""} href="#vips">VIP</a>
        </div>
        <details className="mobile-nav" onClick={(event) => { if ((event.target as HTMLElement).closest("a")) event.currentTarget.open = false; }}>
          <summary>Menu</summary>
          <div><a href="#inicio">Início</a><a href="#cidade">A cidade</a><a href="#turismo">Turismo</a><a href="#lore">Histórias do vale</a><a href="#jornal">Jornal</a><a href="#imoveis">Imóveis</a><a href="#regras">Regras</a><a href="#vips">VIP</a></div>
        </details>
        <button className="theme-toggle" type="button" onClick={toggleTheme} aria-pressed={darkMode} aria-label={darkMode ? "Ativar modo claro" : "Ativar modo escuro"}>
          <span className="theme-orbit" aria-hidden="true"><img className="theme-sun" src="/assets/sol-inteiro-user.png" alt="" /><img className="theme-moon" src="/assets/lua-user.png" alt="" /></span>
        </button>
      </nav>

      <header className="hero" id="inicio">
        <div className="hero-grain" />
        <picture className="hero-scenery"><img src="/assets/hero-montanha-costa.jpg" alt="Vista do norte de SunnyValley registrada dentro do servidor" /></picture>
        <div className="hero-clouds" aria-hidden="true"><i /><i /><i /></div>
        <div className="hero-birds" aria-hidden="true"><span>⌁</span><span>⌁</span><span>⌁</span></div>
        <aside className="hero-index" aria-hidden="true"><span>Montanhas</span><span>Oceano</span><span>História</span><span>E algo mais...</span><i /></aside>
        <div className="hero-content">
          <div className="hero-copy">
            <h1 className="sr-only">SunnyValley</h1>
            <img className="hero-wordmark-logo" src="/assets/sunnyvalley-logo-oficial.png" alt="SunnyValley" />
            <p className="hero-founded">EST. 1898</p>
            <p className="hero-lead">Quem entra no vale<br /><em>simplesmente não quer ir embora.</em></p>
            <div className="hero-actions">
              <a className="button primary" href={TICKET_DISCORD} target="_blank" rel="noreferrer">Compre sua passagem <span aria-hidden="true">→</span></a>
            </div>
            <div className="hero-categories">Turismo <i /> Comunidade <i /> Experiências</div>
          </div>
        </div>
        <aside className="hero-signoff" aria-hidden="true"><em>Good people,<br />strange places.</em><span>Mesma cidade<br />Novas histórias<br />Sempre SunnyValley</span></aside>
        <a className="hero-scroll" href="#cidade">Scroll <span aria-hidden="true">↓</span></a>
      </header>

      <div id="conteudo">
        <div className="section-passage" aria-hidden="true" />
        <section className="intro section" id="cidade">
          <div className="city-hero">
            <img src="/assets/cidade-veleiro-poente.webp" alt="Veleiro atravessando a costa de SunnyValley ao pôr do sol" />
            <div className="city-live-sky" aria-hidden="true"><i/><i/><span>⌁</span><span>⌁</span></div>
            <div className="city-origin-overlay">
              <span className="city-location">SunnyValley • San Andreas</span>
              <div className="city-origin-copy"><h2>1898</h2><em>A origem de tudo.</em><p>Fundada no final do século XIX por visionários e sonhadores, SunnyValley cresceu entre trilhas antigas, estradas de terra e o espírito livre do norte. Uma cidade construída com trabalho, coragem e esperança.</p><a href="#turismo">Conheça o guia da cidade <span aria-hidden="true">→</span></a></div>
              <blockquote>“Algumas histórias nunca envelhecem.”</blockquote>
              <div className="city-socials">
                <a href={OFFICIAL_DISCORD} target="_blank" rel="noreferrer"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.2 7.4c3.2-1.4 6.4-1.4 9.6 0 1.5 2.1 2.3 4.4 2.2 6.9-1.8 1.4-3.3 2.1-4.7 2.5l-.7-1.1c.8-.3 1.5-.7 2.2-1.2-2.7 1.3-5 1.3-7.7 0 .7.5 1.4.9 2.2 1.2l-.7 1.1c-1.4-.4-2.9-1.1-4.7-2.5-.1-2.5.7-4.8 2.3-6.9Z"/><circle cx="9.3" cy="12" r="1"/><circle cx="14.7" cy="12" r="1"/></svg><b>Discord</b></a>
                <a href={INSTAGRAM} target="_blank" rel="noreferrer"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/></svg><b>Instagram</b></a>
              </div>
            </div>
          </div>
          <div className="city-polaroids" aria-label="Registros fotográficos da cidade">
            <figure><img src="/assets/cidade-costa-dourada.webp" alt="Costa de SunnyValley ao pôr do sol" /><figcaption><strong>O sol encontra o vale</strong><span>O horizonte muda devagar quando a luz encontra a costa. É nessa hora que SunnyValley parece guardar seus melhores segredos.</span></figcaption></figure>
            <figure><img src="/assets/cidade-farol-aereo.webp" alt="Farol de SunnyValley visto do alto" /><figcaption><strong>Farol da costa norte</strong><span>Entre o mar e as pedras, o farol continua indicando o caminho para quem chega — e para quem ainda tenta partir.</span></figcaption></figure>
            <figure><img src="/assets/cidade-floresta-real.jpg" alt="Floresta do norte de San Andreas" /><figcaption><strong>Mount Chiliad</strong><span>As trilhas atravessam florestas antigas, onde o silêncio faz parte da paisagem e cada curva revela uma nova vista.</span></figcaption></figure>
            <blockquote>“O norte não é apenas um lugar no mapa. É um estado de espírito.”</blockquote>
          </div>
        </section>

        <div className="section-passage" aria-hidden="true" />
        <section className="section attractions" id="turismo">
          <div className="section-decor tourism-decor" aria-hidden="true"><img src="/assets/decor-11.webp" alt="" /><img src="/assets/decor-19.webp" alt="" /></div>
          <div className="section-heading">
            <div><span className="section-label">Guia oficial • Desde 1898</span><h2>Visite<br />SunnyValley</h2></div>
            <p><strong>Escolha seu passeio.</strong> Entre pousadas acolhedoras, sabores da costa, águas tranquilas e trilhas entre montanhas, cada caminho revela um novo pedaço do norte.</p>
          </div>
          <div
            className="attraction-grid tourism-categories"
            role="list"
            aria-label="Categorias turísticas"
            ref={tourismDeckRef}
            onKeyDown={handleTourismKeys}
            onPointerDown={handleTourismPointerDown}
            onPointerMove={handleTourismPointerMove}
            onPointerUp={handleTourismPointerUp}
          >
            {attractions.map((item) => (
              <article className={`tourism-card-shell ${activeTourism === item.id ? "active" : ""}`} role="listitem" key={item.title}>
                <button
                  className={`attraction-card ${activeTourism === item.id ? "active" : ""}`}
                  type="button"
                  data-tourism-id={item.id}
                  aria-label={`${item.title}: ${item.text} Abrir guia de lugares.`}
                  aria-pressed={activeTourism === item.id}
                  onPointerEnter={(event) => event.pointerType === "mouse" && setActiveTourism(item.id)}
                  onFocus={() => setActiveTourism(item.id)}
                  onClick={() => {
                    if (suppressTourismClickRef.current) return;
                    if (activeTourism !== item.id) focusTourismCard(item.id);
                    else showTourismCategory(item.id);
                  }}
                >
                  <span className="attraction-photo"><img src={item.image} alt="" /></span>
                  <span className="attraction-paper">
                    <span className="card-icon" aria-hidden="true">{item.icon}</span>
                    <span className="attraction-title">{item.title}</span>
                    <span className="attraction-description">{item.text}</span>
                    <b>Ver lugares <span aria-hidden="true">→</span></b>
                  </span>
                </button>
              </article>
            ))}
          </div>
          <p className="tourism-open-note">Escolha uma categoria acima para abrir seu guia ilustrado sem sair desta página.</p>
        </section>

        <div className="section-passage" aria-hidden="true" />
        <section className="lore-section" id="lore">
          <div className="lore-hero">
            <div className="lore-sky-motion" aria-hidden="true"><span>⌁</span><span>⌁</span></div>
            <div className="lore-hero-copy">
              <h2>Histórias<br />do Vale</h2>
              <blockquote>“Quem entra no vale simplesmente não quer ir embora.”</blockquote>
              <p>Se você recebeu um cartão-postal de SunnyValley, considere-se oficialmente convidado! Pegue seu ingresso e escolha como deseja iniciar a viagem: embarque no ônibus de turismo pelas estradas do norte ou atravesse as águas tranquilas a bordo da nossa balsa.</p>
            </div>
          </div>

          <div className="section lore-content">
            <div className="section-passage" aria-hidden="true" />
            <article className="lore-story light-story">
              <span className="chapter-number">Capítulo 1</span>
              <div className="lore-story-title"><h3>As Férias Perfeitas</h3></div>
              <p>SunnyValley é aquele refúgio dos sonhos que você imaginava existir apenas em cartões-postais. Localizada em nossa linda península norte, a cidade é <em>cercada</em> por praias de águas calmas e cristalinas, florestas densas perfeitas para acampamentos em família, trilhas ecológicas e uma arquitetura colonial charmosa que fará você se sentir em casa.</p>
              <p>Durante o dia, SunnyValley é impecável. O sol brilha forte, o comércio local permanece movimentado e nossas atrações oferecem diversão para todas as idades. Você pode pescar, passear de lancha, saltar de paraquedas sobre as montanhas ou simplesmente descansar enquanto observa a paisagem.</p>
              <p>E os moradores? <em>Ah</em>, são as pessoas mais gentis e calorosas que você conhecerá! Eles recebem os visitantes com sorrisos largos, oferecem tortas frescas nas janelas, indicam os melhores pontos de pesca e insistem, do fundo do coração, para que você aproveite cada milissegundo da sua estadia.</p>
              <blockquote>Respire fundo, relaxe e aproveite…</blockquote>
            </article>
            <article className="lore-story dark-story">
              <span className="chapter-number">Depois do pôr do sol</span>
              <h3>O Segredo de SunnyValley</h3>
              <p><em>Mas fique atento ao relógio, querido turista. Aqui, o tempo voa.</em> Quando o sol começa a desaparecer atrás das grandes montanhas do norte, a atmosfera vibrante de SunnyValley muda drasticamente. O vento esfria, os pássaros ficam completamente em silêncio e uma neblina espessa começa a rastejar pelo horizonte, engolindo as ruas de paralelepípedo.</p>
              <p>É nesse momento que o primeiro som ecoa pela cidade. Não é um alarme. Não é um aviso moderno. É apenas um som atravessando a neblina.</p>
              <p>Se estiver na rua, você perceberá algo ainda mais estranho: os moradores não correm e não demonstram medo. Apenas interrompem o que estão fazendo com uma calma quase hipnótica, recolhem seus pertences e trancam as portas e janelas de madeira.</p>
              <p>Caso pergunte por que todos estão se escondendo, eles desviarão o olhar por alguns segundos. Depois, voltarão o rosto para você e abrirão aquele mesmo sorriso largo, simétrico e forçado — imóvel o suficiente para fazer sua espinha congelar.</p>
              <p>Então responderão com uma voz mansa, quase cantada, repetindo uma antiga cantiga que todos em SunnyValley parecem conhecer de cor. Antes que você compreenda as palavras, a porta será fechada.</p>
              <p>Depois disso, SunnyValley não fica deserta. Ela apenas parece estar... <em>esperando.</em> Se decidir entrar no carro, retornar ao ônibus ou correr até a balsa para deixar a cidade… <em>bem, talvez seja melhor não tentar, querido turista.</em> Mas, se realmente insistir, procure não viajar sozinho. E caso aconteça alguma coisa durante o caminho — a estrada se repetir, algumas horas desaparecerem ou alguém surgir no banco ao seu lado — respire fundo e mantenha a calma. <em>Deve ser apenas o cansaço das férias!</em></p>
              <p><strong>Se conseguir retornar, também recomendamos que não conte para ninguém o que viu enquanto tentava deixar SunnyValley.</strong> <em>As pessoas de fora podem ser terrivelmente preconceituosas e acabar usando palavras tão desagradáveis como… bem… louco.</em></p>
              <blockquote className="folklore-line">Naturalmente, tudo isso faz parte do folclore local.</blockquote>
            </article>

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

        <div className="section-passage" aria-hidden="true" />
        <section className="newspaper-section" id="jornal" aria-labelledby="newspaper-title">
          <div className="newspaper-stack" aria-hidden="true"><i /><i /></div>
          <div className={`newspaper-book ${newspaperTurning ? "page-turning" : ""}`}>
          {!newspaperPage && <div className="section newspaper-inner newspaper-page newspaper-cover">
            <div className="newspaper-masthead">
              <div className="newspaper-brand">
                <span className="section-label">Jornal de SunnyValley</span>
                <h2 id="newspaper-title">The Valley</h2>
                <p>A verdade por trás do vale</p>
                <small>Fundado em 1898</small>
              </div>
              <div className="newspaper-meta" aria-label="Informações da edição">
                <article className="newspaper-weather interactive-news" role="button" tabIndex={0} onClick={() => showNewspaperStory("neblina")} onKeyDown={(event) => event.key === "Enter" && showNewspaperStory("neblina")}>
                  <span className="newspaper-weather-icon" aria-hidden="true">☁</span>
                  <span><b>Clima • 12 °C</b>Esta noite terá neblina.<small>Fiquem em casa. Abrir boletim →</small></span>
                </article>
                <span>Edição nº 4.821</span><span>The Valley Publishing Co. • Desde 1898</span><span>{editionDate}</span>
              </div>
            </div>

            <div className="newspaper-location-line"><span>SunnyValley, San Andreas</span><span>R$ 2,00</span></div>

            <header className="newspaper-feature-heading interactive-news" role="button" tabIndex={0} onClick={() => showNewspaperStory("leonora")} onKeyDown={(event) => event.key === "Enter" && showNewspaperStory("leonora")}>
              <span className="newspaper-kicker">Edição especial • Caso SV-2004-1018</span>
              <h3>MISTÉRIO EM SUNNYVALLEY: FOTÓGRAFA DESAPARECIDA!</h3>
              <p className="news-deck">Leonora Johnson desapareceu durante uma investigação sobre antigos acontecimentos da cidade.</p>
            </header>

            <article className="newspaper-lead interactive-news" role="button" tabIndex={0} onClick={() => showNewspaperStory("leonora")} onKeyDown={(event) => event.key === "Enter" && showNewspaperStory("leonora")}>
              <figure className="lead-photo">
                <img src="/assets/leonora-johnson-definitiva.png" alt="Leonora Johnson com sua câmera em SunnyValley" />
                <figcaption>Último registro conhecido de Leonora Johnson antes de seguir para a trilha norte.</figcaption>
              </figure>
              <div className="lead-copy">
                <p>A fotógrafa de 27 anos desapareceu após seguir para uma antiga trilha ao norte. Seu veículo, documentos e pertences foram encontrados; dentro da mata, restaram apenas uma câmera e uma lanterna.</p>
                <blockquote>Até o fechamento desta edição, Leonora Johnson permanece desaparecida.</blockquote>
                <div className="news-actions">
                  <button className="news-read-more" type="button" onClick={(event) => { event.stopPropagation(); showNewspaperStory("leonora"); }}>Abrir matéria <span aria-hidden="true">→</span></button>
                  <span><b>Status:</b> desaparecida desde 18/10/2004</span>
                </div>
              </div>
            </article>

            <article className="newspaper-history-note newspaper-history-strip">
              <span>Arquivo local</span><h3>Histórico da região</h3><p>SunnyValley carrega marcas de um passado colonial turbulento. Vozes na floresta, trilhas esquecidas e figuras vistas durante a neblina aparecem nos relatos da região há várias gerações. <strong>O xerife local afirma que essas histórias não passam de lendas locais — embora nunca assine os boletins depois do anoitecer.</strong></p>
            </article>

            <article className="newspaper-secondary-feature interactive-news" role="button" tabIndex={0} onClick={() => showNewspaperStory("lenda")} onKeyDown={(event) => event.key === "Enter" && showNewspaperStory("lenda")}>
              <figure className="news-thumb"><img src="/assets/jornal-moradores.webp" alt="Figura observada entre as árvores na região norte" /><figcaption>Registro da região norte.</figcaption></figure>
              <div><span>Região norte • 3 de junho de 1998</span><h3>Moradores relatam estranhezas na região</h3><p>Relatos sobre a “mulher nas estradas”, luzes entre as árvores e vozes sem origem deixam moradores apreensivos.</p></div>
            </article>

            <article className="newspaper-secondary-feature newspaper-city-feature">
              <figure className="news-thumb"><img src="/assets/festa-colheita-nova.webp" alt="Festival da Praia com grande fogueira e moradores reunidos" /><figcaption>Festival da Praia reúne moradores e visitantes.</figcaption></figure>
              <div><span>Notícias da cidade</span><h3>O vale em movimento</h3><p>Música, comida local e uma grande fogueira esperam moradores e visitantes no Festival da Praia. Com a chegada da alta temporada, pousadas, restaurantes e passeios turísticos estão preparados para receber quem deseja descobrir SunnyValley. Traga seus amigos, percorra as trilhas, visite a Praia Aurora e aproveite tudo o que o vale oferece.</p><p className="city-invitation"><span className="day-copy">Venha passar alguns dias conosco. Sempre existe um lugar esperando por você.</span><span className="night-copy">Venha passar alguns dias conosco. Algumas estradas demoram mais do que deveriam para deixar você partir.</span></p></div>
            </article>

            <div className="newspaper-grid">
              <article className="news-card news-image-card newspaper-pousada-card interactive-news" role="button" tabIndex={0} onClick={() => showNewspaperStory("pousada")} onKeyDown={(event) => event.key === "Enter" && showNewspaperStory("pousada")}>
                <figure className="news-thumb"><img src="/assets/jornal-quarto-4.webp" alt="Equipes de emergência diante da pousada durante a noite" /><figcaption>Pousada histórica, 16 de agosto de 2012.</figcaption></figure>
                <div><span>Ocorrência • 16 de agosto de 2012</span><h3>Turista é internado após surto em pousada histórica</h3><p>Jovem afirmou que era perseguido e que todas as estradas o levavam de volta à pousada.</p></div>
              </article>
            </div>

            <nav className="newspaper-editions" aria-label="Matérias desta edição"><button type="button" onClick={()=>showNewspaperStory("leonora")}>← Caso Leonora</button><span>Edição nº 4.821 • 19 de outubro de 2004</span><button type="button" onClick={()=>showNewspaperStory("lenda")}>Moradores da região →</button></nav>
            <div className="newspaper-signoff"><strong>The Valley</strong><span>“A verdade por trás do vale.” • Jornal de SunnyValley • Fundado em 1898<br />Apoie o comércio local. SunnyValley cresce quando trabalhamos juntos.</span></div>
          </div>}
          {newspaperPage && <article className={`section newspaper-inner newspaper-page newspaper-article story-${newspaperPage}`}>
            {newspaperPage && (() => {
              const story = newspaperStories[newspaperPage];
              return <>
                <div className="article-edition-bar"><strong>Jornal de SunnyValley</strong><span>Arquivo The Valley • A verdade por trás do vale</span><button className="newspaper-back-button" type="button" onClick={showNewspaperCover}>← Voltar à capa</button></div>
                <header className="newspaper-article-head"><span>{story.kicker}</span><h2>{story.title}</h2><p>{story.deck}</p><small>SunnyValley • {story.date}</small></header>
                {newspaperPage === "leonora" && <aside className="leonora-dossier" aria-label="Dados do desaparecimento"><div className="leonora-identity"><strong>Leonora Johnson</strong><span>27 anos • 1,68 m • cabelos ruivos • olhos castanhos</span></div><div><strong>Última vez vista</strong><p>18 de outubro de 2004, por volta das 22h17, na região norte de SunnyValley, próximo à antiga trilha da floresta e à estrada da marina.</p></div><div><strong>Caso nº SV-2004-1018</strong><p>Fotógrafa desaparecida durante uma investigação sobre antigos acontecimentos da cidade.</p></div></aside>}
                <figure className="newspaper-article-photo"><img src={story.image} alt={story.title} /><figcaption>{story.caption}</figcaption></figure>
                <div className="newspaper-article-columns">{story.paragraphs.map((paragraph, index) => <div className="article-paragraph" key={paragraph}>{((newspaperPage === "leonora" && index === 1) || (newspaperPage === "pousada" && index === 3) || (newspaperPage === "lenda" && index === 4)) && <h3>{newspaperPage === "leonora" ? "A última noite" : newspaperPage === "pousada" ? "Eu tentei ir embora" : "Uma história contada há gerações"}</h3>}{newspaperPage === "leonora" && index === 4 && <h3>Caso nº SV-2004-1018</h3>}{newspaperPage === "pousada" && index === 7 && <h3>Não teria sido o primeiro caso</h3>}<p>{paragraph}</p></div>)}</div>
                {newspaperPage === "leonora" && <aside className="newspaper-emergency-banner article-emergency" aria-label="Alerta sobre Leonora Johnson"><strong>Viu esta mulher?</strong><span>☎ Ligue 190</span><span>🛡 Procure imediatamente o Xerifado de SunnyValley.</span><small>Toda informação será tratada em sigilo. Não tente realizar buscas sozinho.</small></aside>}
                {newspaperPage === "pousada" && <button className="smile-diary-trigger night-only" type="button" onClick={openSmileSecret}>Ele está sorrindo para mim.</button>}
                <footer><strong>The Valley</strong><span>A verdade por trás do vale • Fundado em 1898</span></footer>
              </>;
            })()}
          </article>}
          </div>
        </section>

        <div className="section-passage" aria-hidden="true" />
        <section className="property-section" id="imoveis">
          <div className="section-decor property-decor" aria-hidden="true"><img src="/assets/decor-15.webp" alt="" /><img src="/assets/decor-20.webp" alt="" /></div>
          <div className="property-hero">
            <img src="/assets/mansion-blackwood-exterior.webp" alt="Mansão Blackwood integrada à montanha em Paleto Bay" />
            <div><span className="section-label light">Casa premium • Paleto Bay</span><h2>Encontre seu lugar no vale.</h2><p>Mansão Blackwood — arquitetura moderna integrada à montanha, deck privativo e acesso direto às águas do vale.</p><button className="button primary" type="button" onClick={() => { setGalleryImage(0); setPropertyOpen(properties[0]); }}>Conhecer a Mansão Blackwood →</button></div>
          </div>
          <div className="section property-inner">
            <div className="property-tabs" role="tablist" aria-label="Tipos de imóveis">
              {[['todos', 'Todos'], ['casas', 'Casas em Sandy e Paleto'], ['penthouses', 'Penthouses']].map(([id, label]) => <button type="button" role="tab" aria-selected={activeProperty === id} className={activeProperty === id ? "active" : ""} onClick={() => setActiveProperty(id)} key={id}>{label}</button>)}
            </div>
            <p className="property-intro"><strong>Imóveis disponíveis — venha morar conosco.</strong> As casas de Paleto e Sandy possuem opções de interiores diferentes; você escolhe o estilo que melhor combina com sua história.</p>
            <div className="property-grid" aria-live="polite">
              {visibleProperties.map((property, index) => <article className="property-card" key={property.name}><div className="property-image-wrap" onPointerEnter={revealPhotoWhispers} onPointerDown={revealPhotoWhispers}><img src={property.images[0]} alt={`${property.name}, ${property.location}`} /><span>{String(index + 1).padStart(2, "0")}</span>{property.images.length > 1 && <b>{property.images.length} fotos</b>}</div><div className="property-copy"><span>{property.label} • {property.location}</span>{property.category === "penthouses" && <small>{property.rooms}</small>}<h3>{property.name}</h3><p>{property.text}</p><button type="button" onClick={() => { setGalleryImage(0); setPropertyOpen(property); }}>Conhecer propriedade →</button></div></article>)}
            </div>
            <div className="ticket-helper" aria-live="polite">
              <div><span>Mensagem pronta para o suporte</span><p>“Olá! Quero falar com um responsável sobre a compra de um imóvel em SunnyValley.”</p></div>
              <a className="button primary" href={SUPPORT_CHANNEL} target="_blank" rel="noreferrer" onClick={() => void copyTicketMessage("a compra de um imóvel")}>Copiar e abrir o canal</a>
            </div>
            <p className="ticket-notice" role="status" hidden={!ticketNotice}>{ticketNotice}</p>
          </div>
        </section>

        <div className="section-passage" aria-hidden="true" />
        <section className="section rules-section" id="regras">
          <div className="manual-layout">
            <aside className="manual-index">
              <span>Manual oficial</span><h3>SunnyValley</h3><small>Edição 2026</small>
              <nav aria-label="Índice do manual">{groups.map((group,index)=><button type="button" className={activeGroup===group?"selected":""} aria-pressed={activeGroup===group} onClick={()=>{setActiveGroup(group);setRulePage(0);}} key={group}><b>{String(index).padStart(2,"0")}</b>{group==="Todas"?"Manual completo":shortGroup(group)}</button>)}</nav>
              <em>SunnyValley Administration</em>
            </aside>
            <div className="manual-paper">
              <header className="manual-chapter-head">
                <span className="manual-number">{activeChapterNumber}</span>
                <div><small>Manual oficial — SunnyValley</small><h2>{activeChapterTitle}</h2><p>Normas e diretrizes oficiais para convivência, segurança e roleplay dentro da cidade.</p></div>
              </header>
              <div className="rule-tools">
                <label className="group-select"><span>Filtrar por categoria</span><select value={activeGroup} onChange={(event) => {setActiveGroup(event.target.value);setRulePage(0);}}>{groups.map((group) => <option value={group} key={group}>{group === "Todas" ? group : shortGroup(group)}</option>)}</select></label>
                <label className="search-box"><span aria-hidden="true">⌕</span><span className="sr-only">Pesquisar regra</span><input value={query} onChange={(event) => {setQuery(event.target.value);setRulePage(0);}} placeholder="Pesquisar no manual" /></label>
              </div>
              <div className="rule-library" aria-live="polite">
                {pagedRules.map((rule, index) => <article className="rule-row" key={`${rule.group}-${rule.subgroup}-${rule.title}`}><span className="rule-number">{activeChapterNumber}.{rulePage * rulesPerPage + index + 1}</span><div><h3>{rule.title}</h3><p>{rule.text}</p></div><b>{/proib|restri|ban|hack|ódio/i.test(`${rule.title} ${rule.text}`) ? "RESTRITO" : "OBRIGATÓRIO"}</b></article>)}
                {filteredRules.length === 0 && <div className="empty-rules">Nenhuma regra encontrada. Tente outra palavra.</div>}
              </div>
              <footer className="manual-pagination"><small>O descumprimento destas regras poderá resultar em penalidades conforme o manual oficial.</small><div><button type="button" disabled={rulePage===0} onClick={()=>setRulePage((page)=>Math.max(0,page-1))}>←</button><span>{String(rulePage+1).padStart(2,"0")} / {String(rulePageCount).padStart(2,"0")}</span><button type="button" disabled={rulePage>=rulePageCount-1} onClick={()=>setRulePage((page)=>Math.min(rulePageCount-1,page+1))}>→</button></div></footer>
            </div>
          </div>
        </section>

        <div className="section-passage" aria-hidden="true" />
        <section className="vip-section" id="vips">
          <div className="section-decor vip-page-decor" aria-hidden="true"><img src="/assets/decor-18.webp" alt="" /><img src="/assets/decor-16.webp" alt="" /></div>
          <div className="section vip-inner">
            <div className="section-heading vip-heading"><div><span className="section-label light">Passagens e residências</span><em>Seu próximo capítulo espera por você.</em><h2>Sua<br />história<br />começa<br />aqui.</h2></div><p>Mais que uma visita, uma escolha. Nossos passes e documentos de residência abrem as portas de SunnyValley para experiências inesquecíveis — e para uma vida que pode, se você quiser, ser sua.</p><a className="button primary" href={SUPPORT_CHANNEL} target="_blank" rel="noreferrer">Solicitar passagem <span aria-hidden="true">→</span></a><p className="vip-travel-line">Entre montanhas, costas e histórias, existe um vale chamando você de lar.</p></div>
            <div className="vip-grid">{vipPlans.map((plan,index) => <article className={`vip-card ${plan.featured ? "featured" : ""}`} key={plan.name}>{plan.featured && <span className="recommended">Mais escolhido</span>}<div className="vip-code">{String(index === 2 ? 1998 : 1898).padStart(7,"0")}</div><div className="vip-top"><span>{plan.mark}</span><h3>{plan.name}</h3><div className="vip-price-row"><strong>{plan.price}</strong></div></div><p className="vip-description">{plan.description}</p><span className="vip-stamp" aria-hidden="true"><img src="/assets/seal-mountain-lighthouse.png" alt="" /></span><a href={SUPPORT_CHANNEL} target="_blank" rel="noreferrer" onClick={() => void copyTicketMessage(`o VIP ${plan.name}`)}>Solicitar no Discord</a></article>)}</div>
            <figure className="vip-cinematic"><img src="/assets/placa.webp" alt="Vista cinematográfica de SunnyValley" /></figure>
            <p className="vip-disclaimer">Cada passe representa uma forma diferente de viver SunnyValley. Valores e disponibilidade são confirmados durante o atendimento.</p>
          </div>
        </section>

        <div className="section-passage" aria-hidden="true" />
        <section className="section final-cta">
          <div><span className="section-label">Sua viagem está quase começando</span><h2>SunnyValley espera por você.</h2><p>Pegue sua passagem, entre no Discord e comece sua história no vale.</p></div>
          <a className="button primary" href={TICKET_DISCORD} target="_blank" rel="noreferrer">Compre sua passagem</a>
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
                  <img src="/assets/leonora-johnson-definitiva.png" alt="Leonora Johnson com sua câmera em SunnyValley" />
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
                    <img style={{ width: `${newspaperZoom * 100}%`, maxWidth: "none" }} src="/assets/leonora-johnson-definitiva.png" alt="Fotografia definitiva de Leonora Johnson" />
                  </div>
                  <figcaption>Registro fotográfico • Caso SV-2004-1018</figcaption>
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
              <span>The Valley • Edição nº 4.821</span>
              <p>Sexta-feira, 19 de outubro de 2004</p>
              <h2 id="edition-modal-title">Moradores relatam estranhezas na região</h2>
              <strong>Relatos sobre a “mulher da estrada”, luzes entre as árvores e vozes sem origem deixam moradores apreensivos.</strong>
            </header>
            <div className="edition-layout">
              <section className="edition-copy">
                <article><span>Matéria principal</span><p><b>Moradores de diversas áreas da região norte relatam experiências inexplicáveis que vêm se repetindo nos últimos meses.</b></p><p>Luzes vistas entre as árvores durante a madrugada, vozes sem origem aparente e figuras observadas em trilhas antigas levantam dúvidas e aumentam o clima de apreensão.</p><p>Muitos evitam sair de casa à noite e dizem ter medo das áreas isoladas, especialmente perto da floresta. Alguns afirmam ter ouvido sussurros ou passos seguindo de perto, mas não há explicação para o que testemunharam.</p><blockquote>“A gente aprende desde criança que não se entra naquela floresta depois que escurece. Não é medo. É costume. SunnyValley tem muitas lendas guardadas. Algumas estão na biblioteca; as outras vocês podem descobrir conversando com a gente. Temos o maior prazer em contar.”</blockquote><p>As autoridades informam que não há registros oficiais que comprovem qualquer atividade sobrenatural, mas reconhecem que os relatos se tornaram cada vez mais frequentes.</p></article>
                <article><span>Região norte</span><h3>Lenda urbana da região?</h3><p>Moradores antigos contam histórias que atravessam gerações. Há relatos de luzes entre as árvores durante a madrugada, vozes sem origem aparente e figuras observadas em trilhas já abandonadas. Durante décadas, essas ocorrências foram tratadas como lendas e histórias contadas pelos moradores locais.</p></article>
                <article><span>Clima</span><h3>Esta noite terá neblina. Fiquem em casa.</h3><p>A previsão indica formação intensa de neblina nas áreas próximas à costa, mata e estradas secundárias. Moradores devem evitar deslocamentos desnecessários durante a madrugada.</p></article>
                <article><span>Tradição local</span><h3>Celebração anual da comunidade de SunnyValley</h3><p>A cidade recebe uma programação comunitária com música, comidas típicas e confraternização entre moradores e visitantes.</p></article>
                <article><span>Ocorrência • 17 de outubro de 2004</span><h3>O caso do quarto 4: turista é internado após surto</h3><p>O visitante havia se hospedado por apenas um dia, mas insistia que estava no local havia anos. Confuso e desorientado, recusava-se a deixar o quarto 4 e repetia que “não podia sair dali”. Ele permanece internado para avaliação.</p></article>
                <aside><strong>O xerife diz que é só uma lenda local.</strong><em>Pelo menos oficialmente.</em></aside>
              </section>
              <div className="edition-media-stack">
                <figure className="edition-story-photo residents-edition-photo">
                  <img src="/assets/jornal-moradores.webp" alt="Figura feminina entre as árvores da região norte de SunnyValley" />
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
                    <img style={{ width: `${editionZoom * 100}%`, maxWidth: "none" }} src="/assets/jornal-leonora-2004.webp" alt="Edição completa do jornal The Valley de 19 de outubro de 2004" />
                  </div>
                  <figcaption>Use + e − para ler todos os detalhes da edição.</figcaption>
                </figure>
              </div>
            </div>
          </article>
        </div>
      )}

      {archiveReportOpen && (
        <div className="site-modal archive-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && closeSmileSecret()}>
          <article className="archive-modal report-modal confidential-report-modal secret-archive-modal" role="dialog" aria-modal="true" aria-labelledby="smile-case-title">
            <button className="modal-close" type="button" onClick={closeSmileSecret} aria-label="Fechar relatório">×</button>
            <section className="smile-case-file" aria-labelledby="smile-case-title">
              <header className="smile-case-header">
                <span>— Documento não anexado ao boletim oficial</span>
                <strong>Arquivo encontrado na ala psiquiátrica</strong>
                <small>* Transcrição de uma folha recolhida entre os pertences do paciente</small>
                <h3 id="smile-case-title">Ele estava sorrindo pra mim.</h3>
              </header>
              <div className="smile-case-layout">
                <button className="psychiatric-polaroid" type="button" onClick={() => setArchivePhotoOpen(true)} aria-label="Ampliar fotografia dos dez turistas"><img src="/assets/arquivo-psiquiatrico-dez-turistas.png" alt="Fotografia do grupo de dez turistas diante da pousada" /><span>Fotografia encontrada entre os pertences do paciente • clique para ampliar</span></button>
                <div className="smile-case-copy psychiatric-note">
                  <p>Chegamos em dez à pousada antiga. Antes de descarregar as malas, tiramos uma fotografia diante do estacionamento. Eu disse que havia uma pessoa nos observando ao fundo. Eles olharam a imagem, riram e falaram que devia ser apenas um funcionário da pousada. Ninguém quis perguntar quem era.</p>
                  <p>Peguei o carro porque precisava sair de SunnyValley. Não contei aos outros. Se eu dissesse que aquele homem estava me seguindo desde a praia, eles teriam rido de novo.</p>
                  <p>Segui pela estrada principal e acelerei até o túnel. Havia alguma coisa parada entre as luzes. Não era uma pessoa esperando ajuda. Ficou imóvel enquanto eu passava, como se já soubesse para onde a estrada iria me levar.</p>
                  <p>Continuei dirigindo. Vi a Praia Aurora, o bondinho e a placa da pousada outra vez. Eu não fiz retorno algum.</p>
                  <p>Quando olhei pelo retrovisor, ele estava atrás de mim. Não sei como entrou no carro. Não consigo lembrar do rosto inteiro.</p>
                </div>
              </div>
              <aside className="handwritten-note">
                <strong>O restante da página foi escrito com outra caneta:</strong>
                <p>Depois disso, só lembro da chuva e das pedras atrás da pousada. Quando abri os olhos, havia luzes vermelhas, policiais e alguém chamando meu nome. Eles disseram que me encontraram sozinho.</p>
                <blockquote>“Quando olhei pelo retrovisor, ele sorriu para mim.”</blockquote>
              </aside>
            </section>
          </article>
        </div>
      )}

      {archivePhotoOpen && (
        <div className="site-modal polaroid-lightbox archive-photo-lightbox" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setArchivePhotoOpen(false)}>
          <button className="modal-close" type="button" onClick={() => setArchivePhotoOpen(false)} aria-label="Fechar fotografia ampliada">×</button>
          <img src="/assets/arquivo-psiquiatrico-dez-turistas.png" alt="Fotografia ampliada do grupo de dez turistas diante da pousada" />
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
                <span>Guia oficial de SunnyValley</span>
                <div><i aria-hidden="true">{attraction.icon}</i><h2 id="tourism-window-title">{attraction.title}</h2></div>
                <p>{tourismCategoryCopy[attraction.id].day}</p>
              </header>
              <div className="tourism-window-grid">
                {categoryPlaces.map((place) => (
                  <article className="place-card" key={place.name}>
                    <div className="place-image-wrap" onPointerEnter={revealPhotoWhispers} onPointerDown={revealPhotoWhispers}>
                      <img src={place.image} alt={`${place.name}, ${place.location}`} />
                    </div>
                    <div className="place-copy"><span>{place.type} • {place.location}</span><h3>{place.name}</h3><p>{place.text}</p><button type="button" onClick={() => { setTourismCategoryOpen(null); openTourismPlace(place); }}>Ver foto em destaque →</button></div>
                  </article>
                ))}
              </div>
              {darkMode && attraction.id === "aguas" && <button className="sea-witch-trigger" type="button" onClick={() => { setTourismCategoryOpen(null); openSeaSecret(); }} aria-label="Examinar símbolo encontrado junto à água"><span aria-hidden="true">◈</span></button>}
            </article>
          </div>
        );
      })()}

      {seaWitchOpen && (
        <div className="site-modal sea-witch-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && closeSeaSecret()}>
          <article className="sea-secret-modal" role="dialog" aria-modal="true" aria-label="Documento encontrado">
            <button className="modal-close" type="button" onClick={closeSeaSecret} aria-label="Fechar documento">×</button>
            <div className="sea-secret-stage">
              <div
                className={`sea-secret-document${secretDragging ? " dragging" : ""}`}
                style={{ transform: `rotateY(${secretRotation}deg)` }}
                role="img"
                aria-label="Documento antigo com a Santa do Mar na frente e o bilhete de Leonora no verso"
                tabIndex={0}
                onPointerDown={(event) => {
                  event.currentTarget.setPointerCapture(event.pointerId);
                  secretDragRef.current = {
                    x: event.clientX,
                    rotation: secretRotation,
                    // offsetWidth mantém a largura real do documento mesmo quando o 3D está a 90°.
                    // A largura visual de getBoundingClientRect() quase zera nessa posição e fazia o giro disparar.
                    width: Math.max(event.currentTarget.offsetWidth, 1),
                  };
                  setSecretDragging(true);
                }}
                onPointerMove={(event) => {
                  if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
                  event.preventDefault();
                  const drag = secretDragRef.current;
                  const movement = ((event.clientX - drag.x) / drag.width) * 180;
                  setSecretRotation(drag.rotation + movement);
                }}
                onPointerUp={(event) => finishSecretDrag(event.pointerId, event.currentTarget)}
                onPointerCancel={(event) => finishSecretDrag(event.pointerId, event.currentTarget)}
                onKeyDown={(event) => {
                  if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
                    setSecretRotation(event.key === "ArrowRight" ? 180 : 0);
                  }
                }}
              >
                <div className="sea-secret-face sea-secret-front" aria-hidden="true"><img src="/assets/santa-do-mar-frente-v5.webp" alt="" /></div>
                <div className="sea-secret-face sea-secret-back" aria-hidden="true"><img src="/assets/bilhete-leonora-verso-v5-normal.webp" alt="" /></div>
              </div>
              <div className="sea-secret-controls" aria-label="Lados do documento">
                <button type="button" onClick={() => setSecretRotation(0)}>Santa do Mar</button>
                <span aria-hidden="true">↔</span>
                <button type="button" onClick={() => setSecretRotation(180)}>Bilhete de L.J.</button>
              </div>
            </div>
          </article>
        </div>
      )}

      {galleryOpen && (
        <div className="site-modal catalog-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setGalleryOpen(null)}>
          <article className="catalog-modal" role="dialog" aria-modal="true" aria-labelledby="catalog-title">
            <button className="modal-close" type="button" onClick={() => setGalleryOpen(null)} aria-label="Fechar detalhes">×</button>
            <img onPointerEnter={revealPhotoWhispers} onPointerDown={revealPhotoWhispers} src={galleryOpen.image} alt={galleryOpen.name} />
            <div><span>{galleryOpen.type} • {galleryOpen.location}</span><h2 id="catalog-title">{galleryOpen.name}</h2><p>{galleryOpen.text}</p><p className="catalog-story">{galleryOpen.story}</p><a className="button primary" href={TICKET_DISCORD} target="_blank" rel="noreferrer">Compre sua passagem</a></div>
          </article>
        </div>
      )}

      {propertyOpen && (
        <div className="site-modal catalog-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setPropertyOpen(null)}>
          <article className="catalog-modal property-modal" role="dialog" aria-modal="true" aria-labelledby="property-modal-title">
            <button className="modal-close" type="button" onClick={() => setPropertyOpen(null)} aria-label="Fechar imóvel">×</button>
            <div className="catalog-image-view" onPointerEnter={revealPhotoWhispers} onPointerDown={revealPhotoWhispers}><img src={propertyOpen.images[galleryImage]} alt={`${propertyOpen.name} — foto ${galleryImage + 1}`} />{propertyOpen.images.length > 1 && <div className="catalog-thumbs">{propertyOpen.images.map((image, index) => <button type="button" className={galleryImage === index ? "active" : ""} onClick={() => setGalleryImage(index)} key={image}><img src={image} alt={`Ver foto ${index + 1}`} /></button>)}</div>}</div>
            <div><span>{propertyOpen.label} • {propertyOpen.location}</span><h2 id="property-modal-title">{propertyOpen.name}</h2>{propertyOpen.category === "penthouses" && <strong>{propertyOpen.rooms}</strong>}<p>{propertyOpen.text}</p><p>Fale com um responsável para conhecer todas as opções.</p><a className="button primary" href={SUPPORT_CHANNEL} target="_blank" rel="noreferrer" onClick={() => void copyTicketMessage("a compra de um imóvel")}>Abrir ticket e consultar</a></div>
          </article>
        </div>
      )}

      <div className="section-passage" aria-hidden="true" />
      <footer id="contato" className="site-footer">
        <div><strong>SunnyValley</strong><p>Turismo, comunidade e novas histórias desde 1898.</p></div>
        <div className="footer-links"><a href={OFFICIAL_DISCORD} target="_blank" rel="noreferrer">Discord</a><a href={INSTAGRAM} target="_blank" rel="noreferrer">Instagram</a><a href="#jornal">The Valley</a><a href="#regras">Regras</a><a href="#inicio">Voltar ao topo</a></div>
        <div className="footer-note">SunnyValley • Links oficiais da cidade</div>
      </footer>
    </main>
  );
}
