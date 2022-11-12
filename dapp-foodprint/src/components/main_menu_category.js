import React, { Component } from 'react';

import MainMenuItem from './main_menu_item.js'
import MainMenuPromotionItem from './main_menu_promotion_item.js'


class MainMenuCategory extends Component {
    // constructor(props) {
    //     super(props)
    // }
    
    render() {

        if (this.props.titleName === "優惠特區") {
            return (
                <div className="category">
                  <h1 className="category_name">{this.props.titleName}</h1>
                  {this.props.itemList.map((item, index) => <MainMenuPromotionItem key={index} itemAvail={this.props.itemAvail[index]} itemCategory={this.props.titleName} itemPromotionKey={item[6]} itemPromotionTitle={item[5]} itemName={item[0]} itemDesc={item[1]} itemPrice={(item[2]).toString()} itemAfterPrice={(item[4]).toString()} itemPic={item[3]} />)}
                </div>
            );
        }

        else {
            return (
                <div className="category">
                  <h1 className="category_name">{this.props.titleName}</h1>
                  {this.props.itemList.map((item, index) => <MainMenuItem key={index} itemAvail={this.props.itemAvail[index]} itemCategory={this.props.titleName} itemName={item[0]} itemDesc={item[1]} itemPrice={(item[2]).toString()} itemPic={item[3]} />)}
                </div>
            );
        }
    }
}

export default MainMenuCategory;