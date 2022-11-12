import React, { Component } from 'react'

class Coupon extends Component {
    constructor(props) {
        super(props)
        // console.log(props)

        this.useCoupon = this.useCoupon.bind(this)

    }

    useCoupon(e) {
        if (this.props.eventHandler) {
            this.props.eventHandler(this.props.title, this.props.itemKey, this.props.content)
        }
    }

    
    render() {

        return (
            <button className={this.props.selected_coupon ? "more_info coupon_item selected_coupon" : "more_info coupon_item"} onClick={this.useCoupon}>
                <h5 className="float_left">{this.props.title}</h5>
                <h5 className="float_right">{"-" + this.props.content + "點"}</h5>
            </button>
            
            
        );
    }
}

export default Coupon;