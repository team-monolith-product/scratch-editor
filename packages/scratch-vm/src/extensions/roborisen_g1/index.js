const ArgumentType = require("../../extension-support/argument-type");
const BlockType = require("../../extension-support/block-type");
const Base64Util = require("../../util/base64-util");
const cast = require("../../util/cast");
const formatMessage = require("format-message");

const GCubeProtocol = require("../../extension-support/roborisen-support");

const iconURI =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAACXBIWXMAAC4jAAAuIwF4pT92AAAF+mlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDE5LTA2LTA0VDEzOjU4OjA1KzA5OjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDE5LTA2LTA0VDEzOjU4OjA1KzA5OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAxOS0wNi0wNFQxMzo1ODowNSswOTowMCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDowZDFjYTFiNC0xMTQxLWI1NDgtOTM4Mi1hNTI1ZDVjOGQ2YjUiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDo5YmZhZjExNi1lNjNlLWNjNDEtOTUwMC1iNjIwOTcyNjc5OTkiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDphYThlMTc5NC02MDgxLTc0NDctYjc0MC00NzA3NTc4NTFiNTEiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmFhOGUxNzk0LTYwODEtNzQ0Ny1iNzQwLTQ3MDc1Nzg1MWI1MSIgc3RFdnQ6d2hlbj0iMjAxOS0wNi0wNFQxMzo1ODowNSswOTowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDowZDFjYTFiNC0xMTQxLWI1NDgtOTM4Mi1hNTI1ZDVjOGQ2YjUiIHN0RXZ0OndoZW49IjIwMTktMDYtMDRUMTM6NTg6MDUrMDk6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7FC+CWAAAQEElEQVR4nO2de3RU1b3HP3ufM2fOZGYyScgDCCDyEkUpCMhLRLtc7QIr+MJetb1FbSlWrVrrxdfycX20YlsUvF5UxFWr3iuoveIDxFd9AIr3ahVUEAWFQEKSSSaZ98w5Z98/Jokg5DmTEGg/a80KrJWc/Tvf7N9+/H6/vSMia8t3Avn0EC4djHwNDCCiUJaiMmjzZYVFZdChOmQTiamD/mzAJykrlJQWagwt1+jXR0O4BHgFpCDVaJO2eupNAGjUgQGA6K4WlAKP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";

const bleNusServiceUUID = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
const bleNusCharRXUUID = "6e400002-b5a3-f393-e0a9-e50e24dcca9e";
const bleNusCharTXUUID = "6e400003-b5a3-f393-e0a9-e50e24dcca9e";

class Gcube1 {
    constructor(runtime, extensionId) {
        this._runtime = runtime;
        this._extensionId = extensionId;
    }
}

class RoborisenGCube1Blocks {
    static get EXTENSION_ID() {
        return "gcube1";
    }

    constructor(runtime) {
        this.runtime = runtime;
        this._peripheral = new Gcube1(
            this.runtime,
            RoborisenGCube1Blocks.EXTENSION_ID
        );

        this._mDevice = null;
        this.rxCharacteristic = null;
        this.txCharacteristic = null;
        this.queue = [];
        this.cubeNum = 1;
        this.inActionCube = false;
    }

    async enqueue(data) {
        for (let i = 0; i < data.length; i += 20) {
            const chunk = data.slice(i, i + 20);
            this.queue.push(chunk);
        }
        await this.processQueue();
    }

    async processQueue() {
        if (this.isSending || this.queue.length === 0) return;

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
            id: RoborisenGCube1Blocks.EXTENSION_ID,
            name: "GCube1",
            blockIconURI: iconURI,
            showStatusButton: false,
            //#region blocks
            blocks: [
                {
                    opcode: "connectCube",
                    text: formatMessage({
                        id: "gcubes.connectCube",
                        default: "연결하기",
                        description: "connectCube",
                    }),
                    blockType: BlockType.COMMAND,
                },
                {
                    opcode: "disconnectCube",
                    text: formatMessage({
                        id: "gcubes.disconnectCube",
                        default: "연결 끊기",
                        description: "disconnectCube",
                    }),
                    blockType: BlockType.COMMAND,
                },
                {
                    opcode: "changeLED",
                    text: formatMessage({
                        id: "gcube.changeLED",
                        default:
                            "LED 색 바꾸기 - Red :[RED], Green :[GREEN], Blue :[BLUE]",
                        description: "changeLED",
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
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
                        id: "gcube.setContinuous",
                        default: "[SPEED]의 속도로 계속 회전하기",
                        description: "setContinuous",
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        SPEED: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0,
                        },
                    },
                },
                {
                    opcode: "setStep",
                    text: formatMessage({
                        id: "gcube.setStep",
                        default: "[SPEED]의 속도로 [STEP]도 만큼 회전하기",
                        description: "setStep",
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
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
                        id: "gcube.setMatrixXY",
                        default:
                            "매트릭스 제어 - X :[X], Y :[Y], On/Off :[ONOFF]",
                        description: "setMatrixXY",
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
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
                        id: "gcube.setMatrix8",
                        default: "메트릭스 제어 - [MATRIX8]",
                        description: "setMatrix8",
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        MATRIX8: {
                            type: ArgumentType.MATRIX8,
                            defaultValue:
                                "1000000001000000001000000001000000000000000000000000000000000000",
                        },
                    },
                },
            ],
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
            findID = !groupID || groupID == 0?
            `PINGPONG`: `PINGPONG.${groupID.padStart(2, "0")}`;
            console.log(`find ${findID}`);
            this._mDevice = await navigator.bluetooth.requestDevice({
                filters: [{ namePrefix: findID }],
                optionalServices: [bleNusServiceUUID],
            });

            this._server = await this._mDevice.gatt.connect();
            console.log("Cube connected:", this._server);
            const service = await this._server.getPrimaryService(bleNusServiceUUID);//서비스
            this.rxCharacteristic = await service.getCharacteristic(bleNusCharRXUUID);//쓰기특성
            this.txCharacteristic = await service.getCharacteristic(bleNusCharTXUUID);//읽기특성
            await this.txCharacteristic.startNotifications();

            this.txCharacteristic.addEventListener("characteristicvaluechanged",this.handleNotifications.bind(this));//구독

            this._mDevice.addEventListener("gattserverdisconnected",async () => {
                this.rxCharacteristic = null;
                this.txCharacteristic = null;
                console.log("Cube disconnected");
            }
        );
        this.enqueue(GCubeProtocol.getOrangeForSoundData());
        } catch (error) {
            console.log('connectErr',error);
        }
    }

    async disconnectCube() {
        this.enqueue(GCubeProtocol.rebootMultiroleAggregator());
        this.isSending=false;
    }

    handleNotifications(event) {
        const value = event.target.value;

        if (value.byteLength !== 0) {
            console.log(
                `Receive ${String(GCubeProtocol.byteToStringReceive(event))}`
            );
        }
    }

    changeLED(args) {
        if (this.inActionCube === true) return;
        this.inActionCube = true;

        const ColorLEDData = GCubeProtocol.makeColorLEDData(
            7,
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
            7,
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
            7,
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
            7,
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
                7,
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
}

module.exports = RoborisenGCube1Blocks;
