document.addEventListener("DOMContentLoaded", function () {

    // =========================
    // MOBILE MENU
    // =========================

    const menuBtn = document.getElementById("menuBtn");
    const nav = document.getElementById("nav");

    if (menuBtn && nav) {
        menuBtn.addEventListener("click", function () {
            nav.classList.toggle("open");
        });

        document.querySelectorAll("nav a").forEach(function (link) {
            link.addEventListener("click", function () {
                nav.classList.remove("open");
            });
        });
    }


    // =========================
    // REGISTER
    // =========================

    const registerForm = document.getElementById("registerForm");

    if (registerForm) {

        registerForm.addEventListener("submit", async function (event) {

            event.preventDefault();

            const username =
                document.getElementById("registerUsername").value.trim();

            const email =
                document.getElementById("registerEmail").value.trim();

            const password =
                document.getElementById("registerPassword").value;

            const message =
                document.getElementById("registerMessage");


            if (message) {
                message.textContent = "Creating account...";
            }


            try {

                const response = await fetch(
                    "https://digital-payment-awareness.onrender.com/api/register"
                    {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify({
                            username: username,
                            email: email,
                            password: password
                        })
                    }
                );


                const data = await response.json();


                if (response.ok) {

                    if (message) {
                        message.textContent =
                            "✅ Account created successfully! Redirecting to login...";
                    }

                    setTimeout(function () {
                        window.location.href = "login.html";
                    }, 1500);

                } else {

                    if (message) {
                        message.textContent =
                            "❌ " + (data.message || "Registration failed.");
                    }
                }


            } catch (error) {

                console.error(error);

                if (message) {
                    message.textContent =
                        "❌ Cannot connect to the backend. Make sure the server is running.";
                }
            }

        });
    }


    // =========================
    // LOGIN
    // =========================

    const loginForm = document.getElementById("loginForm");

    if (loginForm) {

        loginForm.addEventListener("submit", async function (event) {

            event.preventDefault();


            const username =
                document.getElementById("username").value.trim();

            const email =
                document.getElementById("email").value.trim();

            const password =
                document.getElementById("password").value;

            const message =
                document.getElementById("message");


            if (message) {
                message.textContent = "Checking login...";
            }


            try {

                const response = await fetch(
                    "https://digital-payment-awareness.onrender.com/api/login"
                    {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify({
                            username: username,
                            email: email,
                            password: password
                        })
                    }
                );


                const data = await response.json();


                if (response.ok) {

                    sessionStorage.setItem(
                        "digitalPayLoggedIn",
                        "true"
                    );

                    sessionStorage.setItem(
                        "digitalPayUsername",
                        username
                    );

                    sessionStorage.setItem(
                        "digitalPayToken",
                        data.token
                    );


                    window.location.href = "dashboard.html";


                } else {

                    if (message) {
                        message.textContent =
                            "❌ " +
                            (data.message ||
                                "Invalid username, email or password.");
                    }
                }


            } catch (error) {

                console.error(error);

                if (message) {
                    message.textContent =
                        "❌ Cannot connect to the backend. Make sure the server is running.";
                }
            }

        });
    }

});
