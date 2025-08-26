// Location detection and UI logic for NearbyHotelOffersOnly.html

document.addEventListener('DOMContentLoaded', function () {
  const loadingSection = document.querySelector('#location-loading') || document.querySelector('.flex.flex-col.items-center.justify-center.py-12');
  const offersSection = document.querySelector('#hotel-offers') || document.querySelector('h2')?.parentElement;

  // Helper to show/hide sections
  function showSection(section) {
    [loadingSection, offersSection].forEach(s => {
      if (s) s.classList.add('hidden');
    });
    if (section) section.classList.remove('hidden');
  }

  // Try to get geolocation
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        // Success: Show offers section
        showSection(offersSection);
        // Optionally, update distances here using position.coords.latitude/longitude
        // (For demo, distances are static)
      },
      function (error) {
        // Denied or error: Redirect to LocationDenied.html
        window.location.href = 'LocationDenied.html';
      }
    );
  } else {
    // Geolocation not supported: Redirect
    window.location.href = 'LocationDenied.html';
  }
}); 
