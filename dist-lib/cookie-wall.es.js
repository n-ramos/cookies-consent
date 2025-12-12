let gt = !1;
function Gn(e, t) {
  if (!e.vendors?.googleConsentMode?.enabled || typeof window > "u" || typeof window.gtag != "function")
    return;
  const n = /* @__PURE__ */ new Set();
  for (const i of e.categories) {
    if (!i.googleConsentMode) continue;
    (Array.isArray(i.googleConsentMode) ? i.googleConsentMode : [i.googleConsentMode]).forEach((s) => n.add(s));
  }
  if (!gt && n.size > 0) {
    const i = {};
    for (const o of n)
      i[o] = "denied";
    window.gtag("consent", "default", i), gt = !0;
  }
  const r = {};
  for (const i of e.categories) {
    if (!i.googleConsentMode) continue;
    const o = t.categories[i.key], s = Array.isArray(i.googleConsentMode) ? i.googleConsentMode : [i.googleConsentMode];
    for (const a of s)
      r[a] = o;
  }
  Object.keys(r).length > 0 && window.gtag("consent", "update", r);
}
function Yn(e) {
  const t = `script[type="text/plain"][data-cookie-category="${e}"]`, n = document.querySelectorAll(t);
  console.log("[CookieWall] activating scripts for", e, "found:", n.length), n.forEach((r) => {
    const i = document.createElement("script");
    for (const o of Array.from(r.attributes))
      o.name !== "type" && i.setAttribute(o.name, o.value);
    r.textContent && (i.textContent = r.textContent), r.replaceWith(i);
  });
}
function Xn(e) {
  const t = window.location.hostname, n = [t, "." + t], r = ["/"];
  n.forEach((i) => {
    r.forEach((o) => {
      document.cookie = `${e}=; Max-Age=0; path=${o}; domain=${i}; SameSite=Lax`;
    });
  }), document.cookie = `${e}=; Max-Age=0; path=/;`;
}
function xt(e, t) {
  const n = t.cookieCleanup?.[e];
  if (!n || n.length === 0) return;
  document.cookie.split(";").forEach((i) => {
    const [o] = i.split("="), s = o.trim();
    s && n.some((a) => s.startsWith(a)) && Xn(s);
  });
}
class Zn {
  constructor(t) {
    this.conf = t, this.storageKey = t.storageKey ?? "cookie-wall-consent", this.state = this.load() ?? this.initial(), this.applyEffects();
  }
  initial() {
    const t = {};
    for (const n of this.conf.categories)
      t[n.key] = n.required ? "granted" : n.default ?? "denied";
    return {
      categories: t,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      version: this.conf.version
    };
  }
  load() {
    try {
      const t = localStorage.getItem(this.storageKey);
      if (!t) return null;
      const n = JSON.parse(t);
      return n.version !== this.conf.version ? null : n;
    } catch {
      return null;
    }
  }
  save() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.state));
    } catch {
    }
  }
  applyEffects() {
    Gn(this.conf, this.state), Object.entries(this.state.categories).forEach(([t, n]) => {
      n === "granted" && Yn(t);
    });
  }
  update() {
    this.save(), this.applyEffects();
  }
  // === API publique ===
  acceptAll() {
    Object.keys(this.state.categories).forEach((t) => {
      this.state.categories[t] = "granted";
    }), this.update();
  }
  rejectAll() {
    const t = { ...this.state.categories };
    for (const n of this.conf.categories)
      this.state.categories[n.key] = n.required ? "granted" : "denied";
    this.update();
    for (const [n, r] of Object.entries(t)) {
      const i = this.state.categories[n];
      r === "granted" && i === "denied" && xt(n, this.conf);
    }
  }
  setCategory(t, n) {
    const r = this.state.categories[t];
    this.state.categories[t] = n, this.update(), r === "granted" && n === "denied" && xt(t, this.conf);
  }
  getState() {
    return this.state;
  }
}
var Te = !1, Ie = !1, N = [], Pe = -1;
function Qn(e) {
  er(e);
}
function er(e) {
  N.includes(e) || N.push(e), nr();
}
function tr(e) {
  let t = N.indexOf(e);
  t !== -1 && t > Pe && N.splice(t, 1);
}
function nr() {
  !Ie && !Te && (Te = !0, queueMicrotask(rr));
}
function rr() {
  Te = !1, Ie = !0;
  for (let e = 0; e < N.length; e++)
    N[e](), Pe = e;
  N.length = 0, Pe = -1, Ie = !1;
}
var W, q, J, Pt, je = !0;
function ir(e) {
  je = !1, e(), je = !0;
}
function or(e) {
  W = e.reactive, J = e.release, q = (t) => e.effect(t, { scheduler: (n) => {
    je ? Qn(n) : n();
  } }), Pt = e.raw;
}
function yt(e) {
  q = e;
}
function sr(e) {
  let t = () => {
  };
  return [(r) => {
    let i = q(r);
    return e._x_effects || (e._x_effects = /* @__PURE__ */ new Set(), e._x_runEffects = () => {
      e._x_effects.forEach((o) => o());
    }), e._x_effects.add(i), t = () => {
      i !== void 0 && (e._x_effects.delete(i), J(i));
    }, i;
  }, () => {
    t();
  }];
}
function jt(e, t) {
  let n = !0, r, i = q(() => {
    let o = e();
    JSON.stringify(o), n ? r = o : queueMicrotask(() => {
      t(o, r), r = o;
    }), n = !1;
  });
  return () => J(i);
}
var Lt = [], Rt = [], Nt = [];
function ar(e) {
  Nt.push(e);
}
function Ve(e, t) {
  typeof t == "function" ? (e._x_cleanups || (e._x_cleanups = []), e._x_cleanups.push(t)) : (t = e, Rt.push(t));
}
function Kt(e) {
  Lt.push(e);
}
function Ft(e, t, n) {
  e._x_attributeCleanups || (e._x_attributeCleanups = {}), e._x_attributeCleanups[t] || (e._x_attributeCleanups[t] = []), e._x_attributeCleanups[t].push(n);
}
function Dt(e, t) {
  e._x_attributeCleanups && Object.entries(e._x_attributeCleanups).forEach(([n, r]) => {
    (t === void 0 || t.includes(n)) && (r.forEach((i) => i()), delete e._x_attributeCleanups[n]);
  });
}
function cr(e) {
  for (e._x_effects?.forEach(tr); e._x_cleanups?.length; )
    e._x_cleanups.pop()();
}
var Ge = new MutationObserver(Qe), Ye = !1;
function Xe() {
  Ge.observe(document, { subtree: !0, childList: !0, attributes: !0, attributeOldValue: !0 }), Ye = !0;
}
function Bt() {
  lr(), Ge.disconnect(), Ye = !1;
}
var X = [];
function lr() {
  let e = Ge.takeRecords();
  X.push(() => e.length > 0 && Qe(e));
  let t = X.length;
  queueMicrotask(() => {
    if (X.length === t)
      for (; X.length > 0; )
        X.shift()();
  });
}
function x(e) {
  if (!Ye)
    return e();
  Bt();
  let t = e();
  return Xe(), t;
}
var Ze = !1, _e = [];
function ur() {
  Ze = !0;
}
function fr() {
  Ze = !1, Qe(_e), _e = [];
}
function Qe(e) {
  if (Ze) {
    _e = _e.concat(e);
    return;
  }
  let t = [], n = /* @__PURE__ */ new Set(), r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
  for (let o = 0; o < e.length; o++)
    if (!e[o].target._x_ignoreMutationObserver && (e[o].type === "childList" && (e[o].removedNodes.forEach((s) => {
      s.nodeType === 1 && s._x_marker && n.add(s);
    }), e[o].addedNodes.forEach((s) => {
      if (s.nodeType === 1) {
        if (n.has(s)) {
          n.delete(s);
          return;
        }
        s._x_marker || t.push(s);
      }
    })), e[o].type === "attributes")) {
      let s = e[o].target, a = e[o].attributeName, c = e[o].oldValue, l = () => {
        r.has(s) || r.set(s, []), r.get(s).push({ name: a, value: s.getAttribute(a) });
      }, u = () => {
        i.has(s) || i.set(s, []), i.get(s).push(a);
      };
      s.hasAttribute(a) && c === null ? l() : s.hasAttribute(a) ? (u(), l()) : u();
    }
  i.forEach((o, s) => {
    Dt(s, o);
  }), r.forEach((o, s) => {
    Lt.forEach((a) => a(s, o));
  });
  for (let o of n)
    t.some((s) => s.contains(o)) || Rt.forEach((s) => s(o));
  for (let o of t)
    o.isConnected && Nt.forEach((s) => s(o));
  t = null, n = null, r = null, i = null;
}
function qt(e) {
  return oe(z(e));
}
function ie(e, t, n) {
  return e._x_dataStack = [t, ...z(n || e)], () => {
    e._x_dataStack = e._x_dataStack.filter((r) => r !== t);
  };
}
function z(e) {
  return e._x_dataStack ? e._x_dataStack : typeof ShadowRoot == "function" && e instanceof ShadowRoot ? z(e.host) : e.parentNode ? z(e.parentNode) : [];
}
function oe(e) {
  return new Proxy({ objects: e }, dr);
}
var dr = {
  ownKeys({ objects: e }) {
    return Array.from(
      new Set(e.flatMap((t) => Object.keys(t)))
    );
  },
  has({ objects: e }, t) {
    return t == Symbol.unscopables ? !1 : e.some(
      (n) => Object.prototype.hasOwnProperty.call(n, t) || Reflect.has(n, t)
    );
  },
  get({ objects: e }, t, n) {
    return t == "toJSON" ? pr : Reflect.get(
      e.find(
        (r) => Reflect.has(r, t)
      ) || {},
      t,
      n
    );
  },
  set({ objects: e }, t, n, r) {
    const i = e.find(
      (s) => Object.prototype.hasOwnProperty.call(s, t)
    ) || e[e.length - 1], o = Object.getOwnPropertyDescriptor(i, t);
    return o?.set && o?.get ? o.set.call(r, n) || !0 : Reflect.set(i, t, n);
  }
};
function pr() {
  return Reflect.ownKeys(this).reduce((t, n) => (t[n] = Reflect.get(this, n), t), {});
}
function zt(e) {
  let t = (r) => typeof r == "object" && !Array.isArray(r) && r !== null, n = (r, i = "") => {
    Object.entries(Object.getOwnPropertyDescriptors(r)).forEach(([o, { value: s, enumerable: a }]) => {
      if (a === !1 || s === void 0 || typeof s == "object" && s !== null && s.__v_skip)
        return;
      let c = i === "" ? o : `${i}.${o}`;
      typeof s == "object" && s !== null && s._x_interceptor ? r[o] = s.initialize(e, c, o) : t(s) && s !== r && !(s instanceof Element) && n(s, c);
    });
  };
  return n(e);
}
function Ht(e, t = () => {
}) {
  let n = {
    initialValue: void 0,
    _x_interceptor: !0,
    initialize(r, i, o) {
      return e(this.initialValue, () => _r(r, i), (s) => Le(r, i, s), i, o);
    }
  };
  return t(n), (r) => {
    if (typeof r == "object" && r !== null && r._x_interceptor) {
      let i = n.initialize.bind(n);
      n.initialize = (o, s, a) => {
        let c = r.initialize(o, s, a);
        return n.initialValue = c, i(o, s, a);
      };
    } else
      n.initialValue = r;
    return n;
  };
}
function _r(e, t) {
  return t.split(".").reduce((n, r) => n[r], e);
}
function Le(e, t, n) {
  if (typeof t == "string" && (t = t.split(".")), t.length === 1)
    e[t[0]] = n;
  else {
    if (t.length === 0)
      throw error;
    return e[t[0]] || (e[t[0]] = {}), Le(e[t[0]], t.slice(1), n);
  }
}
var Wt = {};
function M(e, t) {
  Wt[e] = t;
}
function Re(e, t) {
  let n = hr(t);
  return Object.entries(Wt).forEach(([r, i]) => {
    Object.defineProperty(e, `$${r}`, {
      get() {
        return i(t, n);
      },
      enumerable: !1
    });
  }), e;
}
function hr(e) {
  let [t, n] = Zt(e), r = { interceptor: Ht, ...t };
  return Ve(e, n), r;
}
function gr(e, t, n, ...r) {
  try {
    return n(...r);
  } catch (i) {
    re(i, e, t);
  }
}
function re(...e) {
  return Jt(...e);
}
var Jt = yr;
function xr(e) {
  Jt = e;
}
function yr(e, t, n = void 0) {
  e = Object.assign(
    e ?? { message: "No error message given." },
    { el: t, expression: n }
  ), console.warn(`Alpine Expression Error: ${e.message}

${n ? 'Expression: "' + n + `"

` : ""}`, t), setTimeout(() => {
    throw e;
  }, 0);
}
var de = !0;
function Ut(e) {
  let t = de;
  de = !1;
  let n = e();
  return de = t, n;
}
function K(e, t, n = {}) {
  let r;
  return E(e, t)((i) => r = i, n), r;
}
function E(...e) {
  return Vt(...e);
}
var Vt = Gt;
function br(e) {
  Vt = e;
}
function Gt(e, t) {
  let n = {};
  Re(n, e);
  let r = [n, ...z(e)], i = typeof t == "function" ? mr(r, t) : wr(r, t, e);
  return gr.bind(null, e, t, i);
}
function mr(e, t) {
  return (n = () => {
  }, { scope: r = {}, params: i = [], context: o } = {}) => {
    let s = t.apply(oe([r, ...e]), i);
    he(n, s);
  };
}
var Ae = {};
function vr(e, t) {
  if (Ae[e])
    return Ae[e];
  let n = Object.getPrototypeOf(async function() {
  }).constructor, r = /^[\n\s]*if.*\(.*\)/.test(e.trim()) || /^(let|const)\s/.test(e.trim()) ? `(async()=>{ ${e} })()` : e, o = (() => {
    try {
      let s = new n(
        ["__self", "scope"],
        `with (scope) { __self.result = ${r} }; __self.finished = true; return __self.result;`
      );
      return Object.defineProperty(s, "name", {
        value: `[Alpine] ${e}`
      }), s;
    } catch (s) {
      return re(s, t, e), Promise.resolve();
    }
  })();
  return Ae[e] = o, o;
}
function wr(e, t, n) {
  let r = vr(t, n);
  return (i = () => {
  }, { scope: o = {}, params: s = [], context: a } = {}) => {
    r.result = void 0, r.finished = !1;
    let c = oe([o, ...e]);
    if (typeof r == "function") {
      let l = r.call(a, r, c).catch((u) => re(u, n, t));
      r.finished ? (he(i, r.result, c, s, n), r.result = void 0) : l.then((u) => {
        he(i, u, c, s, n);
      }).catch((u) => re(u, n, t)).finally(() => r.result = void 0);
    }
  };
}
function he(e, t, n, r, i) {
  if (de && typeof t == "function") {
    let o = t.apply(n, r);
    o instanceof Promise ? o.then((s) => he(e, s, n, r)).catch((s) => re(s, i, t)) : e(o);
  } else typeof t == "object" && t instanceof Promise ? t.then((o) => e(o)) : e(t);
}
var et = "x-";
function U(e = "") {
  return et + e;
}
function Er(e) {
  et = e;
}
var ge = {};
function v(e, t) {
  return ge[e] = t, {
    before(n) {
      if (!ge[n]) {
        console.warn(String.raw`Cannot find directive \`${n}\`. \`${e}\` will use the default order of execution`);
        return;
      }
      const r = R.indexOf(n);
      R.splice(r >= 0 ? r : R.indexOf("DEFAULT"), 0, e);
    }
  };
}
function Sr(e) {
  return Object.keys(ge).includes(e);
}
function tt(e, t, n) {
  if (t = Array.from(t), e._x_virtualDirectives) {
    let o = Object.entries(e._x_virtualDirectives).map(([a, c]) => ({ name: a, value: c })), s = Yt(o);
    o = o.map((a) => s.find((c) => c.name === a.name) ? {
      name: `x-bind:${a.name}`,
      value: `"${a.value}"`
    } : a), t = t.concat(o);
  }
  let r = {};
  return t.map(tn((o, s) => r[o] = s)).filter(rn).map(Or(r, n)).sort(Mr).map((o) => Cr(e, o));
}
function Yt(e) {
  return Array.from(e).map(tn()).filter((t) => !rn(t));
}
var Ne = !1, ee = /* @__PURE__ */ new Map(), Xt = Symbol();
function Ar(e) {
  Ne = !0;
  let t = Symbol();
  Xt = t, ee.set(t, []);
  let n = () => {
    for (; ee.get(t).length; )
      ee.get(t).shift()();
    ee.delete(t);
  }, r = () => {
    Ne = !1, n();
  };
  e(n), r();
}
function Zt(e) {
  let t = [], n = (a) => t.push(a), [r, i] = sr(e);
  return t.push(i), [{
    Alpine: se,
    effect: r,
    cleanup: n,
    evaluateLater: E.bind(E, e),
    evaluate: K.bind(K, e)
  }, () => t.forEach((a) => a())];
}
function Cr(e, t) {
  let n = () => {
  }, r = ge[t.type] || n, [i, o] = Zt(e);
  Ft(e, t.original, o);
  let s = () => {
    e._x_ignore || e._x_ignoreSelf || (r.inline && r.inline(e, t, i), r = r.bind(r, e, t, i), Ne ? ee.get(Xt).push(r) : r());
  };
  return s.runCleanups = o, s;
}
var Qt = (e, t) => ({ name: n, value: r }) => (n.startsWith(e) && (n = n.replace(e, t)), { name: n, value: r }), en = (e) => e;
function tn(e = () => {
}) {
  return ({ name: t, value: n }) => {
    let { name: r, value: i } = nn.reduce((o, s) => s(o), { name: t, value: n });
    return r !== t && e(r, t), { name: r, value: i };
  };
}
var nn = [];
function nt(e) {
  nn.push(e);
}
function rn({ name: e }) {
  return on().test(e);
}
var on = () => new RegExp(`^${et}([^:^.]+)\\b`);
function Or(e, t) {
  return ({ name: n, value: r }) => {
    let i = n.match(on()), o = n.match(/:([a-zA-Z0-9\-_:]+)/), s = n.match(/\.[^.\]]+(?=[^\]]*$)/g) || [], a = t || e[n] || n;
    return {
      type: i ? i[1] : null,
      value: o ? o[1] : null,
      modifiers: s.map((c) => c.replace(".", "")),
      expression: r,
      original: a
    };
  };
}
var Ke = "DEFAULT", R = [
  "ignore",
  "ref",
  "data",
  "id",
  "anchor",
  "bind",
  "init",
  "for",
  "model",
  "modelable",
  "transition",
  "show",
  "if",
  Ke,
  "teleport"
];
function Mr(e, t) {
  let n = R.indexOf(e.type) === -1 ? Ke : e.type, r = R.indexOf(t.type) === -1 ? Ke : t.type;
  return R.indexOf(n) - R.indexOf(r);
}
function te(e, t, n = {}) {
  e.dispatchEvent(
    new CustomEvent(t, {
      detail: n,
      bubbles: !0,
      // Allows events to pass the shadow DOM barrier.
      composed: !0,
      cancelable: !0
    })
  );
}
function B(e, t) {
  if (typeof ShadowRoot == "function" && e instanceof ShadowRoot) {
    Array.from(e.children).forEach((i) => B(i, t));
    return;
  }
  let n = !1;
  if (t(e, () => n = !0), n)
    return;
  let r = e.firstElementChild;
  for (; r; )
    B(r, t), r = r.nextElementSibling;
}
function S(e, ...t) {
  console.warn(`Alpine Warning: ${e}`, ...t);
}
var bt = !1;
function $r() {
  bt && S("Alpine has already been initialized on this page. Calling Alpine.start() more than once can cause problems."), bt = !0, document.body || S("Unable to initialize. Trying to load Alpine before `<body>` is available. Did you forget to add `defer` in Alpine's `<script>` tag?"), te(document, "alpine:init"), te(document, "alpine:initializing"), Xe(), ar((t) => k(t, B)), Ve((t) => G(t)), Kt((t, n) => {
    tt(t, n).forEach((r) => r());
  });
  let e = (t) => !ye(t.parentElement, !0);
  Array.from(document.querySelectorAll(cn().join(","))).filter(e).forEach((t) => {
    k(t);
  }), te(document, "alpine:initialized"), setTimeout(() => {
    Pr();
  });
}
var rt = [], sn = [];
function an() {
  return rt.map((e) => e());
}
function cn() {
  return rt.concat(sn).map((e) => e());
}
function ln(e) {
  rt.push(e);
}
function un(e) {
  sn.push(e);
}
function ye(e, t = !1) {
  return V(e, (n) => {
    if ((t ? cn() : an()).some((i) => n.matches(i)))
      return !0;
  });
}
function V(e, t) {
  if (e) {
    if (t(e))
      return e;
    if (e._x_teleportBack && (e = e._x_teleportBack), !!e.parentElement)
      return V(e.parentElement, t);
  }
}
function kr(e) {
  return an().some((t) => e.matches(t));
}
var fn = [];
function Tr(e) {
  fn.push(e);
}
var Ir = 1;
function k(e, t = B, n = () => {
}) {
  V(e, (r) => r._x_ignore) || Ar(() => {
    t(e, (r, i) => {
      r._x_marker || (n(r, i), fn.forEach((o) => o(r, i)), tt(r, r.attributes).forEach((o) => o()), r._x_ignore || (r._x_marker = Ir++), r._x_ignore && i());
    });
  });
}
function G(e, t = B) {
  t(e, (n) => {
    cr(n), Dt(n), delete n._x_marker;
  });
}
function Pr() {
  [
    ["ui", "dialog", ["[x-dialog], [x-popover]"]],
    ["anchor", "anchor", ["[x-anchor]"]],
    ["sort", "sort", ["[x-sort]"]]
  ].forEach(([t, n, r]) => {
    Sr(n) || r.some((i) => {
      if (document.querySelector(i))
        return S(`found "${i}", but missing ${t} plugin`), !0;
    });
  });
}
var Fe = [], it = !1;
function ot(e = () => {
}) {
  return queueMicrotask(() => {
    it || setTimeout(() => {
      De();
    });
  }), new Promise((t) => {
    Fe.push(() => {
      e(), t();
    });
  });
}
function De() {
  for (it = !1; Fe.length; )
    Fe.shift()();
}
function jr() {
  it = !0;
}
function st(e, t) {
  return Array.isArray(t) ? mt(e, t.join(" ")) : typeof t == "object" && t !== null ? Lr(e, t) : typeof t == "function" ? st(e, t()) : mt(e, t);
}
function mt(e, t) {
  let n = (i) => i.split(" ").filter((o) => !e.classList.contains(o)).filter(Boolean), r = (i) => (e.classList.add(...i), () => {
    e.classList.remove(...i);
  });
  return t = t === !0 ? t = "" : t || "", r(n(t));
}
function Lr(e, t) {
  let n = (a) => a.split(" ").filter(Boolean), r = Object.entries(t).flatMap(([a, c]) => c ? n(a) : !1).filter(Boolean), i = Object.entries(t).flatMap(([a, c]) => c ? !1 : n(a)).filter(Boolean), o = [], s = [];
  return i.forEach((a) => {
    e.classList.contains(a) && (e.classList.remove(a), s.push(a));
  }), r.forEach((a) => {
    e.classList.contains(a) || (e.classList.add(a), o.push(a));
  }), () => {
    s.forEach((a) => e.classList.add(a)), o.forEach((a) => e.classList.remove(a));
  };
}
function be(e, t) {
  return typeof t == "object" && t !== null ? Rr(e, t) : Nr(e, t);
}
function Rr(e, t) {
  let n = {};
  return Object.entries(t).forEach(([r, i]) => {
    n[r] = e.style[r], r.startsWith("--") || (r = Kr(r)), e.style.setProperty(r, i);
  }), setTimeout(() => {
    e.style.length === 0 && e.removeAttribute("style");
  }), () => {
    be(e, n);
  };
}
function Nr(e, t) {
  let n = e.getAttribute("style", t);
  return e.setAttribute("style", t), () => {
    e.setAttribute("style", n || "");
  };
}
function Kr(e) {
  return e.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}
