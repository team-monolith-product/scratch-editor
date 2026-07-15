class GCubeProtocol{

    /**
     * - Set Color LED Data
     * @param {number} cubeID
     * - Cube Number
     * @param {number} red
     * - Red
     * @param {number} green
     * - Green
     * @param {number} blue
     * - Blue
     * @returns {Uint8Array}
     * - Data
     */
    static makeColorLEDData (cubeID, red, green, blue) {
        const data = new Uint8Array(14);

        data[0] = 0xff;
        data[1] = 0xff;
        data[2] = 0x00;
        data[3] = cubeID;
        data[4] = 0x00;
        data[5] = 0x00;
        data[6] = 0xce;
        data[7] = 0x00;
        data[8] = 0x0e;
        data[9] = 0x01;
        data[10] = red;
        data[11] = green;
        data[12] = blue;
        data[13] = 0x50;

        return data;
    }

    static getOrangeForSoundData () {
        const data = new Uint8Array(14);

        data[0] = 0xff;
        data[1] = 0xff;
        data[2] = 0x00;
        data[3] = 0x07;
        data[4] = 0x00;
        data[5] = 0x00;
        data[6] = 0xce;
        data[7] = 0x00;
        data[8] = 0x0e;
        data[9] = 0x02;
        data[10] = 0x00;
        data[11] = 0x00;
        data[12] = 0x07;
        data[13] = 0x50;

        return data;
    }

    static getSetMultiroleInAction (cubeNum, groupID) {
        const data = new Uint8Array(11);

        data[0] = 0xff;
        data[1] = 0xff;
        data[2] = 0xff;
        data[3] = 0xff;

        data[4] = cubeNum << 4;
        data[5] = 0x00;

        data[6] = 0xad;

        data[7] = 0x00;
        data[8] = 0x0b;

        data[9] = 0x0a;
        data[10] = 0x00;

        if (groupID === '00') {
            data[9] = 0x0a;
            data[10] = 0x00;
        } else {
            data[9] = 0x1a;
            data[10] = parseInt(groupID, 10);
        }

        return data;
    }

    static makeContinuousData (cubeID, cubeNum, speed) {
        const data = new Uint8Array(15);

        data[0] = 0xff;
        data[1] = 0xff;
        data[2] = 0xff;
        data[3] = cubeID;

        data[4] = cubeNum << 4;
        data[5] = 0x00;

        data[6] = 0xcc;

        data[7] = 0x00;
        data[8] = 0x0f;

        data[9] = 0x01;
        data[10] = 0x00;
        data[11] = 0x00;
        data[12] = 0x02;

        const speedBytes = GCubeProtocol.intToByte(speed);
        data[13] = speedBytes[0];
        data[14] = speedBytes[1];

        return data;
    }

    static makeSingleStep (cubeID, cubeNum, speed, step) {
        const data = new Uint8Array(19);

        data[0] = 0xff;
        data[1] = 0xff;
        data[2] = 0xff;
        data[3] = cubeID;

        data[4] = cubeNum << 4;
        data[5] = 0x00;

        data[6] = 0xc1;

        data[7] = 0x00;
        data[8] = 0x13;

        data[9] = 0x01;
        data[10] = 0x01;
        data[11] = 0x00;
        data[12] = 0x02;

        const speedBytes = GCubeProtocol.intToByte(speed);
        const stepBytes = GCubeProtocol.intToByte(step);
        data[13] = speedBytes[0];
        data[14] = speedBytes[1];
        data[15] = 0x00;
        data[16] = 0x00;
        data[17] = stepBytes[0];
        data[18] = stepBytes[1];
        return data;
    }

    static makeAggregateStep (cubeNum, innerData, method) {
        const packetSize = 13 + (innerData[0].length * innerData.length);
        const data = new Uint8Array(packetSize);

        data[0] = 0xff;
        data[1] = 0xff;
        data[2] = 0xff;
        data[3] = 0xaa;

        data[4] = cubeNum << 4;
        data[5] = 0x00;

        data[6] = 0xcd;

        const packetSizeBytes = GCubeProtocol.intToByte(packetSize);
        data[7] = packetSizeBytes[0];
        data[8] = packetSizeBytes[1];

        data[9] = 0x02;
        // Continuous : 0
        // Single : 1
        // ScheduledStep : 3
        // ScheduledPoint : 4
        data[10] = method;
        data[11] = 0x00;
        data[12] = 0x00;

        for (let i = 0; i < innerData.length; i++) {
            for (let j = 0; j < innerData[i].length; j++) {
                data[13 + (innerData[i].length * i) + j] = innerData[i][j];
            }
        }

        return data;
    }

    static makePointDatas (start, end) {
        const data = new Uint8Array(20);

        data[0] = 0xff;
        data[1] = 0xff;
        data[2] = 0xff;
        data[3] = 0xff;

        data[4] = 0x0;
        data[5] = 0x0;

        data[6] = 0xcb;
        data[7] = 0x00;
        data[8] = 0x14;
        data[9] = 0x02;
        data[10] = 0x04;
        data[11] = 0x00;
        data[12] = 0x02;

        data[13] = 0x0;
        data[14] = 0x0;

        data[15] = 0x0;
        data[16] = start;
        data[17] = 0x0;
        data[18] = end;
        data[19] = 0x1;

        return data;
    }

    static getSensorsData (Position, Interval) {

        const data = new Uint8Array(11);

        data[0] = 0xff;
        data[1] = 0xff;
        data[2] = 0x00;
        data[3] = Position; // cube Index
        data[4] = 0x00;
        data[5] = 0xc8;
        data[6] = 0xb8;
        data[7] = 0x00;
        data[8] = 0x0b;
        data[9] = Interval;
        data[10] = 0x1;

        return data;
    }

    static makeMatrixXY (cubeID, cubeNum, x, y, onoff) {

        const data = new Uint8Array(13);

        data[0] = 0xff;
        data[1] = 0xff;
        data[2] = 0xff;
        data[3] = cubeID;

        data[4] = 0x00;
        data[5] = 0xe1;

        data[6] = 0xa2;

        data[7] = 0x00;
        data[8] = 0x0d;

        data[9] = 0x70;

        data[10] = x;
        data[11] = y;
        data[12] = onoff;

        return data;
    }

    static makeMatrixPictureData (cubeID, cubeNum, pictureData) {

        const data = new Uint8Array(18);

        data[0] = 0xff;
        data[1] = 0xff;
        data[2] = 0xff;
        data[3] = cubeID;

        data[4] = 0x00;
        data[5] = 0xe2;

        data[6] = 0xa2;

        data[7] = 0x00;
        data[8] = 0x12;

        data[9] = 0x70;

        data[10] = pictureData[0];
        data[11] = pictureData[1];
        data[12] = pictureData[2];
        data[13] = pictureData[3];
        data[14] = pictureData[4];
        data[15] = pictureData[5];
        data[16] = pictureData[6];
        data[17] = pictureData[7];

        return data;
    }

    static makeDelayTimeFromSpeedStep (speed, step) {
        if (speed === 0) {
            return 0;
        }

        const delayTime = Math.round(((1100 - speed) / 99) * step);

        return delayTime;
    }

    static changeSpeedToSps (speed) {
        let sps = 0;

        if (speed < 0) {
            sps = 65536 - (((Math.abs(speed) * 1100) - 10000) / Math.abs(speed));
        } else if (speed === 0) {
            sps = 0;
        } else {
            sps = ((speed * 1100) - 10000) / speed;
        }

        return sps;
    }

    static changeDegreeToStep (degree) {
        return (degree * 1980) / 360;
    }

    static intToByte (int) {
        const intToByteData = new Uint8Array(2);
        intToByteData[0] = (int >> 8) & 0xff; // 상위 바이트
        intToByteData[1] = int & 0xff; // 하위 바이트
        return intToByteData;
    }

    static byteToStringReceive (event) {
        let hexStr = '';
        const hexSpace = ' ';

        for (let i = 0; i < event.target.value.byteLength; i++) {
            // 각 바이트를 16진수로 변환
            const hex = event.target.value.getUint8(i)
                .toString(16)
                .padStart(2, '0');
            hexStr += hex + hexSpace;
        }

        // 공백 제거
        hexStr.trim();
        return hexStr;
    }

    static byteToString (data) {
        let hexStr = '';
        const hexSpace = ' ';

        for (let i = 0; i < data.byteLength; i++) {
            // 각 바이트를 16진수로 변환
            const hex = data[i]
                .toString(16)
                .padStart(2, '0');
            hexStr += hex + hexSpace;
        }

        // 공백 제거
        hexStr.trim();
        return hexStr;
    }

    static rebootMultiroleAggregator() {
        var txCharSendTest = new Uint8Array(10);

        txCharSendTest[0] = 0xFF;
        txCharSendTest[1] = 0xFF;
        txCharSendTest[2] = 0xFF;
        txCharSendTest[3] = 0xFF;
        txCharSendTest[4] = 0x00;
        txCharSendTest[5] = 0x00;
        txCharSendTest[6] = 0xA8;
        txCharSendTest[7] = 0x00;
        txCharSendTest[8] = 0x0A;
        txCharSendTest[9] = 0x01;
        return txCharSendTest;
    }
}

module.exports = GCubeProtocol;
