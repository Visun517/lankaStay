// Show/hide business fields and Google button
const accountType = document.getElementById('accountType');
const googleButton = document.getElementById('googleButton');
const socialSignupSection = document.getElementById('socialSignupSection');

// Password toggle functionality
document.addEventListener('DOMContentLoaded', function () {
    // Password field toggle
    const togglePassword = document.getElementById('togglePassword');
    const password = document.getElementById('password');
    const passwordEye = document.getElementById('passwordEye');
    const passwordEyeSlash = document.getElementById('passwordEyeSlash');

    togglePassword.addEventListener('click', function () {
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

    toggleConfirmPassword.addEventListener('click', function () {
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

    console.log('accountType:', accountType);
    console.log('userName:', userName);
    console.log('email:', email);
    console.log('password:', password);
    console.log('confirmPassword:', confirmPassword);
    console.log('Terms Agreed:', termsAgreed);

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
                formClear();
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
        // let businessType = $('#businessType').val().toUpperCase();
        // let contactNumber = $('#contactNumber').val().trim();
        let role = 'BUSINESS';

        // console.log('Business Type:', businessType);
        // console.log('Contact Number:', contactNumber);
        console.log('userName:', userName);

        let businessData = {
            userName: userName,
            password: password,
            email: email,
            role: role
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

function formClear() {
    $('#accountType').val('');
    $('#userName').val('');
    $('#email').val('');
    $('#password').val('');
    $('#confirmPassword').val('');
    $('#businessType').val('');
}

// Initialize Google Identity Services
window.onload = function () {
    google.accounts.id.initialize({
        client_id: "373965543020-5meekfomuteiphtavsohv76ag75abd7n.apps.googleusercontent.com",
        callback: handleCredentialResponse,
        ux_mode: "popup" // popup mode required
    });

    // Render Google Sign-In button
    google.accounts.id.renderButton(
        document.getElementById("gsiButton"),
        { theme: "outline", size: "large" }
    );
};



// Callback after Google login
function handleCredentialResponse(response) {
    console.log("JWT token:", response.credential);

    const modal = document.getElementById("accountTypeModal");
    modal.classList.remove("hidden");

    modal.querySelectorAll("button").forEach(btn => {
        btn.addEventListener("click", () => {
            const accountType = btn.getAttribute("data-type");
            console.log("Selected account type:", accountType);

            modal.classList.add("hidden");

            const googleAuth = {
                token:  response.credential
            }

            $.ajax({
                url: `http://localhost:8080/auth/register/google/${accountType}`,  // backend endpoint
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(googleAuth),
                success: function (res) {
                    localStorage.setItem('token', res.data.accessToken);
                    //const payload = JSON.parse(atob(res.data.accessToken.split('.')[1]));
                    Swal.fire({
                        title: "Success!",
                        text: "Registration successful! Redirecting to login...",
                        icon: "success",
                        confirmButtonText: "OK"
                    }).then(() => {
                        window.location.href = 'login.html';
                    });

                },
                error: function (err) {
                    Swal.fire({
                        title: "Error!",
                        text: "Registration failed. Please try again.",
                        icon: "error",
                        confirmButtonText: "OK"
                    });
                }
            });
        });
    });
}
