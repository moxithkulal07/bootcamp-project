// 1. STATIONS DATABASE (Contains all station properties from the prompt)
const stations = [
    { 
        id: 1, 
        name: "Zeon EV Fast Charger", 
        location: "Indiranagar", 
        address: "100 Feet Rd, Bengaluru", 
        type: "CCS2 (Fast)", 
        availability: "Available", 
        hours: "24/7", 
        contact: "+91 98765 11111", 
        info: "400V DC Fast Charger with amenities nearby." 
    },
    { 
        id: 2, 
        name: "Tata Power EZ Charge", 
        location: "Koramangala", 
        address: "80 Feet Rd, 4th Block, Bengaluru", 
        type: "Type 2 (AC)", 
        availability: "Available", 
        hours: "06:00 AM - 11:00 PM", 
        contact: "+91 98765 22222", 
        info: "Suitable for slow overnight or work hours charging." 
    },
    { 
        id: 3, 
        name: "Jio-bp Pulse Hub", 
        location: "HSR Layout", 
        address: "Sector 3, Outer Ring Rd, Bengaluru", 
        type: "CCS2 (Fast)", 
        availability: "Busy", 
        hours: "24/7", 
        contact: "+91 98765 33333", 
        info: "High demand station. Booking ahead recommended." 
    },
    { 
        id: 4, 
        name: "Ather Grid Charger", 
        location: "Whitefield", 
        address: "ITPL Main Rd, Bengaluru", 
        type: "GB/T (Fast)", 
        availability: "Maintenance", 
        hours: "08:00 AM - 08:00 PM", 
        contact: "+91 98765 44444", 
        info: "Currently under maintenance till 5 PM." 
    }
];

// 2. EXISTING BOOKINGS ARRAY (Contains all booking properties from prompt)
let bookings = [
    {
        id: "BK-101",
        stationId: 1,
        stationName: "Zeon EV Fast Charger",
        userName: "Rahul Sharma",
        userEmail: "rahul@example.com",
        userContact: "+91 9812345678",
        vehicleInfo: "Tata Nexon EV (KA-01-AB-1234)",
        date: "2026-08-20",
        time: "14:30",
        notes: "Full charge needed",
        status: "Confirmed"
    }
];

// Initialize application
document.addEventListener("DOMContentLoaded", () => {
    renderStations(stations);
    renderBookings();
    
    // Set minimum date selector to today
    const today = new Date().toISOString().split("T")[0];
    document.getElementById("booking-date").setAttribute("min", today);
});

// Display station cards dynamically
function renderStations(stationList) {
    const container = document.getElementById("station-list");
    container.innerHTML = "";

    if (stationList.length === 0) {
        container.innerHTML = "<p>No stations found matching your search.</p>";
        return;
    }

    stationList.forEach(s => {
        const card = document.createElement("div");
        card.className = "station-card";
        
        let statusClass = "available";
        if (s.availability === "Busy") statusClass = "busy";
        if (s.availability === "Maintenance") statusClass = "maintenance";

        card.innerHTML = `
            <h3>${s.name}</h3>
            <p><strong>Location:</strong> ${s.location} (${s.address})</p>
            <p><strong>Charging Type:</strong> ${s.type}</p>
            <p><strong>Operating Hours:</strong> ${s.hours}</p>
            <p><strong>Contact:</strong> ${s.contact}</p>
            <p><strong>Info:</strong> ${s.info}</p>
            <span class="badge ${statusClass}">${s.availability}</span><br>
            <button type="button" class="btn select-btn" onclick="selectStation(${s.id}, '${s.name}')">Select Station</button>
        `;
        container.appendChild(card);
    });
}

// Filter/Search Stations Function
function filterStations() {
    const searchText = document.getElementById("search-input").value.toLowerCase();
    const typeFilter = document.getElementById("charger-type-filter").value;
    const statusFilter = document.getElementById("availability-filter").value;

    const filtered = stations.filter(s => {
        const matchesSearch = s.name.toLowerCase().includes(searchText) || 
                              s.location.toLowerCase().includes(searchText) || 
                              s.address.toLowerCase().includes(searchText);
        const matchesType = typeFilter === "" || s.type === typeFilter;
        const matchesStatus = statusFilter === "" || s.availability === statusFilter;

        return matchesSearch && matchesType && matchesStatus;
    });

    renderStations(filtered);
}

// Fill Selected Station into the Form
function selectStation(id, name) {
    document.getElementById("station-name").value = name;
    document.getElementById("station-name").dataset.selectedId = id;
    hideMessage();
}

// Helper: Display Global Message Box
function showMessage(msg, isError = true) {
    const msgBox = document.getElementById("message-box");
    msgBox.style.display = "block";
    msgBox.innerText = msg;
    
    if (isError) {
        msgBox.className = "message-box error";
    } else {
        msgBox.className = "message-box success";
    }
}

// Helper: Hide Message Box
function hideMessage() {
    const msgBox = document.getElementById("message-box");
    msgBox.style.display = "none";
}

