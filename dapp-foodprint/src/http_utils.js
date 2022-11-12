// import { Redirect } from 'react-router';
import { setCookie } from './cookie_utils.js'
// import sha256 from 'crypto-js/sha256'


function time_standard(time_shift) {

    var time = new Date()
    var correct_time = time.getTime() / 1000//time.getTimezoneOffset() * 60 + time.getTime() / 1000
    //console.log(parseInt(correct_time) + (time_shift*60*60))

    return parseInt(correct_time)// + (time_shift*60*60)
    // return 1619644177
}

function HMAC256_encryption(key, secret, time_shift) {
    // We standardize Taipei as the standard time

    // var sha256 = require('js-sha256');
    var CryptoJS = require("crypto-js");

    // var time = new Date()
    // var correct_time = time.getTimezoneOffset() * 60 + time.getTime() / 1000
    // console.log(parseInt(correct_time) + (time_shift*60*60), new Date())

    var localtime = time_standard(0)//parseInt(correct_time) + (time_shift*60*60)
    var hash = CryptoJS.HmacSHA256(key+(localtime).toString(), secret)
    var encryption_result = CryptoJS.enc.Base64.stringify(hash)

    // console.log(encryption_result, hash.toString(CryptoJS.enc.Hex))

    return encryption_result
}

// post get function
export async function getDataFromServer(url, list_flag=false, member_flag=false) {
    var response_text = await awaitHttpGet(url, member_flag);
    // console.log(response_text)

    if (list_flag) {
        response_text = replaceAllFunc(response_text,"'", '"')
        // console.log(JSON.parse(response_text))
    }
    
    return JSON.parse(response_text)
}

export async function postDataFromServer(url, data, list_flag=false, member_flag=false) {
    var response_text = await awaitHttpPost(url, data, member_flag);
    // console.log(response_text)

    if (list_flag) {
        response_text = replaceAllFunc(response_text,"'", '"')
        // console.log(JSON.parse(response_text))
    }
    
    return JSON.parse(response_text)
}

export function awaitHttpGet(url, member_flag){
    /*
        Input:
        - url: (string) the url that you want to send request to
        - postProcesses: (function) This is the function that should be executed after
            we got the response from the server `
    */
    

    return new Promise(function(resolve, reject) {

        var xmlHttp = new XMLHttpRequest();

        xmlHttp.onreadystatechange = function() {
            if (xmlHttp.readyState === XMLHttpRequest.DONE) {
                if (xmlHttp.status === 200) {
                    resolve(xmlHttp.responseText)
                }
                else {
                    reject("Error")
                }
            }
        }

        xmlHttp.open("GET", url);

        // if (member_flag) {
        var key = process.env.REACT_APP_GADGET_KEY
        var secret = process.env.REACT_APP_SECRET
        var time_shift = 8
        xmlHttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xmlHttp.setRequestHeader("Gadgethi-Key", key.toString())
        xmlHttp.setRequestHeader("Hmac256-Result", HMAC256_encryption(key, secret, time_shift).toString())
        xmlHttp.setRequestHeader("time", (time_standard(time_shift)).toString())
        // }

        xmlHttp.send(null);

    })
}

function awaitHttpPost(url, postData, member_flag){
    /*
        Input:
        - url: (string) the url that you want to send request to
        - postProcesses: (function) This is the function that should be executed after
            we got the response from the server `
    */
    

    return new Promise(function(resolve, reject) {

        var xmlHttp = new XMLHttpRequest();

        xmlHttp.onreadystatechange = function() {
            if (xmlHttp.readyState === XMLHttpRequest.DONE) {
                if (xmlHttp.status === 200) {
                    resolve(xmlHttp.responseText)
                }
                else {
                    reject("Error")
                }
            }
        }

        xmlHttp.open("POST", url);
        // if (member_flag) {
        var key = process.env.REACT_APP_GADGET_KEY
        var secret = process.env.REACT_APP_SECRET
        var time_shift = 8
        xmlHttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xmlHttp.setRequestHeader("Gadgethi-Key", key.toString())
        xmlHttp.setRequestHeader("Hmac256-Result", HMAC256_encryption(key, secret, time_shift).toString())
        xmlHttp.setRequestHeader("time", (time_standard(time_shift)).toString())
        // }
        xmlHttp.send(postData);
    })
}

function replaceAllFunc(string, search, replace) {
    return string.split(search).join(replace);
}

export function dict2urlEncode(dictionary) {
    /*
        This is the helper function that helps change dictionary to 
        urlencoded string. 
    */
    var str = [];
    for(var p in dictionary)
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(dictionary[p]));
    return str.join("&");
}

// cart related function
export function makeid(length) {
   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

export function init_cart_and_device_key(SERVER_URL){ 
    // random generate a device key
    var timeInMs = Date.now();
    var dkey = timeInMs.toString() + '-' + makeid(8)
    // console.log(dkey, SERVER_URL)
    // set devicekey cookie
    setCookie("device_key", dkey, 1);

    var request_data = {
        "service": "order",
        "operation": "new_cart",
        "device_key": dkey
    }

    var request_str = JSON.stringify(request_data)
    postDataFromServer(SERVER_URL, request_str)
    .then((result) => {
        // console.log(result)
        if (result["indicator"]){
            setCookie("cart_id", result["message"], 1);
        } else{
            alert("伺服器錯誤，請聯絡豆日子")
        }
    })
}

// handle detail page data list
export function generate_datalist(itemName, itemAmount, totalPrice, addons, comment, comboId) {
   
    // This stores all the values in the detail list
    /*
        0: douhua name
        1: number of bowls
        2: total_price
        3: addon choices
        4: comment
        5: combo id => ""
    */


    var order_detail_list = []

    // Append this order info to the order list
    var org_order_list = []

    var returnAddons = edit_addons_dict_to_list(addons)
    // console.log(returnAddons)

    order_detail_list.push(itemName);
    order_detail_list.push(itemAmount.toString());
    order_detail_list.push("NT$ " + totalPrice.toString());
    order_detail_list.push(returnAddons);
    order_detail_list.push(comment)
    order_detail_list.push(comboId)

    
    
    org_order_list.push(order_detail_list);
    
    // Change the list to string
    var datalist = JSON.stringify(org_order_list);

    return datalist
}

function edit_addons_dict_to_list(addons) {

    var returnAddonsList = []

    for (const addonName of Object.keys(addons)) {
        var addonList = []

        addonList.push(addonName)

        addonList.push(addons[addonName])
        returnAddonsList.push(addonList)
    }

    return returnAddonsList

}


