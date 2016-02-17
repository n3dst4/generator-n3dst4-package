var generators = require('yeoman-generator');
var gitEmail = require("git-user-email");
var gitUsername = require("git-user-name");

module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments);
    this.option("name", {type: "string"})
    this.option("bin")
  },

  initializing: function () {
    this.log("app initializing")
  },

  prompting: function () {
    var done = this.async();
    this.prompt([{
        type: "input",
        name: "name",
        message: "Package name",
        default: this.appname,
        when: !(this.options.name)
      },
      {
        type: "input",
        name: "description",
        message: "Description",
        default: ""
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
      {
        type: "confirm",
        name: "bin",
        message: "Do you want an executable bin script?",
        default: false,
        store: true,
        when: !this.options.bin
      },
      {
        type: "confirm",
        name: "babel",
        message: "Do you want to run everything through babel?",
        default: false,
        store: true
      },
      {
        type: "confirm",
        name: "browser",
        message: "Do you want this project to be browser-compatible?",
        default: true,
        store: true
      },
      {
        type: "confirm",
        name: "install",
        message: "Do you want to run npm install at the end?",
        default: false,
        store: true
      },
    ], function (answers) {
      // this.answers becomes a smoosh of inquirer results + options
      answers.name = answers.name || this.options.name
      answers.bin = answers.bin || this.options.bin
      this.answers = answers
      done()
    }.bind(this));
  },

  configuring: function () {
    // compose with the bin generator if need be
    if (this.answers.bin) {
      this.composeWith("n3dst4-package:bin",
        { options: {name: this.answers.name, babel: this.answers.babel} },
        { local: require.resolve("../bin")}
      )
    }
    if (this.answers.browser) {
      this.composeWith("n3dst4-package:browser",
        { options: {name: this.answers.name} },
        { local: require.resolve("../browser")}
      )
    }
  },

  default: function () {
  },

  writing: function () {
    var package = this.fs.readJSON(this.templatePath("_package.json"));
    package.name = this.answers.name;
    package.main = "src/" + this.answers.name + ".js"
    package.author = this.answers.username + "<" + this.answers.email + ">"
    package.description = this.answers.description
    if (this.answers.babel) {
      package.main = "__build/" + this.answers.name + ".js"
      package.scripts.prepublish = "babel src --out-dir __build"
      package.devdependenmcies.babel = "^5.8.23"
    }

    this.fs.writeJSON(this.destinationPath("package.json"), package)

    this.fs.copyTpl(
      this.templatePath("src/main.js"),
      this.destinationPath(package.main),
      this.answers
    );

    ["README.markdown", ".travis.yml", ".npmignore", ".gitignore"]
      .forEach(function (filename) {
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
    if (this.answers.install) {
      this.log("Installing dependencies...")
      this.npmInstall()
    }
  },

  end: function () {
  },

});
