import React, { Component } from 'react';
import { Navbar, Button, FormGroup, FormControl, ControlLabel, Grid, Row, Col, Alert } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import { AccountHttp, NEMLibrary, NetworkTypes, Address, TransferTransaction, XEM, TransactionHttp, TimeWindow, PlainMessage, Account } from "nem-library";

class App extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleChangeAddress = this.handleChangeAddress.bind(this);
    this.handleChangePrivateKey = this.handleChangePrivateKey.bind(this);
    this.getAccountInfo = this.getAccountInfo.bind(this);
    this.handleChangeTargetAddress = this.handleChangeTargetAddress.bind(this);
    this.handleChangeAmount = this.handleChangeAmount.bind(this);
    this.transfer= this.transfer.bind(this);
    this.state = {
      address: '',
      privateKey: '',
      targetAddress: '',
      balance: null,
      amount: 0,
      successMessage: '',
      errorMessage: '',
    };
  }

  componentWillMount() {
    NEMLibrary.bootstrap(NetworkTypes.TEST_NET);
    const params = new URLSearchParams(this.props.location.search);
    const address = params.get('address');
    this.setBalance(address);
  }

  setBalance(address) {
    if (address !== null) {
      let accountHttp: AccountHttp = new AccountHttp();
      this.setState({ address: address });
      accountHttp.getFromAddress(new Address(address))
        .subscribe(accountInfoWithMetaData => {
          this.setState({ balance: accountInfoWithMetaData.balance.balance / 1000 });
        });
    }
  }

  handleChangeAddress(e) {
    this.setState({ address: e.target.value });
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

  getAccountInfo() {
    this.props.history.push(`/?address=${this.state.address}`);
    this.setBalance(this.state.address);
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

  render() {
    let contents;
    if (this.state.balance != null) {
      let transferResult;
      if (this.state.successMessage != '') {
        transferResult = (
          <Alert bsStyle="success">
            <h4>送金成功</h4>
            <p>{this.state.successMessage}</p>
          </Alert>
        )
      } else if (this.state.errorMessage != '') {
        transferResult = (
          <Alert bsStyle="danger">
            <h4>送金失敗</h4>
            <p>{this.state.errorMessage}</p>
          </Alert>
        )
      }

      contents = (
        <div>
          <h2>アカウント情報</h2>
          <p>アドレス：{this.state.address}</p>
          <p>残高： {this.state.balance / 1000}XEM</p>
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
    } else {
      contents = (
        <div>
          <h2>アカウント情報の取得</h2>
          <form>
            <FormGroup>
              <ControlLabel>アドレス</ControlLabel>
              <FormControl
                type="text"
                placeholder="ここにNEMアドレスを入力して下さい"
                value={this.state.address}
                onChange={this.handleChangeAddress}
              />
            </FormGroup>
          </form>
          <Button bsStyle="primary" onClick={this.getAccountInfo}>アカウント情報を取得する</Button>
        </div>
      )
    }
    return (
      <div>
        <Navbar>
          <Navbar.Header>
            <Navbar.Brand>
              <a href="/">NEM Library Transfer Sample</a>
            </Navbar.Brand>
          </Navbar.Header>
        </Navbar>
        <Grid>
          <Row>
            <Col md={6}>
              { contents }
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default withRouter(App);
