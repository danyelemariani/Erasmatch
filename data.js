/* Erasmatch+ — mock dataset
 * All data here is fictional and for demonstration purposes only.
 */

// Erasmus+ Programme & Partner countries (subset, representative)
const COUNTRIES = [
  "Austria", "Belgium", "Bulgaria", "Croatia", "Cyprus", "Czechia",
  "Denmark", "Estonia", "Finland", "France", "Germany", "Greece",
  "Hungary", "Iceland", "Ireland", "Italy", "Latvia", "Lithuania",
  "Luxembourg", "Malta", "Netherlands", "North Macedonia", "Norway",
  "Poland", "Portugal", "Romania", "Serbia", "Slovakia", "Slovenia",
  "Spain", "Sweden", "Türkiye", "Albania", "Armenia", "Georgia",
  "Moldova", "Ukraine"
];

// Available interest tags for the onboarding chips
const INTERESTS = [
  "Climate", "Arts", "Sport", "Digital", "Inclusion",
  "Entrepreneurship", "Democracy", "Culture", "Wellbeing", "Volunteering"
];

/* Each opportunity:
 *  type:        Youth Exchange | ESC Volunteering | Training Course | Youth Participation | DiscoverEU
 *  minAge/maxAge: eligibility window
 *  country:     hosting country
 *  flag:        emoji flag of host
 *  gradient:    CSS gradient class index (1..6) for the card hero
 *  tags:        interest tags used for soft matching
 */
