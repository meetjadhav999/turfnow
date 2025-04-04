function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + value + "; path=/" + expires;
}

function getCookie(name) {
    const cookies = document.cookie.split("; ");
    for (let cookie of cookies) {
        const [key, value] = cookie.split("=");
        if (key === name) return value;
    }
    return null;
}

// Function to handle user login
const loginUser = async (e) => {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const errorMsg = document.getElementById("error-msg");
    const btn = document.getElementById("signin-btn")

    errorMsg.textContent = ""; // Clear previous error messages
    btn.disabled = true;
    try {
        const response = await fetch("http://127.0.0.1:8000/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCSRFToken() 
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Save access and refresh tokens in cookies
            setCookie("access_token", data.access, 1); // 1-day expiry
            setCookie("refresh_token", data.refresh, 7); // 7-day expiry
            
            // Redirect to homepage
            window.location.href = "/";
        } else {
            errorMsg.textContent = data.detail || "Invalid credentials!";
        }

    } catch (error) {
        console.error("Login error:", error);
        errorMsg.textContent = "Something went wrong. Try again.";
    } finally{
        btn.disabled = false
    }
}

const registerUser = async() => {
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
    const errorMsg = document.getElementById("error-msg");
    const signupButton = document.getElementById("signup-btn"); // Get button element

    errorMsg.textContent = ""; // Clear previous errors

    if (password !== confirmPassword) {
        errorMsg.textContent = "Passwords do not match!";
        return;
    }

    signupButton.disabled = true; // Disable button to prevent multiple clicks
    signupButton.textContent = "Signing up..."; // Show loading text

    try {
        const response = await fetch("http://127.0.0.1:8000/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCSRFToken() // Send CSRF token for security
            },
            body: JSON.stringify({ username, email,phone ,password })
        });

        const data = await response.json();

        if (response.ok) {
            alert("Signup successful! Redirecting to login...");
            window.location.href = "/login"; // Redirect to login page
        } else {
            errorMsg.textContent = response.message || "Signup failed!";
        }

    } catch (error) {
        console.error("Signup error:", error);
        errorMsg.textContent = "Something went wrong. Try again.";
    } finally {
        signupButton.disabled = false; // Re-enable button
        signupButton.textContent = "Sign Up"; // Reset button text
    }
}

const getUserData = async() =>{
    const accessToken = getCookie("access_token"); // Get access token from cookies

    if (!accessToken) {
        console.log('no user found')
        return null
    }
    try {
        const response = await fetch("http://127.0.0.1:8000/auth/user", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${accessToken}`
            },
        });

        const data = await response.json();

        if (response.ok) {
            console.log(data)
            return data
        } else {
            return null
        }

    } catch (error) {
        console.error("Signup error:", error);
    }
    
}


const showUserOnNavbar = async ()=>{
    const user = await getUserData();
    const navdiv = document.getElementById("btn-container")
    if(!user) {
      navdiv.innerHTML = `<a href="/login" class="btn btn-outline">Log In</a>
      <a href="/signup" class="btn btn-primary">Sign Up</a>`
    }
    else{
      navdiv.innerHTML= `<a href="/my-bookings">${user.username}</a>`
    }
  }

  window.onload = ()=>{
    showUserOnNavbar()
  };