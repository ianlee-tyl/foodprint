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

  constructor() {
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
  function isOwner() internal view returns (bool) {
    return owner == _msgSender();
  }
}

struct Meal {
  string name;
  uint256 id;
  uint256 base_price;
  uint256 extra_price;
  uint256 co2_emission;
  uint256[] components;
  address owner;
  string addr;
}

struct Intermediate {
  string name;
  uint256 id;
  uint256 base_price;
  uint256 extra_price;
  uint256 co2_emission;
  uint256[] components;
  address owner;
  string addr;
}

struct Base {
  string name;
  uint256 id;
  uint256 price;
  uint256 co2_emission;
  address owner;
  string addr;
}

contract Consumer is Owner {
  uint256 dateJoined;

  struct Order {
    uint256 dateCreated;
    Meal meal;
    address buyer;
    address vendor;
    // enum {pending, delivered} status;  TODO: get enum working in solidity
  }

  Order[] orders; // order history

  uint256 mealCount;
  uint256 foodprint; // carbon footprint
}

contract Vendor is Owner {
  uint256 dateJoined;
  Meal[] meals;
  uint256 mealsSold;
  uint256 foodprint; // carbon footprint
}
