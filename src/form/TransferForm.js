import React, { Component } from 'react';
import { Button, FormGroup, FormControl, ControlLabel, Row, Col, Alert } from 'react-bootstrap';
import { Address, TransferTransaction, XEM, TransactionHttp, TimeWindow, PlainMessage, Account } from "nem-library";

class TransferForm extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleChangePrivateKey = this.handleChangePrivateKey.bind(this);
    this.handleChangeTargetAddress = this.handleChangeTargetAddress.bind(this);
    this.handleChangeAmount = this.handleChangeAmount.bind(this);
    this.transfer= this.transfer.bind(this);
    this.state = {
      privateKey: '',
      targetAddress: '',
      amount: 0,
      successMessage: '',
      errorMessage: '',
    };
  }

  handleChangePrivateKey(e) {
    this.setState({ privateKey: e.target.value });
  }

  handleChangeTargetAddress(e) {
    this.setState({ targetAddress: e.target.value });
  }

  handleChangeAmount(e) {
    this.setState({ amount: e.target.value });
  }

  transfer() {
    const transferTransaction  = TransferTransaction.create(
        TimeWindow.createWithDeadline(),
        new Address(this.state.targetAddress),
        new XEM(this.state.amount),
        PlainMessage.create("送金テスト")
    );

    const account = Account.createWithPrivateKey(this.state.privateKey);
    const signedTransaction = account.signTransaction(transferTransaction);
    const transactionHttp = new TransactionHttp();
    this.setState({ successMessage: '', errorMessage: ''});
    transactionHttp.announceTransaction(signedTransaction)
      .subscribe(
          value => {
            console.log( "リクエスト結果：\n" + value.message);
            this.setState({ successMessage: value.message });
          },
          err => {
            console.log( "失敗：\n" + err.toString());
            this.setState({ errorMessage: err.toString() });
          }
      );
  }

  render () {

    let transferResult;
    if (this.state.successMessage !== '') {
      transferResult = (
        <Alert bsStyle="success">
          <h4>送金成功</h4>
          <p>{this.state.successMessage}</p>
        </Alert>
      )
    } else if (this.state.errorMessage !== '') {
      transferResult = (
        <Alert bsStyle="danger">
          <h4>送金失敗</h4>
          <p>{this.state.errorMessage}</p>
        </Alert>
      )
    }

    return (
      <div>
        <h2>送金</h2>
        <form>
          <FormGroup>
            <ControlLabel>送金先アドレス</ControlLabel>
            <FormControl
              type="text"
              value={this.state.targetAddress}
              onChange={this.handleChangeTargetAddress}
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>秘密鍵</ControlLabel>
            <FormControl
              type="text"
              value={this.state.privateKey}
              onChange={this.handleChangePrivateKey}
            />
          </FormGroup>
          <Row>
            <Col md={2}>
              <FormGroup>
                <ControlLabel>送金金額</ControlLabel>
                <FormControl
                  type="number"
                  value={this.state.amount}
                  onChange={this.handleChangeAmount}
                />
              </FormGroup>
            </Col>
          </Row>
        </form>
        <Button bsStyle="primary" onClick={this.transfer}>XEMを送金する</Button>
        <h2>送金結果</h2>
        { transferResult }
      </div>
    )
  }
}

export default TransferForm;
