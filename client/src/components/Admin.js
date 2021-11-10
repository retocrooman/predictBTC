import React, {useState, useEffect} from 'react';
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';
import Button from '@mui/material/Button';

import PredictBTC from '../abi/PredictBTC.json';

const Admin = () => {
    const [web3, setWeb3] = useState([]);
    const [address, setAddress] = useState("");
    const [contractAddress, setContractAddress] = useState("0x39c9F8410893C75C04663aA32BBc12D2AAd04e86");
    const [contract, setContract] = useState([]);
    const [BTCprice, setBTCprice] = useState(0);

    useEffect(() => {
        const init = async () => {
            const provider = await detectEthereumProvider();

            if(provider && window.ethereum.isMetaMask) {
                const web3 = new Web3(Web3.givenProvider);
                const accounts = await web3.eth.requestAccounts();
                try {
                    const contract = await new web3.eth.Contract(PredictBTC.abi, contractAddress);
                    const BTCprice = await contract.methods.getLatestBtcJpyPrice().call();
                    setContract(contract);
                    setBTCprice(BTCprice);
                } catch(error) {
                    alert(error.message);
                }
                setWeb3(web3);
                setAddress(accounts[0]);
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
            setBTCprice(BTCprice);
            alert('Success!')
        } catch(error) {
            alert(error.message);
        }
    }

    return (
        <div class="main">
            <h1>設定画面</h1>
            <p>{BTCprice}</p>
            <Button variant="contained" onClick={Update}>update</Button>
        </div>
    );
}

export default Admin;