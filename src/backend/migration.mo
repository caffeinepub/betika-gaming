import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";

module {
  public type OldProfile = {
    username : Text;
    email : Text;
    walletAddress : Text;
    balance : Nat;
  };

  public type OldActor = {
    userProfiles : Map.Map<Principal.Principal, OldProfile>;
    transactions : Map.Map<Nat, OldDepositTransaction>;
    winningRecords : Map.Map<Principal.Principal, OldWinningRecord>;
    nextTransactionId : Nat;
  };

  public type OldCurrency = {
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

  public type OldDepositTransaction = {
    transactionId : Nat;
    user : Principal.Principal;
    originalAmount : Nat;
    currency : OldCurrency;
    convertedAmountKES : Nat;
    confirmed : Bool;
    account : Text;
    mpesaPaybill : Text;
  };

  public type OldWinningRecord = {
    user : Principal.Principal;
    amount : Nat;
    isPaid : Bool;
  };

  public type NewActor = {
    transactions : Map.Map<Nat, OldDepositTransaction>;
    winningRecords : Map.Map<Principal.Principal, OldWinningRecord>;
    nextTransactionId : Nat;
  };

  public func run(old : OldActor) : NewActor {
    {
      transactions = old.transactions;
      winningRecords = old.winningRecords;
      nextTransactionId = old.nextTransactionId;
    };
  };
}
