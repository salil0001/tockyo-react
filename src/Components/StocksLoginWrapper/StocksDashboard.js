import React,{useContext} from "react";
import "./StocksLoginDashBoard.scss";
import Navbar from "../Navbar";
import StockWrapper from "../StockWrapper/StockWrapper";
import OnlineUsers from "../OnlineUsers/OnlineUsers";
import DashBoard from "../Dasboard/Dashboard";
import SignUp from "../SignSignUp/SignUp";
import SignIn from "../SignSignUp/SignIn";
import {MyContext} from '../Context.context';
export default function StocksLoginWrapper() {

const makeConsumer=useContext(MyContext);
const {openSignUpModal}=makeConsumer.state
const {handleOpenSignUpModal}=makeConsumer
const {isLoginHidden}=makeConsumer.state
const {handleSignIn}=makeConsumer


  return (
    <>
      {isLoginHidden ? <SignIn handleSignIn={() => handleSignIn()} /> : ""}

      {openSignUpModal ? (
        <SignUp handleSignUp={() => handleOpenSignUpModal()} />
      ) : (
        ""
      )}
      <div className="stocks-login-wrapper">
        <div className="stocks-side">
          <StockWrapper />
          <OnlineUsers />
        </div>
        <div className="nav-dashboard-wrapper">
          <Navbar />
          <DashBoard />
        </div>
      </div>
    </>
  );
}
