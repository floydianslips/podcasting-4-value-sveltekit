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
  default: () => Routes,
  load: () => load
});
var import_index_44b51311 = __toModule(require("../../chunks/index-44b51311.js"));
var PodcastPlayer_svelte_svelte_type_style_lang = "";
const css = {
  code: "iframe.svelte-1wln2cm{display:block;opacity:80%;border:none;height:20vh;width:72vw;margin:25px}",
  map: null
};
const PodcastPlayer = (0, import_index_44b51311.c)(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `<iframe src="${"https://widget.justcast.com/widget?rss=https://filedn.com/l0rngxCNDKAhHBs9WFEP7Dj/rss/p4vrss.xml&primaryBackgroundColor=0c1824&primaryButtonColor=f7f8f9&primaryTextColor=f7f8f9&progressBarFilledColor=f7f8f9&progressBarBackgroundColor=8A8175&playlistBackgroundColor=30343c&playlistTextColor=f7f8f9&chapterBackgroundColor=30343c&chapterTextColor=f7f8f9"}" title="${"Podcasting 4 Value"}" width="${"100vw"}" height="${"100vh"}" frameborder="${"0"}" scrolling="${"yes"}"${(0, import_index_44b51311.d)("seamless", true, 0)} class="${"rounded-lg svelte-1wln2cm"}"></iframe>

`;
});
const load = async () => {
  const ReadMeFile = await Promise.resolve().then(() => __toModule(require("../../chunks/README-25b4f6bf.js")));
  const ReadMe = ReadMeFile.default;
  return { props: { ReadMe } };
};
const Routes = (0, import_index_44b51311.c)(($$result, $$props, $$bindings, slots) => {
  return `${$$result.head += `${$$result.title = `<title>Podcasting 4 Value</title>`, ""}`, ""}

${(0, import_index_44b51311.v)(PodcastPlayer, "PodcastPlayer").$$render($$result, {}, {}, {})}




`;
});
