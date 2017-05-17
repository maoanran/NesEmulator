(function () {
    function Memory(rom) {
        // ============= memory =============
        // http://wiki.nesdev.com/w/index.php/CPU_memory_map
        this.Memory = new Array(0x10000).fill(0xff);
        this.Memory[0x4017] = 0x00;
        this.Memory[0x4015] = 0x00;
        for (let i = 0x4000; i < 0x400F; i++) {
            this.Memory[i] = 0xff;
        }

        // ============= rom ==============
        if (rom.sizeOfPRGRomIn16KB === 16 * 1024) {
            this.prgRom(0x8000, rom.prgBank);
            this.prgRom(0xc000, rom.prgBank);
        } else if (rom.sizeOfPRGRomIn16KB === 2 * 16 * 1024) {
            this.prgRom(0x8000, rom.prgBank);
        } else {
            throw new Error('rom.sizeOfPRGRomIn16KB !== 1 || !== 2')
        }

    }

    Memory.prototype.ram = function (address, value) {
        if (!value) {
            return this.Memory[address];
        }
        this.Memory[address] =
            this.Memory[address + 0x0800] =
                this.Memory[address + 0x1000] =
                    this.Memory[address + 0x1800] = value;
    };

    Memory.prototype.ioReg = function (address, value) {

    };

    Memory.prototype.exRom = function (address, value) {

    };

    Memory.prototype.sRam = function (address, value) {

    };

    Memory.prototype.prgRom = function (address, value) {
        if (!value) {
            return this.Memory[0x8000 + address];
        }
        this.Memory.fill(value, address, address + 0x4000);
    };

    module.exports = Memory;
})();
