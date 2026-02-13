import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import Storage "blob-storage/Storage";

module {
  public type OldActor = {
    nextId : Map.Map<Nat, Nat>;
    memories : Map.Map<Nat, OldMemory>;
    accessControlState : AccessControl.AccessControlState;
    userProfiles : Map.Map<Principal, UserProfile>;
    userValentineStates : Map.Map<Principal, ValentineState>;
  };

  type OldMemory = {
    id : Nat;
    owner : Principal;
    caption : ?Text;
    dateTaken : ?Int;
    photo : Storage.ExternalBlob;
    timestamp : Int;
  };

  type UserProfile = {
    name : Text;
  };

  type ValentineState = {
    greeting : ?PersonalizedValentineGreeting;
    hasAccepted : Bool;
  };

  type PersonalizedValentineGreeting = {
    recipient : Text;
    message : Text;
  };

  public type NewActor = {
    nextId : Map.Map<Nat, Nat>;
    memories : Map.Map<Nat, NewMemory>;
    accessControlState : AccessControl.AccessControlState;
    userProfiles : Map.Map<Principal, UserProfile>;
    userValentineStates : Map.Map<Principal, ValentineState>;
  };

  type NewMemory = {
    id : Nat;
    owner : Principal;
    caption : ?Text;
    dateTaken : ?Int;
    photo : Storage.ExternalBlob;
    timestamp : Int;
    isPublished : Bool;
  };

  public func run(old : OldActor) : NewActor {
    let newMemories = old.memories.map<Nat, OldMemory, NewMemory>(
      func(_id, oldMemory) {
        { oldMemory with isPublished = false };
      }
    );
    {
      old with
      memories = newMemories;
    };
  };
};
