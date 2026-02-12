export const COACHING_NUDGES = {
  pomodoro: {
    start: [
      "Ready for a focused sprint? Set your intention and let's go.",
      "25 minutes of pure focus. You've got this.",
      "Time to enter the zone. What's the ONE thing you'll accomplish?",
    ],
    midSession: [
      "You're halfway through. Stay locked in.",
      "Distractions are temporary. Your focus is building real momentum.",
    ],
    complete: [
      "Pomodoro complete! Take your break — you earned it.",
      "Nice work. That's another brick in the wall of consistency.",
      "Session done. Stretch, breathe, reset.",
    ],
    streak: [
      "You've completed {count} pomodoros today. That's serious focus power.",
      "{count} in a row! You're in deep flow territory.",
    ],
  },
  eisenhower: {
    start: [
      "Before you start — are you working on what's truly important?",
      "Check your matrix. Important + Urgent first, then Important + Not Urgent.",
    ],
    delegate: [
      "This task might be better delegated. Could someone else handle it?",
      "Urgent but not important? See if you can hand this off.",
    ],
    eliminate: [
      "If it's neither urgent nor important — consider dropping it entirely.",
      "Not everything deserves your time. Be ruthless with elimination.",
    ],
  },
  timeBlocking: {
    start: [
      "Your next block starts soon. Time to transition.",
      "Block scheduled. Protect this time like it's a meeting with your future self.",
    ],
    overrun: [
      "You've gone past your block end time. Wrap up and move on.",
      "Time's up on this block. Respect your own schedule.",
    ],
  },
  twoMinute: {
    start: [
      "Quick wins build momentum. What can you knock out in 2 minutes?",
      "Small tasks pile up. Let's clear the deck.",
    ],
    burst: [
      "You cleared {count} quick tasks! That momentum is real.",
      "{count} tasks done in rapid fire. Inbox zero vibes.",
    ],
  },
  gtd: {
    capture: [
      "Got something on your mind? Capture it now, process it later.",
      "Don't let ideas slip away. Get it into your inbox.",
    ],
    review: [
      "Time for your weekly review. How's your system looking?",
      "Regular reviews keep GTD running smoothly. Take 15 minutes.",
    ],
    process: [
      "Your inbox has {count} items. Time to clarify and organize.",
    ],
  },
  deepWork: {
    start: [
      "Entering deep work mode. Silence notifications. Close tabs. Focus.",
      "This is your time for cognitively demanding work. Make it count.",
    ],
    milestone: [
      "You've been in deep focus for {minutes} minutes. Impressive.",
      "{minutes} minutes of unbroken concentration. Cal Newport would be proud.",
    ],
  },
  eatTheFrog: {
    morning: [
      "Good morning! What's your frog today? Pick the task you're dreading most.",
      "Eat your frog first thing. Everything after will feel easier.",
    ],
    complete: [
      "Frog eaten! The hardest part of your day is done.",
      "You conquered your frog. The rest of the day is downhill from here.",
    ],
    procrastinating: [
      "Your frog is still waiting. The longer you wait, the harder it gets.",
      "Stop circling the frog. Just take the first bite.",
    ],
  },
  pareto: {
    insight: [
      "Focus on the 20% of tasks that drive 80% of your results.",
      "Not all tasks are equal. Which ones have the biggest impact?",
    ],
    review: [
      "Your Pareto analysis shows your vital few tasks are: {tasks}",
    ],
  },
  batch: {
    start: [
      "Time to batch similar tasks together. Context switching is the enemy.",
      "Group it, batch it, crush it. One category at a time.",
    ],
    complete: [
      "Batch complete! {count} similar tasks knocked out efficiently.",
    ],
  },
  timeAudit: {
    start: [
      "Let's see where your time really goes. Start tracking.",
      "Awareness is the first step. Log your time honestly.",
    ],
    insight: [
      "Your time audit shows you spent {percentage}% on {category}. Is that aligned with your goals?",
    ],
  },
  general: {
    streakAtRisk: [
      "Your {count}-day streak is at risk! One session today keeps it alive.",
      "Don't break the chain. {count} days and counting — keep going.",
    ],
    milestone: [
      "🎉 {count} sessions completed! You're building a serious practice.",
      "Milestone unlocked: {count} total focus hours. That's dedication.",
    ],
    comeback: [
      "Welcome back! Pick up where you left off — no judgment.",
      "Every restart counts. Let's get back in the flow.",
    ],
    newMethodology: [
      "New technique unlocked: {methodology}! Ready to explore it?",
      "You've earned access to {methodology}. Your consistency paid off.",
    ],
  },
} as const;

export type CoachingCategory = keyof typeof COACHING_NUDGES;
