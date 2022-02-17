import { c as create_ssr_component, g as escape } from "../../chunks/index-4fee9b32.js";
const load = ({ error, status }) => {
  return { props: { error, status } };
};
const _error = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { status } = $$props;
  let { error } = $$props;
  if ($$props.status === void 0 && $$bindings.status && status !== void 0)
    $$bindings.status(status);
  if ($$props.error === void 0 && $$bindings.error && error !== void 0)
    $$bindings.error(error);
  return `







<h2>${escape(status)}</h2>

<p class="${"subhead"}">${escape(error.message)}</p>

<p><strong>Sorry!</strong> Maybe try one of these links?</p>
<ul><li><a href="${"/"}">Home</a></li></ul>`;
});
export { _error as default, load };
