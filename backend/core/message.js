const pool = require('./pool');
const Room = require('./room')
const MsgNotif = require('./msgNotif')
const {promisify} = require('util') ;
const redis = require("redis");
const client = redis.createClient();

function Message(){};

const SET_ASYNC = promisify(client.set).bind(client) ;

Message.prototype = {

  create : function(content,sender,room,withImage,callback)
  {

      let sql = `INSERT INTO messages(content,sender,room,withImage) VALUES (?, ?, ?,?)`;

      if(withImage == 'false') withImage = 0 ; else if(withImage == 'true') withImage = 1 ;

      pool.query(sql, [content,sender,room,withImage], function(err, result) {
          if(err) {console.log(err); return ;}
          // return the last inserted id. if there is no error
          else {
          let room_ = new Room() ;
          room_.findById(room , async (ret) => {
            if(ret.user1 == sender){

            }
            else {

            }
            const conversationUpdateSet1 = await SET_ASYNC(
              'conversationUpdate' + ret.user1.toString() + '-' + ret.id,
              new Date(),
              'EX', 1000000
            );
            const conversationUpdateSet2 = await SET_ASYNC(
              'conversationUpdate' + ret.user2.toString() + '-' + ret.id,
              new Date(),
              'EX', 1000000
            );


            const saveChatsUpdate1 = await SET_ASYNC(
              'chatsUpdate' + ret.user1.toString(),
              new Date(),
              'EX', 1000000
            );
            const saveChatsUpdate2 = await SET_ASYNC(
              'chatsUpdate' + ret.user2.toString(),
              new Date(),
              'EX', 1000000
            );

            callback(result.insertId);

          });
        }
      });
  },

  findById : function(id , callback) {
    let sql = `SELECT * FROM messages WHERE id = ?`;

    pool.query(sql, id, function(err, result) {
        if(err) console.log(err);

        if(result.length) {
            callback(result[0]);
        }else {
            callback(null);
        }
    });

  },

  lastId : function(roomId , callback) {
    let sql = 'SELECT id FROM messages where room = ? ORDER BY id DESC LIMIT 1' ;
    pool.query(sql , roomId, function(err , ret) {
      console.log(this.sql);
      if(err) console.log(err);
      else if (ret.length == 0) {
        callback([{'id' : 0}]);
      }
      else callback(ret) ;
    });
  }

}

module.exports = Message;
