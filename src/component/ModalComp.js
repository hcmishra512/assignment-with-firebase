import React from "react";
import { Modal, Header, Image, Button } from "semantic-ui-react";

const ModalComp = ({
  open,
  setOpen,
  img,
  name,
  info,
  phone,
  isWhatsApp,
  id,
  handleDelete,
}) => {
  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
    >
      <Modal.Header> User Detail</Modal.Header>
      <Modal.Content image>
        <Image size="medium" src={img} wrapped />
        <Modal.Description>
          <Header>{name}</Header>
          <p>{phone}</p>
          <p>{info}</p>
          <p>WhatsApp : {String(isWhatsApp)}</p>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button color="black" onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <Button
          color="red"
          content="Delete"
          icon="trash"
          labelPosition="right"
          onClick={() => handleDelete(id)}
        />
      </Modal.Actions>
    </Modal>
  );
};

export default ModalComp;
