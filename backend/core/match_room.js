const pool = require('./pool');
const Found = require('./found')
function MatchRoom() {};

MatchRoom.prototype = {
  create : function(lostID,foundID,callback)
  {

    this.findDuplicate(lostID,foundID , function(ret) {
      if (ret) callback (ret.id) ;
      else {
        let sql = `INSERT INTO match_rooms(lostID,foundID) VALUES (?, ?)`;

        pool.query(sql, [lostID,foundID], function(err, result) {
            if(err) {
              console.log(err);
              callback(null) ;
            }
            // return the last inserted id. if there is no error
            callback(result.insertId);
        });
      }
    });
  },

  find : function(postID , type ,callback)
  {
      let f = new Found() ;
      let sql = '' ;
      if(type == 'found')
        sql = `SELECT users.username, losts.* FROM match_rooms, losts , users WHERE (foundID = ? and users.id = losts.author and losts.id = lostID)`;
      else if(type == 'lost')
        sql = `SELECT users.username, founds.* FROM match_rooms, founds , users WHERE (match_rooms.lostID = ? and users.id = founds.author and founds.id = match_rooms.foundID)`;

      pool.query(sql, [postID,postID], function(err, result) {
          if(err) console.log(err);

          if(result.length) {

            callback(result) ;

            /*let all = [] ;
            let promises = [] ;

            if(type == 'lost'){

              for (var i = 0; i < result.length; i++) {
                let p = new Promise(function(resolve, reject) {
                    f.find(result[i].foundID , (ret) => {
                      if(ret) resolve(ret) ;
                    });
                });
                p.then((ret) => all.push(ret)).catch((err)=> console.log(err)) ;
                promises.push(p) ;
              }

              Promise.all(promises).then(() =>{
                callback(all) ;
              });

            }*/
          }else {
              callback(null);
          }
      });
  },

  findDuplicate : function(lostID , foundID , callback)
  {

      let sql = `SELECT * FROM match_rooms WHERE (lostID = ? and foundID = ?)`;
      console.log('finding room ');

      pool.query(sql, [lostID,foundID], function(err, result) {
          if(err) console.log(err);

          if(result.length) {
              callback(result[0]);
          }else {
            console.log('not found');
              callback(null);
          }
      });
  },

  findByUser : function(userId , callback) {

      let sql = 'select losts.* from users, losts, match_rooms where match_rooms.lostID = losts.id and losts.author = users.id and users.id = ?;'

      pool.query(sql, userId , function(err , result) {
        if(err) {
          console.log(err);
        }
        else if (result){
          callback(result) ;
        }
        else {
          callback(null) ;
        }
      });
  }

}

module.exports = MatchRoom ;
