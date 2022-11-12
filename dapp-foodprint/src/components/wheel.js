import React, { Component } from 'react'
import { postDataFromServer } from '../http_utils.js'

import { withAlert } from 'react-alert'

// import '../css/wheel.css';

class Wheel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            prize_list: {"頭獎 免費贈100天豆花電子劵": 4, "二獎 免費贈一星期豆花電子劵": 1, "免費贈甜品券一張電子劵": 2, "免費贈豆漿券一張電子劵": 3, "單碗豆花八折券電子劵": 0},
            selectedItem: null,
            color_array: ["#FA9ABA", "#FD7F58", "#E6C741", "#ACD66D", "#969DFF"]
        };
        this.selectItem = this.selectItem.bind(this);
        this.spinWheel = this.spinWheel.bind(this);
    }

    selectItem(e) {
        // console.log(this.props.loginFlag)
        if (this.props.loginFlag) {


            // console.log(this.props.phoneNum)

            e.preventDefault()
            // Trigger a fake click for the tap we just prevented
            // e.target.click()

            if (e.target.disabled === true) {
              const alert = this.props.alert
              alert.show("已送出訂單，請稍候")

            }

            else {

                // console.log("test")

                e.target.disabled = true

                var phoneNum = (this.props.phoneNum).toString()

                var request_data = {
                    "service": "member",
                    "operation": "nanshan_draw",
                    "user_phone": phoneNum
                }

                var request_str = JSON.stringify(request_data)
                
                postDataFromServer("http://192.168.10.177:7060" + '?', request_str)
                    .then((result) => {
                    // console.log(result, result["indicator"], result["message"])

                    this.spinWheel(e, result)

                })
                .catch(error => {

                    // console.log(error)

                    this.setState({
                      errorPage: true
                    })
                })
            }

            







        }
    }

    spinWheel(e, result) {
        if (result["indicator"]) {
                        
            if (this.state.selectedItem === null) {
                const selectedItem = parseInt(this.state.prize_list[result["message"]])
                // const selectedItem = parseInt(Math.floor(Math.random() * 5))
                // console.log(selectedItem)

                if (this.props.onSelectItem) {
                    // console.log(selectedItem)
                    this.props.onSelectItem(selectedItem);
                }
                this.setState({ selectedItem });
                const alert = this.props.alert
                alert.show("恭喜獲得:" + result["message"])
            }
            else {
                // console.log("something weird")
                this.setState({ selectedItem: null });
                setTimeout(() => { this.spinWheel(e, result) } , 100);
            }

            this.props.resetFunc()
            e.target.disabled = false
        }

        else {
            if (result["message"] === "Draw yet") {
                const alert = this.props.alert
                alert.show("此會員帳號已參與過此活動")
            }

            else if (result["message"] === "not in member") {
                const alert = this.props.alert
                alert.show("此帳號並非會員帳號")
            }

            else if (result["message"] === "draw finish") {
                const alert = this.props.alert
                alert.show("獎品已全數送出")
            }

            else {
                const alert = this.props.alert
                alert.show("抽獎程式異常，請洽現場服務人員")
            }
        }
    }

    

    render() {
        const { selectedItem } = this.state;
        const { items } = this.props;

        const wheelVars = {
            '--nb-item': items.length,
            '--selected-item': selectedItem,
        };
        
        const spinning = selectedItem !== null ? 'spinning' : '';

        

        return (
            <div className="wheel-container">
                <div className={`wheel ${spinning}`} style={wheelVars}>
                {items.map((item, index) => (
                    <div className="wheel-item" key={index} style={{ '--item-nb': index, '--random-color': this.state.color_array[index] }}>
                        {item}
                    </div>
                ))}
                </div>
                <span id="arrow">aaa</span>
                <button onClick={this.selectItem} className="spin_btn">SPIN</button>
            </div>
        );
    }
}

export default withAlert()(Wheel);