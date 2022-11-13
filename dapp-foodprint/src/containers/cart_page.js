import React, { Component } from 'react';
import { Redirect } from 'react-router';
// import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom'
import { postDataFromServer, dict2urlEncode, getDataFromServer } from '../http_utils.js'
import { setCookie, getCookie, saveValue, getSavedValue } from '../cookie_utils.js'
import { get_cart_item, prepare_order_data } from '../coupon_utils.js'
import { online_or_local } from '../shopping_cart_utils.js'
import { postOrderInfo, setOrderContract, getTronWeb, fetchAllOrders } from '../tron.js'

import { withAlert } from 'react-alert'

import CartItem from '../components/cart_item.js'
import PlasticBagSection from '../components/plastic_bag_section.js'
import EatOrTogoSection from '../components/eat_or_togo_section.js'
// import MemberSection from '../components/member_section.js'
import MoreInfoSection from '../components/more_info_section.js'
import MoneyDisplaySection from '../components/money_display_section.js'

import '../css/main.css';

class CartPage extends Component {

  constructor(props) {
    super(props);

    this.state =  {
                    dataDict: {},
                    itemsKeys: [],
                    itemsTitle: [],
                    itemsPrice: [],
                    itemsAmount: [],
                    itemsAddons: [],
                    deleteMode: false,
                    additionPrice: {"小計:": {"sectionId": "quick_price", "price": 0}, "使用之塑膠袋費用:": {"sectionId": "plastic_bag_fee", "price": 0}, "折扣優惠:": {"sectionId": "coupon_fee", "price": 0}},
                    totalPrice: 0,
                    stayOrTogo: "",
                    switchPageFlag: false,
                    errorPage: false,
                    extraInfo: {"payment_method": getSavedValue("payment_method"), "time_str": getSavedValue("time_str"), "phone_num": getSavedValue("phone_num"), "name": getSavedValue("name"), "delivery_location": getSavedValue("delivery_location"), "deducted_point": "0", "coupon_fee": getSavedValue("coupon_fee"), "member_phone_num": getSavedValue("member_phone_num")}
                  }

  }

  async componentDidMount() {
    if (getCookie("store_id") !== "" && getCookie("cart_id") !== "" && getCookie("device_key") !== "") {
       
      // get tronWeb object 
      getTronWeb(); 
    
      // Wait a while to ensure tronweb object has already injected
      setTimeout(async ()=>{
          // init contract object
          await setOrderContract();
          
          console.log("Begin to obtain the orders information");
          // fetch all books
          const orders = await fetchAllOrders();
          console.log("Orders: "+ orders);

          var itemsKeys = []
          var itemsTitle = []
          var itemsPrice = []
          var itemsAddons = []
          var foodprint = []
          for (var i = 0; i < orders.length; i++) {
            console.log(orders[i])
            itemsKeys.push(i)
            itemsTitle.push(orders[i]["name"])
            itemsPrice.push(orders[i]["price"])
            itemsAddons.push(orders[i]["description"])
            foodprint.push(orders[i]["carbon"])
              
            this.setState({
              itemsKeys: itemsKeys,
              itemsTitle: itemsTitle,
              itemsPrice: itemsPrice,
              foodprint: foodprint,
              itemsAddons: itemsAddons            })
          }
          
      },50);
    }
  }

  eventhandler(index) {
  }

  render() {

        if (getCookie("store_id") === "" || getCookie("device_key") === "" || getCookie("cart_id") === "") {
          return <Redirect push to="/" />;
        }

        return (

          <div id="body">
            <div className="display_layout cart_layout">
              <div className="nav_bar sticky">
                <Link to={"/menuPage"}>
                  <button className="return_btn" >{"<Back"}</button>
                </Link>
              </div>
              <div className="scroll_container cart_layout" id="cart_container">
                <div className="check_list_title">
                  <h2>Foodprint Transactions</h2>

                </div>
                Your wallet address: ({window.tronWeb.defaultAddress.base58})
                <div className="check_list">
                  {this.state.itemsKeys.map((item, index) => <CartItem key={item+index} itemIndex={index} itemNum={1} foodprint={this.state.foodprint[index]} itemTitle={this.state.itemsTitle[index]} itemAddons={this.state.itemsAddons[index]} itemPrice={this.state.itemsPrice[index]} onChange={this.eventhandler}/>)}
                </div>

</div>
            </div>
          </div>
      
        );
  }
}

export default withAlert()(CartPage);
