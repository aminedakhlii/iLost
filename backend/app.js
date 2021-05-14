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

user = new User() ;

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


app.use(session({
  secret:'<wvTWL.pn:L(WM_q"}uRXp9=uB^=g',
  resave: false,
  saveUninitialized: false,
  cookie : {
    maxAge : Date.now() + (30 * 86400 * 1000)
  }
}));

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

io.on('connection', socket => {
  console.log('connected');
  //console.log(socket.id, "has joined");
  //broadcast.emit : all except client
  //emit : client
  //io.emit : all

  socket.on("send_message", (data) => {
    console.log('here');
    let msg = new Message() ;
    msg.create(data.content , data.sender , data.room , data.withImage , function(msg){
        if(msg){
          let notif = new MsgNotif();
          notif.notify(req.session.user.id,data.room,data.content, function(ret){
            if(ret == 200) socket.broadcast.emit("receive_message", data);
            //else res.send(500);
          });
        }
      });
    })

  socket.on('chatMsg', msg => {
    user.find(msg[0] , function(ret){
      room = new Room();
      message = new Message() ;
      room.find(ret.id,18,function(result){

          if(result)  {  message.create(msg[1],ret.id,1,function(result){
                        console.log('sent');
                        });
                      }
          else {
            room.create(ret.id,16,function(result){

            });
          }
      });
    });
  });
});


module.exports = app,server ;
