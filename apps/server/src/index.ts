import { buildServer } from "./server.js";
import { config } from "./config/index.js";

export const app = buildServer(config.SERVER_CONFIG());

app.listen({ port: config.PORT, host: config.HOST }, (err) => {
	if (err) {
		app.log.error(err);
		process.exit(1);
	}
});

for (const signal of ["SIGINT", "SIGTERM"]) {
	process.on(signal, async () => {
		await app.close();
		process.exit(0);
	});
}
