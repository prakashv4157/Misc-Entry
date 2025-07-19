// --- Firebase Configuration ---
// IMPORTANT: Replace with your actual Firebase project configuration!
// You get this from your Firebase project settings -> "Add app" -> "Web"
const firebaseConfig = {
    apiKey: "YOUR_API_KEY", // <--- REPLACE THIS
    authDomain: "YOUR_AUTH_DOMAIN", // <--- REPLACE THIS
    projectId: "YOUR_PROJECT_ID", // <--- REPLACE THIS
    storageBucket: "YOUR_STORAGE_BUCKET", // <--- REPLACE THIS
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID", // <--- REPLACE THIS
    appId: "YOUR_APP_ID", // <--- REPLACE THIS
    // measurementId: "YOUR_MEASUREMENT_ID" // Optional, <--- REPLACE THIS if you use Analytics
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = app.firestore(); // Firestore database instance (still used for data storage)

document.addEventListener('DOMContentLoaded', () => {
    // --- Global DOM Elements ---
    const displayCompanyName = document.getElementById('displayCompanyName');
    const displayCompanyAddress = document.getElementById('displayCompanyAddress');
    const displayCompanyContact = document.getElementById('displayCompanyContact');
    const currentAppName = document.getElementById('currentAppName');
    const navButtons = document.querySelectorAll('.nav-button');
    const filterInput = document.getElementById('filterInput');
    const clearFilterButton = document.getElementById('clearFilter');
    const companyNameInput = document.getElementById('companyName');
    const companyAddressInput = document.getElementById('companyAddress'); // New
    const companyContactInput = document.getElementById('companyContact'); // New
    const saveCompanyDetailsButton = document.getElementById('saveCompanyDetails'); // Changed ID
    const currentDateADSpan = document.getElementById('currentDateAD');
    const currentDateBSSpan = document.getElementById('currentDateBS');
    const currentTimeSpan = document.getElementById('currentTime');
    const mainAppContainer = document.getElementById('main-app-container');
    const authSection = document.getElementById('auth-section');
    const logoutButton = document.getElementById('logoutButton');

    // --- Login DOM Elements ---
    const loginForm = document.getElementById('login-form');
    const usernameInput = document.getElementById('usernameInput');
    const passwordInput = document.getElementById('passwordInput');
    const simpleLoginButton = document.getElementById('simpleLoginButton');

    // --- Custom Alert DOM Elements ---
    const customAlertOverlay = document.getElementById('customAlert');
    const customAlertMessage = document.getElementById('customAlertMessage');
    const customAlertCloseBtn = document.getElementById('customAlertCloseBtn');

    // --- Data Storage (will now be loaded/saved from a single, non-user-specific Firestore collection) ---
    let receiptEntries = [];
    let financeTransactions = [];
    let visitors = [];
    let complains = [];
    let daybookEntries = []; // New
    let categories = ['Tuition', 'Books', 'Fees', 'Supplies', 'Other']; // Global categories (can be user-specific if needed)
    let companyName = "Your Company Name"; // Global company name (can be user-specific if needed)
    let companyAddress = "Your Company Address"; // New
    let companyContact = "Your Company Contact No"; // New

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

    // --- Daybook Section DOM Elements (New) ---
    const daybookAppSection = document.getElementById('daybook-app');
    const daybookDateInput = document.getElementById('daybookDate');
    const daybookTimeInput = document.getElementById('daybookTime');
    const daybookActivityInput = document.getElementById('daybookActivity');
    const daybookAmountInput = document.getElementById('daybookAmount');
    const daybookTypeSelect = document.getElementById('daybookType');
    const addDaybookEntryButton = document.getElementById('addDaybookEntry');
    const updateDaybookEntryButton = document.getElementById('updateDaybookEntry');
    const clearDaybookFormButton = document.getElementById('clearDaybookFormBtn');
    const daybookTableBody = document.querySelector('#daybookTable tbody');
    const daybookEditIndexHidden = document.getElementById('daybookEditIndex');
    const printDaybookDataButton = document.getElementById('printDaybookData');

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

    const setCurrentTime = (inputElement) => {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        inputElement.value = `${hours}:${minutes}`;
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

    // --- Firestore Data Management (now using a single root collection for all data) ---
    const getGlobalCollectionRef = (collectionName) => {
        // All data for this simplified system is stored under top-level collections
        // (e.g., 'receipts', 'finance'). There's no user-specific path in Firestore.
        return db.collection(collectionName);
    };

    // Generic save function for any collection (replaces entire collection for simplicity)
    const saveDataToFirestore = async (collectionName, dataArray) => {
        const collectionRef = getGlobalCollectionRef(collectionName);
        try {
            // Firestore transactions or batched writes are better for larger sets,
            // but for a small demo, a simple delete-all-then-add-all approach is feasible.
            // For production, consider using arrayUnion/arrayRemove or managing individual documents.

            // Fetch all existing documents in the collection
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
                batch.set(docRef, { ...item, id: docRef.id }); // Ensure 'id' is part of the stored data
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
        const collectionRef = getGlobalCollectionRef(collectionName);
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
    const saveDaybookEntries = () => saveDataToFirestore('daybook', daybookEntries); // New

    // Categories and Company Details are global (saved to localStorage for simplicity)
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

    const saveCompanyDetails = () => {
        companyName = companyNameInput.value.trim();
        companyAddress = companyAddressInput.value.trim();
        companyContact = companyContactInput.value.trim();

        localStorage.setItem('companyName', companyName);
        localStorage.setItem('companyAddress', companyAddress);
        localStorage.setItem('companyContact', companyContact);

        displayCompanyName.textContent = companyName;
        displayCompanyAddress.textContent = companyAddress;
        displayCompanyContact.textContent = companyContact;

        showAlert('Company details saved!');
    };

    const loadCompanyDetails = () => {
        const storedCompanyName = localStorage.getItem('companyName');
        const storedCompanyAddress = localStorage.getItem('companyAddress');
        const storedCompanyContact = localStorage.getItem('companyContact');

        if (storedCompanyName) {
            companyName = storedCompanyName;
            companyNameInput.value = storedCompanyName;
        }
        if (storedCompanyAddress) {
            companyAddress = storedCompanyAddress;
            companyAddressInput.value = storedCompanyAddress;
        }
        if (storedCompanyContact) {
            companyContact = storedCompanyContact;
            companyContactInput.value = storedCompanyContact;
        }

        displayCompanyName.textContent = companyName;
        displayCompanyAddress.textContent = companyAddress;
        displayCompanyContact.textContent = companyContact;
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

        dataToRender.forEach((entry) => { // Removed index, using entry.id directly
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
            // We pass the Firestore ID for actual deletion/update
            editButton.addEventListener('click', () => editReceiptEntry(entry));
            actionsCell.appendChild(editButton);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('delete-btn');
            deleteButton.addEventListener('click', () => deleteReceiptEntry(entry.id));
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

        dataToRender.forEach((transaction) => { // Removed index
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
            editButton.addEventListener('click', () => editFinanceTransaction(transaction));
            actionsCell.appendChild(editButton);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('delete-btn');
            deleteButton.addEventListener('click', () => deleteFinanceTransaction(transaction.id));
            actionsCell.appendChild(deleteButton);
        });
        updateDashboardMetrics();
    };

    const renderVisitorTable = (dataToRender) => {
        visitorTableBody.innerHTML = '';
        if (dataToRender.length === 0 && filterInput.value === '') {
            const noDataRow = visitorTableBody.insertRow(); // Changed from insertCell to insertRow
            const cell = noDataRow.insertCell();
            cell.colSpan = 7;
            cell.textContent = "No visitor entries yet. Add one above!";
            cell.style.textAlign = 'center';
            cell.style.fontStyle = 'italic';
            cell.style.padding = '20px';
        }

        dataToRender.sort((a, b) => new Date(b.date) - new Date(a.date));

        dataToRender.forEach((visitor) => { // Removed index
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
            editButton.addEventListener('click', () => editVisitorEntry(visitor));
            actionsCell.appendChild(editButton);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('delete-btn');
            deleteButton.addEventListener('click', () => deleteVisitorEntry(visitor.id));
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

        dataToRender.forEach((complain) => { // Removed index
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
            editButton.addEventListener('click', () => editComplainEntry(complain));
            actionsCell.appendChild(editButton);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('delete-btn');
            deleteButton.addEventListener('click', () => deleteComplainEntry(complain.id));
            actionsCell.appendChild(deleteButton);
        });
    };

    // --- New: Render Daybook Table ---
    const renderDaybookTable = (dataToRender) => {
        daybookTableBody.innerHTML = '';
        if (dataToRender.length === 0 && filterInput.value === '') {
            const noDataRow = daybookTableBody.insertRow();
            const cell = noDataRow.insertCell();
            cell.colSpan = 6; // Adjust colspan for Daybook columns
            cell.textContent = "No daybook entries yet. Add one above!";
            cell.style.textAlign = 'center';
            cell.style.fontStyle = 'italic';
            cell.style.padding = '20px';
        }

        // Sort by date and then time (newest first)
        dataToRender.sort((a, b) => {
            const dateA = new Date(`${a.date}T${a.time}`);
            const dateB = new Date(`${b.date}T${b.time}`);
            return dateB - dateA;
        });

        dataToRender.forEach((entry) => { // Removed index
            const row = daybookTableBody.insertRow();
            row.insertCell().textContent = convertADToBS(entry.date);
            row.insertCell().textContent = entry.time;
            row.insertCell().textContent = entry.activity;
            row.insertCell().textContent = entry.amount ? parseFloat(entry.amount).toFixed(2) : '-';
            row.insertCell().textContent = entry.type || '-';

            const actionsCell = row.insertCell();
            actionsCell.classList.add('action-buttons');
            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.classList.add('edit-btn');
            editButton.addEventListener('click', () => editDaybookEntry(entry));
            actionsCell.appendChild(editButton);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('delete-btn');
            deleteButton.addEventListener('click', () => deleteDaybookEntry(entry.id));
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
                const docRef = await getGlobalCollectionRef('receipts').add(newEntry); // Add to Firestore
                receiptEntries.push({ id: docRef.id, ...newEntry }); // Add with Firestore ID
                // Instead of re-saving entire collection, we now update the local array
                // and then just render. The save logic is more on app load/logout/specific saves.
                applyFilter(); // Re-render table with new data
                clearReceiptForm();
                showAlert('Receipt entry added successfully!');
                await saveReceiptEntries(); // Save to Firestore immediately after add
            } catch (error) {
                console.error("Error adding receipt:", error);
                showAlert(`Error adding receipt: ${error.message}`);
            }
        } else {
            showAlert('Please fill in all receipt fields correctly (Amount must be a number, Category must be selected).');
        }
    });

    const editReceiptEntry = (entry) => {
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
                await getGlobalCollectionRef('receipts').doc(docIdToUpdate).update(updatedEntry); // Update in Firestore
                // Update local array
                const indexInArray = receiptEntries.findIndex(e => e.id === docIdToUpdate);
                if (indexInArray !== -1) {
                    receiptEntries[indexInArray] = { id: docIdToUpdate, ...updatedEntry };
                }
                applyFilter(); // Re-render table with updated data
                clearReceiptForm();
                addEntryButton.style.display = 'inline-block';
                updateEntryButton.style.display = 'none';
                showAlert('Receipt entry updated successfully!');
                await saveReceiptEntries(); // Save to Firestore immediately after update
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
                await getGlobalCollectionRef('receipts').doc(docIdToDelete).delete(); // Delete from Firestore
                receiptEntries = receiptEntries.filter(entry => entry.id !== docIdToDelete); // Update local array
                applyFilter(); // Re-render table
                clearReceiptForm();
                addEntryButton.style.display = 'inline-block';
                updateEntryButton.style.display = 'none';
                showAlert('Receipt entry deleted!');
                await saveReceiptEntries(); // Save to Firestore immediately after delete
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
                const docRef = await getGlobalCollectionRef('finance').add(newTransaction);
                financeTransactions.push({ id: docRef.id, ...newTransaction });
                applyFilter();
                clearFinanceForm();
                showAlert('Finance transaction added successfully!');
                await saveFinanceTransactions();
            } catch (error) {
                console.error("Error adding finance transaction:", error);
                showAlert(`Error adding finance transaction: ${error.message}`);
            }
        } else {
            showAlert('Please fill in all finance fields correctly (Amount must be a number, Type must be selected).');
        }
    });

    const editFinanceTransaction = (transaction) => {
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
                await getGlobalCollectionRef('finance').doc(docIdToUpdate).update(updatedTransaction);
                const indexInArray = financeTransactions.findIndex(t => t.id === docIdToUpdate);
                if (indexInArray !== -1) {
                    financeTransactions[indexInArray] = { id: docIdToUpdate, ...updatedTransaction };
                }
                applyFilter();
                clearFinanceForm();
                addFinanceEntryButton.style.display = 'inline-block';
                updateFinanceEntryButton.style.display = 'none';
                showAlert('Finance transaction updated successfully!');
                await saveFinanceTransactions();
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
                await getGlobalCollectionRef('finance').doc(docIdToDelete).delete();
                financeTransactions = financeTransactions.filter(transaction => transaction.id !== docIdToDelete);
                applyFilter();
                clearFinanceForm();
                addFinanceEntryButton.style.display = 'inline-block';
                updateFinanceEntryButton.style.display = 'none';
                showAlert('Finance transaction deleted!');
                await saveFinanceTransactions();
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
                const docRef = await getGlobalCollectionRef('visitors').add(newVisitor);
                visitors.push({ id: docRef.id, ...newVisitor });
                applyFilter();
                clearVisitorForm();
                showAlert('Visitor entry added successfully!');
                await saveVisitors();
            } catch (error) {
                console.error("Error adding visitor:", error);
                showAlert(`Error adding visitor: ${error.message}`);
            }
        } else {
            showAlert('Please fill in Date, Name, Contact, Purpose, and Time In for the visitor entry.');
        }
    });

    const editVisitorEntry = (visitor) => {
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
                await getGlobalCollectionRef('visitors').doc(docIdToUpdate).update(updatedVisitor);
                const indexInArray = visitors.findIndex(v => v.id === docIdToUpdate);
                if (indexInArray !== -1) {
                    visitors[indexInArray] = { id: docIdToUpdate, ...updatedVisitor };
                }
                applyFilter();
                clearVisitorForm();
                addVisitorEntryButton.style.display = 'inline-block';
                updateVisitorEntryButton.style.display = 'none';
                showAlert('Visitor entry updated successfully!');
                await saveVisitors();
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
                await getGlobalCollectionRef('visitors').doc(docIdToDelete).delete();
                visitors = visitors.filter(visitor => visitor.id !== docIdToDelete);
                applyFilter();
                clearVisitorForm();
                addVisitorEntryButton.style.display = 'inline-block';
                updateVisitorEntryButton.style.display = 'none';
                showAlert('Visitor entry deleted!');
                await saveVisitors();
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
                const docRef = await getGlobalCollectionRef('complains').add(newComplain);
                complains.push({ id: docRef.id, ...newComplain });
                applyFilter();
                clearComplainForm();
                showAlert('Complain entry added successfully!');
                await saveComplains();
            } catch (error) {
                console.error("Error adding complain:", error);
                showAlert(`Error adding complain: ${error.message}`);
            }
        } else {
            showAlert('Please fill in Date, Complainant Name, Details, and Status for the complain entry.');
        }
    });

    const editComplainEntry = (complain) => {
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
                await getGlobalCollectionRef('complains').doc(docIdToUpdate).update(updatedComplain);
                const indexInArray = complains.findIndex(c => c.id === docIdToUpdate);
                if (indexInArray !== -1) {
                    complains[indexInArray] = { id: docIdToUpdate, ...updatedComplain };
                }
                applyFilter();
                clearComplainForm();
                addComplainEntryButton.style.display = 'inline-block';
                updateComplainEntryButton.style.display = 'none';
                showAlert('Complain entry updated successfully!');
                await saveComplains();
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
                await getGlobalCollectionRef('complains').doc(docIdToDelete).delete();
                complains = complains.filter(complain => complain.id !== docIdToDelete);
                applyFilter();
                clearComplainForm();
                addComplainEntryButton.style.display = 'inline-block';
                updateComplainEntryButton.style.display = 'none';
                showAlert('Complain entry deleted!');
                await saveComplains();
            } catch (error) {
                console.error("Error deleting complain:", error);
                showAlert(`Error deleting complain: ${error.message}`);
            }
        }
    };

    // --- New CRUD Operations - Daybook ---
    addDaybookEntryButton.addEventListener('click', async () => {
        const date = daybookDateInput.value;
        const time = daybookTimeInput.value;
        const activity = daybookActivityInput.value.trim();
        const amount = daybookAmountInput.value.trim() ? parseFloat(daybookAmountInput.value.trim()) : 0; // Optional amount
        const type = daybookTypeSelect.value || 'General'; // Default to 'General' if not selected

        if (date && time && activity) {
            const newDaybookEntry = { date, time, activity, amount, type };
            try {
                const docRef = await getGlobalCollectionRef('daybook').add(newDaybookEntry);
                daybookEntries.push({ id: docRef.id, ...newDaybookEntry });
                applyFilter();
                clearDaybookForm();
                showAlert('Daybook entry added successfully!');
                await saveDaybookEntries();
            } catch (error) {
                console.error("Error adding daybook entry:", error);
                showAlert(`Error adding daybook entry: ${error.message}`);
            }
        } else {
            showAlert('Please fill in Date, Time, and Activity for the daybook entry.');
        }
    });

    const editDaybookEntry = (entry) => {
        daybookDateInput.value = entry.date;
        daybookTimeInput.value = entry.time;
        daybookActivityInput.value = entry.activity;
        daybookAmountInput.value = entry.amount || ''; // Handle optional amount
        daybookTypeSelect.value = entry.type || ''; // Handle optional type
        daybookEditIndexHidden.value = entry.id;

        addDaybookEntryButton.style.display = 'none';
        updateDaybookEntryButton.style.display = 'inline-block';
    };

    updateDaybookEntryButton.addEventListener('click', async () => {
        const docIdToUpdate = daybookEditIndexHidden.value;
        if (!docIdToUpdate) {
            showAlert('Error: No daybook entry selected for update.'); return;
        }

        const date = daybookDateInput.value;
        const time = daybookTimeInput.value;
        const activity = daybookActivityInput.value.trim();
        const amount = daybookAmountInput.value.trim() ? parseFloat(daybookAmountInput.value.trim()) : 0;
        const type = daybookTypeSelect.value || 'General';

        if (date && time && activity) {
            const updatedEntry = { date, time, activity, amount, type };
            try {
                await getGlobalCollectionRef('daybook').doc(docIdToUpdate).update(updatedEntry);
                const indexInArray = daybookEntries.findIndex(e => e.id === docIdToUpdate);
                if (indexInArray !== -1) {
                    daybookEntries[indexInArray] = { id: docIdToUpdate, ...updatedEntry };
                }
                applyFilter();
                clearDaybookForm();
                addDaybookEntryButton.style.display = 'inline-block';
                updateDaybookEntryButton.style.display = 'none';
                showAlert('Daybook entry updated successfully!');
                await saveDaybookEntries();
            } catch (error) {
                console.error("Error updating daybook entry:", error);
                showAlert(`Error updating daybook entry: ${error.message}`);
            }
        } else {
            showAlert('Please fill in all daybook fields correctly for update.');
        }
    });

    const deleteDaybookEntry = async (docIdToDelete) => {
        if (confirm('Are you sure you want to delete this daybook entry?')) {
            try {
                await getGlobalCollectionRef('daybook').doc(docIdToDelete).delete();
                daybookEntries = daybookEntries.filter(entry => entry.id !== docIdToDelete);
                applyFilter();
                clearDaybookForm();
                addDaybookEntryButton.style.display = 'inline-block';
                updateDaybookEntryButton.style.display = 'none';
                showAlert('Daybook entry deleted!');
                await saveDaybookEntries();
            } catch (error) {
                console.error("Error deleting daybook entry:", error);
                showAlert(`Error deleting daybook entry: ${error.message}`);
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
        setCurrentTime(timeInInput); // Set current time for time in
        timeOutInput.value = ''; // Clear time out
        visitorNameInput.value = '';
        visitorContactInput.value = '';
        visitorPurposeInput.value = '';
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

    // --- New: Clear Daybook Form ---
    const clearDaybookForm = () => {
        setTodayDate(daybookDateInput);
        setCurrentTime(daybookTimeInput);
        daybookActivityInput.value = '';
        daybookAmountInput.value = '';
        daybookTypeSelect.value = '';
        daybookEditIndexHidden.value = '';
        addDaybookEntryButton.style.display = 'inline-block';
        updateDaybookEntryButton.style.display = 'none';
    };

    clearFormButton.addEventListener('click', clearReceiptForm);
    clearFinanceFormButton.addEventListener('click', clearFinanceForm);
    clearVisitorFormButton.addEventListener('click', clearVisitorForm);
    clearComplainFormButton.addEventListener('click', clearComplainForm);
    clearDaybookFormButton.addEventListener('click', clearDaybookForm); // New


    // --- Filter Functionality (Applies to CURRENTLY ACTIVE table only) ---
    let currentActiveAppId = 'receipts-app'; // Default active app

    const applyFilter = () => {
        const filterText = filterInput.value.toLowerCase();

        // Get the currently active app section
        const activeAppSection = document.querySelector('.app-section.active-app');
        if (!activeAppSection) return; // No active section, nothing to filter

        const activeAppId = activeAppSection.id;

        if (activeAppId === 'receipts-app') {
            const filteredData = receiptEntries.filter(entry =>
                Object.values(entry).some(value =>
                    String(value).toLowerCase().includes(filterText)
                )
            );
            renderReceiptTable(filteredData);
        } else if (activeAppId === 'finance-app') {
            const filteredData = financeTransactions.filter(transaction =>
                Object.values(transaction).some(value =>
                    String(value).toLowerCase().includes(filterText)
                )
            );
            renderFinanceTable(filteredData);
        } else if (activeAppId === 'visitors-app') {
            const filteredData = visitors.filter(visitor =>
                Object.values(visitor).some(value =>
                    String(value).toLowerCase().includes(filterText)
                )
            );
            renderVisitorTable(filteredData);
        } else if (activeAppId === 'complains-app') {
            const filteredData = complains.filter(complain =>
                Object.values(complain).some(value =>
                    String(value).toLowerCase().includes(filterText)
                )
            );
            renderComplainTable(filteredData);
        } else if (activeAppId === 'daybook-app') { // New filter for Daybook
            const filteredData = daybookEntries.filter(entry =>
                Object.values(entry).some(value =>
                    String(value).toLowerCase().includes(filterText)
                )
            );
            renderDaybookTable(filteredData);
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
        printWindow.document.write('.print-company-title { text-align: center; font-size: 1.8em; font-weight: bold; margin-bottom: 5px; color: #333; }');
        printWindow.document.write('.print-company-details { text-align: center; font-size: 0.9em; color: #555; margin-bottom: 20px;}'); // New style
        printWindow.document.write('.print-company-details p { margin: 2px 0; }'); // New style
        printWindow.document.write('h2 { text-align: center; margin-bottom: 15px; color: #555; }');
        printWindow.document.write('table { width: 100%; border-collapse: collapse; margin-top: 20px; }');
        printWindow.document.write('table th, table td { border: 1px solid #ccc; padding: 10px; text-align: left; }');
        printWindow.document.write('table th { background-color: #f0f0f0; }');
        printWindow.document.write('</style>');
        printWindow.document.write('</head><body>');

        if (companyName) {
            printWindow.document.write(`<div class="print-company-title">${companyName}</div>`);
        }
        if (companyAddress || companyContact) { // New: Add address and contact to print
            printWindow.document.write(`<div class="print-company-details">`);
            if (companyAddress) printWindow.document.write(`<p>Address: ${companyAddress}</p>`);
            if (companyContact) printWindow.document.write(`<p>Contact: ${companyContact}</p>`);
            printWindow.document.write(`</div>`);
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
    printDaybookDataButton.addEventListener('click', () => printTable('daybookTable', 'Daybook Entries Report')); // New


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

            // Remove active class from all nav buttons and app sections
            navButtons.forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.app-section').forEach(section => section.classList.remove('active-app'));

            // Add active class to the clicked button and its corresponding app section
            button.classList.add('active');
            document.getElementById(targetAppId).classList.add('active-app');

            // Update the global variable for current active app
            currentActiveAppId = targetAppId;
            // Update the header app name
            currentAppName.textContent = appName;

            // Clear filter and re-apply for the new section
            filterInput.value = '';
            applyFilter();
        });
    });

    // --- Simple Login/Logout with Hardcoded Credentials (INSECURE FOR PRODUCTION) ---
    simpleLoginButton.addEventListener('click', async () => {
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        // *** WARNING: THIS IS EXTREMELY INSECURE FOR ANY REAL APPLICATION ***
        // Hardcoded credentials are visible to anyone inspecting the source code.
        // This is for demonstration purposes only where security is NOT a concern.
        if (username === 'Admin' && password === 'Admin123') {
            showAlert('Login successful! Welcome.');
            await loginStatusChange(true); // Simulate login state, await data loading
        } else {
            showAlert('Invalid username or password.');
            usernameInput.value = '';
            passwordInput.value = '';
        }
    });

    logoutButton.addEventListener('click', () => {
        if (confirm('Are you sure you want to log out?')) {
            showAlert('Logged out successfully.');
            loginStatusChange(false); // Simulate logout state
        }
    });

    // Function to handle UI changes based on login status
    const loginStatusChange = async (isLoggedIn) => {
        if (isLoggedIn) {
            authSection.style.display = 'none';
            mainAppContainer.style.display = 'block';
            console.log("Logged in to simple system.");

            // Load all data from Firestore (now from global collections)
            receiptEntries = await loadDataFromFirestore('receipts');
            financeTransactions = await loadDataFromFirestore('finance');
            visitors = await loadDataFromFirestore('visitors');
            complains = await loadDataFromFirestore('complains');
            daybookEntries = await loadDataFromFirestore('daybook'); // New
            loadCategories();
            loadCompanyDetails(); // New

            // Render tables with loaded data
            renderReceiptTable(receiptEntries);
            renderFinanceTable(financeTransactions);
            renderVisitorTable(visitors);
            renderComplainTable(complains);
            renderDaybookTable(daybookEntries); // New

            updateDashboardMetrics();

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
            clearDaybookForm(); // New

            applyFilter(); // Apply initial filter (which is usually empty, showing all)
        } else {
            // Only set auth section display to flex and main app to none if we are actually logging out
            if (authSection.style.display === 'none' || mainAppContainer.style.display === 'block') {
                authSection.style.display = 'flex';
                mainAppContainer.style.display = 'none';
                console.log("Logged out from simple system.");

                // Clear all local data
                receiptEntries = [];
                financeTransactions = [];
                visitors = [];
                complains = [];
                daybookEntries = []; // New

                // Clear tables
                receiptTableBody.innerHTML = '';
                financeTableBody.innerHTML = '';
                visitorTableBody.innerHTML = '';
                complainTableBody.innerHTML = '';
                daybookTableBody.innerHTML = ''; // New

                updateDashboardMetrics();
                filterInput.value = '';

                // Reset login fields (and set default values for convenience)
                usernameInput.value = 'Admin';
                passwordInput.value = 'Admin123';
            }
        }
    };


    // --- Initializations on Load ---
    const initializeApp = () => {
        // Set today's date for all date inputs
        setTodayDate(receiptDateInput);
        setTodayDate(financeDateInput);
        setTodayDate(visitorDateInput);
        setTodayDate(complainDateInput);
        setTodayDate(daybookDateInput); // New

        // Set current time for relevant time inputs
        setCurrentTime(timeInInput);
        setCurrentTime(daybookTimeInput); // New

        // Start time update
        updateDateTime();
        setInterval(updateDateTime, 1000);

        // Crucial fix: Don't call loginStatusChange(false) here,
        // as it will immediately log out after a successful login.
        // The auth section is initially displayed via HTML's default state.
        // We only change it when login button is clicked.

        // Ensure the auth section is visible by default (CSS handles this, but explicit might help)
        authSection.style.display = 'flex';
        mainAppContainer.style.display = 'none';

        // Load company details and categories only when the app is initialized (i.e., after login)
        // or ensure they are loaded globally if needed before login
        loadCategories(); // Categories can be loaded always as they are global config
        loadCompanyDetails(); // Company details can be loaded always as they are global config
    };

    initializeApp();

    // Event listener for saving company details (in settings)
    saveCompanyDetailsButton.addEventListener('click', saveCompanyDetails);
});
