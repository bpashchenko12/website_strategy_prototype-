/* Shared helpers: header/footer chrome, logo, toasts, reveal-on-scroll, simulated market data. */
(function () {
  var script = document.currentScript;
  var ROOT = new URL('../../', script.src).href;           // site root, e.g. http://localhost:8000/
  var XM = window.XM = window.XM || {};
  XM.root = ROOT;
  XM.url = function (p) { return new URL(p, ROOT).href; };
  XM.qs = function (k) { return new URLSearchParams(location.search).get(k); };
  XM.$ = function (s, r) { return (r || document).querySelector(s); };
  XM.$$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  XM.el = function (html) { var t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstChild; };
  XM.esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  XM.embedded = /[?&](embed|present)=1/.test(location.search);

  /* ---- icons (stroke, 24 grid) ---- */
  XM.icon = function (name, cls) {
    var p = {
      globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.6 2.8 4 5.8 4 9s-1.4 6.2-4 9c-2.6-2.8-4-5.8-4-9s1.4-6.2 4-9z"/>',
      warn: '<path d="M12 3 2 20h20L12 3z"/><path d="M12 10v4M12 17.5v.01"/>',
      check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
      arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
      mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
      close: '<path d="M6 6l12 12M18 6 6 18"/>',
      chev: '<path d="m6 9 6 6 6-6"/>',
      lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
      bolt: '<path d="M13 3 5 14h6l-1 7 8-11h-6l1-7z"/>',
      play: '<path d="M8 5v14l11-7L8 5z"/>',
      user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/>',
      gift: '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13M5 12v8h14v-8M12 8s-1-4-4-4a2 2 0 0 0 0 4h4zm0 0s1-4 4-4a2 2 0 0 1 0 4h-4z"/>',
      chart: '<path d="M4 19V5M4 19h16M8 15l3-4 3 3 5-7"/>',
      phone: '<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/>',
      monitor: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>',
      users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.8-3.6 3.4-5.5 6.5-5.5s5.7 1.9 6.5 5.5"/><path d="M16 4.8a3.5 3.5 0 0 1 0 6.4M18 14.8c2 .7 3.3 2.3 3.8 5.2"/>',
      trophy: '<path d="M7 4h10v5a5 5 0 0 1-10 0V4zM7 6H4v2a3 3 0 0 0 3 3M17 6h3v2a3 3 0 0 1-3 3M9 21h6M12 14v7"/>',
      headset: '<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="3" y="14" width="4" height="6" rx="1.5"/><rect x="17" y="14" width="4" height="6" rx="1.5"/><path d="M19 20c0 1.5-2 2-5 2"/>',
      bell: '<path d="M6 17V11a6 6 0 0 1 12 0v6l1.5 2h-15L6 17zM10 21h4"/>',
      search: '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/>',
      star: '<path d="m12 3 2.8 5.8 6.2.9-4.5 4.4 1.1 6.2L12 17.3 6.4 20.3l1.1-6.2L3 9.7l6.2-.9L12 3z"/>',
      shield: '<path d="M12 3 4 6v6c0 4.5 3.2 8 8 9 4.8-1 8-4.5 8-9V6l-8-3z"/><path d="m8.5 12 2.5 2.5 4.5-5"/>',
      home: '<path d="M4 11 12 4l8 7v9H4v-9z"/>',
      wallet: '<rect x="3" y="6" width="18" height="14" rx="3"/><path d="M3 10h18M16 15h2"/>',
      book: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5zM4 19V5"/>',
      grid: '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
      copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
      share: '<circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="m8.2 10.8 7.6-3.6M8.2 13.2l7.6 3.6"/>',
      qr: '<rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><path d="M14 14h3v3h-3zM19 14v1M14 19h2M18 18h2v2"/>',
      fingerprint: '<path d="M12 11v3c0 2.5-.5 4.5-1.5 6M8 18c.7-1.4 1-3 1-5a3 3 0 0 1 6 0c0 2.6.4 4.4 1.2 6M5 16c.6-1.2 1-2.6 1-4a6 6 0 0 1 12 0c0 1.4.2 2.4.6 3.4M4 9a8.5 8.5 0 0 1 16 0"/>'
    }[name] || '';
    return '<svg class="' + (cls || '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + '</svg>';
  };

  /* ---- logo ---- */
  XM.logo = function (onDark) {
    var c = onDark ? '#fff' : '#0b0d10';
    return '<svg viewBox="0 0 168 30" role="img" aria-label="XMTRADING"><path fill="#e5373f" d="M1 4h5.5L13 15 6.5 26H1l6.5-11z"/><text x="12" y="23" fill="' + c + '" font-family="Poppins,Inter,Arial,sans-serif" font-weight="800" font-style="italic" font-size="22.5" letter-spacing="-1.2">XMTRADING</text></svg>';
  };

  /* ---- chrome ---- */
  var RISK = 'Forex and derivative trading involves significant risk and can result in the loss of your invested capital.';
  XM.chrome = function () {
    var r = XM.$('[data-xm-risk]');
    if (r) r.outerHTML = '<div class="xm-risk">' + XM.icon('warn') + '<span>' + RISK + '</span></div>';
    var h = XM.$('[data-xm-header]');
    if (h) {
      var variant = h.getAttribute('data-variant') || 'light';
      var client = h.getAttribute('data-client');
      var dark = variant === 'dark' || variant === 'over';
      var nav = ['Trading', 'Promotions', 'Learn & Research', 'Company', 'Partners'];
      var active = h.getAttribute('data-active');
      var right = client
        ? '<span class="tag" style="background:' + (dark ? 'rgba(255,255,255,.12)' : 'var(--g-l)') + ';color:' + (dark ? '#fff' : 'var(--g)') + '"><span class="dot"></span>Welcome back, ' + XM.esc(client) + '</span><a class="btn btn-primary" href="#" data-open-portal>Open Portal</a>'
        : '<a class="btn btn-outline hdr-login" href="#" data-login>Log in</a><a class="btn ' + (dark ? 'btn-light' : 'btn-primary') + '" href="' + XM.url('ideas/02-hero-email/register.html') + '" data-register>Register</a>';
      h.outerHTML = '<header class="xm-hdr' + (variant === 'dark' ? ' xm-hdr--dark' : variant === 'over' ? ' xm-hdr--over' : '') + '"><div class="in">' +
        '<a class="xm-logo" href="#">' + XM.logo(dark) + '</a>' +
        '<nav class="xm-nav">' + nav.map(function (n) { return '<a href="#"' + (n === active ? ' class="on"' : '') + '>' + n + '</a>'; }).join('') + '</nav>' +
        '<div class="right"><span class="xm-lang">' + XM.icon('globe') + 'EN</span>' + right + '<button class="xm-burger" aria-label="Menu">' + XM.icon('grid', 'w20') + '</button></div></div></header>';
    }
    var f = XM.$('[data-xm-footer]');
    if (f) {
      var col = function (t, items) { return '<div><h4>' + t + '</h4><ul>' + items.map(function (i) { return '<li><a href="#">' + i + '</a></li>'; }).join('') + '</ul></div>'; };
      f.outerHTML = '<footer class="xm-ftr"><div class="container"><div class="cols"><div>' + XM.logo(true).replace('<svg ', '<svg style="height:26px;margin-bottom:14px" ') +
        '<p style="max-width:260px;line-height:1.6">Trade forex, metals, indices, stocks and crypto CFDs on XMTrading Portal, XMTD Trader Pro, MT4 and MT5.</p></div>' +
        col('Trading', ['Account types', 'Platforms', 'Markets', 'Copy trading', 'Trading conditions']) +
        col('Promotions', ['Deposit bonus', 'No deposit bonus', 'Loyalty program', 'Refer a friend', 'Competitions']) +
        col('Learn & Research', ['Market news', 'Webinars', 'Tutorials', 'Economic calendar', 'Help center']) +
        col('Company', ['About us', 'Regulation', 'Partners', 'Contact', 'Careers']) +
        '</div><div class="risk"><b>Risk warning:</b> Trading Forex and Leveraged Financial Instruments involves significant risk and can result in the loss of your invested capital. You should not invest more than you can afford to lose and should ensure that you fully understand the risks involved. <br><br>Strategy prototype for internal review. All prices, figures, bonus terms and facts shown are illustrative placeholders, not live data and not an offer.</div></div></footer>';
    }
  };

  /* ---- toast ---- */
  XM.toast = function (msg, ms) {
    var host = XM.$('.toast-host');
    if (!host) { host = XM.el('<div class="toast-host"></div>'); document.body.appendChild(host); }
    var t = XM.el('<div class="toast">' + msg + '</div>'); host.appendChild(t);
    setTimeout(function () { t.style.opacity = 0; t.style.transition = 'opacity .3s'; setTimeout(function () { t.remove(); }, 300); }, ms || 2600);
  };

  /* ---- reveal on scroll ---- */
  XM.reveal = function () {
    var els = XM.$$('.reveal:not(.in)');
    if (!('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { threshold: .12 });
    els.forEach(function (e) { io.observe(e); });
  };

  /* ---- number formatting ---- */
  XM.fmt = function (n, d) { return Number(n).toLocaleString('en-US', { minimumFractionDigits: d == null ? 2 : d, maximumFractionDigits: d == null ? 2 : d }); };

  /* ---- illustrative market data (levels taken from the PWA screenshot, Nov 2026; not live) ---- */
  XM.INSTR = [
    { s: 'GOLD', n: 'Gold', cls: 'Metals', p: 4055.26, d: 2, chg: -2.07, sp: 0.35, cc: '#d4a017', lg: 'Au' },
    { s: 'SILVER', n: 'Silver', cls: 'Metals', p: 55.045, d: 3, chg: -5.0, sp: 0.03, cc: '#9aa3ad', lg: 'Ag' },
    { s: 'BTCUSD', n: 'Bitcoin vs US Dollar', cls: 'Crypto', p: 81682.75, d: 2, chg: -3.53, sp: 18, cc: '#f7931a', lg: '₿' },
    { s: 'ETHUSD', n: 'Ethereum vs US Dollar', cls: 'Crypto', p: 2409.41, d: 2, chg: -3.29, sp: 1.2, cc: '#5b6bd6', lg: 'Ξ' },
    { s: 'EURUSD', n: 'Euro vs US Dollar', cls: 'Forex', p: 1.11948, d: 5, chg: -0.33, sp: 0.00006, cc: '#2f62f0', lg: '€' },
    { s: 'GBPUSD', n: 'Great Britain Pound vs US Dollar', cls: 'Forex', p: 1.3371, d: 5, chg: -0.16, sp: 0.00008, cc: '#1d2024', lg: '£' },
    { s: 'USDJPY', n: 'US Dollar vs Japanese Yen', cls: 'Forex', p: 157.156, d: 3, chg: -0.61, sp: 0.009, cc: '#e5373f', lg: '¥' },
    { s: 'GBPJPY', n: 'Great Britain Pound vs Japanese Yen', cls: 'Forex', p: 210.149, d: 3, chg: -0.77, sp: 0.02, cc: '#1d2024', lg: '£¥' },
    { s: 'US100Cash', n: 'US 100 Index Cash', cls: 'Indices', p: 29331.83, d: 2, chg: -1.69, sp: 1.2, cc: '#0b7285', lg: '100' },
    { s: 'US30Cash', n: 'US Wall Street 30 Index Cash', cls: 'Indices', p: 52764.0, d: 2, chg: -0.28, sp: 2.5, cc: '#1c3f94', lg: '30' },
    { s: 'JP225Cash', n: 'Japan 225 Index Cash', cls: 'Indices', p: 63293.0, d: 0, chg: -2.5, sp: 8, cc: '#e5373f', lg: '225' },
    { s: 'GER40Cash', n: 'Germany 40 Index Cash', cls: 'Indices', p: 25542.64, d: 2, chg: 0.42, sp: 1.4, cc: '#1d2024', lg: '40' },
    { s: 'OILCash', n: 'WTI Crude Oil Cash', cls: 'Energies', p: 100.6, d: 2, chg: 1.27, sp: 0.04, cc: '#33383f', lg: 'Oil' },
    { s: 'BRENTCash', n: 'Brent Crude Oil Cash', cls: 'Energies', p: 112.79, d: 2, chg: 1.56, sp: 0.04, cc: '#33383f', lg: 'Br' },
    { s: 'TSLA', n: 'Tesla Inc.', cls: 'Stocks', p: 384.05, d: 2, chg: -2.98, sp: 0.12, cc: '#e5373f', lg: 'T' },
    { s: 'AAPL', n: 'Apple Inc.', cls: 'Stocks', p: 241.3, d: 2, chg: 1.14, sp: 0.06, cc: '#1d2024', lg: 'A' },
    { s: 'NVDA', n: 'NVIDIA Corp.', cls: 'Stocks', p: 188.7, d: 2, chg: 3.62, sp: 0.05, cc: '#5aa400', lg: 'N' },
    { s: 'SOLUSD', n: 'Solana vs US Dollar', cls: 'Crypto', p: 94.69, d: 2, chg: 1.46, sp: 0.2, cc: '#6b46c1', lg: 'S' },
    { s: 'XRPUSD', n: 'XRP vs US Dollar', cls: 'Crypto', p: 1.3, d: 4, chg: 1.8, sp: 0.002, cc: '#1d2024', lg: 'X' },
    { s: 'AUDUSD', n: 'Australian Dollar vs US Dollar', cls: 'Forex', p: 0.6652, d: 5, chg: 0.31, sp: 0.00009, cc: '#0b7285', lg: 'A$' }
  ];
  XM.instr = function (s) { return XM.INSTR.filter(function (i) { return i.s === s; })[0]; };
  XM.logoChip = function (i, size) { size = size || 36; return '<span style="width:' + size + 'px;height:' + size + 'px;border-radius:50%;background:' + i.cc + ';color:#fff;display:inline-grid;place-items:center;font-size:' + Math.round(size * .36) + 'px;font-weight:700;flex:none">' + XM.esc(i.lg) + '</span>'; };

  /* seeded random walk so every page load shows believable, moving prices */
  XM.walk = function (base, vol) { var p = base; return function () { p = p * (1 + (Math.random() - .5) * vol); return p; }; };
  XM.sparkline = function (vals, w, h, color) {
    var mn = Math.min.apply(0, vals), mx = Math.max.apply(0, vals), rg = (mx - mn) || 1;
    var pts = vals.map(function (v, i) { return (i / (vals.length - 1) * w).toFixed(1) + ',' + (h - 2 - (v - mn) / rg * (h - 4)).toFixed(1); }).join(' ');
    return '<svg width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '"><polyline fill="none" stroke="' + color + '" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round" points="' + pts + '"/></svg>';
  };
  XM.series = function (n, base, vol, drift) { var a = [], p = base; for (var i = 0; i < n; i++) { p = p * (1 + (Math.random() - .5) * vol + (drift || 0)); a.push(p); } return a; };

  /* ---- shared flow state across prototype pages (sessionStorage) ---- */
  XM.flow = {
    get: function () { try { return JSON.parse(sessionStorage.getItem('xm.flow')) || {}; } catch (e) { return {}; } },
    set: function (o) { var s = Object.assign(XM.flow.get(), o); try { sessionStorage.setItem('xm.flow', JSON.stringify(s)); } catch (e) {} return s; },
    clear: function () { try { sessionStorage.removeItem('xm.flow'); } catch (e) {} }
  };

  /* ---- "About this idea" pitch panel (bottom-left chip). o = { title, today, proposed, why, metric } ---- */
  XM.notes = function (o) {
    if (XM.embedded) return;
    var st = XM.el('<style>.xn{position:fixed;left:16px;bottom:16px;z-index:2147482500;font-family:Inter,system-ui,sans-serif}.xn .chip{background:rgba(17,19,24,.92);color:#fff;border:0;border-radius:14px;padding:11px 15px;font-size:12.5px;font-weight:600;display:inline-flex;gap:8px;align-items:center;box-shadow:0 8px 28px rgba(0,0,0,.3);cursor:pointer}.xn .pn{position:absolute;left:0;bottom:52px;width:360px;max-width:calc(100vw - 32px);background:#fff;color:#1d2024;border-radius:18px;box-shadow:0 24px 70px rgba(0,0,0,.35);padding:18px 18px 16px;display:none}.xn.open .pn{display:block;animation:fadeUp .22s}.xn h4{margin:0 0 10px;font-size:15px;line-height:1.3}.xn .row{display:grid;grid-template-columns:78px 1fr;gap:10px;font-size:12.5px;line-height:1.5;padding:8px 0;border-top:1px solid #eceef1;color:#3b4149}.xn .row b{font-size:10.5px;letter-spacing:.09em;text-transform:uppercase;color:#7b828b;padding-top:2px}.xn .row.g b{color:#008454}@media(max-width:760px){.xn{bottom:76px}}</style>');
    document.head.appendChild(st);
    var row = function (k, v, g) { return v ? '<div class="row' + (g ? ' g' : '') + '"><b>' + k + '</b><div>' + v + '</div></div>' : ''; };
    var n = XM.el('<div class="xn"><div class="pn"><h4>' + XM.esc(o.title || 'About this idea') + '</h4>' + row('Today', o.today) + row('Proposed', o.proposed, 1) + row('Why', o.why) + row('Metric', o.metric) + '</div><button class="chip" type="button">' + XM.icon('bolt').replace(/<svg /, '<svg width="15" height="15" ') + ' What changes?</button></div>');
    n.querySelector('.chip').addEventListener('click', function () { n.classList.toggle('open'); });
    document.body.appendChild(n);
  };

  /* ---- boot ---- */
  XM.boot = function () {
    XM.chrome(); XM.reveal();
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a[href="#"]'); if (a) e.preventDefault();
    });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', XM.boot); else XM.boot();
})();
