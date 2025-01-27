import parseHTML from "./scraper.js";
import parsePDF from "./parsePDF.js";

document.getElementById("upload-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const shift = document.getElementById("shift").value;
  const file = document.getElementById("responseFile").files[0];

  if (!file) {
    alert("Please upload a response sheet.");
    return;
  }

  try {
    let userResponses;
    if (file.type === "text/html") {
      userResponses = await parseHTML(file);
    } else if (file.type === "application/pdf") {
      userResponses = await parsePDF(file);
    } else {
      alert("Invalid file type. Please upload an HTML or PDF file.");
      return;
    }

    const ntaKey = await fetch(`keys/${shift}.json`).then((res) => res.json());
    const results = calculateScore(userResponses, ntaKey);
    displayResults(results, shift);
  } catch (error) {
    console.error(error);
    alert("An error occurred while processing the file.");
  }
});

function calculateScore(userResponses, ntaKey) {
  let correct = 0, incorrect = 0, skipped = 0;

  Object.keys(ntaKey).forEach((questionID) => {
    const ntaAnswer = ntaKey[questionID];
    const userAnswer = userResponses[questionID]?.ownAnswer;

    if (ntaAnswer === "DROP") return;

    if (userResponses[questionID]?.hasAnswered) {
      if (userAnswer === ntaAnswer) correct++;
      else incorrect++;
    } else {
      skipped++;
    }
  });

  return {
    totalScore: correct * 4 - incorrect,
    correct,
    incorrect,
    skipped,
  };
}

function displayResults({ totalScore, correct, incorrect, skipped }, shift) {
  document.getElementById("result-shift").innerText = shift;
  document.getElementById("result-score").innerText = totalScore;

  const tbody = document.getElementById("result-details");
  tbody.innerHTML = `
    <tr>
      <td>Overall</td>
      <td>${correct + incorrect}</td>
      <td>${correct}</td>
      <td>${incorrect}</td>
      <td>${totalScore}</td>
    </tr>
  `;

  document.getElementById("results").hidden = false;
}
