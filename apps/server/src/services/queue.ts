import { Job } from "pg-boss";
import { boss } from "../lib/pgboss.js";

await boss.work("job", async (job: Job) => {
	console.log(`Received job: ${job.name}`);

	await boss.complete(job.id);
});
