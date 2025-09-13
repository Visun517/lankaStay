let map;
const defaultLocation = { lat: 6.759018, lng: 80.36472 }; // Rathnapura
let userCircle; // Circle variable
let markers = [];

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 14,
    mapTypeId: 'roadmap',
    center: defaultLocation
  });

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        console.log('User location:', userLocation);
        map.setCenter(userLocation);

        userMarker = new google.maps.Marker({
          position: userLocation,
          map: map,
          title: "Your Location",
          icon: {
            url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png", // blue marker
            scaledSize: new google.maps.Size(40, 40)
          }
        });

        // Circle draw කිරීම (5km radius)
        userCircle = new google.maps.Circle({
          strokeColor: "#3b82f6",       // border color
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: "#3b82f6",         // fill color
          fillOpacity: 0.2,
          map: map,
          center: userLocation,
          radius: 5000                 // 5 km radius (meters)
        });

        getNearByBusinesses(userLocation.lat, userLocation.lng);

      },
      (error) => {
        console.log('Location not available, using default.', error);
      },
      { enableHighAccuracy: true }
    );
  }
}

let userLocation2;
function getNearByBusinesses(latitude, longitude) {
  userLocation2 = {
    latitude: latitude,
    longitude: longitude
  };

  $.ajax({
    url: `http://localhost:8080/business/nearByBusinesses?latitude=${latitude}&longitude=${longitude}`,
    method: 'GET',
    headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
    success: (response) => {
      console.log("Businesses received successfully:", response.data);
      showBusinessesOnMap(response.data);
    },
    error: () => console.error("Failed to get businesses.")
  });
}


function showBusinessesOnMap(businesses) {
  // clear existing markers
  markers.forEach(marker => marker.setMap(null));
  markers = [];

  businesses.forEach(business => {
    const position = {
      lat: business.latitude,
      lng: business.longitude
    };

    const marker = new google.maps.Marker({
      position: position,
      map: map,
      title: business.businessName
    });
    marker.business = business;

    // InfoWindow ekak add karanna
    const infoWindow = new google.maps.InfoWindow({
      content: `
        <div style="max-width:200px;">
          <h3>${business.businessName}</h3>
          <p><b>Type:</b> ${business.type}</p>
          <p><b>Address:</b> ${business.address}</p>
          <p><b>Phone:</b> ${business.phoneNumber}</p>
          <img src="${business.imageUrl}" alt="${business.businessName}" style="width:100%;border-radius:8px;margin-top:5px;"/>
        </div>
      `
    });

    marker.addListener("click", () => {
      infoWindow.open(map, marker);

      console.log("Marker clicked:", marker.business);
      $("#businessDetailsPanel").removeClass("hidden");
      $("#bdName").text(business.businessName);
      $("#bdDistrict").text(business.district);
      $("#bdContact").text(business.phoneNumber);
      $("#bdAddress").text(business.address);
      $("#bdDescription").text(business.description);
      $("#bdProfileImage").attr("src", business.imageUrl);

      initCalendar(business.id);
      getOffers(business.id)
      getPackages(business.id)
      getReviews(business.id);
    });

    markers.push(marker);
  });
}



