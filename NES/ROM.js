(function () {
    function ROM(rom) {
        this.rom = rom;
        console.log(rom.byteLength)
    }

    ROM.prototype.reset = function () {
        this.rom = null;
    };

    module.exports = ROM;
})();
