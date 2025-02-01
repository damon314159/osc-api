import { hashPassword } from "../utils/auth.js";
import { users, collections, courses } from "./schema.js";
import { db } from "./index.js";

async function seed() {
  // Create admin user to demonstrate role based access control
  await db.insert(users).values([
    {
      username: "admin",
      password: await hashPassword("admin123"),
      role: "ADMIN",
    },
    {
      username: "user",
      password: await hashPassword("user123"),
    },
  ]);

  // Create some collections
  const [webDev, business, dataSci, marketing] = await db
    .insert(collections)
    .values([
      {
        name: "Web Development",
        description: "Learn modern web development technologies",
      },
      {
        name: "Business Studies",
        description: "Essential business management skills",
      },
      {
        name: "Data Science",
        description: "Learn the fundamentals of data science",
      },
      {
        name: "Marketing",
        description: "Develop essential marketing skills",
      },
    ])
    .returning();

  // Create some courses
  await db.insert(courses).values([
    {
      title: "JavaScript Fundamentals",
      description: "Learn the basics of JavaScript programming",
      duration: 12,
      outcome: "Ability to build interactive web applications",
      collectionId: webDev.id,
    },
    {
      title: "React.js Advanced Techniques",
      description:
        "Master modern React development with advanced patterns and hooks",
      duration: 16,
      outcome: "Build complex, scalable web applications with React",
      collectionId: webDev.id,
    },
    {
      title: "Node.js Backend Development",
      description: "Learn server-side JavaScript with Node.js and Graphql",
      duration: 14,
      outcome: "Create robust backend services and APIs",
      collectionId: webDev.id,
    },
    {
      title: "Web Design and UX Fundamentals",
      description: "Learn principles of user experience and modern web design",
      duration: 10,
      outcome: "Design intuitive and visually appealing web interfaces",
      collectionId: webDev.id,
    },
    {
      title: "Project Management Essentials",
      description: "Master the basics of project management",
      duration: 8,
      outcome: "Ability to manage small to medium-sized projects",
      collectionId: business.id,
    },
    {
      title: "Strategic Business Leadership",
      description: "Develop advanced leadership and strategic thinking skills",
      duration: 12,
      outcome: "Lead teams and make strategic business decisions",
      collectionId: business.id,
    },
    {
      title: "Entrepreneurship and Startup Strategies",
      description: "Learn how to launch and grow a successful startup",
      duration: 10,
      outcome: "Develop a comprehensive business plan and startup strategy",
      collectionId: business.id,
    },
    {
      title: "Financial Management for Managers",
      description:
        "Understand financial principles for effective business management",
      duration: 9,
      outcome: "Make informed financial decisions in a business context",
      collectionId: business.id,
    },
    {
      title: "Introduction to Python",
      description: "Learn the basics of the Python programming language",
      duration: 10,
      outcome: "Ability to write simple Python programs",
      collectionId: dataSci.id,
    },
    {
      title: "Machine Learning with Scikit-Learn",
      description: "Learn practical machine learning techniques using Python",
      duration: 15,
      outcome: "Build and deploy machine learning models",
      collectionId: dataSci.id,
    },
    {
      title: "Big Data Analytics with Apache Spark",
      description: "Process and analyze large-scale data using Apache Spark",
      duration: 16,
      outcome: "Handle and derive insights from big data",
      collectionId: dataSci.id,
    },
    {
      title: "Statistical Analysis in R",
      description: "Advanced statistical techniques using R programming",
      duration: 12,
      outcome: "Perform complex statistical analysis and data interpretation",
      collectionId: dataSci.id,
    },
    {
      title: "Digital Marketing Strategies",
      description: "Explore effective digital marketing techniques",
      duration: 12,
      outcome: "Ability to develop and implement digital marketing campaigns",
      collectionId: marketing.id,
    },
    {
      title: "Social Media Marketing Mastery",
      description:
        "Advanced strategies for marketing on social media platforms",
      duration: 10,
      outcome:
        "Create and execute comprehensive social media marketing campaigns",
      collectionId: marketing.id,
    },
    {
      title: "SEO and Search Marketing",
      description: "Learn advanced search engine optimization techniques",
      duration: 12,
      outcome: "Improve website visibility and organic search rankings",
      collectionId: marketing.id,
    },
    {
      title: "Email Marketing and Automation",
      description:
        "Design effective email marketing campaigns and automation workflows",
      duration: 8,
      outcome: "Create targeted and personalized email marketing strategies",
      collectionId: marketing.id,
    },
  ]);
}

// Apply seeding to the database safely
await seed()
  // eslint-disable-next-line no-console
  .catch(console.error)
  .finally(() => process.exit());
