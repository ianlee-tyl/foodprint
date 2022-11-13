import React, { useState } from "react";
import "../css/modal.css";

function Modal({ childToParent }) {

    const [modal, setModal] = useState(false);
    const [input, setInput] = useState("");
    const [input2, setInput2] = useState("");
    const [input3, setInput3] = useState("")
    const [input4, setInput4] = useState("")

    const toggle = () => {
        setModal(!modal);
    };

    const state = {
        meal_name: '',
        meal_description: '',
        meal_price: '',
        meal_ingredients: null
    }

    const handleNameChange = (e) => {
        setInput(e.target.value);
    };

    const handleDescriptionChange = (e) => {
        setInput2(e.target.value);
    };

    const handlePriceChange = (e) => {
        setInput3(e.target.value);
    };

    const handleIngredientsChange = (e) => {
        setInput4(e.target.value);
    };

    // const [selectedFile, setSelectedFile] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input || !input2 || !input3 || !input4) {
            alert("Please fill out all fields");
        } else if (!/[0-9]/.test(input3)) {
            alert("Please enter a valid price");
        } else {
            setModal(!modal);
            childToParent({ name: input, price: Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(parseFloat(input3)), description: input2, ingredients: input4.split(",") });
        }
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
                            <form onSubmit={(e) => handleSubmit(e)}>
                                <h2>Add a Meal</h2>
                                <label><h3>Meal Name</h3>
                                    <input type="text" value={input} onChange={handleNameChange} />
                                </label>
                                <label> <h3>Meal Description</h3>
                                    <input type="text" value={input2} onChange={handleDescriptionChange} />
                                </label>
                                <label><h3>Meal Price</h3>
                                    <input type="text" value={input3} onChange={handlePriceChange} />
                                </label>
                                <label><h3>Meal Ingredients (comma separated values)</h3>
                                    <input type="text" value={input4} onChange={handleIngredientsChange} />
                                </label>
                                {/* <label><h3>Meal Image</h3>
                                    <input type="file" value={selectedFile} onChange={(e) => {
                                        e.preventDefault();
                                        setSelectedFile(e.target.files[0])
                                    }
                                    } />
                                </label> */}
                                <button type="submit" className="submitButton"><h3>Submit</h3></button>
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