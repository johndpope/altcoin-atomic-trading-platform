import {AfterViewInit, Component, OnInit, ViewChild} from "@angular/core";
import {MatDialog} from "@angular/material";
import {Store} from "@ngrx/store";
import {Observable} from "rxjs/Observable";
import {TOKENS} from "altcoinio-wallet";
import {GetBtcBalanceAction, GetEthBalanceAction, GetTokenBalanceAction} from "../actions/balance.action";
import {scaleInOutAnimation} from "../animations/animations";
import {Coin, CoinFactory} from "../models/coins/coin.model";
import {Coins} from "../models/coins/coins.enum";
import {MessageTypes} from "../models/message-types.enum";
import {AppState} from "../reducers/app.state";
import {WalletRecord} from "../reducers/balance.reducer";
import {
  getBTCBalance,
  getETHBalance,
  getTokenBalanceAragon,
  getTokenBalanceAugur,
  getTokenBalanceBat,
  getTokenBalanceBytom,
  getTokenBalanceCivic,
  getTokenBalanceDent,
  getTokenBalanceDistrict0x,
  getTokenBalanceEos,
  getTokenBalanceGnosis,
  getTokenBalanceGolem,
  getTokenBalanceOmiseGo,
  getTokenBalances,
  getTokenBalanceSalt,
  getTokenBalanceStatusNetwork,
  getTokenBalanceSubstratum,
  getTokenBalanceTron
} from "../selectors/balance.selector";
import * as quoteSelector from "../selectors/quote.selector";
import {AllCoinsDialogComponent} from "../common/coins-dialog/all-coins.dialog";
import {Go} from "../actions/router.action";
import {AltcoinioStorage} from "../common/altcoinio-storage";
import {TransactionService} from "../services/transaction.service";

@Component({
  selector: "app-wallet",
  templateUrl: "./wallet.component.html",
  styleUrls: ["./wallet.component.scss"],
  animations: [scaleInOutAnimation]
})
export class WalletComponent implements OnInit, AfterViewInit {
  @ViewChild('perfectScrollbar') perfectScrollbar;
  scaleInOut = "scaleInOut";
  infoMsg: string;
  messageTypes: typeof MessageTypes = MessageTypes;
  Coins = Coins;
  allCoins: Array<Coin>;
  selectedCoin: Coin;
  sendAmount: Number = 0.00;
  $tokenBalanceAugur: Observable<WalletRecord>;
  $tokenBalanceGolem: Observable<WalletRecord>;
  $tokenBalanceAragon: Observable<WalletRecord>;
  $tokenBalanceEos: Observable<WalletRecord>;
  $tokenBalanceSalt: Observable<WalletRecord>;
  $tokenBalanceBat: Observable<WalletRecord>;
  $tokenBalanceGnosis: Observable<WalletRecord>;
  $tokenBalanceCivic: Observable<WalletRecord>;
  $tokenBalanceDistrict0x: Observable<WalletRecord>;
  $tokenBalanceStatusNetwork: Observable<WalletRecord>;
  $tokenBalanceSubstratum: Observable<WalletRecord>;
  $tokenBalanceTron: Observable<WalletRecord>;
  $tokenBalanceBytom: Observable<WalletRecord>;
  $tokenBalanceDent: Observable<WalletRecord>;
  $tokenBalanceOmiseGo: Observable<WalletRecord>;
  $ethBalance: Observable<WalletRecord>;
  $btcBalance: Observable<WalletRecord>;
  randomValue = 0.001;
  elementType: "url";
  value = "Techiediaries";

  filteredCoins: Array<Coin>;
  search;

  inMyPossesion: boolean = localStorage.getItem("show_posession") ? localStorage.getItem("show_posession") === "true" : false;

  constructor(private store: Store<AppState>, public dialog: MatDialog) {
    this.allCoins = CoinFactory.createAllCoins();
    this.filteredCoins = [...this.allCoins];
    this.selectedCoin = this.allCoins[0];
  }

