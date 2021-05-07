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
        else callback(1);
      }
    });
  },
  notify: function(sender,room,message,callback){
    let sql = 'select token, username from tokens,rooms,users where (rooms.id = ? and not tokens.user = ?) and (users.id = ?);'
    pool.query(sql, [room,sender,sender], function(err, result) {
      if(err) console.log(err);
      if(result){
        console.log(result);
        const notification_options = {
          priority: "high",
          timeToLive: 60 * 60 * 24
        };
        const message_payload = {
          notification: {
              title: result[0]['username'],
              body: message
            }
        };
        for (let i=0;i<result.length;i++) {
          admin.messaging().sendToDevice(result[i]['token'], message_payload, notification_options)
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
  },
  delete: function(user,callback){
    let sql = `DELETE from tokens WHERE user = ?`;
    pool.query(sql, user, function(err, result) {
      if(err) console.log(err);
      else callback(result);
    });
  }
}

module.exports = MsgNotif;
