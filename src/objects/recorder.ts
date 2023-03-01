export default class Recorder {
    pointer: Phaser.Input.Pointer;
    pointerSprite: Phaser.GameObjects.Sprite;
    clickSprite: Phaser.GameObjects.Sprite;
    prevClickX: number;
    prevClickY: number;
    oldPointerDown: boolean;
    oldPointerTime: number;
    oldPointerX: number; oldPointerY: number;
    recordPointerX: number; recordPointerY: number;

    clickers: Phaser.GameObjects.Sprite[] = [];

    constructor(pointer: Phaser.Input.Pointer,
        pointerSprite: Phaser.GameObjects.Sprite,
        clickSprite: Phaser.GameObjects.Sprite) {
        this.pointer = pointer;
        this.pointerSprite = pointerSprite;
        this.clickSprite = clickSprite;
        this.oldPointerX = 0; this.oldPointerY = 0;
    }

    // called once per update, tracks pointer movement and clicks
    checkPointer(scene: Phaser.Scene) {
        let pointerClicked: Boolean = false;

        this.fadeClick(scene);

        if (this.oldPointerDown != this.pointer.isDown) {
            this.oldPointerDown = this.pointer.isDown;
            if (this.oldPointerDown) {
                pointerClicked = true;
            }
        }

        let pointerTime = scene.time.now - this.oldPointerTime;
        if (this.oldPointerX != this.pointer.worldX || this.oldPointerY != this.pointer.worldY || pointerTime > 1000 || pointerClicked) {
            let distanceX = Math.abs(this.pointer.worldX - this.oldPointerX);
            let distanceY = Math.abs(this.pointer.worldY - this.oldPointerY);
            
            if ((distanceX + distanceY > 50) || (pointerTime > 1000) || pointerClicked) { 
                this.oldPointerX = this.pointer.worldX;
                this.oldPointerY = this.pointer.worldY;
                this.pointerSprite.setX(this.pointer.worldX);
                this.pointerSprite.setY(this.pointer.worldY);
                this.oldPointerTime = scene.time.now;

                if (this.recordPointerX != this.oldPointerX || this.recordPointerY != this.oldPointerY) {
                    this.recordPointerX = this.oldPointerX;
                    this.recordPointerY = this.oldPointerY;
                    this.recordAction(scene, "move");
                }                
            }
        }

        if (pointerClicked) {
            this.recordAction(scene, "click");
            this.showClick(scene);
            pointerClicked = false;
        }
    }

    recordAction(scene: Phaser.Scene, action: string) {
        const actionTime = scene.time.now;
        console.log(`RECORDER ${action} ${Math.floor(this.pointer.x)}, ${Math.floor(this.pointer.y)} @ ${scene.time.now}`)
    }

    showClick(scene: Phaser.Scene) {
        const config = {
            key: 'clckrClk',
            scale: 3
        };

        var newSprite = scene.make.sprite(config);
        newSprite.setX(this.pointer.x); newSprite.setY(this.pointer.y);
        if (this.pointer.x == this.prevClickX && this.pointer.y == this.prevClickY) {
            newSprite.setScale(5);
        }
        this.clickers.push(newSprite);
        this.prevClickX = this.pointer.x; this.prevClickY = this.pointer.y;
        newSprite.setDepth(3000);
    }

    fadeClick(scene: Phaser.Scene) {
        this.clickers.forEach((clicked, idx) => {
            if (clicked.alpha > 0) {
                clicked.setScale(clicked.scale * .8);
                clicked.setAlpha(clicked.alpha - .01);
            } else {
                this.clickers.splice(idx, 1);
            }
        });
    }
}