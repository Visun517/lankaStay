
// Dynamic height adjustment
function adjustHeights() {
  const mainContainer = document.getElementById('mainContainer');
  const bannerSection = document.getElementById('bannerSection');
  const formSection = document.getElementById('formSection');
  const formWrapper = document.getElementById('formWrapper');

  // Reset heights
  bannerSection.style.height = 'auto';
  formSection.style.height = 'auto';
  mainContainer.style.height = 'auto';

  // Get form height and apply to both sections
  const formHeight = formWrapper.scrollHeight;
  const minHeight = window.innerHeight; // Viewport height
  const targetHeight = Math.max(formHeight + 100, minHeight); // Add padding, ensure min viewport height

  bannerSection.style.minHeight = `${targetHeight}px`;
  formSection.style.minHeight = `${targetHeight}px`;
  mainContainer.style.minHeight = `${targetHeight}px`;
}

// Show/hide business fields and Google button
const accountType = document.getElementById('accountType');
const businessFields = document.getElementById('businessFields');
const googleButton = document.getElementById('googleButton');
const socialSignupSection = document.getElementById('socialSignupSection');

function updateAccountTypeDependentUI(selectedType) {
  const isBusiness = selectedType === 'business';
  businessFields.classList.toggle('hidden', !isBusiness);
  if (googleButton) googleButton.classList.toggle('hidden', isBusiness);
  if (socialSignupSection) socialSignupSection.classList.toggle('hidden', isBusiness);
  setTimeout(adjustHeights, 100);
}

accountType.addEventListener('change', function () {
  updateAccountTypeDependentUI(this.value);
});

// Initialize UI on load
updateAccountTypeDependentUI(accountType.value);

// Form submit handler
const signupForm = document.getElementById('signupForm');
const errorMessage = document.getElementById('errorMessage');
signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  errorMessage.classList.add('hidden');

  const formData = new FormData(signupForm);
  const data = Object.fromEntries(formData);

  // Client-side validation
  if (!data.accountType) {
    errorMessage.textContent = 'Please select an account type';
    errorMessage.classList.remove('hidden');
    return;
  }
  if (data.accountType === 'business' && (!data.businessType || !data.businessName || !data.latitude || !data.longitude || !data.address || !data.contact)) {
    errorMessage.textContent = 'Please fill all business fields';
    errorMessage.classList.remove('hidden');
    return;
  }
  if (data.password !== data.confirmPassword) {
    errorMessage.textContent = 'Passwords do not match';
    errorMessage.classList.remove('hidden');
    return;
  }
  if (!data.terms) {
    errorMessage.textContent = 'You must agree to the terms';
    errorMessage.classList.remove('hidden');
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errorMessage.textContent = 'Invalid email format';
    errorMessage.classList.remove('hidden');
    return;
  }

  // Backend call
  try {
    const response = await fetch('http://your-backend-url/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await response.json();
    if (response.ok) {
      window.location.href = 'login.html';
    } else {
      errorMessage.textContent = result.message || 'Registration failed';
      errorMessage.classList.remove('hidden');
    }
  } catch (err) {
    errorMessage.textContent = 'An error occurred. Please try again.';
    errorMessage.classList.remove('hidden');
    console.error(err);
  }
});

// // Google/Twitter Sign-Up (Placeholder)
// document.getElementById('googleSignUp').addEventListener('click', () => {
//   alert('Google Sign-Up not implemented yet. Add OAuth logic.');
// });
// document.getElementById('twitterSignUp').addEventListener('click', () => {
//   alert('Twitter Sign-Up not implemented yet. Add OAuth logic.');
// });

// Initial height adjustment and on resize
window.addEventListener('resize', adjustHeights);
adjustHeights(); // Run on page load

// Password toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    // Password field toggle
    const togglePassword = document.getElementById('togglePassword');
    const password = document.getElementById('password');
    const passwordEye = document.getElementById('passwordEye');
    const passwordEyeSlash = document.getElementById('passwordEyeSlash');

    togglePassword.addEventListener('click', function() {
        const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
        password.setAttribute('type', type);
        
        // Toggle eye icons
        if (type === 'text') {
            passwordEye.classList.add('hidden');
            passwordEyeSlash.classList.remove('hidden');
        } else {
            passwordEye.classList.remove('hidden');
            passwordEyeSlash.classList.add('hidden');
        }
    });

    // Confirm password field toggle
    const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
    const confirmPassword = document.getElementById('confirmPassword');
    const confirmPasswordEye = document.getElementById('confirmPasswordEye');
    const confirmPasswordEyeSlash = document.getElementById('confirmPasswordEyeSlash');

    toggleConfirmPassword.addEventListener('click', function() {
        const type = confirmPassword.getAttribute('type') === 'password' ? 'text' : 'password';
        confirmPassword.setAttribute('type', type);
        
        // Toggle eye icons
        if (type === 'text') {
            confirmPasswordEye.classList.add('hidden');
            confirmPasswordEyeSlash.classList.remove('hidden');
        } else {
            confirmPasswordEye.classList.remove('hidden');
            confirmPasswordEyeSlash.classList.add('hidden');
        }
    });
});




