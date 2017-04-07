var generators = require('yeoman-generator')
var gitEmail = require("git-user-email")
var gitUsername = require("git-user-name")
var dashify = require("dashify")
var _ = require("lodash")
var execSync = require("child_process").execSync
var path = require("path")

var defaultEmail
try { defaultEmail = gitEmail() }
catch (e) { defaultEmail = "" }

var defaultUsername
try { defaultUsername = gitUsername() }
catch (e) { defaultUsername = "" }

var npmUser

module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments)
  },

  initializing: function () {
    // we base the appname on package.json, or failing that, the folder name.
    // we can't use Yeoman's built-in "this.appname" because it strips
    // punctuation
    var nameFromPackage = this.fs.readJSON(this.destinationPath('package.json'), {}).name

    if (npmUser === undefined) {
      try {
        npmUser = execSync("npm whoami", {stdio: ["pipe", "pipe", "ignore"]}).toString('utf8').trim()
      }
      catch (e) {
        npmUser = null
      }
    }

    this.log(`npm user is ${npmUser}`)

    if (nameFromPackage) {
      var namespaceMatch = /^(?:@(\w+)\/)?(.+)/.exec(nameFromPackage)
      this.defaultNamespace = namespaceMatch[1] || npmUser
      this.shouldUseNamespace = !!(namespaceMatch[1])
      this.defaultName = namespaceMatch[2]
    }
    else {
      this.defaultNamespace = npmUser
      this.shouldUseNamespace = false
      this.defaultName = dashify(path.basename(this.destinationRoot()))
    }

  },

  prompting: function () {
    var done = this.async()

    this.prompt([
      {
        type: "input",
        name: "name",
        message: "Package name",
        validate: n => /^(?:@[0-9a-z][0-9a-z\-]*\/)?[0-9a-z][0-9a-z\-]*$/.test(n) ||
          "Name should be in kebab-case-only (with optional @username/ prefix)",
        default: this.defaultName
      },
      // if the use is logged into npm but doesn't enter a namespace, give them
      // the option to use their npm username as the namespace
      {
        name: "isNamespaced",
        message: "Should this package be namespaced?",
        type: "list",
        when: answers => ((! /^@.+\//.test(answers.name)) && !!(this.defaultNamespace)),
        choices: answers => [
          {
            name: `No (${answers.name})`,
            value: false
          },
          {
            name: `Yes (@${this.defaultNamespace}/${answers.name})`,
            value: true
          }
        ],
        default: false,
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
        default: defaultEmail,
      },
      {
        name: "username",
        message: "Your name",
        type: "input",
        default: defaultUsername,
      },
      {
        name: "spa",
        message: "Do you want to create a SPA (single-page web app)?",
        type: "confirm",
        default: false,
      },
      {
        name: "reactComponent",
        message: "Do you want to create a React component?",
        type: "confirm",
        default: false,
        when: answers => !(answers.spa)
      },
      {
        name: "bin",
        message: "Do you want an executable bin script?",
        type: "confirm",
        default: false,
        when: answers => !(answers.spa || answers.reactComponent)
      },
      {
        name: "babel",
        message: "Do you want your code compiled with Babel?",
        type: "confirm",
        default: false,
        when: answers => !(answers.spa || answers.reactComponent)
      },
      {
        name: "mocha",
        message: "Do you want a Mocha test suite?",
        type: "confirm",
        default: false,
        when: answers => !(answers.spa || answers.reactComponent)
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
    }.bind(this))
  },

  configuring: function () {
    var match = /^(?:@\w+\/)?(.+)/.exec(this.answers.name)

    this.answers.shortName = match[1]
    this.answers.camelName = _.camelCase(this.answers.shortName)

    if (this.answers.isNamespaced) {
      this.answers.name = `@${this.defaultNamespace}/${this.answers.name}`
    }

    if (this.answers.spa || this.answers.reactComponent) {
      this.answers.babel = true
      this.answers.mocha = true
      this.answers.karma = true
      this.answers.bin = false
    }
    this.config.set({
      babel: this.answers.babel,
      name: this.answers.name,
      camelName: this.answers.camelName,
      shortName: this.answers.shortName,
      description: this.answers.description
    })
    // compose with subgenerators if need be
    ;["bin", "mocha", "karma", "spa", "reactComponent"].forEach(name => {
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
    var pkg = this.fs.readJSON(this.templatePath("_package.json"))
    pkg.name = this.answers.name
    pkg.main = `src/${this.answers.shortName}.js`
    pkg.author = `${this.answers.username} <${this.answers.email}>`
    pkg.description = this.answers.description

    if (this.config.get("babel")) {
      pkg.main = `__build/${this.answers.shortName}.js`
      pkg.scripts.build = "babel src --out-dir __build --source-maps inline"
      pkg.scripts.prepublish = "npm run build"
      pkg.scripts["watch-build"] = "npm run build -- --watch"
      pkg.devDependencies["babel-cli"] = "^6.5.1"
      pkg.devDependencies["babel-preset-es2015"] = "^6.5.0"
      pkg.devDependencies["babel-preset-react"] = "^6.5.0"
    }

    this.fs.writeJSON(this.destinationPath("package.json"), pkg)

    this.fs.copyTpl(
      this.templatePath(`src/main-${this.answers.babel? "es6" : "es5"}.js`),
      this.destinationPath(`src/${this.answers.shortName}.js`),
      this.answers
    )

    var filesToCopy = ["_README.markdown", "_.travis.yml", "_.gitignore"]

    if (this.config.get("babel")) {
      filesToCopy = filesToCopy.concat(["_.npmignore"])
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
})
