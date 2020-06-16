import React, { Component } from "react";
import FooterPage from "./components/footer";
import ModalView from "./components/alert";
import ButtonRow from "./components/buttonRow";
import CardView from "./components/cardView";
import Header from "./components/header";
import "./App.css";

class App extends Component {
  counterId = 0;

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
    autoclick: false,
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
            autoclick: false,
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

  enableAutoclick = () => {
    this.setState({ autoclick: true });
    this.intervalId = setInterval(this.flipCard, 600);
  };

  disableAutoclick = (counter) => {
    this.setState({ autoclick: false });
    clearInterval(this.intervalId);
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
      showModal,
      autoclick,
    } = this.state;

    return (
      <div className="container">
        <Header />
        <CardView
          reshuffled={reshuffled}
          playerCard={playerCard}
          playerRemaining={playerRemaining}
          cpuCard={cpuCard}
          cpuRemaining={cpuRemaining}
          cardsInDiscard={cardsInDiscard}
          winnerOfRound={winnerOfRound}
          isLoaded={isLoaded}
          hasStarted={hasStarted}
        />
        <ButtonRow
          isLoaded={isLoaded}
          gameOver={gameOver}
          autoclick={autoclick}
          reshuffled={reshuffled}
          hasStarted={hasStarted}
          flipCard={this.flipCard}
          enableAutoclick={this.enableAutoclick}
          disableAutoclick={this.disableAutoclick}
          reshuffle={this.reshuffle}
          handleShow={this.handleShow}
        />
        <FooterPage />
        <ModalView
          showModal={showModal}
          handleClose={this.handleClose}
          handleShow={this.handleShow}
          reset={this.reset}
        />
      </div>
    );
  }
}

export default App;
