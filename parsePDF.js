import { getDocument } from "pdfjs-dist";

export default async function parsePDF(file) {
  const typedArray = new Uint8Array(await file.arrayBuffer());
  const pdf = await getDocument(typedArray).promise;

  const textContent = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const text = await page.getTextContent();
    textContent.push(
      text.items.map((item) => item.str).join("\n")
    );
  }

  return extractResponses(textContent.join("\n"));
}

function extractResponses(text) {
  const data = {};
  const lines = text.split("\n");
  // Implement extraction logic similar to parseHTML
  return data;
}
