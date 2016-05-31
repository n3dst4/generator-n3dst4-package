var generators = require('yeoman-generator');
var gitEmail = require("git-user-email");
var gitUsername = require("git-user-name");
var dashify = require("dashify")

module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments);
  },

  prompting: function () {
    var done = this.async();

    this.prompt([
      {
        type: "input",
        name: "name",
        message: "Package name",
        default: dashify(this.appname),
        when: !(this.options.name)
      },
      {
        name: "description",
        message: "Description",
        type: "input",
        default: ""
      },
      {
        name: "email",
        message: "Your email address",
        type: "input",
        default: gitEmail(),
      },
      {
        name: "username",
        message: "Your name",
        type: "input",
        default: gitUsername(),
      },
      {
        name: "spa",
        message: "Do you want to create a SPA (single-page web app)?",
        type: "confirm",
        default: false,
      },
      {
        name: "bin",
        message: "Do you want an executable bin script?",
        type: "confirm",
        default: false,
        when: answers => !(answers.spa)
      },
      {
        name: "babel",
        message: "Do you want your code compiled with Babel?",
        type: "confirm",
        default: false,
        when: answers => !(answers.spa)
      },
      {
        name: "mocha",
        message: "Do you want a Mocha test suite?",
        type: "confirm",
        default: false,
        when: answers => !(answers.spa)
      },
      {
        name: "karma",
        message: "Do you want the test suite to run in a browser (through Karma)?",
        type: "confirm",
        when: answers => answers.mocha,
        default: false,
      },
      {
        name: "install",
        message: "Do you want to run \"npm install\" at the end?",
        type: "confirm",
        default: false,
      },
    ], function (answers) {
      this.answers = answers
      done()
    }.bind(this));
  },

  configuring: function () {
    if (this.answers.spa) {
      this.answers.babel = true
      this.answers.mocha = true
      this.answers.karma = true
      this.answers.bin = false
    }
    this.config.set({
      babel: this.answers.babel,
      name: this.answers.name,
    });
    // compose with subgenerators if need be
    ["bin", "mocha", "karma", "spa"].forEach(name => {
      if (this.answers[name]) {
        this.composeWith(`n3dst4-package:${name}`,
          {},
          { local: require.resolve(`../${name}`)}
        )
      }
    })
  },

  default: function () {
  },

  writing: function () {
    var package = this.fs.readJSON(this.templatePath("_package.json"));
    package.name = this.answers.name;
    package.main = `src/${this.answers.name}.js`
    package.author = `${this.answers.username} <${this.answers.email}>`
    package.description = this.answers.description

    if (this.config.get("babel")) {
      package.main = `__build/${this.answers.name}.js`
      package.scripts.prepublish = "babel src --out-dir __build --source-maps inline"
      package.devDependencies["babel-cli"] = "^6.5.1"
      package.devDependencies["babel-preset-es2015"] = "^6.5.0"
      package.devDependencies["babel-preset-react"] = "^6.5.0"
    }

    this.fs.writeJSON(this.destinationPath("package.json"), package)

    this.fs.copyTpl(
      this.templatePath(`src/main-${this.answers.babel? "es-new" : "es5"}.js`),
      this.destinationPath(`src/${this.answers.name}.js`),
      this.answers
    );

    var filesToCopy = ["_README.markdown", "_.travis.yml", "_.gitignore"];

    if (this.config.get("babel")) {
      filesToCopy = filesToCopy.concat(["_.babelrc", "_.npmignore"])
    }

    filesToCopy.forEach(function (filename) {
      this.fs.copyTpl(
        this.templatePath(filename),
        this.destinationPath(filename.replace(/^_/, "")),
        this.answers
      )
    }.bind(this))
  },

  install: function () {
    if (this.answers.install) {
      this.log("Installing dependencies...")
      this.npmInstall()
    }
  },
});
