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

        getNearByBusinesses(userLocation.lat , userLocation.lng);

      },
      (error) => {
        console.log('Location not available, using default.', error);
      },
      { enableHighAccuracy: true }
    );
  }
}

let userLocation2;
function getNearByBusinesses(latitude , longitude) {
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
    });

    markers.push(marker);
  });
}


$(document).ready(function () {


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
    getNearByBusinesses(userLocation2.latitude , userLocation2.longitude);
  });

});


