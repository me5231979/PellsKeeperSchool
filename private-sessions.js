/*
  PRIVATE TRAINING — WEEKLY SCHEDULE
  ----------------------------------
  Edit this file each week. The Private Training section on the site is built from it.

  Each session:
    time:   "4pm"
    level:  "elementary" | "middle" | "high" | "all"
    label:  optional — replaces the level name (e.g. "HS juniors & seniors")
    spots:  number of spots left (e.g. 2). Leave out if just "open".
    booked: true when full. Add  waitlist: true  to offer a waitlist.
    coach:  optional — "Josh"
    price:  optional — "$30"
    tag:    optional — short badge, e.g. "Ending soon"
    about:  optional — longer description (shows under the session)

  Day:
    day, location, note (optional), sessions: [ ... ]
*/
window.PRIVATE_SESSIONS = {
  weekOf: "", // e.g. "Oct 26 – Nov 1". Leave "" to just say "This week".
  email: "info@pellskeeperschool.com",

  days: [
    {
      day: "Monday",
      location: "Troy Hill Park",
      sessions: [
        { time: "3pm", level: "all" },
      ],
    },
    {
      day: "Tuesday",
      location: "Troy Hill Park",
      sessions: [
        { time: "4pm", level: "high" },
        { time: "5pm", level: "elementary", spots: 1 },
      ],
    },
    {
      day: "Wednesday",
      location: "Troy Hill Park",
      sessions: [
        { time: "4pm", level: "middle", booked: true },
        { time: "5pm", level: "middle", spots: 2 },
      ],
    },
    {
      day: "Thursday",
      location: "Troy Hill Park",
      sessions: [
        { time: "4pm", level: "all" },
        { time: "5pm", level: "elementary" },
      ],
    },
    {
      day: "Friday",
      location: "Troy Hill Park",
      sessions: [
        { time: "4pm", level: "middle" },
        {
          time: "5pm",
          level: "all",
          label: "Distribution session",
          price: "$30",
          tag: "Ending soon",
          about: "Learn and practice getting under the ball and breaking lines. Keepers take their own goal kicks, free kicks from the back, and punts, and so many struggle with it. Come one, come all.",
        },
        { time: "6pm", level: "high", spots: 3 },
      ],
    },
    {
      day: "Saturday",
      location: "Location TBD, most likely Cedar Lane (Howard County)",
      sessions: [
        { time: "8am", level: "elementary", spots: 4, coach: "Josh" },
        { time: "9am", level: "middle", spots: 4, coach: "Zeke" },
        { time: "10am", level: "high", label: "HS juniors & seniors" },
        { time: "11am", level: "high", booked: true, waitlist: true },
      ],
    },
    {
      day: "Sunday",
      location: "Troy Hill Park or Blandair Park",
      note: "No 11am session this week.",
      sessions: [
        { time: "8am", level: "elementary" },
        { time: "9am", level: "middle" },
        { time: "10am", level: "high", spots: 3, coach: "Emily and Zach" },
      ],
    },
  ],
};
