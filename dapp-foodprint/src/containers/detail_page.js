import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import { getDataFromServer, dict2urlEncode, makeid, postDataFromServer, generate_datalist } from '../http_utils.js'
import { setCookie, getCookie } from '../cookie_utils.js'

import { withAlert } from 'react-alert'

import DetailChoiceSection from "../components/detail_choice_section.js"

import '../css/main.css';

class DetailPage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      switchPageFlag: false,
      itemCategory: "",
      itemName: "",
      itemPrice: "",
      itemPic: process.env.PUBLIC_URL + "/image/hamburger.png",
      itemDesc: "",
      extraPrice: {},
      shoppingCartItem: {},
      one_bowl_price: parseInt(0),
      total_price: 4.99,
      main_menu_amount: 1,
      errorPage: false,
      condFlag: [],
      conditionals: [], //[[['冷熱冰量'], [['熱']], ['附加選項'], [['加薑汁']]]],
      detail_choice: [["multiple", "Choices", ["熱", "去冰", "微冰", "少冰", "半冰", "正常", "加冰"], "must", [true, true, true, true, true, true, true]]]
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.eventhandler = this.eventhandler.bind(this)
    this.findConditionals = this.findConditionals.bind(this)
    this.checkMandatory = this.checkMandatory.bind(this)
    this.findSecNum = this.findSecNum.bind(this)


  }

  componentDidMount() {

    if (getCookie('item') !== "" && getCookie("store_id") !== "" && getCookie("device_key") !== "" && getCookie("cart_id") !== "") {

      var itemDict = JSON.parse(getCookie('item'))

      var itemCategory = itemDict["detailInfo"].itemCategory
      var itemName = itemDict["detailInfo"].itemName
      var itemPrice = parseInt(itemDict["detailInfo"].itemPrice)
      var itemPic = itemDict["detailInfo"].itemPic
      var itemDesc = itemDict["detailInfo"].itemDesc

      // var request_data = {
      //   "service": "menu",
      //   "operation": "return_addons", 
      //   "category": itemCategory, 
      //   "item": itemName, 
      //   "store_id": getCookie("store_id"),
      //   "username": "102"
      // }

      // var request_str = dict2urlEncode(request_data)

      // // console.log(request_str, request_data)

      // getDataFromServer(process.env.REACT_APP_SERVER_URL + '?' + request_str, true)
      //   .then(result => {
      //     // console.log(result)
      //     var conditionals = result.pop()
      //     var condFlag = []

      //     for (var i = 0; i < result.length; i++) {
      //       condFlag.push(new Array(result[i][2].length).fill(true))
      //     }

      //     this.setState({
      //       condFlag: condFlag,
      //       conditionals: conditionals,
      //       detail_choice: result
      //     })
      //   })
      //   .catch(error => {
          
      //     // console.log(error)

      //     this.setState({
      //       errorPage: true
      //     })
      //   })

      // this.setState({
      //   itemCategory: itemCategory,
      //   itemName: itemName,
      //   itemPrice: itemPrice,
      //   itemPic: itemPic,
      //   itemDesc: itemDesc,
      //   one_bowl_price: itemPrice,
      //   total_price: ((itemPrice + this.addAllAddonsPrice(this.state.extraPrice)) * this.state.main_menu_amount)
      // })

    }


  }

  handleChange() {
    this.setState({
      total_price: ((this.state.one_bowl_price + this.addAllAddonsPrice(this.state.extraPrice)) * this.state.main_menu_amount)
    })
  }

  checkMandatory() {
    for (var i = 0; i < this.state.detail_choice.length; i++) {
      if (this.state.detail_choice[i][3] === "must") {
        if (!Object.keys(this.state.shoppingCartItem).includes(this.state.detail_choice[i][1]) || this.state.shoppingCartItem[this.state.detail_choice[i][1]].length === 0) {
          const alert = this.props.alert
          alert.show("Please select" + this.state.detail_choice[i][1])
          return false
        }
      }
    }

    return true
    
  }

  handleSubmit() {

    setCookie("cookie_key", makeid(6), 1)

    if (this.checkMandatory()) {

      var datalist = generate_datalist(this.state.itemCategory + " - " + this.state.itemName, this.state.main_menu_amount, this.state.total_price, this.state.shoppingCartItem, "", "")

      var request_data = {
        "service": "order",
        "operation": "add_cookie_order_mapping",
        "cart_id": getCookie("cart_id"),
        "device_key": getCookie("device_key"),
        "cookie_key": getCookie("cookie_key"),
        "cookie_value": datalist
      }

      var request_str = JSON.stringify(request_data)
      // console.log(request_str)

      postDataFromServer(process.env.REACT_APP_SERVER_URL + '?', request_str)
        .then(result => {
            // console.log(result)
          if (result["indicator"]) {
            var cartItems = getCookie("shoppingCartItems")
            if (cartItems === "") {
              cartItems = getCookie("cookie_key")
            }
            else {
              cartItems += "_" + getCookie("cookie_key")
            }

            setCookie("shoppingCartItems", cartItems, 1)

            

            var price = getCookie("itemsTotalPrice")

            if (price === "") {
              price = 0
            }

            setCookie("itemsTotalPrice", parseInt(price) + parseInt(this.state.total_price), 1)　　// server send back current total price
            
            this.setState({
              switchPageFlag: true
            }, () => { 
              const alert = this.props.alert
              alert.show("Successfully add to cart") })


          }
          
        })
        .catch(error => {
        
          // console.log(error)

          this.setState({
            errorPage: true
          })
        })
    }
  }

  eventhandler(dataList, dataTitle, dataPrice, conditionals) {

    var temp_extraPrice = this.state.extraPrice
    var temp_shoppingCartItem = this.state.shoppingCartItem

    temp_extraPrice[dataTitle] = dataPrice
    temp_shoppingCartItem[dataTitle] = dataList

    // console.log("conditionals", conditionals, temp_shoppingCartItem, dataTitle, dataList)
    if (Object.keys(conditionals).length !== 0) {
      for (var i = 0; i < conditionals["sec"].length; i++) {
        this.findConditionals(conditionals["sec"][i], conditionals["val"][i])
      }
    }
    

    this.setState({
        extraPrice: temp_extraPrice,
        shoppingCartItem: temp_shoppingCartItem
      }, 
      () => {
        this.setState({
          total_price: (this.state.one_bowl_price + this.addAllAddonsPrice(temp_extraPrice)) * this.state.main_menu_amount
        })
    })

  }

  findSecNum(sec) {

    for (var i = 0; i < this.state.detail_choice.length; i++) {
      if (this.state.detail_choice[i][1] === sec) {
        
        return i
      }
    }
  }

  findConditionals(sec, val) {
    // console.log("sec, val", sec, val)

    var sec_index = this.findSecNum(sec)
    var temp_condFlag = this.state.condFlag

    
    for (var k = 0; k < val.length; k++) {
      temp_condFlag[sec_index][this.state.detail_choice[sec_index][2].indexOf(val[k])] = !temp_condFlag[sec_index][this.state.detail_choice[sec_index][2].indexOf(val[k])]
    }
    

    this.setState({
      condFlag: temp_condFlag
    })
  }

  addAllAddonsPrice(obj) {
    var sum = 0;
    for( var el in obj ) {
      if( obj.hasOwnProperty( el ) ) {
        sum += parseInt( obj[el] )
        // console.log(sum, obj[el], el, obj)
      }
    }
    return sum;
  }




  render() {
        if (getCookie("store_id") === "" || getCookie("item") === "" || getCookie("device_key") === "" || getCookie("cart_id") === "") {
          return <Redirect push to="/" />;
        }

        if (this.state.errorPage) {
          return <Redirect push to="/errorPage" />;
        }
        
        if (this.state.switchPageFlag) {
          return <Redirect push to="/menuPage" />;
        }

        return (
          <div id="body">
            <div className="display_layout">
    
              <div className="nav_bar sticky">
                <Link to={"/menuPage"}>
                  <button className="return_btn">{"<Back"}</button>
                </Link>
              </div>

              <div id="scroll_container">

                <div className="header_section">
                  <div className="item_img_holder"> 
                    <img alt="douhua_pic" id="item_img" className="lazyload" src={this.state.itemPic} />
                  </div>
                </div>

                <div className="item_title">
                  <h1 id="item_name">{this.state.itemName}</h1>
                  <h6 id="item_detail">{this.state.itemDesc}</h6>
                </div>

                
                <div id="items_detail_section">
                  {this.state.detail_choice.map((item, index) => 
                    <DetailChoiceSection conditionals={this.state.conditionals} condFlag={this.state.condFlag[index]} key={item[1] + index} sectionType={item[0]} sectionTitle={item[1]} sectionContent={item[2]} sectionMandatory={item[3]} sectionAvail={item[4]} onChange={this.eventhandler}/>
                  )}
                </div>


                <div className="amount_section">
                  {/*<button id="minus" onClick={() => {
                    if (this.state.main_menu_amount - 1 <= 0){
                      this.setState({ main_menu_amount: 1 }, () => {this.handleChange()})
                    }
                    else {
                      this.setState({ main_menu_amount: this.state.main_menu_amount - 1 }, () => {this.handleChange()})
                    }
                  }}>-</button>
                  <input type="number" id="num" readOnly value={ this.state.main_menu_amount } />
                  <button id="plus" onClick={() => { this.setState({ main_menu_amount: this.state.main_menu_amount + 1 }, () => {this.handleChange()}) }}>+</button>*/}
                </div>

              </div>


              <button className="add_to_cart" onClick={this.handleSubmit}>
                <h5>Add <span id="amount">{ this.state.main_menu_amount }</span> to cart</h5>
                <h6>$<span id="price">
                  { this.state.total_price }
                </span></h6>
              </button>

            </div>
          </div>
      
        );
  }
}




export default withAlert()(DetailPage);
