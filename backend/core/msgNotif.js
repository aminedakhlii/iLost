const pool = require('./pool');
const admin = require ('../firebase/firebase-config')

function MsgNotif(){};

MsgNotif.prototype = {
  create : function(token,user,callback){
    let sql = 'insert into tokens(token,user) values(?,?) on duplicate key update user=user;'
    pool.query(sql, [token,user], function(err, result) {
      if(err) console.log(err);
      else if (result) {
        if(result.insertId != 0)
          callback(result.insertId);
        callback(1);
      }
    });
  },
  notify: function(sender,room,message,callback){
    const notification_options = {
      priority: "high",
      timeToLive: 60 * 60 * 24
    };
    let sql = 'select token from tokens,rooms where (rooms.id = ? and not tokens.user = ?);'
    pool.query(sql, [room,sender], function(err, result) {
      if(err) console.log(err);
      if(result){
        console.log(result);
        for (var token in result) {
          admin.messaging().sendToDevice(token, message, notification_options)
              .then( response => {
                callback(200);
              })
              .catch( error => {
                console.log(error);
                callback(400);
              });
        }
      }
    });
  }
}

module.exports = MsgNotif;
