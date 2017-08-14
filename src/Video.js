import React, { Component } from 'react'
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/observable/interval'
import 'rxjs/add/observable/of'
import 'rxjs/add/operator/take'
import 'rxjs/add/operator/switchMap'

import { Visualisation } from './Visualisation'

export class Video extends Component {
	constructor () {
		super()
		this.state = {
			dataArray: [],
			data: []
		}
		this.src = 'https://s3.amazonaws.com/mettavr/dev/VfE_html5.mp4'

		this.renderVisualisation = this.renderVisualisation.bind(this)
		this.getData = this.getData.bind(this)
		this.setUpVisualisation = this.setUpVisualisation.bind(this)
	}

	getData () {
		fetch(this.src)
			.then(res => res.blob())
			.then(blob => {	
				this.video.src = URL.createObjectURL(blob)
				this.setUpVisualisation()		
			})
	}

	setUpVisualisation () {
		this.audioCtx = new (window.AudioContext || window.webkitAudioContext)()
		this.analyser = this.audioCtx.createAnalyser()
		//Create a MediaElementAudioSourceNode
		//Feed the HTMLMediaElement into it
		this.source = this.audioCtx.createMediaElementSource(this.video)

		//Connect source to analyser
		this.source.connect(this.analyser)

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
			<div>
				<video
					ref={video => this.video = video}
					controls='controls'
				/>
				<Visualisation
					dataArray={this.state.dataArray}
					data={this.state.data}
				/>
			</div>
		)
	}
}