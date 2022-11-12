# API Usage (Updated 2021.08.05)
The following listed all the API used in this program, categorized with services. 

## Order Service

	var request_data = {
	  "operation": "get_status_by_serial_number",
	  "service": "order",
	  "store_id": "DDA",
	  "serial_number": "5001",
	  "user_phone": "0983030465" // Default to be 'None'
	}


	var request_data = {
		"service": "order",
		"operation": "add_cookie_order_mapping",
		"cart_id": getCookie("cart_id"),
		"device_key": getCookie("device_key"),
		"cookie_key": getCookie("cookie_key"),
		"cookie_value": datalist
		}


	var request_data = {
	        "service": "order",
	        "operation": "new_cart",
	        "device_key": dkey
	    }


	var request_data = {
				"service": "order",
				"operation": "get_cookie_value_from_list",
				"cart_id": getCookie("cart_id"),
				"device_key": getCookie("device_key"),
				"cookie_key_list": JSON.stringify(datalist)
			}


	var request_data = {
	          "service": "order",
	          "operation": "execute_promotion",
	          "name1": order_d_list[0],
	          "name2": order_d_list[1],
	          "name3with4": order_d_list[3],
	          "number_of_data": order_d_list[4].toString(),
	          "price": order_d_list[2],
	          "total_price": this.props.totalPrice,
	          "final_price": order_d_list[2],
	          "promotion_key": p_key,
	          "payment_method": "online",
	          "store_id": process.env.REACT_APP_STORE_ID,
	          "stayortogo": this.props.stayOrTogo,
	          "comment1": this.props.additionPrice,
	          "comment2": "online",
	          "comment4": {}, //Need these two
	          "comment7": {} //Need these two
	        }


	var request_data = {
	        "service": "order",
	        "operation": "add_to_order", 
	        "name1": category_list,
	        "name2": item_list,
	        "name3with4": addon_list,
	        "name5": comment_list,
	        "number_of_data": number_of_bowl.toString(), 
	        "price": price_list,
	        "total_price": this.state.totalPrice.toString(),
	        "promotion_key": coupon_fee,
	        "final_price": price_list,
	        "payment_method": online_or_local(this.state.stayOrTogo, this.state.extraInfo["payment_method"]),
	        "store_id": getCookie("store_id"),
	        "comment1": this.state.additionPrice["使用之塑膠袋費用:"]["price"].toString(),
	        "comment2": online_or_local(this.state.stayOrTogo, this.state.extraInfo["payment_method"]),   // process.env.REACT_APP_MACHINE_ID,
	        "comment3": this.state.extraInfo["member_phone_num"],
	        "comment4": {"pick_up_time":this.state.extraInfo["time_str"], "phone_number":this.state.extraInfo["phone_num"], "delivery_location":this.state.extraInfo["delivery_location"]+"("+this.state.extraInfo["name"]+")"},
	        "stayortogo": this.state.stayOrTogo,
	        "comment7": {"one_time_code": coupon_fee, "deducted_point": parseInt(this.state.extraInfo["deducted_point"])}     //Need this
	      }


	var request_data = {
	      "service":"order",
	      "operation":"delivery_address_distance_check",
	      "origin":getCookie("store_address"),
	      "destination":take_addr_value
	    }

## Menu Service
The following APIs are without store id info, it needs to include store ID info:
**注意!!**

	var request_data = {
	      "service": "menu",
	      "operation": "get_store_info"
	    }


	var request_data = {
	      "service": "menu",
	      "operation": "get_business_hour"
	    }


	request_data = {
				"service": "menu",
				"operation": "get_available_delivery_time"
			}


	request_data = {
				"service": "menu",
				"operation": "get_available_takeout_time"
			}

The following needs further modifications to switch menus based on store_id. 

	var request_data = {
	      "service": "menu",
	      "operation": "return_menu", 
	      "status": "test", 
	      "store_id": "DDA",
	      "username": "None"
	    }


	var request_data = {
	      "service": "menu",
	      "operation": "return_addons", 
	      "category": itemCategory, 
	      "item": itemName, 
	      "store_id": "DDA",
	      "username": "None"
	    }

## Member Service

	var request_data = {
      "service": "member",
      "operation": "get_promotion_info",         //only coupon
      "user_phone": "0983030465"
    }


	var request_data = {
	        "service": "member",
	        "operation": "get_member_reward_points",         //only reward points
	        "user_phone": getCookie("user_phone")
	      }


	var request_data = {
	          "service": "member",
	          "operation": "return_promotion_name_list",
	          "promotion_list": JSON.stringify(coupon_id_filted)
	        }