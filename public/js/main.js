const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const socket =io();

// getusername and room from url
const {username, room} = Qs.parse(location.search,{
 ignoreQueryPrefix : true

});
console.log(username,room);

socket.emit('joinRoom',{username,room});

//get room and users

socket.on('roomUsers',({room,users})=>{
  outputRoomName(room);
  outputUsers(users);
})

//message from server
socket.on('message',(data)=>{
  console.log(data);
  outputMessage(data);
  //scroll down 
  chatMessages.scrollTop = chatMessages.scrollHeight;
});
//message submit
chatForm.addEventListener('submit',(e)=>{
  e.preventDefault();
  //get message text
  const msg=e.target.elements.msg.value;
  //sends message to the server
  socket.emit('chatMessage',msg);
  //clear input
  e.target.elements.msg.value ='';
  e.target.elements.msg.focus();
});
//output message to dom
function outputMessage(data){
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML=`<p class="meta">${data.username}<span>${data.time}</span></p>
  <p class="text">
    ${data.text}
  </p>`;
  document.querySelector('.chat-messages').appendChild(div);

}
//add roomname to dom
function outputRoomName(room){
    roomName.innerText = room;

}
//add users to dom
function outputUsers(users){

  userList.innerHTML=`
  ${users.map(user=>`<li>${user.username}</li>`).join('')}
  `;

}