$('#createAccountBtn').on('click', function () {

 

    let accountType = $('#accountType').val();
    let userName = $('#userName').val().trim(); 
    let email = $('#email').val().trim();
    let password = $('#password').val();
    let confirmPassword = $('#confirmPassword').val();
    let termsAgreed = $('#terms').is(':checked');

    console.log('Account Type:', accountType);

    if (!accountType) {
        Swal.fire({
            title: "Error!",
            text: "Please select an account type.",
            icon: "error",
            confirmButtonText: "OK"
        });
        return; 
    }

    if (userName === '') {
        Swal.fire({
            title: "Error!",
            text: "User Name cannot be empty.",
            icon: "error",
            confirmButtonText: "OK"
        });
        return;
    }

    if (email === '') {
        Swal.fire({
            title: "Error!",
            text: "Email address cannot be empty.",
            icon: "error",
            confirmButtonText: "OK"
        });
        return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        Swal.fire({
            title: "Error!",
            text: "Please enter a valid email address.",
            icon: "error",
            confirmButtonText: "OK"
        });
        return;
    }

    if (password === '' || confirmPassword === '') {
        Swal.fire({
            title: "Error!",
            text: "Password fields cannot be empty.",
            icon: "error",
            confirmButtonText: "OK"
        });
        return;
    }
    if (password.length < 6) {
        Swal.fire({
            title: "Error!",
            text: "Password must be at least 6 characters long.",
            icon: "error",
            confirmButtonText: "OK"
        });
        return;
    }
    if (password !== confirmPassword) {
        Swal.fire({
            title: "Error!",
            text: "Passwords do not match. Please re-enter.",
            icon: "error",
            confirmButtonText: "OK"
        });
        return;
    }

    if (!termsAgreed) {
        Swal.fire({
            title: "Error!",
            text: "You must agree to the Terms of Service and Privacy Policy.",
            icon: "error",
            confirmButtonText: "OK"
        });
        return;
    }


    if (accountType === 'tourist') {
        let role = 'TOURIST';

        let touristData = {
            userName: userName,
            password: password,
            email: email,
            role: role
        };
        console.log('Registering Tourist:', touristData);
        $.ajax({
            url: 'http://localhost:8080/auth/register/tourist',   
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(touristData),
            success: function (response) {
                console.log('Registration successful:', response);
                Swal.fire({
                    title: "Success!",
                    text: "Registration successful! Redirecting to login...",
                    icon: "success",
                    confirmButtonText: "OK"
                }).then(() => {
                    window.location.href = 'login.html'; 
                });
            },
            error: function (xhr, status, error) {
               console.log('Registration failed:', error);
                Swal.fire({
                    title: "Error!",
                    text: "Registration failed. Please try again.",
                    icon: "error",
                    confirmButtonText: "OK"
                });
            }
        })
      

    } 
    
    if (accountType === 'business') {
        let businessType = $('#businessType').val().toUpperCase();
        let contactNumber = $('#contact').val().trim();
        let role = 'BUSINESS';

        if (!businessType || userName === '' || contactNumber === '') {
            Swal.fire({
                title: "Error!",
                text: "Please fill all required business fields.",
                icon: "error",
                confirmButtonText: "OK"
            });
            return;
        }

        let businessData = {
            userName: userName,
            password: password,
            email: email,
            role: role,
            type: businessType,
            phoneNumber: contactNumber
        };

        console.log('Registering Business:', businessData);

         $.ajax({
            url: 'http://localhost:8080/auth/register/business',   
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(businessData),
            success: function (response) {
                Swal.fire({
                    title: "Success!",
                    text: "Registration successful! Redirecting to login...",
                    icon: "success",
                    confirmButtonText: "OK"
                }).then(() => {
                    window.location.href = 'login.html'; 
                });
            },
            error: function (xhr, status, error) {
                Swal.fire({
                    title: "Error!",
                    text: "Registration failed. Please try again.",
                    icon: "error",
                    confirmButtonText: "OK"
                });
            }
        })
  
    }
});

