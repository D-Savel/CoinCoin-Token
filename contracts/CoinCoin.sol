// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract CoinCoin {
    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;
    string private _name;
    string private _symbol;
    uint256 private _totalSupply;

    event Transfer(
        address indexed sender,
        address indexed recipient,
        uint256 amount
    );
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );

    constructor(address owner_, uint256 totalSupply_) {
        _name = "CoinCoin";
        _symbol = "COIN";
        _balances[owner_] = totalSupply_;
        emit Transfer(address(0), owner_, totalSupply_);
    }

    function transfer(address recipient, uint256 amount) public {
        require(
            _balances[msg.sender] >= amount,
            "CoinCoin: Not enough Ether to transfer"
        );
        require(
            recipient != address(0),
            "CoinCoin: unable to transfer to the zero address"
        );
        _balances[msg.sender] -= amount;
        _balances[recipient] += amount;
        emit Transfer(msg.sender, recipient, amount);
    }

    function approve(address spender, uint256 amount) public {
        require(spender != address(0), "CoinCoin: approve to the zero address");
        _allowances[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
    }

    function name() public view returns (string memory) {
        return _name;
    }

    function symbol() public view returns (string memory) {
        return _symbol;
    }

    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address account) public view returns (uint256) {
        return _balances[account];
    }

    function allowance(address owner_, address spender)
        public
        view
        returns (uint256)
    {
        return _allowances[owner_][spender];
    }
}
