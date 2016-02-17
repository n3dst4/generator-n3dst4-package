/*eslint-env node, mocha, es6 */
var helpers = require('yeoman-test')
var assert = require('yeoman-assert');
var path = require("path")
var uuid = require("uuid").v4

function runGenerator (opts, args, prompts) {
  return function (done) {
    var self = this;
    helpers.run(path.join( __dirname, '../generators/app'))
      .withOptions(opts || {})
      .withArguments(args || [])
      .withPrompts(prompts || {})
      //.on('ready', function (generator) { })
      .inTmpDir(function (dir) {
        self.dir = dir
        self.name = path.basename(dir)
      }.bind(this))
      .on('end', done);
  }
}

describe("app", function () {

  describe("default everything, empty folder", function () {
    before(runGenerator())

    it("should set valid defaults in package.json", function () {
      assert.JSONFileContent(path.join(this.dir, "package.json"), {
        name: this.name,
        version: "1.0.0",
        description: "",
        main: "src/" + this.name + ".js",
        "scripts": {
          "test": "echo \"Error: no test specified\" && exit 1"
        },
        "license": "ISC",
        "keywords": [],
        "dependencies": {
        },
        "eslintConfig": {
          "extends": "n3dst4"
        },
        "devDependencies": {
          "@n3dst4/eslint-config-n3dst4": "^1.4.0",
          "babel-eslint": "^4.1.6",
          "eslint": "^1.10.3",
          "eslint-plugin-babel": "^3.0.0"
        }
      })
    })

    it("should create a src folder and main file", function () {
      assert.file(path.join(this.dir, "src", this.name + ".js"))
    })

    it("should create a README", function () {
      assert.file(path.join(this.dir, "README.markdown"))
    })

    it("should create a travis config", function () {
      assert.file(path.join(this.dir, ".travis.yml"))
    })

    it("should create a .npmignore", function () {
      assert.file(path.join(this.dir, ".npmignore"))
    })

    it("should create a .gitignore", function () {
      assert.file(path.join(this.dir, ".gitignore"))
    })
  })


  function testName (name) {
    it("should set the project name in the package.json", function () {
      assert.JSONFileContent(path.join(this.dir, "package.json"), {
        name: name,
        main: `src/${name}.js`
      })
    })
    it("should name the main file acordingly", function () {
      assert.file(path.join(this.dir, "src", `${name}.js`))
    })
  }

  describe("name option", function () {
    var name = uuid()
    before(runGenerator({ name }))
    testName(name)
  })

  function testBin () {
    it("should create a bin entry in package.json", function () {
      assert.JSONFileContent(path.join(this.dir, "package.json"), {
        bin: { [this.name]: `src/bin/${this.name}.js`},
        preferGlobal: true
      })
    })
    it("should create the bin file", function () {
      assert.file(path.join(this.dir, "src", "bin", `${this.name}.js`))
    })
  }

  describe("bin option", function () {
    before(runGenerator({ bin: true }))
    testBin()
  })

  describe("name prompt", function () {
    var name = uuid()
    before(runGenerator({}, [], {name}))
    testName(name)
  })

  describe("description, email, and username prompts", function () {
    var description = uuid()
    var email = uuid()
    var username = uuid()
    before(runGenerator({}, [], {description, email, username}))

    it("should set the description, email, and username in package.json", function () {
      assert.JSONFileContent(path.join(this.dir, "package.json"), {
        description,
        author: `${username} <${email}>`
      })
    })
  })


})
