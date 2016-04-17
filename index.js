var port = process.argv[2];

var Writer = require('./services/client').Writer;
var Reader = require('./services/client').Reader;

var options = {
    addresses: 'localhost:' + port
};

var writer = new Writer(options);
var reader = new Reader(options);

var msg = {
    name: 'kostuyn',
    body: 'my content!!!'
};

writer.connect();
reader.connect();

for (var i = 0; i < 3; i++) {
    writer.send('topic1', msg, function (err) {
        if (err) {
            return console.log(err);
        }

        console.log('Msg sent!');
    });
}


reader.listen('topic1', 'channel1', function (err, message) {
    if (err) {
        return console.log(err);
    }

    console.log(message);
});