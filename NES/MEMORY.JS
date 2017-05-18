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

    Memory.prototype = {
        ram: function (address, value) {
            if (!value) {
                return this.Memory[address];
            }
            this.Memory[address] =
                this.Memory[address + 0x0800] =
                    this.Memory[address + 0x1000] =
                        this.Memory[address + 0x1800] = value;
        },

        ioReg: function (address, value) {

        },

        exRom: function (address, value) {

        },

        sRam: function (address, value) {

        },

        prgRom: function (address, value) {
        },

        read: function (address) {
            if (address < 0x8000) {
                return this.Memory[address];
            } else if (address < 0xc000){
                return this.cartridge.prgBank[address - 0x8000];
            } else if (address < 0x10000){
                return this.cartridge.prgBank[address - 0xc000];
            } else {
                throw new Error('invalid address!');
            }
        },

        write: function (address, value) {
        }
    };

    module.exports = Memory;
})();
