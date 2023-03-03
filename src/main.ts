/****************
 * An escape room coded in Phaser.
 * 
 * - Recorder
 * - Rework combination logic
 * - Rework hints
 * -- show question mark when stuck
 * - Changing cursor
 * - Sound
 * - Fireworks on winner screen
 */

import 'phaser';

import Slots from "./objects/slots"
import Recorder from "./objects/recorder"

var currentWall = -1;

const walls = new Array();
const icons = new Array();
const obj = new Array();
const altObj = new Array();
const tableView = new Array();
const closeView = new Array();
const i = new Array();
var viewWall = 4; // TS production is 2
var previousWall = -1;

var invBar: Phaser.GameObjects.Sprite;
var leftButton: Phaser.GameObjects.Sprite;
var rightButton: Phaser.GameObjects.Sprite;
var backButton: Phaser.GameObjects.Sprite;
var plusButton: Phaser.GameObjects.Sprite;
var failed: Phaser.GameObjects.Sprite;

var takeItemMask: Phaser.GameObjects.Sprite;
var viewTableMask: Phaser.GameObjects.Sprite;
var viewDoorMask: Phaser.GameObjects.Sprite;
var objectMask: Phaser.GameObjects.Sprite;
var keyMask: Phaser.GameObjects.Sprite;

var tableState = 0;
var updateWall = false;
var flipIt = false;
var foundHalfKey = false; // enable the key mask when key part is visible
var snagged = false;
var haveHalfKey = false; // don't show key part on plate back if already taken
var doorUnlocked = false;
var egress = false;
var didBonus = false;

var slots: Slots;

var showXtime = -1;
var style: string;

var recorder: Recorder;
var myViewport;
var viewportText: any;                                     //??
var viewportPointer: Phaser.GameObjects.Sprite;
var viewportPointerClick: Phaser.GameObjects.Sprite;
var pointer:Phaser.Input.Pointer;

class PlayGame extends Phaser.Scene {

