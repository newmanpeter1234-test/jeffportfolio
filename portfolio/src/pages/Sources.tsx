import { ArrowUpRight, FileText, ShieldCheck } from 'lucide-react';
import { PageIntro, SectionLabel } from '../components/UI';
import { DocumentButton, documents } from '../components/DocumentViewer';
import type { DocumentId } from '../components/DocumentViewer';

const sources = [
  { title: 'Original live portfolio', url: 'https://www.jeffsec.in', note: 'Original project listings, technical interests, contact channels, and self-reported skill levels. Current location and documents on this redesign follow the latest material supplied directly by Jefrine.' },
  { title: 'Public GitHub repositories', url: 'https://github.com/jeff-1217', note: 'All 26 researched public repositories are indexed. Case studies link to their README files, reports, and implementations; the inventory is not a live GitHub feed.' },
];
export function Sources() {
  return <><PageIntro number="06" label="CONTENT PROVENANCE" title={<>Real details.<br /><span className="mint">Traceable sources.</span></>} description="Original documents, public project evidence, and explicit boundaries. The current location is Doha, Qatar, as confirmed by Jefrine." />
    <section className="sources-page container">
      <SectionLabel>DOCUMENTS SUPPLIED BY JEFRINE / 22 OCTOBER 2026</SectionLabel>
      <div className="source-document-grid">{documents.map(document => <article className="source-document-card" key={document.id} data-reveal><span className="mono">ORIGINAL PDF / PREVIEW FIRST</span><h2>{document.title}</h2><p>{document.issuer}{'issued' in document ? ` · Issued ${document.issued}` : ''}</p><DocumentButton documentId={document.id as DocumentId} kind="text">View {document.label}</DocumentButton></article>)}</div>
      <SectionLabel>PROJECT RESEARCH / 14 OCTOBER 2026</SectionLabel>
      <div className="source-cards">{sources.map(source => <a key={source.url} href={source.url} target="_blank" rel="noopener noreferrer" data-reveal><FileText size={22} /><div><h2>{source.title}</h2><p>{source.note}</p><span>{source.url}</span></div><ArrowUpRight size={21} /></a>)}</div>
      <div className="source-policy" data-reveal><ShieldCheck size={24} /><div><h2>What is—and isn’t—claimed.</h2><ul>
        <li>The updated Qatar résumé replaces the previous résumé. All four supplied PDFs are preserved byte-for-byte. Previews are visual renderings of those originals; download is optional inside the viewer.</li>
        <li>The current location is Doha, Qatar, with Qatar local time (AST / UTC +03:00). Kochi and Bengaluru remain only where they describe historical work, training, or education.</li>
        <li>The Wahy Lab Solutions experience letter confirms the Junior Cyber Security Analyst role from 1 September 2025 to 29 May 2026. Responsibilities on the timeline follow the updated résumé.</li>
        <li>CSA and CICSA are earned qualifications with original certificates. Their issue dates follow those certificates, not the older résumé. No independent issuer validation or invented verification URL is claimed.</li>
        <li>CompTIA Security+ was listed as pursuing in the earlier résumé; it is not included in the new résumé and is not presented as an earned credential.</li>
        <li>The globe, conceptual project graphics, and investigation console are illustrative. They are not live security data, real incidents, or production detection results.</li>
        <li>ASTRA is a simulation. The SOC assistant’s documented CrewAI design and current direct Python implementation are distinguished.</li>
        <li>External project links preserve their researched destinations; an “Original demo” link does not guarantee current uptime.</li>
        <li>The IOC pipeline’s approximately 80% effort reduction is an author-reported README estimate, not an independently measured portfolio-wide result.</li>
        <li>No invented incident counts, clients, detection accuracy, response-time metrics, or employment history are used.</li>
      </ul></div></div>
    </section></>;
}
