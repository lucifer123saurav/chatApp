 const chatform=document.getElementById('chat-form')
 const chatMessages=document.querySelector('.chat-messages')
const socket=io();
const roomName=document.getElementById('room-name')
const userList=document.getElementById('users')


//Get username and room from url
const {username,room}=Qs.parse(location.search,{
    ignoreQueryPrefix:true
})

//jooin chatroom
socket.emit('joinRoom',{username,room})

//get room and users

socket.on('roomUsers',({room,users})=>{
    outputRoomName(room)
    outputUsers(users)

})




// Message from server
socket.on('message',message =>{
    console.log(message);
    outputmessage(message);

    //scroll down
    chatMessages.scrollTop=chatMessages.scrollHeight

 

})

//message  submit 
chatform.addEventListener('submit',(e)=>{
    e.preventDefault();
    const msg=e.target.elements.msg.value;
    //EMit a message to server 
    socket.emit('chatMessage',msg);

       //clear  input
       e.target.elements.msg.value=''
       e.target.elements.msg.focus()

})


//Output message to DOm
function outputmessage(message){
    const div=document.createElement('div')
    div.classList.add('message')
    div.innerHTML= `<p class="meta">${message.username}<span>${message.time}</span></p>
    <p class="text">
    ${message.text}
    </p>`;

    document.querySelector('.chat-messages').appendChild(div)

}


//Add room name to DOM
function outputRoomName(room){
    roomName.innerText=room
}
 // Add users to DOm

 function outputUsers(users){
 userList.innerHTML=`
 ${users.map(user=>`<li>${user.username}</li>`).join('')}
 `
 }