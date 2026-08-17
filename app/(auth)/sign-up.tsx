import "@/global.css";
import { useSignUp } from "@clerk/expo";
import { type Href, Link, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignUp() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");

  const loading = fetchStatus === "fetching";

  const errorMsg =
    errors?.fields?.emailAddress?.message ??
    errors?.fields?.password?.message ??
    errors?.fields?.code?.message ??
    (errors && Object.values(errors.fields ?? {}).length > 0
      ? Object.values(errors.fields)[0]?.message
      : undefined);

  // Step 1: create account and send verification code
  const handleSignUp = async () => {
    const { error } = await signUp.password({
      emailAddress: email.trim().toLowerCase(),
      password,
    });
    if (error) return;
    await signUp.verifications.sendEmailCode();
  };

  // Step 2: verify code and finalize session
  const handleVerify = async () => {
    await signUp.verifications.verifyEmailCode({ code });
    if (signUp.status === "complete") {
      await signUp.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) return;
          const url = decorateUrl("/");
          router.replace((url.startsWith("http") ? "/(tabs)" : url) as Href);
        },
      });
    }
  };

  // --- Verification step ---
  const isVerifying =
    signUp.status === "missing_requirements" &&
    signUp.unverifiedFields.includes("email_address") &&
    signUp.missingFields.length === 0;

  if (isVerifying) {
    return (
      <SafeAreaView className="auth-safe-area" style={{ flex: 1, backgroundColor: "#fff9e3" }}>
        <KeyboardAvoidingView
          className="flex-1"
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            className="auth-scroll"
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          >
            <View className="auth-content">
              <View className="auth-brand-block">
                <View className="auth-logo-wrap">
                  <View className="auth-logo-mark">
                    <Text className="auth-logo-mark-text">R</Text>
                  </View>
                  <View>
                    <Text className="auth-wordmark">Recurly</Text>
                    <Text className="auth-wordmark-sub">Smart Billing</Text>
                  </View>
                </View>
                <Text className="auth-title">Check your email</Text>
                <Text className="auth-subtitle">
                  We sent a 6-digit code to {email}
                </Text>
              </View>

              <View className="auth-card">
                <View className="auth-form">
                  <View className="auth-field">
                    <Text className="auth-label">Verification Code</Text>
                    <TextInput
                      className={`auth-input ${errorMsg ? "auth-input-error" : ""}`}
                      placeholder="000000"
                      placeholderTextColor="rgba(0,0,0,0.35)"
                      value={code}
                      onChangeText={setCode}
                      keyboardType="number-pad"
                      maxLength={6}
                      textContentType="oneTimeCode"
                    />
                  </View>

                  {!!errorMsg && <Text className="auth-error">{errorMsg}</Text>}

                  <Pressable
                    className={`auth-button ${loading || code.length < 6 ? "auth-button-disabled" : ""}`}
                    onPress={handleVerify}
                    disabled={loading || code.length < 6}
                  >
                    {loading ? (
                      <ActivityIndicator color="#fff9e3" size="small" />
                    ) : (
                      <Text className="auth-button-text">Verify email</Text>
                    )}
                  </Pressable>

                  <Pressable
                    className="auth-secondary-button"
                    onPress={() => signUp.verifications.sendEmailCode()}
                  >
                    <Text className="auth-secondary-button-text">
                      Resend code
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // --- Registration step ---
  return (
    <SafeAreaView className="auth-safe-area" style={{ flex: 1, backgroundColor: "#fff9e3" }}>
      <KeyboardAvoidingView
        className="flex-1"
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          className="auth-scroll"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="auth-content">
            {/* Brand */}
            <View className="auth-brand-block">
              <View className="auth-logo-wrap">
                <View className="auth-logo-mark">
                  <Text className="auth-logo-mark-text">R</Text>
                </View>
                <View>
                  <Text className="auth-wordmark">Recurly</Text>
                  <Text className="auth-wordmark-sub">Smart Billing</Text>
                </View>
              </View>
              <Text className="auth-title">Create an account</Text>
              <Text className="auth-subtitle">
                Start tracking your subscriptions today
              </Text>
            </View>

            {/* Card */}
            <View className="auth-card">
              <View className="auth-form">
                <View className="auth-field">
                  <Text className="auth-label">Email</Text>
                  <TextInput
                    className={`auth-input ${errorMsg ? "auth-input-error" : ""}`}
                    placeholder="Enter your email"
                    placeholderTextColor="rgba(0,0,0,0.35)"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="email-address"
                    textContentType="emailAddress"
                  />
                </View>

                <View className="auth-field">
                  <Text className="auth-label">Password</Text>
                  <TextInput
                    className={`auth-input ${errorMsg ? "auth-input-error" : ""}`}
                    placeholder="Create a password"
                    placeholderTextColor="rgba(0,0,0,0.35)"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    textContentType="newPassword"
                  />
                </View>

                {!!errorMsg && <Text className="auth-error">{errorMsg}</Text>}

                <Pressable
                  className={`auth-button ${loading || !email || !password ? "auth-button-disabled" : ""}`}
                  onPress={handleSignUp}
                  disabled={loading || !email || !password}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff9e3" size="small" />
                  ) : (
                    <Text className="auth-button-text">Create account</Text>
                  )}
                </Pressable>
              </View>
            </View>

            {/* Footer */}
            <View className="auth-link-row">
              <Text className="auth-link-copy">Already have an account?</Text>
              <Link href="/(auth)/sign-in" className="auth-link">
                Sign in
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}