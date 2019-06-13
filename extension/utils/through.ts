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
        console.log('data', data)
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

// exports = module.exports = through
// through.through = through
//
// //create a readable writable stream.
//
// function through (write, end, opts) {
//   write = write || function (data) { this.queue(data) }
//   end = end || function () { this.queue(null) }
//
//   var ended = false, destroyed = false, buffer = [], _ended = false
//   var stream = new Stream()
//   stream.readable = stream.writable = true
//   stream.paused = false
//
// //  stream.autoPause   = !(opts && opts.autoPause   === false)
//   stream.autoDestroy = !(opts && opts.autoDestroy === false)
//
//   stream.write = function (data) {
//     write.call(this, data)
//     return !stream.paused
//   }
//
//   function drain() {
//     while(buffer.length && !stream.paused) {
//       var data = buffer.shift()
//       if(null === data)
//         return stream.emit('end')
//       else
//         stream.emit('data', data)
//     }
//   }
//
//   stream.queue = stream.push = function (data) {
// //    console.error(ended)
//     if(_ended) return stream
//     if(data === null) _ended = true
//     buffer.push(data)
//     drain()
//     return stream
//   }
//
//   //this will be registered as the first 'end' listener
//   //must call destroy next tick, to make sure we're after any
//   //stream piped from here.
//   //this is only a problem if end is not emitted synchronously.
//   //a nicer way to do this is to make sure this is the last listener for 'end'
//
//   stream.on('end', function () {
//     stream.readable = false
//     if(!stream.writable && stream.autoDestroy)
//       process.nextTick(function () {
//         stream.destroy()
//       })
//   })
//
//   function _end () {
//     stream.writable = false
//     end.call(stream)
//     if(!stream.readable && stream.autoDestroy)
//       stream.destroy()
//   }
//
//   stream.end = function (data) {
//     if(ended) return
//     ended = true
//     if(arguments.length) stream.write(data)
//     _end() // will emit or queue
//     return stream
//   }
//
//   stream.destroy = function () {
//     if(destroyed) return
//     destroyed = true
//     ended = true
//     buffer.length = 0
//     stream.writable = stream.readable = false
//     stream.emit('close')
//     return stream
//   }
//
//   stream.pause = function () {
//     if(stream.paused) return
//     stream.paused = true
//     return stream
//   }
//
//   stream.resume = function () {
//     if(stream.paused) {
//       stream.paused = false
//       stream.emit('resume')
//     }
//     drain()
//     //may have become paused again,
//     //as drain emits 'data'.
//     if(!stream.paused)
//       stream.emit('drain')
//     return stream
//   }
//   return stream
// }
//
