"use strict";
exports.__esModule = true;
exports.through = void 0;
var stream_1 = require("stream");
/**
 * a stream that does nothing but re-emit the input.
 * useful for aggregating a series of changing but not ending streams into one stream)
 */
function through(write, end) {
    var _this = this;
    var ended = false;
    var destroyed = false;
    var paused = false;
    var buffer = [];
    var stream = new stream_1.Duplex();
    stream.readable = true;
    stream.writable = true;
    var drain = function () {
        while (buffer.length) {
            var data = buffer.shift();
            if (null === data) {
                stream.emit('end');
                break;
            }
            else {
                stream.emit('data', data);
            }
        }
    };
    var _end = function () {
        stream.writable = false;
        end(stream);
        if (!stream.readable)
            stream.destroy();
    };
    stream.write = function (data) {
        write(_this, data);
        return !paused;
    };
    stream.read = stream.push = function (data) {
        if (ended) {
            return false;
        }
        if (data === null || data === {} || data === []) {
            ended = true;
        }
        buffer.push(data);
        drain();
        return true;
    };
    //this will be registered as the first 'end' listener
    //must call destroy next tick, to make sure we're after any
    //stream piped from here.
    //this is only a problem if end is not emitted synchronously.
    //a nicer way to do this is to make sure this is the last listener for 'end'
    stream.on('end', function () {
        stream.readable = false;
        if (!stream.writable) {
            process.nextTick(function () { return stream.destroy(); });
        }
    });
    stream.end = function (data) {
        if (ended) {
            return null;
        }
        ended = true;
        if (data) {
            stream.write(data);
        }
        _end();
        return stream;
    };
    stream.destroy = function () {
        if (destroyed) {
            return null;
        }
        destroyed = true;
        ended = true;
        buffer.length = 0;
        stream.writable = false;
        stream.readable = false;
        stream.emit('close');
        return stream;
    };
    stream.pause = function () {
        if (paused) {
            return null;
        }
        paused = true;
        return stream;
    };
    stream.resume = function () {
        if (paused) {
            paused = false;
            stream.emit('resume');
        }
        drain();
        //may have become paused again, as drain emits 'data'.
        // if (!paused) {
        //     stream.emit('drain');
        // }
        return stream;
    };
    return stream;
}
exports.through = through;
