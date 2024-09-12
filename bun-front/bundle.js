// node_modules/preact/dist/preact.module.js
function d(n, l) {
  for (var u in l)
    n[u] = l[u];
  return n;
}
function w(n) {
  var l = n.parentNode;
  l && l.removeChild(n);
}
function _(l, u, t) {
  var i, o, r, f = {};
  for (r in u)
    r == "key" ? i = u[r] : r == "ref" ? o = u[r] : f[r] = u[r];
  if (arguments.length > 2 && (f.children = arguments.length > 3 ? n.call(arguments, 2) : t), typeof l == "function" && l.defaultProps != null)
    for (r in l.defaultProps)
      f[r] === undefined && (f[r] = l.defaultProps[r]);
  return g(l, f, i, o, null);
}
function g(n, t, i, o, r) {
  var f = { type: n, props: t, key: i, ref: o, __k: null, __: null, __b: 0, __e: null, __d: undefined, __c: null, constructor: undefined, __v: r == null ? ++u : r, __i: -1, __u: 0 };
  return r == null && l.vnode != null && l.vnode(f), f;
}
function k(n) {
  return n.children;
}
function b(n, l) {
  this.props = n, this.context = l;
}
function x(n, l) {
  if (l == null)
    return n.__ ? x(n.__, n.__i + 1) : null;
  for (var u;l < n.__k.length; l++)
    if ((u = n.__k[l]) != null && u.__e != null)
      return u.__e;
  return typeof n.type == "function" ? x(n) : null;
}
function C(n) {
  var l, u;
  if ((n = n.__) != null && n.__c != null) {
    for (n.__e = n.__c.base = null, l = 0;l < n.__k.length; l++)
      if ((u = n.__k[l]) != null && u.__e != null) {
        n.__e = n.__c.base = u.__e;
        break;
      }
    return C(n);
  }
}
function M(n) {
  (!n.__d && (n.__d = true) && i.push(n) && !P.__r++ || o !== l.debounceRendering) && ((o = l.debounceRendering) || r)(P);
}
function P() {
  var n, u, t, o, r, e, c, s;
  for (i.sort(f);n = i.shift(); )
    n.__d && (u = i.length, o = undefined, e = (r = (t = n).__v).__e, c = [], s = [], t.__P && ((o = d({}, r)).__v = r.__v + 1, l.vnode && l.vnode(o), O(t.__P, o, r, t.__n, t.__P.namespaceURI, 32 & r.__u ? [e] : null, c, e == null ? x(r) : e, !!(32 & r.__u), s), o.__v = r.__v, o.__.__k[o.__i] = o, j(c, o, s), o.__e != e && C(o)), i.length > u && i.sort(f));
  P.__r = 0;
}
function S(n, l, u, t, i, o, r, f, e, c, s) {
  var a, v, y, d2, w2, _2 = t && t.__k || p, g2 = l.length;
  for (u.__d = e, $(u, l, _2), e = u.__d, a = 0;a < g2; a++)
    (y = u.__k[a]) != null && typeof y != "boolean" && typeof y != "function" && (v = y.__i === -1 ? h : _2[y.__i] || h, y.__i = a, O(n, y, v, i, o, r, f, e, c, s), d2 = y.__e, y.ref && v.ref != y.ref && (v.ref && N(v.ref, null, y), s.push(y.ref, y.__c || d2, y)), w2 == null && d2 != null && (w2 = d2), 65536 & y.__u || v.__k === y.__k ? e = I(y, e, n) : typeof y.type == "function" && y.__d !== undefined ? e = y.__d : d2 && (e = d2.nextSibling), y.__d = undefined, y.__u &= -196609);
  u.__d = e, u.__e = w2;
}
function $(n, l, u) {
  var t, i, o, r, f, e = l.length, c = u.length, s = c, a = 0;
  for (n.__k = [], t = 0;t < e; t++)
    r = t + a, (i = n.__k[t] = (i = l[t]) == null || typeof i == "boolean" || typeof i == "function" ? null : typeof i == "string" || typeof i == "number" || typeof i == "bigint" || i.constructor == String ? g(null, i, null, null, null) : y(i) ? g(k, { children: i }, null, null, null) : i.constructor === undefined && i.__b > 0 ? g(i.type, i.props, i.key, i.ref ? i.ref : null, i.__v) : i) != null ? (i.__ = n, i.__b = n.__b + 1, f = L(i, u, r, s), i.__i = f, o = null, f !== -1 && (s--, (o = u[f]) && (o.__u |= 131072)), o == null || o.__v === null ? (f == -1 && a--, typeof i.type != "function" && (i.__u |= 65536)) : f !== r && (f == r - 1 ? a-- : f == r + 1 ? a++ : f > r ? s > e - r ? a += f - r : a-- : f < r && (f == r - a ? a -= f - r : a++), f !== t + a && (i.__u |= 65536))) : (o = u[r]) && o.key == null && o.__e && (131072 & o.__u) == 0 && (o.__e == n.__d && (n.__d = x(o)), V(o, o, false), u[r] = null, s--);
  if (s)
    for (t = 0;t < c; t++)
      (o = u[t]) != null && (131072 & o.__u) == 0 && (o.__e == n.__d && (n.__d = x(o)), V(o, o));
}
function I(n, l, u) {
  var t, i;
  if (typeof n.type == "function") {
    for (t = n.__k, i = 0;t && i < t.length; i++)
      t[i] && (t[i].__ = n, l = I(t[i], l, u));
    return l;
  }
  n.__e != l && (l && n.type && !u.contains(l) && (l = x(n)), u.insertBefore(n.__e, l || null), l = n.__e);
  do {
    l = l && l.nextSibling;
  } while (l != null && l.nodeType === 8);
  return l;
}
function L(n, l, u, t) {
  var { key: i, type: o } = n, r = u - 1, f = u + 1, e = l[u];
  if (e === null || e && i == e.key && o === e.type && (131072 & e.__u) == 0)
    return u;
  if (t > (e != null && (131072 & e.__u) == 0 ? 1 : 0))
    for (;r >= 0 || f < l.length; ) {
      if (r >= 0) {
        if ((e = l[r]) && (131072 & e.__u) == 0 && i == e.key && o === e.type)
          return r;
        r--;
      }
      if (f < l.length) {
        if ((e = l[f]) && (131072 & e.__u) == 0 && i == e.key && o === e.type)
          return f;
        f++;
      }
    }
  return -1;
}
function T(n, l, u) {
  l[0] === "-" ? n.setProperty(l, u == null ? "" : u) : n[l] = u == null ? "" : typeof u != "number" || v.test(l) ? u : u + "px";
}
function A(n, l, u, t, i) {
  var o;
  n:
    if (l === "style")
      if (typeof u == "string")
        n.style.cssText = u;
      else {
        if (typeof t == "string" && (n.style.cssText = t = ""), t)
          for (l in t)
            u && l in u || T(n.style, l, "");
        if (u)
          for (l in u)
            t && u[l] === t[l] || T(n.style, l, u[l]);
      }
    else if (l[0] === "o" && l[1] === "n")
      o = l !== (l = l.replace(/(PointerCapture)$|Capture$/i, "$1")), l = l.toLowerCase() in n || l === "onFocusOut" || l === "onFocusIn" ? l.toLowerCase().slice(2) : l.slice(2), n.l || (n.l = {}), n.l[l + o] = u, u ? t ? u.u = t.u : (u.u = e, n.addEventListener(l, o ? s : c, o)) : n.removeEventListener(l, o ? s : c, o);
    else {
      if (i == "http://www.w3.org/2000/svg")
        l = l.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
      else if (l != "width" && l != "height" && l != "href" && l != "list" && l != "form" && l != "tabIndex" && l != "download" && l != "rowSpan" && l != "colSpan" && l != "role" && l != "popover" && l in n)
        try {
          n[l] = u == null ? "" : u;
          break n;
        } catch (n2) {
        }
      typeof u == "function" || (u == null || u === false && l[4] !== "-" ? n.removeAttribute(l) : n.setAttribute(l, l == "popover" && u == 1 ? "" : u));
    }
}
function F(n) {
  return function(u) {
    if (this.l) {
      var t = this.l[u.type + n];
      if (u.t == null)
        u.t = e++;
      else if (u.t < t.u)
        return;
      return t(l.event ? l.event(u) : u);
    }
  };
}
function O(n, u, t, i, o, r, f, e, c, s) {
  var a, h, p, v, w2, _2, g2, m, x2, C2, M2, P2, $2, I2, H, L2, T2 = u.type;
  if (u.constructor !== undefined)
    return null;
  128 & t.__u && (c = !!(32 & t.__u), r = [e = u.__e = t.__e]), (a = l.__b) && a(u);
  n:
    if (typeof T2 == "function")
      try {
        if (m = u.props, x2 = "prototype" in T2 && T2.prototype.render, C2 = (a = T2.contextType) && i[a.__c], M2 = a ? C2 ? C2.props.value : a.__ : i, t.__c ? g2 = (h = u.__c = t.__c).__ = h.__E : (x2 ? u.__c = h = new T2(m, M2) : (u.__c = h = new b(m, M2), h.constructor = T2, h.render = q), C2 && C2.sub(h), h.props = m, h.state || (h.state = {}), h.context = M2, h.__n = i, p = h.__d = true, h.__h = [], h._sb = []), x2 && h.__s == null && (h.__s = h.state), x2 && T2.getDerivedStateFromProps != null && (h.__s == h.state && (h.__s = d({}, h.__s)), d(h.__s, T2.getDerivedStateFromProps(m, h.__s))), v = h.props, w2 = h.state, h.__v = u, p)
          x2 && T2.getDerivedStateFromProps == null && h.componentWillMount != null && h.componentWillMount(), x2 && h.componentDidMount != null && h.__h.push(h.componentDidMount);
        else {
          if (x2 && T2.getDerivedStateFromProps == null && m !== v && h.componentWillReceiveProps != null && h.componentWillReceiveProps(m, M2), !h.__e && (h.shouldComponentUpdate != null && h.shouldComponentUpdate(m, h.__s, M2) === false || u.__v === t.__v)) {
            for (u.__v !== t.__v && (h.props = m, h.state = h.__s, h.__d = false), u.__e = t.__e, u.__k = t.__k, u.__k.forEach(function(n2) {
              n2 && (n2.__ = u);
            }), P2 = 0;P2 < h._sb.length; P2++)
              h.__h.push(h._sb[P2]);
            h._sb = [], h.__h.length && f.push(h);
            break n;
          }
          h.componentWillUpdate != null && h.componentWillUpdate(m, h.__s, M2), x2 && h.componentDidUpdate != null && h.__h.push(function() {
            h.componentDidUpdate(v, w2, _2);
          });
        }
        if (h.context = M2, h.props = m, h.__P = n, h.__e = false, $2 = l.__r, I2 = 0, x2) {
          for (h.state = h.__s, h.__d = false, $2 && $2(u), a = h.render(h.props, h.state, h.context), H = 0;H < h._sb.length; H++)
            h.__h.push(h._sb[H]);
          h._sb = [];
        } else
          do {
            h.__d = false, $2 && $2(u), a = h.render(h.props, h.state, h.context), h.state = h.__s;
          } while (h.__d && ++I2 < 25);
        h.state = h.__s, h.getChildContext != null && (i = d(d({}, i), h.getChildContext())), x2 && !p && h.getSnapshotBeforeUpdate != null && (_2 = h.getSnapshotBeforeUpdate(v, w2)), S(n, y(L2 = a != null && a.type === k && a.key == null ? a.props.children : a) ? L2 : [L2], u, t, i, o, r, f, e, c, s), h.base = u.__e, u.__u &= -161, h.__h.length && f.push(h), g2 && (h.__E = h.__ = null);
      } catch (n2) {
        if (u.__v = null, c || r != null) {
          for (u.__u |= c ? 160 : 32;e && e.nodeType === 8 && e.nextSibling; )
            e = e.nextSibling;
          r[r.indexOf(e)] = null, u.__e = e;
        } else
          u.__e = t.__e, u.__k = t.__k;
        l.__e(n2, u, t);
      }
    else
      r == null && u.__v === t.__v ? (u.__k = t.__k, u.__e = t.__e) : u.__e = z(t.__e, u, t, i, o, r, f, c, s);
  (a = l.diffed) && a(u);
}
function j(n, u, t) {
  u.__d = undefined;
  for (var i = 0;i < t.length; i++)
    N(t[i], t[++i], t[++i]);
  l.__c && l.__c(u, n), n.some(function(u2) {
    try {
      n = u2.__h, u2.__h = [], n.some(function(n2) {
        n2.call(u2);
      });
    } catch (n2) {
      l.__e(n2, u2.__v);
    }
  });
}
function z(l, u, t, i, o, r, f, e, c) {
  var s, a, p, v, d2, _2, g2, m = t.props, k2 = u.props, b2 = u.type;
  if (b2 === "svg" ? o = "http://www.w3.org/2000/svg" : b2 === "math" ? o = "http://www.w3.org/1998/Math/MathML" : o || (o = "http://www.w3.org/1999/xhtml"), r != null) {
    for (s = 0;s < r.length; s++)
      if ((d2 = r[s]) && "setAttribute" in d2 == !!b2 && (b2 ? d2.localName === b2 : d2.nodeType === 3)) {
        l = d2, r[s] = null;
        break;
      }
  }
  if (l == null) {
    if (b2 === null)
      return document.createTextNode(k2);
    l = document.createElementNS(o, b2, k2.is && k2), r = null, e = false;
  }
  if (b2 === null)
    m === k2 || e && l.data === k2 || (l.data = k2);
  else {
    if (r = r && n.call(l.childNodes), m = t.props || h, !e && r != null)
      for (m = {}, s = 0;s < l.attributes.length; s++)
        m[(d2 = l.attributes[s]).name] = d2.value;
    for (s in m)
      if (d2 = m[s], s == "children")
        ;
      else if (s == "dangerouslySetInnerHTML")
        p = d2;
      else if (s !== "key" && !(s in k2)) {
        if (s == "value" && "defaultValue" in k2 || s == "checked" && "defaultChecked" in k2)
          continue;
        A(l, s, null, d2, o);
      }
    for (s in k2)
      d2 = k2[s], s == "children" ? v = d2 : s == "dangerouslySetInnerHTML" ? a = d2 : s == "value" ? _2 = d2 : s == "checked" ? g2 = d2 : s === "key" || e && typeof d2 != "function" || m[s] === d2 || A(l, s, d2, m[s], o);
    if (a)
      e || p && (a.__html === p.__html || a.__html === l.innerHTML) || (l.innerHTML = a.__html), u.__k = [];
    else if (p && (l.innerHTML = ""), S(l, y(v) ? v : [v], u, t, i, b2 === "foreignObject" ? "http://www.w3.org/1999/xhtml" : o, r, f, r ? r[0] : t.__k && x(t, 0), e, c), r != null)
      for (s = r.length;s--; )
        r[s] != null && w(r[s]);
    e || (s = "value", _2 !== undefined && (_2 !== l[s] || b2 === "progress" && !_2 || b2 === "option" && _2 !== m[s]) && A(l, s, _2, m[s], o), s = "checked", g2 !== undefined && g2 !== l[s] && A(l, s, g2, m[s], o));
  }
  return l;
}
function N(n, u, t) {
  try {
    if (typeof n == "function") {
      var i = typeof n.__u == "function";
      i && n.__u(), i && u == null || (n.__u = n(u));
    } else
      n.current = u;
  } catch (n2) {
    l.__e(n2, t);
  }
}
function V(n, u, t) {
  var i, o;
  if (l.unmount && l.unmount(n), (i = n.ref) && (i.current && i.current !== n.__e || N(i, null, u)), (i = n.__c) != null) {
    if (i.componentWillUnmount)
      try {
        i.componentWillUnmount();
      } catch (n2) {
        l.__e(n2, u);
      }
    i.base = i.__P = null;
  }
  if (i = n.__k)
    for (o = 0;o < i.length; o++)
      i[o] && V(i[o], u, t || typeof n.type != "function");
  t || n.__e == null || w(n.__e), n.__c = n.__ = n.__e = n.__d = undefined;
}
function q(n, l, u) {
  return this.constructor(n, u);
}
function B(u, t, i) {
  var o, r, f, e;
  l.__ && l.__(u, t), r = (o = typeof i == "function") ? null : i && i.__k || t.__k, f = [], e = [], O(t, u = (!o && i || t).__k = _(k, null, [u]), r || h, h, t.namespaceURI, !o && i ? [i] : r ? null : t.firstChild ? n.call(t.childNodes) : null, f, !o && i ? i : r ? r.__e : t.firstChild, o, e), j(f, u, e);
}
var n;
var l;
var u;
var t;
var i;
var o;
var r;
var f;
var e;
var c;
var s;
var a;
var h = {};
var p = [];
var v = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;
var y = Array.isArray;
n = p.slice, l = { __e: function(n2, l2, u2, t2) {
  for (var i2, o2, r2;l2 = l2.__; )
    if ((i2 = l2.__c) && !i2.__)
      try {
        if ((o2 = i2.constructor) && o2.getDerivedStateFromError != null && (i2.setState(o2.getDerivedStateFromError(n2)), r2 = i2.__d), i2.componentDidCatch != null && (i2.componentDidCatch(n2, t2 || {}), r2 = i2.__d), r2)
          return i2.__E = i2;
      } catch (l3) {
        n2 = l3;
      }
  throw n2;
} }, u = 0, t = function(n2) {
  return n2 != null && n2.constructor == null;
}, b.prototype.setState = function(n2, l2) {
  var u2;
  u2 = this.__s != null && this.__s !== this.state ? this.__s : this.__s = d({}, this.state), typeof n2 == "function" && (n2 = n2(d({}, u2), this.props)), n2 && d(u2, n2), n2 != null && this.__v && (l2 && this._sb.push(l2), M(this));
}, b.prototype.forceUpdate = function(n2) {
  this.__v && (this.__e = true, n2 && this.__h.push(n2), M(this));
}, b.prototype.render = k, i = [], r = typeof Promise == "function" ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, f = function(n2, l2) {
  return n2.__v.__b - l2.__v.__b;
}, P.__r = 0, e = 0, c = F(false), s = F(true), a = 0;

