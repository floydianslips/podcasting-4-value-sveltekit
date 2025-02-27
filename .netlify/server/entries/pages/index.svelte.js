import { c as create_ssr_component, d as add_attribute, g as escape, v as validate_component } from "../../chunks/index-4fee9b32.js";
import { a as siteDescription } from "../../chunks/config-702cd8c2.js";
var Scroller_svelte_svelte_type_style_lang = "";
const css$3 = {
  code: "svelte-scroller-outer.svelte-xdbafy{display:block;position:relative}svelte-scroller-background.svelte-xdbafy{display:block;position:relative;width:100%}svelte-scroller-foreground.svelte-xdbafy{display:block;position:relative;z-index:2}svelte-scroller-foreground.svelte-xdbafy::after{content:' ';display:block;clear:both}svelte-scroller-background-container.svelte-xdbafy{display:block;position:absolute;width:100%;max-width:100%;pointer-events:none;will-change:transform}",
  map: null
};
const handlers = [];
if (typeof window !== "undefined") {
  const run_all = () => handlers.forEach((fn) => fn());
  window.addEventListener("scroll", run_all);
  window.addEventListener("resize", run_all);
}
if (typeof IntersectionObserver !== "undefined") {
  const map = /* @__PURE__ */ new Map();
  new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      const update = map.get(entry.target);
      const index = handlers.indexOf(update);
      if (entry.isIntersecting) {
        if (index === -1)
          handlers.push(update);
      } else {
        update();
        if (index !== -1)
          handlers.splice(index, 1);
      }
    });
  }, {
    rootMargin: "400px 0px"
  });
}
const Scroller = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let style;
  let widthStyle;
  let { top: top2 = 0 } = $$props;
  let { bottom: bottom2 = 1 } = $$props;
  let { threshold: threshold2 = 0.5 } = $$props;
  let { query = "section" } = $$props;
  let { parallax = false } = $$props;
  let { index = 0 } = $$props;
  let { count = 0 } = $$props;
  let { offset = 0 } = $$props;
  let { progress = 0 } = $$props;
  let { visible = false } = $$props;
  let outer;
  let foreground;
  let background;
  let offset_top = 0;
  if ($$props.top === void 0 && $$bindings.top && top2 !== void 0)
    $$bindings.top(top2);
  if ($$props.bottom === void 0 && $$bindings.bottom && bottom2 !== void 0)
    $$bindings.bottom(bottom2);
  if ($$props.threshold === void 0 && $$bindings.threshold && threshold2 !== void 0)
    $$bindings.threshold(threshold2);
  if ($$props.query === void 0 && $$bindings.query && query !== void 0)
    $$bindings.query(query);
  if ($$props.parallax === void 0 && $$bindings.parallax && parallax !== void 0)
    $$bindings.parallax(parallax);
  if ($$props.index === void 0 && $$bindings.index && index !== void 0)
    $$bindings.index(index);
  if ($$props.count === void 0 && $$bindings.count && count !== void 0)
    $$bindings.count(count);
  if ($$props.offset === void 0 && $$bindings.offset && offset !== void 0)
    $$bindings.offset(offset);
  if ($$props.progress === void 0 && $$bindings.progress && progress !== void 0)
    $$bindings.progress(progress);
  if ($$props.visible === void 0 && $$bindings.visible && visible !== void 0)
    $$bindings.visible(visible);
  $$result.css.add(css$3);
  style = `
		position: ${"absolute"};
		top: 0;
		transform: translate(0, ${offset_top}px);
		z-index: ${1};
	`;
  widthStyle = "";
  return `

<svelte-scroller-outer class="${"svelte-xdbafy"}"${add_attribute("this", outer, 0)}><svelte-scroller-background-container class="${"background-container svelte-xdbafy"}" style="${escape(style) + escape(widthStyle)}"><svelte-scroller-background class="${"svelte-xdbafy"}"${add_attribute("this", background, 0)}>${slots.background ? slots.background({}) : ``}</svelte-scroller-background></svelte-scroller-background-container>

	<svelte-scroller-foreground class="${"svelte-xdbafy"}"${add_attribute("this", foreground, 0)}>${slots.foreground ? slots.foreground({}) : ``}</svelte-scroller-foreground>
</svelte-scroller-outer>`;
});
var SingleBlogPost_svelte_svelte_type_style_lang = "";
const css$2 = {
  code: "article.svelte-t5kctk{display:grid;grid-template-columns:1fr 3fr;align-items:center}h3.svelte-t5kctk{padding:0px;margin:0px;color:var(--green)}img.svelte-t5kctk{width:10rem;padding-right:1rem;height:auto}p.svelte-t5kctk{text-align:center}",
  map: null
};
let imgWidth = "100px";
const SingleBlogPost = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let posts = [];
  let { index } = $$props;
  if ($$props.index === void 0 && $$bindings.index && index !== void 0)
    $$bindings.index(index);
  $$result.css.add(css$2);
  return `${$$result.head += `${$$result.title = `<title>Blog</title>`, ""}<meta data-key="${"description"}" name="${"description"}"${add_attribute("content", siteDescription, 0)} data-svelte="svelte-1t9o4xr">`, ""}

<a href="${"/blog/" + escape(posts[index]?.slug)}"><article class="${"svelte-t5kctk"}"><img${add_attribute("src", posts[index]?.coverImage, 0)} alt="${""}"${add_attribute("height", imgWidth, 0)} class="${"svelte-t5kctk"}">
		<h3 class="${"svelte-t5kctk"}">${escape(posts[index]?.title)}</h3></article></a>
<div><p class="${"svelte-t5kctk"}">${escape(posts[index]?.excerpt)}</p>
</div>`;
});
var PodcastPlayer_svelte_svelte_type_style_lang = "";
const css$1 = {
  code: "iframe.svelte-157455p{display:block;border:3px solid var(--green);border-radius:20px;height:20vh;width:72vw;margin:25px;align-items:center}",
  map: null
};
const PodcastPlayer = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$1);
  return `<iframe src="${"https://widget.justcast.com/widget?rss=https://filedn.com/l0rngxCNDKAhHBs9WFEP7Dj/rss/p4vrss.xml&primaryBackgroundColor=0c1824&primaryButtonColor=f7f8f9&primaryTextColor=f7f8f9&progressBarFilledColor=f7f8f9&progressBarBackgroundColor=8A8175&playlistBackgroundColor=30343c&playlistTextColor=f7f8f9&chapterBackgroundColor=30343c&chapterTextColor=f7f8f9"}" title="${"Podcasting 4 Value"}" width="${"100vw"}" height="${"100vh"}" frameborder="${"0"}" scrolling="${"yes"}" class="${"svelte-157455p"}"></iframe>`;
});
var index_svelte_svelte_type_style_lang = "";
const css = {
  code: ".main-div.svelte-1nk1ps7.svelte-1nk1ps7{display:grid;justify-items:center}h1.svelte-1nk1ps7.svelte-1nk1ps7{font-size:1.5rem;text-align:center;margin:0 0 1rem 0}[slot='foreground'].svelte-1nk1ps7 section.svelte-1nk1ps7{pointer-events:all}.scroller-div.svelte-1nk1ps7.svelte-1nk1ps7{width:100%}.section-1.svelte-1nk1ps7.svelte-1nk1ps7{background-image:url('$lib/assets/images/laptop-microphone.jpg')}.section-2.svelte-1nk1ps7.svelte-1nk1ps7{background-image:url('$lib/assets/images/sat-dish.jpg')}.section-3.svelte-1nk1ps7.svelte-1nk1ps7{background-image:url('$lib/assets/images/mixer.jpg')}article.svelte-1nk1ps7.svelte-1nk1ps7{display:grid;background-color:rgb(0, 0, 0);background-color:rgba(0, 0, 0, 0.8);color:white;font-weight:bold;border:3px solid #f1f1f1;height:fit-content;overflow-y:hidden;padding:20px;text-align:center}.scroller-div.svelte-1nk1ps7.svelte-1nk1ps7{z-index:1}section.svelte-1nk1ps7.svelte-1nk1ps7{display:grid;width:100%;align-items:center;height:40vh;background-color:var(--darkBlue);color:white;padding:1em;background-size:cover;background-position:center;overflow-x:hidden;color:white;font-weight:bold;border:3px solid #f1f1f1;padding:20px;text-align:center}",
  map: null
};
let top = 0.1;
let threshold = 0.5;
let bottom = 0.9;
const Routes = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let count;
  let index;
  let offset;
  let progress;
  $$result.css.add(css);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    $$rendered = `${$$result.head += `${$$result.title = `<title>Home</title>`, ""}<meta data-key="${"description"}" name="${"description"}"${add_attribute("content", siteDescription, 0)} data-svelte="svelte-129ocvh"><script src="${"https://identity.netlify.com/v1/netlify-identity-widget.js"}" data-svelte="svelte-129ocvh"><\/script>`, ""}

