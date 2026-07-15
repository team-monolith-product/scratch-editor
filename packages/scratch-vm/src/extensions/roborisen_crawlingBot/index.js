const ArgumentType = require("../../extension-support/argument-type");
const BlockType = require("../../extension-support/block-type");
const Base64Util = require("../../util/base64-util");
const cast = require("../../util/cast");
const formatMessage = require("format-message");

const GCubeProtocol = require("../../extension-support/roborisen-support");

const iconURI =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAACXBIWXMAAC4jAAAuIwF4pT92AAAF+mlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDE5LTA2LTA0VDE0OjI2OjE5KzA5OjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDE5LTA2LTA0VDE0OjI2OjE5KzA5OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAxOS0wNi0wNFQxNDoyNjoxOSswOTowMCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo2YmRjODI3Ny1mYWJmLTAzNGQtYjZiZi1jNjNmYTUzMzQ0ZGUiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDo5MmIzYjI5Ni0yMmQ1LTgxNDItYTBiNy1mZTU0NzAyYmEwMTMiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpkMjlmZjE0NS1iZmI1LWYzNGMtODlkMy1jYjZlZjNlM2RjNmMiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmQyOWZmMTQ1LWJmYjUtZjM0Yy04OWQzLWNiNmVmM2UzZGM2YyIgc3RFdnQ6d2hlbj0iMjAxOS0wNi0wNFQxNDoyNjoxOSswOTowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo2YmRjODI3Ny1mYWJmLTAzNGQtYjZiZi1jNjNmYTUzMzQ0ZGUiIHN0RXZ0OndoZW49IjIwMTktMDYtMDRUMTQ6MjY6MTkrMDk6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7dTV7WAAAZF0lEQVR4nNWdeZAdxZ3nP5lZxzv69fW6W+pudbcAIWC8w9oIEGvMRCDWMUgsyF68JsCAmWUj1ou9xjPh8Xo84wPbMeFxsB68MPb6GDAD2ETgWdYOxjMcxjNm1uIwsNY1gDFqSejqVl/vfnVk7h9V9d5rqXW8pxZ4v0HpqUpZlZnfyszfmYUwxtAOvvTlL98qhfhD13XfYVmqNDV1mJmZGVKpFMaA73tksxmGR0bQYQhAVMXx66lUKl2jq0b33fLhW66zLOv/+L4P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";

const bleNusServiceUUID = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
const bleNusCharRXUUID = "6e400002-b5a3-f393-e0a9-e50e24dcca9e";
const bleNusCharTXUUID = "6e400003-b5a3-f393-e0a9-e50e24dcca9e";

