
// Get JWT token from cookies
function getAuthToken() {
    return document.cookie.split('; ').find(row => row.startsWith('access_token='))?.split('=')[1];
}




function convertToShortTime(timeStr) {
    const [hourMin, period] = timeStr.split(' ');
    let [hour, minute] = hourMin.split(':');

    hour = parseInt(hour, 10); // Remove leading zero
    return `${hour} ${period}`;
}
// Handle Booking
async function bookTurf(turfId, slots) {
    const token = getAuthToken();
    if (!token) {
        alert("Please log in to book.");
        window.location.href = "/login";
        return;
    }

    try {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const dd = String(today.getDate()).padStart(2, '0');
        console.log(slots.split('-')[0].trim())
        const formattedDate = `${yyyy}-${mm}-${dd}`;
        const response = await fetch('http://127.0.0.1:8000/bookings/create', {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ turf: turfId, date:formattedDate ,start_time:convertToShortTime(slots.split('-')[0].trim())})
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

