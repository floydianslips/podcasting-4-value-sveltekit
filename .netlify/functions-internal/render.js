const { init } = require('../handler.js');

exports.handler = init({
	appDir: "_app",
	assets: new Set(["favicon.png","images/jefferson-santos-fCEJGBzAkrU-unsplash.jpg","images/jerry-zhang-ePpaQC2c1xA-unsplash.jpg","images/linus-nylund-Q5QspluNZmM-unsplash.jpg","link.svg"]),
	_: {
		mime: {".png":"image/png",".jpg":"image/jpeg",".svg":"image/svg+xml"},
		entry: {"file":"start-a91e5362.js","js":["start-a91e5362.js","chunks/vendor-916d40fb.js","chunks/preload-helper-ec9aa979.js","chunks/singletons-d19c42e4.js"],"css":[]},
		nodes: [
			() => Promise.resolve().then(() => require('../server/nodes/0.js')),
			() => Promise.resolve().then(() => require('../server/nodes/1.js')),
			() => Promise.resolve().then(() => require('../server/nodes/2.js')),
			() => Promise.resolve().then(() => require('../server/nodes/3.js')),
			() => Promise.resolve().then(() => require('../server/nodes/4.js')),
			() => Promise.resolve().then(() => require('../server/nodes/5.js')),
			() => Promise.resolve().then(() => require('../server/nodes/6.js')),
			() => Promise.resolve().then(() => require('../server/nodes/7.js')),
			() => Promise.resolve().then(() => require('../server/nodes/8.js')),
			() => Promise.resolve().then(() => require('../server/nodes/9.js')),
			() => Promise.resolve().then(() => require('../server/nodes/10.js')),
			() => Promise.resolve().then(() => require('../server/nodes/11.js')),
			() => Promise.resolve().then(() => require('../server/nodes/12.js')),
			() => Promise.resolve().then(() => require('../server/nodes/13.js'))
		],
		routes: [
			{
				type: 'page',
				pattern: /^\/$/,
				params: null,
				path: "/",
				a: [0,2],
				b: [1]
			},
			{
				type: 'page',
				pattern: /^\/contact\/?$/,
				params: null,
				path: "/contact",
				a: [0,3],
				b: [1]
			},
			{
				type: 'page',
				pattern: /^\/about\/?$/,
				params: null,
				path: "/about",
				a: [0,4],
				b: [1]
			},
			{
				type: 'page',
				pattern: /^\/blog\/?$/,
				params: null,
				path: "/blog",
				a: [0,5],
				b: [1]
			},
			{
				type: 'page',
				pattern: /^\/blog\/category\/?$/,
				params: null,
				path: "/blog/category",
				a: [0,6],
				b: [1]
			},
			{
				type: 'page',
				pattern: /^\/blog\/category\/page\/([^/]+?)\/?$/,
				params: (m) => ({ page: m[1]}),
				path: null,
				a: [0,7],
				b: [1]
			},
			{
				type: 'page',
				pattern: /^\/blog\/category\/([^/]+?)\/?$/,
				params: (m) => ({ category: m[1]}),
				path: null,
				a: [0,8],
				b: [1]
			},
			{
				type: 'page',
				pattern: /^\/blog\/category\/([^/]+?)\/page\/?$/,
				params: (m) => ({ category: m[1]}),
				path: null,
				a: [0,9],
				b: [1]
			},
			{
				type: 'page',
				pattern: /^\/blog\/category\/([^/]+?)\/page\/([^/]+?)\/?$/,
				params: (m) => ({ category: m[1], page: m[2]}),
				path: null,
				a: [0,10],
				b: [1]
			},
			{
				type: 'page',
				pattern: /^\/blog\/page\/?$/,
				params: null,
				path: "/blog/page",
				a: [0,11],
				b: [1]
			},
			{
				type: 'page',
				pattern: /^\/blog\/page\/([^/]+?)\/?$/,
				params: (m) => ({ page: m[1]}),
				path: null,
				a: [0,12],
				b: [1]
			},
			{
				type: 'page',
				pattern: /^\/blog\/([^/]+?)\/?$/,
				params: (m) => ({ post: m[1]}),
				path: null,
				a: [0,13],
				b: [1]
			},
			{
				type: 'endpoint',
				pattern: /^\/api\/rss\.xml$/,
				params: null,
				load: () => Promise.resolve().then(() => require('../server/entries/endpoints/api/rss.xml.js'))
			},
			{
				type: 'endpoint',
				pattern: /^\/api\/posts\.json$/,
				params: null,
				load: () => Promise.resolve().then(() => require('../server/entries/endpoints/api/posts/index.json.js'))
			},
			{
				type: 'endpoint',
				pattern: /^\/api\/posts\/count\.json$/,
				params: null,
				load: () => Promise.resolve().then(() => require('../server/entries/endpoints/api/posts/count.json.js'))
			},
			{
				type: 'endpoint',
				pattern: /^\/api\/posts\/category\/([^/]+?)\.json$/,
				params: (m) => ({ category: m[1]}),
				load: () => Promise.resolve().then(() => require('../server/entries/endpoints/api/posts/category/_category_.json.js'))
			},
			{
				type: 'endpoint',
				pattern: /^\/api\/posts\/category\/([^/]+?)\/count\.json$/,
				params: (m) => ({ category: m[1]}),
				load: () => Promise.resolve().then(() => require('../server/entries/endpoints/api/posts/category/_category_/count.json.js'))
			}
		]
	}
});
