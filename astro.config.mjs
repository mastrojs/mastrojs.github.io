// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export const guideChapters = [
	{ label: 'Motivation: Why learn HTML and CSS?', slug: 'guide/why-html-css' },
	{ label: 'Setup: GitHub and VS Code for the Web', slug: 'guide/setup' },
	{ label: 'Start with HTML', slug: 'guide/html' },
	{ label: 'Style with CSS', slug: 'guide/css' },
	{ label: 'Introducing JavaScript', slug: 'guide/javascript' },
	{ label: 'Multiple pages with shared components', slug: 'guide/multiple-pages-with-shared-components' },
	{ label: 'A static blog from markdown files', slug: 'guide/static-blog-from-markdown-files' },
	{ label: 'Interactivity with JavaScript in the browser', slug: 'guide/interactivity-with-javascript-in-the-browser' },
	{ label: 'Addendum: about HTTP, forms and REST APIs', slug: 'guide/http-forms-and-rest-apis' },
]

export const reactiveChapters = [
	{ label: 'Installing Reactive Mastro', slug: 'reactive/install' },
	{ label: 'Why Reactive Mastro?', slug: 'reactive/why-reactive-mastro' },
	{ label: 'Using Reactive Mastro', slug: 'reactive/usage' },
	{ label: 'Reference', slug: 'reactive/reference' },
]

// https://astro.build/config
// https://starlight.astro.build/reference/configuration/
export default defineConfig({
	site: 'https://mastrojs.github.io',
	integrations: [
		starlight({
			title: 'Mastro',
      customCss: [ './src/styles.css' ],
			editLink: {
				baseUrl: 'https://github.com/mastrojs/docs/edit/main/',
			},
			head: [
				{
					tag: 'meta',
					attrs: { property: 'og:image', content: '/og.png' },
				},
				{
					tag: 'script',
					attrs: {
						'data-goatcounter': 'https://mastrojs.goatcounter.com/count',
						async: true,
						src: '//gc.zgo.at/count.js',
					},
				}
			],
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/mastrojs/mastro' }],
			sidebar: [
				{
					label: 'Guide',
					collapsed: true,
					items: guideChapters,
				},
				{
					label: 'Reactive Mastro',
					collapsed: true,
					items: reactiveChapters,
				},
			],
			tableOfContents: false,
		}),
	],
	redirects: {
		"/guides/": "/guide/",
	},
});
