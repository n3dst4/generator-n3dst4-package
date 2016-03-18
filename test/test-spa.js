/*eslint-env node, mocha */
var runGenerator = require("./run-generator")
var assert = require('yeoman-assert')
var path = require("path")

describe("spa generator", function () {
  before(runGenerator({}, [], { spa: true }))

  // * html
  it.skip("should create an html folder with a template page in it", function () {
    assert.fileContent(path.join(this.dir, "package.json"), /^<!DOCTYPE html>$/)
  });

  // * stylesheets
  it.skip("should create a stylesheets folder with a LESS file in it", function () {
  });

  // * npm start to run test watch + browser-sync + watchify
  it.skip("should have an npm start command to run in browser", function () {
  });

  // * gulp
  describe("gulpfile", function () {
    it.skip("should exist", function () {
    });

    //     * build html
    it.skip("should build html into output folder", function () {
    });

    //     * build stylesheets
    it.skip("should build LESS into output folder", function () {
    });

    //     * build browserified scripts
    it.skip("should build scripts into output folder", function () {
    });

    // * browser-sync mode
    it.skip("should have a browser-sync mode", function () {
    });
  })
})
