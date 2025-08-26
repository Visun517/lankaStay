// If location access is now granted, redirect to offers page
document.addEventListener('DOMContentLoaded', function () {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        window.location.href = 'NearbyHotelOffersOnly.html';
      },
      function (error) {
        // Do nothing, stay on this page
      }
    );
  }
});

document.addEventListener("DOMContentLoaded", () => {
  // const hotels = [
  //   {
  //     name: "Colombo Grand",
  //     lat: 0.4,
  //     lng: 0.5,
  //     offer: "20% Off!",
  //     rooms: 5,
  //     img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=400&q=80",
  //   },
  //   {
  //     name: "Kandy Palace",
  //     lat: 0.6,
  //     lng: 0.7,
  //     offer: "Free Breakfast",
  //     rooms: 3,
  //     img: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=facearea&w=400&q=80",
  //   },
  //   {
  //     name: "Galle Beach Resort",
  //     lat: 0.3,
  //     lng: 0.2,  
  //     offer: "Stay 3, Pay 2",
  //     rooms: 2,
  //     img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=facearea&w=400&q=80",
  //   },
  // ];

  function renderMarkers() {
    const container = document.getElementById("hotelMarkers");
    container.innerHTML = "";
    hotels.forEach((hotel) => {
      const top = `${20 + hotel.lat * 60}%`;
      const left = `${10 + hotel.lng * 80}%`;

      const marker = document.createElement("div");
      marker.className = "absolute z-20 cursor-pointer pointer-events-auto group";
      marker.style.top = top;
      marker.style.left = left;
      marker.innerHTML = `
            <svg class="w-8 h-8 text-red-500 drop-shadow-lg group-hover:scale-110 transition-transform duration-200" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 2C6.686 2 4 4.686 4 8c0 4.418 5.293 9.293 5.52 9.52a1 1 0 0 0 1.415 0C10.707 17.293 16 12.418 16 8c0-3.314-2.686-6-6-6zm0 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" clip-rule="evenodd"/>
            </svg>
          `;
      marker.addEventListener("click", () => openModal(hotel));
      container.appendChild(marker);
    });
  }

  function openModal(hotel) {
    document.getElementById("hotelModal").classList.remove("hidden");
    document.getElementById("hotelName").textContent = hotel.name;
    document.getElementById("hotelOffer").textContent = `Special Offer: ${hotel.offer}`;
    document.getElementById("hotelRooms").textContent = `Available Rooms: ${hotel.rooms}`;
    document.getElementById("hotelImage").src = hotel.img;
  }

  document.getElementById("closeModal").onclick = () => {
    document.getElementById("hotelModal").classList.add("hidden");
  };

  document.getElementById("searchForm").onsubmit = (e) => {
    e.preventDefault();
    renderMarkers();
  };

  renderMarkers(); // Initial render
});

