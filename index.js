/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var http = require('http');
var server = http.createServer();
var url = require('url')
var fs = require('fs')
var path = require('path')
var baseDirectory = __dirname   // or whatever base directory you want
var port = 9615

http.createServer(function (request, response) {
    try {
        response.setHeader("access-control-allow-origin", '*');
        response.setHeader("Access-Control-Allow-Methods", 'GET,POST,OPTIONS,DELETE');
        var requestUrl = url.parse(request.url, true);
        var requestdata = path.basename(requestUrl.pathname);
        if (request.method === "GET") {
            switch (requestdata) {
                case "users":
                    if(requestUrl.query.email!=null && requestUrl.query.email!='undefined'){
                    findDocument(response,requestUrl.query.email);
                    }else{
                    findDocuments(response);
                    }
                    break;
                default:
                    response.writeHead(500)
                    response.end()     // end the response so browsers don't hang
                    break;
            }
        } else if (request.method === "DELETE") {
            switch (requestdata) {
                case "users":
                    var email = requestUrl.query.email;
                    borraUsuario(email);
                    response.writeHead(202);
                    response.end();
                    break;
                default:
                    response.writeHead(500)
                    response.end()     // end the response so browsers don't hang
                    break;
            }

        } else if (request.method === "OPTIONS") {
            if (request.headers['access-control-request-method'] === 'DELETE') {
                response.writeHead(200);
                response.end();
            }
        }

    } catch (e) {
        response.writeHead(500)
        response.end()     // end the response so browsers don't hang
    }
}).listen(port)

var createConection = function (callback) {
    var MongoClient = require('mongodb').MongoClient
            , assert = require('assert');
// Connection URL
    var url = 'mongodb://localhost:27017/TaxiShare';
// Use connect method to connect to the server
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        callback(db);
        db.close();
    });
}
var findDocuments = function (response) {
    createConection(function (db) {

        var collection = db.collection('user');
        // Find some documents
        collection.find({}).toArray(function (err, docs) {
//    assert.equal(err, null);

            muestraJsonUsuarios(docs, response);
        });
        // Get the documents collection
    });
}
var findDocument = function (response,email) {
    createConection(function (db) {

        var collection = db.collection('user');
        // Find some documents
        collection.findOne({email:email},function (err, doc) {
//    assert.equal(err, null);

            muestraJsonUsuarios({name:doc.name,email:doc.email}, response);
        });
        // Get the documents collection
    });
}
var muestraJsonUsuarios = function (users, response) {
    response.writeHead(200, {"Content-Type": "application/json"});
    var json = JSON.stringify(users);
    response.end(json);
}
var borraUsuario = function (email) {
    createConection(function (db) {

        var collection = db.collection('user');
        // Find some documents
        collection.deleteOne({email: email}, function (err, result) {});
        // Get the documents collection
    });
}