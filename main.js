//1. first we need an empty array to store all the transaction details

let transactions=[]

//2. we need a variable to track the transaction that is currently edited. Initially it is set to null, because no transaction is edited at start.

let editingId=null;



//3. we need an object to define the categories for income and expense.These will use when we create or edit details

const categories={
    income:['Salary','Investments','Freelance','Other Income'],
    expense:['Food','Transport','Utilities','Entertainment','Shopping','Loan']
};

// // dom elements
// const transactionsList = document.getElementById('transactionsList');
// const transactionDetails = document.getElementById('transactionDetails')



//4. we need to write functions for when a webpage is loaded

window.onload=function(){
    // initially income chart is hide and expense chart is displayed
    document.getElementById('incomeChart').style.display='none';
    document.getElementById('expenseChart').style.display='block';

    // intially call the function for categories dropdown for income at popup

    updateCategoryOptions('income');

    // call the function for date selection
    setupDateListeners();
   

    //each time when we load the page the ui should be updated
    
    updateUI();

}


//5.needs to write the function for date selection ie, current or custom

function setupDateListeners(){

    // first we want to take all the date radio button named date type 
    const dateRadios=document.querySelectorAll('input[name="dateType"]');

    // we want to take the calender 

    const customDateInput=document.getElementById('customDate');

    // then check which input is user selected.
    // when current is selcted , the calender should be hidden. When custom is selected the calender should be visible

    dateRadios.forEach(radio=>{
        radio.addEventListener('change',(e)=>{
            customDateInput.classList.toggle('hidden',e.target.value=='current');
        });
    });
}



// first we take all radio button , and create an eventlistener for trigger when the user change the radio button.
// classlist.toggle will create a class hidden, ie, when the user choose current date, the calender should be hide. When it is custom it display the calender.




//6. we want to update summary cards each type when we add details amount

function updateSummaryCards(){
    
    //calculate income 
    const income = transactions.filter(t=>t.type ==='income').reduce((sum,t)=>sum+t.amount,0);
    // calculate expense
    const expense=transactions.filter(t=>t.type === 'expense').reduce((sum,t)=>sum+t.amount,0);
    // calculate balance= income-expense
    const balance = income - expense;

    // we need to display it with 2 decimal points
    document.getElementById('totalIncome').textContent = `$${income.toFixed(2)}`;
    document.getElementById('totalExpense').textContent = `$${expense.toFixed(2)}`;
    document.getElementById('totalBalance').textContent = `$${balance.toFixed(2)}`;

    // toFixed(2)=> to give two decimal points 
    // text content to change amount


}


//7. function to show homepage when click on home button and back button

function ShowHomePage(){
    document.getElementById('homePage').classList.remove('hidden');
    document.getElementById('reportPage').classList.add('hidden');
    
}

// 8. function to show report page when report button is clicked

function ShowReportPage(){
    document.getElementById('reportPage').classList.remove('hidden');
    document.getElementById('homePage').classList.add('hidden');


    // we want make thhe expense button and expense chart active initially

    // first remove currently active button and add expense as active when report page loaded

    document.querySelector('.report-type-btn active').classList.remove('active');
    const expenseButton=document.querySelector('.report-type-btn[data-type="expense"]');
    expenseButton.classList.add('active');  

    // then update charts based on the transaction added
    updateCharts();
    

}


// 9. function to update ui

function updateUI() {
    updateSummaryCards();
    updateTransactionsList();
    updateCharts();
}


// 9. function to update ui
 





function updateTransactionsList() {
    const list = document.getElementById('transactionsList');
    list.innerHTML = '';
    
    transactions.sort((a, b) => b.date - a.date).forEach(transaction => {
        const div = document.createElement('div');
        div.className = 'transaction-item';
       
        div.innerHTML = `

         <div onclick="showTransactionDetails(${transaction.id})">
           
                <strong>${transaction.category}</strong>
                <p>${transaction.description}</p>

                <!-- en-GB to convert date in the format dd-mnth-year -->
                <small>${transaction.date.toLocaleDateString('en-GB')}</small>
            </div>

             <div>
                  <span class=" ${transaction.type === 'income' ? 'text-success' : 'text-danger'}">
                    ${transaction.type === 'income' ? '+' : '-'}$${transaction.amount.toFixed(2)}
                  </span>


                   <!-- Edit and Delete buttons -->


                   <div class="transaction-actions">
                   <button class="edit-btn" onclick="editTransaction(${transaction.id})"> <i class="fas fa-edit"></i></button>
                   <button class="delete-btn"  onclick="deleteTransaction(${transaction.id})" class="text-red-500 hover:text-red-700"> <i class="fa-solid fa-trash" style="color: #f7f9fd;"></i></button>
                </div>

            
            </div>
        `;
        list.appendChild(div);
    });
}
    








