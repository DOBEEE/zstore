// import {getVideoInfo, publishVideo} from '@/services/publish';

export default {
  state: {
    ccc: 1,
    a: {
      b: 2,
    },
  },
  reducers: {
    addNum(state, payload) {
      return {
        ...state,
        ccc: state.ccc + payload
      }
    },
    addNum2(state, payload) {
      return {
        ...state,
        a: {b: state.a.b + payload}
      }
    }
  },
  actions: (dispatch) => ({
    like(payload, rootState) {
      // this.doSomething(payload); // 调用 user 内的其他 effect 或 reducer
      // 另一种调用方式：dispatch.user.doSomething(payload);
      // dispatch.members.foo(payload); // 调用其他模型的 effect 或 reducer
    },
  }),
};
