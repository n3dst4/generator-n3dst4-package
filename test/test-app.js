/*eslint-env node, mocha, es6 */
var helpers = require('yeoman-test')
var assert = require('yeoman-assert')
var path = require("path")
var uuid = require("uuid").v4
var fs = require("fs")
var yaml = require('js-yaml')
var crypto = require("crypto")
var os = require("os")

var studlyName = "FtangFtangOle.BiscuitBarrel"
var kebabName = "ftang-ftang-ole-biscuit-barrel"
var camelName = "ftangFtangOleBiscuitBarrel"

function runGenerator (opts, args, prompts) {
  return function (done) {
    var self = this;
    var tmpDir = path.join(os.tmpdir(), crypto.randomBytes(20).toString('hex'), kebabName)
    helpers.run(path.join( __dirname, '../generators/app'))
      .withOptions(opts || {})
      .withArguments(args || [])
      .withPrompts(prompts || {})
      .withLocalConfig({})
      // .on('ready', function (generator) {
      // })
      .inDir(tmpDir, function (dir) {
        self.dir = dir
        self.name = path.basename(dir)
      }.bind(this))
      .on('end', done);
  }
}

describe("app generator", function () {

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
          "extends": "@n3dst4/eslint-config-n3dst4"
        },
        "devDependencies": {
          "@n3dst4/eslint-config-n3dst4": "^1.6.0",
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

    it("should NOT create a .npmignore", function () {
      assert.noFile(path.join(this.dir, ".npmignore"))
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

  describe("name prompt", function () {
    var name = uuid()
    before(runGenerator({}, [], {name}))
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

  describe("bin prompt", function () {
    before(runGenerator({}, [], { bin: true }))
    testBin()
  })

  // test for invalid name??

  describe("kebab-case folder name", function () {
    before(function (done) {
      var tmpDir = path.join(os.tmpdir(), crypto.randomBytes(20).toString('hex'), kebabName)
      var self = this;
      helpers.run(path.join( __dirname, '../generators/app'))
        .inDir(tmpDir, function (dir) {
          self.dir = dir
        }.bind(this))
        .on('end', done);
    })
    testName(kebabName)
  });

  describe("StudlyCaps folder name", function () {
    before(function (done) {
      var tmpDir = path.join(os.tmpdir(), crypto.randomBytes(20).toString('hex'), studlyName)
      var self = this;
      helpers.run(path.join( __dirname, '../generators/app'))
        .inDir(tmpDir, function (dir) {
          self.dir = dir
        }.bind(this))
        .on('end', done);
    })
    testName(kebabName)
  });

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

  describe("babel prompt", function () {
    before(runGenerator({}, [], {babel: true}))

    it("should set up package.json for babelification", function () {
      assert.JSONFileContent(path.join(this.dir, "package.json"), {
        main: `__build/${this.name}.js`,
        scripts: {
          prepublish: "babel src --out-dir __build"
        },
        devDependencies: {
          "babel-cli": "^6.5.1",
          "babel-preset-es2015": "^6.5.0",
          "babel-preset-react": "^6.5.0"
        }
      })
    })

    it("should create a babelrc", function () {
      assert.JSONFileContent(path.join(this.dir, ".babelrc"), {
        "presets": ["es2015", "react"]
      })
    })
  })

  describe("babel + bin prompts", function () {
    before(runGenerator({}, [], {babel: true, bin: true}))

    it("should point bin into __build", function () {
      assert.JSONFileContent(path.join(this.dir, "package.json"), {
        bin: { [this.name]: `__build/bin/${this.name}.js`},
      })
    })
  })

  describe("browser prompt", function () {
    before(runGenerator({}, [], {browser: true}))

    it("should not add babelify yet", function () {
      var package = JSON.parse(fs.readFileSync(path.join(this.dir, "package.json"), 'utf8'));
      assert(!(package.dependencies && package.dependencies.babelify),
        "babelify dependency should not be set")
      assert((!package.browserify) || (!package.browserify.transform) || package.browserify.transform.indexOf("babelify") == -1,
        "babelify transform should bot be set up")
    });

    it("should set the browser field in package.json", function () {
      assert.JSONFileContent(path.join(this.dir, "package.json"), {
        browser: `src/${this.name}.js`
      })
    });

    it("should add xvfb magic to travis config", function () {
      var travisConfigText = fs.readFileSync(path.join(this.dir, ".travis.yml"), "utf-8")
      var travisConfig = yaml.safeLoad(travisConfigText);
      assert.objectContent(travisConfig, {
        before_script: [
          "export DISPLAY=:99.0",
          "sh -e /etc/init.d/xvfb start"
        ]
      })
    })
  })

  describe("browser + babel prompts", function () {
    before(runGenerator({}, [], {browser: true, babel: true}))

    it("should set up package.json install and use babelify", function () {
      assert.JSONFileContent(path.join(this.dir, "package.json"), {
        dependencies: {
          babelify: "^7.2.0"
        },
        browserify: {
          transform: [ "babelify" ]
        }
      })
    })
  })

  describe("mocha prompt", function () {
    before(runGenerator({}, [], {mocha: true}))

    it("should create mocha.opts", function () {
      assert.file(path.join(this.dir, "test", "mocha.opts"))
    });

    it("should create a test suite", function () {
      assert.file(path.join(this.dir, "test", `test-${this.name}.js`))
    });

    it("should import the module under the right name", function () {
      assert.fileContent(
        path.join(this.dir, "test", `test-${this.name}.js`),
        new RegExp('var ' + camelName + ' = require\\("\\.\\./src/' + this.name + '"\\);')
      )
    });

    it("should add chai and mocha devDependencies", function () {
      assert.JSONFileContent(path.join(this.dir, "package.json"), {
        devDependencies: {
          chai: "^3.5.0",
          mocha: "^2.4.5"
        }
      })
    });

    it("should add test command", function () {
      assert.JSONFileContent(path.join(this.dir, "package.json"), {
        scripts: {
          test: "mocha",
        }
      })
    });
  })

  describe("mocha prompt with babel", function () {
    before(runGenerator({}, [], {mocha: true, babel: true}))

    it("should create mocha.opts", function () {
      assert.fileContent(
        path.join(this.dir, "test", "mocha.opts"),
        /--compilers js:babel-register/
      )
    });

    it("should create a test suite", function () {
      assert.file(path.join(this.dir, "test", `test-${this.name}.js`))
    });

    it("should import the module under the right name", function () {
      assert.fileContent(
        path.join(this.dir, "test", `test-${this.name}.js`),
        new RegExp('import ' + camelName + ' from "\\.\\./src/' + this.name + '"')
      )
    });
  })

  describe("karma prompt", function () {
    before(runGenerator({}, [], {mocha: true, karma: true}))

    it("should create karma conf", function () {
      assert.file(path.join(this.dir, "karma.conf.js"))
    });

    it("should add various devDependencies", function () {
      assert.JSONFileContent(path.join(this.dir, "package.json"), {
        devDependencies: {
          "browserify": "^13.0.0",
          "karma": "^0.13.21",
          "karma-browserify": "^5.0.1",
          "karma-firefox-launcher": "^0.1.7",
          "karma-mocha": "^0.2.2",
          "karma-notify-reporter": "^0.1.1",
          "karma-teamcity-reporter": "^0.2.1",
          "watchify": "^3.7.0",
        }
      })
    });

    it("should change the test command", function () {
      assert.JSONFileContent(path.join(this.dir, "package.json"), {
        scripts: {
          test: "karma start",
        }
      })
    });
  })


})
