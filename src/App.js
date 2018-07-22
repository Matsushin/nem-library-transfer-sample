import React, { Component } from 'react';
import { Navbar, Grid, Row, Col } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import { NEMLibrary, NetworkTypes } from "nem-library";
import AccountForm from './form/AccountForm';
import TransferForm from './form/TransferForm';

class App extends Component {
  constructor(props, context) {
    super(props, context);

    this.setBalance = this.setBalance.bind(this);
    this.state = {
      address: '',
      balance: null,
    };
  }

  componentWillMount() {
    NEMLibrary.bootstrap(NetworkTypes.TEST_NET);
    const params = new URLSearchParams(this.props.location.search);
    const address = params.get('address');
    this.setState({ address: address });
  }

  setBalance(address, balance) {
      this.props.history.push(`/?address=${address}`);
      this.setState({ address: address, balance: balance });
  }

  render() {
    let contents;
    if (this.state.balance !== null) {
      contents = (
        <div>
          <h2>アカウント情報</h2>
          <p>アドレス：{this.state.address}</p>
          <p>残高： {this.state.balance / 1000}XEM</p>
          <TransferForm />
        </div>
      )
    } else {
      contents = <AccountForm address={this.state.address} setBalance={this.setBalance} />
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