// function to open modal****************************************************************************************************************

// initially id is set to null, to add new transaction. if any id is provided it the modal is used to edit the existing transaction
function openModal(id=null){

    // if any id is passed, that id is assigned to editingid to edit details. If id=null, editing id is also null that is it cleared to add new details
    editingId = id;
    // we want to make modal visible
    // retrive the modal by using id

    const modal= document.getElementById('transactionModal');
    modal.style.display='block';

  
   
    

    // we want to check an id is provided.If id is already given the modal is then edited mode. Then the resul

    if(id){

        // check that given id and id in the transactions are matching, if it matches, that stored into a variable
        const transaction = transactions.find(t=>t.id === id)

        if(transaction){
            // if id matches, we wants to pre-filled all details into form fields
            document.getElementById('amount').value = transaction.amount;
            document.getElementById('description').value = transaction.description;

            // call the selected type function to update button
            selectType(transaction.type);

            document.getElementById('category').value = transaction.category;

            // to determine date type
            const dateRadio = transaction.date ? 'custom' : 'current';

            // we want locate the radio button . make it selected, based on which date is already selected
            document.querySelector(`input[name="dateType"][value="${dateRadio}"]`).checked = true;

            // if it is custom date we want to show the calender with date

            if(dateRadio === 'custom'){

                // if it is custom, we want to convert that into iso format: (YYYY-MM-DDTHH:mm:ssZ). use toISOString()
                // then we want to cut last portion, only need date portion

               
                    document.getElementById('customDate').value = transaction.date.toISOString().split('T')[0];

                    // make the calender visible
                    document.getElementById('customDate').classList.remove('hidden');

            }

        }

        // if id is not provided, the modal is in new transaction mode

    }  else {
            // first want to clear all form inputs and sets to default state.
            document.getElementById('transactionForm').reset();

            // initially income button is active
            selectType('income');

            // hide calender initially
            document.getElementById('customDate').classList.add('hidden');
        }


}


// function to close modal*******************************

function closeModal(){
     // we want to make modal unvisible
    // retrive the modal by using id

    const modal= document.getElementById('transactionModal');
 
     modal.style.display='none';

    // set editid to null. ie, no id is currently editing.
    editingId=null;

    // resets all the form inputs
    document.getElementById('transactionForm').reset();

    // hide calender
    document.getElementById('customDate').classList.add('hidden');

    // we want to mae initially current button is active
    document.querySelector('input[name="dateType"][value="current"]').checked = true;

}


// function for submit details

function handleFormSubmit(event){
    // functiion to avoid default problems while form submission
    event.preventDefault();

    // the selected button is assign to a variable
    const type = document.querySelector('.type-btn.active').dataset.type;

    // .dataset.type: Accesses the data-type attribute of the selected button . ie, income or expense

    // take all the values that is enetered in the fields
    const amount = parseFloat(document.getElementById('amount').value);

    // the entered detail is in string format , we want to convert that into floating point number for operations

    const category = document.getElementById('category').value;

    const description = document.getElementById('description').value;

    const dateType = document.querySelector('input[name="dateType"]:checked').value;

    const customDate = document.getElementById('customDate').value;

    // if the date is current
    const date = dateType === 'current' ? new Date() : new Date(customDate);
    
    // new Date() generates the current date and time.
    // new Date(customDate) converts the user-entered customDate string into a Date object.

    // need to create a trasaction object to store the data

    const transaction = {
        // it taked editing id if it present, otherwise it creates a unique id using date.now()
        // then take all the values that entered
        id: editingId || Date.now(),
        type,
        amount,
        category,
        description,
        date

    };

    // after make edits, it checks that is present in the transaction object using its index number. If it present, it returns index
    //  update the edited details to that index position

    if (editingId) {
        const index = transactions.findIndex(t => t.id === editingId);
        transactions[index] = transaction;
    }
    else {
        transactions.push(transaction);
    }

    updateUI();
    
    closeModal()


}


