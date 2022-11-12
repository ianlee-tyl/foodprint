import React, { Component } from 'react';
import { Redirect } from 'react-router';
// import { Link } from 'react-router-dom';
// import { FullScreen, useFullScreenHandle } from "react-full-screen"

// import '../css/info_page.css';
// import { setCookie, getCookie } from '../cookie_utils.js'



class ErrorPage extends Component {

  constructor(props) {
    super(props);

    this.state = {
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
            <div id="body">
              <div className="display_layout yellow_bg" id="info_bg">
                
                
                <img id="logo" src="../image/doday_logo.png" alt="doday_logo"/>

                <div className="info_block">

                  <div className="info_word">
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <h3>系統異常，</h3>
                    <br/>
                    <br/>
                    <h3>請重新再試。</h3>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                  </div>
                </div>
              </div>
              <div className="return_member" onClick={this.returnMemberPage}>
                <h6>X</h6>
              </div>

            </div>
      
        );}
}

export default ErrorPage;
