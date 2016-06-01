/*global describe, it*/

import chai from "chai"
import <%= camelName %> from "../src/<%= name %>"

const expect = chai.expect

describe("<%= name %>", function () {
  it("should definitely have more than one test", function () {
    expect("this single silly test").to.equal("lots of useful tests")
  })
})
