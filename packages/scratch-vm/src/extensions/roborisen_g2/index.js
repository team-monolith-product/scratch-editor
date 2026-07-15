const ArgumentType = require("../../extension-support/argument-type");
const BlockType = require("../../extension-support/block-type");
const Base64Util = require("../../util/base64-util");
const cast = require("../../util/cast");
const formatMessage = require("format-message");

const GCubeProtocol = require("../../extension-support/roborisen-support");

const iconURI =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAACXBIWXMAAC4jAAAuIwF4pT92AAAF+mlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDE5LTA2LTA0VDEzOjU3OjM4KzA5OjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDE5LTA2LTA0VDEzOjU3OjM4KzA5OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAxOS0wNi0wNFQxMzo1NzozOCswOTowMCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpjYzdjODE3ZC1kNTAxLWYxNDQtOGU4My05ZTZiYjBmNWVjNjUiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDphMDU3YWY0ZC1jMjdlLWNlNDEtYTkwZi1mZmVjNGQyODZiMmQiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDoyMTgyYjE4Mi00ZTdiLWRhNDEtOThlYS1iY2E4NjAxYTBlYjciIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjIxODJiMTgyLTRlN2ItZGE0MS05OGVhLWJjYTg2MDFhMGViNyIgc3RFdnQ6d2hlbj0iMjAxOS0wNi0wNFQxMzo1NzozOCswOTowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpjYzdjODE3ZC1kNTAxLWYxNDQtOGU4My05ZTZiYjBmNWVjNjUiIHN0RXZ0OndoZW49IjIwMTktMDYtMDRUMTM6NTc6MzgrMDk6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6Ca0e+AAASkElEQVR4nO2da3hU1bnHf2vtPXuuyeQ2uYBEoKggWhGvLfWCWKpYWxSreKq1avV4FFu0UEVt1Xospdpiz0Faj9RLsbYHAatUfMAWsYpY5aCAWIRauQjkQpJJMjN7Lnvv1Q87CaHkNpMEgj3/58mXzMxe7/rPu9Z6b+sdEVs52AIkhwhSgj8kISAh6UBKUdfo8Pc9NrtqLGqiDg1NToefDXgFkUKNSIFk+CCNwRENn1+CXwBgNzokUwrEoZoNSge0fh1Bga6Br0AD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";

const bleNusServiceUUID = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
const bleNusCharRXUUID = "6e400002-b5a3-f393-e0a9-e50e24dcca9e";
const bleNusCharTXUUID = "6e400003-b5a3-f393-e0a9-e50e24dcca9e";

class Gcube2 {
    constructor(runtime, extensionId) {
        this._runtime = runtime;
        this._extensionId = extensionId;
    }
}

class RoborisenGCube2Blocks {
    static get EXTENSION_ID() {
        return "gcube2";
    }

