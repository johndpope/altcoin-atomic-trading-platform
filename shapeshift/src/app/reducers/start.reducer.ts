import {SwapProcess} from '../models/swap-process.model';
import * as swap from '../actions/start.action';
import {EthCoinModel} from '../models/coins/eth-coin.model';
import {BtcCoinModel} from '../models/coins/btc-coin.model';
import {Coin} from '../models/coins/coin.model';

export interface State {
  swapProcess: SwapProcess;
  link: string;
}

export const initialState: State = {
  swapProcess: {
    depositCoin: new EthCoinModel(),
    receiveCoin: new BtcCoinModel(),
    activeStep: 1,
  } as SwapProcess,
  link: undefined,
};

export function reducer(state = initialState, action: swap.Actions): State {
  switch (action.type) {
    case swap.SWAP_DEPOSIT_RECEIVE_COINS: {
      const temp = state.swapProcess.depositCoin;
      return {
        ...state,
        swapProcess: {
          ...state.swapProcess,
          depositCoin: state.swapProcess.receiveCoin,
          receiveCoin: temp,
        },
      };
    }
    case swap.START_SWAP: {
      return {
        ...state,
        swapProcess: {
          ...state.swapProcess,
          depositCoin: action.payload.depositCoin,
          receiveCoin: action.payload.receiveCoin,
          activeStep: 2,
        },
      };
    }
    case swap.SET_ACTIVE_STEP: {
      return {
        ...state,
        swapProcess: {
          ...state.swapProcess,
          activeStep: action.payload,
        },
      };
    }
    case swap.SET_LINK: {
      return {
        ...state,
        link: action.payload,
      };
    }
    case swap.SET_DEPOSIT_AMOUNT: {
      const newState: any = {
        ...state,
        swapProcess: {
          ...state.swapProcess,
          depositCoin: state.swapProcess.depositCoin
            .update({amount: action.payload} as Coin),
        },
      };
      return newState;
    }
    case swap.SET_RECEIVE_AMOUNT: {
      const newState: any = {
        ...state,
        swapProcess: {
          ...state.swapProcess,
          receiveCoin: state.swapProcess.receiveCoin
            .update({amount: action.payload} as Coin),
        },
      };
      return newState;
    }
    case swap.COMPLETE_SWAP: {
      return {
        ...state,
        swapProcess: {
          ...state.swapProcess,
          activeStep: 3,
        },
      };
    }
    default: {
      return state;
    }
  }
}

export const getSwapProcess = (state: State) => state.swapProcess;
export const getDepositCoin = (state: State) => state.swapProcess.depositCoin;
export const getReceiveCoin = (state: State) => state.swapProcess.receiveCoin;
export const getLink = (state: State) => state.link;
export const getActiveStep = (state: State) => state.swapProcess.activeStep;