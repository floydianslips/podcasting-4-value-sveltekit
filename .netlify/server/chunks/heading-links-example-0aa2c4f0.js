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
  default: () => Heading_links_example,
  metadata: () => metadata
});
var import_index_44b51311 = __toModule(require("./index-44b51311.js"));
const metadata = {
  "title": "Automatic heading links in mdsvex",
  "date": "2021-10-26",
  "updated": "2021-11-01",
  "categories": ["sveltekit", "markdown"],
  "coverImage": "/images/jefferson-santos-fCEJGBzAkrU-unsplash.jpg",
  "coverWidth": 16,
  "coverHeight": 9,
  "excerpt": "Check out how heading links work with this starter in this post."
};
const Heading_links_example = (0, import_index_44b51311.c)(($$result, $$props, $$bindings, slots) => {
  return `<p>Here are some headings:</p>
<h2 id="${"heres-an-h2"}"><a aria-hidden="${"true"}" tabindex="${"-1"}" href="${"#heres-an-h2"}"><span class="${"icon icon-link"}"></span></a>Here\u2019s an h2</h2>
<p>Lorem ipsum dolor sit amet</p>
<h3 id="${"this-is-an-h3"}"><a aria-hidden="${"true"}" tabindex="${"-1"}" href="${"#this-is-an-h3"}"><span class="${"icon icon-link"}"></span></a>This is an h3</h3>
<p>Lorem ipsum dolor sit amet</p>
<h4 id="${"as-youve-probably-guessed-this-is-an-h4"}"><a aria-hidden="${"true"}" tabindex="${"-1"}" href="${"#as-youve-probably-guessed-this-is-an-h4"}"><span class="${"icon icon-link"}"></span></a>As you\u2019ve probably guessed, this is an h4</h4>
<p>Lorem ipsum dolor sit amet</p>
<h5 id="${"this-of-course-is-an-h5"}"><a aria-hidden="${"true"}" tabindex="${"-1"}" href="${"#this-of-course-is-an-h5"}"><span class="${"icon icon-link"}"></span></a>This, of course, is an h5</h5>
<p>Lorem ipsum dolor sit amet</p>
<h6 id="${"were-deep-in-h6-territory-now"}"><a aria-hidden="${"true"}" tabindex="${"-1"}" href="${"#were-deep-in-h6-territory-now"}"><span class="${"icon icon-link"}"></span></a>We\u2019re deep in h6 territory now</h6>
<p>Lorem ipsum dolor sit amet</p>`;
});
