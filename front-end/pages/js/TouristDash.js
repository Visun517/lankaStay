function initMap() {
  const sriLankaBounds = {
    north: 10.0,
    south: 5.8,
    west: 79.5,
    east: 82.1
  };

  const map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 7.8731, lng: 80.7718 },
    zoom: 13,
    restriction: {
      latLngBounds: sriLankaBounds,
      strictBounds: true
    },
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false
  });
}


// Sample user data (replace with actual user data from backend)
const userData = {
  name: 'Tourist',
  id: 'T001'
};

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function () {
  // Set user name in navigation and welcome section
  document.getElementById('userName').textContent = userData.name;
  document.getElementById('welcomeUserName').textContent = userData.name;

  // Button 1: Explore Nearby Deals (always redirects to LocationDenied.html)
  document.getElementById('exploreBtn').addEventListener('click', function () {
    window.location.href = 'NearByBusiness.html';
  });

  // Button 2: Allow Location (checks geolocation and redirects accordingly)
  document.getElementById('locationBtn').addEventListener('click', function () {
    // Check if geolocation is supported
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      window.location.href = 'LocationDenied.html';
      return;
    }

    // Get current position
    navigator.geolocation.getCurrentPosition(
      // Success callback
      function (position) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        // Redirect to NearbyHotel.html with coordinates
        window.location.href = `NearbyHotelOffersOnly.html?lat=${lat}&lon=${lon}`;
      },
      // Error callback
      function (error) {
        let errorMessage = 'Location access denied. ';

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += 'Please allow location access to find nearby hotels.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage += 'Location request timed out.';
            break;
          default:
            errorMessage += 'An unknown error occurred.';
            break;
        }

        alert(errorMessage);
        window.location.href = 'LocationDenied.html';
      },
      // Options
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  });
});

// Sample function to populate recommended packages (replace with API call)
function populatePackages() {
  // This would typically fetch data from an API
  console.log('Loading recommended packages...');
}

// Sample function to populate booking history (replace with API call)
function populateBookings() {
  // This would typically fetch data from an API
  console.log('Loading booking history...');
}

