var net = require('net');
var shortid = require('shortid');
var Q = require('q');

var Message = require('../lib/message2');

function Reader(options) {
    var addresses = options.addresses.split(',');

    this._hosts = addresses.map(function (address) {
        var arr = address.split(':');
        return {
            host: arr[0],
            port: arr[1]
        };
    });
    this._deffered = Q.defer();
    this._clienId = shortid.generate();
}

Reader.prototype.connect = function () {
    var self = this;
    var socket = new net.Socket();
    var host = this._hosts[0].host;
    var port = this._hosts[0].port;

    socket.connect(port, host, function () {
        var message = new Message(socket);
        self._deffered.resolve(message);
    });
};

Reader.prototype.listen = function (topic, channel, callback) {
    var self = this;
    this._deffered.promise
        .then(function (message) {
            message.listen('new-message', function (data, next) {
                next();
                callback(null, data);
            });

            message.send('create-channel', self._clienId, topic, channel, function (err) {
                if (err) {
                    callback(err);
                }
            });
        })
        .catch(function (err) {
            callback(err);
        });
};

module.exports = Reader;