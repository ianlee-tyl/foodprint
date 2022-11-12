import React, { Component } from 'react'
import { getCookie } from '../cookie_utils.js'

import { withAlert } from 'react-alert'

import InputBtn from '../components/input_btn.js'

class MoreInfoSection extends Component {
    constructor(props) {
        super(props)

        this.state = {
          infoContent: {"selfInfo": {"infoId": ["name", "phone_num"], "infoTitle": ["姓名:", "聯絡電話:"], "infoContent": ["", ""], "infoType": ["input", "input"]}, "member": {"infoId": ["member_phone_num", "coupon_fee"], "infoTitle": ["會員電話:", "優惠券:"], "infoContent": ["", ""], "infoType": ["inputWithBtn", "inputWithBtn"]}, "togo": {"infoId": ["store_id_info", "time_str_togo"], "infoTitle": ["取餐店家: ", "取餐時間:"], "infoContent": [getCookie("store_name"), "togo"], "infoType": ["displayInfo", "inputList"]}, "delivery": {"infoId": ["store_id_info", "delivery_location", "time_str_delivery", "payment_method"], "infoTitle": ["訂購店家: ", "外送地址 (請按「檢查」確認外送地址是否在外送範圍內):", "外送時間:", "付款方式:"], "infoContent": [getCookie("store_name"), "", "delivery", "pay_method"], "infoType": ["displayInfo", "inputWithBtn", "inputList", "inputList"]}},
          displayInfoTitle: [],
          displayInfoContent: [],
          displayInfoType: [],        // "input", "inputWithBtn", "inputList", "inputRadio"
          displayInfoId: [],
        }

        this.stateHandler = this.stateHandler.bind(this)
        this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this)
        this.updateInfo = this.updateInfo.bind(this)

    }

    componentWillReceiveProps(nextProps) {
      // console.log(nextProps.sectionFlag, this.props.sectionFlag)
      const sectionFlag = this.props.sectionFlag
      if (nextProps.sectionFlag !== sectionFlag) {
        this.updateInfo(nextProps.sectionFlag)
      }
    }

    componentDidMount() {
      // console.log(this.props.sectionFlag)
      if (this.props.sectionFlag !== "") {
        this.updateInfo(this.props.sectionFlag)
      }
    }

    updateInfo(infoFlag) {
      this.setState({
        displayInfoTitle: this.state.infoContent[infoFlag]["infoTitle"],
        displayInfoContent: this.state.infoContent[infoFlag]["infoContent"],
        displayInfoType: this.state.infoContent[infoFlag]["infoType"],
        displayInfoId: this.state.infoContent[infoFlag]["infoId"]
      })
    }

    stateHandler(state, info) {
      if (this.props.stateHandler){
        this.props.stateHandler(state, info)
      }
    }

    
    
    render() {

        return (
            <div>
                <div className="check_list_title">
                  <h2>{this.props.section_title}</h2>
                </div>

                <div>
                  {this.state.displayInfoTitle.map((item, index) => <InputBtn listId={this.props.sectionFlag} key={item+index} infoId={this.state.displayInfoId[index]} infoType={this.state.displayInfoType[index]} content={this.state.displayInfoContent[index]} title={item} stateHandler={this.stateHandler} />)}
                </div>

                
            </div>
            
            
        );
    }
}

export default withAlert()(MoreInfoSection);
