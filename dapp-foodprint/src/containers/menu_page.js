import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import MainMenuCategory from "../components/main_menu_category.js"

import '../css/main.css';
import '../css/alert.css';
import { getDataFromServer, dict2urlEncode } from '../http_utils.js'
import { setCookie, getCookie } from '../cookie_utils.js'
// import { Confirm } from '../alert_utils.js'

class MenuPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      item: [[
      ["Classic Burger", "The original burger starts with a 100% pure beef patty seasoned with just a pinch of salt", "$ 8.99", '/image/hamburger.png', "9.0 kg CO2"
      ],
      ["Poke Bowl", "This everything-in-a-bowl rainbow poke bowl has seared tuna, crab sushi salad, and Japanese scrambled egg. Eat the rainbow!", "$ 12.99", '/image/bowl.jpeg', "3.6 kg CO2"
      ]], [
      ["Salad", "This simple green salad is light, refreshing, and delicious!", "$ 5.99", '/image/salad.jpeg', "2.0 kg CO2"
      ],
      ["Fruit Salad", "The best ever fruit salad coated in a simple fruity dressing. Perfect for potlucks, summer parties, or a side dish to your meals!", "$ 7.99", '/image/fruit_salad.jpeg', "1.0 kg CO2"
      ]], [["Parfait", "This Greek Yogurt Parfait recipe combines creamy Greek yogurt, fresh berries, and crunchy granola to create a simple grab-and-go breakfast option for busy mornings.", "$ 10.99", '/image/parfait.jpeg', "1.3 kg CO2"
      ],
      ["Coffee", "Coffee is a drink prepared from roasted coffee beans.", "$ 5.99", '/image/coffee.jpeg', "1.7 kg CO2"
      ]]],
      title: ["Main", "Sides", "Dessert & Beverages"],
      avail: [[true, true], [true, true], [true, true]],
      errorPage: false,
      store_img: process.env.PUBLIC_URL + "/image/doday_store.png"
    };

    this.cancel_order = this.cancel_order.bind(this)
    // this.deleteItemFromPromotionList = this.deleteItemFromPromotionList.bind(this)

    this.store_title = React.createRef();
    this.store_address = React.createRef();
    this.store_phone = React.createRef();
    this.store_avail = React.createRef();
    this.store_time = React.createRef();
  }

  componentDidMount() {

    if (getCookie("store_id") !== "" && getCookie("device_key") !== "" && getCookie("cart_id") !== "") {

      if (getCookie("store_id") === "DDC") {
        this.setState({
          store_img: process.env.PUBLIC_URL + "/image/ddc_store.jpg"
        })
      }
      else if (getCookie("store_id") === "DDA") {
        this.setState({
          store_img: process.env.PUBLIC_URL + "/image/doday-dda.jpg"
        })
      }

      var price = getCookie("itemsTotalPrice")

      if (price === "") {
        price = 0
      }

      setCookie("itemsTotalPrice", price, 1)
      this.setState({
        price: this.state.price
      })

      // var url = process.env.REACT_APP_SERVER_URL

      // var request_data_1 = {
      //   "service": "menu",
      //   "operation": "get_store_info",
      //   "store_id": getCookie("store_id")
      // }

      // var request_str_1 = dict2urlEncode(request_data_1)

      // getDataFromServer(url + '?' + request_str_1)
      //   .then((result) => {

      //     if (result["indicator"]) {
      //       setCookie("store_name", result["store_name"], 1)
      //       setCookie("store_address", result["store_address"], 1)
      //       this.store_title.current.innerText = result["store_name"]
      //       this.store_address.current.innerText = result["store_address"]
      //       this.store_phone.current.innerText = result["store_phone"]
      //     }
      //     else {
      //       this.setState({
      //         errorPage: true
      //       })
      //     }
          
      //   })

      // var request_data_2 = {
      //   "service": "menu",
      //   "operation": "get_business_hour",
      //   "store_id": getCookie("store_id")
      // }

      // var request_str_2 = dict2urlEncode(request_data_2)

      // getDataFromServer(url + '?' + request_str_2)
      //   .then((result) => {
      //     var business_open = result["hour"][0]
      //     var business_closed = result["hour"][1]
      //     var store_avail = result["inbusiness"]

      //     this.store_time.current.innerText = "營業時間: " + business_open + " - " + business_closed

      //     if (store_avail) {
      //       this.store_avail.current.innerText = "營業中"
      //       this.store_avail.current.classList.remove("store_closed")
      //     }
      //     else{
      //       this.store_avail.current.innerText = "休息中"
      //       this.store_avail.current.classList.add("store_closed")
      //     }
          
      //   })

      // var request_data_3 = {
      //   "service": "menu",
      //   "operation": "return_menu", 
      //   "store_id": getCookie("store_id")
      // }

      // var request_str_3 = dict2urlEncode(request_data_3)

      // getDataFromServer(process.env.REACT_APP_SERVER_URL + '?' + request_str_3)
      //   .then((result) => {
      //     console.log(result)
      //     this.setState({
      //       item: result.items,
      //       title: result.titles,
      //       price: price,
      //       avail: result.avail
      //     }, () => {
      //       this.deleteItemFromPromotionList()
      //     })
      //   })
      //   .catch(error => {
          
      //     // console.log(error)

      //     this.setState({
      //       errorPage: true
      //     })
      //   })
    }

  }

  deleteItemFromPromotionList() {

    var promotion_name_list = []

    for (var i = 0; i < this.state.item[0].length; i++) {
      // console.log(this.state.item[0][i][0])
      promotion_name_list.push(this.state.item[0][i][0])
    }

    for (i = 1; i < this.state.item.length; i++) {
      for (var j = this.state.item[i].length - 1; j >= 0; j--) {
        if (promotion_name_list.includes(this.state.item[i][j][0])) {
          this.state.item[i].splice(j, 1)
          this.state.avail[i].splice(j, 1)
        }
      }
    }

    this.setState({
      item: this.state.item,
      avail: this.state.avail
    })
  }

  cancel_order() {

      setCookie("itemsTotalPrice", 0, 1)
      setCookie('shoppingCartItems', "", 1)

      this.setState({
        switchPageFlag: true
      })
    
  }



  render() {

        if (getCookie("store_id") === "" || getCookie("device_key") === "" || getCookie("cart_id") === "") {
          return <Redirect push to="/" />;
        }

        if (this.state.errorPage) {
          return <Redirect push to="/errorPage" />;
        }

        if (this.state.switchPageFlag) {
          return <Redirect push to="/" />;
        }

        return (
            <div id="body">
      
              <div className="display_layout">
                
                <div className="scroll_container">

                  <div className="store_img_holder">
                    <img alt="doday_store" id="store_img" src={this.state.store_img} className="lazyload" />
                  </div>
      
                  <div className="store_img_detail">
                    <div className="store_title">
                      <h1 id="store_name" ref={this.store_title}>Food.Print </h1>
                      <h2 id="store_address" ref={this.store_address}>MIT</h2>
                      <h3 id="store_phone_num" ref={this.store_phone}>Phone: (617) 253-1000</h3>
                      <h3 id="store_avail"><span ref={this.store_avail}>Open</span></h3>
                    </div>

                    <div className="store_detail">
                      <h3 className="store_detail_content first_store_detail_content" ref={this.store_time}>Opening Hours: 10:00 - 22:00 </h3>
                      <h3 className="store_detail_content">Welcome to Food.Print! Food.Print is a dAPP for tracing food carbon footprint for restaurants and individual consumers, developed on TRON.</h3>
                    </div>

                  </div>
                  
                  
      
                  <div className="menu_section">
                    {this.state.title.map((item, index) => <MainMenuCategory key={index} titleName={item} itemList={this.state.item[index]} itemAvail={this.state.avail[index]}/>)}
                  </div>
                </div>

                
                <div className="foot_btn_holder">
        
                  <Link to={"/shoppingCart"}>
                    <div className="menu_submit_cart menu_submit_btn">
                      <img alt="shopping_cart_btn" src={process.env.PUBLIC_URL + "/image/shopping_cart_white.png"} />
                    </div>
                  </Link>

                  <div className="menu_submit_cancel menu_submit_btn" onClick={this.cancel_order}>
                    <img alt="cancel_btn" src={process.env.PUBLIC_URL + "/image/cancel_btn.png"} />
                  </div>

                </div>

                
      
      
              </div>
              
      
      
            </div>
      
        );}
}

export default MenuPage;
