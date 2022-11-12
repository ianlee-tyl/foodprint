import React, { Component } from 'react'
import { PAY_MONEY, PAY_ONLINE, set_available_time } from '../shopping_cart_utils.js'
import { getSavedValue, getCookie } from '../cookie_utils.js'

class InputBtn extends Component {
    constructor(props) {
        super(props)
        // console.log(getSavedValue(this.props.infoId), this.props.infoId)

        this.state = {
            list_content: [],
            valSelected: getSavedValue(this.props.infoId),
            extraClass: ""
        }

        this.btnRef = React.createRef()

        this.handleState = this.handleState.bind(this)
        this.handleBtnSubmit = this.handleBtnSubmit.bind(this)

    }

    componentDidMount() {
        if (this.props.infoType === "inputList") {
            if (this.props.content === "pay_method") {

                if (getCookie("store_id") === "DDC") {
                    this.setState({
                        valSelected: "-----",
                        list_content: ["-----", PAY_MONEY]
                    })
                }
                else {
                    this.setState({
                        valSelected: "-----",
                        list_content: ["-----", PAY_MONEY, PAY_ONLINE]
                    })
                }

                
            }
            else if (this.props.content !== "") {
                set_available_time(this.props.listId).then(result => {

                    //parse into list
                    result = JSON.parse(result)

                    if ((!getSavedValue(this.props.infoId) && result.length > 0) || !result.includes(getSavedValue(this.props.infoId))) {
                        // console.log("1111111111")

                        this.setState({
                            valSelected: this.state.list_content[0],
                            list_content: result
                        })
                    }
                    else {
                        // console.log("22222222222")
                        this.setState({
                            valSelected: getSavedValue(this.props.infoId),
                            list_content: result
                        })
                    }

                    
                })
            }
        }

    }

    handleState(e){
        if (this.props.infoType === "inputList") {
            this.setState({
                valSelected: e.target.value
            })
        }
        if (this.props.stateHandler) {
            this.props.stateHandler(this.props.infoId, e.target.value);
        }
    }

    handleBtnSubmit(e){
        this.props.stateHandler(this.props.infoId, this.btnRef.current.value);
    }

    
    
    render() {

        if (this.props.infoType === "input") {
            return (
                <div className={"more_info inputSection " + this.state.extraClass}>
                    <h5 className={"float_left " + this.state.extraClass}>{this.props.title}</h5>
                    <input type="text" className="float_right" onChange={this.handleState} defaultValue={getSavedValue(this.props.infoId)} />
                </div>
            );
        }

        else if (this.props.infoType === "displayInfo") {
            return (
                <div className={"more_info displayInfo " + this.state.extraClass}>
                    <h5 className={"float_left " + this.state.extraClass}>{this.props.title}</h5>
                    <h6 className={"float_right " + this.state.extraClass}>{this.props.content}</h6>
                </div>
            );
        }

        else if (this.props.infoType === "inputWithBtn") {
            return (
                <div className={"more_info inputWithBtn " + this.state.extraClass}>
                    <h5 className={"float_left " + this.state.extraClass}>{this.props.title}</h5>
                    <input ref={this.btnRef} type="text" onChange={this.handleState} className="float_right" defaultValue={getSavedValue(this.props.infoId)} />
                    <button className="float_right" id="confirm" onClick={this.handleBtnSubmit}>確認</button>
                </div>
            );
        }

        else if (this.props.infoType === "inputList") {
            return (
                <div className={"more_info inputList " + this.state.extraClass}>
                    <h5 className={"float_left " + this.state.extraClass}>{this.props.title}</h5>
                    <select className="select_box float_right" onChange={this.handleState} value={this.state.valSelected} >
                        {this.state.list_content.map((item) => <option key={item} value={item}>{item}</option>)}
                        }
                
                    </select>
                </div>
            );
        }

        else {
            return (
                <div className="more_info">
                    <h5 className="float_left">{this.props.title}</h5>
                    <h5 className="float_right">{this.props.content}</h5>
                </div>
            );
        }

        
    }
}

export default InputBtn;