let business;
// Init calendar
function initCalendar(businessId) {
  console.log("initCalendar called with businessId:", businessId);
  business = businessId;
  console.log("Business:", business);
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
function updateCalendar(month, year) {
  fetchClosedDates(month, year, (closedDates) => {
    createCalendar(month, year, closedDates);
  });
}

function fetchClosedDates(month, year, callback) {
  console.log(business)
  $.ajax({
    url: `http://localhost:8080/showCard/getAllDates/${business}`,
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

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

let currentMonth, currentYear;

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


let currentPage = 0;
const pageSize = 3;


function getReviews(businessId, page = 0) {
  $.ajax({
    url: `http://localhost:8080/review/getAllReviews/${businessId}?page=${page}&size=${pageSize}`,
    method: 'GET',
    headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
    success: (response) => {
      console.log("Reviews received successfully:", response.data);

      const reviewsContainer = $('#reviewsContainer');
      reviewsContainer.empty(); // Clear existing reviews
      let loggedInTouristId = localStorage.getItem('touristId'); // logged-in tourist ID

      if (response.status === 200 && Array.isArray(response.data) && response.data.length > 0) {
        response.data.forEach(review => {
          const starsHtml = Array(review.rating).fill('<span class="text-yellow-500">&#9733;</span>').join('');
          const emptyStarsHtml = Array(5 - review.rating).fill('<span class="text-gray-300">&#9733;</span>').join('');
          const reviewDate = review.createdAt ? new Date(review.createdAt).toLocaleDateString() : '';

          // check if this review belongs to the logged-in tourist
          let isMyReview = (review.touristId && review.touristId.toString() === loggedInTouristId);

          // add extra classes for highlight if it's my review
          let cardClasses = isMyReview
            ? "bg-blue-50 border border-blue-400 rounded-xl shadow-lg p-6" // highlighted
            : "bg-white rounded-xl shadow-md p-6";

          // delete button only if it's my review
          let deleteBtnHtml = isMyReview
            ? `<button data-review-id="${review.review_id}" 
                        class=" delete-review-btn ml-auto text-red-500 hover:text-red-700 text-sm">
                        Delete
               </button>`
            : "";

          const reviewCardHtml = `
            <div class="${cardClasses}">
              <div class="flex items-center mb-2">
                <h4 class="font-bold text-gray-800">${review.userName || 'Anonymous'}</h4>
                <div class="flex items-center ml-2 text-xl">${starsHtml}${emptyStarsHtml}</div>
                ${deleteBtnHtml}
              </div>
              <p class="text-gray-700 text-sm">${review.comment}</p>
              <p class="text-gray-400 text-xs mt-2">${reviewDate}</p>
            </div>
          `;
          reviewsContainer.append(reviewCardHtml);


        });


        $(document).on("click", ".delete-review-btn", function () {
          let reviewId = $(this).data("review-id");
          console.log(reviewId)
          deleteReview(reviewId);
        });

        // Enable/Disable buttons based on page
        $('#prevPageBtn').prop('disabled', page <= 0);
        $('#nextPageBtn').prop('disabled', response.data.length < pageSize);

        currentPage = page;
      } else {
        reviewsContainer.append(`
  <div id="noReviewsMessage" 
       class="col-span-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl shadow-sm py-10 px-6">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-blue-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
            d="M11 17a4 4 0 100-8 4 4 0 000 8zm0 0v4m-7-4h14" />
    </svg>
    <p class="text-gray-600 text-lg font-medium">No reviews yet</p>
    <p class="text-blue-600 mt-1 font-semibold">Be the first to review!</p>
  </div>
`);

        $('#prevPageBtn, #nextPageBtn').prop('disabled', true);
      }
    },
    error: () => console.error("Failed to get reviews.")
  });

}

// Delete review function (AJAX call)
function deleteReview(reviewId) {
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
        url: `http://localhost:8080/review/removeReview/${reviewId}`,
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
        success: (response) => {
          console.log("response data received:", response);

          Swal.fire(
            'Deleted!',
            'The review has been successfully removed.',
            'success'
          );

          getReviews(business, currentPage);
        },
        error: function (error) {
          Swal.fire(
            'Error!',
            'Could not remove the review .',
            'error'
          );
        }
      });
    }
  });
}

// Pagination button handlers
$('#prevPageBtn').on('click', () => {
  if (currentPage > 0) {
    getReviews(businessId, currentPage - 1);
  }
});

$('#nextPageBtn').on('click', () => {
  getReviews(businessId, currentPage + 1);
});



