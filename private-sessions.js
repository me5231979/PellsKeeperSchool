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
    price:  optional — "$30"
    tag:    optional — short badge, e.g. "Ending soon"
    about:  optional — longer description (shows under the session)

  Day:
    day, location ("" for a day off), note (optional), sessions: [ ... ]
    A day off: sessions: [] with a note, e.g. "No sessions this Saturday."
*/
window.PRIVATE_SESSIONS = {
  weekOf: "", // e.g. "Oct 26 – Nov 1". Leave "" to just say "This week".
  email: "pellsgkschool@gmail.com",
  phone: "+19083387026",          // used by the Text Laurie button
  phoneDisplay: "(908) 338-7026",

  days: [
    {
      day: "Monday",
      location: "Troy Hill Park",
      sessions: [
        { time: "4pm", level: "high", spots: 3 },
        { time: "5pm", level: "all", spots: 1 },
        { time: "6–8pm", level: "all", label: "Evening sessions", booked: true },
      ],
    },
    {
      day: "Tuesday",
      location: "Troy Hill Park",
      sessions: [
        { time: "4pm", level: "high", spots: 3 },
        { time: "6:15pm", level: "all", label: "5th–6th grade", spots: 2, about: "This session is at Covenant Park." },
      ],
    },
    {
      day: "Wednesday",
      location: "Troy Hill Park",
      sessions: [
        { time: "4pm", level: "middle", spots: 1 },
        { time: "5pm", level: "middle", spots: 1 },
      ],
    },
    {
      day: "Thursday",
      location: "Troy Hill Park",
      sessions: [
        { time: "4pm", level: "high", spots: 3 },
        { time: "5pm", level: "elementary", tag: "Lights permitting" },
      ],
    },
    {
      day: "Friday",
      location: "Troy Hill Park",
      note: "No afternoon sessions this Friday.",
      sessions: [
        { time: "10:30am", level: "middle", tag: "If school is off" },
      ],
    },
    {
      day: "Saturday",
      location: "",
      note: "No sessions this Saturday.",
      sessions: [],
    },
    {
      day: "Sunday",
      location: "Troy Hill Park or Blandair Park",
      note: "Afternoon sessions only this Sunday.",
      sessions: [
        { time: "3pm", level: "all" },
        { time: "4pm", level: "all" },
      ],
    },
  ],
};
