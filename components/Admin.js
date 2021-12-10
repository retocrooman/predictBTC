import React, {useState, useEffect} from 'react';
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import PredictBTC from '../abi/PredictBTC.json';

const contractAddress = "0x48D8276499d51199ebfC1f0a1893a1AbEAb314Da";

const Admin = () => {
    const [address, setAddress] = useState("");
    const [contract, setContract] = useState([]);
    const [BTCprice, setBTCprice] = useState(0);
    const [preBTCprice, setPreBTCprice] = useState(0);
    const [yourBTCprice, setYourBTCprice] = useState(0);
    const [index, setIndex] = useState(0);
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
                const yourBTCprice = await contract.methods.getPredictPrice().call({from:accounts[0]});
                const index = await contract.methods.index().call();
                const avg = await contract.methods.avg().call();
                const deadlineTimestamp = await contract.methods.deadline_time().call();
                const deadline = new Date(parseInt(deadlineTimestamp)*1000).toLocaleString();
                const snapshotTimestamp = await contract.methods.snapshot_time().call();
                const snapshot = new Date(parseInt(snapshotTimestamp)*1000).toLocaleString();
                setContract(contract);
                setBTCprice(BTCprice);
                setPreBTCprice(preBTCprice);
                setYourBTCprice(yourBTCprice);
                setIndex(index);
                setAvg(avg);
                setDeadline((new Date(deadline)).toLocaleString());
                setSnapshot((new Date(snapshot)).toLocaleString());
                setAddress(accounts[0]);
            } catch(error) {
                alert('web3 or contract error')
                console.log(error.message);
            }
        }
        else {
            alert('Please Install MetaMask');
        }

    }

    useEffect(() => {
        init();
    }, []);
    
    const Play = async () => {
        const rotation = await contract.methods.rotation().call();
        if (rotation) {
            try {
                await contract.methods.play(value).send({from: address});
                alert('Play Sucess!');
                init();
            } catch(error) {
                alert('Play Fail');
                console.log(error.message);
            }
        }
        else {
            alert('not play term');
        }
    }

    const Deadline = async () => {
        try {
            await contract.methods.deadline().send({from: address});
            alert('Deadline Success!');
            init();
        } catch(error) {
            alert('Deadline Fail');
            console.log(error.message);
        }
    }

    const Snapshot = async () => {
        try {
            await contract.methods.snapshot().send({from: address});
            alert('Snapshot Success!');
            init();
        } catch(error) {
            alert('Snapshot Fail');
            console.log(error.message);
        }
    }

    return (
        <div style={{ width: '900px', margin: 'auto', marginTop: '50px', textAlign: 'center', boxShadow: '0 0 8px gray', padding: '20px', borderRadius: 40, backgroundColor: 'white'}}>
            <h1>Welcom to PredictBTC!</h1>
            <Button variant="outlined" onClick={init}>metamaskに接続する</Button>
            <p>contractAddress : {contractAddress}<br/>
            yourAddress : {address}<br/><br/>
            現在のBTC価格 : {BTCprice}円<br/>
            前回のスナップショット時のBTC価格 : {preBTCprice}円<br/>
            あなたの予想BTC価格 : {yourBTCprice}円</p>
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
            <Button sx={{right:'10px', width:'200px'}} variant="outlined" onClick={Deadline}>投票を締め切る</Button>
            <Button sx={{left:'10px', width:'200px'}} variant="outlined" onClick={Snapshot}>スナップショット</Button>
            <br/>
            <p>投票の締め切りとスナップショットのボタンは上記の時間帯を過ぎると押すことができます。<br/>
            一番最初に実行した人は1000PBTを貰えます。</p>
        </div>
    );
}

export default Admin;