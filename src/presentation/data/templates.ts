export type Category = 'all' | 'planners' | 'productivity' | 'health' | 'student';

export interface Template {
  id: string;
  title: string;
  description: string;
  category: Category[];
  categoryLabel: string;
  sub?: string;
  price: string;
  priceNum: number;
  badge?: string;
  gradient: string;
  image: string;
  /** Optional gallery for the detail page carousel + lightbox.
   *  When omitted/empty, the carousel falls back to a single-slide
   *  view of `image`. Mobile renders a scroll-snap row; desktop keeps
   *  the chevron-driven slideshow. */
  images?: string[];
  releaseDate: string;
  author: string;
  pagesIncluded: string[];
  /**
   * Optional grouped variant of `pagesIncluded`. When present, the
   * detail page renders a nested-accordion "Pages Included" section
   * (Planner / Productivity / Wellness / Lifestyle expanding into
   * their own page lists). When absent, falls back to the flat
   * `pagesIncluded` list. Migrate templates one at a time —
   * incremental rollout keeps untouched templates rendering as before.
   */
  pagesGrouped?: { section: string; pages: string[] }[];
  features: string[];
  overview: string;
  /**
   * Customer-facing Etsy listing URL. Format: `https://www.etsy.com/listing/{id}`
   * (slug optional — Etsy redirects). Source of truth for the mapping is
   * docs/TEMPLATES-ETSY-SYNC.md. If undefined, the "Buy on Etsy" button is
   * hidden on that template's page (no fallback to shop root).
   */
  etsyUrl?: string;
}

/* Single source of truth for matching a template to a Polar product:
 * the Etsy listing id parsed from `etsyUrl`. Polar products are named
 * `{etsyId} {title}` so the `polar-checkout` Edge Function resolves
 * Etsy id → Polar UUID at request time. */
export function getEtsyIdFromUrl(url: string | undefined): string | null {
  if (!url) return null;
  const match = url.match(/\/listing\/(\d+)/);
  return match?.[1] ?? null;
}

export function getTemplateEtsyId(template: Pick<Template, 'etsyUrl'>): string | null {
  return getEtsyIdFromUrl(template.etsyUrl);
}

/* Shared placeholder pagesGrouped — gives every template the same
 * accordion structure on /templates/:id until per-template content is
 * authored. Per "протяни как могут — скопируй" (c_2026-04-28).
 * Override on a specific template by passing `pagesGrouped: [...]`
 * with custom sections when ready. */
const DEFAULT_PAGES_GROUPED: { section: string; pages: string[] }[] = [
  {
    section: 'Planner',
    pages: ['Life Dashboard', 'Daily Planner', 'Weekly Planner', 'Monthly Calendar', 'Yearly Overview', 'Goal Setting', 'Vision Board', 'Habit Tracker'],
  },
  {
    section: 'Productivity',
    pages: ['Productivity Hub', 'Projects Database', 'Tasks Inbox', 'Notes Library', 'Resources Vault', 'Quick Capture'],
  },
  {
    section: 'Wellness',
    pages: ['Wellness Dashboard', 'Routine Tracker', 'Mood Journal', 'Workout Log', 'Meal Planner', 'Sleep Tracker', 'Self-Care Calendar', 'Reflection Pages', 'Gratitude Log', 'Manifestation Board'],
  },
  {
    section: 'Lifestyle',
    pages: ['Finances Overview', 'Travel Plans', 'Reading List', 'Watchlist'],
  },
];

/* Life-planner page tree — full 11-section breakdown sourced from the
 * Etsy listing "Inside the planner" copy. Reused across every life-
 * planner-style template (Ultimate, Coquette, Witchy, Matcha, Pink,
 * Cottagecore, Minimalist, etc). Each template keeps the same set of
 * pages because the underlying Notion system is identical — only the
 * theme/visuals change between SKUs. */
