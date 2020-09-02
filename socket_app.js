var io = require('socket.io')();

var room_info = []

io.on('connect', (socket) => {
    console.log('socket_app connected')
    //socket.send('hello') 1:1 send
    //1. 접속하자마자 현재 존재하는 방들의 목록을 보여줘야 한다.
    //2. 사실상 이 기능은 방정보가 캐시에 저장되어 있으면 로딩시 보여주는게 맞다.
    socket.on('create_room', () => {
        //0. 방이 아예 없다면 ID를 1로 해서 방을 새로 만든다.
        //1. 가장 마지막 방의 ID를 가져옴
        //2. 해당 ID + 1해서 새롭게 방을 만듬
        //3. 해당 방에 해당 인원을 JOIN시킴
        //4. 모두에게 방이 새로 생겼음을 알리고 방 번호도 알려줌
        let room_len = room_info.length
        let new_room_id = 1

        if(room_len > 0){
            new_room_id = room_info[room_len - 1].room_id + 1
        }

        let new_room = {
            room_id: new_room_id,
            members: [socket.id]
        }

        room_info.push(new_room)

        socket.join('room' + new_room_id)

        io.emit('create_room', new_room)
    })

    socket.on('join_room', (data) => {
        //1. 들어갈 방번호를 받음
        //2. 해당 방에 있는 인원 수가 1명이면
        //2.1. 방을 만들고
        //2.2. 해당 방에 인원을 JOIN시킴
        //2.3. 방에 있는 인원들에게 '입장했다는 것을 알려줌'
        //3. 이미 두 명이면 불가능
        let result = false
        for(let i in room_info){
            console.log(room_info[i])
            console.log(socket.id)
            console.log(data)
            if(room_info[i].room_id === data){
                if(room_info[i].members.length === 1){
                    if(room_info[i].members[0] === socket.id){
                        break
                    }
                    room_info[i].members.push(socket.id)
                    socket.join('room' + data)
                    result = true
                }
                break
            }
        }
        
        console.log(result)
        if(result){
            io.emit('join_room', data)
        }

        io.to('room' + data).emit('new_member', {
            result: result,
            socket_id: socket.id
        })
    })

    socket.on('disconnect', () => {
        console.log('socket_app disconnected')
        //1. 얘가 속해있던 방을 찾는다.
        //2. 그 방에서 얘를 뺀다.
        //3. 만약 얘를 빼고 인원수가 0이 된다면
        //3.1. 방을 없앤다.
        //3.2. 방이 없어졌음을 모두에게 알린다.
    })
})

module.exports = io;