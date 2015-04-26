/**
 * Created by vivekbharathakupatni on 4/25/15.
 */

var send_watched_event_time = 10 * (1000);
function sendWatchedEvent() {

    send_message_to_parent(MESSAGES_TYPE.WATCHED, {})
}

$(document).ready(function() {

    setTimeout(sendWatchedEvent, send_watched_event_time);

});
