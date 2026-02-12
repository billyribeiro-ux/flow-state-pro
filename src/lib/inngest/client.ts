import { Inngest, EventSchemas } from "inngest";

type FlowStateEvents = {
  "session/completed": {
    data: {
      userId: string;
      sessionId: string;
      methodology: string;
      sessionType: string;
      actualDuration: number;
      focusRating?: number;
      distractionCount?: number;
      tasksCompleted?: number;
      pomodoroCycle?: number;
    };
  };
  "session/started": {
    data: {
      userId: string;
      sessionId: string;
      methodology: string;
      sessionType: string;
      plannedDuration: number;
    };
  };
  "session/abandoned": {
    data: {
      userId: string;
      sessionId: string;
      methodology: string;
      reason?: string;
      elapsedSeconds: number;
    };
  };
  "task/created": {
    data: {
      userId: string;
      taskId: string;
      title: string;
      estimatedMinutes?: number;
      isTwoMinute: boolean;
      batchCategory?: string;
    };
  };
  "task/completed": {
    data: {
      userId: string;
      taskId: string;
      isFrog: boolean;
      methodology?: string;
    };
  };
  "timer/five_minutes_remaining": {
    data: {
      userId: string;
      sessionId: string;
      methodology: string;
    };
  };
  "methodology/selected": {
    data: {
      userId: string;
      methodology: string;
    };
  };
  "methodology/unlock_ready": {
    data: {
      userId: string;
      currentMethodology: string;
      unlockedMethodology: string;
      unlockedMethodologySlug: string;
    };
  };
  "video/progress_updated": {
    data: {
      userId: string;
      methodology: string;
      muxAssetId: string;
      watchPercentage: number;
    };
  };
  "analytics/milestone_reached": {
    data: {
      userId: string;
      milestone: string;
      description: string;
      value: number;
    };
  };
};

export const inngest = new Inngest({
  id: "flowstate-pro",
  schemas: new EventSchemas().fromRecord<FlowStateEvents>(),
});

export type { FlowStateEvents };
