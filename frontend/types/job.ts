import type { Clip } from "./clip";

export interface JobResult {
  clips?: Clip[];
  clip_generator?: {
    clips?: Clip[];
  };
}

export interface JobUpdate {
  progress?: number;
  step?: string;
  status?: "completed" | "failed" | string;
  result?: JobResult;
  error?: string;
}

export interface StartJobResponse {
  job_id: string;
  job_token: string;
}
