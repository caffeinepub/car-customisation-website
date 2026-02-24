import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Initialize the authorization state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User profile type required by the frontend
  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get profiles");
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

  // Type definitions for car customizations
  public type CarConfiguration = {
    model : Text;
    bodyColor : Text;
    wheelStyle : Text;
    interiorColor : Text;
    accessories : [Text];
  };

  let carConfigs = Map.empty<Principal, CarConfiguration>();

  // Save the caller's car configuration — requires authenticated user
  public shared ({ caller }) func saveConfiguration(config : CarConfiguration) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save configurations");
    };
    carConfigs.add(caller, config);
  };

  // Retrieve the caller's own configuration — requires authenticated user
  public query ({ caller }) func getMyConfiguration() : async ?CarConfiguration {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can retrieve configurations");
    };
    carConfigs.get(caller);
  };

  // Retrieve a specific user's configuration — caller must be owner or admin
  public query ({ caller }) func getUserConfiguration(user : Principal) : async ?CarConfiguration {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own configuration");
    };
    carConfigs.get(user);
  };

  // List all configurations — admin only
  public query ({ caller }) func listAllConfigurations() : async [(Principal, CarConfiguration)] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all configurations");
    };
    carConfigs.toArray();
  };
};
