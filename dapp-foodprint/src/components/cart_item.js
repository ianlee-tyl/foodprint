import React, { Component } from 'react'

class CartItem extends Component {
    constructor(props) {
        super(props)
        // console.log(props)

        this.handleChange = this.handleChange.bind(this)

    }

    handleChange(e){
      
        if (this.props.onChange) {
            this.props.onChange(this.props.itemIndex);
        }
    }
    
    render() {

        return (

            <div className="check_list_item" onClick={this.handleChange}>
                <span className="bowls_num">{this.props.itemNum}</span>
                <div className="check_list_item_holder">
                    <h3>{this.props.itemTitle}</h3>
                    <p>{this.props.itemAddons}</p>
                </div>
                <h4>{this.props.itemPrice + "TWD"}</h4>
                
            </div>
            
            
        );
    }
}

export default CartItem;