import React, { Component } from 'react';
import { Button, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import { AccountHttp, Address  } from "nem-library";

class AccountForm extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleChangeAddress = this.handleChangeAddress.bind(this);
    this.getAccountInfo = this.getAccountInfo.bind(this);
    this.state = {
      address: this.props.address || '',
    };

    this.setBalance(this.props.address);
  }

  setBalance(address) {
    if (address !== null) {
      let accountHttp: AccountHttp = new AccountHttp();
      accountHttp.getFromAddress(new Address(address))
        .subscribe(accountInfoWithMetaData => {
          const balance = accountInfoWithMetaData.balance.balance / 1000
          this.props.setBalance(address, balance);
        });
    }
  }

  handleChangeAddress(e) {
    this.setState({ address: e.target.value });
  }

  getAccountInfo() {
    this.setState({ address: this.state.address });
    this.setBalance(this.state.address)
  }

  render () {
    return (
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
}

export default AccountForm;
