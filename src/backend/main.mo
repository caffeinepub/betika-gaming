import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import OutCall "http-outcalls/outcall";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Migration "migration";

// Explicitly apply migration logic to remove unused persistent maps
(with migration = Migration.run)
actor {
  // Initialize the user system state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type Currency = {
    #KES;
    #USD;
    #EUR;
    #UGX;
    #TZS;
    #MWK;
    #ZAR;
    #ZMW;
    #GBP;
    // Add other relevant currencies as needed
  };

  public type DepositTransaction = {
    transactionId : Nat;
    user : Principal.Principal;
    originalAmount : Nat;
    currency : Currency;
    convertedAmountKES : Nat;
    confirmed : Bool;
    account : Text;
    mpesaPaybill : Text;
  };

  public type WinningRecord = {
    user : Principal.Principal;
    amount : Nat;
    isPaid : Bool; // Indicates if the winning amount has been paid out
  };

  let transactions = Map.empty<Nat, DepositTransaction>();
  let winningRecords = Map.empty<Principal.Principal, WinningRecord>();
  var nextTransactionId = 0;

  let MAIN_ACCOUNT = "0116828013";
  let MPESA_PAYBILL = "400004"; // Updated paybill number

  // Function to fetch live exchange rates (placeholder)
  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  func getLiveExchangeRate(_currency : Currency) : async Nat {
    150; // Placeholder: 1 USD = 150 KES
  };

  func getExchangeRate(currency : Currency) : Nat {
    switch (currency) {
      case (#KES) { 100 };
      case (#USD) { 15035 };
      case (#EUR) { 17375 };
      case (#UGX) { 4 };
      case (#TZS) { 5 };
      case (#MWK) { 13 };
      case (#ZAR) { 793 };
      case (#ZMW) { 5885 };
      case (#GBP) { 19800 };
    };
  };

  func convertToKES(currency : Currency, amount : Nat) : async Nat {
    if (currency == #KES) {
      return amount;
    };
    let rate = getExchangeRate(currency);
    (amount * rate) / 100;
  };

  // Record deposit transaction for main account
  public shared ({ caller }) func initiateDeposit(currency : Currency, amount : Nat) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can deposit");
    };

    let convertedAmount = await convertToKES(currency, amount);

    let transactionId = nextTransactionId;
    let transaction : DepositTransaction = {
      transactionId;
      user = caller;
      originalAmount = amount;
      currency;
      convertedAmountKES = convertedAmount;
      confirmed = false;
      account = MAIN_ACCOUNT;
      mpesaPaybill = MPESA_PAYBILL;
    };

    transactions.add(transactionId, transaction);
    nextTransactionId += 1;
    transactionId;
  };

  // Confirm deposit and update user balance
  public shared ({ caller }) func confirmDeposit(transactionId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can confirm deposits");
    };

    switch (transactions.get(transactionId)) {
      case (null) {
        Runtime.trap("Transaction not found");
      };
      case (?transaction) {
        if (transaction.confirmed) {
          Runtime.trap("Deposit already confirmed");
        };
        transactions.add(
          transactionId,
          {
            transaction with confirmed = true;
          },
        );
      };
    };
  };

  // Additional functionality for winning records and payouts
  // Function to record a user's win
  public shared ({ caller }) func recordWin(user : Principal.Principal, amount : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can record wins");
    };

    let record : WinningRecord = {
      user;
      amount;
      isPaid = false; // Mark as unpaid initially
    };

    winningRecords.add(user, record);
  };

  // Function for admin to manually release funds to a winner
  public shared ({ caller }) func releaseWinningsToUser(user : Principal.Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can release winnings");
    };

    switch (winningRecords.get(user)) {
      case (null) {
        Runtime.trap("No winning record found for this user");
      };
      case (?winningRecord) {
        if (winningRecord.isPaid) {
          Runtime.trap("Winnings have already been paid to this user");
        };

        // Simulate payment out here.
        let updatedRecord : WinningRecord = {
          winningRecord with isPaid = true;
        };
        winningRecords.add(user, updatedRecord);
      };
    };
  };

  // Repeat similar conversion updates for admin deposit records
  public shared ({ caller }) func recordAdminDeposit(currency : Currency, amount : Nat) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can record deposits");
    };

    let convertedAmount = await convertToKES(currency, amount);

    let transactionId = nextTransactionId;
    let transaction : DepositTransaction = {
      transactionId;
      user = caller;
      originalAmount = amount;
      currency;
      convertedAmountKES = convertedAmount;
      confirmed = true; // Admin deposits are instantly confirmed
      account = MAIN_ACCOUNT;
      mpesaPaybill = MPESA_PAYBILL;
    };

    transactions.add(transactionId, transaction);
    nextTransactionId += 1;
    transactionId;
  };
};
