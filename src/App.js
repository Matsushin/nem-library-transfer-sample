import React, { Component } from 'react';
import { Navbar, Button, FormGroup, FormControl, ControlLabel, Grid, Row, Col } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import { AccountHttp, NEMLibrary, NetworkTypes, Address } from "nem-library";
import AccountForm from './form/AccountForm';
import TransferForm from './form/TransferForm';

class App extends Component {
  constructor(props, context) {
    super(props, context);

    this.getAccountInfo = this.getAccountInfo.bind(this);
    this.state = {
      address: '',
      balance: null,
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

  getAccountInfo(address) {
    this.props.history.push(`/?address=${this.state.address}`);
    this.setBalance(address);
  }

  render() {
    let contents;
    if (this.state.balance != null) {
      contents = (
        <div>
          <h2>アカウント情報</h2>
          <p>アドレス：{this.state.address}</p>
          <p>残高： {this.state.balance / 1000}XEM</p>
          <TransferForm />
        </div>
      )
    } else {
      contents = <AccountForm getAccountInfo={this.getAccountInfo} />
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
