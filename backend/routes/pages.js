const express = require('express');
const User = require('../core/user');
const router = express.Router() ;
const Lost = require('../core/lost');
const MsgNotif = require('../core/msgNotif');


user = new User() ;
notif = new MsgNotif();

router.get('/' , (req,res,next) => {

  let user = req.session.user;

  if(user) {
      res.redirect('/home');
      return;
  }

  res.render('index') ;

});

router.get('/testnotif' , (req , res) =>{
  console.log('notiftesting');
  res.send('notif') ;
});


router.get('/testsession' , (req , res) =>{
  if(req.session.user) {
    res.send(200) ;
  }
  else res.send(403);
});

router.get('/home', (req, res, next) => {
    let user = req.session.user;

    if(user) {
        res.render('home', {opp:req.session.opp, user:user,fullname:user.fullname,email:user.email});
        return;
    }
    res.redirect('/');
});

router.post('/login' , (req,res,next) => {
  user.login(req.body.username,req.body.password, function(result) {
    if(result) {
      console.log('logged ' + result.username);
      req.session.user = result;
      req.session.opp = 1;
      notif.create(req.body.token,req.session.user.id,(ret)=> {
          if(ret) res.send({"id" : req.session.user.id}) ;
          else res.send(500);
      });
      }
    else res.send(403) ;
  });
});

router.post('/register' , (req,res,next) => {

  let input = {
    username  : req.body.username,
    fullname  : req.body.fullname,
    email  : req.body.email,
    admin  : false,
    super_admin  : false,
    password : req.body.password
  }

  user.create(input,function(result){
    if(result) {

      req.session.user = result;
      req.session.opp = 0;
      res.redirect('/home');

    }
    else res.send('error registering!');
  });

});

router.post('/update', (req , res, next ) => {
  if(req.session.user) {
    let input = {
      username  : req.body.username,
      fullname  : req.body.fullname,
      email  : req.body.email,
    }

    user.modify(req.session.user.username,input, function(result) {

      req.session.user = result;
      req.session.opp = 1 ;
      res.sendStatus(200);
    });
  }
});

router.get('/setAdmin/:id', (req , res ) => {
  if(req.session.user) {
    user.setAdmin(req.session.user,parseInt(req.params.id),function(result){
      res.send(result.username + "is admin") ;
    });
  }
});

router.get('/display', (req , res) => {
  if(req.session.user) {
    user.find(req.session.user.id , (ret)=> {
      if(ret) res.send(ret) ;
      else res.sendStatus(503);
    });
  }
  else res.sendStatus(403);
});

router.post('/delete', (req, res, next) => {
    // Check if the session is exist
    if(req.session.user) {
        user.delete(req.session.user.id,function(result){
          res.redirect('/loggout');
        });
      }
});

router.get('/loggout', (req, res, next) => {
    // Check if the session is exist
    if(req.session.user) {
        notif.delete(req.session.user.id,(ret)=> {
          if(ret)
            req.session.destroy(function() {
                console.log('disconnected');
                res.redirect('/');
            });
          else res.send(500);  
        });
    }
    else {
      console.log('not connected !');
    }
});

router.get('/chat' , (req , res ) => {
  if(req.session.user) {
    res.render('chat' , {user:req.session.user});
  }
  else res.redirect('/') ;
});



module.exports = router ;
