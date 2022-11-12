import { dict2urlEncode, awaitHttpGet } from './http_utils.js'
import { getCookie } from './cookie_utils.js'

export async function set_available_time(flag){
	/*
	This is the function to set the available time
	for the delivery and togo time. 
	*/

	var request_data;
	var request_str;
	var response_text;

	if (flag === "delivery") {
		// delivery time
		request_data = {
			"service": "menu",
			"operation": "get_available_delivery_time", 
			"store_id": getCookie("store_id")
		}

		request_str = dict2urlEncode(request_data)
		response_text = await awaitHttpGet(process.env.REACT_APP_SERVER_URL+"?"+request_str);
	}

	else if (flag === "togo") {
		// togo time
		request_data = {
			"service": "menu",
			"operation": "get_available_takeout_time", 
			"store_id": getCookie("store_id")
		}

		request_str = dict2urlEncode(request_data)
		response_text = await awaitHttpGet(process.env.REACT_APP_SERVER_URL+"?"+request_str);
	}

	// console.log(response_text)

	var time = JSON.parse(response_text);
	
	return time;

}

export var PAY_ONLINE = "線上付款(LinePay)"
export var PAY_MONEY = "貨到付款(現金)"
export function online_or_local(stayOrTogo, paymentMethod){
	/*
		return: online or local
	*/

	if (stayOrTogo === "delivery") {

		if (paymentMethod === PAY_MONEY) {
			return "pay-on-arrival"
		}

		else if (paymentMethod === PAY_ONLINE) {
			return "online-pay"
		}

	}

	else if (getCookie("store_id") === "DDC") {
		return "pay-on-arrival"
	}
	
	else {
		return "online-pay"
	}

}


