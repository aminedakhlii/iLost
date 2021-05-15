const express = require('express') ;
const session = require('express-session');
const sharedsession = require("express-socket.io-session");
const http = require('http');
const path = require('path') ;
const pageRouter = require('./routes/pages');
const postsRouter = require('./routes/posts');
const chatsRouter = require('./routes/chatRoutes');
const userRouter = require('./routes/user')
const socketio = require('socket.io') ;
const bodyParser = require('body-parser');


const User = require('./core/user');
const Message = require('./core/message');
const Room = require('./core/room');
const MsgNotif = require('./core/msgNotif');

user = new User() ;
message = new Message();
notif = new MsgNotif();

const app = express() ;
const server = http.createServer(app) ;
const io = socketio(server) ;


//app.use(express.urlencoded({ extended : false })) ;
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(express.static(__dirname + '/data'));
app.use((req , res , next) => {
  console.log(req.url);
  next();
});


app.set('views', path.join(__dirname,'views')) ;
app.set('view engine', 'pug');

var sessionMiddleware = session({
  secret:'<wvTWL.pn:L(WM_q"}uRXp9=uB^=g',
  resave: false,
  saveUninitialized: false,
  cookie : {
    maxAge : Date.now() + (30 * 86400 * 1000)
  }
});
app.use(sessionMiddleware);

app.use('/',pageRouter);
app.use('/post/',postsRouter);
app.use('/messages/',chatsRouter);
app.use('/user/',userRouter);

app.use((req, res, next) =>  {
    var err = new Error('Page not found');
    err.status = 404;
    next(err);
})

// Handling errors (send them to the client)
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send(err.message);
});

server.listen('3000',
  () => console.log('running ..')
);

io.use((socket,next) => {
  sessionMiddleware(socket.request,socket.request.res || {}, next);
});

io.on('connection', socket => {
  console.log('connected');
  notif.findUser(socket.handshake.query.key,(currentUser)=>{
    if(currentUser){
      currentUser = currentUser['user'];
      let room = -1;
      if(socket.handshake.query.room){
        room = socket.handshake.query.room;
        socket.join(room);
      }

      socket.on("sendMsg", (data) => {
        console.log(currentUser);
        if(data.sender == currentUser)
          message.create(data.content , data.sender , data.room , data.hasImage , function(msg){
              if(msg){
                notif.notify(data.sender,data.room,data.content, function(ret){
                  if(ret) socket.in(room).emit("receive", data);
                  else socket.in(room).emit('error');
                });
              }
            });
        });

        socket.on('disconnect', function (data) {
          console.log('leaving');
          socket.leave(room);
        });

    }else socket.disconnect();
  });
});


module.exports = app,server ;
