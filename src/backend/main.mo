import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import OutCall "http-outcalls/outcall";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";


// Explicitly apply migration logic to remove unused persistent maps

actor {
  // Initialize the user system state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let transactions = Map.empty<Nat, DepositTransaction>();
  let winningRecords = Map.empty<Principal.Principal, WinningRecord>();
  let userProfiles = Map.empty<Principal.Principal, UserProfile>();

  var nextTransactionId = 0;

  let MAIN_ACCOUNT = "0116828013";
  let MPESA_PAYBILL = "400004";

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
  };

  public type DepositTransaction = {
    transactionId : Nat;
    user : Principal.Principal;
    originalAmount : Nat;
    currency : Currency;
    convertedAmountKES : Nat;
    taxAmount : Nat; // 20% tax field
    confirmed : Bool;
    account : Text;
    mpesaPaybill : Text;
  };

  public type WinningRecord = {
    user : Principal.Principal;
    amount : Nat;
    isPaid : Bool;
  };

  public type UserProfile = {
    name : Text;
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal.Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  func getLiveExchangeRate(_currency : Currency) : async Nat {
    150;
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

  func computeTax(amount : Nat) : Nat {
    (amount * 20) / 100;
  };

  func afterTaxAmount(amount : Nat) : Nat {
    amount - computeTax(amount);
  };

  public shared ({ caller }) func initiateDeposit(currency : Currency, amount : Nat) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can deposit");
    };

    let convertedAmount = await convertToKES(currency, amount);
    let tax = computeTax(convertedAmount);

    let transactionId = nextTransactionId;
    let transaction : DepositTransaction = {
      transactionId;
      user = caller;
      originalAmount = amount;
      currency;
      convertedAmountKES = convertedAmount;
      taxAmount = tax;
      confirmed = false;
      account = MAIN_ACCOUNT;
      mpesaPaybill = MPESA_PAYBILL;
    };

    transactions.add(transactionId, transaction);
    nextTransactionId += 1;
    transactionId;
  };

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

  public shared ({ caller }) func recordWin(user : Principal.Principal, amount : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can record wins");
    };

    // Verify the user exists and has at least user role
    if (not (AccessControl.hasPermission(accessControlState, user, #user))) {
      Runtime.trap("Cannot record win for non-registered user");
    };

    let record : WinningRecord = {
      user;
      amount;
      isPaid = false;
    };

    winningRecords.add(user, record);
  };

  public shared ({ caller }) func releaseWinningsToUser(user : Principal.Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can release winnings");
    };

    // Verify the user exists and has at least user role
    if (not (AccessControl.hasPermission(accessControlState, user, #user))) {
      Runtime.trap("Cannot release winnings to non-registered user");
    };

    switch (winningRecords.get(user)) {
      case (null) {
        Runtime.trap("No winning record found for this user");
      };
      case (?winningRecord) {
        if (winningRecord.isPaid) {
          Runtime.trap("Winnings have already been paid to this user");
        };
        winningRecords.add(user, { winningRecord with isPaid = true });
      };
    };
  };

  public shared ({ caller }) func recordAdminDeposit(currency : Currency, amount : Nat) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can record deposits");
    };

    let convertedAmount = await convertToKES(currency, amount);
    let tax = computeTax(convertedAmount);

    let transactionId = nextTransactionId;
    let transaction : DepositTransaction = {
      transactionId;
      user = caller;
      originalAmount = amount;
      currency;
      convertedAmountKES = convertedAmount;
      taxAmount = tax;
      confirmed = true;
      account = MAIN_ACCOUNT;
      mpesaPaybill = MPESA_PAYBILL;
    };

    transactions.add(transactionId, transaction);
    nextTransactionId += 1;
    transactionId;
  };
};
