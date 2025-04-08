import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
	overwrite: true,
	schema: "https://api.taddy.org/",
	documents: "src/**/*.ts",
	generates: {
		"src/graphql/generated.ts": {
			plugins: [
				{
					add: {
						content: "// @ts-nocheck",
					},
				},
				"typescript",
				"typescript-operations",
				"typescript-graphql-request",
			],
		},
	},
};

export default config;
