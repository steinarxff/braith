/*

    Keyboard mapping

 */

function keyboard(websocket) {
    KeyboardJS.on('shift', function () {
        websocket.send('+accelerate');
    }, function () {
        websocket.send('-accelerate');
    });

    KeyboardJS.on('space', function () {
        websocket.send('+stop');
    }, function () {
        websocket.send('-stop');
    });

    KeyboardJS.on('a', function () {
        websocket.send('+left');
    }, function () {
        websocket.send('-left');
    });

    KeyboardJS.on('d', function () {
        websocket.send('+right');
    }, function () {
        websocket.send('-right');
    });

    KeyboardJS.on('w', function () {
        websocket.send('+up');
    }, function () {
        websocket.send('-up');
    });

    KeyboardJS.on('s', function () {
        websocket.send('+down');
    }, function () {
        websocket.send('-down');
    });
}