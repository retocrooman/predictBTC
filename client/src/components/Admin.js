import React, {useState, useEffect} from 'react';
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import PredictBTC from '../abi/PredictBTC.json';

const Admin = () => {
    const [web3, setWeb3] = useState([]);
    const [address, setAddress] = useState("");
    const [contractAddress, setContractAddress] = useState("0x39c9F8410893C75C04663aA32BBc12D2AAd04e86");
    const [contract, setContract] = useState([]);
    const [BTCprice, setBTCprice] = useState(0);
    const [rotation, setRotation] = useState(1);
    const [index1, setIndex1] = useState(0);
    const [index2, setIndex2] = useState(0);
    const [avg1, setAvg1] = useState(0);
    const [avg2, setAvg2] = useState(0);
    const [deadline, setDeadline] = useState("");
    const [snapshot, setSnapshot] = useState("");

    const [value, setValue] = useState(0);

    useEffect(() => {
        const init = async () => {
            const provider = await detectEthereumProvider();

            if(provider && window.ethereum.isMetaMask) {
                try {
                    const web3 = new Web3(Web3.givenProvider);
                    const accounts = await web3.eth.requestAccounts();
                    const contract = new web3.eth.Contract(PredictBTC.abi, contractAddress);
                    const BTCprice = await contract.methods.getLatestBtcJpyPrice().call();
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
                    rotationCheck ? setRotation(1) : setRotation(2);
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
        init();
    }, []);
    
    const Update = async () => {
        try {
            const BTCprice = await contract.methods.getLatestBtcJpyPrice().call();
            const rotationCheck = await contract.methods.rotation().call();
            const index1 = await contract.methods.index1().call();
            const index2 = await contract.methods.index2().call();
            const avg1 = await contract.methods.avg1().call();
            const avg2 = await contract.methods.avg2().call();
            const deadlineTimestamp = await contract.methods.deadline_time().call();
            const deadline = new Date(parseInt(deadlineTimestamp)*1000).toLocaleString();
            const snapshotTimestamp = await contract.methods.snapshot_time().call();
            const snapshot = new Date(parseInt(snapshotTimestamp)*1000).toLocaleString();
            setBTCprice(BTCprice);
            rotationCheck ? setRotation(1) : setRotation(2);
            setIndex1(index1);
            setIndex2(index2);
            setAvg1(avg1);
            setAvg2(avg2);
            setDeadline(deadline);
            setSnapshot(snapshot);
            alert('Success!')
        } catch(error) {
            alert(error.message);
        }
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
        <div>
            <h1>設定画面</h1>
            <p>address:{address}</p>
            <p>BTC価格：{BTCprice}</p>
            <p>ローテーション：{rotation}</p>
            <p>人数１：{index1}</p>
            <p>人数２：{index2}</p>
            <p>平均１：{avg1}</p>
            <p>平均２：{avg2}</p>
            <p>締め切り：{deadline}</p>
            <p>スナップショット：{snapshot}</p>
            <Button variant="outlined" onClick={Update}>情報更新</Button>
            <br/>
            <br/>
            <TextField value={value} onChange={e => setValue(e.target.value)} variant="outlined" label="予想価格" />
            <br/>
            <Button variant="outlined" onClick={Play}>賭ける</Button>
            <br/>
            <Button variant="outlined" onClick={Deadline}>締め切りを更新する</Button>
            <br/>
            <Button variant="outlined" onClick={Snapshot}>スナップショット</Button>
        </div>
    );
}

export default Admin;