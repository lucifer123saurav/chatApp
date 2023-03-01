
const express=require('express')
const path=require('path')
const http=require('http')
const socketio=require('socket.io')
const formatMessage=require('./utils/messages')
const {userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
    }=require('./utils/user')

const app=express()
const server =http.createServer(app)
const io=socketio(server)

app.use(express.static(path.join(__dirname,'public')))

const botName='ChatCord Bot';

//Run when clients connects

io.on('connection', socket=>{
   socket.on('joinRoom',({username,room})=>{
    const user=userJoin(socket.id,username,room)

   socket.join(user.room)

    socket.emit('message',formatMessage(botName,'Welcome to ChatCord !'))
    //Broadcast when a user connects
       socket.broadcast.to(user.room).emit('message',formatMessage(botName,`${user.username} has joined the chat`))

        //Sends users and room info

   io.to(user.room).emit('roomUsers',{
    room:user.room,
    users:getRoomUsers(user.room)
   })
       
   })

  
   
       //Runs when client discnnects
       socket.on('disconnect',()=>{
        const user=userLeave(socket.id);
        if(user){
            io.to(user.room).emit('message',formatMessage(botName,`${user.username} has left the chat`))
        }

         //Sends users and room info

    io.to(user.room).emit('roomUsers',{
    room:user.room,
    users:getRoomUsers(user.room)
    })
       })
           
       //listen for chatmessage
       socket.on('chatMessage',(msg)=>{
        const user=getCurrentUser(socket.id)
        io.to(user.room).emit('message',formatMessage(user.username,msg))
       })
})







server.listen(3000,() =>console.log('server started at port 3000'))