  ngOnInit() {
    const xprivKey = AltcoinioStorage.get("btcprivkey");
    if (!xprivKey) {
      this.store.dispatch(new Go({
        path: ["/wallet/empty"],
      }));
    } else {
      this.infoMsg = "This wallet is to be used for testnet coins only. Do not send real Bitcoin or Ethereum to these addresses.";
      this.getTokenBalances();
      this.getTokenAmountUSD();
    }
  }

  ngAfterViewInit() {
    // this.selectedCoin.$balance.filter(b => b.loading === false).first().subscribe((b) => {
    //   console.log('b ', b);
    //   this.generateQrCode(this.selectedCoin);
    // });
  }

  selectCoinCard(coin) {
    this.selectedCoin = coin;
  }

  filterCoin(val: string) {
    val = val.toLowerCase();
    this.filteredCoins = [...this.allCoins].filter(coin => {
      return coin.name.toLowerCase().indexOf(val) !== -1 ||
        val.indexOf(coin.name.toLowerCase()) !== -1 ||
        coin.fullName.toLowerCase().indexOf(val) !== -1;
    });
  }

  showAllCoins(e) {
    e.preventDefault();
    e.stopPropagation();
    const dialogRef = this.dialog.open(AllCoinsDialogComponent, {
      panelClass: "all-coins-dialog",
      data: {coins: this.allCoins}
    });

    dialogRef.afterClosed().filter(res => !!res).subscribe(result => {
      result.$balance.first().filter(data => !!data).subscribe(amount => {
        console.log(amount);
        if (amount.balance === "0") {
          this.inMyPossesion = false;
          setTimeout(() => {
            this.selectCoinCard(result);
          });
          return;
        }
        this.selectCoinCard(result);
        const coinEl = document.querySelector("#" + result.name);
        if (!result || !coinEl) {
          return;
        }
        this.perfectScrollbar.directiveRef.scrollToX((<any>coinEl).offsetLeft - 50);
      });

    });
  }

  onPossesionModeChange(val: boolean) {
    localStorage.setItem("show_posession", JSON.stringify(val));
    this.inMyPossesion = val;
  }

  wheelOverHorizontalDiv(e) {
    const perfectNativeElement = this.perfectScrollbar.directiveRef.elementRef.nativeElement;
    perfectNativeElement.scrollLeft -= (e.wheelDelta);
    e.preventDefault();
  }

