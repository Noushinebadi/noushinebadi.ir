(function () {
    const e = document.createElement("link").relList;
    if (e && e.supports && e.supports("modulepreload")) return;
    for (const r of document.querySelectorAll('link[rel="modulepreload"]')) i(r);
    new MutationObserver(r => {
        for (const s of r) if (s.type === "childList") for (const o of s.addedNodes) o.tagName === "LINK" && o.rel === "modulepreload" && i(o)
    }).observe(document, {childList: !0, subtree: !0});

    function n(r) {
        const s = {};
        return r.integrity && (s.integrity = r.integrity), r.referrerPolicy && (s.referrerPolicy = r.referrerPolicy), r.crossOrigin === "use-credentials" ? s.credentials = "include" : r.crossOrigin === "anonymous" ? s.credentials = "omit" : s.credentials = "same-origin", s
    }

    function i(r) {
        if (r.ep) return;
        r.ep = !0;
        const s = n(r);
        fetch(r.href, s)
    }
})();

function Rt(t, e) {
    if (t instanceof Text) {
        const n = [];
        for (const i of t.data.matchAll(/[^\n\r \t\v]+|\s+/gu)) {
            let r = i[0];
            i[0].match(/^\s/) || (r = e(r)), n.push(r)
        }
        t.replaceWith(...n)
    } else if (!(t instanceof CharacterData)) for (const n of [...t.childNodes]) Rt(n, e)
}

function Zt(t, e) {
    t.indexOf(e) === -1 && t.push(e)
}

function Gt(t, e) {
    const n = t.indexOf(e);
    n > -1 && t.splice(n, 1)
}

const jt = (t, e, n) => Math.min(Math.max(n, t), e),
    A = {duration: .3, delay: 0, endDelay: 0, repeat: 0, easing: "ease"}, k = t => typeof t == "number",
    $ = t => Array.isArray(t) && !k(t[0]), Jt = (t, e, n) => {
        const i = e - t;
        return ((n - t) % i + i) % i + t
    };

function Nt(t, e) {
    return $(t) ? t[Jt(0, t.length, e)] : t
}

const yt = (t, e, n) => -n * t + n * e + t, qt = () => {
}, F = t => t, it = (t, e, n) => e - t === 0 ? 1 : (n - t) / (e - t);

function vt(t, e) {
    const n = t[t.length - 1];
    for (let i = 1; i <= e; i++) {
        const r = it(0, e, i);
        t.push(yt(n, 1, r))
    }
}

function Bt(t) {
    const e = [0];
    return vt(e, t - 1), e
}

function Qt(t, e = Bt(t.length), n = F) {
    const i = t.length, r = i - e.length;
    return r > 0 && vt(e, r), s => {
        let o = 0;
        for (; o < i - 2 && !(s < e[o + 1]); o++) ;
        let a = jt(0, 1, it(e[o], e[o + 1], s));
        return a = Nt(n, o)(a), yt(t[o], t[o + 1], a)
    }
}

const $t = t => Array.isArray(t) && k(t[0]), tt = t => typeof t == "object" && !!t.createAnimation,
    V = t => typeof t == "function", Vt = t => typeof t == "string", K = {ms: t => t * 1e3, s: t => t / 1e3},
    zt = (t, e, n) => (((1 - 3 * n + 3 * e) * t + (3 * n - 6 * e)) * t + 3 * e) * t, te = 1e-7, ee = 12;

function ne(t, e, n, i, r) {
    let s, o, a = 0;
    do o = e + (n - e) / 2, s = zt(o, i, r) - t, s > 0 ? n = o : e = o; while (Math.abs(s) > te && ++a < ee);
    return o
}

function U(t, e, n, i) {
    if (t === e && n === i) return F;
    const r = s => ne(s, 0, 1, t, n);
    return s => s === 0 || s === 1 ? s : zt(r(s), e, i)
}

const ie = (t, e = "end") => n => {
    n = e === "end" ? Math.min(n, .999) : Math.max(n, .001);
    const i = n * t, r = e === "end" ? Math.floor(i) : Math.ceil(i);
    return jt(0, 1, r / t)
}, re = {
    ease: U(.25, .1, .25, 1),
    "ease-in": U(.42, 0, 1, 1),
    "ease-in-out": U(.42, 0, .58, 1),
    "ease-out": U(0, 0, .58, 1)
}, se = /\((.*?)\)/;