const LIFE_PAGES: { section: string; pages: string[] }[] = [
  { section: 'Planner', pages: ['Daily Planner', 'Weekly Planner', 'Monthly Planner', 'Yearly Planner', 'Tasks', 'Priorities', 'Schedules', 'Notes', 'Agenda', 'Contacts', 'Birthdays'] },
  { section: 'Wellness', pages: ['Habit Tracker', 'Morning Routine', 'Evening Routine', 'Skincare Tracker', 'Sleep Tracker', 'Meditation', 'Medication'] },
  { section: 'Goals', pages: ['Dream Life Vision', 'Goals Tracker', 'Life Areas', 'Inspiration Board', 'Milestones'] },
  { section: 'Work', pages: ['Work Schedule', 'Projects', 'Tasks', 'Timesheet', 'Applications', 'Pomodoro Timer'] },
  { section: 'Student', pages: ['Courses', 'Notes', 'Study Schedule', 'Assignments', 'Exams', 'Grade Calculator', 'Pomodoro'] },
  { section: 'Household', pages: ['Home Areas', 'Inventory', 'Cleaning Manager', 'Supply Stock', 'Daily Cleaning Habits'] },
  { section: 'Workout', pages: ['Workout Goals', 'Workout Planner', 'Workout Gallery', 'Body Progress', 'Running Tracker', 'Workout Videos', 'Challenges'] },
  { section: 'Meals', pages: ['Meal Planner', 'Recipes Gallery', 'Grocery List', 'Kitchen Inventory'] },
  { section: 'Finance', pages: ['Balance Tracker', 'Income Tracker', 'Expense Tracker', 'Bill Tracker', 'Savings Tracker', 'Debt Tracker', 'Reports', 'Subscriptions', 'Wishlist'] },
  { section: 'Travel', pages: ['Travel Planner', 'Bucket List', 'Visited Places', 'Packing List', 'Flight Tracker', 'Bookings Tracker', 'Travel Budget'] },
  { section: 'Life & Leisure', pages: ['Daily Journal', 'Gratitude Journal', 'Reading Journal', 'Book Tracker', 'Personal Library', 'Quotes Collection', 'Movie Tracker', 'Review Pages'] },
];

/* Academic / Student page tree — sourced from the Dark Academia /
 * Light Academia / University / ADHD student listings, all of which
 * share the same Notion structure. */
const STUDENT_PAGES: { section: string; pages: string[] }[] = [
  { section: 'Courses', pages: ['Syllabus', 'Progress Tracker', 'Course Description', 'Learning Objectives', 'Resources & Materials', 'Tasks', 'Assignments', 'Exams', 'Lecture Notes', 'Files', 'Reading Materials', 'Grade Calculator'] },
  { section: 'Academic Tasks', pages: ["Today's Tasks", 'Upcoming (Tomorrow)', 'Upcoming (This Week)', 'Upcoming (This Month)', 'Tasks Calendar', 'Overdue Reminder', 'Completed Board', 'Notification Center'] },
  { section: 'Schedule', pages: ["Today's Schedule", 'Weekly Schedule', 'Class Locations', 'Class Times', 'Notification Center'] },
  { section: 'Notes', pages: ['Recent Notes', 'All Notes', 'Lecture Templates', 'File Templates', 'Notification Center'] },
  { section: 'Assignments', pages: ['Assignment Tracker', 'Upcoming Assignments', 'Assignment Prep Space', 'Notification Center'] },
  { section: 'Exams', pages: ['Exam Tracker', 'Upcoming Exams', 'Exam Prep Space', 'Notification Center'] },
  { section: 'Reading', pages: ['Currently Reading', 'Reading Summaries', 'Key Quotes & Authors', 'Library (Books, Essays, Research)', 'Reading by Courses'] },
  { section: 'Grades', pages: ['Assignment Grade Calculator', 'Exam Grade Calculator', 'Grades Overview', 'Course Grades', 'Total Points', 'Average Score'] },
  { section: 'Extras', pages: ['Job Application Tracker', 'Pomodoro Study Timer'] },
];

/* Wellness page tree — sourced from the Ultimate Wellness / Glow Up
 * listings. Less productivity-heavy than LIFE_PAGES, more focused on
 * routines, self-care, and mindset. */