function reviewModal() {
  const reviewModal = $('#reviewModal');
  const reviewBtn = $('#reviewBtn');
  const closeReviewModalBtn = $('#closeReviewModal');
  const reviewCommentInput = $('#reviewComment');
  const modalRatingInputs = $('input[name="modalRating"]');
  const submitReviewModalBtn = $('#submitReviewModal');

  function resetReviewForm() {
    reviewCommentInput.val('');
    modalRatingInputs.prop('checked', false);
    $('.rating label').css('color', '#ccc');
  }

  // Open modal
  reviewBtn.on('click', function () {
    reviewModal.removeClass('hidden');
    resetReviewForm();
  });

  // Close modal
  closeReviewModalBtn.on('click', function () {
    reviewModal.addClass('hidden');
    resetReviewForm();
  });

  // Close modal on outside click
  reviewModal.on('click', function (e) {
    if ($(e.target).is(reviewModal)) {
      reviewModal.addClass('hidden');
      resetReviewForm();
    }
  });

  // Star rating change
  modalRatingInputs.on('change', function () {
    const selectedRating = $(this).val();
    modalRatingInputs.each(function () {
      const starLabel = $(`label[for="${$(this).attr('id')}"]`);
      if (parseInt($(this).val()) <= selectedRating) {
        starLabel.css('color', '#FFD700');
      } else {
        starLabel.css('color', '#ccc');
      }
    });
  });

  // Submit review
  submitReviewModalBtn.on('click', function () {
    const reviewComment = reviewCommentInput.val();
    const rating = parseInt(modalRatingInputs.filter(':checked').val());

    if (!rating) {
      Swal.fire('Please select a star rating.', '', 'warning');
      return;
    }
    if (!reviewComment.trim()) {
      Swal.fire('Please write a review comment.', '', 'warning');
      return;
    }

    if (!business) {
      Swal.fire('Error', 'Please select a business first.', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('comment', reviewComment);
    formData.append('rating', rating);
    formData.append('businessId', business);

    $.ajax({
      url: "http://localhost:8080/review/addReview",
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
      data: formData,
      processData: false,
      contentType: false,
      success: function (response) {
        Swal.fire('Review Submitted!', 'Thank you for your feedback.', 'success');
        resetReviewForm();
        reviewModal.addClass('hidden');
        getReviews(business);
      },
      error: function () {
        Swal.fire('Error', 'Failed to submit review.', 'error');
      }
    });
  });
}


$(document).ready(function () {

    reviewModal();

  $('#hotelBtn').click(function () {

    $.ajax({
      url: `http://localhost:8080/business/getBusiness/HOTEL?latitude=${userLocation2.latitude}&longitude=${userLocation2.longitude}`,
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
      success: (response) => {
        console.log("Businesses received successfully:", response.data);
        showBusinessesOnMap(response.data);
      },
      error: () => console.error("Failed to get businesses.")
    });


  });


  $('#restaurantBtn').click(function () {

    $.ajax({
      url: `http://localhost:8080/business/getBusiness/RESTAURANT?latitude=${userLocation2.latitude}&longitude=${userLocation2.longitude}`,
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
      success: (response) => {
        console.log("Businesses received successfully:", response.data);
        showBusinessesOnMap(response.data);
      },
      error: () => console.error("Failed to get businesses.")
    });


  });

  $('#spaBtn').click(function () {

    $.ajax({
      url: `http://localhost:8080/business/getBusiness/SPA?latitude=${userLocation2.latitude}&longitude=${userLocation2.longitude}`,
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
      success: (response) => {
        console.log("Businesses received successfully:", response.data);
        showBusinessesOnMap(response.data);
      },
      error: () => console.error("Failed to get businesses.")
    });


  });


  $('#spaBtn').click(function () {

    $.ajax({
      url: `http://localhost:8080/business/getBusiness/SPA?latitude=${userLocation2.latitude}&longitude=${userLocation2.longitude}`,
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
      success: (response) => {
        console.log("Businesses received successfully:", response.data);
        showBusinessesOnMap(response.data);
      },
      error: () => console.error("Failed to get businesses.")
    });


  });

  $('#guestHouseBtn').click(function () {

    $.ajax({
      url: `http://localhost:8080/business/getBusiness/GUEST_HOUSE?latitude=${userLocation2.latitude}&longitude=${userLocation2.longitude}`,
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
      success: (response) => {
        console.log("Businesses received successfully:", response.data);
        showBusinessesOnMap(response.data);
      },
      error: () => console.error("Failed to get businesses.")
    });


  });


  $('#allBtn').click(function () {
    getNearByBusinesses(userLocation2.latitude, userLocation2.longitude);
  });


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


});


