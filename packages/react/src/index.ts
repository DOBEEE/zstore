import { useReducer } from 'react';
import useDispatch from './useDispatch';
import useSelector from './useSelector';
const useStore = (initialState: any) => {
  const reducer = (state: any, action: { payload: any }) => {
    return {
      ...state,
      ...action.payload,
    };
  };
  const [state, dispatch] = useReducer(reducer, initialState);
  // const [val, setVal] = useState(initialState);
  const setV = (v: any) => {
    // setVal({...val, ...v});
    dispatch({ payload: { ...v } });
  };
  return [state, setV];
};
export {
  useDispatch,
  useSelector,
  useStore
}