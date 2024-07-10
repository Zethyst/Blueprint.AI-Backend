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
exports.createPdf = createPdf;
const fs_1 = __importDefault(require("fs"));
const promises_1 = __importDefault(require("fs/promises"));
const pdfkit_1 = __importDefault(require("pdfkit"));
const path_1 = __importDefault(require("path"));
function createPdf(title, text, username) {
    return __awaiter(this, void 0, void 0, function* () {
        const fileName = username + Date.now();
        const documentsPath = path_1.default.join(__dirname, "pdfs");
        try {
            yield promises_1.default.access(documentsPath);
        }
        catch (error) {
            // Directory does not exist, create it
            yield promises_1.default.mkdir(documentsPath, { recursive: true });
        }
        const pdfPath = path_1.default.join(documentsPath, `${fileName}.pdf`);
        try {
            const doc = new pdfkit_1.default({
                margins: {
                    top: 36,
                    bottom: 36,
                    left: 36,
                    right: 36,
                },
            });
            doc.pipe(fs_1.default.createWriteStream(pdfPath));
            doc.fontSize(24).text(title, { align: "center" });
            doc.moveDown();
            // Split the text by new lines and process each line
            text.split("\n").forEach((line) => {
                // Split the line by the asterisks to identify bold segments
                const parts = line.split(/(\*\*[^*]+\*\*)/g);
                parts.forEach((part) => {
                    if (part.startsWith("**") && part.endsWith("**")) {
                        // Render bold text without the asterisks
                        doc.font("Helvetica-Bold").text(part.slice(2, -2), { continued: true });
                    }
                    else {
                        // Render normal text
                        doc.font("Helvetica").text(part, { continued: true });
                    }
                });
                // Move to the next line after processing the current line
                doc.text("").moveDown();
            });
            doc.end();
            return fileName;
        }
        catch (error) {
            console.log(error);
        }
    });
}
