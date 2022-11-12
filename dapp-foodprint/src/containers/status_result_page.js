import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
// import { FullScreen, useFullScreenHandle } from "react-full-screen"

import { withAlert } from 'react-alert'

// import '../css/main.css';
// import { getDataFromServer, postDataFromServer, init_cart_and_device_key, dict2urlEncode } from '../http_utils.js'
// import { setCookie, getCookie } from '../cookie_utils.js'



class StatusResultPage extends Component {

  constructor(props) {
    super(props);

    const { state } = this.props.location;
    var message;
    var url;

    if (state) {
      message = state[0]["message"]
      url = state[0]["url"]

      if (message === "not_paid") {
        message = "尚未付款"
      }

      else if (message === "preparing") {
        message = "準備中"
      }

      else if (message === "served") {
        message = "已出單"
      }

      else {
        message = ""
        const alert = this.props.alert
        alert.show("訂單輸入有誤，請重新嘗試")
      }
    }

    else{
      message = ""
      url = ""
      const alert = this.props.alert
      alert.show("訂單輸入有誤，請重新嘗試")
    }

    this.state = {
      url: url,
      message: message,
      switchPageFlag: false
    }

    this.returnMemberPage = this.returnMemberPage.bind(this)
  }


  returnMemberPage() {

    this.setState({
      switchPageFlag: true
    })

  }


  render() {
        if (this.state.switchPageFlag) {
          return <Redirect push to="/" />;
        }
                

        return (
            <div id="body" className="min_height">
              <div className="display_layout min_height yellow_bg" id="info_bg">

                <div className="container">
                  <img src="../image/doday_logo.png" alt="doday_logo"/>

                  <div className="info_block">

                    <div className="info_word">
                      <h3>你的訂單目前</h3>
                      <br/>
                      <div id="order_status">{this.state.message}</div>
                      <br/>
                      <h3>請等候取餐。</h3>
                      <br/>
                      <h3>豆日子祝你有愉快的一天!</h3>
                      <br/>
                      <h3><a id="receipt" href={this.state.url}>點此取得收據</a></h3>
                      <br/>
                    </div>
                  </div>

                </div>
                <Link to={"/"} className="shopping_cart_holder">
                  <div className="submit_cart">
                    <h6>X</h6>
                  </div>
                </Link>
              </div>

            </div>
      
        );}
}

export default withAlert()(StatusResultPage);
