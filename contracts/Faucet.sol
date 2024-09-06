// contracts/Faucet.sol
// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 < 0.9.0;

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);

    function balanceOf(address account) external view returns (uint256);

    event Transfer(address indexed from, address indexed to, uint256 value);
}

contract Faucet {
    address payable owner;
    IERC20 public token1;
    IERC20 public token2;
    IERC20 public token3;

    uint256 public withdrawalAmount = 50 * (10**18);
    uint256 public lockTime = 1 minutes;

    event Withdrawal(address indexed to, uint256 indexed amount);
    event Deposit(address indexed from, uint256 indexed amount);

    mapping(address => uint256) nextAccessTime;

    constructor(address tokenAddress1,address tokenAddress2,address tokenAddress3) payable {
        token1 = IERC20(tokenAddress1);
        token2 = IERC20(tokenAddress2);
        token3 = IERC20(tokenAddress3);
        owner = payable(msg.sender);
    }

    function requestTokens() public {
        require(
            msg.sender != address(0),
            "Request must not originate from a zero account"
        );
        require(
            token1.balanceOf(address(this)) >= withdrawalAmount,
            "Insufficient balance in faucet for withdrawal request"
        );
        require(
            token2.balanceOf(address(this)) >= withdrawalAmount,
            "Insufficient balance in faucet for withdrawal request"
        );
        require(
            token3.balanceOf(address(this)) >= withdrawalAmount,
            "Insufficient balance in faucet for withdrawal request"
        );
        require(
            block.timestamp >= nextAccessTime[msg.sender],
            "Insufficient time elapsed since last withdrawal - try again later."
        );

        nextAccessTime[msg.sender] = block.timestamp + lockTime;

        token1.transfer(msg.sender, withdrawalAmount);
        token2.transfer(msg.sender, withdrawalAmount);
        token3.transfer(msg.sender, withdrawalAmount);
    }

    receive() external payable {
        emit Deposit(msg.sender, msg.value);
    }

    function getBalance() external view returns (uint256[] memory) {

        uint256[] memory balances = new uint256[](3);
        balances[0] = token1.balanceOf(address(this));
        balances[1] = token2.balanceOf(address(this));
        balances[2] = token3.balanceOf(address(this));
        return balances;
    }

    function setWithdrawalAmount(uint256 amount) public onlyOwner {
        withdrawalAmount = amount * (10**18);
    }

    function setLockTime(uint256 amount) public onlyOwner {
        lockTime = amount * 1 minutes;
    }

    function withdraw() external onlyOwner {
        emit Withdrawal(msg.sender, token1.balanceOf(address(this)));
        emit Withdrawal(msg.sender, token2.balanceOf(address(this)));
        emit Withdrawal(msg.sender, token3.balanceOf(address(this)));
        token1.transfer(msg.sender, token1.balanceOf(address(this)));
        token2.transfer(msg.sender, token2.balanceOf(address(this)));
        token3.transfer(msg.sender, token3.balanceOf(address(this)));
    }

    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "Only the contract owner can call this function"
        );
        _;
    }
}