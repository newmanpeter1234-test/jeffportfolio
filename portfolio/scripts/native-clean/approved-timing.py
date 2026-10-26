"""Recover the already-approved motion-sensitive pacing without importing any repaired pixels."""
from pathlib import Path
import json,cv2,numpy as np,hashlib
ROOT=Path(__file__).resolve().parents[2];old=json.loads((ROOT/'scripts/native-clean/pacing-source.json').read_text());source=ROOT/old['source']
assert hashlib.sha256(source.read_bytes()).hexdigest()==old['sourceSha256']
start,end=[round(t*30)for t in old['sourceRange']];cap=cv2.VideoCapture(str(source));cap.set(cv2.CAP_PROP_POS_FRAMES,start)
e=[];previous=None
for i in range(start,end):
 ok,im=cap.read();assert ok
 g=cv2.resize(cv2.cvtColor(im,cv2.COLOR_BGR2GRAY),(160,90));e.append(float(np.mean(cv2.absdiff(g,previous)))if previous is not None else 0);previous=g
cap.release();e=np.array(e);kernel=np.exp(-np.linspace(-3,3,37)**2/2);kernel/=kernel.sum();energy=np.convolve(np.pad(e,(18,18),mode='edge'),kernel,mode='valid');speed=1.35+.6*np.clip(energy/7,0,1)
xs=np.arange(len(e)+1)/30;ys=np.r_[0,np.cumsum(1/(30*speed))];ys*=18.6/ys[-1]
source_times=(old['sourceRange'][0]+np.interp(np.arange(1116)/60,ys,xs)).tolist()
out={'sourceSha256':old['sourceSha256'],'duration':18,'baseDuration':18.6,'overlap':.6,'fps':60,'width':1920,'height':1080,'sourceRange':old['sourceRange'],'method':'Same approved timing map; original camera state evaluated directly at every native frame. No repaired-video input.','sourceTimes':source_times}
(ROOT/'scripts/native-clean/timing.json').write_text(json.dumps(out,separators=(',',':'))+'\n');print('Timing recovered:',len(source_times),'native frames, source',source_times[0],source_times[-1])
