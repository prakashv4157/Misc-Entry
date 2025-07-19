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

    // --- Data Storage ---
    let receiptEntries = [];
    let financeTransactions = [];
    let visitors = []; // New data array for visitors
    let complains = []; // New data array for complains
    let categories = ['Tuition', 'Books', 'Fees', 'Supplies', 'Other'];
    let companyName = "Your Company Name"; // Default company name

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
    // companyNameInput and saveCompanyNameButton are already defined globally.

    // --- Utility Functions ---

    // Converts AD (Gregorian) date string (YYYY-MM-DD) to Nepali BS date string
    const convertADToBS = (adDateString) => {
        if (!adDateString) return '';
        try {
            const [year, month, day] = adDateString.split('-').map(Number);
            const nepaliDate = new NepaliDate(year, month - 1, day); // month-1 because NepaliDate expects 0-indexed month
            return `${nepaliDate.getBSYear()}-${(nepaliDate.getBSMonth() + 1).toString().padStart(2, '0')}-${nepaliDate.getBSDay().toString().padStart(2, '0')}`;
        } catch (e) {
            console.error("Error converting AD to BS date:", e);
            return adDateString; // Return original if conversion fails
        }
    };

    // Sets today's date as default for the date input fields (AD)
    const setTodayDate = (inputElement) => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        inputElement.value = `${year}-${month}-${day}`;
    };

    // Updates the dashboard date and time
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

    // --- Local Storage Management ---
    const saveReceiptEntries = () => {
        localStorage.setItem('receiptEntries', JSON.stringify(receiptEntries));
        updateDashboardMetrics();
    };

    const loadReceiptEntries = () => {
        const storedEntries = localStorage.getItem('receiptEntries');
        if (storedEntries) {
            receiptEntries = JSON.parse(storedEntries);
        }
        renderReceiptTable(receiptEntries);
    };

    const saveFinanceTransactions = () => {
        localStorage.setItem('financeTransactions', JSON.stringify(financeTransactions));
        updateDashboardMetrics();
    };

    const loadFinanceTransactions = () => {
        const storedTransactions = localStorage.getItem('financeTransactions');
        if (storedTransactions) {
            financeTransactions = JSON.parse(storedTransactions);
        }
        renderFinanceTable(financeTransactions);
    };

    const saveVisitors = () => {
        localStorage.setItem('visitors', JSON.stringify(visitors));
    };

    const loadVisitors = () => {
        const storedVisitors = localStorage.getItem('visitors');
        if (storedVisitors) {
            visitors = JSON.parse(storedVisitors);
        }
        renderVisitorTable(visitors);
    };

    const saveComplains = () => {
        localStorage.setItem('complains', JSON.stringify(complains));
    };

    const loadComplains = () => {
        const storedComplains = localStorage.getItem('complains');
        if (storedComplains) {
            complains = JSON.parse(storedComplains);
        }
        renderComplainTable(complains);
    };

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
        localStorage.setItem('receiptCompanyName', companyNameInput.value.trim());
        companyName = companyNameInput.value.trim();
        displayCompanyName.textContent = companyName; // Update header immediately
        alert('Company name saved!');
    };

    const loadCompanyNameSetting = () => {
        const storedCompanyName = localStorage.getItem('receiptCompanyName');
        if (storedCompanyName) {
            companyName = storedCompanyName;
            companyNameInput.value = storedCompanyName;
        }
        displayCompanyName.textContent = companyName; // Set header on load
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
            alert('Category already exists!');
        } else {
            alert('Please enter a category name.');
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
            deleteButton.addEventListener('click', () => {
                const originalIndex = receiptEntries.findIndex(e =>
                    e.receiptNo === entry.receiptNo && e.amount === entry.amount && e.date === entry.date
                ); // Simplified find for unique enough attributes
                if (originalIndex !== -1) deleteReceiptEntry(originalIndex);
            });
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
            deleteButton.addEventListener('click', () => {
                const originalIndex = financeTransactions.findIndex(t =>
                    t.date === transaction.date && t.description === transaction.description && t.amount === transaction.amount
                );
                if (originalIndex !== -1) deleteFinanceTransaction(originalIndex);
            });
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
            deleteButton.addEventListener('click', () => {
                const originalIndex = visitors.findIndex(v =>
                    v.date === visitor.date && v.name === visitor.name && v.timeIn === visitor.timeIn
                );
                if (originalIndex !== -1) deleteVisitorEntry(originalIndex);
            });
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
            deleteButton.addEventListener('click', () => {
                const originalIndex = complains.findIndex(c =>
                    c.date === complain.date && c.complainantName === complain.complainantName && c.details === complain.details
                );
                if (originalIndex !== -1) deleteComplainEntry(originalIndex);
            });
            actionsCell.appendChild(deleteButton);
        });
    };

    // --- CRUD Operations - Receipts ---
    addEntryButton.addEventListener('click', () => {
        const date = receiptDateInput.value;
        const receiptNo = receiptNoInput.value.trim();
        const amount = parseFloat(amountInput.value.trim());
        const name = nameInput.value.trim();
        const classVal = classInput.value.trim();
        const category = categorySelect.value;

        if (date && receiptNo && !isNaN(amount) && name && classVal && category) {
            const newEntry = { date, receiptNo, amount, name, class: classVal, category };
            receiptEntries.push(newEntry);
            saveReceiptEntries();
            renderReceiptTable(receiptEntries);
            clearReceiptForm();
            alert('Receipt entry added successfully!');
        } else {
            alert('Please fill in all receipt fields correctly (Amount must be a number, Category must be selected).');
        }
    });

    const editReceiptEntry = (entry, index) => {
        receiptDateInput.value = entry.date;
        receiptNoInput.value = entry.receiptNo;
        amountInput.value = entry.amount;
        nameInput.value = entry.name;
        classInput.value = entry.class;
        categorySelect.value = entry.category;
        editIndexHidden.value = index;

        addEntryButton.style.display = 'none';
        updateEntryButton.style.display = 'inline-block';
    };

    updateEntryButton.addEventListener('click', () => {
        const indexToUpdate = parseInt(editIndexHidden.value);
        if (isNaN(indexToUpdate) || indexToUpdate < 0 || indexToUpdate >= receiptEntries.length) {
            alert('Error: No receipt entry selected for update.'); return;
        }

        const date = receiptDateInput.value;
        const receiptNo = receiptNoInput.value.trim();
        const amount = parseFloat(amountInput.value.trim());
        const name = nameInput.value.trim();
        const classVal = classInput.value.trim();
        const category = categorySelect.value;

        if (date && receiptNo && !isNaN(amount) && name && classVal && category) {
            receiptEntries[indexToUpdate] = { date, receiptNo, amount, name, class: classVal, category };
            saveReceiptEntries();
            renderReceiptTable(receiptEntries);
            clearReceiptForm();
            addEntryButton.style.display = 'inline-block';
            updateEntryButton.style.display = 'none';
            alert('Receipt entry updated successfully!');
        } else {
            alert('Please fill in all receipt fields correctly for update.');
        }
    });

    const deleteReceiptEntry = (indexToDelete) => {
        if (confirm('Are you sure you want to delete this receipt entry?')) {
            receiptEntries.splice(indexToDelete, 1);
            saveReceiptEntries();
            applyFilter();
            clearReceiptForm();
            addEntryButton.style.display = 'inline-block';
            updateEntryButton.style.display = 'none';
            alert('Receipt entry deleted!');
        }
    };

    // --- CRUD Operations - Finance ---
    addFinanceEntryButton.addEventListener('click', () => {
        const date = financeDateInput.value;
        const description = financeDescriptionInput.value.trim();
        const amount = parseFloat(financeAmountInput.value.trim());
        const type = financeTypeSelect.value;

        if (date && description && !isNaN(amount) && type) {
            const newTransaction = { date, description, amount, type };
            financeTransactions.push(newTransaction);
            saveFinanceTransactions();
            renderFinanceTable(financeTransactions);
            clearFinanceForm();
            alert('Finance transaction added successfully!');
        } else {
            alert('Please fill in all finance fields correctly (Amount must be a number, Type must be selected).');
        }
    });

    const editFinanceTransaction = (transaction, index) => {
        financeDateInput.value = transaction.date;
        financeDescriptionInput.value = transaction.description;
        financeAmountInput.value = transaction.amount;
        financeTypeSelect.value = transaction.type;
        financeEditIndexHidden.value = index;

        addFinanceEntryButton.style.display = 'none';
        updateFinanceEntryButton.style.display = 'inline-block';
    };

    updateFinanceEntryButton.addEventListener('click', () => {
        const indexToUpdate = parseInt(financeEditIndexHidden.value);
        if (isNaN(indexToUpdate) || indexToUpdate < 0 || indexToUpdate >= financeTransactions.length) {
            alert('Error: No finance transaction selected for update.'); return;
        }

        const date = financeDateInput.value;
        const description = financeDescriptionInput.value.trim();
        const amount = parseFloat(financeAmountInput.value.trim());
        const type = financeTypeSelect.value;

        if (date && description && !isNaN(amount) && type) {
            financeTransactions[indexToUpdate] = { date, description, amount, type };
            saveFinanceTransactions();
            renderFinanceTable(financeTransactions);
            clearFinanceForm();
            addFinanceEntryButton.style.display = 'inline-block';
            updateFinanceEntryButton.style.display = 'none';
            alert('Finance transaction updated successfully!');
        } else {
            alert('Please fill in all finance fields correctly for update.');
        }
    });

    const deleteFinanceTransaction = (indexToDelete) => {
        if (confirm('Are you sure you want to delete this finance transaction?')) {
            financeTransactions.splice(indexToDelete, 1);
            saveFinanceTransactions();
            applyFilter();
            clearFinanceForm();
            addFinanceEntryButton.style.display = 'inline-block';
            updateFinanceEntryButton.style.display = 'none';
            alert('Finance transaction deleted!');
        }
    };

    // --- CRUD Operations - Visitors ---
    addVisitorEntryButton.addEventListener('click', () => {
        const date = visitorDateInput.value;
        const name = visitorNameInput.value.trim();
        const contact = visitorContactInput.value.trim();
        const purpose = visitorPurposeInput.value.trim();
        const timeIn = timeInInput.value;
        const timeOut = timeOutInput.value;

        if (date && name && contact && purpose && timeIn) {
            const newVisitor = { date, name, contact, purpose, timeIn, timeOut };
            visitors.push(newVisitor);
            saveVisitors();
            renderVisitorTable(visitors);
            clearVisitorForm();
            alert('Visitor entry added successfully!');
        } else {
            alert('Please fill in Date, Name, Contact, Purpose, and Time In for the visitor entry.');
        }
    });

    const editVisitorEntry = (visitor, index) => {
        visitorDateInput.value = visitor.date;
        visitorNameInput.value = visitor.name;
        visitorContactInput.value = visitor.contact;
        visitorPurposeInput.value = visitor.purpose;
        timeInInput.value = visitor.timeIn;
        timeOutInput.value = visitor.timeOut;
        visitorEditIndexHidden.value = index;

        addVisitorEntryButton.style.display = 'none';
        updateVisitorEntryButton.style.display = 'inline-block';
    };

    updateVisitorEntryButton.addEventListener('click', () => {
        const indexToUpdate = parseInt(visitorEditIndexHidden.value);
        if (isNaN(indexToUpdate) || indexToUpdate < 0 || indexToUpdate >= visitors.length) {
            alert('Error: No visitor entry selected for update.'); return;
        }

        const date = visitorDateInput.value;
        const name = visitorNameInput.value.trim();
        const contact = visitorContactInput.value.trim();
        const purpose = visitorPurposeInput.value.trim();
        const timeIn = timeInInput.value;
        const timeOut = timeOutInput.value;

        if (date && name && contact && purpose && timeIn) {
            visitors[indexToUpdate] = { date, name, contact, purpose, timeIn, timeOut };
            saveVisitors();
            renderVisitorTable(visitors);
            clearVisitorForm();
            addVisitorEntryButton.style.display = 'inline-block';
            updateVisitorEntryButton.style.display = 'none';
            alert('Visitor entry updated successfully!');
        } else {
            alert('Please fill in all visitor fields correctly for update.');
        }
    });

    const deleteVisitorEntry = (indexToDelete) => {
        if (confirm('Are you sure you want to delete this visitor entry?')) {
            visitors.splice(indexToDelete, 1);
            saveVisitors();
            applyFilter();
            clearVisitorForm();
            addVisitorEntryButton.style.display = 'inline-block';
            updateVisitorEntryButton.style.display = 'none';
            alert('Visitor entry deleted!');
        }
    };

    // --- CRUD Operations - Complains ---
    addComplainEntryButton.addEventListener('click', () => {
        const date = complainDateInput.value;
        const complainantName = complainantNameInput.value.trim();
        const complainantContact = complainantContactInput.value.trim();
        const details = complainDetailsInput.value.trim();
        const status = complainStatusSelect.value;

        if (date && complainantName && details && status) {
            const newComplain = { date, complainantName, complainantContact, details, status };
            complains.push(newComplain);
            saveComplains();
            renderComplainTable(complains);
            clearComplainForm();
            alert('Complain entry added successfully!');
        } else {
            alert('Please fill in Date, Complainant Name, Details, and Status for the complain entry.');
        }
    });

    const editComplainEntry = (complain, index) => {
        complainDateInput.value = complain.date;
        complainantNameInput.value = complain.complainantName;
        complainantContactInput.value = complain.complainantContact;
        complainDetailsInput.value = complain.details;
        complainStatusSelect.value = complain.status;
        complainEditIndexHidden.value = index;

        addComplainEntryButton.style.display = 'none';
        updateComplainEntryButton.style.display = 'inline-block';
    };

    updateComplainEntryButton.addEventListener('click', () => {
        const indexToUpdate = parseInt(complainEditIndexHidden.value);
        if (isNaN(indexToUpdate) || indexToUpdate < 0 || indexToUpdate >= complains.length) {
            alert('Error: No complain entry selected for update.'); return;
        }

        const date = complainDateInput.value;
        const complainantName = complainantNameInput.value.trim();
        const complainantContact = complainantContactInput.value.trim();
        const details = complainDetailsInput.value.trim();
        const status = complainStatusSelect.value;

        if (date && complainantName && details && status) {
            complains[indexToUpdate] = { date, complainantName, complainantContact, details, status };
            saveComplains();
            renderComplainTable(complains);
            clearComplainForm();
            addComplainEntryButton.style.display = 'inline-block';
            updateComplainEntryButton.style.display = 'none';
            alert('Complain entry updated successfully!');
        } else {
            alert('Please fill in all complain fields correctly for update.');
        }
    });

    const deleteComplainEntry = (indexToDelete) => {
        if (confirm('Are you sure you want to delete this complain entry?')) {
            complains.splice(indexToDelete, 1);
            saveComplains();
            applyFilter();
            clearComplainForm();
            addComplainEntryButton.style.display = 'inline-block';
            updateComplainEntryButton.style.display = 'none';
            alert('Complain entry deleted!');
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
        complainStatusSelect.value = 'New'; // Reset to default status
        complainEditIndexHidden.value = '';
        addComplainEntryButton.style.display = 'inline-block';
        updateComplainEntryButton.style.display = 'none';
    };

    clearFormButton.addEventListener('click', clearReceiptForm);
    clearFinanceFormButton.addEventListener('click', clearFinanceForm);
    clearVisitorFormButton.addEventListener('click', clearVisitorForm);
    clearComplainFormButton.addEventListener('click', clearComplainForm);


    // --- Filter Functionality (Applies to CURRENTLY ACTIVE table only) ---
    let currentActiveAppId = 'receipts-app'; // Track the currently active app

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
        // Settings app has no table to filter
    };

    filterInput.addEventListener('keyup', applyFilter);

    clearFilterButton.addEventListener('click', () => {
        filterInput.value = '';
        applyFilter(); // Rerender current table without filter
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

            // Remove active class from all buttons and hide all sections
            navButtons.forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.app-section').forEach(section => section.classList.remove('active-app'));

            // Add active class to clicked button and show target section
            button.classList.add('active');
            document.getElementById(targetAppId).classList.add('active-app');

            // Update global active app tracker
            currentActiveAppId = targetAppId;
            currentAppName.textContent = appName; // Update H2 title

            // Clear filter and re-render current table when switching apps
            filterInput.value = '';
            applyFilter(); // This will re-render the current active table
        });
    });


    // --- Initializations on Load ---
    const initializeApp = () => {
        // Set today's date for all date inputs
        setTodayDate(receiptDateInput);
        setTodayDate(financeDateInput);
        setTodayDate(visitorDateInput);
        setTodayDate(complainDateInput);

        // Load all data from local storage
        loadCategories();
        loadReceiptEntries();
        loadFinanceTransactions();
        loadVisitors();
        loadComplains();
        loadCompanyNameSetting(); // Load and set company name on h1

        // Update dashboard (receipts and finance totals)
        updateDashboardMetrics();

        // Start time update
        updateDateTime();
        setInterval(updateDateTime, 1000);

        // Set initial active application (Receipts by default) and update H2
        receiptsAppSection.classList.add('active-app');
        document.querySelector('.nav-button[data-target="receipts-app"]').classList.add('active');
        currentAppName.textContent = document.querySelector('.nav-button.active').dataset.appName;
    };

    initializeApp();

    // Event listener for saving company name (in settings)
    saveCompanyNameButton.addEventListener('click', saveCompanyNameSetting);
});
