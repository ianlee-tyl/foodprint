import React, { useState } from "react";
import "../css/modal.css";

function Modal({ childToParent }) {

    const [modal, setModal] = useState(false);
    const [input, setInput] = useState("");
    const [input2, setInput2] = useState("");

    const toggle = () => {
        setModal(!modal);
    };

    const state = {
        meal_name: '',
        meal_price: ''
    }

    const handleNameChange = (e) => {
        setInput(e.target.value);
    };

    const handlePriceChange = (e) => {
        setInput2(e.target.value);
    };

    const handleSubmit = (e) => {
        setModal(!modal);
        this.callback({ meal_name: input, meal_price: input2 });
    }

    return (
        <div className="modal0">
            <div className="small_btn_holder">
                <button onClick={toggle}>
                    <h1>Add Meals</h1>
                </button>
            </div>

            {modal && (
                <div className="modal">
                    <div className="overlay">
                        <div className="modal-content">
                            <form onSubmit={() => childToParent({ name: input, price: input2 })}>
                                <label>Meal Name:{' '}
                                    <input type="text" value={input} onChange={handleNameChange} />
                                </label>
                                {' '}
                                <label>Meal Price:{' '}
                                    <input type="text" value={input2} onChange={handlePriceChange} />
                                </label>
                                <button type="submit">Submit</button>
                            </form>

                        </div>
                        <button className="close-modal" onClick={toggle}>
                            CLOSE
                        </button>
                    </div>
                </div>
            )}
        </div>


    );
}


export default Modal;