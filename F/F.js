;(function (exports, ramda) {
    'use strict';

    var curry = ramda.curry;
    var compose = ramda.compose;

    var trace = curry(function (tag, x) {
        console.log(tag, x);
        return x;
    });

    var maybe = curry(function (x, f, m) {
        return m.isNothing() ? x : f(m.__value);
    });

    var either = curry(function (f, g, e) {
        switch (e.constructor) {
            case Left:
                return f(e.__value);
            case Right:
                return g(e.__value);
        }
    });

    //  join :: Monad m => m (m a) -> m a
    var join = function (mma) {
        return mma.join();
    }

    //  chain :: Monad m => (a -> m b) -> m a -> m b
    var chain = curry(function (f, m) {
        return m.map(f).join(); // 或者 compose(join, map(f))(m)
    });

    // Maybe
    var Maybe = function (x) {
        this.__value = x;
    };

    Maybe.of = function (x) {
        return new Maybe(x);
    };

    Maybe.prototype.isNothing = function () {
        return (this.__value === null || this.__value === undefined);
    };

    Maybe.prototype.map = function (f) {
        return this.isNothing() ? Maybe.of(null) : Maybe.of(f(this.__value));
    };

    Maybe.prototype.join = function () {
        return this.isNothing() ? Maybe.of(null) : this.__value;
    }

    Maybe.prototype.chain = function (f) {
        return this.map(f).join();
    }

    Maybe.prototype.ap = function (other_container) {
        return other_container.map(this.__value);
    }

    //Either
    var Left = function (x) {
        this.__value = x;
    };

    Left.of = function (x) {
        return new Left(x);
    };

    Left.prototype.map = function (f) {
        return this;
    };

    Left.prototype.join = function (functor) {
        return this;
    };

    Left.prototype.chain = function(f) {
        return this.map(f).join();
    }

    Left.prototype.ap = function (functor) {
        return this;
    };

    var Right = function (x) {
        this.__value = x;
    };

    Right.of = function (x) {
        return new Right(x);
    };

    Right.prototype.map = function (f) {
        return Right.of(f(this.__value));
    };

    Right.prototype.join = function () {
        return this.__value;
    };

    Right.prototype.chain = function(f) {
        return this.map(f).join();
    }

    Right.prototype.ap = function (functor) {
        return functor.map(this.__value);
    };

    // IO
    var IO = function (f) {
        this.unsafePerformIO = f;
    };

    IO.of = function (x) {
        return new IO(function () {
            return x;
        });
    };

    IO.prototype.map = function (f) {
        return new IO(compose(f, this.unsafePerformIO));
    };

    IO.prototype.join = function () {
        return this.unsafePerformIO();
    }

    IO.prototype.chain = function (f) {
        return this.map(f).join();
    }

    IO.prototype.ap = function (other_container) {
        return other_container.map(this.__value);
    }

    exports.F = {
        trace: trace,
        maybe: maybe,
        Maybe: Maybe,
        either: either,
        Left: Left,
        Right: Right,
        IO: IO,
        chain: chain
    };

}.call(this, typeof exports === 'undefined' ? this : exports, this.R || require('ramda')));
