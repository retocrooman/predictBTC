//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./console.sol";
import "./contracts/token/ERC20/ERC20.sol";

interface AggregatorInterface {
    function latestAnswer() external view returns (int256);
}

contract PredictBTC is ERC20 {

    // BTC価格
    int256 public BTCprice;
    // chainlink
    AggregatorInterface internal priceFeedBtcUsd;
    AggregatorInterface internal priceFeedJpyUsd;
    // 今週と来週の二つの状態を管理
    bool public rotation;
    //　予想価格の平均
    int256 public avg1;
    int256 public avg2;
    //　参加者の識別と人数をindexで管理
    uint256 public index1;
    uint256 public index2;
    // 参加者のアドレスの重複の禁止
    mapping(address => bool) private play1;
    mapping(address => bool) private play2;
    // 参加者のアドレスの管理
    mapping(uint256 => address) private participant1;
    mapping(uint256 => address) private participant2;
    // 参加者の予想した価格の管理
    mapping(uint256 => int256) private predict_price1;
    mapping(uint256 => int256) private predict_price2;
    // 締め切る日時
    uint256 public deadline_time;
    // BTCの価格を取得する日時
    uint256 public snapshot_time;

    // ローテーションと人数を初期化u
    // 結果がわかる日から数えて13日前から7日前の間に予想できる
    constructor() ERC20("PredictBitcoinToken", "PBT") {
        BTCprice = 0;
        rotation = true;
        avg1 = 0;
        avg2 = 0;
        index1 = 0;
        index2 = 0;
        deadline_time = block.timestamp + 1 weeks;
        snapshot_time = block.timestamp + 2 weeks;
        priceFeedBtcUsd = AggregatorInterface(0xECe365B379E1dD183B20fc5f022230C044d51404); // Rinkeby
        priceFeedJpyUsd = AggregatorInterface(0x3Ae2F46a2D84e3D5590ee6Ee5116B80caF77DeCA); // Rinkeby
        // https://docs.chain.link/docs/ethereum-addresses/
        // 上記で確認
    }

    // BTCの最新の価格（米ドル基準）
    function getLatestBtcUsdPrice() public view returns (int256) {
        return priceFeedBtcUsd.latestAnswer();
    }

    // JPYの最新の価格（米ドル基準）
    function getLatestJpyUsdPrice() public view returns (int256) {
        return priceFeedJpyUsd.latestAnswer();
    }

    // BTCの最新の価格（日本円基準）
    function getLatestBtcJpyPrice() public view returns (int256) {
        int256 BtcUsd = getLatestBtcUsdPrice();
        int256 JpyUsd = getLatestJpyUsdPrice();
        return BtcUsd / JpyUsd;
    }
    
    // 予想価格を引数に賭ける
    function play(int256 _price) public payable {
        if(rotation) {
            require(play1[msg.sender] == false, "already played");
            play1[msg.sender] = true;
            index1++;
            participant1[index1] = msg.sender;
            predict_price1[index1] = _price;
            avg1 = (avg1 * int256(index1-1) + _price) / int256(index1);
        }
        else {
            require(play2[msg.sender] == false, "already played");
            play2[msg.sender] = true;
            index2++;
            participant2[index2] = msg.sender;
            predict_price2[index2] = _price;
            avg2 = (avg2 * int256(index2-1) + _price) / int256(index2);
        }
    }

    // 締め切りの日時の変更、インセンティブあり
    function deadline() public {
        require(block.timestamp > deadline_time, "too eary");
        deadline_time = deadline_time + 1 weeks;
        _mint(msg.sender, 1000 * 10 ** 18);
        rotation = !rotation;
    }

    // スナップショットの日時の変更、インセンティブあり
    function snapshot() public {
        require(block.timestamp > snapshot_time, "too eary");
        snapshot_time = snapshot_time + 1 weeks;
        _mint(msg.sender, 1000 * 10 ** 18);
        if(!rotation) {
            index1 = 0;
            avg1 = 0;
        }
        else {
            index2 = 0;
            avg2 = 0;
        }
        distributer();
    }

    // トークン配布
    function distributer() private {
        BTCprice = getLatestBtcJpyPrice();
        if(!rotation) {
            for(uint i =1; i <= index1; i++) {
                _mint(participant1[i], calculate(BTCprice, predict_price1[i]) * 10 ** 18);
                play1[participant1[i]] = false;
            }
        }
        else {
            for(uint i =1; i <= index2; i++) {
                _mint(participant2[i], calculate(BTCprice, predict_price2[i]) * 10 ** 18);
                play2[participant2[i]] = false;
            }
        }
    }

    // 発行トークンの計算
    function calculate(int a, int b) public pure returns (uint256) {
        uint256 rate;
        uint256 getToken;
        if(a >= b) rate = uint256((a-b)*1000/a);
        else rate = uint256((b-a)*1000/a);
        getToken = 0;
        if(rate < 200) getToken = 500;
        if(rate < 100) getToken = 1000;
        if(rate < 80) getToken = 2000;
        if(rate < 50) getToken = 5000;
        if(rate < 30) getToken = 10000;
        if(rate < 10) getToken = 20000;
        if(rate < 1) getToken = 50000;
        return getToken;
    }
}
