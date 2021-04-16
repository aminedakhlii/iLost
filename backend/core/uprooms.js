const pool = require('./pool');

function UpRoom(){} ;

UpRoom.prototype = {
  UpLost : function (userId , lostId , callback) {
    let sql = 'INSERT INTO lostup_rooms(postID,user_id) VALUES (?, ?)' ;
    pool.query(sql, [lostId,userId], function(err, result) {
        if(err) console.log(err);
        // return the last inserted id. if there is no error
        callback(result.insertId);
    });
  },

  findUpLost : function (userid , lostid , callback) {
    let sql = `SELECT * FROM lostup_rooms WHERE (user_id = ? and postID = ?) `;

    pool.query(sql, [userid,lostid], function(err, result) {
        if(err) console.log(err);

        if(result.length) {
            callback(result[0]);
        }else {
          console.log('not found');
            callback(null);
        }
    });
  },

  findByUser : function(id , callback) {
    let sql = `SELECT * FROM up_rooms WHERE id = ?`;

    pool.query(sql, id, function(err, result) {
        if(err) console.log(err);

        callback(result);
    });

  },

  UpFound : function (userId , foundId , callback) {
    let sql = 'INSERT INTO foundup_rooms(postID,user_id) VALUES (?, ?)' ;
    pool.query(sql, [foundId,userId], function(err, result) {
        if(err) console.log(err);
        // return the last inserted id. if there is no error
        callback(result.insertId);
    });
  },

  deleteLost: function(lostId,callback) {

      let sql = `DELETE FROM lostup_rooms WHERE PostId = ?`;
      pool.query(sql,lostId,function(err , ret) {
        if(err) console.log(err);

        callback(lostId);
      });

  },
  deleteFound: function(foundId,callback) {

      let sql = `DELETE FROM foundup_rooms WHERE PostId = ?`;
      pool.query(sql,foundId,function(err , ret) {
        if(err) console.log(err);

        callback(foundId);
      });

  }
}

module.exports = UpRoom ;
