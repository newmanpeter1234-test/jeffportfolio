import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowDownToLine, Check, Eye, FileText, Minus, Plus, ScanLine, X } from 'lucide-react';
import documentInventory from '../data/documents.json';
import { asset, useDialog } from '../hooks/useExperience';

export type DocumentId = 'resume' | 'cicsa' | 'csa' | 'experience';
export const documents = documentInventory;
export const getDocument = (id: DocumentId) => documents.find(document => document.id === id)!;
const DocumentsContext = createContext({ openDocument: (_id: DocumentId) => {} });
export const useDocuments = () => useContext(DocumentsContext);

export function DocumentProvider({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<DocumentId | null>(null);
  const close = useCallback(() => setSelected(null), []);
  const openDocument = useCallback((id: DocumentId) => setSelected(id), []);
  const location = useLocation();
  useEffect(() => setSelected(null), [location.pathname]);
  return <DocumentsContext.Provider value={{ openDocument }}>
    <div className="portfolio-app" inert={selected !== null} aria-hidden={selected !== null ? true : undefined}>{children}</div>
    {selected && <DocumentViewer selected={selected} select={openDocument} close={close} />}
  </DocumentsContext.Provider>;
}

function DocumentViewer({ selected, select, close }: { selected: DocumentId; select: (id: DocumentId) => void; close: () => void }) {
  const document = getDocument(selected);
  const dialog = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [textMode, setTextMode] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  useDialog(true, close, dialog);
  const fitPage = useCallback(() => {
    const element = viewport.current;
    if (!element) return;
    const style = getComputedStyle(element);
    const paddingX = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
    const paddingY = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
    const width = Math.min(820, element.clientWidth - paddingX);
    const page = document.pages[0];
    const ratio = (element.clientHeight - paddingY - 32) / (width * page.height / page.width);
    setZoom(Math.max(.25, Math.min(1, Math.floor(ratio * 100) / 100)));
    element.scrollTo({ top: 0, left: 0 });
  }, [document]);
  useLayoutEffect(() => {
    setTextMode(false); setLoaded(false); setFailed(false);
    fitPage();
  }, [selected, fitPage]);
  const size = `${(document.bytes / 1024).toFixed(0)} KB`;
  return <div className="document-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) close(); }}>
    <div className="document-viewer" role="dialog" aria-modal="true" aria-labelledby="document-viewer-title" aria-describedby="document-viewer-description" data-document-viewer ref={dialog}>
      <header className="document-viewer-header">
        <div className="document-viewer-brand"><FileText size={22} strokeWidth={1.4} /><div><span className="mono">THE DOCUMENT ROOM / JC–01</span><h2 id="document-viewer-title">{document.title}</h2></div></div>
        <button className="document-close" onClick={close} aria-label="Close document viewer"><X size={20} /><span>ESC</span></button>
      </header>
      <div className="document-viewer-body">
        <aside className="document-sidebar">
          <span className="document-sidebar-label mono">FOUR FILES. THE REAL DETAILS.</span>
          <nav className="document-switcher" aria-label="Choose a document">
            {documents.map((item, index) => <button key={item.id} onClick={() => select(item.id as DocumentId)} aria-pressed={selected === item.id} aria-label={`View ${item.label}`}>
              <span className="document-number mono">0{index + 1}</span><span>{item.label}<small>{item.id === 'resume' ? 'CURRENT PROFILE' : item.id === 'experience' ? 'WORK EXPERIENCE' : 'CERTIFICATE'}</small></span>{selected === item.id ? <Check size={15} /> : <FileText size={15} />}
            </button>)}
          </nav>
          <div className="document-sidebar-note"><ScanLine size={19} strokeWidth={1.3} /><p id="document-viewer-description">Preview first. Save only if you choose.</p><span>Original PDFs supplied by Jefrine. No files download automatically.</span></div>
        </aside>
        <section className="document-main" aria-label="Selected document">
          <div className="document-toolbar">
            <div className="document-zoom" aria-label="Preview zoom controls">
              <button onClick={() => setZoom(value => Math.max(.25, Math.round((value - .25) * 100) / 100))} disabled={textMode || zoom <= .25} aria-label="Zoom out"><Minus size={16} /></button>
              <button className="document-fit" onClick={() => setZoom(1)} disabled={textMode} aria-label="Fit preview to width">{Math.round(zoom * 100)}%</button>
              <button onClick={() => setZoom(value => Math.min(2.5, Math.round((value + .25) * 100) / 100))} disabled={textMode || zoom >= 2.5} aria-label="Zoom in"><Plus size={16} /></button>
            </div>
            <button className="document-fit-page" onClick={fitPage} disabled={textMode} aria-label="Fit whole page" title="Fit whole page"><ScanLine size={17} /></button>
            <button className="document-text-toggle" onClick={() => setTextMode(value => !value)} aria-pressed={textMode}><Eye size={15} /><span>{textMode ? 'Show preview' : 'Readable text'}</span></button>
            <span className="document-page-count mono">{document.pages.length} {document.pages.length === 1 ? 'PAGE' : 'PAGES'}</span>
          </div>
          <div className="document-viewport" ref={viewport} tabIndex={0} role="region" aria-label={`${document.label} preview. Use zoom controls and scroll to read.`}>
            {textMode ? <article className="document-readable"><span className="mono">READABLE TEXT / {document.label.toUpperCase()}</span><h3>{document.title}</h3><p>{document.text}</p></article> : <>
              {!loaded && !failed && <div className="document-loading" role="status"><span className="status-dot" />Preparing your preview…</div>}
              {failed && <div className="document-load-error" role="status"><FileText size={28} /><h3>Preview unavailable on this connection.</h3><p>You can still read the text version above or choose to save the original PDF below.</p></div>}
              <div className="document-pages" key={document.id}>
                {document.pages.map((page, index) => <figure className="document-paper" style={{ width: `${zoom * 100}%`, maxWidth: `${820 * zoom}px` }} key={page.image}>
                  <img src={asset(page.image)} width={page.width} height={page.height} alt={`${document.title}, original document preview, page ${index + 1} of ${document.pages.length}`} loading={index === 0 ? 'eager' : 'lazy'} decoding="async" onLoad={() => { if (index === 0) setLoaded(true); }} onError={() => setFailed(true)} />
                  <figcaption>PAGE {index + 1} / {document.pages.length} · ORIGINAL PROVIDED DOCUMENT</figcaption>
                </figure>)}
              </div>
            </>}
          </div>
          <footer className="document-viewer-footer"><div><span className="document-file-category mono">{document.category}</span><p>{document.issuer}</p><span className="document-file-meta">PDF · {size}{'issued' in document ? ` · Issued ${document.issued}` : ''}</span></div><a className="document-download" href={asset(document.pdf)} download={document.downloadName}><ArrowDownToLine size={16} /><span>Download PDF</span></a></footer>
        </section>
      </div>
    </div>
  </div>;
}

export function DocumentButton({ documentId, children, kind = 'secondary', className = '', label }: { documentId: DocumentId; children: ReactNode; kind?: 'primary' | 'secondary' | 'text'; className?: string; label?: string }) {
  const { openDocument } = useDocuments();
  return <button type="button" className={`button button-${kind} document-trigger ${className}`} onClick={() => openDocument(documentId)} aria-haspopup="dialog" aria-label={label}><span>{children}</span><Eye size={17} /></button>;
}
