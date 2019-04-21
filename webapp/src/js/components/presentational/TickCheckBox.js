import React, { useState } from 'react';

function TickCheckBox({ handle }) {
  const useCheckbox = (val = true) => {
    const [value, setValue] = useState(val);
    let func = event => {
      setValue(event.target.checked);
      handle(event.target);
    };
    return [value, func];
  };
  const [checked, setChecked] = useCheckbox();
  return (
    <div>
      <input type="checkbox" checked={checked} onChange={setChecked} /> Simple
      Moving Average
    </div>
  );
}

export default TickCheckBox;
