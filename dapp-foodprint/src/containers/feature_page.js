import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';

import { init_cart_and_device_key } from '../http_utils.js'
import { setCookie, getCookie } from '../cookie_utils.js'


import { withAlert } from 'react-alert'

import '../css/main.css';



class FeaturePage extends Component {

  constructor(props) {
    super(props)

    this.state = {
        ad_pic: "dda_ad"
      }
  }

  componentWillMount() {
    const sp = new URLSearchParams(this.props.location.search);

    if (sp.has("store_id")) {
      setCookie("store_id", sp.get("store_id"), 1)
    }
  }

  componentDidMount() {
    if (getCookie("store_id") !== "") {
      init_cart_and_device_key(process.env.REACT_APP_SERVER_URL)
      setCookie("promotion_key", "", 1)

      if (getCookie("store_id") === "DDC") {
        this.setState({
          ad_pic: "ddc_ad"
        })
        document.documentElement.style.setProperty('--main-color', '#d4b290');
        document.documentElement.style.setProperty('--sub-color', '#3d3d3d');
        document.documentElement.style.setProperty('--light-color', '#F5DC9B');
        document.documentElement.style.setProperty('--dark-color', '#d4b290');
        document.documentElement.style.setProperty('--grey-color', '#2d2d2d');
        document.documentElement.style.setProperty('--red-color', '#DB5531');
        document.documentElement.style.setProperty('--middle-grey-color', '#a1a1a1');
      }

      else {
        this.setState({
          ad_pic: "dda_ad"
        })
        document.documentElement.style.setProperty('--main-color', '#efad00');
        document.documentElement.style.setProperty('--sub-color', '#ffffff');
        document.documentElement.style.setProperty('--light-color', '#F5DC9B');
        document.documentElement.style.setProperty('--dark-color', '#101820');
        document.documentElement.style.setProperty('--grey-color', '#f1f1f1');
        document.documentElement.style.setProperty('--red-color', '#DB5531');
        document.documentElement.style.setProperty('--middle-grey-color', '#a1a1a1');
      }
    }
  }



  render() {
        if (getCookie("store_id") === "") {
          return <Redirect push to="/" />;
        } 

        return (           
            <div id="body">
              <div className="container padding_top" id={this.state.ad_pic}>
                
                <div className="small_btn_holder">
                  <Link to={"/menuPage"}>
                    <button>Start Order</button>
                  </Link>
                </div>
                

                
                <div className="small_btn_holder">
                  <Link to={"/statusPage"}>
                    <button>Order Status</button>
                  </Link>
                </div>
                
                  
              </div>
            </div>
      
        );}
}

export default withAlert()(FeaturePage);
