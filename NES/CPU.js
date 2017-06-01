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
            // http://wiki.nesdev.com/w/index.php/CPU_status_flag_behavior
            this.flag_c = false;
            this.flag_z = false;
            this.flag_i = true;
            this.flag_d = false;
            this.flag_v = false;
            this.flag_n = false;

            // 7  bit  0
            // ---- ----
            // NVss DIZC
            Object.defineProperty(this, 'reg_p', {
                get: () => {
                    return (this.flag_n ? 0x80 : 0x00) |
                        (this.flag_v ? 0x40 : 0x00) |
                        0x20 |
                        0x00 |
                        (this.flag_d ? 0x08 : 0x00) |
                        (this.flag_i ? 0x04 : 0x00) |
                        (this.flag_z ? 0x02 : 0x00) |
                        (this.flag_c ? 0x01 : 0x00);
                },
                set: (val) => {
                    this.flag_n = +(val & 0x80);
                    this.flag_v = +(val & 0x40);
                    this.flag_d = +(val & 0x08);
                    this.flag_i = +(val & 0x04);
                    this.flag_z = +(val & 0x02);
                    this.flag_c = +(val & 0x01);
                }
            });


            this.memory = new Memory(this.nes.cartridge);
            // todo: noise channel LFSR = $0000 The first time the LFSR is clocked from the all-0s state, it will shift in a 1.
            this.cycles = 0;
        },

        _exec: function (opcode) {
            const regPc = this.reg_pc.toString(16);
            const log = regPc.toString(16) + '\t' + opcode.toString(16) + '\t';
            const log2 = '\t' + `A: ${this.reg_a.toString(16)} X:${this.reg_x.toString(16)} Y:${this.reg_y.toString(16)} P:${this.reg_p.toString(16)} SP:${this.reg_s.toString(16)} CYC:${this.cycles}`;

            this.addrMode = null;
            switch (opcode) {
                // ============= 00 block =============
                case 0x00:
                    break;
                case 0x04:
                    break;
                case 0x08:
                    this._impl();
                    this._php();
                    this._burn(3);
                    break;
                case 0x0c:
                    break;
                case 0x10:
                    this._rel();
                    this._bpl();
                    this._burn(2);
                    break;
                case 0x14:
                    break;
                case 0x18:
                    this._impl();
                    this._clc();
                    this._burn(2);
                    break;
                case 0x1c:
                    break;
                case 0x20:
                    this._abs();
                    this._jsr();
                    this._burn(6);
                    break;
                case 0x24:
                    this._zp();
                    this._bit();
                    this._burn(3);
                    break;
                case 0x28:
                    this._impl();
                    this._plp();
                    this._burn(4);
                    break;
                case 0x2c:
                    this._abs();
                    this._bit();
                    this._burn(4);
                    break;
                case 0x30:
                    this._rel();
                    this._bmi();
                    this._burn(2);
                    break;
                case 0x34:
                    break;
                case 0x38:
                    this._impl();
                    this._sec();
                    this._burn(2);
                    break;
                case 0x3c:
                    break;
                case 0x40:
                    this._impl();
                    this._rti();
                    this._burn(6);
                    break;
                case 0x44:
                    break;
                case 0x48:
                    this._impl();
                    this._pha();
                    this._burn(3);
                    break;
                case 0x4c:
                    this._abs();
                    this._jmp();
                    this._burn(3);
                    break;
                case 0x50:
                    this._rel();
                    this._bvc();
                    this._burn(2);
                    break;
                case 0x54:
                    break;
                case 0x58:
                    break;
                case 0x5c:
                    break;
                case 0x60:
                    this._impl();
                    this._rts();
                    this._burn(6);
                    break;
                case 0x64:
                    break;
                case 0x68:
                    this._impl();
                    this._pla();
                    this._burn(4);
                    break;
                case 0x6c:
                    this._ind();
                    this._jmp();
                    this._burn(5);
                    break;
                case 0x70:
                    this._rel();
                    this._bvs();
                    this._burn(2);
                    break;
                case 0x74:
                    break;
                case 0x78:
                    this._impl();
                    this._sei();
                    this._burn(2);
                    break;
                case 0x7c:
                    break;
                case 0x80:
                    break;
                case 0x84:
                    this._zp();
                    this._sty();
                    this._burn(3);
                    break;
                case 0x88:
                    this._impl();
                    this._dey();
                    this._burn(2);
                    break;
                case 0x8c:
                    this._abs();
                    this._sty();
                    this._burn(4);
                    break;
                case 0x90:
                    this._rel();
                    this._bcc();
                    this._burn(2);
                    break;
                case 0x94:
                    this._zpx();
                    this._sty();
                    this._burn(4);
                    break;
                case 0x98:
                    this._impl();
                    this._tya();
                    this._burn(2);
                    break;
                case 0x9c:
                    break;
                case 0xa0:
                    this._imm();
                    this._ldy();
                    this._burn(2);
                    break;
                case 0xa4:
                    this._zp();
                    this._ldy();
                    this._burn(3);
                    break;
                case 0xa8:
                    this._impl();
                    this._tay();
                    this._burn(2);
                    break;
                case 0xac:
                    this._abs();
                    this._ldy();
                    this._burn(4);
                    break;
                case 0xb0:
                    this._rel();
                    this._bcs();
                    this._burn(2);
                    break;
                case 0xb4:
                    this._zpx();
                    this._ldy();
                    this._burn(4);
                    break;
                case 0xb8:
                    this._impl();
                    this._clv();
                    this._burn(2);
                    break;
                case 0xbc:
                    this._abx();
                    this._ldy();
                    this._burn(4);
                    break;
                case 0xc0:
                    this._imm();
                    this._cpy();
                    this._burn(2);
                    break;
                case 0xc4:
                    this._zp();
                    this._cpy();
                    this._burn(3);
                    break;
                case 0xc8:
                    this._impl();
                    this._iny();
                    this._burn(2);
                    break;
                case 0xcc:
                    this._abs();
                    this._cpy();
                    this._burn(4);
                    break;
                case 0xd0:
                    this._rel();
                    this._bne();
                    this._burn(2);
                    break;
                case 0xd4:
                    break;
                case 0xd8:
                    this._impl();
                    this._cld();
                    this._burn(2);
                    break;
                case 0xdc:
                    break;
                case 0xe0:
                    this._imm();
                    this._cpx();
                    this._burn(2);
                    break;
                case 0xe4:
                    this._zp();
                    this._cpx();
                    this._burn(3);
                    break;
                case 0xe8:
                    this._impl();
                    this._inx();
                    this._burn(2);
                    break;
                case 0xec:
                    this._abs();
                    this._cpx();
                    this._burn(4)
                    break;
                case 0xf0:
                    this._rel();
                    this._beq();
                    this._burn(2);
                    break;
                case 0xf4:
                    break;
                case 0xf8:
                    this._impl();
                    this._sed();
                    this._burn(2);
                    break;
                case 0xfc:
                    break;
                // ============= 01 block =============
                case 0x01:
                    this._idx();
                    this._ora();
                    this._burn(6);
                    break;
                case 0x05:
                    this._zp();
                    this._ora();
                    this._burn(3);
                    break;
                case 0x09:
                    this._imm();
                    this._ora();
                    this._burn(2);
                    break;
                case 0x0d:
                    this._abs();
                    this._ora();
                    this._burn(4);
                    break;
                case 0x11:
                    this._idy();
                    this._ora();
                    this._burn(5);
                    break;
                case 0x15:
                    this._zpx();
                    this._ora();
                    this._burn(4);
                    break;
                case 0x19:
                    this._aby();
                    this._ora();
                    this._burn(4);
                    break;
                case 0x1d:
                    this._abx();
                    this._ora();
                    this._burn(4);
                    break;
                case 0x21:
                    this._idx();
                    this._and();
                    this._burn(6);
                    break;
                case 0x25:
                    this._zp();
                    this._and();
                    this._burn(3);
                    break;
                case 0x29:
                    this._imm();
                    this._and();
                    this._burn(2);
                    break;
                case 0x2d:
                    this._abs();
                    this._and();
                    this._burn(4);
                    break;
                case 0x31:
                    this._idy();
                    this._and();
                    this._burn(5);
                    break;
                case 0x35:
                    this._zpx();
                    this._and();
                    this._burn(4);
                    break;
                case 0x39:
                    this._aby();
                    this._and();
                    this._burn(4);
                    break;
                case 0x3d:
                    this._abx();
                    this._and();
                    this._burn(4);
                    break;
                case 0x41:
                    this._idx();
                    this._eor();
                    this._burn(6);
                    break;
                case 0x45:
                    this._zp();
                    this._eor();
                    this._burn(3);
                    break;
                case 0x49:
                    this._imm();
                    this._eor();
                    this._burn(2);
                    break;
                case 0x4d:
                    this._abs();
                    this._eor();
                    this._burn(4);
                    break;
                case 0x51:
                    this._idy();
                    this._eor();
                    this._burn(5);
                    break;
                case 0x55:
                    this._zpx();
                    this._eor();
                    this._burn(4);
                    break;
                case 0x59:
                    this._aby();
                    this._eor();
                    this._burn(4);
                    break;
                case 0x5d:
                    this._abx();
                    this._eor();
                    this._burn(4);
                    break;
                case 0x61:
                    this._idx();
                    this._adc();
                    this._burn(6);
                    break;
                case 0x65:
                    this._zp();
                    this._adc();
                    this._burn(3);
                    break;
                case 0x69:
                    this._imm();
                    this._adc();
                    this._burn(2);
                    break;
                case 0x6d:
                    this._abs();
                    this._adc();
                    this._burn(4);
                    break;
                case 0x71:
                    this._idy();
                    this._adc();
                    this._burn(5);
                    break;
                case 0x75:
                    this._zpx();
                    this._adc();
                    this._burn(4);
                    break;
                case 0x79:
                    this._aby();
                    this._adc();
                    this._burn(4);
                    break;
                case 0x7d:
                    this._abx();
                    this._adc();
                    this._burn(4);
                    break;
                case 0x81:
                    this._idx();
                    this._sta();
                    this._burn(6);
                    break;
                case 0x85:
                    this._zp();
                    this._sta();
                    this._burn(3);
                    break;
                case 0x89:
                    break;
                case 0x8d:
                    this._abs();
                    this._sta();
                    this._burn(4);
                    break;
                case 0x91:
                    this._idy();
                    this._sta();
                    this._burn(6);
                    break;
                case 0x95:
                    this._zpx();
                    this._sta();
                    this._burn(4);
                    break;
                case 0x99:
                    this._aby();
                    this._sta();
                    this._burn(5);
                    break;
                case 0x9d:
                    break;
                case 0xa1:
                    this._idx();
                    this._lda();
                    this._burn(6);
                    break;
                case 0xa5:
                    this._zp();
                    this._lda();
                    this._burn(3);
                    break;
                case 0xa9:
                    this._imm();
                    this._lda();
                    this._burn(2);
                    break;
                case 0xad:
                    this._abs();
                    this._lda();
                    this._burn(4);
                    break;
                case 0xb1:
                    this._idy();
                    this._lda();
                    this._burn(5);
                    break;
                case 0xb5:
                    this._zpx();
                    this._lda();
                    this._burn(4);
                    break;
                case 0xb9:
                    this._aby();
                    this._lda();
                    this._burn(4);
                    break;
                case 0xbd:
                    this._abx();
                    this._lda();
                    this._burn(4);
                    break;
                case 0xc1:
                    this._idx();
                    this._cmp();
                    this._burn(6);
                    break;
                case 0xc5:
                    this._zp();
                    this._cmp();
                    this._burn(3);
                    break;
                case 0xc9:
                    this._imm();
                    this._cmp();
                    this._burn(2);
                    break;
                case 0xcd:
                    this._abs();
                    this._cmp();
                    this._burn(4);
                    break;
                case 0xd1:
                    this._idy();
                    this._cmp();
                    this._burn(5);
                    break;
                case 0xd5:
                    this._zpx();
                    this._cmp();
                    this._burn(4);
                    break;
                case 0xd9:
                    this._aby();
                    this._cmp();
                    this._burn(4);
                    break;
                case 0xdd:
                    this._abx();
                    this._cmp();
                    this._burn(4);
                    break;
                case 0xe1:
                    this._idx();
                    this._sbc();
                    this._burn(6);
                    break;
                case 0xe5:
                    this._zp();
                    this._sbc();
                    this._burn(3);
                    break;
                case 0xe9:
                    this._imm();
                    this._sbc();
                    this._burn(2);
                    break;
                case 0xed:
                    this._abs();
                    this._sbc();
                    this._burn(4);
                    break;
                case 0xf1:
                    this._idy();
                    this._sbc();
                    this._burn(5);
                    break;
                case 0xf5:
                    this._zpx();
                    this._sbc();
                    this._burn(4);
                    break;
                case 0xf9:
                    this._aby();
                    this._sbc();
                    this._burn(4);
                    break;
                case 0xfd:
                    this._abx();
                    this._sbc();
                    this._burn(4);
                    break;
                // ============= 10 block =============
                case 0x02:
                    break;
                case 0x06:
                    this._zp();
                    this._asl();
                    this._burn(5);
                    break;
                case 0x0a:
                    this._a();
                    this._asl();
                    this._burn(2);
                    break;
                case 0x0e:
                    this._abs();
                    this._asl();
                    this._burn(6);
                    break;
                case 0x12:
                    break;
                case 0x16:
                    this._zpx();
                    this._asl();
                    this._burn(6);
                    break;
                case 0x1a:
                    break;
                case 0x1e:
                    this._abx();
                    this._asl();
                    this._burn(7);
                    break;
                case 0x22:
                    break;
                case 0x26:
                    this._zp();
                    this._rol();
                    this._burn(5);
                    break;
                case 0x2a:
                    this._a();
                    this._rol();
                    this._burn(2);
                    break;
                case 0x2e:
                    this._abs();
                    this._rol();
                    this._burn(6);
                    break;
                case 0x32:
                    break;
                case 0x36:
                    this._zpx();
                    this._rol();
                    this._burn(6);
                    break;
                case 0x3a:
                    break;
                case 0x3e:
                    this._abx();
                    this._rol();
                    this._burn(7);
                    break;
                case 0x42:
                    break;
                case 0x46:
                    this._zp();
                    this._lsr();
                    this._burn(5);
                    break;
                case 0x4a:
                    this._a();
                    this._lsr();
                    this._burn(2);
                    break;
                case 0x4e:
                    this._abs();
                    this._lsr();
                    this._burn(6);
                    break;
                case 0x52:
                    break;
                case 0x56:
                    this._zpx();
                    this._lsr();
                    this._burn(6);
                    break;
                case 0x5a:
                    break;
                case 0x5e:
                    this._abx();
                    this._lsr();
                    this._burn(7);
                    break;
                case 0x62:
                    break;
                case 0x66:
                    this._zp();
                    this._ror();
                    this._burn(5);
                    break;
                case 0x6a:
                    this._a();
                    this._ror();
                    this._burn(2);
                    break;
                case 0x6e:
                    this._abs();
                    this._ror();
                    this._burn(6);
                    break;
                case 0x72:
                    break;
                case 0x76:
                    this._zpx();
                    this._ror();
                    this._burn(6);
                    break;
                case 0x7a:
                    break;
                case 0x7e:
                    this._abx();
                    this._ror();
                    this._burn(7);
                    break;
                case 0x82:
                    break;
                case 0x86:
                    this._zp();
                    this._stx();
                    this._burn(3);
                    break;
                case 0x8a:
                    this._impl();
                    this._txa();
                    this._burn(2);
                    break;
                case 0x8e:
                    this._abs();
                    this._stx();
                    this._burn(4);
                    break;
                case 0x92:
                    break;
                case 0x96:
                    break;
                case 0x9a:
                    this._impl();
                    this._txs();
                    this._burn(2);
                    break;
                case 0x9e:
                    break;
                case 0xa2:
                    this._imm();
                    this._ldx();
                    this._burn(2);
                    break;
                case 0xa6:
                    this._zp();
                    this._ldx();
                    this._burn(3);
                    break;
                case 0xaa:
                    this._impl();
                    this._tax();
                    this._burn(2);
                    break;
                case 0xae:
                    this._abs();
                    this._ldx();
                    this._burn(4);
                    break;
                case 0xb2:
                    break;
                case 0xb6:
                    this._zpy();
                    this._ldx();
                    this._burn(4);
                    break;
                case 0xba:
                    this._impl();
                    this._tsx();
                    this._burn(2);
                    break;
                case 0xbe:
                    this._aby();
                    this._ldx();
                    this._burn(4);
                    break;
                case 0xc2:
                    break;
                case 0xc6:
                    this._zp();
                    this._dec();
                    this._burn(5);
                    break;
                case 0xca:
                    this._impl();
                    this._dex();
                    this._burn(2);
                    break;
                case 0xce:
                    this._abs();
                    this._dec();
                    this._burn(6);
                    break;
                case 0xd2:
                    break;
                case 0xd6:
                    this._zpx();
                    this._dec();
                    this._burn(6);
                    break;
                case 0xda:
                    break;
                case 0xde:
                    this._abx();
                    this._dec();
                    this._burn(7);
                    break;
                case 0xe2:
                    break;
                case 0xe6:
                    this._zp();
                    this._inc();
                    this._burn(5);
                    break;
                case 0xea:
                    this._impl();
                    this._nop();
                    this._burn(2);
                    break;
                case 0xee:
                    this._abs();
                    this._inc();
                    this._burn(6);
                    break;
                case 0xf2:
                    break;
                case 0xf6:
                    this._zpx();
                    this._inc();
                    this._burn(6);
                    break;
                case 0xfa:
                    break;
                case 0xfe:
                    this._abx();
                    this._inc();
                    this._burn(7);
                    break;
                // ============= 11 block =============
                case 0x03:
                    break;
                case 0x07:
                    break;
                case 0x0b:
                    break;
                case 0x0f:
                    break;
                case 0x13:
                    break;
                case 0x17:
                    break;
                case 0x1b:
                    break;
                case 0x1f:
                    break;
                case 0x23:
                    break;
                case 0x27:
                    break;
                case 0x2b:
                    break;
                case 0x2f:
                    break;
                case 0x33:
                    break;
                case 0x37:
                    break;
                case 0x3b:
                    break;
                case 0x3f:
                    break;
                case 0x43:
                    break;
                case 0x47:
                    break;
                case 0x4b:
                    break;
                case 0x4f:
                    break;
                case 0x53:
                    break;
                case 0x57:
                    break;
                case 0x5b:
                    break;
                case 0x5f:
                    break;
                case 0x63:
                    break;
                case 0x67:
                    break;
                case 0x6b:
                    break;
                case 0x6f:
                    break;
                case 0x73:
                    break;
                case 0x77:
                    break;
                case 0x7b:
                    break;
                case 0x7f:
                    break;
                case 0x83:
                    break;
                case 0x87:
                    break;
                case 0x8b:
                    break;
                case 0x8f:
                    break;
                case 0x93:
                    break;
                case 0x97:
                    break;
                case 0x9b:
                    break;
                case 0x9f:
                    break;
                case 0xa3:
                    break;
                case 0xa7:
                    break;
                case 0xab:
                    break;
                case 0xaf:
                    break;
                case 0xb3:
                    break;
                case 0xb7:
                    break;
                case 0xbb:
                    break;
                case 0xbf:
                    break;
                case 0xc3:
                    break;
                case 0xc7:
                    break;
                case 0xcb:
                    break;
                case 0xcf:
                    break;
                case 0xd3:
                    break;
                case 0xd7:
                    break;
                case 0xdb:
                    break;
                case 0xdf:
                    break;
                case 0xe3:
                    break;
                  break;
                case 0xeb:
                    break;
                case 0xef:
                    break;
                case 0xf3:
                    break;
                case 0xf7:
                    break;
                case 0xfb:
                    break;
                case 0xff:
                    break;
                default:
            }
            console.log(log + pad(4, this.address.toString(16), ' ') + log2);
        },

        _burn: function (cyc) {
            this.cycles += cyc * 3;
            this.cycles %= 341;
        },

        _read: function () {
            if (this.addrMode === 'accumulator') {
                return this.reg_a & 0xff;
            } else {
                return this._peek(this.address & 0xffff);
            }
        },

        _peek: function (address) {
            return this.memory.read(address);
        },

        _peek16: function (address) {
            const low = this._peek(address),
                high = this._peek((address + 1) & 0xffff) << 8;
            return (low | high);
        },

        _write: function (address, value) {
            if (this.addrMode === 'accumulator') {
                this.reg_a = value;
            } else if (address !== undefined) {
                this.memory.write(address, value);
            } else {
                throw new Error('invalid address: ', address);
            }
        },

        _branch: function (cond) {
            if (cond) {
                this.address += this._read() + 1;
                // todo: why!!!!!!!!!!!!!!!!!!!!!!!!!!!
                this._burn((this.reg_pc & 0xFF00) !== (this.address & 0xFF00) ? 2 : 1);
                this.reg_pc = this.address;
            }
        },

        _setN: function (val) {
            this.flag_n = (val & 0x80) && 1;
        },

        _setZ: function (val) {
            this.flag_z = +(val === 0);
        },

        _setV: function (val) {
            this.flag_v = (val & 0x40) && 1;
        },

        // ============= op codes =============
        _adc: function () {
            const val = this._read();
            const tmp = this.reg_a + val + (this.flag_c ? 1 : 0);
            this._setN(tmp);
            this._setZ(tmp & 0xff);
            this.flag_v = +(!((this.reg_a ^ val) & 0x80) && !!((this.reg_a ^ tmp) & 0x80));
            this.flag_c = +(tmp > 0xff);
            this.reg_a = tmp;
        },
        _and: function () {
            this.reg_a &= this._read();
            this._setN(this.reg_a);
            this._setZ(this.reg_a);
        },
        _asl: function () {
            let val = this._read();

            this.flag_c = +(val & 0x80);
            val <<= 1;
            val &= 0xff;
            this._setN(val);
            this._setZ(val);
            this._write(this.address, val);
        },
        _bcc: function () {
            this._branch(this.flag_c === 0);
        },
        _bcs: function () {
            this._branch(this.flag_c === 1);
        },
        _beq: function () {
            this._branch(this.flag_z === 1);
        },
        _bit: function () {
            const val = this._read();
            this._setN(val);
            this._setV(val);
            this._setZ(val & this.reg_a);
        },
        _bmi: function () {
            this._branch(this.flag_n === 1);
        },
        _bne: function () {
            this._branch(this.flag_z === 0);
        },
        _bpl: function () {
            this._branch(this.flag_n === 0);
        },
        _bvc: function () {
            this._branch(this.flag_v === 0);
        },
        _bvs: function () {
            this._branch(this.flag_v === 1);
        },
        _clc: function () {
            this.flag_c = 0;
        },
        _cld: function () {
            this.flag_d = 0;
        },
        _clv: function () {
            this.flag_v = 0;
        },
        _cmp: function () {
            const val = this.reg_a - this._read();
            this.flag_c = +(val >= 0);
            this._setN(val);
            this._setZ(val & 0xff);
        },
        _cpx: function () {
            const val = this.reg_x - this._read();
            this.flag_c = +(val >= 0);
            this._setN(val);
            this._setZ(val & 0xff);
        },
        _cpy: function () {
            const val = this.reg_y - this._read();
            this.flag_c = +(val >= 0);
            this._setN(val);
            this._setZ(val & 0xff);
        },
        _dcp: function () {
        },
        _dec: function () {
            const val = (this._read() - 1) & 0xff;
            this._setN(val);
            this._setZ(val);
            this._write(this.address, val);
        },
        _dex: function () {
            this.reg_x = (this.reg_x - 1) & 0xff;
            this._setN(this.reg_x);
            this._setZ(this.reg_x);
        },
        _dey: function () {
            this.reg_y = (this.reg_y - 1) & 0xff;
            this._setN(this.reg_y);
            this._setZ(this.reg_y);
        },
        _eor: function () {
            this.reg_a ^= this._read();
            this._setN(this.reg_a);
            this._setZ(this.reg_a);
        },
        _inc: function () {
            const val = (this._read() + 1 ) & 0xff;
            this._write(this.address, val);
            this._setN(val);
            this._setZ(val);
        },
        _inx: function () {
            this.reg_x = (this.reg_x + 1) & 0xff;
            this._setN(this.reg_x);
            this._setZ(this.reg_x);
        },
        _iny: function () {
            this.reg_y = (this.reg_y + 1) & 0xff;
            this._setN(this.reg_y);
            this._setZ(this.reg_y);
        },
        _isb: function () {
        },
        _jmp: function () {
            this.reg_pc = this.address;
        },
        _jsr: function () {
            this._push((this.reg_pc - 1) >> 8 & 0xff);
            this._push((this.reg_pc - 1) & 0xff);
            this.reg_pc = this.address;
        },
        _lax: function () {
        },
        _lda: function () {
            this.reg_a = this._read();
            this._setN(this.reg_a);
            this._setZ(this.reg_a);
        },
        _ldx: function () {
            this.reg_x = this._read();
            this._setN(this.reg_x);
            this._setZ(this.reg_x);
        },
        _ldy: function () {
            this.reg_y = this._read();
            this._setN(this.reg_y);
            this._setZ(this.reg_y);
        },
        _lsr: function () {
            let val = this._read();
            this.flag_c = +(val & 0x01);
            val >>= 1;
            this._setN(val);
            this._setZ(val);
            this._write(this.address, val);
        },
        _nop: function () {

        },
        _ora: function () {
            this.reg_a |= this._read();
            this._setN(this.reg_a);
            this._setZ(this.reg_a);
        },
        _pha: function () {
            this._push(this.reg_a);
        },
        _php: function () {
            // todo: why 0x10 ??????????
            this._push(this.reg_p | 0x10);
        },
        _pla: function () {
            this.reg_a = this._pop();
            this._setN(this.reg_a);
            this._setZ(this.reg_a);
        },
        _plp: function () {
            this.reg_p = this._pop();
        },
        _rla: function () {
        },
        _rol: function () {
            let val = this._read();
            val <<= 1;
            val = this.flag_c ? val | 0x1 : val;
            this.flag_c = +(val > 0xff);
            val &= 0xff;
            this._setN(val);
            this._setZ(val);
            this._write(this.address, val);
        },
        _ror: function () {
            let val = this._read();
            val = this.flag_c ? val | 0x100 : val;

            this.flag_c = +(val & 0x01);
            val >>= 1;
            this._setN(val);
            this._setZ(val);
            this._write(this.address, val);
        },
        _rra: function () {
        },
        _rti: function () {
            this.reg_p = this._pop();
            const low = this._pop();
            const high = this._pop() << 8;
            this.reg_pc = high | low;
        },
        _rts: function () {
            const low = this._pop();
            const high = this._pop();
            this.reg_pc = (high << 8) | low;
            this.reg_pc++;
        },
        _sax: function () {
        },
        _sbc: function () {
            const val = this._read();
            const tmp = this.reg_a - val - (this.flag_c ? 0 : 1);
            this._setN(tmp);
            this._setZ(tmp & 0xff);
            // this.flag_v = !((this.reg_a ^ tmp) & 0x80) && !!((this.reg_a ^ val) & 0x80);
            // todo: why ??
            this.flag_v = (((this.reg_a ^ tmp) & 0x80) !== 0 && ((this.reg_a ^ val) & 0x80) !== 0) ? 1 : 0;
            this.flag_c = tmp < 0x00 ? 0 : 1;
            this.reg_a = tmp & 0xff;
        },
        _sec: function () {
            this.flag_c = 1;
        },
        _sed: function () {
            this.flag_d = 1;
        },
        _sei: function () {
            this.flag_i = 1;
        },
        _slo: function () {
        },
        _sre: function () {
        },
        _sta: function () {
            this._write(this.address, this.reg_a);
        },
        _stx: function () {
            this._write(this.address, this.reg_x);
        },
        _sty: function () {
            this._write(this.address, this.reg_y);
        },
        _tax: function () {
            this.reg_x = this.reg_a;
            this._setN(this.reg_x);
            this._setZ(this.reg_x);
        },
        _tay: function () {
            this.reg_y = this.reg_a;
            this._setN(this.reg_y);
            this._setZ(this.reg_y);
        },
        _tsx: function () {
            this.reg_x = this.reg_s;
            this._setN(this.reg_x);
            this._setZ(this.reg_x);
        },
        _txa: function () {
            this.reg_a = this.reg_x;
            this._setN(this.reg_a);
            this._setZ(this.reg_a);
        },
        _txs: function () {
            this.reg_s = this.reg_x;
        },
        _tya: function () {
            this.reg_a = this.reg_y;
            this._setN(this.reg_a);
            this._setZ(this.reg_a);
        },

        _pop: function () {
            return this._peek(++this.reg_s | 0x100);
        },

        _push: function (value) {
            this._write(this.reg_s | 0x100, value);
            this.reg_s = (this.reg_s - 1) & 0xff;
        },

        // ============= addressing modes =============
        // Accumulator
        _a: function () {
            this.address = this.reg_a;
            this.addrMode = 'accumulator';
            this.reg_pc += 1;
        },

        // absolute
        _abs: function () {
            const high = this._peek(this.reg_pc + 2) << 8,
                low = this._peek(this.reg_pc + 1);

            this.address = high | low;
            this.reg_pc += 3;
        },

        // absolute, X-indexed
        _abx: function () {
            const high = this._peek(this.reg_pc + 2) << 8,
                low = this._peek(this.reg_pc + 1);

            if ((low + this.reg_x) & 0xff00) {
                this._burn(1);
            }
            this.address = (high | low) + this.reg_x;
            this.reg_pc += 3;
        },

        // absolute, Y-indexed
        _aby: function () {
            const high = this._peek(this.reg_pc + 2) << 8,
                low = this._peek(this.reg_pc + 1);

            if ((low + this.reg_y) & 0xff00) {
                this._burn(1);
            }
            this.address = (high | low) + this.reg_y;
            this.reg_pc += 3;
        },

        // immediate
        _imm: function () {
            this.address = this.reg_pc + 1;
            this.reg_pc += 2;
        },

        // implied
        _impl: function () {
            this.address = '';
            this.reg_pc += 1;
        },

        // indirect
        _ind: function () {
            const highAddr = this._peek(this.reg_pc + 2),
                lowAddr = this._peek(this.reg_pc + 1);
            const addr = (highAddr << 8) | lowAddr;

            const low = this._peek(addr),
                high = this._peek((addr + 1) & 0x00ff | (addr & 0xff00)) << 8;

            this.address = high | low;
            this.reg_pc += 3;
        },

        // X-indexed, indirect
        _idx: function () {
            const val = this._peek(this.reg_pc + 1);
            const lowAddr = (val + this.reg_x) & 0xff,
                highAddr = (lowAddr + 1) & 0xff;

            const high = this._peek(highAddr) << 8,
                low = this._peek(lowAddr);

            if ((val & 0xff00) !== ((val + this.reg_x) & 0xff00)) {
                this._burn(1);
            }

            this.address = high | low;
            this.reg_pc += 2;
        },

        // indirect, Y-indexed
        _idy: function () {
            const val = this._peek(this.reg_pc + 1);
            const lowAddr = val & 0xff,
                highAddr = (lowAddr + 1) & 0xff;

            const high = this._peek(highAddr) << 8,
                low = this._peek(lowAddr);

            if ((val & 0xff00) !== ((val + this.reg_y) & 0xff00)) {
                this._burn(1);
            }
            this.address = (high | low) + this.reg_y;
            this.reg_pc += 2;
        },

        // relative
        _rel: function () {
            this.address = this.reg_pc + 1;
            this.reg_pc += 2;
        },

        // zeropage
        _zp: function () {
            this.address = this._peek(this.reg_pc + 1) & 0xff;
            this.reg_pc += 2;
        },

        // zeropage, X-indexed
        _zpx: function () {
            this.address = (this._peek(this.reg_pc + 1) + this.reg_x) & 0xff;
            this.reg_pc += 2;
        },

        // zeropage, Y-indexed
        _zpy: function () {
            this.address = (this._peek(this.reg_pc + 1) + this.reg_y) & 0xff;
            this.reg_pc += 2;
        },

        tick: function () {
            this._exec(this._peek(this.reg_pc))
        },

        reset: function () {
        }
    };

    module.exports = CPU;
})();
