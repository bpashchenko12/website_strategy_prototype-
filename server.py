#!/usr/bin/env python3
"""Tiny static server + shared comments API for the XMTrading strategy prototype.

    python3 server.py            # http://localhost:8000
    python3 server.py 9000       # custom port

Share the URL on your network (or expose it through a tunnel) so the CEO and other
stakeholders vote and comment into the same file: data/state.json
"""
import json, os, sys, threading, time, uuid, socket
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from urllib.parse import urlparse

ROOT = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(ROOT, 'data', 'state.json')
LOCK = threading.Lock()
ALLOWED_TOP = {'index.html', 'comments.html', 'assets', 'ideas', 'favicon.ico'}


def load():
    try:
        with open(DATA, encoding='utf8') as f:
            s = json.load(f)
    except Exception:
        s = {}
    s.setdefault('votes', {})
    s.setdefault('comments', [])
    return s


def save(s):
    os.makedirs(os.path.dirname(DATA), exist_ok=True)
    tmp = DATA + '.tmp'
    with open(tmp, 'w', encoding='utf8') as f:
        json.dump(s, f, ensure_ascii=False, indent=1)
    os.replace(tmp, DATA)


def apply(s, op):
    t = op.get('type')
    if t == 'add_comment':
        c = op['comment']
        c['id'] = c.get('id') or 'c' + uuid.uuid4().hex[:10]
        c['ts'] = c.get('ts') or int(time.time() * 1000)
        c['resolved'] = False
        c['text'] = str(c.get('text', ''))[:4000]
        s['comments'].append(c)
    elif t == 'toggle_vote':
        v = s['votes'].setdefault(op['idea'], {})
        uid = op['user']['id']
        if uid in v:
            del v[uid]
        else:
            v[uid] = {'name': op['user'].get('name', ''), 'role': op['user'].get('role', ''), 'ts': int(time.time() * 1000)}
    elif t == 'resolve':
        for c in s['comments']:
            if c['id'] == op['id']:
                c['resolved'] = bool(op.get('value'))
    elif t == 'delete':
        ids = {op['id']}
        for c in s['comments']:
            if c.get('parent') in ids:
                ids.add(c['id'])
        s['comments'] = [c for c in s['comments'] if c['id'] not in ids]
    elif t == 'seed':
        s['comments'] += op.get('comments', [])
        for k, v in (op.get('votes') or {}).items():
            s['votes'].setdefault(k, {}).update(v)
    elif t == 'reset':
        s['votes'], s['comments'] = {}, []
    return s


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=ROOT, **kw)

    def log_message(self, fmt, *args):
        pass

    def _json(self, obj, code=200):
        body = json.dumps(obj, ensure_ascii=False).encode('utf8')
        self.send_response(code)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.send_header('Cache-Control', 'no-store')
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        path = urlparse(self.path).path
        if path == '/api/state':
            with LOCK:
                return self._json(load())
        top = path.lstrip('/').split('/')[0]
        if top and top not in ALLOWED_TOP:
            self.send_error(404)
            return
        if path == '/':
            self.path = '/index.html'
        return super().do_GET()

    def do_POST(self):
        if urlparse(self.path).path != '/api/op':
            self.send_error(404)
            return
        try:
            n = int(self.headers.get('Content-Length', 0))
            op = json.loads(self.rfile.read(n) or b'{}')
        except Exception:
            return self._json({'error': 'bad request'}, 400)
        with LOCK:
            s = apply(load(), op)
            save(s)
        return self._json(s)

    def end_headers(self):
        if not self.path.startswith('/api/'):
            self.send_header('Cache-Control', 'no-cache')
        super().end_headers()


if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    try:
        ip = socket.gethostbyname(socket.gethostname())
    except Exception:
        ip = 'your-ip'
    print(f'XMTrading prototype running:\n  local   http://localhost:{port}\n  network http://{ip}:{port}\n  comments stored in {DATA}')
    ThreadingHTTPServer(('0.0.0.0', port), Handler).serve_forever()
