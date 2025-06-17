// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export const guideChapters = [
	{ label: 'Motivation: Why learn HTML and CSS?', slug: 'guides/why-html-css' },
	{ label: 'Setup: GitHub and VS Code for the Web', slug: 'guides/setup' },
	{ label: 'Start with HTML', slug: 'guides/html' },
	{ label: 'Style with CSS', slug: 'guides/css' },
	{ label: 'Introducing JavaScript', slug: 'guides/javascript' },
	{ label: 'Multiple pages with shared components', slug: 'guides/multiple-pages-with-shared-components' },
	{ label: 'A static blog from markdown files', slug: 'guides/static-blog-from-markdown-files' },
	{ label: 'Interactivity with JavaScript in the browser', slug: 'guides/interactivity-with-javascript-in-the-browser' },
]

export const reactiveChapters = [
	{ label: 'Installing Reactive Mastro', slug: 'reactive/install' },
	{ label: 'Why Reactive Mastro?', slug: 'reactive/why-reactive-mastro' },
	{ label: 'Using Reactive Mastro', slug: 'reactive/usage' },
	{ label: 'Reference', slug: 'reactive/reference' },
]

// https://astro.build/config
export default defineConfig({
	site: 'https://mastrojs.github.io',
	integrations: [
		starlight({
			title: 'Mastro',
      customCss: [ './src/styles.css' ],
			head: [
				{
					tag: 'meta',
					attrs: { property: 'og:image', content: '/og.png' },
				}
			],
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/mastrojs/mastro' }],
			sidebar: [
				{
					label: 'Guides',
					items: guideChapters,
				},
				{
					label: 'Reactive Mastro',
					items: reactiveChapters,
				},
			],
		}),
	],
});