function Be(e, t = () => {
}) {
  let n = !1;
  return function() {
    n ? t.apply(this, arguments) : (n = !0, e.apply(this, arguments));
  };
}
v("transition", (e, { value: t, modifiers: n, expression: r }, { evaluate: i }) => {
  typeof r == "function" && (r = i(r)), r !== !1 && (!r || typeof r == "boolean" ? Dr(e, n, t) : Fr(e, r, t));
});
function Fr(e, t, n) {
  dn(e, st, ""), {
    enter: (i) => {
      e._x_transition.enter.during = i;
    },
    "enter-start": (i) => {
      e._x_transition.enter.start = i;
    },
    "enter-end": (i) => {
      e._x_transition.enter.end = i;
    },
    leave: (i) => {
      e._x_transition.leave.during = i;
    },
    "leave-start": (i) => {
      e._x_transition.leave.start = i;
    },
    "leave-end": (i) => {
      e._x_transition.leave.end = i;
    }
  }[n](t);
}
function Dr(e, t, n) {
  dn(e, be);
  let r = !t.includes("in") && !t.includes("out") && !n, i = r || t.includes("in") || ["enter"].includes(n), o = r || t.includes("out") || ["leave"].includes(n);
  t.includes("in") && !r && (t = t.filter((_, h) => h < t.indexOf("out"))), t.includes("out") && !r && (t = t.filter((_, h) => h > t.indexOf("out")));
  let s = !t.includes("opacity") && !t.includes("scale"), a = s || t.includes("opacity"), c = s || t.includes("scale"), l = a ? 0 : 1, u = c ? Z(t, "scale", 95) / 100 : 1, d = Z(t, "delay", 0) / 1e3, p = Z(t, "origin", "center"), b = "opacity, transform", A = Z(t, "duration", 150) / 1e3, m = Z(t, "duration", 75) / 1e3, f = "cubic-bezier(0.4, 0.0, 0.2, 1)";
  i && (e._x_transition.enter.during = {
    transformOrigin: p,
    transitionDelay: `${d}s`,
    transitionProperty: b,
    transitionDuration: `${A}s`,
    transitionTimingFunction: f
  }, e._x_transition.enter.start = {
    opacity: l,
    transform: `scale(${u})`
  }, e._x_transition.enter.end = {
    opacity: 1,
    transform: "scale(1)"
  }), o && (e._x_transition.leave.during = {
    transformOrigin: p,
    transitionDelay: `${d}s`,
    transitionProperty: b,
    transitionDuration: `${m}s`,
    transitionTimingFunction: f
  }, e._x_transition.leave.start = {
    opacity: 1,
    transform: "scale(1)"
  }, e._x_transition.leave.end = {
    opacity: l,
    transform: `scale(${u})`
  });
}
function dn(e, t, n = {}) {
  e._x_transition || (e._x_transition = {
    enter: { during: n, start: n, end: n },
    leave: { during: n, start: n, end: n },
    in(r = () => {
    }, i = () => {
    }) {
      qe(e, t, {
        during: this.enter.during,
        start: this.enter.start,
        end: this.enter.end
      }, r, i);
    },
    out(r = () => {
    }, i = () => {
    }) {
      qe(e, t, {
        during: this.leave.during,
        start: this.leave.start,
        end: this.leave.end
      }, r, i);
    }
  });
}
window.Element.prototype._x_toggleAndCascadeWithTransitions = function(e, t, n, r) {
  const i = document.visibilityState === "visible" ? requestAnimationFrame : setTimeout;
  let o = () => i(n);
  if (t) {
    e._x_transition && (e._x_transition.enter || e._x_transition.leave) ? e._x_transition.enter && (Object.entries(e._x_transition.enter.during).length || Object.entries(e._x_transition.enter.start).length || Object.entries(e._x_transition.enter.end).length) ? e._x_transition.in(n) : o() : e._x_transition ? e._x_transition.in(n) : o();
    return;
  }
  e._x_hidePromise = e._x_transition ? new Promise((s, a) => {
    e._x_transition.out(() => {
    }, () => s(r)), e._x_transitioning && e._x_transitioning.beforeCancel(() => a({ isFromCancelledTransition: !0 }));
  }) : Promise.resolve(r), queueMicrotask(() => {
    let s = pn(e);
    s ? (s._x_hideChildren || (s._x_hideChildren = []), s._x_hideChildren.push(e)) : i(() => {
      let a = (c) => {
        let l = Promise.all([
          c._x_hidePromise,
          ...(c._x_hideChildren || []).map(a)
        ]).then(([u]) => u?.());
        return delete c._x_hidePromise, delete c._x_hideChildren, l;
      };
      a(e).catch((c) => {
        if (!c.isFromCancelledTransition)
          throw c;
      });
    });
  });
};
function pn(e) {
  let t = e.parentNode;
  if (t)
    return t._x_hidePromise ? t : pn(t);
}
function qe(e, t, { during: n, start: r, end: i } = {}, o = () => {
}, s = () => {
}) {
  if (e._x_transitioning && e._x_transitioning.cancel(), Object.keys(n).length === 0 && Object.keys(r).length === 0 && Object.keys(i).length === 0) {
    o(), s();
    return;
  }
  let a, c, l;
  Br(e, {
    start() {
      a = t(e, r);
    },
    during() {
      c = t(e, n);
    },
    before: o,
    end() {
      a(), l = t(e, i);
    },
    after: s,
    cleanup() {
      c(), l();
    }
  });
}
function Br(e, t) {
  let n, r, i, o = Be(() => {
    x(() => {
      n = !0, r || t.before(), i || (t.end(), De()), t.after(), e.isConnected && t.cleanup(), delete e._x_transitioning;
    });
  });
  e._x_transitioning = {
    beforeCancels: [],
    beforeCancel(s) {
      this.beforeCancels.push(s);
    },
    cancel: Be(function() {
      for (; this.beforeCancels.length; )
        this.beforeCancels.shift()();
      o();
    }),
    finish: o
  }, x(() => {
    t.start(), t.during();
  }), jr(), requestAnimationFrame(() => {
    if (n)
      return;
    let s = Number(getComputedStyle(e).transitionDuration.replace(/,.*/, "").replace("s", "")) * 1e3, a = Number(getComputedStyle(e).transitionDelay.replace(/,.*/, "").replace("s", "")) * 1e3;
    s === 0 && (s = Number(getComputedStyle(e).animationDuration.replace("s", "")) * 1e3), x(() => {
      t.before();
    }), r = !0, requestAnimationFrame(() => {
      n || (x(() => {
        t.end();
      }), De(), setTimeout(e._x_transitioning.finish, s + a), i = !0);
    });
  });
}
function Z(e, t, n) {
  if (e.indexOf(t) === -1)
    return n;
  const r = e[e.indexOf(t) + 1];
  if (!r || t === "scale" && isNaN(r))
    return n;
  if (t === "duration" || t === "delay") {
    let i = r.match(/([0-9]+)ms/);
    if (i)
      return i[1];
  }
  return t === "origin" && ["top", "right", "left", "center", "bottom"].includes(e[e.indexOf(t) + 2]) ? [r, e[e.indexOf(t) + 2]].join(" ") : r;
}
var I = !1;
function j(e, t = () => {
}) {
  return (...n) => I ? t(...n) : e(...n);
}
function qr(e) {
  return (...t) => I && e(...t);
}
var _n = [];
function me(e) {
  _n.push(e);
}
function zr(e, t) {
  _n.forEach((n) => n(e, t)), I = !0, hn(() => {
    k(t, (n, r) => {
      r(n, () => {
      });
    });
  }), I = !1;
}
var ze = !1;
function Hr(e, t) {
  t._x_dataStack || (t._x_dataStack = e._x_dataStack), I = !0, ze = !0, hn(() => {
    Wr(t);
  }), I = !1, ze = !1;
}
function Wr(e) {
  let t = !1;
  k(e, (r, i) => {
    B(r, (o, s) => {
      if (t && kr(o))
        return s();
      t = !0, i(o, s);
    });
  });
}
function hn(e) {
  let t = q;
  yt((n, r) => {
    let i = t(n);
    return J(i), () => {
    };
  }), e(), yt(t);
}
function gn(e, t, n, r = []) {
  switch (e._x_bindings || (e._x_bindings = W({})), e._x_bindings[t] = n, t = r.includes("camel") ? Qr(t) : t, t) {
    case "value":
      Jr(e, n);
      break;
    case "style":
      Vr(e, n);
      break;
    case "class":
      Ur(e, n);
      break;
    case "selected":
    case "checked":
      Gr(e, t, n);
      break;
    default:
      xn(e, t, n);
      break;
  }
}
function Jr(e, t) {
  if (mn(e))
    e.attributes.value === void 0 && (e.value = t), window.fromModel && (typeof t == "boolean" ? e.checked = pe(e.value) === t : e.checked = vt(e.value, t));
  else if (at(e))
    Number.isInteger(t) ? e.value = t : !Array.isArray(t) && typeof t != "boolean" && ![null, void 0].includes(t) ? e.value = String(t) : Array.isArray(t) ? e.checked = t.some((n) => vt(n, e.value)) : e.checked = !!t;
  else if (e.tagName === "SELECT")
    Zr(e, t);
  else {
    if (e.value === t)
      return;
    e.value = t === void 0 ? "" : t;
  }
}
function Ur(e, t) {
  e._x_undoAddedClasses && e._x_undoAddedClasses(), e._x_undoAddedClasses = st(e, t);
}
function Vr(e, t) {
  e._x_undoAddedStyles && e._x_undoAddedStyles(), e._x_undoAddedStyles = be(e, t);
}
function Gr(e, t, n) {
  xn(e, t, n), Xr(e, t, n);
}
function xn(e, t, n) {
  [null, void 0, !1].includes(n) && ti(t) ? e.removeAttribute(t) : (yn(t) && (n = t), Yr(e, t, n));
}
function Yr(e, t, n) {
  e.getAttribute(t) != n && e.setAttribute(t, n);
}
function Xr(e, t, n) {
  e[t] !== n && (e[t] = n);
}
function Zr(e, t) {
  const n = [].concat(t).map((r) => r + "");
  Array.from(e.options).forEach((r) => {
    r.selected = n.includes(r.value);
  });
}
function Qr(e) {
  return e.toLowerCase().replace(/-(\w)/g, (t, n) => n.toUpperCase());
}
function vt(e, t) {
  return e == t;
}
function pe(e) {
  return [1, "1", "true", "on", "yes", !0].includes(e) ? !0 : [0, "0", "false", "off", "no", !1].includes(e) ? !1 : e ? !!e : null;
}
var ei = /* @__PURE__ */ new Set([
  "allowfullscreen",
  "async",
  "autofocus",
  "autoplay",
  "checked",
  "controls",
  "default",
  "defer",
  "disabled",
  "formnovalidate",
  "inert",
  "ismap",
  "itemscope",
  "loop",
  "multiple",
  "muted",
  "nomodule",
  "novalidate",
  "open",
  "playsinline",
  "readonly",
  "required",
  "reversed",
  "selected",
  "shadowrootclonable",
  "shadowrootdelegatesfocus",
  "shadowrootserializable"
]);
function yn(e) {
  return ei.has(e);
}
function ti(e) {
  return !["aria-pressed", "aria-checked", "aria-expanded", "aria-selected"].includes(e);
}
function ni(e, t, n) {
  return e._x_bindings && e._x_bindings[t] !== void 0 ? e._x_bindings[t] : bn(e, t, n);
}
function ri(e, t, n, r = !0) {
  if (e._x_bindings && e._x_bindings[t] !== void 0)
    return e._x_bindings[t];
  if (e._x_inlineBindings && e._x_inlineBindings[t] !== void 0) {
    let i = e._x_inlineBindings[t];
    return i.extract = r, Ut(() => K(e, i.expression));
  }
  return bn(e, t, n);
}
function bn(e, t, n) {
  let r = e.getAttribute(t);
  return r === null ? typeof n == "function" ? n() : n : r === "" ? !0 : yn(t) ? !![t, "true"].includes(r) : r;
}
function at(e) {
  return e.type === "checkbox" || e.localName === "ui-checkbox" || e.localName === "ui-switch";
}
function mn(e) {
  return e.type === "radio" || e.localName === "ui-radio";
}
function vn(e, t) {
  let n;
  return function() {
    const r = this, i = arguments, o = function() {
      n = null, e.apply(r, i);
    };
    clearTimeout(n), n = setTimeout(o, t);
  };
}
function wn(e, t) {
  let n;
  return function() {
    let r = this, i = arguments;
    n || (e.apply(r, i), n = !0, setTimeout(() => n = !1, t));
  };
}
function En({ get: e, set: t }, { get: n, set: r }) {
  let i = !0, o, s = q(() => {
    let a = e(), c = n();
    if (i)
      r(Ce(a)), i = !1;
    else {
      let l = JSON.stringify(a), u = JSON.stringify(c);
      l !== o ? r(Ce(a)) : l !== u && t(Ce(c));
    }
    o = JSON.stringify(e()), JSON.stringify(n());
  });
  return () => {
    J(s);
  };
}
function Ce(e) {
  return typeof e == "object" ? JSON.parse(JSON.stringify(e)) : e;
}
function ii(e) {
  (Array.isArray(e) ? e : [e]).forEach((n) => n(se));
}
var L = {}, wt = !1;
function oi(e, t) {
  if (wt || (L = W(L), wt = !0), t === void 0)
    return L[e];
  L[e] = t, zt(L[e]), typeof t == "object" && t !== null && t.hasOwnProperty("init") && typeof t.init == "function" && L[e].init();
}
function si() {
  return L;
}
var Sn = {};
function ai(e, t) {
  let n = typeof t != "function" ? () => t : t;
  return e instanceof Element ? An(e, n()) : (Sn[e] = n, () => {
  });
}
function ci(e) {
  return Object.entries(Sn).forEach(([t, n]) => {
    Object.defineProperty(e, t, {
      get() {
        return (...r) => n(...r);
      }
    });
  }), e;
}
function An(e, t, n) {
  let r = [];
  for (; r.length; )
    r.pop()();
  let i = Object.entries(t).map(([s, a]) => ({ name: s, value: a })), o = Yt(i);
  return i = i.map((s) => o.find((a) => a.name === s.name) ? {
    name: `x-bind:${s.name}`,
    value: `"${s.value}"`
  } : s), tt(e, i, n).map((s) => {
    r.push(s.runCleanups), s();
  }), () => {
    for (; r.length; )
      r.pop()();
  };
}
var Cn = {};
function li(e, t) {
  Cn[e] = t;
}
function ui(e, t) {
  return Object.entries(Cn).forEach(([n, r]) => {
    Object.defineProperty(e, n, {
      get() {
        return (...i) => r.bind(t)(...i);
      },
      enumerable: !1
    });
  }), e;
}
var fi = {
  get reactive() {
    return W;
  },
  get release() {
    return J;
  },
  get effect() {
    return q;
  },
  get raw() {
    return Pt;
  },
  version: "3.15.2",
  flushAndStopDeferringMutations: fr,
  dontAutoEvaluateFunctions: Ut,
  disableEffectScheduling: ir,
  startObservingMutations: Xe,
  stopObservingMutations: Bt,
  setReactivityEngine: or,
  onAttributeRemoved: Ft,
  onAttributesAdded: Kt,
  closestDataStack: z,
  skipDuringClone: j,
  onlyDuringClone: qr,
  addRootSelector: ln,
  addInitSelector: un,
  setErrorHandler: xr,
  interceptClone: me,
  addScopeToNode: ie,
  deferMutations: ur,
  mapAttributes: nt,
  evaluateLater: E,
  interceptInit: Tr,
  setEvaluator: br,
  mergeProxies: oe,
  extractProp: ri,
  findClosest: V,
  onElRemoved: Ve,
  closestRoot: ye,
  destroyTree: G,
  interceptor: Ht,
  // INTERNAL: not public API and is subject to change without major release.
  transition: qe,
  // INTERNAL
  setStyles: be,
  // INTERNAL
  mutateDom: x,
  directive: v,
  entangle: En,
  throttle: wn,
  debounce: vn,
  evaluate: K,
  initTree: k,
  nextTick: ot,
  prefixed: U,
  prefix: Er,
  plugin: ii,
  magic: M,
  store: oi,
  start: $r,
  clone: Hr,
  // INTERNAL
  cloneNode: zr,
  // INTERNAL
  bound: ni,
  $data: qt,
  watch: jt,
  walk: B,
  data: li,
  bind: ai
}, se = fi;
function di(e, t) {
  const n = /* @__PURE__ */ Object.create(null), r = e.split(",");
  for (let i = 0; i < r.length; i++)
    n[r[i]] = !0;
  return (i) => !!n[i];
}
var pi = Object.freeze({}), _i = Object.prototype.hasOwnProperty, ve = (e, t) => _i.call(e, t), F = Array.isArray, ne = (e) => On(e) === "[object Map]", hi = (e) => typeof e == "string", ct = (e) => typeof e == "symbol", we = (e) => e !== null && typeof e == "object", gi = Object.prototype.toString, On = (e) => gi.call(e), Mn = (e) => On(e).slice(8, -1), lt = (e) => hi(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, xi = (e) => {
  const t = /* @__PURE__ */ Object.create(null);
  return (n) => t[n] || (t[n] = e(n));
}, yi = xi((e) => e.charAt(0).toUpperCase() + e.slice(1)), $n = (e, t) => e !== t && (e === e || t === t), He = /* @__PURE__ */ new WeakMap(), Q = [], $, D = Symbol("iterate"), We = Symbol("Map key iterate");
function bi(e) {
  return e && e._isEffect === !0;
}
function mi(e, t = pi) {
  bi(e) && (e = e.raw);
  const n = Ei(e, t);
  return t.lazy || n(), n;
}
function vi(e) {
  e.active && (kn(e), e.options.onStop && e.options.onStop(), e.active = !1);
}
var wi = 0;
function Ei(e, t) {
  const n = function() {
    if (!n.active)
      return e();
    if (!Q.includes(n)) {
      kn(n);
      try {
        return Ai(), Q.push(n), $ = n, e();
      } finally {
        Q.pop(), Tn(), $ = Q[Q.length - 1];
      }
    }
  };
  return n.id = wi++, n.allowRecurse = !!t.allowRecurse, n._isEffect = !0, n.active = !0, n.raw = e, n.deps = [], n.options = t, n;
}
function kn(e) {
  const { deps: t } = e;
  if (t.length) {
    for (let n = 0; n < t.length; n++)
      t[n].delete(e);
    t.length = 0;
  }
}
var H = !0, ut = [];
function Si() {
  ut.push(H), H = !1;
}
function Ai() {
  ut.push(H), H = !0;
}
function Tn() {
  const e = ut.pop();
  H = e === void 0 ? !0 : e;
}
function O(e, t, n) {
  if (!H || $ === void 0)
    return;
  let r = He.get(e);
  r || He.set(e, r = /* @__PURE__ */ new Map());
  let i = r.get(n);
  i || r.set(n, i = /* @__PURE__ */ new Set()), i.has($) || (i.add($), $.deps.push(i), $.options.onTrack && $.options.onTrack({
    effect: $,
    target: e,
    type: t,
    key: n
  }));
}
function P(e, t, n, r, i, o) {
  const s = He.get(e);
  if (!s)
    return;
  const a = /* @__PURE__ */ new Set(), c = (u) => {
    u && u.forEach((d) => {
      (d !== $ || d.allowRecurse) && a.add(d);
    });
  };
  if (t === "clear")
    s.forEach(c);
  else if (n === "length" && F(e))
    s.forEach((u, d) => {
      (d === "length" || d >= r) && c(u);
    });
  else
    switch (n !== void 0 && c(s.get(n)), t) {
      case "add":
        F(e) ? lt(n) && c(s.get("length")) : (c(s.get(D)), ne(e) && c(s.get(We)));
        break;
      case "delete":
        F(e) || (c(s.get(D)), ne(e) && c(s.get(We)));
        break;
      case "set":
        ne(e) && c(s.get(D));
        break;
    }
  const l = (u) => {
    u.options.onTrigger && u.options.onTrigger({
      effect: u,
      target: e,
      key: n,
      type: t,
      newValue: r,
      oldValue: i,
      oldTarget: o
    }), u.options.scheduler ? u.options.scheduler(u) : u();
  };
  a.forEach(l);
}
var Ci = /* @__PURE__ */ di("__proto__,__v_isRef,__isVue"), In = new Set(Object.getOwnPropertyNames(Symbol).map((e) => Symbol[e]).filter(ct)), Oi = /* @__PURE__ */ Pn(), Mi = /* @__PURE__ */ Pn(!0), Et = /* @__PURE__ */ $i();
function $i() {
  const e = {};
  return ["includes", "indexOf", "lastIndexOf"].forEach((t) => {
    e[t] = function(...n) {
      const r = g(this);
      for (let o = 0, s = this.length; o < s; o++)
        O(r, "get", o + "");
      const i = r[t](...n);
      return i === -1 || i === !1 ? r[t](...n.map(g)) : i;
    };
  }), ["push", "pop", "shift", "unshift", "splice"].forEach((t) => {
    e[t] = function(...n) {
      Si();
      const r = g(this)[t].apply(this, n);
      return Tn(), r;
    };
  }), e;
}
function Pn(e = !1, t = !1) {
  return function(r, i, o) {
    if (i === "__v_isReactive")
      return !e;
    if (i === "__v_isReadonly")
      return e;
    if (i === "__v_raw" && o === (e ? t ? zi : Nn : t ? qi : Rn).get(r))
      return r;
    const s = F(r);
    if (!e && s && ve(Et, i))
      return Reflect.get(Et, i, o);
    const a = Reflect.get(r, i, o);
    return (ct(i) ? In.has(i) : Ci(i)) || (e || O(r, "get", i), t) ? a : Je(a) ? !s || !lt(i) ? a.value : a : we(a) ? e ? Kn(a) : _t(a) : a;
  };
}
var ki = /* @__PURE__ */ Ti();
function Ti(e = !1) {
  return function(n, r, i, o) {
    let s = n[r];
    if (!e && (i = g(i), s = g(s), !F(n) && Je(s) && !Je(i)))
      return s.value = i, !0;
    const a = F(n) && lt(r) ? Number(r) < n.length : ve(n, r), c = Reflect.set(n, r, i, o);
    return n === g(o) && (a ? $n(i, s) && P(n, "set", r, i, s) : P(n, "add", r, i)), c;
  };
}
function Ii(e, t) {
  const n = ve(e, t), r = e[t], i = Reflect.deleteProperty(e, t);
  return i && n && P(e, "delete", t, void 0, r), i;
}
function Pi(e, t) {
  const n = Reflect.has(e, t);
  return (!ct(t) || !In.has(t)) && O(e, "has", t), n;
}
function ji(e) {
  return O(e, "iterate", F(e) ? "length" : D), Reflect.ownKeys(e);
}
var Li = {
  get: Oi,
  set: ki,
  deleteProperty: Ii,
  has: Pi,
  ownKeys: ji
}, Ri = {
  get: Mi,
  set(e, t) {
    return console.warn(`Set operation on key "${String(t)}" failed: target is readonly.`, e), !0;
  },
  deleteProperty(e, t) {
    return console.warn(`Delete operation on key "${String(t)}" failed: target is readonly.`, e), !0;
  }
}, ft = (e) => we(e) ? _t(e) : e, dt = (e) => we(e) ? Kn(e) : e, pt = (e) => e, Ee = (e) => Reflect.getPrototypeOf(e);
function ae(e, t, n = !1, r = !1) {
  e = e.__v_raw;
  const i = g(e), o = g(t);
  t !== o && !n && O(i, "get", t), !n && O(i, "get", o);
  const { has: s } = Ee(i), a = r ? pt : n ? dt : ft;
  if (s.call(i, t))
    return a(e.get(t));
  if (s.call(i, o))
    return a(e.get(o));
  e !== i && e.get(t);
}
function ce(e, t = !1) {
  const n = this.__v_raw, r = g(n), i = g(e);
  return e !== i && !t && O(r, "has", e), !t && O(r, "has", i), e === i ? n.has(e) : n.has(e) || n.has(i);
}
function le(e, t = !1) {
  return e = e.__v_raw, !t && O(g(e), "iterate", D), Reflect.get(e, "size", e);
}
function St(e) {
  e = g(e);
  const t = g(this);
  return Ee(t).has.call(t, e) || (t.add(e), P(t, "add", e, e)), this;
}
function At(e, t) {
  t = g(t);
  const n = g(this), { has: r, get: i } = Ee(n);
  let o = r.call(n, e);
  o ? Ln(n, r, e) : (e = g(e), o = r.call(n, e));
  const s = i.call(n, e);
  return n.set(e, t), o ? $n(t, s) && P(n, "set", e, t, s) : P(n, "add", e, t), this;
}
function Ct(e) {
  const t = g(this), { has: n, get: r } = Ee(t);
  let i = n.call(t, e);
  i ? Ln(t, n, e) : (e = g(e), i = n.call(t, e));
  const o = r ? r.call(t, e) : void 0, s = t.delete(e);
  return i && P(t, "delete", e, void 0, o), s;
}
function Ot() {
  const e = g(this), t = e.size !== 0, n = ne(e) ? new Map(e) : new Set(e), r = e.clear();
  return t && P(e, "clear", void 0, void 0, n), r;
}
function ue(e, t) {
  return function(r, i) {
    const o = this, s = o.__v_raw, a = g(s), c = t ? pt : e ? dt : ft;
    return !e && O(a, "iterate", D), s.forEach((l, u) => r.call(i, c(l), c(u), o));
  };
}
function fe(e, t, n) {
  return function(...r) {
    const i = this.__v_raw, o = g(i), s = ne(o), a = e === "entries" || e === Symbol.iterator && s, c = e === "keys" && s, l = i[e](...r), u = n ? pt : t ? dt : ft;
    return !t && O(o, "iterate", c ? We : D), {
      // iterator protocol
      next() {
        const { value: d, done: p } = l.next();
        return p ? { value: d, done: p } : {
          value: a ? [u(d[0]), u(d[1])] : u(d),
          done: p
        };
      },
      // iterable protocol
      [Symbol.iterator]() {
        return this;
      }
    };
  };
}
function T(e) {
  return function(...t) {
    {
      const n = t[0] ? `on key "${t[0]}" ` : "";
      console.warn(`${yi(e)} operation ${n}failed: target is readonly.`, g(this));
    }
    return e === "delete" ? !1 : this;
  };
}
function Ni() {
  const e = {
    get(o) {
      return ae(this, o);
    },
    get size() {
      return le(this);
    },
    has: ce,
    add: St,
    set: At,
    delete: Ct,
    clear: Ot,
    forEach: ue(!1, !1)
  }, t = {
    get(o) {
      return ae(this, o, !1, !0);
    },
    get size() {
      return le(this);
    },
    has: ce,
    add: St,
    set: At,
    delete: Ct,
    clear: Ot,
    forEach: ue(!1, !0)
  }, n = {
    get(o) {
      return ae(this, o, !0);
    },
    get size() {
      return le(this, !0);
    },
    has(o) {
      return ce.call(this, o, !0);
    },
    add: T(
      "add"
      /* ADD */
    ),
    set: T(
      "set"
      /* SET */
    ),
    delete: T(
      "delete"
      /* DELETE */
    ),
    clear: T(
      "clear"
      /* CLEAR */
    ),
    forEach: ue(!0, !1)
  }, r = {
    get(o) {
      return ae(this, o, !0, !0);
    },
    get size() {
      return le(this, !0);
    },
    has(o) {
      return ce.call(this, o, !0);
    },
    add: T(
      "add"
      /* ADD */
    ),
    set: T(
      "set"
      /* SET */
    ),
    delete: T(
      "delete"
      /* DELETE */
    ),
    clear: T(
      "clear"
      /* CLEAR */
    ),
    forEach: ue(!0, !0)
  };
  return ["keys", "values", "entries", Symbol.iterator].forEach((o) => {
    e[o] = fe(o, !1, !1), n[o] = fe(o, !0, !1), t[o] = fe(o, !1, !0), r[o] = fe(o, !0, !0);
  }), [
    e,
    n,
    t,
    r
  ];
}
var [Ki, Fi] = /* @__PURE__ */ Ni();
function jn(e, t) {
  const n = e ? Fi : Ki;
  return (r, i, o) => i === "__v_isReactive" ? !e : i === "__v_isReadonly" ? e : i === "__v_raw" ? r : Reflect.get(ve(n, i) && i in r ? n : r, i, o);
}
var Di = {
  get: /* @__PURE__ */ jn(!1)
}, Bi = {
  get: /* @__PURE__ */ jn(!0)
};
function Ln(e, t, n) {
  const r = g(n);
  if (r !== n && t.call(e, r)) {
    const i = Mn(e);
    console.warn(`Reactive ${i} contains both the raw and reactive versions of the same object${i === "Map" ? " as keys" : ""}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`);
  }
}
var Rn = /* @__PURE__ */ new WeakMap(), qi = /* @__PURE__ */ new WeakMap(), Nn = /* @__PURE__ */ new WeakMap(), zi = /* @__PURE__ */ new WeakMap();
function Hi(e) {
  switch (e) {
    case "Object":
    case "Array":
      return 1;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return 2;
    default:
      return 0;
  }
}
function Wi(e) {
  return e.__v_skip || !Object.isExtensible(e) ? 0 : Hi(Mn(e));
}
function _t(e) {
  return e && e.__v_isReadonly ? e : Fn(e, !1, Li, Di, Rn);
}
function Kn(e) {
  return Fn(e, !0, Ri, Bi, Nn);
}
function Fn(e, t, n, r, i) {
  if (!we(e))
    return console.warn(`value cannot be made reactive: ${String(e)}`), e;
  if (e.__v_raw && !(t && e.__v_isReactive))
    return e;
  const o = i.get(e);
  if (o)
    return o;
  const s = Wi(e);
  if (s === 0)
    return e;
  const a = new Proxy(e, s === 2 ? r : n);
  return i.set(e, a), a;
}
function g(e) {
  return e && g(e.__v_raw) || e;
}
function Je(e) {
  return !!(e && e.__v_isRef === !0);
}
M("nextTick", () => ot);
M("dispatch", (e) => te.bind(te, e));
M("watch", (e, { evaluateLater: t, cleanup: n }) => (r, i) => {
  let o = t(r), a = jt(() => {
    let c;
    return o((l) => c = l), c;
  }, i);
  n(a);
});
M("store", si);
M("data", (e) => qt(e));
M("root", (e) => ye(e));
M("refs", (e) => (e._x_refs_proxy || (e._x_refs_proxy = oe(Ji(e))), e._x_refs_proxy));
function Ji(e) {
  let t = [];
  return V(e, (n) => {
    n._x_refs && t.push(n._x_refs);
  }), t;
}
var Oe = {};
function Dn(e) {
  return Oe[e] || (Oe[e] = 0), ++Oe[e];
}
function Ui(e, t) {
  return V(e, (n) => {
    if (n._x_ids && n._x_ids[t])
      return !0;
  });
}
function Vi(e, t) {
  e._x_ids || (e._x_ids = {}), e._x_ids[t] || (e._x_ids[t] = Dn(t));
}
M("id", (e, { cleanup: t }) => (n, r = null) => {
  let i = `${n}${r ? `-${r}` : ""}`;
  return Gi(e, i, t, () => {
    let o = Ui(e, n), s = o ? o._x_ids[n] : Dn(n);
    return r ? `${n}-${s}-${r}` : `${n}-${s}`;
  });
});
me((e, t) => {
  e._x_id && (t._x_id = e._x_id);
});
function Gi(e, t, n, r) {
  if (e._x_id || (e._x_id = {}), e._x_id[t])
    return e._x_id[t];
  let i = r();
  return e._x_id[t] = i, n(() => {
    delete e._x_id[t];
  }), i;
}
M("el", (e) => e);
Bn("Focus", "focus", "focus");
Bn("Persist", "persist", "persist");
function Bn(e, t, n) {
  M(t, (r) => S(`You can't use [$${t}] without first installing the "${e}" plugin here: https://alpinejs.dev/plugins/${n}`, r));
}
v("modelable", (e, { expression: t }, { effect: n, evaluateLater: r, cleanup: i }) => {
  let o = r(t), s = () => {
    let u;
    return o((d) => u = d), u;
  }, a = r(`${t} = __placeholder`), c = (u) => a(() => {
  }, { scope: { __placeholder: u } }), l = s();
  c(l), queueMicrotask(() => {
    if (!e._x_model)
      return;
    e._x_removeModelListeners.default();
    let u = e._x_model.get, d = e._x_model.set, p = En(
      {
        get() {
          return u();
        },
        set(b) {
          d(b);
        }
      },
      {
        get() {
          return s();
        },
        set(b) {
          c(b);
        }
      }
    );
    i(p);
  });
});
v("teleport", (e, { modifiers: t, expression: n }, { cleanup: r }) => {
  e.tagName.toLowerCase() !== "template" && S("x-teleport can only be used on a <template> tag", e);
  let i = Mt(n), o = e.content.cloneNode(!0).firstElementChild;
  e._x_teleport = o, o._x_teleportBack = e, e.setAttribute("data-teleport-template", !0), o.setAttribute("data-teleport-target", !0), e._x_forwardEvents && e._x_forwardEvents.forEach((a) => {
    o.addEventListener(a, (c) => {
      c.stopPropagation(), e.dispatchEvent(new c.constructor(c.type, c));
    });
  }), ie(o, {}, e);
  let s = (a, c, l) => {
    l.includes("prepend") ? c.parentNode.insertBefore(a, c) : l.includes("append") ? c.parentNode.insertBefore(a, c.nextSibling) : c.appendChild(a);
  };
  x(() => {
    s(o, i, t), j(() => {
      k(o);
    })();
  }), e._x_teleportPutBack = () => {
    let a = Mt(n);
    x(() => {
      s(e._x_teleport, a, t);
    });
  }, r(
    () => x(() => {
      o.remove(), G(o);
    })
  );
});
var Yi = document.createElement("div");
function Mt(e) {
  let t = j(() => document.querySelector(e), () => Yi)();
  return t || S(`Cannot find x-teleport element for selector: "${e}"`), t;
}
var qn = () => {
};
qn.inline = (e, { modifiers: t }, { cleanup: n }) => {
  t.includes("self") ? e._x_ignoreSelf = !0 : e._x_ignore = !0, n(() => {
    t.includes("self") ? delete e._x_ignoreSelf : delete e._x_ignore;
  });
};
v("ignore", qn);
v("effect", j((e, { expression: t }, { effect: n }) => {
  n(E(e, t));
}));
function Ue(e, t, n, r) {
  let i = e, o = (c) => r(c), s = {}, a = (c, l) => (u) => l(c, u);
  if (n.includes("dot") && (t = Xi(t)), n.includes("camel") && (t = Zi(t)), n.includes("passive") && (s.passive = !0), n.includes("capture") && (s.capture = !0), n.includes("window") && (i = window), n.includes("document") && (i = document), n.includes("debounce")) {
    let c = n[n.indexOf("debounce") + 1] || "invalid-wait", l = xe(c.split("ms")[0]) ? Number(c.split("ms")[0]) : 250;
    o = vn(o, l);
  }
  if (n.includes("throttle")) {
    let c = n[n.indexOf("throttle") + 1] || "invalid-wait", l = xe(c.split("ms")[0]) ? Number(c.split("ms")[0]) : 250;
    o = wn(o, l);
  }
  return n.includes("prevent") && (o = a(o, (c, l) => {
    l.preventDefault(), c(l);
  })), n.includes("stop") && (o = a(o, (c, l) => {
    l.stopPropagation(), c(l);
  })), n.includes("once") && (o = a(o, (c, l) => {
    c(l), i.removeEventListener(t, o, s);
  })), (n.includes("away") || n.includes("outside")) && (i = document, o = a(o, (c, l) => {
    e.contains(l.target) || l.target.isConnected !== !1 && (e.offsetWidth < 1 && e.offsetHeight < 1 || e._x_isShown !== !1 && c(l));
  })), n.includes("self") && (o = a(o, (c, l) => {
    l.target === e && c(l);
  })), (eo(t) || zn(t)) && (o = a(o, (c, l) => {
    to(l, n) || c(l);
  })), i.addEventListener(t, o, s), () => {
    i.removeEventListener(t, o, s);
  };
}
function Xi(e) {
  return e.replace(/-/g, ".");
}
function Zi(e) {
  return e.toLowerCase().replace(/-(\w)/g, (t, n) => n.toUpperCase());
}
function xe(e) {
  return !Array.isArray(e) && !isNaN(e);
}
function Qi(e) {
  return [" ", "_"].includes(
    e
  ) ? e : e.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/[_\s]/, "-").toLowerCase();
}
function eo(e) {
  return ["keydown", "keyup"].includes(e);
}
function zn(e) {
  return ["contextmenu", "click", "mouse"].some((t) => e.includes(t));
}
function to(e, t) {
  let n = t.filter((o) => !["window", "document", "prevent", "stop", "once", "capture", "self", "away", "outside", "passive", "preserve-scroll"].includes(o));
  if (n.includes("debounce")) {
    let o = n.indexOf("debounce");
    n.splice(o, xe((n[o + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
  }
  if (n.includes("throttle")) {
    let o = n.indexOf("throttle");
    n.splice(o, xe((n[o + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
  }
  if (n.length === 0 || n.length === 1 && $t(e.key).includes(n[0]))
    return !1;
  const i = ["ctrl", "shift", "alt", "meta", "cmd", "super"].filter((o) => n.includes(o));
  return n = n.filter((o) => !i.includes(o)), !(i.length > 0 && i.filter((s) => ((s === "cmd" || s === "super") && (s = "meta"), e[`${s}Key`])).length === i.length && (zn(e.type) || $t(e.key).includes(n[0])));
}
function $t(e) {
  if (!e)
    return [];
  e = Qi(e);
  let t = {
    ctrl: "control",
    slash: "/",
    space: " ",
    spacebar: " ",
    cmd: "meta",
    esc: "escape",
    up: "arrow-up",
    down: "arrow-down",
    left: "arrow-left",
    right: "arrow-right",
    period: ".",
    comma: ",",
    equal: "=",
    minus: "-",
    underscore: "_"
  };
  return t[e] = e, Object.keys(t).map((n) => {
    if (t[n] === e)
      return n;
  }).filter((n) => n);
}
v("model", (e, { modifiers: t, expression: n }, { effect: r, cleanup: i }) => {
  let o = e;
  t.includes("parent") && (o = e.parentNode);
  let s = E(o, n), a;
  typeof n == "string" ? a = E(o, `${n} = __placeholder`) : typeof n == "function" && typeof n() == "string" ? a = E(o, `${n()} = __placeholder`) : a = () => {
  };
  let c = () => {
    let p;
    return s((b) => p = b), kt(p) ? p.get() : p;
  }, l = (p) => {
    let b;
    s((A) => b = A), kt(b) ? b.set(p) : a(() => {
    }, {
      scope: { __placeholder: p }
    });
  };
  typeof n == "string" && e.type === "radio" && x(() => {
    e.hasAttribute("name") || e.setAttribute("name", n);
  });
  let u = e.tagName.toLowerCase() === "select" || ["checkbox", "radio"].includes(e.type) || t.includes("lazy") ? "change" : "input", d = I ? () => {
  } : Ue(e, u, t, (p) => {
    l(Me(e, t, p, c()));
  });
  if (t.includes("fill") && ([void 0, null, ""].includes(c()) || at(e) && Array.isArray(c()) || e.tagName.toLowerCase() === "select" && e.multiple) && l(
    Me(e, t, { target: e }, c())
  ), e._x_removeModelListeners || (e._x_removeModelListeners = {}), e._x_removeModelListeners.default = d, i(() => e._x_removeModelListeners.default()), e.form) {
    let p = Ue(e.form, "reset", [], (b) => {
      ot(() => e._x_model && e._x_model.set(Me(e, t, { target: e }, c())));
    });
    i(() => p());
  }
  e._x_model = {
    get() {
      return c();
    },
    set(p) {
      l(p);
    }
  }, e._x_forceModelUpdate = (p) => {
    p === void 0 && typeof n == "string" && n.match(/\./) && (p = ""), window.fromModel = !0, x(() => gn(e, "value", p)), delete window.fromModel;
  }, r(() => {
    let p = c();
    t.includes("unintrusive") && document.activeElement.isSameNode(e) || e._x_forceModelUpdate(p);
  });
});
function Me(e, t, n, r) {
  return x(() => {
    if (n instanceof CustomEvent && n.detail !== void 0)
      return n.detail !== null && n.detail !== void 0 ? n.detail : n.target.value;
    if (at(e))
      if (Array.isArray(r)) {
        let i = null;
        return t.includes("number") ? i = $e(n.target.value) : t.includes("boolean") ? i = pe(n.target.value) : i = n.target.value, n.target.checked ? r.includes(i) ? r : r.concat([i]) : r.filter((o) => !no(o, i));
      } else
        return n.target.checked;
    else {
      if (e.tagName.toLowerCase() === "select" && e.multiple)
        return t.includes("number") ? Array.from(n.target.selectedOptions).map((i) => {
          let o = i.value || i.text;
          return $e(o);
        }) : t.includes("boolean") ? Array.from(n.target.selectedOptions).map((i) => {
          let o = i.value || i.text;
          return pe(o);
        }) : Array.from(n.target.selectedOptions).map((i) => i.value || i.text);
      {
        let i;
        return mn(e) ? n.target.checked ? i = n.target.value : i = r : i = n.target.value, t.includes("number") ? $e(i) : t.includes("boolean") ? pe(i) : t.includes("trim") ? i.trim() : i;
      }
    }
  });
}
function $e(e) {
  let t = e ? parseFloat(e) : null;
  return ro(t) ? t : e;
}
function no(e, t) {
  return e == t;
}
function ro(e) {
  return !Array.isArray(e) && !isNaN(e);
}
function kt(e) {
  return e !== null && typeof e == "object" && typeof e.get == "function" && typeof e.set == "function";
}
v("cloak", (e) => queueMicrotask(() => x(() => e.removeAttribute(U("cloak")))));
un(() => `[${U("init")}]`);
v("init", j((e, { expression: t }, { evaluate: n }) => typeof t == "string" ? !!t.trim() && n(t, {}, !1) : n(t, {}, !1)));
v("text", (e, { expression: t }, { effect: n, evaluateLater: r }) => {
  let i = r(t);
  n(() => {
    i((o) => {
      x(() => {
        e.textContent = o;
      });
    });
  });
});
v("html", (e, { expression: t }, { effect: n, evaluateLater: r }) => {
  let i = r(t);
  n(() => {
    i((o) => {
      x(() => {
        e.innerHTML = o, e._x_ignoreSelf = !0, k(e), delete e._x_ignoreSelf;
      });
    });
  });
});
nt(Qt(":", en(U("bind:"))));
var Hn = (e, { value: t, modifiers: n, expression: r, original: i }, { effect: o, cleanup: s }) => {
  if (!t) {
    let c = {};
    ci(c), E(e, r)((u) => {
      An(e, u, i);
    }, { scope: c });
    return;
  }
  if (t === "key")
    return io(e, r);
  if (e._x_inlineBindings && e._x_inlineBindings[t] && e._x_inlineBindings[t].extract)
    return;
  let a = E(e, r);
  o(() => a((c) => {
    c === void 0 && typeof r == "string" && r.match(/\./) && (c = ""), x(() => gn(e, t, c, n));
  })), s(() => {
    e._x_undoAddedClasses && e._x_undoAddedClasses(), e._x_undoAddedStyles && e._x_undoAddedStyles();
  });
};
Hn.inline = (e, { value: t, modifiers: n, expression: r }) => {
  t && (e._x_inlineBindings || (e._x_inlineBindings = {}), e._x_inlineBindings[t] = { expression: r, extract: !1 });
};
v("bind", Hn);
function io(e, t) {
  e._x_keyExpression = t;
}
ln(() => `[${U("data")}]`);
v("data", (e, { expression: t }, { cleanup: n }) => {
  if (oo(e))
    return;
  t = t === "" ? "{}" : t;
  let r = {};
  Re(r, e);
  let i = {};
  ui(i, r);
  let o = K(e, t, { scope: i });
  (o === void 0 || o === !0) && (o = {}), Re(o, e);
  let s = W(o);
  zt(s);
  let a = ie(e, s);
  s.init && K(e, s.init), n(() => {
    s.destroy && K(e, s.destroy), a();
  });
});
me((e, t) => {
  e._x_dataStack && (t._x_dataStack = e._x_dataStack, t.setAttribute("data-has-alpine-state", !0));
});
function oo(e) {
  return I ? ze ? !0 : e.hasAttribute("data-has-alpine-state") : !1;
}
v("show", (e, { modifiers: t, expression: n }, { effect: r }) => {
  let i = E(e, n);
  e._x_doHide || (e._x_doHide = () => {
    x(() => {
      e.style.setProperty("display", "none", t.includes("important") ? "important" : void 0);
    });
  }), e._x_doShow || (e._x_doShow = () => {
    x(() => {
      e.style.length === 1 && e.style.display === "none" ? e.removeAttribute("style") : e.style.removeProperty("display");
    });
  });
  let o = () => {
    e._x_doHide(), e._x_isShown = !1;
  }, s = () => {
    e._x_doShow(), e._x_isShown = !0;
  }, a = () => setTimeout(s), c = Be(
    (d) => d ? s() : o(),
    (d) => {
      typeof e._x_toggleAndCascadeWithTransitions == "function" ? e._x_toggleAndCascadeWithTransitions(e, d, s, o) : d ? a() : o();
    }
  ), l, u = !0;
  r(() => i((d) => {
    !u && d === l || (t.includes("immediate") && (d ? a() : o()), c(d), l = d, u = !1);
  }));
});
v("for", (e, { expression: t }, { effect: n, cleanup: r }) => {
  let i = ao(t), o = E(e, i.items), s = E(
    e,
    // the x-bind:key expression is stored for our use instead of evaluated.
    e._x_keyExpression || "index"
  );
  e._x_prevKeys = [], e._x_lookup = {}, n(() => so(e, i, o, s)), r(() => {
    Object.values(e._x_lookup).forEach((a) => x(
      () => {
        G(a), a.remove();
      }
    )), delete e._x_prevKeys, delete e._x_lookup;
  });
});
function so(e, t, n, r) {
  let i = (s) => typeof s == "object" && !Array.isArray(s), o = e;
  n((s) => {
    co(s) && s >= 0 && (s = Array.from(Array(s).keys(), (f) => f + 1)), s === void 0 && (s = []);
    let a = e._x_lookup, c = e._x_prevKeys, l = [], u = [];
    if (i(s))
      s = Object.entries(s).map(([f, _]) => {
        let h = Tt(t, _, f, s);
        r((y) => {
          u.includes(y) && S("Duplicate key on x-for", e), u.push(y);
        }, { scope: { index: f, ...h } }), l.push(h);
      });
    else
      for (let f = 0; f < s.length; f++) {
        let _ = Tt(t, s[f], f, s);
        r((h) => {
          u.includes(h) && S("Duplicate key on x-for", e), u.push(h);
        }, { scope: { index: f, ..._ } }), l.push(_);
      }
    let d = [], p = [], b = [], A = [];
    for (let f = 0; f < c.length; f++) {
      let _ = c[f];
      u.indexOf(_) === -1 && b.push(_);
    }
    c = c.filter((f) => !b.includes(f));
    let m = "template";
    for (let f = 0; f < u.length; f++) {
      let _ = u[f], h = c.indexOf(_);
      if (h === -1)
        c.splice(f, 0, _), d.push([m, f]);
      else if (h !== f) {
        let y = c.splice(f, 1)[0], w = c.splice(h - 1, 1)[0];
        c.splice(f, 0, w), c.splice(h, 0, y), p.push([y, w]);
      } else
        A.push(_);
      m = _;
    }
    for (let f = 0; f < b.length; f++) {
      let _ = b[f];
      _ in a && (x(() => {
        G(a[_]), a[_].remove();
      }), delete a[_]);
    }
    for (let f = 0; f < p.length; f++) {
      let [_, h] = p[f], y = a[_], w = a[h], C = document.createElement("div");
      x(() => {
        w || S('x-for ":key" is undefined or invalid', o, h, a), w.after(C), y.after(w), w._x_currentIfEl && w.after(w._x_currentIfEl), C.before(y), y._x_currentIfEl && y.after(y._x_currentIfEl), C.remove();
      }), w._x_refreshXForScope(l[u.indexOf(h)]);
    }
    for (let f = 0; f < d.length; f++) {
      let [_, h] = d[f], y = _ === "template" ? o : a[_];
      y._x_currentIfEl && (y = y._x_currentIfEl);
      let w = l[h], C = u[h], Y = document.importNode(o.content, !0).firstElementChild, ht = W(w);
      ie(Y, ht, o), Y._x_refreshXForScope = (Jn) => {
        Object.entries(Jn).forEach(([Un, Vn]) => {
          ht[Un] = Vn;
        });
      }, x(() => {
        y.after(Y), j(() => k(Y))();
      }), typeof C == "object" && S("x-for key cannot be an object, it must be a string or an integer", o), a[C] = Y;
    }
    for (let f = 0; f < A.length; f++)
      a[A[f]]._x_refreshXForScope(l[u.indexOf(A[f])]);
    o._x_prevKeys = u;
  });
}
function ao(e) {
  let t = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/, n = /^\s*\(|\)\s*$/g, r = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/, i = e.match(r);
  if (!i)
    return;
  let o = {};
  o.items = i[2].trim();
  let s = i[1].replace(n, "").trim(), a = s.match(t);
  return a ? (o.item = s.replace(t, "").trim(), o.index = a[1].trim(), a[2] && (o.collection = a[2].trim())) : o.item = s, o;
}
function Tt(e, t, n, r) {
  let i = {};
  return /^\[.*\]$/.test(e.item) && Array.isArray(t) ? e.item.replace("[", "").replace("]", "").split(",").map((s) => s.trim()).forEach((s, a) => {
    i[s] = t[a];
  }) : /^\{.*\}$/.test(e.item) && !Array.isArray(t) && typeof t == "object" ? e.item.replace("{", "").replace("}", "").split(",").map((s) => s.trim()).forEach((s) => {
    i[s] = t[s];
  }) : i[e.item] = t, e.index && (i[e.index] = n), e.collection && (i[e.collection] = r), i;
}
function co(e) {
  return !Array.isArray(e) && !isNaN(e);
}
function Wn() {
}
Wn.inline = (e, { expression: t }, { cleanup: n }) => {
  let r = ye(e);
  r._x_refs || (r._x_refs = {}), r._x_refs[t] = e, n(() => delete r._x_refs[t]);
};
v("ref", Wn);
v("if", (e, { expression: t }, { effect: n, cleanup: r }) => {
  e.tagName.toLowerCase() !== "template" && S("x-if can only be used on a <template> tag", e);
  let i = E(e, t), o = () => {
    if (e._x_currentIfEl)
      return e._x_currentIfEl;
    let a = e.content.cloneNode(!0).firstElementChild;
    return ie(a, {}, e), x(() => {
      e.after(a), j(() => k(a))();
    }), e._x_currentIfEl = a, e._x_undoIf = () => {
      x(() => {
        G(a), a.remove();
      }), delete e._x_currentIfEl;
    }, a;
  }, s = () => {
    e._x_undoIf && (e._x_undoIf(), delete e._x_undoIf);
  };
  n(() => i((a) => {
    a ? o() : s();
  })), r(() => e._x_undoIf && e._x_undoIf());
});
v("id", (e, { expression: t }, { evaluate: n }) => {
  n(t).forEach((i) => Vi(e, i));
});
me((e, t) => {
  e._x_ids && (t._x_ids = e._x_ids);
});
nt(Qt("@", en(U("on:"))));
v("on", j((e, { value: t, modifiers: n, expression: r }, { cleanup: i }) => {
  let o = r ? E(e, r) : () => {
  };
  e.tagName.toLowerCase() === "template" && (e._x_forwardEvents || (e._x_forwardEvents = []), e._x_forwardEvents.includes(t) || e._x_forwardEvents.push(t));
  let s = Ue(e, t, n, (a) => {
    o(() => {
    }, { scope: { $event: a }, params: [a] });
  });
  i(() => s());
}));
Se("Collapse", "collapse", "collapse");
Se("Intersect", "intersect", "intersect");
Se("Focus", "trap", "focus");
Se("Mask", "mask", "mask");
function Se(e, t, n) {
  v(t, (r) => S(`You can't use [x-${t}] without first installing the "${e}" plugin here: https://alpinejs.dev/plugins/${n}`, r));
}
se.setEvaluator(Gt);
se.setReactivityEngine({ reactive: _t, effect: mi, release: vi, raw: g });
var lo = se, ke = lo;
const uo = {
  backdrop: "fixed bottom-4 left-4 z-[9999] w-80",
  container: "bg-[#fff7e8] rounded-2xl shadow-xl border border-orange-200 p-4 text-slate-900",
  title: "font-bold text-lg mb-1",
  description: "text-sm mb-2",
  buttonPrimary: "bg-amber-400 px-3 py-1 rounded-full text-sm font-semibold text-slate-900 hover:bg-amber-300",
  buttonSecondary: "text-sm text-slate-700",
  buttonGhost: "underline text-sm text-amber-800 mb-3",
  categoryCard: "flex justify-between items-center border border-orange-100 bg-white rounded-xl px-3 py-2",
  toggleTrackOn: "relative inline-flex h-6 w-11 items-center rounded-full bg-emerald-500 transition-colors duration-200",
  toggleTrackOff: "relative inline-flex h-6 w-11 items-center rounded-full bg-slate-300 transition-colors duration-200",
  toggleKnob: "inline-block h-5 w-5 bg-white rounded-full shadow transform transition-transform duration-200"
};
function fo(e) {
  switch (e) {
    case "bottom-right":
      return "fixed bottom-4 right-4 z-[9999] w-80";
    case "center":
      return "fixed inset-0 z-[9999] flex items-center justify-center";
    case "bottom-left":
    default:
      return "fixed bottom-4 left-4 z-[9999] w-80";
  }
}
function It(e, t) {
  if (document.getElementById("cookie-wall-root")) return;
  const r = document.createElement("div");
  r.id = "cookie-wall-root";
  const i = e.getState(), o = t.ui ?? {}, s = {
    ...uo,
    ...o.classes ?? {}
  }, a = o.position ? fo(o.position) : s.backdrop, c = o.texts?.title ?? "🍪 Les cookies", l = o.texts?.description ?? "On utilise des cookies pour améliorer votre expérience.", u = o.texts?.acceptAllLabel ?? "OK pour moi", d = o.texts?.rejectAllLabel ?? "Non merci", p = o.texts?.customizeLabel ?? "Je choisis";
  r.innerHTML = `
    <div
      class="${a}"
      x-data="{ advanced: false }"
    >
      <div class="${s.container}">
        <!-- Header -->
        <h2 class="${s.title}">${c}</h2>
        <p class="${s.description}">
          ${l}
        </p>

        <!-- Bouton "Je choisis" -->
        <button
          id="cw-choose"
          type="button"
          class="${s.buttonGhost}"
          @click="advanced = !advanced"
        >
          ${p}
        </button>

        <!-- Zone avancée (catégories) -->
        <div
          id="cw-advanced"
          class="flex flex-col gap-2 mb-3 max-h-40 overflow-y-auto"
          x-show="advanced"
          x-transition.opacity.scale.origin-top-left
          x-cloak
        >
          ${t.categories.map((m) => {
    const _ = i.categories[m.key] === "granted", h = m.required, y = _ ? s.toggleTrackOn : s.toggleTrackOff, w = _ ? "translate-x-5" : "translate-x-1", C = _ ? "Activé" : "Désactivé";
    return `
              <div class="${s.categoryCard}">
                <div class="flex-1 min-w-0">
                  <div class="text-sm font-medium">${m.title}</div>
                  ${m.description ? `<div class="text-xs text-slate-500">${m.description}</div>` : ""}
                  ${h ? '<div class="text-[10px] uppercase tracking-wide text-emerald-600 mt-0.5">Obligatoire</div>' : ""}
                </div>
                ${h ? "" : `
                <button
                  type="button"
                  class="cw-toggle flex items-center gap-2"
                  data-cat="${m.key}"
                  aria-pressed="${_}"
                >
                  <span class="${y}">
                    <span class="${s.toggleKnob} ${w}"></span>
                  </span>
                  <span class="text-[11px] text-slate-500">${C}</span>
                </button>
                `}
              </div>
              `;
  }).join("")}
        </div>

        <!-- Actions principales -->
        <div class="flex justify-between items-center gap-2">
          <button
            id="cw-reject"
            type="button"
            class="${s.buttonSecondary}"
          >
            ${d}
          </button>
          <button
            id="cw-accept"
            type="button"
            class="${s.buttonPrimary}"
          >
            ${u}
          </button>
        </div>
      </div>
    </div>
  `, document.body.appendChild(r), window.__COOKIE_WALL_ALPINE__ ? ke.initTree(r) : (window.__COOKIE_WALL_ALPINE__ = !0, window.Alpine = ke, ke.start());
  const b = r.querySelector("#cw-advanced"), A = r.querySelector("#cw-choose");
  if (A && b) {
    let m = !1;
    A.addEventListener(
      "click",
      () => {
        m = !m, b.style.display = m ? "flex" : "none";
      },
      { passive: !0 }
    );
  }
  r.querySelectorAll(".cw-toggle").forEach((m) => {
    m.addEventListener("click", () => {
      const f = m.dataset.cat, h = e.getState().categories[f] === "granted" ? "denied" : "granted";
      e.setCategory(f, h);
      const y = m.querySelector("span:nth-child(1)"), w = y?.querySelector("span"), C = m.querySelector("span:nth-child(2)");
      y && (y.className = (h === "granted" ? s.toggleTrackOn : s.toggleTrackOff) + " transition-colors duration-200"), w && (w.className = s.toggleKnob + " " + (h === "granted" ? "translate-x-5" : "translate-x-1")), C && (C.textContent = h === "granted" ? "Activé" : "Désactivé"), m.setAttribute("aria-pressed", h === "granted" ? "true" : "false");
    });
  }), r.querySelector("#cw-accept")?.addEventListener("click", () => {
    e.acceptAll(), r.remove();
  }), r.querySelector("#cw-reject")?.addEventListener("click", () => {
    e.rejectAll(), r.remove();
  });
}
function po(e) {
  const t = new Zn(e), n = e.storageKey ?? "cookie-wall-consent";
  return !!localStorage.getItem(n) || It(t, e), {
    getState: () => t.getState(),
    isGranted: (o) => t.getState().categories[o] === "granted",
    whenGranted: (o, s) => {
      t.getState().categories[o] === "granted" && s();
    },
    open: () => It(t, e)
  };
}
typeof window < "u" && (window.CookieWall = {
  init: po
});
export {
  po as initCookieWall
};
