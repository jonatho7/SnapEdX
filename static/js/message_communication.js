/**
 * Created by vivek bharath akupatni on 4/24/15.
 */



/*
    Determines if the Snap content is loaded as Iframe or or as main window.

    Message layer needs to be setup if Snap content is loaded as iframe.
 */

function inIframe () {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}

var loaded_as_iframe = false;

var function_callbacks = {};

var MESSAGES_TYPE = {
    SUBMIT: 'SUBMIT' //Used for communication of submit option

};


$(document).ready(function(){
	if (inIframe() == true) {
        console.log("Loaded as iframe");
        loaded_as_iframe = true;

        // Register callback to start receiving messages
        var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
	    var eventer = window[eventMethod];
	    var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

	    // Listen to message from child window
	    eventer(messageEvent,function(e) {
  		    var msg = e.data;
            console.log('Received message from parent:  ', msg.type, ' data = ', msg.data);
            // Call the function references only if object contains 'type' and 'data fields
            if (msg.type in function_callbacks) {
                console.log("Present type = ", msg.type);
            } else {
                console.log(" Not present ", msg.type);
            }
            if ((msg.type in function_callbacks) && ('data' in msg)) {
                // Call all the registered function handlers
                console.log("len = ", function_callbacks[msg.type].length);
                for (var i = 0 ; i < function_callbacks[msg.type].length; i++) {
                    function_callbacks[msg.type][i](msg.data)
                }
            }

	    },false);

        // Just for testing (listen to Submit buttons)
        register_callback(MESSAGES_TYPE.SUBMIT, function (data) { console.log("Printing the data = "+ data)});
        //console.log(function_callbacks[MESSAGES_TYPE.SUBMIT])

    } else {
        console.log("Loaded as main window");
    }

});



function register_callback(type, func) {
    if ((loaded_as_iframe) && (type in MESSAGES_TYPE) && func) {
        if (!(type in function_callbacks)) {
            /* Message is not present so add it */
            function_callbacks[type]  = []
        }
        function_callbacks[type].push(func);
    }
}


function send_message_to_parent(type, data) {
    if ((loaded_as_iframe) && (type in MESSAGES_TYPE)) {
        // Message is only sent if snap is loaded as iframe
        var message = {
            type: type,
            data: data
        };
        console.log("Sending message of type " + type);
        parent.postMessage(message, '*');
    }
}


