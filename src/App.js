import React, { Component } from 'react';
import logo from './logo.svg';
import { Button, FormGroup, FormControl } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import './App.css';
import { AccountHttp, NEMLibrary, NetworkTypes, Address } from "nem-library";

class App extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleChange = this.handleChange.bind(this);
    this.handleGetAccountInfo = this.handleGetAccountInfo.bind(this);
    this.handleChangeValue = this.handleChange.bind(this);

    this.state = {
      address: '',
      balance: null,
      value: null,
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

  handleChange(e) {
    this.setState({ address: e.target.value });
  }

  handleChangeValue(e) {
    this.setState({ value: e.target.value });
  }

  handleGetAccountInfo() {
    this.props.history.push(`/?address=${this.state.address}`);
    this.setBalance(this.state.address);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        NEMアドレスを入力してください。
        <form>
          <FormGroup>
          <FormControl
            type="text"
            value={this.state.address}
            onChange={this.handleChange}
          />
          </FormGroup>
        </form>
        <p>{ this.state.balance != null ? `${this.state.balance}XEM` : null }</p>
        <Button bsStyle="primary" onClick={this.handleGetAccountInfo}>アカウント情報を取得する</Button>
        <form>
          <FormGroup>
          <FormControl
            type="text"
            value={this.state.value}
            onChange={this.handleChangeValue}
          />
          </FormGroup>
        </form>
        <Button bsStyle="primary">XEMを送金する</Button>
      </div>
    );
  }
}

export default withRouter(App);