function St(t) {
    if (V(t)) return t;
    if ($t(t)) return U(...t);
    const e = re[t];
    if (e) return e;
    if (t.startsWith("steps")) {
        const n = se.exec(t);
        if (n) {
            const i = n[1].split(",");
            return ie(parseFloat(i[0]), i[1].trim())
        }
    }
    return F
}

class oe {
    constructor(e, n = [0, 1], {
        easing: i,
        duration: r = A.duration,
        delay: s = A.delay,
        endDelay: o = A.endDelay,
        repeat: a = A.repeat,
        offset: d,
        direction: u = "normal",
        autoplay: p = !0
    } = {}) {
        if (this.startTime = null, this.rate = 1, this.t = 0, this.cancelTimestamp = null, this.easing = F, this.duration = 0, this.totalDuration = 0, this.repeat = 0, this.playState = "idle", this.finished = new Promise((c, S) => {
            this.resolve = c, this.reject = S
        }), i = i || A.easing, tt(i)) {
            const c = i.createAnimation(n);
            i = c.easing, n = c.keyframes || n, r = c.duration || r
        }
        this.repeat = a, this.easing = $(i) ? F : St(i), this.updateDuration(r);
        const y = Qt(n, d, $(i) ? i.map(St) : F);
        this.tick = c => {
            var S;
            s = s;
            let h = 0;
            this.pauseTime !== void 0 ? h = this.pauseTime : h = (c - this.startTime) * this.rate, this.t = h, h /= 1e3, h = Math.max(h - s, 0), this.playState === "finished" && this.pauseTime === void 0 && (h = this.totalDuration);
            const m = h / this.duration;
            let g = Math.floor(m), v = m % 1;
            !v && m >= 1 && (v = 1), v === 1 && g--;
            const w = g % 2;
            (u === "reverse" || u === "alternate" && w || u === "alternate-reverse" && !w) && (v = 1 - v);
            const O = h >= this.totalDuration ? 1 : Math.min(v, 1), D = y(this.easing(O));
            e(D), this.pauseTime === void 0 && (this.playState === "finished" || h >= this.totalDuration + o) ? (this.playState = "finished", (S = this.resolve) === null || S === void 0 || S.call(this, D)) : this.playState !== "idle" && (this.frameRequestId = requestAnimationFrame(this.tick))
        }, p && this.play()
    }

    play() {
        const e = performance.now();
        this.playState = "running", this.pauseTime !== void 0 ? this.startTime = e - this.pauseTime : this.startTime || (this.startTime = e), this.cancelTimestamp = this.startTime, this.pauseTime = void 0, this.frameRequestId = requestAnimationFrame(this.tick)
    }

    pause() {
        this.playState = "paused", this.pauseTime = this.t
    }

    finish() {
        this.playState = "finished", this.tick(0)
    }

    stop() {
        var e;
        this.playState = "idle", this.frameRequestId !== void 0 && cancelAnimationFrame(this.frameRequestId), (e = this.reject) === null || e === void 0 || e.call(this, !1)
    }

    cancel() {
        this.stop(), this.tick(this.cancelTimestamp)
    }

    reverse() {
        this.rate *= -1
    }

    commitStyles() {
    }

    updateDuration(e) {
        this.duration = e, this.totalDuration = e * (this.repeat + 1)
    }

    get currentTime() {
        return this.t
    }

    set currentTime(e) {
        this.pauseTime !== void 0 || this.rate === 0 ? this.pauseTime = e : this.startTime = performance.now() - e / this.rate
    }

    get playbackRate() {
        return this.rate
    }

    set playbackRate(e) {
        this.rate = e
    }
}

var ae = function () {
};

class ce {
    setAnimation(e) {
        this.animation = e, e == null || e.finished.then(() => this.clearAnimation()).catch(() => {
        })
    }

    clearAnimation() {
        this.animation = this.generator = void 0
    }
}

const st = new WeakMap;

function _t(t) {
    return st.has(t) || st.set(t, {transforms: [], values: new Map}), st.get(t)
}

function le(t, e) {
    return t.has(e) || t.set(e, new ce), t.get(e)
}

