"""Original UI capture only. No monitoring, scans, secrets or API-backed results."""
from pathlib import Path
import importlib.util
from flask import Response, send_from_directory
from jinja2 import Environment, FileSystemLoader
ROOT=Path(__file__).resolve().parents[2]
spec=importlib.util.spec_from_file_location('original_capture_lab',ROOT/'scripts/showreel/capture-lab.py')
base=importlib.util.module_from_spec(spec);spec.loader.exec_module(base);app=base.app
ASTRA=ROOT/'.cache/native-clean/astra'
@app.route('/astra-static/<path:name>')
def astra_static(name):
    if name in ['globe.js','globe3d.js','threatRadar3d.js']:return Response('/* Offscreen 3D omitted from the capture. */',mimetype='text/javascript')
    if name=='main.js':
        script=(ASTRA/'static/main.js').read_text().replace('        startMonitoring();','        /* Capture-only: do not start monitoring or submit control requests. */')
        return Response(script,mimetype='text/javascript')
    return send_from_directory(ASTRA/'static',name)
@app.route('/astra')
def astra():
    env=Environment(loader=FileSystemLoader(ASTRA/'templates'),autoescape=True)
    return Response(env.get_template('index.html').render(url_for=lambda endpoint,filename:'/astra-static/'+filename),mimetype='text/html')
if __name__=='__main__':app.run(host='0.0.0.0',port=5052,debug=False)
