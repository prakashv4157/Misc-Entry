document.addEventListener('DOMContentLoaded', () => {
    const receiptNoInput = document.getElementById('receiptNo');
    const amountInput = document.getElementById('amount');
    const nameInput = document.getElementById('name');
    const classInput = document.getElementById('class');
    const categoryInput = document.getElementById('category');
    const addEntryButton = document.getElementById('addEntry');
    const receiptTableBody = document.querySelector('#receiptTable tbody');
    const filterInput = document.getElementById('filterInput');
    const clearFilterButton = document.getElementById('clearFilter');
    const printDataButton = document.getElementById('printData');

    let entries = [];

    // --- Local Storage Functions ---
    const saveEntries = () => {
        localStorage.setItem('receiptEntries', JSON.stringify(entries));
    };

    const loadEntries = () => {
        const storedEntries = localStorage.getItem('receiptEntries');
        if (storedEntries) {
            entries = JSON.parse(storedEntries);
            renderTable(entries); // Render all entries on load
        }
    };

    // --- Render Table Function ---
    const renderTable = (dataToRender) => {
        receiptTableBody.innerHTML = ''; // Clear existing rows
        dataToRender.forEach((entry, index) => {
            const row = receiptTableBody.insertRow();
            row.insertCell().textContent = entry.receiptNo;
            row.insertCell().textContent = parseFloat(entry.amount).toFixed(2); // Format amount
            row.insertCell().textContent = entry.name;
            row.insertCell().textContent = entry.class;
            row.insertCell().textContent = entry.category;

            const actionsCell = row.insertCell();
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('delete-btn');
            deleteButton.addEventListener('click', () => {
                deleteEntry(index);
            });
            actionsCell.appendChild(deleteButton);
        });
    };

    // --- Add Entry Function ---
    addEntryButton.addEventListener('click', () => {
        const receiptNo = receiptNoInput.value.trim();
        const amount = parseFloat(amountInput.value.trim()); // Convert to number
        const name = nameInput.value.trim();
        const classVal = classInput.value.trim(); // Renamed to avoid conflict with JS 'class' keyword
        const category = categoryInput.value.trim();

        if (receiptNo && !isNaN(amount) && name && classVal && category) {
            const newEntry = {
                receiptNo,
                amount,
                name,
                class: classVal, // Use the renamed variable here
                category
            };
            entries.push(newEntry);
            saveEntries();
            renderTable(entries); // Render with new entry
            clearForm();
        } else {
            alert('Please fill in all fields correctly (Amount must be a number).');
        }
    });

    // --- Delete Entry Function ---
    const deleteEntry = (indexToDelete) => {
        // Filter out the entry at the given index
        entries = entries.filter((_, index) => index !== indexToDelete);
        saveEntries();
        renderTable(entries);
        // After deletion, re-apply the current filter if any
        applyFilter();
    };


    // --- Filter Function ---
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

    // --- Print Function ---
    printDataButton.addEventListener('click', () => {
        const tableToPrint = document.getElementById('receiptTable');
        const printWindow = window.open('', '', 'height=600,width=800');
        printWindow.document.write('<html><head><title>Receipt Data</title>');
        printWindow.document.write('<style>');
        printWindow.document.write('body { font-family: Arial, sans-serif; }');
        printWindow.document.write('table { width: 100%; border-collapse: collapse; margin-top: 20px; }');
        printWindow.document.write('table th, table td { border: 1px solid #ddd; padding: 8px; text-align: left; }');
        printWindow.document.write('table th { background-color: #f2f2f2; }');
        printWindow.document.write('</style>');
        printWindow.document.write('</head><body>');
        printWindow.document.write('<h2>Receipt Entries</h2>');
        printWindow.document.write(tableToPrint.outerHTML); // Get the entire table HTML
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
    });

    // --- Clear Form Function ---
    const clearForm = () => {
        receiptNoInput.value = '';
        amountInput.value = '';
        nameInput.value = '';
        classInput.value = '';
        categoryInput.value = '';
    };

    // Initial load of entries when the page loads
    loadEntries();
});
