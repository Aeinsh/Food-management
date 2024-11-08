// Data Storage
let foodDonations = [];
let wasteEntries = [];
let notifications = [];
let map;
let markers = [];

// Registration Function
function registerUser() {
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (username && email && password) {
        alert("Registration successful!");
        document.getElementById("registrationSection").style.display = "none";
        document.getElementById("donationFormSection").style.display = "block";
        document.getElementById("foodEntriesSection").style.display = "block";
        document.getElementById("wasteEntryFormSection").style.display = "block";
        document.getElementById("wasteListSection").style.display = "block";
        document.getElementById("analyticsSection").style.display = "block";
        document.getElementById("notificationsSection").style.display = "block";
        document.getElementById("mapSection").style.display = "block";
    } else {
        alert("Please fill in all fields.");
    }
}

// Submit Food Donation
function submitDonation() {
    const foodType = document.getElementById("foodType").value;
    const foodQuantity = document.getElementById("foodQuantity").value;
    const foodLocation = document.getElementById("foodLocation").value;
    const nearbyAreas = document.getElementById("nearbyAreas").value;
    const contactInfo = document.getElementById("contactInfo").value;

    if (foodType && foodQuantity && foodLocation && nearbyAreas && contactInfo) {
        const donation = { foodType, foodQuantity, foodLocation, nearbyAreas, contactInfo, status: "Available" };
        foodDonations.push(donation);
        addNotification(`New food donation: ${foodType}, Quantity: ${foodQuantity}`);
        addMarker(donation);
        saveToDatabase();
        displayDonations();
        displayAnalytics();
        alert("Food donation submitted!");
        document.getElementById("donationForm").reset();
    } else {
        alert("Please fill in all fields.");
    }
}

// Toggle Donation Status
function toggleStatus(index) {
    const donation = foodDonations[index];
    donation.status = donation.status === "Available" ? "Completed" : "Available";
    saveToDatabase();
    displayDonations();
}

// Submit Waste Entry
function submitWasteEntry() {
    const wasteType = document.getElementById("wasteType").value;
    const wasteQuantity = document.getElementById("wasteQuantity").value;

    if (wasteType && wasteQuantity) {
        const waste = { wasteType, wasteQuantity };
        wasteEntries.push(waste);
        addNotification(`New waste entry: ${wasteType}, Quantity: ${wasteQuantity}`);
        saveToDatabase();
        displayWasteEntries();
        displayAnalytics();
        alert("Waste entry submitted!");
        document.getElementById("wasteEntryForm").reset();
    } else {
        alert("Please fill in all fields.");
    }
}

// Add Notification
function addNotification(message) {
    notifications.push(message);
    saveToDatabase();
    displayNotifications();
}

// Initialize Google Map
function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 40.7128, lng: -74.0060 },
        zoom: 12
    });
}

// Add Marker
function addMarker(donation) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: donation.foodLocation }, function(results, status) {
        if (status === "OK") {
            const marker = new google.maps.Marker({
                position: results[0].geometry.location,
                map: map,
                title: donation.foodType
            });
            markers.push(marker);
        }
    });
}

// Display Data Functions
function displayDonations() {
    const foodEntriesTable = document.getElementById("foodEntries");
    foodEntriesTable.innerHTML = "";
    foodDonations.forEach((donation, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${donation.foodType}</td>
            <td>${donation.foodQuantity}</td>
            <td>${donation.foodLocation}</td>
            <td>${donation.nearbyAreas}</td>
            <td>${donation.contactInfo}</td>
            <td>${donation.status}</td>
            <td>
                <button onclick="toggleStatus(${index})">${donation.status === "Available" ? "Mark as Completed" : "Mark as Available"}</button>
                <button onclick="deleteDonation(${index})">Delete</button>
            </td>
        `;
        foodEntriesTable.appendChild(row);
    });
}

function displayWasteEntries() {
    const wasteEntriesTable = document.getElementById("wasteEntries");
    wasteEntriesTable.innerHTML = "";
    wasteEntries.forEach((waste, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${waste.wasteType}</td>
            <td>${waste.wasteQuantity}</td>
            <td><button onclick="deleteWaste(${index})">Delete</button></td>
        `;
        wasteEntriesTable.appendChild(row);
    });
}

function displayNotifications() {
    const notificationsList = document.getElementById("notificationsList");
    notificationsList.innerHTML = "";
    notifications.forEach(notification => {
        const listItem = document.createElement("li");
        listItem.innerText = notification;
        notificationsList.appendChild(listItem);
    });
}

// Delete Donation
function deleteDonation(index) {
    foodDonations.splice(index, 1);
    saveToDatabase();
    displayDonations();
}

// Delete Waste
function deleteWaste(index) {
    wasteEntries.splice(index, 1);
    saveToDatabase();
    displayWasteEntries();
}

// Analytics Calculation
function displayAnalytics() {
    const totalDonations = foodDonations.length;
    const totalWaste = wasteEntries.length;
    const availableDonations = foodDonations.filter(donation => donation.status === "Available").length;
    const completedDonations = totalDonations - availableDonations;

    document.getElementById("analyticsData").innerText = `
        Total Donations: ${totalDonations}
        Total Waste Entries: ${totalWaste}
        Available Donations: ${availableDonations}
        Completed Donations: ${completedDonations}
    `;
}

// Local Storage
function saveToDatabase() {
    localStorage.setItem("foodDonations", JSON.stringify(foodDonations));
    localStorage.setItem("wasteEntries", JSON.stringify(wasteEntries));
    localStorage.setItem("notifications", JSON.stringify(notifications));
}

// Initialize Data from Storage
window.onload = () => {
    foodDonations = JSON.parse(localStorage.getItem("foodDonations")) || [];
    wasteEntries = JSON.parse(localStorage.getItem("wasteEntries")) || [];
    notifications = JSON.parse(localStorage.getItem("notifications")) || [];
    displayDonations();
    displayWasteEntries();
    displayNotifications();
    displayAnalytics();
};
