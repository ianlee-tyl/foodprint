// Cookie Operations
// ------------------------------------------
export function setCookie(cname,cvalue,exdays){
    /*
        This is the function to set the cookie in your browser. 

        Input: 
        - cname: (string) This is the key of the cookie
        - cvalue: (string) This is the value of the cookie
        - exdays: (Integer) set the expiration day of the cookie  (We recommended 30)
    */

    // This part set the expiration date of the cookie
    var d = new Date();
    d.setTime(d.getTime()+(exdays*24*60*60*1000));
    var expiration_day = "expires="+d.toGMTString();

    // Remember to encode the value component of the cookie key/value pair to ensure there is no error. 
    // (and is compatible for all different browsers)
    document.cookie = encodeURIComponent(cname)+"="+encodeURIComponent(cvalue)+"; "+expiration_day;
}

export function getCookie(cname){
    /*
        This is the function to get the cookie in your browser. 

        Input: 
        - cname: (string) This is the key of the cookie

        Return:
        - cvalue: (string) The cookie value
    */

    // Find the encoded key in the cookie
    var name = encodeURIComponent(cname) + "=";

    // Split the cookie based on ';'
    var ca = decodeURIComponent(document.cookie).split(';');

    // Loop through all cookies, and return the correct value
    for(var i=0; i<ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name)===0) { return c.substring(name.length,c.length); }
    }

    // Return an empty string by default
    return "";
}


export function saveValue(id, val){
    
    localStorage.setItem(id, val);// Every time user writing something, the localStorage's value will override . 
}

export function getSavedValue(id){

    if (!localStorage.getItem(id)) {
        return "";// You can change this to your defualt value. 
    }

    return localStorage.getItem(id);
}

