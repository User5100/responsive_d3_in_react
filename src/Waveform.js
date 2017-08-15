import React, { Component } from 'react'
import Paper from 'material-ui/Paper'
import * as d3 from 'd3'

export class Waveform extends Component {
  constructor () {
		super()

		this.margin = {
			top: 0,
			right: 0,
			bottom: 0,
			left: 0,
		}

		this.height = 30 - this.margin.top - this.margin.bottom
		this.width = 800 - this.margin.right - this.margin.left
		this.wave_uri = 'http://public.jm3.net/d3/geiger.json'
		this.maxPoints = 8000
		
		this.svgRender = this.svgRender.bind(this)
		this.responsivefy = this.responsivefy.bind(this)
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
										.call(this.responsivefy)

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

		// Create brush zoom feature
    this.brush = d3.brushX(this.xScale)
                   .on('brush', brushed.bind(this))

    // Create brush element
    this.svg.append('g')
							.attr('class', 'brush')
							.attr('height', 10)
							.call(this.brush)
							
		//Resize the brush height
    d3.selectAll('.selection')
      .style('height', 32)
      .attr('transform', `translate(0, 0)`)
      .attr('stroke', 'none')
      //.attr('fill', '#52C1CC')
      .attr('opacity', 1.0);

    function brushed () {
      let [start, end] = d3.event.selection // [ start: number, end: number ]
			var targetWidth = parseInt(d3.select(this.svg.node().parentNode).style('width'))

      start = parseFloat(start / targetWidth)
      end = parseFloat(end / targetWidth)
      this.props.setRange({ start: start, end: end })
    }																									
	}

	responsivefy(svg) {
		
		var height = parseInt(svg.style('width'))
		var width = parseInt(svg.style('height'))
		var aspect = width / height

		d3.select(window).on('resize', () => resize())
		//add viewBox and preserveAspectRatio properties
		//and call resize so that svg resizes on initial page load

		svg
			.attr('viewBox', `0 0 ${this.width} ${this.height}`)
			.attr('preserveAspectRatio', 'xMinYMid')
			.call(resize)

		function resize() {

			var targetWidth = parseInt(d3.select(svg.node().parentNode).style('width'))
			svg.attr('width', targetWidth)
			svg.attr('height', Math.round(targetWidth / aspect))
		}
	} 
	
	render () {
		return (
			<div
				className='waveform-container'>
			</div>
		)
	}
}