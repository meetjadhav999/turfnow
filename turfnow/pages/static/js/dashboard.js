// Mock data for turfs
const mockTurfs = [
    {
      id: "1",
      name: "Green Field Arena",
      location: "123 Sports Lane, City",
      sport_type: "football",
      price_per_hour: 50,
      description: "A premium football turf with floodlights and changing rooms. Perfect for evening matches.",
      image: "https://via.placeholder.com/300x200/4ade80/ffffff?text=Football+Turf",
      bookings: 24,
    },
    {
      id: "2",
      name: "Cricket Stadium",
      location: "456 Play Street, Town",
      sport_type: "cricket",
      price_per_hour: 75,
      description: "Professional cricket pitch with practice nets and pavilion. Ideal for tournaments.",
      image: "https://via.placeholder.com/300x200/93c5fd/ffffff?text=Cricket+Turf",
      bookings: 18,
    },
    {
      id: "3",
      name: "Badminton Court",
      location: "789 Game Avenue, Village",
      sport_type: "badminton",
      price_per_hour: 30,
      description: "Indoor badminton courts with wooden flooring and proper lighting. Available for singles and doubles.",
      image: "https://via.placeholder.com/300x200/c4b5fd/ffffff?text=Badminton+Court",
      bookings: 42,
    },
  ]
  
  // DOM Elements
  const turfsContainer = document.getElementById("turfs-container")
  const emptyState = document.getElementById("empty-state")
  const emptyFilterText = document.getElementById("empty-filter-text")
  const addTurfBtn = document.getElementById("add-turf-btn")
  const addTurfEmptyBtns = document.querySelectorAll(".add-turf-empty")
  const turfFormContainer = document.getElementById("turf-form-container")
  const turfForm = document.getElementById("turf-form")
  const formTitle = document.getElementById("form-title")
  const cancelBtn = document.getElementById("cancel-btn")
  const deleteModal = document.getElementById("delete-modal")
  const cancelDelete = document.getElementById("cancel-delete")
  const confirmDelete = document.getElementById("confirm-delete")
  const filterTabs = document.querySelectorAll(".tab-btn")
  const imageInput = document.getElementById("image")
  const previewImg = document.getElementById("preview-img")
  
  // State
  let turfs = [...mockTurfs]
  let currentFilter = "all"
  let turfToDelete = null
  let editingTurfId = null
  
  // Initialize
  document.addEventListener("DOMContentLoaded", () => {
    renderTurfs()
    setupEventListeners()
  })
  
  // Event Listeners
  function setupEventListeners() {
    // Add turf button
    addTurfBtn.addEventListener("click", () => {
      showTurfForm()
    })
  
    // Add turf from empty state
    addTurfEmptyBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        showTurfForm()
      })
    })
  
    // Cancel form button
    cancelBtn.addEventListener("click", () => {
      hideTurfForm()
    })
  
    // Form submission
    turfForm.addEventListener("submit", (e) => {
      e.preventDefault()
      saveTurf()
    })
  
    // Cancel delete
    cancelDelete.addEventListener("click", () => {
      hideDeleteModal()
    })
  
    // Confirm delete
    confirmDelete.addEventListener("click", () => {
      deleteTurf()
      hideDeleteModal()
    })
  
    // Filter tabs
    filterTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const filter = tab.dataset.filter
        setActiveFilter(filter)
        filterTurfs(filter)
      })
    })
  
    // Image preview
    imageInput.addEventListener("change", (e) => {
      const file = e.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          previewImg.src = e.target.result
        }
        reader.readAsDataURL(file)
      }
    })
  
    // Close dropdowns when clicking outside
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".turf-actions")) {
        const openDropdowns = document.querySelectorAll(".dropdown.show")
        openDropdowns.forEach((dropdown) => {
          dropdown.classList.remove("show")
        })
      }
    })
  }
  
  // Render turfs
  function renderTurfs() {
    const filteredTurfs = currentFilter === "all" ? turfs : turfs.filter((turf) => turf.sport_type === currentFilter)
  
    // Show empty state if no turfs
    if (filteredTurfs.length === 0) {
      turfsContainer.classList.add("hidden")
      emptyState.classList.remove("hidden")
      emptyFilterText.textContent = currentFilter !== "all" ? currentFilter : ""
      return
    }
  
    // Show turfs
    turfsContainer.classList.remove("hidden")
    emptyState.classList.add("hidden")
  
    // Clear container
    turfsContainer.innerHTML = ""
  
    // Add turf cards
    filteredTurfs.forEach((turf) => {
      const turfCard = createTurfCard(turf)
      turfsContainer.appendChild(turfCard)
    })
  }
  
  // Create turf card
  function createTurfCard(turf) {
    const card = document.createElement("div")
    card.className = "card turf-card"
    card.innerHTML = `
      <div class="turf-image">
        <img src="${turf.image}" alt="${turf.name}">
      </div>
      <div class="turf-content">
        <div class="turf-header">
          <div>
            <span class="turf-badge badge-${turf.sport_type}">${turf.sport_type}</span>
            <h3 class="turf-title">${turf.name}</h3>
          </div>
          <div class="turf-actions">
            <button class="action-btn" data-id="${turf.id}">
              <i class="fas fa-ellipsis-vertical"></i>
            </button>
            <div class="dropdown" id="dropdown-${turf.id}">
              <div class="dropdown-item edit-turf" data-id="${turf.id}">
                <i class="fas fa-edit"></i> Edit
              </div>
              <div class="dropdown-divider"></div>
              <div class="dropdown-item danger delete-turf" data-id="${turf.id}">
                <i class="fas fa-trash"></i> Delete
              </div>
            </div>
          </div>
        </div>
        <p class="turf-description">${turf.description}</p>
        <p class="turf-location">${turf.location}</p>
        <div class="turf-footer">
          <div class="turf-price">₹${turf.price_per_hour}/hr</div>
          <div class="turf-bookings">
            <i class="fas fa-calendar"></i> ${turf.bookings} bookings
          </div>
        </div>
      </div>
    `
  
    // Action button click
    const actionBtn = card.querySelector(".action-btn")
    actionBtn.addEventListener("click", (e) => {
      e.stopPropagation()
      const dropdown = card.querySelector(".dropdown")
      dropdown.classList.toggle("show")
    })
  
    // Edit button click
    const editBtn = card.querySelector(".edit-turf")
    editBtn.addEventListener("click", () => {
      editTurf(turf.id)
    })
  
    // Delete button click
    const deleteBtn = card.querySelector(".delete-turf")
    deleteBtn.addEventListener("click", () => {
      showDeleteModal(turf.id)
    })
  
    return card
  }
  
  // Show turf form
  function showTurfForm(turfId = null) {
    // Reset form
    turfForm.reset()
    previewImg.src = "https://via.placeholder.com/100"
  
    if (turfId) {
      // Edit mode
      const turf = turfs.find((t) => t.id === turfId)
      if (turf) {
        document.getElementById("turf-id").value = turf.id
        document.getElementById("name").value = turf.name
        document.getElementById("location").value = turf.location
        document.getElementById("sport_type").value = turf.sport_type
        document.getElementById("price_per_hour").value = turf.price_per_hour
        document.getElementById("description").value = turf.description
        previewImg.src = turf.image
  
        formTitle.textContent = "Edit Turf"
        editingTurfId = turfId
      }
    } else {
      // Add mode
      formTitle.textContent = "Add New Turf"
      editingTurfId = null
    }
  
    turfFormContainer.classList.remove("hidden")
  
    // Scroll to form
    turfFormContainer.scrollIntoView({ behavior: "smooth" })
  }
  
  // Hide turf form
  function hideTurfForm() {
    turfFormContainer.classList.add("hidden")
  }
  
  // Save turf
  function saveTurf() {
    const turfId = document.getElementById("turf-id").value
    const name = document.getElementById("name").value
    const location = document.getElementById("location").value
    const sport_type = document.getElementById("sport_type").value
    const price_per_hour = Number.parseInt(document.getElementById("price_per_hour").value)
    const description = document.getElementById("description").value
  
    // Get image (in a real app, you would upload this to a server)
    const imageUrl = previewImg.src
  
    const turfData = {
      name,
      location,
      sport_type,
      price_per_hour,
      description,
      image: imageUrl,
      bookings: editingTurfId ? turfs.find((t) => t.id === editingTurfId)?.bookings || 0 : 0,
    }
  
    if (editingTurfId) {
      // Update existing turf
      turfs = turfs.map((turf) => (turf.id === editingTurfId ? { ...turf, ...turfData } : turf))
    } else {
      // Add new turf
      const newTurf = {
        id: Date.now().toString(),
        ...turfData,
      }
      turfs.push(newTurf)
    }
  
    // Hide form and render turfs
    hideTurfForm()
    renderTurfs()
  }
  
  // Edit turf
  function editTurf(turfId) {
    showTurfForm(turfId)
  }
  
  // Show delete modal
  function showDeleteModal(turfId) {
    turfToDelete = turfId
    deleteModal.classList.add("show")
  }
  
  // Hide delete modal
  function hideDeleteModal() {
    deleteModal.classList.remove("show")
    turfToDelete = null
  }
  
  // Delete turf
  function deleteTurf() {
    if (turfToDelete) {
      turfs = turfs.filter((turf) => turf.id !== turfToDelete)
      renderTurfs()
    }
  }
  
  // Set active filter
  function setActiveFilter(filter) {
    currentFilter = filter
  
    // Update active tab
    filterTabs.forEach((tab) => {
      if (tab.dataset.filter === filter) {
        tab.classList.add("active")
      } else {
        tab.classList.remove("active")
      }
    })
  }
  
  // Filter turfs
  function filterTurfs(filter) {
    currentFilter = filter
    renderTurfs()
  }
  
  