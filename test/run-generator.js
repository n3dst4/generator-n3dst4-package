/*eslint-env node, mocha, es6 */
var helpers = require('yeoman-test')
var os = require("os")
var path = require("path")
var crypto = require("crypto")

var studlyName = "FtangFtangOle.BiscuitBarrel"
var kebabName = "ftang-ftang-ole-biscuit-barrel"
var camelName = "ftangFtangOleBiscuitBarrel"
var namespacedName = `@luxuryyacht/${kebabName}`

module.exports = function runGenerator (opts, args, prompts) {
  return function (done) {
    this.timeout(5000)
    var tmpDir = path.join(os.tmpdir(), crypto.randomBytes(20).toString('hex'), kebabName)
    return helpers.run(path.join( __dirname, '../generators/app'))
      .withOptions(opts || {})
      .withArguments(args || [])
      .withPrompts(prompts || {})
      .withLocalConfig({})
      .inDir(tmpDir, function (dir) {
        this.dir = dir
        this.name = path.basename(dir)
      }.bind(this))
      .on("end", done)
      .on("error", console.error)
  }
}

module.exports.studlyName = studlyName
module.exports.kebabName = kebabName
module.exports.camelName = camelName
module.exports.namespacedName = namespacedName
