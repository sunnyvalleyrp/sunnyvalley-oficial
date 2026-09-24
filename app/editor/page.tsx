"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";

type Comment = { id: string; target: string; label: string; text: string; createdAt: string };
type CustomBlock = { id: string; title: string; text: string };
type ElementStyle = { color?: string; fontSize?: string; fontFamily?: string; textAlign?: string; transform?: string; animation?: string; width?: string; opacity?: string; rotate?: string };
type CustomImage = { id: string; src: string; caption: string };
type Draft = {
  texts: Record<string, string>;
  images: Record<string, string>;
  hidden: Record<string, boolean>;
  styles: Record<string, ElementStyle>;
  comments: Comment[];
  customBlocks: CustomBlock[];
  customImages: CustomImage[];
  updatedAt?: string;
};

const STORAGE_KEY = "sunnyvalley-editor-draft-v2";
const emptyDraft = (): Draft => ({ texts: {}, images: {}, hidden: {}, styles: {}, comments: [], customBlocks: [], customImages: [] });

export default function EditorPage() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [selectedId, setSelectedId] = useState("");
  const [selectedLabel, setSelectedLabel] = useState("Nenhum elemento selecionado");
  const [textValue, setTextValue] = useState("");
  const [commentValue, setCommentValue] = useState("");
  const [color, setColor] = useState("#2b251c");
  const [fontSize, setFontSize] = useState("32");
  const [fontFamily, setFontFamily] = useState("Georgia, serif");
  const [textAlign, setTextAlign] = useState("left");
  const [animation, setAnimation] = useState("");
  const [width, setWidth] = useState("100");
  const [opacity, setOpacity] = useState("100");
  const [rotation, setRotation] = useState("0");
  const [moveMode, setMoveMode] = useState(false);
  const draftRef = useRef<Draft>(emptyDraft());
  const moveModeRef = useRef(false);
  const dragRef = useRef<{ id: string; x: number; y: number; tx: number; ty: number } | null>(null);
  const [notice, setNotice] = useState("Abra a prévia e clique em qualquer texto ou fotografia.");

  const frameDocument = () => iframeRef.current?.contentDocument ?? null;

  const identifyElements = () => {
    const doc = frameDocument();
    if (!doc) return;
    const contentItems = Array.from(doc.querySelectorAll<HTMLElement>("#conteudo h2,#conteudo h3,#conteudo h4,#conteudo p,#conteudo li,#conteudo blockquote,#conteudo figcaption,#conteudo img"));
    const topItems = Array.from(doc.querySelectorAll<HTMLElement>(".nav img,.nav a,.hero h1,.hero p,.hero span,.hero em,.hero img"));
    const items = [...contentItems, ...topItems];
    items.forEach((element, index) => {
      element.dataset.svEditId = `element-${index}`;
      element.classList.add("sv-editor-target");
    });
    applyDraftToFrame(draft);
  };

  const applyDraftToFrame = (nextDraft: Draft) => {
    const doc = frameDocument();
    if (!doc) return;
    Object.entries(nextDraft.texts).forEach(([id, text]) => {
      const node = doc.querySelector<HTMLElement>(`[data-sv-edit-id="${id}"]`);
      if (node && !(node instanceof HTMLImageElement)) node.textContent = text;
    });
    Object.entries(nextDraft.images).forEach(([id, src]) => {
      const image = doc.querySelector<HTMLImageElement>(`img[data-sv-edit-id="${id}"]`);
      if (image) image.src = src;
    });
    Object.entries(nextDraft.hidden).forEach(([id, hidden]) => {
      const node = doc.querySelector<HTMLElement>(`[data-sv-edit-id="${id}"]`);
      if (node) node.style.display = hidden ? "none" : "";
    });
    Object.entries(nextDraft.styles).forEach(([id, style]) => {
      const node = doc.querySelector<HTMLElement>(`[data-sv-edit-id="${id}"]`);
      if (!node) return;
      if (style.color) node.style.color = style.color;
      if (style.fontSize) node.style.fontSize = style.fontSize;
      if (style.fontFamily) node.style.fontFamily = style.fontFamily;
      if (style.textAlign) node.style.textAlign = style.textAlign;
      if (style.transform) node.style.transform = style.transform;
      if (style.width) node.style.width = style.width;
      if (style.opacity) node.style.opacity = style.opacity;
      if (style.rotate) node.style.rotate = style.rotate;
      if (style.animation) node.dataset.editorAnimation = style.animation; else delete node.dataset.editorAnimation;
    });
  };

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const restored = { ...emptyDraft(), ...JSON.parse(saved) };
        draftRef.current = restored;
        setDraft(restored);
      }
    } catch {
      setNotice("O rascunho anterior não pôde ser aberto.");
    }
  }, []);

  const onFrameLoad = () => {
    const doc = frameDocument();
    if (!doc) return;
    const openPreview = () => doc.querySelector<HTMLButtonElement>(".postcard-entrance button")?.click();
    openPreview();
    window.setTimeout(openPreview, 500);
    window.setTimeout(() => {
      openPreview();
      identifyElements();
      doc.addEventListener("click", (event) => {
        const target = (event.target as HTMLElement).closest<HTMLElement>("[data-sv-edit-id]");
        if (!target) return;
        event.preventDefault();
        event.stopPropagation();
        doc.querySelectorAll(".sv-editor-selected").forEach((item) => item.classList.remove("sv-editor-selected"));
        target.classList.add("sv-editor-selected");
        const id = target.dataset.svEditId ?? "";
        setSelectedId(id);
        const label = target instanceof HTMLImageElement ? `Fotografia: ${target.alt || id}` : target.textContent?.trim().slice(0, 70) || id;
        setSelectedLabel(label);
        setTextValue(target instanceof HTMLImageElement ? "" : target.textContent ?? "");
        const style = getComputedStyle(target);
        setColor(style.color.startsWith("rgb") ? rgbToHex(style.color) : style.color);
        setFontSize(String(Math.round(parseFloat(style.fontSize))));
        setFontFamily(style.fontFamily.includes("Georgia") ? "Georgia, serif" : style.fontFamily.includes("Segoe Script") ? '"Segoe Script", cursive' : "Inter, sans-serif");
        setTextAlign(style.textAlign || "left");
        setAnimation(target.dataset.editorAnimation ?? "");
        setWidth(String(Math.round((target.getBoundingClientRect().width / Math.max(1, target.parentElement?.getBoundingClientRect().width ?? target.getBoundingClientRect().width)) * 100)));
        setOpacity(String(Math.round(Number(style.opacity || 1) * 100)));
        setRotation(parseFloat(style.rotate || "0") ? String(Math.round(parseFloat(style.rotate))) : "0");
        setNotice("Elemento selecionado. Edite no painel e aplique.");
      }, true);
      doc.addEventListener("pointerdown", (event) => {
        if (!moveModeRef.current) return;
        const target = (event.target as HTMLElement).closest<HTMLElement>("[data-sv-edit-id]");
        if (!target?.dataset.svEditId) return;
        event.preventDefault();
        const saved = draftRef.current.styles[target.dataset.svEditId]?.transform ?? "translate(0px, 0px)";
        const match = saved.match(/translate\((-?[\d.]+)px,\s*(-?[\d.]+)px\)/);
        dragRef.current = { id: target.dataset.svEditId, x: event.clientX, y: event.clientY, tx: Number(match?.[1] || 0), ty: Number(match?.[2] || 0) };
        target.setPointerCapture(event.pointerId);
      }, true);
      doc.addEventListener("pointermove", (event) => {
        if (!dragRef.current) return;
        const { id, x, y, tx, ty } = dragRef.current;
        const transform = `translate(${Math.round(tx + event.clientX - x)}px, ${Math.round(ty + event.clientY - y)}px)`;
        const target = doc.querySelector<HTMLElement>(`[data-sv-edit-id="${id}"]`);
        if (target) target.style.transform = transform;
      }, true);
      doc.addEventListener("pointerup", (event) => {
        if (!dragRef.current) return;
        const { id, x, y, tx, ty } = dragRef.current;
        const transform = `translate(${Math.round(tx + event.clientX - x)}px, ${Math.round(ty + event.clientY - y)}px)`;
        setDraft((current) => {
          const next = { ...current, styles: { ...current.styles, [id]: { ...current.styles[id], transform } } };
          draftRef.current = next;
          return next;
        });
        dragRef.current = null;
        setNotice("Nova posição aplicada. Clique em Salvar rascunho.");
      }, true);
    }, 1000);
  };

  const rgbToHex = (value: string) => {
    const numbers = value.match(/\d+/g)?.slice(0, 3).map(Number);
    return numbers?.length === 3 ? `#${numbers.map((item) => item.toString(16).padStart(2, "0")).join("")}` : "#2b251c";
  };

  const updateDraft = (next: Draft) => {
    draftRef.current = next;
    setDraft(next);
    applyDraftToFrame(next);
  };

  const applyText = () => {
    if (!selectedId) return setNotice("Clique primeiro em um texto na prévia.");
    const node = frameDocument()?.querySelector(`[data-sv-edit-id="${selectedId}"]`);
    if (node instanceof HTMLImageElement) return setNotice("Para essa fotografia, use Trocar imagem.");
    updateDraft({ ...draft, texts: { ...draft.texts, [selectedId]: textValue } });
    setNotice("Texto aplicado na prévia.");
  };

  const resizeImage = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("read"));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error("image"));
      image.onload = () => {
        const scale = Math.min(1, 1920 / image.width);
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);
        canvas.getContext("2d")?.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/webp", .8));
      };
      image.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });

  const replaceImage = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!selectedId || !file) return;
    const node = frameDocument()?.querySelector(`[data-sv-edit-id="${selectedId}"]`);
    if (!(node instanceof HTMLImageElement)) return setNotice("Selecione uma fotografia antes de enviar o arquivo.");
    try {
      const src = await resizeImage(file);
      updateDraft({ ...draft, images: { ...draft.images, [selectedId]: src } });
      setNotice("Fotografia trocada e preparada para o rascunho.");
    } catch {
      setNotice("Não consegui preparar essa imagem. Tente PNG, JPG ou WEBP.");
    }
  };

  const toggleHidden = () => {
    if (!selectedId) return setNotice("Selecione algo antes de ocultar.");
    updateDraft({ ...draft, hidden: { ...draft.hidden, [selectedId]: !draft.hidden[selectedId] } });
    setNotice(draft.hidden[selectedId] ? "Elemento voltou a aparecer." : "Elemento ocultado no rascunho.");
  };

  const applyStyle = () => {
    if (!selectedId) return setNotice("Selecione um texto ou imagem para mudar o visual.");
    const style: ElementStyle = {
      color,
      fontSize: `${Math.max(8, Number(fontSize) || 16)}px`,
      fontFamily,
      textAlign,
      animation,
      width: `${Math.min(200, Math.max(10, Number(width) || 100))}%`,
      opacity: String(Math.min(1, Math.max(.05, (Number(opacity) || 100) / 100))),
      rotate: `${Math.min(180, Math.max(-180, Number(rotation) || 0))}deg`,
    };
    updateDraft({ ...draft, styles: { ...draft.styles, [selectedId]: { ...draft.styles[selectedId], ...style } } });
    setNotice("Visual, proporção e efeito aplicados.");
  };

  const toggleMoveMode = () => {
    const next = !moveMode;
    setMoveMode(next);
    moveModeRef.current = next;
    setNotice(next ? "Modo mover ligado: segure e arraste qualquer texto ou foto." : "Modo mover desligado.");
  };

  const addImage = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const src = await resizeImage(file);
      const caption = window.prompt("Legenda da nova imagem:", "Novo registro de SunnyValley") ?? "";
      const item = { id: crypto.randomUUID(), src, caption };
      setDraft({ ...draft, customImages: [...draft.customImages, item] });
      setNotice("Imagem adicionada. Ela aparecerá no final da página depois de salvar.");
    } catch {
      setNotice("Não consegui preparar essa imagem.");
    }
  };

  const saveMusic = (file: File) => new Promise<void>((resolve, reject) => {
    const request = window.indexedDB.open("sunnyvalley-editor-assets", 1);
    request.onupgradeneeded = () => { if (!request.result.objectStoreNames.contains("assets")) request.result.createObjectStore("assets"); };
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const transaction = request.result.transaction("assets", "readwrite");
      transaction.objectStore("assets").put(file, "ambient-music");
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    };
  });

  const replaceMusic = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try { await saveMusic(file); setNotice(`Música ambiente trocada por ${file.name}.`); iframeRef.current?.contentWindow?.location.reload(); }
    catch { setNotice("Não consegui salvar esse áudio."); }
  };

  const removeMusic = () => {
    const request = window.indexedDB.open("sunnyvalley-editor-assets", 1);
    request.onsuccess = () => request.result.transaction("assets", "readwrite").objectStore("assets").delete("ambient-music");
    setNotice("Música personalizada removida; o áudio original voltará.");
  };

  const addComment = () => {
    if (!selectedId || !commentValue.trim()) return setNotice("Selecione um elemento e escreva o comentário.");
    const comment: Comment = { id: crypto.randomUUID(), target: selectedId, label: selectedLabel, text: commentValue.trim(), createdAt: new Date().toISOString() };
    setDraft({ ...draft, comments: [...draft.comments, comment] });
    setCommentValue("");
    setNotice("Comentário adicionado para a próxima revisão.");
  };

  const createBlock = () => {
    const title = window.prompt("Título do novo bloco:", "Novo lugar de SunnyValley");
    if (!title) return;
    const text = window.prompt("Texto do bloco:", "Escreva aqui as informações deste novo conteúdo.") ?? "";
    const block = { id: crypto.randomUUID(), title, text };
    const next = { ...draft, customBlocks: [...draft.customBlocks, block] };
    setDraft(next);
    setNotice("Novo bloco criado. Salve o rascunho para manter a criação.");
  };

  const save = () => {
    const next = { ...draft, updatedAt: new Date().toISOString() };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setDraft(next);
      setNotice("Rascunho salvo neste navegador.");
    } catch {
      setNotice("O navegador ficou sem espaço. Exporte o arquivo e remova imagens muito pesadas.");
    }
  };

  const exportDraft = () => {
    const blob = new Blob([JSON.stringify({ ...draft, updatedAt: new Date().toISOString() }, null, 2)], { type: "application/json" });
    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = `sunnyvalley-alteracoes-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(href);
    setNotice("Arquivo exportado. Você pode me enviar esse JSON depois.");
  };

  const reset = () => {
    if (!window.confirm("Apagar todas as alterações e comentários deste rascunho?")) return;
    window.localStorage.removeItem(STORAGE_KEY);
    setDraft(emptyDraft());
    iframeRef.current?.contentWindow?.location.reload();
    setNotice("Rascunho limpo.");
  };

  return (
    <main className="editor-app">
      <aside className="editor-sidebar">
        <header><span>SunnyValley</span><h1>Meu editor</h1><p>Edite visualmente e guarde suas ideias para publicar depois.</p></header>
        <div className="editor-selected"><small>Selecionado</small><strong>{selectedLabel}</strong></div>
        <label className="editor-field"><span>Editar texto</span><textarea value={textValue} onChange={(event) => setTextValue(event.target.value)} rows={6} placeholder="Clique em um texto da prévia" /></label>
        <button onClick={applyText}>Aplicar texto</button>
        <section className="editor-style-tools">
          <strong>Visual e animação</strong>
          <div className="editor-style-grid">
            <label><span>Cor</span><input type="color" value={color} onChange={(event) => setColor(event.target.value)} /></label>
            <label><span>Tamanho</span><input type="number" min="8" max="240" value={fontSize} onChange={(event) => setFontSize(event.target.value)} /></label>
            <label><span>Fonte</span><select value={fontFamily} onChange={(event) => setFontFamily(event.target.value)}><option value="Georgia, serif">Editorial</option><option value='"Segoe Script", cursive'>Manuscrita</option><option value="Inter, sans-serif">Clean</option></select></label>
            <label><span>Alinhar</span><select value={textAlign} onChange={(event) => setTextAlign(event.target.value)}><option value="left">Esquerda</option><option value="center">Centro</option><option value="right">Direita</option></select></label>
            <label className="wide"><span>Animação</span><select value={animation} onChange={(event) => setAnimation(event.target.value)}><option value="">Sem animação</option><option value="fade">Aparecer e sumir</option><option value="float">Flutuar</option><option value="pulse">Pulsar</option><option value="slide">Deslizar</option></select></label>
            <label><span>Largura %</span><input type="number" min="10" max="200" value={width} onChange={(event) => setWidth(event.target.value)} /></label>
            <label><span>Opacidade %</span><input type="number" min="5" max="100" value={opacity} onChange={(event) => setOpacity(event.target.value)} /></label>
            <label className="wide"><span>Rotação</span><input type="number" min="-180" max="180" value={rotation} onChange={(event) => setRotation(event.target.value)} /></label>
          </div>
          <button onClick={applyStyle}>Aplicar visual</button>
          <button className={moveMode ? "move-active" : ""} onClick={toggleMoveMode}>{moveMode ? "Parar de mover" : "Mover livremente"}</button>
        </section>
        <label className="editor-upload"><span>Trocar imagem</span><input type="file" accept="image/png,image/jpeg,image/webp" onChange={replaceImage} /></label>
        <label className="editor-upload"><span>Adicionar nova imagem</span><input type="file" accept="image/png,image/jpeg,image/webp" onChange={addImage} /></label>
        <label className="editor-upload"><span>Trocar música ambiente</span><input type="file" accept="audio/mpeg,audio/ogg,audio/wav,audio/mp4" onChange={replaceMusic} /></label>
        <button onClick={removeMusic}>Remover música personalizada</button>
        <div className="editor-row"><button onClick={toggleHidden}>Ocultar / mostrar</button><button onClick={createBlock}>Criar bloco</button></div>
        <label className="editor-field"><span>Comentário para a equipe</span><textarea value={commentValue} onChange={(event) => setCommentValue(event.target.value)} rows={4} placeholder="Ex.: deixar esta foto maior e mais envelhecida" /></label>
        <button onClick={addComment}>Adicionar comentário</button>
        <section className="editor-comments"><strong>Comentários ({draft.comments.length})</strong>{draft.comments.map((comment) => <article key={comment.id}><small>{comment.label}</small><p>{comment.text}</p><button onClick={() => setDraft({ ...draft, comments: draft.comments.filter((item) => item.id !== comment.id) })}>Remover</button></article>)}</section>
        <div className="editor-actions"><button className="save" onClick={save}>Salvar rascunho</button><button onClick={exportDraft}>Exportar alterações</button><button className="danger" onClick={reset}>Limpar tudo</button></div>
        <p className="editor-notice" role="status">{notice}</p>
        <a href="/">← Voltar ao site</a>
      </aside>
      <section className="editor-preview"><div className="editor-preview-bar"><span>PRÉVIA EDITÁVEL</span><b>Clique em textos ou fotografias</b></div><iframe ref={iframeRef} src="/?editor-preview=1" title="Prévia editável do SunnyValley" onLoad={onFrameLoad} /></section>
    </main>
  );
}

