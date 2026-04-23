#!/usr/bin/env python3
"""Render assembly STEP/GLB thumbnails via Online 3D Viewer in headless Chromium.
Usage: python3 assembly-screenshot.py <model-file> <output.png>
"""
import sys, threading
from http.server import HTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
from playwright.sync_api import sync_playwright

model = Path(sys.argv[1]).resolve()
output = sys.argv[2]

ENV_BASE = "https://cdn.jsdelivr.net/npm/online-3d-viewer@0.18.0/build/website/assets/envmaps/fishermans_bastion/"
ENV_MAP = ",".join(ENV_BASE + f for f in ["posx.jpg","negx.jpg","posy.jpg","negy.jpg","posz.jpg","negz.jpg"])

HTML = f"""<!DOCTYPE html><html><head>
<script src="https://cdn.jsdelivr.net/npm/online-3d-viewer@0.18.0/build/engine/o3dv.min.js"></script>
<style>body{{margin:0;overflow:hidden}} .online_3d_viewer{{width:2560px;height:1440px}}</style>
</head><body>
<div class="online_3d_viewer" model="http://localhost:8765/{model.name}"
     edgesettings="on,40,40,40,1" backgroundcolor="255,255,255,0"
     environmentmap="{ENV_MAP}"></div>
<script>window.addEventListener('load',function(){{OV.Init3DViewerElements();setTimeout(function(){{document.title="ready"}},45000)}});</script>
</body></html>"""

class Handler(SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/":
            self.send_response(200)
            self.send_header("Content-Type", "text/html")
            self.end_headers()
            self.wfile.write(HTML.encode())
        else:
            self.send_response(200)
            self.send_header("Content-Type", "application/octet-stream")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(model.read_bytes())
    def log_message(self, *a): pass

server = HTTPServer(("", 8765), Handler)
threading.Thread(target=server.serve_forever, daemon=True).start()

with sync_playwright() as p:
    browser = p.chromium.launch(args=["--no-sandbox"])
    page = browser.new_page(viewport={"width": 2560, "height": 1440})
    page.goto("http://localhost:8765/", wait_until="networkidle")
    page.wait_for_function("document.title === 'ready'", timeout=60000)
    page.wait_for_timeout(3000)
    page.screenshot(path=output, type="png", omit_background=True)
    print(f"Saved {output}")
    browser.close()

server.shutdown()
