# PredictBTC
### 概要
1週間おきにビットコインの価格を予想し、的中すればPBT(PredictBitcoinToken)トークンがもらえるアプリ。精度が高ければ高いほどトークンをたくさんもらえる。ビットコインの価格はAgrregator, Chainlinkから取得する。締め切り、スナップショットはインセンティブをつけてユーザーが行う。*デモでは間隔を5分にしています。
#### PBT算出法
予想と実際の価格の誤差が0.1%未満の場合50000PBT、1%未満の場合は20000PBT、3%未満の場合は10000PBT、5%未満の場合は5000PBT、8%未満の場合は2000PBT、10%未満の場合は1000PBT、20%未満の場合は500PBTがもらえる。
### 目的
ビットコインに興味を持ち、スマートコントラクトにも触ってみたいという人が気軽に遊べる完全オンチェーンのゲームにする。
### 事前準備
- metamaskのインストール
- node.jsの環境構築
### コントラクトのテスト
```shell
git clone https://github.com/retocrooman/predictBTC.git
cd predictBTC
// コントラクトとテストのファイルを編集
npx hardhat test
```
### webアプリの立ち上げ方
```shell
git clone https://github.com/retocrooman/predictBTC.git
cd predictBTC/clinet
npm i
npm run start
```
