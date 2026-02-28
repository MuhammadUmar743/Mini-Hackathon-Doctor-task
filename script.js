// --- 1. AI Analysis Logic ---
document.getElementById('analyze-btn').addEventListener('click', async () => {
    const symptoms = document.getElementById('symptoms-input').value;
    const resultBox = document.getElementById('ai-result');

    if (!symptoms) {
        alert("Please enter symptoms first!");
        return;
    }

    resultBox.classList.remove('hidden');
    resultBox.innerHTML = "<p><i class='fas fa-spinner fa-spin'></i> AI is analyzing symptoms...</p>";

    try {
        setTimeout(() => {
            const mockAIResponse = `
                <strong>Possible Condition:</strong> Seasonal Flu / Viral Infection<br>
                <strong>Risk Level:</strong> Low<br>
                <strong>Recommendation:</strong> Complete Blood Count (CBC) test and rest.
                <hr>
                <p><em>Urdu: Mareez ko aaram aur hydration ki zaroorat hai.</em></p>
            `;
            resultBox.innerHTML = mockAIResponse;
        }, 2000);
    } catch (error) {
        resultBox.innerHTML = "Error connecting to AI. Please try again.";
    }
});

// --- 2. Modal Controls ---
const modal = document.getElementById('patient-modal');
const openBtn = document.getElementById('open-modal-btn');
const closeBtn = document.querySelector('.close-btn');
const cancelBtn = document.getElementById('cancel-btn');
const form = document.getElementById('add-patient-form');

openBtn.onclick = () => modal.style.display = "block";
const closeModal = () => modal.style.display = "none";
closeBtn.onclick = closeModal;
cancelBtn.onclick = closeModal;

window.onclick = (event) => {
    if (event.target == modal) closeModal();
}

// --- 3. Single Unified Form Submission (Data Save) ---
form.onsubmit = (e) => {
    e.preventDefault();
    
    // Form se values lena
    const name = document.getElementById('p-name').value;
    const age = document.getElementById('p-age').value;
    const gender = document.getElementById('p-gender').value;
    const contact = document.getElementById('p-contact').value;
    const history = document.getElementById('p-history').value || "No history";

    // Object banana
    const newPatient = {
        id: Date.now(), 
        name: name,
        age: age,
        gender: gender,
        contact: contact,
        history: history,
        dateAdded: new Date().toLocaleDateString()
    };

    // 1. LocalStorage se purana data mangwana
    let patients = JSON.parse(localStorage.getItem('patients')) || [];
    
    // 2. Naya patient add karna
    patients.push(newPatient);
    
    // 3. Wapas save karna
    localStorage.setItem('patients', JSON.stringify(patients));

    console.log("Patient Saved:", newPatient);
    alert(`${name} has been registered successfully!`);
    
    // Table update karna, form reset aur modal band
    displayPatients();
    updatePatientSelect();
    displayAppointments();
    form.reset();
    closeModal();
};

// --- 4. Table Display Logic ---
function displayPatients() {
    const tableBody = document.getElementById('patient-list-body');
    if (!tableBody) return; // Check if table exists

    const patients = JSON.parse(localStorage.getItem('patients')) || [];

    tableBody.innerHTML = "";

    if (patients.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center;">No patients found.</td></tr>`;
        return;
    }

    patients.forEach((patient) => {
        const row = `
            <tr>
                <td><strong>${patient.name}</strong></td>
                <td>${patient.age} / ${patient.gender}</td>
                <td>${patient.contact}</td>
                <td>${patient.dateAdded}</td>
                <td>
                    <button class="btn-view" onclick="viewPatient(${patient.id})" title="View History">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-delete" onclick="deletePatient(${patient.id})" title="Delete"><i class="fas fa-trash" style="color:red;"></i></button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

// --- 5. Delete Logic ---
function deletePatient(id) {
    if(confirm("Are you sure you want to delete this patient?")) {
        let patients = JSON.parse(localStorage.getItem('patients')) || [];
        patients = patients.filter(p => p.id !== id);
        localStorage.setItem('patients', JSON.stringify(patients));
        displayPatients();
    }
}

// Page load hote hi data dikhana
document.addEventListener('DOMContentLoaded', displayPatients);



// Search Functionality 
// --- 6. Search Functionality (Improved) ---
const searchInput = document.getElementById('search-patient');

if (searchInput) {
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const tableBody = document.getElementById('patient-list-body');
        const patients = JSON.parse(localStorage.getItem('patients')) || [];

        // Agar search khali hai toh saara data dikhao
        if (searchTerm === "") {
            displayPatients();
            return;
        }

        // Filter karne ka logic
        const filtered = patients.filter(p => 
            p.name.toLowerCase().includes(searchTerm) || 
            p.contact.includes(searchTerm)
        );

        // Table ko update karna
        tableBody.innerHTML = "";

        if (filtered.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center;">No matching patients found.</td></tr>`;
        } else {
            filtered.forEach((p) => {
                tableBody.innerHTML += `
                    <tr>
                        <td><strong>${p.name}</strong></td>
                        <td>${p.age} / ${p.gender}</td>
                        <td>${p.contact}</td>
                        <td>${p.dateAdded}</td>
                        <td>
                            <button class="btn-view"><i class="fas fa-eye"></i></button>
                            <button class="btn-delete" onclick="deletePatient(${p.id})"><i class="fas fa-trash" style="color:red;"></i></button>
                        </td>
                    </tr>
                `;
            });
        }
    });
}



