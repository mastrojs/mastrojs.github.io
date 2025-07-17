// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export const guideChapters = [
	{ label: 'Motivation: Why learn HTML and CSS?', slug: 'guide/why-html-css' },
	{ label: 'Setup: GitHub and VS Code for Web', slug: 'guide/setup' },
	{ label: 'Start with HTML', slug: 'guide/html' },
	{ label: 'Publish your website', slug: 'guide/publish-website' },
	{ label: 'Style with CSS', slug: 'guide/css' },
	{ label: 'Introducing JavaScript', slug: 'guide/javascript' },
	{ label: 'Server-side components', slug: 'guide/server-side-components' },
	{ label: 'A static blog from markdown files', slug: 'guide/static-blog-from-markdown-files' },
	{ label: 'Interactivity with JavaScript in the browser', slug: 'guide/interactivity-with-javascript-in-the-browser' },
	{ label: 'Addendum: HTTP, forms and REST APIs', slug: 'guide/http-forms-and-rest-apis' },
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
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/mastrojs/mastro' },
				{ icon: 'blueSky', label: 'BlueSky', href: 'https://bsky.app/profile/mastrojs.bsky.social' },
			],
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
