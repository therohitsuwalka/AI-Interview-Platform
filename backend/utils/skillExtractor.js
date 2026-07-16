// Keyword-based skill detector used ONLY as an offline fallback when the
// Gemini API is unreachable. Covers tech AND common non-tech professional
// fields so resumes for any field get a reasonable (if imperfect) result.
const skillDatabase = {

  frontend: [
    "html", "css", "javascript", "typescript", "react", "redux",
    "next.js", "tailwind", "bootstrap", "material ui", "vue", "angular"
  ],

  backend: [
    "node.js", "node", "express", "nestjs", "php", "laravel",
    "django", "flask", "spring boot", "ruby on rails", ".net"
  ],

  database: [
    "mongodb", "mysql", "postgresql", "sqlite", "firebase", "oracle", "redis"
  ],

  programming: [
    "java", "python", "c", "c++", "c#", "go", "rust", "kotlin", "swift"
  ],

  cloud_devops: [
    "aws", "azure", "gcp", "docker", "kubernetes", "vercel", "netlify", "ci/cd"
  ],

  dev_tools: [
    "git", "github", "postman", "figma", "jira", "linux", "vscode"
  ],

  sales: [
    "sales", "negotiation", "cold calling", "lead generation", "crm",
    "salesforce", "account management", "b2b sales", "b2c sales",
    "client relationship", "quota", "pipeline management", "upselling"
  ],

  marketing: [
    "marketing", "seo", "sem", "google ads", "social media marketing",
    "content marketing", "email marketing", "brand management",
    "market research", "google analytics", "campaign management",
    "digital marketing", "copywriting", "hubspot", "meta ads"
  ],

  hr: [
    "recruitment", "talent acquisition", "onboarding", "payroll",
    "employee relations", "hr policies", "performance management",
    "hris", "workday", "compensation and benefits", "interviewing"
  ],

  finance_accounting: [
    "accounting", "bookkeeping", "financial analysis", "budgeting",
    "tally", "quickbooks", "sap", "gst", "taxation", "auditing",
    "financial modeling", "excel", "reconciliation", "invoicing"
  ],

  design: [
    "graphic design", "ui/ux", "adobe photoshop", "adobe illustrator",
    "canva", "figma", "adobe xd", "typography", "branding", "sketch"
  ],

  content_writing: [
    "content writing", "copywriting", "editing", "proofreading",
    "blogging", "technical writing", "creative writing", "journalism"
  ],

  operations_management: [
    "project management", "operations management", "agile", "scrum",
    "supply chain", "logistics", "inventory management", "six sigma",
    "process improvement", "vendor management", "stakeholder management"
  ],

  customer_support: [
    "customer service", "customer support", "zendesk", "help desk",
    "technical support", "client handling", "complaint resolution"
  ],

  teaching_training: [
    "teaching", "training", "curriculum development", "mentoring",
    "public speaking", "lesson planning", "classroom management"
  ],

  soft_skills: [
    "communication", "leadership", "teamwork", "problem solving",
    "time management", "critical thinking", "adaptability", "presentation"
  ],

};

export const extractSkills = (resumeText) => {

    const text = resumeText.toLowerCase();

    const foundSkills = [];

    // Escape regex special chars (skills like "c++", "c#", "ui/ux" contain them)
    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    Object.values(skillDatabase).forEach((category) => {

        category.forEach((skill) => {

            const pattern = new RegExp(
                `(?<![a-z0-9])${escapeRegex(skill.toLowerCase())}(?![a-z0-9])`
            );

            if (pattern.test(text)) {

                foundSkills.push(skill);

            }

        });

    });

    return [...new Set(foundSkills)];

};