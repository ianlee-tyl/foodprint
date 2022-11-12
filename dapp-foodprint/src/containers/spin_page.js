import React, { Component } from 'react';
import { Redirect } from 'react-router';
// import { Link } from 'react-router-dom';
// import { FullScreen, useFullScreenHandle } from "react-full-screen"

// import { getDataFromServer, postDataFromServer, dict2urlEncode } from '../http_utils.js'
// import { setCookie, getCookie } from '../cookie_utils.js'

import { withAlert } from 'react-alert'

import Wheel from '../components/wheel.js';
// import '../css/spin_page.css';


class SpinPage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      phoneNum: "",
      memberLoginFlag: false
    };

    this.places = ["單碗豆花八折券電子劵", "二獎 免費贈一星期豆花電子劵", "免費贈甜品券一張電子劵", "免費贈豆漿券一張電子劵", "頭獎 免費贈100天豆花電子劵"];

    this.memberHandler = this.memberHandler.bind(this);
    this.stateHandler = this.stateHandler.bind(this);
    this.resetPage = this.resetPage.bind(this)
  }

  memberHandler(e) {
    if (e.target.innerText === "確認電話號碼") {

      // console.log(this.state.phoneNum.length === 10, (this.state.phoneNum).toString(), (this.state.phoneNum).toString().slice(0, 2))
      if (this.state.phoneNum.length === 10 && (this.state.phoneNum).toString().slice(0, 2) === "09") {
        const alert = this.props.alert
        alert.show("已成功加入電話號碼")

        this.setState({
          memberLoginFlag: true
        })
      }

      else {
        const alert = this.props.alert
        alert.show("電話號碼格式輸入有誤")
      }

      
    // var request_data = {
    //   "service": "member",
    //   "operation": "get_promotion_info",         //only coupon
    //   "user_phone": this.state.phoneNum
    // }

    // var request_str = dict2urlEncode(request_data)
    // console.log(process.env.REACT_APP_COUPON_URL + '?' + request_str)
      
    // getDataFromServer(process.env.REACT_APP_COUPON_URL + '?' + request_str)
    //   .then((result) => {

    //     console.log(result)

    //     if (result["indicator"]) {

    //       console.log(JSON.parse(result["message"]))

    //       const alert = this.props.alert
    //       alert.show("已成功登入會員")

    //       this.setState({
    //         memberLoginFlag: true
    //       })

    //     }

    //     else {
    //       const alert = this.props.alert
    //       alert.show("請先註冊會員")
    //     }

    //   })
    //   .catch(error => {
    
    //     console.log(error)

    //     this.setState({
    //       errorPage: true
    //     })
    //   })
    }
  }

  stateHandler(e) {
    // console.log(e.target.value)
    this.setState({
      phoneNum: e.target.value
    })
  }

  resetPage() {
    this.setState({
      phoneNum: "",
      memberLoginFlag: false
    })
  }

  render() {

        if (this.state.errorPage) {
          return <Redirect push to="/errorPage" />;
        }
 

        return (
            <div id="spin_page_body" className="spin_layout">
              <button onClick={this.resetPage} id="reset">reset</button>
              <h1>豆日子開幕抽獎活動!</h1>

              <Wheel items={this.places} resetFunc={this.resetPage} loginFlag={this.state.memberLoginFlag} phoneNum={this.state.phoneNum}/>

              <div id="spin_content">
                <div className="input_section">
                  <h3>抽獎電話號碼:</h3>
                  <input value={this.state.phoneNum} type="text" name="username_id" id="username" className="input_text" onChange={this.stateHandler} pattern="\d*" inputMode="numeric" autoComplete="off"/>
                  <br />
                </div>
                <p className="side_info">
                  活動辦法:
                  <br />
                  凡在4/8-4/16現場消費滿100元之
                  <br />
                  豆日子會員(可現場加入會員)，可
                  <br />
                  享有一次抽獎機會，獎項包含免費
                  <br />
                  贈100天豆花電子券，數量有限，
                  <br />
                  至抽完為止。
                  <br />
                </p>
                <button className="submit_btn" onClick={this.memberHandler}>確認電話號碼</button>
              </div>

              
            </div>
      
        );}
}

export default withAlert()(SpinPage);