    constructor(runtime) {
        this.runtime = runtime;
        this._peripheral = new Gcube2(
            this.runtime,
            RoborisenGCube2Blocks.EXTENSION_ID
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

    get CUBENUM() {
        return [
            {
                text: formatMessage({
                    id: "roborisen.cube.1",
                    default: "1번",
                    description: "1",
                }),
                value: 0,
            },
            {
                text: formatMessage({
                    id: "roborisen.cube.2",
                    default: "2번",
                    description: "2",
                }),
                value: 1,
            },
            {
                text: formatMessage({
                    id: "roborisen.cube.all",
                    default: "모든",
                    description: "all",
                }),
                value: 0xff,
            },
        ];
    }

    get MODEL() {
        return [
            {
                text: formatMessage({
                    id: "roborisen..minicar",
                    default: "미니카",
                    description: "미니카",
                }),
                value: "minicar",
            },
            {
                text: formatMessage({
                    id: "roborisen..autocar",
                    default: "오토카",
                    description: "오토카",
                }),
                value: "autocar",
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
            id: RoborisenGCube2Blocks.EXTENSION_ID,
            name: "GCube2",
            blockIconURI: iconURI,
            showStatusButton: false,
            //#region blocks
            blocks: [
                {
                    opcode: "connectCube",
                    text: formatMessage({
                        id: "roborisen.connectCube",
                        default: "연결하기",
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
                    opcode: "changeLED",
                    text: formatMessage({
                        id: "roborisen.changeLED",
                        default:
                            "[CUBE] 큐브의 LED 색 바꾸기 - Red :[RED], Green :[GREEN], Blue :[BLUE]",
                        description: "changeLED",
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        CUBE: {
                            type: ArgumentType.NUMBER,
                            menu: "cube",
                            defaultValue: this.CUBENUM[0].value,
                        },
                        RED: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0,
                        },
                        GREEN: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0,
                        },
                        BLUE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0,
                        },
                    },
                },
                {
                    opcode: "setContinuous",
                    text: formatMessage({
                        id: "roborisen.setContinuous",
                        default: "[CUBE] 큐브를 [SPEED]의 속도로 계속 회전하기",
                        description: "setContinuous",
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        CUBE: {
                            type: ArgumentType.NUMBER,
                            menu: "cube",
                            defaultValue: this.CUBENUM[0].value,
                        },
                        SPEED: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0,
                        },
                    },
                },
                {
                    opcode: "setStep",
                    text: formatMessage({
                        id: "roborisen.setStep",
                        default:
                            "[CUBE] 큐브를 [SPEED]의 속도로 [STEP]도 만큼 회전하기",
                        description: "setStep",
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        CUBE: {
                            type: ArgumentType.NUMBER,
                            menu: "cube",
                            defaultValue: this.CUBENUM[0].value,
                        },
                        SPEED: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0,
                        },
                        STEP: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0,
                        },
                    },
                },
                "---",
                {
                    opcode: "setMatrixXY",
                    text: formatMessage({
                        id: "roborisen.setMatrixXY",
                        default:
                            "[CUBE] 큐브의 매트릭스 제어 - X :[X], Y :[Y], On/Off :[ONOFF]",
                        description: "setMatrixXY",
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        CUBE: {
                            type: ArgumentType.NUMBER,
                            menu: "cube",
                            defaultValue: this.CUBENUM[0].value,
                        },
                        X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0,
                        },
                        Y: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0,
                        },
                        ONOFF: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0,
                        },
                    },
                },
                {
                    opcode: "setMatrix8",
                    text: formatMessage({
                        id: "roborisen.setMatrix8",
                        default: "[CUBE] 큐브의 매트릭스 제어 - [MATRIX8]",
                        description: "setMatrix8",
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        CUBE: {
                            type: ArgumentType.NUMBER,
                            menu: "cube",
                            defaultValue: this.CUBENUM[0].value,
                        },
                        MATRIX8: {
                            type: ArgumentType.MATRIX8,
                            defaultValue:
                                "1000000001000000001000000001000000000000000000000000000000000000",
                        },
                    },
                },
                //#region carBlocks
                {
                    opcode: "carContinuous",
                    text: formatMessage({
                        id: "roborisen.carContinuous",
                        default: "[MODE] : [SPEED]의 속도로 이동하기",
                        description: "carContinuous",
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        MODE: {
                            type: ArgumentType.STRING,
                            menu: "mode",
                            defaultValue: this.MODEL[0].value,
                        },
                        SPEED: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0,
                        },
                    },
                },
                {
                    opcode: "carStep",
                    text: formatMessage({
                        id: "roborisen.carStep",
                        default: "[MODE] : [SPEED]의 속도로 [CM]CM 이동하기",
                        description: "carStep",
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        MODE: {
                            type: ArgumentType.STRING,
                            menu: "mode",
                            defaultValue: this.MODEL[0].value,
                        },
                        SPEED: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0,
                        },
                        CM: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0,
                        },
                    },
                },
                {
                    opcode: "carDegree",
                    text: formatMessage({
                        id: "roborisen.carDegree",
                        default: "[MODE] : [DEGREE]도 회전하기",
                        description: "carDegree",
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        MODE: {
                            type: ArgumentType.STRING,
                            menu: "mode",
                            defaultValue: this.MODEL[0].value,
                        },
                        DEGREE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0,
                        },
                    },
                },
            ],
            menus: {
                cube: this.CUBENUM,
                mode: this.MODEL,
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
            console.log("connected complete");
            this.allConnect = true;
        }
    }

    changeLED(args) {
        if (this.inActionCube === true) return;
        this.inActionCube = true;

        const ColorLEDData = GCubeProtocol.makeColorLEDData(
            args.CUBE,
            args.RED,
            args.GREEN,
            args.BLUE
        );

        this.enqueue(ColorLEDData);

        return new Promise((resolve) => {
            const repeat = setInterval(() => {
                this.inActionCube = false;
                clearInterval(repeat);
                resolve();
            }, 64);
        });
    }

    setContinuous(args) {
        if (this.inActionCube === true) return;
        this.inActionCube = true;

        const makeContinuousData = GCubeProtocol.makeContinuousData(
            args.CUBE,
            this.cubeNum,
            GCubeProtocol.changeSpeedToSps(args.SPEED)
        );

        this.enqueue(makeContinuousData);

        return new Promise((resolve) => {
            const repeat = setInterval(() => {
                this.inActionCube = false;
                clearInterval(repeat);
                resolve();
            }, 64);
        });
    }

    setStep(args) {
        if (this.inActionCube === true) return;
        this.inActionCube = true;
        const speed = GCubeProtocol.changeSpeedToSps(args.SPEED);
        const step = GCubeProtocol.changeDegreeToStep(args.STEP);
        let delay = GCubeProtocol.makeDelayTimeFromSpeedStep(speed, step);
        const makeSingleStepData = GCubeProtocol.makeSingleStep(
            args.CUBE,
            this.cubeNum,
            speed,
            step
        );

        this.enqueue(makeSingleStepData);

        return new Promise((resolve) => {
            const repeat = setInterval(() => {
                this.inActionCube = false;
                clearInterval(repeat);
                resolve();
            }, delay);
        });
    }

    async setMatrixXY(args) {
        if (this.inActionCube === true) return;
        this.inActionCube = true;

        const makeMatrixXYData = GCubeProtocol.makeMatrixXY(
            args.CUBE,
            this.cubeNum,
            args.X,
            7 - args.Y,
            args.ONOFF
        );
        await this.enqueue(makeMatrixXYData);

        console.log(
            `Receive ${String(GCubeProtocol.byteToString(makeMatrixXYData))}`
        );
        return new Promise((resolve) => {
            const repeat = setInterval(() => {
                this.inActionCube = false;
                clearInterval(repeat);
                resolve();
            }, 64);
        });
    }

    async setMatrix8(args) {
        if (this.inActionCube === true) return;
        this.inActionCube = true;

        const argData = cast.toString(args.MATRIX8).replace(/\s/g, "");

        if (argData !== null) {
            const splitData = argData.split("");
            const pictureData = new Uint8Array(8).fill(0);

            for (let i = 0; i < 8; i++) {
                for (let j = 0; j < 8; j++) {
                    pictureData[(i + 1) % 8] +=
                        splitData[j + 8 * (7 - i)] * Math.pow(2, 7 - j);
                }
            }

            const makeMatrix8Data = GCubeProtocol.makeMatrixPictureData(
                args.CUBE,
                this.cubeNum,
                pictureData
            );
            await this.enqueue(makeMatrix8Data);
            console.log(
                `Receive ${String(GCubeProtocol.byteToString(makeMatrix8Data))}`
            );
        }

        return new Promise((resolve) => {
            const repeat = setInterval(() => {
                this.inActionCube = false;
                clearInterval(repeat);
                resolve();
            }, 64);
        });
    }
    //#region carFunction
    carContinuous(args) {
        if (this.inActionCube === true) return;
        this.inActionCube = true;

        const carData = new Array(2).fill(0);

        const sps0 = GCubeProtocol.changeSpeedToSps(args.SPEED);
        const sps1 = GCubeProtocol.changeSpeedToSps(args.SPEED * -1);

        carData[0] = GCubeProtocol.makeContinuousData(0, this.cubeNum, sps0);
        carData[1] = GCubeProtocol.makeContinuousData(1, this.cubeNum, sps1);

        this.enqueue(GCubeProtocol.makeAggregateStep(this.cubeNum, carData, 0));

        return new Promise((resolve) => {
            const repeat = setInterval(() => {
                this.inActionCube = false;
                clearInterval(repeat);
                resolve();
            }, 64);
        });
    }

    carStep(args) {
        if (this.inActionCube === true) return;
        this.inActionCube = true;

        const carData = new Array(2).fill(0);
        let delay = 0;
        let step;

        if (args.MODE === "minicar") {
            step = Math.round(Math.abs(args.CM) * 99);
        } else if (args.MODE === "autocar") {
            step = Math.round(Math.abs(args.CM) * 24.44444);
        }
        delay = GCubeProtocol.makeDelayTimeFromSpeedStep(
            GCubeProtocol.changeSpeedToSps(args.SPEED),
            step
        );
        if (args.CM > 0) {
            carData[0] = GCubeProtocol.makeSingleStep(
                0,
                this.cubeNum,
                GCubeProtocol.changeSpeedToSps(args.SPEED),
                step
            );
            carData[1] = GCubeProtocol.makeSingleStep(
                1,
                this.cubeNum,
                GCubeProtocol.changeSpeedToSps(args.SPEED) * -1,
                step
            );
        } else {
            carData[0] = GCubeProtocol.makeSingleStep(
                0,
                this.cubeNum,
                GCubeProtocol.changeSpeedToSps(args.SPEED) * -1,
                step
            );
            carData[1] = GCubeProtocol.makeSingleStep(
                1,
                this.cubeNum,
                GCubeProtocol.changeSpeedToSps(args.SPEED),
                step
            );
        }

        this.enqueue(GCubeProtocol.makeAggregateStep(this.cubeNum, carData, 1));

        return new Promise((resolve) => {
            const repeat = setInterval(() => {
                this.inActionCube = false;
                clearInterval(repeat);
                resolve();
            }, delay);
        });
    }

    carDegree(args) {
        if (this.inActionCube === true) return;
        this.inActionCube = true;

        const carData = new Array(2).fill(0);
        let delay = 0;
        let speed;
        let step;
        if (args.MODE === "minicar") {
            speed = GCubeProtocol.changeSpeedToSps(90);
            step = Math.round(Math.abs(args.DEGREE) * 6.54);
        } else if (args.MODE === "autocar") {
            speed = GCubeProtocol.changeSpeedToSps(900);
            step = Math.round(Math.abs(args.DEGREE) * 2.25);
        }

        delay = GCubeProtocol.makeDelayTimeFromSpeedStep(speed, step);

        if (args.DEGREE < 0) {
            carData[0] = GCubeProtocol.makeSingleStep(2, 0, speed, step);
            carData[1] = GCubeProtocol.makeSingleStep(2, 1, speed, step);
        } else {
            carData[0] = GCubeProtocol.makeSingleStep(2, 0, speed * -1, step);
            carData[1] = GCubeProtocol.makeSingleStep(2, 1, speed * -1, step);
        }

        this.enqueue(GCubeProtocol.makeAggregateStep(this.cubeNum, carData, 1));

        return new Promise((resolve) => {
            const repeat = setInterval(() => {
                this.inActionCube = false;
                clearInterval(repeat);
                resolve();
            }, delay);
        });
    }
}

module.exports = RoborisenGCube2Blocks;
