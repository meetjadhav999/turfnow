document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const turfid = urlParams.get('turfid');
    const selectedSlots = urlParams.get("slots");
    const totalAmount = urlParams.get("total");

    document.getElementById("selected-slots").textContent = selectedSlots || "No slots selected";
    document.getElementById("total-amount").textContent = totalAmount || "0";

    document.getElementById("payment-form").addEventListener("submit", function (event) {
        event.preventDefault();
        bookTurf(turfid,selectedSlots)
        
    });
});
