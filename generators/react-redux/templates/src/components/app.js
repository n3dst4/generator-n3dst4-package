import React, { PropTypes } from "react"
import Radium from "radium"
import ImmutablePropTypes from "react-immutable-proptypes"
import pureRenderMixin from "react-addons-pure-render-mixin"

export default Radium(React.createClass({

  displayName: "App",

  mixins: [pureRenderMixin],

  propTypes: {
      messages: ImmutablePropTypes.listOf(PropTypes.string).isRequired,
      addMessage: PropTypes.func
  },

  getInitialState () {
    return {text: ""}
  },

  onInputChange (event) {
    this.setState({text: event.target.value})
  },

  onButtonClick (event) {
    this.props.addMessage(this.state.text)
    this.setState({text: ""})
  },

  render () {
    return <div>
      <ul>
        {this.props.messages.map(m => <li>{m}</li>)}
      </ul>
      <p>
        <input value={this.state.text} onChange={this.onInputChange} />
        <button onClick={this.onButtonClick}>Add</button>
      </p>
    </div>
  }
}))
