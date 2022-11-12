import React, { Component } from 'react'
import { getCookie } from '../cookie_utils.js'

class DetailChoiceItem extends Component {
    constructor(props) {
        super(props)
        // console.log(props)

        this.handleClick = this.handleClick.bind(this)
        this.handleDoubleClick = this.handleDoubleClick.bind(this)

        this.clickedTimeout = null
        this.word = React.createRef();
    }

    handleClick() {
        if (!this.clickedTimeout) {
            this.clickedTimeout = setTimeout(() => {
            this.clickedTimeout = null;

            if (this.props.avail) {
                this.props.onChange(this.word.current.innerText, this.props.index);
            }
            
        }, this.doubleClickTimeout);
    }


    }
    handleDoubleClick() {
        clearTimeout(this.clickedTimeout);
        this.clickedTimeout = null;
        // console.log("Double Click");
    }
    
    render() {

        return (

            <div className={this.props.avail ? "detail_choice_item" : "detail_choice_item doday_not_available"} onClick={this.handleClick}>
                <input readOnly checked={this.props.checkedStatus} type="radio" id={this.props.itemKey} onClick={this.handleDoubleClick} />
                <label ref={this.word} htmlFor={this.props.itemKey}><span className={ getCookie("store_id") === "DDC" ? "ddc_btn_bg" : "btn_bg" }></span>{this.props.itemContent}</label>
            </div>
            
            
        );
    }
}

export default DetailChoiceItem;