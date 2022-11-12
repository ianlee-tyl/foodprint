import React, { Component } from 'react'

import RadioBtn from '../components/radio_btn.js'
import { getSavedValue } from '../cookie_utils.js'

class EatOrTogoSection extends Component {
    constructor(props) {
        super(props)

        this.state = {
          choice_type: this.props.choice_type,
          single_class: this.props.single_class,
          sectionContent: ["外帶自取", "外送"],
          checkedStatus: [false, false]
        }

        if (getSavedValue("stayortogo") === "delivery") {
          this.handleChange("delivery", 1)
        }
        else {
          this.handleChange("外帶自取", 0)
        }

        
        // console.log(props, this.state)

        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(data, index){

      // console.log(data, index)

      var temp_checkedStatus = this.state.checkedStatus;

      if (temp_checkedStatus[index]) {
          temp_checkedStatus[index] = false
          this.setState({
              checkedStatus: temp_checkedStatus
          }, () => {
              this.props.onChange(data)
          })
      }
      else {
          for (var i = 0; i < temp_checkedStatus.length; i++) {
              temp_checkedStatus[i] = false
          }

          temp_checkedStatus[index] = !temp_checkedStatus[index]
          this.setState({
              checkedStatus: temp_checkedStatus
          }, () => { 
              this.props.onChange(data)    
          })
      }
    }
    
    render() {

        return (
            <div>
                <div className="check_list_title">
                  <h2>請選擇用餐方式*</h2>
                </div>

                <div className="eat_or_togo_choice">
                  {this.state.sectionContent.map((item, index) => <RadioBtn index={index} choice_type={this.state.choice_type} key={item} itemKey={item} itemContent={item} checkedStatus={this.state.checkedStatus[index]} onChange={this.handleChange}/>)}
                </div>
            </div>
            
            
        );
    }
}

export default EatOrTogoSection;