import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Text "mo:core/Text";

module {
  // Original deposit type definition
  type OldDepositTransaction = {
    transactionId : Nat;
    user : Principal.Principal;
    amount : Nat;
    confirmed : Bool;
    account : Text.Text;
    mpesaPaybill : Text.Text;
  };

  // New type definition in main containing currency support
  type NewDepositTransaction = {
    transactionId : Nat;
    user : Principal.Principal;
    originalAmount : Nat;
    currency : Currency;
    convertedAmountKES : Nat;
    confirmed : Bool;
    account : Text.Text;
    mpesaPaybill : Text.Text;
  };

  // Import type from main.mo
  type Currency = {
    #KES;
    #USD;
    #EUR;
    #UGX;
    #TZS;
    #MWK;
    #ZAR;
    #ZMW;
    #GBP;
  };

  // Import old and new actor types from main.mo
  type OldActor = {
    transactions : Map.Map<Nat, OldDepositTransaction>;
  };

  type NewActor = {
    transactions : Map.Map<Nat, NewDepositTransaction>;
  };

  public func run(old : OldActor) : NewActor {
    let newTransactions = old.transactions.map<Nat, OldDepositTransaction, NewDepositTransaction>(
      func(_id, oldTx) {
        {
          transactionId = oldTx.transactionId;
          user = oldTx.user;
          originalAmount = oldTx.amount;
          currency = #KES; // Default to KES for all old transactions
          convertedAmountKES = oldTx.amount;
          confirmed = oldTx.confirmed;
          account = oldTx.account;
          mpesaPaybill = "400004"; // Update to new paybill
        };
      }
    );
    { transactions = newTransactions };
  };
};