    constructor() {
        super("PlayGame");
    }
    preload() {
        this.load.image('myViewport', 'assets/backgrounds/viewport.png');
        this.load.image('clckrLoc', 'assets/sprites/pointer.png');
        this.load.image('clckrClk', 'assets/sprites/pointerClicked.png');

        this.load.image('wall1', 'assets/backgrounds/invroom - room - empty.png');
        this.load.image('wall2', 'assets/backgrounds/invroom - room - west.png');
        this.load.image('wall3', 'assets/backgrounds/invroom - room - south.png');
        this.load.image('wall4', 'assets/backgrounds/invroom - room - east.png');
        this.load.image('wallUnlocked', 'assets/backgrounds/invroom - room - unlocked.png');
        this.load.image('wallWinner', 'assets/backgrounds/invroom - room - winner.png');

        walls[0] = "wall1";
        walls[1] = "wall2";
        walls[2] = "wall3";
        walls[3] = "wall4";
        walls[4] = "table";
        walls[5] = "(item view)";
        walls[6] = "(item view alt)";
        walls[7] = "wallUnlocked";
        walls[8] = "wallWinner";

        this.load.image('table', 'assets/backgrounds/invroom - table - empty.png');

        this.load.image('right', 'assets/sprites/arrowRight.png');
        this.load.image('left', 'assets/sprites/arrowLeft.png');
        this.load.image('down', 'assets/sprites/arrowDown.png');
        this.load.image('plus', 'assets/sprites/plus.png');
        this.load.image('fail', 'assets/sprites/fail.png');
        this.load.image('winnerDonut', 'assets/sprites/winner donutPlated.png');

        this.load.image('inventory', 'assets/sprites/inventory cells.png');

        this.load.image('iconEmpty', 'assets/sprites/icon - empty.png');
        this.load.image('iconSelected', 'assets/sprites/icon - selected.png');
        this.load.image('iconSelectedSecond', 'assets/sprites/icon - selectedSecond.png');

        this.load.image('iconDonut', 'assets/sprites/icon - donut.png');
        this.load.image('iconPlate', 'assets/sprites/icon - plate.png');
        this.load.image('iconKeyA', 'assets/sprites/icon - keyA.png');
        this.load.image('iconKeyB', 'assets/sprites/icon - keyB.png');
        this.load.image('iconKeyWhole', 'assets/sprites/icon - keyWhole.png');
        this.load.image('iconDonutPlated', 'assets/sprites/icon - donutPlated.png');

        icons[0] = "iconDonut";
        icons[1] = "iconPlate";
        icons[2] = "iconKeyB";
        icons[3] = "iconKeyA";
        icons[4] = "iconKeyWhole";
        icons[5] = "iconDonutPlated";

        this.load.image('objDonut', 'assets/backgrounds/invroom - obj - donut.png');
        this.load.image('objPlate', 'assets/backgrounds/invroom - obj - plate.png');
        this.load.image('objKeyA', 'assets/backgrounds/invroom - obj - keyA.png');
        this.load.image('objKeyB', 'assets/backgrounds/invroom - obj - keyB.png');
        this.load.image('objKeyWhole', 'assets/backgrounds/invroom - obj - keyWhole.png');
        this.load.image('objDonutPlated', 'assets/backgrounds/invroom - obj - donutPlated.png');

        obj[0] = "objDonut";
        obj[1] = "objPlate";
        obj[2] = "objKeyB";
        obj[3] = "objKeyA";
        obj[4] = "objKeyWhole";
        obj[5] = "objDonutPlated";

        this.load.image('altobjDonut', 'assets/backgrounds/invroom - altobj - donut.png');
        this.load.image('altobjPlateKey', 'assets/backgrounds/invroom - altobj - plate key.png');
        this.load.image('altobjKeyA', 'assets/backgrounds/invroom - altobj - keyA.png');
        this.load.image('altobjKeyB', 'assets/backgrounds/invroom - altobj - keyB.png');
        this.load.image('altobjKeyWhole', 'assets/backgrounds/invroom - altobj - keyWhole.png');
        this.load.image('altobjDonutPlated', 'assets/backgrounds/invroom - altobj - donutPlated.png');

        this.load.image('altobjPlateEmpty', 'assets/backgrounds/invroom - altobj - plate empty.png');
        altObj[0] = "altobjDonut";
        altObj[1] = "altobjPlateKey";
        altObj[2] = "altobjKeyB";
        altObj[3] = "altobjKeyA";
        altObj[4] = "altobjKeyWhole";
        altObj[5] = "altobjDonutPlated";

        this.load.image('tableDonut', 'assets/sprites/tableDonut.png');
        this.load.image('tablePlate', 'assets/sprites/tablePlate.png');
        this.load.image('tableKey', 'assets/sprites/tableKey.png');
        this.load.image('tableEmpty', 'assets/sprites/tableEmpty.png');
        tableView[0] = "tableDonut";
        tableView[1] = "tablePlate";
        tableView[2] = "tableKey";
        tableView[3] = "tableEmpty";

        this.load.image('closeDonut', 'assets/sprites/closeDonut.png');
        this.load.image('closePlate', 'assets/sprites/closePlate.png');
        this.load.image('closeKey', 'assets/sprites/closeKey.png');
        this.load.image('closeEmpty', 'assets/sprites/closeEmpty.png');
        closeView[0] = "closeDonut"
        closeView[1] = "closePlate"
        closeView[2] = "closeKey"
        closeView[3] = "closeEmpty"

        this.load.image('tableMask', 'assets/sprites/tableMask.png');
        this.load.image('takeMask', 'assets/sprites/takeMask.png');
        this.load.image('objectMask', 'assets/sprites/object mask.png');
        this.load.image('keyMask', 'assets/sprites/keyMask.png');
        this.load.image('doorMask', 'assets/sprites/doorMask.png')

        this.load.image('testplateShown', 'assets/sprites/closePlate.png');
        this.load.image('testplateIcon', 'assets/sprites/icon - plate.png');
    }