// node_modules/preact/hooks/dist/hooks.module.js
function d2(n2, t2) {
  c2.__h && c2.__h(r2, n2, o2 || t2), o2 = 0;
  var u2 = r2.__H || (r2.__H = { __: [], __h: [] });
  return n2 >= u2.__.length && u2.__.push({}), u2.__[n2];
}
function h2(n2) {
  return o2 = 1, p2(D, n2);
}
function p2(n2, u2, i2) {
  var o2 = d2(t2++, 2);
  if (o2.t = n2, !o2.__c && (o2.__ = [i2 ? i2(u2) : D(undefined, u2), function(n3) {
    var t2 = o2.__N ? o2.__N[0] : o2.__[0], r2 = o2.t(t2, n3);
    t2 !== r2 && (o2.__N = [r2, o2.__[1]], o2.__c.setState({}));
  }], o2.__c = r2, !r2.u)) {
    var f2 = function(n3, t2, r2) {
      if (!o2.__c.__H)
        return true;
      var u3 = o2.__c.__H.__.filter(function(n4) {
        return !!n4.__c;
      });
      if (u3.every(function(n4) {
        return !n4.__N;
      }))
        return !c2 || c2.call(this, n3, t2, r2);
      var i3 = false;
      return u3.forEach(function(n4) {
        if (n4.__N) {
          var t3 = n4.__[0];
          n4.__ = n4.__N, n4.__N = undefined, t3 !== n4.__[0] && (i3 = true);
        }
      }), !(!i3 && o2.__c.props === n3) && (!c2 || c2.call(this, n3, t2, r2));
    };
    r2.u = true;
    var { shouldComponentUpdate: c2, componentWillUpdate: e2 } = r2;
    r2.componentWillUpdate = function(n3, t2, r2) {
      if (this.__e) {
        var u3 = c2;
        c2 = undefined, f2(n3, t2, r2), c2 = u3;
      }
      e2 && e2.call(this, n3, t2, r2);
    }, r2.shouldComponentUpdate = f2;
  }
  return o2.__N || o2.__;
}
function y2(n2, u2) {
  var i2 = d2(t2++, 3);
  !c2.__s && C2(i2.__H, u2) && (i2.__ = n2, i2.i = u2, r2.__H.__h.push(i2));
}
function T2(n2, r2) {
  var u2 = d2(t2++, 7);
  return C2(u2.__H, r2) && (u2.__ = n2(), u2.__H = r2, u2.__h = n2), u2.__;
}
function j2() {
  for (var n2;n2 = f2.shift(); )
    if (n2.__P && n2.__H)
      try {
        n2.__H.__h.forEach(z2), n2.__H.__h.forEach(B2), n2.__H.__h = [];
      } catch (t2) {
        n2.__H.__h = [], c2.__e(t2, n2.__v);
      }
}
function w2(n2) {
  var t2, r2 = function() {
    clearTimeout(u2), k2 && cancelAnimationFrame(t2), setTimeout(n2);
  }, u2 = setTimeout(r2, 100);
  k2 && (t2 = requestAnimationFrame(r2));
}
function z2(n2) {
  var t2 = r2, u2 = n2.__c;
  typeof u2 == "function" && (n2.__c = undefined, u2()), r2 = t2;
}
function B2(n2) {
  var t2 = r2;
  n2.__c = n2.__(), r2 = t2;
}
function C2(n2, t2) {
  return !n2 || n2.length !== t2.length || t2.some(function(t3, r2) {
    return t3 !== n2[r2];
  });
}
function D(n2, t2) {
  return typeof t2 == "function" ? t2(n2) : t2;
}
var t2;
var r2;
var u2;
var i2;
var o2 = 0;
var f2 = [];
var c2 = l;
var e2 = c2.__b;
var a2 = c2.__r;
var v2 = c2.diffed;
var l2 = c2.__c;
var m = c2.unmount;
var s2 = c2.__;
c2.__b = function(n2) {
  r2 = null, e2 && e2(n2);
}, c2.__ = function(n2, t3) {
  n2 && t3.__k && t3.__k.__m && (n2.__m = t3.__k.__m), s2 && s2(n2, t3);
}, c2.__r = function(n2) {
  a2 && a2(n2), t2 = 0;
  var i3 = (r2 = n2.__c).__H;
  i3 && (u2 === r2 ? (i3.__h = [], r2.__h = [], i3.__.forEach(function(n3) {
    n3.__N && (n3.__ = n3.__N), n3.i = n3.__N = undefined;
  })) : (i3.__h.forEach(z2), i3.__h.forEach(B2), i3.__h = [], t2 = 0)), u2 = r2;
}, c2.diffed = function(n2) {
  v2 && v2(n2);
  var t3 = n2.__c;
  t3 && t3.__H && (t3.__H.__h.length && (f2.push(t3) !== 1 && i2 === c2.requestAnimationFrame || ((i2 = c2.requestAnimationFrame) || w2)(j2)), t3.__H.__.forEach(function(n3) {
    n3.i && (n3.__H = n3.i), n3.i = undefined;
  })), u2 = r2 = null;
}, c2.__c = function(n2, t3) {
  t3.some(function(n3) {
    try {
      n3.__h.forEach(z2), n3.__h = n3.__h.filter(function(n4) {
        return !n4.__ || B2(n4);
      });
    } catch (r3) {
      t3.some(function(n4) {
        n4.__h && (n4.__h = []);
      }), t3 = [], c2.__e(r3, n3.__v);
    }
  }), l2 && l2(n2, t3);
}, c2.unmount = function(n2) {
  m && m(n2);
  var t3, r3 = n2.__c;
  r3 && r3.__H && (r3.__H.__.forEach(function(n3) {
    try {
      z2(n3);
    } catch (n4) {
      t3 = n4;
    }
  }), r3.__H = undefined, t3 && c2.__e(t3, r3.__v));
};
var k2 = typeof requestAnimationFrame == "function";
// node_modules/preact/jsx-runtime/dist/jsxRuntime.module.js
function u3(e3, t3, n2, o3, i3, u4) {
  t3 || (t3 = {});
  var a3, c3, p3 = t3;
  if ("ref" in p3)
    for (c3 in p3 = {}, t3)
      c3 == "ref" ? a3 = t3[c3] : p3[c3] = t3[c3];
  var l3 = { type: e3, props: p3, key: n2, ref: a3, __k: null, __: null, __b: 0, __e: null, __d: undefined, __c: null, constructor: undefined, __v: --f3, __i: -1, __u: 0, __source: i3, __self: u4 };
  if (typeof e3 == "function" && (a3 = e3.defaultProps))
    for (c3 in a3)
      p3[c3] === undefined && (p3[c3] = a3[c3]);
  return l.vnode && l.vnode(l3), l3;
}
var f3 = 0;
var i3 = Array.isArray;

