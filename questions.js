// ============================================================
//  📜  QUESTION BANK
//  A new one appears automatically each day (same for everyone).
//  Add your own anytime — just follow the { q, tag } pattern.
//  Tags only control the little colored label + are for fun:
//    deep · funny · wyr (would you rather) · hot (hot take)
//    memory · hypo (hypothetical) · pick (this or that)
// ============================================================

const QUESTIONS = [
  // ---------- deep / philosophical ----------
  { q: "Would you rather be right or be kind, if you could only be one?", tag: "deep" },
  { q: "Is it possible to be a good person and never inconvenience yourself for others?", tag: "deep" },
  { q: "What's something you believe now that 14-year-old you would argue with?", tag: "deep" },
  { q: "Does a person have to be remembered to have mattered?", tag: "deep" },
  { q: "Is it better to be feared or loved? (Yes, we're quoting Machiavelli.)", tag: "deep" },
  { q: "What's a virtue that's secretly overrated?", tag: "deep" },
  { q: "If no one would ever find out, would you still do the right thing? Always?", tag: "deep" },
  { q: "What does it actually mean to 'know yourself'?", tag: "deep" },
  { q: "Is freedom the ability to do what you want, or the ability to want the right things?", tag: "deep" },
  { q: "What's worth suffering for?", tag: "deep" },
  { q: "Do you think people can truly change, or just get better at hiding?", tag: "deep" },
  { q: "Is a life of comfort a life well lived?", tag: "deep" },

  // ---------- would you rather ----------
  { q: "Would you rather always be 10 minutes late or always be 20 minutes early?", tag: "wyr" },
  { q: "Would you rather know how you die or when you die?", tag: "wyr" },
  { q: "Would you rather be able to talk to animals or speak every human language?", tag: "wyr" },
  { q: "Would you rather never use social media again or never watch another movie/show?", tag: "wyr" },
  { q: "Would you rather be famous for something dumb or unknown for something great?", tag: "wyr" },
  { q: "Would you rather relive your best day forever or never sleep again but feel rested?", tag: "wyr" },
  { q: "Would you rather have unlimited money or unlimited time?", tag: "wyr" },
  { q: "Would you rather always win arguments or always be trusted?", tag: "wyr" },

  // ---------- funny / absurd ----------
  { q: "You can only eat ONE food at 3am for the rest of your life. What is it?", tag: "funny" },
  { q: "If your life had a laugh track, what just happened this week to trigger it?", tag: "funny" },
  { q: "What's the most unhinged thing in your search history you're willing to admit?", tag: "funny" },
  { q: "You're a wrestler. What's your entrance song and your finishing move's name?", tag: "funny" },
  { q: "If animals could talk, which would be the rudest?", tag: "funny" },
  { q: "What fictional character would you absolutely lose a fight to?", tag: "funny" },
  { q: "You get one billboard on the highway. What does it say?", tag: "funny" },
  { q: "What's a weirdly specific thing that makes you irrationally happy?", tag: "funny" },
  { q: "If you had to fight 100 duck-sized horses or 1 horse-sized duck, which?", tag: "funny" },
  { q: "What's the pettiest hill you're willing to die on?", tag: "funny" },

  // ---------- hot takes ----------
  { q: "Give me a food opinion that would start a fight at the dinner table.", tag: "hot" },
  { q: "What's a popular movie or book you think is overrated?", tag: "hot" },
  { q: "What's a 'rule' everyone follows that actually makes no sense?", tag: "hot" },
  { q: "Pineapple on pizza: defend your position with your whole chest.", tag: "hot" },
  { q: "What's something everyone pretends to like but secretly doesn't?", tag: "hot" },
  { q: "What trend needs to end immediately?", tag: "hot" },
  { q: "Hot take: the best decade for music was ___. Go.", tag: "hot" },

  // ---------- memory / personal ----------
  { q: "What's a small moment from this past year you never want to forget?", tag: "memory" },
  { q: "Who's someone that changed the direction of your life, and how?", tag: "memory" },
  { q: "What's the best compliment you've ever gotten?", tag: "memory" },
  { q: "Describe a time you were braver than you felt.", tag: "memory" },
  { q: "What's a smell or song that instantly teleports you somewhere?", tag: "memory" },
  { q: "What's the best day you can remember, in as much detail as you can?", tag: "memory" },
  { q: "What did you love doing as a kid that you should probably do again?", tag: "memory" },

  // ---------- hypotheticals ----------
  { q: "You can have dinner with anyone, living or dead. Who, and what's the first question?", tag: "hypo" },
  { q: "You wake up tomorrow with one new skill mastered. What is it?", tag: "hypo" },
  { q: "You can send one sentence to your past self. What's the sentence and what age?", tag: "hypo" },
  { q: "If you had to teach a class on ANY topic tomorrow, what's it on?", tag: "hypo" },
  { q: "You're given a year off, fully paid, one condition: no screens. What do you do?", tag: "hypo" },
  { q: "You can instantly master an instrument. Which one, and what's the first song?", tag: "hypo" },
  { q: "A genie gives you three wishes but each one has to help someone else. Go.", tag: "hypo" },
  { q: "If you could live in any time period for one week, when?", tag: "hypo" },

  // ---------- this or that ----------
  { q: "Mountains or ocean — and why is your answer correct?", tag: "pick" },
  { q: "Early bird or night owl, and what does that say about you?", tag: "pick" },
  { q: "Books or movies, if you had to give one up forever?", tag: "pick" },
  { q: "Big city or small town for the rest of your life?", tag: "pick" },
  { q: "Plan everything or figure it out as you go?", tag: "pick" },
  { q: "Would you rather be the funniest or the smartest person in the room?", tag: "pick" },

  // ---------- for the Great Books crew 📚 ----------
  { q: "Which book we read hit you the hardest, and did it change your mind about anything?", tag: "deep" },
  { q: "Socrates says the unexamined life isn't worth living. Too dramatic, or dead right?", tag: "deep" },
  { q: "If you could add ONE book to the Great Books list, what would it be?", tag: "hot" },
  { q: "What's a question from a seminar you're STILL thinking about?", tag: "memory" },
  { q: "Plato or Aristotle — pick your fighter and say why.", tag: "pick" },
  { q: "What idea did you walk in doubting and walk out believing (or the reverse)?", tag: "deep" },
];
