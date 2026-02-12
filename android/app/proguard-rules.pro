# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# ── React Native core ────────────────────────────────────────────────────
-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.** { *; }
-keep class com.facebook.jni.** { *; }

# ── React Native Reanimated ──────────────────────────────────────────────
-keep class com.swmansion.reanimated.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }

# ── React Native Gesture Handler ─────────────────────────────────────────
-keep class com.swmansion.gesturehandler.** { *; }
-keep class com.swmansion.gesturehandler.react.** { *; }

# ── Shopify React Native Skia ────────────────────────────────────────────
-keep class com.shopify.reactnative.skia.** { *; }

# ── Expo modules ─────────────────────────────────────────────────────────
-keep class expo.modules.** { *; }
-keep class com.facebook.react.bridge.** { *; }

# ── Expo Linear Gradient ─────────────────────────────────────────────────
-keep class expo.modules.lineargradient.** { *; }

# ── Expo Font ────────────────────────────────────────────────────────────
-keep class expo.modules.font.** { *; }

# ── Expo Splash Screen ──────────────────────────────────────────────────
-keep class expo.modules.splashscreen.** { *; }

# ── React Native Safe Area Context ──────────────────────────────────────
-keep class com.th3rdwave.safeareacontext.** { *; }

# ── React Native Community Slider ────────────────────────────────────────
-keep class com.reactnativecommunity.slider.** { *; }

# ── Hermes engine ────────────────────────────────────────────────────────
-keep class com.facebook.hermes.unicode.** { *; }
-dontwarn com.facebook.hermes.**

# ── General: keep native module registrations ────────────────────────────
-keepclassmembers class * {
    @com.facebook.react.bridge.ReactMethod <methods>;
}
-keepclassmembers class * {
    @com.facebook.react.uimanager.annotations.ReactProp <methods>;
}
-keepclassmembers class * {
    @com.facebook.react.uimanager.annotations.ReactPropGroup <methods>;
}

# ── Prevent stripping of JS interface annotations ────────────────────────
-keepattributes *Annotation*
-keepattributes JavascriptInterface

# ── Suppress warnings for common RN dependencies ────────────────────────
-dontwarn com.facebook.react.**
-dontwarn com.swmansion.**
-dontwarn com.shopify.reactnative.**
