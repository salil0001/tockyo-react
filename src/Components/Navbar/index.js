import React from "react";
import Logo from "./Logo.svg";
import "./Navbar.scss";
import { MyContext } from "../Context.context";

export default function Navbar() {
  return (
    <MyContext.Consumer>
      {(context) => {
        const { name, password, email, wallet } = context.state;

        return (
          <>
            <nav className="nav-wrapper-outer">
              <nav className="nav-wrapper">
                <div style={{ display: "flex",justifyContent:"space-between",width:"100%" }}>
                  <div style={{ display: "flex"}}>
                    <img src={Logo} alt="stock trading-logo" />
                    <h5 style={{margin:"0px 0px 0px 12px"}}>Tokyo Stock Exchange</h5>
                  </div>

                  <div style={{ justifyContent: "right",display:"flex" }}>
                    {email && name && password ? (
                      ""
                    ) : (
                      <div
                        className="nav-attribute cursor-pointer"
                        onClick={() => context.handleSignIn()}
                      >
                        Log In
                      </div>
                    )}

                    {name ? (
                      ""
                    ) : (
                      <div
                        className="nav-attribute cursor-pointer"
                        onClick={() => context.handleOpenSignUpModal()}
                      >
                        {" "}
                        Sign Up
                      </div>
                    )}
                  </div>
                </div>
                {wallet ? (
                  <div
                    className="nav-attribute cursor-pointer"
                    onClick={() => context.setUser()}
                  >
                    Logout
                  </div>
                ) : (
                  ""
                )}
              </nav>
            </nav>
          </>
        );
      }}
    </MyContext.Consumer>
  );
}
