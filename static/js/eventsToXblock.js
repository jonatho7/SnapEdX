/**
 * Created by vivekbharathakupatni on 4/25/15.
 */

var send_watched_event_time = 10 * (1000);

function sendWatchedEvent() {

    send_message_to_parent(MESSAGES_TYPE.WATCHED, {})
}

$(document).ready(function() {

    setTimeout(sendWatchedEvent, send_watched_event_time);

    // Just register callback for handing "submit" button event from Xblock
    register_callback(MESSAGES_TYPE.SUBMIT, handle_submit_event_from_xblock);

});


function handle_submit_event_from_xblock(data) {
    console.log("Received submit event from xblock. Calling startStudentTests() to start the tests");
    startStudentTests();
}