document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements - Receipt Section ---
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
    const receiptsAppSection = document.getElementById('receipts-app'); // Added for navigation

    // --- DOM Elements - Finance Section ---
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
    const financeAppSection = document.getElementById('finance-app'); // Added for navigation

    // --- DOM Elements - General & Dashboard ---
    const navButtons = document.querySelectorAll('.nav-button'); // Added for navigation
    const filterInput = document.getElementById('filterInput');
    const clearFilterButton = document.getElementById('clearFilter');
    const companyNameInput = document.getElementById('companyName');
    const saveCompanyNameButton = document.getElementById('saveCompanyName');
    const currentDateADSpan = document.getElementById('currentDateAD'); // For AD date display
    const currentDateBSSpan = document.getElementById('currentDateBS'); // For BS date display
    const currentTimeSpan = document.getElementById('currentTime');
    const totalEntriesCountSpan = document.getElementById('totalEntriesCount');
    const totalAmountSumSpan = document.getElementById('totalAmountSum');
    const totalIncomeSpan = document.getElementById('totalIncome');
    const totalExpensesSpan = document.getElementById('totalExpenses');
    const netBalanceSpan = document.getElementById('netBalance');

    // --- Data Storage ---
    let receiptEntries = [];
    let financeTransactions = [];
    let categories = ['Tuition', 'Books', 'Fees', 'Supplies', 'Other'];
    let companyName = "Your Company Name"; // Default company name

    // --- Utility Functions ---

    // Converts AD (Gregorian) date string (YYYY-MM-DD) to Nepali BS date string
    const convertADToBS = (adDateString) => {
        if (!adDateString) return '';
        try {
            const [year, month, day] = adDateString.split('-').map(Number);
            // nepalidate.min.js provides new NepaliDate(year, month-1, day)
            const nepaliDate = new NepaliDate(year, month - 1, day);
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
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
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

    const saveCompanyName = () => {
        localStorage.setItem('receiptCompanyName', companyNameInput.value.trim());
        companyName = companyNameInput.value.trim();
        alert('Company name saved!');
    };

    const loadCompanyName = () => {
        const storedCompanyName = localStorage.getItem('receiptCompanyName');
        if (storedCompanyName) {
            companyName = storedCompanyName;
            companyNameInput.value = storedCompanyName;
        }
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

    // --- Receipt Table Rendering and Actions ---
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
            row.insertCell().textContent = convertADToBS(entry.date); // Display BS date
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
            editButton.addEventListener('click', () => {
                editReceiptEntry(entry, index);
            });
            actionsCell.appendChild(editButton);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('delete-btn');
            deleteButton.addEventListener('click', () => {
                const originalIndex = receiptEntries.findIndex(e =>
                    e.receiptNo === entry.receiptNo &&
                    e.amount === entry.amount &&
                    e.name === entry.name &&
                    e.class === entry.class &&
                    e.category === entry.category &&
                    e.date === entry.date
                );
                if (originalIndex !== -1) {
                    deleteReceiptEntry(originalIndex);
                }
            });
            actionsCell.appendChild(deleteButton);
        });
        updateDashboardMetrics();
    };

    // --- Finance Table Rendering and Actions ---
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
            row.insertCell().textContent = convertADToBS(transaction.date); // Display BS date
            row.insertCell().textContent = transaction.description;
            row.insertCell().textContent = parseFloat(transaction.amount).toFixed(2);
            row.insertCell().textContent = transaction.type;

            const actionsCell = row.insertCell();
            actionsCell.classList.add('action-buttons');

            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.classList.add('edit-btn');
            editButton.addEventListener('click', () => {
                editFinanceTransaction(transaction, index);
            });
            actionsCell.appendChild(editButton);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('delete-btn');
            deleteButton.addEventListener('click', () => {
                const originalIndex = financeTransactions.findIndex(t =>
                    t.date === transaction.date &&
                    t.description === transaction.description &&
                    t.amount === transaction.amount &&
                    t.type === transaction.type
                );
                if (originalIndex !== -1) {
                    deleteFinanceTransaction(originalIndex);
                }
            });
            actionsCell.appendChild(deleteButton);
        });
        updateDashboardMetrics();
    };

    // --- CRUD Operations - Receipts ---
    addEntryButton.addEventListener('click', () => {
        const date = receiptDateInput.value; // Store as AD date string
        const receiptNo = receiptNoInput.value.trim();
        const amount = parseFloat(amountInput.value.trim());
        const name = nameInput.value.trim();
        const classVal = classInput.value.trim();
        const category = categorySelect.value;

        if (date && receiptNo && !isNaN(amount) && name && classVal && category) {
            const newEntry = {
                date,
                receiptNo,
                amount,
                name,
                class: classVal,
                category
            };
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
        receiptDateInput.value = entry.date; // Populate with AD date string
        receiptNoInput.value = entry.receiptNo;
        amountInput.value = entry.amount;
        nameInput.value = entry.name;
        classInput.value = entry.class;
        categorySelect.value = entry.category;
        editIndexHidden.value = index;

        addEntryButton.style.display = 'none';
        updateEntryButton.style.display = 'inline-block';
        alert(`Editing receipt for ${entry.name} (Receipt No: ${entry.receiptNo})`);
    };

    updateEntryButton.addEventListener('click', () => {
        const indexToUpdate = parseInt(editIndexHidden.value);
        if (isNaN(indexToUpdate) || indexToUpdate < 0 || indexToUpdate >= receiptEntries.length) {
            alert('Error: No receipt entry selected for update.');
            return;
        }

        const date = receiptDateInput.value; // Store as AD date string
        const receiptNo = receiptNoInput.value.trim();
        const amount = parseFloat(amountInput.value.trim());
        const name = nameInput.value.trim();
        const classVal = classInput.value.trim();
        const category = categorySelect.value;

        if (date && receiptNo && !isNaN(amount) && name && classVal && category) {
            receiptEntries[indexToUpdate] = {
                date,
                receiptNo,
                amount,
                name,
                class: classVal,
                category
            };
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
            applyFilter(); // Re-apply current filter after deletion, or show all if no filter
            clearReceiptForm();
            addEntryButton.style.display = 'inline-block';
            updateEntryButton.style.display = 'none';
            alert('Receipt entry deleted!');
        }
    };

    // --- CRUD Operations - Finance ---
    addFinanceEntryButton.addEventListener('click', () => {
        const date = financeDateInput.value; // Store as AD date string
        const description = financeDescriptionInput.value.trim();
        const amount = parseFloat(financeAmountInput.value.trim());
        const type = financeTypeSelect.value;

        if (date && description && !isNaN(amount) && type) {
            const newTransaction = {
                date,
                description,
                amount,
                type
            };
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
        financeDateInput.value = transaction.date; // Populate with AD date string
        financeDescriptionInput.value = transaction.description;
        financeAmountInput.value = transaction.amount;
        financeTypeSelect.value = transaction.type;
        financeEditIndexHidden.value = index;

        addFinanceEntryButton.style.display = 'none';
        updateFinanceEntryButton.style.display = 'inline-block';
        alert(`Editing finance transaction: ${transaction.description}`);
    };

    updateFinanceEntryButton.addEventListener('click', () => {
        const indexToUpdate = parseInt(financeEditIndexHidden.value);
        if (isNaN(indexToUpdate) || indexToUpdate < 0 || indexToUpdate >= financeTransactions.length) {
            alert('Error: No finance transaction selected for update.');
            return;
        }

        const date = financeDateInput.value; // Store as AD date string
        const description = financeDescriptionInput.value.trim();
        const amount = parseFloat(financeAmountInput.value.trim());
        const type = financeTypeSelect.value;

        if (date && description && !isNaN(amount) && type) {
            financeTransactions[indexToUpdate] = {
                date,
                description,
                amount,
                type
            };
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
            applyFilter(); // Re-apply filter to both tables
            clearFinanceForm();
            addFinanceEntryButton.style.display = 'inline-block';
            updateFinanceEntryButton.style.display = 'none';
            alert('Finance transaction deleted!');
        }
    };


    // --- Form Handling ---
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

    clearFormButton.addEventListener('click', clearReceiptForm);
    clearFinanceFormButton.addEventListener('click', clearFinanceForm);

    // --- Filter Functionality (Applies to both tables) ---
    const applyFilter = () => {
        const filterText = filterInput.value.toLowerCase();

        // Filter Receipts
        const filteredReceipts = receiptEntries.filter(entry =>
            Object.values(entry).some(value =>
                String(value).toLowerCase().includes(filterText)
            )
        );
        renderReceiptTable(filteredReceipts);

        // Filter Finance Transactions
        const filteredFinance = financeTransactions.filter(transaction =>
            Object.values(transaction).some(value =>
                String(value).toLowerCase().includes(filterText)
            )
        );
        renderFinanceTable(filteredFinance);
    };

    filterInput.addEventListener('keyup', applyFilter);

    clearFilterButton.addEventListener('click', () => {
        filterInput.value = '';
        renderReceiptTable(receiptEntries); // Show all receipts
        renderFinanceTable(financeTransactions); // Show all finance transactions
    });

    // --- Print Functionality ---
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


    // --- Dashboard Updates ---
    const updateTotalEntriesCount = () => {
        totalEntriesCountSpan.textContent = receiptEntries.length;
    };

    const updateTotalAmountSum = () => {
        const total = receiptEntries.reduce((sum, entry) => sum + (parseFloat(entry.amount) || 0), 0);
        totalAmountSumSpan.textContent = total.toFixed(2);
    };

    const calculateFinanceTotals = () => {
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

        if (netBalance < 0) {
            netBalanceSpan.style.color = 'red';
        } else if (netBalance > 0) {
            netBalanceSpan.style.color = 'green';
        } else {
            netBalanceSpan.style.color = '#555';
        }
    };

    // Central function to update all dashboard metrics
    const updateDashboardMetrics = () => {
        updateTotalEntriesCount();
        updateTotalAmountSum();
        calculateFinanceTotals();
    };

    // --- Navigation Functionality ---
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetAppId = button.dataset.target;

            // Remove active class from all buttons and hide all sections
            navButtons.forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.app-section').forEach(section => section.classList.remove('active-app'));

            // Add active class to clicked button and show target section
            button.classList.add('active');
            document.getElementById(targetAppId).classList.add('active-app');

            // Clear filter and re-render tables when switching apps
            filterInput.value = '';
            renderReceiptTable(receiptEntries);
            renderFinanceTable(financeTransactions);
        });
    });


    // --- Initializations on Load ---
    const initializeApp = () => {
        setTodayDate(receiptDateInput);
        setTodayDate(financeDateInput);
        loadCategories();
        loadReceiptEntries();
        loadFinanceTransactions();
        loadCompanyName();
        updateDateTime();
        setInterval(updateDateTime, 1000); // Update time every second

        // Set initial active application (Receipts by default)
        receiptsAppSection.classList.add('active-app');
        document.querySelector('.nav-button[data-target="receipts-app"]').classList.add('active');
    };

    initializeApp();

    // Event listeners for saving company name
    saveCompanyNameButton.addEventListener('click', saveCompanyName);
});