const WELLNESS_PAGES: { section: string; pages: string[] }[] = [
  { section: 'Wellness', pages: ['Wellness Dashboard', 'Habit Tracker', 'Mood Journal', 'Energy Tracker', 'Sleep Tracker', 'Hydration Log', 'Cycle Tracker'] },
  { section: 'Self-Care', pages: ['Morning Routine', 'Evening Routine', 'Skincare Tracker', 'Meditation Log', 'Self-Care Calendar', 'Reflection Pages', 'Mindfulness'] },
  { section: 'Movement', pages: ['Workout Goals', 'Workout Planner', 'Workout Gallery', 'Body Progress', 'Running Tracker', 'Workout Videos', 'Challenges'] },
  { section: 'Nutrition', pages: ['Meal Planner', 'Recipes Gallery', 'Grocery List', 'Hydration', 'Wellness Notes'] },
  { section: 'Mindset & Goals', pages: ['Vision Board', 'Manifestation', 'Gratitude Journal', 'Daily Reflections', 'Affirmations', 'Glow-Up Goals'] },
];

export const TEMPLATES: Template[] = [
  {
    id: '1736107034',
    title: 'Ultimate Life Planner',
    description: 'Plan your days, build routines, track goals, and manage life — all in one connected Notion dashboard.',
    category: ['planners', 'productivity'],
    categoryLabel: 'Notion',
    price: '$9.00',
    priceNum: 9.00,
    badge: 'Best seller',
    gradient: 'linear-gradient(135deg, #F0EAFF 0%, #E8F0FF 100%)',
    image: '/template-cherry-planner.png',
    etsyUrl: 'https://www.etsy.com/listing/1736107034',
    releaseDate: 'Nov 20, 2025',
    author: 'Peachy Studio',
    pagesIncluded: [
      'Life Dashboard', 'Daily Planner', 'Weekly Planner', 'Monthly Calendar',
      'Yearly Overview', 'Habit Tracker', 'Goals & Vision', 'Workout Planner',
      'Meal Planner', 'Finance Tracker', 'Travel Planner', 'Reading Journal',
    ],
    pagesGrouped: LIFE_PAGES,
    features: [
      'Every habit, goal, and dollar in one workspace.',
      'Replace five apps with one calm dashboard.',
      'Designed to feel light, not loaded.',
      'Video walkthroughs for every section.',
      'Phone and tablet layouts, ready out of the box.',
      'One payment. Forever yours. No subscription.',
    ],
    overview: "A complete life planner built in Notion to bring routines, goals, finances, and everyday plans into one calm workspace. No scattered notes, no app switching, no planning chaos. Just one elegant dashboard where your life lives. Whether you're a student, creator, or simply building a more intentional lifestyle, the planner helps you stay focused, clear, and consistent. Step-by-step video walkthroughs and customization guides make setup feel effortless.",
  },
  {
    id: '1755349936',
    title: 'Ultimate Wellness Planner',
    description: 'A soft wellness dashboard for routines, self-care, and gentle daily progress in Notion.',
    category: ['health', 'planners'],
    categoryLabel: 'Notion',
    price: '$8.00',
    priceNum: 8.00,
    badge: 'Popular',
    gradient: 'linear-gradient(135deg, #F5EDE6 0%, #F0E8F5 100%)',
    image: '/template-wellness.png',
    etsyUrl: 'https://www.etsy.com/listing/1755349936',
    releaseDate: 'Feb 20, 2026',
    author: 'Peachy Studio',
    pagesIncluded: [
      'Wellness Dashboard', 'Habit Tracker', 'Mood Journal', 'Sleep Tracker',
      'Workout Planner', 'Meditation Log', 'Skincare Tracker', 'Meal Planner',
      'Vision Board', 'Gratitude Journal', 'Self-Care Calendar', 'Routine Tracker',
    ],
    pagesGrouped: WELLNESS_PAGES,
    features: [
      'A soft space for your wellbeing and routines.',
      'Sleep, mood, skincare, and meditation tracked together.',
      'Vision boards and gentle goal-setting built in.',
      'Workouts, nutrition, and self-care all connected.',
      'Designed to feel calm, never overwhelming.',
      'One payment. Yours forever. No subscription.',
    ],
    overview: 'A wellness planner built to support your mind, body, and daily routines without pressure. Soft visuals meet a thoughtful system that helps you build habits at your own pace. Less productivity push, more gentle progress and calm rituals. Includes guided reflections, vision boards, and trackers that grow with you over the year.',
  },
  {
    id: '1825825830',
    title: 'Green Life Planner',
    description: 'A nature-inspired minimalist planner with soft green tones, floral accents, and clean layouts for peaceful planning.',
    category: ['planners', 'health'],
    categoryLabel: 'Notion',
    price: '$9.00',
    priceNum: 9.00,
    badge: undefined,
    gradient: 'linear-gradient(135deg, #EAF2E6 0%, #E6F0EE 100%)',
    image: '/template-green-life.png',
    etsyUrl: 'https://www.etsy.com/listing/1825825830',
    releaseDate: 'Mar 20, 2026',
    author: 'Peachy Studio',
    pagesIncluded: [
      'Life Dashboard', 'Daily Planner', 'Weekly Planner', 'Monthly Planner',
      'Yearly Overview', 'Habit Tracker', 'Goals & Vision', 'Workout Planner',
      'Meal Planner', 'Finance Tracker', 'Travel Planner', 'Reading Journal',
    ],
    pagesGrouped: LIFE_PAGES,
    features: [
      'Matcha-soft aesthetic, calm and grounded.',
      'Daily, weekly, monthly views all connected.',
      'Routines, habits, and goals tracked in one place.',
      'Clean-girl wellness rhythm built in.',
      'Phone and tablet layouts ready out of the box.',
      'One payment. Yours forever. No subscription.',
    ],
    overview: 'A life planner built around matcha aesthetics, soft neutral tones, and calm everyday rhythm. Beautiful visuals meet a practical structure that helps you plan days, manage routines, track goals, and build habits. No scattered notes, no app switching, no chaos. One elegant Notion dashboard for an intentional, grounded life.',
  },
  {
    id: '1783878805',
    title: 'Student Planner Light',
    description: 'A clean, ADHD-friendly student planner that cuts visual noise and keeps studies focused.',
    category: ['student'],
    categoryLabel: 'Notion',
    price: '$8.00',
    priceNum: 8.00,
    badge: undefined,
    gradient: 'linear-gradient(135deg, #F0EEF5 0%, #EEF2F5 100%)',
    image: '/template-student-light.png',
    etsyUrl: 'https://www.etsy.com/listing/1783878805',
    releaseDate: 'Mar 1, 2026',
    author: 'Peachy Studio',
    pagesIncluded: [
      'Academic Dashboard', 'Courses', 'Class Notes', 'Study Schedule',
      'Assignments', 'Exams', 'Grade Calculator', 'Reading Library',
      'Tasks Calendar', 'Notification Center', 'Pomodoro Timer', 'Job Tracker',
    ],
    pagesGrouped: STUDENT_PAGES,
    features: [
      'ADHD-friendly. Quiet structure, less decision fatigue.',
      'Courses, assignments, and exams in one workspace.',
      'Light and dark modes for any study mood.',
      'Quick capture for thoughts, tasks, and notes.',
      'Notification center catches deadlines before they slip.',
      'Phone and tablet ready, study from anywhere.',
    ],
    overview: 'An ADHD-friendly academic planner designed to reduce decision fatigue and quiet the mental noise. Clean, minimal, and built for focused study without distraction. Manage courses, assignments, exams, and notes in one connected workspace. Available in light and dark modes so you can choose the mood that works.',
  },
  {
    id: '1737912942',
    title: 'Mystic Life Planner',
    description: 'A witchy, celestial life planner with mystical visuals and a structured Notion system.',
    category: ['planners'],
    categoryLabel: 'Notion',
    price: '$10.00',
    priceNum: 10.00,
    badge: 'New',
    gradient: 'linear-gradient(135deg, #EDE8F5 0%, #E8ECF5 100%)',
    image: '/template-mystic.png',
    etsyUrl: 'https://www.etsy.com/listing/1737912942',
    releaseDate: 'Dec 10, 2025',
    author: 'Peachy Studio',
    pagesIncluded: [
      'Life Dashboard', 'Daily Planner', 'Weekly Planner', 'Monthly Planner',
      'Yearly Overview', 'Habit Tracker', 'Goals & Vision', 'Workout Planner',
      'Meal Planner', 'Finance Tracker', 'Travel Planner', 'Reading Journal',
    ],
    pagesGrouped: LIFE_PAGES,
    features: [
      'Witchy, celestial aesthetic with a structured core.',
      'Routines, goals, and habits in one connected space.',
      'Moon-phase rhythm guides your weekly cadence.',
      'Daily, weekly, monthly, and yearly planners built in.',
      'Phone and tablet dashboards ready to use.',
      'One payment. Yours forever. No subscription.',
    ],
    overview: 'A life planner inspired by witchy aesthetics, moon phases, celestial symbols, and dark academia atmosphere. Mystical visuals meet a structured planning system, so you can plan your days, manage tasks, build habits, and organize life in a calm, intentional way. No scattered notes, no app switching. One magical Notion dashboard for routines, plans, and rituals.',
  },
  {
    id: '1773207250',
    title: 'Light Academia Planner',
    description: 'A sunlit-library academic dashboard for courses, study tasks, and focused work.',
    category: ['student', 'planners'],
    categoryLabel: 'Notion',
    price: '$8.00',
    priceNum: 8.00,
    badge: undefined,
    gradient: 'linear-gradient(135deg, #F2EDE6 0%, #EEE8F0 100%)',
    image: '/template-academia-light.png',
    etsyUrl: 'https://www.etsy.com/listing/1773207250',
    releaseDate: 'Feb 1, 2026',
    author: 'Peachy Studio',
    pagesIncluded: [
      'Academic Dashboard', 'Courses', 'Class Notes', 'Study Schedule',
      'Assignments', 'Exams', 'Grade Calculator', 'Reading Library',
      'Tasks Calendar', 'Notification Center', 'Pomodoro Timer', 'Job Tracker',
    ],
    pagesGrouped: STUDENT_PAGES,
    features: [
      'Sunlit-library mood, soft and classic.',
      'Every course, exam, and assignment in one workspace.',
      'Quick-action shortcuts on phone and tablet.',
      'Google Calendar sync keeps deadlines visible.',
      'Life planner built in, so studies stay balanced.',
      'Notification center catches deadlines before they slip.',
    ],
    overview: 'An academic planner inspired by light academia, sunlit libraries, classic literature, and peaceful study spaces. Timeless visuals meet a practical system for organizing courses, assignments, exams, notes, and study tasks. A built-in life planner balances studies with everyday routines. Trusted by 1,000+ students who use it to stay clear and consistent.',
  },
  {
    id: '1775842529',
    title: 'Glow Up Planner',
    description: 'A glow-up companion for routines, self-care, and intentional daily improvements.',
    category: ['health', 'planners'],
    categoryLabel: 'Notion',
    price: '$8.00',
    priceNum: 8.00,
    badge: 'Popular',
    gradient: 'linear-gradient(135deg, #F5E8F0 0%, #F0E6F5 100%)',
    image: '/template-glowup.png',
    etsyUrl: 'https://www.etsy.com/listing/1775842529',
    releaseDate: 'Mar 15, 2026',
    author: 'Peachy Studio',
    pagesIncluded: [
      'Glow Up Dashboard', 'Habit Tracker', 'Skincare Tracker', 'Sleep Tracker',
      'Workout Planner', 'Vision Board', 'Self-Care Calendar', 'Meal Planner',
      'Gratitude Journal', 'Mood Journal', 'Affirmations', 'Glow-Up Goals',
    ],
    pagesGrouped: WELLNESS_PAGES,
    features: [
      'A glow-up companion for everyday routines.',
      'Skincare, workouts, sleep, and habits in one place.',
      'Vision boards and self-improvement goals built in.',
      'Wellness, fitness, and mindset all connected.',
      'Designed to feel light and intentional.',
      'One payment. Yours forever. No subscription.',
    ],
    overview: 'A planner built to support gradual self-improvement, daily glow-up rituals, and balanced routines. Soft wellness aesthetics meet a thoughtful system that helps you build habits, track progress, and feel more confident over time. Less productivity push, more gentle progress. A personal companion for the version of you you\'re becoming.',
  },
  {
    id: '1827799444',
    title: 'Olive Life Planner',
    description: 'A minimalist life planner in soft earth tones, calm and focused for daily living.',
    category: ['planners', 'productivity'],
    categoryLabel: 'Notion',
    price: '$9.00',
    priceNum: 9.00,
    badge: undefined,
    gradient: 'linear-gradient(135deg, #EDF0E8 0%, #E8EEE6 100%)',
    image: '/template-life-olive.png',
    etsyUrl: 'https://www.etsy.com/listing/1827799444',
    releaseDate: 'Feb 28, 2026',
    author: 'Peachy Studio',
    pagesIncluded: [
      'Life Dashboard', 'Daily Planner', 'Weekly Planner', 'Monthly Planner',
      'Yearly Overview', 'Habit Tracker', 'Goals & Vision', 'Workout Planner',
      'Meal Planner', 'Finance Tracker', 'Travel Planner', 'Reading Journal',
    ],
    pagesGrouped: LIFE_PAGES,
    features: [
      'Soft olive aesthetic for slow, intentional living.',
      'Daily, weekly, monthly views all connected.',
      'Routines, goals, and habits in one place.',
      'Work and study modes built in.',
      'Phone and tablet ready, plan from anywhere.',
      'One payment. Yours forever. No subscription.',
    ],
    overview: 'A clean all-in-one Notion system in soft olive and earth-tone aesthetics. Inspired by minimalist design, slow living, and mindful productivity. Plan your days, track habits, manage goals, organize work and studies, and create space for what truly matters. No scattered notes, no app switching, no planning chaos.',
  },
  {
    id: '1837862393',
    title: 'Cherub Planner',
    description: 'A coquette-romantic life planner where vintage visuals meet practical planning.',
    category: ['planners'],
    categoryLabel: 'Notion',
    price: '$9.00',
    priceNum: 9.00,
    badge: 'New',
    gradient: 'linear-gradient(135deg, #F0EAF5 0%, #E8E6F2 100%)',
    image: '/template-cherub.png',
    etsyUrl: 'https://www.etsy.com/listing/1837862393',
    releaseDate: 'Apr 1, 2026',
    author: 'Peachy Studio',
    pagesIncluded: [
      'Life Dashboard', 'Daily Planner', 'Weekly Planner', 'Monthly Planner',
      'Yearly Overview', 'Habit Tracker', 'Goals & Vision', 'Workout Planner',
      'Meal Planner', 'Finance Tracker', 'Travel Planner', 'Reading Journal',
    ],
    pagesGrouped: LIFE_PAGES,
    features: [
      'Coquette-vintage aesthetic, romantic and clean.',
      'Daily, weekly, monthly planners all connected.',
      'Habits, goals, and routines in one workspace.',
      'Wellness, work, and study modes built in.',
      'Phone and tablet layouts ready to use.',
      'One payment. Yours forever. No subscription.',
    ],
    overview: 'A premium life planner with a coquette vintage aesthetic, romantic visuals, and a practical clean structure. Plan your days, manage tasks, track goals, stay consistent, and feel less overwhelmed. Trusted by thousands who use it to organize routines and life in one elegant dashboard. Soft, feminine, modern.',
  },
  {
    id: '1824384930',
    title: 'Minimalist Green Planner',
    description: 'A minimalist green life planner for calm, focused daily planning in Notion.',
    category: ['planners', 'health'],
    categoryLabel: 'Notion',
    price: '$9.00',
    priceNum: 9.00,
    badge: undefined,
    gradient: 'linear-gradient(135deg, #E8F2E6 0%, #E6EFF0 100%)',
    image: '/template-minimalist-green.png',
    etsyUrl: 'https://www.etsy.com/listing/1824384930',
    releaseDate: 'Jan 28, 2026',
    author: 'Peachy Studio',
    pagesIncluded: [
      'Life Dashboard', 'Daily Planner', 'Weekly Planner', 'Monthly Planner',
      'Yearly Overview', 'Habit Tracker', 'Goals & Vision', 'Workout Planner',
      'Meal Planner', 'Finance Tracker', 'Travel Planner', 'Reading Journal',
    ],
    pagesGrouped: LIFE_PAGES,
    features: [
      'Minimalist green aesthetic, calm and focused.',
      'Daily, weekly, monthly views all connected.',
      'Habits, routines, and goals in one place.',
      'Work, study, and wellness modes included.',
      'Phone and tablet layouts ready to use.',
      'One payment. Yours forever. No subscription.',
    ],
    overview: 'A minimalist Notion system in soft green tones, designed for slow living and mindful productivity. Plan your days, track habits, manage goals, and organize work or studies in a peaceful workspace. Built around clean visuals and a powerful organization core. Less noise, more focus.',
  },
  {
    id: '1787041091',
    title: 'Dark Academia Student',
    description: 'A dark-academia student planner for focused study, late-night sessions, and academic life.',
    category: ['student'],
    categoryLabel: 'Notion',
    price: '$8.00',
    priceNum: 8.00,
    badge: 'Popular',
    gradient: 'linear-gradient(135deg, #EDE8E6 0%, #E8E6ED 100%)',
    image: '/template-dark-academia.png',
    etsyUrl: 'https://www.etsy.com/listing/1787041091',
    releaseDate: 'Jan 25, 2026',
    author: 'Peachy Studio',
    pagesIncluded: [
      'Academic Dashboard', 'Courses', 'Class Notes', 'Study Schedule',
      'Assignments', 'Exams', 'Grade Calculator', 'Reading Library',
      'Tasks Calendar', 'Notification Center', 'Pomodoro Timer', 'Job Tracker',
    ],
    pagesGrouped: STUDENT_PAGES,
    features: [
      'Dark-academia mood for focused late-night study.',
      'Courses, assignments, and exams in one workspace.',
      'Quick-action shortcuts on phone and tablet.',
      'Google Calendar sync keeps deadlines visible.',
      'Reading library and study notes organized together.',
      'Notification center catches deadlines before they slip.',
    ],
    overview: 'A student-focused academic system inspired by classic libraries and dark academia atmospheres. Built for late-night study sessions and serious semesters — track courses, assignments, exams, and study tasks in one moody, focused workspace. Quick-action shortcuts on phone and tablet keep deadlines visible. Trusted by 1,000+ students.',
  },
  {
    id: '1785090897',
    title: 'University Planner',
    description: 'A clean university planner for distraction-free study across the semester.',
    category: ['student'],
    categoryLabel: 'Notion',
    price: '$8.00',
    priceNum: 8.00,
    badge: undefined,
    gradient: 'linear-gradient(135deg, #E8EAF0 0%, #E6E8F0 100%)',
    image: '/template-university-dark.png',
    etsyUrl: 'https://www.etsy.com/listing/1785090897',
    releaseDate: 'Feb 10, 2026',
    author: 'Peachy Studio',
    pagesIncluded: [
      'Academic Dashboard', 'Courses', 'Class Notes', 'Study Schedule',
      'Assignments', 'Exams', 'Grade Calculator', 'Reading Library',
      'Tasks Calendar', 'Notification Center', 'Pomodoro Timer', 'Job Tracker',
    ],
    pagesGrouped: STUDENT_PAGES,
    features: [
      'Clean, distraction-free university dashboard.',
      'ADHD-friendly low-noise structure.',
      'Light and dark modes for any study mood.',
      'Courses, assignments, and exams together.',
      'Quick capture for thoughts, tasks, and notes.',
      'One payment. Yours forever. No subscription.',
    ],
    overview: 'A minimal Notion student planner designed for university life, with an ADHD-friendly structure that removes visual clutter. Available in light and dark modes. Manage coursework, assignments, exams, and academic progress in one connected workspace. Plan faster, focus deeper, and run a smoother semester.',
  },
];

