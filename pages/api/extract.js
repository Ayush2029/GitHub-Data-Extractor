import fs from 'fs';
import path from 'path';
import formidable from 'formidable';

export const config = {
  api: {
    bodyParser: false, 
  },
};

const extractHyperlinksFromPDF = async (filePath) => {
  const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');
  
  const standardFontsPath = path.join(
    process.cwd(),
    'node_modules/pdfjs-dist/standard_fonts/'
  );

  const data = new Uint8Array(fs.readFileSync(filePath));
  
  const pdf = await pdfjsLib.getDocument({
    data,
    standardFontDataUrl: standardFontsPath,
  }).promise;

  let allLinks = [];

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const annotations = await page.getAnnotations();
    
    const linksOnPage = annotations
      .filter(annotation => 
          annotation.subtype === 'Link' && 
          annotation.url && 
          annotation.url.toLowerCase().includes('github.com')
      )
      .map(annotation => annotation.url);

    if (linksOnPage.length > 0) {
      allLinks.push(...linksOnPage);
    }
  }
  
  return [...new Set(allLinks)];
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Only POST requests allowed' });
  }

  try {
    const form = formidable({ multiples: false });
    const [fields, files] = await form.parse(req);

    const file = Array.isArray(files.pdf) ? files.pdf[0] : files.pdf;
    if (!file) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }

    const filePath = file.filepath;
    const linksArray = await extractHyperlinksFromPDF(filePath);

    fs.unlinkSync(filePath);
    
    res.status(200).json({ 
      message: 'Extraction complete!', 
      links: linksArray
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || 'PDF extraction failed' });
  }
}
