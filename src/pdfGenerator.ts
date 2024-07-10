import fs from "fs";
import fsPromises from "fs/promises";
import PDFDocument from "pdfkit";
import path from "path";

export async function createPdf(title: string, text: string, username: string) {
  const fileName = username + Date.now();
  const documentsPath = path.join(__dirname, "pdfs");

  try {
    await fsPromises.access(documentsPath);
  } catch (error) {
    // Directory does not exist, create it
    await fsPromises.mkdir(documentsPath, { recursive: true });
  }

  const pdfPath = path.join(documentsPath, `${fileName}.pdf`);

  try {
    const doc = new PDFDocument({
      margins: {
        top: 36,
        bottom: 36,
        left: 36,
        right: 36,
      },
    });

    doc.pipe(fs.createWriteStream(pdfPath));

    doc.fontSize(24).text(title, { align: "center" });

    doc.moveDown();

    // Split the text by new lines and process each line
    text.split("\n").forEach((line: string) => {
      // Split the line by the asterisks to identify bold segments
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      
      parts.forEach((part) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          // Render bold text without the asterisks
          doc.font("Helvetica-Bold").text(part.slice(2, -2), { continued: true });
        } else {
          // Render normal text
          doc.font("Helvetica").text(part, { continued: true });
        }
      });
      
      // Move to the next line after processing the current line
      doc.text("").moveDown();
    });

    doc.end();

    return fileName;
  } catch (error) {
    console.log(error);
  }
}
