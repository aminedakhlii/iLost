const pool = require('./pool');

function Notif(){};


Notif.prototype = {

  insertMessage : function(target,message,callback)
  {

      let sql = `INSERT INTO msgNotif(target,message) VALUES (?, ?)`;

      pool.query(sql, [target,message], function(err, result) {
          if(err) console.log(err);
          if(result) callback(result.insertId) ;
          else callback(null) ;
        });

  },

  checkMsgs : function (user , callback) {

    let sql = 'Select * from msgNotif where target = ? and checked = 0' ;
    pool.query(sql, user, function(err, result) {
      if (err) console.log(err);

      if(result.length) {
        callback(result) ;
      }
      else callback(null) ;

    });
  },

  markRecieved : function(id , callback) {
    let sql = 'update msgNotif set checked = 1 where id = ?' ;
    pool.query(sql, id, function(err, result) {
      if (err) console.log(err);
      if (result) callback(1) ;
      else callback(null)
    });
  }
}

module.exports = Notif;
