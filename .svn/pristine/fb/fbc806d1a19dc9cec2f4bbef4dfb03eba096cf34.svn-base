var mongo = require('./mongo.js');

exports.getSOnumbers = function (message, callback) {
    mongo.findDocumentFields("SalesOrder", {"customerId": parseInt(message.message.customerId)}, {"salesOrderNo": true, "_id": false}, function (data) {
//        console.log("SalesOrder data", data);
        message.message = data;
        message.status = "Success";
        callback(message);
        mongo.sendWsMessage(connection, message);
    });
};

exports.saveSalesOrder = function (message, callback) {

    if (message.message.salesOrderNo == undefined) {
//        console.log("Create", message);
        mongo.findDocumentFields("Sequences", {}, {"_id": false}, function (sequences) {
            var salesOrderNo = sequences[0].salesOrderNo;
            sequences[0].salesOrderNo = sequences[0].salesOrderNo + 1;
//            console.log(" Create sequences[0]", sequences[0]);
            mongo.updateDocumentWhole('Sequences', {'salesOrderNo': salesOrderNo}, sequences[0], function () {});

            message.message.salesOrderNo = salesOrderNo;
            mongo.insertDocument('SalesOrder', message.message, function (data) {
                message.message = {salesOrderNo: salesOrderNo};
                message.status = "Success";
//                console.log(message);
                callback(message);
            });
        });
    } else {
//        console.log("Update");
        if (message.message.jobNo == undefined && message.message.bln != undefined) {
            mongo.findDocumentFields("Sequences", {}, {"_id": false}, function (sequences) {
                var jobNo = sequences[0].jobNo;
                sequences[0].jobNo = sequences[0].jobNo + 1;
//                console.log(" Update sequences[0]", sequences[0]);
                mongo.updateDocumentWhole('Sequences', {'jobNo': jobNo}, sequences[0], function () {});
                message.message.jobNo = jobNo;
                mongo.updateDocument('SalesOrder', {'salesOrderNo': message.message.salesOrderNo}, message.message, function (data) {
                    message.message = {salesOrderNo: message.message.salesOrderNo, jobNo: jobNo};
                    message.status = "Success";
//                    console.log(message);
                    callback(message);
                });

            });
        } else {
            mongo.updateDocument('SalesOrder', {'salesOrderNo': message.message.salesOrderNo}, message.message, function (data) {
                message.message = {salesOrderNo: message.message.salesOrderNo, jobNo: message.message.jobNo};
                message.status = "Success";
//                console.log(message);
                callback(message);
            });
        }
    }
};

exports.saveSalesOrderNCs = function (message, callback) {
    mongo.findDocumentFields("Sequences", {}, {"_id": false}, function (sequences) {
        var lastIndex = message.message.ncs.length - 1;
        if (lastIndex >= 0) {
            if (message.message.ncs[lastIndex].transNo == null) {
                console.log('Generate transNo and Save');
                var transNo = sequences[0].transNo;
                sequences[0].transNo = sequences[0].transNo + 1;
                mongo.updateDocumentWhole('Sequences', {'transNo': transNo}, sequences[0], function () {});
                message.message.ncs[lastIndex]['transNo'] = transNo;
                console.log("lastIndex", lastIndex, 'transNo', message.message.ncs[lastIndex].transNo);
            }
        }
        mongo.updateDocument('SalesOrder', {'salesOrderNo': message.message.salesOrderNo}, message.message, function (data) {
            message.status = "Success";
//            console.log(message);
            callback(message);
        });
    });
};

exports.saveSalesOrderDocument = function (formData, callback) {
    var salesOrderNo = JSON.parse(formData).salesOrderNo;
//    console.log("saveSalesOrderDocument", JSON.parse(formData).salesOrderNo);
    mongo.updateArrayDocument("SalesOrder", {"salesOrderNo": salesOrderNo}, {"docs": {$each: [JSON.parse(formData)]}}, function (result, query, setvalues) {
        callback(true);
    });
};

exports.getDocsRepo = function (message, callback) {
    mongo.findDocumentFields("SalesOrder", {'salesOrderNo': message.message.salesOrderNo}, {"docs": true, "_id": false}, function (data) {
        message.message = data[0];
        message.status = data.length == 1 ? "Success" : "Fail";
        callback(message);
        // mongo.sendWsMessage(connection, message);
    })
};



exports.getContainerDetails = function (message, callback) {
  console.log("Inside masters.js@@@@",message);
  console.log("inside the second block",message.containerNo);
    mongo.findDocumentFields("SalesOrder",{"containers.contNo": message.containerNo},{"containers.$": true, "_id": false} , function (data) {
    message.message = data;
    console.log("Inside mastrsssssss",data);
    message.status = "Success";
    callback(message);
    // mongo.sendWsMessage(connection, message);
  })
};

