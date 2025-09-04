// =================================================================
// --- 1. GLOBAL SCOPE: MAP INITIALIZATION & HELPER FUNCTIONS ---
// =================================================================

// Global variables for map components, accessible by all functions
let map, marker, geocoder;

/**
 * Initializes the Google Map. This function is called by the Google Maps API
 * script's callback parameter once it has fully loaded.
 */
function initMap() {
  console.log("initMap called by Google Maps API.");

  const mapElement = document.getElementById("map");
  if (!mapElement) {
    console.error("CRITICAL: Map container div with ID 'map' was not found.");
    return;
  }

  const defaultLocation = { lat: 6.9271, lng: 79.8612 }; // Colombo

  map = new google.maps.Map(mapElement, {
    center: defaultLocation,
    zoom: 8,
  });

  marker = new google.maps.Marker({
    position: defaultLocation,
    map: map,
    draggable: true,
  });

  geocoder = new google.maps.Geocoder();

  google.maps.event.addListener(marker, 'dragend', () => updateLocationUI(marker.getPosition()));
  google.maps.event.addListener(map, 'click', (event) => updateLocationUI(event.latLng));
}

/**
 * Updates the map center and marker to a new location.
 * @param {string|number} lat The latitude.
 * @param {string|number} lng The longitude.
 */
function updateMapLocation(lat, lng) {
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);

  if (isNaN(latitude) || isNaN(longitude)) {
    console.error("Invalid latitude or longitude received:", lat, lng);
    return;
  }

  const newLocation = { lat: latitude, lng: longitude };

  if (map && marker) {
    map.setCenter(newLocation);
    marker.setPosition(newLocation);
    map.setZoom(16);
  }
}

/**
 * Updates the UI input fields based on map interaction (reverse geocoding).
 * @param {google.maps.LatLng} latLng The LatLng object from the map event.
 */
function updateLocationUI(latLng) {
  if (!latLng) return;

  $('#latitude').val(latLng.lat().toFixed(6));
  $('#longitude').val(latLng.lng().toFixed(6));

  geocoder.geocode({ location: latLng }, (results, status) => {
    if (status === "OK" && results[0]) {
      $('#address').val(results[0].formatted_address);
    } else {
      console.warn("Reverse geocode failed with status:", status);
      $('#address').val("Could not determine address.");
    }
  });
}


// =================================================================
// --- 2. DOCUMENT READY: MAIN LOGIC & EVENT LISTENERS SETUP ---
// =================================================================

$(document).ready(function () {
  console.log("Document is ready. Initializing all dashboard components...");

  // Setup event listeners for all interactive components
  setupProfileEventListeners();
  setupGalleryModalListeners();
  setupPackageModalListeners();
  setupSpecialOfferModalListeners();
  setupCalendarListeners();
  getImages();

  // Initialize the availability calendar
  initCalendar();

  // Fetch initial data to populate the dashboard
  getUserinfo();

  
  $('#galleryGridContainer').on('click', '.remove-image-btn', function (event) {
  event.stopPropagation();

  const imageId = $(this).data('image-id');
  console.log("Attempting to delete image with ID:", imageId);

  if (!imageId) {
    console.error("Image ID not found on the button.");
    return;
  }

  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        url: `http://localhost:8080/business/deleteImage/${imageId}`,
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
        success: function (response) {
          Swal.fire('Deleted!', 'The photo has been successfully removed.', 'success');

          // Gallery එක refresh කරනවා
          getImages(); // <--- 4. නිවැරදි function නම call කරනවා
        },
        error: function (jqXHR) {
          console.error("Failed to delete image:", jqXHR.responseText);
          Swal.fire('Error!', 'Could not remove the photo.', 'error');
        }
      });
    }
  });
});

});


// =================================================================
// --- 3. SETUP FUNCTIONS (Called from document.ready) ---
// =================================================================

/**
 * Sets up all event listeners related to the main profile section.
 */
function setupProfileEventListeners() {
  $('#changeProfilePicBtn').on('click', () => $('#profileImageInput').click());
  $('#profileImageInput').on('change', handleProfilePictureUpload);

  const profileFields = $('#businessName, #contactNumber, #description, #latitude, #longitude, #district, #address');
  const editProfileBtn = $('#editProfileBtn');
  const submitProfileBtn = $('#submitProfileBtn');
  let isEditMode = false;

  profileFields.prop('readonly', true);
  submitProfileBtn.hide();

  editProfileBtn.on('click', function () {
    isEditMode = !isEditMode;
    profileFields.prop('readonly', !isEditMode);
    submitProfileBtn.toggle(isEditMode);
    if (isEditMode) {
      editProfileBtn.text('Cancel Edit').removeClass('bg-purple-200').addClass('bg-red-200 text-red-700');
    } else {
      editProfileBtn.text('Edit Business Profile Info').removeClass('bg-red-200 text-red-700').addClass('bg-purple-200');
    }
  });

  submitProfileBtn.on('click', updateProfile);
}

