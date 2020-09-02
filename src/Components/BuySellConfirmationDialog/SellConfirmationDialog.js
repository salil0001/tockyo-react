import React,{useContext, useState, useEffect} from "react";
import ConfirmationModal from "../ConfirmationModal";
import {MyContext} from '../Context.context';
import {PRODUCTIONLINK} from '../staticLinks';
import "./Confirmation.scss";

export default function SellConfirmationDialog(props) {
  const getContext = useContext(MyContext);
  const [sellQuantity,setSellQuantity]=useState("")
  const [availableQuantityBackend,setAvailableQuantityBackend]=useState(0)
  const [disableSellButton,setDisableSellButton]=useState(true)
  const { email, password} = getContext.state;
  const context=getContext


  const handleSellQuantity=(e)=>{
    setSellQuantity(e.target.value)
  }

  const sellStock = async (event) => {
    event.preventDefault();
    if (!email) {
      context.handleOpenSignUpModal();
    } 
    
    else if(!(sellQuantity>0 && availableQuantityBackend>=sellQuantity)){
      alert("please Enter the adequate quantity")
    }
    
    else if(parseInt(sellQuantity) !== parseFloat(sellQuantity))    {
      alert(`Please Enter the integer.`)
    }
    
    else
    {
      
      const createUser = await fetch(
        `${PRODUCTIONLINK}api/sellStock`,
        {
          method: "post",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password,
            email,
            stockId:props.id,
            sellQuantity,
          }),
        }
      );

      const isBuyStockSucceed = await createUser.json();
        
      if (isBuyStockSucceed.wallet) {
        context.updateWallet(
          isBuyStockSucceed.wallet,
          isBuyStockSucceed.buyStocks,
          isBuyStockSucceed.sellStocks,
          isBuyStockSucceed.repository,
          isBuyStockSucceed.totalCP,
          isBuyStockSucceed.totalSP
        );
      }

      setDisableSellButton(false)
      setSellQuantity("")
      props.handeToggleSellDialog();
    }
  };
  

  useEffect(()=>{
  
    const getSellQuantity=async ()=>{
      const getQuantity = await fetch(
        `${PRODUCTIONLINK}api/getSellQuantity`,
        {
          method: "post",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password,
            email,
            symbol:props.symbol
          }),
        })
  
        const quantity = await getQuantity.json();
        setAvailableQuantityBackend(quantity)
        setSellQuantity(quantity)
        setDisableSellButton(false)
    }

    getSellQuantity();
  },[email,password,props.symbol])

  return (
    <ConfirmationModal>
      <div className="sell-wrapper-parent">
        <div className="confirmation-wrapper">
          <h5>{props.symbol} ({props.name})</h5>
          <div>Qty: {sellQuantity} X Price: {props.currentPrice} = {(sellQuantity*props.currentPrice).toFixed(2) }</div>
        </div>
        <form className="form-wrapper" onSubmit={sellStock}>
          <div>
            <div>52 Week High</div>

            <div className="backend-data">{props.weekHigh52}</div>
          </div>
          <div>
            <div>52 Week Low</div>

            <div className="backend-data">{props.weekLow52}</div>
          </div>

          <div>
            <div>Price</div>

          <div className="backend-data">{props.currentPrice}</div>
          </div>
          <div>
            <div>Qty</div>
            <div>
              <input placeholder={availableQuantityBackend} value={sellQuantity} type="number" required  onChange={handleSellQuantity}/>
            </div>
          </div>
          <div className="buy-sell-buttons">
            <button className="buy-confirm" disabled={disableSellButton} >SELL <span role="img" aria-label="buy">&#x2705;</span></button>
            <button onClick={()=>props.handeToggleSellDialog()} className="cancel-confirm">Cancel &#10007;</button>
          </div>
        </form>
      </div>
    </ConfirmationModal>
  );
}
