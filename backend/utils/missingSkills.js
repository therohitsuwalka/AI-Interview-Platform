// Expected skill sets for common roles - used ONLY as an offline fallback
// when Gemini is unreachable. Covers tech and non-tech roles.
const roleSkills = {

    "frontend developer": ["react", "javascript", "html", "css", "git", "tailwind"],
    "backend developer": ["node.js", "express", "mongodb", "docker", "git"],
    "full stack developer": ["react", "node.js", "express", "mongodb", "docker", "aws", "git"],

    "sales executive": ["sales", "negotiation", "crm", "lead generation", "communication"],
    "sales manager": ["sales", "negotiation", "account management", "crm", "leadership"],

    "digital marketer": ["seo", "google ads", "social media marketing", "google analytics", "content marketing"],
    "marketing manager": ["marketing", "brand management", "campaign management", "market research", "leadership"],

    "hr executive": ["recruitment", "onboarding", "hr policies", "communication", "interviewing"],
    "hr manager": ["talent acquisition", "employee relations", "performance management", "leadership", "hris"],

    "accountant": ["accounting", "tally", "gst", "taxation", "excel", "reconciliation"],
    "financial analyst": ["financial analysis", "financial modeling", "excel", "budgeting", "reporting"],

    "graphic designer": ["graphic design", "adobe photoshop", "adobe illustrator", "typography", "branding"],
    "ui/ux designer": ["ui/ux", "figma", "adobe xd", "typography", "user research"],

    "content writer": ["content writing", "copywriting", "editing", "proofreading", "seo"],

    "project manager": ["project management", "agile", "scrum", "stakeholder management", "leadership"],
    "operations manager": ["operations management", "process improvement", "vendor management", "leadership"],

    "customer support executive": ["customer service", "communication", "problem solving", "help desk"],

};

// Best-effort partial match so a role like "Senior Sales Executive" still
// hits the "sales executive" entry above.
const findClosestRole = (role) => {
    const normalized = role.toLowerCase().trim();

    if (roleSkills[normalized]) return normalized;

    const match = Object.keys(roleSkills).find(
        (key) => normalized.includes(key) || key.includes(normalized)
    );

    return match || null;
};

export const getMissingSkills = (
    role,
    foundSkills
) => {

    const matchedRole = role ? findClosestRole(role) : null;

    const expected = matchedRole ? roleSkills[matchedRole] : [];

    return expected.filter(
        (skill) =>
            !foundSkills.includes(skill)
    );

};