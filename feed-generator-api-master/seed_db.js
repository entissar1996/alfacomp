const mongoose = require('mongoose');
const UserModel=require('./db/models/user-schema');
const config=require('./config/db_connect');
const DB_URI = 'mongodb://localhost:27017/digital_feed_generator_db';
//const DB_URI = config.remote_production;

function connect() {
    return new Promise((resolve, reject) => {
         mongoose.connect(DB_URI,
            { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true,useFindAndModify:false })
            .then((res, err) => {
              if (err) return reject(err);
              resolve(res);
            })
      });
  }

  
function close() {
    return mongoose.disconnect();
}



async function seedDb(){
    let admin={
        "fullusername": "ADMIN",
        "email": "supervisor@idoormedia.de",
        "password": "Toto2019*-1",
        "city":"Erlangen",
        "role":"ADMIN",
        "isGranted":true,
        "phone": "+216 22 45 79 16"
    }

    try {
        connect();
        
        let _admin=await UserModel.create(admin);

        console.log('add admin user to database:',_admin);

    } catch (error) {
        console.log('error to add  admin to database:',error);
    }
   
   close();

}


seedDb();