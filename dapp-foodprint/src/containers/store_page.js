import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';

import { withAlert } from 'react-alert'

// import styles from '../css/main.css';
import { init_cart_and_device_key } from '../http_utils.js'
import { setCookie } from '../cookie_utils.js'

class StorePage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      switchPageFlag: false
    }

    setCookie("store_id", "", 1)
    setCookie("itemsTotalPrice", 0, 1)
    setCookie('shoppingCartItems', "", 1)

    // localStorage.clear();

    this.storeOnClicked = this.storeOnClicked.bind(this)
  }

  storeOnClicked(e, data) {
    setCookie("store_id", data, 1)
    init_cart_and_device_key(process.env.REACT_APP_SERVER_URL)
    setCookie("promotion_key", "", 1)

    if (data === "DDC") {
      document.documentElement.style.setProperty('--main-color', '#d4b290');
      document.documentElement.style.setProperty('--sub-color', '#3d3d3d');
      document.documentElement.style.setProperty('--light-color', '#F5DC9B');
      document.documentElement.style.setProperty('--dark-color', '#d4b290');
      document.documentElement.style.setProperty('--grey-color', '#2d2d2d');
      document.documentElement.style.setProperty('--red-color', '#DB5531');
      document.documentElement.style.setProperty('--middle-grey-color', '#a1a1a1');
    }
    else {
      document.documentElement.style.setProperty('--main-color', '#efad00');
      document.documentElement.style.setProperty('--sub-color', '#ffffff');
      document.documentElement.style.setProperty('--light-color', '#F5DC9B');
      document.documentElement.style.setProperty('--dark-color', '#101820');
      document.documentElement.style.setProperty('--grey-color', '#f1f1f1');
      document.documentElement.style.setProperty('--red-color', '#DB5531');
      document.documentElement.style.setProperty('--middle-grey-color', '#a1a1a1');

    }

    this.setState({
      switchPageFlag: true
    })
  }

  gettronweb = async (e) => {
      if(window.tronWeb && window.tronWeb.defaultAddress.base58){
          let walletBalances = await window.tronWeb.trx.getAccount(
            window.tronWeb.defaultAddress.base58
          );
          alert("Connected to TRON account. Account balance: "+walletBalances["balance"]/1e6 + "TRX")
          this.storeOnClicked(e, "DDE")
      }else{
        alert("Cannot connect to a TRON account...")
      }
  }

  render() {   
        if (this.state.switchPageFlag) {
          return <Redirect push to="/menuPage" />;
        } 

        return (           
            <div id="body">
              <div className="container padding_top" id="bg_pic">

                <div className="small_btn_holder">
                  
                  <button onClick={(e) => this.gettronweb(e)}>
                    <h1>Customer</h1>
                  </button>
                  
                </div>
                  
                <div className="small_btn_holder">
                  
                  <button onClick={(e) => this.storeOnClicked(e, "DDG")}>
                    <h1>Vendor</h1>
                  </button>
                  
                </div>

                {/*<div className="btn_holder">
                  
                  <button onClick={(e) => this.storeOnClicked(e, "DDC")}>
                    <h1>南山店</h1>
                    <p>松智路17號微風南山B1</p>
                  </button>
                  
                </div>*/}

              </div>
            </div>
      
        );}
}

export default withAlert()(StorePage);
