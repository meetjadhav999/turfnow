async function loadTurfs() {
    try {
        const response = await fetch('http://127.0.0.1:8000/t/turfs', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch turfs: ${response.statusText}`);
        }

        const turfs = await response.json();
        console.log('Fetched turfs:', turfs);

        const turfList = document.getElementById('turfs');
        turfList.innerHTML = '';
        if(turfList.length ==0){
            turfList.innerHTML = "no turfs to show"
        }else{
        turfs.forEach(turf => {
          var image = "/static/images/placeholder.jpg"
          if(turf.image){
            image = turf.image
          }
            const turfCard = `
                <div class="turf-card">
              <div class="turf-image">
                <img src="${image}" alt="">
              </div>
              <div class="turf-content">
                <div class="turf-info">
                  <div>
                    <h3>${turf.name}</h3>
                    <div class="turf-location">
                      <i class="fas fa-map-marker-alt"></i>
                      <span>${turf.location}</span>
                    </div>
                  </div>
                  <div class="turf-rating">
                    <i class="fas fa-star"></i>
                    <span>${turf.rating}</span>
                  </div>
                </div>
                <div class="turf-footer">
                  <div class="turf-price">${turf.price_per_hour}/hr</div>
                  <a class="btn btn-outline-secondary" href="/turfs?id=${turf.id}">View Details</a>
                </div>
              </div>
            </div>
            `;
            turfList.innerHTML += turfCard;
        
        });
        }
    } catch (error) {
        console.error('Error loading turfs:', error);
        alert('Failed to load turfs. Please try again.');
    }
}


// Example function for booking a turf

document.addEventListener('DOMContentLoaded',async()=>{
  loadTurfs()
})