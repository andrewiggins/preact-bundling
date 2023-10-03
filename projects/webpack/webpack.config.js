import HtmlWebpackPlugin from "html-webpack-plugin";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const p = (...args) => path.join(__dirname, ...args);

export default {
	entry: "./src/index.js",
	output: {
		filename: "main.js",
		path: p("dist"),
		clean: true,
	},
	module: {
		rules: [
			{
				test: /\.(?:js|mjs|cjs)$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
					options: {
						presets: [
							[
								"@babel/preset-react",
								{ runtime: "automatic", importSource: "preact" },
							],
						],
					},
				},
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			title: "Preact built with Webpack",
		}),
	],
};
