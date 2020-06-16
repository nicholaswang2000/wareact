import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
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
    showModal: false,
    clicks: 0,
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
            showModal: false,
            clicks: 0,
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
                this.finishGame();
              }
            );
        },
        (error) => {
          this.finishGame();
        }
      );
  };

  reset = () => {
    this.componentDidMount();
  };

  addLoserPile = (loser, winner) => {
    const player_api =
      "https://deckofcardsapi.com/api/deck/" +
      this.state.deckId +
      "/pile/" +
      loser +
      "/add/?cards=" +
      this.state.cardsToAdd;

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
          this.finishGame();
        }
      );
  };

  addWarPile = () => {
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
            if (this.state.cpuRemaining >= 3) {
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
                  },
                  (error) => {
                    this.setState({
                      isLoaded: false,
                      error,
                    });
                  }
                );
            } else {
              fetch(
                "https://deckofcardsapi.com/api/deck/" +
                  this.state.deckId +
                  "/pile/cpu/draw/?count=" +
                  this.state.cpuRemaining.toString(10)
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
                  },
                  (error) => {
                    this.setState({
                      isLoaded: false,
                      error,
                    });
                  }
                );
            }
          },
          (error) => {
            this.setState({
              isLoaded: false,
              error,
            });
          }
        );
    } else {
      fetch(
        "https://deckofcardsapi.com/api/deck/" +
          this.state.deckId +
          "/pile/player/draw/?count=" +
          this.state.playerRemaining.toString(10)
      )
        .then((res) => res.json())
        .then(
          (result) => {
            const codes = result.cards.map((code) => code.code);
            for (var i = 0; i < codes.length; i++) {
              cardCodes += codes[i] + ",";
            }
            if (this.state.cpuRemaining >= 3) {
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
                  },
                  (error) => {
                    this.setState({
                      isLoaded: false,
                      error,
                    });
                  }
                );
            } else {
              fetch(
                "https://deckofcardsapi.com/api/deck/" +
                  this.state.deckId +
                  "/pile/cpu/draw/?count=" +
                  this.state.cpuRemaining.toString(10)
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
                  },
                  (error) => {
                    this.setState({
                      isLoaded: false,
                      error,
                    });
                  }
                );
            }
          },
          (error) => {
            this.setState({
              isLoaded: false,
              error,
            });
          }
        );
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
    const clicks = this.state.clicks + 1;
    this.setState({
      isLoaded: false,
      reshuffled: false,
      hasStarted: true,
      clicks,
    });

    fetch(player_api)
      .then((res) => res.json())
      .then(
        (result) => {
          this.cpuFlip(result.cards[0]);
        },
        (error) => {
          this.setState({
            isLoaded: false,
            error,
          });
        }
      );
  };

  cpuFlip = (playerCard) => {
    const cpu_api =
      "https://deckofcardsapi.com/api/deck/" +
      this.state.deckId +
      "/pile/cpu/draw/bottom/";
    fetch(cpu_api)
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState({
            playerCard,
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
          this.finishGame();
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
          this.finishGame();
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
          this.finishGame();
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
          this.finishGame();
        }
      );
  };

  finishGame = () => {
    const winner = "player"
      ? this.state.playerRemaining < this.state.cpuRemaining
      : "cpu";
    this.setState({
      playerRemaining: 0,
      cpuRemaining: 0,
      winner,
      gameOver: true,
    });
  };

  handleClose = () => this.setState({ showModal: false });
  handleShow = () => this.setState({ showModal: true });

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
      showModal,
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
          <div className="col center">
            <h1>WAR</h1>
          </div>
        </div>
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
          <div className="col center">
            <button
              onClick={this.flipCard}
              className="btn btn-primary btn-lg"
              disabled={!isLoaded || gameOver}
            >
              Flip
            </button>
          </div>
          <div className="col center">
            <button
              onClick={this.reshuffle}
              className="btn btn-primary btn-lg"
              disabled={!isLoaded || gameOver || reshuffled}
            >
              Shuffle
            </button>
          </div>
          <div className="col center">
            <button
              onClick={this.handleShow}
              className="btn btn-danger btn-lg"
              disabled={!isLoaded || gameOver || !hasStarted}
            >
              Restart
            </button>
          </div>
        </div>

        <Alert variant="success">
          <p>If this is going too slowly, use the autoclick button!</p>
          <hr />
          <div className="d-flex justify-content-end">
            <Button variant="outline-success">Autoclick</Button>
          </div>
        </Alert>

        <Modal show={showModal} onHide={this.handleShow}>
          <Modal.Header>
            <Modal.Title>Warning</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to reset the game? You will lose all progress!
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={this.handleClose}>
              Close
            </Button>
            <Button variant="danger" onClick={this.reset}>
              Reset
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default App;