export const CATEGORIES: { key: Category; label: string; title: string; subtitle: string; subs: { key: string; label: string }[] }[] = [
  /* `label` = filter chip copy (short, one-word topic nouns).
   * `title` = page H1 (longer, marketing). Same source, two surfaces. */
  { key: 'all', label: 'All', title: 'Templates', subtitle: 'Notion templates, planners, trackers & more', subs: [] },
  { key: 'planners', label: 'Life Planners', title: 'Life Planners', subtitle: 'Weekly, monthly and custom planners', subs: [] },
  { key: 'productivity', label: 'Productivity', title: 'Productivity Systems', subtitle: 'OKRs, roadmaps and goal setting', subs: [] },
  { key: 'health', label: 'Wellness', title: 'Health & Wellness', subtitle: 'Meal planning, fitness and wellness', subs: [] },
  { key: 'student', label: 'Study', title: 'Student Planner', subtitle: 'Academic planners and study tools', subs: [] },
];

export const FAQ_ITEMS = [
  { q: 'What is included in the template?', a: 'Each template includes all listed pages, pre-built layouts, and customizable components. You get instant access to the full template after purchase.' },
  { q: 'Can I use it for commercial projects?', a: 'Yes! All templates come with a commercial license. You can use them for personal and commercial projects without any restrictions.' },
  { q: 'Do I get free updates?', a: 'Absolutely. All future updates to the template are included for free. Once you purchase, you get lifetime access to all improvements.' },
];
