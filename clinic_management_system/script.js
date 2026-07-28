/* ===== Authentication and Initial State Configuration ===== */
// Pre-defined hardcoded accounts for quick testing
const ACCOUNTS = [
    { username: "doc1", password: "doc123", role: "doctor", name: "Dr. Sharma" },
    { username: "rec1", password: "rec123", role: "receptionist", name: "Priya (Reception)" }
];

let currentUser = null;

// Persistent data state via localStorage
let patients = JSON.parse(localStorage.getItem('cms_patients')) || [];
let tokenCounter = parseInt(localStorage.getItem('cms_tokenCounter')) || 1;

// Saves current patient records and token state to local storage.
function saveState() {
    localStorage.setItem('cms_patients', JSON.stringify(patients));
    localStorage.setItem('cms_tokenCounter', tokenCounter.toString());
}

/* ===== Authentication Handlers ===== */

function login() {
    const usernameInput = document.getElementById('username').value.trim();
    const passwordInput = document.getElementById('password').value.trim();
    const errorEl = document.getElementById('login-error');

    if (!usernameInput || !passwordInput) {
        errorEl.textContent = "Please enter both username and password.";
        return;
    }

    // Match credentials against defined accounts
    const foundAccount = ACCOUNTS.find(
        acc => acc.username === usernameInput && acc.password === passwordInput
    );

    if (!foundAccount) {
        errorEl.textContent = "Invalid username or password!";
        return;
    }

    // Successful Login
    errorEl.textContent = "";
    currentUser = foundAccount;

    // Clear login input fields
    document.getElementById('username').value = "";
    document.getElementById('password').value = "";

    // Switch panel view
    document.getElementById('login-section').classList.add('hidden');

    if (currentUser.role === "receptionist") {
        document.getElementById('receptionist-panel').classList.remove('hidden');
        document.getElementById('receptionist-welcome').textContent = `Logged in as: ${currentUser.name}`;
        loadReceptionistDashboard();
    } else if (currentUser.role === "doctor") {
        document.getElementById('doctor-panel').classList.remove('hidden');
        document.getElementById('doctor-welcome').textContent = `Logged in as: ${currentUser.name}`;
        loadDoctorDashboard();
    }
}

function logout() {
    currentUser = null;
    document.getElementById('receptionist-panel').classList.add('hidden');
    document.getElementById('doctor-panel').classList.add('hidden');
    document.getElementById('login-section').classList.remove('hidden');
}

/* ===== Receptionist Dashboard Actions ===== */

function addPatient() {
    const name = document.getElementById('patient-name').value.trim();
    const age = document.getElementById('patient-age').value.trim();

    if (!name || !age) {
        alert("Please enter patient name and age.");
        return;
    }

    const patient = {
        token: tokenCounter++,
        name: name,
        age: age,
        prescription: "Pending Examination",
        bill: "Not Generated",
        status: "Waiting"
    };

    patients.push(patient);
    saveState();

    document.getElementById('token-info').textContent = `Token #${patient.token} generated for ${patient.name}`;
    document.getElementById('patient-name').value = "";
    document.getElementById('patient-age').value = "";

    loadReceptionistDashboard();
}

function generateBill() {
    const select = document.getElementById('billing-patient-select');
    const token = parseInt(select.value);
    const charge = document.getElementById('charge').value;

    if (!token || !charge) {
        alert("Please select a patient ready for billing and enter a valid charge amount.");
        return;
    }

    const patient = patients.find(p => p.token === token);
    if (patient) {
        patient.bill = `₹${charge}`;
        patient.status = "Completed"; // Mark record as completely finished
        
        saveState();

        document.getElementById('bill-info').textContent = `Bill of ₹${charge} saved for Token #${patient.token} (${patient.name})`;
        document.getElementById('charge').value = "";
        loadReceptionistDashboard();
    }
}

