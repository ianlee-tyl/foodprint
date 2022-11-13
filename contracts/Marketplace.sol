//SPDX-License-Identifier: GPL-3.0 
pragma solidity ^0.8.0;

abstract contract Context {
   function _msgSender() internal view virtual returns (address) {
       return msg.sender;
   }

   function _msgData() internal view virtual returns (bytes calldata) {
       this; // silence state mutability warning without generating bytecode - see https://github.com/ethereum/solidity/issues/2691
       return msg.data;
   }

   function _msgValue() internal view virtual returns (uint256 value) {
       return msg.value;
   }
}

abstract contract Owner is Context {
   address public owner;

   constructor () {
       owner = _msgSender();
   }

   /**
    * @dev Throws if called by any account other than the owner.
    */
    modifier onlyOwner() {
        require(_msgSender() == owner);
        _;
    }

    /**
     * @dev Check if the current caller is the contract owner.
     */
     function isOwner() internal view returns(bool) {
         return owner == _msgSender();
     }
}

contract Marketplace is Owner {
  
   struct Order {
       string name;
       string description;
       uint256 carbon; // carbon footprint
       uint256 price; // TRX per day
       address owner; // owner of the order
   }

   uint256 public orderId;

   mapping (uint256 => Order) public orders;

   struct Tracking {
       uint256 orderId;
       uint256 startTime; // start time, in timestamp
       uint256 endTime; // end time, in timestamp
       address borrower; // borrower's address
   }

   uint256 public trackingId;

   mapping(uint256 => Tracking) public trackings;

   /**
    * @dev Add a Order with predefined `name`, `description` and `price`
    * to the library.
    *
    * Returns a boolean value indicating whether the operation succeeded.
    *
    * Emits a {NewOrder} event.
    */
   function addOrder(string memory name, string memory description, uint256 carbon, uint256 price) public returns (bool success) {
       Order memory order = Order(name, description, carbon, price, _msgSender());

       orders[orderId] = order;

       emit NewOrder(orderId++);

       return true;
   }

   /**
    * @dev Borrow a order has `_orderId`. The rental period starts from
    * `startTime` ends with `endTime`.
    *
    * Returns a boolean value indicating whether the operation succeeded.
    *
    * Emits a `NewRental` event.
    */
   function borrowOrder(uint256 _orderId, uint256 startTime, uint256 endTime) public payable returns (bool) {
       Order storage order = orders[_orderId];

       require(_msgValue() == order.price, "Incorrect fund sent.");

       _sendTRX(order.owner, _msgValue());

       return true;
   }

   /**
    * @dev Delete a order from the library. Only the order's owner or the
    * library's owner is authorised for this operation.
    *
    * Returns a boolean value indicating whether the operation succeeded.
    *
    * Emits a `DeleteOrder` event.
    */
   function deleteOrder(uint256 _orderId) public returns(bool success) {
       require(_msgSender() == orders[_orderId].owner || isOwner(),
               "You are not authorised to delete this order.");
      
       delete orders[_orderId];

       emit DeleteOrder(_orderId);

       return true;
   }

   /**
    * @dev Calculate the number of days a order is rented out.
    */
   function _days(uint256 startTime, uint256 endTime) internal pure returns(uint256) {
       if ((endTime - startTime) % uint256(86400) == 0) {
           return (endTime - startTime) / uint256(86400);
       } else {
           return (endTime - startTime) / uint256(86400) + uint256(1);
       }
   }
   /**
    * @dev Send TRX to the order's owner.
    */
   function _sendTRX(address receiver, uint256 value) internal {
       payable(address(uint160(receiver))).transfer(value);
   }


   /**
    * @dev Emitted when a new order is added to the library.
    * Note `orderId` starts from 0.
    */
   event NewOrder(uint256 indexed orderId);


   /**
    * @dev Emitted when a order is deleted from the library.
    */
   event DeleteOrder(uint256 indexed orderId);

}