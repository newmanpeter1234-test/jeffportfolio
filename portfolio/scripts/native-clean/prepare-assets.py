"""Lossless high-density captures and original report pixels, not AI sharpening/upscaled video."""
from pathlib import Path
from PIL import Image,ImageDraw
import pymupdf as fitz
import io,json,hashlib
ROOT=Path(__file__).resolve().parents[2];DEST=ROOT/'scripts/native-clean/assets';DEST.mkdir(parents=True,exist_ok=True)
SOURCE=ROOT/'.cache/showreel/sources';CAP=ROOT/'.cache/native-clean/captures';entries={}
def save(name,im,source,note):
 im=im.convert('RGB');file=DEST/(name+'.webp');im.save(file,lossless=True,method=6)
 entries[name]={'file':file.name,'width':im.width,'height':im.height,'bytes':file.stat().st_size,'sha256':hashlib.sha256(file.read_bytes()).hexdigest(),'source':source,'note':note}
for name in ['astra','astra-detail','url','scanner','passchecker','soc']:
 im=Image.open(CAP/(name+'.png'))
 save(name,im,'Pinned original implementation / fresh browser capture', '3× device pixel ratio, original input form; no lookup'if name=='url' else '2× device pixel ratio, original UI; no live API/monitoring/scan results')
def embedded(path,page,index):
 d=fitz.open(path);data=d.extract_image(d[page-1].get_images(full=True)[index][0]);return Image.open(io.BytesIO(data['image']))
save('splunk',embedded(SOURCE/'splunk-soc-lab/reports/Jefrin_Final_SOC_Report.pdf',11,0).crop((114,180,1080,606)),'Original report, p11','Original raster retained losslessly. Its fine-text resolution is source-limited; no fabricated replacement dashboard.')
save('wazuh',embedded(SOURCE/'wazuh-siem-lab/report/PROJECT_ON_WAZUH.pdf',19,0),'Original Wazuh report, p19','Original embedded screenshot retained losslessly; no extra duplicate detail panel.')
im=Image.open(SOURCE/'wireshark-network-traffic-analysis/images/PHOTO-2025-10-27-21-11-29.jpg').convert('RGB');sx=im.width/1568;sy=im.height/983
im=im.crop((0,0,im.width,round(716*sy)));draw=ImageDraw.Draw(im)
for rect in [(136,47,414,716),(550,333,1568,353),(550,674,1568,697)]:draw.rectangle(tuple(round(x*(sx if i%2==0 else sy))for i,x in enumerate(rect)),fill='#172023')
save('wireshark',im,'Original published Wireshark capture','Native screenshot pixels retained; addresses/SNI redacted at native coordinates; payload/MAC/SSID panes omitted. No new packet capture.')
(DEST/'provenance.json').write_text(json.dumps(entries,indent=2)+'\n');print(json.dumps(entries,indent=2))
