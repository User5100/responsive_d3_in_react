import React, { Component } from 'react'
import Paper from 'material-ui/Paper';
import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader'

export class Topics extends Component {
	constructor () {
		super()

		this.handleClickTag = this.handleClickTag.bind(this)
	}

	handleClickTag (timestamp) {
		this.props.handleClickTag(timestamp)
	}

	render () {

		let listItem = (tagObj, index) => {
			if(tagObj.position.length > 1) {
				return (	
					<ListItem
						key={index}
						onClick={() => this.handleClickTag(tagObj.position[0].timestamp)}
						primaryText={tagObj.tag}
						nestedItems={tagObj.position
							.filter((position, i) => i > 0)
							.map((p, i) => {
							return (
								<ListItem
									key={i}
									onClick={() => this.handleClickTag(p.timestamp)}
									primaryText={i+1}
								/>
							)
						})}
					/>			
				)
			} else {
				return (
					<ListItem 
						key={index}
						onClick={() => this.handleClickTag(tagObj.position[0].timestamp)}
						primaryText={tagObj.tag}
					/>
				)
			}
		}

		return (
			<div
				className='topics-container'>
				<Paper style={styles.paper}zDepth={1}
					className='topics-paper' >
					<List>
						<Subheader>Topics</Subheader>
						{this.props.tags.map((tagObj, index) => {
							return listItem(tagObj, index)
						})}
					</List>
				</Paper>
				
			</div>
		)
	}
}

const styles = {
	paper: {
		height: '100%',
	}
}