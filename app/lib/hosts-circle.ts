// Mainland Spain local time: do not replace Europe/Madrid with a fixed UTC offset.
export const HOSTS_CIRCLE_SCHEDULE = {
  cadence: "First Tuesday of every month",
  time: "17:00",
  timeZone: "Europe/Madrid",
  durationMinutes: 90,
} as const;

export const HOSTS_CIRCLE_FLOW = [
  {
    title: "Arrive & check in",
    minutes: 10,
    body: "A moment to land, put the day down and say how you are arriving. We begin with the person, not the business update.",
    prompt: "How are you, really?",
  },
  {
    title: "Share what is working",
    minutes: 15,
    body: "Celebrate a success, however small, and the lesson behind it. A thoughtful guest experience, a healthier team rhythm or something you finally made possible.",
    prompt: "What worked, and what did it teach you?",
  },
  {
    title: "Bring the real challenge",
    minutes: 30,
    body: "One or two people bring a current struggle for deeper attention. We rotate this space across meetings and listen before responding: uncertainty, workload, guest care or the responsibility of holding a venue.",
    prompt: "Where could you use another perspective?",
  },
  {
    title: "Offer support & serve",
    minutes: 25,
    body: "Ask what kind of support would help, then share relevant experience, a resource or an introduction with consent. Explore one way our work can better serve our guests, teams and local communities.",
    prompt: "What do you need, and what can you offer?",
  },
  {
    title: "Close with one next step",
    minutes: 10,
    body: "Name one realistic action or intention to carry into the month. Close with appreciation and return next time with what you learned.",
    prompt: "What will you take into practice?",
  },
] as const;

export const HOSTS_CIRCLE_AGREEMENTS = [
  ["Confidentiality", "Keep personal stories within the circle. No recordings or screenshots; remove identifying details when discussing guests or team members."],
  ["Listening before advice", "Ask whether someone wants listening, reflection or practical ideas. Speak from your own experience, without assuming you have their answer."],
  ["Equal space", "Share the time, respect each person’s boundaries and allow the option to pass. We can be honest without needing to prove ourselves."],
  ["Contribution", "Come ready to receive and to offer. Share useful experience generously; ask permission before following up or making an introduction."],
  ["Presence", "Join on time from a quiet place when possible. Put other tasks aside and give the people in the room your attention."],
  ["Care over promotion", "This is a peer-support circle, not a sales pitch. Let trust, respect and the wish to serve guide how we meet."],
] as const;
