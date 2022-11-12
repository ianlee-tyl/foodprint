import React, { Component } from 'react'

import PriceLabel from '../components/price_label.js'

class MoneyDisplaySection extends Component {
    constructor(props) {
        super(props)
        this.state = {
          single_class: "price",
          sectionInfo: this.props.sectionInfo
        }
        // console.log(props, this.state)

    }
    
    render() {

        return (
            <div className="total_price">
              {Object.keys(this.state.sectionInfo).map((item, index) => <PriceLabel key={item+index} label_id={this.state.sectionInfo[item]["sectionId"]} single_class={this.state.single_class} price={this.state.sectionInfo[item]["price"]} content={item} />)}
            </div>
            
            
        );
    }
}

export default MoneyDisplaySection;