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
  handlePriorityColor(ticketContainer, id);
  handleLock(ticketContainer, id);
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
    const idx = getTicketIdx(id);
    ticketArr.splice(idx, 1);
    localStorage.setItem('tickets', JSON.stringify(ticketArr));
    ticketCont.remove();
  })
}

//retuns the index of ticket present in ticketsArr
function getTicketIdx(id) {
  let idx = ticketArr.findIndex(ticketObj => {
    return ticketObj.id == id
  })
  return idx;
}

function handlePriorityColor(ticketCont, id) {
  let ticketColor = ticketCont.querySelector(".ticket-color");

  //add evenyt listener of type click on  ticketColor
  ticketColor.addEventListener("click", function () {
    let currTicketColor = ticketColor.classList[1]; //lightpink
    let currTicketColorIdx = colors.indexOf(currTicketColor); //0
    let newTicketColorIdx = (currTicketColorIdx + 1) % colors.length; //1
    let newTicketColor = colors[newTicketColorIdx]; //lightgreen
    ticketColor.classList.remove(currTicketColor); //lightpink class removed
    ticketColor.classList.add(newTicketColor); //lightgreen class added

    //update local storage
    let idx = getTicketIdx(id);
    //update the newticketcolor in ticketArr
    ticketArr[idx].color = newTicketColor;
    //set in local storage
    localStorage.setItem("tickets", JSON.stringify(ticketArr));
  });
}


const unlock = "fa-lock-open";
const lock = "fa-lock"
function handleLock(ticketCont, id) {
  const ticketLock = ticketCont.querySelector(".ticket-lock");
  let ticketTaskArea = ticketCont.querySelector(".task-area");
  ticketLock.addEventListener('click', function () {
    if (ticketLock.children[0].classList.contains(lock)) {
      ticketLock.children[0].classList.remove(lock);
      ticketLock.children[0].classList.add(unlock);

      // make content editable
      ticketTaskArea.setAttribute("contenteditable", true);
    } else {
      ticketLock.children[0].classList.remove(unlock);
      ticketLock.children[0].classList.add(lock);

      // make content non-editable
      ticketTaskArea.setAttribute("contenteditable", false);

      let idx = getTicketIdx(id);
      ticketArr[idx].text = ticketTaskArea.textContent;
      localStorage.setItem('tickets', JSON.stringify(ticketArr));
    }
  })

}

priorityGetter.forEach((priority_color) => {
  priority_color.addEventListener('mouseover', () => {
    priorityGetter.forEach((priority_color) => {
      priority_color.classList.remove('active');
    })
    priority_color.classList.add('active');
  })
})

