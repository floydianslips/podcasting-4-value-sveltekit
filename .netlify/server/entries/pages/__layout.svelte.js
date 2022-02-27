import { n as noop, a as safe_not_equal, c as create_ssr_component, b as subscribe, d as add_attribute, e as add_classes, v as validate_component, f as each, g as escape } from "../../chunks/index-4fee9b32.js";
import { n as navItems, s as siteTitle, d as siteAuthor } from "../../chunks/config-702cd8c2.js";
var global = "";
const subscriber_queue = [];
function writable(value, start = noop) {
  let stop;
  const subscribers = /* @__PURE__ */ new Set();
  function set(new_value) {
    if (safe_not_equal(value, new_value)) {
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
  function subscribe2(run, invalidate = noop) {
    const subscriber = [run, invalidate];
    subscribers.add(subscriber);
    if (subscribers.size === 1) {
      stop = start(set) || noop;
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
const NavItem = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let isCurrentPage;
  let $currentPage, $$unsubscribe_currentPage;
  $$unsubscribe_currentPage = subscribe(currentPage, (value) => $currentPage = value);
  let { href } = $$props;
  if ($$props.href === void 0 && $$bindings.href && href !== void 0)
    $$bindings.href(href);
  isCurrentPage = $currentPage.startsWith(href);
  $$unsubscribe_currentPage();
  return `<li><a${add_attribute("href", href, 0)}${add_attribute("aria-current", isCurrentPage ? "page" : false, 0)}${add_classes((isCurrentPage ? "active" : "").trim())}>${slots.default ? slots.default({}) : ``}</a></li>`;
});
const HamburgerSVG = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg viewBox="${"0 0 128 128"}" version="${"1.1"}" style="${"fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;"}"><g><rect x="${"0"}" y="${"12.48"}" width="${"128"}" height="${"18.688"}"></rect></g><g><rect x="${"0"}" y="${"96.832"}" width="${"128"}" height="${"18.688"}"></rect></g><g><rect x="${"0"}" y="${"54.656"}" width="${"128"}" height="${"18.688"}"></rect></g></svg>`;
});
const XSVG = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg viewBox="${"0 0 128 128"}" version="${"1.1"}" style="${"fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;"}"><path d="${"M64,48.496l-48.496,-48.496l-15.504,15.504l48.496,48.496l-48.496,48.496l15.504,15.504l48.496,-48.496l48.496,48.496l15.504,-15.504l-48.496,-48.496l48.496,-48.496l-15.504,-15.504l-48.496,48.496Z"}"></path></svg>`;
});
const HamburgerMenuButton = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $isMenuOpen, $$unsubscribe_isMenuOpen;
  $$unsubscribe_isMenuOpen = subscribe(isMenuOpen, (value) => $isMenuOpen = value);
  let { closeOnly } = $$props;
  if ($$props.closeOnly === void 0 && $$bindings.closeOnly && closeOnly !== void 0)
    $$bindings.closeOnly(closeOnly);
  $$unsubscribe_isMenuOpen();
  return `<button${add_attribute("aria-pressed", $isMenuOpen, 0)} class="${"menu-button"}"${add_attribute("tabindex", $isMenuOpen || !closeOnly ? "10" : "-1", 0)}><span class="${"sr-only"}">Toggle hamburger menu</span>
	${closeOnly ? `${validate_component(XSVG, "XSVG").$$render($$result, {}, {}, {})}` : `${validate_component(HamburgerSVG, "HamburgerSVG").$$render($$result, {}, {}, {})}`}</button>`;
});
const MainNav = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $isMenuOpen, $$unsubscribe_isMenuOpen;
  $$unsubscribe_isMenuOpen = subscribe(isMenuOpen, (value) => $isMenuOpen = value);
  $$unsubscribe_isMenuOpen();
  return `
<nav class="${["main-nav", $isMenuOpen ? "open" : ""].join(" ").trim()}"><ul>${each(navItems, (page) => {
    return `${validate_component(NavItem, "NavItem").$$render($$result, { href: page.route }, {}, {
      default: () => {
        return `${escape(page.title)}
			`;
      }
    })}`;
  })}</ul>
	${validate_component(HamburgerMenuButton, "HamburgerMenuButton").$$render($$result, { closeOnly: "true" }, {}, {})}</nav>`;
});
const Header = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<header><a class="${"skip-to-content-link"}" href="${"#main"}">Skip to main content
	</a>

	<a href="${"/"}" class="${"site-title"}">${escape(siteTitle)}</a>

	${validate_component(HamburgerMenuButton, "HamburgerMenuButton").$$render($$result, {}, {}, {})}
	${validate_component(MainNav, "MainNav").$$render($$result, {}, {}, {})}</header>`;
});
const Footer = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<footer>${validate_component(MainNav, "MainNav").$$render($$result, {}, {}, {})}

	<p>\xA9${escape(new Date().getFullYear())} ${escape(siteAuthor)}</p></footer>`;
});
const load = async ({ url, fetch }) => {
  await fetch(`/api/rss.xml`);
  return { props: { path: url.pathname } };
};
const _layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $isMenuOpen, $$unsubscribe_isMenuOpen;
  $$unsubscribe_isMenuOpen = subscribe(isMenuOpen, (value) => $isMenuOpen = value);
  let { path } = $$props;
  if ($$props.path === void 0 && $$bindings.path && path !== void 0)
    $$bindings.path(path);
  {
    currentPage.set(path);
  }
  $$unsubscribe_isMenuOpen();
  return `




${$$result.head += `<link type="${"application/rss+xml"}" rel="${"alternate"}" title="${"Podcasting 4 Value"}" href="${"https://filedn.com/l0rngxCNDKAhHBs9WFEP7Dj/rss/p4vrss.xml"}" data-svelte="svelte-1gimaxg">`, ""}


<div class="${["layout", $isMenuOpen ? "open" : ""].join(" ").trim()}">${validate_component(Header, "Header").$$render($$result, {}, {}, {})}
	<main id="${"main"}" tabindex="${"-1"}">${slots.default ? slots.default({}) : ``}</main>
	${validate_component(Footer, "Footer").$$render($$result, {}, {}, {})}</div>`;
});
export { _layout as default, load };
