const express = require('express');
const User = require('../core/user');
const router = express.Router() ;
const Lost = require('../core/lost');
const Found = require('../core/found');
const MatchRoom = require('../core/match_room');
const multer = require('multer') ;
const UpRoom = require('../core/uprooms');
const Room = require('../core/room');
const redis = require("redis");
const client = redis.createClient();
const {promisify} = require('util') ;

let lost = new Lost() ;

function setStorage(postType ,postId, n) {

  let storage =  multer.diskStorage({
    destination : `${__dirname}/../data/images/${postType}/${postId}`,
    filename : function(req , file , cb){
      cb(null  , postId.toString() + '.jpeg' ) ;
    }
  });

  return multer({storage : storage}).single('image') ;

}


const GET_ASYNC = promisify(client.get).bind(client) ;
const SET_ASYNC = promisify(client.set).bind(client) ;
const DEL_ASYNC = promisify(client.del).bind(client) ;


router.get('/posts' , (req , res) => {
  if (req.session.user) {
    res.render('post'); }
  else res.redirect('/')
});


router.post('/upload/lost' , (req , res) =>{

  if (req.session.user) {

  l = new Lost() ;
  l.lastId((id) => {
    console.log(id);
    let upload = setStorage('lost' , id[0]['id'] + 1 , 0) ;

    upload(req , res , function(err) {
      if(err) console.log(err);
      else
      res.send(200);
    });

  });

  }

  else res.send(403) ;

});

router.post('/upload/found' , (req , res) =>{

  if (req.session.user) {

  f = new Found() ;
  f.lastId((id) => {
    console.log(id);
    let upload = setStorage('found' , id[0]['id'] + 1 , 0) ;

    upload(req , res , function(err) {
      if(err) res.send(400);
      else
      res.send(200);
    });

  });

  }

  else res.send(403) ;

});

router.post('/create/lost' , (req , res) => {

  if (req.session.user) {

  lost = new Lost() ;

    let input = {
      title : req.body.title,
      category : parseInt(req.body.category),
      content : req.body.content,
      lat : parseFloat(req.body.lat),
      longitude : parseFloat(req.body.longitude),
      search_area : parseInt(req.body.search_area),
      author : req.session.user.id,
    };
        lost.create(input , async function(ret){
        if (ret) {
          console.log('before');
          try {
            console.log('start');
            var current = new Date();
            const saveReply = await SET_ASYNC(
              'lastLost',
              current,
              'EX', 1000000
            );
            console.log('end');
          } catch (e) {
            console.log(e.message);
          }
          res.send(ret.toString()) ;
        }
        else console.log('error creating lost post!');
      });

    }

  else res.send('not connected') ;

});


router.post('/create/found' , (req , res) => {

  if (req.session.user) {

  found = new Found() ;

  let input = {
    title : req.body.title,
    category : parseInt(req.body.category),
    content : req.body.content,
    lat : parseFloat(req.body.lat),
    longitude : parseFloat(req.body.longitude),
    author : req.session.user.id,
  };

  found.create(input , function (ret){
    if(ret) {
      lost = new Lost();
      lost.seekFoundMatchs(ret , (result) =>{
        res.send(200);
      });
    }
    else console.log('error creating found post!');
  }) ;

  }
  else res.send('not connected') ;
});

router.get('/up/lost/:id' , (req , res) => {

  if (req.session.user) {
    lost = new Lost() ;
    lost.find(req.params.id , function(ret){
      if(ret) lost.up(ret.id , function(){
        uproom = new UpRoom() ;
        uproom.findUpLost(req.session.user.id,req.params.id , (ret) => {
          if(ret) res.send(ret) ;
          else uproom.UpLost(req.session.user.id, req.params.id , (r)=>{
            console.log('upped !');
            res.send('upped') ;
          });
        });
      });
    });
  }

});

router.get('/up/found/:id' , (req , res) => {

  if (req.session.user) {
    found = new Found() ;
    found.find(req.params.id , function(ret){
      if(ret) found.up(ret.id , function(){
        uproom = new UpRoom() ;
        uproom.UpFound(req.session.user.id, req.params.id , (r)=>{
          console.log('upped !');
          res.send('upped') ;
        });
      });
    });
  }
});

function rank(array) {
  array.sort(function(a,b){
    return b.date - a.date ;
  })
}


router.get('/feed' , (req , res) => {
  console.log('feed');
  if (req.session.user){
    let user = new User() ;
    user.find(req.session.user.id , function(userRet) {
      if(userRet) {
      let currentUser = new User() ;
      currentUser.getRelevant(20 , async function(ret){
        rank(ret) ;
        res.send(ret) ;
        }) ;
      }
    });
  }
});


