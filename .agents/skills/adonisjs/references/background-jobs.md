---
parent: backend
name: Adonis Jobs
description: Quick guide for @nemoventures/adonis-jobs
type: documentation
---

# Adonis Jobs (@nemoventures/adonis-jobs)

Queueing and background jobs with BullMQ.

## Where it lives in the repo

- Config: `apps/web/config/queue.ts`
- Providers/commands: `apps/web/adonisrc.ts`
- Jobs: `apps/web/app/**/jobs/*_job.ts`
- UI: `apps/web/app/core/routes.ts` (QueueDash)
- Metrics: `/metrics`, health: `/internal/healthz`

## Usage in this repo

- `apps/web/app/prelegal/jobs/generate_intake_summary_job.ts`
- `apps/web/app/prelegal/jobs/attachments_extraction_job.ts`
- `apps/web/app/messenger/jobs/fetch_new_chabot_errors_job.ts`

## Example (repo style)

File: `apps/web/app/prelegal/jobs/generate_intake_summary_job.ts`

```ts
import { Job } from "@nemoventures/adonis-jobs";

export default class GenerateIntakeSummaryJob extends Job<
  GenerateIntakeSummaryData,
  GenerateIntakeSummaryReturn
> {
  async process(): Promise<GenerateIntakeSummaryReturn> {
    this.logger.info(`Generate summary (#${this.data.intakeId}) job handled`);
    // ...
  }
}
```

## Create a job

```bash
node apps/web/ace make:job send_email
```

## Dispatch

```ts
import SendEmailJob from "#jobs/send_email_job";

await SendEmailJob.dispatch({ to: "user@x.com" });
```

### JobChain

```ts
import { JobChain } from "@nemoventures/adonis-jobs";

await new JobChain([
  FirstJob.dispatch({ /* ... */ }),
  SecondJob.dispatch({ /* ... */ }),
]).dispatch();
```

### JobScheduler

```ts
import { JobScheduler } from "@nemoventures/adonis-jobs";

await JobScheduler.schedule({
  key: "daily-sync",
  job: SyncJob,
  data: {},
  repeat: { pattern: "0 2 * * *" },
});
```

## Workers

```bash
node apps/web/ace queue:work
```

## Notes

- Default queue: `default` (see `apps/web/config/queue.ts`).
- There is also an `llm` queue with default worker options.
- Renaming a job class can break existing jobs; use `nameOverride`.
