(function () {

    function CPU(nes) {
        this.nes = nes;

        // Memory
        // ======
        // 0x100 => Zero Page
        // 0x200 => Stack
        // 0x800 => RAM
        // 0x2000 => Mirrors (0-0x7FF)
        // 0x2008 => I/O Registers
        // 0x4000 => Mirrors (0x2000-0x2007)
        // 0x4020 => I/O Registers
        // 0x6000 => Expansion ROM
        // 0x8000 => SRAM
        // 0xC000 => PRG-ROM (Lower Bank)
        // 0x10000 => PRG-ROM (Upper Bank)
        this.memory = Array(0x10000);

        // Registers
        // =========
        // Program Counter (16bit)
        this.pc = null;

        // Stack Pointer (8bit)
        this.sp = null;

        // Accumulator (8bit)
        this.a = null;

        // Index Register X (8bit)
        this.x = null;

        // Index Register Y (8bit)
        this.y = null;

        // Processor Status
        // 0 => Carry (if last instruction resulted in under/overflow)
        // 1 => Zero (if last instruction's result was 0)
        // 2 => Interrupt Disable (Enable to prevent system from responding to interrupts)
        // 3 => Decimal mode (unsupported on this chip variant)
        // 4 => Empty
        // 5 => Empty
        // 6 => Overflow (if previous instruction resulted in an invalid two's complement)
        // 7 => Negative
        this.p = null;

        // Part of the Processor Status register
        // Separated for convenience.
        this.carryFlag = false;
        this.zeroFlag = true;
        this.interruptDisable = true;
        this.decimalModeFlag = false;
        this.breakCommand = false;
        this.overflowFlag = false;
        this.negativeFlag = false;

        // Maskable Interrupt
        // One of "irq/brk", "nmi", "reset"
        this.interrupt = null;

        // Addressing Modes
        // ================
        this.addressingMode = {
            ZERO_PAGE: 0,
            INDEXED_ZERO_PAGE_X: 1,
            INDEXED_ZERO_PAGE_Y: 2,
            ABSOLUTE: 3,
            INDEXED_ABSOLUTE_X: 4,
            INDEXED_ABSOLUTE_Y: 5,
            IMPLIED: 6,
            ACCUMULATOR: 7,
            IMMEDIATE: 8,
            RELATIVE: 9,
            INDEXED_INDIRECT: 10,
            INDIRECT_INDEXED: 11,
            INDIRECT: 12
        };

        // Operations
        // ==========
        // A nice human-readable format that is
        // converted for performance on object
        // instantiation.
        this.operations = {};

        this.reset();

    }

// When the CPU is reset.
    CPU.prototype.reset = function () {

        this.memory = Array(0x10000);

        this.carryFlag = false;
        this.zeroFlag = false;
        this.interruptDisable = true;
        this.decimalModeFlag = false;
        this.breakCommand = false;
        this.overflowFlag = false;
        this.negativeFlag = false;

        // var programRom = this.nes.program.getPrgRom();
        var i;

        // 2kb Internal RAM
        for (i = 0; i <= 0x2000; i++) {
            this.memory[i] = 0xFF;
        }

        // All others set to 0.
        for (i = 0x2000; i <= 0x8000; i++) {
            this.memory[i] = 0;
        }

        this.pc = this.getResetVector();

        this.sp = 0xFD;

        this.a = 0;
        this.x = 0;
        this.y = 0;

        this.carryFlag = false;
        this.zeroFlag = false;
        this.interruptDisable = true;
        this.decimalModeFlag = false
        this.breakCommand = false;
        this.overflowFlag = false;
        this.negativeFlag = false;

        this.p = this.getProcessorFlags();

    };

// Serialise the list of individual processor flags into the register's value.
    CPU.prototype.getProcessorFlags = function () {
        return +this.carryFlag | +this.zeroFlag << 1 | +this.interruptDisable << 2 | +this.decimalModeFlag << 3 | +this.breakCommand << 4 | 0x20 | +this.overflowFlag << 6 | +this.negativeFlag << 7;
    };

// Find where the program begins.
    CPU.prototype.getResetVector = function () {
        return this.loadMemory(0xfffc, true);
    };

// Load memory, with an optional double read for 2 bytes.
    CPU.prototype.loadMemory = function (address, double) {
        if (!double) {
            return this.nes.mapper.load(address);
        }

        // return this.nes.mapper.load(address) | (this.nes.mapper.load(address + 1) << 8)
    };
    module.exports = CPU;
})();
