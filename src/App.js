import React, { Component } from 'react'
import { Chart } from './Chart'

class App extends Component {
  render () {
		return (
			<div>
				<div>Hello, world</div>
				<div style={{ width: '80%', height: '80%' }}>
					<Chart />
				</div>
			</div>
		)
	}  
}

export default App