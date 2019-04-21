import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import Card from 'react-bootstrap/Card';
import BCHDonateQr from '../../../assets/BitcoinCash_QR_code.png';
import ETHDonateQr from '../../../assets/Ethereum_QR_code.png';
import NANODonateQr from '../../../assets/Nano_QR_code.png';

const DonateModal = ({ show, onHide }) => (
  <Modal
    size="lg"
    show={show}
    onHide={onHide}
    aria-labelledby="contained-modal-title-vcenter"
  >
    <Modal.Header closeButton>
      <Modal.Title id="contained-modal-title-vcenter">
        Help Support Us
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Container>
        <Row>
          <Col sm={12} md={4}>
            <Card>
              <Card.Img variant="top" src={BCHDonateQr} />
              <Card.Body>
                <Card.Text>
                  qrllm98myzu7lprv5lsjrzd3ruuexx2tpcxdjhhwk0
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col sm={12} md={4}>
            <Card>
              <Card.Img variant="top" src={ETHDonateQr} />
              <Card.Body>
                <Card.Text>
                  0x45CBfae07E82644Da7aC5D64CB8c3b01DBBe7695
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col sm={12} md={4}>
            <Card>
              <Card.Img variant="top" src={NANODonateQr} />
              <Card.Body>
                <Card.Text>
                  xrb_3pr1p7kk87dbmh8bxt67rhutto8s446kku6tnu1s4uhe8ajd83r9behe197g
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Modal.Body>
    <Modal.Footer>
      <Button onClick={onHide}>Close</Button>
    </Modal.Footer>
  </Modal>
);

export default DonateModal;
