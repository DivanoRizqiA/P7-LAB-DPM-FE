import React, { useState } from "react";
import { View, TextInput, Text, TouchableOpacity, Image, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import API_URL from "../../config/config";
import { LinearGradient } from "expo-linear-gradient";

export default function RegisterScreen() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const router = useRouter();

    const handleRegister = async () => {
        try {
            await axios.post(`${API_URL}/api/auth/register`, {
                username,
                password,
                email,
            });
            Alert.alert("Registration Successful", "You can now log in");
            router.replace("/auth/LoginScreen");
        } catch (error) {
            Alert.alert("Registration Failed", (error as any).response?.data?.message || "An error occurred");
        }
    };

    return (
        <LinearGradient colors={["#78B3CE", "#FFFFFF"]} style={styles.container}>
            <View style={styles.header}>
                <Image
                    source={require("../../assets/images/Logo.png")}
                    style={styles.image}
                />
                <Text style={styles.title}>Create an Account</Text>
                <Text style={styles.subtitle}>Join us and get started</Text>
            </View>

            <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor="#A0AAB8"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#A0AAB8"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#A0AAB8"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <TouchableOpacity
                style={styles.registerButton}
                onPress={handleRegister}
            >
                <Text style={styles.registerButtonText}>Register</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.replace("/auth/LoginScreen")}
            >
                <Text style={styles.backButtonText}>Back to Login</Text>
            </TouchableOpacity>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 32,
        paddingTop: 50,
    },
    image: {
        width: 120,
        height: 120,
        marginBottom: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#1A1A19",
    },
    subtitle: {
        fontSize: 16,
        color: "#64748B",
    },
    input: {
        width: "90%",
        height: 50,
        borderColor: "#DFF2EB",
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 16,
        marginBottom: 16,
        backgroundColor: "#F7FAFC",
        alignSelf: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        fontSize: 16,
        color: "#1A202C",
    },
    registerButton: {
        width: "90%",
        height: 50,
        backgroundColor: "#37AFE1",
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        marginBottom: 16,
        shadowColor: "#222",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
    },
    registerButtonText: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "bold",
    },
    backButton: {
        width: "90%",
        height: 50,
        borderWidth: 1,
        borderColor: "#37AFE1",
        backgroundColor: "#FFFFFF",
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
    },
    backButtonText: {
        color: "#37AFE1",
        fontSize: 16,
        fontWeight: "bold",
    },
});
