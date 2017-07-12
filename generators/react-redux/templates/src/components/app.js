import React from "react"
import Radium from "radium"
import ImmutablePropTypes from "react-immutable-proptypes"
import PropTypes from "prop-types"

class App extends React.PureComponent {

  constructor () {
    super()
    this.state = {text: ""}
    ;["onInputChange", "onButtonClick"].forEach(method => {
      this[method] = this[method].bind(this)
    })
  }

  onInputChange (event) {
    this.setState({text: event.target.value})
  }

  onButtonClick (event) {
    this.props.addMessage(this.state.text)
    this.setState({text: ""})
  }

  render () {
    return (<div>
      <ul>
        {this.props.messages.map((m, i) => <li key={i}>{m}</li>)}
      </ul>
      <p>
        <input value={this.state.text} onChange={this.onInputChange} />
        <button onClick={this.onButtonClick}>Add</button>
      </p>
    </div>)
  }
}

App.propTypes = {
  messages: ImmutablePropTypes.listOf(PropTypes.string).isRequired,
  addMessage: PropTypes.func
}

App.defaultProps = {
  styles: {},
  username: "",
}

export default Radium(App)
