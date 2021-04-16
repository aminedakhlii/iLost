const express = require('express');
const router = express.Router() ;
const User = require('../core/user');
const multer = require('multer') ;


function setStorage(userId) {

  let storage =  multer.diskStorage({
    destination : `${__dirname}/../data/images/user/${userId}`,
    filename : function(req , file , cb){
      cb(null , userId.toString() + '.jpeg' ) ;
    }
  });

  return multer({storage : storage}).single('image') ;

}


router.post('/uploadpic' , (req , res) =>{

  if (req.session.user) {
    console.log('user connected');
    let upload = setStorage(req.session.user.id) ;

    upload(req , res , function(err) {
      if(err) { res.send(400);
      console.log(err); } 
      else
      res.send(200);
    });

  }

  else res.send(403) ;

});

module.exports = router ;