const ue = ["", "X", "Y", "Z"], fe = ["translate", "scale", "rotate", "skew"],
    et = {x: "translateX", y: "translateY", z: "translateZ"},
    Ot = {syntax: "<angle>", initialValue: "0deg", toDefaultUnit: t => t + "deg"}, de = {
        translate: {syntax: "<length-percentage>", initialValue: "0px", toDefaultUnit: t => t + "px"},
        rotate: Ot,
        scale: {syntax: "<number>", initialValue: 1, toDefaultUnit: F},
        skew: Ot
    }, Y = new Map, bt = t => `--motion-${t}`, nt = ["x", "y", "z"];
fe.forEach(t => {
    ue.forEach(e => {
        nt.push(t + e), Y.set(bt(t + e), de[t])
    })
});
const he = (t, e) => nt.indexOf(t) - nt.indexOf(e), pe = new Set(nt), Ut = t => pe.has(t), me = (t, e) => {
        et[e] && (e = et[e]);
        const {transforms: n} = _t(t);
        Zt(n, e), t.style.transform = ge(n)
    }, ge = t => t.sort(he).reduce(ye, "").trim(), ye = (t, e) => `${t} ${e}(var(${bt(e)}))`, ft = t => t.startsWith("--"),
    Tt = new Set;

function ve(t) {
    if (!Tt.has(t)) {
        Tt.add(t);
        try {
            const {syntax: e, initialValue: n} = Y.has(t) ? Y.get(t) : {};
            CSS.registerProperty({name: t, inherits: !1, syntax: e, initialValue: n})
        } catch {
        }
    }
}

const ot = (t, e) => document.createElement("div").animate(t, e), wt = {
    cssRegisterProperty: () => typeof CSS < "u" && Object.hasOwnProperty.call(CSS, "registerProperty"),
    waapi: () => Object.hasOwnProperty.call(Element.prototype, "animate"),
    partialKeyframes: () => {
        try {
            ot({opacity: [1]})
        } catch {
            return !1
        }
        return !0
    },
    finished: () => !!ot({opacity: [0, 1]}, {duration: .001}).finished,
    linearEasing: () => {
        try {
            ot({opacity: 0}, {easing: "linear(0, 1)"})
        } catch {
            return !1
        }
        return !0
    }
}, at = {}, B = {};
for (const t in wt) B[t] = () => (at[t] === void 0 && (at[t] = wt[t]()), at[t]);
const be = .015, Ae = (t, e) => {
        let n = "";
        const i = Math.round(e / be);
        for (let r = 0; r < i; r++) n += t(it(0, i - 1, r)) + ", ";
        return n.substring(0, n.length - 2)
    }, xt = (t, e) => V(t) ? B.linearEasing() ? `linear(${Ae(t, e)})` : A.easing : $t(t) ? Ee(t) : t,
    Ee = ([t, e, n, i]) => `cubic-bezier(${t}, ${e}, ${n}, ${i})`;

function Se(t, e) {
    for (let n = 0; n < t.length; n++) t[n] === null && (t[n] = n ? t[n - 1] : e());
    return t
}

const Wt = t => Array.isArray(t) ? t : [t];

function dt(t) {
    return et[t] && (t = et[t]), Ut(t) ? bt(t) : t
}

const Z = {
    get: (t, e) => {
        e = dt(e);
        let n = ft(e) ? t.style.getPropertyValue(e) : getComputedStyle(t)[e];
        if (!n && n !== 0) {
            const i = Y.get(e);
            i && (n = i.initialValue)
        }
        return n
    }, set: (t, e, n) => {
        e = dt(e), ft(e) ? t.style.setProperty(e, n) : t.style[e] = n
    }
};

function Kt(t, e = !0) {
    if (!(!t || t.playState === "finished")) try {
        t.stop ? t.stop() : (e && t.commitStyles(), t.cancel())
    } catch {
    }
}

function Oe(t, e) {
    var n;
    let i = (e == null ? void 0 : e.toDefaultUnit) || F;
    const r = t[t.length - 1];
    if (Vt(r)) {
        const s = ((n = r.match(/(-?[\d.]+)([a-z%]*)/)) === null || n === void 0 ? void 0 : n[2]) || "";
        s && (i = o => o + s)
    }
    return i
}

