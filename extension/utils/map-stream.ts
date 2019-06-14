import {Duplex} from 'stream';


/**
 * Filter will reemit the data if cb(err,pass) pass is truthy
 * @param mapper
 */
export function mapStream(mapper): Duplex {
  let inputs = 0
    , outputs = 0
    , ended = false
    , paused = false
    , destroyed = false
    , lastWritten = 0
    , inNext = false;


  const stream = new Duplex();
  // Items that are not ready to be written yet (because they would come out of
  // order) get stuck in a queue for later.
  const writeQueue = {};

  stream.writable = true;
  stream.readable = true;

  const queueData = (data, number) => {
    var nextToWrite = lastWritten + 1;

    if (number === nextToWrite) {
      // If it's next, and its not undefined write it
      if (data !== undefined) {
        stream.emit.apply(stream, ['data', data]);
      }
      lastWritten++;
      nextToWrite++;
    } else {
      // Otherwise queue it for later.
      writeQueue[number] = data;
    }

    // If the next value is in the queue, write it
    if (writeQueue.hasOwnProperty(nextToWrite)) {
      const dataToWrite = writeQueue[nextToWrite];
      delete writeQueue[nextToWrite];
      return queueData(dataToWrite, nextToWrite);
    }
    outputs++;
    if (inputs === outputs) {
      if (paused) {
        paused = false;
        stream.emit('drain');
      }
      if (ended) {
        end();
      }
    }
  };

  const end = (data?) => {
    //if end was called with args, write it,
    ended = true; //write will emit 'end' if ended is true
    stream.writable = false;
    if (data !== undefined) {
      return queueData(data, inputs);
    } else if (inputs == outputs) { //wait for processing
      stream.readable = false;
      stream.emit('end');
      stream.destroy();
    }
  };

  const next = (err, data?, number?) => {
    if (destroyed) return;
    inNext = true;
    if (!err) {
      queueData(data, number);
    }
    if (err) {
      stream.emit.apply(stream, ['error', err]);
    }
    inNext = false;
  };

  // Wrap the mapper function by calling its callback with the order number of
  // the item in the stream.
  const wrappedMapper = (input, number, callback) => mapper.call(null, input, (err, data) => callback(err, data, number));

  stream.write = (data) => {
    if (ended) {
      throw new Error('map stream is not writable');
    }
    inNext = false;
    inputs++;
    try {
      //catch sync errors and handle them like async errors
      const written = wrappedMapper(data, inputs, next);
      paused = (written === false);
      return !paused;
    } catch (err) {
      //if the callback has been called syncronously, and the error
      //has occured in an listener, throw it again.
      if (inNext) {
        throw err;
      }
      next(err);
      return !paused
    }
  };
  stream.end = (data) => {
    if (ended) return;
    end(data);
  };

  stream.destroy = () => {
    ended = destroyed = true;
    stream.writable = stream.readable = paused = false;
    process.nextTick(() => {
      stream.emit('close')
    })
  };
  stream.pause = () => {
    paused = true;
    return stream;
  };

  stream.resume = () => {
    paused = false;
    return stream;
  };

  return stream;
}
