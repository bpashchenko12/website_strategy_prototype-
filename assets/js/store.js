/* Shared store for votes and comments.
   Talks to server.py (/api/state, /api/op) so every reviewer sees the same data.
   If the API is not reachable (e.g. opened from a static host or file://) it falls back to localStorage. */
(function () {
  var LS_STATE = 'xmproto.state.v1';
  var LS_ID = 'xmproto.identity.v1';
  var listeners = [];
  var S = { mode: 'local', state: { votes: {}, comments: [] }, identity: null, ready: false };

  function uid() { return 'c' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
  var COLORS = ['#008454', '#2f62f0', '#c26a00', '#8a3fd1', '#d6336c', '#0b7285', '#5f3dc4', '#e8590c'];
  function colorFor(name) { var h = 0; for (var i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0; return COLORS[h % COLORS.length]; }

  function reduce(state, op) {
    var s = JSON.parse(JSON.stringify(state));
    s.votes = s.votes || {}; s.comments = s.comments || [];
    if (op.type === 'add_comment') {
      var c = op.comment; c.id = c.id || uid(); c.ts = c.ts || Date.now(); c.resolved = false;
      s.comments.push(c);
    } else if (op.type === 'toggle_vote') {
      var v = s.votes[op.idea] = s.votes[op.idea] || {};
      if (v[op.user.id]) delete v[op.user.id]; else v[op.user.id] = { name: op.user.name, role: op.user.role, ts: Date.now() };
    } else if (op.type === 'resolve') {
      s.comments.forEach(function (c) { if (c.id === op.id) c.resolved = !!op.value; });
    } else if (op.type === 'delete') {
      var ids = {}; ids[op.id] = 1;
      s.comments.forEach(function (c) { if (c.parent && ids[c.parent]) ids[c.id] = 1; });
      s.comments = s.comments.filter(function (c) { return !ids[c.id]; });
    } else if (op.type === 'seed') {
      s.comments = s.comments.concat(op.comments);
      Object.keys(op.votes || {}).forEach(function (k) { s.votes[k] = Object.assign(s.votes[k] || {}, op.votes[k]); });
    } else if (op.type === 'reset') {
      s = { votes: {}, comments: [] };
    }
    return s;
  }

  function emit() { listeners.forEach(function (fn) { try { fn(S.state); } catch (e) { console.error(e); } }); }
  function loadLocal() { try { return JSON.parse(localStorage.getItem(LS_STATE)) || { votes: {}, comments: [] }; } catch (e) { return { votes: {}, comments: [] }; } }
  function saveLocal(s) { try { localStorage.setItem(LS_STATE, JSON.stringify(s)); } catch (e) {} }

  function fetchJSON(url, opts) {
    return fetch(url, opts).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); });
  }

  function pull() {
    if (S.mode !== 'api') { var l = loadLocal(); if (JSON.stringify(l) !== JSON.stringify(S.state)) { S.state = l; emit(); } return Promise.resolve(); }
    return fetchJSON(XMStore.apiBase + 'api/state').then(function (st) {
      if (JSON.stringify(st) !== JSON.stringify(S.state)) { S.state = st; emit(); }
    }).catch(function () {});
  }

  function dispatch(op) {
    if (S.mode === 'api') {
      S.state = reduce(S.state, op); emit(); // optimistic
      return fetchJSON(XMStore.apiBase + 'api/op', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(op) })
        .then(function (st) { S.state = st; emit(); }).catch(function () { return pull(); });
    }
    S.state = reduce(loadLocal(), op); saveLocal(S.state); emit();
    return Promise.resolve();
  }

  var XMStore = {
    apiBase: '/',
    get state() { return S.state; },
    get mode() { return S.mode; },
    get identity() {
      if (S.identity) return S.identity;
      try { S.identity = JSON.parse(localStorage.getItem(LS_ID)); } catch (e) {}
      return S.identity;
    },
    setIdentity: function (name, role) {
      var cur = this.identity;
      S.identity = { id: (cur && cur.id) || uid(), name: name.trim(), role: role, color: colorFor(name.trim()), owner: role === 'Product Manager' };
      try { localStorage.setItem(LS_ID, JSON.stringify(S.identity)); } catch (e) {}
      emit(); return S.identity;
    },
    clearIdentity: function () { S.identity = null; try { localStorage.removeItem(LS_ID); } catch (e) {} emit(); },
    on: function (fn) { listeners.push(fn); },
    init: function (apiBase) {
      if (apiBase) XMStore.apiBase = apiBase;
      if (S.ready) return Promise.resolve(S);
      S.ready = true;
      var tryApi = location.protocol.indexOf('http') === 0;
      var p = tryApi ? fetchJSON(XMStore.apiBase + 'api/state') : Promise.reject();
      return p.then(function (st) { S.mode = 'api'; S.state = st; }, function () { S.mode = 'local'; S.state = loadLocal(); })
        .then(function () {
          emit();
          setInterval(pull, 4000);
          window.addEventListener('storage', function (e) { if (e.key === LS_STATE) pull(); });
          return S;
        });
    },
    addComment: function (c) {
      var id = this.identity; if (!id) return Promise.reject(new Error('identity'));
      c.author = { id: id.id, name: id.name, role: id.role, color: id.color, owner: id.owner };
      c.id = uid(); c.ts = Date.now();
      return dispatch({ type: 'add_comment', comment: c });
    },
    toggleVote: function (idea) { var id = this.identity; return dispatch({ type: 'toggle_vote', idea: idea, user: { id: id.id, name: id.name, role: id.role } }); },
    resolve: function (id, value) { return dispatch({ type: 'resolve', id: id, value: value }); },
    remove: function (id) { return dispatch({ type: 'delete', id: id }); },
    seed: function (payload) { return dispatch(Object.assign({ type: 'seed' }, payload)); },
    reset: function () { return dispatch({ type: 'reset' }); },
    // derived helpers
    votesFor: function (idea) { return Object.keys(S.state.votes[idea] || {}).length; },
    votedBy: function (idea, user) { return !!(user && (S.state.votes[idea] || {})[user.id]); },
    voters: function (idea) { var v = S.state.votes[idea] || {}; return Object.keys(v).map(function (k) { return v[k]; }); },
    commentsFor: function (idea) { return S.state.comments.filter(function (c) { return c.idea === idea; }); },
    countFor: function (idea) { return S.state.comments.filter(function (c) { return c.idea === idea; }).length; },
    openThreads: function (idea) { return S.state.comments.filter(function (c) { return c.idea === idea && !c.parent && !c.resolved; }).length; }
  };
  window.XMStore = XMStore;
})();
