/* Review layer: floating dock + comments drawer + pin comments + support vote.
   Add to any prototype:  <script src="../../assets/js/review.js" data-idea="01"></script>
   Hidden automatically with ?embed=1 (used by the tree preview) and ?present=1. */
(function () {
  var script = document.currentScript;
  var ROOT = new URL('../../', script.src).href;
  var IDEA = script.getAttribute('data-idea');
  if (/[?&](embed|present)=1/.test(location.search)) return;

  function load(src) {
    return new Promise(function (res, rej) { var s = document.createElement('script'); s.src = ROOT + src; s.onload = res; s.onerror = rej; document.head.appendChild(s); });
  }
  var deps = [];
  if (!window.XM_IDEAS) deps.push(load('assets/js/ideas.js'));
  if (!window.XMStore) deps.push(load('assets/js/store.js'));
  Promise.all(deps).then(start);

  var ROLES = ['CEO', 'Executive', 'Product Manager', 'Marketing', 'Engineering', 'Design', 'Compliance', 'Support', 'Other'];
  var TYPES = { comment: 'Comment', question: 'Question', concern: 'Concern', suggestion: 'Suggestion', approve: 'Looks good' };
  var TYPE_COLOR = { comment: '#5b6470', question: '#2f62f0', concern: '#d6336c', suggestion: '#8a3fd1', approve: '#008454' };

  var CSS = '\
.xr, .xr * { box-sizing: border-box; font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; letter-spacing: 0; }\
.xr button { cursor: pointer; font: inherit; }\
.xr-dock { position: fixed; left: 50%; bottom: 18px; transform: translateX(-50%); z-index: 2147483000; display: flex; align-items: center; gap: 4px; padding: 6px; border-radius: 18px; background: rgba(17,19,24,.92); backdrop-filter: blur(14px) saturate(1.4); box-shadow: 0 10px 40px rgba(0,0,0,.35), inset 0 0 0 1px rgba(255,255,255,.08); color: #fff; font-size: 13px; max-width: calc(100vw - 20px); transition: transform .25s, opacity .25s; }\
.xr-dock.xr-off { transform: translate(-50%, 140%); opacity: 0; pointer-events: none; }\
.xr-b { display: inline-flex; align-items: center; gap: 7px; height: 38px; padding: 0 12px; border-radius: 12px; border: 0; background: transparent; color: #e9ecf1; font-size: 13px; font-weight: 500; white-space: nowrap; text-decoration: none; position: relative; }\
.xr-b:hover { background: rgba(255,255,255,.1); }\
.xr-b svg { width: 17px; height: 17px; flex: none; }\
.xr-b.xr-on { background: #008454; color: #fff; }\
.xr-b.xr-vote.xr-on { background: #008454; }\
.xr-b .xr-n { min-width: 20px; height: 20px; padding: 0 6px; border-radius: 10px; background: rgba(255,255,255,.16); display: inline-grid; place-items: center; font-size: 11.5px; font-weight: 600; }\
.xr-b .xr-n.xr-hot { background: #e5373f; }\
.xr-title { display: flex; align-items: center; gap: 9px; padding: 0 10px; height: 38px; border-radius: 12px; border: 0; background: rgba(255,255,255,.07); color: #fff; max-width: 330px; }\
.xr-title:hover { background: rgba(255,255,255,.14); }\
.xr-title b { background: #008454; border-radius: 7px; padding: 2px 7px; font-size: 12px; }\
.xr-title span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight: 600; font-size: 13px; }\
.xr-title small { opacity: .55; font-size: 11px; font-weight: 500; }\
.xr-sep { width: 1px; height: 22px; background: rgba(255,255,255,.14); margin: 0 4px; }\
.xr-tab { position: fixed; right: 16px; bottom: 16px; z-index: 2147483000; border: 0; border-radius: 14px; padding: 10px 14px; background: rgba(17,19,24,.92); color: #fff; font-size: 12.5px; font-weight: 600; display: none; gap: 8px; align-items: center; box-shadow: 0 8px 28px rgba(0,0,0,.3); }\
.xr-tab.xr-show { display: inline-flex; }\
.xr-tab svg { width: 16px; height: 16px; }\
.xr-pop { position: fixed; left: 50%; bottom: 74px; transform: translateX(-50%); z-index: 2147483001; width: 360px; max-height: 60vh; overflow: auto; background: #fff; border-radius: 16px; box-shadow: 0 24px 70px rgba(0,0,0,.3); padding: 8px; display: none; }\
.xr-pop.xr-open { display: block; }\
.xr-pop a { display: flex; gap: 10px; align-items: center; padding: 8px 10px; border-radius: 10px; color: #1d2024; text-decoration: none; font-size: 13px; }\
.xr-pop a:hover { background: #f3f4f6; }\
.xr-pop a.xr-cur { background: #e6f3ed; }\
.xr-pop a b { width: 26px; height: 26px; flex: none; border-radius: 8px; background: #1d2024; color: #fff; display: grid; place-items: center; font-size: 11px; }\
.xr-pop a.xr-na { opacity: .45; pointer-events: none; }\
.xr-pop a span { flex: 1; line-height: 1.25; } .xr-pop a em { font-style: normal; font-size: 11px; color: #7b828b; }\
.xr-drawer { position: fixed; top: 0; right: 0; bottom: 0; width: 400px; max-width: 100vw; z-index: 2147483002; background: #fff; box-shadow: -20px 0 60px rgba(0,0,0,.22); transform: translateX(105%); transition: transform .28s cubic-bezier(.2,.7,.2,1); display: flex; flex-direction: column; color: #1d2024; }\
.xr-drawer.xr-open { transform: none; }\
.xr-dh { padding: 16px 18px 12px; border-bottom: 1px solid #e5e7ea; }\
.xr-dh .xr-row { display: flex; align-items: center; gap: 8px; }\
.xr-dh h3 { margin: 0; font-size: 15px; font-weight: 700; flex: 1; line-height: 1.3; }\
.xr-x { width: 30px; height: 30px; border-radius: 50%; border: 0; background: #f1f2f4; font-size: 16px; line-height: 1; }\
.xr-stats { display: flex; align-items: center; gap: 10px; margin-top: 10px; font-size: 12.5px; color: #5b6470; flex-wrap: wrap; }\
.xr-avs { display: inline-flex; } .xr-avs .xr-av { margin-left: -6px; border: 2px solid #fff; } .xr-avs .xr-av:first-child { margin-left: 0; }\
.xr-av { width: 28px; height: 28px; border-radius: 50%; color: #fff; display: inline-grid; place-items: center; font-size: 11px; font-weight: 700; flex: none; }\
.xr-list { flex: 1; overflow: auto; padding: 8px 18px 18px; background: #fafafa; }\
.xr-empty { text-align: center; color: #7b828b; padding: 44px 16px; font-size: 13.5px; line-height: 1.6; }\
.xr-empty svg { width: 36px; height: 36px; margin: 0 auto 10px; opacity: .5; display: block; }\
.xr-th { background: #fff; border: 1px solid #e5e7ea; border-radius: 14px; padding: 12px 14px; margin-top: 12px; transition: box-shadow .3s, border-color .3s; }\
.xr-th.xr-flash { border-color: #008454; box-shadow: 0 0 0 4px rgba(0,132,84,.18); }\
.xr-th.xr-res { opacity: .62; }\
.xr-c { display: flex; gap: 10px; } .xr-c + .xr-c { margin-top: 12px; padding-top: 12px; border-top: 1px dashed #e5e7ea; }\
.xr-cb { flex: 1; min-width: 0; font-size: 13.5px; line-height: 1.5; }\
.xr-cm { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; margin-bottom: 2px; }\
.xr-cm b { font-size: 13px; } .xr-cm .xr-role { font-size: 11px; color: #7b828b; } .xr-cm time { font-size: 11px; color: #9aa1ab; margin-left: auto; }\
.xr-ty { font-size: 10.5px; font-weight: 700; padding: 2px 7px; border-radius: 999px; color: #fff; }\
.xr-ct { white-space: pre-wrap; word-wrap: break-word; color: #2b3036; }\
.xr-on-el { font-size: 11.5px; color: #7b828b; background: #f3f4f6; padding: 3px 8px; border-radius: 6px; display: inline-block; margin-bottom: 5px; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\
.xr-act { display: flex; gap: 12px; margin-top: 6px; flex-wrap: wrap; }\
.xr-act button { background: none; border: 0; padding: 0; font-size: 12px; font-weight: 600; color: #5b6470; }\
.xr-act button:hover { color: #008454; } .xr-act .xr-del:hover { color: #e5373f; }\
.xr-reply { margin-top: 10px; display: none; gap: 8px; } .xr-reply.xr-open { display: flex; }\
.xr-reply textarea, .xr-comp textarea, .xr-pc textarea { flex: 1; width: 100%; border: 1.5px solid #e1e4e8; border-radius: 10px; padding: 9px 11px; font-size: 13.5px; resize: none; outline: none; min-height: 40px; background: #fff; color: #1d2024; }\
.xr-reply textarea:focus, .xr-comp textarea:focus, .xr-pc textarea:focus { border-color: #008454; box-shadow: 0 0 0 3px rgba(0,132,84,.12); }\
.xr-send { border: 0; background: #008454; color: #fff; border-radius: 10px; padding: 0 14px; font-weight: 600; font-size: 13px; height: 38px; align-self: flex-end; }\
.xr-send:hover { background: #006b44; } .xr-send[disabled] { opacity: .4; pointer-events: none; }\
.xr-comp { padding: 12px 18px 16px; border-top: 1px solid #e5e7ea; background: #fff; }\
.xr-types { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 8px; }\
.xr-types button { border: 1.5px solid #e1e4e8; background: #fff; border-radius: 999px; padding: 4px 11px; font-size: 12px; font-weight: 600; color: #5b6470; }\
.xr-types button.xr-on { color: #fff; border-color: transparent; }\
.xr-comp .xr-foot { display: flex; gap: 8px; margin-top: 8px; align-items: center; }\
.xr-comp .xr-foot span { flex: 1; font-size: 11.5px; color: #7b828b; }\
.xr-who { display: flex; align-items: center; gap: 8px; font-size: 12px; color: #5b6470; padding: 8px 18px; background: #f6f7f8; border-top: 1px solid #e5e7ea; }\
.xr-who button { background: none; border: 0; color: #008454; font-weight: 600; font-size: 12px; }\
.xr-mode { position: fixed; top: 14px; left: 50%; transform: translateX(-50%); z-index: 2147483003; background: #1d2024; color: #fff; padding: 9px 14px 9px 16px; border-radius: 14px; font-size: 13px; display: none; align-items: center; gap: 12px; box-shadow: 0 12px 30px rgba(0,0,0,.3); }\
.xr-mode.xr-show { display: flex; } .xr-mode button { border: 0; background: rgba(255,255,255,.16); color: #fff; border-radius: 8px; padding: 5px 10px; font-size: 12px; font-weight: 600; }\
body.xr-pinmode, body.xr-pinmode * { cursor: crosshair !important; }\
.xr-pins { position: absolute; left: 0; top: 0; width: 100%; height: 0; z-index: 2147482000; pointer-events: none; }\
.xr-pin { position: absolute; width: 30px; height: 30px; margin: -30px 0 0 -4px; border-radius: 50% 50% 50% 4px; background: #e5373f; color: #fff; display: grid; place-items: center; font-size: 12px; font-weight: 700; box-shadow: 0 6px 16px rgba(0,0,0,.3); pointer-events: auto; border: 2px solid #fff; cursor: pointer; font-family: Inter, sans-serif; transition: transform .15s; }\
.xr-pin:hover { transform: scale(1.12); } .xr-pin.xr-resp { background: #98a1ad; } .xr-pin.xr-tmp { background: #008454; animation: xrp 1s infinite; } .xr-pin.xr-pulse { animation: xrp 1s 4; }\
@keyframes xrp { 0%,100% { transform: scale(1); } 50% { transform: scale(1.25); } }\
.xr-pc { position: absolute; z-index: 2147483004; width: 320px; background: #fff; border-radius: 14px; padding: 12px; box-shadow: 0 20px 60px rgba(0,0,0,.35); pointer-events: auto; color: #1d2024; }\
.xr-pc .xr-foot { display: flex; gap: 8px; margin-top: 8px; justify-content: flex-end; }\
.xr-pc .xr-ghost { border: 0; background: #f1f2f4; border-radius: 10px; padding: 0 14px; height: 38px; font-weight: 600; font-size: 13px; }\
.xr-modal { position: fixed; inset: 0; z-index: 2147483005; background: rgba(10,12,15,.6); display: none; align-items: flex-start; justify-content: center; padding: 20px; overflow-y: auto; overscroll-behavior: contain; }\
.xr-modal.xr-open { display: flex; }\
.xr-m { position: relative; margin: auto; background: #fff; border-radius: 20px; padding: 26px; width: 100%; max-width: 400px; box-shadow: 0 30px 80px rgba(0,0,0,.4); color: #1d2024; }\
.xr-m .xr-mx { position: absolute; top: 12px; right: 12px; width: 36px; height: 36px; border-radius: 50%; border: 0; background: #f1f2f4; color: #3c434b; font-size: 20px; line-height: 1; display: grid; place-items: center; }\
.xr-m .xr-mx:hover { background: #e4e6ea; }\
.xr-m h3 { margin: 0 0 4px; padding-right: 40px; font-size: 19px; } .xr-m p { margin: 0 0 16px; font-size: 13.5px; color: #5b6470; line-height: 1.5; }\
.xr-m .xr-no { width: 100%; margin-top: 8px; height: 44px; border: 0; border-radius: 12px; background: transparent; color: #5b6470; font-weight: 600; font-size: 14px; }\
.xr-m .xr-no:hover { background: #f3f4f6; color: #1d2024; }\
.xr-m label { display: block; font-size: 12px; font-weight: 600; margin: 12px 0 5px; color: #4a5058; }\
.xr-m input, .xr-m select { width: 100%; height: 44px; border-radius: 10px; border: 1.5px solid #e1e4e8; padding: 0 12px; font-size: 14px; outline: none; background: #fff; color: #1d2024; }\
.xr-m input:focus, .xr-m select:focus { border-color: #008454; box-shadow: 0 0 0 3px rgba(0,132,84,.12); }\
.xr-m .xr-go { width: 100%; margin-top: 18px; height: 46px; border: 0; border-radius: 12px; background: #008454; color: #fff; font-weight: 600; font-size: 14.5px; }\
.xr-pop { padding: 0; width: 400px; max-width: calc(100vw - 20px); display: none; flex-direction: column; }\
.xr-pop.xr-open { display: flex; }\
.xr-sw-h { padding: 12px 12px 8px; border-bottom: 1px solid #eceef0; position: sticky; top: 0; background: #fff; z-index: 1; }\
.xr-sw-h input { width: 100%; height: 40px; border: 1.5px solid #e1e4e8; border-radius: 11px; padding: 0 12px 0 36px; font-size: 14px; outline: none; background: #f7f8f9 url(\"data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2716%27 height=%2716%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%237b828b%27 stroke-width=%272%27 stroke-linecap=%27round%27%3E%3Ccircle cx=%2711%27 cy=%2711%27 r=%277%27/%3E%3Cpath d=%27m20 20-3.5-3.5%27/%3E%3C/svg%3E\") no-repeat 12px 50%; color: #1d2024; }\
.xr-sw-h input:focus { border-color: #008454; background-color: #fff; }\
.xr-sw-j { display: flex; align-items: center; gap: 4px; margin-top: 10px; overflow-x: auto; padding-bottom: 2px; }\
.xr-sw-j small { font-size: 10.5px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: #7b828b; margin-right: 4px; white-space: nowrap; }\
.xr-sw-j a { display: inline-grid; place-items: center; min-width: 30px; height: 26px; border-radius: 8px; padding: 0 6px; font-size: 11.5px; font-weight: 700; background: #eef0f2; color: #3c434b; text-decoration: none; }\
.xr-sw-j a.xr-cur { background: #008454; color: #fff; } .xr-sw-j a.xr-na { opacity: .4; pointer-events: none; } .xr-sw-j i { width: 8px; height: 1.5px; background: #c8cdd3; flex: none; }\
.xr-sw-l { overflow: auto; padding: 4px 8px 8px; max-height: 50vh; }\
.xr-sw-w { font-size: 10.5px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: #7b828b; padding: 10px 10px 4px; }\
.xr-pop a.xr-hl { background: #f0f2f4; box-shadow: inset 0 0 0 1.5px #008454; }\
.xr-pop a .xr-dot { width: 7px; height: 7px; border-radius: 50%; background: #2f62f0; flex: none; }\
.xr-sw-f { padding: 8px 14px; border-top: 1px solid #eceef0; font-size: 11.5px; color: #7b828b; display: flex; gap: 14px; flex-wrap: wrap; }\
.xr-sw-f kbd, .xr-kb { font: 600 10.5px/1 inherit; background: #eef0f2; border-radius: 5px; padding: 2px 5px; color: #3c434b; }\
.xr-b kbd { font: 600 10px/1 inherit; opacity: .55; background: rgba(255,255,255,.12); border-radius: 4px; padding: 2px 4px; margin-left: 2px; }\
.xr-prog { position: absolute; left: 14px; right: 14px; bottom: 0; height: 2px; border-radius: 2px; background: rgba(255,255,255,.1); overflow: hidden; }\
.xr-prog i { display: block; height: 100%; background: #2fe39a; transition: width .3s; }\
.xr-nav { display: inline-flex; flex-direction: column; align-items: center; } \
@media (max-width: 760px) { .xr-dock { bottom: 10px; gap: 2px; padding: 5px; } .xr-b kbd { display: none; } .xr-sw-f { display: none; } .xr-pop { bottom: 66px; } .xr-b span.xr-lbl, .xr-title small { display: none; } .xr-title { max-width: 150px; } .xr-b { padding: 0 9px; } .xr-hide-m { display: none; } }\
';

  var I = {
    tree: '<path d="M12 3v6M12 9H5v4M12 9h7v4M5 13v3a2 2 0 0 0 2 2h0M19 13v3a2 2 0 0 1-2 2h0"/><circle cx="12" cy="3" r="1.3"/><circle cx="5" cy="13" r="1.3"/><circle cx="19" cy="13" r="1.3"/>',
    chev_l: '<path d="m15 6-6 6 6 6"/>', chev_r: '<path d="m9 6 6 6-6 6"/>',
    up: '<path d="M7 11v9H4v-9h3zM7 11l4-8a2 2 0 0 1 2 2v4h5.5a2 2 0 0 1 2 2.3l-1.3 7A2 2 0 0 1 17.3 20H7"/>',
    chat: '<path d="M4 5h16v11H9l-5 4V5z"/>',
    pin: '<path d="M12 21s-6-5.6-6-10.5a6 6 0 0 1 12 0C18 15.4 12 21 12 21z"/><circle cx="12" cy="10.5" r="2.2"/>',
    list: '<path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    eyeoff: '<path d="M3 3l18 18M10.6 5.1A9.7 9.7 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.2 4M6.2 6.7C3.6 8.5 2 12 2 12s3.5 7 10 7c1.6 0 3-.4 4.3-1M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',
    msg: '<path d="M4 5h16v11H9l-5 4V5z"/><path d="M8 9h8M8 12h5"/>'
  };
  function ic(n) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">' + I[n] + '</svg>'; }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function ini(n) { return esc((n || '?').split(/\s+/).map(function (w) { return w[0]; }).slice(0, 2).join('').toUpperCase()); }
  function ago(ts) { var s = (Date.now() - ts) / 1000; if (s < 60) return 'just now'; if (s < 3600) return Math.floor(s / 60) + 'm ago'; if (s < 86400) return Math.floor(s / 3600) + 'h ago'; return new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }); }
  function av(a) { return '<span class="xr-av" style="background:' + esc(a.color || '#5b6470') + '" title="' + esc(a.name) + '">' + ini(a.name) + '</span>'; }

  var root, dock, drawer, list, pop, tab, modeBar, pinsEl, idModal;
  var idea, ideas, curIdx, pinMode = false, type = 'comment', pending = null, afterIdentity = null, focusId = null;

  function start() {
    ideas = window.XM_IDEAS; idea = ideas.filter(function (i) { return i.id === IDEA; })[0] || { id: IDEA, title: document.title, slide: '' };
    curIdx = ideas.indexOf(idea);
    var st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
    root = document.createElement('div'); root.className = 'xr';
    var builds = ideas.filter(function (i) { return i.path; });
    var bi = builds.indexOf(idea), prev = builds[bi - 1], next = builds[bi + 1];
    root.innerHTML =
      '<div class="xr-dock" role="toolbar" aria-label="Review tools">' +
      '<a class="xr-b" href="' + ROOT + 'index.html#' + idea.id + '" title="Ideas tree (T)">' + ic('tree') + '<span class="xr-lbl xr-hide-m">Tree</span></a>' +
      '<a class="xr-b" ' + (prev ? 'href="' + ROOT + prev.path + '" title="Previous: ' + esc(prev.title) + '  ( [ )"' : 'style="opacity:.3;pointer-events:none"') + '>' + ic('chev_l') + '</a>' +
      '<button class="xr-title" data-a="switch" title="Jump to any idea  ( / )"><b>#' + esc(idea.id) + '</b><span>' + esc(idea.title) + '</span><small>' + (bi + 1) + ' of ' + builds.length + '</small></button>' +
      '<a class="xr-b" ' + (next ? 'href="' + ROOT + next.path + '" title="Next: ' + esc(next.title) + '  ( ] )"' : 'style="opacity:.3;pointer-events:none"') + '>' + ic('chev_r') + '</a>' +
      '<i class="xr-sep"></i>' +
      '<button class="xr-b xr-vote" data-a="vote" title="Support this idea">' + ic('up') + '<span class="xr-lbl">Support</span><span class="xr-n" data-r="votes">0</span></button>' +
      '<button class="xr-b" data-a="drawer" title="Comments  ( C )">' + ic('chat') + '<span class="xr-lbl">Comments</span><span class="xr-n" data-r="count">0</span></button>' +
      '<button class="xr-b" data-a="pin" title="Drop a comment pin on the page  ( P )">' + ic('pin') + '<span class="xr-lbl xr-hide-m">Pin</span></button>' +
      '<a class="xr-b" href="' + ROOT + 'comments.html" title="All comments page">' + ic('list') + '</a>' +
      '<button class="xr-b" data-a="hide" title="Hide review tools, presentation mode  ( H )">' + ic('eyeoff') + '</button>' +
      '<span class="xr-prog"><i style="width:' + Math.round((bi + 1) / builds.length * 100) + '%"></i></span></div>' +
      '<button class="xr-tab" data-a="show">' + ic('eye') + ' Review</button>' +
      '<div class="xr-pop" data-r="pop"></div>' +
      '<div class="xr-mode"><span>Click anywhere on the page to leave a comment</span><button data-a="pin-cancel">Cancel (Esc)</button></div>' +
      '<aside class="xr-drawer" aria-label="Comments"><div class="xr-dh"><div class="xr-row"><h3>#' + esc(idea.id) + ' · ' + esc(idea.title) + '</h3><button class="xr-x" data-a="drawer-close" aria-label="Close">×</button></div><div class="xr-stats" data-r="stats"></div></div>' +
      '<div class="xr-list" data-r="list"></div>' +
      '<div class="xr-comp"><div class="xr-types" data-r="types"></div><textarea rows="3" placeholder="Share feedback on this idea…" data-r="text"></textarea><div class="xr-foot"><span>Visible to everyone with the link</span><button class="xr-send" data-a="post" disabled>Post</button></div></div>' +
      '<div class="xr-who" data-r="who"></div></aside>' +
      '<div class="xr-modal" data-a="id-backdrop"><div class="xr-m" role="dialog" aria-modal="true" aria-label="Who is commenting?"><button class="xr-mx" data-a="id-close" aria-label="Close">×</button><h3>Who is commenting?</h3><p>Your name appears next to your votes and comments. No account needed.</p>' +
      '<label>Your name</label><input data-r="name" maxlength="40" placeholder="e.g. Alex Tanaka" autocomplete="name">' +
      '<label>Role</label><select data-r="role"><option value="" disabled selected>Select your role</option>' + ROLES.map(function (r) { return '<option>' + r + '</option>'; }).join('') + '</select>' +
      '<button class="xr-go" data-a="id-save">Continue</button><button class="xr-no" data-a="id-close">Not now</button></div></div>';
    document.body.appendChild(root);
    dock = root.querySelector('.xr-dock'); drawer = root.querySelector('.xr-drawer'); list = root.querySelector('[data-r=list]'); pop = root.querySelector('[data-r=pop]');
    tab = root.querySelector('.xr-tab'); modeBar = root.querySelector('.xr-mode'); idModal = root.querySelector('.xr-modal');
    pinsEl = document.createElement('div'); pinsEl.className = 'xr xr-pins'; document.body.appendChild(pinsEl);

    renderTypes();
    root.addEventListener('click', onClick);
    pinsEl.addEventListener('click', onClick);
    root.querySelector('[data-r=text]').addEventListener('input', function (e) { root.querySelector('[data-a=post]').disabled = !e.target.value.trim(); });
    root.querySelector('[data-r=name]').addEventListener('keydown', function (e) { if (e.key === 'Enter') root.querySelector('[data-a=id-save]').click(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { if (idModal.classList.contains('xr-open')) { closeId(); return; } cancelPin(); closePop(); } });
    document.addEventListener('click', onDocClick, true);
    window.addEventListener('resize', renderPins);
    window.addEventListener('load', renderPins);

    XMStore.on(render);
    try { var vm = JSON.parse(localStorage.getItem('xm.visited') || '{}'); vm[idea.id] = 1; localStorage.setItem('xm.visited', JSON.stringify(vm)); } catch (e) {}
    XMStore.init(ROOT).then(function () { render(); handleDeepLink(); setTimeout(renderPins, 600); if (!localStorage.getItem('xm.tip')) { localStorage.setItem('xm.tip', '1'); setTimeout(function () { toast('Tip: press [ and ] to move between ideas, / to search, C for comments'); }, 1600); } });
  }

  function renderTypes() {
    root.querySelector('[data-r=types]').innerHTML = Object.keys(TYPES).map(function (k) {
      return '<button data-a="type" data-t="' + k + '" class="' + (k === type ? 'xr-on' : '') + '" style="' + (k === type ? 'background:' + TYPE_COLOR[k] : '') + '">' + TYPES[k] + '</button>';
    }).join('');
  }

  function render() {
    var me = XMStore.identity;
    var n = XMStore.votesFor(idea.id), c = XMStore.countFor(idea.id), open = XMStore.openThreads(idea.id);
    var v = root.querySelector('[data-r=votes]'); v.textContent = n;
    root.querySelector('.xr-vote').classList.toggle('xr-on', XMStore.votedBy(idea.id, me));
    var cn = root.querySelector('[data-r=count]'); cn.textContent = c; cn.classList.toggle('xr-hot', open > 0);
    var vs = XMStore.voters(idea.id);
    root.querySelector('[data-r=stats]').innerHTML =
      '<span class="xr-avs">' + vs.slice(0, 6).map(function (u) { return av({ name: u.name, color: '#008454' }); }).join('') + '</span>' +
      '<span><b>' + n + '</b> supporting' + (vs.length ? ' · ' + esc(vs.slice(0, 2).map(function (u) { return u.name; }).join(', ')) + (vs.length > 2 ? ' +' + (vs.length - 2) : '') : '') + '</span>' +
      '<span style="margin-left:auto">Slide ' + (idea.slide || '-') + '</span>';
    root.querySelector('[data-r=who]').innerHTML = me ? av(me) + '<span>Commenting as <b>' + esc(me.name) + '</b> · ' + esc(me.role) + '</span><button data-a="id-change" style="margin-left:auto">Change</button>' : '<span>Not signed in</span><button data-a="id-change" style="margin-left:auto">Set your name</button>';
    renderList(); renderPins();
  }

  function pinNumbers() { var map = {}, k = 0; XMStore.commentsFor(idea.id).filter(function (c) { return c.pin && !c.parent; }).forEach(function (c) { map[c.id] = ++k; }); return map; }

  function commentHTML(c, nums, isReply) {
    var me = XMStore.identity, mine = me && me.id === c.author.id, can = me && (me.owner || mine);
    return '<div class="xr-c" data-id="' + c.id + '">' + av(c.author) + '<div class="xr-cb"><div class="xr-cm"><b>' + esc(c.author.name) + '</b><span class="xr-role">' + esc(c.author.role) + '</span>' +
      (c.type && c.type !== 'comment' ? '<span class="xr-ty" style="background:' + TYPE_COLOR[c.type] + '">' + TYPES[c.type] + '</span>' : '') + '<time>' + ago(c.ts) + '</time></div>' +
      (c.pin && c.pin.label ? '<div class="xr-on-el">' + (nums[c.id] ? '📍 ' + nums[c.id] + ' · ' : '') + esc(c.pin.label) + '</div>' : '') +
      '<div class="xr-ct">' + esc(c.text) + '</div><div class="xr-act">' +
      (isReply ? '' : '<button data-a="reply" data-id="' + c.id + '">Reply</button>') +
      (c.pin && !isReply ? '<button data-a="goto" data-id="' + c.id + '">Show on page</button>' : '') +
      (!isReply && can ? '<button data-a="resolve" data-id="' + c.id + '" data-v="' + (c.resolved ? 0 : 1) + '">' + (c.resolved ? 'Reopen' : 'Resolve') + '</button>' : '') +
      (can ? '<button class="xr-del" data-a="del" data-id="' + c.id + '">Delete</button>' : '') + '</div></div></div>';
  }

  function renderList() {
    var all = XMStore.commentsFor(idea.id), nums = pinNumbers();
    var tops = all.filter(function (c) { return !c.parent; }).sort(function (a, b) { return (a.resolved - b.resolved) || (b.ts - a.ts); });
    if (!tops.length) { list.innerHTML = '<div class="xr-empty">' + ic('msg') + 'No comments on this idea yet.<br>Leave a question, a concern or a suggestion — or drop a pin directly on the design.</div>'; return; }
    var keep = {}; Array.prototype.forEach.call(list.querySelectorAll('.xr-reply.xr-open'), function (r) { keep[r.getAttribute('data-for')] = r.querySelector('textarea').value; });
    list.innerHTML = tops.map(function (t) {
      var reps = all.filter(function (r) { return r.parent === t.id; }).sort(function (a, b) { return a.ts - b.ts; });
      return '<div class="xr-th' + (t.resolved ? ' xr-res' : '') + '" data-th="' + t.id + '">' + commentHTML(t, nums) + reps.map(function (r) { return commentHTML(r, nums, true); }).join('') +
        '<div class="xr-reply" data-for="' + t.id + '"><textarea rows="1" placeholder="Reply…"></textarea><button class="xr-send" data-a="send-reply" data-id="' + t.id + '">Send</button></div></div>';
    }).join('');
    Object.keys(keep).forEach(function (id) { var r = list.querySelector('.xr-reply[data-for="' + id + '"]'); if (r) { r.classList.add('xr-open'); r.querySelector('textarea').value = keep[id]; } });
  }

  function renderPins() {
    if (!pinsEl) return;
    var docW = document.documentElement.scrollWidth, nums = pinNumbers();
    pinsEl.style.width = docW + 'px';
    pinsEl.innerHTML = XMStore.commentsFor(idea.id).filter(function (c) { return c.pin && !c.parent; }).map(function (c) {
      return '<div class="xr-pin' + (c.resolved ? ' xr-resp' : '') + '" data-id="' + c.id + '" data-a="pin-open" style="left:' + (c.pin.x * docW).toFixed(0) + 'px;top:' + c.pin.y + 'px" title="' + esc(c.text.slice(0, 80)) + '">' + nums[c.id] + '</div>';
    }).join('');
  }

  function openDrawer(v) { drawer.classList.toggle('xr-open', v); closePop(); if (v) markSeen(); }
  function closePop() { pop.classList.remove('xr-open'); }
  function needId(cb) { if (XMStore.identity) return cb(); afterIdentity = cb; idModal.classList.add('xr-open'); setTimeout(function () { root.querySelector('[data-r=name]').focus(); }, 50); }

  function post(payload) {
    needId(function () {
      XMStore.addComment(payload).then(function () { toast('Comment posted'); });
    });
  }
  function toast(m) { if (window.XM && XM.toast) XM.toast(m); }

  function cancelPin() {
    pinMode = false; document.body.classList.remove('xr-pinmode'); modeBar.classList.remove('xr-show');
    root.querySelector('[data-a=pin]').classList.remove('xr-on');
    var t = document.querySelector('.xr-pc'); if (t) t.remove(); var tp = document.querySelector('.xr-tmp'); if (tp) tp.remove(); pending = null;
  }

  function labelFor(el) {
    if (!el) return '';
    var t = (el.getAttribute('aria-label') || el.innerText || el.alt || el.placeholder || '').trim().replace(/\s+/g, ' ');
    if (!t) { var h = el.closest('section,header,footer,article,div'); t = h ? (h.querySelector('h1,h2,h3') || {}).textContent || '' : ''; t = t.trim(); }
    return t.slice(0, 60);
  }

  function onDocClick(e) {
    if (!pinMode) return;
    if (e.target.closest('.xr') || e.target.closest('.xr-pc')) return;
    e.preventDefault(); e.stopPropagation();
    var docW = document.documentElement.scrollWidth;
    var x = e.pageX / docW, y = e.pageY;
    pending = { x: +x.toFixed(4), y: Math.round(y), label: labelFor(e.target) };
    var old = document.querySelector('.xr-pc'); if (old) old.remove(); var op = document.querySelector('.xr-tmp'); if (op) op.remove();
    var tp = document.createElement('div'); tp.className = 'xr-pin xr-tmp'; tp.style.left = e.pageX + 'px'; tp.style.top = e.pageY + 'px'; tp.textContent = '+'; pinsEl.appendChild(tp);
    var pc = document.createElement('div'); pc.className = 'xr xr-pc';
    var left = Math.min(Math.max(8, e.pageX + 18), docW - 340), top = e.pageY - 20;
    pc.style.left = left + 'px'; pc.style.top = top + 'px';
    pc.innerHTML = '<div class="xr-types">' + Object.keys(TYPES).map(function (k) { return '<button data-a="ptype" data-t="' + k + '" class="' + (k === type ? 'xr-on' : '') + '" style="' + (k === type ? 'background:' + TYPE_COLOR[k] : '') + '">' + TYPES[k] + '</button>'; }).join('') + '</div>' +
      (pending.label ? '<div class="xr-on-el">On: ' + esc(pending.label) + '</div>' : '') +
      '<textarea rows="3" placeholder="What should we know about this spot?"></textarea><div class="xr-foot"><button class="xr-ghost" data-a="pin-cancel">Cancel</button><button class="xr-send" data-a="pin-post" disabled>Post</button></div>';
    document.body.appendChild(pc);
    var ta = pc.querySelector('textarea'); ta.focus();
    ta.addEventListener('input', function () { pc.querySelector('[data-a=pin-post]').disabled = !ta.value.trim(); });
    pc.addEventListener('click', onClick);
    // keep exactly one handler path: stop bubbling to document
    pc.addEventListener('click', function (ev) { ev.stopPropagation(); });
  }

  function closeId() { idModal.classList.remove('xr-open'); afterIdentity = null; }

  function onClick(e) {
    var t = e.target.closest('[data-a]'); if (!t) return;
    var a = t.getAttribute('data-a'), id = t.getAttribute('data-id');
    if (a === 'id-backdrop') { if (e.target === t) closeId(); return; }
    if (a === 'id-close') { closeId(); return; }
    if (a === 'vote') { needId(function () { XMStore.toggleVote(idea.id).then(function () { if (XMStore.votedBy(idea.id, XMStore.identity)) toast('Thanks — your support is recorded'); }); }); }
    else if (a === 'drawer') { openDrawer(!drawer.classList.contains('xr-open')); }
    else if (a === 'drawer-close') openDrawer(false);
    else if (a === 'hide') { dock.classList.add('xr-off'); tab.classList.add('xr-show'); openDrawer(false); pinsEl.style.display = 'none'; }
    else if (a === 'show') { dock.classList.remove('xr-off'); tab.classList.remove('xr-show'); pinsEl.style.display = ''; }
    else if (a === 'switch') { openSwitcher(); }
    else if (a === 'type') { type = t.getAttribute('data-t'); renderTypes(); }
    else if (a === 'ptype') { type = t.getAttribute('data-t'); Array.prototype.forEach.call(t.parentNode.children, function (b) { var on = b === t; b.classList.toggle('xr-on', on); b.style.background = on ? TYPE_COLOR[type] : ''; }); }
    else if (a === 'post') {
      var ta = root.querySelector('[data-r=text]'); var txt = ta.value.trim(); if (!txt) return;
      post({ idea: idea.id, text: txt, type: type, parent: null, pin: null }); ta.value = ''; t.disabled = true;
    }
    else if (a === 'pin') { if (pinMode) return cancelPin(); pinMode = true; openDrawer(false); document.body.classList.add('xr-pinmode'); modeBar.classList.add('xr-show'); t.classList.add('xr-on'); }
    else if (a === 'pin-cancel') cancelPin();
    else if (a === 'pin-post') {
      var pc = t.closest('.xr-pc'), txt2 = pc.querySelector('textarea').value.trim(); if (!txt2 || !pending) return;
      var p = pending; post({ idea: idea.id, text: txt2, type: type, parent: null, pin: p }); cancelPin();
    }
    else if (a === 'pin-open') { openDrawer(true); focusThread(id); }
    else if (a === 'goto') { var c = XMStore.state.comments.filter(function (x) { return x.id === id; })[0]; if (c && c.pin) { window.scrollTo({ top: Math.max(0, c.pin.y - 200), behavior: 'smooth' }); var pe = pinsEl.querySelector('[data-id="' + id + '"]'); if (pe) { pe.classList.remove('xr-pulse'); void pe.offsetWidth; pe.classList.add('xr-pulse'); } if (window.innerWidth < 900) openDrawer(false); } }
    else if (a === 'reply') { var r = list.querySelector('.xr-reply[data-for="' + id + '"]'); r.classList.toggle('xr-open'); if (r.classList.contains('xr-open')) r.querySelector('textarea').focus(); }
    else if (a === 'send-reply') {
      var box = t.closest('.xr-reply'), rt = box.querySelector('textarea'), v = rt.value.trim(); if (!v) return;
      post({ idea: idea.id, text: v, type: 'comment', parent: id, pin: null }); rt.value = ''; box.classList.remove('xr-open');
    }
    else if (a === 'resolve') XMStore.resolve(id, t.getAttribute('data-v') === '1');
    else if (a === 'del') { if (confirm('Delete this comment? Replies to it are removed too.')) XMStore.remove(id); }
    else if (a === 'id-save') {
      var nm = root.querySelector('[data-r=name]').value.trim(); if (!nm) { root.querySelector('[data-r=name]').focus(); return; }
      var rl = root.querySelector('[data-r=role]').value; if (!rl) { root.querySelector('[data-r=role]').focus(); return; }
      XMStore.setIdentity(nm, rl); idModal.classList.remove('xr-open');
      if (afterIdentity) { var f = afterIdentity; afterIdentity = null; f(); }
    }
    else if (a === 'id-change') { var cur = XMStore.identity; if (cur) { root.querySelector('[data-r=name]').value = cur.name; root.querySelector('[data-r=role]').value = cur.role; } afterIdentity = null; idModal.classList.add('xr-open'); }
  }

  function focusThread(id) {
    var th = list.querySelector('[data-th="' + id + '"]'); if (!th) { var c = XMStore.state.comments.filter(function (x) { return x.id === id; })[0]; if (c && c.parent) th = list.querySelector('[data-th="' + c.parent + '"]'); }
    if (!th) return; th.scrollIntoView({ block: 'center', behavior: 'smooth' }); th.classList.add('xr-flash'); setTimeout(function () { th.classList.remove('xr-flash'); }, 2200);
  }

  var swHl = 0;
  function seenMap() { try { return JSON.parse(localStorage.getItem('xm.seen') || '{}'); } catch (e) { return {}; } }
  function markSeen() { var m = seenMap(); m[idea.id] = XMStore.countFor(idea.id); try { localStorage.setItem('xm.seen', JSON.stringify(m)); } catch (e) {} }
  function buildSwitcher(q) {
    q = (q || '').trim().toLowerCase();
    var seen = seenMap(), J = (window.XM_JOURNEYS || []).filter(function (j) { return j.steps.indexOf(idea.id) > -1; })[0];
    var head = pop.querySelector('.xr-sw-h');
    if (!head) {
      pop.innerHTML = '<div class="xr-sw-h"><input data-r="swq" placeholder="Search ideas, or type a number" aria-label="Search ideas" autocomplete="off"><div class="xr-sw-j" data-r="swj"></div></div><div class="xr-sw-l" data-r="swl"></div>' +
        '<div class="xr-sw-f"><span><kbd>&uarr;</kbd> <kbd>&darr;</kbd> move</span><span><kbd>Enter</kbd> open</span><span><kbd>[</kbd> <kbd>]</kbd> previous / next</span><span><kbd>Esc</kbd> close</span></div>';
      pop.querySelector('[data-r=swq]').addEventListener('input', function (e) { swHl = 0; buildSwitcher(e.target.value); });
    }
    pop.querySelector('[data-r=swj]').innerHTML = J ? '<small>' + esc(J.label) + '</small>' + J.steps.map(function (id) {
      var i = ideas.filter(function (x) { return x.id === id; })[0];
      return '<a class="' + (id === idea.id ? 'xr-cur ' : '') + (i && i.path ? '' : 'xr-na') + '" href="' + (i && i.path ? ROOT + i.path : '#') + '" title="' + esc(i ? i.title : '') + '">' + id + '</a>';
    }).join('<i></i>') : '';
    var html = '', last = null, any = false;
    ideas.forEach(function (i) {
      if (q && (i.id + ' ' + i.title + ' ' + i.short + ' slide ' + i.slide).toLowerCase().indexOf(q) < 0) return;
      any = true;
      if (i.wave !== last) { last = i.wave; var W = (window.XM_WAVES || {})[i.wave]; html += '<div class="xr-sw-w">' + esc(W ? W.label + ' · ' + W.theme : '') + '</div>'; }
      var n = XMStore.countFor(i.id), fresh = n > (seen[i.id] || 0) && i.id !== idea.id;
      html += '<a data-sw class="' + (i.id === idea.id ? 'xr-cur ' : '') + (i.path ? '' : 'xr-na') + '" href="' + (i.path ? ROOT + i.path : '#') + '"><b>' + i.id + '</b><span>' + esc(i.title) + '<br><em>Slide ' + i.slide + (i.path ? '' : ' · not prototyped') + '</em></span>' + (fresh ? '<i class="xr-dot" title="New comments"></i>' : '') + (n ? '<em>' + n + ' comments</em>' : '') + '</a>';
    });
    var L = pop.querySelector('[data-r=swl]'); L.innerHTML = any ? html : '<div class="xr-empty">No idea matches.</div>';
    hl(0);
  }
  function swItems() { return Array.prototype.filter.call(pop.querySelectorAll('[data-sw]'), function (a) { return !a.classList.contains('xr-na'); }); }
  function hl(d, abs) {
    var it = swItems(); if (!it.length) return;
    swHl = abs ? d : Math.max(0, Math.min(it.length - 1, swHl + d));
    it.forEach(function (a, k) { a.classList.toggle('xr-hl', k === swHl); });
    var cur = it[swHl]; if (cur && cur.scrollIntoView) cur.scrollIntoView({ block: 'nearest' });
  }
  function openSwitcher() {
    var show = !pop.classList.contains('xr-open');
    if (!show) return closePop();
    swHl = 0; var q = pop.querySelector('[data-r=swq]'); if (q) q.value = '';
    buildSwitcher(''); pop.classList.add('xr-open');
    setTimeout(function () { pop.querySelector('[data-r=swq]').focus(); }, 30);
  }
  function go(el) { if (el && el.href) location.href = el.href; }

  var buildsAll = function () { return ideas.filter(function (i) { return i.path; }); };
  document.addEventListener('keydown', function (e) {
    var t = e.target, typing = t && (/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t.isContentEditable);
    if (pop && pop.classList.contains('xr-open')) {
      if (e.key === 'ArrowDown') { e.preventDefault(); hl(1); return; }
      if (e.key === 'ArrowUp') { e.preventDefault(); hl(-1); return; }
      if (e.key === 'Enter') { e.preventDefault(); go(swItems()[swHl]); return; }
      if (e.key === 'Escape') { closePop(); return; }
    }
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openSwitcher(); return; }
    if (typing || e.metaKey || e.ctrlKey || e.altKey || document.querySelector('.xr-modal.xr-open')) return;
    var k = e.key, b = buildsAll(), bi = b.indexOf(idea);
    if (k === '/') { e.preventDefault(); openSwitcher(); }
    else if (k === '[' && b[bi - 1]) location.href = ROOT + b[bi - 1].path;
    else if (k === ']' && b[bi + 1]) location.href = ROOT + b[bi + 1].path;
    else if (k === 't' || k === 'T') location.href = ROOT + 'index.html#' + idea.id;
    else if (k === 'c' || k === 'C') openDrawer(!drawer.classList.contains('xr-open'));
    else if (k === 'p' || k === 'P') root.querySelector('[data-a=pin]').click();
    else if (k === 'h' || k === 'H') root.querySelector(dock.classList.contains('xr-off') ? '[data-a=show]' : '[data-a=hide]').click();
  });
  document.addEventListener('click', function (e) { if (pop && !e.target.closest('.xr-pop') && !e.target.closest('[data-a=switch]')) closePop(); });

  function handleDeepLink() {
    var p = new URLSearchParams(location.search).get('pin'); if (!p) return;
    var c = XMStore.state.comments.filter(function (x) { return x.id === p; })[0]; if (!c) return;
    openDrawer(true); setTimeout(function () {
      focusThread(p);
      if (c.pin) { window.scrollTo({ top: Math.max(0, c.pin.y - 220), behavior: 'smooth' }); var pe = pinsEl.querySelector('[data-id="' + p + '"]'); if (pe) pe.classList.add('xr-pulse'); }
    }, 500);
  }

  window.XMReview = { open: function () { openDrawer(true); }, idea: function () { return idea; } };
})();