<div class="${"main-div svelte-1nk1ps7"}"><h1 class="${"svelte-1nk1ps7"}">One idiot&#39;s attempt at starting a Value 4 Value podcast.</h1>
	${validate_component(PodcastPlayer, "PodcastPlayer").$$render($$result, {}, {}, {})}

	${validate_component(Scroller, "Scroller").$$render($$result, {
      top,
      threshold,
      bottom,
      count,
      index,
      offset,
      progress
    }, {
      count: ($$value) => {
        count = $$value;
        $$settled = false;
      },
      index: ($$value) => {
        index = $$value;
        $$settled = false;
      },
      offset: ($$value) => {
        offset = $$value;
        $$settled = false;
      },
      progress: ($$value) => {
        progress = $$value;
        $$settled = false;
      }
    }, {
      foreground: () => {
        return `<div class="${"scroller-div svelte-1nk1ps7"}" slot="${"foreground"}"><section class="${"section-1 svelte-1nk1ps7"}">${offset > -0.01 && index == 0 ? `<article class="${"svelte-1nk1ps7"}">${validate_component(SingleBlogPost, "SingleBlogPost").$$render($$result, { index: 0 }, {}, {})}</article>` : ``}</section>
			<section class="${"section-2 svelte-1nk1ps7"}">${offset > -0.01 && index == 1 ? `<article class="${"svelte-1nk1ps7"}">${validate_component(SingleBlogPost, "SingleBlogPost").$$render($$result, { index: 1 }, {}, {})}</article>` : ``}</section>
			<section class="${"section-3 svelte-1nk1ps7"}">${offset > -0.01 && index == 2 ? `<article class="${"svelte-1nk1ps7"}">${validate_component(SingleBlogPost, "SingleBlogPost").$$render($$result, { index: 2 }, {}, {})}</article>` : ``}</section></div>`;
      }
    })}
</div>`;
  } while (!$$settled);
  return $$rendered;
});
export { Routes as default };
