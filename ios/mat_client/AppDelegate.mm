#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <GoogleMaps/GoogleMaps.h>
#import <Firebase.h>
#import <RNKakaoLogins.h>
#import <React/RCTLinkingManager.h>


@implementation AppDelegate

- (BOOL)application:(UIApplication *)application
didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
    [FIRApp configure];
    [GMSServices provideAPIKey:@"AIzaSyDz9QSmJrH-ryPP9KJ6yGcWTpVCN83HqpA"];
  self.moduleName = @"mat_client";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};
  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (BOOL)application:(UIApplication *)application
  openURL:(NSURL *)url
  options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {
    if ([RNKakaoLogins isKakaoTalkLoginUrl:url]) {
      return [RNKakaoLogins handleOpenUrl: url];
    }
    return [RCTLinkingManager application:application openURL:url options:options];
  }

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

/// This method controls whether the `concurrentRoot`feature of React18 is turned on or off.
///
/// @see: https://reactjs.org/blog/2022/03/29/react-v18.html
/// @note: This requires to be rendering on Fabric (i.e. on the New Architecture).
/// @return: `true` if the `concurrentRoot` feature is enabled. Otherwise, it returns `false`.
- (BOOL)concurrentRootEnabled
{
  return true;
}

@end