    create() {
        this.input.on('gameobjectdown', function (pointer:Phaser.Input.Pointer, gameObject:Phaser.GameObjects.GameObject) {
            recorder.recordObjectDown((gameObject as Phaser.GameObjects.Sprite).texture.key);
        });

        /*
        var content = [
            "The sky above the port was the color of television, tuned to a dead channel.",
            "`It's not like I'm using,' Case heard someone say, as he shouldered his way ",
            "through the crowd around the door of the Chat. `It's like my body's developed",
            "this massive drug deficiency.' It was a Sprawl voice and a Sprawl joke."
        ];        
        
        //var graphics = this.make.graphics();
        var graphics = this.add.graphics({
            x: 0,
            y: 0
          });
        // graphics.fillStyle(0xffffff);
        graphics.fillRect(152, 133, 320, 250);
        var mask = new Phaser.Display.Masks.GeometryMask(this, graphics);
        var text = this.add.text(160, 280, content, { fontFamily: 'Arial', color: '#00ff00', wordWrap: { width: 310 } }).setOrigin(0);
        text.setMask(mask);
        text.setDepth(5000)
        */
        
        // Recorder stuff
        myViewport = this.add.image(0, 0, 'myViewport').setOrigin(0, 0);
        viewportPointer = this.add.sprite(1000, 0, 'clckrLoc').setOrigin(0, 0);
        viewportPointerClick = this.add.sprite(1000, 0, 'clckrClk');
        recorder = new Recorder(this.input.activePointer, viewportPointer, viewportPointerClick);
        viewportPointer.setDepth(3001);
        viewportPointerClick.setDepth(3001);
        pointer = this.input.activePointer;        


        slots = new Slots(this, "iconEmpty", "iconSelected", "iconSelectedSecond", recorder);
        slots.displaySlots();
        slots.currentMode = "room";

        invBar = this.add.sprite(0, 1040, 'inventory').setOrigin(0, 0);
        leftButton = this.add.sprite(80, 950, 'left');
        rightButton = this.add.sprite(640, 950, 'right');
        backButton = this.add.sprite(300, 875, 'down').setOrigin(0, 0);
        plusButton = this.add.sprite(80, 950, 'plus');
        failed = this.add.sprite(80, 950, 'fail');

        //  Enables all kind of input actions on this image (click, etc)
        // I tried this for recorder, no dice.
        /*
backButton.inputEnabled = true;
this.position = new Phaser.Point();
backButton.events.onInputDown.add(listener, this);
*/
        rightButton.on('pointerdown', () => {
            viewWall++;
            if (viewWall > 3)
                viewWall = 0;
        });
        leftButton.on('pointerdown', () => {
            viewWall--;
            if (viewWall < 0)
                viewWall = 3;
        });
/*
        //elsewhere
        switch(recordedAction) { 
            case "rightButton": { 
                rightButton.emit('pointerdown');
               break; 
            } 
            case "leftButton": { 
                leftButton.emit('pointerdown'); 
               break; 
            } 
         } 
*/         
         
         
        backButton.on('pointerdown', () => {
            slots.clickIcon("iconDonut");

            if (viewWall == 4)
                viewWall = 0;
            else
                viewWall = previousWall;
            // after recorder fix this!                
            //            slots.clearSecondSelect();
            slots.currentMode = "room";
        });


        plusButton.on('pointerdown', () => {
            console.log("plus button TS");
            plusButton.setVisible(false);
            /*            
            
                        var combineFailed = true;
            
                        // could sort the names and skip the duplicate code...
                        var good1 = "objKeyA"; var good2 = "objKeyB"; var goodNew = 4;
                        if ((slots.inventoryViewObj == good1 && slots.otherViewObj == good2) ||
                            (slots.inventoryViewObj == good2 && slots.otherViewObj == good1)) {
                            
                            slots.combiningItems(this, good1, good2);
                            slots.addIcon(this, icons[goodNew].toString(), obj[goodNew], altObj[goodNew]); // TODO: get name from texture key
                            slots.selectItem(this, obj[goodNew], altObj[goodNew]);
                            combineFailed = false;
                        } else {
                            var good1 = "objDonut"; var good2 = "objPlate"; var goodNew = 5;
                            if (!doorUnlocked)
                                good1 = "no bonus combine until door is unlocked!";
                            if ((slots.inventoryViewObj == good1 && slots.otherViewObj == good2) ||
                                (slots.inventoryViewObj == good2 && slots.otherViewObj == good1)) {
                                
                                didBonus = true;
                                slots.combiningItems(this, good1, good2);
                                slots.addIcon(this, icons[goodNew].toString(), obj[goodNew], altObj[goodNew]); // TODO: get name from sprite
                                slots.selectItem(this, obj[goodNew], altObj[goodNew]);
                                combineFailed = false;
                            }
                        }
            
                        if (combineFailed) {
                            slots.combineFail(this);
                            failed.setDepth(200);
                            showXtime = this.time.now;
                        } else {
                            slots.inventoryView = true;
                            slots.inventoryViewObj = obj[goodNew];
                            slots.inventoryViewAlt = altObj[goodNew];
                            slots.otherViewObj = "";
                        }
            */
        });


        takeItemMask = this.add.sprite(155, 530, 'takeMask').setOrigin(0, 0);

        // Add item to inventory list when picked up. In this test it's easy, just 3 stacked items.
        // Add it and then remove from view and flag for an update.
        
        takeItemMask.on('pointerdown', () => {
            if (tableState < 3) {
                slots.addIcon(this, icons[tableState].toString(), obj[tableState], altObj[tableState]); // TODO: get name from sprite
                this.add.sprite(190, 560, closeView[tableState]).setOrigin(0, 0);
                tableState++;

                updateWall = true;
            }
        });
        

        viewTableMask = this.add.sprite(440, 615, 'tableMask').setOrigin(0, 0);
        viewTableMask.on('pointerdown', () => {
            console.log("view table!")
            if (viewWall == 0)
                viewWall = 4;

        });

        viewDoorMask = this.add.sprite(274, 398, 'doorMask').setOrigin(0, 0);
        viewDoorMask.on('pointerdown', () => {
            if (doorUnlocked) {
                egress = true; // TODO doorUnlocked needs multiple states... then drop this flag
                updateWall = true;
                //} else if (slots.getSelected() == "objKeyWhole") {
            } else if (slots.getSelected() == "objDonut") {
                doorUnlocked = true;
                updateWall = true;
                //slots.clearItem(this, "objKeyWhole");
                slots.clearItem(this, "objDonut");
                slots.clearSelect(); // TODO why not do this automatically on clearItem()??
            }
        });

        objectMask = this.add.sprite(10, 250, 'objectMask').setOrigin(0, 0);
        // Flip object over. Need to adjust for key presence if it's the plate. Awkward!
        objectMask.on('pointerdown', () => {
            flipIt = true;
            foundHalfKey = false;

            if (slots.inventoryViewObj == "objPlate" && viewWall == 5) {
                foundHalfKey = true;
            }
            slots.inventoryView = true;
        });

        keyMask = this.add.sprite(315, 540, 'keyMask').setOrigin(0, 0);
        keyMask.on('pointerdown', () => {
            slots.inventoryView = true;
            flipIt = false;
            snagged = true;
            haveHalfKey = true;

            slots.addIcon(this, icons[3].toString(), obj[3], altObj[3]); // TODO: get name from sprite?!
        });

        // Debug recorder debugger
        viewportText = this.add.text(10, 10, '');
        viewportText.setDepth(3001); // TODO: rationalize the crazy depths!

        // What is typescript type for this?!
        /*
                style = {
                    'margin': 'auto',
                    'background-color': '#000',
                    'width': '520px',
                    'height': '100px',
                    'font': '40px Arial',
                    'color': 'white'
                };
        */
    }