// --- 7. View History Logic ---
const viewModal = document.getElementById('view-modal');

// Patient ka data dekhne ka function
function viewPatient(id) {
    const patients = JSON.parse(localStorage.getItem('patients')) || [];
    const patient = patients.find(p => p.id === id);

    if (patient) {
        // Modal mein data bharna
        document.getElementById('view-name').innerText = patient.name;
        document.getElementById('view-age-gender').innerText = `${patient.age} / ${patient.gender}`;
        document.getElementById('view-contact').innerText = patient.contact;
        document.getElementById('view-date').innerText = patient.dateAdded;
        document.getElementById('view-history').innerText = patient.history || "No medical history provided.";

        // Modal dikhana
        viewModal.style.display = "block";
    }
}

// History Modal band karne ka logic
document.querySelectorAll('.close-history, .close-history-btn').forEach(btn => {
    btn.onclick = () => viewModal.style.display = "none";
});

// Agar bahar click karein toh band ho jaye
window.addEventListener('click', (event) => {
    if (event.target == viewModal) {
        viewModal.style.display = "none";
    }
});

// --- 8. Prescription Logic (Fixed) ---
// --- Medicine Row Add Karne Ka Function ---
function addMedRow() {
    const list = document.getElementById('medicine-list');
    const div = document.createElement('div');
    div.className = 'med-row';
    div.style.marginTop = "10px";
    div.innerHTML = `
        <input type="text" class="med-name" placeholder="Medicine Name">
        <input type="text" class="med-dose" placeholder="Dosage (e.g. 1-0-1)">
        <input type="text" class="med-duration" placeholder="Duration (5 Days)">
    `;
    list.appendChild(div);
}

