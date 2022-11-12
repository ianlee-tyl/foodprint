import React, { Component } from 'react';
import { Redirect } from 'react-router';
// import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom'
import { postDataFromServer, dict2urlEncode, getDataFromServer } from '../http_utils.js'
import { setCookie, getCookie, saveValue, getSavedValue } from '../cookie_utils.js'
import { get_cart_item, prepare_order_data } from '../coupon_utils.js'
import { online_or_local } from '../shopping_cart_utils.js'

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

    this.eventhandler = this.eventhandler.bind(this)
    this.handleDeleteMode = this.handleDeleteMode.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handlePrice = this.handlePrice.bind(this)
    this.stayOrTogoHandler = this.stayOrTogoHandler.bind(this)
    this.stateHandler = this.stateHandler.bind(this)
    this.couponHandler = this.couponHandler.bind(this)
    this.check_addr_helper = this.check_addr_helper.bind(this)
    this.loginMember = this.loginMember.bind(this)

    this.doubleClick = React.createRef()

  }

  componentDidMount() {
    if (getCookie("store_id") !== "" && getCookie("cart_id") !== "" && getCookie("device_key") !== "") {
      if (getCookie("promotion_key") !== "") {
        const alert = this.props.alert
        alert.show("購物車中含有優惠特區之品項，此優惠活動不得與其他優惠券並行使用")
      }

      

      this.stayOrTogoHandler(getSavedValue("stayortogo"))

      var encodeShoppingCartItems = getCookie('shoppingCartItems').split("_")
    
      var request_data = {
          "service": "order",
          "operation": "get_cookie_value_from_list",
          "cart_id": getCookie("cart_id"),
          "device_key": getCookie("device_key"),
          "cookie_key_list": JSON.stringify(encodeShoppingCartItems)
      }

      var request_str = dict2urlEncode(request_data)
      var order_list = []

      getDataFromServer(process.env.REACT_APP_SERVER_URL+"?"+request_str)
        .then(result => {
          // console.log(result)
          if (result["indicator"]) {
              var itemsKeys = []
              var itemsTitle = []
              var itemsPrice = []
              var itemsAmount = []
              var itemsAddons = []

              for (var i = 0; i < result["message"].length; i++) {
                  order_list = order_list.concat(JSON.parse(result["message"][i]["cookie_value"]))
              }

              for (var k = 0; k < order_list.length; k++) {
                itemsKeys.push(k)
                itemsTitle.push(order_list[k][0])
                itemsPrice.push(parseInt(order_list[k][2].slice(4)))
                itemsAmount.push(parseInt(order_list[k][1]))
                itemsAddons.push(this.handleAddonsString(order_list[k][3]))
              }

              var additionPriceTemp = this.state.additionPrice;
              additionPriceTemp["小計:"]["price"] = itemsPrice.reduce((a, b) => a + b, 0);

              this.setState({
                dataDict: order_list,
                itemsKeys: itemsKeys,
                itemsTitle: itemsTitle,
                itemsPrice: itemsPrice,
                itemsAmount: itemsAmount,
                itemsAddons: itemsAddons,
                additionPrice: additionPriceTemp,
                totalPrice: additionPriceTemp["小計:"]["price"] + this.state.additionPrice["使用之塑膠袋費用:"]["price"] + this.state.additionPrice["折扣優惠:"]["price"]
              })
          }

        })
        .catch(error => {
          // TODO: error page handling
          // console.log(error)

          this.setState({
            errorPage: true
          })
        })
    }
  }

  handleDeleteMode(e) {
    
    this.setState({
      deleteMode: !this.state.deleteMode
    }, () => {
      if (this.state.deleteMode) {
        e.target.style.color = "red"
        const alert = this.props.alert
        alert.show("進入刪除模式，請點選欲刪除之品項，完成刪除後再點選按鈕脫離刪除模式")
      }
      else {
        e.target.style.color = "white"
        const alert = this.props.alert
        alert.show("離開刪除模式")
      }
    })
  }

  handleAddonsString(data) {
    var addon_dict = {}
    for (var i = 0; i < data.length; i++) {
      addon_dict[data[i][0]] = data[i][1]
    }
    var key_list = Object.keys(addon_dict)
    var return_string = ""

    for (i = 0; i < key_list.length; i++) {

      return_string += key_list[i] + ": "

      if (addon_dict[key_list[i]] === []) {
        return_string += "x;"
      }
      else{
        for (var j = 0; j < addon_dict[key_list[i]].length; j++) {
          return_string += addon_dict[key_list[i]][j] + ", "
        }
      }

      return_string = return_string.slice(0, return_string.length - 2) + "; "

    }

    return return_string

  }

  async handleSubmit(e) {


    // console.log(getCookie("shoppingCartItems"), this.doubleClick.current, e.target.disabled, this.doubleClick.current.getAttribute("disabled"), this.doubleClick.current.getAttribute("disabled") === "disabled")

    // e.preventDefault()
    // Trigger a fake click for the tap we just prevented
    // e.target.click()

    
    if (e.target.disabled === true) {
      const alert = this.props.alert
      alert.show("已送出訂單，請稍候")
    }

    else if (this.state.stayOrTogo === "") {
      const alert = this.props.alert
      alert.show("請選擇用餐方式")
    }

    else if (this.state.stayOrTogo === "delivery" && this.state.itemsAmount.reduce((a, b) => a + b, 0) < 10) {
      const alert = this.props.alert
      alert.show("未達10碗外送標準")
    }

    else if (getCookie("shoppingCartItems") === "") {
      const alert = this.props.alert
      alert.show("購物車內無任何餐點")
    }

    else if (!this.state.extraInfo["time_str"] || this.state.extraInfo["time_str"] === "-----"){
      const alert = this.props.alert
      alert.show("請選擇外送時間")
    }

    else if ((!this.state.extraInfo["payment_method"] || this.state.extraInfo["payment_method"] === "") && this.state.stayOrTogo === "delivery"){
      const alert = this.props.alert
      alert.show("請選擇付款方式")
    }

    else if ((!this.state.extraInfo["delivery_location"] || this.state.extraInfo["delivery_location"] === "") && this.state.stayOrTogo === "delivery"){
      const alert = this.props.alert
      alert.show("請輸入外送地址，或地址不在外送範圍內")
    }

    else if (!this.state.extraInfo["name"] || this.state.extraInfo["name"] === ""){
      const alert = this.props.alert
      alert.show("請輸入姓名")
    }

    else if (!this.state.extraInfo["phone_num"] || this.state.extraInfo["phone_num"] === ""){
      const alert = this.props.alert
      alert.show("請輸入電話號碼")
    }

    else if (getCookie("promotion_key") !== "" && this.state.extraInfo["coupon_fee"]) {
      const alert = this.props.alert
      alert.show("優惠活動和優惠券無法同時使用")
    }

    else{

      e.target.disabled = true

      // check member
      this.stateHandler("member_phone_num", this.state.extraInfo["member_phone_num"])


      var order_list_data = getCookie("shoppingCartItems");
      var decode_order_list = order_list_data.split("_")

      var decode_list = await get_cart_item(decode_order_list)

      // console.log(decode_list)

      var category_list = [];
      var item_list = [];
      var price_list = [];
      var addon_list = [];
      var comment_list = [];
      var number_of_bowl = 0;

      var coupon_fee = "";

      if (getCookie("promotion_key") !== "") {
        coupon_fee = getCookie("promotion_key")
      }

      else {
        coupon_fee = this.state.extraInfo["coupon_fee"]
      }

      for (var i=0; i<decode_list.length; i++){

        // console.log(".........")
        // Start idx of douhua name.
        var start_idx = decode_list[i][0].indexOf('-') + 2

        // Generate the addon list of dictionaries
        var addon_dict = {};

        for (var j=0; j<decode_list[i][3].length; j++){
          var addon_sublist = [];
          for (var k=1; k<decode_list[i][3][j].length; k++){
            if (Array.isArray(decode_list[i][3][j][k])){
              for (var q=0; q<decode_list[i][3][j][k].length; q++){
                addon_sublist.push(decode_list[i][3][j][k][q])
              }
            }else{
              addon_sublist.push(decode_list[i][3][j][k])
            }
            
          }
          addon_dict[decode_list[i][3][j][0]] = addon_sublist
        }

        // Repeatedly add the same data for the same bowl, for number of bowls
        for (var n = 0; n<parseInt(decode_list[i][1]); n++){
          category_list.push(decode_list[i][0].slice(0, start_idx-3))
          item_list.push(decode_list[i][0].slice(start_idx))
          price_list.push(parseInt(decode_list[i][2].slice(4))/parseInt(decode_list[i][1]));
          addon_list.push(addon_dict)
          comment_list.push(decode_list[i][4])
        }

        number_of_bowl += parseInt(decode_list[i][1])

        // console.log(category_list, item_list, price_list, addon_list, comment_list)
        
      }

      // console.log(category_list, item_list, price_list, addon_list, number_of_bowl)



      var request_data = {
        "service": "order",
        "operation": "add_to_order", 
        "name1": category_list,
        "name2": item_list,
        "name3with4": addon_list,
        "name5": comment_list,
        "number_of_data": number_of_bowl.toString(), 
        "price": price_list,
        "total_price": this.state.totalPrice.toString(),
        "promotion_key": coupon_fee,
        "final_price": price_list,
        "payment_method": online_or_local(this.state.stayOrTogo, this.state.extraInfo["payment_method"]),
        "store_id": getCookie("store_id"),
        "comment1": this.state.additionPrice["使用之塑膠袋費用:"]["price"].toString(),
        "comment2": online_or_local(this.state.stayOrTogo, this.state.extraInfo["payment_method"]),   // process.env.REACT_APP_MACHINE_ID,
        "comment3": this.state.extraInfo["member_phone_num"],
        "comment4": {"pick_up_time":this.state.extraInfo["time_str"], "phone_number":this.state.extraInfo["phone_num"], "delivery_location":this.state.extraInfo["delivery_location"]+"("+this.state.extraInfo["name"]+")"},
        "stayortogo": this.state.stayOrTogo,
        "comment7": {"one_time_code": coupon_fee, "deducted_point": parseInt(this.state.extraInfo["deducted_point"])}     //Need this
      }

      if (request_data["payment_method"] == "pay-on-arrival"){
        request_data["status"] = "preparing";
      }

      var request_str = JSON.stringify(request_data)
      // console.log(request_str, this.state.stayOrTogo, Math.abs(this.state.additionPrice["折扣優惠:"]["price"]))

      postDataFromServer(process.env.REACT_APP_SERVER_URL + '?', request_str)
        .then(result => {

          // console.log(result)

          if (result["indicator"]) {

            setCookie("itemsTotalPrice", 0, 1)
            setCookie('shoppingCartItems', "", 1)
            setCookie('shopping_id', result["orderid"].split("-")[2], 1)

            // console.log(result, this.state.extraInfo["payment_method"], this.state.extraInfo["payment_method"] === "online-pay")

            if (online_or_local(this.state.stayOrTogo, this.state.extraInfo["payment_method"]) === "online-pay") {
              window.location.href = result["message"].split(" ")[2]
            }

            else {
              this.setState({
                switchPageFlag: true
              })
            }

          }

          else {
            const alert = this.props.alert
            alert.show("系統異常:" + result["message"])
            e.target.disabled = false

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

  eventhandler(index) {

    if (this.state.deleteMode) {
      var encodeShoppingCartItems = getCookie('shoppingCartItems').split("_")

      var category = this.state.itemsTitle[index].split(" - ")[0]

      delete encodeShoppingCartItems[index]
      delete this.state.dataDict[index]
      delete this.state.itemsKeys[index]
      delete this.state.itemsTitle[index]
      delete this.state.itemsPrice[index]
      delete this.state.itemsAmount[index]
      delete this.state.itemsAddons[index]

      var additionPriceTemp = this.state.additionPrice
      additionPriceTemp["小計:"]["price"] = this.state.itemsPrice.reduce((a, b) => a + b, 0)

      setCookie('shoppingCartItems', encodeShoppingCartItems.filter((el) => { return el != null; }).join("_"), 1)
      
      this.setState({
        dataDict: this.state.dataDict.filter((el) => { return el != null; }),
        itemsKeys: this.state.itemsKeys.filter((el) => { return el != null; }),
        itemsTitle: this.state.itemsTitle.filter((el) => { return el != null; }),
        itemsPrice: this.state.itemsPrice.filter((el) => { return el != null; }),
        itemsAmount: this.state.itemsAmount.filter((el) => { return el != null; }),
        itemsAddons: this.state.itemsAddons.filter((el) => { return el != null; }),
        additionPrice: additionPriceTemp,
        totalPrice: additionPriceTemp["小計:"]["price"] + this.state.additionPrice["使用之塑膠袋費用:"]["price"] + this.state.additionPrice["折扣優惠:"]["price"]
       
      }, () => {
        if (category === "優惠特區") {
          setCookie("promotion_key", "", 1)
        }

        if (this.state.extraInfo["coupon_fee"] !== "") {
          this.couponHandler(this.state.extraInfo["coupon_fee"])
        }
        else {
          setCookie("itemsTotalPrice", this.state.totalPrice, 1)
        }
      })
    }
    else {
      // console.log("deleteMode false")
    }
    
  }

  handlePrice(price, sectionId, extraInfo) {
    var temp_additionPrice = this.state.additionPrice
    var temp_extraInfo = this.state.extraInfo

    for (var i = 0; i < Object.keys(this.state.additionPrice).length; i++) {
      if (temp_additionPrice[Object.keys(temp_additionPrice)[i]]["sectionId"] === sectionId) {
        temp_additionPrice[Object.keys(temp_additionPrice)[i]]["price"] = price
      }
    }

    // console.log(sectionId, extraInfo)
    temp_extraInfo[sectionId] = extraInfo

    this.setState({
      extraInfo: temp_extraInfo,
      additionPrice: temp_additionPrice,
      totalPrice: temp_additionPrice["小計:"]["price"] + temp_additionPrice["使用之塑膠袋費用:"]["price"] + temp_additionPrice["折扣優惠:"]["price"]
    
    }, () => {
      setCookie("itemsTotalPrice", this.state.totalPrice, 1)

      saveValue("coupon_fee", extraInfo)
      saveValue("deduced_price", price)
    })

  }

  stayOrTogoHandler(data) {
    // console.log(data)
    if (data === "內用") {
      data = "stay"  // TODO: stay?????????
    }
    else if (data === "外送" || data === "delivery") {
      data = "delivery"
    }
    else {
      data = "togo"
    }

    saveValue("stayortogo", data)

    this.setState({
      stayOrTogo: data
    })
  }

  async stateHandler(state, info) {

    if (state.includes("time_str")) {
      saveValue("time_str", info)
      this.state.extraInfo["time_str"] = info
    }

    this.state.extraInfo[state] = info
    this.setState({
      extraInfo: this.state.extraInfo
    }, () => {

      if (state === "coupon_fee") {
        this.couponHandler(info)
      }

      else if (state === "delivery_location") {
        this.check_addr_helper(info)
      }

      else if (state === "member_phone_num") {
        this.loginMember(info)
      }

      else {
        saveValue(state, info)
      }

    })
  }

  async couponHandler(p_key) {
    // console.log(p_key)

    var totalPrice = this.state.additionPrice["使用之塑膠袋費用:"]["price"] + this.state.additionPrice["小計:"]["price"]
    var additionPrice = this.state.additionPrice["使用之塑膠袋費用:"]["price"]

    var order_d_list = await prepare_order_data();

    // console.log(order_d_list, p_key)

    var request_data;

    if (order_d_list[2].length === 0){
      order_d_list[2].push(0);
      request_data = {
        "service": "order",
        "operation": "execute_promotion",
        "price": order_d_list[2],
        "total_price": totalPrice,
        "final_price": order_d_list[2],
        "promotion_key": p_key,
        "payment_method": "online",
        "store_id": getCookie("store_id"),
        "stayortogo": this.state.stayOrTogo,
        "comment1": additionPrice,
        "comment2": "online",
        "comment4": {}, //Need these two
        "comment7": {} //Need these two
      }
    }
    else{
      request_data = {
        "service": "order",
        "operation": "execute_promotion",
        "name1": order_d_list[0],
        "name2": order_d_list[1],
        "name3with4": order_d_list[3],
        "number_of_data": order_d_list[4].toString(),
        "price": order_d_list[2],
        "total_price": totalPrice,
        "final_price": order_d_list[2],
        "promotion_key": p_key,
        "payment_method": "online",
        "store_id": getCookie("store_id"),
        "stayortogo": this.state.stayOrTogo,
        "comment1": additionPrice,
        "comment2": "online",
        "comment4": {}, //Need these two
        "comment7": {} //Need these two
      }
    }
    // console.log(request_data)
    var request_str = JSON.stringify(request_data)

    postDataFromServer(process.env.REACT_APP_SERVER_URL + '?', request_str)
    .then(result => {

      // console.log(result)

      if (result["indicator"]) {
        var deduced_price = result["message"]

        if (parseInt(deduced_price) === 0) {
          if (p_key !== "") {
            const alert = this.props.alert
            alert.show("優惠券無法使用，請重新再試")
          }

          else if (p_key === "") {
            const alert = this.props.alert
            alert.show("未輸入優惠券，請重新再試")
          }
          this.handlePrice(0, "coupon_fee", "")
          
        }
        else {
          this.handlePrice(parseInt(deduced_price)*(-1), "coupon_fee", p_key)

        }

      }

      else{

        if (p_key !== "") {
          const alert = this.props.alert
          alert.show("優惠券無法使用，請重新再試")
        }

        this.handlePrice(0, "coupon_fee", "")

      }
    })
    .catch(error => {
      this.setState({
        errorPage: true
      })
    })
  }

  check_addr_helper(take_addr_value){
    const alert = this.props.alert
    const thisParent = this

    var request_data = {
      "service":"order",
      "operation":"delivery_address_distance_check",
      "origin":getCookie("store_address"),
      "destination":take_addr_value, 
      "store_id": getCookie("store_id")
    }

    var request_str = JSON.stringify(request_data)

    postDataFromServer(process.env.REACT_APP_SERVER_URL + "?", request_str)
      .then(result => {
        if (result["indicator"]) {

          if (result["in_delivery_range"]) {
            saveValue("delivery_location", take_addr_value)
            alert.show("此地址在外送範圍，最低訂購碗數為10碗，請繼續確認訂單並完成付款程序。");
          }

          else {
            
            alert.show("不好意思，此地址超出本店外送範圍");

            saveValue("delivery_location", "")
            thisParent.state.extraInfo["delivery_location"] = ""
            thisParent.setState({
              extraInfo: thisParent.state.extraInfo
            })

            return;
          }
          
        }
        else {
          saveValue("delivery_location", "")
          alert.show("地址異常，請重新再試");
        }
      })
  }

  loginMember(member_phone_num) {
    var request_data = {
      "service": "member",
      "operation": "get_member_info",//"operation": "get_promotion_info",         //only coupon
      "user_phone": member_phone_num
    }

    var request_str = dict2urlEncode(request_data)
    // console.log(process.env.REACT_APP_COUPON_URL + '?' + request_str)
    
    getDataFromServer(process.env.REACT_APP_COUPON_URL + '?' + request_str, false, true)
      .then((result) => {

	      
        //console.log(result)

        if (result["indicator"]) {
          saveValue("member_phone_num", member_phone_num)

          const alert = this.props.alert
          alert.show("成功登入會員")
        }

        else {
          saveValue("member_phone_num", "")

          const alert = this.props.alert
          alert.show("未成功登入會員")

          var temp = this.state.extraInfo
          temp["member_phone_num"] = ""

          this.setState({
            extraInfo: temp
          })
        }

      })
      .catch(error => {
        saveValue("member_phone_num", "")

        const alert = this.props.alert
        alert.show("無法登入會員，請重新再試")

        var temp = this.state.extraInfo
        temp["member_phone_num"] = ""
        this.setState({
          extraInfo: temp
        })
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
          return <Redirect push to="/infoPage" />;
        }

        return (

          <div id="body">
            <div className="display_layout cart_layout">

              <div className="nav_bar sticky">
                <Link to={"/menuPage"}>
                  <button className="return_btn" onClick={setCookie("itemsTotalPrice", this.state.additionPrice["小計:"]["price"], 1)}>{"<繼續購物"}</button>
                </Link>
              </div>

              <div className="scroll_container cart_layout" id="cart_container">


                <EatOrTogoSection onChange={this.stayOrTogoHandler} single_class="eat_or_togo" choice_type="single"/>
                


                { this.state.stayOrTogo !== "" ? <MoreInfoSection stateHandler={this.stateHandler} section_title={"更多資訊*"} sectionFlag={this.state.stayOrTogo} /> : <div></div> }



                <MoreInfoSection section_title={"請輸入聯絡資訊*"} stateHandler={this.stateHandler} sectionFlag={"selfInfo"} />


            
                <div className="check_list_title">
                  <h2>請確認訂單</h2>
                  <h3 id="delete_btn" onClick={(e) => {this.handleDeleteMode(e)}}>刪除訂單</h3>
                </div>
                <div className="check_list">
                  {this.state.itemsKeys.map((item, index) => <CartItem key={item+index} itemIndex={index} itemNum={this.state.itemsAmount[index]} itemTitle={this.state.itemsTitle[index]} itemAddons={this.state.itemsAddons[index]} itemPrice={this.state.itemsPrice[index]} onChange={this.eventhandler}/>)}
                </div>

                <MoreInfoSection section_title={"輸入會員電話號碼累積點數"} stateHandler={this.stateHandler} sectionFlag={"member"} />

                {/* { this.state.memberFlag ? <MemberSection currentCoupon={this.state.extraInfo["coupon_fee"]} ref={this.couponHandler} stateSubmit={this.stateHandler} onChange={this.handlePrice} stayOrTogo={this.state.stayOrTogo} additionPrice={this.state.additionPrice["使用之塑膠袋費用:"]["price"]} totalPrice={this.state.additionPrice["使用之塑膠袋費用:"]["price"] + this.state.additionPrice["小計:"]["price"]} /> : <div></div>} */}



                <PlasticBagSection onChange={this.handlePrice} single_class="plastic_bag" choice_type="single"/>



                <MoneyDisplaySection sectionInfo={this.state.additionPrice}/>

              </div>


              <button className="submit_shopping_cart" ref={this.doubleClick} onClick={this.handleSubmit}>
                <h5>{getCookie("store_id") === "DDC" ? "確認訂單" : "確認訂單並付款"}</h5>
                <h6>NT$
                  <span id="price">
                    {
                      this.state.totalPrice
                    }
                  </span>
                </h6>
              </button>

            </div>
          </div>
      
        );
  }
}

export default withAlert()(CartPage);
