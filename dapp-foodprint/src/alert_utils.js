// import { setCookie, getCookie } from './cookie_utils.js'
// import { Redirect } from 'react-router';

export function Confirm(title, msg, true_msg, false_msg) {
        console.log("hihihihihihi")

        var content =   "<div class='dialog-ovelay alert_body'>" +
                        "<div class='dialog'><header>" +
                        " <h3> " + title + " </h3> " +
                        "<i class='fa fa-close'></i>" +
                        "</header>" +
                        "<div class='dialog-msg'>" +
                        " <p> " + msg + " </p> " +
                        "</div>" +
                        "<footer>" +
                        "<div class='controls'>" +
                            " <button class='button button-danger doAction'>" + true_msg + "</button> " +
                            " <button class='button button-default cancelAction'>" + false_msg + "</button> " +
                        "</div>" +
                        "</footer>" +
                        "</div>" +
                        "</div>";

        console.log(document.getElementsByTagName('body'), document.getElementsByClassName('doAction'))
        document.getElementsByTagName('body')[0].innerHTML += content;
        document.getElementsByTagName('body')[0].classList.add("stop_scrolling")
        console.log(document.getElementsByTagName('body'), document.getElementsByClassName('doAction'))
        
        document.getElementsByClassName('doAction')[0].onclick = function () { 
            console.log("true")
            console.log("yeahhhhh")

            document.getElementsByTagName('body')[0].classList.remove("stop_scrolling")

            // window.location.href = "/"

        };


        document.getElementsByClassName('cancelAction')[0].onclick = function () {
            console.log("false", document.getElementsByTagName('body')[0], document.getElementsByClassName('dialog-ovelay')[0])
            document.getElementsByTagName('body')[0].classList.remove("stop_scrolling")

            document.getElementsByClassName('dialog-ovelay')[0].remove()
            // window.location.href = ""
        };

      
   }