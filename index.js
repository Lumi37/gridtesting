const webSocket = new WebSocket('ws://localhost:3001');
// const textfieldName = document.querySelector('#username')
const saveButton = document.querySelector("#saveButton")
// // const textfieldMessage = document.querySelector('#typingArea')
//  const chat = document.querySelector("#chat")
 const content = document.querySelector('#messagesDisplay')
// const sendButton = document.querySelector("#paperAirplane")
// const list = document.querySelector('#list')
// const refreshButton = document.querySelector('#refreshList')
// const editNameButton = document.querySelector('#editname')
// const uploadButton = document.querySelector('#uploadButton')
// const storageID = localStorage.getItem('ClientID')
//const hiddenIDfield = document.querySelector('#userID')
saveButton.addEventListener('click',e=>{
    content.innerHTML+= `            <p id="otherUser">otherUser</p>
    <p id="mainUser">mainUser</p>`
})