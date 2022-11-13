import React, { Component } from 'react'

class CartItem extends Component {
    constructor(props) {
        super(props)
        // console.log(props)
    }

    
    render() {

        return (

            <div className="check_list_item">
                <div className="check_list_item_holder">
                    <h3>{this.props.itemTitle}</h3>
                    <p>{this.props.itemAddons}</p>
                </div>
                <h4>{this.props.itemPrice + "USD"}</h4>
                <h4 style={{color: "green", fontSize: "80%"}}>{"   "+this.props.foodprint + " kg CO2 / Cal"}</h4>
            </div>
            
            
        );
    }
}

export default CartItem;