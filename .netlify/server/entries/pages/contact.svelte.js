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
  default: () => Contact
});
var import_index_44b51311 = __toModule(require("../../chunks/index-44b51311.js"));
var import_Callout_fbec77d0 = __toModule(require("../../chunks/Callout-fbec77d0.js"));
const Contact = (0, import_index_44b51311.c)(($$result, $$props, $$bindings, slots) => {
  return `${$$result.head += `${$$result.title = `<title>Contact</title>`, ""}`, ""}


<h1>Contact</h1>

This starter was made by Josh Collinsworth. You can <a rel="${"external"}" href="${"https://joshcollinsworth.com/contact"}">get in touch with Josh here</a>.

If you&#39;re using this starter for your own site, feel free to delete this page, or replace it with a contact page of your own. (I&#39;m a big fan of <a href="${"https://docs.netlify.com/forms/setup/"}">Netlify forms</a>, personally.)

${(0, import_index_44b51311.v)(import_Callout_fbec77d0.C, "Callout").$$render($$result, {}, {}, {
    default: () => {
      return `This form does nothing! It&#39;s just here to show default styling.`;
    }
  })}

<form><div class="${"form-section"}"><label for="${"name"}">Name</label>
    <input type="${"text"}" id="${"name"}" placeholder="${"First name"}"></div>
  
  <div class="${"form-section"}"><label for="${"email"}">Email</label>
    <input type="${"email"}" id="${"email"}" placeholder="${"Email address"}"></div>

  <fieldset><legend>Which option?
    </legend>

    <div><input type="${"radio"}" name="${"s"}" id="${"s1"}" value="${"s1"}">
      <label for="${"s1"}">Option 1</label></div>
    <div><input type="${"radio"}" name="${"s"}" id="${"s2"}" value="${"s2"}">
      <label for="${"s2"}">Option 2</label></div>
    <div><input type="${"radio"}" name="${"s"}" id="${"s3"}" value="${"s3"}">
      <label for="${"s3"}">Option 3</label></div></fieldset>

  <div class="${"form-section"}"><input type="${"checkbox"}" id="${"c1"}">
    <label for="${"c1"}">Sign me up for something!</label></div>

  <input type="${"submit"}" value="${"Do nothing!"}"></form>`;
});
