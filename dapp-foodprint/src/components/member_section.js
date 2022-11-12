import React, { Component } from 'react'
import { prepare_order_data } from '../coupon_utils.js'
import { postDataFromServer, getDataFromServer, dict2urlEncode } from '../http_utils.js'
import { setCookie, getCookie } from '../cookie_utils.js'

import { withAlert } from 'react-alert'

import InputBtn from '../components/input_btn.js'
// import DisplayInfo from '../components/display_info.js'
import Coupon from '../components/coupon.js'

class MemberSection extends Component {
    constructor(props) {
        super(props)
        this.state = {
          freeDouhuaCoupon: "dodaydddd1",
          inputDisplay: {"優惠券": ""},
          sectionContent: [],       // ["優惠券"]
          contentId: [],            // ["coupon_fee"]
          btnStatus: [],            // [true]
          deducted_point: "0",
          selected_coupon: [],
          displayInfoTitle: ["會員電話", "會員點數"],
          displayInfoContent: [getCookie("user_phone"), "0點"],
          memberCoupon: [],
          memberCouponTemp: [],
          couponMap: {}
        }

        this.couponHandler = this.couponHandler.bind(this)
        this.stateHandler = this.stateHandler.bind(this)
        this.useCoupon = this.useCoupon.bind(this)
        this.checkCouponList = this.checkCouponList.bind(this)

    }

    componentDidMount() {
      // get reward points
      var request_data = {
        "service": "member",
        "operation": "get_member_reward_points",         //only reward points
        "user_phone": getCookie("user_phone")
      }

      var request_str = dict2urlEncode(request_data)

      getDataFromServer(process.env.REACT_APP_COUPON_URL + '?' + request_str, false, true)
        .then((result) => {
          if (result["indicator"]) {
            this.state.displayInfoContent[1] = result["message"]+"點"

            this.setState({
              displayInfoContent: this.state.displayInfoContent
            }, () => {

              if (parseInt(this.state.displayInfoContent[1]) >= parseInt(process.env.REACT_APP_FREE_DOUHUA_POINT)) {
                var d = new Date()
                this.state.couponMap["0000-1-1-" + (d.getFullYear()).toString() + "0101-" + (d.getFullYear() + 1).toString() + "0101-" + this.state.freeDouhuaCoupon] = { "point": process.env.REACT_APP_FREE_DOUHUA_POINT, "name": "免費招待券", "key": "0000-1-1-" + (d.getFullYear()).toString() + "0101-" + (d.getFullYear() + 1).toString() + "0101-" + this.state.freeDouhuaCoupon }
                this.state.selected_coupon.push(false)
              }

              this.setState({
                couponMap: this.state.couponMap,
                memberCoupon: Object.keys(this.state.couponMap),
                selected_coupon: this.state.selected_coupon
              })
            })
          }

        })



      // setup coupon map
      // error: sometimes it cannot match the coupon
      // console.log("promotion keys list: "+getCookie("owned_promotion_keys"))
      if (getCookie("owned_promotion_keys")) {

        var coupon_id = JSON.parse(getCookie("owned_promotion_keys"))

        var coupon_id_filted = this.checkCouponList(coupon_id)

        // console.log(coupon_id_filted)


        var request_data = {
          "service": "member",
          "operation": "return_promotion_name_list",
          "promotion_list": JSON.stringify(coupon_id_filted)
        }

        // var request_str = JSON.stringify(request_data)
        var request_str = dict2urlEncode(request_data)
        // console.log(request_str)




        getDataFromServer(process.env.REACT_APP_SERVER_URL + "?" + request_str)
          .then((result) => {

            // console.log(result)


            if (result["indicator"]) {

              var name_list = result["message"]

              for (var i = 0; i < name_list.length; i++) {
                
                this.state.couponMap[coupon_id_filted[i]] = { "name": name_list[i], "point": "0", "key": coupon_id_filted[i] }
                this.state.selected_coupon.push(false)

                this.setState({
                  couponMap: this.state.couponMap,
                  memberCoupon: Object.keys(this.state.couponMap),
                  selected_coupon: this.state.selected_coupon
                })
              }

              
            }
            
          })
      }
    }

    stateHandler(state, info) {
      if (this.props.stateSubmit){
        this.props.stateSubmit(state, info)
      }
    }

