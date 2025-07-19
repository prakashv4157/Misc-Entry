// ... (existing Firebase config and initialization) ...

// --- New DOM Elements for Phone Auth ---
const phoneInput = document.getElementById('phoneInput');
const sendCodeButton = document.getElementById('sendCodeButton');
const verificationCodeInput = document.getElementById('verificationCodeInput');
const verifyCodeButton = document.getElementById('verifyCodeButton');
const recaptchaContainer = document.getElementById('recaptcha-container'); // Element for reCAPTCHA widget

let verifier; // Will hold the reCAPTCHA verifier instance

// Initialize reCAPTCHA (when the page loads or when needed)
const setupRecaptcha = () => {
    // Ensure reCAPTCHA is only rendered once
    if (!verifier) {
        verifier = new firebase.auth.RecaptchaVerifier(recaptchaContainer, {
            'size': 'invisible', // Use 'normal' for a visible checkbox
            'callback': (response) => {
                // reCAPTCHA solved, allow signInWithPhoneNumber.
                // You can automatically send the code here, or just enable the button.
                console.log("reCAPTCHA solved:", response);
            },
            'expired-callback': () => {
                // reCAPTCHA expired, reset it
                console.warn("reCAPTCHA expired, please solve again.");
                showAlert("reCAPTCHA expired. Please try again.");
                if (verifier && verifier.clear) {
                    verifier.clear(); // Clear the reCAPTCHA state
                }
            }
        });
        verifier.render().catch(error => {
            console.error("Error rendering reCAPTCHA:", error);
            showAlert("Error loading security check. Please refresh.");
        });
    }
};

// Event listener for "Send Code" button
sendCodeButton.addEventListener('click', async () => {
    const phoneNumber = phoneInput.value.trim();
    if (!phoneNumber) {
        showAlert('Please enter your phone number.');
        return;
    }

    // Firebase requires phone numbers in E.164 format (e.g., +1234567890)
    // You might need a library or custom logic to ensure correct formatting based on user's country.
    // For simplicity, let's assume direct input for now, but in production, use a country code picker.
    const formattedPhoneNumber = phoneNumber.startsWith('+') ? phoneNumber : `+977${phoneNumber}`; // Example for Nepal

    try {
        const confirmationResult = await auth.signInWithPhoneNumber(formattedPhoneNumber, verifier);
        window.confirmationResult = confirmationResult; // Store for later verification
        showAlert('Verification code sent to your phone!');
        // Show the verification code input and verify button
        verificationCodeInput.style.display = 'block';
        verifyCodeButton.style.display = 'inline-block';
        sendCodeButton.style.display = 'none'; // Hide send button
        phoneInput.readOnly = true; // Prevent changing phone number while waiting for code
    } catch (error) {
        console.error("Error sending verification code:", error);
        showAlert(`Error sending code: ${error.message}`);
        // If reCAPTCHA error, clear it
        if (verifier && verifier.clear) {
            verifier.clear();
        }
    }
});

// Event listener for "Verify Code" button
verifyCodeButton.addEventListener('click', async () => {
    const code = verificationCodeInput.value.trim();
    if (!code) {
        showAlert('Please enter the verification code.');
        return;
    }

    try {
        // Use the confirmationResult from the previous step
        await window.confirmationResult.confirm(code);
        // User is now signed in. onAuthStateChanged will handle UI updates.
        showAlert('Phone number verified and logged in successfully!');
        // Reset UI
        verificationCodeInput.value = '';
        verificationCodeInput.style.display = 'none';
        verifyCodeButton.style.display = 'none';
        sendCodeButton.style.display = 'inline-block';
        phoneInput.readOnly = false;
        if (verifier && verifier.clear) {
            verifier.clear(); // Clear reCAPTCHA after successful verification
        }
    } catch (error) {
        console.error("Error verifying code:", error);
        showAlert(`Invalid verification code or error: ${error.message}`);
        // Important: If verification fails, reCAPTCHA might need to be reset
        if (verifier && verifier.clear) {
            verifier.clear();
        }
    }
});

// Call setupRecaptcha when the auth section is displayed, or on DOMContentLoaded if always present
// You might want to call this inside onAuthStateChanged when user is logged out.
auth.onAuthStateChanged(async (user) => {
    // ... (existing onAuthStateChanged logic) ...

    if (!user) {
        // User is logged out, show auth section and set up reCAPTCHA
        authSection.style.display = 'flex';
        mainAppContainer.style.display = 'none';
        showAuthForm(loginForm); // Or a new phone auth form
        setupRecaptcha(); // Initialize reCAPTCHA here
    }
});

// ... (rest of your script.js) ...
