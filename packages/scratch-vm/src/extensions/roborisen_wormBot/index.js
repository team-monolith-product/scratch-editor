const ArgumentType = require("../../extension-support/argument-type");
const BlockType = require("../../extension-support/block-type");
const Base64Util = require("../../util/base64-util");
const cast = require("../../util/cast");
const formatMessage = require("format-message");

const GCubeProtocol = require("../../extension-support/roborisen-support");

const iconURI =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAACXBIWXMAAC4jAAAuIwF4pT92AAAF+mlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDE5LTA2LTA0VDE0OjIwOjQ0KzA5OjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDE5LTA2LTA0VDE0OjIwOjQ0KzA5OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAxOS0wNi0wNFQxNDoyMDo0NCswOTowMCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo1ZDg2MjE4ZC1kZmQyLWI4NDktOGUzMC01Njg0MDBkM2E4OGQiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDo0MTE2M2ExYi00NWI1LWQwNGMtOTFkMC04MzNkYzYxMjVkNDIiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDowYTNiYjEwNS0xMTRiLWQ1NGItYWQ5NC1mYzEyYWE1OTUwMTciIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjBhM2JiMTA1LTExNGItZDU0Yi1hZDk0LWZjMTJhYTU5NTAxNyIgc3RFdnQ6d2hlbj0iMjAxOS0wNi0wNFQxNDoyMDo0NCswOTowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo1ZDg2MjE4ZC1kZmQyLWI4NDktOGUzMC01Njg0MDBkM2E4OGQiIHN0RXZ0OndoZW49IjIwMTktMDYtMDRUMTQ6MjA6NDQrMDk6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5FdYLgAAAS9UlEQVR4nO2ce5BkV13HP79z7r3dt7tnpmdndnZ2d3Z2szESHiYQgkpBIgmJIJZKUVoqvigVhVIRLLXiE/1DRY2IURQhBWVRalmKIhLDQx4GSgMJq2SjWTbZ3ck+Zndnd979uq/z8497u6d7ZrOCTcRHf7d6prdv3/M7v+/5vc7v3F1RVUb4r8N8pSfwvx0jAofEiMAhMSJwSIwIHBIjAofEiMAhMSJwSIwIHBIjAofEiMAhMSJwSIwIHBIjAofEiMAhMSJwSIwI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";

const bleNusServiceUUID = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
const bleNusCharRXUUID = "6e400002-b5a3-f393-e0a9-e50e24dcca9e";
const bleNusCharTXUUID = "6e400003-b5a3-f393-e0a9-e50e24dcca9e";

