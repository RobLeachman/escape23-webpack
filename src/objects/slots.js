export default class Slots {
    constructor(scene, slotIconSprite, selectSprite, selectSecond) {
        this.emptySprite = slotIconSprite;
        this.inventoryView = false;
        this.inventoryViewObj = "";
        this.otherViewObj = "";
        this.selectedIcon = scene.add.sprite(1000, 1075, selectSprite).setOrigin(0, 0);
        this.selectedSecondIcon = scene.add.sprite(0, 1075, selectSecond).setOrigin(0, 0);
        this.slotArray = [];

        for (var i = 0; i < 6; i++) {
            var index = i;
            var selected = false;
            var thisSlot = scene.add.sprite(95 + i * 90, 1075, slotIconSprite).setOrigin(0, 0);
            thisSlot.name = "empty";
            this.slotArray[i] = { index: i, slotSprite: thisSlot, selected: false, allSlots: this, selectedIcon: this.selectedIcon, selectedSecondIcon: this.selectedSecondIcon, theScene: this.scene };
        }
    }
    clickMe(thisSlot, allSlots, scene) {
        var prevItem = -1;
        for (var i = 0; i < 6; i++) {
                if (this.allSlots.slotArray[i].selected)
                    prevItem = i;
            //}
            this.allSlots.slotArray[i].slotSprite.setDepth(1);
            if (i != this.index)
                this.allSlots.slotArray[i].selected = false;
        }
        this.selected=true;
        // mark the selected icon
        this.selectedIcon.x = 95 + this.index * 90;
        this.selectedIcon.setDepth(1);
        //this.selectedSecondIcon.x = 95+this.index*90;
        this.selectedSecondIcon.x = 1000;
        this.allSlots.otherViewObj = "";
        if (prevItem > -1 && prevItem != this.index && this.allSlots.currentMode == "item") {
            this.selectedSecondIcon.x = 95 + prevItem * 90;
            this.allSlots.otherViewObj = this.allSlots.slotArray[prevItem].objView;
        }
        this.selectedSecondIcon.setDepth(1);

        if (prevItem == this.index || this.allSlots.currentMode == "item") {
        this.allSlots.inventoryView = true;
        this.allSlots.inventoryViewObj = this.objView;
        this.allSlots.inventoryViewAlt = this.altObjView;
        this.selected = true;
        }

    }

    displaySlots() {
        for (var i = 0; i < 6; i++) {
            this.slotArray[i].slotSprite.setDepth(1);
        }
    }

    addIcon(scene, iconSprite, objectView, altObjectView) {
        var i = 0;
        for (var k = 0; k < 6; k++) {
// why check empty? clear just destroys the sprite and i couldn't replace it properly
            if (this.slotArray[k].slotSprite.name == "empty" || this.slotArray[k].slotSprite.name == "") {
                break;
            }
        }

        this.slotArray[k].slotSprite.destroy();
        this.slotArray[k].slotSprite =
            scene.add.sprite(95 + k * 90, 1075, iconSprite).setOrigin(0, 0);
        this.slotArray[k].slotSprite.name = objectView;
        this.slotArray[k].index = k;
        this.slotArray[k].selected = false;
        this.slotArray[k].slotSprite.setInteractive();
        this.slotArray[k].slotSprite.setDepth(200);
        this.slotArray[k].slotSprite.on('pointerdown', this.clickMe, this.slotArray[k]);
        this.slotArray[k].objView = objectView;
        this.slotArray[k].altObjView = altObjectView;
    }

    combineFail(scene) {
        this.selectedSecondIcon.setX(1000);
    }

    clearSecondSelect() {
        this.selectedSecondIcon.setX(1000);        
    }

    combiningItems(scene, obj1, obj2) {
        this.selectedSecondIcon.setX(1000);
        this.clearItem(scene, obj1);
        this.clearItem(scene, obj2);
    }

    selectItem(scene, objName, altName) {
        // Find the selected item
        var k=-1;
        for (k = 0; k < 6; k++) {
            if (this.slotArray[k].slotSprite.name == objName) {
                break;
            }
        }
        this.selectedIcon.setX(95 + k * 90);
        this.slotArray[k].selected = true;
    }

    getSelected(scene) {
        var selectedThing = "";
        for (var j = 0; j < 6; j++) {
            if (this.slotArray[j].selected) {
                selectedThing = this.slotArray[j].slotSprite.name;
                break; 
            }
        }        
        return selectedThing;
    }

    clearItem(scene, objName) {
        var clearSlot = -1;
        for (var k = 0; k < 6; k++) {
            if (this.slotArray[k].slotSprite.name == objName) {
                clearSlot = k;
                break;
            }
        }
        if (clearSlot > -1) {
            this.slotArray[clearSlot].slotSprite.destroy();
            var clearedSprite = scene.add.sprite(1000, 1075, this.emptySprite);
            clearedSprite.name == "empty"; // ends up to be blank string?!
            this.slotArray[k] = { index: k, slotSprite: clearedSprite, selected: false, allSlots: this, selectedIcon: this.selectedIcon, selectedSecondIcon: this.selectedSecondIcon, theScene: scene };
        } else {
            console.log("ERROR clear not found!!!!!!!");
        }
    }

    clearAll(scene) {
        for (var k = 0; k < 6; k++) {
            this.slotArray[k].slotSprite.destroy();
        }
        this.selectedIcon.setX(1000);
        this.selectedSecondIcon.setX(1000);
    }
} 