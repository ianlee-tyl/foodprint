import React, { Component } from 'react';
import { Redirect } from 'react-router';
// import { Link } from 'react-router-dom';
// import { FullScreen, useFullScreenHandle } from "react-full-screen"

import { withAlert } from 'react-alert'

// import '../css/member_page.css';
import { getDataFromServer, dict2urlEncode } from '../http_utils.js'
import { getCookie } from '../cookie_utils.js'



class StatusPage extends Component {

  constructor(props) {
    super(props);

    // this.fullscreen = React.createRef()
    


    this.state = {
      orderId: "",
      phoneNum: "",
      switchPageFlag: false,
      errorPage: false
    };

    this.handleSubmit = this.handleSubmit.bind(this)
    this.stateHandler = this.stateHandler.bind(this)
  }

  handleSubmit(e) {

    // console.log(e.target.innerText, Number.isInteger(parseInt(this.state.phoneNum)), Number.isInteger(parseInt(this.state.orderId)))

    if (this.state.phoneNum === "" || this.state.orderId === "") {
      const alert = this.props.alert
      alert.show("請輸入電話號碼和訂單編號")
    }

    else if (!Number.isInteger(parseInt(this.state.phoneNum)) || !Number.isInteger(parseInt(this.state.orderId))) {
      const alert = this.props.alert
      alert.show("格式錯誤，請確實輸入電話號碼和訂單編號")
    }

    else {
        var request_data = {
          "operation": "get_status_by_serial_number",
          "service": "order",
          "store_id": getCookie("store_id"),
          "serial_number": this.state.orderId,
          "user_phone": this.state.phoneNum // Default to be 'None'
        }

        var request_str = dict2urlEncode(request_data)
        // console.log(process.env.REACT_APP_SERVER_URL + '?' + request_str)

        var url = "";
        url = process.env.REACT_APP_SERVER_URL
        
        getDataFromServer(url + '?' + request_str)
          .then((result) => {

            // console.log(result)

            if (result["indicator"]) {
              this.props.history.push({
                pathname: '/statusResultPage',
                state: [{"message": result["message"], "url": result["url"]}]
              })
            }

            else {
              const alert = this.props.alert
              alert.show("資料錯誤，請重新再試")
            }

          })
          .catch(error => {
        
            // console.log(error)

            const alert = this.props.alert
            alert.show("資料錯誤，請重新再試")

            
          })
    }
    

  }

  stateHandler(e) {
    // console.log(e.target.id, e.target.value)
    

    if (e.target.id === "order_id") {
      this.setState({
        orderId: e.target.value
      })
    }

    else if (e.target.id === "phonenum") {
      this.setState({
        phoneNum: e.target.value
      })
    }

    
  }


  render() {
        if (getCookie("store_id") === "") {
          return <Redirect push to="/" />;
        } 

        if (this.state.switchPageFlag) {
          return <Redirect push to="/menuPage" />;
        }

        if (this.state.errorPage) {
          return <Redirect push to="/errorPage" />;
        }
                

        return (           
            <div id="body">
              <div className="container display_center" id="bg_pic">
                
                <div id="content">
                  <div className="input_section">
                    <h3>訂單編號:</h3>
                    <input type="text" name="order_id" id="order_id" className="input_text" onChange={this.stateHandler} pattern="\d*" inputMode="numeric" autoComplete="off"/>
                    <br />
                    <h3>電話號碼:</h3>
                    <input type="text" name="phonenum" id="phonenum" className="input_text" onChange={this.stateHandler} pattern="\d*" inputMode="numeric" autoComplete="off"/>
                    <br />
                    <button className="submit_btn" onClick={this.handleSubmit}>查詢訂單</button>
                  </div>
                  
                </div>
              </div>
            </div>
      
        );}
}

export default withAlert()(StatusPage);