function Te() {
    return window.__MOTION_DEV_TOOLS_RECORD
}

function we(t, e, n, i = {}, r) {
    const s = Te(), o = i.record !== !1 && s;
    let a, {
        duration: d = A.duration,
        delay: u = A.delay,
        endDelay: p = A.endDelay,
        repeat: y = A.repeat,
        easing: c = A.easing,
        persist: S = !1,
        direction: h,
        offset: m,
        allowWebkitAcceleration: g = !1,
        autoplay: v = !0
    } = i;
    const w = _t(t), O = Ut(e);
    let D = B.waapi();
    O && me(t, e);
    const b = dt(e), x = le(w.values, b), I = Y.get(b);
    return Kt(x.animation, !(tt(c) && x.generator) && i.record !== !1), () => {
        const E = () => {
            var l, P;
            return (P = (l = Z.get(t, b)) !== null && l !== void 0 ? l : I == null ? void 0 : I.initialValue) !== null && P !== void 0 ? P : 0
        };
        let f = Se(Wt(n), E);
        const j = Oe(f, I);
        if (tt(c)) {
            const l = c.createAnimation(f, e !== "opacity", E, b, x);
            c = l.easing, f = l.keyframes || f, d = l.duration || d
        }
        if (ft(b) && (B.cssRegisterProperty() ? ve(b) : D = !1), O && !B.linearEasing() && (V(c) || $(c) && c.some(V)) && (D = !1), D) {
            I && (f = f.map(M => k(M) ? I.toDefaultUnit(M) : M)), f.length === 1 && (!B.partialKeyframes() || o) && f.unshift(E());
            const l = {
                delay: K.ms(u),
                duration: K.ms(d),
                endDelay: K.ms(p),
                easing: $(c) ? void 0 : xt(c, d),
                direction: h,
                iterations: y + 1,
                fill: "both"
            };
            a = t.animate({
                [b]: f,
                offset: m,
                easing: $(c) ? c.map(M => xt(M, d)) : void 0
            }, l), a.finished || (a.finished = new Promise((M, X) => {
                a.onfinish = M, a.oncancel = X
            }));
            const P = f[f.length - 1];
            a.finished.then(() => {
                S || (Z.set(t, b, P), a.cancel())
            }).catch(qt), g || (a.playbackRate = 1.000001)
        } else if (r && O) f = f.map(l => typeof l == "string" ? parseFloat(l) : l), f.length === 1 && f.unshift(parseFloat(E())), a = new r(l => {
            Z.set(t, b, j ? j(l) : l)
        }, f, Object.assign(Object.assign({}, i), {duration: d, easing: c})); else {
            const l = f[f.length - 1];
            Z.set(t, b, I && k(l) ? I.toDefaultUnit(l) : l)
        }
        return o && s(t, e, f, {
            duration: d,
            delay: u,
            easing: c,
            repeat: y,
            offset: m
        }, "motion-one"), x.setAnimation(a), a && !v && a.pause(), a
    }
}

const xe = (t, e) => t[e] ? Object.assign(Object.assign({}, t), t[e]) : Object.assign({}, t);

function kt(t, e) {
    var n;
    return typeof t == "string" ? e ? ((n = e[t]) !== null && n !== void 0 || (e[t] = document.querySelectorAll(t)), t = e[t]) : t = document.querySelectorAll(t) : t instanceof Element && (t = [t]), Array.from(t || [])
}

const De = t => t(),
    Ie = (t, e, n = A.duration) => new Proxy({animations: t.map(De).filter(Boolean), duration: n, options: e}, Pe),
    Me = t => t.animations[0], Pe = {
        get: (t, e) => {
            const n = Me(t);
            switch (e) {
                case"duration":
                    return t.duration;
                case"currentTime":
                    return K.s((n == null ? void 0 : n[e]) || 0);
                case"playbackRate":
                case"playState":
                    return n == null ? void 0 : n[e];
                case"finished":
                    return t.finished || (t.finished = Promise.all(t.animations.map(Ce)).catch(qt)), t.finished;
                case"stop":
                    return () => {
                        t.animations.forEach(i => Kt(i))
                    };
                case"forEachNative":
                    return i => {
                        t.animations.forEach(r => i(r, t))
                    };
                default:
                    return typeof (n == null ? void 0 : n[e]) > "u" ? void 0 : () => t.animations.forEach(i => i[e]())
            }
        }, set: (t, e, n) => {
            switch (e) {
                case"currentTime":
                    n = K.ms(n);
                case"playbackRate":
                    for (let i = 0; i < t.animations.length; i++) t.animations[i][e] = n;
                    return !0
            }
            return !1
        }
    }, Ce = t => t.finished;