  getTokenBalances() {
    this.store.dispatch(new GetEthBalanceAction());
    this.store.dispatch(new GetBtcBalanceAction());
    this.store.dispatch(new GetTokenBalanceAction({token: TOKENS.GOLEM, name: "golem"}));
    this.store.dispatch(new GetTokenBalanceAction({token: TOKENS.AUGUR, name: "augur"}));
    this.store.dispatch(new GetTokenBalanceAction({token: TOKENS.ARAGON, name: "aragon"}));
    this.store.dispatch(new GetTokenBalanceAction({token: TOKENS.BAT, name: "bat"}));
    this.store.dispatch(new GetTokenBalanceAction({token: TOKENS.EOS, name: "eos"}));
    this.store.dispatch(new GetTokenBalanceAction({token: TOKENS.GNOSIS, name: "gnosis"}));
    this.store.dispatch(new GetTokenBalanceAction({token: TOKENS.SALT, name: "salt"}));
    this.store.dispatch(new GetTokenBalanceAction({token: TOKENS.CIVIC, name: "civic"}));
    this.store.dispatch(new GetTokenBalanceAction({token: TOKENS.OMISEGO, name: "omisego"}));
    this.store.dispatch(new GetTokenBalanceAction({token: TOKENS.DISTRICT0X, name: "district0x"}));
    this.store.dispatch(new GetTokenBalanceAction({token: TOKENS.STATUSNETWORK, name: "statusnetwork"}));
    this.store.dispatch(new GetTokenBalanceAction({token: TOKENS.SUBSTRATUM, name: "substratum"}));
    this.store.dispatch(new GetTokenBalanceAction({token: TOKENS.TRON, name: "tron"}));
    this.store.dispatch(new GetTokenBalanceAction({token: TOKENS.BYTOM, name: "bytom"}));
    this.store.dispatch(new GetTokenBalanceAction({token: TOKENS.DENT, name: "dent"}));

    this.$ethBalance = this.store.select(getETHBalance);
    this.$btcBalance = this.store.select(getBTCBalance);
    this.$tokenBalanceAugur = this.store.select(getTokenBalanceAugur);
    this.$tokenBalanceGolem = this.store.select(getTokenBalanceGolem);
    this.$tokenBalanceAragon = this.store.select(getTokenBalanceAragon);
    this.$tokenBalanceBat = this.store.select(getTokenBalanceBat);
    this.$tokenBalanceEos = this.store.select(getTokenBalanceEos);
    this.$tokenBalanceGnosis = this.store.select(getTokenBalanceGnosis);
    this.$tokenBalanceSalt = this.store.select(getTokenBalanceSalt);

    this.$tokenBalanceCivic = this.store.select(getTokenBalanceCivic);
    this.$tokenBalanceOmiseGo = this.store.select(getTokenBalanceOmiseGo);
    this.$tokenBalanceDistrict0x = this.store.select(getTokenBalanceDistrict0x);
    this.$tokenBalanceStatusNetwork = this.store.select(getTokenBalanceStatusNetwork);
    this.$tokenBalanceSubstratum = this.store.select(getTokenBalanceSubstratum);
    this.$tokenBalanceTron = this.store.select(getTokenBalanceTron);
    this.$tokenBalanceBytom = this.store.select(getTokenBalanceBytom);
    this.$tokenBalanceDent = this.store.select(getTokenBalanceDent);

    const tokenBalances = this.store.select(getTokenBalances);
    //console.log(tokenBalances); // todo can be done better

    this.allCoins.forEach((coin) => {
      switch (coin.name) {
        case "BTC":
          coin.$balance = this.$btcBalance;
          break;
        case "ETH":
          coin.$balance = this.$ethBalance;
          break;
        case "REP":
          coin.$balance = this.$tokenBalanceAugur;
          break;
        case "GNT":
          coin.$balance = this.$tokenBalanceGolem;
          break;
        case "GNO":
          coin.$balance = this.$tokenBalanceGnosis;
          break;
        case "BAT":
          coin.$balance = this.$tokenBalanceBat;
          break;
        case "ANT":
          coin.$balance = this.$tokenBalanceAragon;
          break;
        case "EOS":
          coin.$balance = this.$tokenBalanceEos;
          break;
        case "SALT":
          coin.$balance = this.$tokenBalanceSalt;
          break;
        case "CVC":
          coin.$balance = this.$tokenBalanceCivic;
          break;
        case "OMG":
          coin.$balance = this.$tokenBalanceOmiseGo;
          break;
        case "DNT":
          coin.$balance = this.$tokenBalanceDistrict0x;
          break;
        case "SNT":
          coin.$balance = this.$tokenBalanceStatusNetwork;
          break;
        case "SUB":
          coin.$balance = this.$tokenBalanceSubstratum;
          break;
        case "TRN":
          coin.$balance = this.$tokenBalanceTron;
          break;
        case "BTM":
          coin.$balance = this.$tokenBalanceBytom;
          break;
        case "DENT":
          coin.$balance = this.$tokenBalanceDent;
          break;
        default:
          coin.$balance = this.$tokenBalanceDent;
      }

    });
  }

  getTokenAmountUSD() {
    const quotes = this.store.select(quoteSelector.getQuotes);
    this.allCoins.forEach((coin) => {
      coin.$amountUSD = Observable.combineLatest(quotes, coin.$balance, (q, coinBalance) => {
        if (!q || !coinBalance)
          return undefined;
        const balance = Number(coinBalance.balance);
        const coinQuote = q.get(coin.name);
        const number = balance * coinQuote.price;
        const price = +number.toFixed(2);
        if (isNaN(number)) {
          return 0;
        }
        return price;
      });
    });
  }

  private getTokens(coin){
      coin.faucetLoading = true;
      coin.getTokens().then(() => {
        coin.faucetLoading = false;
        this.getTokenBalances();
      }, () => {
        coin.faucetLoading = false;
        console.log('error')
      });
  }
}
