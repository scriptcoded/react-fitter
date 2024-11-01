// @ts-check

import { esbuildPluginFilePathExtensions } from "esbuild-plugin-file-path-extensions";
import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["lib/index.ts", "lib/*.css"],
	format: ["cjs", "esm"],
	target: ["chrome91", "firefox90", "edge91", "safari15", "ios15", "opera77"],
	outDir: "dist",
	dts: true,
	sourcemap: true,
	clean: true,
	// @ts-expect-error
	esbuildPlugins: [esbuildPluginFilePathExtensions({ esmExtension: "js" })],
});