function Fe(t, e, n) {
    return V(t) ? t(e, n) : t
}

function Le(t, e) {
    var n = {};
    for (var i in t) Object.prototype.hasOwnProperty.call(t, i) && e.indexOf(i) < 0 && (n[i] = t[i]);
    if (t != null && typeof Object.getOwnPropertySymbols == "function") for (var r = 0, i = Object.getOwnPropertySymbols(t); r < i.length; r++) e.indexOf(i[r]) < 0 && Object.prototype.propertyIsEnumerable.call(t, i[r]) && (n[i[r]] = t[i[r]]);
    return n
}

function Dt(t, e, n, i) {
    var r;
    return k(e) ? e : e.startsWith("-") || e.startsWith("+") ? Math.max(0, t + parseFloat(e)) : e === "<" ? n : (r = i.get(e)) !== null && r !== void 0 ? r : t
}

function Re(t, e, n) {
    for (let i = 0; i < t.length; i++) {
        const r = t[i];
        r.at > e && r.at < n && (Gt(t, r), i--)
    }
}

function je(t, e, n, i, r, s) {
    Re(t, r, s);
    for (let o = 0; o < e.length; o++) t.push({value: e[o], at: yt(r, s, i[o]), easing: Nt(n, o)})
}

function Ne(t, e) {
    return t.at === e.at ? t.value === null ? 1 : -1 : t.at - e.at
}

function qe(t, e = {}) {
    var n;
    const i = Be(t, e), r = i.map(s => we(...s, oe)).filter(Boolean);
    return Ie(r, e, (n = i[0]) === null || n === void 0 ? void 0 : n[3].duration)
}

function Be(t, e = {}) {
    var {defaultOptions: n = {}} = e, i = Le(e, ["defaultOptions"]);
    const r = [], s = new Map, o = {}, a = new Map;
    let d = 0, u = 0, p = 0;
    for (let y = 0; y < t.length; y++) {
        const c = t[y];
        if (Vt(c)) {
            a.set(c, u);
            continue
        } else if (!Array.isArray(c)) {
            a.set(c.name, Dt(u, c.at, d, a));
            continue
        }
        const [S, h, m = {}] = c;
        m.at !== void 0 && (u = Dt(u, m.at, d, a));
        let g = 0;
        const v = kt(S, o), w = v.length;
        for (let O = 0; O < w; O++) {
            const D = v[O], b = $e(D, s);
            for (const x in h) {
                const I = Ve(x, b);
                let E = Wt(h[x]);
                const f = xe(m, x);
                let {duration: j = n.duration || A.duration, easing: l = n.easing || A.easing} = f;
                if (tt(l)) {
                    ae(x === "opacity" || E.length > 1);
                    const rt = l.createAnimation(E, x !== "opacity", () => 0, x);
                    l = rt.easing, E = rt.keyframes || E, j = rt.duration || j
                }
                const P = Fe(m.delay, O, w) || 0, M = u + P, X = M + j;
                let {offset: q = Bt(E.length)} = f;
                q.length === 1 && q[0] === 0 && (q[1] = 1);
                const Et = q.length - E.length;
                Et > 0 && vt(q, Et), E.length === 1 && E.unshift(null), je(I, E, l, q, M, X), g = Math.max(P + j, g), p = Math.max(X, p)
            }
        }
        d = u, u += g
    }
    return s.forEach((y, c) => {
        for (const S in y) {
            const h = y[S];
            h.sort(Ne);
            const m = [], g = [], v = [];
            for (let w = 0; w < h.length; w++) {
                const {at: O, value: D, easing: b} = h[w];
                m.push(D), g.push(it(0, p, O)), v.push(b || A.easing)
            }
            g[0] !== 0 && (g.unshift(0), m.unshift(m[0]), v.unshift("linear")), g[g.length - 1] !== 1 && (g.push(1), m.push(null)), r.push([c, S, m, Object.assign(Object.assign(Object.assign({}, n), {
                duration: p,
                easing: v,
                offset: g
            }), i)])
        }
    }), r
}

