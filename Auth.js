import React, { useState } from "react";
import {
    View,
    Text,
    Image,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
    ActivityIndicator,
    StyleSheet,
    SafeAreaView
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Auth = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleSignUpToggle = () => {
        setIsSignUp(!isSignUp);
        setConfirmPassword("");
        setEmail("");
        setPassword("");
    };

    const handleAuth = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Please fill in all fields.");
            return;
        }

        if (isSignUp && password !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match.");
            return;
        }

        setIsLoading(true);

        const endpoint = isSignUp
            ? "http://127.0.0.1:5000/api/signup"
            : "http://127.0.0.1:5000/api/login";

        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                // Store user ID in AsyncStorage
                await AsyncStorage.setItem("userId", data.id.toString());

                Alert.alert(
                    "Success",
                    isSignUp
                        ? "Account created successfully."
                        : "Logged in successfully."
                );
                navigation.navigate("Dashboard");
            } else {
                Alert.alert("Error", data.error || "An error occurred.");
            }
        } catch (error) {
            console.error("Error:", error);
            Alert.alert("Error", "Network error. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>
                        {isSignUp ? "Sign Up" : "Login"}
                    </Text>
                    <TouchableOpacity>
                        <Ionicons
                            name="information-circle-outline"
                            size={28}
                            color="#1e88e5"
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.body}>
                    <Image
                        source={require("./assets/logo.png")}
                        style={styles.logo}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={setEmail}
                    />

                    <View style={styles.passwordContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            secureTextEntry={!showPassword}
                            value={password}
                            onChangeText={setPassword}
                        />
                        <TouchableOpacity
                            onPress={togglePasswordVisibility}
                            style={styles.eyeIcon}
                        >
                            <Ionicons
                                name={showPassword ? "eye-off" : "eye"}
                                size={24}
                                color="darkgrey"
                            />
                        </TouchableOpacity>
                    </View>

                    {isSignUp && (
                        <View style={styles.passwordContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Confirm Password"
                                secureTextEntry={!showConfirmPassword}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                            />
                            <TouchableOpacity
                                onPress={toggleConfirmPasswordVisibility}
                                style={styles.eyeIcon}
                            >
                                <Ionicons
                                    name={
                                        showConfirmPassword ? "eye-off" : "eye"
                                    }
                                    size={24}
                                    color="darkgrey"
                                />
                            </TouchableOpacity>
                        </View>
                    )}

                    <TouchableOpacity
                        style={[
                            styles.loginButton,
                            isLoading && styles.loginButtonPressed
                        ]}
                        onPress={handleAuth}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text
                                style={[
                                    styles.loginButtonText,
                                    isLoading && styles.loginButtonTextPressed
                                ]}
                            >
                                {isSignUp ? "Sign Up" : "Login"}
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        {isSignUp
                            ? "Already have an account? "
                            : "Don't have an account? "}
                        <Text
                            style={styles.signUpText}
                            onPress={handleSignUpToggle}
                        >
                            {isSignUp ? "Login" : "Sign up"}
                        </Text>
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#fafafa"
    },
    container: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
        padding: 20,
        width: "100%"
    },
    header: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 10,
        marginTop: 25,
        paddingHorizontal: 10,
        position: "absolute",
        top: 0
    },
    headerText: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#1e88e5"
    },
    body: {
        width: "100%",
        alignItems: "center"
    },
    logo: {
        width: 100,
        height: 100,
        resizeMode: "contain",
        marginBottom: 20
    },
    input: {
        width: "100%",
        height: 50,
        borderColor: "darkgray",
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 15,
        backgroundColor: "#fff"
    },
    passwordContainer: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 15,
        justifyContent: "center"
    },
    eyeIcon: {
        position: "absolute",
        right: 13,
        top: "50%",
        transform: [{ translateY: "-75%" }]
    },

    loginButton: {
        width: "100%",
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#1e88e5",
borderColor: "#000",
        borderWidth: 1,
        borderRadius: 10,
        marginTop: 10
    },
    loginButtonPressed: {
        backgroundColor: "royalblue",
        
    },
    loginButtonText: {
        fontSize: 18,
        fontWeight: "800",
        color: "#fff"
    },
    loginButtonTextPressed: {
        fontSize: 18,
        color: "#fff"
    },
    footer: {
        marginTop: 20
    },
    footerText: {
        fontSize: 16,
        color: "#333"
    },
    signUpText: {
        fontWeight: "bold",
        color: "#1e88e5"
    }
});

export default Auth;
