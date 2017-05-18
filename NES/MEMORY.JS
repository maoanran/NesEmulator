(function () {
    function Memory(cartridge) {
        // ============= memory =============
        // http://wiki.nesdev.com/w/index.php/CPU_memory_map
        this.Memory = new Array(0x8000).fill(0xff);

        // http://wiki.nesdev.com/w/index.php/CPU_power_up_state
        this.Memory[0x4017] = 0x00;
        this.Memory[0x4015] = 0x00;
        for (let i = 0x4000; i < 0x400F; i++) {
            this.Memory[i] = 0x00;
        }

        this.cartridge = cartridge;
    }

    Memory.prototype.read = function (address) {
        if (address < 0x8000) {
            return this.Memory[address];
        } else if (address < 0xc000) {
            return this.cartridge.prgBank[address - 0x8000];
        } else if (address < 0x10000) {
            return this.cartridge.prgBank[address - 0xc000];
        } else {
            throw new Error('invalid address!');
        }
    };

    Memory.prototype.write = function (address, value) {
        if (address < 0x0100) {
            // RAM
            this.Memory[address] =
                this.Memory[address + 0x0800] =
                    this.Memory[address + 0x1000] =
                        this.Memory[address + 0x1800] = value;
        } else if (0x2000 < address < 0x2008) {
            // todo mirrors [0x2008, 0x4000]
            // I/O Registers
            this.Memory[address] = value;
        } else if (0x4020 < address < 0x6000) {
            // Expansion ROM
            this.Memory[address] = value
        } else if (0x6000 < address < 0x8000) {
            // SRAM
            this.Memory[address] = value
        } else if (0x8000 <= address < 0xc000) {
            // PRG-ROM Lower Bank
            this.cartridge.prgBank[address - 0x8000] = value;
        } else if (0xc000 <= address < 0x10000) {
            // PRG-ROM Upper Bank
            this.cartridge.prgBank[address - 0xc000] = value;
        } else {
            throw new Error('invalid address!');
        }
    };

    module.exports = Memory;
})();