// root.tsx
var api = () => {
  const uid = new URL(document.location.href).searchParams.get("uid") || 552926829;
  return fetch("http://188/130.251.165/api/postsbyuser/" + uid).then((x2) => x2.json());
};
var Table = () => {
  const [data, setData] = h2([]);
  y2(() => {
    api().then(setData);
  }, []);
  const columns = [
    {
      key: "id",
      h: "ID",
      r: (row) => /* @__PURE__ */ u3("a", {
        href: `https://vk.com/wall-100407134_${row.id}`,
        target: "_blank",
        children: row.id
      }, undefined, false, undefined, this)
    },
    {
      key: "uid",
      h: "\uD83D\uDE4D\u200D\u2642\uFE0F",
      r: (row) => /* @__PURE__ */ u3("a", {
        href: `https://vk.com/id${row.uid}`,
        target: "_blank",
        children: row.uid
      }, undefined, false, undefined, this)
    },
    {
      key: "c",
      h: "\uD83D\uDCDD"
    },
    {
      key: "l",
      h: "\u2764"
    },
    {
      key: "d",
      h: "\uD83D\uDCC6",
      r: (row) => new Date(row.d * 1000).toLocaleString()
    },
    {
      key: "e",
      h: "\uD83D\uDCC6\u270F"
    },
    {
      key: "t",
      h: "\uD83D\uDCCB",
      sort: (a3) => a3.length
    }
  ];
  const [sort, setSort] = h2([null, 0]);
  const onSort = (key) => {
    const [k3, dir] = sort;
    if (k3 === key) {
      setSort([key, (dir + 1) % 2]);
    } else {
      setSort([key, 0]);
    }
  };
  const sorted = T2(() => {
    const [k3, dir] = sort;
    if (!k3)
      return data;
    const s3 = columns.find((x2) => x2.key === k3)?.sort || ((x2) => x2);
    return data.sort((a3, b2) => dir ? s3(a3[k3]) - s3(b2[k3]) : s3(b2[k3]) - s3(a3[k3]));
  }, [data, sort]);
  return /* @__PURE__ */ u3("table", {
    children: [
      /* @__PURE__ */ u3("thead", {
        children: columns.map((x2) => /* @__PURE__ */ u3("th", {
          onClick: () => onSort(x2.key),
          style: { userSelect: "none" },
          children: [
            x2.h || x2.key,
            " ",
            x2.key === sort[0] && (sort[1] ? "\u25B2" : "\u25BC")
          ]
        }, undefined, true, undefined, this))
      }, undefined, false, undefined, this),
      /* @__PURE__ */ u3("tbody", {
        children: sorted.map((x2) => /* @__PURE__ */ u3("tr", {
          children: columns.map((y3) => /* @__PURE__ */ u3("td", {
            children: y3.r ? y3.r(x2) : x2[y3.key]
          }, undefined, false, undefined, this))
        }, undefined, false, undefined, this))
      }, undefined, false, undefined, this)
    ]
  }, undefined, true, undefined, this);
};
var Card = ({ color, text }) => {
  const [col, setCol] = h2(color);
  const randCol = () => {
    const newCol = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    setCol(newCol);
  };
  y2(randCol, []);
  return /* @__PURE__ */ u3(k, {
    children: [
      /* @__PURE__ */ u3(Table, {}, undefined, false, undefined, this),
      /* @__PURE__ */ u3("button", {
        onClick: (e3) => document.body.classList.toggle("dark"),
        style: { padding: "5px 12px", margin: 12 },
        children: "\u0422\u0435\u043C\u0430"
      }, undefined, false, undefined, this),
      /* @__PURE__ */ u3("div", {
        style: { background: col, padding: 10, border: "1px solid black", cursor: "pointer" },
        onClick: randCol,
        children: text
      }, undefined, false, undefined, this)
    ]
  }, undefined, true, undefined, this);
};
B(/* @__PURE__ */ u3(Card, {
  color: "red",
  text: "Ya ne znayu sho skazat"
}, undefined, false, undefined, this), document.body);
