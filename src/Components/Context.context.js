import React from "react";
import { PRODUCTIONLINKWEBSOCKET, PRODUCTIONLINK } from "./staticLinks";
export const MyContext = React.createContext();

export default class ContextWrapper extends React.Component {
  state = {
    stocks: [],
    users: [],
    buyStocks: [],
    sellStocks: [],
    repository: [],
    name: "",
    email: "",
    password: "",
    wallet: 0,
    openSignUpModal: false,
    totalCP: 0,
    totalSP: 0,
    isLoginHidden: false,
  };

  handleSignIn = () => {
    this.setState({
      isLoginHidden: !this.state.isLoginHidden,
    });
  };
  handleOpenSignUpModal = () => {
    this.setState({
      openSignUpModal: !this.state.openSignUpModal,
    });
  };
  async componentDidMount() {
    const getStocks = await fetch(`${PRODUCTIONLINK}allStocks`, {
      method: "get",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const stocks = await getStocks.json();
    this.setState({
      stocks,
    });

    const email = sessionStorage.getItem("email");
    const password = sessionStorage.getItem("password");

    const createUser = await fetch(`${PRODUCTIONLINK}api/signIn`, {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password, email }),
    });
    const userResult = await createUser.json();
    if (userResult.user === "invalid user") {
      window.alert("Invalid User");
    } else if (email) {
      const {
        email,
        name,
        wallet,
        buyStocks,
        sellStocks,
        repository,
        totalCP,
        totalSP,
      } = userResult;

      sessionStorage.setItem("email", email);
      sessionStorage.setItem("password", password);
      sessionStorage.setItem("name", name);

      this.setUser(
        name,
        password,
        email,
        wallet,
        buyStocks,
        sellStocks,
        repository,
        totalCP,
        totalSP
      );
      this.MakeSocketConnection();
    }


    window.addEventListener("unload", function logData() {
      if (!navigator.sendBeacon) return;

      const obj = JSON.stringify({ email: email, password: password });
      const url = `${PRODUCTIONLINK}api/makeOffine`;

      navigator.sendBeacon(url, obj);
    });
  }
  

  setUser = async (
    name,
    password,
    email,
    wallet,
    buyStocks,
    sellStocks,
    repository,
    totalCP,
    totalSP
  ) => {
    if (name && password && email) {
      this.setState({
        name,
        password,
        email,
        wallet,
        buyStocks,
        sellStocks,
        repository,
        totalCP,
        totalSP,
      });
    } else {
      const email = sessionStorage.getItem("email");
      const password = sessionStorage.getItem("password");
      console.log("hello");
      fetch(`${PRODUCTIONLINK}api/signOut`, {
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password, email }),
      });

      sessionStorage.removeItem("email");
      sessionStorage.removeItem("password");
      sessionStorage.removeItem("name");

      this.setState({
        name: "",
        password: "",
        email: "",
        wallet: 0,
        buyStocks: "",
        sellStocks: "",
        repository: "",
        users: [],
        totalCP: 0,
        totalSP: 0,
      });
    }
  };
  updateWallet = (
    wallet,
    buyStocks,
    sellStocks,
    repository,
    totalCP,
    totalSP
  ) => {
    this.setState({
      wallet,
      buyStocks,
      sellStocks,
      repository,
      totalCP,
      totalSP,
    });
  };

  MakeSocketConnection = () => {
    const connection = new WebSocket(
      `${PRODUCTIONLINKWEBSOCKET}GetStocksUsersPersonalData`
    );
    connection.addEventListener("open", () => {
      console.log("connected");
    });
    connection.addEventListener("message", (e) => {
      const getParsedData = JSON.parse(e.data);
      const { users, stocks } = getParsedData;
      this.setState({
        users,
        stocks,
      });
    });
  };

  gainLossPercent = (SP, CP) => {
    let percentCalc, profitOrLoss, difference;
    if (SP && CP) {
      percentCalc = (((SP - CP) / CP) * 100).toFixed(2);
      profitOrLoss = percentCalc > 0 ? "Profit" : "Loss";
      difference = (SP - CP).toFixed(2);
    }else{
      percentCalc=0
      profitOrLoss=0
      difference=0;
    }

    return {
      percentCalc,
      profitOrLoss,
      difference,
    };
  };
  render() {
    return (
      <>
        <MyContext.Provider
          value={{
            state: this.state,
            setUser: this.setUser,
            handleOpenSignUpModal: this.handleOpenSignUpModal,
            MakeSocketConnection: this.MakeSocketConnection,
            updateWallet: this.updateWallet,
            gainLossPercent: this.gainLossPercent,
            handleSignIn: this.handleSignIn,
          }}
        >
          {this.props.children}
        </MyContext.Provider>
      </>
    );
  }
}
