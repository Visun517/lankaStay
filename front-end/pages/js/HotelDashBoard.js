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

   document.addEventListener('DOMContentLoaded', function() {
      const addPhotoBtn = document.getElementById('addPhotoBtn');
      const addPhotoModal = document.getElementById('addPhotoModal');
      const closeModal = document.getElementById('closeModal');
      const cancelBtn = document.getElementById('cancelBtn');
      const imageUploadArea = document.getElementById('imageUploadArea');
      const imageInput = document.getElementById('imageInput');
      const imagePreview = document.getElementById('imagePreview');
      const previewImg = document.getElementById('previewImg');
      const imageDescription = document.getElementById('imageDescription');
      const imageSubtitle = document.getElementById('imageSubtitle');
      const saveBtn = document.getElementById('saveBtn');

      // Open modal when Add Photo card is clicked
      addPhotoBtn.addEventListener('click', function() {
        addPhotoModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
      });

      // Close modal functions
      function closeModalFunc() {
        addPhotoModal.classList.add('hidden');
        document.body.style.overflow = 'auto';
        // Reset form
        imageInput.value = '';
        imagePreview.classList.add('hidden');
        imageDescription.value = '';
        imageSubtitle.value = '';
      }

      closeModal.addEventListener('click', closeModalFunc);
      cancelBtn.addEventListener('click', closeModalFunc);

      // Close modal when clicking outside
      addPhotoModal.addEventListener('click', function(e) {
        if (e.target === addPhotoModal) {
          closeModalFunc();
        }
      });

      // Handle image upload
      imageUploadArea.addEventListener('click', function() {
        imageInput.click();
      });

      // Drag and drop functionality
      imageUploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        imageUploadArea.classList.add('border-blue-400', 'bg-blue-50');
      });

      imageUploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        imageUploadArea.classList.remove('border-blue-400', 'bg-blue-50');
      });

      imageUploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        imageUploadArea.classList.remove('border-blue-400', 'bg-blue-50');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
          handleImageFile(files[0]);
        }
      });

      // Handle file input change
      imageInput.addEventListener('change', function(e) {
        if (e.target.files.length > 0) {
          handleImageFile(e.target.files[0]);
        }
      });

      // Process selected image file
      function handleImageFile(file) {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = function(e) {
            previewImg.src = e.target.result;
            imagePreview.classList.remove('hidden');
          };
          reader.readAsDataURL(file);
        } else {
          alert('Please select a valid image file.');
        }
      }

      // Save button functionality
      saveBtn.addEventListener('click', function() {
        const description = imageDescription.value.trim();
        const subtitle = imageSubtitle.value.trim();
        
        if (!imageInput.files[0]) {
          alert('Please select an image to upload.');
          return;
        }
        
        if (!description) {
          alert('Please enter a description for the image.');
          return;
        }
        
        if (!subtitle) {
          alert('Please enter a subtitle for the image.');
          return;
        }
        
        // Here you would typically send the data to your server
        // For now, we'll just show a success message and close the modal
        alert('Photo saved successfully!');
        closeModalFunc();
        
        // You can add the new image to the gallery here
        // This would involve creating a new image element and adding it to the grid
      });

      // Keyboard shortcuts
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !addPhotoModal.classList.contains('hidden')) {
          closeModalFunc();
        }
      });

      // Package Modal Functionality
      const addPackageBtn = document.getElementById('addPackageBtn');
      const addPackageModal = document.getElementById('addPackageModal');
      const closePackageModal = document.getElementById('closePackageModal');
      const cancelPackageBtn = document.getElementById('cancelPackageBtn');
      const savePackageBtn = document.getElementById('savePackageBtn');

      // Open package modal
      addPackageBtn.addEventListener('click', function() {
        addPackageModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
      });

      // Close package modal functions
      function closePackageModalFunc() {
        addPackageModal.classList.add('hidden');
        document.body.style.overflow = 'auto';
        // Reset form
        document.getElementById('packageName').value = '';
        document.getElementById('packageType').value = '';
        document.getElementById('availabilityStartDate').value = '';
        document.getElementById('availabilityEndDate').value = '';
        document.getElementById('isMealInclude').value = '';
        document.getElementById('packageDescription').value = '';
        document.getElementById('packageImage').value = '';
        document.getElementById('packagePrice').value = '';
        document.getElementById('priceType').value = 'per night';
      }

      closePackageModal.addEventListener('click', closePackageModalFunc);
      cancelPackageBtn.addEventListener('click', closePackageModalFunc);

      // Close package modal when clicking outside
      addPackageModal.addEventListener('click', function(e) {
        if (e.target === addPackageModal) {
          closePackageModalFunc();
        }
      });

      // Save package functionality
      savePackageBtn.addEventListener('click', function() {
        const packageName = document.getElementById('packageName').value.trim();
        const packageType = document.getElementById('packageType').value;
        const availabilityStartDate = document.getElementById('availabilityStartDate').value;
        const availabilityEndDate = document.getElementById('availabilityEndDate').value;
        const isMealInclude = document.getElementById('isMealInclude').value;
        const packageDescription = document.getElementById('packageDescription').value.trim();
        const packageImage = document.getElementById('packageImage').files[0];
        const packagePrice = document.getElementById('packagePrice').value;
        const priceType = document.getElementById('priceType').value;

        if (!packageName) {
          alert('Please enter a package name.');
          return;
        }

        if (!packageType) {
          alert('Please select a package type.');
          return;
        }

        if (!availabilityStartDate) {
          alert('Please select an availability start date.');
          return;
        }

        if (!availabilityEndDate) {
          alert('Please select an availability end date.');
          return;
        }

        if (!isMealInclude) {
          alert('Please select a meal inclusion option.');
          return;
        }

        if (!packageDescription) {
          alert('Please enter a description for the package.');
          return;
        }

        if (!packageImage) {
          alert('Please select an image for the package.');
          return;
        }

        if (!packagePrice || packagePrice <= 0) {
          alert('Please enter a valid price.');
          return;
        }

        // Here you would typically send the data to your server
        // For now, we'll just show a success message and close the modal
        alert('Package saved successfully!');
        closePackageModalFunc();

        // You can add the new package to the grid here
        // This would involve creating a new package element and adding it to the grid
      });

      // Keyboard shortcuts for package modal
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !addPackageModal.classList.contains('hidden')) {
          closePackageModalFunc();
        }
      });

      // Special Offer Modal Functionality
      const addSpecialOfferBtn = document.getElementById('addSpecialOfferBtn');
      const addSpecialOfferModal = document.getElementById('addSpecialOfferModal');
      const closeSpecialOfferModal = document.getElementById('closeSpecialOfferModal');
      const cancelSpecialOfferBtn = document.getElementById('cancelSpecialOfferBtn');
      const saveSpecialOfferBtn = document.getElementById('saveSpecialOfferBtn');

      // Open special offer modal
      addSpecialOfferBtn.addEventListener('click', function() {
        addSpecialOfferModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
      });

      // Close special offer modal functions
      function closeSpecialOfferModalFunc() {
        addSpecialOfferModal.classList.add('hidden');
        document.body.style.overflow = 'auto';
        // Reset form
        document.getElementById('offerTitle').value = '';
        document.getElementById('discountPercentage').value = '';
        document.getElementById('validFrom').value = '';
        document.getElementById('validUntil').value = '';
        document.getElementById('offerDescription').value = '';
        document.getElementById('offerImageUrl').value = '';
      }

      closeSpecialOfferModal.addEventListener('click', closeSpecialOfferModalFunc);
      cancelSpecialOfferBtn.addEventListener('click', closeSpecialOfferModalFunc);

      // Close special offer modal when clicking outside
      addSpecialOfferModal.addEventListener('click', function(e) {
        if (e.target === addSpecialOfferModal) {
          closeSpecialOfferModalFunc();
        }
      });

      // Save special offer functionality
      saveSpecialOfferBtn.addEventListener('click', function() {
        const offerTitle = document.getElementById('offerTitle').value.trim();
        const discountPercentage = document.getElementById('discountPercentage').value;
        const validFrom = document.getElementById('validFrom').value;
        const validUntil = document.getElementById('validUntil').value;
        const offerDescription = document.getElementById('offerDescription').value.trim();
        const offerImageUrl = document.getElementById('offerImageUrl').value;

        if (!offerTitle) {
          alert('Please enter an offer title.');
          return;
        }

        if (!discountPercentage || discountPercentage <= 0 || discountPercentage > 100) {
          alert('Please enter a valid discount percentage (1-100).');
          return;
        }

        if (!validFrom) {
          alert('Please select a valid "Valid From" date.');
          return;
        }

        if (!validUntil) {
          alert('Please select a valid "Valid Until" date.');
          return;
        }

        if (!offerDescription) {
          alert('Please enter a description for the special offer.');
          return;
        }

        // Here you would typically send the data to your server
        // For now, we'll just show a success message and close the modal
        alert('Special offer saved successfully!');
        closeSpecialOfferModalFunc();

        // You can add the new special offer to the grid here
        // This would involve creating a new special offer element and adding it to the grid
      });

      // Keyboard shortcuts for special offer modal
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !addSpecialOfferModal.classList.contains('hidden')) {
          closeSpecialOfferModalFunc();
        }
      });

      // Calendar Functionality
      let currentDate = new Date();
      let currentMonth = currentDate.getMonth();
      let currentYear = currentDate.getFullYear();
      let availabilityData = {};
      let selectedDateKey = null;
      let selectedDayElement = null;

      // Initialize calendar
      function initCalendar() {
        updateMonthDisplay();
        generateCalendar();
        updateSummary();
      }

      // Update month display
      function updateMonthDisplay() {
        const monthNames = [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ];
        document.getElementById('currentMonthDisplay').textContent = 
          `${monthNames[currentMonth]} ${currentYear}`;
      }

      // Generate calendar for current month
      function generateCalendar() {
        const calendarDays = document.getElementById('calendarDays');
        calendarDays.innerHTML = '';

        const firstDay = new Date(currentYear, currentMonth, 1);
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        const startDate = new Date(firstDay);
        const endDate = new Date(lastDay);

        // Add empty cells for days before the first day of the month
        const firstDayOfWeek = firstDay.getDay();
        for (let i = 0; i < firstDayOfWeek; i++) {
          const emptyDay = document.createElement('div');
          emptyDay.className = 'p-2 text-center text-gray-300';
          calendarDays.appendChild(emptyDay);
        }

        // Generate days for the current month
        for (let day = 1; day <= lastDay.getDate(); day++) {
          const dayElement = createDayElement(day);
          calendarDays.appendChild(dayElement);
        }
      }

      // Create individual day element
      function createDayElement(day) {
        const dayElement = document.createElement('div');
        const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const isWeekend = isWeekendDay(currentYear, currentMonth, day);
        
        // Check if availability is set for this date
        const isOpen = availabilityData[dateKey] !== false; // Default to open if not set
        
        let baseClasses = 'p-3 text-center rounded-lg cursor-pointer transition-all duration-200 font-medium hover:scale-105';
        let statusClasses = '';
        
        if (isOpen) {
          if (isWeekend) {
            // Weekend and Open - Special highlighting
            statusClasses = 'bg-green-200 text-green-800 hover:bg-green-300 border-2 border-orange-400 font-bold';
          } else {
            // Weekday and Open
            statusClasses = 'bg-green-100 text-green-700 hover:bg-green-200';
          }
        } else {
          if (isWeekend) {
            // Weekend and Closed - Special highlighting
            statusClasses = 'bg-red-200 text-red-800 hover:bg-red-300 border-2 border-orange-400 font-bold';
          } else {
            // Weekday and Closed
            statusClasses = 'bg-red-100 text-red-700 hover:bg-red-200';
          }
        }
        
        dayElement.className = `${baseClasses} ${statusClasses}`;
        dayElement.textContent = day;
        dayElement.setAttribute('data-date', dateKey);
        dayElement.setAttribute('data-day', day);
        
        // Add click event to show confirmation modal
        dayElement.addEventListener('click', function() {
          showDateConfirmationModal(dateKey, dayElement);
        });
        
        return dayElement;
      }

      // Check if a day is a weekend
      function isWeekendDay(year, month, day) {
        const date = new Date(year, month, day - 1);
        const dayOfWeek = date.getDay();
        return dayOfWeek === 0 || dayOfWeek === 6; // Sunday = 0, Saturday = 6
      }

      // Show date confirmation modal
      function showDateConfirmationModal(dateKey, dayElement) {
        selectedDateKey = dateKey;
        selectedDayElement = dayElement;
        
        // Parse date for display
        const [year, month, day] = dateKey.split('-');
        const date = new Date(year, month - 1, day);
        const monthNames = [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ];
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        
        // Update modal content
        document.getElementById('selectedDateDisplay').textContent = `${monthNames[date.getMonth()]} ${day}, ${year}`;
        document.getElementById('selectedDayDisplay').textContent = dayNames[date.getDay()];
        
        // Set current status
        const isCurrentlyOpen = availabilityData[dateKey] !== false;
        if (isCurrentlyOpen) {
          document.querySelector('input[value="open"]').checked = true;
        } else {
          document.querySelector('input[value="closed"]').checked = true;
        }
        
        // Show modal
        document.getElementById('dateConfirmationModal').classList.remove('hidden');
        document.body.style.overflow = 'hidden';
      }

      // Close date confirmation modal
      function closeDateConfirmationModal() {
        document.getElementById('dateConfirmationModal').classList.add('hidden');
        document.body.style.overflow = 'auto';
        selectedDateKey = null;
        selectedDayElement = null;
      }

      // Confirm date status change
      function confirmDateStatusChange() {
        if (!selectedDateKey || !selectedDayElement) return;
        
        const selectedStatus = document.querySelector('input[name="dateStatus"]:checked').value;
        const newStatus = selectedStatus === 'open';
        
        // Update availability data
        availabilityData[selectedDateKey] = newStatus;
        
        // Update visual appearance
        updateDayElementAppearance(selectedDayElement, newStatus);
        
        // Update summary
        updateSummary();
        
        // Close modal
        closeDateConfirmationModal();
      }

      // Update day element appearance
      function updateDayElementAppearance(dayElement, isOpen) {
        const day = parseInt(dayElement.getAttribute('data-day'));
        const isWeekend = isWeekendDay(currentYear, currentMonth, day);
        
        let baseClasses = 'p-3 text-center rounded-lg cursor-pointer transition-all duration-200 font-medium hover:scale-105';
        let statusClasses = '';
        
        if (isOpen) {
          if (isWeekend) {
            statusClasses = 'bg-green-200 text-green-800 hover:bg-green-300 border-2 border-orange-400 font-bold';
          } else {
            statusClasses = 'bg-green-100 text-green-700 hover:bg-green-200';
          }
        } else {
          if (isWeekend) {
            statusClasses = 'bg-red-200 text-red-800 hover:bg-red-300 border-2 border-orange-400 font-bold';
          } else {
            statusClasses = 'bg-red-100 text-red-700 hover:bg-red-200';
          }
        }
        
        dayElement.className = `${baseClasses} ${statusClasses}`;
      }

      // Update availability summary
      function updateSummary() {
        let openCount = 0;
        let closedCount = 0;
        let totalCount = 0;
        
        // Count days in current month
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        totalCount = lastDay.getDate();
        
        // Count availability status
        for (let day = 1; day <= totalCount; day++) {
          const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          if (availabilityData[dateKey] !== false) {
            openCount++;
          } else {
            closedCount++;
          }
        }
        
        document.getElementById('openDaysCount').textContent = openCount;
        document.getElementById('closedDaysCount').textContent = closedCount;
        document.getElementById('totalDaysCount').textContent = totalCount;
      }

      // Navigate to previous month
      document.getElementById('prevMonthBtn').addEventListener('click', function() {
        currentMonth--;
        if (currentMonth < 0) {
          currentMonth = 11;
          currentYear--;
        }
        updateMonthDisplay();
        generateCalendar();
        updateSummary();
      });

      // Navigate to next month
      document.getElementById('nextMonthBtn').addEventListener('click', function() {
        currentMonth++;
        if (currentMonth > 11) {
          currentMonth = 0;
          currentYear++;
        }
        updateMonthDisplay();
        generateCalendar();
        updateSummary();
      });

      // Set all days to open
      document.getElementById('setAllOpenBtn').addEventListener('click', function() {
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        for (let day = 1; day <= lastDay.getDate(); day++) {
          const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          availabilityData[dateKey] = true;
        }
        generateCalendar();
        updateSummary();
      });

      // Set all days to closed
      document.getElementById('setAllClosedBtn').addEventListener('click', function() {
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        for (let day = 1; day <= lastDay.getDate(); day++) {
          const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          availabilityData[dateKey] = false;
        }
        generateCalendar();
        updateSummary();
      });

      // Set weekends to closed
      document.getElementById('setWeekendsClosedBtn').addEventListener('click', function() {
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        for (let day = 1; day <= lastDay.getDate(); day++) {
          if (isWeekendDay(currentYear, currentMonth, day)) {
            const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            availabilityData[dateKey] = false;
          }
        }
        generateCalendar();
        updateSummary();
      });

      // Save availability changes
      document.getElementById('saveAvailabilityBtn').addEventListener('click', function() {
        // Here you would typically send the availabilityData to your server
        console.log('Availability data to save:', availabilityData);
        alert('Availability settings saved successfully!');
      });

      // Modal event listeners
      document.getElementById('closeDateModal').addEventListener('click', closeDateConfirmationModal);
      document.getElementById('cancelDateBtn').addEventListener('click', closeDateConfirmationModal);
      document.getElementById('confirmDateBtn').addEventListener('click', confirmDateStatusChange);

      // Close modal when clicking outside
      document.getElementById('dateConfirmationModal').addEventListener('click', function(e) {
        if (e.target === document.getElementById('dateConfirmationModal')) {
          closeDateConfirmationModal();
        }
      });

      // Keyboard shortcuts for modal
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !document.getElementById('dateConfirmationModal').classList.contains('hidden')) {
          closeDateConfirmationModal();
        }
      });

      // Initialize calendar when page loads
      initCalendar();
    });