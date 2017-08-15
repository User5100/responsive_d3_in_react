import React, { Component } from 'react'
import * as d3 from 'd3'
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider'
import Subheader from 'material-ui/Subheader'

export class Visualisation extends Component {
  constructor () {
		super()

		this.renderChart = this.renderChart.bind(this)
		this.handleClickWord = this.handleClickWord.bind(this)

		this.margin = { top: 10,
										right: 20,
										bottom: 20,
										left: 0
									}

		this.height = 80 - this.margin.top - this.margin.bottom
		this.width = 1100 - this.margin.left - this.margin.right
	}

	handleClickWord (timestamp) {	
		this.props.handleClickWord(timestamp)
	}

	renderChart () {

		//Update
		this.update = this.svg
											.attr('class', 'win-amp')
											.append('g')
												.attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)
												.selectAll('rect')
												.data(this.props.dataArray, (d, i) => d)

		//Exit										
		this.svg.selectAll('rect')
						.data(this.props.dataArray)
						.exit()
						.remove()

		//Enter
		this.enter = this.update
											.enter()
											.append('rect')
												.attr('fill', '#89D4DF')
											
		//Enter + Update
		this.enter.merge(this.update)
							.attr('width', this.width / 52)
							.attr('x', (d, i) => this.xScale(i))
							.attr('y', d => this.height - this.yScale(d))
							//.transition(this.t)
							.attr('height', d => this.yScale(d))												
	}

	componentDidMount () {
		
		this.svg = d3.select('.realtime-visual-container')
									.append('svg')
										.attr('transform', `translate(${this.margin.left, 0})`)
										.attr('height', this.height + this.margin.top + this.margin.bottom)
										.attr('width', this.width + this.margin.left + this.margin.right)
		
		this.t = d3
							.transition()
							.duration(0)	
	}

	shouldComponentUpdate() {
		//console.log(this.props.start)
		if(this.paper) {
			//this.paper.scrollTop = this.props.start * this.paper.scrollTop.height		
			//console.log('paper: ', this.paper)
		}
	
		this.xScale = d3.scaleLinear()
										.domain([50, 100])
										.range([0, this.width])

		this.yScale = d3.scaleLinear()
										.domain([300, 0])
										.range([this.height, 0])

		if(this.props.dataArray) {
			this.renderChart()
		}
	
		return true
	}
	
	render () {

		let srts = this.props.srts
		let currentTime = this.props.currentTime

		return (
			<div 
				className='transcript-container noselect'>
				<Paper
					ref={paper => this.paper = paper}
					style={styles.paper}zDepth={1}
					className='transcript-paper'>

				<div
					className='realtime-visual-container noselect'>
				</div>
				<Divider />	
					{srts.map((segment, index) => {
							let _segment = segment
							return (
								<div 
									className='transcript-words'
									key={index}>
									<Subheader>{segment.words[0].speakerLabel}</Subheader>
									{segment.words.map((wordObject, i) => {
											return (
												<span
													onClick={() => this.handleClickWord(wordObject.timestamp)}
													style={styles.word}
													className={wordObject.timestamp <= currentTime && currentTime <= (_segment.words[i+1]? _segment.words[i+1].timestamp : (wordObject.timestamp + wordObject.length))?  'highlight' : ''}
													key={i}>
													{wordObject.word} </span>
											)
										})
									}			
								</div>
							)	
					})}
				</Paper>
			</div>
		)
	}
}

const styles = {
	paper: {
		height: '100%',
		width: '100%'
	},
	word: {
		transition: 'text-decoration 0.2s',
		cursor: 'pointer'
	}
}