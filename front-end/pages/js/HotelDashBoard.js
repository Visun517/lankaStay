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

  setupProfileEventListeners();
  setupGalleryModalListeners();
  setupPackageModalListeners();
  setupSpecialOfferModalListeners();
  setupCalendarListeners();
  getImages();
  getProfilePicture();
  initCalendar();
  getUserinfo();
  getAllPackages();
  getAllSpecialOffers();




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

  $('#packagesListContainer').on('click', '.remove-package-btn', function (event) {
    event.stopPropagation();

    const packageId = $(this).data('package-id');
    console.log("Attempting to delete package with ID:", packageId);

    if (!packageId) {
      console.error("package ID not found on the button.");
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
          url: `http://localhost:8080/business/deletePackage/${packageId}`,
          method: 'DELETE',
          headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
          success: function (response) {
            getAllPackages();
            Swal.fire('Deleted!', 'The photo has been successfully removed.', 'success');

            getAllPackages();
          },
          error: function (jqXHR) {
            console.error("Failed to delete image:", jqXHR.responseText);
            Swal.fire('Error!', 'Could not remove the photo.', 'error');
          }
        });
      }
    });
  });

  $('#specialOffersContainer').on('click', '.remove-offer-btn', function (event) {
    event.stopPropagation();

    const offerId = $(this).data('offer-id');
    console.log("Attempting to delete offer with ID:", offerId);

    if (!offerId) {
      console.error("offer ID not found on the button.");
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
          url: `http://localhost:8080/business/deleteOffer/${offerId}`,
          method: 'DELETE',
          headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
          success: function (response) {
            console.log(response);
            getAllSpecialOffers();
            Swal.fire('Deleted!', 'The photo has been successfully removed.', 'success');

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


/**
 * Fetches packages from the backend and dynamically renders them in the packages grid.
 */
function getAllPackages() {

  console.log("Fetching all packages...");

  $.ajax({
    url: 'http://localhost:8080/business/getAllPackages',
    method: 'GET',
    headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
    success: function (response) {
      console.log("Packages received successfully:", response);

      if (response.status === 200 && Array.isArray(response.data)) {
        const packages = response.data;
        const packageGrid = $('#packagesListContainer');

        packageGrid.empty();

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const activePackages = packages.filter(packages => {
          const validUntilDate = new Date(packages.availability_end);
          return validUntilDate >= today;
        });

        console.log("Active packages:", activePackages);

        const packageColorPalette = [
          { bg: 'bg-gradient-to-br from-blue-50 to-blue-100', border: 'border-blue-200 hover:border-blue-300', text: 'text-blue-600 font-semibold', iconBg: 'bg-blue-500' },
          { bg: 'bg-gradient-to-br from-emerald-50 to-emerald-100', border: 'border-emerald-200 hover:border-emerald-300', text: 'text-emerald-600 font-semibold', iconBg: 'bg-emerald-500' },
          { bg: 'bg-gradient-to-br from-violet-50 to-violet-100', border: 'border-violet-200 hover:border-violet-300', text: 'text-violet-600 font-semibold', iconBg: 'bg-violet-500' },
          { bg: 'bg-gradient-to-br from-orange-50 to-orange-100', border: 'border-orange-200 hover:border-orange-300', text: 'text-orange-600 font-semibold', iconBg: 'bg-orange-500' },
          { bg: 'bg-gradient-to-br from-teal-50 to-teal-100', border: 'border-teal-200 hover:border-teal-300', text: 'text-teal-600 font-semibold', iconBg: 'bg-teal-500' },
          { bg: 'bg-gradient-to-br from-rose-50 to-rose-100', border: 'border-rose-200 hover:border-rose-300', text: 'text-rose-600 font-semibold', iconBg: 'bg-rose-500' }
        ];



        activePackages.forEach((pkg, index) => {

          const color = packageColorPalette[index % packageColorPalette.length];


          const mealInclusionText = pkg.meal_inclusion
            ? pkg.meal_inclusion.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
            : 'Not Specified'; const imageUrl = pkg.imageUrl ? pkg.imageUrl : 'https://source.unsplash.com/400x300/?hotel,room';

          const packageCardHtml = `
        <div class="package-card group relative ${color.bg} rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border ${color.border}">
            
            <!-- 1. Image Container (මෙම කොටසේ වෙනසක් නැත) -->
            <div class="relative h-40">
                <img src="${imageUrl}"
                     alt="${pkg.packageName || 'Package Image'}"
                     class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>

            <!-- Card Content (මෙම කොටසේ වෙනසක් නැත) -->
            <div class="p-5">
                <!-- Delete Button -->
                <div class=" remove-package-btn absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button class="remove-package-btn bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition shadow-lg" data-package-id="${pkg.id}">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <!-- Package Name and Type -->
                <div class="flex items-center gap-4 mb-3">
                    <div class="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    </div>
                    <div>
                        <h3 class="font-bold text-gray-800 text-lg leading-tight">${pkg.packageName || 'Unnamed Package'}</h3>
                        <p class="text-sm text-blue-600 font-medium">${pkg.packageType || 'Room'}</p>
                    </div>
                </div>
                
                <p class="text-gray-600 text-sm mb-4 h-12 overflow-hidden">${pkg.description || 'No description available.'}</p>

                <!-- Package Details with Icons -->
                <div class="space-y-2 mb-4 text-sm">
                    <div class="flex items-center gap-3 text-gray-700">
                        <svg class="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        <span>${pkg.availability_start} to ${pkg.availability_end}</span>
                    </div>
                    <div class="flex items-center gap-3 text-gray-700">
                        <svg class="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                        <span>${mealInclusionText}</span>
                    </div>
                </div>

                <!-- Price and Status -->
                <div class="mt-5 pt-4 border-t border-gray-200">
                    <div class="flex items-center justify-between">
                        <div>
                            <div class="text-2xl font-bold text-gray-800">$${pkg.price}</div>
                            <span class="text-sm text-gray-500">per night</span>
                        </div>
                        <div class="flex items-center gap-2 text-sm font-medium text-green-600 bg-green-100 px-3 py-1 rounded-full">
                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>
                            Available
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

          $('#packagesListContainer').append(packageCardHtml);
        });

        $('#totalPackagesCount').text(packages.length);

      } else {
        console.error("Received data is not in the expected format.");
      }
    },
    error: function (jqXHR) {
      console.error("Failed to fetch packages:", jqXHR.responseText);
      Swal.fire("Error!", "Could not load your packages.", "error");
    }
  });
}









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
function getImages() {
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

        images.forEach(image => {
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
      console.log("Profile picture received successfully:", response.data);

      $('#profileImagePreview').attr('src', response.data);
      Swal.fire("Success!", "Profile image updated.", "success");
    },
    error: () => Swal.fire("Error!", "Profile image update failed.", "error")
  });
}

function getProfilePicture() {
  $.ajax({
    url: 'http://localhost:8080/business/getProfile',
    method: 'GET',
    headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
    success: (response) => {
      console.log("Profile picture received successfully:", response.data);
      $('#profileImagePreview').attr('src', response.data);
    },
    error: () => console.error("Failed to get profile picture.")
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

  let packageName = $('#packageName').val().trim();
  let availabilityStartDate = $('#availabilityStartDate').val().trim();
  let availabilityEndDate = $('#availabilityEndDate').val().trim();
  let isMealInclude = $('#isMealInclude').val();
  let packageAmenities = $('#packageDescription').val().trim();
  let packageImage = $('#packageImage')[0].files[0];
  let price = $('#packagePrice').val().trim();

  console.log("Saving package...");

  if (!packageName || !availabilityStartDate || !availabilityEndDate || !isMealInclude || !packageAmenities || !packageImage) {
    alert('Please fill in all required fields.');
    return;
  }


  const formData = new FormData();

  formData.append('packageName', packageName);
  formData.append('availability_start', availabilityStartDate);
  formData.append('availability_end', availabilityEndDate);
  formData.append('meal_inclusion', isMealInclude);
  formData.append('description', packageAmenities);
  formData.append('image', packageImage);
  formData.append('price', price);

  console.log("Package Name:", packageName);
  console.log("Availability Start Date:", availabilityStartDate);
  console.log("Availability End Date:", availabilityEndDate);
  console.log("Is Meal Included:", isMealInclude);
  console.log("Package Amenities:", packageAmenities);
  console.log("Package Image:", packageImage);
  console.log("Price:", price);


  $.ajax({
    url: 'http://localhost:8080/business/addNewPackage',
    method: 'POST',
    data: formData,
    processData: false,
    contentType: false,
    headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
    success: function (response) {
      console.log("Package saved successfully!" + response);
      getAllPackages();
      Swal.fire("Success!", "Successfully to add package.", "success");

    },
    error: function (jqXHR) {
      Swal.fire("Error!", "Failed to add package.", "error");
    }

  });

  $('#closePackageModal').click();

}

/**
 * Handles saving a new special offer.
 */
function handleSpecialOfferSave() {
  // ...
  console.log("Saving special offer...");

  let offerTitle = $('#offerTitle').val().trim();
  let precentage = $('#discountPercentage').val().trim();
  let validFrom = $('#validFrom').val().trim();
  let validUntil = $('#validUntil').val().trim();
  let offerDescription = $('#offerDescription').val().trim();
  let offerImage = $('#offerImageUrl')[0].files[0];

  console.log("Offer Title:", offerTitle);
  console.log("Precentage:", precentage);
  console.log("Valid From:", validFrom);
  console.log("Valid Until:", validUntil);
  console.log("Offer Description:", offerDescription);
  console.log("Offer Image:", offerImage);

  const formData = new FormData();

  formData.append('title', offerTitle);
  formData.append('discountPercentage', precentage);
  formData.append('valid_from', validFrom);
  formData.append('valid_until', validUntil);
  formData.append('description', offerDescription);
  formData.append('image', offerImage);

  $.ajax({
    url: 'http://localhost:8080/business/addSpecialOffer',
    method: 'POST',
    data: formData,
    processData: false,
    contentType: false,
    headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
    success: function (response) {
      console.log("Special offer saved successfully!" + response);
      getAllSpecialOffers();
      Swal.fire("Success!", "Successfully to add special offer.", "success");
    },
    error: function (jqXHR) {
      Swal.fire("Error!", "Failed to add special offer.", "error");
    }
  });


  $('#closeSpecialOfferModal').click();
}

/**
 * Fetches active special offers and renders them in the UI.
 */
function getAllSpecialOffers() {
  console.log("Fetching special offers...");

  $.ajax({
    url: 'http://localhost:8080/business/getAllOffers',
    method: 'GET',
    headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
    success: function (response) {
      console.log("Special offers received:", response);

      if (response.status === 200 && Array.isArray(response.data)) {
        const offers = response.data;
        const offersContainer = $('#specialOffersContainer');

        offersContainer.find('.offer-card').remove();

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const activeOffers = offers.filter(offer => {
          const validUntilDate = new Date(offer.valid_until);
          return validUntilDate >= today;
        });

        if (activeOffers.length === 0) {
          console.log("No active special offers found.");
        }

        // Color palette for Special Offer cards, inspired by the "Honeymoon Special" card
        const offerColorPalette = [
          // Warm Orange (Screenshot එකට සමානම වර්ණය)
          {
            bg: 'bg-gradient-to-br from-orange-50 to-red-50',
            border: 'border-orange-200 hover:border-orange-300',
            text: 'text-orange-600',
            iconBg: 'bg-orange-500'
          },
          // Sunny Amber/Yellow
          {
            bg: 'bg-gradient-to-br from-amber-50 to-yellow-100',
            border: 'border-yellow-200 hover:border-yellow-300',
            text: 'text-yellow-600',
            iconBg: 'bg-yellow-500'
          },
          // Soft Rose/Pink
          {
            bg: 'bg-gradient-to-br from-rose-50 to-pink-100',
            border: 'border-pink-200 hover:border-pink-300',
            text: 'text-pink-600',
            iconBg: 'bg-pink-500'
          },
          // Light Red
          {
            bg: 'bg-gradient-to-br from-red-50 to-red-100',
            border: 'border-red-200 hover:border-red-300',
            text: 'text-red-600',
            iconBg: 'bg-red-500'
          }
        ];

        activeOffers.forEach((offer, index) => {

          const color = offerColorPalette[index % offerColorPalette.length];
          const imageUrl = offer.imageUrl ? offer.imageUrl : 'https://source.unsplash.com/400x300/?offer,discount';

          const validUntilFormatted = new Date(offer.valid_until).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });


          const offerCardHtml = `
    <div class="offer-card group relative ${color.bg} rounded-xl overflow-hidden p-4 shadow-lg hover:shadow-xl transition-all duration-300 border ${color.border}">
        
        <!-- Image Container (මෙම කොටසේ වෙනසක් නැත) -->
        <div class="relative h-24 mb-3 rounded-lg overflow-hidden">
            <img src="${imageUrl}" alt="${offer.title}" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"/>
        </div>

        <!-- Remove Button Overlay -->
        <div class="remove-offer-btn absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button class="remove-offer-btn bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600" data-offer-id="${offer.offer_id}">
                <!-- Remove Icon -->
                <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>

        <!-- Offer Title Section with Icon -->
        <div class="flex items-center gap-3 mb-2">
            <div class="w-10 h-10 ${color.iconBg} rounded-lg flex items-center justify-center flex-shrink-0">
                <!-- Dollar Sign Icon (Special Offer Icon) -->
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" /></svg>
            </div>
            <div>
                <h4 class="font-bold text-gray-800 text-sm leading-tight">${offer.title || 'Special Offer'}</h4>
                <div class="text-xs ${color.text} font-medium">Valid until ${validUntilFormatted}</div>
            </div>
        </div>

        <!-- Offer Description -->
        <p class="text-gray-600 text-xs mb-3 h-10 overflow-hidden">${offer.description || 'No description available.'}</p>
        
        <!-- Discount Info -->
        <div class="flex items-center justify-between">
            <div class="text-lg font-bold ${color.text}">${offer.discountPercentage}% OFF</div>
            <span class="text-xs text-gray-500">Limited Time</span>
        </div>
    </div>
`;
          $('#specialOffersContainer').append(offerCardHtml);
        });

      } else {
        console.error("Received data is not in the expected format.");
      }
    },
    error: function (jqXHR) {
      console.error("Error fetching special offers:", jqXHR.responseText);
    }
  });
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