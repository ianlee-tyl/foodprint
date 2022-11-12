import React, { Component } from 'react'

class DisplayInfo extends Component {
    constructor(props) {
        super(props)
        // console.log(props)

    }
    
    render() {

        return (
            <div className="more_info">
                <h5 className="float_left">{this.props.title}</h5>
                <h5 className="float_right">{this.props.content}</h5>
            </div>
            
            
        );
    }
}

export default DisplayInfo;