document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
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
    const filterInput = document.getElementById('filterInput');
    const clearFilterButton = document.getElementById('clearFilter');
    const printDataButton = document.getElementById('printData');
    const editIndexHidden = document.getElementById('editIndex'); // Hidden field for current edit index
    const companyNameInput = document.getElementById('companyName');
    const saveCompanyNameButton = document.getElementById('saveCompanyName');
    const currentDateSpan = document.getElementById('currentDate');
    const currentTimeSpan = document.getElementById('currentTime');
    const totalEntriesCountSpan = document.getElementById('totalEntriesCount');
    const totalAmountSumSpan = document.getElementById('totalAmountSum'); // New element for total amount

    // --- Data Storage ---
    let entries = [];
    let categories = ['Tuition', 'Books', 'Fees', 'Supplies', 'Other'];
    let companyName = "Your Company Name"; // Default company name

    // --- Utility Functions ---

    // Sets today's date as default for the date input
    const setTodayDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const day = String(today.getDate()).padStart(2, '0');
        receiptDateInput.value = `${year}-${month}-${day}`;
    };

    // Updates the dashboard date and time
    const updateDateTime = () => {
        const now = new Date();
        currentDateSpan.textContent = now.toLocaleDateString('en-US', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        });
        currentTimeSpan.textContent = now.toLocaleTimeString('en-US', {
            hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
        });
    };

    // --- Local Storage Management ---
    const saveEntries = () => {
        localStorage.setItem('receiptEntries', JSON.stringify(entries));
        updateDashboardMetrics(); // Update all dashboard metrics after saving
    };

    const loadEntries = () => {
        const storedEntries = localStorage.getItem('receiptEntries');
        if (storedEntries) {
            entries = JSON.parse(storedEntries);
        }
        renderTable(entries); // Always render all entries on load
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
        categorySelect.innerHTML = '<option value="">-- Select Category --</option>'; // Clear existing
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
            categories.sort(); // Keep categories sorted alphabetically
            saveCategories();
            populateCategorySelect();
            categorySelect.value = newCat; // Select the newly added category
            newCategoryInput.value = '';
        } else if (newCat && categories.includes(newCat)) {
            alert('Category already exists!');
        } else {
            alert('Please enter a category name.');
        }
    });

    // --- Table Rendering and Actions ---
    const renderTable = (dataToRender) => {
        receiptTableBody.innerHTML = ''; // Clear existing rows
        if (dataToRender.length === 0 && filterInput.value === '') {
            const noDataRow = receiptTableBody.insertRow();
            const cell = noDataRow.insertCell();
            cell.colSpan = 7; // Span across all columns
            cell.textContent = "No entries yet. Add one above!";
            cell.style.textAlign = 'center';
            cell.style.fontStyle = 'italic';
            cell.style.padding = '20px';
        }

        dataToRender.forEach((entry, index) => {
            const row = receiptTableBody.insertRow();
            row.insertCell().textContent = entry.date;
            row.insertCell().textContent = entry.receiptNo;
            row.insertCell().textContent = parseFloat(entry.amount).toFixed(2); // Format amount
            row.insertCell().textContent = entry.name;
            row.insertCell().textContent = entry.class;
            row.insertCell().textContent = entry.category;

            const actionsCell = row.insertCell();
            actionsCell.classList.add('action-buttons');

            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.classList.add('edit-btn');
            editButton.addEventListener('click', () => {
                editEntry(entry, index);
            });
            actionsCell.appendChild(editButton);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('delete-btn');
            deleteButton.addEventListener('click', () => {
                // Pass the original index from the 'entries' array
                // The current index in 'dataToRender' might be different due to filtering
                const originalIndex = entries.findIndex(e =>
                    e.receiptNo === entry.receiptNo &&
                    e.amount === entry.amount &&
                    e.name === entry.name &&
                    e.class === entry.class &&
                    e.category === entry.category &&
                    e.date === entry.date
                );
                if (originalIndex !== -1) {
                    deleteEntry(originalIndex);
                }
            });
            actionsCell.appendChild(deleteButton);
        });
        updateDashboardMetrics(); // Update all dashboard metrics after rendering table
    };

    // --- CRUD Operations ---
    addEntryButton.addEventListener('click', () => {
        const date = receiptDateInput.value;
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
            entries.push(newEntry);
            saveEntries();
            renderTable(entries);
            clearForm();
            alert('Entry added successfully!');
        } else {
            alert('Please fill in all fields correctly (Amount must be a number, Category must be selected).');
        }
    });

    const editEntry = (entry, index) => {
        receiptDateInput.value = entry.date;
        receiptNoInput.value = entry.receiptNo;
        amountInput.value = entry.amount;
        nameInput.value = entry.name;
        classInput.value = entry.class;
        categorySelect.value = entry.category;
        editIndexHidden.value = index; // Store the index of the entry being edited

        addEntryButton.style.display = 'none';
        updateEntryButton.style.display = 'inline-block';
        alert(`Editing entry for ${entry.name} (Receipt No: ${entry.receiptNo})`);
    };

    updateEntryButton.addEventListener('click', () => {
        const indexToUpdate = parseInt(editIndexHidden.value);
        if (isNaN(indexToUpdate) || indexToUpdate < 0 || indexToUpdate >= entries.length) {
            alert('Error: No entry selected for update.');
            return;
        }

        const date = receiptDateInput.value;
        const receiptNo = receiptNoInput.value.trim();
        const amount = parseFloat(amountInput.value.trim());
        const name = nameInput.value.trim();
        const classVal = classInput.value.trim();
        const category = categorySelect.value;

        if (date && receiptNo && !isNaN(amount) && name && classVal && category) {
            entries[indexToUpdate] = {
                date,
                receiptNo,
                amount,
                name,
                class: classVal,
                category
            };
            saveEntries();
            renderTable(entries); // Re-render the table with updated data
            clearForm();
            addEntryButton.style.display = 'inline-block';
            updateEntryButton.style.display = 'none';
            alert('Entry updated successfully!');
        } else {
            alert('Please fill in all fields correctly for update.');
        }
    });

    const deleteEntry = (indexToDelete) => {
        if (confirm('Are you sure you want to delete this entry?')) {
            entries.splice(indexToDelete, 1); // Remove 1 element at indexToDelete
            saveEntries();
            // Re-apply current filter after deletion, or show all if no filter
            applyFilter();
            clearForm(); // Clear form just in case deleted entry was being edited
            addEntryButton.style.display = 'inline-block';
            updateEntryButton.style.display = 'none';
            alert('Entry deleted!');
        }
    };

    // --- Form Handling ---
    const clearForm = () => {
        setTodayDate(); // Reset date to today
        receiptNoInput.value = '';
        amountInput.value = '';
        nameInput.value = '';
        classInput.value = '';
        categorySelect.value = ''; // Reset select
        editIndexHidden.value = ''; // Clear hidden index
        addEntryButton.style.display = 'inline-block';
        updateEntryButton.style.display = 'none';
    };

    clearFormButton.addEventListener('click', clearForm);

    // --- Filter Functionality ---
    const applyFilter = () => {
        const filterText = filterInput.value.toLowerCase();
        const filteredEntries = entries.filter(entry =>
            Object.values(entry).some(value =>
                String(value).toLowerCase().includes(filterText)
            )
        );
        renderTable(filteredEntries);
    };

    filterInput.addEventListener('keyup', applyFilter);

    clearFilterButton.addEventListener('click', () => {
        filterInput.value = '';
        renderTable(entries); // Show all entries
    });

    // --- Print Functionality ---
    printDataButton.addEventListener('click', () => {
        const tableToPrint = document.getElementById('receiptTable');
        const printWindow = window.open('', '', 'height=600,width=800');
        printWindow.document.write('<html><head><title>Receipt Data</title>');
        printWindow.document.write('<style>');
        printWindow.document.write('body { font-family: Arial, sans-serif; margin: 20px; }');
        printWindow.document.write('.print-company-title { text-align: center; font-size: 1.8em; font-weight: bold; margin-bottom: 25px; color: #333; }');
        printWindow.document.write('h2 { text-align: center; margin-bottom: 15px; color: #555; }');
        printWindow.document.write('table { width: 100%; border-collapse: collapse; margin-top: 20px; }');
        printWindow.document.write('table th, table td { border: 1px solid #ccc; padding: 10px; text-align: left; }');
        printWindow.document.write('table th { background-color: #f0f0f0; }');
        printWindow.document.write('</style>');
        printWindow.document.write('</head><body>');

        // Add company name title if available
        if (companyName) {
            printWindow.document.write(`<div class="print-company-title">${companyName}</div>`);
        }
        printWindow.document.write('<h2>Receipt Entries Report</h2>');
        printWindow.document.write(tableToPrint.outerHTML); // Get the entire table HTML
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
    });

    // --- Dashboard Updates ---
    const updateTotalEntriesCount = () => {
        totalEntriesCountSpan.textContent = entries.length;
    };

    const updateTotalAmountSum = () => {
        const total = entries.reduce((sum, entry) => sum + (parseFloat(entry.amount) || 0), 0);
        totalAmountSumSpan.textContent = total.toFixed(2); // Format to 2 decimal places
    };

    // Central function to update all dashboard metrics
    const updateDashboardMetrics = () => {
        updateTotalEntriesCount();
        updateTotalAmountSum();
    };

    // --- Initializations on Load ---
    const initializeApp = () => {
        setTodayDate();
        loadCategories();
        loadEntries(); // This will also call renderTable and consequently updateDashboardMetrics
        loadCompanyName();
        updateDateTime();
        setInterval(updateDateTime, 1000); // Update time every second
    };

    initializeApp();

    // Event listener for saving company name
    saveCompanyNameButton.addEventListener('click', saveCompanyName);
});
