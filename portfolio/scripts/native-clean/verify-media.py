from pathlib import Path
import json,subprocess,hashlib,cv2,numpy as np
ROOT=Path(__file__).resolve().parents[2];DIR=ROOT/'.cache/native-clean/encoded-qc';DIR.mkdir(parents=True,exist_ok=True)
p=ROOT/'public/media/cybersecurity-native-glass-1080p60.mp4'
meta=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(p)],text=True));v=next(s for s in meta['streams']if s['codec_type']=='video')
assert (v['width'],v['height'],v['avg_frame_rate'],v['codec_name'],v['pix_fmt'])==(1920,1080,'60/1','h264','yuv420p')
assert int(v['nb_frames'])==1080 and abs(float(meta['format']['duration'])-18)<.02
assert not any(s['codec_type']=='audio'for s in meta['streams'])
data=p.read_bytes();assert data.find(b'moov')<data.find(b'mdat')
cap=cv2.VideoCapture(str(p));count=0;first=None;previous=None;last=None;minimum=255;deltas=[]
while True:
 ok,frame=cap.read()
 if not ok:break
 small=cv2.resize(frame,(160,90),interpolation=cv2.INTER_AREA);mean=float(small.mean());assert mean>1,('Blank frame',count)
 minimum=min(minimum,mean)
 if first is None:first=small.copy()
 if previous is not None:deltas.append(float(np.abs(small.astype(float)-previous.astype(float)).mean()))
 if count%30==0:cv2.imwrite(str(DIR/f'frame-{count:04d}.jpg'),cv2.resize(frame,(960,540)),[cv2.IMWRITE_JPEG_QUALITY,97])
 previous=small;last=small;count+=1
cap.release();assert count==1080
seam=float(np.abs(first.astype(float)-last.astype(float)).mean());assert seam<3,('Loop discontinuity',seam)
report=json.loads((ROOT/'.cache/native-clean/render-report.json').read_text());assert report['maxCameraPositionDeviation']<1e-9 and report['maxCameraTargetDeviation']<1e-9
assert report['editorialCards']==0 and report['numberPlanes']==0 and report['titlePlanes']==0
out={'duration':18,'width':1920,'height':1080,'fps':60,'decodedFrames':count,'blankFrames':0,'audioStreams':0,'codec':'H.264','profile':v['profile'],'colorSpace':v.get('color_space'),'faststart':True,'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest(),'minimumFrameMean':minimum,'maximumAdjacentFrameDifference':max(deltas),'loopSeamMeanAbsoluteRGBDifferenceAt160x90':seam,'nativeRender':True,'spatialUpscaling':False,'opticalFlowInterpolation':False,'inpainting':False,'editorialCards':0,'titlePlanes':0,'numberPlanes':0,'cameraPositionDeviation':report['maxCameraPositionDeviation'],'cameraTargetDeviation':report['maxCameraTargetDeviation'],'encodedReviewSamples':36}
(DIR/'report.json').write_text(json.dumps(out,indent=2)+'\n');print(json.dumps(out,indent=2))
