import { init } from '../handler.js';

export const handler = init({
	appDir: "_app",
	assets: new Set(["admin/config.yml","admin/index.html","favicon.png","images/jefferson-santos-fCEJGBzAkrU-unsplash.jpg","images/jerry-zhang-ePpaQC2c1xA-unsplash.jpg","images/linus-nylund-Q5QspluNZmM-unsplash.jpg","link.svg"]),
	_: {
		mime: {".yml":"text/yaml",".html":"text/html",".png":"image/png",".jpg":"image/jpeg",".svg":"image/svg+xml"},
		entry: {"file":"start-d2916634.js","js":["start-d2916634.js","chunks/vendor-0cc4a8ec.js","chunks/preload-helper-ec9aa979.js","chunks/singletons-d19c42e4.js"],"css":["assets/vendor-d007c09e.css"]},
		nodes: [
			() => import('../server/nodes/0.js'),
			() => import('../server/nodes/1.js'),
			() => import('../server/nodes/2.js'),
			() => import('../server/nodes/4.js'),
			() => import('../server/nodes/5.js'),
			() => import('../server/nodes/6.js'),
			() => import('../server/nodes/7.js'),
			() => import('../server/nodes/8.js'),
			() => import('../server/nodes/9.js'),
			() => import('../server/nodes/10.js'),
			() => import('../server/nodes/11.js'),
			() => import('../server/nodes/12.js'),
			() => import('../server/nodes/13.js')
		],
		routes: [
			{
				type: 'page',
				pattern: /^\/$/,
				params: null,
				path: "/",
				shadow: null,
				a: [0,2],
				b: [1]
			},
			{
				type: 'page',
				pattern: /^\/about\/?$/,
				params: null,
				path: "/about",
				shadow: null,
				a: [0,3],
				b: [1]
			},
			{
				type: 'page',
				pattern: /^\/blog\/?$/,
				params: null,
				path: "/blog",
				shadow: null,
				a: [0,4],
				b: [1]
			},
			{
				type: 'page',
				pattern: /^\/blog\/category\/?$/,
				params: null,
				path: "/blog/category",
				shadow: null,
				a: [0,5],
				b: [1]
			},
			{
				type: 'page',
				pattern: /^\/blog\/category\/page\/([^/]+?)\/?$/,
				params: (m) => ({ page: m[1]}),
				path: null,
				shadow: null,
				a: [0,6],
				b: [1]
			},
			{
				type: 'page',
				pattern: /^\/blog\/category\/([^/]+?)\/?$/,
				params: (m) => ({ category: m[1]}),
				path: null,
				shadow: null,
				a: [0,7],
				b: [1]
			},
			{
				type: 'page',
				pattern: /^\/blog\/category\/([^/]+?)\/page\/?$/,
				params: (m) => ({ category: m[1]}),
				path: null,
				shadow: null,
				a: [0,8],
				b: [1]
			},
			{
				type: 'page',
				pattern: /^\/blog\/category\/([^/]+?)\/page\/([^/]+?)\/?$/,
				params: (m) => ({ category: m[1], page: m[2]}),
				path: null,
				shadow: null,
				a: [0,9],
				b: [1]
			},
			{
				type: 'page',
				pattern: /^\/blog\/page\/?$/,
				params: null,
				path: "/blog/page",
				shadow: null,
				a: [0,10],
				b: [1]
			},
			{
				type: 'page',
				pattern: /^\/blog\/page\/([^/]+?)\/?$/,
				params: (m) => ({ page: m[1]}),
				path: null,
				shadow: null,
				a: [0,11],
				b: [1]
			},
			{
				type: 'page',
				pattern: /^\/blog\/([^/]+?)\/?$/,
				params: (m) => ({ post: m[1]}),
				path: null,
				shadow: null,
				a: [0,12],
				b: [1]
			},
			{
				type: 'endpoint',
				pattern: /^\/api\/rss\.xml$/,
				params: null,
				load: () => import('../server/entries/endpoints/api/rss.xml.js')
			},
			{
				type: 'endpoint',
				pattern: /^\/api\/posts\.json$/,
				params: null,
				load: () => import('../server/entries/endpoints/api/posts/index.json.js')
			},
			{
				type: 'endpoint',
				pattern: /^\/api\/posts\/count\.json$/,
				params: null,
				load: () => import('../server/entries/endpoints/api/posts/count.json.js')
			},
			{
				type: 'endpoint',
				pattern: /^\/api\/posts\/category\/([^/]+?)\.json$/,
				params: (m) => ({ category: m[1]}),
				load: () => import('../server/entries/endpoints/api/posts/category/_category_.json.js')
			},
			{
				type: 'endpoint',
				pattern: /^\/api\/posts\/category\/([^/]+?)\/count\.json$/,
				params: (m) => ({ category: m[1]}),
				load: () => import('../server/entries/endpoints/api/posts/category/_category_/count.json.js')
			}
		]
	}
});
