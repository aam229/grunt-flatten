var fs = require("fs");

module.exports = function(grunt){

    function copyFiles(path, prefix, outputPath){
        var files = fs.readdirSync(path),
            subpath;
        for(var i = 0; i < files.length; i++) {
            subpath = path + "/" + files[i];

            if(fs.lstatSync(subpath).isDirectory()){
                copyFiles(subpath, prefix + "|" + files[i], outputPath);
            }
            else{
                if(files[i].indexOf(".md") === -1){
                    continue;
                }
                fs.createReadStream(subpath).pipe(fs.createWriteStream(filePath(outputPath, prefix, files[i])));
                grunt.log.writeln("Copying '" + subpath + "' to '" + filePath(outputPath, prefix, files[i]) + "'");
            }
        }
    }

    function filePath(outputPath, prefix, name){
        return outputPath + "/" + (prefix ? prefix + "|" : "") + name;
    }

    function cleanFiles(path, prefix){
        var files = fs.readdirSync(path);
        if(!prefix){
            grunt.log.writeln("Skipping clean up as no prefix was provided.")
            return;
        }
        for(var i = 0; i < files.length; i ++){
            if(files[i].indexOf(prefix) === 0 && files[i].indexOf(".md") > -1){
                fs.unlinkSync(path + "/" + files[i]);
                grunt.log.writeln("Removing '" + path + "/" + files[i] + "'");
            }
        }
    }

    grunt.registerMultiTask('flatten', 'Flatten a folder structure .', function() {
        // Merge task-specific and/or target-specific options with these defaults.
        var options = {
            src: this.data.src,
            dest: this.data.dest,
            prefix: this.data.prefix
        };
        if(!options.src){
            grunt.log.error("You must specify a src option");
            return false;
        }
        if(!options.dest){
            grunt.log.error("You must specify a dest option");
            return false;
        }
        cleanFiles(options.dest, options.prefix);
        copyFiles(options.src, options.prefix, options.dest);
        grunt.log.ok("The folder '" + options.src + "' was successfully flattened to '" + options.dest + "'");
    });
};