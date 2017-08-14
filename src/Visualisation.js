import React, { Component } from 'react'
import * as d3 from 'd3'

export class Visualisation extends Component {
  constructor () {
		super()

		this.renderChart = this.renderChart.bind(this)

		this.margin = { top: 10,
										right: 20,
										bottom: 20,
										left: 40
									}

		this.height = 400 - this.margin.top - this.margin.bottom
		this.width = 400 - this.margin.left - this.margin.right
		this.data = [100, 200, 300, 400]
	}

	renderChart () {
		
		this.xScale = d3.scaleLinear()
										.domain([0, this.props.dataArray.length])
										.range([0, this.width])

		this.yScale = d3.scaleLinear()
										.domain([0, d3.max(this.props.dataArray, d => d)])
										.range([this.height, 0])

		this.xAxis = this.svg
											.append('g')
											.attr('transform', `translate(${this.margin.left}, ${this.height + this.margin.top})`)
										 	.call(d3.axisBottom(this.xScale))

		this.yAxis = this.svg
											.append('g')
											.attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)
											 .call(d3.axisLeft(this.yScale))
		
		//Update
		this.update = this.svg
											.append('g')
												.attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)
												.selectAll('rect')
												.data(this.props.dataArray, d => d)

		//Enter
		this.enter = this.update
											.enter()
											.append('rect')
												.attr('fill', 'lightblue')
												.attr('stroke', 'black')
												.attr('stroke-width', 1)
												.attr('width', this.width / this.props.dataArray.length)

		//Exit										
		this.update.exit().remove()
		console.log(this.update.exit().remove())

		//Enter + Update
		this.enter.merge(this.update)
							.attr('x', (d, i) => this.xScale(i))
							.attr('y', d => this.yScale(d))
							.attr('height', d => this.height - this.yScale(d))
													
	}

	componentDidMount () {
		this.svg = d3.select('div')
									.append('svg')
										.attr('height', this.height + this.margin.top + this.margin.bottom)
										.attr('width', this.width + this.margin.left + this.margin.right)
		
	}

	shouldComponentUpdate() {
		console.log('shouldComponentUpdate', this.props.dataArray)
		if(this.props.dataArray) {
			this.renderChart()
		}
	
		return false
	}
	
	render () {
		return (
			<div>
			</div>
		)
	}
}