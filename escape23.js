var sceneConfig = {
    key: 'escape23',
    active: true,
    preload: bootLoader,
    create: create
};

function bootLoader ()
{
    this.load.image('wall1', 'assets/backgrounds/wallA1.png');
    this.load.image('wall2', 'assets/backgrounds/wallA2.png');
    this.load.image('wall3', 'assets/backgrounds/wallA3.png');
    this.load.image('wall4', 'assets/backgrounds/wallA4.png');
}

function bootCreate ()
{
    this.scene.start('escape23');
}



function create ()
{
    loadImage = this.add.image(0, 0, 'wall1').setOrigin(0);
/*
    this.input.on('pointerdown', () => {

            layer.visible = !layer.visible;

        });
    }
*/
}

const config = {
    type: Phaser.AUTO,
    width: 820,
    height: 1280,
    scene: sceneConfig
};

const game = new Phaser.Game(config);