function showTransactionDetails(id) {
    const transaction = transactions.find(t => t.id === id);
    const detailsDiv = document.getElementById('transactionDetails');

    if (transaction) {


        const capitalizedType = transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1);

        detailsDiv.querySelector('.details-content').innerHTML = `

         <div class="details-card">
            <h3>Transaction Details</h3>
            <div class="cross">
               <button onclick="closeDetails()" class="cross-btn"><i class="fa-solid fa-xmark"></i></button>
            </div>
        </div>

       
        <div class="space-y-4">
           <div>
            <p><strong>Type:</strong><span id="transactionType" class=" ${transaction.type === 'income'? 'text-success' : 'text-danger'}"> ${capitalizedType}</span></p>
         </div>

         <div>
                <p class="text-sm text-gray-600">Amount: $${transaction.amount.toFixed(2)}</p>
        </div>

         <div>
                <p class="text-sm text-gray-600">Category: ${transaction.category}</p>
        </div>

         <div>
                <p class="text-sm text-gray-600">Date: ${transaction.date.toLocaleDateString()}</p>
        </div>


         <div>
                <p class="text-sm text-gray-600">Description: ${transaction.description}</p>
        </div>

    </div>
        `;
    } else {
        closeDetails();
    }

    detailsDiv.style.display = 'block';
}



function closeDetails() {
    const detailsDiv = document.getElementById('transactionDetails');
    detailsDiv.querySelector('.details-content').innerHTML = "Select a transaction to view details";
}

// Transaction Functions
function deleteTransaction(id) {
    if (confirm('Are you sure you want to delete this transaction?')) {
        transactions = transactions.filter(t => t.id !== id);
        updateUI();
        closeDetails();
    }
}


function editTransaction(id) {
    openModal(id);
}


// function to select transaction type in modal
function selectType(type) {

    // retrive the button by using its id
    const buttons = document.querySelectorAll('.type-btn');

    buttons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.type === type);
    });

    // call function to update the category

    updateCategoryOptions(type);
}


function updateCategoryOptions(type) {
    const select = document.getElementById('category');
    select.innerHTML = '<option value="">Select Category</option>';
    categories[type].forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        select.appendChild(option);
    });
}



function toggleDateInput() {
    const customDate = document.getElementById('customDate');
    const dateType = document.querySelector('input[name="dateType"]:checked').value;
    customDate.classList.toggle('hidden', dateType === 'current');
}









// Chart Functions
function updateCharts() {
    updatePieChart('expense');
    updatePieChart('income');
}



function updatePieChart(type) {
    const chartElement = document.getElementById(`${type}Chart`);
    const ctx = chartElement.getContext('2d');

    const data = transactions.filter(t => t.type === type);
    const categoryTotals = {};

    data.forEach(t => {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });

    // Destroy the existing chart if it exists
    if (chartElement.chart) {
        chartElement.chart.destroy();
    }

    // Create a new chart to trigger animation
    chartElement.chart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(categoryTotals),
            datasets: [{
                data: Object.values(categoryTotals),
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF'
                ]
            }]
        },
        options: {
            responsive: true,
            animation: {
                animateRotate: true, // Animate the rotation of the chart
                animateScale: true   // Animate the scaling of the chart
            },
            plugins: {
                title: {
                    display: true,
                    text: `${type.charAt(0).toUpperCase() + type.slice(1)} Distribution`
                }
            }
        }
    });
}

function showChart(type) {
    // Remove active class from all buttons and add to the clicked button
    const buttons = document.querySelectorAll('.report-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    // Re-render the chart to trigger animation
    if (type === 'expense') {
        document.getElementById('incomeChart').style.display = 'none';
        updatePieChart('expense'); // Recreate the Expense chart
        document.getElementById('expenseChart').style.display = 'block';
    } else if (type === 'income') {
        document.getElementById('expenseChart').style.display = 'none';
        updatePieChart('income'); // Recreate the Income chart
        document.getElementById('incomeChart').style.display = 'block';
    }
}

// function to logout
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        transactions = [];
        updateUI();
    }
}
