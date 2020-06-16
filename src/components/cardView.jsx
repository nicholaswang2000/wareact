import React from "react";

const CardView = ({
  reshuffled,
  playerCard,
  playerRemaining,
  cpuCard,
  cpuRemaining,
  cardsInDiscard,
  winnerOfRound,
  isLoaded,
  hasStarted,
}) => {
  return (
    <div className="row">
      <div className="col center">
        <h3>Player</h3>
        {(!reshuffled && (
          <img
            src={
              playerCard.image ||
              "https://lh3.googleusercontent.com/proxy/4kf6PbTTRAnXLxO6J4_yOd7ozCXY-1SZtBLsnrGYjI9YihW9jbGMetczrrt-eSWkSqDXCBuz854eKSRz05iDJzciurh_6J5g0unsYdmC16xTulwJ"
            }
            alt={playerCard.value + " of " + playerCard.suit}
            width="226"
            height="314"
          />
        )) ||
          (reshuffled && (
            <img
              src={
                "https://lh3.googleusercontent.com/proxy/4kf6PbTTRAnXLxO6J4_yOd7ozCXY-1SZtBLsnrGYjI9YihW9jbGMetczrrt-eSWkSqDXCBuz854eKSRz05iDJzciurh_6J5g0unsYdmC16xTulwJ"
              }
              alt={playerCard.value + " of " + playerCard.suit}
              width="226"
              height="314"
            />
          ))}
        <div>
          <span>Remaining: {playerRemaining}</span>
          <br></br>
          {!isLoaded && <span style={{ color: "gray" }}>Resetting...</span>}
          {isLoaded && winnerOfRound === "player" && (
            <span style={{ color: "green" }}>-{cardsInDiscard / 2}</span>
          )}
          {isLoaded && winnerOfRound === "cpu" && (
            <span style={{ color: "red" }}>+{cardsInDiscard / 2}</span>
          )}
          {isLoaded && winnerOfRound === "war" && (
            <span style={{ color: "gray" }}>+0</span>
          )}
          {!hasStarted && isLoaded && <span style={{ color: "gray" }}>+0</span>}
        </div>
      </div>
      <div className="col center">
        <h3>CPU</h3>
        {(!reshuffled && (
          <img
            src={
              cpuCard.image ||
              "https://lh3.googleusercontent.com/proxy/4kf6PbTTRAnXLxO6J4_yOd7ozCXY-1SZtBLsnrGYjI9YihW9jbGMetczrrt-eSWkSqDXCBuz854eKSRz05iDJzciurh_6J5g0unsYdmC16xTulwJ"
            }
            alt={cpuCard.value + " of " + cpuCard.suit}
            width="226"
            height="314"
          />
        )) ||
          (reshuffled && (
            <img
              src={
                "https://lh3.googleusercontent.com/proxy/4kf6PbTTRAnXLxO6J4_yOd7ozCXY-1SZtBLsnrGYjI9YihW9jbGMetczrrt-eSWkSqDXCBuz854eKSRz05iDJzciurh_6J5g0unsYdmC16xTulwJ"
              }
              alt={playerCard.value + " of " + playerCard.suit}
              width="226"
              height="314"
            />
          ))}
        <div>
          <span>Remaining: {cpuRemaining}</span>
          <br></br>
          {!isLoaded && <span style={{ color: "gray" }}>Resetting...</span>}
          {isLoaded && winnerOfRound === "cpu" && (
            <span style={{ color: "green" }}>-{cardsInDiscard / 2}</span>
          )}
          {isLoaded && winnerOfRound === "player" && (
            <span style={{ color: "red" }}>+{cardsInDiscard / 2}</span>
          )}
          {isLoaded && winnerOfRound === "war" && (
            <span style={{ color: "gray" }}>+0</span>
          )}
          {!hasStarted && isLoaded && <span style={{ color: "gray" }}>+0</span>}
        </div>
      </div>
    </div>
  );
};

export default CardView;
