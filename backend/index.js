
const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const { addUser, removeUser, getUser, getRoomUsers } = require("./entity");


const app = express()
const server = http.createServer(app);
const io = socketio(server, { cors: { origin: '*' } })

const swaggerui = require("swagger-ui-express")
const swaggerjsdoc = require("swagger-jsdoc")

const port = 8000

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Sample API",
      version: "1.0.0",
      description: "Optional multiline or single-line description",
    },
    servers: [
      {
        url: 'http://localhost:8000/',
      }
    ]
  },
  apis: ["./index.js"],
}

const swaggerSpec = swaggerjsdoc(swaggerOptions);

app.use("/api-doc", swaggerui.serve, swaggerui.setup(swaggerSpec))


/**
 * @swagger
 * /:
 *  get:
 *    summary: check if server is running
 *    description: check
 *    responses:
 *      200:
 *        description: List of samples
 */
app.get('/', (req, res) => {
  res.json("Api is working");
})



/**
 * @swagger
 * /chat?name={name}&room={room}:
 *  get:
 *    summary: send and receive data
 *    description: sample
 *    responses:
 *      200:
 *        description: List of samples
 */

io.on('connect', (socket) => {
  socket.on('join', ({ user, room }, callback) => {
    console.log(user, room)
    const { response, error } = addUser({ id: socket.id, user: user, room: room })

    console.log(response)

    if (error) {
      callback(error)
      return;
    }
    socket.join(response.room);
    socket.emit('message', { user: 'admin', text: `Welcome ${response.user} ` });
    socket.broadcast.to(response.room).emit('message', { user: 'admin', text: `${response.user} has joined` })

    io.to(response.room).emit('roomMembers', getRoomUsers(response.room))
  })

  socket.on('sendMessage', (message, callback) => {

    const user = getUser(socket.id)

    io.to(user.room).emit('message', { user: user.user, text: message })

    callback()
  })


  socket.on('disconnect', () => {
    console.log("User disconnected");
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('message', { user: 'admin', text: `${user.user} has left` })
    }
  })
})


server.listen(8000, () => console.log('Server started on 8000'))