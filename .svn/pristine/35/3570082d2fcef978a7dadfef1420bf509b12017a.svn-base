var mongo = require('./mongo.js');
var salesOrderNo = "";
exports.getExternalMapping = function (req, res, openSessions) {
    var data = JSON.parse(req.params.message);
    console.log("data :",data);
    var query = {};
    if (data.query === "" || data.query === undefined) {

    } else {
        query = {$and:[{"externalInterfaceName": data.query},{"clientName":data.clientName}]};
    }
    if(data.query===6000866){
        query = {"jobNo": data.query};
    }
    console.log("data.query :" + data.query);
    switch (data.actionName) {
        case 'find':
            mongo.findDocument(data.collectionName, query, function (result) {
                res.send(result[0]);
                res.end();
            });
            break;

        case 'salOrderNo':
            mongo.findDocument("Sequences", {}, function (result) {
                res.send(result[0]);
                res.end();
            });
            break;

        case 'update':
            mongo.updateDocument("JobStatus", {"jobId": data.query}, {"status": data.status}, function (result, query, setValues) {
                console.log("inside update :" + data.query);
            });
            res.end();
            break;

    }


};
exports.insertExternalMapping = function (req, res) {
    var data = JSON.parse(req.params.message);
    console.log("salesOrderNo :" + salesOrderNo)
    console.log("salesOrderNo :" + data.salesOrderNo)
//    mongo.insertDocument("SalesOrder", data, function (result) {
//    });
    res.end();
};


exports.schedulerStatus = function (message, callback) {
  console.log("Inside ExternalMapping: schedulerStatus",message);
  // mongo.findDocumentLimit("JobStatus", {},{"_id":-1},function (result1) {
  mongo.findDocument("JobStatus", {}, function (result1) {
      console.log("JobStatus :"+result1);
      message.message=result1;
          callback(message);
  });
};
