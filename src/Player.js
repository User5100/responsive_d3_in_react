import React, { Component } from 'react'
import AvPlayCircleOutline from 'material-ui/svg-icons/av/play-circle-outline'
import AvPauseCircleOutline from 'material-ui/svg-icons/av/pause-circle-outline'
import Paper from 'material-ui/Paper';

import { Waveform } from './Waveform'

export class Player extends Component {
	constructor () {
		super()

		this.handlePlayClick = this.handlePlayClick.bind(this)
    this.handlePauseClick = this.handlePauseClick.bind(this)
	}

	handlePlayClick () {
    this.props.handlePlayClick()
  }

  handlePauseClick () {
    this.props.handlePauseClick()
  }

	render () {
		let button

    if (!this.props.isPlaying) {
      button = <AvPlayCircleOutline onClick={this.handlePlayClick} style={styles.button} />
    } else {
      button = <AvPauseCircleOutline onClick={this.handlePauseClick} style={styles.button} />
    }


		return (
			<div
				className='player-container'>
				<Paper style={styles.paper}zDepth={1} >
					<div
					className='player-container'>
						<div
							className='button-container'>
							{button}
						</div>
						<Waveform />
					</div>
				</Paper>
			</div>
		)
	}
}

const styles = {
	button: {
    cursor: 'pointer',
    color: '#393D48',
    fontSize: '84px'
	},
	paper: {
		height: '100%',
		width: '100%'
	}
}