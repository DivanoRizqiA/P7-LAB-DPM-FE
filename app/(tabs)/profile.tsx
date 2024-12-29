import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedText } from '@/components/ThemedText';
import { ActivityIndicator, Button, Dialog, PaperProvider, Portal, Text } from 'react-native-paper';
import API_URL from '@/config/config';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type UserProfile = {
    username: string;
    email: string;
};

const ProfileScreen = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [dialogVisible, setDialogVisible] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                router.replace('/auth/LoginScreen');
                return;
            }

            const response = await axios.get<{ data: UserProfile }>(`${API_URL}/api/profile`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data && response.data.data) {
                setProfile(response.data.data);
            } else {
                router.replace('/auth/LoginScreen');
            }
        } catch (error) {
            console.error('Failed to fetch profile', error);
            router.replace('/auth/LoginScreen');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        setDialogVisible(true);
    };

    const confirmLogout = async () => {
        await AsyncStorage.removeItem('token');
        router.replace('/auth/LoginScreen');
    };

    if (loading) {
        return (
            <PaperProvider>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator animating={true} color="#6200ee" size="large" />
                </View>
            </PaperProvider>
        );
    }

    return (
        <PaperProvider>
            <LinearGradient
                colors={["#6a11cb", "#2575fc"]}
                style={styles.gradientBackground}
            >
                <View style={styles.contentContainer}>
                    {profile ? (
                        <View style={styles.profileContainer}>
                            <View style={styles.headerContainer}>
                                <Icon name="account-circle" size={80} color="white" />
                                <ThemedText style={styles.username}>{profile.username}</ThemedText>
                                <ThemedText style={styles.email}>{profile.email}</ThemedText>
                            </View>
                            <View style={styles.infoCard}>
                                <Icon name="account" size={20} color="#6200ee" style={styles.icon} />
                                <ThemedText style={styles.label}>Username</ThemedText>
                                <ThemedText style={styles.value}>{profile.username}</ThemedText>
                            </View>
                            <View style={styles.infoCard}>
                                <Icon name="email" size={20} color="#6200ee" style={styles.icon} />
                                <ThemedText style={styles.label}>Email</ThemedText>
                                <ThemedText style={styles.value}>{profile.email}</ThemedText>
                            </View>
                            <Button mode="contained" onPress={handleLogout} style={styles.logoutButton}>
                                Log Out
                            </Button>
                        </View>
                    ) : (
                        <ThemedText>No profile data available</ThemedText>
                    )}
                    <Portal>
                        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
                            <Dialog.Title>Logout</Dialog.Title>
                            <Dialog.Content>
                                <Text>Are you sure you want to logout?</Text>
                            </Dialog.Content>
                            <Dialog.Actions>
                                <Button onPress={() => setDialogVisible(false)}>Cancel</Button>
                                <Button onPress={confirmLogout}>OK</Button>
                            </Dialog.Actions>
                        </Dialog>
                    </Portal>
                </View>
            </LinearGradient>
        </PaperProvider>
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    gradientBackground: {
        flex: 1,
    },
    contentContainer: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    profileContainer: {
        alignItems: 'center',
        width: '100%',
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    username: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginTop: 10,
    },
    email: {
        fontSize: 16,
        color: '#ddd',
    },
    infoCard: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginVertical: 8,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    label: {
        fontSize: 14,
        color: '#888',
        marginLeft: 10,
    },
    value: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginLeft: 10,
    },
    icon: {
        marginRight: 10,
    },
    logoutButton: {
        marginTop: 20,
        backgroundColor: '#ff5252',
        borderRadius: 25,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
});

export default ProfileScreen;
