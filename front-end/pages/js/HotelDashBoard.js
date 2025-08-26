let map, marker, geocoder;

  function initMap() {
    const defaultLocation = { lat: 6.9271, lng: 79.8612 }; // Colombo

    map = new google.maps.Map(document.getElementById("map"), {
      center: defaultLocation,
      zoom: 10,
    });

    marker = new google.maps.Marker({
      position: defaultLocation,
      map: map,
      draggable: true,
    });

    geocoder = new google.maps.Geocoder();

    // Function to update lat/lng + address
    function updateLocation(latLng) {
      marker.setPosition(latLng);

      document.getElementById("latitude").value = latLng.lat();
      document.getElementById("longitude").value = latLng.lng();

      // Reverse geocode: lat/lng -> address
      geocoder.geocode({ location: latLng }, function(results, status) {
        if (status === "OK") {
          if (results[0]) {
            document.getElementById("address").value = results[0].formatted_address;
          } else {
            document.getElementById("address").value = "Address not found";
          }
        } else {
          document.getElementById("address").value = "Geocoder failed: " + status;
        }
      });
    }

    // Marker drag
    google.maps.event.addListener(marker, 'dragend', function() {
      updateLocation(marker.getPosition());
    });

    // Map click
    google.maps.event.addListener(map, 'click', function(event) {
      updateLocation(event.latLng);
    });
  }