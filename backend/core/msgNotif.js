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
    let sql = 'select token, username from tokens,rooms,users where (rooms.id = ?) and (users.id = rooms.user1 or users.id = rooms.user2) and (not users.id = ?) and (tokens.user = users.id);'
    pool.query(sql, [room,sender], function(err, result) {
      if(err) console.log(err);
      console.log(this.sql);
      if(result && result.length>0){
        console.log(result);
        const notification_options = {
          priority: "high",
          timeToLive: 60 * 60 * 24
        };
        let message_payload ;
        if(message != '///img///')
          message_payload = {
            notification: {
                title: result[0]['username'],
                body: message,
              },
              data: {
                username: result[0]['username'],
                click_action: "FLUTTER_NOTIFICATION_CLICK",
                sound: "default",
                image: 'none',
                screen: 'chatscreen',
                room: room.toString()
              }
          };
        else message_payload = {
          notification: {
              title: result[0]['username'],
              body: message,
            },
            data: {
              username: result[0]['username'],
              click_action: "FLUTTER_NOTIFICATION_CLICK",
              sound: "default",
              image: "imageicon",
              screen: 'chatscreen',
              room: room.toString()
            }
        };
        let promises = [];
        let callbacks = [];
        for (let i=0;i<result.length;i++) {
          let p = new Promise((resolve,reject) => {
            admin.messaging().sendToDevice(result[i]['token'], message_payload, notification_options)
                .then( response => {
                  resolve(response);
                })
                .catch( error => {
                  console.log(error);
                  reject(error);
                });
          });
          p.then((ret) => callbacks.push(ret)).catch((err)=> console.log(err));
          promises.push(p);
        }
        Promise.all(promises).then(() =>{
          callback(callbacks) ;
        }).catch((err) => callback(null));
      }
    });
  },
  findUser: function(token,callback){
    let sql = 'select user from tokens where token = ?;'
    pool.query(sql, token, function(err, result) {
      if(err) {
        //console.log(err);
        callback(null);
      }
      else if(result.length) {
          callback(result[0]);
      }else{
          callback(null);
      }
    });
  },
  delete: function(user,callback){
    let sql = `DELETE from tokens WHERE user = ?`;
    pool.query(sql, user, function(err, result) {
      if(err) {console.log(err);}
      if(result) callback(result);
      else callback(null);
    });
  }
}

module.exports = MsgNotif;
