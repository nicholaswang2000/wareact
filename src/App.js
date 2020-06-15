import React, { Component } from "react";
import "./App.css";

class App extends Component {
  state = {
    isLoaded: false,
    deckId: 0,
    hasStarted: false,
    reshuffled: false,
    playerRemaining: 26,
    cpuRemaining: 26,
    inWar: false,
    winnerOfRound: null,
    playerCard: { image: null },
    cpuCard: { image: null },
    cardsToAdd: "",
    cardsInDiscard: 0,
    gameOver: false,
    winner: null,
  };

  componentDidMount() {
    fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
      .then((res) => res.json())
      .then(
        (result) => {
          const { deck_id, shuffled } = result;
          this.setState({
            deckId: deck_id,
            shuffled: shuffled,
          });
          this.splitPiles();
        },
        (error) => {
          this.setState({
            isLoaded: false,
            error,
          });
        }
      );
  }

  reshuffle = () => {
    const player_api =
      "https://deckofcardsapi.com/api/deck/" +
      this.state.deckId +
      "/pile/player/shuffle/";
    const cpu_api =
      "https://deckofcardsapi.com/api/deck/" +
      this.state.deckId +
      "/pile/cpu/shuffle/";
    this.setState({ isLoaded: false });
    fetch(player_api)
      .then((res) => res.json())
      .then(
        (result) => {
          fetch(player_api)
            .then((res) => res.json())
            .then(
              (result) => {
                this.setState({ isLoaded: true, reshuffled: true });
              },
              (error) => {
                this.setState({
                  isLoaded: false,
                  error,
                });
              }
            );
        },
        (error) => {
          this.setState({
            isLoaded: false,
            error,
          });
        }
      );
  };

  reset = () => {};

