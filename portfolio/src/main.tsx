import { createRoot } from 'react-dom/client';
import { BrowserRouter, HashRouter, MemoryRouter } from 'react-router-dom';
import { App } from './App';
import { ExperienceProvider } from './hooks/useExperience';
import { DocumentProvider } from './components/DocumentViewer';
import './styles.css';
import './document-viewer.css';

// A sandboxed file viewer has an opaque origin: memory navigation avoids History API restrictions.
const Router = window.__OFFLINE_PREVIEW__ ? MemoryRouter : window.location.protocol === 'file:' ? HashRouter : BrowserRouter;
createRoot(document.getElementById('root')!).render(<Router><ExperienceProvider><DocumentProvider><App /></DocumentProvider></ExperienceProvider></Router>);
