import React, { useState } from "react";
import { View, TextInput, Text, TouchableOpacity, Image, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemedView } from "@/components/ThemedView";
import API_URL from "../../config/config";

export default function LoginScreen() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleLogin = async () => {
        try {
            const response = await axios.post(`${API_URL}/api/auth/login`, {
                username,
                password,
            });
            const { token } = response.data.data;
            await AsyncStorage.setItem("token", token);
            router.replace("/(tabs)"); // Prevent back navigation to login
        } catch (error) {
            const errorMessage = (error as any).response?.data?.message || "An error occurred";
            Alert.alert("Login Failed", errorMessage);
        }
    };

    return (
        <ThemedView style={styles.container}>
            <View style={styles.card}>
                <Image
                    source={require("../../assets/images/Logo.png")}
                    style={styles.logo}
                />
                <Text style={styles.title}>Welcome Back!</Text>
                <Text style={styles.subtitle}>Log in to continue</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                    placeholderTextColor="#B0B0B0"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    placeholderTextColor="#B0B0B0"
                />
                <TouchableOpacity
                    style={styles.loginButton}
                    onPress={handleLogin}
                >
                    <Text style={styles.loginButtonText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.registerButton}
                    onPress={() => router.push("/auth/RegisterScreen")}
                >
                    <Text style={styles.registerButtonText}>Create an Account</Text>
                </TouchableOpacity>
            </View>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
        backgroundColor: "#0f2027", // Gradient background base color
    },
    card: {
        width: "90%",
        padding: 20,
        borderRadius: 15,
        backgroundColor: "#ffffff",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 24,
        alignSelf: "center",
        resizeMode: "contain",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 8,
        color: "#333333",
        textAlign: "center",
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 24,
        color: "#666666",
        textAlign: "center",
    },
    input: {
        width: "100%",
        height: 48,
        borderColor: "#cccccc",
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        marginBottom: 16,
        backgroundColor: "#f9f9f9",
        fontSize: 16,
        color: "#333333",
    },
    loginButton: {
        width: "100%",
        height: 48,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#6a11cb", // Gradient-like color
    },
    loginButtonText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "600",
    },
    registerButton: {
        width: "100%",
        height: 48,
        marginTop: 16,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#e1e4e8",
        borderRadius: 8,
    },
    registerButtonText: {
        color: "#333333",
        fontSize: 16,
        fontWeight: "600",
    },
});
