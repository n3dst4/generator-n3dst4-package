var generators = require('yeoman-generator');

module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments);
  },

  initializing: function () {

  },

  prompting: function () {
    var done = this.async();
    this.prompt([{
        type: "input",
        name: "potato",
        message: "What potato",
        default: "roast"
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
    // TODO: add shebang line
    // TODO: add bin and preferGlobal to package.json
  },

  conflicts: function () {

  },

  install: function () {

  },

  end: function () {

  },



});
