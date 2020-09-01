import React from "react";
import "./App.scss";
import ContextWrapper from './Components/Context.context';
import StocksLoginWrapper from './Components/StocksLoginWrapper/StocksDashboard';
function App() {
  return (
    <ContextWrapper>
    <StocksLoginWrapper />
    </ContextWrapper>
  );
}

export default App;
