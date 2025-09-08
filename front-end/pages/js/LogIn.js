$('#loginBtn').click(function() {
    let email = $('#email').val();
    let password = $('#password').val(); 

    if (email === '') {
        Swal.fire({
            title: "Error!",
            text: "email cannot be empty.",
            icon: "error",
            confirmButtonText: "OK"
        });
        return; 
    }

    if ( password === '') {
        Swal.fire({
            title: "Error!",
            text: "password cannot be empty.",
            icon: "error",
            confirmButtonText: "OK"
        });
        return;
    }

    const loginData = {
        email: email, 
        password: password
    };

  console.log('login data:', loginData);

   $.ajax({
            url: 'http://localhost:8080/auth/login',   
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(loginData),
            success: function (response) {
                console.log('login successful:', response);

                
                localStorage.setItem('token', response.data.accessToken);
                formClear();
              
                Swal.fire({
                    title: "Success!",
                    text: "Login successful! Redirecting to login...",
                    icon: "success",
                    confirmButtonText: "OK"
                }).then(() => {
                    //window.location.href = 'login.html'; 
                    let token = localStorage.getItem('token');
                    const payloadBase64 = token.split('.')[1];
                    const decodedPayload = atob(payloadBase64);
                    const payloadObject = JSON.parse(decodedPayload);
                    const userRole = payloadObject.role;
                    const userEmail = payloadObject.sub;

                    console.log("Decoded Payload:", payloadObject);


                    if (userRole === 'TOURIST') {
                        window.location.href = './tourist/TouristDashBoard.html';
                    } else if (userRole === 'BUSINESS') {
                        window.location.href = './hotel/HotelDashBoard.html';
                    }

                });
            },
            error: function (xhr, status, error) {
               console.log('Registration failed:', error);
                Swal.fire({
                    title: "Error!",
                    text: "login failed. Please try again.",
                    icon: "error",
                    confirmButtonText: "OK"
                });
            }
        })
});

function formClear() {
    $('#email').val(''); 
    $('#password').val(''); 
}

// Toggle password visibility
$('#togglePassword').on('click', function() {
    const passwordField = $('#password');
    const passwordFieldType = passwordField.attr('type');
    const toggleIcon = $(this).find('svg');

    if (passwordFieldType === 'password') {
        passwordField.attr('type', 'text');
        toggleIcon.html('<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12c0 1.657-1.414 3-3 3s-3-1.343-3-3 1.414-3 3-3 3 1.343 3 3zm6 0c0 4.418-4.03 8-9 8s-9-3.582-9-8 4.03-8 9-8 9 3.582 9 8z" />');
    } else {
        passwordField.attr('type', 'password');
        // Replacing the complex eye-slash with a simpler, clearer one
        toggleIcon.html('<path fill-rule="evenodd" d="M3.987 2.147a.75.75 0 00-1.06 1.06l16.5 16.5a.75.75 0 101.06-1.06l-16.5-16.5zM12 9a3 3 0 100 6 3 3 0 000-6z" clip-rule="evenodd" />');
    }
});