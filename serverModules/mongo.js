var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;

// var url = process.env.MONGODB_URI || 'mongodb://192.168.10.43:27017/elite';
 var url = process.env.MONGODB_URI || 'mongodb://192.168.10.134:27017/EliteDemo';
//var url = 'mongodb://localhost:27017/EliteDemo';

function atob(s) {
    return new Buffer(s, 'base64').toString();
}

function btoa(s) {
    return new Buffer(s).toString('base64');
}

exports.sendWsMessage = function (connection, message) {
//     console.log("message inside sendWsMessage",message)
    try {
        message.source = 'mongoClient';
        connection.send(btoa(JSON.stringify(message)), function ack(error) {
            if (error !== undefined) {
                console.log("Error sending data", JSON.stringify(message), error);
            }
        });
    } catch (e) {
        console.log("Error sending data", JSON.stringify(message));
    }
};

exports.findDocument = function (collname, query, callback) {
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        db.collection(collname)
                .find(query).toArray(function (err, result) {
            if (err) {
                console.log(err)
                if (JSON.stringify(err).indexOf('timed out') === -1) {
                    assert.equal(err, null);
                }
            }
            callback(result);
            db.close();
        });
    });
};

exports.findDocumentFields = function (collname, query, fields, callback) {
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        db.collection(collname)
                .find(query, fields).toArray(function (err, result) {
            if (err) {
                console.log(err);
                if (JSON.stringify(err).indexOf('timed out') === -1) {
                    assert.equal(err, null);
                }
            }
            callback(result);
            db.close();
        });
    });
};

exports.findDocumentFieldsLimit = function (collname, query, fields, limit, callback) {
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        db.collection(collname)
                .find(query, fields).limit(limit).toArray(function (err, result) {
            if (err) {
                console.log(err);
                if (JSON.stringify(err).indexOf('timed out') === -1) {
                    assert.equal(err, null);
                }
            }
            callback(result);
            db.close();
        });
    });
};

exports.findDocumentFieldsLimitReverse = function (collname, query, fields, limit, callback) {
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        db.collection(collname)
                .find(query, fields).sort({$natural: -1}).limit(limit).toArray(function (err, result) {
            if (err) {
                console.log(err);
                if (JSON.stringify(err).indexOf('timed out') === -1) {
                    assert.equal(err, null);
                }
            }
            callback(result);
            db.close();
        });
    });
};

exports.findDocumentSort = function (collname, query, sort, direction, callback) {
    // console.log("sort#######",sort,direction)
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        db.collection(collname)
                .find(query).sort(sort).toArray(function (err, result) {
            if (err) {
                console.log(err);
                if (JSON.stringify(err).indexOf('timed out') === -1) {
                    //  assert.equal(err, null);
                }
            }
            callback(err, result);
            db.close();
        });
    });
};

exports.findDocumentSortMsg = function (collname, query, sort, direction, callback) {
    // console.log("sort#######",sort,direction)
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        db.collection(collname)
                .find(query).sort({'sortLevel': -1}).toArray(function (err, result) {
            if (err) {
                console.log(err);
                if (JSON.stringify(err).indexOf('timed out') === -1) {
                    //assert.equal(err, null);
                }
            }
            callback(err, result);
            db.close();
        });
    });
};

exports.updateArrayDocumentPull = function (collname, query, pushObj, callback) {
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        db.collection(collname)
                .update(query, {$pull: pushObj}, {"$upsert": true}, function (err, result) {
                    if (err) {
                        console.log(err);
                        if (JSON.stringify(err).indexOf('timed out') === -1) {
                            assert.equal(err, null);
                        }
                    }
                    // console.log(" Inserted object into Array", result, err);
                    callback(err, result);
                    db.close();
                });
    });
};

exports.updateArrayDocument = function (collname, query, pushObj, callback) {
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        db.collection(collname)
                .update(query, {$push: pushObj}, {"$upsert": true}, function (err, result) {
                    if (err) {
                        console.log(err);
                        if (JSON.stringify(err).indexOf('timed out') === -1) {
                            assert.equal(err, null);
                        }
                    }
                    // console.log(" Inserted object into Array", result, err);
                    callback(err, result);
                    db.close();
                });
    });
};

exports.updateDocument = function (collname, query, setValues, callback) {
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        db.collection(collname)
                .updateOne(query, {$set: setValues}, function (err, result) {
                    if (err) {
                        console.log(err);
                        if (JSON.stringify(err).indexOf('timed out') === -1) {
                            assert.equal(err, null);
                        }
                    }
                    // console.log("Updated a document into the " + collname + " collection.", result, err);
                    callback(result, query, setValues);
                    db.close();
                });
    });
};

exports.updateDocumentUpsert = function (collname, query, setValues, callback) {
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        db.collection(collname)
                .updateOne(query, {$set: setValues}, {"$upsert": true}, function (err, result) {
                    if (err) {
                        console.log(err);
                        if (JSON.stringify(err).indexOf('timed out') === -1) {
                            assert.equal(err, null);
                        }
                    }
                    // console.log("Updated a document into the " + collname + " collection.", result, err);
                    callback(result, query, setValues);
                    db.close();
                });
    });
};

