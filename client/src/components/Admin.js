import React, {useState, useEffect} from 'react';
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import PredictBTC from '../abi/PredictBTC.json';

const Admin = () => {
    const [web3, setWeb3] = useState([]);
    const [address, setAddress] = useState("");
    const [contractAddress, setContractAddress] = useState("0x6Ae7d6B73727261bAD993Be70640628f265ddB73");
    const [contract, setContract] = useState([]);
    const [BTCprice, setBTCprice] = useState(0);
    const [preBTCprice, setPreBTCprice] = useState(0);
    const [rotation, setRotation] = useState(1);
    const [index1, setIndex1] = useState(0);
    const [index2, setIndex2] = useState(0);
    const [index, setIndex] = useState(0);
    const [avg1, setAvg1] = useState(0);
    const [avg2, setAvg2] = useState(0);
    const [avg, setAvg] = useState(0);
    const [deadline, setDeadline] = useState("");
    const [snapshot, setSnapshot] = useState("");

    const [value, setValue] = useState(0);

    const init = async () => {
        const provider = await detectEthereumProvider();

        if(provider && window.ethereum.isMetaMask) {
            try {
                const web3 = new Web3(Web3.givenProvider);
                const accounts = await web3.eth.requestAccounts();
                const contract = new web3.eth.Contract(PredictBTC.abi, contractAddress);
                const BTCprice = await contract.methods.getLatestBtcJpyPrice().call();
                const preBTCprice = await contract.methods.BTCprice().call();
                const rotationCheck = await contract.methods.rotation().call();
                const index1 = await contract.methods.index1().call();
                const index2 = await contract.methods.index2().call();
                const avg1 = await contract.methods.avg1().call();
                const avg2 = await contract.methods.avg2().call();
                const deadlineTimestamp = await contract.methods.deadline_time().call();
                const deadline = new Date(parseInt(deadlineTimestamp)*1000).toLocaleString();
                const snapshotTimestamp = await contract.methods.snapshot_time().call();
                const snapshot = new Date(parseInt(snapshotTimestamp)*1000).toLocaleString();
                setContract(contract);
                setBTCprice(BTCprice);
                setPreBTCprice(preBTCprice);
                if(rotationCheck) {
                    setIndex(index1);
                    setAvg(avg1);
                }
                else {
                    setIndex(index2);
                    setAvg(avg2);
                }
                setIndex1(index1);
                setIndex2(index2);
                setAvg1(avg1);
                setAvg2(avg2);
                setDeadline((new Date(deadline)).toLocaleString());
                setSnapshot((new Date(snapshot)).toLocaleString());
                setWeb3(web3);
                setAddress(accounts[0]);
            } catch(error) {
                alert(error.message);
            }
        }
        else {
            alert('Please Install MetaMask');
        }

    }

    useEffect(() => {
        init();
    }, []);
    
    const Update = async () => {
        init();
    }
    
    const Play = async () => {
        try {
            await contract.methods.play(value).send({from: address});
            alert('Sucess!');
        } catch(error) {
            alert(error.message);
        }
    }

    const Deadline = async () => {
        try {
            await contract.methods.deadline().send({from: address});
            alert('Success!');
        } catch(error) {
            alert(error.message);
        }
    }

    const Snapshot = async () => {
        try {
            await contract.methods.snapshot().send({from: address});
            alert('Success!');
        } catch(error) {
            alert(error.message);
        }
    }

    return (
        <div style={{ width: '900px', margin: 'auto', marginTop: '50px', textAlign: 'center', boxShadow: '0 0 8px gray', padding: '20px', borderRadius: 40, backgroundColor: 'white'}}>
            <h1>Welcom to PredictBTC!</h1>
            <Button variant="outlined" onClick={Update}>metamaskに接続する</Button>
            <p>contractAddress : {contractAddress}<br/>
            yourAddress : {address}<br/><br/>
            BTC価格 : {BTCprice}円<br/>
            前回のスナップショット時のBTC価格 : {preBTCprice}円</p>
            <h4>今回の参加人数は{index}人で、
            平均予想価格は{avg}円です。<br/>
            締め切り日時は{deadline}<br/>
            スナップショット日時は{snapshot}</h4>
            <TextField value={value} onChange={e => setValue(e.target.value)} variant="outlined" label="予想価格円" />
            <Button sx={{height: '55px'}} variant="contained" onClick={Play}>賭ける</Button>
            <br/>
            <p>予想と実際の価格の誤差が0.1%未満の場合50000PBT、1%未満の場合は20000PBT、<br/>
                3%未満の場合は10000PBT、5%未満の場合は5000PBT、8%未満の場合は2000PBT、<br/>
                10%未満の場合は1000PBT、20%未満の場合は500PBTが貰えます。</p>
            <br/>
            <Button sx={{right:'10px', width:'200px'}} variant="outlined" onClick={Deadline}>締め切り日時を更新する</Button>
            <Button sx={{left:'10px', width:'200px'}} variant="outlined" onClick={Snapshot}>スナップショット</Button>
            <br/>
            <p>締め切り日時の更新とスナップショットのボタンは上記の時間帯を過ぎると押すことができます。<br/>
            一番最初に実行した人は1000PBTを貰えます。</p>
        </div>
    );
}

export default Admin;