document.getElementById('calculateBtn').addEventListener('click', function() {
    const shift = document.getElementById('shift').value;
    const responseSheetURL = document.getElementById('responseSheet').value;

    if (shift && responseSheetURL) {
        fetch(`answer-keys/${shift}.json`)
            .then(response => response.json())
            .then(answerKey => {
                // Assuming we have logic to extract answers from response sheet URL here
                const studentAnswers = fetchStudentAnswers(responseSheetURL);

                let totalScore = 0;
                let physicsScore = 0;
                let chemistryScore = 0;
                let mathScore = 0;

                // Calculate scores based on answer key and student answers
                for (let i = 1; i <= 90; i++) {
                    const answer = answerKey[i.toString()];
                    const studentAnswer = studentAnswers[i];
                    const isCorrect = studentAnswer === answer;

                    if (i <= 30) { // Physics
                        physicsScore += isCorrect ? 4 : -1;
                    } else if (i <= 60) { // Chemistry
                        chemistryScore += isCorrect ? 4 : -1;
                    } else { // Mathematics
                        mathScore += isCorrect ? 4 : -1;
                    }
                }

                totalScore = physicsScore + chemistryScore + mathScore;

                // Display the result
                document.getElementById('totalScore').innerText = totalScore;
                document.getElementById('physicsScore').innerText = physicsScore;
                document.getElementById('chemistryScore').innerText = chemistryScore;
                document.getElementById('mathScore').innerText = mathScore;

                document.getElementById('result').style.display = 'block';
            })
            .catch(error => alert('Error fetching answer key: ' + error));
    } else {
        alert('Please select a shift and provide the response sheet link.');
    }
});

// Mock function to fetch student answers (you will need actual logic here)
function fetchStudentAnswers(url) {
    // In a real-world scenario, you'd parse the response sheet URL here
    return {
        "1": "A", "2": "B", "3": "C", // ... and so on for 90 questions
    };
}
