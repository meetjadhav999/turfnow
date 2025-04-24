async function loadUserBookings() {

    document.getElementById('date').innerHTML = getFormattedDate()

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

async function cancelBooking(bookingId) {
    const accessToken = getCookie("access_token")
    const user = await getUserData(); // Retrieve access token from cookies
    if (!user) {
        alert("You need to be logged in to view your bookings.");
        window.location.href ="/login"
        return
    }
    const response = await fetch(`/bookings/cancel-booking/${bookingId}/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
  
    if (response.status === 200) {
      alert("Booking cancelled (deleted) successfully!");
      location.reload()
    } else {
      const data = await response.json();
      alert(data.detail || "Failed to cancel booking.");
    }
  }

  function getFormattedDate() {
    const today = new Date();
  
    const options = {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    };
  
    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(today);
    return `Today, ${formattedDate}`;
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
            const turf = booking.turf
            bookingContainer.innerHTML += `
                <div class="booking-item">
                    <div class="booking-info">
                        <div class="turf-name">
                            <a href="/turfs?id=${turf.id}">${turf.name}</a>
                        </div>
                        <div class="time-slot">${booking.start_time} - ${booking.end_time}</div>
                    </div>
                    <button class="cancel" onclick="cancelBooking(${booking.id})">Cancel</button>
                </div>
            `;
        }
        catch(e){
            console.log(e)
        }

    });
}


window.onload = loadUserBookings