const wormBotScheduledData =
    "ff,ff,ff,aa,20,0,cd,2,43,2,3,0,0,ff,ff,ff,0,0,0,ca,1,1b,2,3,0,1,c5,17,fc,a5,0,f8,3,5b,0,f8,fc,7c,0,f8,0,0,2,58,3,5b,0,f8,fc,7c,0,f8,0,0,2,58,3,5b,0,f8,0,0,2,58,0,0,3,20,fc,a5,0,f8,0,0,2,58,3,84,0,f8,fc,a5,0,f8,0,0,2,58,3,84,0,f8,fc,a5,0,f8,0,0,2,58,3,5b,0,f8,0,0,3,20,fc,41,1,ef,3,97,1,ef,3,97,1,ef,1,1a,0,6e,fc,48,2,5d,0,0,2,26,2,ff,0,a5,fd,5c,0,a5,0,0,3,20,fc,f2,0,dc,2,b3,0,dc,1,1a,0,6e,3,3c,1,4a,fc,80,1,b8,fc,23,1,ef,3,dd,1,ef,0,0,2,bc,0,0,3,20,fc,41,1,ef,3,97,1,ef,0,0,3,20,fc,23,1,ef,3,dd,1,ef,0,0,2,bc,0,0,3,20,2,b9,0,f8,fc,8d,0,8a,3,73,0,8a,fc,8d,0,8a,3,73,0,8a,fc,7d,1,f0,3,73,0,8a,fc,8d,0,8a,3,73,0,8a,fc,8d,0,8a,fc,7e,0,f7,3,82,1,ef,fc,7d,0,f8,3,ab,1,f0,fc,55,1,f0,3,ab,1,f0,fc,55,0,f8,fc,23,1,ef,3,dd,1,ef,0,0,2,bc,0,0,3,20,0,0,3,e8,ff,ff,ff,1,0,0,ca,1,1b,2,3,0,1,48,bf,fc,a5,0,f8,0,0,2,58,3,84,0,f8,fc,a5,0,f8,0,0,2,58,3,84,0,f8,fc,a5,0,f8,0,0,2,58,3,5b,0,f8,0,0,3,20,fc,a5,0,f8,3,5b,0,f8,fc,7c,0,f8,0,0,2,58,3,5b,0,f8,fc,7c,0,f8,0,0,2,58,3,5b,0,f8,0,0,2,58,0,0,3,20,fc,f2,0,dc,2,b3,0,dc,1,1a,0,6e,3,3c,1,4a,fc,80,1,b8,fc,23,1,ef,3,dd,1,ef,0,0,2,bc,0,0,3,20,fc,41,1,ef,3,97,1,ef,3,97,1,ef,1,1a,0,6e,fc,48,2,5d,0,0,2,26,2,ff,0,a5,fd,5c,0,a5,0,0,3,20,fc,f2,0,dc,2,b3,0,dc,0,0,3,20,0,0,2,26,2,ff,0,a5,fd,5c,0,a5,0,0,3,20,2,b9,0,f8,fc,8d,0,8a,3,73,0,8a,fc,8d,0,8a,3,73,0,8a,fc,7d,1,f0,3,73,0,8a,fc,8d,0,8a,3,73,0,8a,fc,8d,0,8a,fd,20,0,89,3,49,1,81,3,83,0,f8,fc,55,1,f0,3,ab,1,f0,fc,55,1,f0,3,ab,0,f8,0,0,2,26,2,ff,0,a5,fd,5c,0,a5,0,0,3,20,0,0,3,e8";

class wormBot {
    constructor(runtime, extensionId) {
        this._runtime = runtime;
        this._extensionId = extensionId;
    }
}

class RoborisenwormBotBlocks {
    static get EXTENSION_ID() {
        return "wormBot";
    }

    constructor(runtime) {
        this.runtime = runtime;
        this._peripheral = new wormBot(
            this.runtime,
            RoborisenwormBotBlocks.EXTENSION_ID
        );

        this._mDevice = null;
        this.rxCharacteristic = null;
        this.txCharacteristic = null;
        this.queue = [];
        this.cubeNum = 2;
        this.inActionCube = false;
        this.allConnect = false;
        this.cancle = false;
    }

    get DIRECTION() {
        return [
            {
                text: formatMessage({
                    id: "roborisen.left",
                    default: "왼쪽",
                    description: "left",
                }),
                value: "left",
            },
            {
                text: formatMessage({
                    id: "roborisen.right",
                    default: "오른쪽",
                    description: "right",
                }),
                value: "right",
            },
        ];
    }

    async enqueue(data) {
        // console.log(`Send : ${String(PingPongUtil.byteToString(data))}`)
        for (let i = 0; i < data.length; i += 20) {
            const chunk = data.slice(i, i + 20);
            this.queue.push(chunk);
        }
        await this.processQueue();
    }

    async processQueue() {
        if (this.isSending || this.queue.length === 0) {
            return;
        }

        this.isSending = true;

        while (this.queue.length > 0) {
            const dataChunk = this.queue.shift();
            await this.sendData(dataChunk);
        }

        this.isSending = false;
    }

    async sendData(packet) {
        try{
            await this.rxCharacteristic?.writeValue(packet);
        } catch (e) {
            console.log('sendErr',e);
        }
    }

