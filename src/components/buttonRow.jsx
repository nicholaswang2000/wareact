import React from "react";
import Button from "react-bootstrap/Button";

const ButtonRow = ({
  isLoaded,
  gameOver,
  autoclick,
  reshuffled,
  hasStarted,
  flipCard,
  enableAutoclick,
  disableAutoclick,
  reshuffle,
  handleShow,
}) => {
  return (
    <React.Fragment>
      <div className="row">
        <div className="col center">
          <button
            onClick={flipCard}
            className="btn btn-primary btn-lg"
            disabled={!isLoaded || gameOver}
          >
            Flip
          </button>
        </div>
        <div className="col center">
          {!autoclick && (
            <Button
              variant="primary btn-lg"
              onClick={enableAutoclick}
              disabled={!isLoaded || gameOver}
            >
              Enable Autoflip
            </Button>
          )}
          {autoclick && (
            <Button
              variant="primary btn-lg"
              onClick={disableAutoclick}
              disabled={gameOver}
            >
              Disable Autoflip
            </Button>
          )}
        </div>
        <div className="col center">
          <button
            onClick={reshuffle}
            className="btn btn-primary btn-lg"
            disabled={!isLoaded || gameOver || reshuffled}
          >
            Shuffle
          </button>
        </div>
      </div>
      <div className="row">
        <div className="col center">
          <button
            onClick={handleShow}
            className="btn btn-danger btn-lg"
            disabled={gameOver || !hasStarted}
          >
            Restart
          </button>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ButtonRow;
