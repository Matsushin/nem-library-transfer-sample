import React, { Component } from 'react';
import { Button, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import { Address, TransferTransaction, XEM, TransactionHttp, TimeWindow, PlainMessage, Account } from "nem-library";

class AccountForm extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleChangeAddress = this.handleChangeAddress.bind(this);
    this.state = {
      address: '',
    };
  }

  handleChangeAddress(e) {
    this.setState({ address: e.target.value });
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
        <Button bsStyle="primary" onClick={() => this.props.getAccountInfo(this.state.address)}>アカウント情報を取得する</Button>
      </div>
    )
  }
}

export default AccountForm;
