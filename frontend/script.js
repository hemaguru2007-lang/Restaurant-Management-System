let users = [];


/* =========================
   REGISTER
========================= */

const registerForm =
    document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async function(event) {

        event.preventDefault();

        const name =
            document.getElementById("registerName").value;

        const email =
            document.getElementById("registerEmail").value;

        const password =
            document.getElementById("registerPassword").value;

        const confirmPassword =
            document.getElementById("confirmPassword").value;


        // Check passwords

        if (password !== confirmPassword) {

            document.getElementById(
                "registerMessage"
            ).innerText =
                "Passwords do not match!";

            return;
        }


        // Send data to Express backend

        try {

            const response = await fetch(
                "http://localhost:5000/api/register",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        name: name,
                        email: email,
                        password: password
                    })
                }
            );


            const data = await response.json();


            if (response.ok) {

                document.getElementById(
                    "registerMessage"
                ).innerText =
                    data.message;

                registerForm.reset();

            } else {

                document.getElementById(
                    "registerMessage"
                ).innerText =
                    data.message;

            }


        } catch (error) {

            console.log(error);

            document.getElementById(
                "registerMessage"
            ).innerText =
                "Unable to connect to server.";

        }

    });

}


/* =========================
   LOGIN
========================= */

const loginForm =
    document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async function(event) {

        event.preventDefault();


        const email =
            document.getElementById("loginEmail").value;

        const password =
            document.getElementById("loginPassword").value;


        try {

            const response = await fetch(
                "http://localhost:5000/api/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        email: email,

                        password: password

                    })
                }
            );


            const data = await response.json();


            if (response.ok) {

                document.getElementById(
                    "loginMessage"
                ).innerText =
                    "Welcome " + data.user.name;


                // Store logged-in user

                localStorage.setItem(
                    "user",
                    JSON.stringify(data.user)
                );


                console.log(
                    "Logged in user:",
                    data.user
                );


            } else {

                document.getElementById(
                    "loginMessage"
                ).innerText =
                    data.message;

            }


        } catch (error) {

            console.log(error);

            document.getElementById(
                "loginMessage"
            ).innerText =
                "Unable to connect to server.";

        }

    });

}