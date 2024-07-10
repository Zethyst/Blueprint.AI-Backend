import { Document, Packer, Paragraph, TextRun } from "docx";
import * as fs from "fs";
import fsPromises from "fs/promises";
import * as path from "path";

export const createWord = async (
  title: string,
  text: string,
  username: string
) => {
  const documentsPath = path.join(__dirname, "docs");

  try {
    await fsPromises.access(documentsPath);
  } catch (error) {
    // Directory does not exist, create it
    await fsPromises.mkdir(documentsPath, { recursive: true });
  }

  // Split the text by new lines and process each line
  const paragraphs = text.split("\n").map((line) => {
    // Split the line by the asterisks to identify bold segments
    const parts = line.split(/(\*\*[^*]+\*\*)/g);

    const children = parts.map((part) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        // Render bold text without the asterisks
        return new TextRun({
          text: part.slice(2, -2),
          bold: true,
        });
      } else {
        // Render normal text
        return new TextRun({
          text: part,
        });
      }
    });

    return new Paragraph({
      children,
    });
  });

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: title,
                bold: true,
                size: 32,
              }),
            ],
          }),
          ...paragraphs,
        ],
      },
    ],
  });

  const wordName = `${username}${Date.now()}`;
  const wordPath = path.join(documentsPath, `${wordName}.docx`);

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(wordPath, buffer);

  return wordName;
};