  addLoserPile = (loser, winner) => {
    const player_api =
      "https://deckofcardsapi.com/api/deck/" +
      this.state.deckId +
      "/pile/" +
      loser +
      "/add/?cards=" +
      this.state.cardsToAdd;
    console.log(this.state.cardsToAdd);

    fetch(player_api)
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState({
            playerRemaining: result.piles.player.remaining,
            cpuRemaining: result.piles.cpu.remaining,
            winnerOfRound: winner,
            cardsToAdd: "",
            inWar: false,
          });
          if (this.state.playerRemaining === 0) {
            this.setState({
              gameOver: true,
              winner: "player",
            });
          } else if (this.state.cpuRemaining === 0) {
            this.setState({
              gameOver: true,
              winner: "cpu",
            });
          }
        },
        (error) => {
          this.setState({
            isLoaded: false,
            error,
          });
        }
      );
  };

  addWarPile = () => {
    this.reshuffle();
    var cardCodes = "";
    if (this.state.playerRemaining >= 3) {
      fetch(
        "https://deckofcardsapi.com/api/deck/" +
          this.state.deckId +
          "/pile/player/draw/?count=3"
      )
        .then((res) => res.json())
        .then(
          (result) => {
            const codes = result.cards.map((code) => code.code);
            for (var i = 0; i < codes.length; i++) {
              cardCodes += codes[i] + ",";
            }
            fetch(
              "https://deckofcardsapi.com/api/deck/" +
                this.state.deckId +
                "/pile/cpu/draw/?count=3"
            )
              .then((res) => res.json())
              .then(
                (result) => {
                  const codes = result.cards.map((code) => code.code);
                  for (var i = 0; i < codes.length; i++) {
                    cardCodes += codes[i] + ",";
                  }
                  cardCodes += this.state.cardsToAdd;
                  const cardsInDiscard = this.state.cardsInDiscard + 6;
                  this.setState({
                    cardsToAdd: cardCodes,
                    cardsInDiscard,
                    inWar: true,
                    winnerOfRound: "war",
                  });
                  console.log(this.state.cardsToAdd);
                },
                (error) => {
                  this.setState({
                    isLoaded: false,
                    error,
                  });
                }
              );
          },
          (error) => {
            this.setState({
              isLoaded: false,
              error,
            });
          }
        );
    } else {
    }
    if (this.state.cpuRemaining >= 3) {
    } else {
    }
  };

  checkValue = () => {
    const playerValue = this.state.playerCard.value;
    const cpuValue = this.state.cpuCard.value;
    if (playerValue < cpuValue) {
      this.addLoserPile("player", "cpu");
    } else if (playerValue > cpuValue) {
      this.addLoserPile("cpu", "player");
    } else {
      this.addWarPile();
    }
  };

  addToDiscardPile = (cardStr) => {
    cardStr += ",";
    cardStr += this.state.cardsToAdd;
    const cardsInDiscard = this.state.cardsInDiscard + 2;
    this.setState({ cardsToAdd: cardStr, cardsInDiscard });
  };

  flipCard = () => {
    const player_api =
      "https://deckofcardsapi.com/api/deck/" +
      this.state.deckId +
      "/pile/player/draw/bottom/";
    this.setState({ isLoaded: false, reshuffled: false, hasStarted: true });

    fetch(player_api)
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState({
            playerCard: result.cards[0],
          });
          this.cpuFlip();
        },
        (error) => {
          this.setState({
            isLoaded: false,
            error,
          });
        }
      );
  };

  cpuFlip = () => {
    const cpu_api =
      "https://deckofcardsapi.com/api/deck/" +
      this.state.deckId +
      "/pile/cpu/draw/bottom/";
    fetch(cpu_api)
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState({
            cpuCard: result.cards[0],
          });
          if (this.state.playerCard.value === "JACK") {
            this.setState((prevState) => {
              let playerCard = { ...prevState.playerCard };
              playerCard.value = "11";
              return { playerCard };
            });
          } else if (this.state.playerCard.value === "QUEEN") {
            this.setState((prevState) => {
              let playerCard = { ...prevState.playerCard };
              playerCard.value = "12";
              return { playerCard };
            });
          } else if (this.state.playerCard.value === "KING") {
            this.setState((prevState) => {
              let playerCard = { ...prevState.playerCard };
              playerCard.value = "13";
              return { playerCard };
            });
          } else if (this.state.playerCard.value === "ACE") {
            this.setState((prevState) => {
              let playerCard = { ...prevState.playerCard };
              playerCard.value = "1";
              return { playerCard };
            });
          }
          if (this.state.cpuCard.value === "JACK") {
            this.setState((prevState) => {
              let cpuCard = { ...prevState.cpuCard };
              cpuCard.value = "11";
              return { cpuCard };
            });
          } else if (this.state.cpuCard.value === "QUEEN") {
            this.setState((prevState) => {
              let cpuCard = { ...prevState.cpuCard };
              cpuCard.value = "12";
              return { cpuCard };
            });
          } else if (this.state.cpuCard.value === "KING") {
            this.setState((prevState) => {
              let cpuCard = { ...prevState.cpuCard };
              cpuCard.value = "13";
              return { cpuCard };
            });
          } else if (this.state.cpuCard.value === "ACE") {
            this.setState((prevState) => {
              let cpuCard = { ...prevState.cpuCard };
              cpuCard.value = "1";
              return { cpuCard };
            });
          }
          const cpuStr = this.state.cpuCard.value;
          const playerStr = this.state.playerCard.value;
          this.setState((prevState) => {
            let cpuCard = { ...prevState.cpuCard };
            cpuCard.value = parseInt(cpuStr);
            let playerCard = { ...prevState.playerCard };
            playerCard.value = parseInt(playerStr);
            return { playerCard };
          });
          const cardStr =
            this.state.playerCard.code + "," + this.state.cpuCard.code;

          if (!this.state.inWar) {
            this.setState({ cardsInDiscard: 0 });
          }
          this.addToDiscardPile(cardStr);
          this.checkValue();
          this.setState({ isLoaded: true });
        },
        (error) => {
          this.setState({
            isLoaded: false,
            error,
          });
        }
      );
  };

  splitPiles = () => {
    const id_api =
      "https://deckofcardsapi.com/api/deck/" +
      this.state.deckId +
      "/draw/?count=52";
    fetch(id_api)
      .then((res) => res.json())
      .then(
        (result) => {
          this.assignPlayerPiles(result.cards);
        },
        (error) => {
          this.setState({
            isLoaded: false,
            error,
          });
        }
      );
  };

  assignPlayerPiles = (cards) => {
    var playerCards = [];
    var cpuCards = [];
    var playerCardString = "";
    var cpuCardString = "";
    for (var i = 0; i < 26; i++) {
      playerCards.push(cards[i]);
      cpuCards.push(cards[26 + i]);
      playerCardString += cards[i].code + ",";
      cpuCardString += cards[26 + i].code + ",";
    }
    playerCardString = playerCardString.substring(
      0,
      playerCardString.length - 1
    );
    cpuCardString = cpuCardString.substring(0, cpuCardString.length - 1);

    this.playerPile(playerCardString, cpuCardString);
  };

  playerPile = (strP, strC) => {
    let player_api =
      "https://deckofcardsapi.com/api/deck/" +
      this.state.deckId +
      "/pile/player/add/?cards=" +
      strP;
    fetch(player_api)
      .then((res) => res.json())
      .then(
        (result) => {
          this.cpuPile(strC);
        },
        (error) => {
          this.setState({
            isLoaded: false,
            error,
          });
        }
      );
  };

  cpuPile = (str) => {
    let cpu_api =
      "https://deckofcardsapi.com/api/deck/" +
      this.state.deckId +
      "/pile/cpu/add/?cards=" +
      str;

    fetch(cpu_api)
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState({ isLoaded: true });
        },
        (error) => {
          this.setState({
            isLoaded: false,
            error,
          });
        }
      );
  };

  render() {
    const {
      isLoaded,
      hasStarted,
      reshuffled,
      playerCard,
      playerRemaining,
      cpuCard,
      cpuRemaining,
      winnerOfRound,
      cardsInDiscard,
      gameOver,
      winner,
    } = this.state;
    // if (!isLoaded) {
    //   return (
    //     <div className="spinner-border" role="status">
    //       <span className="sr-only">Loading...</span>
    //     </div>
    //   );
    // }
    return (
      <div className="container">
        <div className="row">
          <div className="col">
            <h1>Player</h1>
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
            <p>Remaining: {playerRemaining}</p>
            {!isLoaded && <p style={{ color: "gray" }}>Resetting...</p>}
            {isLoaded && winnerOfRound === "player" && (
              <p style={{ color: "green" }}>-{cardsInDiscard / 2}</p>
            )}
            {isLoaded && winnerOfRound === "cpu" && (
              <p style={{ color: "red" }}>+{cardsInDiscard / 2}</p>
            )}
            {isLoaded && winnerOfRound === "war" && (
              <p style={{ color: "gray" }}>+0</p>
            )}
            {!hasStarted && isLoaded && <p style={{ color: "gray" }}>+0</p>}
          </div>
          <div className="col">
            <h1>CPU</h1>
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
            <p>Remaining: {cpuRemaining}</p>
            {!isLoaded && <p style={{ color: "gray" }}>Resetting...</p>}
            {isLoaded && winnerOfRound === "cpu" && (
              <p style={{ color: "green" }}>-{cardsInDiscard / 2}</p>
            )}
            {isLoaded && winnerOfRound === "player" && (
              <p style={{ color: "red" }}>+{cardsInDiscard / 2}</p>
            )}
            {isLoaded && winnerOfRound === "war" && (
              <p style={{ color: "gray" }}>+0</p>
            )}
            {!hasStarted && isLoaded && <p style={{ color: "gray" }}>+0</p>}
          </div>
        </div>
        <div className="row">
          <div className="col">
            <button
              onClick={this.flipCard}
              className="btn btn-primary btn-lg"
              disabled={!isLoaded || gameOver}
            >
              Flip
            </button>
          </div>
          <div className="col">
            <button
              onClick={this.reshuffle}
              className="btn btn-primary btn-lg"
              disabled={!isLoaded || gameOver || reshuffled}
            >
              Shuffle
            </button>
          </div>
          <div className="col">
            <button
              onClick={this.reset}
              className="btn btn-danger btn-lg"
              disabled={!isLoaded || gameOver}
            >
              Restart
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
