var path = require("path");
var fs = require("fs");
var app = {};


var options = {};


var _mergeOptions = function (_options) {
    var options = {
        path: path.join(process.env.PWD, "docs")
    };
    options = Object.assign({}, options, _options);
    return options;

}

var _renderFile = function (file) {
    app.render(file.view, file.options, function (err, html) {
        if (err) {

        }
        else {
            var filename = path.join(options.path, file.url, "index.html");
            ensureDirectoryExistence(filename);
            fs.writeFile(filename, html, { flag: "w", encoding: "utf8" }, function (err) {
                console.log(err);
            });
        }
    });
}

var _renderFiles = function (list = []) {
    list.forEach(function (item, index) {
        _renderFile(item);
    });
}



var ensureDirectoryExistence = function (filePath) {
    var dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
        return true;
    }
    ensureDirectoryExistence(dirname);
    fs.mkdirSync(dirname);
}

var copyFolderSync = function (from, to) {
    if (!fs.existsSync(to)) {
        fs.mkdirSync(to);
    }
    fs.readdirSync(from).forEach(element => {
        if (fs.lstatSync(path.join(from, element)).isFile()) {
            fs.copyFileSync(path.join(from, element), path.join(to, element));
        } else {
            copyFolderSync(path.join(from, element), path.join(to, element));
        }
    });
}


module.exports = (function (_app, _options) {
    app = _app;
    options = _mergeOptions(_options);

    if (options.static) {
        copyFolderSync(options.static, options.path);
    }

    return {
        renderFile: _renderFile,
        renderFiles: _renderFiles
    };
})