'use strict';

const map = require('map-stream');
const fileExist = require('./file-exist');
const path = require('path');

/**
 * This function is used to read the html files defined in a gulp pipe. For example
 * <pre>
 *     gulp.src("src/hmtl/*.html").pipe(htmlRead(modeDev));
 * </pre>
 * The function load all the html file and return a file object with the different medatada
 *
 * @returns {stream}
 */
module.exports = function (options) {

  return map((file, next) => {
    const page = path.resolve(__dirname, options.path, file.path);
    if(!fileExist(page)){
      throw new PluginError('files-exist', `File ${file.path} does not existe`);
    }
    next(null, file);
  });
};
