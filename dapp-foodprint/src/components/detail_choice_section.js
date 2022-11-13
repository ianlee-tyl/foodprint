import React, { Component } from 'react'

import { withAlert } from 'react-alert'

import DetailChoiceItem from './detail_choice_item.js'

class DetailChoiceSection extends Component {
    constructor(props) {
        super(props)
        // console.log(props)

        var checked_list = []

        checked_list = new Array(this.props.sectionContent.length).fill(false)

        this.state = {
            shoppingList: [],
            checkedStatus: checked_list,
            addonsPrice: 0,
            availList: this.props.sectionAvail,
            conditionalItem: {},
            conditionalFlag: this.props.condFlag,
            numberLimit: 10
        }

        this.eventhandler = this.eventhandler.bind(this)
        this.handleConditionals = this.handleConditionals.bind(this)

        this.handleConditionals()
    }



    handleConditionals() {
        
        for (var i = 0; i < this.props.conditionals.length; i++) {

            // console.log(this.props.sectionTitle, this.props.conditionals, this.props.conditionals[i][2], this.props.conditionals[i][2].includes(this.props.sectionTitle))

            if (this.props.conditionals[i][0].includes(this.props.sectionTitle)) {
                // find whether the item is the "if" condition
                for (var j = 0; j < this.props.conditionals[i][0].length; j++) {
                    // console.log(j, this.props.sectionTitle, this.props.conditionals[i][0])
                    if (this.props.sectionTitle === this.props.conditionals[i][0][j]) {

                        this.setState({
                            conditionalItem: this.props.conditionals[i][1][j].reduce((acc,curr)=> (acc[curr] = {"sec": this.props.conditionals[i][2], "val": this.props.conditionals[i][3]}, acc), this.state.conditionalItem)
                        })
                        
                        break
                        
                    }
                }
            }

            else if (this.props.conditionals[i][2].includes(this.props.sectionTitle)) {
                // find whether the item is the "action" condition, and set avail false to all action
                // (default: didn't select anything)

                var temp_conditionalFlag = this.state.conditionalFlag
                for (var l = 0; l < this.props.conditionals[i][2].length; l++) {
                    // console.log(this.props.sectionTitle, this.props.conditionals[i][2])
                    if (this.props.sectionTitle === this.props.conditionals[i][2][l]) {

                        for (var k = 0; k < this.props.conditionals[i][3][l].length; k++) {
                            // console.log(this.props.conditionals[i][3][l][k])
                            temp_conditionalFlag[this.props.sectionContent.indexOf(this.props.conditionals[i][3][l][k])] = false
                            
                        }
                        
                        this.setState({
                            conditionalFlag: temp_conditionalFlag
                        })

                        break
                        
                    }
                }
            }

            


        }

        
        
    }

    eventhandler(data, index) {

        var cond = {}
        var temp_checkedStatus = this.state.checkedStatus

        if (Object.keys(this.state.conditionalItem).includes(data)) {
            cond = this.state.conditionalItem[data]
        }

        if (this.props.sectionType === "single") {

            if (temp_checkedStatus[index]) {
                temp_checkedStatus[index] = false
                this.setState({
                    shoppingList: [],
                    checkedStatus: temp_checkedStatus,
                    addonsPrice: 0
                }, () => {
                    this.sendData(this.state.shoppingList, this.props.sectionTitle, this.state.addonsPrice, cond)
                })
            }
            else {
                for (var i = 0; i < temp_checkedStatus.length; i++) {
                    temp_checkedStatus[i] = false
                }

                temp_checkedStatus[index] = !temp_checkedStatus[index]
                this.setState({
                    shoppingList: new Array(1).fill(data),
                    checkedStatus: temp_checkedStatus,
                    addonsPrice: this.findAddonPrice(data)
                }, () => { 
                    // console.log("2", this.state.shoppingList)
                    this.sendData(this.state.shoppingList, this.props.sectionTitle, this.state.addonsPrice, cond)
                })
            }
            
        }
        else {

            var temp = this.state.shoppingList
    
            if (this.state.shoppingList.length < this.state.numberLimit || temp_checkedStatus[index]) {
                temp_checkedStatus[index] = !temp_checkedStatus[index]
                var addonsItemPrice = this.state.addonsPrice

                if (temp_checkedStatus[index]) {
                    temp.push(data)
                    addonsItemPrice += this.findAddonPrice(data)
                }
                else {
                    temp = temp.filter(e => e !== data)
                    addonsItemPrice -= this.findAddonPrice(data)
                }

                this.setState({
                    shoppingList: temp,
                    checkedStatus: temp_checkedStatus,
                    addonsPrice: addonsItemPrice
                }, () => {
                    this.sendData(this.state.shoppingList, this.props.sectionTitle, this.state.addonsPrice, cond)
                })
            }
            else {
                const alert = this.props.alert
                alert.show("Over the limit")
            }

            
        }
        
    }
    
    sendData(dataList, dataTitle, dataPrice, cond) {
        if (this.props.onChange) {
            this.props.onChange(dataList, dataTitle, dataPrice, cond);
        }
    }

    findAddonPrice(addonStr) {
        var words = addonStr.split("+")

        if (words.length > 1) {
            return (parseInt(words[1].slice(0, words[1].length - 1)))
        }
        else {
            return 0
        } 
    }

    render() {


        return (
        
            <div>
                <div className="detail_title">
                    <h2>{this.props.sectionTitle}</h2>
                </div>
                <div className="detail_choice">
                    {this.props.sectionContent.map((item, index) => 
                        <DetailChoiceItem index={index} key={this.props.sectionTitle+item} itemKey={this.props.sectionTitle+item} itemContent={item} footprint={this.props.sectionFootprint[index]} itemType={this.props.sectionType} checkedStatus={this.state.checkedStatus[index]} avail={true} onChange={this.eventhandler}/>
                    )}
                </div>
            </div>
            
            
            
        );
    }
}

export default withAlert()(DetailChoiceSection);