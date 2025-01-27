export default async function parseHTML(file) {
  const text = await file.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, "text/html");

  const data = {};
  doc.querySelectorAll(".menu-tbl").forEach((table) => {
    const qnID = table.querySelector("tr td.bold:nth-child(2)").innerText.trim();
    const hasAnswered = table.querySelector("tr td.bold:nth-child(8)").innerText.trim() !== "--";
    const ownAnswer = hasAnswered ? table.querySelector("tr td.bold:nth-child(8)").innerText.trim() : null;

    data[qnID] = { hasAnswered, ownAnswer };
  });

  return data;
}
