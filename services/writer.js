var net = require('net');
var Q = require('q');
var Message = require('../lib/message2');

function Writer(options) {
    var addresses = options.addresses.split(',');
    this._hosts = addresses.map(function (address) {
        var arr = address.split(':');
        return {
            host: arr[0],
            port: arr[1]
        };
    });
    this._deffered = Q.defer();
}

Writer.prototype.connect = function () {
    var self = this;
    var socket = new net.Socket();
    var host = this._hosts[0].host;
    var port = this._hosts[0].port;

    socket.connect(port, host, function () {
        var message = new Message(socket);
        self._deffered.resolve(message);
    });
};

Writer.prototype.send = function (topic, data, callback) {
    this._deffered.promise
        .then(function (message) {
            message.send('send-data', topic, data, function (err) {
                callback(err);
            });
        })
        .catch(function (err) {
            callback(err);
        });
};

module.exports = Writer;