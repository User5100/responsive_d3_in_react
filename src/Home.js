import React, { Component } from 'react'
import AppBar from 'material-ui/AppBar'
import styled from 'styled-components'
import { Observable } from 'rxjs/Observable'
import axios from 'axios'
import 'rxjs/add/observable/interval'
import 'rxjs/add/observable/of'
import 'rxjs/add/operator/take'
import 'rxjs/add/operator/switchMap'

import { Visualisation } from './Visualisation'
import { Player } from './Player'
import { Topics } from './Topics'
import { BASE_URL } from './config'

export class Home extends Component {
	constructor () {
		super()
		this.state = {
			srts: [],
			tags: [],
			dataArray: [],
			data: [],
			isPlaying: false,
			currentTime: 0,
			range: { start: 0, end: 0 }
		}
		this.src = 'https://s3.amazonaws.com/mettavr/dev/VfE_html5.mp4'

		this.renderVisualisation = this.renderVisualisation.bind(this)
		this.getData = this.getData.bind(this)
		this.setUpVisualisation = this.setUpVisualisation.bind(this)
		this.handlePlayClick = this.handlePlayClick.bind(this)
		this.handlePauseClick = this.handlePauseClick.bind(this)
		this.fetchData = this.fetchData.bind(this)
		this.handleAudioTimeUpdate = this.handleAudioTimeUpdate.bind(this)
		this.handleSetCurrentTime = this.handleSetCurrentTime.bind(this)
		this.setRange = this.setRange.bind(this)
	}

	setRange (range) {
		this.setState({ range: range })
	}

	handleSetCurrentTime (timestamp) {
		this.audio.currentTime = (timestamp < 5)? 0 : (timestamp - 5) 
	}

	handleAudioTimeUpdate () {
    this.setState({ currentTime: +(this.audio.currentTime.toFixed(2)) })
  }

	fetchData () {
		axios.get(BASE_URL)
					 .then(res => {					 
						 return res.data
					 })
           .then(data => {
							this.setState({ srts: data.SRTs, 
                              tags: data.tags.tags
													 })
					 })
					 .then(() => {
						 console.log(this.state.srts)
					 })
	}

	handlePlayClick () {
    this.setState({ isPlaying: true })
    this.audio.play()
  }

  handlePauseClick () {
    this.setState({ isPlaying: false })
    this.audio.pause()
  }

	getData () {
		fetch(this.src)
			.then(res => res.blob())
			.then(blob => {	
				this.audio.src = URL.createObjectURL(blob)
				this.setUpVisualisation()		
			})
	}

	setUpVisualisation () {
		this.audioCtx = new (window.AudioContext || window.webkitAudioContext)()
		this.analyser = this.audioCtx.createAnalyser()
		//Create a MediaElementAudioSourceNode
		//Feed the HTMLMediaElement into it
		this.source = this.audioCtx.createMediaElementSource(this.audio)

		//Connect source to analyser
		this.source.connect(this.analyser)

		this.source.connect(this.audioCtx.destination)

		//Create a new array to recieve the data
		this.analyser.fftSize = 2048
		this.bufferLength = this.analyser.frequencyBinCount
		this.dataArray = new Uint8Array(this.bufferLength)

		//Grab time domain data and copy it to array
		this.analyser.getByteTimeDomainData(this.dataArray)

		this.renderVisualisation()
	}

	renderVisualisation () {
		requestAnimationFrame(this.renderVisualisation)

		//Copy data to array
		this.analyser.getByteFrequencyData(this.dataArray)
		this.setState({ dataArray: this.dataArray })
	}

	componentDidMount () {
		this.getData()
		this.fetchData()

		Observable
			.interval(200)
			.take(20)
			.switchMap(() => {
				let data = []

				for(let i = 0; i <= 4; i++ ) {
					data.push(Math.floor(Math.random() * 400))
				}

				return Observable.of(data)
			})
			.subscribe(data => {
				this.setState({ data: data })
			})
	}

	render () {
		return (
		<div style={{ overflow: 'none' }}>
			<AppBar
				style={styles.nav}
				title="Smart Transcript"
			></AppBar>
				<audio
					ref={audio => this.audio = audio}
					onTimeUpdate={this.handleAudioTimeUpdate}
				/>
			<div 
				className='container'>
				<Topics
					tags={this.state.tags}
					handleClickTag={this.handleSetCurrentTime}
				/>


				<Visualisation
					srts={this.state.srts}
					currentTime={this.state.currentTime}
					dataArray={this.state.dataArray}
					handleClickWord={this.handleSetCurrentTime}
					start={this.state.range.start}
				/>

				<Player
					isPlaying={this.state.isPlaying}
					handlePauseClick={this.handlePauseClick}
					handlePlayClick={this.handlePlayClick}
					setRange={this.setRange}
				/>
			</div>
		</div>
		)
	}
}

const styles = {
	nav: {
 		backgroundColor: '#2A2D34',
  	height: '60px'
	}
}