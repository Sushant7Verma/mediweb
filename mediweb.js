document.addEventListener("DOMContentLoaded", function () {
    let medicines = [
        { name: "CAP NINTENA 150MG", time: "08:00", taken: false },
        { name: "SEROFLO INHALER 250", time: "08:30", taken: false },
        { name: "TAB MOFIGEN 500MG", time: "09:00", taken: false },
        { name: "TAB LIMCEE 500MG", time: "10:00", taken: false },
        { name: "LIQ TOSSEX NEW 100ML", time: "18:00", taken: false },
        { name: "CAP BENZ 100MG", time: "20:00", taken: false }
    ];

    const medicineList = document.getElementById("medicineList");

    function renderMedicines() {
        medicineList.innerHTML = "";
        medicines.forEach((med, index) => {
            let li = document.createElement("li");
            li.innerHTML = `
                <span>${med.name} - ${med.time}</span>
                <input type="checkbox" ${med.taken ? "checked" : ""} onchange="toggleTaken(${index})">
                <button class="edit" onclick="editMedicine(${index})">✏️</button>
                <button class="delete" onclick="deleteMedicine(${index})">❌</button>
            `;
            medicineList.appendChild(li);
        });
    }

    window.toggleTaken = function (index) {
        medicines[index].taken = !medicines[index].taken;
        saveMedicines();
    };

    window.editMedicine = function (index) {
        let newName = prompt("Edit Medicine Name:", medicines[index].name);
        let newTime = prompt("Edit Time (HH:MM):", medicines[index].time);
        if (newName && newTime) {
            medicines[index] = { name: newName, time: newTime, taken: false };
            saveMedicines();
        }
    };

    window.deleteMedicine = function (index) {
        medicines.splice(index, 1);
        saveMedicines();
    };

    function saveMedicines() {
        localStorage.setItem("medicines", JSON.stringify(medicines));
        renderMedicines();
    }

    document.getElementById("addMedicine").addEventListener("click", function () {
        let name = document.getElementById("medicineName").value;
        let time = document.getElementById("medicineTime").value;
        if (name && time) {
            medicines.push({ name, time, taken: false });
            saveMedicines();
        }
    });

    document.getElementById("enableNotifications").addEventListener("click", function () {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                alert("Notifications enabled!");
            }
        });
    });

    function checkMedicineTimes() {
        let now = new Date();
        let currentTime = now.getHours().toString().padStart(2, "0") + ":" + now.getMinutes().toString().padStart(2, "0");
        medicines.forEach(med => {
            if (med.time === currentTime && !med.taken) {
                new Notification("Medicine Reminder", { body: `Time to take ${med.name}!` });
            }
        });
    }

    setInterval(checkMedicineTimes, 60000); // Check every minute

    function resetCheckBoxes() {
        medicines.forEach(med => med.taken = false);
        saveMedicines();
    }

    let resetCheck = setInterval(() => {
        let now = new Date();
        if (now.getHours() === 0 && now.getMinutes() === 7) { // **Reset at 1:00 AM**
            resetCheckBoxes();
        }
    }, 60000);

    renderMedicines();
});
