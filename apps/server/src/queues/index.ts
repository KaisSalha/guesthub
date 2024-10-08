import { parentPort } from "worker_threads";
import { boss } from "../lib/pgboss.js"; // Adjust the path as necessary
import { Job } from "pg-boss";

console.log("Queues worker thread started");

await boss.start();

interface IJob extends Job {
	data: {
		name: string;
	};
}

boss.work("send-msg", async (job: IJob) => {
	console.log(`Received job: ${job.name} with name ${job.data.name}`);

	await boss.complete(job.id);
});

// Listen for messages from the parent thread
parentPort?.on("message", async (message) => {
	if (message.type === "shutdown") {
		console.log("Worker shutting down...");
		await boss.stop();
		process.exit(0);
	}
});

process.on("uncaughtException", (error) => {
	console.error("Uncaught exception in worker:", error);
	parentPort?.postMessage({ type: "error", error: error.message });
});

process.on("unhandledRejection", (reason) => {
	console.error("Unhandled rejection in worker:", reason);
	parentPort?.postMessage({ type: "error", error: reason });
});