    async couponHandler(p_key, index) {
      // console.log(p_key, index)

      var order_d_list = await prepare_order_data();

      // console.log(order_d_list, p_key)

      if (order_d_list[2].length === 0){
        order_d_list[2].push(0);
        var request_data = {
          "service": "order",
          "operation": "execute_promotion",
          "price": order_d_list[2],
          "total_price": this.props.totalPrice,
          "final_price": order_d_list[2],
          "promotion_key": p_key,
          "payment_method": "online",
          "store_id": process.env.REACT_APP_STORE_ID,
          "stayortogo": this.props.stayOrTogo,
          "comment1": this.props.additionPrice,
          "comment2": "online",
          "comment4": {}, //Need these two
          "comment7": {} //Need these two
        }
      }else{
        var request_data = {
          "service": "order",
          "operation": "execute_promotion",
          "name1": order_d_list[0],
          "name2": order_d_list[1],
          "name3with4": order_d_list[3],
          "number_of_data": order_d_list[4].toString(),
          "price": order_d_list[2],
          "total_price": this.props.totalPrice,
          "final_price": order_d_list[2],
          "promotion_key": p_key,
          "payment_method": "online",
          "store_id": process.env.REACT_APP_STORE_ID,
          "stayortogo": this.props.stayOrTogo,
          "comment1": this.props.additionPrice,
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
              this.state.selected_coupon[index] = false
              const alert = this.props.alert
              alert.show("優惠券無法使用，請重新再試")
            }

            this.setState({
              deducted_point: "0",
              selected_coupon: this.state.selected_coupon
            }, () => {
              this.props.onChange(0, "coupon_fee", "")
              this.props.stateSubmit("deducted_point", this.state.deducted_point)
            })
          }
          else {
            this.props.onChange(parseInt(deduced_price)*(-1), "coupon_fee", p_key)
            this.props.stateSubmit("deducted_point", this.state.deducted_point)
          }

        }

        else{

          if (p_key !== "") {
            this.state.selected_coupon[index] = false
            const alert = this.props.alert
            alert.show("優惠券無法使用，請重新再試")
          }

          this.setState({
            deducted_point: "0",
            selected_coupon: this.state.selected_coupon
          }, () => {
            this.props.onChange(0, "coupon_fee", "")
            this.props.stateSubmit("deducted_point", this.state.deducted_point)
          })
        }
      })
    }


    checkCouponList(key_list) {
      var temp = []
      for (var i = 0; i < key_list.length; i++) {
        if (this.checkCoupon(key_list[i])){
          temp.push(key_list[i])
        }
      }

      return temp
    }

    checkCoupon(key) {
      // console.log(key)
      var start_date = key.slice(9, 17)
      var end_date = key.slice(18, 26)

      // get current date
      var d = new Date();
      var result = (d.getFullYear()).toString() + ("0" + (d.getMonth()+1).toString()).slice(-2) + ("0" + (d.getDate()).toString()).slice(-2)
      // console.log("===========result: ===========")
      // console.log(start_date, end_date, result)
      if (parseInt(start_date) <= parseInt(result) && parseInt(result) <= parseInt(end_date)) {
        // console.log(start_date, end_date, key)
        return true
      }
      else {
        return false
      }
      
    }

    useCoupon(item, coupon_key, coupon_point) {
      // console.log(item, coupon_key)

      // this is useless if you don't open input section
      this.state.inputDisplay["優惠券"] = coupon_key

      var index = Object.keys(this.state.couponMap).indexOf(coupon_key)

      for (var i = 0; i < this.state.selected_coupon.length; i++) {
        this.state.selected_coupon[i] = false
      }

      if (this.props.currentCoupon === coupon_key) {
        coupon_key = ""
      }

      else {
        this.state.selected_coupon[index] = true
      }

      this.setState({
        inputDisplay: this.state.inputDisplay,
        deducted_point: coupon_point,
        selected_coupon: this.state.selected_coupon
      }, () => { this.couponHandler(coupon_key, index) })
      

      
    }

    
    
    render() {

        return (
            <div>
                <div className="check_list_title">
                  <h2>會員點數、優惠券</h2>
                </div>

                <div>
                  {this.state.displayInfoTitle.map((item, index) => <InputBtn key={item+index} infoType={""} content={this.state.displayInfoContent[index]} title={item} />)}

                  {this.state.sectionContent.map((item, index) => <InputBtn key={item+index} infoType={"inputWithBtn"} content={this.state.inputDisplay[item]} title={item} onChange={this.couponHandler} stateSubmit={this.stateHandler} />)}

                  {Object.keys(this.state.couponMap).map((item, index) => <Coupon key={item} selected_coupon={this.state.selected_coupon[index]} itemKey={this.state.couponMap[item]["key"]} title={this.state.couponMap[item]["name"]} content={this.state.couponMap[item]["point"]} eventHandler={this.useCoupon}/>)}
                </div>

                
            </div>
            
            
        );
    }
}

export default withAlert()(MemberSection);
