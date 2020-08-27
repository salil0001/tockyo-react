import { MyContext } from "../Context.context";
import React, { useState, useEffect, useContext } from "react";
import "./TradingStocks.scss";
import {PRODUCTIONLINK} from '../staticLinks';
//import BuyConfirm from "./ConfirmMessage/BuyConfirm";
//import SellConfirm from "./ConfirmMessage/SellConfirm";

export default function TradingStocks() {
  const [isBuyHidden, setIsBuyHidden] = useState(true);
  const [buyQuantity, setBuyQuantity] = useState("");
  const [sellQuantity, setSellQuantity] = useState("");
  const [buySellColor, setBuySellColor] = useState(true);
  const [hideBuySellForm, setHideBuySellForm] = useState("");
  const [stocksDivLength, setStocksDivLength] = useState(0);
  //const [buyConfirmationDialog, setBuyConfirmationDialog] = useState(false);
  //const [sellConfirmationDialog, setSellConfirmationDialog] = useState(false);
  const [avalibleQuantityBackend,setAvailableQuantityBackend]=useState("")
  // const toggleBuyConfirmationDialog=()=>{
  //   setBuyConfirmationDialog(!buyConfirmationDialog)
  // }
  // const toggleSellConfirmationDialog=()=>{
  //   setSellConfirmationDialog(!sellConfirmationDialog)
  // }

  const stocks = useContext(MyContext);

  useEffect(() => {
    const { length } = stocks.state.stocks;
    setStocksDivLength(length);
  }, [stocks]);

  useEffect(() => {
    console.log()
    setBuySellColor(false);
   setTimeout(()=>{
    setBuySellColor(true);
   },1000)
  
  }, [stocks]);

  const handleChangeBuyQuantity = (e) => {
    setBuyQuantity(e.target.value);
  };
  const handleChangeSellQuantity = (e) => {
    setSellQuantity(e.target.value);
  };
  const calculatePercent = (currentPrice, todayPrice) => {
    return Number.parseFloat(
      ((currentPrice - todayPrice) / todayPrice) * 100
    ).toFixed(2); //taking 2 decimal
  };
  const fixTodecimal = (x) => {
    return x.toFixed(2);
  };
  return (
    <MyContext.Consumer>
      {(context) => {
        const { email, stocks, password,wallet} = context.state;

        const buyStock = async (event, stockId,currentPrice) => {
          event.preventDefault();
          if (!email) {
            context.handleOpenSignUpModal();
          } 
          else if((currentPrice * Math.pow(1.005, buyQuantity)*buyQuantity)>wallet){

            alert("Stock total amount is greater than the wallet price.")
          }
          else {
            const createUser = await fetch(
              `${PRODUCTIONLINK}api/buyStock`,
              {
                method: "post",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ password, email, stockId, buyQuantity }),
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
            setBuyQuantity("")
            setSellQuantity("")
          }
        };
        const sellStock = async (event, stockId) => {
          event.preventDefault();
          if (!email) {
            context.handleOpenSignUpModal();
          } else if(!(sellQuantity>0 && avalibleQuantityBackend>=sellQuantity)){
           
            alert("please select the adequate quantity")

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
                  stockId,
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

            setBuyQuantity("")
            setSellQuantity("")
          }
        };
        const getSellQuantity=async (email,password,symbol)=>{
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
                symbol
              }),
            })

            const quantity = await getQuantity.json();
            setAvailableQuantityBackend(quantity)
            setSellQuantity(quantity)
        }
        ///render
        return (
          <>
            <div className="stocks-wrapper-outer">
              <div
                className="stocks-wrapper"
                style={{
                  width: `${stocksDivLength * 230 + 24 * stocksDivLength}px`,
                }}
              >
                {stocks.map((stock) => {
                  return (
                    <>
                  
                    <div
                      className="per-stock"
                      key={stock.id}
                      onClick={() => setHideBuySellForm(stock.id)}
                    >

                      <b>{stock.symbol}</b>
                      <img
                        height="18px"
                        weight="18px"
                        src={stock.imageCDN}
                        alt="logo"
                        style={{ float: "right" }}
                      />
                      <div>{stock.name}</div>
                      <div className="current-price">
                        {stock.currentPrice} {stock.currency}
                      </div>
                      {stock.currentPrice - stock.todayPrice > 0 ? (
                        <div
                          className={
                            !buySellColor ? "white-color" : "green-color"
                          }
                        >
                          +{fixTodecimal(stock.currentPrice - stock.todayPrice)}{" "}
                          {calculatePercent(
                            stock.currentPrice,
                            stock.todayPrice
                          )}
                          %
                        </div>
                      ) : (
                        <div
                          className={!buySellColor ? "white-color" : "red-color"}
                        >
                          {fixTodecimal(stock.currentPrice - stock.todayPrice)}{" "}
                          {calculatePercent(
                            stock.currentPrice,
                            stock.todayPrice
                          )}
                          %
                        </div>
                      )}
                      <div>
                        <div>52 Week &#8593;: {stock.weekHigh52}</div>{" "}
                        <div>52 Low &#8595;: {stock.weekLow52}</div>
                      </div>
                      <div className="buy-sell-buttons">
                        <button
                          onClick={() => {
                            setIsBuyHidden(true);
                          }}
                          className="buy-wrapper"
                        >
                          BUY
                        </button>
                        <button
                          onClick={() => {
                            setIsBuyHidden(false);getSellQuantity(email,password,stock.symbol)
                          }}
                          className="sell-wrapper"
                        >
                          SELL
                        </button>
                      </div>
                      <div
                        className="sell-buy-wrapper"
                        hidden={hideBuySellForm !== stock.id}
                      >
                        <form
                          onSubmit={(event) => buyStock(event, stock.id,stock.currentPrice)}
                          hidden={!isBuyHidden}
                        >
                          <input
                            type="number"
                            value={buyQuantity}
                            required
                            
                            onChange={handleChangeBuyQuantity}
                          />
                          <button
                            className="buy-wrapper"
                            required
                            type="submit"
                          >
                            BUY
                          </button>
                        </form>
                        <form
                          hidden={isBuyHidden}
                          onSubmit={(event) => sellStock(event, stock.id)}
                        >
                          <input
                            type="number"
                            value={sellQuantity}
                            required
                            min="0" max={sellQuantity}
                          
                            onChange={handleChangeSellQuantity}
                          />
                          <button
                            className="sell-wrapper"
                            required
                            type="submit"
                          >
                            SELL
                          </button>
                        </form>
                      </div>
                    </div>
                    </>
                  );
                })}
              </div>
            </div>
          </>
        );
      }}
    </MyContext.Consumer>
  );
}
