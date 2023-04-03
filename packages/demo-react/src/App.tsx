import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from '@sstore/react';

// ttiPolyfill.getFirstConsistentlyInteractive({}).then((tti) => {
//   // Use `tti` value in some way.
//   console.log('tti:', tti);
// });
export default () => {
  const { addNum, addNum2 } = useDispatch('test')(window.store);
  const ccc = useSelector((state) => state.test.ccc)(window.store);
  console.log('update');
  return (
    <div>
      <button onClick={() => addNum(1)}>点我</button>
      <button onClick={() => addNum2(2)}>点我测试精准更新</button>
      <div>{ccc}</div>
    </div>
  );
};
