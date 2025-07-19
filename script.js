// --- Firebase Configuration ---
// IMPORTANT: Replace with your actual Firebase project configuration!
// You get this from your Firebase project settings -> "Add app" -> "Web"
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
    // measurementId: "YOUR_MEASUREMENT_ID" // Optional
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = app.firestore(); // Firestore database instance

document.addEventListener('DOMContentLoaded', () => {
    // --- Global DOM Elements ---
    const displayCompanyName = document.getElementById('displayCompanyName');
    const currentAppName = document.getElementById('currentAppName');
    const navButtons = document.querySelectorAll('.nav-button');
    const filterInput = document.getElementById('filterInput');
    const clearFilterButton = document.getElementById('clearFilter');
    const companyNameInput = document.getElementById('companyName');
    const saveCompanyNameButton = document.getElementById('saveCompanyName');
    const currentDateADSpan = document.getElementById('currentDateAD');
    const currentDateBSSpan = document.getElementById('currentDateBS');
    const currentTimeSpan = document.getElementById('currentTime');
    const mainAppContainer = document.getElementById('main-app-container');
    const authSection = document.getElementById('auth-section');
    const logoutButton = document.getElementById('logoutButton'); // Now in nav bar

    // --- Login DOM Elements ---
    const usernameInput = document.getElementById('usernameInput');
    const passwordInput = document.getElementById('passwordInput');
    const simpleLoginButton = document.getElementById('simpleLoginButton');

    // --- Custom Alert DOM Elements ---
    const customAlertOverlay = document.getElementById('customAlert');
    const customAlertMessage = document.getElementById('customAlertMessage');
    const customAlertCloseBtn = document.getElementById('customAlertCloseBtn');

    // --- Data Storage (global, as no user authentication) ---
    let receiptEntries = [];
    let financeTransactions = [];
    let visitors = [];
    let complains = [];
    let categories = ['Tuition', 'Books', 'Fees', 'Supplies', 'Other'];
    let companyName = "Your Company Name";
    // NEW: Shop Data
    let products = [];
    let salesBills = [];
    let currentBillItems = []; // For the active bill being created

    // --- Receipt Section DOM Elements ---
    const receiptsAppSection = document.getElementById('receipts-
