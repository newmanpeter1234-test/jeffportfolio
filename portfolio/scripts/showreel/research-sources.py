"""Fetch only public, explicitly named evidence; never credential/environment files."""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
from urllib.request import urlopen
from urllib.parse import quote
import hashlib, json, subprocess
ROOT=Path(__file__).resolve().parents[2]
DEST=ROOT/'.cache/showreel/sources'
SOURCES={
 'ASTRA-Monitor':['README.md','app.py','templates/index.html','static/main.js'],
 'SOC-Threat-Detection-Assistant':['README.md','soc_agent.py','images/Screenshot-2025-10-17-at-12.02.08-PM.jpg'],
 '-soc-agent-streamlit':['soc-agent-streamlit/app.py'],
 'splunk-soc-lab':['README.md','queries/splunk-searches.md','screenshots/splunk-dashboard.png','screenshots/failed-logins.png','screenshots/monitoring-overview.png','reports/Jefrin_Final_SOC_Report.pdf'],
 'wazuh-siem-lab':['README.md','screenshots/wazuh-dashboard.png','screenshots/threat-hunting.png','screenshots/agent-summary.png','report/PROJECT_ON_WAZUH.pdf'],
 'wireshark-network-traffic-analysis':['README.md','images/PHOTO-2025-10-27-21-11-29.jpg','Wireshark_Network_Traffic_Analysis_Report.pdf'],
 'URL-Phishing-Detector2':['README.md','app.py','lexical.py','templates/index.html','static/bg.jpg'],
 'web-vuln-scanner':['app.py','scanner.py','templates/index.html'],
 'password_strength_checker':['index.html'],
}
def fetch_project(item):
 repo,files=item
 pins=json.loads((ROOT/'scripts/showreel/source-pins.json').read_text()) if (ROOT/'scripts/showreel/source-pins.json').exists() else {}
 commit=pins.get(repo,{}).get('commit') or subprocess.check_output(['git','ls-remote',f'https://github.com/jeff-1217/{repo}.git','refs/heads/main'],text=True).split()[0]
 results=[]
 for name in files:
  url=f'https://raw.githubusercontent.com/jeff-1217/{repo}/{commit}/{quote(name,safe="/")}'
  try:
   data=urlopen(url,timeout=30).read();p=DEST/repo/name;p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(data)
   results.append({'path':name,'url':url,'sha256':hashlib.sha256(data).hexdigest(),'bytes':len(data)})
  except Exception as exc:results.append({'path':name,'unavailable':type(exc).__name__})
 return repo,{'commit':commit,'files':results}
if __name__=='__main__':
 with ThreadPoolExecutor(max_workers=5)as pool:manifest=dict(pool.map(fetch_project,SOURCES.items()))
 DEST.mkdir(parents=True,exist_ok=True);(DEST/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
 print(json.dumps({repo:{'commit':x['commit'],'files':len(x['files']),'unavailable':[f['path']for f in x['files']if 'unavailable'in f]}for repo,x in manifest.items()},indent=2))
