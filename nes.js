(function () {
    var CPU = require("./CPU");
    var Program = require("./Program");

    function NES() {
        this.cpu = new CPU(this);
        this.program = null;
    }

    NES.prototype.loadProgram = function (data) {
        this.program = new Program(this);
        this.program.load(data);
        this.reset();
    };

    NES.prototype.emulateCycle = function () {
        this.cpu.emulateCycle();
    };

    NES.prototype.reset = function () {
        this.cpu.reset();
    };

    module.exports = NES;
})();
