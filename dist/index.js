"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pdfGenerator_1 = require("./pdfGenerator");
const wordGenerator_1 = require("./wordGenerator");
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.post("/generate-pdf", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, text, title } = req.body;
        if (!username) {
            return res.status(400).json({
                success: false,
                message: "Username is required",
            });
        }
        const pdfName = yield (0, pdfGenerator_1.createPdf)(title, text, username);
        const wordName = yield (0, wordGenerator_1.createWord)(title, text, username);
        return res.json({
            success: true,
            pdfName,
            wordName,
            message: "SRS Generated Successfully",
        });
    }
    catch (error) {
        console.error("Error generating PDF:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}));
app.get("/download-pdf/:filename", (req, res) => {
    const filename = req.params.filename;
    const filePath = path_1.default.join(__dirname, "pdfs", filename);
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error("Error sending pdf file:", err);
            res.status(500).send("An error occurred while sending the pdf file.");
        }
    });
});
app.get("/download-word/:filename", (req, res) => {
    const filename = req.params.filename;
    const filePath = path_1.default.join(__dirname, "docs", filename);
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
