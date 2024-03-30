import { buildServer } from "./server.js";
import { config } from "./config/index.js";

const app = await buildServer({
	logger: config.LOGGER,
});

app.listen({ port: config.PORT, host: "0.0.0.0" }, (err) => {
	if (err) {
		app.log.error(err);
		process.exit(1);
	}
});

for (const signal of ["SIGINT", "SIGTERM"]) {
	process.on(signal, async () => {
		await app.close();
	});
}
