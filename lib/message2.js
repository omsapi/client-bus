var shortid = require('shortid');
var Protocol = require('./socket-protocol');

function Message(socket) {
    this._protocol = new Protocol(socket);
}

Message.prototype.send = function (methodName) {
    var self = this;
    var params = getSendParams(arguments);
    var id = shortid.generate();
    var msg = {
        id: id,
        data: params.args
    };

    self._protocol.once(Protocol.RESPONSE, function (msg) {
        var args = [msg.err].concat(msg.data);
        params.callback.apply(this, args);
    });

    self._protocol.send(Protocol.REQUEST, methodName, msg);
};

Message.prototype.listen = function (methodName) {
    var self = this;
    var params = getListenParams(arguments);

    self._protocol.on(methodName, function (msg) {
        var callback = function () {
            var args = [].slice.call(arguments, 1);
            var err = arguments[0];

            var respMsg = {
                id: msg.id,
                data: args,
                err: err
            };

            self._protocol.send(Protocol.RESPONSE, methodName, respMsg);
        };

        var args = msg.data.concat(callback);

        params.callback.apply(this, args);
    });
};

function getSendParams(args) {
    var callbackPos = args.length - 1;
    return {
        args: [].slice.call(args, 1, callbackPos),
        callback: args[callbackPos]
    };
}

function getListenParams(args) {
    var callbackPos = args.length - 1;
    return {
        args: [].slice.call(args, 1),
        callback: args[callbackPos]
    };
}

module.exports = Message;