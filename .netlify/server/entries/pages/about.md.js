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
  default: () => About
});
var import_index_44b51311 = __toModule(require("../../chunks/index-44b51311.js"));
const About = (0, import_index_44b51311.c)(($$result, $$props, $$bindings, slots) => {
  return `<h1 id="${"about"}"><a aria-hidden="${"true"}" tabindex="${"-1"}" href="${"#about"}"><span class="${"icon icon-link"}"></span></a>About</h1>
<p>This is an example of how you can have <em>markdown</em> in page content!</p>
<ul><li>How</li>
<li><strong>Cool</strong></li>
<li>Is <em>that</em>!?</li></ul>
<p>If you like, you can also import markdown into any Svelte page.</p>
<p>Anyway, you can find this file here:</p>
<pre class="${"language-undefined"}"><!-- HTML_TAG_START -->${`<code class="language-undefined">src/routes/about.md</code>`}<!-- HTML_TAG_END --></pre>
<p>Here\u2019s the <a href="${"/"}">home link</a> if you wanna go back.</p>`;
});
