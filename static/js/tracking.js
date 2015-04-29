var INTERACTION_TYPE = {
    DROP: 'DROP',	//DROP A BLOCK
    RENAME: 'RENAME',    //Rename
    BUTTON_PRESS: 'BUTTON_PRESS',    //Click on buttons
    RUN_SCRIPT: 'RUN_SCRIPT',    //User left-click on a script to run
    DELETE: 'DELETE', //User delete a block/script
};

var POSITION = {
	ON: 'ON',
	UNDER: 'UNDER',
	ABOVE: 'ABOVE',
	INTO: 'INTO'
}

var TARGET = {
	SCRIPTING_AREA :'SCRIPTING_AREA'
}

CommandBlockMorph.prototype.getBlockXML = function(){
    var xml ='';
    var ide = this.parentThatIsA(IDE_Morph);
    if(this instanceof CommandBlockMorph){
        var cpy = this.fullCopy();
        if(this.nextBlock()){
            var nb = cpy.nextBlock();    
            if (nb) {nb.destroy();}
        }
        xml = cpy.toBlockXML(ide.serializer);
        cpy.destroy();
    }
    return xml;
}

CommandBlockMorph.prototype.getBlockSequenceXML = function(){
    var ide = this.parentThatIsA(IDE_Morph);
    return ide.serializer.serialize(this);
};



CommandBlockMorph.prototype.getBlockXML = function(){
    var xml ='';
    ide = global_ide;
    if(this instanceof CommandBlockMorph){
        var cpy = this.fullCopy();
        if(this.nextBlock()){
            var nb = cpy.nextBlock();    
            if (nb) {nb.destroy();}
        }
        xml = cpy.toBlockXML(ide.serializer);
        cpy.destroy();
    }
    return xml;
}
ReporterBlockMorph.prototype.getBlockXML = function(){
    var xml ='';
    ide = global_ide;
    // var ide = this.parentThatIsA(IDE_Morph);    
    xml = ide.serializer.serialize(this);
    return xml;
}

HandMorph.prototype.drop = function () {
    var target, morphToDrop;
    if (this.children.length !== 0) {
        morphToDrop = this.children[0];
        target = this.dropTargetFor(morphToDrop);
        this.changed();
        target.add(morphToDrop);
        morphToDrop.changed();
        morphToDrop.removeShadow();
        this.children = [];
        this.setExtent(new Point());
        if (morphToDrop.justDropped) {
            morphToDrop.justDropped(this);
        }
        if (target.reactToDropOf) {
            target.reactToDropOf(morphToDrop, this);
        }
        this.dragOrigin = null;
    }
    //custom tracking
    trackingDropEvent(morphToDrop, target);

};


function trackingDropEvent(grab, target){
	try{
    	if (grab instanceof ReporterBlockMorph){
    		send_message_to_parent(MESSAGES_TYPE.TRACKING, {'type':INTERACTION_TYPE.DROP, block: grab.getBlockXML(), position:POSITION.INTO, target: target.lastDropTarget.getBlockXML()});
    	}

    	if (grab instanceof CommandBlockMorph){

    	    //place on top of a block
    	    if (grab.topBlock() == grab){
    	        if(grab.nextBlock()){
    	            var dropTarget = grab.nextBlock();
    	            if(dropTarget instanceof CommandBlockMorph){
    	            	send_message_to_parent(MESSAGES_TYPE.TRACKING, {'type':INTERACTION_TYPE.DROP, block: grab.getBlockXML(), position:POSITION.ABOVE, target: dropTarget.getBlockXML()});
    	            } 
    	        } else if(!dropTarget && target instanceof ScriptsMorph){
    	        	send_message_to_parent(MESSAGES_TYPE.TRACKING, { 'type': INTERACTION_TYPE.DROP, 'block': grab.getBlockXML(), 'position': POSITION.ON, 'target': TARGET.SCRIPTING_AREA});
    	        }
    	    }
    	    else {
    	    //place bottom of a block
    	        var dropTarget = grab.parent;
    	        if(dropTarget instanceof CommandBlockMorph){
    	            send_message_to_parent(MESSAGES_TYPE.TRACKING, {'type':INTERACTION_TYPE.DROP, block: grab.getBlockXML(), position:POSITION.UNDER, target: dropTarget.getBlockXML()});
    	        }
    	    }    
    	}
    }catch(e){}
}


/***********Track Rename*******************/
ReporterBlockMorph.prototype.mouseClickLeft = function (pos) {
    var newSpec;
    var isRing;
    if (this.parent instanceof BlockInputFragmentMorph) {
        return this.parent.mouseClickLeft();
    }
    if (this.parent instanceof TemplateSlotMorph) {
        isRing = this.parent.parent && this.parent.parent.parent &&
            this.parent.parent.parent instanceof RingMorph;
        new DialogBoxMorph(
            this,
            function(input){
                trackingRename(this.blockSpec, input);  //custom tracking
                this.setSpec(input);
            },
            this
        ).prompt(
            isRing ? "Input name" : "Script variable name",
            this.blockSpec,
            this.world()
        );
    } else {
        ReporterBlockMorph.uber.mouseClickLeft.call(this, pos);
    }
};

function trackingRename(oldName, newName){
    send_message_to_parent(MESSAGES_TYPE.TRACKING, {'type':INTERACTION_TYPE.RENAME, 'from': oldName, 'to': newName});
}

/*********Track Run Script********************/
BlockMorph.prototype.mouseClickLeft = function () {
    var top = this.topBlock(),
        receiver = top.receiver(),
        stage;
    if (top instanceof PrototypeHatBlockMorph) {
        return top.mouseClickLeft();
    }
    if (receiver) {
        trackingRunScriptEvent(top.getBlockSequenceXML());  //custom tracking
        stage = receiver.parentThatIsA(StageMorph);
        if (stage) {
            stage.threads.toggleProcess(top);
        }
    }
};

function trackingRunScriptEvent(script){
    send_message_to_parent(MESSAGES_TYPE.TRACKING, {'type':INTERACTION_TYPE.RUN_SCRIPT, 'script': script});
}

/*********Track Button Press********************/

var BUTTON_TYPE = {
    START: "START"
};

IDE_Morph.prototype.pressStart = function () {
    if (this.world().currentKey === 16) { // shiftClicked
        this.toggleFastTracking();
    } else {
        this.runScripts();
        trackingButtonPressEvent(BUTTON_TYPE.START); //custom tracking
    }
};

function trackingButtonPressEvent(buttonName){
    send_message_to_parent(MESSAGES_TYPE.TRACKING, {'type':INTERACTION_TYPE.BUTTON_PRESS, 'button_name': BUTTON_TYPE.START});
}

/*********Track Delete********************/
CommandBlockMorph.prototype.userDestroy = function () {
    trackingDeleteEvent(this.getBlockXML());  //custom tracking
    if (this.nextBlock()) {
        this.userDestroyJustThis();
        return;
    }
    var cslot = this.parentThatIsA(CSlotMorph);
    this.destroy();
    if (cslot) {
        cslot.fixLayout();
    }
};

function trackingDeleteEvent(deletedBlock){
    send_message_to_parent(MESSAGES_TYPE.TRACKING, {'type':INTERACTION_TYPE.DELETE, 'target': deletedBlock});
}