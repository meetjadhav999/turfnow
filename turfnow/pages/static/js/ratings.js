const stars = document.querySelectorAll('#stars span');
    let selectedRating = 0;

    stars.forEach((star, index) => {
      star.addEventListener('click', () => {
        selectedRating = index + 1;
        updateStars(selectedRating);
      });
    });

    function updateStars(rating) {
      stars.forEach((star, index) => {
        star.classList.toggle('selected', index < rating);
      });
    }

    function submitReview() {
      const reviewText = document.getElementById('reviewText').value;
      if (selectedRating === 0 || reviewText.trim() === "") {
        alert("Please select a rating and write a review.");
        return;
      }



      submitTurfRating(selectedRating, reviewText)

      // You can replace the alert with an AJAX call to submit to a server
    }

    async function submitTurfRating(rating, reviewText) {

        const turfId = getQueryParam("id");
        if (!turfId) {
            alert("Turf ID is missing.");
            return;
        }


        const user = await getUserData() // Get access token from cookies

        if (!user) {
            alert("You are not logged in. Redirecting to Login")
            window.location.href = "/login";
            return
        }
        const accessToken = getCookie("access_token"); // Get access token from cookies

        if (!accessToken) {
            console.log('no user found')
            return null
        }
        try{

            const response = await fetch('/api/ratings/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`  // Token should be passed from login
            },
            body: JSON.stringify({
                turf: turfId,
                rating: rating,
                review: reviewText
            })
            });
        
            if (!response.ok) {
            const errorData = await response.json();
            console.error("Error submitting rating:", errorData);
            alert("Failed to submit review. Please try again.");
            return;
            }
        
            const data = await response.json();
            alert("Review submitted successfully!");
            console.log("Submitted rating:", data);
        }
        catch(e){
            alert("You have already submitted your review.")
        }
      }