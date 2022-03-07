import { useState, useEffect } from 'react';
import './App.css';
const axios = require('axios').default;

//najmniej tokenow ktore mozna kupic to 50
//default value input w formularzu 50

function App() {

  const initialValues = {tokenAmount:50, email:"", walletAddress:""};
  const [formValues, setFormValues]= useState(initialValues);
  const [formErrors, setFormErrors]= useState({});
  const [isSubmit, setIsSubmit] = useState(false);

  const handleChange = (e) => {

    const {name, value} = e.target;
    setFormValues({ ...formValues, [name]: value});
  };
  
  async function getCharge(){

    try{
      const response = await axios.get(`http://localhost:3001/api/create-charge?email=${formValues.email}&tokenAmount=${formValues.tokenAmount}&walletAddress=${formValues.walletAddress}`);
      const data = await response.data
      window.location.href = data.hosted_url
    } catch (error) {
    console.error(error);
      }
  }
  //TO DO
  //encode URL?
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setFormErrors(validate(formValues));
    setIsSubmit(true);
  };

  useEffect( () => {
    if(Object.keys(formErrors).length === 0 && isSubmit) {
      console.log(formValues);
      getCharge();
    }
  });

//regex dla ETH wallet portfela, arbitrum ma taki sam kod portfela
  const validate = (values) => {
    const errors = {};
    const regexWallet = /^0x[a-fA-F0-9]{40}$/;
    const regexEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if(!values.tokenAmount){
      errors.tokenAmount = "Quantity of tokens required";
    } else if (values.tokenAmount < 50 ) {
      errors.tokenAmount = "Minimum amount of tokens is 50";
    } 

    if(!values.email){
      errors.email = "Email is required";
    } else if (!regexEmail.test(values.email)){
      errors.email = "Enter a valid email";
    }
  
    if(!values.walletAddress){
      errors.walletAddress = "Wallet address is required";
    } else if (!regexWallet.test(values.walletAddress)) {
      errors.walletAddress = "Wallet address is not valid, check your Arbitrum/ETH wallet address";
    }
    return errors;
  };

  return (
    <div className='ui form'>
    <div className='container'>
      
      <form onSubmit={handleSubmit}>
      {/*<div className='ui form'>*/}

        <div className='info'>
          <h1>Naiadcoin store</h1>

          <b>NAIAD will be send up to 24h after payment is confirmed</b>
          <img className='emaillogo' src='images/white_switch.svg' align='left' alt='switch' width='25' height='25'/>
          <p align="right">1 NAIAD = 0.99 USD</p>
          <img className='emaillogo' src='images/white_email.svg' align='left' alt='email' width='25' height='20'/>
          <p align="right">contact@naiadcoin.com</p>
          
        </div>       
          
          <div className='field'>
            <label>Amount of Tokens</label>
            <input 
            type='number'
            name='tokenAmount'
            placeholder='Amount of Tokens'
            value={formValues.tokenAmount}
            onChange={handleChange}
            />
          </div>
          <p className='error'>{formErrors.tokenAmount}</p>

          <div className='field'>
            <label>Email</label>
            <input 
            type='text'
            name='email'
            placeholder='Email'
            value={formValues.email}
            onChange={handleChange}
            />
          </div>
          <p className='error'>{formErrors.email}</p>

          <div className='field'>
            <label>ETH or Arbitrum wallet address</label>
            <input 
            type='text'
            name='walletAddress'
            placeholder='Wallet address'
            value={formValues.walletAddress}
            onChange={handleChange}
            />
          </div>
          <p className='error'>{formErrors.walletAddress}</p>

          <button className='button' type='submit'>Buy NAIAD</button>
        {/*</div>*/}

        
      </form>

    </div>
    </div>
  );
}

export default App;
