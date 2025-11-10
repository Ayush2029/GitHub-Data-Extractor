// pages/api/extract.js
import fs from "fs";
import path from "path";
import formidable from "formidable";
import pdfParse from "pdf-parse";

// Disable Next.js default body parser for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

// Utility to parse PDF and extract text + URLs
const extractTextAndLinks = async (filePath) => {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);
  const text = data.text;

  // Simple regex for URLs
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const urls = text.match(urlRegex) || [];

  return { text, urls };
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests allowed" });
  }

  try {
    const form = formidable({ multiples: false });
    const uploadDir = path.join(process.cwd(), "/tmp");

    // Ensure tmp directory exists (Vercel supports /tmp for temporary files)
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    form.uploadDir = uploadDir;
    form.keepExtensions = true;

    // Parse uploaded PDF
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve([fields, files]);
      });
    });

    const file = files.file?.[0] || files.file; // for different formidable versions
    const filePath = file.filepath || file.path;

    // Extract text + URLs
    const { text, urls } = await extractTextAndLinks(filePath);

    // Clean up temp file
    fs.unlinkSync(filePath);

    return res.status(200).json({
      message: "PDF processed successfully",
      urls,
      textSnippet: text.slice(0, 500) + "...",
    });
  } catch (error) {
    console.error("Error extracting PDF:", error);
    return res.status(500).json({ message: "Failed to extract PDF", error: error.message });
  }
}
