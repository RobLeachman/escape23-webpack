import 'phaser';

var currentWall = -1;
//var currentWallImage;

const walls = new Array();
const icons = new Array();
const tableView = new Array();
const closeView = new Array();
const i = new Array();
var wall = 0;

var wall1;
var wall2;
var wall3;
var wall4;

var tableState = 0;
var updateWall = false;

class PlayGame extends Phaser.Scene {
    
    constructor() {
        super("PlayGame");
    }
    preload() {
        this.load.image('logo', 'assets/backgrounds/wallA1.png'); // webpack test
        //this.load.image('right', 'assets/sprites/arrowRight.png');
        //this.load.image('iconKeyA', 'assets/sprites/icon - keyA.png');

        this.load.image('wall1', 'assets/backgrounds/invroom - room - empty.png');
        this.load.image('wall2', 'assets/backgrounds/invroom - room - west.png');
        this.load.image('wall3', 'assets/backgrounds/invroom - room - south.png');
        this.load.image('wall4', 'assets/backgrounds/invroom - room - east.png');
    
        this.load.image('table', 'assets/backgrounds/invroom - table - empty.png');
    
        this.load.image('right', 'assets/sprites/arrowRight.png');
        this.load.image('left', 'assets/sprites/arrowLeft.png');
        this.load.image('down', 'assets/sprites/arrowDown.png');
        this.load.image('inventory', 'assets/sprites/inventory cells1.png');
    
        //this.load.image('iconSize', 'assets/sprites/icon - size.png');
        this.load.image('iconSelected', 'assets/sprites/icon - selected.png');
        this.load.image('iconDonut', 'assets/sprites/icon - donut.png');
        this.load.image('iconPlate', 'assets/sprites/icon - plate.png'); 
        this.load.image('iconKeyA', 'assets/sprites/icon - keyA.png');
        this.load.image('iconKeyB', 'assets/sprites/icon - keyB.png');
        this.load.image('iconKeyWhole', 'assets/sprites/icon - keyWhole.png');
        icons[0] = "iconDonut";
        icons[1] = "iconPlate";
        icons[2] = "iconKeyB";
        icons[3] = "iconKeyA";
        icons[4] = "iconKeyWhole";
    
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
    
        walls[0] = "wall1";
        walls[1] = "wall2";
        walls[2] = "wall3";
        walls[3] = "wall4";
        walls[4] = "table";
        
    
        /*
        i[0] = "iconDonut";
        i[1] = "iconPlate";
        i[2] = "iconKeyB";
        i[3] = "iconPlate";
        i[4] = "iconKeyWhole";
        */        
    }
    create() {
        this.image = this.add.image(400, 300, 'iconKeyB'); //webpack test

        this.add.image(0, 0, walls[0]).setOrigin(0,0);
        //this.add.sprite(0, 0, 'inventory').setOrigin(0,0);        
    }
    update() {
        var viewTable;
        var takeItem;
    
        if (wall != currentWall || updateWall) {
            if (wall > -1) {
                let currentWallImage = this.add.image(0, 0, walls[wall]).setOrigin(0,0);
            }
            currentWall = wall;
            updateWall = false;
           
            for (let j=0;j<i.length;j++) {
                if (i[j].length) {
                    let thisIcon = -1;
                    for (let k=0;k<icons.length;k++) {
                        if (icons[k].toString() == i[j]) {
                            thisIcon = icons[k];
                        }
                    }
                    if (thisIcon != -1)
                       this.add.sprite(95+j*90,1075,thisIcon).setOrigin(0,0);
                    else
                        console.log("BAD ICON " + i[j]);
                }
            }
    
    /*
            //this.add.sprite(95,1075,'iconSelected').setOrigin(0,0);
    
            this.add.sprite(95,1075,'iconDonut').setOrigin(0,0);
            this.add.sprite(185,1075,'iconPlate').setOrigin(0,0);
            this.add.sprite(275,1075,'iconKeyA').setOrigin(0,0);
            this.add.sprite(365,1075,'iconKeyB').setOrigin(0,0);
    */        
            if (wall==1)
                this.add.sprite(455,1075,'iconKeyWhole').setOrigin(0,0);
    
            if (wall == 0)
                this.add.sprite(470,640,tableView[tableState]).setOrigin(0,0);
            if (wall == 4)
                this.add.sprite(176,532,closeView[tableState]).setOrigin(0,0);
    
            var inv = this.add.sprite(0, 1040, 'inventory').setOrigin(0,0);
            
            var leftButton = this.add.sprite(80, 950, 'left');
            var rightButton = this.add.sprite(640, 950, 'right');
            var backButton = this.add.sprite(300,875,'down').setOrigin(0,0);
            if (wall > 3) {
                leftButton.setVisible(false);
                rightButton.setVisible(false);
            } else {
                backButton.setVisible(false);
            }
    
            if (wall==0)
               viewTable = this.add.image(440, 615, 'tableMask').setInteractive().setOrigin(0,0);
            if (wall==4)
               takeItem = this.add.image(155,530, 'takeMask').setInteractive().setOrigin(0,0);
          
            rightButton.setInteractive();
            rightButton.on('pointerdown', () => {                
                wall ++;
                if (wall > 3)
                   wall = 0;
            });
            leftButton.setInteractive();
            leftButton.on('pointerdown', () => {
                wall --;
                if (wall <0)
                   wall = 3;
            });
            backButton.setInteractive();
            backButton.on('pointerdown', () => {
                if (wall == 4)
                    wall = 0;
            });   
        }          
    
        if (takeItem !== undefined) {
            takeItem.on('pointerdown', () => {
                if (wall==4 && tableState < 3) {
                    i[i.length] = icons[tableState].toString();
                    tableState++;
                    this.add.sprite(176,532,closeView[tableState]).setOrigin(0,0);
                }
                else if(tableState>0) {
                    i[0] = "";
                }
            });            
        }
    
        if (viewTable !== undefined) {
            viewTable.on('pointerdown', () => {
                if (wall == 0)
                    wall = 4;
            });            
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
    autoCenter: Phaser.Scale.CENTER_BOTH,
    scene: PlayGame
};

new Phaser.Game(config);