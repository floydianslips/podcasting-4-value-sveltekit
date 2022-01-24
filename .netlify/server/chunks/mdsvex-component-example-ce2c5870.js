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
  default: () => Mdsvex_component_example,
  metadata: () => metadata
});
var import_index_44b51311 = __toModule(require("./index-44b51311.js"));
var import_Callout_fbec77d0 = __toModule(require("./Callout-fbec77d0.js"));
const metadata = {
  "title": "A Markdown post with a Svelte component",
  "date": "2021-12-01",
  "updated": "2021-12-01",
  "categories": ["sveltekit", "markdown", "svelte"],
  "coverImage": "/images/jerry-zhang-ePpaQC2c1xA-unsplash.jpg",
  "coverWidth": 16,
  "coverHeight": 9,
  "excerpt": "This post demonstrates how to include a Svelte component in a Markdown post."
};
const Mdsvex_component_example = (0, import_index_44b51311.c)(($$result, $$props, $$bindings, slots) => {
  return `<p>This starter includes an <code>Callout.svelte</code> component. It\u2019s not particularly useful on its own, but here\u2019s how you might use it inside of a Markdown post, thanks to mdsvex.</p>
${(0, import_index_44b51311.v)(import_Callout_fbec77d0.C, "Callout").$$render($$result, {}, {}, {
    default: () => {
      return `This is an example of the Callout.svelte component! Find it in <code>src/lib/components/Callout.svelte</code>.
`;
    }
  })}
<p>You can inject any Svelte components you want into Markdown! Just import them in a <code>&lt;script&gt;</code> tag and then use them wherever you like. </p>
<p>For that matter, you can inject any HTML anywhere! (Note that you cannot use Markdown <em>inside</em> Svelte components or HTML, however. Any opened tag must be closed before returning to Markdown.)</p>`;
});
