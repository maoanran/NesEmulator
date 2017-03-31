(function () {
    const fs = require('fs');

    const CPU = require('./CPU');
    const ROM = require('./ROM');

    function NES() {
        this.cpu = new CPU(this);
    }

    NES.prototype.load = function (rom) {
        this.reset();
        fs.readFile(rom, (err, data) => {
            this.rom = new ROM(data);
            this.init();
        });
    };

    NES.prototype.init = function () {
        
    };

    NES.prototype.reset = function () {
        this.cpu.reset();
        this.rom && this.rom.reset();
    };

    module.exports = NES;
})();
