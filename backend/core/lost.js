const pool = require('./pool');
const Found = require('./found');
const MatchRoom = require('./match_room');
const UpRoom = require('./uprooms');

function Lost() {};

Lost.prototype = {

  create : function(body, callback)
  {

      var bind = [];

      for(prop in body){
          bind.push(body[prop]);
      }

      let sql = `INSERT INTO losts(title, category, content, lat , longitude, search_area , author , ups , accepted)
      VALUES (?, ?, ?, ?, ?, ?, ? , 0 , 0)`;

      let self = this ;

      pool.query(sql, bind, function(err, result) {
          if(err) console.log(err);
          self.seekMatchs(result.insertId , (ret) => {
            console.log('ret new');
            console.log(ret);
            callback(ret);
          });
      });
  },

  find : function(id,callback) {

      let sql = `SELECT * FROM losts WHERE id = ?`;
      pool.query(sql, id, function(err, result) {
        if(err) throw err ;

        if(result.length) {
            callback(result[0]);
        }else {
            callback(null);
        }

      });
  },

  delete: function(id,callback) {

      let uproom = new UpRoom() ;
      uproom.deleteLost(id , function(id) {
        let sql = `DELETE FROM losts WHERE id = ?`;
        pool.query(sql,id,function(err , ret) {
          if(err) console.log(err);

          callback();
        });
      });

  },

  up : function(id,callback) {

    let sql = 'UPDATE losts SET ups = ups + 1 WHERE id = ?' ;

    pool.query(sql, id, function(err, result) {
      if (err) console.log(err);
      else if (result){
        callback(result) ;
      }
      else console.log('error uping');
    });
  },

  getItems : function(n,callback) {
    let sql = 'SELECT losts.* , users.username from losts, users where losts.author = users.id limit ?' ;

    pool.query(sql , n , function(err , ret) {
      if (err) console.log(err);
      else if (ret) {
        dict = [] ;
        for (var i = 0; i < ret.length; i++) {
          dict.push({'type': 'lost' , 'id': ret[i].id , 'data': ret[i]}) ;
        }
        callback(dict.reverse());
      }
    });
  },

  findBy : function(columns , values , callback) {

    if (columns.length != values.length) callback(null) ;

    let bind = [] ;

    for (var i = 0; i < columns.length; i++) {
    //  bind.push(columns[i]) ;
      bind.push(values[i])  ;
    }

    let sql = 'SELECT losts.*, users.username FROM losts , users WHERE users.id = losts.author and ';

    for (var i = 0; i < columns.length - 1; i++) {
      sql += columns[i] +' = ? OR ' ;
    }
    sql += columns[columns.length - 1] + ' = ?;' ;

    pool.query(sql , bind , function(err , ret) {
      if (err) console.log(err);
      else {
        final = []
        for (var i = 0; i < ret.length; i++) {
          final.push({'type' : 'lost' , 'data' : ret[i]});
        }
        callback(final) ;
      }
    });
  },

  seekMatchs : function(id , callback) {
    let sql = 'SELECT * FROM losts WHERE id = ?';

    pool.query(sql , id , function(err , ret) {
      found = new Found() ;
      found.findQuickMatchs(ret[0].category , ret[0].lat , ret[0].longitude , ret[0].search_area , (ret)=>{
        room = new MatchRoom() ;
        for (var i = 0; i < ret.length; i++) {
          let tmp = ret[i].id ;
          room.findDuplicate(id, ret[i].id , (returnval) =>{
            if(returnval == null) room.create(id, tmp, (newroom) => {

            });
           });
        }
        callback(ret);
      });
    });
  },

  approveFound : function(lost,found,callback) {
    let sql = 'INSERT INTO approved(lost,found) VALUES (?,?)';
    pool.query(sql , [lost,found] , function(err , ret) {
      if(err) {
        console.log(err);
        callback(null) ;
      }
      else {
        callback(ret.insertId) ;
      }
    });
  },

  seekFoundMatchs : function(id , callback) {
    let sql = 'SELECT * FROM founds WHERE id = ? and id not in (select found from approved)';

    self = this ;

    pool.query(sql , id , function(err , ret) {
      self.findBy([`category` , 'lat' , 'longitude'] , [ret[0].category , ret[0].lat , ret[0].longitude] , (ret)=>{
        console.log(ret);
        for (var i = 0; i < ret.length; i++) {
          room = new MatchRoom() ;
          room.create(ret[i]['data'].id, id , (ret) =>{});
        }
        callback(ret) ;
      });
    });
  },

  possibleMatchs : function(id, callback) {
    let mroom = new MatchRoom() ;
    mroom.find(id , 'lost' , (ret) => {
        callback(ret) ;
    });
  },

  lastId : function(callback) {
    let sql = 'SELECT * FROM losts ORDER BY id DESC LIMIT 1;' ;
    pool.query(sql , [], function(err , ret) {
      console.log('ret');
      console.log(ret);
      if(err) console.log(err);
      else if (ret.length == 0) {
        console.log('first post');
        callback([{'id' : 0}]);
      }
      else callback(ret) ;

    });
  }

},




/*
user creates -> search for possible matchs put them in MatchRooms -> find them from the rooms

*/
module.exports = Lost ;
