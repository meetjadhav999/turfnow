const API_URL = "http://127.0.0.1:8000/t/turfs";
const BOOKING_URL = "http://127.0.0.1:8000/bookings/";


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
        console.log(turf.image)
        document.getElementById("turf-imagee").src = turf.image || "placeholder.jpg";

        document.getElementById("turf-name").textContent = turf.name;
        document.getElementById("turf-location").textContent = turf.location;
        document.getElementById("turf-sport").textContent =turf.sport_type.toUpperCase();
        document.getElementById("turf-price").textContent = `${turf.price_per_hour} / hour`;
        document.getElementById("turf-description").textContent = turf.description;
        loadTimeSlots(turfId);
        return turf

    } catch (error) {
        console.error("Error loading turf:", error);
        return 
    }
}

async function loadTimeSlots(turfId) {
    try {

        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const dd = String(today.getDate()).padStart(2, '0');
        const formattedDate = `${yyyy}-${mm}-${dd}`;

        const response = await fetch(`${BOOKING_URL}turf/${turfId}?date=${formattedDate}`);
        const bookings = await response.json();
        const timeSlots = document.querySelectorAll('.time-slot');
        console.log(bookings)
        function convertTo24Hour(timeStr) {
            const [time, modifier] = timeStr.trim().split(' ');
            let [hours, minutes] = time.split(':').map(Number);
        
            if (modifier === 'PM' && hours !== 12) hours += 12;
            if (modifier === 'AM' && hours === 12) hours = 0;
        
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        }
        
        timeSlots.forEach(slot => {
            const timeRange = slot.querySelector('.time').textContent.trim(); // e.g., "09:00 AM - 10:00 AM"
            const startTimeStr = timeRange.split('-')[0].trim();              // "09:00 AM"
            const startTime24 = convertTo24Hour(startTimeStr);                // "09:00"
        
            const isBooked = bookings.some(booking => {
                const bookingTime = booking.start_time.substring(0, 5);       // "09:00"
                return bookingTime === startTime24;
            });
        
            if (isBooked) {
                slot.classList.remove('available');
                slot.classList.add('booked');
                slot.querySelector('.status').textContent = 'Booked';
            } else {
                slot.classList.remove('booked');
                slot.classList.add('available');
                slot.querySelector('.status').textContent = 'Available';
            }
        });
        
    } catch (error) {
        console.error("Error loading slots:", error);
    }
}



// Load Turf Details on Page Load
document.addEventListener("DOMContentLoaded",async()=>{
    const turf = await loadTurfDetails()
    console.log(turf)
    const bookButton = document.getElementById("book-button");
    const modal = document.getElementById("booking-modal");
    const closeModal = document.querySelector(".close");
    const selectedSlotsElement = document.getElementById("selected-slots");
    const totalCostElement = document.getElementById("total-cost");
    const makePaymentButton = document.getElementById("make-payment");

    let selectedSlots = []; // Array to store selected slots
    let pricePerHour = parseInt(turf.price_per_hour); // Example price (modify as needed)
    console.log(pricePerHour)
    function toggleSlot(slotElement, slotTime) {
        if (slotElement.classList.contains("selected")) {
            slotElement.classList.remove("selected");
            selectedSlots = selectedSlots.filter(slot => slot !== slotTime);
        } else {
            if(slotElement.classList.contains('available')){
                slotElement.classList.add("selected");
                selectedSlots.push(slotTime);
            }
            
        }
    }
    document.querySelectorAll(".time-slot.available").forEach(slot => {
        slot.addEventListener("click", function () {
            const slotTime = this.querySelector(".time").textContent;
            toggleSlot(this, slotTime);
        });
    });
    bookButton.addEventListener("click", function () {
        if (selectedSlots.length === 0) {
            alert("Please select at least one time slot.");
            return;
        }

        selectedSlotsElement.textContent = selectedSlots.join(", ");
        totalCostElement.textContent = selectedSlots.length * pricePerHour;
        modal.style.display = "block";
    });
    closeModal.addEventListener("click", function () {
        modal.style.display = "none";
    });
    makePaymentButton.addEventListener("click", function () {
        const queryParams = new URLSearchParams({
            turfid:turf.id,
            slots: selectedSlots.join(","),
            total: totalCostElement.textContent
        }).toString();

        window.location.href = `/payment?${queryParams}`;
    });

    // Close modal if user clicks outside the content
    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
} );