function loadReceptionistDashboard() {
    // 1. Populate Billing Dropdown (ONLY show patients who have been examined by doctor)
    const select = document.getElementById('billing-patient-select');
    select.innerHTML = '<option value="">Select Patient for Billing</option>';

    // Filter strictly for examined patients
    const readyForBilling = patients.filter(p => p.status === "Examined");

    readyForBilling.forEach(p => {
        const option = document.createElement('option');
        option.value = p.token;
        option.textContent = `Token #${p.token} - ${p.name}`;
        select.appendChild(option);
    });

    // 2. Populate All Patient Records List
    const list = document.getElementById('receptionist-patient-list');
    list.innerHTML = "";

    if (patients.length === 0) {
        list.innerHTML = "<li>No patient records found.</li>";
        return;
    }

    patients.forEach(p => {
        const li = document.createElement('li');
        li.className = "patient-card";
        li.innerHTML = `
            <strong>Token #${p.token}</strong> | ${p.name} (${p.age} yrs)<br>
            <strong>Prescription:</strong> ${p.prescription}<br>
            <strong>Bill:</strong> ${p.bill} | <strong>Status:</strong> ${p.status}
        `;
        list.appendChild(li);
    });
}

/* ===== Doctor Dashboard Actions ===== */

function loadDoctorDashboard() {
    const list = document.getElementById('doctor-patient-list');
    list.innerHTML = "";

    /* Filter strictly for patients waiting to see the doctor */
    const activePatients = patients.filter(p => p.status === "Waiting");

    if (activePatients.length === 0) {
        list.innerHTML = "<li>No active patients in queue. All caught up!</li>";
        return;
    }

    /* Pick only the first patient in line */
    const currentPatient = activePatients[0];

    const li = document.createElement('li');
    li.className = "patient-card";
    li.style.borderLeftColor = "#3182ce";
    li.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="background: #ebf8ff; color: #2b6cb0; border: 1px solid #bee3f8; padding: 2px 10px; border-radius: 12px; font-size: 11px; font-weight: bold;">
                NOW SERVING
            </span>
            <span style="font-size: 12px; color: #718096; font-weight: bold;">
                Status: ${currentPatient.status}
            </span>
        </div>

        <h3 style="margin: 5px 0; color: #2d3748;">Token #${currentPatient.token}: ${currentPatient.name}</h3>
        <p style="margin: 0 0 10px 0; color: #4a5568;"><strong>Age:</strong> ${currentPatient.age} years</p>
        <p style="margin: 0 0 10px 0; color: #4a5568;"><strong>Current Prescription:</strong> ${currentPatient.prescription}</p>

        <div class="prescription-form">
            <input type="text" id="presc-${currentPatient.token}" placeholder="Enter prescription notes for ${currentPatient.name}">
            <button onclick="submitPrescription(${currentPatient.token})">Save & Next Patient</button>
        </div>
    `;
    list.appendChild(li);

    /* Display remaining waiting count underneath */
    if (activePatients.length > 1) {
        const queueInfo = document.createElement('div');
        queueInfo.style.marginTop = "15px";
        queueInfo.style.fontSize = "13px";
        queueInfo.style.color = "#4a5568";
        queueInfo.style.textAlign = "center";
        queueInfo.innerHTML = `📋 <strong>${activePatients.length - 1}</strong> more patient(s) waiting in queue.`;
        list.appendChild(queueInfo);
    }
}

function submitPrescription(token) {
    const input = document.getElementById(`presc-${token}`);
    const prescriptionText = input.value.trim();

    if (!prescriptionText) {
        alert("Please enter a prescription before moving to the next patient.");
        return;
    }

    const patient = patients.find(p => p.token === token);
    if (patient) {
        patient.prescription = prescriptionText;
        if (patient.status === "Waiting") {
            patient.status = "Examined";
        }
        saveState();
        
        /* Refresh doctor dashboard to load the next patient automatically */
        loadDoctorDashboard();
    }
}

/* ===== System Reset Handler ===== */
function resetData() {
    const confirmReset = confirm("Are you sure you want to clear all patient records and reset tokens?");
    
    if (confirmReset) {
        localStorage.removeItem('cms_patients');
        localStorage.removeItem('cms_tokenCounter');
        patients = [];
        tokenCounter = 1;
        location.reload();
    }
}