const pool = require('./pool');
//const MatchRoom = require('./match_room');
const UpRoom = require('./uprooms');


function Found() {};

Found.prototype = {

  create : function(body, callback)
  {

      var bind = [];

      for(prop in body){
          bind.push(body[prop]);
      }

      let sql = `INSERT INTO founds(title, category, content, lat , longitude  , author , ups , accepted)
      VALUES (?, ?, ?, ?, ?, ? , 0 , 0)`;


      pool.query(sql, bind, function(err, result) {
          if(err) console.log(err);

          callback(result.insertId);

      });
  },

  find : function(id,callback) {
      console.log(id);
      let sql = `SELECT * FROM founds WHERE id = ?`;
      pool.query(sql, id, function(err, result) {
        if(err) console.log(err);

        if(result.length) {
            callback(result[0]);
        }else {
            callback(null);
        }

      });
  },

  delete: function(id,callback) {

      let uproom = new UpRoom() ;
      uproom.deleteFound(id , function(id) {
        let sql = `DELETE FROM founds WHERE id = ?`;
        pool.query(sql,id,function(err , ret) {
          if(err) console.log(err);

          callback();
        });
      });

  },

  up : function(id,callback) {

    let sql = 'UPDATE founds SET ups = ups + 1 WHERE id = ?' ;

    pool.query(sql, id, function(err, result) {
      if (err) console.log(err);
      else if (result){
        callback(result) ;
      }
      else console.log('error uping');
    });
  },

  getItems : function(n,callback) {
    let sql = 'SELECT * from founds limit ?' ;

    pool.query(sql , n , function(err , ret) {
      if (err) console.log(err);
      else if (ret) {
        dict = [] ;
        for (var i = 0; i < ret.length; i++) {
          dict.push({'type': 'found' , 'id': ret[i].id , 'data': ret[i]}) ;
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

    let sql = 'SELECT founds.*, users.username FROM founds , users WHERE users.id = founds.author and ';

    for (var i = 0; i < columns.length - 1; i++) {
      sql += columns[i] +' = ? OR ' ;
    }
    sql += columns[columns.length - 1] + ' = ?;' ;

    pool.query(sql , bind , function(err , ret) {
      if (err) console.log(err);
      else {
        final = []
        for (var i = 0; i < ret.length; i++) {
          final.push({'type' : 'found' , 'data' : ret[i]});
        }
        callback(final) ;
      }
    });
  },

  inCircle : function (centerlat, centerlong , ptlat , ptlong ) {
          var ky = 40000 / 360;
          var kx = Math.cos(Math.PI * centerlat / 180.0) * ky;
          var dx = Math.abs(centerlong - ptlong) * kx;
          var dy = Math.abs(centerlat - ptlat) * ky;
          return Math.sqrt(dx * dx + dy * dy) ;
        },

  findQuickMatchs : function(category , lat , long , radius , callback)  {
    let sql = 'SELECT * FROM founds ';
    self = this ;
    pool.query(sql , [] , function(err , ret) {
      if(err) console.log(err);
      else {
        let matches_ = [] ;
        for (var i = 0; i < ret.length; i++) {
          let distance = self.inCircle(lat,long,ret[i].lat,ret[i].longitude,radius) ;
          console.log(distance);
          if( distance <= radius ) {
            matches_.push(ret[i]) ;
          }
        callback(matches_) ;
      }
    }
  })
  },

  possibleMatchs : function(id, callback) {
    let mroom = new MatchRoom() ;
    mroom.find(id , 'found' , (ret) => {
        callback(ret) ;
    });
  },


  lastId : function(callback) {
    let sql = 'SELECT * FROM founds ORDER BY id DESC LIMIT 1;' ;
    pool.query(sql , [], function(err , ret) {
      if(err) console.log(err);
      else if (ret.length == 0 ) callback([{'id' : 0}]);
      else callback(ret) ;

    });
  }

}


/*
user creates -> search for possible matchs put them in MatchRooms -> find them from the rooms

*/
module.exports = Found ;
