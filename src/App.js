import { useState, useEffect } from 'react';
import './App.css';
const axios = require('axios').default;

function App() {

  const initialValues = {tokenAmount:0, walletAddress:""};
  const [formValues, setFormValues]= useState(initialValues);
  const [formErrors, setFormErrors]= useState({});
  const [isSubmit, setIsSubmit] = useState(false);

  const handleChange = (e) => {

    const {name, value} = e.target;
    setFormValues({ ...formValues, [name]: value});
  };
  
  async function getCharge(){

    try{
      const response = await axios.get(`http://localhost:3001/create-charge?tokenAmount=${formValues.tokenAmount}&walletAddress=${formValues.walletAddress}`);
      const data = await response.data
      window.location.href = data.hosted_url
    } catch (error) {
    console.error(error);
      }
    

  }
  //TO DO handle error, encode URL?
  const handleSubmit = (e) => {
    e.preventDefault();
    setFormErrors(validate(formValues));
    setIsSubmit(true);
    getCharge();
/*
    axios.get(`http://localhost:3001/create-charge?tokenAmount=${formValues.tokenAmount}&walletAddress=${formValues.walletAddress}`)
    .then(response.json())
    */
    //console.log(formValues.tokenAmount);
    /*
    fetch('http://localhost:3001/api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formValues),
    })
      .then(res => {console.log(res)})
      */
      //.then(fetch('http://localhost:3001/create-charge'))
      
  };

  useEffect(() => {
    if(Object.keys(formErrors).length === 0 && isSubmit) {
      console.log(formValues);
    }
  });

//testowy portfel
//0x7F2e915C432F222943bDa4A216D50d514EfC55f0
//regex dla ETH wallet portfela, arbitrum ma taki sam kod portfela
  const validate = (values) => {
    const errors = {};
    const regex = /^0x[a-fA-F0-9]{40}$/g;

    if(!values.tokenAmount){
      errors.tokenAmount = "Quantity of tokens required";
    } else if (values.tokenAmount < 50 ) {
      errors.tokenAmount = "Minimum amount of tokens is 50";
    } 
  
    if(!values.walletAddress){
      errors.walletAddress = "Wallet address is required";
    } else if (!regex.test(values.walletAddress)) {
      errors.walletAddress = "Wallet address is not valid, check your Arbitrum/ETH wallet address";
    }

    return errors;
  };

  return (
    <div className='container'>
      
      <form onSubmit={handleSubmit}>
        <h1>
          store form
        </h1>
        <div className='ui divider'>
          <hr className='solid'/>
        </div>
        <div className='ui form'>
          
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
          <p>{formErrors.tokenAmount}</p>

          <div className='field'>
            <label>ETH or Arbitrum wallet address where you want to recieve NAIAD</label>
            <input 
            type='text'
            name='walletAddress'
            placeholder='Wallet address'
            value={formValues.walletAddress}
            onChange={handleChange}
            />
          </div>
          <p>{formErrors.walletAddress}</p>

          <button className='button'>Buy NAIAD</button>
        </div>
      </form>
    </div>
  );
}

export default App;
