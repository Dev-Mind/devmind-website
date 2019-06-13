import {Duplex} from 'stream';


/**
 * a stream that does nothing but re-emit the input.
 * useful for aggregating a series of changing but not ending streams into one stream)
 */

export function through(write: (stream:Duplex, data?:any) => void, end: (Duplex) => void): Duplex {
    let ended = false;
    let destroyed = false;
    let paused = false;
    const buffer = [];

    const stream = new Duplex();
    stream.readable = true;
    stream.writable = true;

    const drain = () => {
        while (buffer.length) {
            const data = buffer.shift();
            if (null === data) {
                stream.emit('end');
                break;
            } else{
                stream.emit('data', data);
            }
        }

    };

    const _end = () => {
        stream.writable = false;
        end(stream);
        if (!stream.readable)
            stream.destroy();
    };

    stream.write = (data) => {
        write(this, data);
        return !paused;
    };

    stream.read = stream.push = (data) => {
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
    stream.on('end', () => {
        stream.readable = false;
        if (!stream.writable) {
            process.nextTick(() => stream.destroy());
        }
    });

    stream.end = (data) => {
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

    stream.destroy = () => {
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

    stream.pause = () => {
        if (paused) {
            return null;
        }
        paused = true;
        return stream;
    };

    stream.resume = () => {
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
