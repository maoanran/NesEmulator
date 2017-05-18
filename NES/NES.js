(function () {
    const fs = require('fs');

    const CPU = require('./CPU');
    const CARTRIDGE = require('./CARTRIDGE');

    function NES() {
        
    }

    NES.prototype.load = function (cartridge) {
        fs.readFile(cartridge, (err, data) => {
            this.cartridge = new CARTRIDGE(data);
            this.cpu = new CPU(this);
            this.cpu.powerUp();
            this.cpu.run();
        });
    };

    NES.prototype.reset = function () {
        this.cpu.reset();
        this.cartridge && this.cartridge.reset();
    };

    module.exports = NES;
})();
