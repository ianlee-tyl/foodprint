import React, { Component } from 'react';
import { Redirect } from 'react-router';
// import { Link } from 'react-router-dom';
// import { FullScreen, useFullScreenHandle } from "react-full-screen"
import { postDataFromServer, dict2urlEncode, getDataFromServer } from '../http_utils.js'
import '../css/main.css';
import { getCookie } from '../cookie_utils.js'



class InfoPage extends Component {

  constructor(props) {
    super(props);

    const current_order_id = new URLSearchParams(this.props.location.search).get("orderId")
    const transactionId = new URLSearchParams(this.props.location.search).get("transactionId")
    const linepay_status = new URLSearchParams(this.props.location.search).get("linepay_status")

    this.returnMemberPage = this.returnMemberPage.bind(this)

    if (linepay_status) {
      if (linepay_status==="0000"){

        this.state = {
          pay_method: "line",
          switchPageFlag: false,
          order_id: current_order_id.slice(-4),
          order_status: linepay_status
        }

        var request_data = {"service":"order","operation":"line_pay_success","orderId":current_order_id,"transactionId":transactionId}
        var request_str = dict2urlEncode(request_data)

        getDataFromServer(process.env.REACT_APP_SERVER_URL + '?' + request_str, false, false)
            .then(result => {
              if (result["indicator"]){
                alert("Line端付款驗證成功。")
              }
              else{
                alert("Line端付款驗證有誤，請洽詢商家。")

              }

            })
        }

      else{

        alert("未完成付款，請重新訂購")

      }
    }
    else {
      this.state = {
        pay_method: "cash",
        switchPageFlag: false,
        order_id: getCookie('shopping_id')
      }
    }

    // setTimeout(this.returnMemberPage, 3000);
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
            <div id="body">
              <div className="display_layout yellow_bg" id="info_bg">
                
                
                <img id="logo" src="../image/doday_logo.png" alt="doday_logo" />

                <div className="info_block">

                { this.state.pay_method === "cash" ? 

                (<div className="info_word">
                    <h3>你已完成購買，</h3>
                    <br/>
                    <h3>訂單編號是</h3>
                    <br/>
                    <div id="order_num">{this.state.order_id}</div>
                    <br/>
                    <h3>若要查詢狀態請至首頁查詢。</h3>
                    <br/>
                    <h3>豆日子祝你有愉快的一天!</h3>
                  </div>) : (
                    <>
                    { this.state.order_status === "0000" ? 
                      (<div className="info_word">
                        <h3>你已完成購買，</h3>
                        <br/>
                        <h3>訂單編號是</h3>
                        <br/>
                        <div id="order_num">{this.state.order_id}</div>
                        <br/>
                        <h3>若要查詢狀態請至首頁查詢。</h3>
                        <br/>
                        <h3>豆日子祝你有愉快的一天!</h3>
                      </div>) : (
                      <div className="info_word">
                      <br/>
                      <br/>
                      <br/>
                      <br/>
                      <h3>付款失敗</h3>
                      <br/>
                      <h3>請再試一次。</h3>
                      </div>
                      )
                    }</>


                  )}

                

                  

                </div>
              </div>
              <div className="return_member" onClick={this.returnMemberPage}>
                <h6>X</h6>
              </div>

            </div>
      
        );}
}

export default InfoPage;
