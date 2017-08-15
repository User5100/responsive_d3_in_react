import React, { Component } from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
//import { Chart } from './Chart'
import { Home } from './Home'

class App extends Component {
  render () {
		return (
			<MuiThemeProvider>
				<Home />
			</MuiThemeProvider>
		)
	}  
}

export default App