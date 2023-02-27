import 'phaser';

var myViewport;
var viewportText;
var viewportPointer;
var viewportPointerClick;
 
class PlayGame extends Phaser.Scene {
    image: Phaser.GameObjects.Image;
    constructor() {
        super("PlayGame");
    }
    preload(): void {
        this.load.image('myViewport', 'assets/backgrounds/viewport.png');
        viewportPointer = this.load.image('clckrLoc', 'assets/sprites/pointer.png');
        viewportPointerClick = this.load.image('clckrClk', 'assets/sprites/pointerClicked.png');
        myViewport = this.add.image(0, 0, 'myViewport').setOrigin(0, 0);

        this.load.image('wall1', 'assets/backgrounds/invroom - room - empty.png');
        this.load.image('wall2', 'assets/backgrounds/invroom - room - west.png');
        this.load.image('wall3', 'assets/backgrounds/invroom - room - south.png');
        this.load.image('wall4', 'assets/backgrounds/invroom - room - east.png');
        this.load.image('wallUnlocked', 'assets/backgrounds/invroom - room - unlocked.png');
        this.load.image('wallWinner', 'assets/backgrounds/invroom - room - winner.png');    
    }
    create(): void {
        this.image = this.add.image(400, 300, 'wall1');
    }
    update(): void {
        this.image.rotation += 0.01;   
    }
}

/*
let configObject: Phaser.Types.Core.GameConfig = {
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: 'thegame',
        width: 800,
        height: 600
    },
    scene: PlayGame
};
*/

let configObject: Phaser.Types.Core.GameConfig = {
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: 'thegame',
        width: 800,
        height: 600
    },
    scene: PlayGame
};


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
 
new Phaser.Game(configObject);