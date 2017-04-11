var mongo = require('./mongo.js');

exports.login = function (message, callback) {
  console.log("Inside app.js: login", message.message.userName, message.message.password);
  mongo.findDocumentFields("Users",{ 'userName' : message.message.userName, 'password': message.message.password}, {"userName":true,"_id":false}, function (data) {
//    console.log("Login data",data);
    message.message = data[0];
    message.status = data.length == 1 ? "Success" : "Fail";
    callback(message);
//     mongo.sendWsMessage(connection, message);
  })
}



























// mongo.findDocumentFields("users", {'signup.email': { $in : emails } },
//      {'signup':true, 'profile.location':true, 'profile.physician.degrees':true, 'profile.physician.specialties':true}
// Shashank • 14 mins

// exports.getNctypeDetails=function getNctypeDetails(connection,message){
//   MongoClient.connect(url, function (err, db) {
//     assert.equal(null, err);
//     db.collection('NCType')
//     .find(query).sort(sort).toArray(function (err, result) {
//       if(err) {
//             console.log(err)
//             if(JSON.stringify(err).indexOf('timed out') === -1) {
//               //  assert.equal(err, null);
//             }
//         }
//       callback(err, result);
//       db.close();
//     });
//   });
// }
