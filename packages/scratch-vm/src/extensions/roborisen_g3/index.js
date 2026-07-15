const ArgumentType = require("../../extension-support/argument-type");
const BlockType = require("../../extension-support/block-type");
const Base64Util = require("../../util/base64-util");
const cast = require("../../util/cast");
const formatMessage = require("format-message");

const GCubeProtocol = require("../../extension-support/roborisen-support");

const iconURI =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAIAAAABc2X6AAAACXBIWXMAAC4jAAAuIwF4pT92AAAF+mlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDE5LTA2LTA0VDEzOjU5OjA3KzA5OjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDE5LTA2LTA0VDEzOjU5OjA3KzA5OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAxOS0wNi0wNFQxMzo1OTowNyswOTowMCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDphMGRmMTIyOC0wYTdmLWVhNDItYjE5NC0zYWQ1OWYwZWJhZDkiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDo1MDhkZDU3Ny0wY2VjLTM1NDYtYTk0Mi02Y2IyYzg2Y2UyMmUiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpmMGJjN2M5OC1mMzkxLWEyNGItOGE3MC1jNDQ5YjFlNzgxYTYiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmYwYmM3Yzk4LWYzOTEtYTI0Yi04YTcwLWM0NDliMWU3ODFhNiIgc3RFdnQ6d2hlbj0iMjAxOS0wNi0wNFQxMzo1OTowNyswOTowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDphMGRmMTIyOC0wYTdmLWVhNDItYjE5NC0zYWQ1OWYwZWJhZDkiIHN0RXZ0OndoZW49IjIwMTktMDYtMDRUMTM6NTk6MDcrMDk6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7WusTnAAARaUlEQVR4nN1caZgU1bl+zzlV1dVdvUz3dM/WMKyyKUS4KBoVFxKjmEXUazCKUWNcEHPVByUoisbEG6Im3CeiUUGSx8QbUcFIJHGULW4gBkRBEdGRdTaa7umu7uruqjrn/uhZWBqma2ZQuO/Tf6an69T31lm+tT6i10XR26AUbi+FhyLLkROxVv7FHntns9Wc4PEkP+jHHheJBFmkjA6sYdEIU90UbgLAbuXZnADpZdmk3hpICEgMahmDBBhiyzZzzebcB5+Z67bk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";

const bleNusServiceUUID = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
const bleNusCharRXUUID = "6e400002-b5a3-f393-e0a9-e50e24dcca9e";
const bleNusCharTXUUID = "6e400003-b5a3-f393-e0a9-e50e24dcca9e";