router.get('/updatedfeed' , async (req , res) => {
  if(req.session.user) {
    try {

      let lastLost = await GET_ASYNC('lastLost') ;
      let reply = await GET_ASYNC('feed' + req.session.user.id.toString()) ;
      lastLost = new Date(lastLost).getTime() ;
      reply = new Date(reply).getTime() ;
      if(reply && lastLost && reply > lastLost){
        res.send('0') ;
        return ;
       }

       var current = new Date() ;

       const saveReply = await SET_ASYNC(
         'feed' + req.session.user.id.toString(),
         current,
         'EX', 10000
       );

       console.log('saved');

       res.send('1') ;

    } catch (e) {
      console.log(e.message);
    }
  }else res.send(403);
});


router.get('/possiblematchs/lost/:id' , (req , res) =>{
  if(req.session.user) {
    let lost = new Lost() ;
    lost.possibleMatchs(req.params.id ,  function(ret) {
      res.send(ret) ;
    });
  }
  else
  res.send(403);
});

router.post('/approveFound' , (req , res) =>{
  if (req.session.user){
    lost.approveFound(req.body.lost , req.body.found , (ret)=>{
      res.send(ret) ; 
    });
  }else
  res.send(403);
});


router.get('/myposts', (req , res) => {
  if (req.session.user){
    let user = new User() ;
    user.getAllPosts(req.session.user.id , (ret) => {
      let final = ret.sort((a, b) => b.time - a.time) ;
      res.send(final) ;
    });
  }
  else res.send(403);
});

router.post('/delete' , (req , res) => {
  if(req.session.user) {
    console.log(req.body);
    switch (req.body.type) {
      case 'lost':
        console.log('deleting lost');
        let lost = new Lost();
        lost.delete(req.body.id , (ret) => {
          res.sendStatus(200);
        });
        break;
      default:

    }
  }
});

router.get('/upcache/:type/:id' , async (req , res) => {
  if (req.session.user){
    try {
    switch (req.params.type) {
      case 'lost':

        let lostReply = await GET_ASYNC('lost' + req.params.id.toString()) ;
        if(lostReply){
          res.send(lostReply.toString()) ;
          return ;
         }

        let l = new Lost();
        l.find(req.params.id , async (ret) => {
          try {
            const saveReply = await SET_ASYNC(
            'lost' + req.params.id.toString(),
            ret.ups.toString(),
            'EX', 10
          )}catch(e){
            console.log(e.message);
          }
          res.send(ret.ups.toString()) ;
        });
        break;
      case 'found':

        let foundReply = await GET_ASYNC('found' + req.params.id.toString()) ;
        if(foundReply){
          res.send(foundReply.toString()) ;
          return ;
         }

        let f = new Found();
        f.find(req.params.id , async (ret) => {
          try {
            const saveReply = await SET_ASYNC(
            'found' + req.params.id.toString(),
            ret.ups.toString(),
            'EX', 10
          )}catch(e){
            console.log(e.message);
          }
          res.send(ret.ups.toString()) ;
        });
        break;
      default:

    }

  } catch(e) {
    console.log(e.message);
  }
}
  else res.send(403);
});

router.get('/matchapproved/:id' ,  (req , res) => {
  if (req.session.user){
    console.log('get');
    found = new Found();
    found.find(req.params.id , (ret) => {
      let user = new User() ;
      user.find(ret.author , (u)=>{
        let r = new Room();
        r.find(req.session.user.id , u.id , (ret) => {
          if(ret) res.send(ret) ;
          else r.create(req.session.user.id , u.id , 0 , async (ret) => {
            if(ret) {
              let d = new Date() ;
              const saveChatsUpdate = await SET_ASYNC(
                'chatsUpdate' + req.session.user.id.toString(),
                d,
                'EX', 1000000
              );
              const saveChatsUpdate2 = await SET_ASYNC(
                'chatsUpdate' + u.id.toString(),
                d,
                'EX', 1000000
              );
              res.send(ret) ;
            }
          });
        });
      });
    });
  }
  else res.send(403);
});

router.get('/notifications' , (req , res) =>{
  if (req.session.user){
    let matchRoom = new MatchRoom() ;
    matchRoom.findByUser(req.session.user.id , function(ret) {
      res.send(ret) ;
    }) ;
  }
  else res.send(403) ;
});


module.exports = router ;