    getInfo() {
        return {
            id: RoborisenwormBotBlocks.EXTENSION_ID,
            name: "wormBot",
            blockIconURI: iconURI,
            showStatusButton: false,
            //#region blocks
            blocks: [
                {
                    opcode: "connectCube",
                    text: formatMessage({
                        id: "wormBot.connectCube",
                        default: "웜봇 연결하기",
                        description: "connectCube",
                    }),
                    blockType: BlockType.COMMAND,
                },
                {
                    opcode: "disconnectCube",
                    text: formatMessage({
                        id: "roborisen.disconnectCube",
                        default: "연결 끊기",
                        description: "disconnectCube",
                    }),
                    blockType: BlockType.COMMAND,
                },
                {
                    opcode: "wormbotMove",
                    text: formatMessage({
                        id: "wormBot.wormbotMove",
                        default: "웜봇 [DIRECTION]으로 이동하기",
                        description: "wormbotMove",
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        DIRECTION: {
                            type: ArgumentType.STRING,
                            menu: "direction",
                            defaultValue: this.DIRECTION[0].value,
                        },
                    },
                },
                {
                    opcode: "wormbotTurn",
                    text: formatMessage({
                        id: "wormBot.wormbotTurn",
                        default: "웜봇 [DIRECTION]으로 회전하기",
                        description: "wormbotTurn",
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        DIRECTION: {
                            type: ArgumentType.STRING,
                            menu: "direction",
                            defaultValue: this.DIRECTION[0].value,
                        },
                    },
                },
                {
                    opcode: "wormbotStand",
                    text: formatMessage({
                        id: "wormBot.wormbotStand",
                        default: "웜봇 물구나무 서기",
                        description: "wormbotStand",
                    }),
                    blockType: BlockType.COMMAND,
                },
                {
                    opcode: "wormbotDance",
                    text: formatMessage({
                        id: "wormBot.wormbotDance",
                        default: "웜봇 춤추기",
                        description: "wormbotDance",
                    }),
                    blockType: BlockType.COMMAND,
                },
            ],
            menus: {
                direction: this.DIRECTION,
            },
        };
    }
    //#region Function
    async connectCube() {
        let groupID;
        do {
            groupID = prompt(
                "그룹번호를 입력해주세요(0~76)\n(그룹번호가 없으면 취소)"
            );
            if (groupID === null) {
                break;
            } else if (isNaN(groupID)) {
                alert("입력값은 숫자여야 합니다.");
            } else if (!Number.isInteger(Number(groupID))) {
                alert("입력값은 정수여야 합니다.");
            } else if (groupID < 0 || 76 < groupID) {
                alert("값이 0~76 여야 합니다.");
            } else if (groupID[0] === groupID[1]) {
                alert("두 자리는 서로 다른 숫자여야 합니다.");
            }
        } while (
            isNaN(groupID) ||
            !Number.isInteger(Number(groupID)) ||
            groupID < 0 ||
            76 < groupID ||
            groupID[0] === groupID[1]
        );

        try {
            let findID;
            findID =
                !groupID || groupID == 0
                    ? `PINGPONG`
                    : `PINGPONG.${groupID.padStart(2, "0")}`;
            console.log(`find ${findID}`);
            this._mDevice = await navigator.bluetooth.requestDevice({
                filters: [{ namePrefix: findID }],
                optionalServices: [bleNusServiceUUID],
            });

            this._server = await this._mDevice.gatt.connect();
            console.log("Cube connected:", this._server);

            const service = await this._server.getPrimaryService(
                bleNusServiceUUID
            );

            this.rxCharacteristic = await service.getCharacteristic(
                bleNusCharRXUUID
            );
            this.txCharacteristic = await service.getCharacteristic(
                bleNusCharTXUUID
            );
            await this.txCharacteristic.startNotifications();

            this.txCharacteristic.addEventListener(
                "characteristicvaluechanged",
                this.handleNotifications.bind(this)
            );
            this._mDevice.addEventListener(
                "gattserverdisconnected",
                async () => {
                    console.log("Cube disconnected");
                    this.rxCharacteristic = null;
                    this.txCharacteristic = null;
                }
            );
            if (!groupID) {
                groupID = "00";
            }
            this.enqueue(
                GCubeProtocol.getSetMultiroleInAction(this.cubeNum, groupID)
            );
            const waitUntilConnected = async () => {
                while (!this.allConnect) {
                    if (this.cancle) {
                        this.cancle = false;
                        return;
                    }
                    await new Promise((resolve) => setTimeout(resolve, 100));
                }
            };
            await waitUntilConnected();
        } catch (error) {
            // console.error('Error connecting to Cube:', error);
        }
    }

    async disconnectCube() {
        this.enqueue(GCubeProtocol.rebootMultiroleAggregator());
        this.allConnect = false;
        this.cancle = true;
    }

    handleNotifications(event) {
        const value = event.target.value;

        if (value.byteLength !== 0) {
            console.log(
                `Receive ${String(GCubeProtocol.byteToStringReceive(event))}`
            );
        }

        if (this.allConnect && value.getUint8(6) == 0xad) {
            this.disconnectCube();
        }

        if (value.getUint8(6) == 0xad && value.getUint8(9) == this.cubeNum-1) {
            console.log("wormBot is connected");
            this.wormbotSetting();
            this.allConnect = true;
        }
    }

    wormbotSetting() {
        if (this.inActionCube === true) return;
        this.inActionCube = true;

        const strSplit = wormBotScheduledData.split(",");
        const txCharVal = new Uint8Array(strSplit.length);
        for (let i = 0; i < strSplit.length; i++) {
            txCharVal[i] = parseInt(strSplit[i], 16);
        }

        this.enqueue(txCharVal);

        return new Promise((resolve) => {
            const repeat = setInterval(() => {
                this.inActionCube = false;
                clearInterval(repeat);
                resolve();
            }, 64);
        });
    }

    wormbotMove(args) {
        if (this.inActionCube === true) return;
        this.inActionCube = true;

        if (args.DIRECTION === "left") {
            this.enqueue(GCubeProtocol.makePointDatas(0x0, 0x9));
        } else if (args.DIRECTION === "right") {
            this.enqueue(GCubeProtocol.makePointDatas(0xa, 0x13));
        }

        return new Promise((resolve) => {
            const repeat = setInterval(() => {
                this.inActionCube = false;
                clearInterval(repeat);
                resolve();
            }, 6000);
        });
    }

    wormbotTurn(args) {
        if (this.inActionCube === true) return;
        this.inActionCube = true;

        if (args.DIRECTION === "left") {
            this.enqueue(GCubeProtocol.makePointDatas(0x14, 0x1c));
        } else if (args.DIRECTION === "right") {
            this.enqueue(GCubeProtocol.makePointDatas(0x1d, 0x25));
        }

        return new Promise((resolve) => {
            const repeat = setInterval(() => {
                this.inActionCube = false;
                clearInterval(repeat);
                resolve();
            }, 7000);
        });
    }

    wormbotStand() {
        if (this.inActionCube === true) return;
        this.inActionCube = true;

        this.enqueue(GCubeProtocol.makePointDatas(0x26, 0x2c));

        return new Promise((resolve) => {
            const repeat = setInterval(() => {
                this.inActionCube = false;
                clearInterval(repeat);
                resolve();
            }, 5000);
        });
    }

    wormbotDance() {
        if (this.inActionCube === true) return;
        this.inActionCube = true;

        this.enqueue(GCubeProtocol.makePointDatas(0x2d, 0x41));

        return new Promise((resolve) => {
            const repeat = setInterval(() => {
                this.inActionCube = false;
                clearInterval(repeat);
                resolve();
            }, 12000);
        });
    }
}

module.exports = RoborisenwormBotBlocks;
