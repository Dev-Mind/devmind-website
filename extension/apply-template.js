"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.extApplyTemplate = void 0;
var model_1 = require("./model");
var file_exist_1 = require("./file-exist");
var handlebars = require("handlebars");
var fs = require("fs");
var path = require("path");
var PluginError = require("plugin-error");
var map_stream_1 = require("./utils/map-stream");
/**
 * Used to apply a handlebar template on a file stream. This extension has to be applied after `read-html` or
 * `read-asciidoctor` extensions which create the `templateModel` sent to handlebars to populate the template
 *
 * Example of usage
 * ----
 * const HANDLEBARS_PARTIALS = [
 *   {key: '_html_header', path: 'src/templates/_html_header.handlebars'},
 *   {key: '_html_footer', path: 'src/templates/_html_footer.handlebars'}
 * ];
 * gulp.task('html-template', () => gulp.src('src/html/*.html)
 *   .pipe(website.readHtml())
 *   .pipe(website.applyTemplate('src/templates/site.handlebars`, HANDLEBARS_PARTIALS))
 *   .pipe(gulp.dest('build/dist')));
 * ----
 * @param options
 * @param handlebarsTemplateFile
 * @param partials
 * @returns {stream}
 */
function extApplyTemplate(options, handlebarsTemplateFile, partials) {
    var _this = this;
    var handlebarsTemplatePath = path.resolve(__dirname, options.path, handlebarsTemplateFile);
    if (!file_exist_1.extFileExist(handlebarsTemplatePath)) {
        throw new PluginError('apply-template', "handlebars template " + handlebarsTemplatePath + " is required");
    }
    if (partials) {
        partials.forEach(function (partial) { return handlebars.registerPartial(partial.key, fs.readFileSync(path.resolve(__dirname, options.path, partial.path), model_1.FILE_ENCODING)); });
    }
    var handlebarsTemplate = handlebars.compile(fs.readFileSync(handlebarsTemplatePath, model_1.FILE_ENCODING));
    return map_stream_1.mapStream(function (file, next) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            file.contents = Buffer.from(handlebarsTemplate(file.templateModel));
            next(null, file);
            return [2 /*return*/];
        });
    }); });
}
exports.extApplyTemplate = extApplyTemplate;
