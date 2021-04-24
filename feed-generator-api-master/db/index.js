const mongoose = require('mongoose');
const config=require('../config/db_connect');

const DB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/digital_feed_generator_db';
//const DB_URI = config.remote_production;

function connect() {
  return new Promise((resolve, reject) => {

    if (process.env.NODE_ENV === 'test') {
      const Mockgoose = require('mockgoose').Mockgoose;
      const mockgoose = new Mockgoose(mongoose);

      mockgoose.prepareStorage()
        .then(() => {
          mongoose.connect(DB_URI,
            { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true ,useFindAndModify:false })
            .then((res, err) => {
              if (err) return reject(err);
              resolve();
            })
        })
    } else {
        mongoose.connect(DB_URI,
          { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true,useFindAndModify:false })
          .then((res, err) => {
            if (err) return reject(err);
            resolve(res);
          })
    }
  });
}

function close() {
  return mongoose.disconnect();
}

module.exports = { connect, close };