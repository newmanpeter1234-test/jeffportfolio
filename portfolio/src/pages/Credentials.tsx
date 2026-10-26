import { BookOpen, FileText } from 'lucide-react';
import { certifications } from '../data/content';
import { PageIntro, SectionLabel, ResumeLink, TextLink } from '../components/UI';
import { DocumentButton, getDocument } from '../components/DocumentViewer';
import { asset } from '../hooks/useExperience';

export function Credentials() {
  return <>
    <PageIntro number="04" label="CREDENTIALS & CONTINUOUS LEARNING" title={<>Practice first.<br /><span className="mint">Credentials to match.</span></>} description="Two earned qualifications. Original certificates and professional experience—open a preview, inspect the details, and save a PDF only if you choose." />
    <section className="credentials-page container">
      <div className="credentials-list">
        {certifications.filter(c => c.status === 'Earned').map((credential, index) => {
          const id = credential.id === 'csa' ? 'csa' : 'cicsa';
          const document = getDocument(id);
          return <article className="credential-full-card" key={credential.id} id={credential.id} data-reveal>
            <div className="credential-full-symbol"><div className="credential-document-cover"><img src={asset(document.thumbnail)} alt={`Original ${credential.acronym} certificate thumbnail`} loading="lazy" width="600" height="430" /><span>ORIGINAL CERTIFICATE / {credential.acronym}</span></div><span className="mono">QUALIFICATION / 0{index + 1}</span></div>
            <div className="credential-full-content">
              <div className="credential-full-top"><span>{credential.issuer.toUpperCase()}</span><span className="earned-status"><span className="status-dot" />EARNED</span></div>
              <h2>{credential.title}</h2><p>{credential.description}</p>
              <div className="credential-topics">{credential.topics.map(topic => <span key={topic}>{topic}</span>)}</div>
              <div className="credential-full-bottom"><span>Issued {document.issued}</span><DocumentButton documentId={id} kind="text" label={`View ${credential.acronym} certificate`}>View my certificate</DocumentButton></div>
            </div>
          </article>;
        })}
      </div>
      <article className="experience-document-card" id="experience-certificate" data-reveal>
        <FileText size={33} strokeWidth={1.1} /><div><span className="mono">PROFESSIONAL EXPERIENCE / ORIGINAL LETTER</span><h2>Experience, on record.</h2><p>Junior Cyber Security Analyst · Wahy Lab Solutions<br />1 September 2025 – 29 May 2026. Original signed experience certificate.</p></div><DocumentButton documentId="experience" kind="secondary">View my experience</DocumentButton>
      </article>
      <article className="pursuing-card" id="security-plus" data-reveal><BookOpen size={31} strokeWidth={1} /><div><span className="mono">CONTINUOUS LEARNING / NOT AN EARNED CREDENTIAL</span><h2>CompTIA Security+</h2><p>Previously listed as pursuing in the earlier résumé. Not yet an earned qualification; kept separate from the two certificates above.</p></div><span className="pursuing-badge">LEARNING GOAL</span></article>
      <div className="credential-transparency" data-reveal><SectionLabel>ORIGINAL DOCUMENTS. CLEAR PROVENANCE.</SectionLabel><p>The certificate previews are generated directly from Jefrine’s supplied PDFs. Issue dates follow the documents themselves: EC-Council CSA, 27 July 2025; CICSA v3, 11 July 2025. The original files are preserved unchanged. Document display is not a claim of independent issuer verification.</p><ResumeLink kind="secondary" /></div>
      <div className="credential-page-link" data-reveal><span>Qualifications are a foundation. The projects show the practice.</span><TextLink to="/projects">Explore the project dossier</TextLink></div>
    </section>
  </>;
}