function setupGalleryModalListeners() {
  const addPhotoModal = $('#addPhotoModal');
  const imageInput = $('#imageInput');
  const previewImg = $('#previewImg');
  const imagePreviewContainer = $('#imagePreview');
  const imageUploadArea = $('#imageUploadArea');

  // --- Helper functions with UNIQUE names for the Gallery ---

  const openGalleryModal = () => {
    addPhotoModal.removeClass('hidden');
    $('body').css('overflow', 'hidden');
  };

  const closeGalleryModal = () => {
    addPhotoModal.addClass('hidden');
    $('body').css('overflow', 'auto');
    imageInput.val('');
    previewImg.attr('src', '');
    imagePreviewContainer.addClass('hidden');
    $('#imageDescription').val('');
    $('#imageSubtitle').val('');
  };

  const handleGalleryFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        previewImg.attr('src', e.target.result);
        imagePreviewContainer.removeClass('hidden');
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please select a valid image file.');
    }
  };

  // --- Event listeners now call the UNIQUE functions ---
  $('#addPhotoBtn').on('click', openGalleryModal);
  $('#closeModal, #cancelBtn').on('click', closeGalleryModal);
  addPhotoModal.on('click', (e) => { if ($(e.target).is(addPhotoModal)) closeGalleryModal(); });
  imageInput.on('change', function () { handleGalleryFile(this.files[0]); });

  imageUploadArea.on('dragover', (e) => { e.preventDefault(); imageUploadArea.addClass('border-blue-400 bg-blue-50'); })
    .on('dragleave', (e) => { e.preventDefault(); imageUploadArea.removeClass('border-blue-400 bg-blue-50'); })
    .on('drop', function (e) {
      e.preventDefault();
      imageUploadArea.removeClass('border-blue-400 bg-blue-50');
      handleGalleryFile(e.originalEvent.dataTransfer.files[0]);
    });

  $('#saveBtn').on('click', handleGalleryImageSave);
}

function setupPackageModalListeners() {
  const packageModal = $('#addPackageModal');

  // --- Helper functions with UNIQUE names for Packages ---
  const openPackageModal = () => {
    packageModal.removeClass('hidden');
    $('body').css('overflow', 'hidden');
  };

  const closePackageModal = () => {
    packageModal.addClass('hidden');
    $('body').css('overflow', 'auto');
    // TODO: Reset package form fields here
  };

  // --- Event listeners now call the UNIQUE functions ---
  $('#addPackageBtn').on('click', openPackageModal);
  $('#closePackageModal, #cancelPackageBtn').on('click', closePackageModal);
  packageModal.on('click', (e) => { if ($(e.target).is(packageModal)) closePackageModal(); });

  $('#savePackageBtn').on('click', handlePackageSave);

  $('#refreshBtn').on('click', function () {
    getImages()
  });
}


/**
 * Fetches images from the backend and dynamically renders them in the gallery grid.
 */
function getImages() { // <--- 1. Spelling නිවැරදි කළා: getImages
  console.log("Fetching gallery images...");
  $.ajax({
    url: 'http://localhost:8080/business/getImages',
    method: 'GET',
    headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
    success: (response) => {
      console.log("Image data received:", response);

      if (response.status === 200 && Array.isArray(response.data)) {
        const images = response.data;
        const galleryGrid = $('#galleryGridContainer');

        galleryGrid.find('.existing-image').remove();

        images.forEach(image  => {
          let id = 0;
          const fullImageUrl = image.imageUrl ? image.imageUrl : 'https://source.unsplash.com/400x300/?hotel';

          const imageCardHtml = `
                        <div class="existing-image group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                            <img src="${fullImageUrl}"
                                class="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-110"
                                alt="${image.title || 'Hotel Image'}" />
                            
                            <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <button class="remove-image-btn bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition shadow-lg" data-image-id="${image.id}">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            
                            <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-white">
                                <p class="text-sm font-medium">${image.title || 'No Title'}</p>
                                <p class="text-xs opacity-80">${image.subtitle || 'No Subtitle'}</p>
                            </div>
                        </div>
                    `;
          galleryGrid.append(imageCardHtml);
        });

        $('#photoCount').text(images.length);

      } else {
        console.error("Received data is not in the expected format.");
      }
    },
    error: function (jqXHR) {
      console.error("Failed to load gallery images:", jqXHR.responseText);
      Swal.fire("Error!", "Could not load gallery images.", "error");
    }
  });
}


