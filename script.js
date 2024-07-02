document.addEventListener('DOMContentLoaded', () => {
    // Initial setup when the page is loaded
    const subjects = ['AI', 'NS', 'NLP'];
    subjects.forEach(subject => addSubject(subject));
    createSemesterInputs();
    loadSavedSGPAs();
});

// Function to add a subject row in the SGPA calculator
function addSubject(subjectName = '') {
    const tableBody = document.getElementById('subjectsTableBody');
    const row = document.createElement('tr');

    row.innerHTML = `
        <td><input type="text" class="subject" value="${subjectName}"></td>
        <td><input type="number" class="quiz quiz1" min="0" max="10" oninput="validateInput(this, 10)"></td>
        <td><input type="number" class="quiz quiz2" min="0" max="10" oninput="validateInput(this, 10)"></td>
        <td><input type="number" class="midsem" min="0" max="30" oninput="validateInput(this, 30)"></td>
        <td><input type="number" class="endsem" min="0" max="100" oninput="validateInput(this, 100)"></td>
        <td><input type="number" class="tutorial" min="0" max="25" oninput="validateInput(this, 25)"></td>
        <td class="total">0</td>
        <td class="grade-point">0</td>
        <td><input type="number" class="credit-lec" value="3" min="0" oninput="calculateSGPA()"></td>
        <td><input type="number" class="lab" min="0" max="50" oninput="validateInput(this, 50)"></td>
        <td class="total-lab">0</td>
        <td class="grade-point-lab">0</td>
        <td><input type="number" class="credit-lab" value="1" min="0" oninput="calculateSGPA()"></td>
        <td><button type="button" class="remove-button" onclick="removeSubject(this)">Remove</button></td>
    `;

    tableBody.appendChild(row);
}

// Function to validate input values
function validateInput(input, max) {
    if (parseFloat(input.value) > max) {
        input.value = max;
    }
    calculateSGPA();
}

// Function to remove a subject row
function removeSubject(button) {
    const row = button.parentElement.parentElement;
    row.remove();
    calculateSGPA();
}

// Function to calculate total marks and grade points for a row
function calculateRow(row) {
    const quizInputs = row.querySelectorAll('.quiz');
    const midsemInput = row.querySelector('.midsem');
    const endsemInput = row.querySelector('.endsem');
    const tutorialInput = row.querySelector('.tutorial');
    const labInput = row.querySelector('.lab');

    const totalQuiz = (parseFloat(quizInputs[0].value) + parseFloat(quizInputs[1].value)) || 0;
    const totalMidsem = parseFloat(midsemInput.value) || 0;
    const totalEndsem = parseFloat(endsemInput.value) * 0.5 || 0;
    const totalTutorial = parseFloat(tutorialInput.value) || 0;
    const totalLab = parseFloat(labInput.value) || 0;

    const totalTheory = totalQuiz + totalMidsem + totalEndsem + totalTutorial;
    const gradePointTheory = calculateGradePointTheory(totalTheory);
    const gradePointLab = calculateGradePointLab(totalLab);

    row.querySelector('.total').textContent = totalTheory.toFixed(2);
    row.querySelector('.grade-point').textContent = gradePointTheory.toFixed(2);
    row.querySelector('.total-lab').textContent = totalLab.toFixed(2);
    row.querySelector('.grade-point-lab').textContent = gradePointLab.toFixed(2);
}

// Function to calculate grade point for theory subjects
function calculateGradePointTheory(total) {
    if (total > 80) return 10;
    if (total > 70) return 9;
    if (total > 60) return 8;
    if (total > 52) return 7;
    if (total > 46) return 6;
    if (total > 41) return 5;
    if (total > 35) return 4;
    return 0;
}

// Function to calculate grade point for lab subjects
function calculateGradePointLab(totalLab) {
    if (totalLab > 40) return 10;
    if (totalLab > 34) return 9;
    if (totalLab > 31) return 8;
    if (totalLab > 29) return 7;
    if (totalLab > 24) return 6;
    if (totalLab > 21) return 5;
    if (totalLab > 17) return 4;
    return 0;
}

// Function to calculate SGPA
function calculateSGPA() {
    const rows = document.querySelectorAll('#subjectsTableBody tr');
    let totalGradePoints = 0;
    let totalCredits = 0;

    rows.forEach(row => {
        calculateRow(row);

        const gradePoint = parseFloat(row.querySelector('.grade-point').textContent);
        const creditLec = parseFloat(row.querySelector('.credit-lec').value);
        const gradePointLab = parseFloat(row.querySelector('.grade-point-lab').textContent);
        const creditLab = parseFloat(row.querySelector('.credit-lab').value);

        totalGradePoints += (gradePoint * creditLec) + (gradePointLab * creditLab);
        totalCredits += creditLec + creditLab;
    });

    const sgpa = totalGradePoints / totalCredits;
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `<p>Overall SGPA: ${sgpa.toFixed(2)}</p>`;
}

// Function to create inputs for semester credits in the CGPA calculator section
function createSemesterInputs() {
    const semesterSgpasDiv = document.getElementById('semesterSgpas');
    for (let i = 1; i <= 8; i++) {
        const creditInput = `
            <div class="semester-input-group">
                <label for="credit${i}" class="semester-label">Semester ${i} Credits:</label>
                <input type="number" id="credit${i}" value="20" min="1" class="semester-input">
                <label for="sgpa${i}" class="semester-label">SGPA:</label>
                <input type="number" id="sgpa${i}" value="0" min="0" max="10" step="0.01" class="semester-input">
            </div>`;
        semesterSgpasDiv.insertAdjacentHTML('beforeend', creditInput);
    }
}

// Array to store SGPA values for each semester
let semesterSGPAs = [0, 0, 0, 0, 0, 0, 0, 0];

// Function to save SGPA for the selected semester
function saveSGPA() {
    const semesterSelect = document.getElementById('semesterSelect');
    const selectedSemester = parseInt(semesterSelect.value);
    const sgpa = parseFloat(document.getElementById('results').textContent.match(/[\d.]+/)[0]);

    if (!isNaN(sgpa)) {
        semesterSGPAs[selectedSemester - 1] = sgpa;
        document.getElementById(`sgpa${selectedSemester}`).value = sgpa;
        alert(`SGPA for Semester ${selectedSemester} saved successfully!`);
    } else {
        alert('Calculate SGPA first before saving!');
    }
}

// Function to load previously saved SGPA values (dummy function for demonstration)
function loadSavedSGPAs() {
    // Example: Load saved SGPA values from a database or local storage
    // For demonstration, initializing with some values
    semesterSGPAs = [0, 0, 0, 0, 0, 0, 0, 0];

    semesterSGPAs.forEach((sgpa, index) => {
        document.getElementById(`sgpa${index + 1}`).value = sgpa;
    });
}

// Function to calculate CGPA based on SGPA values and credits entered
function calculateCGPA() {
    const sgpaInputs = document.querySelectorAll('#semesterSgpas input[id^="sgpa"]');
    let totalSGPA = 0;
    let totalCredits = 0;

    sgpaInputs.forEach((input, index) => {
        const sgpa = parseFloat(input.value);
        if (!isNaN(sgpa)) {
            const credit = parseInt(document.getElementById(`credit${index + 1}`).value);
            totalSGPA += sgpa * credit;
            totalCredits += credit;
        }
    });

    const cgpa = totalSGPA / totalCredits;
    const cgpaResultsDiv = document.getElementById('cgpaResults');
    cgpaResultsDiv.innerHTML = `<p>Overall CGPA: ${cgpa.toFixed(2)}</p>`;
}
