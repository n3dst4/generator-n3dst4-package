/*eslint-env node, mocha */
var helpers = require('yeoman-test')
var assert = require('yeoman-assert')
var path = require("path")
var uuid = require("uuid").v4
var os = require("os")
var crypto = require("crypto")

var runGenerator = require("./run-generator")
var kebabName = runGenerator.kebabName
var studlyName = runGenerator.studlyName
var namespacedName = runGenerator.namespacedName

describe("base app generator", function () {
  before(runGenerator())

  it("should set valid defaults in package.json", function () {
    assert.jsonFileContent(path.join(this.dir, "package.json"), {
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
        "extends": "@n3dst4/eslint-config-n3dst4"
      },
      "devDependencies": {
        "@n3dst4/eslint-config-n3dst4": "^2.1.0",
        "babel-eslint": "^6.0.4",
        "eslint": "^2.12.0",
        "eslint-plugin-babel": "^3.0.0",
        "eslint-plugin-react": "^5.1.1"
      }
    })
  })

  it("should create a src folder and main file", function () {
    assert.fileContent(path.join(this.dir, "src", this.name + ".js"), /^module\.exports = {}$/m)
  })

  it("should create a README", function () {
    assert.file(path.join(this.dir, "README.markdown"))
  })

  it("should create a travis config", function () {
    assert.file(path.join(this.dir, ".travis.yml"))
  })

  it("should NOT create a .npmignore", function () {
    assert.noFile(path.join(this.dir, ".npmignore"))
  })

  it("should create a .gitignore", function () {
    assert.file(path.join(this.dir, ".gitignore"))
  })

  // helper to test names
  function testName (name) {
    it("should set the project name in the package.json", function () {
      assert.jsonFileContent(path.join(this.dir, "package.json"), {
        name: name,
        main: `src/${name}.js`
      })
    })
    it("should name the main file acordingly", function () {
      assert.file(path.join(this.dir, "src", `${name}.js`))
    })
  }

  describe("name prompt", function () {
    var name = uuid()
    before(runGenerator({}, [], {name}))
    testName(name)
  })

  describe("kebab-case folder name", function () {
    before(function (done) {
      var tmpDir = path.join(os.tmpdir(), crypto.randomBytes(20).toString('hex'), kebabName)
      var self = this
      helpers.run(path.join( __dirname, '../generators/app'))
      .inDir(tmpDir, function (dir) {
        self.dir = dir
      }.bind(this))
      .on('end', done)
    })
    testName(kebabName)
  })

  describe("StudlyCaps folder name", function () {
    before(function (done) {
      var tmpDir = path.join(os.tmpdir(), crypto.randomBytes(20).toString('hex'), studlyName)
      var self = this
      helpers.run(path.join( __dirname, '../generators/app'))
      .inDir(tmpDir, function (dir) {
        self.dir = dir
      }.bind(this))
      .on('end', done)
    })
    testName(kebabName)
  })

  describe("namespaced name", function () {
    before(runGenerator({}, [], {name: namespacedName}))
    it("should set the project name in the package.json", function () {
      assert.jsonFileContent(path.join(this.dir, "package.json"), {
        name: namespacedName,
        main: `src/${kebabName}.js`
      })
    })
    it("should name the main file acordingly", function () {
      assert.file(path.join(this.dir, "src", `${kebabName}.js`))
    })
  })

  describe("description, email, and username prompts", function () {
    var description = uuid()
    var email = uuid()
    var username = uuid()
    before(runGenerator({}, [], {description, email, username}))

    it("should set the description, email, and username in package.json", function () {
      assert.jsonFileContent(path.join(this.dir, "package.json"), {
        description,
        author: `${username} <${email}>`
      })
    })
  })

  describe("babel prompt", function () {
    before(runGenerator({}, [], {babel: true}))

    it("should set up package.json for babelification", function () {
      assert.jsonFileContent(path.join(this.dir, "package.json"), {
        main: `__build/${this.name}.js`,
        scripts: {
          prepublish: "babel src --out-dir __build --source-maps inline"
        },
        devDependencies: {
          "babel-cli": "^6.5.1",
          "babel-preset-es2015": "^6.5.0",
          "babel-preset-react": "^6.5.0"
        }
      })
    })

    it("should create a src folder and main file with es6+ content", function () {
      assert.fileContent(path.join(this.dir, "src", this.name + ".js"), /^export default {}$/m)
    })

    it("should create a babelrc", function () {
      assert.jsonFileContent(path.join(this.dir, ".babelrc"), {
        "presets": ["es2015", "react"]
      })
    })

    it("should create an npmignore that excludes src", function () {
      assert.fileContent(path.join(this.dir, ".npmignore"), /^src$/m)
    })
  })
})
