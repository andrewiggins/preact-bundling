export default (api) => {
	api.cache(true);

	return {
		presets: [
			[
				"@babel/preset-react",
				{
					runtime: "automatic",
					importSource: "preact",
				},
			],
		],
	};
};
