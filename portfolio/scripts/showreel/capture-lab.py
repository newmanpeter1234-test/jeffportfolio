"""Capture-only original frontend templates. All submission routes are disabled."""
from pathlib import Path
from flask import Flask, Response, abort, send_from_directory
from jinja2 import Environment, FileSystemLoader
ROOT=Path(__file__).resolve().parents[2]
SOURCE=ROOT/'.cache/showreel/sources'
VENDOR=ROOT/'.cache/showreel/vendor'
app=Flask(__name__,static_folder=None)
@app.route('/vendor/<name>')
def vendor(name): return send_from_directory(VENDOR,name)
@app.route('/source/<project>/static/<path:name>')
def static_asset(project,name):
    folders={'url':'URL-Phishing-Detector2','scanner':'web-vuln-scanner'}
    if project not in folders: abort(404)
    path=SOURCE/folders[project]/'static'
    if not (path/name).is_file(): return Response('',status=204)
    return send_from_directory(path,name)
@app.route('/<project>')
def interface(project):
    if project=='passchecker':
        return Response((SOURCE/'password_strength_checker/index.html').read_text(),mimetype='text/html')
    folders={'url':'URL-Phishing-Detector2','scanner':'web-vuln-scanner'}
    if project not in folders: abort(404)
    env=Environment(loader=FileSystemLoader(SOURCE/folders[project]/'templates'),autoescape=True)
    html=env.get_template('index.html').render(result=None,url_for=lambda endpoint,filename:f'/source/{project}/static/{filename}')
    html=html.replace("url('/static/bg.jpg')","url('/source/url/static/bg.jpg')")
    html=html.replace('https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css','/vendor/bootstrap-5.3.0.css').replace('https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css','/vendor/tailwind-2.2.19.css')
    # Bootstrap's optional JS is unnecessary for an unsubmitted form.
    html=html.replace('https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js','/source/url/static/not-used.js')
    return Response(html,mimetype='text/html')
@app.route('/scan',methods=['GET','POST'])
def disabled(): return Response('Capture environment: scans and API submissions are disabled.',status=405)
if __name__=='__main__': app.run(host='0.0.0.0',port=5052,debug=False)
