// Simulate Data Storage
let foodDonations = [];
let wasteEntries = [];
let notifications = [];

// Registration Function
function registerUser() {
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (username && email && password) {
        alert("Registration successful!");
        document.getElementById("registrationSection").style.display = "none";
        document.getElementById("donationFormSection").style.display = "block";
        document.getElementById("wasteEntryFormSection").style.display = "block";
        document.getElementById("foodListSection").style.display = "block";
        document.getElementById("wasteListSection").style.display = "block";
        document.getElementById("analyticsSection").style.display = "block";
        document.getElementById("mapSection").style.display = "block";
        document.getElementById("notificationsSection").style.display = "block";
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
        saveToDatabase();
        displayDonations();
        alert("Food donation submitted!");
        document.getElementById("donationFormSection").reset();
    } else {
        alert("Please fill in all fields.");
    }
}

// Submit Waste Entry
function submitWasteEntry() {
    const wasteType = document.getElementById("wasteType").value;
    const wasteQuantity = document.getElementById("wasteQuantity").value;

    if (wasteType && wasteQuantity) {
        const waste = { wasteType, wasteQuantity };
        wasteEntries.push(waste);
        saveToDatabase();
        displayWasteEntries();
        alert("Waste entry submitted!");
        document.getElementById("wasteEntryFormSection").reset();
    } else {
        alert("Please fill in all fields.");
    }
}

// Display Donations
function displayDonations() {
    const foodEntriesElement = document.getElementById("foodEntries");
    foodEntriesElement.innerHTML = "";
    foodDonations.forEach((donation, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${donation.foodType}</td>
            <td>${donation.foodQuantity}</td>
            <td>${donation.foodLocation}</td>
            <td>${donation.nearbyAreas}</td>
            <td>${donation.contactInfo}</td>
            <td>${donation.status}</td>
            <td><button onclick="deleteDonation(${index})">Delete</button></td>
        `;
        foodEntriesElement.appendChild(row);
    });
    updateAnalytics();
}

// Display Waste Entries
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
    updateAnalytics();
}

// Delete Donation Entry
function deleteDonation(index) {
    foodDonations.splice(index, 1);
    saveToDatabase();
    displayDonations();
}

// Delete Waste Entry
function deleteWaste(index) {
    wasteEntries.splice(index, 1);
    saveToDatabase();
    displayWasteEntries();
}

// Save to Local Storage
function saveToDatabase() {
    localStorage.setItem("foodDonations", JSON.stringify(foodDonations));
    localStorage.setItem("wasteEntries", JSON.stringify(wasteEntries));
    localStorage.setItem("notifications", JSON.stringify(notifications));
}

// Update Analytics
function updateAnalytics() {
    const analyticsData = document.getElementById("analyticsData");
    const foodCount = foodDonations.length;
    const wasteCount = wasteEntries.length;
    analyticsData.innerText = `Total Donations: ${foodCount}, Total Waste Entries: ${wasteCount}`;
}

// Load Data from Local Storage
function initializeData() {
    foodDonations = JSON.parse(localStorage.getItem("foodDonations")) || [];
    wasteEntries = JSON.parse(localStorage.getItem("wasteEntries")) || [];
    notifications = JSON.parse(localStorage.getItem("notifications")) || [];
    displayDonations();
    displayWasteEntries();
    displayNotifications();
}

// Display Notifications
function displayNotifications() {
    const notificationsList = document.getElementById("notificationsList");
    notificationsList.innerHTML = "";
    notifications.forEach(notification => {
        const listItem = document.createElement("li");
        listItem.innerText = notification;
        notificationsList.appendChild(listItem);
    });
}

// Initialize on Page Load
window.onload = initializeData;

// Map Integration (Google Maps)
function initMap() {
    const mapOptions = {
        zoom: 10,
        center: { lat: 40.7128, lng: -74.0060 }, // Default to New York City
    };
    const map = new google.maps.Map(document.getElementById("map"), mapOptions);

    // Add Marker Example (simulated nearby organizations)
    const marker = new google.maps.Marker({
        position: { lat: 40.7128, lng: -74.0060 }, // Example location
        map: map,
        title: "Nearby Organization"
    });
}
