import babel from "@rollup/plugin-babel";
import html, { makeHtmlAttributes } from "@rollup/plugin-html";
import nodeResolve from "@rollup/plugin-node-resolve";

function htmlTemplate({ attributes, files, meta, publicPath, title }) {
	const scripts = (files.js || [])
		.map(({ fileName }) => {
			const attrs = makeHtmlAttributes(attributes.script);
			return `<script src="${publicPath}${fileName}"${attrs}></script>`;
		})
		.join("\n");

	const links = (files.css || [])
		.map(({ fileName }) => {
			const attrs = makeHtmlAttributes(attributes.link);
			return `<link href="${publicPath}${fileName}" rel="stylesheet"${attrs}>`;
		})
		.join("\n");

	const metas = meta
		.map((input) => {
			const attrs = makeHtmlAttributes(input);
			return `<meta${attrs}>`;
		})
		.join("\n");

	return `<!doctype html>
<html${makeHtmlAttributes(attributes.html)}>
  <head>
    ${metas}
    <title>${title}</title>
    ${links}
  </head>
  <body>
	  <div id="root"></div>
    ${scripts}
  </body>
</html>`;
}

export default {
	input: "src/index.js",
	output: {
		file: "dist/bundle.js",
		format: "iife",
	},
	plugins: [
		nodeResolve(),
		babel({ babelHelpers: "bundled" }),
		html({
			template: htmlTemplate,
		}),
	],
};
