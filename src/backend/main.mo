import Iter "mo:core/Iter";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Storage "blob-storage/Storage";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";
import AccessControl "authorization/access-control";

actor {
  include MixinStorage();

  // Create a persistent Memories type to store memory file metadata
  type Memory = {
    id : Nat;
    owner : Principal;
    caption : ?Text;
    dateTaken : ?Time.Time;
    photo : Storage.ExternalBlob;
    timestamp : Time.Time;
  };

  public type UserProfile = {
    name : Text;
  };

  let nextId = Map.singleton<Nat, Nat>(0, 1);
  let memories = Map.empty<Nat, Memory>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Initialize the access control state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User profile management functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
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

  // Memory management functions
  public shared ({ caller }) func addMemory(caption : ?Text, dateTaken : ?Time.Time, photo : Storage.ExternalBlob) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add memories");
    };

    let id = switch (nextId.get(0)) {
      case (null) { Runtime.trap("Failed to get next id") };
      case (?id) { id };
    };

    let newMemory = {
      id;
      owner = caller;
      caption;
      dateTaken;
      photo;
      timestamp = Time.now();
    };

    memories.add(id, newMemory);
    nextId.add(0, id + 1);
  };

  public query ({ caller }) func getMemory(id : Nat) : async ?Memory {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view memories");
    };

    switch (memories.get(id)) {
      case (null) { null };
      case (?memory) {
        // Users can only view their own memories, admins can view all
        if (memory.owner == caller or AccessControl.isAdmin(accessControlState, caller)) {
          ?memory;
        } else {
          Runtime.trap("Unauthorized: Can only view your own memories");
        };
      };
    };
  };

  public query ({ caller }) func listMemories() : async [Memory] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can list memories");
    };

    // Admins can see all memories, users only see their own
    if (AccessControl.isAdmin(accessControlState, caller)) {
      memories.values().toArray();
    } else {
      memories.values()
        .filter(func(memory : Memory) : Bool { memory.owner == caller })
        .toArray();
    };
  };
};
