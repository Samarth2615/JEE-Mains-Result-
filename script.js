document.getElementById('calculateBtn').addEventListener('click', function() {
    const shift = document.getElementById('shift').value;
    const responseSheetURL = document.getElementById('responseSheet').value;

    if (shift && responseSheetURL) {
        fetch(`keys/${shift}.json`)
            .then(response => response.json())
            .then(answerKey => {
                // Assuming we have logic to extract answers from response sheet URL here
                const studentAnswers = fetchStudentAnswers(responseSheetURL);

                // Define scores and counters
                let totalScore = 0;
                let physicsScore = 0;
                let chemistryScore = 0;
                let mathScore = 0;

                // Maximum 5 integer questions can be attempted
                let attemptedIntegerPhysics = 0;
                let attemptedIntegerChemistry = 0;
                let attemptedIntegerMath = 0;

                // Calculate scores based on answer key and student answers
                for (let i = 1; i <= 90; i++) {
                    const answer = answerKey[i.toString()];
                    const studentAnswer = studentAnswers[i];

                    let isCorrect = false;

                    if (answer !== undefined && studentAnswer !== undefined) {
                        // If it's an MCQ (we assume the answer is a choice id like "A", "B", "C", "D")
                        if (typeof answer === 'string' && typeof studentAnswer === 'string') {
                            isCorrect = studentAnswer === answer;
                        }
                        // If it's an Integer question (answer will be a number or string representing the value)
                        else if (typeof answer === 'number' || typeof answer === 'string') {
                            isCorrect = studentAnswer === answer;
                        }

                        // Determine subject based on the question ID range (1-30 for Physics, 31-60 for Chemistry, 61-90 for Math)
                        let isIntegerQuestion = i > 20 && i <= 30 || i > 50 && i <= 60 || i > 80 && i <= 90;

                        if (isCorrect) {
                            // Add marks based on question type
                            if (i <= 30) { // Physics
                                if (isIntegerQuestion && attemptedIntegerPhysics < 5) {
                                    attemptedIntegerPhysics++;
                                    physicsScore += 4; // Correct integer answer
                                } else if (!isIntegerQuestion) {
                                    physicsScore += 4; // Correct MCQ answer
                                }
                            } else if (i <= 60) { // Chemistry
                                if (isIntegerQuestion && attemptedIntegerChemistry < 5) {
                                    attemptedIntegerChemistry++;
                                    chemistryScore += 4;
                                } else if (!isIntegerQuestion) {
                                    chemistryScore += 4;
                                }
                            } else if (i <= 90) { // Math
                                if (isIntegerQuestion && attemptedIntegerMath < 5) {
                                    attemptedIntegerMath++;
                                    mathScore += 4;
                                } else if (!isIntegerQuestion) {
                                    mathScore += 4;
                                }
                            }
                        } else {
                            // Deduct marks for incorrect answers
                            if (i <= 30) { // Physics
                                if (!isIntegerQuestion) physicsScore -= 1;
                            } else if (i <= 60) { // Chemistry
                                if (!isIntegerQuestion) chemistryScore -= 1;
                            } else if (i <= 90) { // Math
                                if (!isIntegerQuestion) mathScore -= 1;
                            }
                        }
                    }
                }

                // Total Score Calculation
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
        "21": "2", "22": "5", "23": "7", // Integer responses for the integer questions
        "81": "160", "82": "300", // Integer answers for math
    };
}
