import { connect } from "react-redux";
import { addMessage } from "../actions";
import App from "../components/app";

const mapStateToProps = state => ({
	messages: state.get("messages"),
})

const mapDispatchToProps = dispatch => ({
	addMessage: message => dispatch(addMessage(message))
})

const AppContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(App)

export default AppContainer
