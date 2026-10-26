import { ShieldAlert } from 'lucide-react';
import { ButtonLink, SectionLabel } from '../components/UI';
export function NotFound(){return <section className="not-found container"><SectionLabel>404 / SIGNAL LOST</SectionLabel><ShieldAlert size={52} strokeWidth={1}/><h1>This route is<br/><span className="mint">off the radar.</span></h1><p>The page you’re looking for isn’t in this dossier. Let’s get you back to a known signal.</p><ButtonLink to="/">Return to overview</ButtonLink></section>;}
