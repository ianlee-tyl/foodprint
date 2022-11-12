import React, { Component } from 'react';
import { Redirect } from 'react-router';
// import { Link } from 'react-router-dom';
// import { FullScreen, useFullScreenHandle } from "react-full-screen"

import { withAlert } from 'react-alert'

// import '../css/member_page.css';
import { getDataFromServer, init_cart_and_device_key, dict2urlEncode } from '../http_utils.js'
import { setCookie, getCookie } from '../cookie_utils.js'



class MemberPage extends Component {

  constructor(props) {
    super(props);

    // this.fullscreen = React.createRef()
    


    this.state = {
      phoneNum: "",
      switchPageFlag: false,
      errorPage: false
    };

    this.handleSubmit = this.handleSubmit.bind(this)
    this.stateHandler = this.stateHandler.bind(this)
  }

  handleSubmit(e) {

    // console.log(e.target.innerText)

    if (this.state.phoneNum === "" && e.target.innerText === "登入會員") {
      const alert = this.props.alert
      alert.show("未輸入電話號碼，請重新再試")
    }

    else {
      if (e.target.innerText === "登入會員") {
        var request_data = {
          "service": "member",
          "operation": "get_promotion_info",         //only coupon
          "user_phone": this.state.phoneNum
        }

        var request_str = dict2urlEncode(request_data)
        // console.log(process.env.REACT_APP_COUPON_URL + '?' + request_str)
        
        getDataFromServer(process.env.REACT_APP_COUPON_URL + '?' + request_str, false, true)
          .then((result) => {

            // console.log(result)

            if (result["indicator"]) {

              // console.log(JSON.parse(result["message"]))
              // console.log(JSON.parse(JSON.parse(result["message"])["reward_points"]))

              init_cart_and_device_key(process.env.REACT_APP_SERVER_URL)

              setCookie("owned_promotion_keys", result["message"], 1)
              setCookie("user_phone", this.state.phoneNum, 1)
              setCookie("itemsTotalPrice", 0, 1)
              setCookie('shoppingCartItems', "", 1)

              // console.log(getCookie("cart_id"), getCookie("device_key"), getCookie("user_phone"))

              this.setState({
                switchPageFlag: true
              })

            }

            else {
              const alert = this.props.alert
              alert.show("請先註冊會員")
            }

          })
          .catch(error => {
        
            // console.log(error)

            this.setState({
              errorPage: true
            })
          })
      }

      else {
        init_cart_and_device_key(process.env.REACT_APP_SERVER_URL)

        setCookie("owned_promotion_keys", "", 1)
        setCookie("user_phone", "", 1)
        setCookie("itemsTotalPrice", 0, 1)
        setCookie('shoppingCartItems', "", 1)

        this.setState({
          switchPageFlag: true
        })
      }
    }
    

  }

  stateHandler(e) {
    // console.log(e.target.value)
    this.setState({
      phoneNum: e.target.value
    })
  }


  render() {
        if (this.state.switchPageFlag) {
          return <Redirect push to="/menuPage" />;
        }

        if (this.state.errorPage) {
          return <Redirect push to="/errorPage" />;
        }

        // <img id="logo" src={process.env.PUBLIC_URL + "../image/doday_logo.png"} />
                

        return (           
            <div id="body">
              <div className="container" id="bg_pic">
                
                
                <div id="content">
                  <div className="input_section">
                    <h3>會員電話號碼:</h3>
                    <input type="text" name="username_id" id="username" className="input_text" onChange={this.stateHandler} pattern="\d*" inputMode="numeric" autoComplete="off"/>
                    <br />
                  </div>
                  <button className="submit_btn" onClick={this.handleSubmit}>登入會員</button>
                  <button className="submit_btn" onClick={this.handleSubmit}>我不是會員</button>
                  
                </div>
              </div>
            </div>
      
        );}
}

export default withAlert()(MemberPage);
