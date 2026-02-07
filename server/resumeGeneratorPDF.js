import PDFDocument from 'pdfkit';

export const generateResumePDF = (data) => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ margin: 50 });
        const buffers = [];

        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
            const pdfData = Buffer.concat(buffers);
            resolve(pdfData);
        });

        const { personalInfo, summary, experience, education, skills } = data;

        // Fonts
        doc.font('Helvetica');

        // 1. Header (Personal Info)
        doc.fontSize(20).text(personalInfo.fullName, { align: 'center', bold: true });
        doc.moveDown(0.5);

        doc.fontSize(10).text(
            `${personalInfo.email} | ${personalInfo.phone}${personalInfo.linkedin ? ' | ' + personalInfo.linkedin : ''}${personalInfo.location ? ' | ' + personalInfo.location : ''}`,
            { align: 'center' }
        );
        doc.moveDown(2);

        // Helper for Section Heading
        const addSectionHeading = (title) => {
            doc.font('Helvetica-Bold').fontSize(14).text(title.toUpperCase());
            doc.moveTo(doc.x, doc.y + 2).lineTo(doc.page.width - 50, doc.y + 2).stroke();
            doc.moveDown(0.8);
            doc.font('Helvetica').fontSize(11);
        };

        // 2. Summary
        if (summary) {
            addSectionHeading("Professional Summary");
            doc.text(summary, { align: 'justify' });
            doc.moveDown(1.5);
        }

        // 3. Experience
        if (experience && experience.length > 0) {
            addSectionHeading("Experience");
            experience.forEach(exp => {
                // Role & Company line
                doc.font('Helvetica-Bold').text(exp.role, { continued: true });
                doc.font('Helvetica').text(` at ${exp.company}`, { continued: true });
                doc.text(exp.duration, { align: 'right' }); // Right align duration

                doc.moveDown(0.2);
                doc.font('Helvetica').fontSize(10).text(exp.description, { align: 'justify' });
                doc.moveDown(1);
                doc.fontSize(11); // Reset font size
            });
            doc.moveDown(0.5);
        }

        // 4. Education
        if (education && education.length > 0) {
            addSectionHeading("Education");
            education.forEach(edu => {
                doc.font('Helvetica-Bold').text(edu.degree, { continued: true });
                doc.font('Helvetica').text(`, ${edu.school}`, { continued: true });
                doc.text(edu.year, { align: 'right' });
                doc.moveDown(0.5);
            });
            doc.moveDown(1);
        }

        // 5. Skills
        if (skills && skills.length > 0) {
            addSectionHeading("Skills");
            doc.text(skills);
        }

        doc.end();
    });
};
