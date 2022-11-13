import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import { getDataFromServer, dict2urlEncode, makeid, postDataFromServer, generate_datalist } from '../http_utils.js'
import { setCookie, getCookie } from '../cookie_utils.js'
import { postOrderInfo, setOrderContract, getTronWeb, fetchAllOrders } from '../tron.js'

import { withAlert } from 'react-alert'

import DetailChoiceSection from "../components/detail_choice_section.js"

import '../css/main.css';

const menu_to_ingredients_dict = {
  "Classic Burger" : ["breads", "vegetables", "leafy vegetables", "protein", "cheeses"],
  "Poke Bowl" : ["grains", "protein", "vegetables", "cheeses"],
  "Salad" : ["leafy vegetables", "protein", "vegetables", "cheeses", "seeds nuts"],
  "Parfait" : ["yogurt", "fruits", "seeds nuts", "spreads"],
  "Fruit Salad" : ["fruits", "spreads"],
  "Coffee" : ["hot drinks", "milks", "sweetener"]
}

var detail_info = {
    "fruits": {
        "Apples": {
            "emission_per_cal": 0.9,
            "calories": 95.0,
            "amount": "1",
            "serving_portion": 0.5
        },
        "Bananas": {
            "emission_per_cal": 0.88,
            "calories": 111.0,
            "amount": "1",
            "serving_portion": 0.5
        },
        "Grapes": {
            "emission_per_cal": 12.67,
            "calories": 104.0,
            "amount": "1 cup",
            "serving_portion": 0.5
        },
        "Kiwis": {
            "emission_per_cal": 2.8,
            "calories": 112.0,
            "amount": "1",
            "serving_portion": 0.5
        },
        "Oranges": {
            "emission_per_cal": 1.08,
            "calories": 47.0,
            "amount": "1",
            "serving_portion": 0.5
        },
        "Pears": {
            "emission_per_cal": 1.66,
            "calories": 101.0,
            "amount": "1",
            "serving_portion": 0.5
        },
        "Raspberries": {
            "emission_per_cal": 24.61,
            "calories": 64.0,
            "amount": "1 cup",
            "serving_portion": 1.0
        },
        "Strawberries": {
            "emission_per_cal": 5.18,
            "calories": 49.0,
            "amount": "1 cup",
            "serving_portion": 1.0
        },
        "Pineapple": {
            "emission_per_cal": 1.94,
            "calories": 453.0,
            "amount": "1",
            "serving_portion": 0.125
        }
    },
    "vegetables": {
        "Avocados": {
            "emission_per_cal": 1.85,
            "calories": 320.0,
            "amount": "1",
            "serving_portion": 0.5
        },
        "Carrots": {
            "emission_per_cal": 2.33,
            "calories": 25.0,
            "amount": "1",
            "serving_portion": 0.5
        },
        "Cherry tomatoes": {
            "emission_per_cal": 12.17,
            "calories": 20.0,
            "amount": "1",
            "serving_portion": 5.0
        },
        "Limes": {
            "emission_per_cal": 1.42,
            "calories": 20.0,
            "amount": "1",
            "serving_portion": 0.25
        },
        "Mushrooms": {
            "emission_per_cal": 7.88,
            "calories": 1.0,
            "amount": "1",
            "serving_portion": 3.0
        },
        "Onions": {
            "emission_per_cal": 1.01,
            "calories": 34.0,
            "amount": "1",
            "serving_portion": 0.125
        },
        "Peppers": {
            "emission_per_cal": 2.72,
            "calories": 20.0,
            "amount": "1",
            "serving_portion": 0.5
        },
        "Sweetcorn": {
            "emission_per_cal": 1.29,
            "calories": 562.0,
            "amount": "1 cup",
            "serving_portion": 0.5
        },
        "Tomatoes": {
            "emission_per_cal": 11.73,
            "calories": 20.0,
            "amount": "1",
            "serving_portion": 0.125
        },
        "Cucumber": {
            "emission_per_cal": 4.12,
            "calories": 66.0,
            "amount": "1",
            "serving_portion": 0.25
        }
    },
    "leafy vegetables": {
        "Kale": {
            "emission_per_cal": 2.64,
            "calories": 33.0,
            "amount": "1 cup",
            "serving_portion": 1.0
        },
        "Lettuce": {
            "emission_per_cal": 25.32,
            "calories": 90.0,
            "amount": "1 head",
            "serving_portion": 0.125
        },
        "Spinach": {
            "emission_per_cal": 3.77,
            "calories": 78.0,
            "amount": "1 bunch",
            "serving_portion": 0.25
        }
    },
    "grains": {
        "Rice": {
            "emission_per_cal": 2.05,
            "calories": 757.0,
            "amount": "1 cup",
            "serving_portion": 0.5
        },
        "Quinoa": {
            "emission_per_cal": 0.41,
            "calories": 626.0,
            "amount": "1 cup",
            "serving_portion": 0.5
        }
    },
    "hot drinks": {
        "Coffee": {
            "emission_per_cal": 2.22,
            "calories": 2.0,
            "amount": "1 cup",
            "serving_portion": 1.0
        }
    },
    "milks": {
        "Whole milk": {
            "emission_per_cal": 7.13,
            "calories": 149.0,
            "amount": "1 cup",
            "serving_portion": 0.5
        },
        "Almond milk": {
            "emission_per_cal": 2.22,
            "calories": 40.0,
            "amount": "1 cup",
            "serving_portion": 0.5
        },
        "Coconut milk": {
            "emission_per_cal": 12.85,
            "calories": 552.0,
            "amount": "1 cup",
            "serving_portion": 0.5
        },
        "Oat milk": {
            "emission_per_cal": 1.05,
            "calories": 130.0,
            "amount": "1 cup",
            "serving_portion": 0.5
        },
        "Soy milk": {
            "emission_per_cal": 2.32,
            "calories": 109.0,
            "amount": "1",
            "serving_portion": 0.5
        }
    },
    "cheeses": {
        "Cheddar cheese": {
            "emission_per_cal": 5.41,
            "calories": 89.0,
            "amount": "1",
            "serving_portion": 1.0
        },
        "Cottage cheese": {
            "emission_per_cal": 29.35,
            "calories": 206.0,
            "amount": "1 cup",
            "serving_portion": 0.5
        },
        "Feta cheese": {
            "emission_per_cal": 5.04,
            "calories": 74.0,
            "amount": "1 oz",
            "serving_portion": 0.5
        },
        "Mozzarella cheese": {
            "emission_per_cal": 6.76,
            "calories": 78.0,
            "amount": "1",
            "serving_portion": 1.0
        },
        "Parmesan cheese": {
            "emission_per_cal": 6.37,
            "calories": 22.0,
            "amount": "1 tsp",
            "serving_portion": 2.0
        },
        "Ricotta cheese": {
            "emission_per_cal": 5.2,
            "calories": 428.0,
            "amount": "1 cup",
            "serving_portion": 0.5
        }
    },
    "yogurt": {
        "Yogurt": {
            "emission_per_cal": 3.99,
            "calories": 138.0,
            "amount": "1",
            "serving_portion": 1.0
        }
    },
    "seeds nuts": {
        "Almonds": {
            "emission_per_cal": 0.11,
            "calories": 546.0,
            "amount": "1 cup",
            "serving_portion": 0.125
        },
        "Brazil nuts": {
            "emission_per_cal": 0.38,
            "calories": 872.0,
            "amount": "1 cup",
            "serving_portion": 0.125
        },
        "Cashew nuts": {
            "emission_per_cal": 0.37,
            "calories": 155.0,
            "amount": "1 oz",
            "serving_portion": 1.0
        },
        "Chia seeds": {
            "emission_per_cal": 0.34,
            "calories": 136.0,
            "amount": "1 oz",
            "serving_portion": 1.0
        },
        "Peanuts": {
            "emission_per_cal": 0.57,
            "calories": 828.0,
            "amount": "1 cup",
            "serving_portion": 0.125
        },
        "Pecan nuts": {
            "emission_per_cal": 0.42,
            "calories": 684.0,
            "amount": "1 cup",
            "serving_portion": 0.125
        },
        "Pumpkin seeds": {
            "emission_per_cal": 0.32,
            "calories": 721.0,
            "amount": "1cup",
            "serving_portion": 0.125
        },
        "Sunflower seeds": {
            "emission_per_cal": 0.32,
            "calories": 818.0,
            "amount": "1 cup",
            "serving_portion": 0.125
        },
        "Walnuts": {
            "emission_per_cal": 0.41,
            "calories": 523.0,
            "amount": "1 cup",
            "serving_portion": 0.125
        },
        "Granola": {
            "emission_per_cal": 0.43,
            "calories": 132.0,
            "amount": "1 oz",
            "serving_portion": 4.0
        }
    },
    "breads": {
        "Burger bun": {
            "emission_per_cal": 0.41,
            "calories": 120.0,
            "amount": "1",
            "serving_portion": 1.0
        },
        "Bagels": {
            "emission_per_cal": 0.33,
            "calories": 252.0,
            "amount": "1",
            "serving_portion": 1.0
        },
        "Baguette": {
            "emission_per_cal": 0.38,
            "calories": 164.0,
            "amount": "1",
            "serving_portion": 2.0
        },
        "Sourdough bread": {
            "emission_per_cal": 0.34,
            "calories": 101.0,
            "amount": "1",
            "serving_portion": 2.0
        }
    },
    "protein": {
        "Bacon": {
            "emission_per_cal": 6.82,
            "calories": 106.0,
            "amount": "1",
            "serving_portion": 1.0
        },
        "Beef mince": {
            "emission_per_cal": 47.34,
            "calories": 172.0,
            "amount": "1",
            "serving_portion": 1.0
        },
        "Chicken breast": {
            "emission_per_cal": 5.83,
            "calories": 344.0,
            "amount": "1",
            "serving_portion": 1.0
        },
        "Chicken wings": {
            "emission_per_cal": 4.65,
            "calories": 77.0,
            "amount": "1",
            "serving_portion": 5.0
        },
        "Pork sausages": {
            "emission_per_cal": 3.66,
            "calories": 130.0,
            "amount": "1",
            "serving_portion": 1.0
        },
        "Salmon": {
            "emission_per_cal": 5.95,
            "calories": 367.0,
            "amount": "0.5",
            "serving_portion": 1.0
        },
        "Tofu": {
            "emission_per_cal": 0.54,
            "calories": 94.0,
            "amount": "0.5 cup",
            "serving_portion": 2.0
        },
        "Tuna": {
            "emission_per_cal": 9.97,
            "calories": 203.0,
            "amount": "0.5",
            "serving_portion": 1.0
        },
        "Eggs": {
            "emission_per_cal": 2.77,
            "calories": 58.0,
            "amount": "1",
            "serving_portion": 1.0
        }
    },
    "sweetener": {
      "Dark chocolate": {
            "emission_per_cal": 3.69,
            "calories": 604.0,
            "amount": "1 bar",
            "serving_portion": 0.5
        },
        "Milk chocolate": {
            "emission_per_cal": 2.21,
            "calories": 37.0,
            "amount": "1 bar",
            "serving_portion": 0.5
        },
        "Cane Sugar": {
            "emission_per_cal": 0.91,
            "calories": 19.0,
            "amount": "1 tbsp",
            "serving_portion": 0.5
        },
        "Sugar": {
            "emission_per_cal": 0.46,
            "calories": 20.0,
            "amount": "1 tsp",
            "serving_portion": 1.5
        }       
    },
    "spreads": {
        "Almond butter": {
            "emission_per_cal": 0.07,
            "calories": 98.0,
            "amount": "1 tbsp",
            "serving_portion": 1.0
        },
        "Apricot jam": {
            "emission_per_cal": 0.76,
            "calories": 50.0,
            "amount": "1 tbsp",
            "serving_portion": 1.0
        },
        "Peanut butter": {
            "emission_per_cal": 0.58,
            "calories": 94.0,
            "amount": "1 tbsp",
            "serving_portion": 1.0
        },
        "Strawberry jam": {
            "emission_per_cal": 1.99,
            "calories": 50.0,
            "amount": "1 tbsp",
            "serving_portion": 1.0
        }
    }
};

