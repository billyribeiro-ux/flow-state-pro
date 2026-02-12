export const METHODOLOGY_IDS = [
  "pomodoro",
  "gtd",
  "eisenhower",
  "time_blocking",
  "pareto",
  "deep_work",
  "eat_the_frog",
  "two_minute",
  "batch",
  "time_audit",
] as const;

export type MethodologyId = (typeof METHODOLOGY_IDS)[number];

export interface MethodologyDef {
  id: MethodologyId;
  name: string;
  slug: string;
  category: "Execute" | "Capture" | "Prioritize" | "Optimize" | "Reflect";
  tagline: string;
  description: string;
  coreMechanic: string;
  color: string;
  icon: string;
  phase: 1 | 2 | 3;
}

export const METHODOLOGIES: Record<MethodologyId, MethodologyDef> = {
  pomodoro: {
    id: "pomodoro",
    name: "Pomodoro Technique",
    slug: "pomodoro",
    category: "Execute",
    tagline: "Focus in 25-minute sprints",
    description:
      "Break your work into focused 25-minute intervals separated by short breaks. Build momentum through structured cycles that keep your brain fresh and engaged.",
    coreMechanic: "25min focus / 5min break cycles",
    color: "var(--color-pomodoro)",
    icon: "Timer",
    phase: 1,
  },
  gtd: {
    id: "gtd",
    name: "Getting Things Done",
    slug: "gtd",
    category: "Capture",
    tagline: "Capture everything, process systematically",
    description:
      "Get everything out of your head and into a trusted system. Process, organize, and execute with clarity using David Allen's proven five-step workflow.",
    coreMechanic: "Inbox → Clarify → Organize → Review → Execute",
    color: "var(--color-gtd)",
    icon: "Tray",
    phase: 2,
  },
  eisenhower: {
    id: "eisenhower",
    name: "Eisenhower Matrix",
    slug: "eisenhower",
    category: "Prioritize",
    tagline: "Separate urgent from important",
    description:
      "Categorize every task by urgency and importance. Focus on what truly matters, delegate the rest, and eliminate time-wasters that masquerade as productivity.",
    coreMechanic: "2×2 urgency/importance grid",
    color: "var(--color-eisenhower)",
    icon: "GridFour",
    phase: 1,
  },
  time_blocking: {
    id: "time_blocking",
    name: "Time Blocking",
    slug: "time-blocking",
    category: "Execute",
    tagline: "Own your calendar, own your day",
    description:
      "Assign every hour a purpose. Block your calendar for focused work, meetings, and breaks. If it's not on your calendar, it doesn't get done.",
    coreMechanic: "Calendar-based task scheduling",
    color: "var(--color-time-blocking)",
    icon: "CalendarBlank",
    phase: 1,
  },
  pareto: {
    id: "pareto",
    name: "80/20 Rule",
    slug: "pareto",
    category: "Optimize",
    tagline: "Find the 20% that drives 80% of results",
    description:
      "Identify your highest-leverage activities and double down. Stop spreading yourself thin across low-impact work that barely moves the needle.",
    coreMechanic: "Identify highest-leverage activities",
    color: "var(--color-pareto)",
    icon: "ChartBar",
    phase: 3,
  },
  deep_work: {
    id: "deep_work",
    name: "Deep Work",
    slug: "deep-work",
    category: "Execute",
    tagline: "Extended distraction-free focus",
    description:
      "Train your ability to focus without distraction on cognitively demanding tasks. Deep work is the superpower of the knowledge economy.",
    coreMechanic: "Extended distraction-free focus sessions",
    color: "var(--color-deep-work)",
    icon: "Brain",
    phase: 2,
  },
  eat_the_frog: {
    id: "eat_the_frog",
    name: "Eat That Frog",
    slug: "eat-the-frog",
    category: "Execute",
    tagline: "Hardest task first, every morning",
    description:
      "Identify your most important, most dreaded task and tackle it first thing. Everything else becomes easier after you've eaten the frog.",
    coreMechanic: "Hardest task first, every morning",
    color: "var(--color-eat-the-frog)",
    icon: "FishSimple",
    phase: 2,
  },
  two_minute: {
    id: "two_minute",
    name: "Two-Minute Rule",
    slug: "two-minute",
    category: "Execute",
    tagline: "If it takes 2 minutes, do it now",
    description:
      "Stop deferring tiny tasks. If something takes less than two minutes, the overhead of tracking it costs more than just doing it immediately.",
    coreMechanic: "Immediate execution of <2min tasks",
    color: "var(--color-two-minute)",
    icon: "Lightning",
    phase: 1,
  },
  batch: {
    id: "batch",
    name: "Batch Processing",
    slug: "batch",
    category: "Optimize",
    tagline: "Group similar tasks, crush them together",
    description:
      "Stop context-switching. Group similar tasks — emails, calls, admin work — into dedicated time blocks and process them in one focused session.",
    coreMechanic: "Group similar tasks together",
    color: "var(--color-batch)",
    icon: "Stack",
    phase: 3,
  },
  time_audit: {
    id: "time_audit",
    name: "Time Audit",
    slug: "time-audit",
    category: "Reflect",
    tagline: "Track where your time actually goes",
    description:
      "You can't manage what you don't measure. Track your actual time usage, compare it to your plans, and discover where your hours really go.",
    coreMechanic: "Track actual vs. planned time",
    color: "var(--color-time-audit)",
    icon: "MagnifyingGlass",
    phase: 3,
  },
};

export const METHODOLOGY_PROGRESSION: Record<MethodologyId, MethodologyId[]> = {
  pomodoro: ["time_blocking", "deep_work", "batch"],
  eisenhower: ["eat_the_frog", "pareto", "time_audit"],
  gtd: ["two_minute", "eisenhower", "batch"],
  time_blocking: ["pomodoro", "deep_work", "batch"],
  deep_work: ["time_blocking", "eat_the_frog", "pomodoro"],
  eat_the_frog: ["eisenhower", "pomodoro", "deep_work"],
  two_minute: ["gtd", "batch", "eisenhower"],
  batch: ["time_blocking", "pomodoro", "two_minute"],
  pareto: ["eisenhower", "time_audit", "eat_the_frog"],
  time_audit: ["pareto", "time_blocking", "eisenhower"],
};

export const PHASE_1_METHODOLOGIES: MethodologyId[] = [
  "pomodoro",
  "eisenhower",
  "time_blocking",
  "two_minute",
];