function $e(t, e) {
    return !e.has(t) && e.set(t, {}), e.get(t)
}

function Ve(t, e) {
    return e[t] || (e[t] = []), e[t]
}

const ze = {any: 0, all: 1};

function _e(t, e, {root: n, margin: i, amount: r = "any"} = {}) {
    if (typeof IntersectionObserver > "u") return () => {
    };
    const s = kt(t), o = new WeakMap, a = u => {
        u.forEach(p => {
            const y = o.get(p.target);
            if (p.isIntersecting !== !!y) if (p.isIntersecting) {
                const c = e(p);
                V(c) ? o.set(p.target, c) : d.unobserve(p.target)
            } else y && (y(p), o.delete(p.target))
        })
    }, d = new IntersectionObserver(a, {root: n, rootMargin: i, threshold: typeof r == "number" ? r : ze[r]});
    return s.forEach(u => d.observe(u)), () => d.disconnect()
}

let T = [], z = [], _ = [], ht = [], pt = [], mt = [], G = 0, gt = 0;

function Ue(t) {
    z.forEach((n, i) => {
        T[i].hasAttribute(n) || T[i].setAttribute(n, "")
    }), ht.forEach((n, i) => {
        T[i].setAttribute("style", n)
    }), pt.forEach(([n, i], r) => {
        T[r].style.setProperty(n, i)
    }), _.forEach((n, i) => {
        T[i].hasAttribute(n) && T[i].removeAttribute(n)
    }), z = [], _ = [], ht = [], pt = [], G = 0;
    let e = mt;
    mt = [];
    for (let n = 0; n < e.length; n++) e[n](t);
    gt = t
}

function At() {
    G = G === 0 ? requestAnimationFrame(Ue) : G
}

const L = T.push(document.documentElement) - 1;
let N = [], R = [];
for (const t of document.getElementsByClassName("cursor")) t.classList.contains("cursor-anim:lerp") ? R.push(T.push(t) - 1) : N.push(T.push(t) - 1);
let C = R.map(() => [0, 0]);

function Yt(t, e, n) {
    ht[t] = `transform: translate(${e}px, ${n}px);`
}

function It(t, e, n) {
    return t + n * (e - t)
}

let J = -1, W = [0, 0];

function We(t) {
    J = -1;
    for (let e = 0; e < R.length; e++) {
        const n = R[e];
        (Math.abs(C[e][0] - W[0]) > .1 || Math.abs(C[e][1] - W[1]) > .1) && (C[e][0] = It(C[e][0], W[0], .5 * Math.min(1, (t - gt) / 50)), C[e][1] = It(C[e][1], W[1], .5 * Math.min(1, (t - gt) / 50)), Yt(n, C[e][0], C[e][1]), Ht(), At())
    }
}

function Ht() {
    J = J < 0 ? mt.push(We) - 1 : J
}

function Ke() {
    z[L] = "data-customcursor", delete _[L]
}

function ke() {
    _[L] = "data-customcursor", delete z[L]
}

function Mt(t) {
    z[t] = "data-hover", delete _[t]
}

function Ye() {
    for (let t = 0; t < N.length; t++) Mt(N[t]);
    for (let t = 0; t < R.length; t++) Mt(R[t])
}

function Pt(t) {
    _[t] = "data-hover", delete z[t]
}

function He() {
    for (let t = 0; t < N.length; t++) Pt(N[t]);
    for (let t = 0; t < R.length; t++) Pt(R[t])
}

function H(t) {
    if (t.pointerType !== "touch") {
        t.type !== "pointerleave" ? Ke() : ke(), t.type === "pointerover" ? Ye() : t.type === "pointerout" && He();
        for (let e = 0; e < N.length; e++) Yt(N[e], t.clientX, t.clientY);
        W = [t.clientX, t.clientY], Ht(), At()
    }
}