document.addEventListener('DOMContentLoaded', function () {
  const exploreBtn = document.getElementById('exploreBtn');
  if (exploreBtn) {
    exploreBtn.addEventListener('click', function () {
      if (!navigator.geolocation) {
        alert('Geolocation is not supported by this browser.');
        window.location.href = '../LocationDenied.html';
        return;
      }
      navigator.geolocation.getCurrentPosition(
        function (pos) {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          window.location.href = `../NearbyHotelOffersOnly.html?lat=${lat}&lon=${lon}`;
        },
        function (error) {
          alert('Location access denied or unavailable.');
          window.location.href = '../LocationDenied.html';
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    });
  }
});

document.addEventListener('DOMContentLoaded', function () {
  const btn = document.getElementById('exploreBtn');
  if (btn) {
    btn.addEventListener('click', function () {
      if (!navigator.geolocation) {
        alert('Geolocation is not supported by this browser.');
        return;
      }

      // Show custom popup asking for location permission
      showLocationPopup();
    });
  }

  // Function to show location permission popup
  function showLocationPopup() {
    // Remove existing popup if any
    const existingPopup = document.querySelector('.location-popup');
    if (existingPopup) {
      existingPopup.remove();
    }

    // Create popup element
    const popup = document.createElement('div');
    popup.className = 'location-popup fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';

    // Set popup content
    popup.innerHTML = `
          <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 relative animate-fadeIn">
            <div class="text-center">
              <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-bold text-gray-800 mb-2">Location Access Required</h3>
              <p class="text-gray-600 mb-6">To explore nearby hotel deals, we need access to your location. Would you like to allow location access?</p>
              
              <div class="flex gap-3 justify-center">
                <button id="allowLocation" class="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-all duration-200 shadow">
                  Allow Location
                </button>
                <button id="denyLocation" class="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition-all duration-200">
                  Not Now
                </button>
              </div>
            </div>
          </div>
        `;

    // Add to body
    document.body.appendChild(popup);

    // Add event listeners
    document.getElementById('allowLocation').addEventListener('click', function () {
      popup.remove();
      requestLocation();
    });

    document.getElementById('denyLocation').addEventListener('click', function () {
      popup.remove();
      showDeniedMessage();
    });
  }

  // Function to request location
  function requestLocation() {
    // First try to enable location services
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' }).then(function (result) {
        if (result.state === 'denied') {
          // Location is denied, show instructions to enable it
          showEnableLocationInstructions();
          return;
        }
        // Location permission granted, now get position
        getCurrentLocation();
      });
    } else {
      // Fallback for browsers without permissions API
      getCurrentLocation();
    }
  }

  // Function to get current location
  function getCurrentLocation() {
    navigator.geolocation.getCurrentPosition(
      function success(position) {
        // Success - navigate to NearbyBusiness page
        alert('Location access granted! Redirecting to nearby businesses...');
        window.location.href = 'NearByBusiness.html';
      },
      function error(error) {
        // On error (deny/unavailable)
        let errorMessage = 'Location access denied. Please enable location services to explore nearby deals.';
        if (error.code === 1) {
          errorMessage = 'Location access denied. Please allow location access in your browser settings.';
          showEnableLocationInstructions();
        } else if (error.code === 2) {
          errorMessage = 'Location unavailable. Please check your device location settings.';
          showEnableLocationInstructions();
        } else if (error.code === 3) {
          errorMessage = 'Location request timed out. Please try again.';
        }
        alert(errorMessage);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }

  // Function to show instructions for enabling location
  function showEnableLocationInstructions() {
    const instructionsPopup = document.createElement('div');
    instructionsPopup.className = 'location-popup fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';

    instructionsPopup.innerHTML = `
           <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 relative animate-fadeIn">
             <div class="text-center">
               <div class="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                 <svg class="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                 </svg>
               </div>
               <h3 class="text-xl font-bold text-gray-800 mb-2">Enable Location Services</h3>
               <div class="text-left text-gray-600 mb-6 space-y-2">
                 <p><strong>To enable location:</strong></p>
                 <p>1. Click the location icon in your browser's address bar</p>
                 <p>2. Select "Allow" for location access</p>
                 <p>3. Make sure your device location is turned ON</p>
                 <p>4. Click "Try Again" below</p>
               </div>
               
               <div class="flex gap-3 justify-center">
                 <button id="tryAgain" class="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-all duration-200 shadow">
                   Try Again
                 </button>
                 <button id="cancelLocation" class="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition-all duration-200">
                   Cancel
                 </button>
               </div>
             </div>
           </div>
         `;

    document.body.appendChild(instructionsPopup);

    // Add event listeners
    document.getElementById('tryAgain').addEventListener('click', function () {
      instructionsPopup.remove();
      getCurrentLocation();
    });

    document.getElementById('cancelLocation').addEventListener('click', function () {
      instructionsPopup.remove();
    });
  }

  // Function to show denied message
  function showDeniedMessage() {
    alert('Location access denied. You can still browse hotels manually from the map below.');
  }
});



$(document).ready(function () {

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

        $.ajax({
          url: 'http://localhost:8080/auth/logout',
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
          },
          xhrFields: {
            withCredentials: true
          },
          success: function (response) {

            localStorage.removeItem('accessToken');

            console.log('Successfully logged out.');
            window.location.href = '/pages/Login.html';

          },
          error: function (jqXHR, textStatus, errorThrown) {
            console.error('Logout failed:', textStatus, errorThrown);
            Swal.fire(
              'Logout Failed!',
              'An error occurred while trying to log out. Please try again.',
              'error'
            );

            localStorage.removeItem('accessToken');

          }
        });
      }
    });
  });

});