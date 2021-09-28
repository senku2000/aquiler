!function r(a, s, d) { function l(t, e) { if (!s[t]) { if (!a[t]) { var n = "function" == typeof require && require; if (!e && n) return n(t, !0); if (c) return c(t, !0); var o = new Error("Cannot find module '" + t + "'"); throw o.code = "MODULE_NOT_FOUND", o } var i = s[t] = { exports: {} }; a[t][0].call(i.exports, function (e) { return l(a[t][1][e] || e) }, i, i.exports, r, a, s, d) } return s[t].exports } for (var c = "function" == typeof require && require, e = 0; e < d.length; e++)l(d[e]); return l }({ 1: [function (e, t, n) { "use strict"; Object.defineProperty(n, "__esModule", { value: !0 }); var o = e("micromodal"), a = e("./templates/modal"), s = e("./templates/iframe"), d = e("./utils"), i = (r.create = function (e, t, n, o) { var i = document.getElementById(e); i && d.Utils.removeHTMLElement(i); var r = a.default.replace(/\{\{iframe\}\}/g, s.default).replace(/\{\{link\}\}/g, o).replace(/\{\{modal_id\}\}/g, e).replace(/\{\{iframe_id\}\}/g, t).replace(/\{\{form_id\}\}/g, n); (i = document.createElement("div")).innerHTML = r, i.setAttribute("id", e), i.setAttribute("class", "modal micromodal-slide"), i.setAttribute("aria-hidden", "true"), document.body.appendChild(i) }, r.open = function (e, t) { void 0 === t && (t = function (e) { }), o.show(e, { debugMode: !0, onClose: function (e) { d.Utils.removeHTMLElement(e) } }) }, r.close = function (e) { o.close(e) }, r); function r() { } n.CheckoutDialog = i }, { "./templates/iframe": 9, "./templates/modal": 10, "./utils": 11, micromodal: 12 }], 2: [function (e, t, n) { "use strict"; Object.defineProperty(n, "__esModule", { value: !0 }); var o = e("./utils"), s = e("./checkout-dialog"), i = e("./templates/iframe"), d = e("./const"), r = (a.prototype.open = function () { s.CheckoutDialog.create(this.modalId, this.iframeId, this.formId, this.url), s.CheckoutDialog.open(this.modalId, this.options.onComplete), this.ensureIframeIsLoadedAndSubmitFormIn() }, a.prototype.setupForElement = function () { var e, t, n = this; this.element && ((null === (e = this.options.button) || void 0 === e ? void 0 : e.class) && this.element.setAttribute("class", this.options.button.class), (null === (t = this.options.button) || void 0 === t ? void 0 : t.text) && (this.element.innerHTML = this.options.button.text), "manual" !== this.options.trigger && this.element.addEventListener(this.options.trigger, function () { n.open() })) }, a.prototype.ensureIframeIsLoadedAndSubmitFormIn = function () { var t = this, n = document.getElementById(this.iframeId); n.addEventListener("load", function e() { n.removeEventListener("load", e), t.setupForm().submit() }) }, a.prototype.embedElement = function () { return o.Utils.isADOMElement(this.options.container) ? this.options.container : document.querySelector(this.options.container) }, a.prototype.setupForEmbedElement = function () { if (this.isEmbededCheckout()) { var e = i.default.replace(/\{\{link\}\}/g, this.url).replace(/\{\{iframe_id\}\}/g, this.iframeId); this.embedElement().innerHTML = e, this.createSetupFormForEmbed(), this.ensureIframeIsLoadedAndSubmitFormIn() } }, a.prototype.isEmbededCheckout = function () { return !this.element && this.options.container }, a.prototype.extendElementOptions = function (e) { if (e = e || {}, this.element) { var t = o.Utils.datasetToObject(this.element.dataset, ["environment", "url", "public_key", "container", "trigger", "locale", "transaction_id", "transaction_amount", "transaction_description", "currency_iso", "currency_code", "customer_firstname", "customer_lastname", "customer_email", "customer_phone_number_number", "customer_phone_number_country", "widget_description", "widget_image", "widget_title", "button_text", "button_class", "submit_form_on_failed", /^transaction_custom_metadata_.+/], ["public_key", "custom_metadata"]); e = Object.assign(e, t) } this.options = Object.assign({ trigger: "click", transaction: { amount: 100, description: "Please change this description" }, currency: { iso: "XOF" }, submit_form_on_failed: !0 }, e) }, a.prototype.getCheckoutOrigin = function () { var e = this.detectEnvironment(); if (this.options.url) return this.options.url; if (e) return "https://" + ("live" === e ? "" : e + "-") + "checkout.fedapay.com"; var t = document.currentScript; if (t && t.src && -1 !== t.src.indexOf(".fedapay.com")) { var n = t.src.split("://"); return n[0] + "://" + n[1].split("/")[0] } return "" }, a.prototype.detectEnvironment = function () { if (this.options.environment) return this.options.environment; switch (0) { case this.options.public_key.indexOf("pk_live"): return "live"; case this.options.public_key.indexOf("pk_sandbox"): return "sandbox"; case this.options.public_key.indexOf("pk_dev"): return "dev" } }, a.prototype.setupForm = function () { var e = document.getElementById(this.formId); e.setAttribute("method", "POST"), e.setAttribute("action", this.url), e.setAttribute("target", this.iframeId); var t = o.Utils.objectToFormNames(Object.assign({ site_domain: window.location.host }, this.options, { secured_id: this.securedId }), null, ["container"]); for (var n in t) e.appendChild(this.createHiddenInputField(n, t[n])); return e }, a.prototype.createSetupFormForEmbed = function () { var e = document.createElement("form"); e.setAttribute("id", this.formId), document.body.appendChild(e) }, a.prototype.createHiddenInputField = function (e, t) { var n = o.Utils.createHTMLElement("input"); return n.setAttribute("type", "text"), n.setAttribute("hidden", ""), n.setAttribute("name", e), n.setAttribute("value", t), n }, a.prototype.addFieldToForm = function (e, t, n) { e.appendChild(this.createHiddenInputField(t, n)) }, a.prototype.replaceUserFormFieldValue = function (e, n) { o.Utils.eachQuerySelector("input[data-value]", function (e) { var t = o.Utils.objectGet(n, e.dataset.value); e.setAttribute("value", t) }, e) }, a.prototype.addWindowEvent = function () { var a = this; window.addEventListener("message", function (e) { var t, n; if (a.url.startsWith(e.origin) && e.data.secured_id === a.securedId) { var o = void 0; if (o = a.isEmbededCheckout() ? a.embedElement().parentNode : (s.CheckoutDialog.close(a.modalId), null === (t = a.element) || void 0 === t ? void 0 : t.parentNode), "function" == typeof a.options.onComplete && a.options.onComplete({ reason: e.data.close ? d.DIALOG_DISMISSED : d.CHECKOUT_COMPLETED, transaction: e.data.transaction }), "FORM" === (null === (n = o) || void 0 === n ? void 0 : n.tagName.toUpperCase())) { a.addFieldToForm(o, "transaction-id", e.data.transaction.id), a.addFieldToForm(o, "transaction-status", e.data.transaction.status), a.replaceUserFormFieldValue(o, e.data.transaction); var i = ["approved", "transferred"].includes(e.data.transaction.status), r = a.options.submit_form_on_failed && "false" !== a.options.submit_form_on_failed && "0" !== a.options.submit_form_on_failed; (r || !r && i) && o.submit() } } }) }, a); function a(e, t) { if (void 0 === e && (e = null), void 0 === t && (t = null), this.element = t, this.modalId = o.Utils.generateId("fedapay_modal_"), this.iframeId = o.Utils.generateId("fedapay_iframe_"), this.formId = o.Utils.generateId("fedapay_form_"), this.securedId = o.Utils.generateId("secured_id_"), this.extendElementOptions(e), o.Utils.isEmpty(this.options.public_key)) throw new Error("No public key defined"); this.url = this.getCheckoutOrigin(), this.setupForElement(), this.setupForEmbedElement(), this.addWindowEvent() } n.CheckoutElement = r }, { "./checkout-dialog": 1, "./const": 3, "./templates/iframe": 9, "./utils": 11 }], 3: [function (e, t, n) { "use strict"; Object.defineProperty(n, "__esModule", { value: !0 }), n.DIALOG_DISMISSED = "DIALOG DISMISSED", n.CHECKOUT_COMPLETED = "CHECKOUT COMPLETE" }, {}], 4: [function (e, t, n) { "use strict"; Object.defineProperty(n, "__esModule", { value: !0 }), n.default = '\n.modal {\n    font-family: -apple-system,BlinkMacSystemFont,avenir next,avenir,helvetica neue,helvetica,ubuntu,roboto,noto,segoe ui,arial,sans-serif;\n}\n\n.modal__overlay {\n    position: fixed;\n    z-index: 9999999;\n    top: 0;\n    left: 0;\n    right: 0;\n    bottom: 0;\n    background: rgba(0,0,0,0.6);\n    display: flex;\n    justify-content: center;\n    align-items: center;\n}\n\n.modal__container {\n    width: 100%;\n    height: 100%;\n    box-sizing: border-box;\n}\n\n.modal__close {\n    position: absolute;\n    right: -15px;\n    top: -15px;\n    border: 0;\n    padding: 0.5rem;\n    cursor: pointer;\n    background: #fff;\n    font-size: 1rem;\n    border-radius: 50rem;\n    height: 2rem;\n    width: 2rem;\n    box-shadow: 1px 1px 5px rgba(0,0,0,0.2);\n    text-align: center;\n    line-height: 1;\n}\n\n.modal__close:before { content: "\\2715"; }\n\n.modal__iframe {\n    margin: 0;\n    padding: 0;\n    border: 0;\n    width: 100%;\n    height: 100%;\n}\n\n.x-fedapay-checkout-button{\n  color: #ffffff;\n  font-family: SFProText, Arial, "Helvetica Neue", sans-serif;\n  font-size: .9rem;\n  line-height: 1.5;\n  font-weight: bold;\n  background: #1084fe;\n  overflow: hidden;\n  display: inline-block;\n  visibility: visible !important;\n  -webkit-font-smoothing: antialiased;\n  border: 2px solid #1084fe;\n  padding: .375rem .75rem;\n  text-decoration: none;\n  -webkit-border-radius: .25rem;\n  -moz-border-radius: .25rem;\n  -ms-border-radius: .25rem;\n  -o-border-radius: .25rem;\n  border-radius: .25rem;\n  -webkit-box-shadow: 0 2px 6px 0 rgba(0,0,0,.18);\n  -moz-box-shadow: 0 2px 6px 0 rgba(0,0,0,.18);\n  -ms-box-shadow: 0 2px 6px 0 rgba(0,0,0,.18);\n  -o-box-shadow: 0 2px 6px 0 rgba(0,0,0,.18);\n  box-shadow: 0 2px 6px 0 rgba(0,0,0,.18);\n  -webkit-appearance: button;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  -o-user-select: none;\n  user-select: none;\n  cursor: pointer;\n}\n\n.x-fedapay-checkout-button:hover{\n  color: #fff;\n  background-color: #0171e7;\n  border-color: #016bda;\n}\n\n.x-fedapay-checkout-button:active{\n  color: #fff;\n  background-color: #016bda;\n  border-color: #0165cd;\n}\n\n/**************************Demo Animation Style\n**************************/\n@keyframes mmfadeIn {\n    from { opacity: 0; }\n    to { opacity: 1; }\n}\n\n@keyframes mmfadeOut {\n    from { opacity: 1; }\n    to { opacity: 0; }\n}\n\n@keyframes mmslideIn {\n    from { transform: translateY(15%); }\n    to { transform: translateY(0); }\n}\n\n@keyframes mmslideOut {\n    from { transform: translateY(0); }\n    to { transform: translateY(-10%); }\n}\n\n.micromodal-slide {\n    display: none;\n}\n\n.micromodal-slide.is-open {\n    display: block;\n}\n\n.micromodal-slide[aria-hidden="false"] .modal__overlay {\n    animation: mmfadeIn .3s cubic-bezier(0.0, 0.0, 0.2, 1);\n}\n\n.micromodal-slide[aria-hidden="false"] .modal__container {\n    animation: mmslideIn .3s cubic-bezier(0, 0, .2, 1);\n}\n\n.micromodal-slide[aria-hidden="true"] .modal__overlay {\n    animation: mmfadeOut .3s cubic-bezier(0.0, 0.0, 0.2, 1);\n}\n\n.micromodal-slide[aria-hidden="true"] .modal__container {\n    animation: mmslideOut .3s cubic-bezier(0, 0, .2, 1);\n}\n\n.micromodal-slide .modal__container,\n.micromodal-slide .modal__overlay {\n    will-change: transform;\n}\n' }, {}], 5: [function (e, t, n) { "use strict"; Object.defineProperty(n, "__esModule", { value: !0 }); var o = e("./css/modal"), i = e("./utils"), r = e("./checkout-element"), a = e("./const"), s = (d.init = function (e, t) { if (d.appendStyle(), "string" != typeof e) return i.Utils.isADOMElement(e) ? new r.CheckoutElement(t, e) : new r.CheckoutElement(e); var n = []; return i.Utils.eachQuerySelector(e, function (e) { n.push(new r.CheckoutElement(t, e)) }), n }, d.initWithScript = function (e) { if (e && e.dataset && e.dataset.publicKey) { d.appendStyle(); var t = document.createElement("button"); for (var n in t.setAttribute("type", "button"), e.dataset) t.dataset[n] = e.dataset[n]; e.parentNode.insertBefore(t, e), new r.CheckoutElement(null, t) } }, d.appendStyle = function () { if (!document.getElementById(d.STYLE_ID)) { var e = document.createElement("style"); e.setAttribute("id", d.STYLE_ID), e.setAttribute("media", "screen"), e.setAttribute("type", "text/css"), e.textContent = o.default, document.head.appendChild(e) } }, d.STYLE_ID = "x-fedapay-checkout-style", d.DIALOG_DISMISSED = a.DIALOG_DISMISSED, d.CHECKOUT_COMPLETED = a.CHECKOUT_COMPLETED, d); function d() { } n.default = s; var l = document.currentScript; s.initWithScript(l) }, { "./checkout-element": 2, "./const": 3, "./css/modal": 4, "./utils": 11 }], 6: [function (e, t, n) { "use strict"; Object.defineProperty(n, "__esModule", { value: !0 }), e("./polyfills"); var o = e("./fedapay"); window.FedaPay = o.default }, { "./fedapay": 5, "./polyfills": 8 }], 7: [function (e, t, n) { "use strict"; var o, i, r; o = document, i = "currentScript", r = o.getElementsByTagName("script"), i in o || Object.defineProperty(o, i, { get: function () { try { throw new Error } catch (e) { var t, n = (/.*at [^\(]*\((.*):.+:.+\)$/gi.exec(e.stack) || [!1])[1]; for (t in r) if (r[t].src == n || "interactive" == r[t].readyState) return r[t]; return null } } }) }, {}], 8: [function (e, t, n) { "use strict"; e("./current-script") }, { "./current-script": 7 }], 9: [function (e, t, n) { "use strict"; Object.defineProperty(n, "__esModule", { value: !0 }), n.default = '\n<iframe id="{{iframe_id}}" class="modal__iframe" src="{{link}}" frameborder="0" name="{{iframe_id}}"></iframe>\n' }, {}], 10: [function (e, t, n) { "use strict"; Object.defineProperty(n, "__esModule", { value: !0 }), n.default = '\n    <div class="modal__overlay" tabindex="-1" data-micromodal-close>\n        <div class="modal__container" role="dialog" aria-modal="true" aria-labelledby="modal-1-title">\n            {{iframe}}\n            <form id="{{form_id}}"></form>\n        </div>\n    </div>\n' }, {}], 11: [function (e, t, n) { "use strict"; function s(e) { return (s = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) { return typeof e } : function (e) { return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e })(e) } var o; function l(e, o, i) { return "string" == typeof o && (o = o.split(".")), o.reduce(function (e, t, n) { return n === o.length - 1 ? e[t] = i : e[t] = e[t] || {}, e[t] }, e) } function c(e, t) { for (var n = 0, o = t; n < o.length; n++) { var i = o[n]; if ("string" == typeof i && i === e) return !0; if (i.constructor === RegExp && e.match(i)) return !0 } return !1 } Object.defineProperty(n, "__esModule", { value: !0 }), (o = n.Utils || (n.Utils = {})).generateId = function (e) { return e + Math.random().toString(36).substr(2, 9) }, o.removeHTMLElement = function (e) { return e.parentNode.removeChild(e) }, o.createHTMLElement = function (e) { return document.createElement(e) }, o.isADOMElement = function (e) { return "object" === ("undefined" == typeof HTMLElement ? "undefined" : s(HTMLElement)) ? e instanceof HTMLElement : e && "object" === s(e) && null !== e && 1 === e.nodeType && "string" == typeof e.nodeName }, o.eachQuerySelector = function (e, t, n) { void 0 === n && (n = document), n.querySelectorAll(e).forEach(t) }, o.isEmpty = function (e) { return null == e || "string" == typeof e && "" === e.trim() }, o.objectSet = l, o.objectGet = function (e, t, n) { var o; return void 0 === n && (n = null), "string" == typeof t && (t = t.split(".")), null != e && (o = t.reduce(function (e, t) { if (null != e) return e[t] }, e)), void 0 === o ? n : o }, o.datasetToObject = function (e, t, n) { void 0 === t && (t = []), void 0 === n && (n = []); var o = {}; for (var i in e) { var r = i.replace(/(.)(?=[A-Z])/g, "$1-").toLowerCase(), a = i.replace(/(.)(?=[A-Z])/g, "$1_").toLowerCase(); if (c(a, t)) { var s = e[i], d = r.split("-"); !c(a, n) && 0 < d.length ? l(o, d, s) : o[a] = s } } return o }, o.objectToFormNames = function e(t, n, o) { void 0 === n && (n = ""), void 0 === o && (o = []); var i = {}; for (var r in t) { var a = n ? n + "[" + r + "]" : r; c(a, o) || ("object" === s(t[r]) ? Object.assign(i, e(t[r], a)) : i[a] = t[r]) } return i } }, {}], 12: [function (e, t, n) { "use strict"; function w(e) { return function (e) { if (Array.isArray(e)) { for (var t = 0, n = new Array(e.length); t < e.length; t++)n[t] = e[t]; return n } }(e) || function (e) { if (Symbol.iterator in Object(e) || "[object Arguments]" === Object.prototype.toString.call(e)) return Array.from(e) }(e) || function () { throw new TypeError("Invalid attempt to spread non-iterable instance") }() } function i(e, t) { for (var n = 0; n < t.length; n++) { var o = t[n]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, o.key, o) } } function o(e) { return (o = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) { return typeof e } : function (e) { return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e })(e) } var r, a; a = function () { var t, a, s; function o(e) { if (!document.getElementById(e)) return console.warn("MicroModal: ❗Seems like you have missed %c'".concat(e, "'"), "background-color: #f8f9fa;color: #50596c;font-weight: bold;", "ID somewhere in your code. Refer example below to resolve it."), console.warn("%cExample:", "background-color: #f8f9fa;color: #50596c;font-weight: bold;", '<div class="modal" id="'.concat(e, '"></div>')), !1 } function d(e, t) { if (function (e) { if (e.length <= 0) console.warn("MicroModal: ❗Please specify at least one %c'micromodal-trigger'", "background-color: #f8f9fa;color: #50596c;font-weight: bold;", "data attribute."), console.warn("%cExample:", "background-color: #f8f9fa;color: #50596c;font-weight: bold;", '<a href="#" data-micromodal-trigger="my-modal"></a>') }(e), !t) return !0; for (var n in t) o(n); return !0 } return t = ["a[href]", "area[href]", 'input:not([disabled]):not([type="hidden"]):not([aria-hidden])', "select:not([disabled]):not([aria-hidden])", "textarea:not([disabled]):not([aria-hidden])", "button:not([disabled]):not([aria-hidden])", "iframe", "object", "embed", "[contenteditable]", '[tabindex]:not([tabindex^="-"])'], a = function () { function k(e) { var t = e.targetModal, n = e.triggers, o = void 0 === n ? [] : n, i = e.onShow, r = void 0 === i ? function () { } : i, a = e.onClose, s = void 0 === a ? function () { } : a, d = e.openTrigger, l = void 0 === d ? "data-micromodal-trigger" : d, c = e.closeTrigger, u = void 0 === c ? "data-micromodal-close" : c, m = e.disableScroll, f = void 0 !== m && m, p = e.disableFocus, h = void 0 !== p && p, b = e.awaitCloseAnimation, v = void 0 !== b && b, y = e.awaitOpenAnimation, g = void 0 !== y && y, _ = e.debugMode, E = void 0 !== _ && _; !function (e, t) { if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function") }(this, k), this.modal = document.getElementById(t), this.config = { debugMode: E, disableScroll: f, openTrigger: l, closeTrigger: u, onShow: r, onClose: s, awaitCloseAnimation: v, awaitOpenAnimation: g, disableFocus: h }, 0 < o.length && this.registerTriggers.apply(this, w(o)), this.onClick = this.onClick.bind(this), this.onKeydown = this.onKeydown.bind(this) } return function (e, t, n) { t && i(e.prototype, t), n && i(e, n) }(k, [{ key: "registerTriggers", value: function () { for (var t = this, e = arguments.length, n = new Array(e), o = 0; o < e; o++)n[o] = arguments[o]; n.filter(Boolean).forEach(function (e) { e.addEventListener("click", function (e) { return t.showModal(e) }) }) } }, { key: "showModal", value: function () { var t = this; if (this.activeElement = document.activeElement, this.modal.setAttribute("aria-hidden", "false"), this.modal.classList.add("is-open"), this.scrollBehaviour("disable"), this.addEventListeners(), this.config.awaitOpenAnimation) { this.modal.addEventListener("animationend", function e() { t.modal.removeEventListener("animationend", e, !1), t.setFocusToFirstNode() }, !1) } else this.setFocusToFirstNode(); this.config.onShow(this.modal, this.activeElement) } }, { key: "closeModal", value: function () { var t = this.modal; this.modal.setAttribute("aria-hidden", "true"), this.removeEventListeners(), this.scrollBehaviour("enable"), this.activeElement && this.activeElement.focus(), this.config.onClose(this.modal), this.config.awaitCloseAnimation ? this.modal.addEventListener("animationend", function e() { t.classList.remove("is-open"), t.removeEventListener("animationend", e, !1) }, !1) : t.classList.remove("is-open") } }, { key: "closeModalById", value: function (e) { this.modal = document.getElementById(e), this.modal && this.closeModal() } }, { key: "scrollBehaviour", value: function (e) { if (this.config.disableScroll) { var t = document.querySelector("body"); switch (e) { case "enable": Object.assign(t.style, { overflow: "", height: "" }); break; case "disable": Object.assign(t.style, { overflow: "hidden", height: "100vh" }) } } } }, { key: "addEventListeners", value: function () { this.modal.addEventListener("touchstart", this.onClick), this.modal.addEventListener("click", this.onClick), document.addEventListener("keydown", this.onKeydown) } }, { key: "removeEventListeners", value: function () { this.modal.removeEventListener("touchstart", this.onClick), this.modal.removeEventListener("click", this.onClick), document.removeEventListener("keydown", this.onKeydown) } }, { key: "onClick", value: function (e) { e.target.hasAttribute(this.config.closeTrigger) && (this.closeModal(), e.preventDefault()) } }, { key: "onKeydown", value: function (e) { 27 === e.keyCode && this.closeModal(e), 9 === e.keyCode && this.maintainFocus(e) } }, { key: "getFocusableNodes", value: function () { var e = this.modal.querySelectorAll(t); return Array.apply(void 0, w(e)) } }, { key: "setFocusToFirstNode", value: function () { if (!this.config.disableFocus) { var e = this.getFocusableNodes(); e.length && e[0].focus() } } }, { key: "maintainFocus", value: function (e) { var t = this.getFocusableNodes(); if (this.modal.contains(document.activeElement)) { var n = t.indexOf(document.activeElement); e.shiftKey && 0 === n && (t[t.length - 1].focus(), e.preventDefault()), e.shiftKey || n !== t.length - 1 || (t[0].focus(), e.preventDefault()) } else t[0].focus() } }]), k }(), s = null, { init: function (e) { var t = Object.assign({}, { openTrigger: "data-micromodal-trigger" }, e), n = w(document.querySelectorAll("[".concat(t.openTrigger, "]"))), o = function (e, n) { var o = []; return e.forEach(function (e) { var t = e.attributes[n].value; void 0 === o[t] && (o[t] = []), o[t].push(e) }), o }(n, t.openTrigger); if (!0 !== t.debugMode || !1 !== d(n, o)) for (var i in o) { var r = o[i]; t.targetModal = i, t.triggers = w(r), s = new a(t) } }, show: function (e, t) { var n = t || {}; n.targetModal = e, !0 === n.debugMode && !1 === o(e) || (s = new a(n)).showModal() }, close: function (e) { e ? s.closeModalById(e) : s.closeModal() } } }, "object" === ((r = void 0) === n ? "undefined" : o(n)) && void 0 !== t ? t.exports = a() : "function" == typeof define && define.amd ? define(a) : (r = r || self).MicroModal = a() }, {}] }, {}, [6]);
//# sourceMappingURL=checkout.min.js.map