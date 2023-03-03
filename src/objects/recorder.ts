// Nothing to compress...
//import { stringify } from 'zipson';

import { setCookie, getCookie, eraseCookie } from "../utils/cookie";

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

    recording: string;

    constructor(pointer: Phaser.Input.Pointer,
        pointerSprite: Phaser.GameObjects.Sprite,
        clickSprite: Phaser.GameObjects.Sprite) {
        this.pointer = pointer;
        this.pointerSprite = pointerSprite;
        this.clickSprite = clickSprite;
        this.oldPointerX = 0; this.oldPointerY = 0;
        this.recording = "";
    }

    // This is terrible, but I don't know how to fix it. Need to update the pointer on mobile,
    // but we don't know what it is until update fires and they click?
    fixPointer(pointer: Phaser.Input.Pointer) {
        //console.log("OOF need to fix it");
        this.pointer = pointer;
    }

    // called once per update, tracks pointer movement and clicks
    checkPointer(scene: Phaser.Scene) {
        let pointerClicked: Boolean = false;

        this.fadeClick(scene);

        if (this.pointer.isDown) {
            if (this.pointer.rightButtonDown()) {
                console.log("right click")
            } else 
                console.log("left click")
        }

        if (this.oldPointerDown != this.pointer.isDown && !this.pointer.rightButtonDown()) {
            this.oldPointerDown = this.pointer.isDown;
            if (this.oldPointerDown) {
                console.log("CLICKED")
                pointerClicked = true;
            }
        }

        let pointerTime = scene.time.now - this.oldPointerTime;
        if (this.oldPointerX != this.pointer.worldX || this.oldPointerY != this.pointer.worldY || pointerTime > 1000 || pointerClicked) {
            let distanceX = Math.abs(this.pointer.worldX - this.oldPointerX);
            let distanceY = Math.abs(this.pointer.worldY - this.oldPointerY);

            if ((distanceX + distanceY > 500) || (pointerTime > 1200) || pointerClicked) {
                this.oldPointerX = this.pointer.worldX;
                this.oldPointerY = this.pointer.worldY;
                this.pointerSprite.setX(this.pointer.worldX);
                this.pointerSprite.setY(this.pointer.worldY);
                this.oldPointerTime = scene.time.now;

                if (this.recordPointerX != this.oldPointerX || this.recordPointerY != this.oldPointerY) {
                    this.recordPointerX = this.oldPointerX;
                    this.recordPointerY = this.oldPointerY;
                    this.recordAction(scene, "mousemove");
                }
            }
        }

        if (pointerClicked) {
            this.recordAction(scene, "mouseclick");
            this.showClick(scene);
            pointerClicked = false;
            this.dumpRecording();
        }
    }

    recordAction(scene: Phaser.Scene, action: string) {
        const actionTime = scene.time.now;
        //console.log(`RECORDER ${action} ${Math.floor(this.pointer.x)}, ${Math.floor(this.pointer.y)} @ ${scene.time.now}`)
        this.recording = this.recording.concat(`${action},${Math.floor(this.pointer.x)},${Math.floor(this.pointer.y)},${scene.time.now}:`);
    }
    recordObjectDown(object: string) {
        console.log(`RECORDER OBJECT ${object}`);
        this.recording = this.recording.concat(`object=${object},${Math.floor(this.pointer.x)},${Math.floor(this.pointer.y)}:`);
    }
    recordIconClick(object: string) {
        console.log(`RECORDER ICON CLICK ${object}`);
        this.recording = this.recording.concat(`icon=${object},${Math.floor(this.pointer.x)},${Math.floor(this.pointer.y)}:`);
        //console.log(this.recording);

    }
    dumpRecording() {
        const rec = this.recording.split(":");
        let recOut = "";
        let lastTime = "";
        //console.log("ACTION COUNT " + rec.length);
        // struggling with TS arrays https://dpericich.medium.com/how-to-build-multi-type-multidimensional-arrays-in-typescript-a9550c9a688e
        let actions: [string, number, number, number][] = [["BOJ", 0, 0, 0]];

        rec.forEach((action, idx) => {
            let thisActionRec = rec[idx];
            let nextActionRec = rec[idx + 1] ?? "";   //Typescript check undefined and fix it up
            const secondLookahead = rec[idx + 2] ?? "";

            if (nextActionRec.length == 0) {
                nextActionRec = "OOF,0,0,0"
            }
            if (thisActionRec.length == 0) {
                thisActionRec = "EOF,0,0,0"
            }
            //console.log(`\nthis ${thisActionRec} next ${nextActionRec}`)
            const thisAction = thisActionRec.split(',')[0];
            let nextActionTime = nextActionRec.split(",")[3];
            if (nextActionTime === undefined)
                nextActionTime = secondLookahead.split(",")[3];

            // fix up clicks recorded with no time
            //console.log(`action ${thisAction}`)
            const complexAction = thisAction.split('=');
            if (complexAction.length > 1) {
                //console.log(`action complex!!! ${complexAction[0]} ${nextActionTime}`)
                thisActionRec = `${thisActionRec},${nextActionTime}`
                //console.log(`  ${thisActionRec}`)
            } else {
                //console.log(`  ${thisActionRec}`)
            }
            if (thisActionRec.includes("object=icon") || thisActionRec.includes("EOF,")) { // we need the icon click not the mask click
                //console.log("SKIP:")
            } else {
                //console.log(`  ${thisActionRec}`)
                //recOut += thisActionRec + ":";
                const splitAction = thisActionRec.split(',');

                actions.push([splitAction[0], parseInt(splitAction[1], 10), parseInt(splitAction[2], 10), parseInt(splitAction[3], 10)]);
            }
        });

        // Must throw out redundant stuff. Find these and mark time as 0.
        // Perhaps could clean up the input recorded actions but let's just fix them here
        actions.forEach((action, idx) => {
            //console.log(action);
            if (idx < actions.length - 1) {
                const nextAction = actions[idx + 1];
                //console.log(action[3] + " " + nextAction[3])
                const complexAction = action[0].split('=');
                if (complexAction.length > 1) {
                    if (action[3] == nextAction[3]) {
                        nextAction[3] = 0;
                        if (idx < actions.length - 2)
                            actions[idx + 2][3] = 0;
                    }
                } else if (action[3] == nextAction[3]) // move then click, skip the move
                    action[3] = 0;
            }
        });

        // calculate elapsed time for non-redundant events and we're done, build the output string
        let prevTime = 0;
        let elapsed = 0;
        actions.forEach((action, idx) => {
            //console.log(`Action ${action}  time ${action[3]}`);
            if (action[3] > 0) {
                elapsed = action[3] - prevTime;
                prevTime = action[3];
                //console.log(`ActioX ${action}  time ${action[3]}  elapsed ${elapsed}`);
                recOut = recOut.concat(`${action[0]},${action[1]},${action[2]},${elapsed}:`);
            }
        });

        const recording = recOut;
        console.log(recOut);
        let re = /mousemove,/g; recOut = recording.replace(re, "#");
        re = /mouseclick,/g; recOut = recOut.replace(re, "!");
        re = /object=/g; recOut = recOut.replace(re, "=");
        re = /icon=/g; recOut = recOut.replace(re, "\-");
        recOut = this.checksum(recording) + "?" + recOut + "?v1";
        console.log("OUT " + recOut);
        this.saveCookies(recOut);

        //const stringified = stringify(recOut);
        //console.log(stringified)
        //console.log("base " + recOut.length);
        //console.log("str  " + stringified.length);



        //let recOutString = JSON.stringify(recOut);
        //console.log(recOutString);
        //console.log("json string length " + recOutString.length)
        let recInCheck = recOut.split('?')[0];
        let recIn = recOut.split('?')[1];
        let recInVersion = recOut.split('?')[2];
        re = /#/g; recIn = recIn.replace(re, "mousemove,");
        re = /!/g; recIn = recIn.replace(re, "mouseclick,");
        re = /=/g; recIn = recIn.replace(re, "object=");
        re = /\-/g; recIn = recIn.replace(re, "icon=");
        //console.log(recording);        
        //console.log(recIn);
        //console.log(this.checksum(recording))
        //console.log(this.checksum(recIn));
        //console.log(recInCheck);
        if (recInCheck == this.checksum(recIn)) {
            console.log("Good recording " + recInVersion);
        } else {
            console.log("ERROR");
        }

        //console.log("cksum " + this.checksum(recOutString));
        //console.log (recOutCompressedString);
    }

    saveCookies(data:string) {
        const cookieName = "test";
        //console.log("cookie length " + data.length) // max 4096
        // must split if too big
        let chunked = this.chunkString(data, 80);
        chunked!.forEach((chunk, idx) => {
            chunked![idx] += "|"
        });
        chunked![chunked!.length-1] += "EOF"; // https://timmousk.com/blog/typescript-object-is-possibly-null/
        //console.log(chunked);
        chunked!.forEach((chunk, idx) => {
            let cookieNameOut = cookieName;
            if (idx > 0)
            cookieNameOut += idx;
            //console.log(cookieNameOut + ":" + chunk);
            setCookie(cookieNameOut, chunk, 1); // bake for a week
        });        

        
    }

    chunkString(str: string, length: number) {
        return str.match(new RegExp('.{1,' + length + '}', 'g'));
    }

    // https://stackoverflow.com/questions/811195/fast-open-source-checksum-for-small-strings
    checksum(s: string) {
        var chk = 0x12345678;
        var len = s.length;
        for (var i = 0; i < len; i++) {
            chk += (s.charCodeAt(i) * (i + 1));
        }

        return (chk & 0xffffffff).toString(16);
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