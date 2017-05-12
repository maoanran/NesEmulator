(function () {

    function CPU(nes) {
        this.nes = nes;
        this.rom = this.nes.rom;
    }

    CPU.prototype.powerUp = function() {

        // ============= registers =============
        // Accumulator
        this.REG_A = 0;

        // Indexes
        this.REG_X = 0;
        this.REG_Y = 0;

        // Program Counter
        this.REG_PC = null;

        // Stack Pointer
        this.REG_S = 0xFD;

        //Status Register
        // 7  bit  0
        // ---- ----
        // NVss DIZC
        this.REG_P = 0x34;

        // http://wiki.nesdev.com/w/index.php/CPU_status_flag_behavior
        this.FLAG_C = false;
        this.FLAG_Z = false;
        this.FLAG_I = true;
        this.FLAG_D = false;
        this.FLAG_V = false;
        this.FLAG_N = false;

        // ============= memory =============
        // http://wiki.nesdev.com/w/index.php/CPU_memory_map
        this.ram = Array(0x10000).fill(0xff);
        this.ram[0x4017] = 0x00;
        this.ram[0x4015] = 0x00;
        for (let i = 0x4000; i < 0x400F; i++) {
            this.ram[i] = 0x00;
        }
        // todo: noise channel LFSR = $0000 The first time the LFSR is clocked from the all-0s state, it will shift in a 1.

        this.cycles = 0;
    };

    CPU.prototype._exec = function (opcode) {

    };


    CPU.prototype._a = function() {};
    CPU.prototype._abs = function() {};
    CPU.prototype._abx = function() {};
    CPU.prototype._aby = function() {};
    CPU.prototype._imm = function() {};
    CPU.prototype._impl = function() {};
    CPU.prototype._ind = function() {};
    CPU.prototype._izx = function() {};
    CPU.prototype._izy = function() {};
    CPU.prototype._rel = function() {};
    CPU.prototype._zp = function() {};
    CPU.prototype._zpx = function() {};
    CPU.prototype._zpy = function() {};


    CPU.prototype.run = function () {

    };


    CPU.prototype.reset = function () {
    };

    module.exports = CPU;
})();
