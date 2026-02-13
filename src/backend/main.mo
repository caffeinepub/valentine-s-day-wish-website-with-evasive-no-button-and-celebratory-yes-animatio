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
import Migration "migration";

(with migration = Migration.run)
actor {
  include MixinStorage();

  public type PersonalizedValentineGreeting = {
    recipient : Text;
    message : Text;
  };

  public type Memory = {
    id : Nat;
    owner : Principal;
    caption : ?Text;
    dateTaken : ?Time.Time;
    photo : Storage.ExternalBlob;
    timestamp : Time.Time;
    isPublished : Bool;
  };

  public type MemoryPublic = {
    id : Nat;
    owner : Principal;
    caption : ?Text;
    dateTaken : ?Time.Time;
    photo : Storage.ExternalBlob;
    timestamp : Time.Time;
    isPublished : Bool;
  };

  public type UserProfile = {
    name : Text;
  };

  public type MemoryMetadata = {
    memoryId : Nat;
    owner : Principal;
    timestamp : Time.Time;
    caption : ?Text;
    dateTaken : ?Time.Time;
    photo : Storage.ExternalBlob;
  };

  public type ValentineState = {
    greeting : ?PersonalizedValentineGreeting;
    hasAccepted : Bool;
  };

  let nextId = Map.singleton<Nat, Nat>(0, 1);
  let memories = Map.empty<Nat, Memory>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let userValentineStates = Map.empty<Principal, ValentineState>();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let defaultGreeting : PersonalizedValentineGreeting = {
    recipient = "Puks";
    message = "Happy Valentine\u{2019}s Day, Puks";
  };

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
      isPublished = false;
    };

    memories.add(id, newMemory);
    nextId.add(0, id + 1);
  };

  public shared ({ caller }) func togglePublishMemory(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can publish/unpublish memories");
    };

    let memory = switch (memories.get(id)) {
      case (null) { Runtime.trap("Memory not found") };
      case (?memory) {
        if (memory.owner != caller) {
          Runtime.trap("Unauthorized: Can only modify your own memories");
        };
        {
          memory with isPublished = not memory.isPublished;
        };
      };
    };

    memories.add(id, memory);
  };

  public query ({ caller }) func getMemory(id : Nat) : async ?Memory {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view memories");
    };

    switch (memories.get(id)) {
      case (null) { null };
      case (?memory) {
        if ((memory.owner == caller) or (AccessControl.isAdmin(accessControlState, caller))) {
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

    if (AccessControl.isAdmin(accessControlState, caller)) {
      memories.values().toArray();
    } else {
      memories.values()
        .filter(func(memory : Memory) : Bool { memory.owner == caller })
        .toArray();
    };
  };

  public query ({} : {}) func listPublishedMemories() : async [MemoryPublic] {
    let publishedMemories = memories.values().filter(
      func(memory) { memory.isPublished }
    );
    publishedMemories.map<Memory, MemoryPublic>(
      func(memory) { memory }
    ).toArray();
  };

  public query ({} : {}) func getPublishedMemory(id : Nat) : async ?MemoryPublic {
    let memory = memories.get(id);
    switch (memory) {
      case (null) { null };
      case (?memory) {
        if (memory.isPublished) {
          ?memory;
        } else {
          Runtime.trap("Memory is not published");
        };
      };
    };
  };

  public shared ({ caller }) func acceptValentine() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can accept valentines");
    };

    let userState = userValentineStates.get(caller);
    let newState = switch (userState) {
      case (null) {
        {
          greeting = ?defaultGreeting;
          hasAccepted = true;
        };
      };
      case (?state) {
        {
          greeting = state.greeting;
          hasAccepted = true;
        };
      };
    };

    userValentineStates.add(caller, newState);
  };

  public query ({ caller }) func getPersonalizedGreeting() : async ?PersonalizedValentineGreeting {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get personalized greetings");
    };

    switch (userValentineStates.get(caller)) {
      case (null) { ?defaultGreeting };
      case (?state) {
        if (state.hasAccepted) {
          state.greeting;
        } else {
          ?defaultGreeting;
        };
      };
    };
  };

  public shared ({ caller }) func setPersonalizedGreeting(
    recipient : Text,
    message : Text,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can set personalized greetings");
    };

    let state = switch (userValentineStates.get(caller)) {
      case (null) {
        {
          greeting = ?{ recipient; message };
          hasAccepted = false;
        };
      };
      case (?existingState) {
        {
          greeting = ?{ recipient; message };
          hasAccepted = existingState.hasAccepted;
        };
      };
    };

    userValentineStates.add(caller, state);
  };

  public query ({ caller }) func listUserPhotoMemories() : async [MemoryMetadata] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can list their photo memories");
    };

    memories.values()
      .filter(func(memory : Memory) : Bool { memory.owner == caller })
      .map<Memory, MemoryMetadata>(
        func(memory) {
          {
            memoryId = memory.id;
            owner = memory.owner;
            timestamp = memory.timestamp;
            caption = memory.caption;
            dateTaken = memory.dateTaken;
            photo = memory.photo;
          };
        }
      )
      .toArray();
  };
};