/**
 * Event listener for the remove image button (uses event delegation).
 */


function setupSpecialOfferModalListeners() {
  const offerModal = $('#addSpecialOfferModal');

  // --- Helper functions with UNIQUE names for Offers ---
  const openOfferModal = () => {
    offerModal.removeClass('hidden');
    $('body').css('overflow', 'hidden');
  };

  const closeOfferModal = () => {
    offerModal.addClass('hidden');
    $('body').css('overflow', 'auto');
    // TODO: Reset special offer form fields here
  };

  // --- Event listeners now call the UNIQUE functions ---
  $('#addSpecialOfferBtn').on('click', openOfferModal);
  $('#closeSpecialOfferModal, #cancelSpecialOfferBtn').on('click', closeOfferModal);
  offerModal.on('click', (e) => { if ($(e.target).is(offerModal)) closeOfferModal(); });

  $('#saveSpecialOfferBtn').on('click', handleSpecialOfferSave);
}


// =================================================================
// --- 4. AJAX & DATA HANDLING FUNCTIONS ---
// =================================================================

/**
 * Fetches business details from the backend and populates the form and map.
 */
function getUserinfo() {
  console.log("Attempting to fetch user info...");
  $.ajax({
    url: 'http://localhost:8080/business/GetDetails',
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
    success: function (response) {
      console.log("User info received successfully:", response.data);
      const businessData = response.data;

      // Populate form fields
      $('#businessName').val(businessData.businessName || '');
      $('#contactNumber').val(businessData.phoneNumber || '');
      $('#description').val(businessData.description || '');
      $('#latitude').val(businessData.latitude || '');
      $('#longitude').val(businessData.longitude || '');
      $('#address').val(businessData.address || '');
      $('#district').val(businessData.district || '');

      // Update the map with the fetched location
      if (businessData.latitude && businessData.longitude) {
        updateMapLocation(businessData.latitude, businessData.longitude);
      }

      // Check for incomplete profile
      let incompleteFields = [];
      if (!businessData.businessName) incompleteFields.push("Business Name");
      if (!businessData.phoneNumber) incompleteFields.push("Contact Number");
      if (!businessData.description) incompleteFields.push("Description");
      if (!businessData.latitude) incompleteFields.push("Location");
      if (!businessData.address) incompleteFields.push("Address");
      if (!businessData.district) incompleteFields.push("District");

      if (incompleteFields.length > 0) {
        const alertMessage = "Welcome! Please complete your business profile. The following fields are missing:\n\n- " + incompleteFields.join("\n- ");
        alert(alertMessage);
      }
    },
    error: function (jqXHR) {
      console.error("Failed to get user info:", jqXHR.responseText);
    }
  });
}

/**
 * Handles the file upload for the profile picture.
 */
function handleProfilePictureUpload() {
  const file = this.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('image', file);

  $.ajax({
    url: 'http://localhost:8080/business/profilePicture',
    method: 'POST',
    data: formData,
    processData: false, contentType: false,
    headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
    success: (response) => {
      $('#profileImagePreview').attr('src', response.data);
      Swal.fire("Success!", "Profile image updated.", "success");
    },
    error: () => Swal.fire("Error!", "Profile image update failed.", "error")
  });
}

/**
 * Sends updated profile details to the backend.
 */
function updateProfile() {
  const updatedData = {
    description: $('#description').val().trim(),
    latitude: $('#latitude').val().trim(),
    longitude: $('#longitude').val().trim(),
    address: $('#address').val().trim(),
    district: $('#district').val().trim()
  };

  $.ajax({
    url: 'http://localhost:8080/business/updateBusiness',
    method: 'PATCH',
    contentType: 'application/json',
    data: JSON.stringify(updatedData),
    headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
    success: (response) => {
      Swal.fire("Success!", "Profile details updated.", "success");
      $('#editProfileBtn').click(); // Exit edit mode
    },
    error: () => Swal.fire("Error!", "Profile update failed.", "error")
  });
}

/**
 * Handles saving a new gallery image.
 */
