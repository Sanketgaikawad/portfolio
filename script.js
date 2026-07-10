// ================= DOM LOADED =================

document.addEventListener("DOMContentLoaded", function () {

    // ================= TYPEWRITER =================

    const text = "Hi, I'm Sanket Gaikwad";
    const typingElement = document.getElementById("typing");

    if (typingElement) {
        let index = 0;

        typingElement.textContent = "";

        function typeWriter() {
            if (index < text.length) {
                typingElement.textContent += text.charAt(index);
                index++;

                setTimeout(typeWriter, 120);
            } else {
                typingElement.classList.add("blink");
            }
        }

        typeWriter();
    }


    // ================= SUPABASE =================

    const supabaseUrl =
        "https://vvzesgdlopwkbmiuryzu.supabase.co";

    const supabaseKey =
        "sb_publishable_tkCWj6g-yKvgrFKQ21hgDg_CgzvEx8H";

    let supabaseClient = null;

    if (window.supabase) {
        supabaseClient = window.supabase.createClient(
            supabaseUrl,
            supabaseKey
        );

        console.log("Supabase connected successfully");
    } else {
        console.error(
            "Supabase library not loaded. Check the Supabase CDN script."
        );
    }


    // ================= CONTACT FORM =================

    const contactForm = document.getElementById("contact-form");

    if (contactForm) {
        contactForm.addEventListener("submit", async function (event) {

            event.preventDefault();

            const nameInput = document.getElementById("name");
            const emailInput = document.getElementById("email");
            const mobileInput = document.getElementById("mobile");
            const messageInput = document.getElementById("message");

            const submitButton =
                contactForm.querySelector('button[type="submit"]');

            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const mobile = mobileInput.value.trim();
            const message = messageInput.value.trim();

            // ================= VALIDATION =================

            if (!name || !email || !message) {
                alert("Please fill all required fields.");
                return;
            }

            if (!validateEmail(email)) {
                alert("Please enter a valid email address.");
                return;
            }

            if (!supabaseClient) {
                alert("Supabase connection failed.");
                return;
            }

            try {
                submitButton.disabled = true;
                submitButton.textContent = "Sending...";

                const { data, error } = await supabaseClient
                    .from("contacts")
                    .insert([
                        {
                            name: name,
                            email: email,
                            mobile: mobile,
                            message: message
                        }
                    ])
                    .select();

                if (error) {
                    throw error;
                }

                console.log("Saved data:", data);

                alert("✅ Message Sent Successfully!");

                contactForm.reset();

            } catch (error) {
                console.error("Supabase Error:", error);

                alert("❌ Error: " + error.message);

            } finally {
                submitButton.disabled = false;
                submitButton.textContent = "Send Message";
            }
        });
    }


    // ================= EMAIL VALIDATION =================

    function validateEmail(email) {
        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        return emailPattern.test(email);
    }

});