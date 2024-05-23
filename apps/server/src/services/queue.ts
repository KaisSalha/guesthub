import { parentPort } from "worker_threads";
import PgBoss, { Job } from "pg-boss";
import { config } from "../config/index.js";

const boss = new PgBoss(config.DB.pgBoss);

boss.on("error", (error: Error) => {
	console.error("PgBoss error:", error);
	parentPort?.postMessage({ type: "error", error });
});

boss.start().then(() => {
	console.log("PgBoss started");
	parentPort?.postMessage({ type: "started" });
});

parentPort?.on("message", (message: { type: string }) => {
	if (message.type === "shutdown") {
		boss.stop().then(() => {
			console.log("PgBoss stopped");
			parentPort?.postMessage({ type: "stopped" });
		});
	}
});

await boss.work("job", async (job: Job) => {
	console.log(`Received job: ${job.name}`);

	await boss.complete(job.id);
});
