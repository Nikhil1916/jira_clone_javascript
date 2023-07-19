// pink --> highest priority
// black --> lowest priority

const addBtn = document.querySelector(".add-btn");
const modal = document.querySelector('.todo');
const textArea = document.querySelector('.writing-area');
let isModalPresent = false;
const colors = ['lightpink', 'lightgreen', 'lightblue', 'black'];
let modalPriorityColor = colors[colors.length - 1];
// console.log(modal)
const mainCont = document.querySelector('.main-cont');
addBtn.addEventListener('click', function (e) {
  console.log(e);
  // toggle modal display
  if (isModalPresent) {
    modal.style.display = 'none'
  } else {
    modal.style.display = 'flex'
  }
  isModalPresent = !isModalPresent;
})



// hovering on navbar priorities

const modalWritePart = document.querySelector('.writing-area');
modalWritePart.addEventListener('keydown', function (e) {
  // console.log(e);
  if (e.key == 'Shift') {
    //create ticket
    //toggle display and hide model
    createTicket(modalPriorityColor, 1, textArea.value);
    modal.style.display = 'none';
    isModalPresent = false;
    textArea.value = ''
  }
})

function createTicket(ticketColor, id, text) {
  let ticketContainer = document.createElement('div');
  ticketContainer.setAttribute('class', 'ticket-cont');
  ticketContainer.innerHTML = `
  <div class='ticket-color ${ticketColor}'></div>
  <div class='ticket-id'>${id}</div>
  <div class='task-area'>${text}</div>
  <div class='ticket-lock'>
  <i class="fa-solid fa-lock"></i></div>
  `

  mainCont.appendChild(ticketContainer);
}