function handleGalleryImageSave() {
  const imageFile = $('#imageInput')[0].files[0];
  const description = $('#imageDescription').val().trim();
  const subtitle = $('#imageSubtitle').val().trim();

  if (!imageFile || !description || !subtitle) {
    alert('Please select an image and fill all fields.');
    return;
  }

  const formData = new FormData();
  formData.append('image', imageFile);
  formData.append('title', description);
  formData.append('subtitle', subtitle);

  console.log("Saving gallery photo...");
  // TODO: Replace with your actual AJAX call
  $.ajax({
    url: 'http://localhost:8080/business/imageGallery',
    method: 'POST',
    data: formData,
    processData: false,
    contentType: false,
    headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
    success: function (response) {
      $('#closeModal').click(); // Close the modal
      // TODO: Add a function to refresh the gallery view
      // loadGalleryImages(); 
      Swal.fire("Success!", "Image added to gallery.", "success");
    },
    error: function (jqXHR) {
      Swal.fire("Error!", "Failed to add image.", "error");
    }
  });
}



/**
 * Handles saving a new package.
 */
function handlePackageSave() {
  // Collect all data from the package form and validate
  // ...
  console.log("Saving package...");
  alert('Package save functionality not connected to backend yet.');
  $('#closePackageModal').click();
}

/**
 * Handles saving a new special offer.
 */
function handleSpecialOfferSave() {
  // Collect all data from the special offer form and validate
  // ...
  console.log("Saving special offer...");
  alert('Special offer save functionality not connected to backend yet.');
  $('#closeSpecialOfferModal').click();
}


// =================================================================
// --- 5. CALENDAR LOGIC ---
// =================================================================

let calendar_currentDate = new Date();
let calendar_currentMonth = calendar_currentDate.getMonth();
let calendar_currentYear = calendar_currentDate.getFullYear();
let calendar_availabilityData = {};

function initCalendar() {
  updateMonthDisplay();
  generateCalendar();
  // updateSummary();
}

function setupCalendarListeners() {
  $('#prevMonthBtn').on('click', () => {
    calendar_currentMonth--;
    if (calendar_currentMonth < 0) {
      calendar_currentMonth = 11;
      calendar_currentYear--;
    }
    initCalendar();
  });

  $('#nextMonthBtn').on('click', () => {
    calendar_currentMonth++;
    if (calendar_currentMonth > 11) {
      calendar_currentMonth = 0;
      calendar_currentYear++;
    }
    initCalendar();
  });

  $('#calendarDays').on('click', 'div', function () {
    const dateKey = $(this).data('date');
    if (dateKey) {
      showDateConfirmationModal(dateKey, $(this));
    }
  });

  $('#confirmDateBtn').on('click', confirmDateStatusChange);
  $('#closeDateModal, #cancelDateBtn').on('click', closeDateConfirmationModal);

  // ... (Your other calendar button listeners: set all, save, etc.)
}

function updateMonthDisplay() {
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  $('#currentMonthDisplay').text(`${monthNames[calendar_currentMonth]} ${calendar_currentYear}`);
}

function generateCalendar() {
  const calendarDays = $('#calendarDays');
  calendarDays.empty();

  const firstDay = new Date(calendar_currentYear, calendar_currentMonth, 1);
  const lastDay = new Date(calendar_currentYear, calendar_currentMonth + 1, 0).getDate();
  const firstDayOfWeek = firstDay.getDay();

  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarDays.append('<div class="p-2"></div>');
  }

  for (let day = 1; day <= lastDay; day++) {
    const dateKey = `${calendar_currentYear}-${String(calendar_currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const isOpen = calendar_availabilityData[dateKey] !== false;
    const dayClass = isOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700';

    const dayElement = $(`<div class="p-3 text-center rounded-lg cursor-pointer transition hover:scale-105 ${dayClass}" data-date="${dateKey}">${day}</div>`);
    calendarDays.append(dayElement);
  }
}

// ... (Your other calendar helper functions: showDateConfirmationModal, updateSummary, etc.)
let selectedDateKey = null;
let selectedDayElement = null;

function showDateConfirmationModal(dateKey, dayElement) {
  selectedDateKey = dateKey;
  selectedDayElement = dayElement;
  // ... logic to update and show the modal
  $('#dateConfirmationModal').removeClass('hidden');
}

function closeDateConfirmationModal() {
  $('#dateConfirmationModal').addClass('hidden');
}

function confirmDateStatusChange() {
  if (!selectedDateKey) return;
  const selectedStatus = $('input[name="dateStatus"]:checked').val();
  calendar_availabilityData[selectedDateKey] = (selectedStatus === 'open');
  initCalendar(); // Regenerate calendar to reflect changes
  closeDateConfirmationModal();
}