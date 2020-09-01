/* eslint-disable no-unused-expressions */
import React, { useState, useEffect, useContext } from "react";
import "./StockWrapper.scss";
import UpArrow from "./up-chevron.svg";
import ByConfirmationDialog from "../BuySellConfirmationDialog/BuyConfirmationDialog";
import SellConfirmationDialog from "../BuySellConfirmationDialog/SellConfirmationDialog";
import { MyContext } from "../Context.context";
export default function StockWrapper() {
  const [onHoverRow, setOnHoverRow] = useState(true);
  const [isBuyModalHidden, setIsBuyModalHidden] = useState(false);
  const [isSellButtonHidden, setIsSellButtonHidden] = useState(false);
  const [selectedStockId, setSelectedStockId] = useState({});
  const [flicktheChanges, setFlickTheChanges] = useState(false);
  const getContext = useContext(MyContext);
  const { stocks } = getContext.state;
  const {gainLossPercent} = getContext;
  const handeToggleBuyDialog = () => {
    setIsBuyModalHidden(!isBuyModalHidden);
  };
  const handeToggleSellDialog = () => {
    setIsSellButtonHidden(!isSellButtonHidden);
  };

  useEffect(() => {
    setFlickTheChanges(true);
    setTimeout(() => {
      setFlickTheChanges(false)
    }, 2000);
  }, [stocks]);

  return (
    <>
      {isBuyModalHidden ? (
        <ByConfirmationDialog
          {...selectedStockId}
          handeToggleBuyDialog={() => handeToggleBuyDialog()}
        />
      ) : (
        ""
      )}
      {isSellButtonHidden ? (
        <SellConfirmationDialog
          {...selectedStockId}
          handeToggleSellDialog={() => handeToggleSellDialog()}
        />
      ) : (
        ""
      )}

      <div className="stocks-wrapper">
        <h5>Stocks</h5>
        <div className="stock-wrapper">
          <table>
            <tbody>
              {stocks.length ? (
                stocks.map((stock) => {
                  const { percentCalc } = gainLossPercent(
                    stock.currentPrice,
                    stock.todayPrice
                  );

                  return (
                    <React.Fragment key={stock.id}>
                      <tr
                        id={stock.id}
                        onClick={() => {
                          setOnHoverRow(!onHoverRow);
                          setSelectedStockId(stock);
                        }}
                        
                      >
                        <td className="stock-name">{stock.symbol}</td>
                        <td>
                          <img
                            src={stock.imageCDN}
                            height="20px"
                            width="20px"
                            alt="logo"
                          />
                        </td>
                        <td>
                          <span
                            style={
                              onHoverRow && selectedStockId.id === stock.id
                                ? {}
                                : { visibility: "hidden" }
                            }
                            className="buy-button"
                            onClick={() => handeToggleBuyDialog()}
                          >
                            BUY
                          </span>{" "}
                          <span
                            style={
                              onHoverRow && selectedStockId.id === stock.id
                                ? {}
                                : { visibility: "hidden" }
                            }
                            className="sell-button"
                            onClick={() => handeToggleSellDialog()}
                          >
                            SELL
                          </span>
                        </td>
                        <td className={flicktheChanges ? "flickClass " : ""}  >
                          {stock.currentPrice}
                        </td>
                        <td>
                        <img src={UpArrow} alt="up arrow" />
                        </td>
                        <td  className={percentCalc <0 ? "green-color" : "red-color"}>
                          <b>{percentCalc}%</b>
                        </td>
                      </tr>
                    </React.Fragment>
                  );
                })
              ) : (
                <tr key={"random 1"}>
                  <td>Please wait while stock loads.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
