// =================================================================
// GLOBAL VARIABLES & MAP INITIALIZATION
// =================================================================
// These are defined globally so they can be accessed from anywhere.

let map;
let infoWindow;
let markers = []; // Array to store all markers

/**
 * This function is the callback for the Google Maps API script.
 * It initializes the map and is exposed to the global scope.
 */
function initializeMap() {
  const sriLankaCenter = { lat: 7.8731, lng: 80.7718 };

  map = new google.maps.Map(document.getElementById("map"), {
    center: sriLankaCenter,
    zoom: 8,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
  });

  infoWindow = new google.maps.InfoWindow();

  console.log("Google Map initialized successfully.");
  // You can call functions to load hotel markers here, e.g., loadAllHotels();
}

// Function to clear all markers from the map
function clearMarkers() {
  for (let i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers = [];
}

// Expose the map initialization function to the global window object
// This is the safest way to ensure the Google Maps callback can find it.
window.initMap = initializeMap;

// =================================================================
// MAIN SCRIPT EXECUTION (using jQuery's document ready)
// =================================================================
// All code that interacts with the DOM should be inside this function.
// It ensures that the HTML page is fully loaded before the script runs.

// Browser back button catch



$(document).ready(function () {

  console.log("Document is ready. Attaching event listeners.");


  $('#logoutBtn').on('click', function () {
    Swal.fire({
      title: 'Are you sure you want to log out?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, log me out!'
    }).then((result) => {
      if (result.isConfirmed) {
        // Perform actual logout logic (e.g., API call)
        localStorage.removeItem('token'); // Assuming token is named 'token'
        console.log('Successfully logged out.');
        window.location.href = '../Login.html'; // Redirect to login page
      }
    });
  });

    setInterval(getAllPackages, 10000);
  function getAllPackages() {
    $.ajax({
      url: 'http://localhost:8080/business/getBookings/tourist',
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
      success: (response) => {
        console.log("all bookings received:", response);

        const bookings = Array.isArray(response) ? response : response.data;
        const bookingContainer = $("#bookingContainer .space-y-4");
        bookingContainer.empty();

        if (!bookings || bookings.length === 0) {
          bookingContainer.append(`
      <div class="text-gray-600 text-center">No bookings found.</div>
    `);
          return;
        }

        bookings.forEach(booking => {
          const bookingDate = new Date(booking.bookingDate).toDateString();
          const checkInDate = new Date(booking.checkInDate).toDateString();
          const checkOutDate = new Date(booking.checkOutDate).toDateString();

          const statusColor =
            booking.status === "CONFIRMED"
              ? "bg-green-100 text-green-800"
              : booking.status === "PENDING"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800";

          const bookingItem = `
      <div class="bg-white rounded-lg p-4 shadow-md">
        <div class="flex items-center ">
          <div>
            <p class="font-semibold text-gray-800">Booking ID: ${booking.bookingId}</p>
            <p class="text-sm text-gray-600">Booking Date: ${bookingDate}</p>
            <p class="text-sm text-gray-600">Check-in: ${checkInDate} | Check-out: ${checkOutDate}</p>
          </div>
          <div class="ml-auto">
          <span class="px-3 py-1 ${statusColor} rounded-full text-sm font-medium mr-2">
            ${booking.status}
          </span>
          <button class="remove-booking-btn px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-medium" data-package-id="${booking.bookingId}")"> Remove </button>
          </div>
        </div>
      </div>
    `;

          bookingContainer.append(bookingItem);
        });
      },
      error: () => console.error("Failed to get image data.")
    })
  }

  $(document).on("click", ".remove-booking-btn", function () {
  const bookingId = $(this).data("package-id");
  console.log("remove booking " + bookingId);

  Swal.fire({
    title: 'Are you sure?',
    text: "Do you really want to delete this booking?",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel'
  }).then((result) => {
    if (result.isConfirmed) {
      // User confirmed → Delete request
      $.ajax({
        url: `http://localhost:8080/business/deleteBooking/${bookingId}`,
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
        success: (response) => {
          console.log("response data received:", response);

          Swal.fire(
            'Deleted!',
            'The booking has been successfully removed.',
            'success'
          );

          // refresh bookings list after delete
          getAllPackages();
        },
        error: function (error) {
          Swal.fire(
            'Error!',
            'Could not remove the booking.',
            'error'
          );
        }
      });
    }
  });
});


  let debounceTimer;

  // Sri Lanka districts list 
  const districts = [
    "Colombo", "Gampaha", "Kalutara",
    "Kandy", "Matale", "Nuwara Eliya",
    "Galle", "Matara", "Hambantota",
    "Jaffna", "Kilinochchi", "Mannar",
    "Vavuniya", "Mullaitivu", "Batticaloa",
    "Ampara", "Trincomalee", "Kurunegala",
    "Puttalam", "Anuradhapura", "Polonnaruwa",
    "Badulla", "Monaragala", "Ratnapura",
    "Kegalle"
  ];

  $("#locationInput").on("keyup", function () {
    clearTimeout(debounceTimer);
    const query = $(this).val().trim().toLowerCase();

    if (query.length < 1) {
      $("#suggestionList").empty().addClass("hidden");
      return;
    }

    debounceTimer = setTimeout(() => {
      const filtered = districts.filter(d => d.toLowerCase().includes(query));

      $("#suggestionList").empty();

      if (filtered.length > 0) {
        $("#suggestionList").removeClass("hidden");

        filtered.forEach(district => {
          const li = $("<li>")
            .text(district)
            .addClass("px-4 py-2 hover:bg-blue-100 cursor-pointer")
            .on("click", function () {
              $("#locationInput").val(district);
              $("#suggestionList").addClass("hidden");
            });

          $("#suggestionList").append(li);
        });
      } else {
        $("#suggestionList").addClass("hidden");
      }
    }, 300);
  });

  $(document).on("click", function (e) {
    if (!$(e.target).closest("#locationInput, #suggestionList").length) {
      $("#suggestionList").addClass("hidden");
    }
  });


  let uselocation;

  $('#searchBtn').on('click', function () {
    uselocation = $('#locationInput').val().trim();
    console.log(uselocation);

    $.ajax({
      url: `http://localhost:8080/search/getAllLocations/${uselocation}`,
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
      success: (response) => {
        console.log("response data received:", response);
        clearMarkers();
        markedBusinessesOnMap(response.data);

      },
      error: () => console.error("Failed to get image data.")
    })

  });

  $('#filterHotelBtn').on('click', function () {
    console.log("filterHotelBtn clicked.");
    let category = "HOTEL";

    $.ajax({
      url: `http://localhost:8080/search/filterSearch/${location}/${category}`,
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
      success: (response) => {
        console.log("response data received:", response);
        markedBusinessesOnMap(response.data);

      },
      error: () => console.error("Failed to get image data.")
    })


  });

  $('#filterRestaurantBtn').on('click', function () {
    console.log("filterHotelBtn clicked.");
    let category = "RESTAURANT";

    $.ajax({
      url: `http://localhost:8080/search/filterSearch/${location}/${category}`,
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
      success: (response) => {
        console.log("response data received:", response);
        markedBusinessesOnMap(response.data);

      },
      error: () => console.error("Failed to get image data.")
    })
  });

  $('#filterSpaBtn').on('click', function () {
    console.log("filterHotelBtn clicked.");
    let category = "SPA";

    $.ajax({
      url: `http://localhost:8080/search/filterSearch/${location}/${category}`,
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
      success: (response) => {
        console.log("response data received:", response);
        markedBusinessesOnMap(response.data);

      },
      error: () => console.error("Failed to get image data.")
    })


  });

  $('#filterGuestHouseBtn').on('click', function () {
    console.log("filterHotelBtn clicked.");
    let category = "GUEST_HOUSE";

    $.ajax({
      url: `http://localhost:8080/search/filterSearch/${location}/${category}`,
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
      success: (response) => {
        console.log("response data received:", response);
        markedBusinessesOnMap(response.data);

      },
      error: () => console.error("Failed to get image data.")
    })


  });

  let businessId;
  function markedBusinessesOnMap(response) {

    console.log("response data received:", response);
    clearMarkers();

    if (response && response.length > 0) {
      map.setCenter({ lat: response[0].latitude, lng: response[0].longitude });
      map.setZoom(12);

      response.forEach(business => {
        const marker = new google.maps.Marker({
          position: { lat: business.latitude, lng: business.longitude },
          map: map,
          title: business.name || business.district,
        });
        marker.business = business;


        markers.push(marker);

        const infowindow = new google.maps.InfoWindow({
          content: `
                <div>
                  <h2>Name: ${business.businessName}</p>
                  <h3>${business.name || business.district}</h3>
                  <p>${business.address}</p>
                  <p>${business.description}</p>
                  <p>Latitude: ${business.latitude}</p>
                  <p>Longitude: ${business.longitude}</p>
                  <p>Type: ${business.type}</p>
                </div>
              `,
        });

        marker.addListener('click', () => {
          infowindow.open(map, marker);

          console.log("Marker clicked:", marker.business);
          businessId = business.id;

          // Open the business details panel below the map with available data
          if (window.showBusinessDetails) {
            const b = marker.business || {};
            window.showBusinessDetails({
              profileImage: b.profileImageUrl || b.coverImageUrl || '',
              name: b.businessName || b.name || 'Business',
              district: b.district || '',
              contact: b.contactNumber || b.phone || '',
              address: b.address || '',
              description: b.description || '',
              openDays: b.openDays,
              closedDays: b.closedDays,
              gallery: b.galleryImages || b.images || [],
              specialOffers: b.specialOffers || [],
              packages: b.packages || []
            });
          }
          getprofilePicture();
          initCalendar(businessId);
          getImages(businessId);
          getOffers(businessId);
          getPackages(businessId);


        });
      });

    } else {
      alert("No businesses found for this location.");
    }
  }

  function getImages(businessId) {

    $.ajax({
      url: `http://localhost:8080/showCard/getImages/${businessId}`,
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
      success: (response) => {
        console.log("Image data received successfully:", response.data);

        if (response.status === 200 && Array.isArray(response.data)) {
          const images = response.data;
          const galleryGrid = $('#bdGalleryGrid');

          galleryGrid.find('.existing-image').remove();

          images.forEach(image => {
            let id = 0;
            const fullImageUrl = image.imageUrl ? image.imageUrl : 'https://source.unsplash.com/400x300/?hotel';

            const imageCardHtml = `
                        <div class="existing-image group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                            <img src="${fullImageUrl}"
                                class="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-110"
                                alt="${image.title || 'Hotel Image'}" />
                            
                            <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-white">
                                <p class="text-sm font-medium">${image.title || 'No Title'}</p>
                                <p class="text-xs opacity-80">${image.subtitle || 'No Subtitle'}</p>
                            </div>
                        </div>
                    `;
            galleryGrid.append(imageCardHtml);
          });

          $('#bdGalleryCount').text(images.length);

        } else {
          console.error("Received data is not in the expected format.");
        }
      },
      error: () => console.error("Failed to get image data.")
    });
  }

  function getprofilePicture() {

    $.ajax({
      url: `http://localhost:8080/showCard/getProfile/contact/${businessId}`,
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
      success: (response) => {
        console.log("Profile picture received successfully:", response.data);
        $('#bdProfileImage').attr('src', response.data.imageUrl);
        $('#bdContact').text(response.data.phoneNumber);
      },
      error: () => console.error("Failed to get profile picture.")
    });
  }

  function getOffers(businessId) {

    $.ajax({
      url: `http://localhost:8080/showCard/getAllOffers/${businessId}`,
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
      success: (response) => {
        console.log("Offers received successfully:", response.data);

        if (response.status === 200 && Array.isArray(response.data)) {
          const offers = response.data;
          const offersContainer = $('#bdSpecialOffers');

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

          const offerColorPalette = [
            {
              bg: 'bg-gradient-to-br from-orange-50 to-red-50',
              border: 'border-orange-200 hover:border-orange-300',
              text: 'text-orange-600',
              iconBg: 'bg-orange-500'
            },
            {
              bg: 'bg-gradient-to-br from-amber-50 to-yellow-100',
              border: 'border-yellow-200 hover:border-yellow-300',
              text: 'text-yellow-600',
              iconBg: 'bg-yellow-500'
            },
            {
              bg: 'bg-gradient-to-br from-rose-50 to-pink-100',
              border: 'border-pink-200 hover:border-pink-300',
              text: 'text-pink-600',
              iconBg: 'bg-pink-500'
            },
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
        
        <div class="relative h-24 mb-3 rounded-lg overflow-hidden">
            <img src="${imageUrl}" alt="${offer.title}" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"/>
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
            offersContainer.append(offerCardHtml);
          });


        } else {
          console.error("Received data is not in the expected format.");
        }
      },
      error: () => console.error("Failed to get profile offer.")
    });

  }

  function getPackages(businessId) {
    $.ajax({
      url: `http://localhost:8080/showCard/getAllPackages/${businessId}`,
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
      success: (response) => {
        console.log("Packages received successfully:", response.data);

        if (response.status === 200 && Array.isArray(response.data)) {
          const packages = response.data;
          const packageGrid = $('#bdPackages');

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
                            <div class="text-2xl font-bold text-gray-800">Rs ${pkg.price}</div>
                            <span class="text-sm text-gray-500">per night</span>
                        </div>
                        <div class="flex items-center gap-2 text-sm font-medium text-green-600 bg-green-100 px-3 py-1 rounded-full">
                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>
                            Available
                        </div>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex gap-3 mt-4">
                    <button class="book-now-btn flex-1 py-2 px-4 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors duration-300" data-package-id="${pkg.id}">Book Now</button>
                </div>
            </div>
        </div>
    `;

            packageGrid.append(packageCardHtml);

            packageGrid.find(`[data-package-id="${pkg.id}"]`).on('click', function () {
              const id = $(this).data('package-id');
              window.openBookingModal(id);
            });
          });

        } else {
          console.error("Received data is not in the expected format.");
        }

      },
      error: () => console.error("Failed to get Packages.")
    });

  }

  // Business Details Panel Functionality
  (function () {
    const panel = document.getElementById('businessDetailsPanel');
    if (!panel) return;

    const els = {
      profile: document.getElementById('bdProfileImage'),
      name: document.getElementById('bdName'),
      district: document.getElementById('bdDistrict'),
      contact: document.getElementById('bdContact'),
      address: document.getElementById('bdAddress'),
      description: document.getElementById('bdDescription'),
      openDays: document.getElementById('bdOpenDays'),
      closedDays: document.getElementById('bdClosedDays'),
      galleryGrid: document.getElementById('bdGalleryGrid'),
      galleryCount: document.getElementById('bdGalleryCount'),
      offers: document.getElementById('bdSpecialOffers'),
      packages: document.getElementById('bdPackages'),
      closeBtn: document.getElementById('bdCloseBtn')
    };

    function clearContainer(container) {
      if (!container) return;
      while (container.firstChild) container.removeChild(container.firstChild);
    }

    function openPanel() {
      panel.classList.remove('hidden');
    }

    function closePanel() {
      panel.classList.add('hidden');
    }

    window.hideBusinessDetails = closePanel;

    window.showBusinessDetails = function (data) {
      // Basic fields
      if (els.profile) els.profile.src = data.profileImage || '';
      if (els.name) els.name.textContent = data.name || 'Business Name';
      if (els.district) els.district.textContent = data.district || '';
      if (els.contact) els.contact.textContent = data.contact || '';
      if (els.address) els.address.textContent = data.address || '';
      if (els.description) els.description.textContent = data.description || '';

      // Availability summary
      if (els.openDays) els.openDays.textContent = data.openDays ?? '-';
      if (els.closedDays) els.closedDays.textContent = data.closedDays ?? '-';

      openPanel();
    };

    if (els.closeBtn) {
      els.closeBtn.addEventListener('click', closePanel);
    }
  })();



  // Simple Calendar Functionality
  // Month names
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  let currentMonth, currentYear;

  // Fetch closed dates from backend
  function fetchClosedDates(month, year, callback) {
    $.ajax({
      url: `http://localhost:8080/showCard/getAllDates/${businessId}`,
      method: "GET",
      headers: { "Authorization": "Bearer " + localStorage.getItem("token") },
      success: function (response) {

        console.log("Closed dates received successfully:", response);

        const filtered = response.data
          .map(item => new Date(item.date))
          .filter(d => d.getMonth() === month && d.getFullYear() === year)
          .map(d => d.getDate());

        console.log("Filtered closed dates for this month:", filtered);

        callback(filtered);
      },
      error: function () {
        console.error("Failed to load closed dates");
        callback([]);
      }
    });
  }

  // Render calendar
  function createCalendar(month, year, closedDates = []) {
    const calendarDays = document.getElementById('bdCalendarDays');
    const monthDisplay = document.getElementById('bdCurrentMonthDisplay');

    if (!calendarDays || !monthDisplay) return;

    // clear days
    calendarDays.innerHTML = '';
    monthDisplay.textContent = `${monthNames[month]} ${year}`;

    const firstDay = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startDay = (firstDay.getDay() + 6) % 7; // Monday start

    // Add empty cells before month starts
    for (let i = 0; i < startDay; i++) {
      const empty = document.createElement('div');
      empty.className = 'h-8 w-8';
      calendarDays.appendChild(empty);
    }

    let openCount = 0, closedCount = 0;

    // Add actual days
    for (let day = 1; day <= daysInMonth; day++) {
      const dayEl = document.createElement('div');
      dayEl.className = 'h-8 w-8 flex items-center justify-center text-xs font-medium rounded cursor-pointer transition-colors';

      const isClosed = closedDates.includes(day);

      if (isClosed) {
        dayEl.classList.add("bg-red-100", "text-red-700");
        closedCount++;
      } else {
        dayEl.classList.add("bg-green-100", "text-green-700");
        openCount++;
      }

      dayEl.textContent = day;
      dayEl.title = `${day} ${monthNames[month]} ${year} - ${isClosed ? 'Closed' : 'Open'}`;

      calendarDays.appendChild(dayEl);
    }

    // Update summary
    document.getElementById('bdOpenDays').textContent = openCount;
    document.getElementById('bdClosedDays').textContent = closedCount;
  }

  // Update calendar (fetch + render)
  function updateCalendar(month, year) {
    fetchClosedDates(month, year, (closedDates) => {
      createCalendar(month, year, closedDates);
    });
  }


  // Init calendar
  function initCalendar(businessIdParam) {
    businessId = businessIdParam;
    const now = new Date();
    currentMonth = now.getMonth();
    currentYear = now.getFullYear();
    updateCalendar(currentMonth, currentYear);
  }

  // Navigation buttons
  function nextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    updateCalendar(currentMonth, currentYear);
  }

  function prevMonth() {
    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
    updateCalendar(currentMonth, currentYear);
  }


  const userDataString = localStorage.getItem('user');
  let userData = { name: 'Tourist', email: 'tourist@example.com' };

  $('#userName, #welcomeUserName, #profileUserName').text(userData.name);
  $('#profileUserEmail').text(userData.email);
  $('#userProfilePic').attr('src', userData.profilePic);

  if (userDataString) {
    try {
      const parsedData = JSON.parse(userDataString);
      userData.name = parsedData.name || userData.name;
      userData.email = parsedData.email || userData.email;
      userData.profilePic = parsedData.profilePic || userData.profilePic;
    } catch (e) {
      console.error("Error parsing user data from localStorage:", e);
    }
  }





  // "Explore Nearby Deals" button click event
  $('#exploreBtn').on('click', function () {
    window.location.href = '../tourist/NearByBusiness.html';
  });

  // Function to show the custom location permission popup
  function showLocationPopup() {
    // Remove any existing popup to avoid duplicates
    $('.location-popup').remove();

    const popupHTML = `
              <div class="location-popup fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 relative animate-fadeIn text-center">
                      <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                      </div>
                      <h3 class="text-xl font-bold text-gray-800 mb-2">Location Access Required</h3>
                      <p class="text-gray-600 mb-6">To explore nearby deals, please allow access to your location.</p>
                      <div class="flex gap-3 justify-center">
                          <button id="allowLocation" class="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-all duration-200 shadow">Allow</button>
                          <button id="denyLocation" class="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition-all duration-200">Not Now</button>
                      </div>
                  </div>
              </div>
          `;
    $('body').append(popupHTML);

    // Attach event listeners for the new popup buttons
    $('#allowLocation').on('click', function () {
      $('.location-popup').remove();
      requestAndGetCurrentLocation();
    });

    $('#denyLocation').on('click', function () {
      $('.location-popup').remove();
      alert('Location access denied. You can still search for hotels manually.');
    });
  }

  // Function to handle the actual geolocation request
  function requestAndGetCurrentLocation() {
    navigator.geolocation.getCurrentPosition(
      function (position) { // Success
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        alert('Location found! Redirecting...');
        // Redirect to a page that uses these coordinates
        window.location.href = `../NearbyHotelOffersOnly.html?lat=${lat}&lon=${lon}`;
      },
      function (error) { // Error
        let errorMessage = 'An error occurred while getting your location.';
        if (error.code === 1) { // PERMISSION_DENIED
          errorMessage = 'Location access was denied. Please enable it in your browser settings to use this feature.';
        }
        alert(errorMessage);
      },
      { // Options
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  }

  // Booking Modal Functionality
  // This function is responsible for handling the display and closure of the booking pop-up.
  // It listens for clicks on the 'Book Now' button to open the modal and on the 'closeBookingModal' button to close it.
  // It also includes a placeholder for future form submission logic.


  (function () {
    const bookingModal = document.getElementById('bookingModal');
    const closeBookingModalBtn = document.getElementById('closeBookingModal');
    const bookingForm = document.getElementById('bookingForm');

    let selectedPackageId = null;


    if (!bookingModal || !closeBookingModalBtn || !bookingForm) {
      console.error('One or more booking modal elements not found.');
      return;
    }

    function openBookingModal(packageId) {
      selectedPackageId = packageId;
      document.getElementById('packageId').value = selectedPackageId;
      console.log('Opening booking modal for package ID:', selectedPackageId);
      bookingModal.classList.remove('hidden');
    }

    function closeBookingModal() {
      bookingModal.classList.add('hidden');
      bookingForm.reset();
    }

    closeBookingModalBtn.addEventListener('click', closeBookingModal);

    $(bookingModal).on('click', function (e) {
      if ($(e.target).is(bookingModal)) {
        closeBookingModal();
      }
    });

    $('#confirmBooking').on('click', function () {
      const checkInDate = document.getElementById('checkInDate').value;
      const checkOutDate = document.getElementById('checkOutDate').value;
      let packageId = document.getElementById('packageId').value;


      const bookingData = {
        checkInDate: checkInDate,
        checkOutDate: checkOutDate,
        packageId: packageId
      };

      $.ajax({
        url: 'http://localhost:8080/business/addBooking',
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
        data: JSON.stringify(bookingData),
        contentType: 'application/json',
        success: function (response) {
          console.log('Booking submitted successfully:', response);
          getAllPackages();
          Swal.fire({
            icon: 'success',
            title: 'Booking Confirmed!',
            text: `Your booking successfully submitted.`,
            showConfirmButton: false
          })
        },
        error: function (xhr, status, error) {
          Swal.fire({
            icon: 'error',
            title: 'Booking not Confirmed!',
            text: `Your booking not successfully submitted.`,
            showConfirmButton: false
          })
        }
      });

      closeBookingModal();
    });

    // Expose openBookingModal to the global scope or where getPackages can access it
    window.openBookingModal = openBookingModal;

  })();

  // --- API Calls ---
  // (You can add your functions to fetch packages, bookings, etc., here)
  function fetchRecommendedPackages() {
    console.log("Fetching recommended packages from the server...");
    // Your AJAX call would go here
  }

  function fetchBookingHistory() {
    console.log("Fetching booking history from the server...");
    // Your AJAX call would go here
  }

  // Call functions to load initial data
  fetchRecommendedPackages();
  fetchBookingHistory();

});