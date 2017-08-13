import React, { Component } from 'react'
import * as d3 from 'd3'

export class Chart extends Component {
	constructor () {
		super()

		this.margin = {
			top: 10,
			left: 40,
			right: 50,
			bottom: 50
		}

		this.height = 200 - this.margin.top - this.margin.bottom
		this.width =  200 - this.margin.left - this.margin.right

		this.data = [100, 200, 300, 400]

		this.responsivefy = this.responsivefy.bind(this)

	}

	componentDidMount () {

		this.svg = d3.select(this.container)
									.append('svg')
										.attr('height', this.height)
										.attr('width', this.width)
										.call(this.responsivefy)

		this.xScale = d3.scaleLinear()
										.domain([0, this.data.length])
										.range([0, this.width])

		this.yScale = d3.scaleLinear()
										.domain([0, d3.max(this.data, d => d)])
										.range([this.height, 0])

		this.xAxis = this.svg
											.append('g')
									 		.attr('transform', `translate(${this.margin.left}, ${this.height})`)
									 		.call(d3.axisBottom(this.xScale))

		this.yAxis = this.svg
											.append('g')
									 		.attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)
											.call(d3.axisLeft(this.yScale))
														
		this.svg
					.append('g')
						.attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)
						.attr('height', this.height)
						.attr('width', this.width)
						.selectAll('rect')
						.data(this.data)
						.enter()
						.append('rect')
							.attr('x', (d, i) => this.xScale(i))
							.attr('y', d => this.yScale(d))
							.attr('height', d => this.height - this.yScale(d))
							.attr('width', this.width / this.data.length)
							.attr('fill', 'lightblue')
							.attr('stroke', 'black')
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
					ref={ container => this.container = container }>
				</div>
		)
	}
}