    update() {
        viewportText.setText([
            'x: ' + pointer.worldX,
            'y: ' + pointer.worldY,
            'rightButtonDown: ' + pointer.rightButtonDown(),
            'isDown: ' + pointer.isDown
        ]);
        recorder.fixPointer(this.input.activePointer)
        recorder.checkPointer(this);

        if (showXtime > 0) {
            if ((this.time.now - showXtime) > 500) {
                showXtime = -1;
                failed.setDepth(-1);
            }
        }

        if (slots.inventoryView) {
            slots.currentMode = "item"; // so slots object knows what is happening - needed?!
            if (viewWall < 5)
                previousWall = viewWall;
            keyMask.setVisible(false);
            if (haveHalfKey && slots.inventoryViewAlt == "altobjPlateKey") {
                slots.inventoryViewAlt = "altobjPlateEmpty";
            }
            if (snagged) {
                currentWall = 5; flipIt = true;
                snagged = false;
                slots.inventoryViewAlt = "altobjPlateEmpty";
            }
            if (currentWall == 5 && flipIt) {
                this.add.image(0, 0, slots.inventoryViewAlt).setOrigin(0, 0);
                viewWall = 6; currentWall = 6;
                // only make the piece available if seen...
                if (foundHalfKey && !haveHalfKey) {
                    keyMask.setVisible(true); keyMask.setDepth(200); keyMask.setInteractive();
                }
            } else {
                this.add.image(0, 0, slots.inventoryViewObj).setOrigin(0, 0);
                viewWall = 5; currentWall = 5;
            }
            flipIt = false;

            invBar.setDepth(100);
            slots.inventoryView = false;

            leftButton.setVisible(false);
            rightButton.setVisible(false);
            backButton.setVisible(true); backButton.setDepth(100); backButton.setInteractive();

            /* Will fix combinations, after recorder...
                        if (slots.otherViewObj.length > 0) {
                            plusButton.setVisible(true); plusButton.setDepth(110); plusButton.setInteractive();
                        } else {
                            plusButton.setVisible(false);
                        }
            */

            takeItemMask.setVisible(false);
            viewTableMask.setVisible(false);
            viewDoorMask.setVisible(false);

            objectMask.setVisible(true);
            objectMask.setDepth(100);
            objectMask.setInteractive();

        } else if ((viewWall != currentWall || updateWall)) {
            if (egress) {
                this.add.image(0, 0, walls[8]).setOrigin(0, 0);
                leftButton.setVisible(false);
                rightButton.setVisible(false);
                currentWall = viewWall;
                updateWall = false;
                var sentence = "Nice job slugger!\nTry it again for the bonus?\nJust reload the page";
                if (didBonus) {
                    var bonus = this.add.image(360, 800, "winnerDonut")
                    //bonus.setScale(3);
                    sentence = "You did it :)\nThanks for testing!";
                } else {
                    failed.setVisible(true);
                    failed.setDepth(400);
                    failed.setX(360); failed.setY(800);
                }

                const style = 'margin: auto; background-color: black; color:white; width: 520px; height: 100px; font: 40px Arial';
                this.add.dom(350, 1100, 'div', style, sentence);


                invBar.setDepth(0);
                slots.clearAll(this);
                takeItemMask.setVisible(false);
                viewTableMask.setVisible(false);
                viewDoorMask.setVisible(false);

                updateWall = false;
                viewWall = currentWall;
                return;
            }



            slots.currentMode = "room";
            if (viewWall > -1) { //?
                if (doorUnlocked && viewWall == 0) {
                    this.add.image(0, 0, walls[7]).setOrigin(0, 0);
                } else {
                    this.add.image(0, 0, walls[viewWall]).setOrigin(0, 0);
                }
            }

            slots.displaySlots(); // TODO: is this really required every time the wall changes?
            invBar.setDepth(100); // TODO: surely no.
            currentWall = viewWall;
            updateWall = false;

            if (viewWall == 0)
                this.add.sprite(540, 650, tableView[tableState]).setOrigin(0, 0);
            if (viewWall == 4)
                this.add.sprite(176, 532, closeView[tableState]).setOrigin(0, 0);

            if (viewWall > 3) { // viewing table not room wall, or inventory view
                leftButton.setVisible(false);
                rightButton.setVisible(false);
                backButton.setVisible(true); backButton.setDepth(100); backButton.setInteractive();
            } else {
                leftButton.setVisible(true); leftButton.setDepth(100); leftButton.setInteractive();
                rightButton.setVisible(true); rightButton.setDepth(100); rightButton.setInteractive();
                backButton.setVisible(false);
            }

            plusButton.setVisible(false);

            if (viewWall == 0) {
                viewTableMask.setVisible(true); viewTableMask.setDepth(100); viewTableMask.setInteractive();
                viewDoorMask.setVisible(true); viewDoorMask.setDepth(100); viewDoorMask.setInteractive();
            } else {
                viewTableMask.setVisible(false);
                viewDoorMask.setVisible(false);
            }

            if (viewWall == 4) {
                takeItemMask.setVisible(true); takeItemMask.setDepth(100); takeItemMask.setInteractive();
            } else {
                takeItemMask.setVisible(false);
            }
            objectMask.setVisible(false);
        }
    }
}

let config = {
    type: Phaser.AUTO,
    backgroundColor: '#222222',
    scale: {
        mode: Phaser.Scale.FIT,
        width: 720,
        height: 1280,
        parent: 'thegame',
    },
    dom: {
        createContainer: true
    },
    disableContextMenu: true, // ready for right-click if needed
    autoCenter: Phaser.Scale.CENTER_BOTH,
    scene: PlayGame
};

new Phaser.Game(config);