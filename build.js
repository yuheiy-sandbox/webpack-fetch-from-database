'use strict';
const MongoClient = require('mongodb').MongoClient;
const webpack = require('webpack');

const DATABASE_URL = 'mongodb://for_webpack:pass@ds061974.mongolab.com:61974/heroku_k4vml408';

const fetchData = query => {
  return new Promise((resolve, reject) => {
    MongoClient.connect(DATABASE_URL, (err, db) => {
      if (err) {
        return reject(err);
      }

      db.collection('posts').find(query).toArray((err, docs) => {
        if (err) {
          return reject(err);
        }

        resolve(docs);
        db.close();
      });
    });
  });
};

const build = data => {
  return new Promise((resolve, reject) => {
    webpack({
      entry: {
        app: './src/app.js'
      },

      output: {
        path: './dist',
        filename: '[name].js'
      },

      plugins: [
        new webpack.DefinePlugin({
          FETCHED_DATA: JSON.stringify(data)
        })
      ]
    }, (err, stats) => {
      if (err) {
        return reject(err);
      }

      console.log(stats.toString({ colors: true }));
      resolve();
    });
  });
};

fetchData({})
  .then(build);