exports.getAllContainerDetails = function (message, callback) {
  console.log("Inside getAllContainerDetails",message);
  // console.log("inside the second block",message.containerNo);
    mongo.findDocumentFields("SalesOrder",{},{"containers": true, "_id": false} , function (data) {
    message.message = data;
    console.log("Inside getAllContainerDetails",data);
    message.status = "Success";
    callback(message);
    // mongo.sendWsMessage(connection, message);
  })
};

exports.getSalesOrder = function (message, callback) {
    console.log(message);
    //  mongo.findDocumentFields("SalesOrder", {'salesOrderNo': message.message.salesOrderNo}, { "_id": false}, function (data) {
    mongo.findDocumentFields("SalesOrder", message.message, {"_id": false}, function (data) {
        message.message = data[0];
        //    message.message = data;
        message.status = "Success";
        //    message.status = data.length == 1 ? "Success" : "Fail";
//        console.log(message);
        callback(message);
        // mongo.sendWsMessage(connection, message);
    })
};

//For NcDetails
exports.saveNcDetails = function (message, callback) {
    console.log("saveNcDetails: @@@@@", message);
    mongo.updateArrayDocument("SalesOrder", {"salesOrderNo": message.message.salesOrderNo}, {"ncs": {$each: message.message.ncData}}, function (result, query, setvalues) {
        mongo.findDocumentFields("SalesOrder", {'salesOrderNo': message.message.salesOrderNo}, {"ncs": true, "_id": false}, function (data) {
//            console.log("Ncs data", data);
            message.action = 'getNcDetails';
            message.message = data[0];
//            console.log("Action is getNcDetails ", message);
            message.status = data.length == 1 ? "Success" : "Fail";
            callback(message);
        });
    });
};


exports.saveTransNo = function (message, callback) {
    if (message.message.ncData[0]['transNo'] == undefined) {
        mongo.findDocumentFields("Sequences", {}, {"_id": false}, function (sequences) {
            var transNo = sequences[0].transNo;
            sequences[0].transNo = sequences[0].transNo + 1;
            mongo.updateDocumentWhole('Sequences', {'transNo': transNo}, sequences[0], function () {});
            message.message.ncData[0]['transNo'] = transNo;
            mongo.updateArrayDocument("SalesOrder", {"salesOrderNo": message.message.salesOrderNo}, {"ncs": {$each: message.message.ncData}}, function (result, query, setvalues) {
                mongo.findDocumentFields("SalesOrder", {'salesOrderNo': message.message.salesOrderNo}, {"ncs": true, "_id": false}, function (data) {
                    message.action = 'saveTransNo';
                    message.message = transNo;
                    message.status = data.length == 1 ? "Success" : "Fail";
                    callback(message);
                });
            });
        });
    } else {
        mongo.updateDocument('SalesOrder', {$and: [{"salesOrderNo": message.message.salesOrderNo}, {"ncs.transNo": message.message.ncData[0].transNo}]}, {"ncs.$": message.message.ncData[0]}, function (data) {
            message.message = message.message.ncData[0].transNo;
            message.status = "Success";
            callback(message);
        });
    }
}

exports.saveNcDetailsSchedular = function (openSessions) {

    mongo.findDocumentFields("Sequences", {}, {"_id": false}, function (sequences) {
        var transNo = sequences[0].transNo;
        sequences[0].transNo = sequences[0].transNo + 1;
        mongo.updateDocumentWhole('Sequences', {'transNo': transNo}, sequences[0], function () {});

        var ncs = [{
                "customerName": "TASNEE (NATIONAL INDUSTRIALIZATION COMPANY)",
                "startDate": "2017-02-03T18:30:00.000Z",
                "dueDateOfAction": "2017-02-04T18:30:00.000Z",
                "revisedBookedEtd": "2017-02-06T10:43:02.000Z",
                "carrierId": "12",
                "shipperNo": "34",
                "verifiedBy": "D",
                "actionBy": "Scheduler",
                "actionDate": "2017-02-26T18:30:00.000Z",
                "implementationDate": "2017-02-27T18:30:00.000Z",
                "complaintDescription": "Description",
                "rootCause": "No",
                "correctiveAction": "Action",
                "costIncurred": "0",
                "selectNcCurrency": "CAD",
                "bill": "C",
                "transNo": transNo,
                "ncParty": "B",
                "ncType": "BANK INACCURATE DOCS"
            }];

        console.log(ncs);
        mongo.updateArrayDocument("SalesOrder", {"salesOrderNo": 2103}, {"ncs": {$each: ncs}}, function (result, query, setvalues) {
            mongo.findDocumentFields("SalesOrder", {"salesOrderNo": 2103}, {"_id": false}, function (data) {
                var message = {
                    "action": 'showNCDetailsScheduler',
                    "message": data[0],
                    "status": "Success"
                }
                for (var i in openSessions) {
                    if (openSessions[i].userName === "Demo") {
                        console.log("saveNcDetailsSchedular", message);
                        mongo.sendWsMessage(openSessions[i].connection, message);
                    }
                }
            });
        });
    });
}

