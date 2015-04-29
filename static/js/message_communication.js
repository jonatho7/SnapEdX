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

/*
    This definitions needs to be in sync with messaging_xblock.js file in xblock_snap/static/js
 */
var MESSAGES_TYPE = {
    DEMO:  'DEMO',  // only for demo purposes
    SUBMIT: 'SUBMIT', //Used for communication of submit option
    READY: 'READY',   // Message to indicate that iframe is setup
    WATCHED: 'WATCHED',  // Watched event to parent
    SUBMIT:  'SUBMIT',  // Submit (obviously student submit) event from Xblock
     RESULT:  'RESULT',  // Event to send results from snap to Xblock
     TRACKING: 'TRACKING',   //  Tracking of students' interactions with Snap IDE
     CONFIG: 'CONFIG' //Initial setup  e.g. layout for Snap IDE
};


$(document).ready(function(){
	if (inIframe() == true) {
        console.log("(Snap content) Loaded as iframe");
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
            if ((msg.type in function_callbacks) && ('data' in msg)) {
                // Call all the registered function handlers
                //console.log("len = ", function_callbacks[msg.type].length);
                for (var i = 0 ; i < function_callbacks[msg.type].length; i++) {
                    function_callbacks[msg.type][i](msg.data)
                }
            }

	    },false);

        // Send READY event to parent
        send_message_to_parent(MESSAGES_TYPE.READY, {});
        // Just for testing (listen to Submit buttons)
        register_callback(MESSAGES_TYPE.DEMO, function (data) { console.log("Printing the demo data received from" +
            " main window = ", data)});



        //Just for testing to parent window
        send_message_to_parent(MESSAGES_TYPE.DEMO, { 'from:': 'iframe (snap)', 'to': 'xblock'});

        // Register for custom configuration of Snap IDE
        register_callback(MESSAGES_TYPE.CONFIG, function (data) {
                global_ide.initializeSnapIDE(data);
        });

    } else {
        console.log(" (Snap content) Loaded as main window");
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
        //console.log("Sending message of type " + type);
        parent.postMessage(message, '*');
    }
}





