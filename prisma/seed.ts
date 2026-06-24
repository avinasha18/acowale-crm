import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const categories = ["PRODUCT", "FEATURE_REQUEST", "UI_UX", "SUPPORT", "BILLING", "OTHER"] as const;
const statuses = ["NEW", "IN_PROGRESS", "RESOLVED", "CLOSED"] as const;

const names = [
  "Priya Sharma", "Rahul Menon", "Sarah Chen", "James Wilson",
  "Anika Patel", "Mohammed Ali", "Lisa Thompson", "David Kumar",
  "Emily Rodriguez", "Arjun Nair", "Maria Garcia", "Tom Anderson",
  "Sneha Reddy", "Alex Johnson", "Riya Gupta", "Chris Lee",
  "Kavita Iyer", "Daniel Brown", "Meera Joshi", "Robert Taylor",
];

const feedbackMessages: Record<string, string[]> = {
  PRODUCT: [
    "The dashboard is incredibly intuitive. Love how quickly I can access reports.",
    "Product performance has improved significantly after the last update.",
    "I wish the export feature supported more formats like CSV and PDF.",
    "The mobile app crashes occasionally when loading large datasets.",
    "Great product overall, the onboarding experience was seamless.",
    "The search functionality needs improvement, hard to find older entries.",
    "Real-time notifications are a game changer for our workflow.",
    "Would love to see a dark mode option for late night work sessions.",
  ],
  FEATURE_REQUEST: [
    "Can we get bulk import functionality? We have thousands of records to migrate.",
    "Would be great to have an API for third-party integrations.",
    "Please add calendar view for deadline tracking.",
    "Need ability to set custom roles and permissions for team members.",
    "Slack integration would save us hours of manual updates every week.",
    "Can you add recurring task templates? We repeat the same setup monthly.",
    "A kanban board view alongside the table view would be very helpful.",
    "Please consider adding multi-language support for our global team.",
  ],
  UI_UX: [
    "The navigation could be more intuitive, took me a while to find settings.",
    "Love the clean design, very modern and professional looking.",
    "Font size in data tables is too small on high-res displays.",
    "The color contrast in the sidebar needs work for accessibility.",
    "Drag and drop reordering would make organizing much easier.",
    "The loading skeleton animations are a nice touch, feels polished.",
    "Tooltip text is cut off on smaller screens, needs responsive fix.",
    "Great visual hierarchy in the dashboard, information is easy to scan.",
  ],
  SUPPORT: [
    "Response time from support team was excellent, resolved in under an hour.",
    "Had trouble resetting my password, the email link expired too quickly.",
    "Documentation is outdated, several API endpoints have changed.",
    "The chatbot is helpful for basic queries but needs better escalation path.",
    "Your support team helped me migrate our entire dataset without issues.",
    "Need better error messages when something fails, current ones are vague.",
    "FAQ section needs updating, most common issues aren't covered.",
    "Live chat support is fantastic, much better than the old ticket system.",
  ],
  BILLING: [
    "Invoice download is broken, getting 404 errors on the billing page.",
    "Would appreciate annual billing option with a discount.",
    "The pricing page is confusing, hard to compare plan features.",
    "Appreciated the smooth upgrade process, no downtime at all.",
    "Need the ability to add multiple payment methods for different teams.",
    "Tax calculation seems off for international customers.",
  ],
  OTHER: [
    "How do I delete my account? Can't find the option anywhere.",
    "Your blog content on productivity tips has been really helpful.",
    "The weekly digest email is useful but comes at an odd time.",
    "Impressed with how fast the platform has evolved in the past year.",
    "Community forum is a great addition, found answers from other users.",
    "Would love to attend more webinars about advanced features.",
  ],
};

function randomItem<T>(arr: readonly T[] | T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(daysBack: number): Date {
  const now = new Date();
  const past = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);
  return new Date(past.getTime() + Math.random() * (now.getTime() - past.getTime()));
}

function getSentiment(message: string): { label: string; score: number } {
  const positiveWords = ["love", "great", "excellent", "fantastic", "helpful", "intuitive", "impressive", "smooth", "game changer", "seamless", "polished"];
  const negativeWords = ["broken", "crashes", "confusing", "trouble", "hard to find", "outdated", "vague", "too small", "cut off", "odd", "off"];

  const lower = message.toLowerCase();
  const posCount = positiveWords.filter(w => lower.includes(w)).length;
  const negCount = negativeWords.filter(w => lower.includes(w)).length;

  if (posCount > negCount) return { label: "positive", score: Math.min(posCount * 0.2, 1) };
  if (negCount > posCount) return { label: "negative", score: -Math.min(negCount * 0.2, 1) };
  return { label: "neutral", score: 0 };
}

async function main() {
  console.log("Seeding database...");

  await prisma.feedback.deleteMany();
  await prisma.user.deleteMany();

  await prisma.user.create({
    data: {
      email: "admin@acowale.com",
      name: "Admin",
      password: "admin123",
      role: "ADMIN",
    },
  });

  const feedbackData = [];
  for (let i = 0; i < 60; i++) {
    const category = randomItem(categories);
    const messages = feedbackMessages[category];
    const message = randomItem(messages);
    const { label, score } = getSentiment(message);
    const statusWeights = [0.4, 0.2, 0.3, 0.1];
    const rand = Math.random();
    let statusIdx = 0;
    let cumulative = 0;
    for (let j = 0; j < statusWeights.length; j++) {
      cumulative += statusWeights[j];
      if (rand <= cumulative) { statusIdx = j; break; }
    }

    feedbackData.push({
      name: randomItem(names),
      email: Math.random() > 0.3 ? `${randomItem(names).toLowerCase().replace(" ", ".")}@example.com` : null,
      category,
      message,
      rating: Math.floor(Math.random() * 5) + 1,
      sentiment: label,
      sentimentScore: score,
      status: statuses[statusIdx],
      createdAt: randomDate(60),
    });
  }

  await prisma.feedback.createMany({ data: feedbackData });

  console.log(`Seeded ${feedbackData.length} feedback entries and 1 admin user`);
  console.log("Admin credentials: admin@acowale.com / admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
