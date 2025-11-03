import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import { resolve } from "path";
import { BASE_HOST } from "./src/contants";

// https://vite.dev/config/
export default defineConfig({
	base: BASE_HOST,
	plugins: [
		react({
			babel: {
				plugins: [["babel-plugin-react-compiler"]],
			},
		}),
		svgr({
			svgrOptions: {
				// настройки svgr
			},
		}),
	],
	resolve: {
		alias: {
			"@": resolve(__dirname, "src"),
			"@components": resolve(__dirname, "src/components"),
			"@assets": resolve(__dirname, "src/assets"),
			"@pages": resolve(__dirname, "src/pages"),
			"@hooks": resolve(__dirname, "src/hooks"),
			"@store": resolve(__dirname, "src/store"),
			"@db": resolve(__dirname, "src/configDb"),
			// добавьте свои алиасы
		},
	},
});
