const mongoose = require("mongoose");
const User = require("../models/User");
const Job = require("../models/Job");
require("dotenv").config();

const sampleUsers = [
  {
    name: "John Smith",
    email: "john@techcorp.com",
    password: "password123",
  },
  {
    name: "Sarah Johnson",
    email: "sarah@designstudio.com",
    password: "password123",
  },
  {
    name: "Mike Chen",
    email: "mike@dataflow.com",
    password: "password123",
  },
  {
    name: "Emily Davis",
    email: "emily@innovatetech.com",
    password: "password123",
  },
  {
    name: "David Wilson",
    email: "david@cloudscale.com",
    password: "password123",
  },
];

const sampleJobs = [
  {
    title: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    type: "full-time",
    salary: "$120,000 - $150,000",
    description:
      "We're looking for a talented frontend developer to join our growing team. You'll be responsible for building and maintaining our web applications using modern technologies like React, TypeScript, and Next.js. You'll work closely with our design and backend teams to create seamless user experiences.",
    requirements: "React, TypeScript, Next.js, Redux, CSS, Responsive Design",
    contactEmail: "hr@techcorp.com",
  },
  {
    title: "UX/UI Designer",
    company: "Design Studio",
    location: "New York, NY",
    type: "full-time",
    salary: "$90,000 - $120,000",
    description:
      "Join our creative team to design amazing user experiences. You'll work closely with product managers and developers to create intuitive and beautiful interfaces. You'll be involved in the entire design process from research to final implementation.",
    requirements:
      "Figma, Adobe Creative Suite, User Research, Design Systems, Accessibility",
    contactEmail: "careers@designstudio.com",
  },
  {
    title: "Backend Engineer",
    company: "DataFlow Systems",
    location: "Austin, TX",
    type: "full-time",
    salary: "$110,000 - $140,000",
    description:
      "Build scalable backend systems for our data platform. You'll work with Node.js, Python, and cloud technologies to create robust APIs and services. You'll be responsible for designing and implementing microservices architecture.",
    requirements:
      "Node.js, Python, PostgreSQL, AWS, Docker, Kubernetes, Microservices",
    contactEmail: "jobs@dataflow.com",
  },
  {
    title: "Product Manager",
    company: "InnovateTech",
    location: "Seattle, WA",
    type: "full-time",
    salary: "$130,000 - $160,000",
    description:
      "Lead product strategy and development for our SaaS platform. You'll work with cross-functional teams to define product vision and execute on roadmap. You'll be responsible for gathering requirements, prioritizing features, and ensuring successful product launches.",
    requirements:
      "Product Management, Agile, User Research, Data Analysis, Leadership",
    contactEmail: "talent@innovatetech.com",
  },
  {
    title: "DevOps Engineer",
    company: "CloudScale",
    location: "Remote",
    type: "full-time",
    salary: "$100,000 - $130,000",
    description:
      "Manage our cloud infrastructure and deployment pipelines. You'll work with Docker, Kubernetes, and AWS to ensure our systems are scalable and reliable. You'll be responsible for implementing CI/CD processes and monitoring solutions.",
    requirements: "Docker, Kubernetes, AWS, CI/CD, Monitoring, Security",
    contactEmail: "careers@cloudscale.com",
  },
  {
    title: "Data Scientist",
    company: "Analytics Pro",
    location: "Boston, MA",
    type: "full-time",
    salary: "$95,000 - $125,000",
    description:
      "Analyze complex data sets and build predictive models. You'll work with large datasets to extract insights and develop machine learning models. You'll collaborate with business teams to translate data insights into actionable recommendations.",
    requirements:
      "Python, Machine Learning, SQL, Statistics, Data Visualization",
    contactEmail: "jobs@analyticspro.com",
  },
  {
    title: "Mobile App Developer",
    company: "AppWorks",
    location: "Los Angeles, CA",
    type: "contract",
    salary: "$80,000 - $110,000",
    description:
      "Develop mobile applications for iOS and Android platforms. You'll work with React Native or native development to create high-performance mobile apps. You'll collaborate with designers and backend teams to deliver exceptional user experiences.",
    requirements: "React Native, Swift, Kotlin, Mobile Testing, UI/UX",
    contactEmail: "dev@appworks.com",
  },
  {
    title: "QA Engineer",
    company: "QualityFirst",
    location: "Chicago, IL",
    type: "full-time",
    salary: "$70,000 - $90,000",
    description:
      "Ensure the quality of our software products through comprehensive testing. You'll develop and execute test plans, automate testing processes, and work with development teams to identify and resolve issues.",
    requirements:
      "Testing Methodologies, Test Automation, Quality Assurance, Analytical Skills",
    contactEmail: "qa@qualityfirst.com",
  },
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/job-board",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("Connected to MongoDB");

    // Clear existing data
    await User.deleteMany({});
    await Job.deleteMany({});
    console.log("Cleared existing data");

    // Create users
    const createdUsers = [];
    for (const userData of sampleUsers) {
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
      console.log(`Created user: ${user.name}`);
    }

    // Create jobs
    for (let i = 0; i < sampleJobs.length; i++) {
      const jobData = sampleJobs[i];
      const postedBy = createdUsers[i % createdUsers.length]._id;

      const job = new Job({
        ...jobData,
        postedBy,
      });

      // Add some sample applications for the first few jobs
      if (i < 3) {
        job.applicants = [
          {
            fullName: "John Smith",
            email: "john.smith@email.com",
            phone: "+1-555-0123",
            coverLetter:
              "I'm excited to apply for this position. I have 6 years of experience with React and TypeScript, and I'm passionate about creating great user experiences.",
            resume: "john-smith-resume.pdf",
            appliedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          },
          {
            fullName: "Sarah Johnson",
            email: "sarah.johnson@email.com",
            phone: "+1-555-0456",
            coverLetter:
              "I'm a backend engineer with 5 years of experience building scalable systems. I'm particularly interested in your data platform and would love to contribute to its growth.",
            resume: "sarah-johnson-resume.pdf",
            appliedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          },
        ];
      }

      await job.save();
      console.log(
        `Created job: ${job.title} with ${job.applicants.length} applicants`
      );
    }

    console.log("Database seeded successfully!");
    console.log(
      `Created ${createdUsers.length} users and ${sampleJobs.length} jobs`
    );

    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

// Run seeder if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
