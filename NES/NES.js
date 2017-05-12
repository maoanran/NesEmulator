(function () {
    const fs = require('fs');

    const CPU = require('./CPU');
    const ROM = require('./ROM');

    function NES() {
        
    }

    NES.prototype.load = function (rom) {
        fs.readFile(rom, (err, data) => {
            this.rom = new ROM(data);
            this.cpu = new CPU(this);
            this.cpu.powerUp();
            this.cpu.run();
        });
    };

    NES.prototype.reset = function () {
        this.cpu.reset();
        this.rom && this.rom.reset();
    };

    module.exports = NES;
})();
