import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * @type {import('@rspack/cli').Configuration}
 */
export default {
	context: __dirname,
	entry: {
		main: "./src/index.jsx",
	},
	builtins: {
		react: {
			runtime: "automatic",
			importSource: "preact",
			refresh: false,
		},
		html: [
			{
				template: "./index.html",
			},
		],
	},
	module: {
		rules: [
			{
				test: /\.svg$/,
				type: "asset",
			},
		],
	},
};
