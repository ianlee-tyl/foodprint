//import LibraryABI from './libraryABI'

let account = null
let foodOrderContract
let foodOrderContractAddress = 'TFgGFbBb3aw8TZCdc4y5zv4XqV68ENjhHT' // Paste Contract address here
let OrderContract = null


export const accountAddress = () => {
  return account
}

export function getTronWeb(){
  // Obtain the tronweb object injected by tronLink 
  var obj = setInterval(async ()=>{
    if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
        clearInterval(obj)
        console.log("tronWeb successfully detected!")
    }
  }, 10)
}
 

export async function setOrderContract() {
  // TODO: abtain contract Object

  OrderContract = await window.tronWeb.contract().at(foodOrderContractAddress);

}


export async function postOrderInfo(name, description, carbon, price) {
  // TODO: call addOrder func of library contract
  
  const result = await OrderContract.addOrder(name,description,carbon,price).send({
    feeLimit:100_000_000,
    callValue:0,
    shouldPollResponse:true
  });

  alert('Order Posted Successfully')

}

export async function borrowOrder(spaceId, checkInDate, checkOutDate, totalPrice) {
  // TODO: call borrowOrder func of library contract
 
  const result = await OrderContract.borrowOrder(spaceId,checkInDate,checkOutDate).send({
    feeLimit:100_000_000,
    callValue:totalPrice,
    shouldPollResponse:true
  });

  alert('Property Ordered Successfully')
}

export async function fetchAllOrders() {
  // TODO: call orderId func of library contract to abtain total orders number
  // iterate till book Id
  // push each object to orders array
  const orders = [];
  console.log(OrderContract)
  console.log(OrderContract.orderId())
  const orderId  = await OrderContract.orderId().call();
  //iterate from 0 till orderId
  for (let i = 0; i < orderId; i++){
    const order = await OrderContract.orders(i).call()
    if(order.name!="") // filter the deleted orders
    {
      orders.push(
        {id: i,name: order.name,description: order.description,carbon: order.carbon/1e6, price: window.tronWeb.fromSun(order.price)}
      )
    }
    
  }
  return orders

}
