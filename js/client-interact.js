function keyboard(sockjs) {
    KeyboardJS.on('shift', function () {
        sockjs.send('+accelerate');
    }, function () {
        sockjs.send('-accelerate');
    });

    KeyboardJS.on('space', function () {
        sockjs.send('+stop');
    }, function () {
        sockjs.send('-stop');
    });

    KeyboardJS.on('a', function () {
        sockjs.send('+left');
    }, function () {
        sockjs.send('-left');
    });

    KeyboardJS.on('d', function () {
        sockjs.send('+right');
    }, function () {
        sockjs.send('-right');
    });

    KeyboardJS.on('w', function () {
        sockjs.send('+up');
    }, function () {
        sockjs.send('-up');
    });

    KeyboardJS.on('s', function () {
        sockjs.send('+down');
    }, function () {
        sockjs.send('-down');
    });
}