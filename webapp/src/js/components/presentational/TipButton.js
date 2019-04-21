import React from 'react';
import { BadgerBase } from 'badger-components-react';

import styled from 'styled-components';

const CoolButton = styled.button`
  padding: 12px 20px;
  outline: currentcolor none medium;
  color: rgb(255, 255, 255);
  cursor: pointer;
  background-color: #3b9b29;
  border: 1px solid #3b9b29;
  box-shadow: rgb(77, 77, 77) 1px 1px 1px;
  transform: translateY(0px);
  border-radius: 4px;
  position: relative;
  min-width: 150px;
`;

class MyButton extends React.Component {
  render() {
    // Props from higher order component
    const {
      handleClick,
      to,
      price,
      currency,
      amount,
      coinDecimals,
      step
    } = this.props;
    let text = 'Tip with badger';
    if (typeof window == 'undefined' && typeof window.Web4Bch == 'undefined') {
      text = 'Login with badger';
    }
    return (
      <div>
        <CoolButton onClick={handleClick}>{text}</CoolButton>
      </div>
    );
  }
}

// Wrap with BadgerBase higher order component
export default BadgerBase(MyButton);
