var express = require('express');
var pg = require('pg');
var router = express.Router();
var config = require('../config');

var conString = config.db_url;

var sql = "SELECT row_to_json(fc)\n" +
    "  FROM ( SELECT 'FeatureCollection' AS type, array_to_json(array_agg(f)) AS features\n" +
    "           FROM ( SELECT 'Feature' AS type,\n" +
    "                         ST_AsGeoJSON(lg.the_geom)::JSON AS geometry,\n" +
    "                         row_to_json((SELECT l FROM (SELECT name) AS l)) AS properties\n" +
    "                  FROM points_of_interest AS lg ) AS f )  AS fc\n";

/* GET home page. */
router.get('/', function(req, res, next) {
  pg.connect(conString, function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    var query = client.query(sql);

    query.on("row", function(row, result) {
      result.addRow(row);
    });
    query.on("end", function(result) {
      res.send(result.rows[0].row_to_json);
      res.end();
    });
  });
});

module.exports = router;
