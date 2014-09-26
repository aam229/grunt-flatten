var fs = require("fs");

module.exports = function(grunt){

    function parse(path, prefix, outputPath, separator, outputFiles){
        var files = fs.readdirSync(path),
            subpath;
        for(var i = 0; i < files.length; i++) {
            subpath = path + "/" + files[i];

            if(fs.lstatSync(subpath).isDirectory()){
                parse(subpath, prefix + separator + files[i], outputPath, separator, outputFiles);
            }
            else{
                if(files[i].indexOf(".md") === -1){
                    continue;
                }
                outputFiles.push({
                    inPath: subpath,
                    outPath: filePath(outputPath, prefix, files[i], separator)
                });
            }
        }
    }

    function filePath(outputPath, prefix, name, separator){
        return outputPath + "/" + (prefix ? prefix + separator : "") + name;
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

    function write(files, src){
        var replacements = {}, file, content, replacement;
        for(var i = 0; i < files.length; i++){
            file = files[i].outPath;
            file = file.substring(file.lastIndexOf("/")+1, file.lastIndexOf("."));
            replacement = encodeURIComponent(file);
            file = files[i].inPath;
            file = file.substring(src.length + 1);
            replacements[file] = replacement;
        }
        grunt.log.ok(JSON.stringify(replacements));
        for(var i = 0; i < files.length; i++){
            content = fs.readFileSync(files[i].inPath, {encoding: "utf8"});
            for(var url in replacements){
                content = content.replace(new RegExp(url, "g"), replacements[url]);
            }
            fs.writeFileSync(files[i].outPath, content);
        }
    }

    grunt.registerMultiTask('flatten', 'Flatten a folder structure .', function() {
        // Merge task-specific and/or target-specific options with these defaults.
        var options = {
            src: this.data.src,
            dest: this.data.dest,
            prefix: this.data.prefix,
            separator: this.data.separator || "|"
        }, files = [];

        if(!options.src){
            grunt.log.error("You must specify a src option");
            return false;
        }
        if(!options.dest){
            grunt.log.error("You must specify a dest option");
            return false;
        }
        cleanFiles(options.dest, options.prefix);
        parse(options.src, options.prefix, options.dest, options.separator, files);
        write(files, options.src);
        grunt.log.ok("The folder '" + options.src + "' was successfully flattened to '" + options.dest + "'");
    });
};