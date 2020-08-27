import React, {useContext } from "react";
import "./OrderSheet.scss";
import { MyContext } from "../Context.context";

export default function OrderSheet () {
  const stocks = useContext(MyContext);
  const getStockCurrentPrice=(symbol)=>{
    const filterStock=stocks.state.stocks.filter((stock=>symbol===stock.symbol))
    return filterStock[0].currentPrice
  }
 
    return (
      <MyContext.Consumer>
        {(context) => {
          const {
            buyStocks,
            sellStocks,
            repository,
            totalCP,
            totalSP,
          } = context.state;
          return (
            <div
              className="Order-sheet-wrapper"
              hidden={
                buyStocks === "" && sellStocks === "" && repository === ""
              }
            >
              <div className="table-wrapper">
                <b>Trading History</b>
                <div className="trading-history-body">
                  <div className="available-stocks-wrapper">
                    Buy History
                    <div className="company-heading">
                      <div>Symbol</div>
                      <div>Qty</div>
                      <div>Cost Price</div>
                    </div>
                    {buyStocks &&
                      buyStocks.map((stock,index ) => {
                        return (
                          <div className="company-body" key={`${index}buy`}>
                            <div>{stock.stockSymbol}</div>
                            <div>{stock.buyQuantity}</div>
                            <div>{stock.costPrice}</div>
                          </div>
                        );
                      })}
                  </div>
                  <div className="available-stocks-wrapper">
                    Sell History
                    <div className="company-heading">
                      <div>symbol</div>
                      <div>quantity</div>
                      <div>avgCostPrice</div>
                      <div>TotalCP</div>
                      <div>avgSellingPrice</div>
                      <div>TotalSP</div>
                    </div>
                    {sellStocks &&
                      sellStocks.map((stock, index) => {
                        return (
                          <div className="company-body" key={`${index}sell`}>
                            <div>{stock.symbol}</div>
                            <div>{stock.quantity}</div>
                            <div>{stock.avgCostPrice}</div>
                            <div> {stock.totalCP}</div>
                            <div>{stock.avgSellingPrice}</div>
                            <div>{stock.totalSP}</div>
                          </div>
                        );
                      })}
                    <div >
                      Total ({totalSP} - {totalCP} = {(totalSP - totalCP).toFixed(2)}){" "}
                      <span hidden={totalSP - totalCP===0}>
                      {context.gainLossPercent(totalSP, totalCP).percentCalc}%{" "}
                      {context.gainLossPercent(totalSP, totalCP).percentCalc === 0
                        ? ""
                        : context.gainLossPercent(totalSP, totalCP)
                            .profitOrLoss}
                            </span>
                    </div>
                  </div>
                  <div className="available-stocks-wrapper">
                    Repository
                    <div className="company-heading">
                      <div>stockSymbol</div>
                      <div>avgCostPrice</div>
                      <div>buyQuantity</div>
                      <div>currentPrice</div>
                    </div>
                    {repository &&
                      repository.map((repo) => {
                        return (
                          <div className="company-body" key={repo.stockSymbol}>
                            <div>{repo.stockSymbol}</div>
                            <div>{repo.avgCostPrice}</div>
                            <div>{repo.buyQuantity}</div>
                            <div><span style={{background:"#000"}}>{getStockCurrentPrice(repo.stockSymbol)}</span></div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            </div>
          );
        }}
      </MyContext.Consumer>
    );
  
}
