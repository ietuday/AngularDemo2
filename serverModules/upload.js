var mongo = require('./mongo.js');
var salesOrder = require('./salesOrder.js');
var multiparty = require('multiparty')
var util = require('util')
var fs = require('fs')

exports.downloadFile = function (req, res) {
  console.log("req.params.fileName", req.params.fileName);
  var fileName = req.params.fileName;
  var re = /(?:\.([^.]+))?$/;
  var fileExtension = re.exec(fileName)[1];
  console.log(fileExtension);

  if (fileExtension == 'xlsx') {
    console.log("Inside xlsx")
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  } else if (fileExtension == 'xls') {
    console.log("Inside xls")
    res.setHeader('Content-Type', 'application/vnd.ms-excel');
  } else if (fileExtension == 'pptx') {
    console.log("Inside pptx")
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.presentationml.presentation');
  } else if (fileExtension == 'ppt') {
    console.log("Inside ppt")
    res.setHeader('Content-Type', 'application/vnd.ms-powerpoint');
  } else if (fileExtension == 'docx') {
    console.log("Inside docx")
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
  } else if (fileExtension == 'doc') {
    console.log("Inside doc")
    res.setHeader('Content-Type', 'application/msword');
  } else if (fileExtension == 'pdf') {
    console.log("Inside pdf")
    res.setHeader('Content-Type', 'application/pdf');
  }

  mongo.getBucket((bucket) => {
    bucket.openDownloadStreamByName(fileName).
    on('error', (error) => {
      assert.ifError(error);
    }).
    on('finish', () => {
      console.log('done!');
    }).
    on('data', (chunk) => {
      console.log("chunk", chunk);
        res.write(chunk);
        setTimeout(() => {
          res.end();
        },10);
    }).resume();
  });
}

exports.uploadFile = function (req, res) {
    console.log("******* uploadFile *********");
    console.log("uploadFile", req.body);

    var count = 0;
    var formData = {};
    var fileData;
    var form = new multiparty.Form();
    var bucket;

    // Errors may be emitted
    // Note that if you are listening to 'part' events, the same error may be
    // emitted from the `form` and the `part`.
    form.on('error', function (err) {
        console.log('Error parsing form: ' + err.stack);
    });

    // Parts are emitted when parsing the form
    form.on('part', function (part) {
        // You *must* act on the part by reading it
        // NOTE: if you want to ignore it, just call "part.resume()"

        if (!part.filename) {
            // filename is not defined when this is a field and not a file
            // get field's content
            part.on('data', function (chunk) {
                console.log(part.name, chunk.toString('utf8'));
                formData[part.name] = chunk.toString('utf8');
            });
            part.resume();
        }

        if (part.filename) {
            // filename is defined when this is a file
            count++;
            console.log('got file named ' + part.name);
            // get file's content here
            part.pipe(bucket.openUploadStream(part.filename));
            fileData = part;
            part.resume();
        }

        part.on('error', function (err) {
            // decide what to do
        });
    });

    // Close emitted after form parsed
    form.on('close', function () {
        console.log('Upload completed!');
        // Insert data
        if (formData.actionName == 'saveSalesOrderDocument') {
            salesOrder.saveSalesOrderDocument(formData.data, function (isSuccess) {
                res.write(isSuccess ? 'Received ' + count + ' files' : 'Error in saving ' + count + ' files');
                res.end();
            });
        } else {
            console.log("Unhandled ", formData.actionName);
        }

    });

    mongo.getBucket((b) => {
        bucket = b;
        // Parse req
        form.parse(req);
    });
}
