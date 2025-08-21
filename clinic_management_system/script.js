let patients = [];
let tokenCounter = 1;

function login() {
    const role = document.getElementById('role').value;
    const username = document.getElementById('username').value.trim();

    if (!username) {
        alert("Please enter a username");
        return;
    }

    document.getElementById('login-section').classList.add('hidden');

    if (role === "receptionist") {
        document.getElementById('receptionist-panel').classList.remove('hidden');
    } else if (role === "doctor") {
        document.getElementById('doctor-panel').classList.remove('hidden');
        loadPatients();
    }
}

function logout() {
    // Hide all panels
    document.getElementById('receptionist-panel').classList.add('hidden');
    document.getElementById('doctor-panel').classList.add('hidden');

    // Show login again
    document.getElementById('login-section').classList.remove('hidden');

    // Clear username field
    document.getElementById('username').value = "";
}

function addPatient() {
    const name = document.getElementById('patient-name').value.trim();
    const age = document.getElementById('patient-age').value.trim();
    const prescription = document.getElementById('patient-prescription').value.trim();

    if (!name || !age || !prescription) {
        alert("Please fill all patient details");
        return;
    }

    const patient = {token: tokenCounter++, name, age, prescription};

    patients.push(patient);

    document.getElementById('token-info').textContent = `Token generated: ${patient.token} for ${patient.name}`;

    // Clear fields
    document.getElementById('patient-name').value = "";
    document.getElementById('patient-age').value = "";
    document.getElementById('patient-prescription').value = "";
}

function generateBill() {
    const charge = document.getElementById('charge').value;

    if (!charge) {
        alert("Please enter a charge amount");
        return;
    }

    document.getElementById('bill-info').textContent = `Bill Generated: $${charge}`;
    document.getElementById('charge').value = "";
}

function loadPatients() {
    const list = document.getElementById('patient-list');
    list.innerHTML = "";

    if (patients.length === 0) {
        list.innerHTML = "<li>No patients added yet.</li>";
        return;
    }

    patients.forEach(p => {
        const li = document.createElement('li');
        li.textContent = `Token: ${p.token}, Name: ${p.name}, Age: ${p.age}, Prescription: ${p.prescription}`;
        list.appendChild(li);
    });
}
