import React, { Component } from 'react'
import { Redirect } from 'react-router';
// import { Link } from 'react-router-dom'

import { setCookie, getCookie } from '../cookie_utils.js'
import { preventLongPressMenu } from '../system_utils.js'




class MainMenuPromotionItem extends Component {
    constructor(props) {
        super(props)

        this.state = {
            switchPageFlag: false
        }

        this.handleSubmit = this.handleSubmit.bind(this)

        this.img_ref = React.createRef()
    }

    componentDidMount() {
        preventLongPressMenu(this.img_ref.current)
    }
    
    handleSubmit() {

        if (this.props.itemAvail) {
            if (!getCookie('item') || typeof JSON.parse(getCookie('item')) !== "object") {
              setCookie("item", JSON.stringify({}), 1)
              // console.log("newDict", getCookie('item'))
            }
    
            
            var newDict = JSON.parse(getCookie('item'))
    
            newDict["detailInfo"] = {
                                        itemCategory: this.props.itemCategory,
                                        itemName: this.props.itemName,
                                        itemPrice: (this.props.itemAfterPrice).slice(4),
                                        itemPic: this.props.itemPic,
                                        itemDesc: this.props.itemDesc
                                    }
    
            
            setCookie("item", JSON.stringify(newDict), 1)
            setCookie("promotion_key", this.props.itemPromotionKey, 1)
        }

        this.setState({
            switchPageFlag: true
        })


    }



    render() {

        if (this.props.itemAvail && this.state.switchPageFlag) {
          return <Redirect push to="/detailPage" />;
        }

        return (
            <button className={this.props.itemAvail ? "doday_menu_item" : "doday_menu_item doday_not_available"} onClick={ this.handleSubmit }>
                
                <div className="doday_menu_info">
                    <h2 className="promotionTitle">{this.props.itemPromotionTitle}</h2>
                    <h2 className="doday_menu_title">{this.props.itemName}</h2>
                    <h3 className="doday_menu_detail">{this.props.itemDesc}</h3>
                    <div className="promotionPrice">
                        <h4 className="doday_before_price">{this.props.itemPrice}</h4>
                        <h4 className="doday_after_price">{this.props.itemAfterPrice}</h4>
                    </div>
                </div>

                <div className={"doday_img_holder"}>
                    <img alt="douhua_pic" ref={this.img_ref} src={this.props.itemPic} className="doday_menu_img" />
                </div>
                
            </button>
        );
    }
}

export default MainMenuPromotionItem;