import React, { Component } from 'react';
import { ethers } from 'ethers';

import contract from './contracts/Greeter.json';
const contractAddress = '0xB7DC9620192E8389f57428230A343d67906CB4AC';
const abi = contract.abi;

class Metamask extends Component {
  constructor(props) {
    super(props);

    this.newText = React.createRef();
    this.state = {};
  }

  async connectToMetamask() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    const balance = await provider.getBalance(accounts[0]);
    const balanceInEther = ethers.utils.formatEther(balance);

    const signer = provider.getSigner();
    const nftContract = new ethers.Contract(contractAddress, abi, signer);
    const greetingText = await nftContract.greet();

    this.setState({ selectedAddress: accounts[0], balanceInEther, greetingText });
  }

  async changeText() {
    const newValue = this.newText.current.value;
    if (!newValue || !newValue.length) {
      return null;
    };
    console.log(`Set new value: ${newValue}`);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const nftContract = new ethers.Contract(contractAddress, abi, provider);

    const contractWithSigner = nftContract.connect(signer);
    await contractWithSigner.setGreeting(newValue);
    console.log('completed');
    return true;
  };

  renderMetamask() {
    if (!this.state.selectedAddress) {
      return (
        <button onClick={() => this.connectToMetamask()} className="cta-button connect-wallet-button">
          Connect to Metamask
        </button>
      );
    } else {
      return (
        <div>
          <p>Welcome {this.state.selectedAddress}</p>
          <p>Your ETH balance is: {this.state.balanceInEther}</p>
          <p>Greeting Text: {this.state.greetingText}</p>
          <div>
            <label>Change Text to:</label>
            <input type="text" id="lname" name="lname" ref={this.newText} />
            <button onClick={() => this.changeText()}>Change Text </button>
          </div>
        </div>
      );
    }
  }

  render() {
    return(
      <div>
        {this.renderMetamask()}
      </div>
    );
  }
}

export default Metamask;
