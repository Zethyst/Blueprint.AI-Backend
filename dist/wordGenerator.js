"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.createWord = void 0;
const docx_1 = require("docx");
const fs = __importStar(require("fs"));
const promises_1 = __importDefault(require("fs/promises"));
const path = __importStar(require("path"));
const createWord = (title, text, username) => __awaiter(void 0, void 0, void 0, function* () {
    const documentsPath = path.join(__dirname, "docs");
    try {
        yield promises_1.default.access(documentsPath);
    }
    catch (error) {
        // Directory does not exist, create it
        yield promises_1.default.mkdir(documentsPath, { recursive: true });
    }
    // Split the text by new lines and process each line
    const paragraphs = text.split("\n").map((line) => {
        // Split the line by the asterisks to identify bold segments
        const parts = line.split(/(\*\*[^*]+\*\*)/g);
        const children = parts.map((part) => {
            if (part.startsWith("**") && part.endsWith("**")) {
                // Render bold text without the asterisks
                return new docx_1.TextRun({
                    text: part.slice(2, -2),
                    bold: true,
                });
            }
            else {
                // Render normal text
                return new docx_1.TextRun({
                    text: part,
                });
            }
        });
        return new docx_1.Paragraph({
            children,
        });
    });
    const doc = new docx_1.Document({
        sections: [
            {
                properties: {},
                children: [
                    new docx_1.Paragraph({
                        children: [
                            new docx_1.TextRun({
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
    const buffer = yield docx_1.Packer.toBuffer(doc);
    fs.writeFileSync(wordPath, buffer);
    return wordName;
});
exports.createWord = createWord;