exports.deleteNCDetails = function (message, callback) {
    console.log("In deleteNCDetails ", message);
    mongo.findDocumentFields("SalesOrder", {'salesOrderNo': message.message.salesOrderNo}, {"ncs": true, "_id": true}, function (data) {
//        console.log("Ncs data in deleteNCDetails*******s", data[0].ncs);
//        console.log("Total Length of an array", data[0].ncs.length);
        var index = data[0].ncs.length - 1;
        var selectedRecord = data[0].ncs[index];
//        console.log("Last NC object is ", selectedRecord);
        var removeStorageObj = {
            "ncs": selectedRecord
        }
        mongo.updateArrayDocumentPull("SalesOrder", {'salesOrderNo': message.message.salesOrderNo}, removeStorageObj, function (err, result) {
        });
        message.status = "Success";
        callback(message);
    });
};

//For container

exports.findContainerHandler = function (message, callback) {
//    console.log("findContainerHandler: @@@@@", message);
    // mongo.updateArrayDocument("SalesOrder", {"salesOrderNo": message.message.salesOrderNo}, {"containers": {$each: message.message.containerData}}, function (result, query, setvalues) {
//    console.log("updateArrayDocument : message.message ", message.message.salesOrderNo, message.message.containerData);
    mongo.findDocumentFields("SalesOrder", {"salesOrderNo": message.message.salesOrderNo}, {"containers": true, "_id": false}, function (data) {
        message.message = data;
//        console.log("findContainerHandler : message.message ", data);
        message.status = "Success";
        callback(message);
    });
    // });
}

exports.addContainerHandler = function (message, callback) {
//    console.log("Inside addContainerHandler : ", message);
    mongo.updateArrayDocument("SalesOrder", {"salesOrderNo": message.message.salesOrderNo}, {"containers": {$each: message.message.containerData}}, function (result, query, setvalues) {
//        console.log("addContainerHandler", message.message.containerData, message.message.salesOrderNo);
        mongo.findDocument("SalesOrder", {"salesOrderNo": message.message.salesOrderNo}, function (data) {
            message.status = "Success";
            message.action = "findContainer";
            callback(message);
            // mongo.sendWsMessage(connection, message);
        });
    });
}

exports.updateContainerHandler = function (message, callback) {
    // var container = message.message.containerData.SN
    mongo.updateOldArrayDocument1("SalesOrder", {$and: [{"salesOrderNo": message.message.salesOrderNo}, {"containers.sn": message.message.containerData.sn}]}, {"containers.$": message.message.containerData}, function (result, query, setvalues) {
//        console.log("updateContainerHandler", message.message.containerData, message.message.salesOrderNo);
        //  mongo.findDocument("SalesOrder",  {"salesOrderNo": message.message.salesOrderNo}, function (data) {
        //    message.status = "Success";
        //    message.action = "findContainer";
        //    callback(message);
        //  });
    });
}
exports.deleteContainerHandler = function (message, callback) {
//    console.log("In deleteContainerHandler ", message);
    mongo.findDocumentFields("SalesOrder", {'salesOrderNo': message.message.salesOrderNo}, {"containers": true, "_id": false}, function (data) {
//        console.log("Container data in deleteContainerHandler*******s", data[0].containers);
//        console.log("Total Length of an array", data[0].containers.length);
        var index = data[0].containers.length - 1;
        var selectedRecord = data[0].containers[index];
//        console.log("@#$%", selectedRecord);
        var removeStorageObj = {
            "containers": selectedRecord
        }
        mongo.updateArrayDocumentPull("SalesOrder", {'salesOrderNo': message.message.salesOrderNo}, removeStorageObj, function (err, result) {
        });
        message.status = "Success";
        callback(message);
    });
}

exports.saveContainerHandler = function (message, callback) {
//    console.log("Inside saveContainerHandler: Message", message);
//    console.log("message.message: vgmData", message.message.vgmData);
//    console.log("message.message: productDetails", message.message.productDetails);
    mongo.updateDocument("SalesOrder", {"salesOrderNo": message.message.salesOrderNo}, message.message.vgmData, function (data) {
//        console.log("Container Data ", data);
        message.status = data.length == 1 ? "Success" : "Fail";
        callback(message);
    });
}

// For MarkingsDetails
exports.saveMarkingsDetails = function (message, callback) {
    mongo.updateDocument("SalesOrder", {"salesOrderNo": message.message.salesOrderNo}, message.message.markingData, function (data) {
        message.status = data.length == 1 ? "Success" : "Fail";
        callback(message);
    });
}
// For DocsDetails
exports.saveDocsDetails = function (message, callback) {
    mongo.updateDocument("SalesOrder", {"salesOrderNo": message.message.salesOrderNo}, message.message.docsData, function (data) {
        message.status = data.length == 1 ? "Success" : "Fail";
        callback(message);
    });
}
