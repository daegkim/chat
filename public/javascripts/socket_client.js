var socket = io();
var isInRoom = false

socket.on('connect', () => {
    console.log('connect to socket')
})

socket.on('create_room', (data) => {
    console.log(data)
    let btnNewRoom = document.createElement('button')
    btnNewRoom.innerHTML = '<p>'+ 'room' + data.room_id + '</p>'
    btnNewRoom.innerHTML += '<p id=' + data.room_id + '>'+ 'member_num : ' + data.members.length + '</p>'
    btnNewRoom.onclick = () => {
        socket.emit('join_room', data.room_id)
    }
    document.getElementById('divRoomList').appendChild(btnNewRoom)
})

socket.on('join_room', (data) => {
    console.log(data)
    document.getElementById(data).innerText = 'this room is full'
})

socket.on('new_member', (data) => {
    console.log(data)
    if(data.result){
        if(data.socket_id !== socket.id){
            alert('Here comes a new member')
        }
        else{
            isInRoom = true
        }
    }
    else{
        if(data.socket_id === socket.id)
        alert('You can\'t enter this room')
    }
})

window.onload = () => {
    document.getElementById('btnCreateRoom').onclick = () => {
        if(isInRoom){
            alert('You already join on room')
            return
        }
        else{
            socket.emit('create_room')
            isInRoom = true
        }
    }
}