const OPPORTUNITIES = [
  {
    id: "yex-green-roots",
    title: "Green Roots: Youth for Climate",
    type: "Youth Exchange",
    emoji: "🌱",
    country: "Portugal",
    flag: "🇵🇹",
    city: "Sintra",
    minAge: 16, maxAge: 25,
    duration: "8 days",
    dates: "12–19 Sep 2026",
    funding: "100% funded · travel + food + stay",
    spots: 4,
    gradient: 1,
    tags: ["Climate", "Volunteering", "Wellbeing"],
    summary: "Plant ideas and trees with 30 young people from 6 countries. Workshops on sustainability, permaculture and youth-led climate action.",
    perks: ["Travel reimbursed up to €275", "Eco-hostel by the forest", "Erasmus+ Youthpass certificate"]
  },
  {
    id: "esc-coast-care",
    title: "Coast Care Volunteers",
    type: "ESC Volunteering",
    emoji: "🌊",
    country: "Greece",
    flag: "🇬🇷",
    city: "Crete",
    minAge: 18, maxAge: 30,
    duration: "6 months",
    dates: "Starts Oct 2026",
    funding: "Monthly allowance + housing",
    spots: 2,
    gradient: 2,
    tags: ["Climate", "Inclusion", "Volunteering"],
    summary: "Protect sea turtles and run beach-clean campaigns with a local NGO. Live by the Mediterranean for half a year.",
    perks: ["€5/day pocket money + meals", "Free accommodation", "Language course included"]
  },
  {
    id: "tc-digital-storytellers",
    title: "Digital Storytellers Lab",
    type: "Training Course",
    emoji: "🎬",
    country: "Estonia",
    flag: "🇪🇪",
    city: "Tallinn",
    minAge: 18, maxAge: 30,
    duration: "7 days",
    dates: "3–10 Nov 2026",
    funding: "100% funded · travel + food + stay",
    spots: 3,
    gradient: 3,
    tags: ["Digital", "Arts", "Culture"],
    summary: "Level up your video, podcast and social-media skills to tell stories that matter for your community. For youth workers & creators.",
    perks: ["Pro editing workshops", "Networking with 24 EU creators", "Equipment provided on-site"]
  },
  {
    id: "yex-stage-without-borders",
    title: "Stage Without Borders",
    type: "Youth Exchange",
    emoji: "🎭",
    country: "Italy",
    flag: "🇮🇹",
    city: "Bologna",
    minAge: 15, maxAge: 22,
    duration: "9 days",
    dates: "5–14 Jul 2026",
    funding: "100% funded · travel + food + stay",
    spots: 5,
    gradient: 4,
    tags: ["Arts", "Culture", "Inclusion"],
    summary: "Use theatre and improv to break stereotypes. No experience needed — just bring your energy and curiosity.",
    perks: ["Final public performance", "Daily warm-ups with pro actors", "City culture tours"]
  },
  {
    id: "tc-young-entrepreneurs",
    title: "Spark: Young Entrepreneurs",
    type: "Training Course",
    emoji: "🚀",
    country: "Germany",
    flag: "🇩🇪",
    city: "Berlin",
    minAge: 18, maxAge: 30,
    duration: "6 days",
    dates: "20–25 Oct 2026",
    funding: "100% funded · travel + food + stay",
    spots: 4,
    gradient: 5,
    tags: ["Entrepreneurship", "Digital", "Wellbeing"],
    summary: "Turn your idea into a pitch in a week. Design thinking, business model canvas, and mentoring from EU startup founders.",
    perks: ["Mentor matchmaking", "Demo-day pitch event", "Startup hub visits"]
  },
  {
    id: "yp-youth-voices",
    title: "Youth Voices in Democracy",
    type: "Youth Participation",
    emoji: "🗳️",
    country: "Belgium",
    flag: "🇧🇪",
    city: "Brussels",
    minAge: 16, maxAge: 28,
    duration: "5 days",
    dates: "8–12 Dec 2026",
    funding: "100% funded · travel + food + stay",
    spots: 6,
    gradient: 6,
    tags: ["Democracy", "Inclusion", "Culture"],
    summary: "Meet MEPs, debate real policy, and co-write recommendations for the future of Europe. Your voice goes straight to decision-makers.",
    perks: ["European Parliament visit", "Policy lab with experts", "Dialogue with MEPs"]
  },
  {
    id: "yex-move-it",
    title: "Move It! Sport for Inclusion",
    type: "Youth Exchange",
    emoji: "⚽",
    country: "Spain",
    flag: "🇪🇸",
    city: "Valencia",
    minAge: 14, maxAge: 20,
    duration: "8 days",
    dates: "1–8 Aug 2026",
    funding: "100% funded · travel + food + stay",
    spots: 5,
    gradient: 1,
    tags: ["Sport", "Inclusion", "Wellbeing"],
    summary: "Football, dance and street sports as tools to bring together youth of all backgrounds and abilities. Game on!",
    perks: ["Beach training sessions", "Inclusive sports workshops", "Tournament with locals"]
  },
  {
    id: "esc-village-makers",
    title: "Village Makers ESC",
    type: "ESC Volunteering",
    emoji: "🏡",
    country: "Romania",
    flag: "🇷🇴",
    city: "Brașov",
    minAge: 18, maxAge: 30,
    duration: "10 months",
    dates: "Starts Sep 2026",
    funding: "Monthly allowance + housing",
    spots: 3,
    gradient: 2,
    tags: ["Inclusion", "Culture", "Volunteering"],
    summary: "Help revitalise a Transylvanian village — youth clubs, cultural events and renovation projects with the local community.",
    perks: ["Pocket money + meals", "Mountain-side housing", "Romanian language course"]
  },
  {
    id: "tc-mind-matters",
    title: "Mind Matters: Wellbeing Toolkit",
    type: "Training Course",
    emoji: "🧠",
    country: "Finland",
    flag: "🇫🇮",
    city: "Helsinki",
    minAge: 18, maxAge: 30,
    duration: "6 days",
    dates: "16–21 Mar 2027",
    funding: "100% funded · travel + food + stay",
    spots: 4,
    gradient: 3,
    tags: ["Wellbeing", "Inclusion", "Sport"],
    summary: "Practical tools for youth mental health & resilience. Nature therapy, mindfulness, and peer-support methods — sauna included.",
    perks: ["Forest wellbeing sessions", "Certified facilitators", "Self-care toolkit to take home"]
  },
  {
    id: "yex-art-of-recycling",
    title: "The Art of Recycling",
    type: "Youth Exchange",
    emoji: "♻️",
    country: "Poland",
    flag: "🇵🇱",
    city: "Kraków",
    minAge: 15, maxAge: 24,
    duration: "7 days",
    dates: "10–17 Jun 2026",
    funding: "100% funded · travel + food + stay",
    spots: 5,
    gradient: 4,
    tags: ["Climate", "Arts", "Entrepreneurship"],
    summary: "Turn trash into treasure. Upcycling workshops, street-art murals and a pop-up exhibition on the circular economy.",
    perks: ["Street-art masterclass", "Pop-up gallery night", "Upcycled merch to keep"]
  },
  {
    id: "deu-interrail-europe",
    title: "DiscoverEU: Rail Across Europe",
    type: "DiscoverEU",
    emoji: "🚆",
    country: "France",
    flag: "🇫🇷",
    city: "Multiple",
    minAge: 18, maxAge: 18,
    duration: "Up to 30 days",
    dates: "Travel within 2026–27",
    funding: "Free travel pass",
    spots: 8,
    gradient: 5,
    tags: ["Culture", "Wellbeing", "Inclusion"],
    summary: "Got a free travel pass and explore Europe by train. Meet other 18-year-olds, collect stories, and discover the continent your way.",
    perks: ["Free Interrail-style pass", "Discount card for attractions", "DiscoverEU community access"]
  },
  {
    id: "tc-code-for-good",
    title: "Code for Good Bootcamp",
    type: "Training Course",
    emoji: "💻",
    country: "Netherlands",
    flag: "🇳🇱",
    city: "Rotterdam",
    minAge: 17, maxAge: 28,
    duration: "8 days",
    dates: "14–21 Feb 2027",
    funding: "100% funded · travel + food + stay",
    spots: 4,
    gradient: 6,
    tags: ["Digital", "Entrepreneurship", "Climate"],
    summary: "Build a real app for a social cause in a week. Beginner-friendly coding sprints, UX design and a hackathon finale.",
    perks: ["Mentors from tech NGOs", "Hackathon prizes", "Portfolio project to show off"]
  }
];
