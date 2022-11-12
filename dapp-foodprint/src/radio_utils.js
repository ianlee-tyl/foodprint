import ReactDOM from 'react-dom'

export function radio_btn_pressed_function(e, choice_type="", single_class="", take_away="false", save_value="", detail_page_flag=""){
	
	console.log("choice_type", choice_type, single_class, take_away, save_value, detail_page_flag)
	if (choice_type == "single") {
		set_all_radio_btn_unchecked(single_class)
	}
	
	if (e.getAttribute("checked_flag") == "true" && choice_type != "single") {
		e.setAttribute("checked_flag", "false")
		e.checked = false
	}

	else {
		e.setAttribute("checked_flag", "true")
		e.checked = true

		if (take_away == "true") {
			console.log("take_away: ", single_class, take_away)
			take_away_radio_check(e)
		}
	}

	// if (save_value != "") {
	// 	saveRadioBtnValue(save_value, e.id)
	// }

	// console.log(getCookie("conditionals"), JSON.parse(getCookie("conditionals")))
	// console.log("detail_page_flag", detail_page_flag)

	// if (detail_page_flag != "") {

	// 	console.log(getCookie("conditionals"))
	// 	console.log(JSON.parse(getCookie("conditionals")), e.id)
		
	// 	set_conditionals(JSON.parse(getCookie("conditionals")))
	// 	detail_page_add_price("price", document.getElementById(detail_page_flag).value)
	// }
	
	
}

export function set_all_radio_btn_unchecked(e, class_name) {
	console.log("test2")
	var class_list = ReactDOM.findDOMNode(e).getElementsByClassName(class_name)
	var class_btn = document.getElementsByClassName(class_name)
	console.log(class_name, class_btn, class_list)

	for (var i = 0; i < class_btn.length; i++) {
		class_btn[i].setAttribute("checked_flag", "false")
		class_btn[i].checked = false

		console.log(class_btn[i])
	}

}

function take_away_radio_check(e) {

	var take_douhua_away = document.getElementsByClassName("take_douhua_away")
	var togo = document.getElementsByClassName("togo")

	console.log(take_douhua_away[0])
	take_douhua_away[0].style.display = "none"
	togo[0].style.display = "none"

	console.log(e.nextElementSibling, e.nextElementSibling.innerHTML)


	if (e.nextElementSibling.innerText === "內用") {
		take_douhua_away[0].style.display = "none"
		togo[0].style.display = "none"
	}

	else if (e.nextElementSibling.innerText === "外帶自取"){
		take_douhua_away[0].style.display = "none"
		togo[0].style.display = "block"
	}
	else{
		//外送
		take_douhua_away[0].style.display = "block"
		togo[0].style.display = "none"
	}
}
