document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("turfForm");
    const submitButton = document.getElementById("submit-button");
    const imageUpload = document.getElementById("image-upload");
    const previewImg = document.getElementById("preview-img");
    const fileUploadArea = document.querySelector(".file-upload-area");

    const errorMessages = {
        name: "Turf name must be at least 2 characters.",
        location: "Please enter a valid location.",
        sport_type: "Please select a sport type.",
        price_per_hour: "Price must be a positive number.",
        image: "File must be an image.",
    };

    // 🖼️ Handle Image Preview
    imageUpload.addEventListener("change", function (e) {
        const file = e.target.files[0];
        if (file?.type.startsWith("image/")) {
            previewImg.src = URL.createObjectURL(file);
            previewImg.style.display = "block";
            document.getElementById("image-error").textContent = "";
        } else {
            document.getElementById("image-error").textContent = errorMessages.image;
            previewImg.style.display = "none";
        }
    });

    // 📩 Form Submission
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (!validateForm()) return;

        // Show loading state
        submitButton.disabled = true;
        submitButton.innerHTML = "Submitting...";

        createTurf().finally(() => {
            submitButton.disabled = false;
            submitButton.innerHTML = "Submit Turf";
        });
    });

    // ✅ Validate Form
    function validateForm() {
        let isValid = true;
        const setError = (id, condition) => {
            document.getElementById(`${id}-error`).textContent = condition ? "" : errorMessages[id];
            isValid = isValid && condition;
        };

        setError("name", document.getElementById("name").value.length >= 2);
        setError("location", document.getElementById("location").value.length >= 3);
        setError("sport_type", document.getElementById("sport_type").value);
        setError("price_per_hour", parseFloat(document.getElementById("price_per_hour").value) > 0);

        return isValid;
    }

    // 📂 Drag & Drop File Upload
    ["dragenter", "dragover"].forEach((event) => fileUploadArea.addEventListener(event, highlight));
    ["dragleave", "drop"].forEach((event) => fileUploadArea.addEventListener(event, unhighlight));
    fileUploadArea.addEventListener("drop", handleDrop);

    function highlight() {
        fileUploadArea.style.borderColor = "#22c55e";
        fileUploadArea.style.backgroundColor = "#f0fdf4";
    }

    function unhighlight() {
        fileUploadArea.style.borderColor = "#d1d5db";
        fileUploadArea.style.backgroundColor = "#f9fafb";
    }

    function handleDrop(e) {
        e.preventDefault();
        imageUpload.files = e.dataTransfer.files;
        imageUpload.dispatchEvent(new Event("change"));
    }

    async function createTurf() {
        const formData = new FormData();
        
        // Get values from form inputs
        formData.append("name", document.getElementById("name").value);
        formData.append("location", document.getElementById("location").value);
        formData.append("sport_type", document.getElementById("sport_type").value);
        formData.append("price_per_hour", document.getElementById("price_per_hour").value);
        formData.append("description", document.getElementById("description").value);
        const imageInput = document.getElementById("image-upload");
        if (imageInput.files.length > 0) {
            formData.append("image", imageInput.files[0]);
        }
        const accessToken = getCookie("access_token");
        if (!accessToken) {
            alert("You need to be logged in to add a turf.");
            window.location.href = "/login";
        }
    
        try {
            const response = await fetch("http://127.0.0.1:8000/t/turfs", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${accessToken}`, // Attach Bearer token for authentication
                    "X-CSRFToken": getCSRFToken() // Send CSRF token for security
                },
                body: formData // Send as multipart/form-data
            });
    
            const data = await response.json();
            if (response.ok) {
                alert("Turf added successfully!");
                window.location.href = "/dashboard"; // Redirect after success
            } else {
                alert(data.detail || "Failed to add turf.");
            }
        } catch (error) {
            console.error("Error creating turf:", error);
            alert("Something went wrong. Try again.");
        }
    }
    
});
