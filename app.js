// Capturing DOM Elements

const modal = document.getElementById('modal')
const description = document.querySelector('#description')
const amount = document.getElementById('amount')
const addButton = document.getElementById('add')
const cancelButton = document.getElementById('cancel')
const tbody = document.querySelector('.tbody')
const addIncome = document.querySelector('.add-income')
const addExpense = document.querySelector('.add-expense')
const closeButton = document.querySelector('.close')
const incomeButton = document.getElementById('income')
const expenseButton = document.getElementById('expense')
const allButton = document.getElementById('all')
const table = document.querySelector('table')
const totalIncome = document.getElementById('total-income')
const totalExpense = document.getElementById('total-expense')
const netBalance = document.getElementById('net-balance')

// Variable declaration
let filteredData
let type = 'Income'
let data = []

// Render UI based on user entered "data" captured in getData() and also works to filter UI by all, income or expense
const renderData = (filter = '') => {
  modal.style.display = 'none'

  if (allButton.checked) {
    tbody.innerHTML = ''
    data.map((d) => {
      return (tbody.innerHTML += `
             <tr id=${d.id}>
             <td class='border border-slate-300'>${d.description}</td>
             <td class='border border-slate-300'>${d.amount}</td>
             <td class='border border-slate-300'>${d.type}</td>
             <td class='border border-slate-300'> 
             <i onclick="editHandler(this)" class="fa-regular fa-pen-to-square" id="edit"></i>
             <i onclick="deleteHandler(this)" class="fa-sharp-duotone fa-solid fa-trash" id="delete"></i>
             </td>
             </tr>
            `)
    })
  } else {
    tbody.innerHTML = ''
    let filtered_data = data.filter((d) => {
      return d.type.toLowerCase() === filter.toLowerCase()
    })

    filtered_data.map((dm) => {
      return (tbody.innerHTML += `
          <tr id=${dm.id}>
             <td class='border border-slate-300'>${dm.description}</td>
             <td class='border border-slate-300'>${dm.amount}</td>
             <td class='border border-slate-300'>${dm.type}</td>
             <td class='border border-slate-300'> 
                <i onclick="editHandler(this)" class="fa-regular fa-pen-to-square" id="edit"></i>
                <i onclick="deleteHandler(this)" class="fa-sharp-duotone fa-solid fa-trash" id="delete"></i>
             </td>
          </tr>
            `)
    })
  }
}

//Persists data on page reload, sets data array from local storage if values exists, else set to empty array []
//Calculates total income, expense and net balance and render it in UI
;(() => {
  data = JSON.parse(localStorage.getItem('data')) || []
  if (data.length === 0) {
    table.style.display = 'none'
  }
  let inc_temp = data.filter((d) => d.type.toLowerCase() == 'income')
  let income = inc_temp.reduce((acc, cur) => acc + parseInt(cur.amount), 0)
  let exp_temp = data.filter((d) => d.type.toLowerCase() == 'expense')
  let expense = exp_temp.reduce((acc, cur) => acc + parseInt(cur.amount), 0)
  let balance = income - expense
  totalIncome.innerText = `Total Income: ${income} |`
  totalExpense.innerText = `Total Expense: ${expense} |`
  netBalance.innerText = `Net Balance: ${balance}`

  renderData()
})()

// Resets form on adding additional income/ expense details
const resetForm = () => {
  description.value = ''
  amount.value = ''
}

//gets filter input and works in renderData() method
const filterData = (e) => {
  let filter = e.target.defaultValue
  renderData(filter)
}

// gets user data, adds new id as date also updates type based on the clicks on add expense/ income button
const getData = (e = '') => {
  window.location.reload()
  let desc =
    description.value.charAt(0).toUpperCase() + description.value.slice(1)
  data.push({
    description: desc,
    amount: amount.value,
    id: new Date(),
    type: type,
  })
  localStorage.setItem('data', JSON.stringify(data))
  renderData()
}

// Deletes entries when delete action button is clicked
const deleteHandler = (e) => {
  let editId = e.parentElement.parentElement.getAttribute('id')
  let editFilter = data.filter((d) => d.id !== editId)
  data = editFilter
  localStorage.setItem('data', JSON.stringify(data))
  window.location.reload()
}

// Load data in input fields based on entry that is selected, removed older data and adds newer data
const editHandler = (e) => {
  modal.style.display = 'block'
  let editId = e.parentElement.parentElement.getAttribute('id')
  data.map((d) => {
    if (d.id == editId) {
      description.value = d.description
      amount.value = d.amount
      type = d.type
    }
  })
  let editFilter = data.filter((d) => d.id !== editId)
  data = editFilter
  localStorage.setItem('data', JSON.stringify(data))
}

// Event Handlers

incomeButton.addEventListener('click', filterData)
expenseButton.addEventListener('click', filterData)
allButton.addEventListener('click', filterData)
closeButton.addEventListener('click', () => (modal.style.display = 'none'))
addButton.addEventListener('click', getData)
cancelButton.addEventListener('click', () => (modal.style.display = 'none'))

addIncome.addEventListener('click', () => {
  modal.style.display = 'block'
  type = 'Income'
  resetForm()
})

addExpense.addEventListener('click', () => {
  modal.style.display = 'block'
  type = 'Expense'
  resetForm()
})

window.addEventListener('click', (event) => {
  if (event.target.id == 'modal') {
    modal.style.display = 'none'
  }
})

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    modal.style.display = 'none'
  }
})
