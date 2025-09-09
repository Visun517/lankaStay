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


  let location;

  $('#searchBtn').on('click', function () {
    location = $('#locationInput').val().trim();
    console.log(location);

    $.ajax({
      url: `http://localhost:8080/search/getAllLocations/${location}`,
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
        });
      });
    } else {
      alert("No businesses found for this location.");
    }
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




  // --- Location and Geolocation Handling ---

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