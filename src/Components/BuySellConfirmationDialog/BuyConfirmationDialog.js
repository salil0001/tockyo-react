import React, { useContext, useState } from "react";
import ConfirmationModal from "../ConfirmationModal";
import "./Confirmation.scss";
import { MyContext } from "../Context.context";
import {PRODUCTIONLINK} from '../staticLinks';
export default function ByConfirmationDialog(props) {
  const getContext = useContext(MyContext);
  const { email, password,wallet } = getContext.state;
  const context=getContext
  const [buyQuantity,setBuyQuantity]=useState(0)
  const [disableButton,setDisableButton]=useState(false)
  const handleChangebuyQuantity=(e)=>{
    setBuyQuantity(e.target.value)
  }
  const buyStock = async (event) => {
    event.preventDefault();
    if (!email) {
    context.handleOpenSignUpModal();
    } 
    else if (buyQuantity<=0 || (parseInt(buyQuantity) !== parseFloat(buyQuantity))) {
    alert(`Buy Quantity cannot be ${buyQuantity} but atleast 1`)
    } 
    else if((props.currentPrice * Math.pow(1.005, buyQuantity) * buyQuantity)>wallet){
      alert("Stock total amount is greater than the wallet price.")
    }
    else {
      setDisableButton(true)
      const createUser = await fetch(
        `${PRODUCTIONLINK}api/buyStock`,
        {
          method: "post",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password, email, stockId:props.id, buyQuantity }),
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
      setBuyQuantity("");
      setDisableButton(false)
      props.handeToggleBuyDialog();
    }
  };
  
 

  return (
    <ConfirmationModal>
      <div className="buy-wrapper-parent ">
        <div className="confirmation-wrapper">
          <h5>RIL (Reliance Industries Limited)</h5>
          <div>Qty: {buyQuantity} X Price: {props.currentPrice} = {(buyQuantity*props.currentPrice).toFixed(2) } </div>
        </div>
        <form className="form-wrapper" onSubmit={buyStock}>
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
            <div>IPO</div>

        <div className="backend-data">{props.yearIPO}</div>
          </div>
          <div>
            <div>Qty</div>
            <div>
              <input type="number" required onChange={handleChangebuyQuantity}/>
            </div>
          </div>
          <div className="buy-sell-buttons">
            <button disabled={disableButton} type="submit" className="buy-confirm">
              Buy <span role="img" aria-label="buy"> &#x2705;</span>
            </button>
            <button
              className="cancel-confirm"
              onClick={() => props.handeToggleBuyDialog()}
            >
              Cancel <span role="img" aria-label="buy">&#10007;</span>
            </button>
          </div>
        </form>
      </div>
    </ConfirmationModal>
  );
}
