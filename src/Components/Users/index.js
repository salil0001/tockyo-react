import React, { useState, useEffect, useContext } from "react";
import "./Users.scss";
import { MyContext } from "../Context.context";
export default function Users() {
  const [frameLength, getFrameLength] = useState(0);
  const getUsers = useContext(MyContext);
  useEffect(() => {
    getFrameLength(getUsers.state.users.length);
  }, [getUsers]);
  return (
    <MyContext.Consumer>
      {(context) => {
        const { users, email } = context.state;
       
        return (
          <div className="user-wrapper-outer">
            <div
              className="user-wrapper"
              style={{ width: `${frameLength * 11}em` }}
            >
              {users.map((user) => {
                return (
                  <div className="user-wrap" key={user.id}>
                    <img src={user.displayPicture} height="60px" width="60px" alt="display"/>
                    <div>
                      {user.name}
                      {user.email === email ? "(you)" : ""}
                    </div>
                    Active{" "}
                    {user.isOnline ? (
                      <img
                        height="20px"
                        width="20px"
                        src="https://img.icons8.com/emoji/48/000000/green-circle-emoji.png"
                        alt="available"
                      />
                    ) : (
                      <img
                        height="20px"
                        width="20px"
                        src="https://img.icons8.com/office/16/000000/sleeping.png"
                        alt="sign"
                      />
                    )}
                    <div>Gain/Loss: {(user.totalSP-user.totalCP).toFixed(2)} USD</div>
                    <div>
                    Profit/Loss: {context.gainLossPercent(user.totalSP,user.totalCP).percentCalc}%
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }}
    </MyContext.Consumer>
  );
}
