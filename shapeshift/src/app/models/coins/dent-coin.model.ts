import {Coin} from "./coin.model";
import {Coins} from "./coins.enum";
import { Observable } from "rxjs/Observable";
import { WalletRecord } from "../../reducers/balance.reducer";
import {TOKENS} from "altcoinio-wallet";
import {EthWallet} from "../wallets/eth-wallet";
import {ShapeshiftStorage} from "../../common/shapeshift-storage";

export class DentCoinModel implements Coin {
  readonly derive = undefined;
  readonly type: Coins = Coins.DENT;
  readonly name: string = Coins[Coins.DENT].toString();
  readonly fullName: string = "Dent";
  readonly icon: string = "assets/icon/dent-icon.png";
  amount;
  faucetLoading: boolean = false;
  $balance: Observable<WalletRecord>;
  $amountUSD: Observable<number>;

  constructor() {
  }

  update(coin: DentCoinModel): DentCoinModel {
    const model = new DentCoinModel();
    model.amount = coin ? coin.amount : 0;
    return model;
  }

  getTokens(){
    const ethCoinModel = new EthWallet();
    const xprivKey = ShapeshiftStorage.get("btcprivkey");
    const keystore = ethCoinModel.recover(xprivKey);
    ethCoinModel.login(keystore, xprivKey);
    const token = ethCoinModel.getERC20Token(TOKENS.DENT);
    return token.faucet();
  }
}
