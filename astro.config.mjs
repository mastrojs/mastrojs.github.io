// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export const guideChapters = [
	{ label: 'Why learn HTML and CSS?', slug: 'guides/why-html-css' },
	{ label: 'About JavaScript', slug: 'guides/about-javascript' },
	{ label: 'Setup: GitHub and VS Code for the Web', slug: 'guides/setup' },
	{ label: 'Start with HTML', slug: 'guides/html' },
	{ label: 'Style with CSS', slug: 'guides/css' },
	{ label: 'JavaScript for pages with shared components', slug: 'guides/javascript-to-render-multiple-pages-with-shared-components' },
	// { label: 'A static blog from markdown files', slug: 'guides/static-blog-from-markdown-files' },
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
			],
		}),
	],
});
