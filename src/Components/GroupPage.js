import React, { Component } from 'react';

class GroupPage extends Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
	}

	render() {
		console.log(this.props.match.params);
		return (
	<div>
		<h1>GroupPage Page </h1>
			</div>
		);
	}
}
export default GroupPage;