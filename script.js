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
const auth = app.auth();
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
    const authSection = document.getElementById('auth-section'); // Renamed from loginSection
    const logoutButton = document.getElementById('logoutButton');

    // --- Auth Forms DOM Elements ---
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const resetPasswordForm = document.getElementById('reset-password-form');

    const loginEmailInput = document.getElementById('loginEmail');
    const loginPasswordInput = document.getElementById('loginPassword');
    const loginButton = document.getElementById('loginButton');
    const googleLoginButton = document.getElementById('googleLoginButton'); // New Google button

    const registerEmailInput = document.getElementById('registerEmail');
    const registerPasswordInput = document.getElementById('registerPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const registerButton = document.getElementById('registerButton');

    const resetEmailInput = document.getElementById('resetEmail');
    const resetPasswordButton = document.getElementById('resetPasswordButton');

    const showRegisterLink = document.getElementById('showRegister');
    const showResetPasswordLink = document.getElementById('showResetPassword');
    const showLoginFromRegisterLink = document.getElementById('showLoginFromRegister');
    const showLoginFromResetLink = document.getElementById('showLoginFromReset');

    // --- Custom Alert DOM Elements ---
    const customAlertOverlay = document.getElementById('customAlert');
    const customAlertMessage = document.getElementById('customAlertMessage');
    const customAlertCloseBtn = document.getElementById('customAlertCloseBtn');

    // --- Data Storage (will now be loaded/saved from Firestore) ---
    let currentUser = null; // Will store Firebase Auth user object (or null)
    let receiptEntries = [];
    let financeTransactions = [];
    let visitors = [];
    let complains = [];
    let categories = ['Tuition', 'Books', 'Fees', 'Supplies', 'Other']; // Global categories (can be user-specific if needed)
    let companyName = "Your Company Name"; // Global company name (can be user-specific if needed)

    // --- Receipt Section DOM Elements ---
    const receiptsAppSection = document.getElementById('receipts-app');
    const receiptDateInput = document.getElementById('receiptDate');
    const receiptNoInput = document.getElementById('receiptNo');
    const amountInput = document.getElementById('amount');
    const nameInput = document.getElementById('name');
    const classInput = document.getElementById('class');
    const categorySelect = document.getElementById('category');
    const newCategoryInput = document.getElementById('newCategory');
    const addCategoryBtn = document.getElementById('addCategoryBtn');
    const addEntryButton = document.getElementById('addEntry');
    const updateEntryButton = document.getElementById('updateEntry');
    const clearFormButton = document.getElementById('clearFormBtn');
    const receiptTableBody = document.querySelector('#receiptTable tbody');
    const editIndexHidden = document.getElementById('editIndex');
    const printReceiptDataButton = document.getElementById('printReceiptData');

    // --- Finance Section DOM Elements ---
    const financeAppSection = document.getElementById('finance-app');
    const financeDateInput = document.getElementById('financeDate');
    const financeDescriptionInput = document.getElementById('financeDescription');
    const financeAmountInput = document.getElementById('financeAmount');
    const financeTypeSelect = document.getElementById('financeType');
    const addFinanceEntryButton = document.getElementById('addFinanceEntry');
    const updateFinanceEntryButton = document.getElementById('updateFinanceEntry');
    const clearFinanceFormButton = document.getElementById('clearFinanceFormBtn');
    const financeTableBody = document.querySelector('#financeTable tbody');
    const financeEditIndexHidden = document.getElementById('financeEditIndex');
    const printFinanceDataButton = document.getElementById('printFinanceData');

    // --- Visitors Section DOM Elements ---
    const visitorsAppSection = document.getElementById('visitors-app');
    const visitorDateInput = document.getElementById('visitorDate');
    const visitorNameInput = document.getElementById('visitorName');
    const visitorContactInput = document.getElementById('visitorContact');
    const visitorPurposeInput = document.getElementById('visitorPurpose');
    const timeInInput = document.getElementById('timeIn');
    const timeOutInput = document.getElementById('timeOut');
    const addVisitorEntryButton = document.getElementById('addVisitorEntry');
    const updateVisitorEntryButton = document.getElementById('updateVisitorEntry');
    const clearVisitorFormButton = document.getElementById('clearVisitorFormBtn');
    const visitorTableBody = document.querySelector('#visitorTable tbody');
    const visitorEditIndexHidden = document.getElementById('visitorEditIndex');
    const printVisitorDataButton = document.getElementById('printVisitorData');

    // --- Complains Section DOM Elements ---
    const complainsAppSection = document.getElementById('complains-app');
    const complainDateInput = document.getElementById('complainDate');
    const complainantNameInput = document.getElementById('complainantName');
    const complainantContactInput = document.getElementById('complainantContact');
    const complainDetailsInput = document.getElementById('complainDetails');
    const complainStatusSelect = document.getElementById('complainStatus');
    const addComplainEntryButton = document.getElementById('addComplainEntry');
    const updateComplainEntryButton = document.getElementById('updateComplainEntry');
    const clearComplainFormButton = document.getElementById('clearComplainFormBtn');
    const complainTableBody = document.querySelector('#complainTable tbody');
    const complainEditIndexHidden = document.getElementById('complainEditIndex');
    const printComplainDataButton = document.getElementById('printComplainData');

    // --- Settings Section DOM Elements ---
    const settingsAppSection = document.getElementById('settings-app');


    // --- Custom Alert/Message Box Function ---
    const showAlert = (message) => {
        customAlertMessage.textContent = message;
        customAlertOverlay.style.display = 'flex';
    };
    customAlertCloseBtn.addEventListener('click', () => {
        customAlertOverlay.style.display = 'none';
    });


    // --- Utility Functions ---
    const convertADToBS = (adDateString) => {
        if (!adDateString) return '';
        try {
            const [year, month, day] = adDateString.split('-').map(Number);
            const nepaliDate = new NepaliDate(year, month - 1, day);
            return `${nepaliDate.getBSYear()}-${(nepaliDate.getBSMonth() + 1).toString().padStart(2, '0')}-${nepaliDate.getBSDay().toString().padStart(2, '0')}`;
        } catch (e) {
            console.error("Error converting AD to BS date:", e);
            return adDateString;
        }
    };

    const setTodayDate = (inputElement) => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        inputElement.value = `${year}-${month}-${day}`;
    };

    const updateDateTime = () => {
        const now = new Date();
        currentDateADSpan.textContent = now.toLocaleDateString('en-US', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        });
        currentDateBSSpan.textContent = convertADToBS(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`);
        currentTimeSpan.textContent = now.toLocaleTimeString('en-US', {
            hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
        });
    };

    // --- Firestore Data Management ---
    // Data will be stored under /users/{uid}/{collectionName}
    const getUserCollectionRef = (collectionName) => {
        if (!currentUser || !currentUser.uid) {
            // No alert here, as this function is called on startup before user is confirmed
            // and `onAuthStateChanged` handles the redirect.
            return null;
        }
        return db.collection('users').doc(currentUser.uid).collection(collectionName);
    };

    // Generic save function for any collection (replaces entire collection for simplicity)
    // In a real app, you'd add/update/delete individual documents more granularly.
    const saveDataToFirestore = async (collectionName, dataArray) => {
        const collectionRef = getUserCollectionRef(collectionName);
        if (!collectionRef) return;

        try {
            const snapshot = await collectionRef.get();
            const batch = db.batch();

            // Delete existing documents in the collection
            snapshot.docs.forEach(doc => {
                batch.delete(doc.ref);
            });

            // Add all current data from the array to Firestore
            dataArray.forEach(item => {
                // Use existing 'id' if available (for updates), otherwise let Firestore generate
                const docRef = item.id ? collectionRef.doc(item.id) : collectionRef.doc();
                batch.set(docRef, item);
            });
            await batch.commit();
            console.log(`Data for ${collectionName} saved to Firestore.`);
        } catch (error) {
            console.error(`Error saving ${collectionName} to Firestore:`, error);
            showAlert(`Error saving ${collectionName} data: ${error.message}`);
        }
    };

    // Generic load function for any collection
    const loadDataFromFirestore = async (collectionName) => {
        const collectionRef = getUserCollectionRef(collectionName);
        if (!collectionRef) return [];

        try {
            const snapshot = await collectionRef.get();
            const loadedData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            console.log(`Data for ${collectionName} loaded from Firestore.`);
            return loadedData;
        } catch (error) {
            console.error(`Error loading ${collectionName} from Firestore:`, error);
            showAlert(`Error loading ${collectionName} data: ${error.message}`);
            return [];
        }
    };

    // Individual save wrappers
    const saveReceiptEntries = () => saveDataToFirestore('receipts', receiptEntries);
    const saveFinanceTransactions = () => saveDataToFirestore('finance', financeTransactions);
    const saveVisitors = () => saveDataToFirestore('visitors', visitors);
    const saveComplains = () => saveDataToFirestore('complains', complains);

    // Categories and Company Name are global in this version (saved to localStorage)
    // To make them user-specific in Firestore, you'd need separate Firestore logic for them.
    const saveCategories = () => {
        localStorage.setItem('receiptCategories', JSON.stringify(categories));
    };

    const loadCategories = () => {
        const storedCategories = localStorage.getItem('receiptCategories');
        if (storedCategories) {
            categories = JSON.parse(storedCategories);
        }
        populateCategorySelect();
    };

    const saveCompanyNameSetting = () => {
        // If companyName needs to be user-specific and in Firestore:
        // if (!currentUser) { showAlert("Not logged in. Cannot save company name."); return; }
        // db.collection('users').doc(currentUser.uid).set({ companyName: companyNameInput.value.trim() }, { merge: true });
        localStorage.setItem('receiptCompanyName', companyNameInput.value.trim());
        companyName = companyNameInput.value.trim();
        displayCompanyName.textContent = companyName;
        showAlert('Company name saved!');
    };

    const loadCompanyNameSetting = () => {
        // If companyName needs to be user-specific and in Firestore:
        // const userDoc = await db.collection('users').doc(currentUser.uid).get();
        // if (userDoc.exists && userDoc.data().companyName) { ... }
        const storedCompanyName = localStorage.getItem('receiptCompanyName');
        if (storedCompanyName) {
            companyName = storedCompanyName;
            companyNameInput.value = storedCompanyName;
        }
        displayCompanyName.textContent = companyName;
    };

    // --- Category Management ---
    const populateCategorySelect = () => {
        categorySelect.innerHTML = '<option value="">-- Select Category --</option>';
        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat;
            option.textContent = cat;
            categorySelect.appendChild(option);
        });
    };

    addCategoryBtn.addEventListener('click', () => {
        const newCat = newCategoryInput.value.trim();
        if (newCat && !categories.includes(newCat)) {
            categories.push(newCat);
            categories.sort();
            saveCategories();
            populateCategorySelect();
            categorySelect.value = newCat;
            newCategoryInput.value = '';
        } else if (newCat && categories.includes(newCat)) {
            showAlert('Category already exists!');
        } else {
            showAlert('Please enter a category name.');
        }
    });

    // --- Table Rendering Functions ---
    const renderReceiptTable = (dataToRender) => {
        receiptTableBody.innerHTML = '';
        if (dataToRender.length === 0 && filterInput.value === '') {
            const noDataRow = receiptTableBody.insertRow();
            const cell = noDataRow.insertCell();
            cell.colSpan = 7;
            cell.textContent = "No receipt entries yet. Add one above!";
            cell.style.textAlign = 'center';
            cell.style.fontStyle = 'italic';
            cell.style.padding = '20px';
        }

        // Sort by date (newest first)
        dataToRender.sort((a, b) => new Date(b.date) - new Date(a.date));

        dataToRender.forEach((entry, index) => {
            const row = receiptTableBody.insertRow();
            row.insertCell().textContent = convertADToBS(entry.date);
            row.insertCell().textContent = entry.receiptNo;
            row.insertCell().textContent = parseFloat(entry.amount).toFixed(2);
            row.insertCell().textContent = entry.name;
            row.insertCell().textContent = entry.class;
            row.insertCell().textContent = entry.category;

            const actionsCell = row.insertCell();
            actionsCell.classList.add('action-buttons');
            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.classList.add('edit-btn');
            editButton.addEventListener('click', () => editReceiptEntry(entry, index));
            actionsCell.appendChild(editButton);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('delete-btn');
            deleteButton.addEventListener('click', () => deleteReceiptEntry(entry.id)); // Use Firestore ID for deletion
            actionsCell.appendChild(deleteButton);
        });
        updateDashboardMetrics();
    };

    const renderFinanceTable = (dataToRender) => {
        financeTableBody.innerHTML = '';
        if (dataToRender.length === 0 && filterInput.value === '') {
            const noDataRow = financeTableBody.insertRow();
            const cell = noDataRow.insertCell();
            cell.colSpan = 5;
            cell.textContent = "No finance transactions yet. Add one above!";
            cell.style.textAlign = 'center';
            cell.style.fontStyle = 'italic';
            cell.style.padding = '20px';
        }

        dataToRender.sort((a, b) => new Date(b.date) - new Date(a.date));

        dataToRender.forEach((transaction, index) => {
            const row = financeTableBody.insertRow();
            row.insertCell().textContent = convertADToBS(transaction.date);
            row.insertCell().textContent = transaction.description;
            row.insertCell().textContent = parseFloat(transaction.amount).toFixed(2);
            row.insertCell().textContent = transaction.type;

            const actionsCell = row.insertCell();
            actionsCell.classList.add('action-buttons');
            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.classList.add('edit-btn');
            editButton.addEventListener('click', () => editFinanceTransaction(transaction, index));
            actionsCell.appendChild(editButton);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('delete-btn');
            deleteButton.addEventListener('click', () => deleteFinanceTransaction(transaction.id)); // Use Firestore ID for deletion
            actionsCell.appendChild(deleteButton);
        });
        updateDashboardMetrics();
    };

    const renderVisitorTable = (dataToRender) => {
        visitorTableBody.innerHTML = '';
        if (dataToRender.length === 0 && filterInput.value === '') {
            const noDataRow = visitorTableBody.insertRow();
            const cell = noDataRow.insertCell();
            cell.colSpan = 7;
            cell.textContent = "No visitor entries yet. Add one above!";
            cell.style.textAlign = 'center';
            cell.style.fontStyle = 'italic';
            cell.style.padding = '20px';
        }

        dataToRender.sort((a, b) => new Date(b.date) - new Date(a.date));

        dataToRender.forEach((visitor, index) => {
            const row = visitorTableBody.insertRow();
            row.insertCell().textContent = convertADToBS(visitor.date);
            row.insertCell().textContent = visitor.name;
            row.insertCell().textContent = visitor.contact;
            row.insertCell().textContent = visitor.purpose;
            row.insertCell().textContent = visitor.timeIn;
            row.insertCell().textContent = visitor.timeOut;

            const actionsCell = row.insertCell();
            actionsCell.classList.add('action-buttons');
            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.classList.add('edit-btn');
            editButton.addEventListener('click', () => editVisitorEntry(visitor, index));
            actionsCell.appendChild(editButton);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('delete-btn');
            deleteButton.addEventListener('click', () => deleteVisitorEntry(visitor.id)); // Use Firestore ID for deletion
            actionsCell.appendChild(deleteButton);
        });
    };

    const renderComplainTable = (dataToRender) => {
        complainTableBody.innerHTML = '';
        if (dataToRender.length === 0 && filterInput.value === '') {
            const noDataRow = complainTableBody.insertRow();
            const cell = noDataRow.insertCell();
            cell.colSpan = 6;
            cell.textContent = "No complain entries yet. Add one above!";
            cell.style.textAlign = 'center';
            cell.style.fontStyle = 'italic';
            cell.style.padding = '20px';
        }

        dataToRender.sort((a, b) => new Date(b.date) - new Date(a.date));

        dataToRender.forEach((complain, index) => {
            const row = complainTableBody.insertRow();
            row.insertCell().textContent = convertADToBS(complain.date);
            row.insertCell().textContent = complain.complainantName;
            row.insertCell().textContent = complain.complainantContact;
            row.insertCell().textContent = complain.details;
            row.insertCell().textContent = complain.status;

            const actionsCell = row.insertCell();
            actionsCell.classList.add('action-buttons');
            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.classList.add('edit-btn');
            editButton.addEventListener('click', () => editComplainEntry(complain, index));
            actionsCell.appendChild(editButton);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('delete-btn');
            deleteButton.addEventListener('click', () => deleteComplainEntry(complain.id)); // Use Firestore ID for deletion
            actionsCell.appendChild(deleteButton);
        });
    };

    // --- CRUD Operations - Receipts ---
    addEntryButton.addEventListener('click', async () => {
        const date = receiptDateInput.value;
        const receiptNo = receiptNoInput.value.trim();
        const amount = parseFloat(amountInput.value.trim());
        const name = nameInput.value.trim();
        const classVal = classInput.value.trim();
        const category = categorySelect.value;

        if (date && receiptNo && !isNaN(amount) && name && classVal && category) {
            const newEntry = { date, receiptNo, amount, name, class: classVal, category };
            try {
                const docRef = await getUserCollectionRef('receipts').add(newEntry); // Add to Firestore
                receiptEntries.push({ id: docRef.id, ...newEntry }); // Add with Firestore ID
                saveReceiptEntries(); // Re-sync all data (simple for demo)
                applyFilter(); // Re-render table with new data
                clearReceiptForm();
                showAlert('Receipt entry added successfully!');
            } catch (error) {
                console.error("Error adding receipt:", error);
                showAlert(`Error adding receipt: ${error.message}`);
            }
        } else {
            showAlert('Please fill in all receipt fields correctly (Amount must be a number, Category must be selected).');
        }
    });

    const editReceiptEntry = (entry, index) => {
        receiptDateInput.value = entry.date;
        receiptNoInput.value = entry.receiptNo;
        amountInput.value = entry.amount;
        nameInput.value = entry.name;
        classInput.value = entry.class;
        categorySelect.value = entry.category;
        editIndexHidden.value = entry.id; // Store Firestore ID for editing

        addEntryButton.style.display = 'none';
        updateEntryButton.style.display = 'inline-block';
    };

    updateEntryButton.addEventListener('click', async () => {
        const docIdToUpdate = editIndexHidden.value;
        if (!docIdToUpdate) {
            showAlert('Error: No receipt entry selected for update.'); return;
        }

        const date = receiptDateInput.value;
        const receiptNo = receiptNoInput.value.trim();
        const amount = parseFloat(amountInput.value.trim());
        const name = nameInput.value.trim();
        const classVal = classInput.value.trim();
        const category = categorySelect.value;

        if (date && receiptNo && !isNaN(amount) && name && classVal && category) {
            const updatedEntry = { date, receiptNo, amount, name, class: classVal, category };
            try {
                await getUserCollectionRef('receipts').doc(docIdToUpdate).update(updatedEntry); // Update in Firestore
                // Update local array
                const indexInArray = receiptEntries.findIndex(e => e.id === docIdToUpdate);
                if (indexInArray !== -1) {
                    receiptEntries[indexInArray] = { id: docIdToUpdate, ...updatedEntry };
                }
                saveReceiptEntries(); // Re-sync all data (simple for demo)
                applyFilter(); // Re-render table with updated data
                clearReceiptForm();
                addEntryButton.style.display = 'inline-block';
                updateEntryButton.style.display = 'none';
                showAlert('Receipt entry updated successfully!');
            } catch (error) {
                console.error("Error updating receipt:", error);
                showAlert(`Error updating receipt: ${error.message}`);
            }
        } else {
            showAlert('Please fill in all receipt fields correctly for update.');
        }
    });

    const deleteReceiptEntry = async (docIdToDelete) => {
        if (confirm('Are you sure you want to delete this receipt entry?')) {
            try {
                await getUserCollectionRef('receipts').doc(docIdToDelete).delete(); // Delete from Firestore
                receiptEntries = receiptEntries.filter(entry => entry.id !== docIdToDelete); // Update local array
                saveReceiptEntries(); // Re-sync all data
                applyFilter(); // Re-render table
                clearReceiptForm();
                addEntryButton.style.display = 'inline-block';
                updateEntryButton.style.display = 'none';
                showAlert('Receipt entry deleted!');
            } catch (error) {
                console.error("Error deleting receipt:", error);
                showAlert(`Error deleting receipt: ${error.message}`);
            }
        }
    };

    // --- CRUD Operations - Finance ---
    addFinanceEntryButton.addEventListener('click', async () => {
        const date = financeDateInput.value;
        const description = financeDescriptionInput.value.trim();
        const amount = parseFloat(financeAmountInput.value.trim());
        const type = financeTypeSelect.value;

        if (date && description && !isNaN(amount) && type) {
            const newTransaction = { date, description, amount, type };
            try {
                const docRef = await getUserCollectionRef('finance').add(newTransaction);
                financeTransactions.push({ id: docRef.id, ...newTransaction });
                saveFinanceTransactions();
                applyFilter();
                clearFinanceForm();
                showAlert('Finance transaction added successfully!');
            } catch (error) {
                console.error("Error adding finance transaction:", error);
                showAlert(`Error adding finance transaction: ${error.message}`);
            }
        } else {
            showAlert('Please fill in all finance fields correctly (Amount must be a number, Type must be selected).');
        }
    });

    const editFinanceTransaction = (transaction, index) => {
        financeDateInput.value = transaction.date;
        financeDescriptionInput.value = transaction.description;
        financeAmountInput.value = transaction.amount;
        financeTypeSelect.value = transaction.type;
        financeEditIndexHidden.value = transaction.id;

        addFinanceEntryButton.style.display = 'none';
        updateFinanceEntryButton.style.display = 'inline-block';
    };

    updateFinanceEntryButton.addEventListener('click', async () => {
        const docIdToUpdate = financeEditIndexHidden.value;
        if (!docIdToUpdate) {
            showAlert('Error: No finance transaction selected for update.'); return;
        }

        const date = financeDateInput.value;
        const description = financeDescriptionInput.value.trim();
        const amount = parseFloat(financeAmountInput.value.trim());
        const type = financeTypeSelect.value;

        if (date && description && !isNaN(amount) && type) {
            const updatedTransaction = { date, description, amount, type };
            try {
                await getUserCollectionRef('finance').doc(docIdToUpdate).update(updatedTransaction);
                const indexInArray = financeTransactions.findIndex(t => t.id === docIdToUpdate);
                if (indexInArray !== -1) {
                    financeTransactions[indexInArray] = { id: docIdToUpdate, ...updatedTransaction };
                }
                saveFinanceTransactions();
                applyFilter();
                clearFinanceForm();
                addFinanceEntryButton.style.display = 'inline-block';
                updateFinanceEntryButton.style.display = 'none';
                showAlert('Finance transaction updated successfully!');
            } catch (error) {
                console.error("Error updating finance transaction:", error);
                showAlert(`Error updating finance transaction: ${error.message}`);
            }
        } else {
            showAlert('Please fill in all finance fields correctly for update.');
        }
    });

    const deleteFinanceTransaction = async (docIdToDelete) => {
        if (confirm('Are you sure you want to delete this finance transaction?')) {
            try {
                await getUserCollectionRef('finance').doc(docIdToDelete).delete();
                financeTransactions = financeTransactions.filter(transaction => transaction.id !== docIdToDelete);
                saveFinanceTransactions();
                applyFilter();
                clearFinanceForm();
                addFinanceEntryButton.style.display = 'inline-block';
                updateFinanceEntryButton.style.display = 'none';
                showAlert('Finance transaction deleted!');
            } catch (error) {
                console.error("Error deleting finance transaction:", error);
                showAlert(`Error deleting finance transaction: ${error.message}`);
            }
        }
    };

    // --- CRUD Operations - Visitors ---
    addVisitorEntryButton.addEventListener('click', async () => {
        const date = visitorDateInput.value;
        const name = visitorNameInput.value.trim();
        const contact = visitorContactInput.value.trim();
        const purpose = visitorPurposeInput.value.trim();
        const timeIn = timeInInput.value;
        const timeOut = timeOutInput.value;

        if (date && name && contact && purpose && timeIn) {
            const newVisitor = { date, name, contact, purpose, timeIn, timeOut };
            try {
                const docRef = await getUserCollectionRef('visitors').add(newVisitor);
                visitors.push({ id: docRef.id, ...newVisitor });
                saveVisitors();
                applyFilter();
                clearVisitorForm();
                showAlert('Visitor entry added successfully!');
            } catch (error) {
                console.error("Error adding visitor:", error);
                showAlert(`Error adding visitor: ${error.message}`);
            }
        } else {
            showAlert('Please fill in Date, Name, Contact, Purpose, and Time In for the visitor entry.');
        }
    });

    const editVisitorEntry = (visitor, index) => {
        visitorDateInput.value = visitor.date;
        visitorNameInput.value = visitor.name;
        visitorContactInput.value = visitor.contact;
        visitorPurposeInput.value = visitor.purpose;
        timeInInput.value = visitor.timeIn;
        timeOutInput.value = visitor.timeOut;
        visitorEditIndexHidden.value = visitor.id;

        addVisitorEntryButton.style.display = 'none';
        updateVisitorEntryButton.style.display = 'inline-block';
    };

    updateVisitorEntryButton.addEventListener('click', async () => {
        const docIdToUpdate = visitorEditIndexHidden.value;
        if (!docIdToUpdate) {
            showAlert('Error: No visitor entry selected for update.'); return;
        }

        const date = visitorDateInput.value;
        const name = visitorNameInput.value.trim();
        const contact = visitorContactInput.value.trim();
        const purpose = visitorPurposeInput.value.trim();
        const timeIn = timeInInput.value;
        const timeOut = timeOutInput.value;

        if (date && name && contact && purpose && timeIn) {
            const updatedVisitor = { date, name, contact, purpose, timeIn, timeOut };
            try {
                await getUserCollectionRef('visitors').doc(docIdToUpdate).update(updatedVisitor);
                const indexInArray = visitors.findIndex(v => v.id === docIdToUpdate);
                if (indexInArray !== -1) {
                    visitors[indexInArray] = { id: docIdToUpdate, ...updatedVisitor };
                }
                saveVisitors();
                applyFilter();
                clearVisitorForm();
                addVisitorEntryButton.style.display = 'inline-block';
                updateVisitorEntryButton.style.display = 'none';
                showAlert('Visitor entry updated successfully!');
            } catch (error) {
                console.error("Error updating visitor:", error);
                showAlert(`Error updating visitor: ${error.message}`);
            }
        } else {
            showAlert('Please fill in all visitor fields correctly for update.');
        }
    });

    const deleteVisitorEntry = async (docIdToDelete) => {
        if (confirm('Are you sure you want to delete this visitor entry?')) {
            try {
                await getUserCollectionRef('visitors').doc(docIdToDelete).delete();
                visitors = visitors.filter(visitor => visitor.id !== docIdToDelete);
                saveVisitors();
                applyFilter();
                clearVisitorForm();
                addVisitorEntryButton.style.display = 'inline-block';
                updateVisitorEntryButton.style.display = 'none';
                showAlert('Visitor entry deleted!');
            } catch (error) {
                console.error("Error deleting visitor:", error);
                showAlert(`Error deleting visitor: ${error.message}`);
            }
        }
    };

    // --- CRUD Operations - Complains ---
    addComplainEntryButton.addEventListener('click', async () => {
        const date = complainDateInput.value;
        const complainantName = complainantNameInput.value.trim();
        const complainantContact = complainantContactInput.value.trim();
        const details = complainDetailsInput.value.trim();
        const status = complainStatusSelect.value;

        if (date && complainantName && details && status) {
            const newComplain = { date, complainantName, complainantContact, details, status };
            try {
                const docRef = await getUserCollectionRef('complains').add(newComplain);
                complains.push({ id: docRef.id, ...newComplain });
                saveComplains();
                applyFilter();
                clearComplainForm();
                showAlert('Complain entry added successfully!');
            } catch (error) {
                console.error("Error adding complain:", error);
                showAlert(`Error adding complain: ${error.message}`);
            }
        } else {
            showAlert('Please fill in Date, Complainant Name, Details, and Status for the complain entry.');
        }
    });

    const editComplainEntry = (complain, index) => {
        complainDateInput.value = complain.date;
        complainantNameInput.value = complain.complainantName;
        complainantContactInput.value = complain.complainantContact;
        complainDetailsInput.value = complain.details;
        complainStatusSelect.value = complain.status;
        complainEditIndexHidden.value = complain.id;

        addComplainEntryButton.style.display = 'none';
        updateComplainEntryButton.style.display = 'inline-block';
    };

    updateComplainEntryButton.addEventListener('click', async () => {
        const docIdToUpdate = complainEditIndexHidden.value;
        if (!docIdToUpdate) {
            showAlert('Error: No complain entry selected for update.'); return;
        }

        const date = complainDateInput.value;
        const complainantName = complainantNameInput.value.trim();
        const complainantContact = complainantContactInput.value.trim();
        const details = complainDetailsInput.value.trim();
        const status = complainStatusSelect.value;

        if (date && complainantName && details && status) {
            const updatedComplain = { date, complainantName, complainantContact, details, status };
            try {
                await getUserCollectionRef('complains').doc(docIdToUpdate).update(updatedComplain);
                const indexInArray = complains.findIndex(c => c.id === docIdToUpdate);
                if (indexInArray !== -1) {
                    complains[indexInArray] = { id: docIdToUpdate, ...updatedComplain };
                }
                saveComplains();
                applyFilter();
                clearComplainForm();
                addComplainEntryButton.style.display = 'inline-block';
                updateComplainEntryButton.style.display = 'none';
                showAlert('Complain entry updated successfully!');
            } catch (error) {
                console.error("Error updating complain:", error);
                showAlert(`Error updating complain: ${error.message}`);
            }
        } else {
            showAlert('Please fill in all complain fields correctly for update.');
        }
    });

    const deleteComplainEntry = async (docIdToDelete) => {
        if (confirm('Are you sure you want to delete this complain entry?')) {
            try {
                await getUserCollectionRef('complains').doc(docIdToDelete).delete();
                complains = complains.filter(complain => complain.id !== docIdToDelete);
                saveComplains();
                applyFilter();
                clearComplainForm();
                addComplainEntryButton.style.display = 'inline-block';
                updateComplainEntryButton.style.display = 'none';
                showAlert('Complain entry deleted!');
            } catch (error) {
                console.error("Error deleting complain:", error);
                showAlert(`Error deleting complain: ${error.message}`);
            }
        }
    };


    // --- Form Clearing Functions ---
    const clearReceiptForm = () => {
        setTodayDate(receiptDateInput);
        receiptNoInput.value = '';
        amountInput.value = '';
        nameInput.value = '';
        classInput.value = '';
        categorySelect.value = '';
        editIndexHidden.value = '';
        addEntryButton.style.display = 'inline-block';
        updateEntryButton.style.display = 'none';
    };

    const clearFinanceForm = () => {
        setTodayDate(financeDateInput);
        financeDescriptionInput.value = '';
        financeAmountInput.value = '';
        financeTypeSelect.value = '';
        financeEditIndexHidden.value = '';
        addFinanceEntryButton.style.display = 'inline-block';
        updateFinanceEntryButton.style.display = 'none';
    };

    const clearVisitorForm = () => {
        setTodayDate(visitorDateInput);
        visitorNameInput.value = '';
        visitorContactInput.value = '';
        visitorPurposeInput.value = '';
        timeInInput.value = '';
        timeOutInput.value = '';
        visitorEditIndexHidden.value = '';
        addVisitorEntryButton.style.display = 'inline-block';
        updateVisitorEntryButton.style.display = 'none';
    };

    const clearComplainForm = () => {
        setTodayDate(complainDateInput);
        complainantNameInput.value = '';
        complainantContactInput.value = '';
        complainDetailsInput.value = '';
        complainStatusSelect.value = 'New';
        complainEditIndexHidden.value = '';
        addComplainEntryButton.style.display = 'inline-block';
        updateComplainEntryButton.style.display = 'none';
    };

    clearFormButton.addEventListener('click', clearReceiptForm);
    clearFinanceFormButton.addEventListener('click', clearFinanceForm);
    clearVisitorFormButton.addEventListener('click', clearVisitorForm);
    clearComplainFormButton.addEventListener('click', clearComplainForm);


    // --- Filter Functionality (Applies to CURRENTLY ACTIVE table only) ---
    let currentActiveAppId = 'receipts-app';

    const applyFilter = () => {
        const filterText = filterInput.value.toLowerCase();

        if (currentActiveAppId === 'receipts-app') {
            const filteredData = receiptEntries.filter(entry =>
                Object.values(entry).some(value =>
                    String(value).toLowerCase().includes(filterText)
                )
            );
            renderReceiptTable(filteredData);
        } else if (currentActiveAppId === 'finance-app') {
            const filteredData = financeTransactions.filter(transaction =>
                Object.values(transaction).some(value =>
                    String(value).toLowerCase().includes(filterText)
                )
            );
            renderFinanceTable(filteredData);
        } else if (currentActiveAppId === 'visitors-app') {
            const filteredData = visitors.filter(visitor =>
                Object.values(visitor).some(value =>
                    String(value).toLowerCase().includes(filterText)
                )
            );
            renderVisitorTable(filteredData);
        } else if (currentActiveAppId === 'complains-app') {
            const filteredData = complains.filter(complain =>
                Object.values(complain).some(value =>
                    String(value).toLowerCase().includes(filterText)
                )
            );
            renderComplainTable(filteredData);
        }
    };

    filterInput.addEventListener('keyup', applyFilter);

    clearFilterButton.addEventListener('click', () => {
        filterInput.value = '';
        applyFilter();
    });

    // --- Print Functionality (Centralized) ---
    const printTable = (tableId, title) => {
        const tableToPrint = document.getElementById(tableId);
        const printWindow = window.open('', '', 'height=600,width=800');
        printWindow.document.write('<html><head><title>' + title + '</title>');
        printWindow.document.write('<style>');
        printWindow.document.write('body { font-family: Arial, sans-serif; margin: 20px; }');
        printWindow.document.write('.print-company-title { text-align: center; font-size: 1.8em; font-weight: bold; margin-bottom: 25px; color: #333; }');
        printWindow.document.write('h2 { text-align: center; margin-bottom: 15px; color: #555; }');
        printWindow.document.write('table { width: 100%; border-collapse: collapse; margin-top: 20px; }');
        printWindow.document.write('table th, table td { border: 1px solid #ccc; padding: 10px; text-align: left; }');
        printWindow.document.write('table th { background-color: #f0f0f0; }');
        printWindow.document.write('</style>');
        printWindow.document.write('</head><body>');

        if (companyName) {
            printWindow.document.write(`<div class="print-company-title">${companyName}</div>`);
        }
        printWindow.document.write('<h2>' + title + '</h2>');
        printWindow.document.write(tableToPrint.outerHTML);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
    };

    printReceiptDataButton.addEventListener('click', () => printTable('receiptTable', 'Receipt Entries Report'));
    printFinanceDataButton.addEventListener('click', () => printTable('financeTable', 'Income/Expense Report'));
    printVisitorDataButton.addEventListener('click', () => printTable('visitorTable', 'Visitor Entries Report'));
    printComplainDataButton.addEventListener('click', () => printTable('complainTable', 'Complain Entries Report'));


    // --- Dashboard Metrics (only for Receipts and Finance) ---
    const totalEntriesCountSpan = document.getElementById('totalEntriesCount');
    const totalAmountSumSpan = document.getElementById('totalAmountSum');
    const totalIncomeSpan = document.getElementById('totalIncome');
    const totalExpensesSpan = document.getElementById('totalExpenses');
    const netBalanceSpan = document.getElementById('netBalance');

    const updateReceiptMetrics = () => {
        totalEntriesCountSpan.textContent = receiptEntries.length;
        const total = receiptEntries.reduce((sum, entry) => sum + (parseFloat(entry.amount) || 0), 0);
        totalAmountSumSpan.textContent = total.toFixed(2);
    };

    const updateFinanceMetrics = () => {
        let totalIncome = 0;
        let totalExpenses = 0;
        financeTransactions.forEach(transaction => {
            if (transaction.type === 'Income') {
                totalIncome += (parseFloat(transaction.amount) || 0);
            } else if (transaction.type === 'Expense') {
                totalExpenses += (parseFloat(transaction.amount) || 0);
            }
        });

        const netBalance = totalIncome - totalExpenses;
        totalIncomeSpan.textContent = totalIncome.toFixed(2);
        totalExpensesSpan.textContent = totalExpenses.toFixed(2);
        netBalanceSpan.textContent = netBalance.toFixed(2);

        netBalanceSpan.style.color = netBalance < 0 ? 'red' : (netBalance > 0 ? 'green' : '#555');
    };

    const updateDashboardMetrics = () => {
        updateReceiptMetrics();
        updateFinanceMetrics();
    };


    // --- Navigation Functionality ---
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetAppId = button.dataset.target;
            const appName = button.dataset.appName;

            navButtons.forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.app-section').forEach(section => section.classList.remove('active-app'));

            button.classList.add('active');
            document.getElementById(targetAppId).classList.add('active-app');

            currentActiveAppId = targetAppId;
            currentAppName.textContent = appName;

            filterInput.value = '';
            applyFilter();
        });
    });

    // --- Auth Form Switching ---
    const showAuthForm = (formToShow) => {
        loginForm.classList.remove('active-form');
        registerForm.classList.remove('active-form');
        resetPasswordForm.classList.remove('active-form');
        formToShow.classList.add('active-form');
    };

    showRegisterLink.addEventListener('click', (e) => { e.preventDefault(); showAuthForm(registerForm); });
    showResetPasswordLink.addEventListener('click', (e) => { e.preventDefault(); showAuthForm(resetPasswordForm); });
    showLoginFromRegisterLink.addEventListener('click', (e) => { e.preventDefault(); showAuthForm(loginForm); });
    showLoginFromResetLink.addEventListener('click', (e) => { e.preventDefault(); showAuthForm(loginForm); });

    // --- Firebase Authentication Functions ---
    loginButton.addEventListener('click', async () => {
        const email = loginEmailInput.value.trim();
        const password = loginPasswordInput.value.trim();
        if (!email || !password) {
            showAlert('Please enter both email and password.');
            return;
        }
        try {
            await auth.signInWithEmailAndPassword(email, password);
            // onAuthStateChanged will handle UI update
        } catch (error) {
            console.error("Login error:", error);
            showAlert(`Login failed: ${error.message}`);
        }
    });

    googleLoginButton.addEventListener('click', async () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        try {
            await auth.signInWithPopup(provider);
            // onAuthStateChanged will handle UI update
        } catch (error) {
            console.error("Google login error:", error);
            showAlert(`Google login failed: ${error.message}`);
        }
    });

    registerButton.addEventListener('click', async () => {
        const email = registerEmailInput.value.trim();
        const password = registerPasswordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();

        if (!email || !password || !confirmPassword) {
            showAlert('Please fill in all fields.');
            return;
        }
        if (password.length < 6) {
            showAlert('Password should be at least 6 characters.');
            return;
        }
        if (password !== confirmPassword) {
            showAlert('Passwords do not match.');
            return;
        }

        try {
            await auth.createUserWithEmailAndPassword(email, password);
            showAlert('Registration successful! You are now logged in.');
            // onAuthStateChanged will handle UI update
        } catch (error) {
            console.error("Registration error:", error);
            showAlert(`Registration failed: ${error.message}`);
        }
    });

    resetPasswordButton.addEventListener('click', async () => {
        const email = resetEmailInput.value.trim();
        if (!email) {
            showAlert('Please enter your email to reset password.');
            return;
        }
        try {
            await auth.sendPasswordResetEmail(email);
            showAlert('Password reset email sent! Check your inbox.');
            showAuthForm(loginForm); // Go back to login
        } catch (error) {
            console.error("Password reset error:", error);
            showAlert(`Password reset failed: ${error.message}`);
        }
    });

    logoutButton.addEventListener('click', async () => {
        if (confirm('Are you sure you want to log out?')) {
            try {
                await auth.signOut();
                // onAuthStateChanged will handle UI update
                showAlert('Logged out successfully.');
            } catch (error) {
                console.error("Logout error:", error);
                showAlert(`Logout failed: ${error.message}`);
            }
        }
    });

    // --- Firebase Auth State Listener ---
    auth.onAuthStateChanged(async (user) => {
        currentUser = user;
        if (user) {
            // User is logged in
            authSection.style.display = 'none';
            mainAppContainer.style.display = 'block';
            console.log("User logged in:", user.email, "UID:", user.uid);

            // Load all user-specific data from Firestore
            receiptEntries = await loadDataFromFirestore('receipts');
            financeTransactions = await loadDataFromFirestore('finance');
            visitors = await loadDataFromFirestore('visitors');
            complains = await loadDataFromFirestore('complains');
            loadCategories(); // Categories are global (from localStorage)
            loadCompanyNameSetting(); // Company name is global (from localStorage)

            // Render tables with loaded data
            renderReceiptTable(receiptEntries);
            renderFinanceTable(financeTransactions);
            renderVisitorTable(visitors);
            renderComplainTable(complains);

            updateDashboardMetrics(); // Update dashboard with loaded data

            // Set initial active application (Receipts by default) and update H2
            document.querySelectorAll('.app-section').forEach(section => section.classList.remove('active-app'));
            document.querySelectorAll('.nav-button').forEach(btn => btn.classList.remove('active'));
            receiptsAppSection.classList.add('active-app');
            document.querySelector('.nav-button[data-target="receipts-app"]').classList.add('active');
            currentAppName.textContent = document.querySelector('.nav-button.active').dataset.appName;

            // Clear all forms
            clearReceiptForm();
            clearFinanceForm();
            clearVisitorForm();
            clearComplainForm();

            // Apply any existing filter
            applyFilter(); // Re-apply filter in case it was active before logout/login
        } else {
            // User is logged out
            authSection.style.display = 'flex'; // Show auth forms
            mainAppContainer.style.display = 'none';
            console.log("User logged out.");

            // Clear all local data when logged out
            receiptEntries = [];
            financeTransactions = [];
            visitors = [];
            complains = [];
            
            // Clear tables, do not rely on applyFilter as data is empty
            receiptTableBody.innerHTML = '';
            financeTableBody.innerHTML = '';
            visitorTableBody.innerHTML = '';
            complainTableBody.innerHTML = '';

            updateDashboardMetrics(); // Reset dashboard metrics
            filterInput.value = ''; // Clear filter input
            showAuthForm(loginForm); // Always show login form on logout
        }
    });

    // --- Initializations on Load ---
    const initializeApp = () => {
        // Set today's date for all date inputs
        setTodayDate(receiptDateInput);
        setTodayDate(financeDateInput);
        setTodayDate(visitorDateInput);
        setTodayDate(complainDateInput);

        // Start time update
        updateDateTime();
        setInterval(updateDateTime, 1000);

        // The onAuthStateChanged listener will handle the initial UI state (logged in/out)
        // and load data accordingly. No need for separate initial login check here.
    };

    initializeApp();

    // Event listener for saving company name (in settings)
    saveCompanyNameButton.addEventListener('click', saveCompanyNameSetting);
});
