"""Generate browser-independent document previews. Requires PyMuPDF and Pillow.
Run from the project root after replacing the original PDFs in public/documents.
Original PDFs are never rewritten. Preview filenames include the PDF SHA256.
"""
from pathlib import Path
import hashlib, io, json
import pymupdf
from PIL import Image

root = Path(__file__).resolve().parent.parent
items = [
    {'id':'resume','label':'Résumé','title':'Jefrine Correya — Résumé','issuer':'SOC & Security Platform Engineer','pdf':'/documents/jefrine-correya-resume.pdf','downloadName':'Jefrine-Correya-Resume.pdf','category':'PROFESSIONAL PROFILE'},
    {'id':'cicsa','label':'CICSA','title':'CICSA certificate','issuer':'RedTeam Hacker Academy · CICSA v3','pdf':'/documents/jefrine-cicsa-certificate.pdf','downloadName':'Jefrine-Correya-CICSA-Certificate.pdf','category':'EARNED QUALIFICATION','issued':'11 July 2025','summary':'Jefrine Correya completed the Certified IT Infrastructure & Cyber SOC Analyst (CICSA v3) certification program at RedTeam Hacker Academy. Date: 11 July 2025. Certificate ID: RTXSTU1602013971. The certificate covers IT infrastructure technologies, network and offensive security, Cyber SOC, and patch and vulnerability management. This readable summary accompanies the original scanned certificate.'},
    {'id':'csa','label':'EC-Council CSA','title':'EC-Council CSA certificate','issuer':'EC-Council · Certified SOC Analyst','pdf':'/documents/jefrine-ec-council-csa-certificate.pdf','downloadName':'Jefrine-Correya-EC-Council-CSA-Certificate.pdf','category':'EARNED QUALIFICATION','issued':'27 July 2025'},
    {'id':'experience','label':'Experience','title':'Experience certificate','issuer':'Wahy Lab Solutions · Junior Cyber Security Analyst','pdf':'/documents/jefrine-experience-certificate.pdf','downloadName':'Jefrine-Correya-Experience-Certificate.pdf','category':'PROFESSIONAL EXPERIENCE','issued':'29 May 2026','summary':'Wahy Lab Solutions certifies that Mr. Jefrine Correya worked as Junior Cyber Security Analyst from 1 September 2025 to 29 May 2026. The letter is dated 29 May 2026, Padamugal, and is signed by Anita Joseph, HR Manager. It states that his work was satisfactory and recognises his sincerity, dedication, and hard work. This readable summary accompanies the original scanned letter.'},
]
for item in items:
    pdf = root / ('public' + item['pdf'])
    item['sha256'] = hashlib.sha256(pdf.read_bytes()).hexdigest()
    item['bytes'] = pdf.stat().st_size
    item['pages'] = []
    with pymupdf.open(pdf) as doc:
        for index, page in enumerate(doc):
            pix = page.get_pixmap(matrix=pymupdf.Matrix(2.5,2.5), alpha=False)
            image = Image.frombytes('RGB', [pix.width,pix.height], pix.samples)
            name = f"document-{item['id']}-{item['sha256'][:8]}-p{index+1}.webp"
            image.save(root/'public/images'/name,'WEBP',quality=92,method=6)
            item['pages'].append({'image':'/images/'+name,'width':pix.width,'height':pix.height})
            if index == 0:
                thumb = image.copy();thumb.thumbnail((600,600))
                name = f"document-{item['id']}-{item['sha256'][:8]}-thumb.webp"
                thumb.save(root/'public/images'/name,'WEBP',quality=85,method=6)
                item['thumbnail'] = '/images/'+name
        item['text'] = '\n\n'.join(page.get_text().strip() for page in doc).strip() or item.pop('summary','')
        item.pop('summary',None)
(root/'src/data/documents.json').write_text(json.dumps(items,ensure_ascii=False,indent=2)+'\n')
print('Prepared '+str(len(items))+' original documents and '+str(sum(len(d['pages']) for d in items))+' high-resolution preview pages.')
for item in items: print(item['id'],item['sha256'],item['pages'][0]['image'])
