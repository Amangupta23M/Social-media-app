import dotenv from 'dotenv'
import connectDB from "./database/db.js";
import { app } from './app.js';
dotenv.config({
    path:'./env'
})


// adding socket.io configuration
import http from 'http'
const server=http.createServer(app)
import { Server } from 'socket.io'
const io=new Server(server)




// socket.io connection
io.on('connection', (socket) => {
    //console.log('a user connected', socket.id);
    socket.on('comment', (msg) => {
      console.log('new comment received', msg);
     
    })
  })







// connecting to database
connectDB()
.then(()=>{

    // app.listen(process.env.PORT||8000,()=>{
    //     console.log(`server is running on localhost:${process.env.PORT}`)
    // })
      console.log("MongoDB connection Successful !")
})
.catch((err)=>console.error("MongoDB connection Failed !",err))


export default io

server.listen(process.env.PORT||8000,()=>{
    console.log(`server is running on localhost:${process.env.PORT}`)
})

