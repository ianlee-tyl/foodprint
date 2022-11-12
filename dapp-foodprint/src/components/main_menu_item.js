import React, { Component } from 'react'
import { Redirect } from 'react-router';
// import { Link } from 'react-router-dom'

import { setCookie, getCookie } from '../cookie_utils.js'
import { preventLongPressMenu } from '../system_utils.js'




class MainMenuItem extends Component {
    constructor(props) {
        super(props)

        this.state = {
            switchPageFlag: false
        }

        this.handleSubmit = this.handleSubmit.bind(this)

        this.img_ref = React.createRef()

        // console.log(process.env.PUBLIC_URL)
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
    
            // console.log(this.props.itemCategory, this.props.itemName, this.props.itemPrice)
    
            newDict["detailInfo"] = {
                                        itemCategory: this.props.itemCategory,
                                        itemName: this.props.itemName,
                                        itemPrice: (this.props.itemPrice).slice(4),
                                        itemPic: this.props.itemPic,
                                        itemDesc: this.props.itemDesc
                                    }
    
            
            setCookie("item", JSON.stringify(newDict), 1)
            // console.log(getCookie("item"))
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
                    <h4 className="doday_menu_price">{this.props.itemPrice}</h4>
                    <h2 className="doday_menu_title">{this.props.itemName}</h2>
                    <h3 className="doday_menu_detail">{this.props.itemDesc}</h3>
                </div>

                <div className={"doday_img_holder"}>
                    <img alt="douhua_pic" ref={this.img_ref} src={this.props.itemPic} className="doday_menu_img" />
                </div>
                
            </button>
        );
    }
}

export default MainMenuItem;