import esbuild from "esbuild";

// Replace with import.meta.resolve when it's available
import { createRequire } from "module";
const require = createRequire(import.meta.url);

// Sample cmd line: esbuild --bundle src/index.jsx --outdir=dist --sourcemap
/** @type {import('esbuild').BuildOptions} */
const buildOptions = {
	entryPoints: ["src/index.jsx"],
	bundle: true,
	outdir: "dist",
	sourcemap: true,
	jsxImportSource: "preact",
	plugins: [
		{
			name: "preact-compat",
			setup(build) {
				build.onResolve({ filter: /^react(-dom)?$/ }, (args) => ({
					path: require.resolve("preact/compat"),
				}));

				build.onResolve({ filter: /^react(?:-dom)?\/(.*)$/ }, (args) => {
					return {
						path: require.resolve(`preact/compat/${args.path[1]}`),
					};
				});
			},
		},
	],
};

if (process.argv.includes("--watch")) {
	const ctx = await esbuild.context(buildOptions);
	await ctx.watch();
} else {
	await esbuild.build(buildOptions);
}
