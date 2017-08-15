import React, { Component } from 'react'
import Paper from 'material-ui/Paper'
import * as d3 from 'd3'

export class Waveform extends Component {
  constructor () {
		super()

		this.margin = {
			top: 20,
			right: 30,
			bottom: 30,
			left: 30,
		}

		this.height = 120 - this.margin.top - this.margin.bottom
		this.width = 1200 - this.margin.right - this.margin.left
		this.wave_uri = 'http://public.jm3.net/d3/geiger.json'
		this.maxPoints = 6000
		
		this.svgRender = this.svgRender.bind(this)
	}

	componentDidMount () {
		
		d3.json(this.wave_uri, (error, json) => {
      this.wave_json = json.data.slice(1, this.maxPoints)
      this.svgRender(this.wave_json)
    })							
	}

	svgRender (data) {
		this.rectWidth = this.width / this.maxPoints
    this.maxHeight = d3.max(data, d => d)

		this.svg = d3.select('.waveform-container')
									.append('svg')
										.attr('height', this.height + this.margin.top + this.margin.bottom)
										.attr('width', this.width + this.margin.left + this.margin.right)

		this.xScale = d3.scaleLinear()
										.domain([0, d3.max(data, (d, i) => i)])
										.range([0, this.width])

		this.yScale = d3.scaleLinear()
										.domain([-this.maxHeight, this.maxHeight])
										.range([this.height, -this.height])
		
		this.update = this.svg
											.append('g')
											.attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)
											.selectAll('rect')
											.data(data, d => d)

		this.enter = this.update.enter()
														.append('rect')
															.style('fill', '#E5D365')

		this.enter.merge(this.update)
							.attr('x', (d, i) => this.xScale(i))
							.attr('y', d => this.height - Math.abs(this.yScale(d) / 2) - (this.height / 2))
							.attr('height', d => Math.abs(this.yScale(d)))
							.attr('width', this.width / data.length)
																									
	}
	
	render () {
		return (
			<div
				className='waveform-container'>
			</div>
		)
	}
}