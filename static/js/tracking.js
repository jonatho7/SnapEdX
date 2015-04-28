var INTERACTION_TYPE = {
    DROP: 'DROP',	//DROP A BLOCK
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

/************************* Modification of Original Snap! For Tracking********************/
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


