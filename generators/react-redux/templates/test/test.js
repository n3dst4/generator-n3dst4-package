/*global describe, it*/
import React from "react"
import chai from "chai"
import sinonChai from "sinon-chai"
import App from "../src/components/app"
import chaiEnzyme from "chai-enzyme"
import { shallow } from "enzyme"
import { List as IList } from "immutable"

chai.use(chaiEnzyme())

chai.use(sinonChai)
const expect = chai.expect

describe("App", function () {
  it("should definitely have more than one test", function () {
    const message = "Beano"
    const wrapper = shallow(
      <App
        messages={IList([message])}
        addMessage={()=>{}}
      />
    )
    expect(wrapper).to.contain.text(message)
  })
})
