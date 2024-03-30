import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
	overwrite: true,
	schema: [
		{
			"http://127.0.0.1:3000/graphql": {
				headers: {
					Authorization:
						"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImE3MGI1ZmM1LThhYmQtNDJhMS1hNmRlLTM0ZWUwNGI1NjM4NiIsImZpcnN0X25hbWUiOm51bGwsImxhc3RfbmFtZSI6bnVsbCwiZW1haWwiOiJrYWlzcy5zYWxoYUBnbWFpbC5jb20iLCJyb2xlIjoiYWRtaW4iLCJleHAiOjE3MTEyMzE1NTExMDYsImlhdCI6MTcwNjA1MTE1MX0.XPg1bEH0Xno2K7kEc1l6xQ-oGyzEKewKRGDiNBmfP_Y",
				},
			},
		},
	],
	documents: "src/**/*.tsx",
	generates: {
		"src/gql/": {
			preset: "client",
		},
	},
};

export default config;
