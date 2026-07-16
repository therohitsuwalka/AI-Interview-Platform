export const calculateATSScore = (resumeText, skills) => {

    let score = 0;

    const text = resumeText.toLowerCase();

    // Skills Score (40)

    score += Math.min(skills.length * 4, 40);

    // Education

    if (
        text.includes("b.tech") ||
        text.includes("bachelor")
    ) {

        score += 20;

    }

    // Projects

    if (text.includes("project")) {

        score += 20;

    }

    // Experience

    if (
        text.includes("intern") ||
        text.includes("experience")
    ) {

        score += 10;

    }

    // GitHub / Portfolio

    if (
        text.includes("github") ||
        text.includes("portfolio")
    ) {

        score += 10;

    }

    return Math.min(score, 100);

};