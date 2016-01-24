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
      {
          type: "input",
          name: "description",
          message: "Description",
          default: "No description provided"
      },
      {
        type: "input",
        name: "email",
        message: "Your email address",
        default: gitEmail(),
        store: true,
      },
      {
        type: "input",
        name: "username",
        message: "Your name",
        default: gitUsername(),
        store: true,
      },
    ], function (answers) {
      this.answers = answers;
      done()
    }.bind(this));
  },

  configuring: function () {

  },

  default: function () {

  },

  writing: function () {
    var package = this.fs.readJSON(this.templatePath("_package.json"));
    package.name = this.answers.name;
    package.main = "src/" + this.answers.name + ".js"
    this.fs.writeJSON(this.destinationPath("package.json"), package)

    this.fs.copyTpl(
      this.templatePath("src/main.js"),
      this.destinationPath(package.main),
      this.answers
    );

    ["README.markdown", ".travis.yml", ".npmignore", ".gitignore"]
      .forEach(function (filename) {
        console.log(filename)
        this.fs.copyTpl(
          this.templatePath(filename),
          this.destinationPath(filename),
          this.answers
        )
      }.bind(this))


  },

  conflicts: function () {

  },

  install: function () {

  },

  end: function () {

  },



});
