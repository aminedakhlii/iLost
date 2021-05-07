const pool = require('./pool');
const User = require('./user');

function Room(){};

Room.prototype = {

  create : function(user1,user2,num,callback)
  {
      console.log('creating');
      let sql = `INSERT INTO rooms(user1,user2,messages_num) VALUES (?, ?, ?)`;

      pool.query(sql, [user1,user2,num], function(err, result) {
          if(err) console.log(err);
          // return the last inserted id. if there is no error
          else callback(result.insertId);
      });
  },

  findById : function(id , callback) {
    let sql = `SELECT * FROM rooms WHERE id = ?`;

    pool.query(sql, id, function(err, result) {
        if(err) console.log(err);

        if(result.length) {
            callback(result[0]);
        }else {
            callback(null);
        }
    });

  },

  find : function(user1 , user2 , callback)
  {

      let sql = `SELECT * FROM rooms WHERE (user1 = ? and user2 = ?) or (user1 = ? and user2 = ?)`;
      console.log('finding');

      pool.query(sql, [user1,user2,user2,user1], function(err, result) {
          if(err) console.log(err);

          if(result.length) {
              callback(result[0]);
          }else {
            console.log('not found');
              callback(null);
          }
      });
  },

  findAll : function(user1 , callback)
  {

      let sql = `SELECT * FROM rooms WHERE (user1 = ?) or (user2 = ?)`;


      pool.query(sql, [user1,user1], function(err, result) {
          if(err) console.log(err);

          if(result.length) {
              let user = new User() ;
              let ret = [] ;
              let promises = [] ;

                for (var i = 0; i < result.length; i++) {
                  let p = new Promise((resolve , reject) => {
                    let tmp = result[i].id ;
                    if(result[i].user1 != user1)
                      user.find(result[i].user1 , function(usr){
                        resolve({'username' : usr.username , 'user_id' : usr.id , 'id' : tmp}) ;
                      });
                    else
                      user.find(result[i].user2 , function(usr){
                        resolve({'username' : usr.username , 'user_id' : usr.id , 'id' : tmp}) ;
                      });
                  });
                  p.then((usr) => {
                    ret.push(usr) ;
                  }).catch((err) =>{
                    console.log(err);
                  });

                  promises.push(p) ;
                }

                Promise.all(promises).then(() =>{
                  callback(ret) ;
                });

          }else {
              callback(null);
          }
      });
  },

  fetchmessages : function(roomId , lastMessageFetched ,callback) {

    let sql = 'select * from messages where room = ? and id > ?' ;
    pool.query(sql, [roomId,lastMessageFetched] , function(err, result) {
      if(err) console.log(err);
      if(result) callback(result) ;
      else callback(null);
    });
  }

}

module.exports = Room;
