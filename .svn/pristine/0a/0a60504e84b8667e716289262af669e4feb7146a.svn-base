var mongo = require('./mongo.js');
var MongoClient = require("mongodb").MongoClient;

exports.findContainerHandler = function(message, callback) {
  mongo.findDocument("EliteData", {}, function (data) {
    message.message = data;
    message.status = "Success";
    callback(message);
    // mongo.sendWsMessage(connection, message);
  });
}

exports.addContainerHandler = function(message, callback) {
  console.log("Inside addContainerHandler : ",message);
  mongo.insertDocument('EliteData', message.message, function (data) {
    mongo.findDocument("EliteData", {}, function (data) {
      message.message = data;
      message.status = "Success";
      message.action = "findContainer";
      callback(message);
      // mongo.sendWsMessage(connection, message);
    });
  });
}

exports.updateContainerHandler = function (message, callback){
  var id = mongo.getObjectId(message.message._id);
  delete message.message._id;
  mongo.updateDocumentWhole('EliteData', { '_id': id }, message.message, function (data) {
    mongo.findDocument("EliteData", {}, function (data) {
      message.message = data;
      message.status = "Success";
      message.action = "findContainer";
      callback(message);
      // mongo.sendWsMessage(connection, message);
    });
  });
}

exports.deleteContainerHandler = function (message, callback){
  var id = mongo.getObjectId(message.message._id);
  mongo.deleteDocument('EliteData', { '_id': id }, function (data) {
    mongo.findDocument("EliteData", {}, function (data) {
      message.message = data;
      message.status = "Success";
      message.action = "findContainer";
      callback(message);
      // mongo.sendWsMessage(connection, message);
    });
  });
}
