var uid = new ShortUniqueId();
// pink --> highest priority
// black --> lowest priority

const addBtn = document.querySelector(".add-btn");
const modal = document.querySelector('.todo');
const textArea = document.querySelector('.writing-area');
let isModalPresent = false;
const colors = ['lightpink', 'lightgreen', 'lightblue', 'black'];
let modalPriorityColor = colors[colors.length - 1];
const mainCont = document.querySelector('.main-cont');
const allPriorityColors = document.querySelectorAll('.priority-color');
const priorityGetter = document.querySelectorAll('#priorities>*');
let ticketArr = [];
let isRemoveBtnActive = false;
const removeBtn = document.querySelector('.remove-btn');

addBtn.addEventListener('click', function (e) {
  // toggle modal display
  if (isModalPresent) {
    modal.style.display = 'none'
  } else {
    modal.style.display = 'flex'
  }
  isModalPresent = !isModalPresent;
})

const modalWritePart = document.querySelector('.writing-area');
modalWritePart.addEventListener('keydown', function (e) {
  if (e.key == 'Shift') {
    //create ticket
    //toggle display and hide model
    createTicket(modalPriorityColor, '#' + uid(), textArea.value, true);
    modal.style.display = 'none';
    isModalPresent = false;
    textArea.value = ''
    modalPriorityColor = 'black';

    // removing active class from all colors
    allPriorityColors.forEach(color_el => {
      color_el.classList.remove('active');
    })
    allPriorityColors[allPriorityColors.length - 1].classList.add('active');
  }
})

function createTicket(ticketColor, id, text, isNewTicket) {
  let ticketContainer = document.createElement('div');
  ticketContainer.setAttribute('class', 'ticket-cont');
  ticketContainer.innerHTML = ` 
  <div class='ticket-color ${ticketColor}'></div>
  <div class='ticket-id'>${id}</div>
  <div class='task-area'>${text}</div>
  <div class='ticket-lock'>
  <i class="fa-solid fa-lock"></i></div>
  `;
  mainCont.appendChild(ticketContainer);

  // add ticket in local storage when ticket is being created for first time
  if (localStorage.getItem('tickets') == null) {
    localStorage.setItem('tickets', JSON.stringify([]));
  }
  // const arr = JSON.parse(localStorage.getItem('tickets'));
  // if (arr.find((ticket) => ticket.id == id)) {
  //   return;
  // }
  handleRemoval(ticketContainer, id);
  if (!isNewTicket) {
    return;
  }
  ticketArr.push({
    color: ticketColor,
    id,
    text
  })
  localStorage.setItem('tickets', JSON.stringify(ticketArr));

}


allPriorityColors.forEach(color_el => {
  color_el.addEventListener('click', (el) => {
    allPriorityColors.forEach((el) => {
      el.classList.remove('active');
    })
    color_el.classList.add('active');
    modalPriorityColor = color_el.classList[0];
  })
})


// getting tickets on basis of ticket color
priorityGetter.forEach((priority_color) => {

  // on single click show only that particular priority color
  priority_color.addEventListener('click', function (e) {
    // first remove all the tickets from dom
    const allTickets = document.querySelectorAll(".main-cont>*");
    allTickets.forEach((ticket) => ticket.remove());
    const currColor = priority_color.classList[0];
    let filteredArr = ticketArr?.filter((ticket) => ticket.color == currColor);
    filteredArr.forEach(ticket => createTicket(ticket.color, ticket.id, ticket.text))
  })

  // on double click show all the tickets
  priority_color.addEventListener('dblclick', function () {
    // remove tickets from ui first 
    const allTickets = document.querySelectorAll(".main-cont>*");
    allTickets.forEach((ticket) => ticket.remove());
    ticketArr.forEach((ticket) => createTicket(ticket.color, ticket.id, ticket.text));
  })
})


// getting all data from local storage for re rendering of tickets
if (localStorage.getItem('tickets')) {
  ticketArr = JSON.parse(localStorage.getItem('tickets'));
  ticketArr.forEach((ticket) => createTicket(ticket.color, ticket.id, ticket.text));
}



removeBtn.addEventListener('click', function () {
  // if remove btn is not active then make it active
  const remove_icon = document.querySelector('.fa-xmark');
  if (!isRemoveBtnActive) {
    remove_icon.classList.add('red')
  } else {
    // make it inactive
    remove_icon.classList.remove('red');
  }
  isRemoveBtnActive = !isRemoveBtnActive;
})

function handleRemoval(ticketCont, id) {
  ticketCont.addEventListener('click', function () {
    if (!isRemoveBtnActive) return;
    const idx = ticketArr.findIndex((ticket) => ticket.id == id);
    ticketArr.splice(idx, 1);
    localStorage.setItem('tickets', JSON.stringify(ticketArr));
    ticketCont.remove();
  })
}

