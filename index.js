const webSocket = new WebSocket('ws://localhost:3001');
const textfieldName = document.querySelector('#username')
const saveNameButton = document.querySelector("#saveButton")
const textfieldMessage = document.querySelector('#typingArea')
const chat = document.querySelector('#messagesDisplay')
const list = document.querySelector('#list')
const refreshButton = document.querySelector('#refreshList')
const editNameButton = document.querySelector('#editName')
const uploadButton = document.querySelector('#uploadButton')
const storageID = localStorage.getItem('ClientID')
//const hiddenIDfield = document.querySelector('#userID')
// const sendButton = document.querySelector("#paperAirplane")
saveButton.addEventListener('click',e=>{
    chat.innerHTML+= `            <p id="otherUser">otherUserotherUserotherUserotherUserotherUserotherUserotherUserotherUserotherUserotherUserotherUserotherUserotherUserotherUserotherUserotherUserotherUserotherUserotherUser</p>
    <p id="mainUser">mainUser</p>`
})

chat.addEventListener('scroll', e=>{
    console.log(`scrollTop: ${chat.scrollTop}`)
})


//SENDING INFO FROM LOCALSTORAGE
webSocket.addEventListener("open", () => { sendInfoFromLocalStorage() })

//SAVING NAME, SENDING TO SERVER
saveNameButton.addEventListener('click', e => { sendSaveName() })

//EDIT NAME
editNameButton.addEventListener('click', e => { nameEdit() })

// SENDING MESSAGE TO SERVER
// sendButton.addEventListener("click", e => { sendMessageToServer() })

textfieldMessage.addEventListener('keypress', e => {
    const key = e.key
    if (key == 'Enter') {
        sendMessageToServer()
    }
})


//REFRESH LIST REQ
refreshButton.addEventListener('click', e => { refreshList() })


//RECEIVING MESSAGE FROM SERVER
webSocket.addEventListener("message", (e) => { 
    let data = JSON.parse(e.data)
    choiceBy(MessageType(data.type), data)
 })




 //FUNCTIONS 

function MessageType(type) {
    switch (type) {
        case 'message':
            return 'message'
        case 'list':
            return 'list'
        case 'history':
            return 'history'
        default:
            console.log('unknown error')
    }
}


function handleIfMessage(messageInfo) {
    if (messageInfo.name == textfieldName.value && messageInfo.id == localStorage.getItem('ClientID')) {
        let message = (`<p class="user">${messageInfo.date} ${messageInfo.name}: ${messageInfo.text}</p><br>`)
        chat.innerHTML += message

    }
    else {
        let message = `<p class="otheruser">${messageInfo.date} ${messageInfo.name}: ${messageInfo.text}</p><br>`
        chat.innerHTML += message
    }

}




function sendMessageToServer() {
    let ChatText = textfieldMessage.value;
    let userName = textfieldName.value;
    let storeID = localStorage.getItem('ClientID')
    textfieldMessage.value = ''
    let messageToServer = { text: ChatText, name: userName, type: 'message', id: storeID }
    if (ChatText != '')
        webSocket.send(JSON.stringify(messageToServer))
}


function sendSaveName() {
    if (!textfieldName.value == '') {
        submitFileButton.disabled = false
        saveNameButton.disabled = true
        textfieldMessage.disabled = false
        sendButton.disabled = false
        editname.disabled = false
        window.localStorage.setItem('name', textfieldName.value)
        if (noEdit)
            window.localStorage.setItem('ClientID', clientUniqueIDGenerator())
        let storeID = localStorage.getItem('ClientID')
        let name = textfieldName.value
        let messageToServer = { text: name, type: 'name', id: storeID }
        webSocket.send(JSON.stringify(messageToServer))
        document.querySelector("#hello").textContent = 'Hello ' + textfieldName.value
    }
}

function nameEdit() {
    saveNameButton.disabled = false
    editname.disabled = false
    noEdit == false

}


function handleIfList(listItem) {

    list.innerHTML = ''
    let userList = listItem.list
    console.log(userList)
    userList.forEach(elem => {
        if (elem.status === 'online')
            list.innerHTML += `<li class="listItemsContainer"><div id="imgContainerList"><img src="images/dude.jpg" id="listUserIcon" alt="">
            <div id="onlinestatus"></div></div><div><div id="userListName">elem.name</div><div id="userLastMessage">kapapapapap</div></div>
            <div id="dateContainer"><div id="lastOnline">48h</div></div></li>`

        if (elem.status === 'offline')
            list.innerHTML += `<li class="listItemsContainer"><div id="imgContainerList"><img src="images/dude.jpg" id="listUserIcon" alt="">
            <div id="offlinestatus"></div></div><div><div id="userListName">elem.name</div><div id="userLastMessage">kapapapapap</div></div>
            <div id="dateContainer"><div id="lastOnline">48h</div></div></li>`
    })
}


function handleIfHistory(messageInfo) {
    if (messageInfo.name == textfieldName.value && messageInfo.id == localStorage.getItem('ClientID')) {
        let message = (`<p class="user">${messageInfo.date} ${messageInfo.name}: ${messageInfo.text}</p><br>`)
        chat.innerHTML += message

    }
    else {
        let message = `<p class="otheruser">${messageInfo.date} ${messageInfo.name}: ${messageInfo.text}</p><br>`
        chat.innerHTML += message
    }

}


function refreshList() {
    list.innerHTML = ''
    webSocket.send(JSON.stringify({ type: 'list' }))
}


//GENERATES RANDOM ID
function clientUniqueIDGenerator() {
    let datenow = new Date()
    function idGen() {

        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return idGen() + idGen() + '-' + idGen() + String(datenow.getMilliseconds())
}


//SENDING USER INFO FROM LOCALSTORAGE
function sendInfoFromLocalStorage() {
    if (!(localStorage.getItem('ClientID')))
        window.localStorage.setItem('ClientID', clientUniqueIDGenerator()) //REGISTER ID TO STORAGE
    else {
        submitFileButton.disabled = false
        saveNameButton.disabled = true
        editNameButton.disabled = false
        sendButton.disabled = false
        textfieldMessage.disabled = false
        const user = localStorage.getItem('name')
        let clientID = localStorage.getItem('ClientID');
        let messageToServer = { text: user, type: 'name', id: clientID }
        document.querySelector("#hello").textContent = 'Hello ' + user
        textfieldName.value = user
        webSocket.send(JSON.stringify(messageToServer))
        webSocket.send(JSON.stringify({ type: 'history' }))
        refreshList()
    }
}

//DETERMINE MESSAGE ACTION          

function choiceBy(type, data) {
    if (type == 'message')
        handleIfMessage(data)
    if (type == 'list')
        handleIfList(data)
    if (type == 'history')
        handleIfHistory(data)
}