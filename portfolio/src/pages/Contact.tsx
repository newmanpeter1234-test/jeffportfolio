import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { ArrowUpRight, Mail, Github, Linkedin, MapPin, Check, ShieldCheck, LoaderCircle } from 'lucide-react';
import { profile } from '../data/content';
import { PageIntro, ResumeLink, SectionLabel, CopyEmail } from '../components/UI';
import '../contact.css';

const endpoint = `https://formsubmit.co/ajax/${profile.email}`;
const liveContact = 'https://jefrine-correya-portfolio.vercel.app/contact';
type SendState = { kind: 'idle' | 'sending' | 'success' | 'error'; message?: string };

export function Contact() {
  const [intent, setIntent] = useState('SOC opportunity');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<SendState>({ kind: 'idle' });
  const pending = useRef(false);
  const sending = status.kind === 'sending';
  const offline = Boolean(window.__OFFLINE_PREVIEW__);
  const intents = ['SOC opportunity', 'Project collaboration', 'Say hello'];

  function clearNotice() {
    if (!pending.current) setStatus({ kind: 'idle' });
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending.current) return;
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    if (!name.trim() || !message.trim()) {
      setStatus({ kind: 'error', message: 'Please enter your name and a message, not just spaces.' });
      return;
    }
    if (offline) {
      setStatus({ kind: 'error', message: 'This is the offline preview. Open the live contact page to send your message.' });
      return;
    }
    const honey = String(new FormData(form).get('company_website') || '');
    if (honey) {
      setStatus({ kind: 'error', message: 'This submission could not be accepted. Please use the direct email link instead.' });
      return;
    }

    pending.current = true;
    setStatus({ kind: 'sending' });
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        credentials: 'omit',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
          interest: intent,
          _subject: `Portfolio · ${intent} — ${name.trim()}`,
          _template: 'table',
          _honey: '',
        }),
      });
      const result: unknown = await response.json();
      const data = result && typeof result === 'object' ? result as Record<string, unknown> : {};
      const providerMessage = typeof data.message === 'string' ? data.message : '';
      if (/activat|verif|confirm.{0,30}(email|form)/i.test(providerMessage)) {
        setStatus({ kind: 'error', message: 'Email delivery is awaiting one-time activation. Please email me directly for now. Your message is still here.' });
        return;
      }
      if (response.status === 429) {
        setStatus({ kind: 'error', message: 'Too many attempts. Please wait a few minutes before trying again, or email me directly.' });
        return;
      }
      if (!response.ok || (data.success !== true && data.success !== 'true')) {
        throw new Error('The email service did not confirm this submission.');
      }
      setStatus({ kind: 'success', message: 'Message sent. Thank you for getting in touch — I’ll reply to the email address you provided.' });
      setName('');
      setEmail('');
      setMessage('');
    } catch {
      setStatus({ kind: 'error', message: 'We couldn’t confirm the send. Your message is still here. Check your connection before trying again, or email me directly.' });
    } finally {
      window.clearTimeout(timer);
      pending.current = false;
    }
  }

  return <>
    <PageIntro number="05" label="ESTABLISH A CONNECTION" title={<>A good conversation.<br/><span className="mint">A stronger next move.</span></>} description="Have a SOC opportunity, a security project, or a question worth exploring? Let’s connect." />
    <section className="contact-page container">
      <div className="contact-details" data-reveal>
        <SectionLabel>DIRECT CHANNELS</SectionLabel>
        <a className="contact-email-big" href={`mailto:${profile.email}`}>{profile.email}<ArrowUpRight size={25} /></a>
        <CopyEmail />
        <div className="contact-channel-links">
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer"><Linkedin size={19} /><span>LinkedIn<span>Connect professionally</span></span><ArrowUpRight size={20} /></a>
          <a href={profile.github} target="_blank" rel="noopener noreferrer"><Github size={19} /><span>GitHub<span>Explore the source</span></span><ArrowUpRight size={20} /></a>
        </div>
        <div className="contact-location"><MapPin size={17} /><div>{profile.location}<span>Qatar · AST / UTC +03:00</span></div></div>
        <ResumeLink kind="secondary" />
      </div>
      <div className="contact-form-panel" data-reveal>
        <div className="contact-form-header"><Mail size={18} /><span>SEND A MESSAGE</span><span className="status-dot" /></div>
        <form onSubmit={submit} aria-busy={sending}>
          <fieldset className="contact-intent" disabled={sending}>
            <legend>What brings you here?</legend>
            <div>{intents.map(item => <button type="button" key={item} aria-pressed={intent === item} className={intent === item ? 'active' : ''} onClick={() => { setIntent(item); clearNotice(); }}>{intent === item && <Check size={12} />} {item}</button>)}</div>
          </fieldset>
          <div className="form-field-pair">
            <div><label htmlFor="contact-name">Your name</label><input id="contact-name" name="name" autoComplete="name" placeholder="Alex Morgan" value={name} onChange={event => { setName(event.target.value); clearNotice(); }} required maxLength={100} disabled={sending} /></div>
            <div><label htmlFor="contact-email">Email address</label><input id="contact-email" name="email" type="email" autoComplete="email" placeholder="you@company.com" value={email} onChange={event => { setEmail(event.target.value); clearNotice(); }} required maxLength={200} disabled={sending} /></div>
          </div>
          <label htmlFor="contact-message">Your message</label><textarea id="contact-message" name="message" rows={5} placeholder="Tell me a little about the opportunity or idea…" value={message} onChange={event => { setMessage(event.target.value); clearNotice(); }} required maxLength={5000} disabled={sending} />
          <div className="contact-honeypot" aria-hidden="true"><label>Website (leave empty)<input name="company_website" type="text" tabIndex={-1} autoComplete="off" /></label></div>
          <div className="form-privacy"><ShieldCheck size={14} /><p>Your name, email, and message are processed by <a href="https://formsubmit.co/documentation" target="_blank" rel="noopener noreferrer">FormSubmit</a> for delivery to my inbox. Please don’t include sensitive information.</p></div>
          <button className="button button-primary form-submit" type="submit" disabled={sending}>{sending ? <>Sending…<LoaderCircle className="contact-send-spinner" size={17} aria-hidden="true" /></> : <>Send mail<ArrowUpRight size={17} /></>}</button>
          {status.kind === 'sending' && <p className="contact-sending-note" role="status">Sending your message…</p>}
          {(status.kind === 'success' || status.kind === 'error') && <div className={`contact-send-status ${status.kind}`} role={status.kind === 'error' ? 'alert' : 'status'}>
            <p>{status.message}</p>
            {status.kind === 'error' && <a href={offline ? liveContact : `mailto:${profile.email}`}>{offline ? 'Open the live contact page' : 'Email Jefrine directly'}<ArrowUpRight size={13} /></a>}
          </div>}
        </form>
      </div>
    </section>
  </>;
}
