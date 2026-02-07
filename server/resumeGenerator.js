const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, TabStopPosition, TabStopType } = require('docx');

const generateResume = async (data) => {
    const { personalInfo, summary, experience, education, skills, templateId } = data;

    // Helper to create a section heading
    const createHeading = (text) => {
        return new Paragraph({
            text: text.toUpperCase(),
            heading: HeadingLevel.HEADING_2,
            thematicBreak: true,
            spacing: {
                before: 200,
                after: 100,
            },
        });
    };

    // Helper to create a sub-heading (e.g. Job Title)
    const createSubHeading = (text) => {
        return new Paragraph({
            text: text,
            heading: HeadingLevel.HEADING_3,
            spacing: {
                before: 100,
                after: 50,
            },
        });
    };

    // Helper for normal text
    const createText = (text, bold = false) => {
        return new Paragraph({
            children: [
                new TextRun({
                    text: text,
                    bold: bold,
                }),
            ],
        });
    };

    // Helper for bullet points
    const createBullet = (text) => {
        return new Paragraph({
            text: text,
            bullet: {
                level: 0,
            },
        });
    };

    const sections = [];

    // 1. Header (Personal Info)
    sections.push(
        new Paragraph({
            text: personalInfo.fullName,
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
        }),
        new Paragraph({
            children: [
                new TextRun(`${personalInfo.email} | ${personalInfo.phone}`),
                new TextRun({
                    text: personalInfo.linkedin ? ` | ${personalInfo.linkedin}` : "",
                }),
                new TextRun({
                    text: personalInfo.location ? ` | ${personalInfo.location}` : "",
                }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: {
                after: 200,
            },
        })
    );

    // 2. Summary
    if (summary) {
        sections.push(createHeading("Professional Summary"));
        sections.push(createText(summary));
    }

    // 3. Experience
    if (experience && experience.length > 0) {
        sections.push(createHeading("Experience"));
        experience.forEach(exp => {
            sections.push(
                new Paragraph({
                    children: [
                        new TextRun({ text: exp.role, bold: true, size: 24 }),
                        new TextRun({ text: ` at ${exp.company}`, size: 24 }),
                        new TextRun({
                            text: `\t${exp.duration || ''}`,
                            bold: true,
                        }),
                    ],
                    tabStops: [
                        {
                            type: TabStopType.RIGHT,
                            position: TabStopPosition.MAX,
                        },
                    ],
                })
            );
            sections.push(createText(exp.description));
            sections.push(new Paragraph({ text: "" })); // Spacing
        });
    }

    // 4. Education
    if (education && education.length > 0) {
        sections.push(createHeading("Education"));
        education.forEach(edu => {
            sections.push(
                new Paragraph({
                    children: [
                        new TextRun({ text: edu.degree, bold: true }),
                        new TextRun({ text: `, ${edu.school}` }),
                        new TextRun({
                            text: `\t${edu.year || ''}`,
                            bold: true,
                        }),
                    ],
                    tabStops: [
                        {
                            type: TabStopType.RIGHT,
                            position: TabStopPosition.MAX,
                        },
                    ],
                })
            );
        });
    }

    // 5. Skills
    if (skills && skills.length > 0) {
        sections.push(createHeading("Skills"));
        // Check if skills is a string (comma separated) or array
        const skillsText = Array.isArray(skills) ? skills.join(', ') : skills;
        sections.push(createText(skillsText));
    }

    const doc = new Document({
        sections: [{
            properties: {},
            children: sections,
        }],
    });

    return await Packer.toBuffer(doc);
};

module.exports = { generateResume };