const CrawlingBotScheduledData =
    "ff,ff,ff,aa,40,0,cd,5,19,2,3,0,0,ff,ff,ff,0,0,0,ca,1,43,2,3,0,1,23,3d,0,0,3,20,0,0,3,20,0,0,3,20,3,0a,0,f8,fc,f6,0,f8,0,0,3,20,3,0a,0,f8,fc,f6,0,f8,0,0,3,20,fc,f7,1,ef,fd,52,0,c1,0,0,7,d0,1,2f,0,5e,1,57,0,63,1,df,0,c1,0,0,7,d0,fd,52,0,c1,fd,52,0,c1,fc,ae,3,1d,0,0,2,ee,0,0,2,ee,fe,8b,0,a5,fc,a6,3,39,0,0,3,20,3,9,1,ef,0,0,3,20,fc,f7,1,ef,2,ae,0,c1,3,52,3,1d,0,0,2,ee,0,0,2,ee,1,75,0,a5,3,5a,3,39,0,0,3,20,2,ae,0,c1,0,0,7,d0,fe,d1,0,5e,fe,a9,0,63,fe,21,0,c1,0,0,7,d0,2,ae,0,c1,3,9,1,ef,0,0,3,20,fc,f6,0,f8,3,e8,7,bc,3,0a,0,f8,0,0,3,20,fc,f6,0,f8,fc,18,7,bc,3,0a,0,f8,0,0,3,20,fc,f7,1,ef,2,62,0,37,fd,9e,0,37,2,62,0,37,fd,9e,0,37,3,9,1,ef,0,0,3,20,fc,f7,1,ef,0,0,1,0e,0,0,1,0e,0,0,1,0e,0,0,1,0e,3,9,1,ef,0,0,3,20,fc,f7,1,ef,fd,ba,0,c1,0,0,7,d0,1,2f,0,5e,1,57,0,63,0,0,1,f4,fe,21,0,c1,0,0,7,d0,2,ae,0,c1,3,9,1,ef,0,0,3,20,0,0,3,e8,ff,ff,ff,1,0,0,ca,1,43,2,3,0,1,f5,14,0,0,3,20,0,0,3,20,0,0,3,20,3,0a,0,f8,fc,f6,0,f8,0,0,3,20,3,0a,0,f8,fc,f6,0,f8,0,0,3,20,fc,f7,1,ef,fd,52,0,c1,0,0,7,d0,3,71,1,56,3,74,1,5a,3,5a,1,ef,0,0,7,d0,0,0,3,20,fd,52,0,c1,fc,d7,2,af,2,29,0,89,3,1e,0,f8,1,75,0,a5,fd,48,1,ef,fd,98,0,a5,3,9,1,ef,0,0,3,20,fc,f7,1,ef,2,ae,0,c1,3,29,2,af,fd,d7,0,89,fc,e2,0,f8,fe,8b,0,a5,2,b8,1,ef,2,68,0,a5,2,ae,0,c1,0,0,7,d0,fc,8f,1,56,fc,8c,1,5a,fc,a6,1,ef,0,0,7,d0,0,0,3,20,3,9,1,ef,0,0,3,20,fc,f6,0,f8,0,0,7,bc,3,0a,0,f8,0,0,3,20,fc,f6,0,f8,0,0,7,bc,3,0a,0,f8,0,0,3,20,fc,f7,1,ef,3,a9,0,a5,fc,57,0,a5,3,a9,0,a5,fc,57,0,a5,3,9,1,ef,0,0,3,20,fc,f7,1,ef,0,0,1,0e,0,0,1,0e,0,0,1,0e,0,0,1,0e,3,9,1,ef,0,0,3,20,fc,f7,1,ef,fd,ba,0,c1,0,0,7,d0,3,71,1,56,3,74,1,5a,0,0,1,f4,fc,a6,1,ef,0,0,7,d0,0,0,3,20,3,9,1,ef,0,0,3,20,0,0,3,e8,ff,ff,ff,2,0,0,ca,1,43,2,3,0,1,a3,c5,fc,f6,0,f8,3,0a,0,f8,0,0,3,20,0,0,3,20,0,0,3,20,0,0,3,20,fc,f6,0,f8,3,0a,0,f8,0,0,3,20,3,9,1,ef,fd,52,0,c1,fc,d7,2,af,2,29,0,89,3,1e,0,f8,1,75,0,a5,fd,48,1,ef,fd,98,0,a5,fd,52,0,c1,0,0,7,d0,3,71,1,56,3,74,1,5a,3,5a,1,ef,0,0,7,d0,0,0,3,20,fc,f7,1,ef,0,0,3,20,3,9,1,ef,2,ae,0,c1,0,0,7,d0,fc,8f,1,56,fc,8c,1,5a,fc,a6,1,ef,0,0,7,d0,0,0,3,20,2,ae,0,c1,3,29,2,af,fd,d7,0,89,fc,e2,0,f8,fe,8b,0,a5,2,b8,1,ef,2,68,0,a5,fc,f7,1,ef,0,0,3,20,3,0a,0,f8,0,0,7,bc,fc,f6,0,f8,0,0,3,20,3,0a,0,f8,0,0,7,bc,fc,f6,0,f8,0,0,3,20,3,9,1,ef,0,0,1,0e,0,0,1,0e,0,0,1,0e,0,0,1,0e,fc,f7,1,ef,0,0,3,20,3,9,1,ef,fc,57,0,a5,3,a9,0,a5,fc,57,0,a5,3,a9,0,a5,fc,f7,1,ef,0,0,3,20,3,9,1,ef,fd,ba,0,c1,fc,d7,2,af,2,29,0,89,3,1e,0,f8,0,0,1,f4,fe,8b,0,a5,2,b8,1,ef,2,68,0,a5,fc,f7,1,ef,0,0,3,20,0,0,3,e8,ff,ff,ff,3,0,0,ca,1,43,2,3,0,1,e3,51,fc,f6,0,f8,3,0a,0,f8,0,0,3,20,0,0,3,20,0,0,3,20,0,0,3,20,fc,f6,0,f8,3,0a,0,f8,0,0,3,20,3,9,1,ef,fd,52,0,c1,fc,ae,3,1d,0,0,2,ee,0,0,2,ee,fe,8b,0,a5,fc,a6,3,39,0,0,3,20,fd,52,0,c1,0,0,7,d0,1,2f,0,5e,1,57,0,63,1,df,0,c1,0,0,7,d0,fd,52,0,c1,fc,f7,1,ef,0,0,3,20,3,9,1,ef,2,ae,0,c1,0,0,7,d0,fe,d1,0,5e,fe,a9,0,63,fe,21,0,c1,0,0,7,d0,2,ae,0,c1,2,ae,0,c1,3,52,3,1d,0,0,2,ee,0,0,2,ee,1,75,0,a5,3,5a,3,39,0,0,3,20,fc,f7,1,ef,0,0,3,20,3,0a,0,f8,3,e8,7,bc,fc,f6,0,f8,0,0,3,20,3,0a,0,f8,fc,18,7,bc,fc,f6,0,f8,0,0,3,20,3,9,1,ef,0,0,1,0e,0,0,1,0e,0,0,1,0e,0,0,1,0e,fc,f7,1,ef,0,0,3,20,3,9,1,ef,fd,9e,0,37,2,62,0,37,fd,9e,0,37,2,62,0,37,fc,f7,1,ef,0,0,3,20,3,9,1,ef,fd,ba,0,c1,fc,ae,3,1d,0,0,2,ee,0,0,2,ee,0,0,1,f4,1,75,0,a5,3,5a,3,39,0,0,3,20,fc,f7,1,ef,0,0,3,20,0,0,3,e8";

