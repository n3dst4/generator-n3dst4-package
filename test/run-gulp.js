var os = require("os")
var symlinkSync = require("fs").symlinkSync
var execSync = require("child_process").execSync
var path = require("path")

module.exports = function (timeout) {
  // symlink node_modules in the generated folder to node_modules in the
  // generator so save time on "npm install"
  // http://superuser.com/questions/104845/permission-to-make-symbolic-links-in-windows-7
  // https://github.com/nodejs/node-v0.x-archive/issues/6342

  this.timeout(timeout)

  try {
    symlinkSync(
      path.join(__dirname, "..", "node_modules"),
      path.join(this.dir, "node_modules")
    )
  }
  catch (err) {
    throw new Error(
      "symlinking node_module failed. If you are on Windows, you may " +
      "need to re-run these tests with elevated (administrator) " +
      "permissions. See " +
      "https://github.com/nodejs/node-v0.x-archive/issues/6342 " +
      "(it's a Windows \"feature\".)")
  }

  // run gulp!
  try {
    var scriptName = os.platform() === "win32" ? "gulp.cmd" : "gulp"
    execSync(path.join(__dirname, "..", "node_modules", ".bin", scriptName), {
      cwd: this.dir,
      timeout: timeout
    })
  }
  catch (err) {
    global["console"].error("vvv ERROR  vvv")
    global["console"].error(err.stdout? err.stdout.toString(): err)
    global["console"].error("^^^ ERROR  ^^^")
    throw err
  }

}
