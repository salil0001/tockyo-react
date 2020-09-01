import React, { useContext, useEffect, useState } from "react";
import "./Dashboard.scss";
import Wallet from "./Wallet.svg";
import Dollar from "./Dollar.svg";
import { MyContext } from "../Context.context";
export default function Dashboard() {
  const getContext = useContext(MyContext);
  const [flickWallet, setFlickWallet] = useState(true);
  const {
    name,
    wallet,
    buyStocks,
    sellStocks,
    repository,
    totalSP,
    totalCP,
    email,
   
  } = getContext.state;
  const { gainLossPercent } = getContext;

  useEffect(() => {
    setFlickWallet(false);
    setTimeout(() => {
      setFlickWallet(true);
    }, 2000);
  }, [wallet, setFlickWallet]);
  return (
    <div className="dashboard-wrapper">
      {email ? (
        <React.Fragment>
          <h2>Hi {name}</h2>
          <div className="wallet-profits">
            <div
              className={
                flickWallet ? "wallet-amount" : "wallet-amount flick-wallet"
              }
            >
              <div>
                <div className="wallet-price">{wallet}</div>
                <div style={{ fontSize: "12px", color: "#888" }}>Balance</div>
              </div>
              <img src={Wallet} alt="wallet" />
            </div>

            <div
              className={
                flickWallet ? "overall-gain" : "overall-gain flick-wallet"
              }
            >
              <div>
                <div
                  className={
                    gainLossPercent(totalSP, totalCP).percentCalc > 0
                      ? "overall-profit green-color"
                      : "overall-profit red-color"
                  }
                >
                  {gainLossPercent(totalSP, totalCP).percentCalc}%
                </div>
                <div style={{ fontSize: "12px", color: "#888" }}>
                  C.P: {totalCP} S.P: {totalSP}
                </div>
              </div>
              <img src={Dollar} alt="dollar" />
            </div>
          </div>

          <div className="repository-wrapper">
            <h5>Your Holdings</h5>
            <table>
              <tbody>
                <tr>
                  <th>Symbol</th>
                  <th>Name</th>
                  <th>Avg C.P</th>
                  <th>Qty</th>
                  <th>Total</th>
                  <th>Current</th>
                  <th>Change</th>
                </tr>

                {repository.length === 0 ? (
                  <tr>
                    <td>There are no Holdings. Buy some stacks.</td>
                  </tr>
                ) : (
                  repository.map((stock) => {
                    return (
                      <tr key={stock.id}>
                        <td>{stock.stockSymbol}</td>
                        <td>{stock.stockName}</td>
                        <td>{stock.avgCostPrice}</td>
                        <td>{stock.buyQuantity}</td>
                        <td>
                          {(stock.buyQuantity * stock.avgCostPrice).toFixed(2)}
                        </td>
                        <td>Current</td>
                        <td>10.22%</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="buy-wrapper">
            <h5>Buy History</h5>
            <table>
              <tbody>
                <tr>
                  <th>Symbol</th>
                  <th>Name</th>
                  <th>Avg C.P</th>
                  <th>Qty</th>
                  <th>Total</th>
                </tr>
                {buyStocks.length === 0 ? (
                  <tr>
                    <td>Buy the stocks by click on the stocks</td>
                  </tr>
                ) : (
                  buyStocks.map((stock) => {
                    return (
                      <tr key={stock.id}>
                        <td>{stock.stockSymbol}</td>
                        <td>{stock.stockName}</td>
                        <td>{stock.costPrice}</td>
                        <td>{stock.buyQuantity}</td>
                        <td>
                          {(stock.costPrice * stock.buyQuantity).toFixed(2)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          <div className="sell-wrapper">
            <h5>Sell History</h5>
            <table>
              <tbody>
                <tr>
                  <th>Symbol</th>
                  <th>Name</th>
                  <th>Avg C.P</th>
                  <th>Qty</th>
                  <th>Avg S.P</th>
                  <th>Difference</th>
                  <th>P/Loss</th>
                </tr>

                {sellStocks.length === 0 ? (
                  <tr>
                    <td>The are no sell items</td>
                  </tr>
                ) : (
                  sellStocks.map((stock) => {
                    const { percentCalc, difference } = gainLossPercent(
                      stock.avgSellingPrice,
                      stock.avgCostPrice
                    );
                    return (
                      <tr key={stock.id}>
                        <td>{stock.stockSymbol}</td>
                        <td>{stock.stockName}</td>
                        <td>{stock.avgCostPrice}</td>
                        <td>{stock.quantity}</td>
                        <td>{stock.avgSellingPrice}</td>
                        <td>{difference}</td>
                        <td>{percentCalc}%</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </React.Fragment>
      ) : (
        <React.Fragment>Please Sign In or Sign Up</React.Fragment>
      )}
    </div>
  );
}