const wormBotScheduledData =
    "ff,ff,ff,aa,20,0,cd,2,43,2,3,0,0,ff,ff,ff,0,0,0,ca,1,1b,2,3,0,1,c5,17,fc,a5,0,f8,3,5b,0,f8,fc,7c,0,f8,0,0,2,58,3,5b,0,f8,fc,7c,0,f8,0,0,2,58,3,5b,0,f8,0,0,2,58,0,0,3,20,fc,a5,0,f8,0,0,2,58,3,84,0,f8,fc,a5,0,f8,0,0,2,58,3,84,0,f8,fc,a5,0,f8,0,0,2,58,3,5b,0,f8,0,0,3,20,fc,41,1,ef,3,97,1,ef,3,97,1,ef,1,1a,0,6e,fc,48,2,5d,0,0,2,26,2,ff,0,a5,fd,5c,0,a5,0,0,3,20,fc,f2,0,dc,2,b3,0,dc,1,1a,0,6e,3,3c,1,4a,fc,80,1,b8,fc,23,1,ef,3,dd,1,ef,0,0,2,bc,0,0,3,20,fc,41,1,ef,3,97,1,ef,0,0,3,20,fc,23,1,ef,3,dd,1,ef,0,0,2,bc,0,0,3,20,2,b9,0,f8,fc,8d,0,8a,3,73,0,8a,fc,8d,0,8a,3,73,0,8a,fc,7d,1,f0,3,73,0,8a,fc,8d,0,8a,3,73,0,8a,fc,8d,0,8a,fc,7e,0,f7,3,82,1,ef,fc,7d,0,f8,3,ab,1,f0,fc,55,1,f0,3,ab,1,f0,fc,55,0,f8,fc,23,1,ef,3,dd,1,ef,0,0,2,bc,0,0,3,20,0,0,3,e8,ff,ff,ff,1,0,0,ca,1,1b,2,3,0,1,48,bf,fc,a5,0,f8,0,0,2,58,3,84,0,f8,fc,a5,0,f8,0,0,2,58,3,84,0,f8,fc,a5,0,f8,0,0,2,58,3,5b,0,f8,0,0,3,20,fc,a5,0,f8,3,5b,0,f8,fc,7c,0,f8,0,0,2,58,3,5b,0,f8,fc,7c,0,f8,0,0,2,58,3,5b,0,f8,0,0,2,58,0,0,3,20,fc,f2,0,dc,2,b3,0,dc,1,1a,0,6e,3,3c,1,4a,fc,80,1,b8,fc,23,1,ef,3,dd,1,ef,0,0,2,bc,0,0,3,20,fc,41,1,ef,3,97,1,ef,3,97,1,ef,1,1a,0,6e,fc,48,2,5d,0,0,2,26,2,ff,0,a5,fd,5c,0,a5,0,0,3,20,fc,f2,0,dc,2,b3,0,dc,0,0,3,20,0,0,2,26,2,ff,0,a5,fd,5c,0,a5,0,0,3,20,2,b9,0,f8,fc,8d,0,8a,3,73,0,8a,fc,8d,0,8a,3,73,0,8a,fc,7d,1,f0,3,73,0,8a,fc,8d,0,8a,3,73,0,8a,fc,8d,0,8a,fd,20,0,89,3,49,1,81,3,83,0,f8,fc,55,1,f0,3,ab,1,f0,fc,55,1,f0,3,ab,0,f8,0,0,2,26,2,ff,0,a5,fd,5c,0,a5,0,0,3,20,0,0,3,e8";

class Gcube3 {
    constructor(runtime, extensionId) {
        this._runtime = runtime;
        this._extensionId = extensionId;
    }
}

class RoborisenGCube3Blocks {
    static get EXTENSION_ID() {
        return "gcube3";
    }

