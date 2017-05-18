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
    function CARTRIDGE(raw) {
        this.raw = raw;

        this.romHeader = new Uint8Array(raw.slice(0, 16));
        this.parseRomHeader();

        this.romData = new Uint8Array(raw.slice(16, raw.length));
        this.parseRomData();
    }

    CARTRIDGE.prototype.parseRomHeader = function () {
        const {romHeader} = this;

        if (!validateHeader(romHeader)) {
            throw Error('CARTRIDGE invalid');
        }
        this.sizeOfPRGRomIn16KB = romHeader[4] * 16 * 1024;
        this.sizeOfPRGRomIn8KB = romHeader[8] * 8 * 1024;
        this.sizeOfCHRRomIn8KB = romHeader[5] * 8 * 1024;

        this.flags6 = romHeader[6];
        this.flags7 = romHeader[7];
        this.flags9 = romHeader[9];
        this.flags10 = romHeader[10];
    };

    // todo: Trainer parse
    // todo: PlayChoice INST-CARTRIDGE parse
    // todo: PlayChoice PROM parse
    CARTRIDGE.prototype.parseRomData = function () {
        this.prgBank = this.romData.subarray(0, this.sizeOfPRGRomIn16KB || this.sizeOfPRGRomIn8KB);
        this.chrBank = this.romData.subarray(this.sizeOfPRGRomIn16KB || this.sizeOfPRGRomIn8KB, (this.sizeOfPRGRomIn16KB || this.sizeOfPRGRomIn8KB) + this.sizeOfCHRRomIn8KB);
        // const titleData = new Uint8Array(raw, 0, 16);
    };

    module.exports = CARTRIDGE;
})();
