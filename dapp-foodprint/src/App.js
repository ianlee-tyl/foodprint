// import MemberPage from './containers/member_page'
import MenuPage from './containers/menu_page'
import DetailPage from './containers/detail_page'
import CartPage from './containers/cart_page'
import InfoPage from './containers/info_page'
import ErrorPage from './containers/error_page'
import DisplayPage from './containers/display_page'
// import SpinPage from './containers/spin_page'
import StorePage from './containers/store_page'
import VendorPage from './containers/vendor_page'
import FeaturePage from './containers/feature_page'
import StatusPage from './containers/status_page'
import StatusResultPage from './containers/status_result_page'

import React from 'react'
// import { render } from 'react-dom'
// import { Redirect } from 'react-router';
import { Route, Switch } from 'react-router-dom'
import { Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'

import { getCookie } from './cookie_utils.js'
// import { FullScreen, useFullScreenHandle } from "react-full-screen"


function App() {





	const options = {
		position: 'top center',
		timeout: 3000,
		offset: '15px',
		transition: 'fade',
		containerStyle: {
			zIndex: 10000000
		}

	}

	// function toggleFullScreen() {
	// 	var doc = window.document;
	// 	var docEl = doc.documentElement;

	// 	var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
	// 	var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

	// 	if(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
	// 		requestFullScreen.call(docEl);
	// 	}
	// 	else {
	// 		cancelFullScreen.call(doc);
	// 	}
	// }

	window.alert = function (name) {
		var iframe = document.createElement("IFRAME");
		iframe.setAttribute("src", 'data:text/plain,');
		iframe.style.display = "none";
		document.documentElement.appendChild(iframe);
		window.frames[0].window.alert(name);
		iframe.parentNode.removeChild(iframe);
	};


	window.confirm = function (message) {
		var iframe = document.createElement("IFRAME");
		iframe.style.display = "none";
		iframe.setAttribute("src", 'data:text/plain,');
		document.documentElement.appendChild(iframe);
		var alertFrame = window.frames[0];
		var result = alertFrame.window.confirm(message);
		iframe.parentNode.removeChild(iframe);
		return result;
	};

	if (getCookie("store_id") === "DDC") {
		document.documentElement.style.setProperty('--main-color', '#d4b290');
		document.documentElement.style.setProperty('--sub-color', '#3d3d3d');
		document.documentElement.style.setProperty('--light-color', '#F5DC9B');
		document.documentElement.style.setProperty('--dark-color', '#d4b290');
		document.documentElement.style.setProperty('--grey-color', '#2d2d2d');
		document.documentElement.style.setProperty('--red-color', '#DB5531');
		document.documentElement.style.setProperty('--middle-grey-color', '#a1a1a1');
	}
	else {
		document.documentElement.style.setProperty('--main-color', '#efad00');
		document.documentElement.style.setProperty('--sub-color', '#ffffff');
		document.documentElement.style.setProperty('--light-color', '#F5DC9B');
		document.documentElement.style.setProperty('--dark-color', '#101820');
		document.documentElement.style.setProperty('--grey-color', '#f1f1f1');
		document.documentElement.style.setProperty('--red-color', '#DB5531');
		document.documentElement.style.setProperty('--middle-grey-color', '#a1a1a1');
	}


	return (

		<AlertProvider template={AlertTemplate} {...options}>
			{/*<a id="spinPage" href="/spinPage">spinPage</a>
		<button onClick={toggleFullScreen} id="fullscreen">full</button>*/}
			<div className="App">
				<Switch>
					<Route exact path="/" component={StorePage} />
					{/*<Route path="/statusPage" component={StatusPage}/>
		    	<Route path="/statusResultPage" component={StatusResultPage}/>
		    	<Route path="/featurePage" component={FeaturePage}/>*/}
					<Route path="/menuPage" component={MenuPage} />
					<Route path="/detailPage" component={DetailPage} />
					<Route path="/shoppingCart" component={CartPage} />
					<Route path="/infoPage" component={InfoPage} />
					<Route path="/errorPage" component={ErrorPage} />
					<Route path="/displayPage" component={DisplayPage} />
					<Route path="/vendorPage" component={VendorPage} />
					{/*<Route path="/spinPage" component={SpinPage}/>*/}
				</Switch>
			</div>

		</AlertProvider>

	);
}

export default App;
