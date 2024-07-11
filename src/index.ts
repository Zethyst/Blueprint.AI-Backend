import express, { Request, Response } from "express";
import { createPdf } from "./pdfGenerator";
import { createWord } from "./wordGenerator";
import path from "path";
import cors from "cors";

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("[+] Server up and running...");
});

app.post("/generate-pdf", async (req: Request, res: Response) => {
  try {
    const { username, text, title } = req.body;

    if (!username) {
      return res.status(400).json({
        success: false,
        message: "Username is required",
      });
    }

    const pdfName = (await createPdf(title, text, username)) as string;
    const wordName = (await createWord(title, text, username)) as string;
    return res.json({
      success: true,
      pdfName,
      wordName,
      message: "SRS Generated Successfully",
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

app.get("/download-pdf/:filename", (req: Request, res: Response) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "pdfs", filename);
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error("Error sending pdf file:", err);
      res.status(500).send("An error occurred while sending the pdf file.");
    }
  });
});

app.get("/download-word/:filename", (req: Request, res: Response) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "docs", filename);
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error("Error sending word file:", err);
      res.status(500).send("An error occurred while sending the word file.");
    }
  });
});

app.listen(port, () => {
  console.log(`[+] Listening on port number: ${port}`);
});
