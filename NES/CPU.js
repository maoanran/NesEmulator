(function () {

    const Memory = require('./MEMORY');

    function CPU(nes) {
        this.nes = nes;
    }


    function pad(width, string, padding) {
        return (width <= string.length) ? string : pad(width, padding + string, padding)
    }

    CPU.prototype = {
        powerUp: function () {
            // ============= registers =============
            // Accumulator
            this.reg_a = 0;

            // Indexes
            this.reg_x = 0;
            this.reg_y = 0;

            // Program Counter
            this.reg_pc = 0xc000;

            // Stack Pointer
            this.reg_s = 0xFD;

            //Status Register
            // 7  bit  0
            // ---- ----
            // NVss DIZC
            this.reg_p = 0x34;

            // http://wiki.nesdev.com/w/index.php/CPU_status_flag_behavior
            this.flag_c = false;
            this.flag_z = false;
            this.flag_i = true;
            this.flag_d = false;
            this.flag_v = false;
            this.flag_n = false;

            this.memory = new Memory(this.nes.cartridge);
            // todo: noise channel LFSR = $0000 The first time the LFSR is clocked from the all-0s state, it will shift in a 1.

            this.cycles = 0;
        },

        _exec: function (opcode) {
            const regPc = this.reg_pc.toString(16);
            const log = regPc.toString(16) + '\t' + opcode.toString(16) + '\t';
            const log2 = '\t' + `A: ${this.reg_a} X:${this.reg_x} Y:${this.reg_y} P:${this.reg_p} SP:${this.reg_s.toString(16)} CYC:${this.cycles}`;
            switch (opcode) {
                case 0x4c:
                    this._abs();
                    this._jmp();
                    this.cycles += 3 * 3;
                    break;
                case 0xA2:
                    this._imm();
                    this._ldx();
                    this.cycles += 2 * 3;
                    break;
                case 0x86:
                    this._zp();
                    this._stx();
                    this.cycles += 3 * 3;
                    break;
                default:
            }
            console.log(log + pad(4, this.address.toString(16), ' ') + log2);
        },

        // ============= op codes =============
        _adc: function () {
        },
        _and: function () {
        },
        _asl: function () {
        },
        _bcc: function () {
        },
        _bcs: function () {
        },
        _beq: function () {
        },
        _bit: function () {
        },
        _bmi: function () {
        },
        _bne: function () {
        },
        _bpl: function () {
        },
        _bvc: function () {
        },
        _bvs: function () {
        },
        _clc: function () {
        },
        _cld: function () {
        },
        _clv: function () {
        },
        _cmp: function () {
        },
        _cpx: function () {
        },
        _cpy: function () {
        },
        _dcp: function () {
        },
        _dec: function () {
        },
        _dex: function () {
        },
        _dey: function () {
        },
        _eor: function () {
        },
        _inc: function () {
        },
        _inx: function () {
        },
        _iny: function () {
        },
        _isb: function () {
        },
        _jmp: function () {
            this.reg_pc = this.address;
        },
        _jsr: function () {
        },
        _lax: function () {
        },
        _lda: function () {
        },
        _ldx: function () {
            this.reg_x = this.memory.read(this.address);
        },
        _ldy: function () {
        },
        _lsr: function () {
        },
        _nop: function () {
        },
        _ora: function () {
        },
        _pha: function () {
        },
        _php: function () {
        },
        _pla: function () {
        },
        _plp: function () {
        },
        _rla: function () {
        },
        _rol: function () {
        },
        _ror: function () {
        },
        _rra: function () {
        },
        _rti: function () {
        },
        _rts: function () {
        },
        _sax: function () {
        },
        _sbc: function () {
        },
        _sec: function () {
        },
        _sed: function () {
        },
        _sei: function () {
        },
        _slo: function () {
        },
        _sre: function () {
        },
        _sta: function () {
        },
        _stx: function () {
            this.memory.write(this.reg_x);
        },
        _sty: function () {
        },
        _tax: function () {
        },
        _tay: function () {
        },
        _tsx: function () {
        },
        _txa: function () {
        },
        _txs: function () {
        },
        _tya: function () {
        },

        // ============= addressing modes =============
        // Accumulator
        _a: function () {

        },

        // absolute
        _abs: function () {
            const high = this.memory.read(this.reg_pc + 2) << 8,
                low = this.memory.read(this.reg_pc + 1);

            this.address = high | low;
            this.reg_pc += 3;
        },

        // absolute, X-indexed
        _abx: function () {
        },

        // absolute, Y-indexed
        _aby: function () {
        },

        // immediate
        _imm: function () {
            this.address = this.memory.read(this.reg_pc + 1);
            this.reg_pc += 2;
        },

        // implied
        _impl: function () {
        },

        // indirect
        _ind: function () {
        },

        // X-indexed, indirect
        _izx: function () {
        },

        // indirect, Y-indexed
        _izy: function () {

        },

        // relative
        _rel: function () {
        },

        // zeropage
        _zp: function () {
            this.address = this.memory.read(this.reg_pc + 1);
            this.reg_pc += 2;
        },

        // zeropage, X-indexed
        _zpx: function () {
        },

        // zeropage, Y-indexed
        _zpy: function () {
        },

        tick: function () {
            this._exec(this.memory.read(this.reg_pc))
        },

        reset: function () {
        }
    };

    module.exports = CPU;
})();