    constructor(runtime) {
        this.runtime = runtime;
        this._peripheral = new Gcube3(
            this.runtime,
            RoborisenGCube3Blocks.EXTENSION_ID
        );

        this._mDevice = null;
        this.rxCharacteristic = null;
        this.txCharacteristic = null;
        this.queue = [];
        this.cubeNum = 3;
        this.inActionCube = false;
        this.allConnect = false;
        this.cancle = false;
        this.robotFunctionState = false;
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
                    id: "roborisen.cube.3",
                    default: "3번",
                    description: "3",
                }),
                value: 2,
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
                    id: "roborisen..antbot",
                    default: "엔트봇",
                    description: "엔트봇",
                }),
                value: "antbot",
            },
            {
                text: formatMessage({
                    id: "roborisen..battlebot",
                    default: "배틀봇",
                    description: "배틀봇",
                }),
                value: "battlebot",
            },
            {
                text: formatMessage({
                    id: "roborisen..drawingbot",
                    default: "드로잉봇",
                    description: "드로잉봇",
                }),
                value: "drawingbot",
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
        try {
            await this.rxCharacteristic?.writeValue(packet);
        } catch (e) {
            console.log("sendErr", e);
        }
    }

    getInfo() {
        return {
            id: RoborisenGCube3Blocks.EXTENSION_ID,
            name: "GCube3",
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
                {
                    opcode: "antbotFunctionToggle",
                    text: formatMessage({
                        id: "roborisen.antbotFunctionToggle",
                        default: "엔트봇 집게 [ANGLE]도 만큼 열기/닫기",
                        description: "antbotFunctionToggle",
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        ANGLE: {
                            type: ArgumentType.STRING,
                            defaultValue: 860,
                        },
                    },
                },
                {
                    opcode: "battlebotFunctionToggle",
                    text: formatMessage({
                        id: "roborisen.battlebotFunctionToggle",
                        default: "배틀봇 버킷 올리기/내리기",
                        description: "robotFunctionToggle",
                    }),
                    blockType: BlockType.COMMAND,
                },
                {
                    opcode: "drawingbotFunctionToggle",
                    text: formatMessage({
                        id: "roborisen.drawingbotFunctionToggle",
                        default: "드로잉봇 펜 올리기/내리기",
                        description: "robotFunctionToggle",
                    }),
                    blockType: BlockType.COMMAND,
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

        if (
            value.getUint8(6) == 0xad &&
            value.getUint8(9) == this.cubeNum - 1
        ) {
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
        // console.log('setContinuous');
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
        // console.log('setContinuous');
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
        let speed;
        let step;

        if (args.MODE === "drawingbot") {
            speed = GCubeProtocol.changeSpeedToSps(args.SPEED);
            step = Math.round(Math.abs(args.CM) * 99);
        } else if (args.MODE === "bettlebot" || args.MODE === "antbot") {
            speed = GCubeProtocol.changeSpeedToSps(args.SPEED);
            step = Math.round(Math.abs(args.CM) * 24.44444);
        }
        delay = GCubeProtocol.makeDelayTimeFromSpeedStep(speed, step);
        if (args.CM > 0) {
            carData[0] = GCubeProtocol.makeSingleStep(
                0,
                this.cubeNum,
                speed,
                step
            );
            carData[1] = GCubeProtocol.makeSingleStep(
                1,
                this.cubeNum,
                speed * -1,
                step
            );
        } else {
            carData[0] = GCubeProtocol.makeSingleStep(
                0,
                this.cubeNum,
                speed * -1,
                step
            );
            carData[1] = GCubeProtocol.makeSingleStep(
                1,
                this.cubeNum,
                speed,
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
        if (args.MODE === "drawingbot") {
            speed = GCubeProtocol.changeSpeedToSps(90);
            step = Math.round(Math.abs(args.DEGREE) * 6.54);
        } else if (args.MODE === "bettlebot" || args.MODE === "antbot") {
            speed = GCubeProtocol.changeSpeedToSps(900);
            step = Math.round(Math.abs(args.DEGREE) * 2.25);
        }

        delay = GCubeProtocol.makeDelayTimeFromSpeedStep(speed, step);

        if (args.DEGREE < 0) {
            carData[0] = GCubeProtocol.makeSingleStep(
                this.cubeNum,
                0,
                speed,
                step
            );
            carData[1] = GCubeProtocol.makeSingleStep(
                this.cubeNum,
                1,
                speed,
                step
            );
        } else {
            carData[0] = GCubeProtocol.makeSingleStep(
                this.cubeNum,
                0,
                speed * -1,
                step
            );
            carData[1] = GCubeProtocol.makeSingleStep(
                this.cubeNum,
                1,
                speed * -1,
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

    antbotFunctionToggle(args) {
        this.robotFunctionToggle("ant",args.ANGLE);
    }
    battlebotFunctionToggle() {
        this.robotFunctionToggle("battle");
    }
    drawingbotFunctionToggle() {
        this.robotFunctionToggle("drawing");
    }

    robotFunctionToggle(model,angle='0') {
        if (this.inActionCube === true) return;
        this.inActionCube = true;
        let speed;
        let step;
        if (model == "ant") {
            step = GCubeProtocol.changeDegreeToStep(angle);
        } else {
            step = GCubeProtocol.changeDegreeToStep(90);
        }
        speed = GCubeProtocol.changeSpeedToSps(100);
        delay = GCubeProtocol.makeDelayTimeFromSpeedStep(speed, step);

        speed = this.robotFunctionState ? speed : speed * -1;
        this.robotFunctionState = !this.robotFunctionState;

        this.enqueue(
            GCubeProtocol.makeSingleStep(2, this.cubeNum, speed, step)
        );

        return new Promise((resolve) => {
            const repeat = setInterval(() => {
                this.inActionCube = false;
                clearInterval(repeat);
                resolve();
            }, delay);
        });
    }
}

module.exports = RoborisenGCube3Blocks;