class CrawlingBot {
    constructor(runtime, extensionId) {
        this._runtime = runtime;
        this._extensionId = extensionId;
    }
}

class RoborisenCrawlingBotBlocks {
    static get EXTENSION_ID() {
        return "crawlingBot";
    }

    constructor(runtime) {
        this.runtime = runtime;
        this._peripheral = new CrawlingBot(
            this.runtime,
            RoborisenCrawlingBotBlocks.EXTENSION_ID
        );

        this._mDevice = null;
        this.rxCharacteristic = null;
        this.txCharacteristic = null;
        this.queue = [];
        this.cubeNum = 4;
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

    get DIRECTIONS() {
        return [
            ...this.DIRECTION,
            {
                text: formatMessage({
                    id: "roborisen.both",
                    default: "양쪽",
                    description: "both",
                }),
                value: "both",
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
            id: RoborisenCrawlingBotBlocks.EXTENSION_ID,
            name: "crawlingBot",
            blockIconURI: iconURI,
            showStatusButton: false,
            //#region blocks
            blocks: [
                {
                    opcode: "connectCube",
                    text: formatMessage({
                        id: "roborisen.connectCube.crawlingBot",
                        default: "크롤링봇 연결하기",
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
                    opcode: "crawlingStep",
                    text: formatMessage({
                        id: "roborisen.crawlingStep",
                        default: "크롤링봇 [DIRECTION]으로 걷기",
                        description: "crawlingStep",
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
                    opcode: "crawlingMove",
                    text: formatMessage({
                        id: "roborisen.crawlingMove",
                        default: "크롤링봇 [DIRECTION]으로 이동하기",
                        description: "crawlingMove",
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
                    opcode: "crawlingAcrobat",
                    text: formatMessage({
                        id: "roborisen.crawlingAcrobat",
                        default: "크롤링봇 [DIRECTION]으로 구르기",
                        description: "crawlingAcrobat",
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
                    opcode: "liftFoot",
                    text: formatMessage({
                        id: "roborisen.liftFoot",
                        default: "크롤링봇 [DIRECTION]발들기",
                        description: "crawlingStand",
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        DIRECTION: {
                            type: ArgumentType.STRING,
                            menu: "directions",
                            defaultValue: this.DIRECTIONS[0].value,
                        },
                    },
                },
                {
                    opcode: "crawlingStand",
                    text: formatMessage({
                        id: "roborisen.crawlingStand",
                        default: "크롤링봇 서기",
                        description: "crawlingStand",
                    }),
                    blockType: BlockType.COMMAND,
                },
            ],
            menus: {
                direction: this.DIRECTION,
                directions: this.DIRECTIONS,
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
                await this.crawlingSetting();
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
            console.log("crawlingBot is connected");
            this.allConnect = true;
        }
    }

    crawlingSetting() {
        if (this.inActionCube === true) return;
        this.inActionCube = true;

        const strSplit = CrawlingBotScheduledData.split(",");
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

    crawlingStep(args) {
        if (this.inActionCube === true) return;
        this.inActionCube = true;

        if (args.DIRECTION === "left") {
            this.enqueue(GCubeProtocol.makePointDatas(0x3a, 0x40));
        } else if (args.DIRECTION === "right") {
            this.enqueue(GCubeProtocol.makePointDatas(0x33, 0x39));
        }

        return new Promise((resolve) => {
            const repeat = setInterval(() => {
                this.inActionCube = false;
                clearInterval(repeat);
                resolve();
            }, 5000);
        });
    }

    crawlingMove(args) {
        if (this.inActionCube === true) return;
        this.inActionCube = true;

        if (args.DIRECTION === "left") {
            this.enqueue(GCubeProtocol.makePointDatas(0x2b, 0x2e));
        } else if (args.DIRECTION === "right") {
            this.enqueue(GCubeProtocol.makePointDatas(0x2f, 0x32));
        }

        return new Promise((resolve) => {
            const repeat = setInterval(() => {
                this.inActionCube = false;
                clearInterval(repeat);
                resolve();
            }, 4000);
        });
    }

    crawlingAcrobat(args) {
        if (this.inActionCube === true) return;
        this.inActionCube = true;

        if (args.DIRECTION === "left") {
            this.enqueue(GCubeProtocol.makePointDatas(0x09, 0x19));
        } else if (args.DIRECTION === "right") {
            this.enqueue(GCubeProtocol.makePointDatas(0x1a, 0x2a));
        }

        return new Promise((resolve) => {
            const repeat = setInterval(() => {
                this.inActionCube = false;
                clearInterval(repeat);
                resolve();
            }, 20000);
        });
    }

    liftFoot(args) {
        if (this.inActionCube === true) return;
        this.inActionCube = true;

        if (args.DIRECTION === "left") {
            this.enqueue(GCubeProtocol.makePointDatas(0x03, 0x05));
        } else if (args.DIRECTION === "right") {
            this.enqueue(GCubeProtocol.makePointDatas(0x00, 0x02));
        } else if (args.DIRECTION === "both") {
            this.enqueue(GCubeProtocol.makePointDatas(0x06, 0x08));
        }

        return new Promise((resolve) => {
            const repeat = setInterval(() => {
                this.inActionCube = false;
                clearInterval(repeat);
                resolve();
            }, 2000);
        });
    }

    crawlingStand() {
        if (this.inActionCube === true) return;
        this.inActionCube = true;

        this.enqueue(GCubeProtocol.makePointDatas(0x41, 0x4b));

        return new Promise((resolve) => {
            const repeat = setInterval(() => {
                this.inActionCube = false;
                clearInterval(repeat);
                resolve();
            }, 12000);
        });
    }
}

module.exports = RoborisenCrawlingBotBlocks;
