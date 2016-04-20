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

writer.send('topic1', msg, function (err) {
    if (err) {
        return console.log(err);
    }

    console.log('Msg sent!');
});

for (var i = 0; i < 5; i++) {
    setTimeout((function (i) {
        var msg = {
            name: 'kostuyn',
            body: i
        };
        return function () {
            writer.send('topic1', msg, function (err) {
                if (err) {
                    return console.log(err);
                }

                console.log('Msg sent!');
            });
        };
    })(i), 1000)
}

reader.listen('topic1', 'channel1', function (err, message) {
    if (err) {
        return console.log(err);
    }

    message.finish(function(err){
        if (err) {
            return console.log(err);
        }

        console.log('FINISH OK!');
    });

    //setTimeout(function(){
    //    message.finish();
    //}, 1000);
    console.log('LISTEN:');
    console.log(message);
});


