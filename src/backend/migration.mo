import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";

module {
  type OldDepositTransaction = {
    transactionId : Nat;
    user : Principal.Principal;
    originalAmount : Nat;
    currency : OldCurrency;
    convertedAmountKES : Nat;
    confirmed : Bool;
    account : Text;
    mpesaPaybill : Text;
  };

  type OldCurrency = {
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

  type OldActor = {
    transactions : Map.Map<Nat, OldDepositTransaction>;
  };

  type NewDepositTransaction = {
    transactionId : Nat;
    user : Principal.Principal;
    originalAmount : Nat;
    currency : NewCurrency;
    convertedAmountKES : Nat;
    taxAmount : Nat;
    confirmed : Bool;
    account : Text;
    mpesaPaybill : Text;
  };

  type NewCurrency = {
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

  type NewActor = {
    transactions : Map.Map<Nat, NewDepositTransaction>;
  };

  public func run(old : OldActor) : NewActor {
    let newTransactions = old.transactions.map<Nat, OldDepositTransaction, NewDepositTransaction>(
      func(_transactionId, oldTransaction) {
        let taxAmount = (oldTransaction.convertedAmountKES * 20) / 100;
        {
          oldTransaction with
          taxAmount
        };
      }
    );
    { transactions = newTransactions };
  };
};
