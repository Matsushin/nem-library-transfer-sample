import React, { Component } from 'react';
import { Navbar, Button, FormGroup, FormControl, Grid, Row, Col } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import './App.css';
import { AccountHttp, NEMLibrary, NetworkTypes, Address, TransferTransaction, XEM, TransactionHttp, TimeWindow, PlainMessage, Account } from "nem-library";

class App extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleChange = this.handleChange.bind(this);
    this.handleChangePrivateKey = this.handleChangePrivateKey.bind(this);
    this.handleGetAccountInfo = this.handleGetAccountInfo.bind(this);
    this.handleChangeTargetAddress = this.handleChangeTargetAddress.bind(this);
    this.handleChangeAmount = this.handleChangeAmount.bind(this);
    this.handleTransfer= this.handleTransfer.bind(this);

    this.state = {
      address: '',
      privateKey: '',
      targetAddress: '',
      balance: null,
      amount: 0,
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
          console.log(accountInfoWithMetaData)
          this.setState({ balance: accountInfoWithMetaData.balance.balance / 1000 });
        });
    }
  }

  handleChange(e) {
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

  handleGetAccountInfo() {
    this.props.history.push(`/?address=${this.state.address}`);
    this.setBalance(this.state.address);
  }

  handleTransfer() {
    const transferTransaction  = TransferTransaction.create(
        TimeWindow.createWithDeadline(),
        new Address(this.state.targetAddress),
        new XEM(this.state.amount),
        PlainMessage.create("送金テスト")
    );

    const account = Account.createWithPrivateKey(this.state.privateKey);
    const signedTransaction = account.signTransaction(transferTransaction);

    const transactionHttp = new TransactionHttp();
    transactionHttp.announceTransaction(signedTransaction)
    .subscribe(
        value => {console.log( "リクエスト結果：\n" + value.message);},
        err => {console.log( "失敗：\n" + err.toString());}
    );
  }

  render() {
    let contents;
    if (this.state.address != null) {
                contents = (
                  <div>
                    <h2>アカウント情報</h2>
                    <p>アドレス：{this.state.address}</p>
                    <p>残高： {this.state.balance / 1000}XEM</p>
                    <form>
                      <FormGroup>
                        <FormControl
                          type="text"
                          value={this.state.privateKey}
                          onChange={this.handleChangePrivateKey}
                          className='fit-input'
                        />
                      </FormGroup>
                      <FormGroup>
                        <FormControl
                          type="text"
                          value={this.state.targetAddress}
                          onChange={this.handleChangeTargetAddress}
                          className='fit-input'
                        />
                      </FormGroup>
                      <FormGroup>
                        <FormControl
                          type="text"
                          value={this.state.amount}
                          onChange={this.handleChangeAmount}
                        />
                      </FormGroup>
                    </form>
                    <Button bsStyle="primary" onClick={this.handleTransfer}>XEMを送金する</Button>
                  </div>
                )
              } else {
                contents = (
                  <div>
                    アドレスを入力してください。
                    <form>
                      <FormGroup>
                        <FormControl
                          type="text"
                          value={this.state.address}
                          onChange={this.handleChange}
                        />
                      </FormGroup>
                    </form>
                    <Button bsStyle="primary" onClick={this.handleGetAccountInfo}>アカウント情報を取得する</Button>
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
          <Row className="show-grid">
            <Col md={10}>
              { contents }
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default withRouter(App);