exports.updateDocumentWhole = function (collname, query, obj, callback) {
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        db.collection(collname)
                .updateOne(query, obj, function (err, result) {
                    if (err) {
                        console.log(err);
                        if (JSON.stringify(err).indexOf('timed out') === -1) {
                            assert.equal(err, null);
                        }
                    }
                    // console.log("Updated a document into the " + collname + " collection.", result, err);
                    callback(result, query, obj);
                    db.close();
                });
    });
};

exports.insertDocument = function (collname, insObj, callback) {
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        db.collection(collname)
                .insertOne(insObj, function (err, result) {
                    if (err) {
                        console.log(err);
                        if (JSON.stringify(err).indexOf('timed out') === -1) {
                            assert.equal(err, null);
                        }
                    }
                    // console.log("Inserted a document into the " + collname + " collection.", result, err);
                    callback(err, result);
                    db.close();
                });
    });
};

// CHECK: Call to saveTxn need to be replaced by caller to insertDocument
exports.saveTxn = function (collname, usersObj, callback) {
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        exports.insertDocument(db, collname, usersObj, function (err, result) {
            callback(err, result);
            db.close();
        });
    });
};

exports.updateOldArrayDocument = function (collname, query, updateObject, callback) {
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        db.collection(collname)
                .updateMany(query, {$set: updateObject}, function (err, result) {
                    if (err) {
                        console.log(err);
                        if (JSON.stringify(err).indexOf('timed out') === -1) {
                            assert.equal(err, null);
                        }
                    }
                    // console.log(" Updated object into Array", result, err);
                    callback(err, result);
                    db.close();
                });
    });
};

// CHECK: why 1? Is it because assert is removed and if yes, why? why to proceed if MongoClient connection is not asserted?
exports.updateOldArrayDocument1 = function (collname, query, updateObject, callback) {
    MongoClient.connect(url, function (err, db) {
        // assert.equal(null, err);
        db.collection(collname)
                .updateOne(query, {$set: updateObject}, function (err, result) {
                    if (err) {
                        console.log(err);
                        if (JSON.stringify(err).indexOf('timed out') === -1) {
                            assert.equal(err, null);
                        }
                    }
                    // console.log(" Updated object into Array", result, err);
                    callback(query, err, result);
                    db.close();
                });
    });
};

// saveStorageTxn, saveNotificationTxn are getting replaced by the below function
exports.upsertArrayDocument = function (collection, query, uploadObject, callback) {
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        db.collection(collection)
                .update(query, {$push: uploadObject}, {"$upsert": true}, function (err, result) {
                    if (err) {
                        console.log(err);
                        if (JSON.stringify(err).indexOf('timed out') === -1) {
                            assert.equal(err, null);
                        }
                    }
                    callback(result);
                    db.close();
                });
    });
};

// Generate unique ID based on date
exports.generateMsgId = function () {
    var date = new Date();
    var yyyy = date.getFullYear();
    var mm = date.getMonth() < 9 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1);
    var dd = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    var rand = Math.floor(100000 + Math.random() * 900000);
    var milisec = date.getMilliseconds();
    return "".concat(yyyy).concat(mm).concat(dd).concat(milisec).concat(rand);
};

exports.updateDocumentForQuestion = function (collname, query, setValues, callback) {
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        db.collection(collname)
                .updateMany(query, setValues, function (err, result) {
                    if (err) {
                        console.log(err);
                        if (JSON.stringify(err).indexOf('timed out') === -1) {
                            assert.equal(err, null);
                        }
                    }
                    callback(result, query, setValues);
                    db.close();
                });
    });
};

exports.findArticles = function (collname, query, callback) {
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        db.collection(collname)
                .find(query).sort({"_id": -1}).toArray(function (err, result) {
            if (err) {
                console.log(err);
                if (JSON.stringify(err).indexOf('timed out') === -1) {
                    assert.equal(err, null);
                }
            }
            callback(result);
            db.close();
        });
    });
};

exports.getObjectId = function (id) {
    return ObjectId(id);
};

// exports.getObjectId = function(id) {
//   return ObjectId(id);
// }

exports.deleteDocument = function (collname, obj, callback) {
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        db.collection(collname).deleteOne(obj, function (err, result) {
            if (err) {
                console.log(err);
                if (JSON.stringify(err).indexOf('timed out') === -1) {
                    assert.equal(err, null);
                }
            }
            callback(err, result);
            db.close();
        });
    });
};

exports.updateArrayDocumentPull = function (collname, query, pushObj, callback) {
   MongoClient.connect(url, function (err, db) {
       assert.equal(null, err);
       db.collection(collname)
               .update(query, {$pull: pushObj}, {"$upsert": true}, function (err, result) {
                   if (err) {
                       console.log(err)
                       if (JSON.stringify(err).indexOf('timed out') === -1) {
                           assert.equal(err, null);
                       }
                   }
                   // console.log(" Inserted object into Array", result, err);
                   callback(err, result);
                   db.close();
               });
   });
}

exports.getBucket = function (callback) {
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        callback(new mongodb.GridFSBucket(db));
    });
};

exports.findDocumentLimit = function (collname, query, sort, limitValue, callback) {
     console.log("sort#######",sort);
     MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        db.collection(collname)
                .find(query).sort(sort).limit(limitValue).toArray(function (err, result) {
            if (err) {
                console.log(err)
                if (JSON.stringify(err).indexOf('timed out') === -1) {
                    assert.equal(err, null);
                }
            }
            callback(result);
            db.close();
        });
    });
};
