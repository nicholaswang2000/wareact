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
  let cardBack =
    "https://vignette.wikia.nocookie.net/hearthstone/images/c/c4/Card_back-Default.png/revision/latest/scale-to-width-down/340?cb=20140823204025";
  return (
    <div className="row">
      <div className="col center">
        <h3>Player</h3>
        {(!reshuffled && (
          <img
            src={playerCard.image || cardBack}
            alt={playerCard.value + " of " + playerCard.suit}
            width="226"
            height="314"
          />
        )) ||
          (reshuffled && (
            <img
              src={cardBack}
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
            src={cpuCard.image || cardBack}
            alt={cpuCard.value + " of " + cpuCard.suit}
            width="226"
            height="314"
          />
        )) ||
          (reshuffled && (
            <img
              src={cardBack}
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
