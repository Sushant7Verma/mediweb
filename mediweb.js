// Default medicine list
const defaultMedicines = [
    { name: "Nintedanib 150MG", time: "Morning-Night", taken: false },
    { name: "Seroflo Inhaler", time: "Morning-Night", taken: false },
    { name: "Mycophenolate 500MG", time: "Morning-Night", taken: false },
    { name: "Ascorbic Acid 500MG", time: "Morning", taken: false },
    { name: "Triprolidine + Codeine", time: "PRN/SOS", taken: false },
    { name: "Benzonatate 100MG", time: "PRN/SOS", taken: false }
];

// Load medicines from local storage
function loadMedicines() {
    const medicines = JSON.parse(localStorage.getItem("medicines")) || defaultMedicines;
    const medicineList = document.getElementById("medicine-list");
    medicineList.innerHTML = "";

    medicines.forEach((med, index) => {
        const div = document.createElement("div");
        div.classList.add("medicine-item");
        div.innerHTML = `
            <span>${med.name} (${med.time})</span>
            <input type="checkbox" ${med.taken ? "checked" : ""} data-index="${index}">
            <button class="delete" data-index="${index}">🗑</button>
        `;
        medicineList.appendChild(div);
    });

    // Attach event listeners
    document.querySelectorAll("input[type=checkbox]").forEach(checkbox => {
        checkbox.addEventListener("change", toggleMedicine);
    });
    document.querySelectorAll(".delete").forEach(button => {
        button.addEventListener("click", deleteMedicine);
    });
}

// Toggle medicine taken status
function toggleMedicine(e) {
    const medicines = JSON.parse(localStorage.getItem("medicines")) || defaultMedicines;
    const index = e.target.dataset.index;
    medicines[index].taken = e.target.checked;
    localStorage.setItem("medicines", JSON.stringify(medicines));
}

// Delete a medicine
function deleteMedicine(e) {
    const medicines = JSON.parse(localStorage.getItem("medicines")) || defaultMedicines;
    const index = e.target.dataset.index;
    medicines.splice(index, 1);
    localStorage.setItem("medicines", JSON.stringify(medicines));
    loadMedicines();
}

// Add new medicine
document.getElementById("add-medicine").addEventListener("click", () => {
    const name = prompt("Enter medicine name:");
    const time = prompt("Enter medicine time (Morning/Night/etc.):");
    if (name && time) {
        const medicines = JSON.parse(localStorage.getItem("medicines")) || defaultMedicines;
        medicines.push({ name, time, taken: false });
        localStorage.setItem("medicines", JSON.stringify(medicines));
        loadMedicines();
    }
});

// Reset medicines at 1:00 AM
function resetMedicines() {
    const medicines = JSON.parse(localStorage.getItem("medicines")) || defaultMedicines;
    medicines.forEach(med => med.taken = false);
    localStorage.setItem("medicines", JSON.stringify(medicines));
    loadMedicines();
}

// Schedule reset at 1:00 AM
setInterval(() => {
    const now = new Date();
    if (now.getHours() === 1 && now.getMinutes() === 0) {
        resetMedicines();
    }
}, 60000); // Check every 1 min

// Notification permission request
document.getElementById("notifyBtn").addEventListener("click", () => {
    Notification.requestPermission().then(permission => {
        if (permission === "granted") {
            new Notification("Medicine Reminder", { body: "Notifications enabled!" });
        }
    });
});

// Send notifications
function sendNotification() {
    if (Notification.permission === "granted") {
        new Notification("Medicine Reminder", {
            body: "Time to take your medicine 💊",
            icon: "https://cdn-icons-png.flaticon.com/512/2921/2921822.png"
        });
    }
}

// Notify every morning and night
setInterval(() => {
    const now = new Date();
    if ((now.getHours() === 8 || now.getHours() === 20) && now.getMinutes() === 0) {
        sendNotification();
    }
}, 60000); // Check every 1 min

// Load medicines on startup
loadMedicines();
