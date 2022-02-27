export const manifest = {
	appDir: "_app",
	assets: new Set(["admin/config.yml","admin/index.html","favicon.png","favicon1.png","images/jefferson-santos-fCEJGBzAkrU-unsplash.jpg","images/jerry-zhang-ePpaQC2c1xA-unsplash.jpg","images/linus-nylund-Q5QspluNZmM-unsplash.jpg","link.svg","uploads/.gitkeep","uploads/podcasting4value-lg.png"]),
	_: {
		mime: {".yml":"text/yaml",".html":"text/html",".png":"image/png",".jpg":"image/jpeg",".svg":"image/svg+xml"},
		entry: {"file":"start-d88d07b6.js","js":["start-d88d07b6.js","chunks/vendor-48ac5387.js","chunks/preload-helper-ec9aa979.js","chunks/singletons-d19c42e4.js"],"css":["assets/vendor-bb155fe5.css"]},
		nodes: [
			() => import('./nodes/0.js'),
			() => import('./nodes/1.js'),
			() => import('./nodes/2.js'),
			() => import('./nodes/3.js'),
			() => import('./nodes/4.js'),
			() => import('./nodes/5.js'),
			() => import('./nodes/6.js'),
			() => import('./nodes/7.js'),
			() => import('./nodes/8.js'),
			() => import('./nodes/9.js'),
			() => import('./nodes/10.js'),
			() => import('./nodes/11.js'),
			() => import('./nodes/12.js'),
			() => import('./nodes/13.js'),
			() => import('./nodes/14.js')
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
				pattern: /^\/contact\/?$/,
				params: null,
				path: "/contact",
				shadow: null,
				a: [0,3],
				b: [1]
			},
			{
				type: 'page',
				pattern: /^\/donate\/?$/,
				params: null,
				path: "/donate",
				shadow: null,
				a: [0,4],
				b: [1]
			},
			{
				type: 'page',
				pattern: /^\/about\/?$/,
				params: null,
				path: "/about",
				shadow: null,
				a: [0,5],
				b: [1]
			},
			{
				type: 'page',
				pattern: /^\/blog\/?$/,
				params: null,
				path: "/blog",
				shadow: null,
				a: [0,6],
				b: [1]
			},
			{
				type: 'page',
				pattern: /^\/blog\/category\/?$/,
				params: null,
				path: "/blog/category",
				shadow: null,
				a: [0,7],
				b: [1]
			},
			{
				type: 'page',
				pattern: /^\/blog\/category\/page\/([^/]+?)\/?$/,
				params: (m) => ({ page: m[1]}),
				path: null,
				shadow: null,
				a: [0,8],
				b: [1]
			},
			{
				type: 'page',
				pattern: /^\/blog\/category\/([^/]+?)\/?$/,
				params: (m) => ({ category: m[1]}),
				path: null,
				shadow: null,
				a: [0,9],
				b: [1]
			},
			{
				type: 'page',
				pattern: /^\/blog\/category\/([^/]+?)\/page\/?$/,
				params: (m) => ({ category: m[1]}),
				path: null,
				shadow: null,
				a: [0,10],
				b: [1]
			},
			{
				type: 'page',
				pattern: /^\/blog\/category\/([^/]+?)\/page\/([^/]+?)\/?$/,
				params: (m) => ({ category: m[1], page: m[2]}),
				path: null,
				shadow: null,
				a: [0,11],
				b: [1]
			},
			{
				type: 'page',
				pattern: /^\/blog\/page\/?$/,
				params: null,
				path: "/blog/page",
				shadow: null,
				a: [0,12],
				b: [1]
			},
			{
				type: 'page',
				pattern: /^\/blog\/page\/([^/]+?)\/?$/,
				params: (m) => ({ page: m[1]}),
				path: null,
				shadow: null,
				a: [0,13],
				b: [1]
			},
			{
				type: 'page',
				pattern: /^\/blog\/([^/]+?)\/?$/,
				params: (m) => ({ post: m[1]}),
				path: null,
				shadow: null,
				a: [0,14],
				b: [1]
			},
			{
				type: 'endpoint',
				pattern: /^\/api\/rss\.xml$/,
				params: null,
				load: () => import('./entries/endpoints/api/rss.xml.js')
			},
			{
				type: 'endpoint',
				pattern: /^\/api\/posts\.json$/,
				params: null,
				load: () => import('./entries/endpoints/api/posts/index.json.js')
			},
			{
				type: 'endpoint',
				pattern: /^\/api\/posts\/count\.json$/,
				params: null,
				load: () => import('./entries/endpoints/api/posts/count.json.js')
			},
			{
				type: 'endpoint',
				pattern: /^\/api\/posts\/category\/([^/]+?)\.json$/,
				params: (m) => ({ category: m[1]}),
				load: () => import('./entries/endpoints/api/posts/category/_category_.json.js')
			},
			{
				type: 'endpoint',
				pattern: /^\/api\/posts\/category\/([^/]+?)\/count\.json$/,
				params: (m) => ({ category: m[1]}),
				load: () => import('./entries/endpoints/api/posts/category/_category_/count.json.js')
			}
		]
	}
};
