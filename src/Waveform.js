import React, { Component } from 'react'
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

		this.height = 300 - this.margin.top - this.margin.bottom
		this.width = 300 - this.margin.right - this.margin.left

		this.data = [100, 200, 300, 400]
	}

	componentDidMount () {
		this.svg = d3.select('div')
									.append('svg')
										.attr('height', this.height + this.margin.top + this.margin.bottom)
										.attr('width', this.width + this.margin.left + this.margin.right)

		this.xScale = d3.scaleLinear()
										.domain([0, this.data.length])
										.range([0, this.width])

		this.yScale = d3.scaleLinear()
										.domain([0, d3.max(this.data, d => d)])
										.range([this.height, 0])

		this.xAxis = this.svg
											.append('g')
												.attr('transform', `translate(${this.margin.left}, ${this.height + this.margin.top})`)
												.call(d3.axisBottom(this.xScale))

		this.yAxis = this.svg
											.append('g')
												.attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)
												.call(d3.axisLeft(this.yScale))

		this.svg
					.append('g')
						.attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)
							.selectAll('rect')
							.data(this.data)
							.enter()
							.append('rect')
								.attr('height', d => this.height - this.yScale(d))
								.attr('width', this.width / this.data.length)
								.attr('y', d => this.yScale(d))
								.attr('x', (d, i) => this.xScale(i))
								.style('stroke', 'black')
								.style('stroke-width', 1)
								.style('fill', 'steelblue')
	}
	
	render () {
		return (
			<div>
				Waveform here
			</div>
		)
	}
}