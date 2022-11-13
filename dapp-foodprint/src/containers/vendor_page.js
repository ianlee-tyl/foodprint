import React, { Component } from 'react';
import Modal from '../components/modal';

// import { Link } from 'react-router-dom';
// import { Redirect } from 'react-router';

import { withAlert } from 'react-alert'

// import styles from '../css/main.css';
// import { init_cart_and_device_key } from '../http_utils.js'
// import { setCookie } from '../cookie_utils.js'


class VendorPage extends Component {

    constructor(props) {
        super(props);

        this.data = {

        }

        this.state = {
            vendorInventory: [],
            switchPageFlag: false,
            isOpened: false,
        }
        // this.viewMeals = this.viewMeals.bind(this);
        this.childToParent = this.childToParent.bind(this);
    }

    // viewMeals(e) {
    //     for 

    // }

    childToParent = (childData) => {
        console.log(childData);
        console.log(this.state.vendorInventory);
        this.setState(prevState => ({ vendorInventory: [...prevState.vendorInventory, childData] }))
    }

    render() {
        return (
            <div id="body">
                <div className="small_btn_holder">

                    <button>
                        {/* onClick={(e) => this.viewMeals(e)} */}
                        <h1>View Meals</h1>
                    </button>

                </div>
                <Modal childToParent={this.childToParent} />
            </div>
        );
    }
}

export default withAlert()(VendorPage);