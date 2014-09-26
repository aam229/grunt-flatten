##grunt-flatten

Flatten a directory structure:
 * Copy files recursively within a folder
 * Output all files in one directory, named after their relative position in the original directory
 * Update all the references to other paths within the copied files

For example, when flatenning with the seperator set to "|" and prefix set to "src", the following directory structure:
```
in/
    foo.rm
    bar.rm
    foo/
      foo.rm
      bar.rm
    bar/
      foo.rm
      bar.rm
```
would become:
```
out/
    src|foo.rm
    src|bar.rm
    src|foo|foo.rm
    src|foo|bar.rm
    src|bar|foo.rm
    src|bar|bar.rm
```
### Purpose
Common git providers (github, bitbucket) do not support tree structures for a project's wiki. This task allows a project to define its wiki in a tree structure and output its flattened version to the wiki directory. It can be combined with the (grunt-markdown-sidebar)[https://github.com/aam229/grunt-markdown-sidebar] task to generate a sidebar for your wiki based on the flattened structure. It can also be combined with (jsdox)[http://jsdox.org/] to flatten the generated documentation.

### Usage
Install using npm: 
```
npm install --save https://github.com/aam229/grunt-flatten
```

Add the plugin's configuration to your `Gruntfile`:

```javascript
//Configure
grunt.initConfig({
  flatten: {
    src: "path/to/input",
    dest: "path/to/output",
    prefix: "...", //A prefix added to the generated file,
    separator: "|", //The character used to separate directory/file names
  }
});
//Add task
grunt.loadNpmTasks('grunt-flatten');
```

