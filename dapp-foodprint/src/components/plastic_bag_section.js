import React, { Component } from 'react'

import RadioBtn from '../components/radio_btn.js'

class PlasticBagSection extends Component {
    constructor(props) {
        super(props)
        this.state = {
          choice_type: this.props.choice_type,
          single_class: this.props.single_class,
          sectionContent: ["1元袋", "2元袋"],
          checkedStatus: [false, false],
          additionPrice: 0
        }
        // console.log(props, this.state)

        this.handleChange = this.handleChange.bind(this)

    }

    handleChange(data, index){

      // console.log(data, index)

      var temp_checkedStatus = this.state.checkedStatus

      if (temp_checkedStatus[index]) {
          temp_checkedStatus[index] = false
          this.setState({
              checkedStatus: temp_checkedStatus,
              additionPrice: 0
          }, () => {
              if (this.props.onChange) {
                  this.props.onChange(this.state.additionPrice, "plastic_bag_fee", "");
              }    
          })
      }
      else {
          for (var i = 0; i < temp_checkedStatus.length; i++) {
              temp_checkedStatus[i] = false
          }

          temp_checkedStatus[index] = !temp_checkedStatus[index]
          this.setState({
              checkedStatus: temp_checkedStatus,
              additionPrice: parseInt(data)
          }, () => { 
              if (this.props.onChange) {
                  this.props.onChange(this.state.additionPrice, "plastic_bag_fee", "");
              }     
          })
      }

      // console.log(temp_checkedStatus)
    }
    
    render() {

        return (
            <div>
                <div className="check_list_title">
                  <h2>請選擇是否購買塑膠袋</h2>
                </div>

                <div>
                  {this.state.sectionContent.map((item, index) => <RadioBtn index={index} choice_type={this.state.choice_type} key={item} itemKey={item} itemContent={item} checkedStatus={this.state.checkedStatus[index]} onChange={this.handleChange}/>)}
                </div>
            </div>
            
            
        );
    }
}

export default PlasticBagSection;