// STEP-BY-STEP FORM VALIDATION & SUBMIT HANDLER
function handleFormSubmit(event) {
    event.preventDefault(); // Prevents page refresh

    // Retrieve input values
    const bookingId = document.getElementById("editing-booking-id").value;
    const stationName = document.getElementById("station-name").value.trim();
    const stationId = document.getElementById("station-name").dataset.selectedId;
    const userName = document.getElementById("user-name").value.trim();
    const userEmail = document.getElementById("user-email").value.trim();
    const userContact = document.getElementById("user-contact").value.trim();
    const vehicleInfo = document.getElementById("vehicle-info").value.trim();
    const bookingDate = document.getElementById("booking-date").value;
    const bookingTime = document.getElementById("booking-time").value;
    const bookingNotes = document.getElementById("booking-notes").value.trim();

    // 1. Validate Station Selection
    if (!stationName) {
        showMessage("Validation Error: Please select a charging station from the left list.");
        return;
    }

    // 2. Validate User Name
    if (!userName) {
        showMessage("Validation Error: Full Name is required.");
        return;
    }

    // 3. Validate Email Address Format
    if (!userEmail) {
        showMessage("Validation Error: Email Address is required.");
        return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(userEmail)) {
        showMessage("Validation Error: Please enter a valid email address (e.g. name@example.com).");
        return;
    }

    // 4. Validate Contact Info
    if (!userContact) {
        showMessage("Validation Error: Contact information (phone number) is required.");
        return;
    }

    // 5. Validate Vehicle Details
    if (!vehicleInfo) {
        showMessage("Validation Error: Vehicle information (Model/Number) is required.");
        return;
    }

    // 6. Validate Date & Time
    if (!bookingDate) {
        showMessage("Validation Error: Please choose a booking date.");
        return;
    }
    if (!bookingTime) {
        showMessage("Validation Error: Please choose a booking time.");
        return;
    }

    // UPDATE OR CREATE BOOKING
    if (bookingId) {
        // Update existing booking
        const index = bookings.findIndex(b => b.id === bookingId);
        if (index !== -1) {
            bookings[index] = {
                ...bookings[index],
                stationName,
                userName,
                userEmail,
                userContact,
                vehicleInfo,
                date: bookingDate,
                time: bookingTime,
                notes: bookingNotes
            };
            showMessage(`Booking ${bookingId} has been updated successfully!`);
        }
    } else {
        // Create new booking
        const newBooking = {
            id: "BK-" + Math.floor(1000 + Math.random() * 9000),
            stationId: stationId,
            stationName,
            userName,
            userEmail,
            userContact,
            vehicleInfo,
            date: bookingDate,
            time: bookingTime,
            notes: bookingNotes || "None",
            status: "Confirmed"
        };

        bookings.push(newBooking);
        showMessage(`The booking is complete and a mail is sent to your email (${userEmail}).`, false);
    }

    renderBookings();
    resetBookingForm();
}

// Reset form to normal state
function resetBookingForm() {
    document.getElementById("booking-form").reset();
    document.getElementById("editing-booking-id").value = "";
    document.getElementById("station-name").dataset.selectedId = "";
    document.getElementById("form-title").innerText = "Make a Charging Booking";
    document.getElementById("submit-btn").innerText = "Confirm Booking";
    document.getElementById("cancel-edit-btn").classList.add("hidden");
}

// Render Existing Bookings Table
function renderBookings() {
    const tbody = document.getElementById("bookings-table-body");
    tbody.innerHTML = "";

    if (bookings.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;">No bookings found.</td></tr>`;
        return;
    }

    bookings.forEach(b => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><strong>${b.id}</strong></td>
            <td>${b.stationName}</td>
            <td>${b.userName}<br><small>${b.userEmail}</small><br><small>${b.userContact}</small></td>
            <td>${b.vehicleInfo}</td>
            <td>${b.date}<br>${b.time}</td>
            <td><span class="badge available">${b.status}</span></td>
            <td>${b.notes}</td>
            <td>
                <button class="btn action-btn edit-btn" onclick="editBooking('${b.id}')">Update</button>
                <button class="btn action-btn cancel-btn" onclick="cancelBooking('${b.id}')">Cancel</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Edit/Update Existing Booking
function editBooking(id) {
    const b = bookings.find(item => item.id === id);
    if (!b) return;

    // Switch tab to finder/booking view
    switchTab('finder-tab', document.querySelectorAll('.nav-btn')[0]);

    // Fill form with current booking data
    document.getElementById("editing-booking-id").value = b.id;
    document.getElementById("station-name").value = b.stationName;
    document.getElementById("user-name").value = b.userName;
    document.getElementById("user-email").value = b.userEmail;
    document.getElementById("user-contact").value = b.userContact;
    document.getElementById("vehicle-info").value = b.vehicleInfo;
    document.getElementById("booking-date").value = b.date;
    document.getElementById("booking-time").value = b.time;
    document.getElementById("booking-notes").value = b.notes;

    // Change Form Header & Buttons
    document.getElementById("form-title").innerText = `Update Booking (${b.id})`;
    document.getElementById("submit-btn").innerText = "Save Changes";
    document.getElementById("cancel-edit-btn").classList.remove("hidden");
    
    hideMessage();
}

// Cancel Booking Function
function cancelBooking(id) {
    if (confirm(`Are you sure you want to cancel booking ${id}?`)) {
        bookings = bookings.filter(b => b.id !== id);
        renderBookings();
        showMessage(`Booking ${id} was cancelled successfully.`, false);
    }
}

// Navigation Tabs Switcher
function switchTab(tabId, btnElement) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));

    document.getElementById(tabId).classList.add('active');
    btnElement.classList.add('active');
}