import React, { Component } from 'react'

class PriceLabel extends Component {
    // constructor(props) {
    //     super(props)

    // }
    
    render() {

        return (
            <div className={this.props.single_class}>
                <label className="price_tag">{this.props.content}</label>
                <h5>NT$<span>{this.props.price}</span></h5>
            </div>
            
            
        );
    }
}

export default PriceLabel;