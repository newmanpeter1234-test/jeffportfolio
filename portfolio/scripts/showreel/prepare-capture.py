"""Prepare the public, pinned capture lab; never load dotenv or API secrets."""
from pathlib import Path
from urllib.request import urlopen
import subprocess, sys
ROOT=Path(__file__).resolve().parents[2]
subprocess.run([sys.executable,str(ROOT/'scripts/showreel/research-sources.py')],cwd=ROOT,check=True)
cache=ROOT/'.cache/showreel';vendor=cache/'vendor';vendor.mkdir(parents=True,exist_ok=True)
for name,url in [('bootstrap-5.3.0.css','https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css'),('tailwind-2.2.19.css','https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css')]:
    (vendor/name).write_bytes(urlopen(url,timeout=30).read())
source=(cache/'sources/-soc-agent-streamlit/soc-agent-streamlit/app.py').read_text().replace('load_dotenv()','# Environment files intentionally not opened in this capture lab.')
prefix='''# Capture-only configuration, not a product feature.\nimport os\nfor name in ['ABUSEIPDB_API_KEY','VIRUSTOTAL_API_KEY','GROQ_API_KEY']:\n    os.environ.pop(name, None)\nimport requests\ndef no_external_lookups(*args, **kwargs):\n    raise RuntimeError('External API lookups are disabled in the capture lab')\nrequests.get = no_external_lookups\nrequests.post = no_external_lookups\n'''
(cache/'soc-capture.py').write_text(prefix+source)
print('Pinned source, local styles and API-disabled SOC capture entry prepared. No credential files opened.')
