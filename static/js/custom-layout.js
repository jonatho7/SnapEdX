
IDE_Morph.prototype.customMode = function(){ //later may customize projectButton, settingButton
    this.isAppMode = false;
    ide = global_ide;
    elements = [
            // this.logo,
            this.controlBar.cloudButton,
            this.controlBar.projectButton,
            this.controlBar.settingsButton,
            this.controlBar.stageSizeButton,
            ide.controlBar.appModeButton,

            this.corral,
            this.corralBar,
            // this.spriteEditor,
            this.spriteBar,
            // this.palette,
            // this.categories,
            // this.stage
        ];
    elements.forEach(function (e) {
        e.hide();
    });

    clientHeight = window.innerHeight;
    clientWidth = window.innerWidth;

    // var vertical = true;
    if(this.verticalLayout){
    //stage under scripting area
        ide.spriteEditor.setTop(ide.controlBar.height())
        ide.spriteEditor.setExtent(new Point(clientWidth-this.palette.width(),clientHeight*0.6-this.controlBar.height()))
        ide.stage.setPosition(ide.spriteEditor.bottomLeft())
        ide.stage.setExtent(new Point(clientWidth,clientHeight*0.4))

        //fixlayout of three buttons
        ide.controlBar.stopButton.setRight(ide.spriteEditor.right())
        ide.controlBar.pauseButton.setRight(ide.controlBar.stopButton.left())
        ide.controlBar.startButton.setRight(ide.controlBar.pauseButton.left())
    }else{
        ide.spriteEditor.setTop(ide.controlBar.height())
        ide.spriteEditor.setExtent(new Point(ide.spriteEditor.width(),clientHeight-this.controlBar.height()))
        ide.stage.setPosition(ide.spriteEditor.topRight())
        ide.stage.setExtent(new Point(ide.stage.width(),clientHeight-this.controlBar.height()))

        //fixlayout of three buttons
        ide.controlBar.stopButton.setRight(ide.controlBar.right())
        ide.controlBar.pauseButton.setRight(ide.controlBar.stopButton.left())
        ide.controlBar.startButton.setRight(ide.controlBar.pauseButton.left())
    }

    //stage on the right scripting area


    //customize behavior
    this.controlBar.mouseClickLeft = function () {
        // this.world().fillPage();
    };


};


IDE_Morph.prototype.fixLayout = function (situation) {
    // situation is a string, i.e.
    // 'selectSprite' or 'refreshPalette' or 'tabEditor'
    var padding = this.padding;

    Morph.prototype.trackChanges = false;

    if (situation !== 'refreshPalette') {
        // controlBar
        this.controlBar.setPosition(this.logo.topRight());
        this.controlBar.setWidth(this.right() - this.controlBar.left());
        this.controlBar.fixLayout();

        // categories
        this.categories.setLeft(this.logo.left());
        this.categories.setTop(this.logo.bottom());
    }

    // palette
    this.palette.setLeft(this.logo.left());
    this.palette.setTop(this.categories.bottom());
    this.palette.setHeight(this.bottom() - this.palette.top());

    if (situation !== 'refreshPalette') {
        // stage
        if (this.isAppMode) {
            this.stage.setScale(Math.floor(Math.min(
                (this.width() - padding * 2) / this.stage.dimensions.x,
                (this.height() - this.controlBar.height() * 2 - padding * 2)
                    / this.stage.dimensions.y
            ) * 10) / 10);
            this.stage.setCenter(this.center());
        } else {

            this.stage.setScale(this.isSmallStage ? this.stageRatio : 1);
            this.stage.setTop(this.logo.bottom() + padding);
            this.stage.setRight(this.right());
        }

        // spriteBar
        this.spriteBar.setPosition(this.logo.bottomRight().add(padding));
        this.spriteBar.setExtent(new Point(
            Math.max(0, this.stage.left() - padding - this.spriteBar.left()),
            this.categories.bottom() - this.spriteBar.top() - padding
        ));
        this.spriteBar.fixLayout();

        // spriteEditor
        if (this.spriteEditor.isVisible) {
            this.spriteEditor.setPosition(this.spriteBar.bottomLeft());
            this.spriteEditor.setExtent(new Point(
                this.spriteBar.width(),
                this.bottom() - this.spriteEditor.top()
            ));
        }

        // corralBar
        this.corralBar.setLeft(this.stage.left());
        this.corralBar.setTop(this.stage.bottom() + padding);
        this.corralBar.setWidth(this.stage.width());

        // corral
        if (!contains(['selectSprite', 'tabEditor'], situation)) {
            this.corral.setPosition(this.corralBar.bottomLeft());
            this.corral.setWidth(this.stage.width());
            this.corral.setHeight(this.bottom() - this.corral.top());
            this.corral.fixLayout();
        }
    }

    Morph.prototype.trackChanges = true;
    this.changed();

    this.customMode();  //call custom mode every time there're changes in layout
};