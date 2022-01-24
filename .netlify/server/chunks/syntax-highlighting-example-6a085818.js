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
  default: () => Syntax_highlighting_example,
  metadata: () => metadata
});
var import_index_44b51311 = __toModule(require("./index-44b51311.js"));
const metadata = {
  "title": "Syntax highlighting with mdsvex",
  "date": "2021-12-01",
  "updated": "2021-12-01",
  "categories": ["sveltekit", "web", "css", "markdown"],
  "coverImage": "/images/linus-nylund-Q5QspluNZmM-unsplash.jpg",
  "coverWidth": 16,
  "coverHeight": 9,
  "excerpt": "This post shows you how syntax highlighting works here."
};
const Syntax_highlighting_example = (0, import_index_44b51311.c)(($$result, $$props, $$bindings, slots) => {
  return `<p>mdsvex has automatic, built-in syntax highlighting with <a href="${"https://prismjs.com/"}" rel="${"nofollow"}">Prism.js</a>; just include the language name after the triple backticks, like so:</p>
<pre class="${"language-undefined"}"><!-- HTML_TAG_START -->${`<code class="language-undefined">&#96;&#96;&#96;css
/* Your CSS here */
&#96;&#96;&#96;</code>`}<!-- HTML_TAG_END --></pre>
<p>And that will render just like so:</p>
<pre class="${"language-css"}"><!-- HTML_TAG_START -->${`<code class="language-css"><span class="token selector">.my-css-class</span> <span class="token punctuation">&#123;</span> 
  <span class="token property">color</span><span class="token punctuation">:</span> #ffd100<span class="token punctuation">;</span>
  <span class="token property">box-sizing</span><span class="token punctuation">:</span> border-box<span class="token punctuation">;</span>
  <span class="token comment">/* etc... */</span>
<span class="token punctuation">&#125;</span></code>`}<!-- HTML_TAG_END --></pre>
<p>Here\u2019s how you\u2019d do JavaScript:</p>
<pre class="${"language-undefined"}"><!-- HTML_TAG_START -->${`<code class="language-undefined">&#96;&#96;&#96;js
// You can use js or javascript for the language
&#96;&#96;&#96;</code>`}<!-- HTML_TAG_END --></pre>
<p>Highlighted code sample:</p>
<pre class="${"language-js"}"><!-- HTML_TAG_START -->${`<code class="language-js"><span class="token keyword">const</span> <span class="token function-variable function">invertNumberInRange</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter">num<span class="token punctuation">,</span> range</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">&#123;</span>
  <span class="token keyword">return</span> range <span class="token operator">-</span> num<span class="token punctuation">;</span>
<span class="token punctuation">&#125;</span>

<span class="token function">invertNumberInRange</span><span class="token punctuation">(</span><span class="token number">25</span><span class="token punctuation">,</span> <span class="token number">100</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 75</span></code>`}<!-- HTML_TAG_END --></pre>
<p>Of course, mdsvex supports Svelte highlighting, too:</p>
<pre class="${"language-svelte"}"><!-- HTML_TAG_START -->${`<code class="language-svelte"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span><span class="token punctuation">></span></span><span class="token script"><span class="token language-javascript">
  <span class="token keyword">import</span> myComponent <span class="token keyword">from</span> <span class="token string">'$lib/components/myComponent.svelte'</span><span class="token punctuation">;</span>

  <span class="token keyword">export</span> <span class="token keyword">let</span> myProp <span class="token operator">=</span> <span class="token keyword">undefined</span><span class="token punctuation">;</span>
</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">></span></span>

<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span><span class="token punctuation">></span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>MyComponent</span> <span class="token attr-name">prop=</span><span class="token language-javascript"><span class="token punctuation">&#123;</span>myProp<span class="token punctuation">&#125;</span></span><span class="token punctuation">></span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span></code>`}<!-- HTML_TAG_END --></pre>
<p>All these colors are in the <code>_prism.scss</code> file inside <code>src/lib/assets/scss</code>, if you\u2019d like to change them.</p>`;
});
