const API_URL = "http://127.0.0.1:8000/t/turfs";
const BOOKING_URL = "http://127.0.0.1:8000/api/bookings/";

// Function to get query parameters from URL
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Get JWT token from cookies
function getAuthToken() {
    return document.cookie.split('; ').find(row => row.startsWith('access_token='))?.split('=')[1];
}

// Load Turf Details
async function loadTurfDetails() {
    const turfId = getQueryParam("id");
    if (!turfId) {
        alert("Turf ID is missing.");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${turfId}/`);
        const turf = await response.json();

        document.getElementById("turf-name").textContent = turf.name;
        document.getElementById("turf-location").textContent = "📍 " + turf.location;
        document.getElementById("turf-sport").textContent = "🏆 " + turf.sport_type.toUpperCase();
        document.getElementById("turf-price").textContent = `💰 ₹${turf.price_per_hour} / hour`;
        document.getElementById("turf-description").textContent = turf.description;
        document.getElementById("turf-image").src = turf.image || "placeholder.jpg";

        // loadTimeSlots(turfId);
    } catch (error) {
        console.error("Error loading turf:", error);
    }
}

// Load Available Time Slots
async function loadTimeSlots(turfId) {
    try {
        const response = await fetch(`${API_URL}${turfId}/slots/`);
        const slots = await response.json();
        const slotsContainer = document.getElementById("time-slots");
        slotsContainer.innerHTML = "";

        slots.forEach(slot => {
            const slotElement = document.createElement("button");
            slotElement.textContent = `${slot.start_time} - ${slot.end_time}`;
            slotElement.className = "p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 cursor-pointer";
            slotElement.onclick = () => bookTurf(turfId, slot.id);
            slotsContainer.appendChild(slotElement);
        });
    } catch (error) {
        console.error("Error loading slots:", error);
    }
}

// Handle Booking
async function bookTurf(turfId, slotId) {
    const token = getAuthToken();
    if (!token) {
        alert("Please log in to book.");
        window.location.href = "/login";
        return;
    }

    try {
        const response = await fetch(BOOKING_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ turf: turfId, slot: slotId })
        });

        if (response.ok) {
            alert("Booking successful!");
            window.location.href = "/my-bookings";
        } else {
            alert("Booking failed. Try again.");
        }
    } catch (error) {
        console.error("Error booking turf:", error);
    }
}

// Load Turf Details on Page Load
document.addEventListener("DOMContentLoaded", loadTurfDetails);
