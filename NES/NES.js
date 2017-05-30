(function () {
    const fs = require('fs');

    const CPU = require('./CPU');
    const PPU = require('./PPU');
    const APU = require('./APU');
    const CARTRIDGE = require('./CARTRIDGE');

    function NES() {
        
    }

    NES.prototype.load = function (cartridge) {
        fs.readFile(cartridge, (err, data) => {
            this.cartridge = new CARTRIDGE(data);
            this.cpu = new CPU(this);
            this.ppu = new PPU();
            this.apu = new APU();
            this.cpu.powerUp();

            let i = 0;
            while (i++ < 1500) {
                this.cpu.tick();

                this.ppu.tick();
                this.ppu.tick();
                this.ppu.tick();

                this.apu.tick();
            }
        });
    };

    NES.prototype.reset = function () {
        this.cpu.reset();
        this.cartridge && this.cartridge.reset();
    };

    module.exports = NES;
})();