// --- PDF Generate Karne Ka Function ---
async function generatePrescription() {
    // 1. Check karein ke library load hai ya nahi
    if (!window.jspdf) {
        alert("PDF Library load nahi hui. Internet check karein!");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // 2. Data Get Karein
    const patientName = document.getElementById('presc-patient-select').value;
    const diagnosis = document.getElementById('presc-diagnosis').value;

    if (!patientName) {
        alert("Pehle Patient Select Karein!");
        return;
    }

    // 3. PDF Design (Professional Look)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(40, 116, 166); 
    doc.text("AI SMART CLINIC", 105, 20, { align: "center" });

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Patient Name: ${patientName}`, 20, 40);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 40);
    doc.text(`Diagnosis: ${diagnosis || "General Checkup"}`, 20, 50);

    doc.line(20, 55, 190, 55); // Horizontal Line

    doc.setFont("helvetica", "bold");
    doc.text("Prescribed Medicines:", 20, 65);
    
    // 4. Medicines Loop
    doc.setFont("helvetica", "normal");
    let yPos = 75;
    const medNames = document.querySelectorAll('.med-name');
    const medDoses = document.querySelectorAll('.med-dose');
    const medDurations = document.querySelectorAll('.med-duration');

    let hasMed = false;
    medNames.forEach((med, index) => {
        if (med.value.trim() !== "") {
            hasMed = true;
            const text = `${index + 1}. ${med.value} | Dose: ${medDoses[index].value} | For: ${medDurations[index].value}`;
            doc.text(text, 25, yPos);
            yPos += 10;
        }
    });

    if(!hasMed) doc.text("No medicines added.", 25, yPos);

    // 5. Footer
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Note: This is an AI-generated digital prescription.", 20, 280);

    // 6. Download
    doc.save(`Prescription_${patientName}.pdf`);
}

// --- Dropdown ko update karne ka function ---
function updatePatientSelect() {
    const select = document.getElementById('presc-patient-select');
    if (!select) return;

    const patients = JSON.parse(localStorage.getItem('patients')) || [];
    select.innerHTML = '<option value="">-- Select Patient --</option>';
    
    patients.forEach(p => {
        let option = document.createElement('option');
        option.value = p.name;
        option.textContent = `${p.name} (ID: ${p.id.toString().slice(-4)})`;
        select.appendChild(option);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    displayPatients();      // Table dikhane ke liye
    updatePatientSelect();  // Dropdown dikhane ke liye
});


// --- Appointment Functions ---

// --- Appointment Functions ---

function scheduleAppointment() {
    const patientName = document.getElementById('appt-patient-select').value;
    const time = document.getElementById('appt-time').value;
    const reason = document.getElementById('appt-reason').value;

    if (!patientName || !time) {
        alert("Please select patient and time!");
        return;
    }

    const newAppt = {
        id: Date.now(),
        patient: patientName,
        time: new Date(time).toLocaleString(),
        reason: reason
    };

    let appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    appointments.push(newAppt);
    localStorage.setItem('appointments', JSON.stringify(appointments));

    alert("Appointment Booked!");
    displayAppointments();
}

function displayAppointments() {
    const list = document.getElementById('appointment-list');
    const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    const select = document.getElementById('appt-patient-select');

    // Dropdown update karein (Prescription wale ki tarah)
    const patients = JSON.parse(localStorage.getItem('patients')) || [];
    select.innerHTML = '<option value="">-- Select Patient --</option>';
    patients.forEach(p => {
        select.innerHTML += `<option value="${p.name}">${p.name}</option>`;
    });

    // List dikhayein
    list.innerHTML = "";
    appointments.sort((a, b) => new Date(a.time) - new Date(b.time)); // Date wise sort

    appointments.forEach(appt => {
        list.innerHTML += `
            <li class="appt-item">
                <div class="appt-info">
                    <b>${appt.patient}</b> - ${appt.time} <br>
                    <small>Reason: ${appt.reason}</small>
                </div>
                <button class="btn-delete" onclick="deleteAppointment(${appt.id})">
                    <i class="fas fa-times"></i>
                </button>
            </li>
        `;
    });
}

function deleteAppointment(id) {
    let appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    appointments = appointments.filter(a => a.id !== id);
    localStorage.setItem('appointments', JSON.stringify(appointments));
    displayAppointments();
}

// DOMContentLoaded mein isay bhi add karein
document.addEventListener('DOMContentLoaded', () => {
    displayPatients();
    updatePatientSelect();
    displayAppointments(); // Appointment list load karein
});

let currentRole = 'doctor';

function switchRole(role) {
    currentRole = role;
    // UI update (Active class)
    document.querySelectorAll('.btn-tab').forEach(btn => {
        btn.classList.toggle('active', btn.innerText.toLowerCase().includes(role));
    });
    updateStats();
}

function updateStats() {
    const statsGrid = document.getElementById('stats-container');
    const patients = JSON.parse(localStorage.getItem('patients')) || [];
    const appts = JSON.parse(localStorage.getItem('appointments')) || [];
    
    // Logic for Common Diagnosis
    const diagnosisMap = {};
    patients.forEach(p => {
        if(p.diagnosis) diagnosisMap[p.diagnosis] = (diagnosisMap[p.diagnosis] || 0) + 1;
    });
    const commonDiag = Object.keys(diagnosisMap).reduce((a, b) => diagnosisMap[a] > diagnosisMap[b] ? a : b, "N/A");

    if (currentRole === 'admin') {
        statsGrid.innerHTML = `
            <div class="card admin-card">
                <i class="fas fa-users"></i>
                <div><h3>${patients.length}</h3><p>Total Patients</p></div>
            </div>
            <div class="card admin-card">
                <i class="fas fa-user-md"></i>
                <div><h3>12</h3><p>Total Doctors</p></div>
            </div>
            <div class="card admin-card">
                <i class="fas fa-money-bill-wave"></i>
                <div><h3>Rs. ${appts.length * 1500}</h3><p>Revenue (Est.)</p></div>
            </div>
            <div class="card admin-card">
                <i class="fas fa-chart-line"></i>
                <div><h3>${commonDiag}</h3><p>Top Diagnosis</p></div>
            </div>
        `;
    } else {
        // Doctor View
        statsGrid.innerHTML = `
            <div class="card">
                <i class="fas fa-calendar-day"></i>
                <div><h3>${appts.length}</h3><p>Today's Slots</p></div>
            </div>
            <div class="card">
                <i class="fas fa-file-medical"></i>
                <div><h3>${patients.length}</h3><p>Prescriptions Sent</p></div>
            </div>
            <div class="card">
                <i class="fas fa-clock"></i>
                <div><h3>8</h3><p>Pending Today</p></div>
            </div>
        `;
    }
}

// Initialization update karein
document.addEventListener('DOMContentLoaded', () => {
    displayPatients();
    updatePatientSelect();
    displayAppointments();
    updateStats(); // <--- Stats pehli baar load karne ke liye
});



function renderCharts() {
    const ctx = document.getElementById('patientChart');
    if (!ctx) return;

    // LocalStorage se data lena (Month wise count karne ke liye)
    const patients = JSON.parse(localStorage.getItem('patients')) || [];
    
    // Fake Monthly Data (Asli data ke liye humein date parsing karni hogi)
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const dataCount = [10, 25, 45, 30, 80, patients.length]; // Last month asli count

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'New Patients',
                data: dataCount,
                borderColor: '#2874a6',
                backgroundColor: 'rgba(40, 116, 166, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } }
        }
    });
}

// DomContentLoaded mein isay bhi call karein
document.addEventListener('DOMContentLoaded', () => {
    // ... baqi functions ...
    renderCharts();
});


// --- 9. AI Smart Medicine Suggestions ---
const diagnosisInput = document.getElementById('presc-diagnosis');

if (diagnosisInput) {
    diagnosisInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        
        // Mock AI Database (Aap isay barha sakte hain)
        const suggestions = {
            "fever": { name: "Panadol 500mg", dose: "1-0-1", dur: "3 Days" },
            "infection": { name: "Amoxicillin", dose: "1-1-1", dur: "5 Days" },
            "cough": { name: "Acefyl Syrup", dose: "2 tsp", dur: "5 Days" },
            "flu": { name: "Arinac Forte", dose: "1-0-1", dur: "3 Days" },
            "body pain": { name: "Brufen 400mg", dose: "1-0-1", dur: "3 Days" }
        };

        // Check if diagnosis matches any key
        for (let key in suggestions) {
            if (query.includes(key)) {
                autoFillMedicine(suggestions[key]);
                break; 
            }
        }
    });
}

function autoFillMedicine(data) {
    // Pehli row ke inputs pakrain
    const firstRow = document.querySelector('.med-row');
    const nameInput = firstRow.querySelector('.med-name');
    const doseInput = firstRow.querySelector('.med-dose');
    const durInput = firstRow.querySelector('.med-duration');

    // Agar pehla dabba khali hai toh bhar do
    if (nameInput.value === "") {
        nameInput.value = data.name;
        doseInput.value = data.dose;
        durInput.value = data.dur;
        
        // Chota sa green flash effect taake pata chale update hua hai
        nameInput.style.backgroundColor = "#e8f5e9";
        setTimeout(() => nameInput.style.backgroundColor = "white", 1000);
    }
}


// --- Security Check: Redirect to login if not authenticated ---
(function checkAuth() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser && !window.location.href.includes('login.html')) {
        window.location.href = 'login.html';
    } else if (currentUser) {
        const user = JSON.parse(currentUser);
        // Header mein Dr. ka naam update karein
        const welcomeText = document.querySelector('.header-title h1');
        if(welcomeText) welcomeText.innerText = `Welcome, Dr. ${user.name.split(' ')[0]}`;
    }
})();

// Logout Function
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}