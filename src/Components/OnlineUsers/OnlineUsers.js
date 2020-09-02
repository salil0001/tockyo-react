import React from "react";
import "./OnlineUsers.scss";
import { MyContext } from "../Context.context";
export default function OnlineUsers() {
  return (
    <div className="players-wrapper">
      <h5 style={{ textAlign: "center", margin: "10px 0px 10px 0px" }}>
        Players
      </h5>
      <table>
        <tbody>
          <MyContext.Consumer>
            {(context) => {
              const { users,email } = context.state;
              return (
                <>
                  {users.length?
                    users.map((user) => {
                     const {percentCalc}=  context.gainLossPercent(user.totalSP,user.totalCP)
                      return (
                        <tr key={user.id}>
                          <td className="player-name">
                            <b> {user.name} {user.email===email?"(you)":""}</b>
                          </td>
                          <td>
                            {user.isOnline ? (
                              <>
                                Online <span className="online-available " />
                              </>
                            ) : (
                              <>
                                Offline
                                <span className="offline-available" />
                              </>
                            )}
                          </td>
                          <td className={percentCalc>0?" green-color " :" red-color "}>
                            <b>{percentCalc}%</b>
                          </td>
                        </tr>
                      );
                    }):<tr><td>Login First</td></tr>}
                </>
              );
            }}
          </MyContext.Consumer>
        </tbody>
      </table>
    </div>
  );
}
