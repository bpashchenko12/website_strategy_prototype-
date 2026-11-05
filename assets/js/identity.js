/* Small shared identity prompt (name + role) used by the tree and the comments page. */
(function () {
  var ROLES = ['CEO', 'Executive', 'Product Manager', 'Marketing', 'Engineering', 'Design', 'Compliance', 'Support', 'Other'];
  var el, resolve;
  function build() {
    var st = document.createElement('style');
    st.textContent = '.xi{position:fixed;inset:0;z-index:5000;background:rgba(10,12,15,.6);display:none;align-items:flex-start;justify-content:center;padding:20px;overflow-y:auto;overscroll-behavior:contain;backdrop-filter:blur(4px)}.xi.on{display:flex}.xi .x{position:absolute;top:14px;right:14px;width:36px;height:36px;border-radius:50%;border:0;background:#f1f2f4;color:#3c434b;font-size:20px;line-height:1;cursor:pointer}.xi .x:hover{background:#e4e6ea}.xi .no{width:100%;margin-top:8px;height:44px;border:0;border-radius:12px;background:transparent;color:#5b6470;font:inherit;font-weight:600;cursor:pointer}.xi .no:hover{background:#f3f4f6;color:#1d2024}.xi .m{position:relative;margin:auto;background:#fff;border-radius:22px;padding:28px;width:100%;max-width:400px;box-shadow:0 30px 80px rgba(0,0,0,.4);animation:fadeUp .25s}.xi h3{margin:0 0 4px;font-size:20px}.xi p{margin:0 0 14px;font-size:13.5px;color:#5b6470;line-height:1.5}.xi label{display:block;font-size:12px;font-weight:600;margin:12px 0 5px;color:#4a5058}.xi input,.xi select{width:100%;height:46px;border-radius:10px;border:1.5px solid #e1e4e8;padding:0 12px;font:inherit;font-size:14px;outline:none;background:#fff}.xi input:focus,.xi select:focus{border-color:#008454;box-shadow:0 0 0 3px rgba(0,132,84,.12)}.xi .go{width:100%;margin-top:18px;height:48px;border:0;border-radius:12px;background:#008454;color:#fff;font:inherit;font-weight:600;cursor:pointer}';
    document.head.appendChild(st);
    el = document.createElement('div'); el.className = 'xi';
    el.innerHTML = '<div class="m" role="dialog" aria-modal="true"><button class="x" aria-label="Close">×</button><h3>Who is this?</h3><p>Your name appears next to your votes and comments. No account needed.</p><label>Your name</label><input id="xi-n" maxlength="40" placeholder="e.g. Alex Tanaka" autocomplete="name"><label>Role</label><select id="xi-r"><option value="" disabled selected>Select your role</option>' + ROLES.map(function (r) { return '<option>' + r + '</option>'; }).join('') + '</select><button class="go">Continue</button><button class="no">Not now</button></div>';
    document.body.appendChild(el);
    var go = function () {
      var n = el.querySelector('#xi-n').value.trim(); if (!n) { el.querySelector('#xi-n').focus(); return; }
      if (!el.querySelector('#xi-r').value) { el.querySelector('#xi-r').focus(); return; }
      var id = XMStore.setIdentity(n, el.querySelector('#xi-r').value); el.classList.remove('on'); if (resolve) resolve(id);
    };
    el.querySelector('.go').addEventListener('click', go);
    el.querySelector('#xi-n').addEventListener('keydown', function (e) { if (e.key === 'Enter') go(); });
    var close = function () { el.classList.remove('on'); };
    el.querySelector('.x').addEventListener('click', close);
    el.querySelector('.no').addEventListener('click', close);
    el.addEventListener('click', function (e) { if (e.target === el) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && el.classList.contains('on')) close(); });
  }
  window.XMIdentity = {
    ensure: function (force) {
      if (XMStore.identity && !force) return Promise.resolve(XMStore.identity);
      if (!el) build();
      var cur = XMStore.identity; if (cur) { el.querySelector('#xi-n').value = cur.name; el.querySelector('#xi-r').value = cur.role; }
      el.classList.add('on'); setTimeout(function () { el.querySelector('#xi-n').focus(); }, 50);
      return new Promise(function (r) { resolve = r; });
    }
  };
})();
