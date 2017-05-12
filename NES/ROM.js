const R = require('ramda');
const {F} = require('../F/F');

(function () {

    const validateHeader = R.compose(R.equals(new Uint8Array([
        0x4e,
        0x45,
        0x53,
        0x1a
    ])), R.slice(0, 4));

    // http://wiki.nesdev.com/w/index.php/INES
    function ROM(raw) {
        this.header = new Uint8Array(raw.slice(0, 16));
        this.parseHeader();

        this.data = new Uint8Array(raw.slice(16, raw.length));
        this.parseData();

        this.raw = raw;
    }

    ROM.prototype.parseHeader = function () {
        const {header} = this;

        if (!validateHeader(header)) {
            throw Error('rom invalid');
        }
        this.sizeOfPRGRomIn16KB = header[4] * 16 * 1024;
        this.sizeOfPRGRomIn8KB = header[8] * 8 * 1024;
        this.sizeOfCHRRomIn8KB = header[5] * 8 * 1024;

        this.flags6 = header[6];
        this.flags7 = header[7];
        this.flags9 = header[9];
        this.flags10 = header[10];
    };

    // todo: Trainer parse
    // todo: PlayChoice INST-ROM parse
    // todo: PlayChoice PROM parse
    ROM.prototype.parseData = function () {
        // console.log(this.flags6 & 0b100);
        this.prgBank = this.data.subarray(0, this.sizeOfPRGRomIn16KB || this.sizeOfPRGRomIn8KB);
        this.chrBank = this.data.subarray(this.sizeOfPRGRomIn16KB || this.sizeOfPRGRomIn8KB, (this.sizeOfPRGRomIn16KB || this.sizeOfPRGRomIn8KB) + this.sizeOfCHRRomIn8KB);
        // const titleData = new Uint8Array(raw, 0, 16);
    };

    module.exports = ROM;
})();