class DetailPage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      switchPageFlag: false,
      itemCategory: "",
      itemName: "",
      itemPrice: "",
      itemPic: process.env.PUBLIC_URL + "/image/hamburger.png",
      itemDesc: "",
      extraPrice: {},
      shoppingCartItem: {},
      foodprint_dict: {},
      one_bowl_price: parseInt(0),
      total_price: 0.0,
      total_footprint: 0.0,
      main_menu_amount: 1,
      errorPage: false,
      condFlag: [],
      conditionals: [], //[[['冷熱冰量'], [['熱']], ['附加選項'], [['加薑汁']]]],
      detail_choice: [["multiple", "Add-ons", ["Buns", "Lettuce", "Tomato", "Cheese", "Patty", "Onion", "Chicken"], "must", [true, true, true, true, true, true, true], ["0.1 kg CO2", "0.1 kg CO2", "0.3 kg CO2", "0.3 kg CO2", "0.13 kg CO2", "0.33 kg CO2", "0.3 kg CO2"]]],
      foodprint: []
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.eventhandler = this.eventhandler.bind(this)
    this.findConditionals = this.findConditionals.bind(this)
    this.checkMandatory = this.checkMandatory.bind(this)
    this.findSecNum = this.findSecNum.bind(this)
  }

  formatFloat(a){
    return Math.floor(a*100)/100
  }

  async componentDidMount() {

    if (getCookie('item') !== "" && getCookie("store_id") !== "" && getCookie("device_key") !== "" && getCookie("cart_id") !== "") {

      // get tronWeb object 
      getTronWeb();
    
      // Wait a while to ensure tronweb object has already injected
      setTimeout(async ()=>{
          // init contract object
          await setOrderContract();
          
          console.log("Begin to obtain the orders information");
          // fetch all books
          const orders = await fetchAllOrders();
          console.log("Orders: "+ orders);
          
      },50);

      // await fetch(process.env.PUBLIC_URL + '/image/foodprints_info.json')
      //   .then((response) => response.json())
      //   .then((json) => detail_info = json);

      console.log(detail_info)

      var itemDict = JSON.parse(getCookie('item'))

      var itemCategory = itemDict["detailInfo"].itemCategory
      var itemName = itemDict["detailInfo"].itemName
      var itemPrice = parseFloat(itemDict["detailInfo"].itemPrice)
      var itemPic = itemDict["detailInfo"].itemPic
      var itemDesc = itemDict["detailInfo"].itemDesc

      var detail_choice = [];
      for (var i=0; i<menu_to_ingredients_dict[itemName].length; i++){
        var choices = []
        var avail_flags = []
        var foodprints = []

        var choice_items = Object.keys(detail_info[menu_to_ingredients_dict[itemName][i]])
        for (var j=0; j<choice_items.length; j++){
          choices.push(choice_items[j])
          avail_flags.push(true)

          var item_info = detail_info[menu_to_ingredients_dict[itemName][i]][choice_items[j]]
          foodprints.push(item_info["calories"]+" Cal" +"; "+this.formatFloat(item_info["calories"]*item_info["emission_per_cal"]*item_info["serving_portion"]/1000.0) +" kg CO2 / Cal")
        }
        detail_choice.push(["multiple", menu_to_ingredients_dict[itemName][i], choices, "must", avail_flags, foodprints])
        
      }
      this.setState({
        total_price: itemPrice,
        detail_choice: detail_choice
      })

      // var request_data = {
      //   "service": "menu",
      //   "operation": "return_addons", 
      //   "category": itemCategory, 
      //   "item": itemName, 
      //   "store_id": getCookie("store_id"),
      //   "username": "102"
      // }

      // var request_str = dict2urlEncode(request_data)

      // // console.log(request_str, request_data)

      // getDataFromServer(process.env.REACT_APP_SERVER_URL + '?' + request_str, true)
      //   .then(result => {
      //     // console.log(result)
      //     var conditionals = result.pop()
      //     var condFlag = []

      //     for (var i = 0; i < result.length; i++) {
      //       condFlag.push(new Array(result[i][2].length).fill(true))
      //     }

      //     this.setState({
      //       condFlag: condFlag,
      //       conditionals: conditionals,
      //       detail_choice: result
      //     })
      //   })
      //   .catch(error => {
          
      //     // console.log(error)

      //     this.setState({
      //       errorPage: true
      //     })
      //   })

      this.setState({
        itemCategory: itemCategory,
        itemName: itemName,
        itemPrice: itemPrice,
        itemPic: itemPic,
        itemDesc: itemDesc,
        // one_bowl_price: itemPrice,
        // total_price: ((itemPrice + this.addAllAddonsPrice(this.state.extraPrice)) * this.state.main_menu_amount)
      })

    }


  }

  handleChange() {
    this.setState({
      total_price: ((this.state.one_bowl_price + this.addAllAddonsPrice(this.state.extraPrice)) * this.state.main_menu_amount)
    })
  }

  checkMandatory() {
    for (var i = 0; i < this.state.detail_choice.length; i++) {
      if (this.state.detail_choice[i][3] === "must") {
        if (!Object.keys(this.state.shoppingCartItem).includes(this.state.detail_choice[i][1]) || this.state.shoppingCartItem[this.state.detail_choice[i][1]].length === 0) {
          const alert = this.props.alert
          alert.show("Please select" + this.state.detail_choice[i][1])
          return false
        }
      }
    }

    return true
    
  }

  handleSubmit() {
    console.log(this.state.itemName,this.state.itemDesc, Math.round(this.state.total_footprint*1e6), window.tronWeb.toSun(this.state.total_price));
    postOrderInfo(this.state.itemName,this.state.itemDesc, Math.round(this.state.total_footprint*1e6), window.tronWeb.toSun(this.state.total_price));
  }

  eventhandler(dataList, dataTitle, dataPrice, conditionals) {

    // var temp_extraPrice = this.state.extraPrice
    // var temp_shoppingCartItem = this.state.shoppingCartItem

    // temp_extraPrice[dataTitle] = dataPrice
    // temp_shoppingCartItem[dataTitle] = dataList

    // // console.log("conditionals", conditionals, temp_shoppingCartItem, dataTitle, dataList)
    // if (Object.keys(conditionals).length !== 0) {
    //   for (var i = 0; i < conditionals["sec"].length; i++) {
    //     this.findConditionals(conditionals["sec"][i], conditionals["val"][i])
    //   }
    // }
    console.log(dataTitle)
    var total_foodprint = 0.0
    for (var i = 0; i < dataList.length; i++) {
      var _item_info = detail_info[dataTitle][dataList[i]]
      total_foodprint += _item_info["calories"]*_item_info["emission_per_cal"]*_item_info["serving_portion"]/1000.0
    }

    this.state.foodprint_dict[dataTitle] = total_foodprint
    var tt_foodprint = 0.0
    var keys = Object.keys(this.state.foodprint_dict)
    for (var i = 0; i < keys.length; i++) {
        tt_foodprint += this.state.foodprint_dict[keys[i]]
    }
        
    this.setState({
        total_price: this.state.itemPrice,
        foodprint_dict: this.state.foodprint_dict,
        total_footprint: this.formatFloat(tt_foodprint)
    })
  }

  findSecNum(sec) {

    for (var i = 0; i < this.state.detail_choice.length; i++) {
      if (this.state.detail_choice[i][1] === sec) {
        
        return i
      }
    }
  }

  findConditionals(sec, val) {
    // console.log("sec, val", sec, val)

    var sec_index = this.findSecNum(sec)
    var temp_condFlag = this.state.condFlag

    
    for (var k = 0; k < val.length; k++) {
      temp_condFlag[sec_index][this.state.detail_choice[sec_index][2].indexOf(val[k])] = !temp_condFlag[sec_index][this.state.detail_choice[sec_index][2].indexOf(val[k])]
    }
    

    this.setState({
      condFlag: temp_condFlag
    })
  }

  addAllAddonsPrice(obj) {
    var sum = 0;
    for( var el in obj ) {
      if( obj.hasOwnProperty( el ) ) {
        sum += parseInt( obj[el] )
        // console.log(sum, obj[el], el, obj)
      }
    }
    return sum;
  }




  render() {
        if (getCookie("store_id") === "" || getCookie("item") === "" || getCookie("device_key") === "" || getCookie("cart_id") === "") {
          return <Redirect push to="/" />;
        }

        if (this.state.errorPage) {
          return <Redirect push to="/errorPage" />;
        }
        
        if (this.state.switchPageFlag) {
          return <Redirect push to="/menuPage" />;
        }

        console.log(getCookie("item"))

        return (
          <div id="body">
            <div className="display_layout">
    
              <div className="nav_bar sticky">
                <Link to={"/menuPage"}>
                  <button className="return_btn">{"<Back"}</button>
                </Link>
              </div>

              <div id="scroll_container">

                <div className="header_section">
                  <div className="item_img_holder"> 
                    <img alt="douhua_pic" id="item_img" className="lazyload" src={this.state.itemPic} />
                  </div>
                </div>

                <div className="item_title">
                  <h1 id="item_name">{this.state.itemName}</h1>
                  <h6 id="item_detail">{this.state.itemDesc}</h6>
                </div>

                
                <div id="items_detail_section">
                  {this.state.detail_choice.map((item, index) => 
                    <DetailChoiceSection conditionals={this.state.conditionals} condFlag={this.state.condFlag[index]} key={item[1] + index} sectionType={item[0]} sectionTitle={item[1]} sectionContent={item[2]} sectionMandatory={item[3]} sectionAvail={item[4]} sectionFootprint={item[5]} onChange={this.eventhandler}/>
                  )}
                </div>


                <div className="amount_section">
                  {/*<button id="minus" onClick={() => {
                    if (this.state.main_menu_amount - 1 <= 0){
                      this.setState({ main_menu_amount: 1 }, () => {this.handleChange()})
                    }
                    else {
                      this.setState({ main_menu_amount: this.state.main_menu_amount - 1 }, () => {this.handleChange()})
                    }
                  }}>-</button>
                  <input type="number" id="num" readOnly value={ this.state.main_menu_amount } />
                  <button id="plus" onClick={() => { this.setState({ main_menu_amount: this.state.main_menu_amount + 1 }, () => {this.handleChange()}) }}>+</button>*/}
                </div>

              </div>


              <button className="add_to_cart" onClick={this.handleSubmit}>
                <h5>Add item</h5>
                <h6>$<span id="price">
                  { this.state.total_price }
                </span> <span style={{color: "green", "fontSize": "60%"}}>
                  { "("+this.state.total_footprint+" kg CO2 / Cal)" }
                </span></h6>
              </button>

            </div>
          </div>
      
        );
  }
}




export default withAlert()(DetailPage);