T[L].addEventListener("pointerenter", H, {passive: !0});
T[L].addEventListener("pointermove", H, {passive: !0});
T[L].addEventListener("pointerleave", H, {passive: !0});
for (const t of document.querySelectorAll("a, button")) t.addEventListener("pointerover", H, {passive: !0}), t.addEventListener("pointerout", H, {passive: !0});
let Ct = document.getElementById("header");
Ct && new ResizeObserver(t => {
    let n = t[0].borderBoxSize[0].blockSize;
    pt[L] = ["--header-block-size", `${n}px`], At()
}).observe(Ct, {box: "border-box"});
let Xe = document.getElementsByClassName("menu-icon")[0], Ze = document.querySelectorAll(".menu-toggle"),
    ct = document.getElementById("menu-phone");

function Ge() {
    ct == null || ct.toggleAttribute("data-open"), Xe.toggleAttribute("data-open")
}

Ze.forEach(t => {
    t.addEventListener("click", Ge)
});
const Je = new Intl.DateTimeFormat("en-CY", {
    hour: "2-digit",
    minute: "numeric",
    second: "numeric",
    hourCycle: "h23",
    timeZoneName: "shortOffset",
    timeZone: "Asia/Bangkok"
});

function Ft() {
    return Je.format(Date.now())
}

const lt = document.getElementById("timer");
if (lt) {
    lt.textContent = Ft();
    let t = null;
    setInterval(() => {
        t = t ?? requestAnimationFrame(() => {
            lt.textContent = Ft(), t = null
        })
    }, 1e3)
}
for (const t of document.querySelectorAll("[data-splitting]")) {
    let e = 0;
    Rt(t, n => {
        const i = document.createElement("span");
        i.textContent = n, i.setAttribute("data-gsap", "slidein"), i.setAttribute("data-gsap-dur", "0.75"), e > 0 && i.setAttribute("data-gsap-marker", "<5%"), e++;
        const r = document.createElement("div");
        return r.setAttribute("class", "splt-wrap"), r.appendChild(i), r
    })
}
const Qe = {
    slidein: (t, e, n) => [t, {transform: "translateY(0)"}, {duration: e, easing: [.2, 1, .57, .95], ...n}],
    slideout: (t, e, n) => [t, {transform: "translateY(150%)"}, {duration: e, easing: [.46, 0, .11, 1], ...n}],
    fadein: (t, e, n) => [t, {transform: "translateY(0)", opacity: 1}, {duration: e, easing: [.2, 1, .57, .95], ...n}],
    expand: (t, e, n) => [t, {transform: "scale(1)"}, {duration: e, easing: [.2, 1, .57, .95], ...n}]
};

function tn(t, e) {
    var i, r;
    const n = t.at(-1);
    if (Array.isArray(n) && typeof e == "string") {
        const s = ((i = n[2]) == null ? void 0 : i.duration) ?? .3,
            o = (r = /<(.+)/.exec(e)) == null ? void 0 : r.at(1);
        if (o) {
            if (o.endsWith("%")) {
                const a = parseFloat(o);
                if (Number.isNaN(a)) throw new Error(`${a} is not a valid number`);
                const u = s * (a / 100) - s;
                return u >= 0 ? `+${u}` : `${u}`
            }
            throw new Error(`${o} is not a valid relative value`)
        }
    }
    return e === null ? void 0 : e
}

let Xt = !1;
const Q = [];

function en(t) {
    Xt ? t.play() : Q.push(t)
}

function Lt() {
    Xt = !0, Q.forEach(t => t.play()), Q.splice(0, Q.length)
}

for (const t of document.getElementsByClassName("gsap")) {
    const e = [];
    for (const r of t.querySelectorAll("[data-gsap]")) {
        const s = Qe[r.getAttribute("data-gsap") ?? ""];
        if (s) {
            const o = parseFloat(r.getAttribute("data-gsap-dur") ?? ""), a = r.getAttribute("data-gsap-marker");
            e.push(s(r, o, {at: tn(e, a) ?? 0}))
        }
    }
    const n = t.getAttribute("data-gsap-proxy") ?? t, i = qe(e, {autoplay: !1});
    _e(n, () => {
        en(i)
    }, {margin: "0px 0px -60% 0px"})
}
const ut = document.getElementById("loading");
if (ut && ut.hasAttribute("data-showit")) {
    const t = performance.now() - Number(sessionStorage.getItem("loading-start"));
    setTimeout(() => {
        ut.setAttribute("data-done", ""), Lt()
    }, 2e3 - t)
} else Lt();
