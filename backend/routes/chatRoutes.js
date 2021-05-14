const express = require('express');
const router = express.Router() ;
const Room = require('../core/room');
const User = require('../core/user');
const Message = require('../core/message');
const MsgNotif = require('../core/msgNotif');
const redis = require("redis");
const client = redis.createClient();
const multer = require('multer') ;
const {promisify} = require('util') ;


const GET_ASYNC = promisify(client.get).bind(client) ;
const SET_ASYNC = promisify(client.set).bind(client) ;
const DEL_ASYNC = promisify(client.del).bind(client) ;


function setStorage(roomid,messageId) {

  let storage =  multer.diskStorage({
    destination : `${__dirname}/../data/images/chats/${roomid}`,
    filename : function(req , file , cb){
      cb(null , messageId.toString() + '.jpeg' ) ;
    }
  });

  return multer({storage : storage}).single('image') ;

}


router.get('/updateChats' , async (req , res ) => {

  if(req.session.user) {

    let lastChatsLookup = await GET_ASYNC('chatsLookup' + req.session.user.id.toString()) ;
    let lastChatsUpdate = await GET_ASYNC('chatsUpdate' + req.session.user.id.toString()) ;

    lastChatsLookup = new Date(lastChatsLookup).getTime() ;
    lastChatsUpdate = new Date(lastChatsUpdate).getTime() ;

    if(lastChatsLookup && lastChatsUpdate){
      if(lastChatsUpdate > lastChatsLookup){
        res.send('1') ;
        return ;
      }
      else
        res.send('0') ;
        return ;
    }
  res.send('1') ;
    return ;
  } else res.send(403) ;

});

router.get('/updateConversation/:room' , async (req , res) => {
  if (req.session.user) {

    let lastConversationLookup = await GET_ASYNC('conversationLookup' + req.session.user.id.toString()+ '-' + req.params.room) ;
    let lastConversationUpdate = await GET_ASYNC('conversationUpdate' + req.session.user.id.toString() + '-' + req.params.room) ;

    lastConversationLookup = new Date(lastConversationLookup).getTime() ;
    lastConversationUpdate = new Date(lastConversationUpdate).getTime() ;

    if (lastConversationLookup && lastConversationUpdate) {
      if (lastConversationLookup > lastConversationUpdate)
        res.send('0') ;
      else res.send('1') ;
      return ;
    } else if(lastConversationLookup && !lastConversationUpdate)
        res.send('0');
    else res.send('1');

  } else res.send(403) ;
});


router.get('/chats' , (req , res) =>{

  if(req.session.user) {
    let room = new Room() ;
      room.findAll(req.session.user.id , async function(result){
        const saveChats = await SET_ASYNC(
          'chatsLookup' + req.session.user.id.toString(),
          new Date(),
          'EX', 1000000
        );
        res.send(result) ;
      });
  }
});

router.get('/fetchmessages/:id/:lastMessage' , (req , res) =>{
  if(req.session.user) {
    let room = new Room() ;
    room.fetchmessages(req.params.id , req.params.lastMessage ,async function(messages){
      if(messages) {
        const conversationLookupSet = await SET_ASYNC(
          'conversationLookup' + req.session.user.id.toString() + '-' + req.params.id,
          new Date(),
          'EX', 1000000
        );
        res.send(messages) ;
      }
      else res.send('-1')
    });
  }
});

router.post('/uploadImage/:room' ,  (req , res) => {
  if(req.session.user) {
    console.log(req.params.room);
    let m = new Message() ;
    m.lastId(req.params.room , function(ret) {
      let upload = setStorage(req.params.room , ret[0]['id']) ;
      upload(req , res ,  (err) => {
        console.log(err);
      });
    });
  }
  else res.send(403) ;
});

router.post('/send' , (req , res) =>{
  if(req.session.user){
    let msg = new Message() ;
    msg.create(req.body.content , req.body.sender , req.body.room , req.body.withImage , function(msg){
      if(msg){
        let notif = new MsgNotif();
        notif.notify(req.session.user.id,req.body.room,req.body.content, function(ret){
          if(ret == 200) res.send(200);
          else res.send(500);
        });
      }
      else res.send(500) ;
    });
  }
  else res.send(403) ;
});

/*router.get('/listenForMsgs' , (req , res) => {
  console.log('listening...');
  if(req.session.user){
    let notif = new Notif() ;
    notif.checkMsgs(req.session.user.id , function(ret){
      if(ret) {
        console.log(ret[0]['message']) ;
        let m = new Message() ;
        let id = ret[0]['id']
        m.findById(ret[0]['message'] , function(msg){
          res.send({'id' : id , 'content' : msg.content , 'sender' : msg.sender}) ;
        });
      }
      else res.send({}) ;
    });
  }
});


router.get('/markMsgRecieved/:id' , (req , res) => {
    if(req.session.user){
      console.log('recieving request!');
      let notif = new Notif() ;
      notif.markRecieved(req.params.id , function(ret){
        if(ret == 1) res.sendStatus(200) ;
      });
    }
});
*/

module.exports = router ;
