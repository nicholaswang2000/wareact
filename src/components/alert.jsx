import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const ModalView = ({ showModal, handleClose, handleShow, reset }) => {
  return (
    <Modal show={showModal} onHide={handleShow}>
      <Modal.Header>
        <Modal.Title>Warning</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to reset the game? You will lose all progress!
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="danger" onClick={reset}>
          Reset
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalView;
