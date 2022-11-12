import { dict2urlEncode, awaitHttpGet } from './http_utils.js'
import { getCookie } from './cookie_utils.js'

export async function prepare_order_data(){

	var order_list_data = getCookie("shoppingCartItems");
	var decode_order_list = order_list_data.split("_")
	var decode_list = await get_cart_item(decode_order_list)

	var order_data_list = []
	var category_list = [];
	var item_list = [];
	var price_list = [];
	var addon_list = [];
	var number_of_bowl = 0;

	for (var i=0; i<decode_list.length; i++){
		// Start idx of douhua name.
		var start_idx = decode_list[i][0].indexOf('-') + 2

		// Generate the addon list of dictionaries
		var addon_dict = {};

        for (var j=0; j<decode_list[i][3].length; j++){
          var addon_sublist = [];
          for (var k=1; k<decode_list[i][3][j].length; k++){
            if (Array.isArray(decode_list[i][3][j][k])){
              for (var q=0; q<decode_list[i][3][j][k].length; q++){
                addon_sublist.push(decode_list[i][3][j][k][q])
              }
            }else{
              addon_sublist.push(decode_list[i][3][j][k])
            }
            
          }
          addon_dict[decode_list[i][3][j][0]] = addon_sublist
        }

		// Repeatedly add the same data for the same bowl, for number of bowls
		for (var n = 0; n<parseInt(decode_list[i][1]); n++){
			category_list.push(decode_list[i][0].slice(0, start_idx-3))
			item_list.push(decode_list[i][0].slice(start_idx))
			price_list.push(parseInt(decode_list[i][2].slice(4))/parseInt(decode_list[i][1]));
			addon_list.push(addon_dict)
		}

		number_of_bowl += parseInt(decode_list[i][1])
	}

	order_data_list.push(category_list);
	order_data_list.push(item_list);
	order_data_list.push(price_list);
	order_data_list.push(addon_list);
	order_data_list.push(number_of_bowl);

	return order_data_list;
}

export async function get_cart_item(datalist){

	if (getCookie("cart_id") !== "" && getCookie("device_key") !== "") {

		var request_data = {
			"service": "order",
			"operation": "get_cookie_value_from_list",
			"cart_id": getCookie("cart_id"),
			"device_key": getCookie("device_key"),
			"cookie_key_list": JSON.stringify(datalist)
		}

		var request_str = dict2urlEncode(request_data)

		var response_text = await awaitHttpGet(process.env.REACT_APP_SERVER_URL+"?"+request_str);
		var decode_dict = JSON.parse(response_text);

		var order_list = []

		// console.log("decode_dict", decode_dict)

		if (decode_dict["indicator"]) {

			for (var i = 0; i < decode_dict["message"].length; i++) {
				order_list = order_list.concat(JSON.parse(decode_dict["message"][i]["cookie_value"]))
				// console.log("order_list", order_list, decode_dict["message"][i], JSON.parse(decode_dict["message"][i]["cookie_value"]))
			}

		}

		return order_list

	}

	else {
		alert("請重新整理此頁面...")
		return []
	}
	

}


