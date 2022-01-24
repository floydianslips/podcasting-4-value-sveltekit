var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};
__export(exports, {
  default: () => _layout,
  load: () => load
});
var import_index_44b51311 = __toModule(require("../../chunks/index-44b51311.js"));
var import_config_51b2cd5b = __toModule(require("../../chunks/config-51b2cd5b.js"));
var global = "";
const subscriber_queue = [];
function writable(value, start = import_index_44b51311.n) {
  let stop;
  const subscribers = new Set();
  function set(new_value) {
    if ((0, import_index_44b51311.a)(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue.length;
        for (const subscriber of subscribers) {
          subscriber[1]();
          subscriber_queue.push(subscriber, value);
        }
        if (run_queue) {
          for (let i = 0; i < subscriber_queue.length; i += 2) {
            subscriber_queue[i][0](subscriber_queue[i + 1]);
          }
          subscriber_queue.length = 0;
        }
      }
    }
  }
  function update(fn) {
    set(fn(value));
  }
  function subscribe2(run, invalidate = import_index_44b51311.n) {
    const subscriber = [run, invalidate];
    subscribers.add(subscriber);
    if (subscribers.size === 1) {
      stop = start(set) || import_index_44b51311.n;
    }
    run(value);
    return () => {
      subscribers.delete(subscriber);
      if (subscribers.size === 0) {
        stop();
        stop = null;
      }
    };
  }
  return { set, update, subscribe: subscribe2 };
}
const currentPage = writable("");
const isMenuOpen = writable(false);
const NavItem = (0, import_index_44b51311.c)(($$result, $$props, $$bindings, slots) => {
  let isCurrentPage;
  let $currentPage, $$unsubscribe_currentPage;
  $$unsubscribe_currentPage = (0, import_index_44b51311.b)(currentPage, (value) => $currentPage = value);
  let { href } = $$props;
  if ($$props.href === void 0 && $$bindings.href && href !== void 0)
    $$bindings.href(href);
  isCurrentPage = $currentPage.startsWith(href);
  $$unsubscribe_currentPage();
  return `<li><a${(0, import_index_44b51311.d)("href", href, 0)}${(0, import_index_44b51311.d)("aria-current", isCurrentPage ? "page" : false, 0)}${(0, import_index_44b51311.e)((isCurrentPage ? "active" : "").trim())}>${slots.default ? slots.default({}) : ``}</a></li>`;
});
const HamburgerSVG = (0, import_index_44b51311.c)(($$result, $$props, $$bindings, slots) => {
  return `<svg viewBox="${"0 0 128 128"}" version="${"1.1"}" style="${"fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;"}"><g><rect x="${"0"}" y="${"12.48"}" width="${"128"}" height="${"18.688"}"></rect></g><g><rect x="${"0"}" y="${"96.832"}" width="${"128"}" height="${"18.688"}"></rect></g><g><rect x="${"0"}" y="${"54.656"}" width="${"128"}" height="${"18.688"}"></rect></g></svg>`;
});
const XSVG = (0, import_index_44b51311.c)(($$result, $$props, $$bindings, slots) => {
  return `<svg viewBox="${"0 0 128 128"}" version="${"1.1"}" style="${"fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;"}"><path d="${"M64,48.496l-48.496,-48.496l-15.504,15.504l48.496,48.496l-48.496,48.496l15.504,15.504l48.496,-48.496l48.496,48.496l15.504,-15.504l-48.496,-48.496l48.496,-48.496l-15.504,-15.504l-48.496,48.496Z"}"></path></svg>`;
});
const HamburgerMenuButton = (0, import_index_44b51311.c)(($$result, $$props, $$bindings, slots) => {
  let $isMenuOpen, $$unsubscribe_isMenuOpen;
  $$unsubscribe_isMenuOpen = (0, import_index_44b51311.b)(isMenuOpen, (value) => $isMenuOpen = value);
  let { closeOnly } = $$props;
  if ($$props.closeOnly === void 0 && $$bindings.closeOnly && closeOnly !== void 0)
    $$bindings.closeOnly(closeOnly);
  $$unsubscribe_isMenuOpen();
  return `<button${(0, import_index_44b51311.d)("aria-pressed", $isMenuOpen, 0)} class="${"menu-button"}"${(0, import_index_44b51311.d)("tabindex", $isMenuOpen || !closeOnly ? "0" : "-1", 0)}><span class="${"sr-only"}">Toggle hamburger menu</span>
  ${closeOnly ? `${(0, import_index_44b51311.v)(XSVG, "XSVG").$$render($$result, {}, {}, {})}` : `${(0, import_index_44b51311.v)(HamburgerSVG, "HamburgerSVG").$$render($$result, {}, {}, {})}`}</button>`;
});
const MainNav = (0, import_index_44b51311.c)(($$result, $$props, $$bindings, slots) => {
  let $isMenuOpen, $$unsubscribe_isMenuOpen;
  $$unsubscribe_isMenuOpen = (0, import_index_44b51311.b)(isMenuOpen, (value) => $isMenuOpen = value);
  $$unsubscribe_isMenuOpen();
  return `
<nav class="${["main-nav", $isMenuOpen ? "open" : ""].join(" ").trim()}"><ul>${(0, import_index_44b51311.f)(import_config_51b2cd5b.n, (page) => {
    return `${(0, import_index_44b51311.v)(NavItem, "NavItem").$$render($$result, { href: page.route }, {}, {
      default: () => {
        return `${(0, import_index_44b51311.g)(page.title)}
    `;
      }
    })}`;
  })}</ul>
  ${(0, import_index_44b51311.v)(HamburgerMenuButton, "HamburgerMenuButton").$$render($$result, { closeOnly: "true" }, {}, {})}</nav>`;
});
const Header = (0, import_index_44b51311.c)(($$result, $$props, $$bindings, slots) => {
  return `<header><a class="${"skip-to-content-link"}" href="${"#main"}">Skip to main content
  </a>
  
  <a href="${"/"}" class="${"site-title"}">${(0, import_index_44b51311.g)(import_config_51b2cd5b.s)}</a>
  
  ${(0, import_index_44b51311.v)(HamburgerMenuButton, "HamburgerMenuButton").$$render($$result, {}, {}, {})}
  ${(0, import_index_44b51311.v)(MainNav, "MainNav").$$render($$result, {}, {}, {})}</header>`;
});
const Footer = (0, import_index_44b51311.c)(($$result, $$props, $$bindings, slots) => {
  return `<footer>${(0, import_index_44b51311.v)(MainNav, "MainNav").$$render($$result, {}, {}, {})}

  <nav><ul><li><a href="${"/api/rss.xml"}" rel="${"external"}">RSS</a></li>
      <li><a href="${"/"}">Home</a></li></ul></nav>

  <p>\xA9${(0, import_index_44b51311.g)(new Date().getFullYear())} ${(0, import_index_44b51311.g)(import_config_51b2cd5b.d)}</p></footer>`;
});
const load = async ({ url, fetch }) => {
  await fetch(`/api/rss.xml`);
  return { props: { path: url.pathname } };
};
const _layout = (0, import_index_44b51311.c)(($$result, $$props, $$bindings, slots) => {
  let $isMenuOpen, $$unsubscribe_isMenuOpen;
  $$unsubscribe_isMenuOpen = (0, import_index_44b51311.b)(isMenuOpen, (value) => $isMenuOpen = value);
  let { path } = $$props;
  if ($$props.path === void 0 && $$bindings.path && path !== void 0)
    $$bindings.path(path);
  {
    currentPage.set(path);
  }
  $$unsubscribe_isMenuOpen();
  return `






<div class="${["layout", $isMenuOpen ? "open" : ""].join(" ").trim()}">${(0, import_index_44b51311.v)(Header, "Header").$$render($$result, {}, {}, {})}
  <main id="${"main"}" tabindex="${"-1"}">${slots.default ? slots.default({}) : ``}</main>
  ${(0, import_index_44b51311.v)(Footer, "Footer").$$render($$result, {}, {}, {})}</div>`;
});
