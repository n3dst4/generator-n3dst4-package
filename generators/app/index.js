var generators = require('yeoman-generator');
var gitEmail = require("git-user-email");
var gitUsername = require("git-user-name");

module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments);
    //this.argument("name", {type: "string", required: true})
  },

  initializing: function () {

  },

  prompting: function () {
    var done = this.async();
    this.prompt([{
        type: "input",
        name: "name",
        message: "Package name",
        default: this.appname
      },
      // {
      //   type: "input",
      //   name: "email",
      //   message: "Your email address",
      //   default: gitEmail(),
      //   store: true,
      // },
      // {
      //   type: "input",
      //   name: "username",
      //   message: "Your name",
      //   default: gitUsername(),
      //   store: true,
      // },
    ], function (answers) {
      this.log("name: "+ answers.name)
      this.answers = answers;
      done()
    }.bind(this));
  },

  configuring: function () {

  },

  default: function () {

  },

  writing: function () {
    var package = this.fs.readJSON("package.json");
    package.name = this.answers.name;
    package.main = "src/" + name + ".js"
    this.fs.writeJSON("package.json", package)
  },

  conflicts: function () {

  },

  install: function () {

  },

  end: function () {

  },



});
