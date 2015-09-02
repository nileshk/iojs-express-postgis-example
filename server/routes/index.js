var express = require('express');
var pg = require('pg');
var router = express.Router();
var config = require('../config');

var conString = config.db_url;

/* GET home page. */
router.get('/', function(req, res, next) {
  pg.connect(conString, function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    client.query('SELECT name FROM points_of_interest', function(err, result) {
      //call `done()` to release the client back to the pool
      done();

      if(err) {
        return console.error('error running query', err);
      }
      var n = result.rows[0].name;
      console.log(n);
      res.render('index', {title: 'Points of Interest', results: result.rows});
      //output: 1
    });
  });

});

module.exports = router;
