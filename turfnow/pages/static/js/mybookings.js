async function loadUserBookings() {
    const accessToken = getCookie("access_token")
    const user = await getUserData(); // Retrieve access token from cookies
    if (!user) {
        alert("You need to be logged in to view your bookings.");
        window.location.href ="/login"
        return
    }

    try {
        const response = await fetch("http://127.0.0.1:8000/bookings/list", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${accessToken}`, // Send token for authentication
                "Content-Type": "application/json"
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || "Failed to fetch bookings.");
        }

        displayBookings(data); // Call function to display bookings
    } catch (error) {
        console.error("Error loading bookings:", error);
        alert("Something went wrong. Please try again.");
    }
}

function displayBookings(bookings) {
    const bookingContainer = document.getElementById("booking-list"); // Target container
    bookingContainer.innerHTML = ""; // Clear previous bookings

    if (bookings.length === 0) {
        bookingContainer.innerHTML = `<div class="empty-state">
                <p>You don't have any bookings for today.</p>
            </div>`;
        return;
    }

    bookings.forEach(async booking => {
        console.log(booking)
        try{
            const response = await fetch(`http://127.0.0.1:8000/t/turfs/${booking.turf}/`);
            const turf = await response.json();
            bookingContainer.innerHTML += `
                <div class="booking-item">
                    <div class="booking-info">
                        <div class="turf-name">
                            <a href="/turfs?id=${turf.id}">${turf.name}
                        </div>
                        <div class="time-slot">${booking.start_time} - ${booking.end_time}</div>
                    </div>
                </div>
            `;
        }
        catch(e){
            console.log(e)
        }

    });
}


window.onload = loadUserBookings