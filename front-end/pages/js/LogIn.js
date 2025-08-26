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
