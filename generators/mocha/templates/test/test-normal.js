/*global describe, it*/

var chai = require("chai")
var <%= camelName %> = require("../src/<%= name %>")

var expect = chai.expect

describe("<%= name %>", function () {
  it("should definitely have more than one test", function () {
    expect("this single silly test").to.equal("lots of useful tests")
  })
})
