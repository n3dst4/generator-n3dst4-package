/*global describe, it*/
import React from "react"
import chai from "chai"
import <%= pascalCase %> from "../src/<%= camelCase %>"
import { shallow } from "enzyme"
import chaiEnzyme from "chai-enzyme"

chai.use(chaiEnzyme())

const expect = chai.expect

describe("<%= camelCase %>", function () {
  it("should definitely have more than one test", function () {
    const wrapper = shallow(<<%= pascalCase %> />)
    expect(wrapper).to.have.text("this hasn't been filled in yet")
  })
})
