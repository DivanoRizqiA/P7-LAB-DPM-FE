import React, { useEffect, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, Animated, View } from 'react-native';
import {
    ActivityIndicator,
    Button,
    Card,
    Dialog,
    FAB,
    Portal,
    Provider as PaperProvider,
    Text,
    TextInput
} from 'react-native-paper';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useTodos } from '@/context/TodoContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import API_URL from '@/config/config';

const TodosScreen = () => {
    const { todos, fetchTodos } = useTodos();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [loading, setLoading] = useState(true);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const gradientAnimation = new Animated.Value(0);
    const router = useRouter();

    useEffect(() => {
        const initialize = async () => {
            const token = await checkToken();
            if (!token) return; // Jika token tidak ditemukan, langsung kembali
            setLoading(true);
            await fetchTodos();
            setLoading(false);
        };

        initialize();

        Animated.loop(
            Animated.sequence([
                Animated.timing(gradientAnimation, {
                    toValue: 1,
                    duration: 3000,
                    useNativeDriver: false,
                }),
                Animated.timing(gradientAnimation, {
                    toValue: 0,
                    duration: 3000,
                    useNativeDriver: false,
                }),
            ])
        ).start();
    }, []);

    const checkToken = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                router.replace('/auth/LoginScreen'); // Arahkan ke LoginScreen jika token tidak ada
                return null;
            }
            return token;
        } catch (error) {
            console.error('Error checking token:', error);
            router.replace('/auth/LoginScreen'); // Arahkan ke LoginScreen jika terjadi error
            return null;
        }
    };

    const handleAddTodo = async () => {
        if (!title || !description) {
            setDialogMessage('Both title and description are required.');
            setDialogVisible(true);
            return;
        }
        try {
            const token = await AsyncStorage.getItem('token');
            await axios.post(`${API_URL}/api/todos`, {
                title,
                description
            }, { headers: { Authorization: `Bearer ${token}` } });
            fetchTodos();
            setTitle('');
            setDescription('');
            setIsAdding(false);
        } catch (error) {
            setDialogMessage('Failed to add todo');
            setDialogVisible(true);
        }
    };

    const handleDeleteTodo = async (id: string) => {
        try {
            const token = await AsyncStorage.getItem('token');
            await axios.delete(`${API_URL}/api/todos/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            fetchTodos();
        } catch (error) {
            setDialogMessage('Failed to delete todo');
            setDialogVisible(true);
        }
    };

    const interpolatedColor = gradientAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ['#E6E6FA', '#98FF98'],
    });

    return (
        <PaperProvider>
            <View style={styles.container}>
                <Animated.View
                    style={[
                        styles.background,
                        {
                            backgroundColor: interpolatedColor,
                        },
                    ]}
                />
                <ThemedView style={styles.innerContainer}>
                    <ThemedText style={styles.title} type="title">ToDo List</ThemedText>
                    {loading ? (
                        <ActivityIndicator style={styles.loading} animating={true} />
                    ) : (
                        <FlatList
                            data={todos}
                            keyExtractor={(item) => item._id}
                            renderItem={({ item }) => (
                                <Card style={styles.card} elevation={5} onPress={() => router.push(`../todo/${item._id}`)}>
                                    <Card.Content>
                                        <Text variant="titleMedium" style={styles.cardTitle}>{item.title}</Text>
                                        <Text variant="bodyMedium" style={styles.description}>{item.description}</Text>
                                    </Card.Content>
                                    <Card.Actions>
                                        <Button onPress={() => handleDeleteTodo(item._id)} style={styles.deleteButton}>Delete</Button>
                                    </Card.Actions>
                                </Card>
                            )}
                            contentContainerStyle={styles.listContainer}
                        />
                    )}
                    {isAdding && (
                        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.inputContainer}>
                            <TextInput label="Title" value={title} onChangeText={setTitle} style={styles.input} mode="outlined" />
                            <TextInput label="Description" value={description} onChangeText={setDescription} style={styles.input} mode="outlined" multiline />
                            <Button mode="contained" onPress={handleAddTodo} style={styles.addButton}>Add Todo</Button>
                            <Button onPress={() => setIsAdding(false)} style={styles.cancelButton}>Cancel</Button>
                        </KeyboardAvoidingView>
                    )}
                    {!isAdding && (
                        <FAB style={styles.fab} icon="plus" onPress={() => setIsAdding(true)} label="Add Todo" />
                    )}
                    <Portal>
                        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)} style={styles.dialog}>
                            <Dialog.Title>Alert</Dialog.Title>
                            <Dialog.Content>
                                <Text>{dialogMessage}</Text>
                            </Dialog.Content>
                            <Dialog.Actions>
                                <Button onPress={() => setDialogVisible(false)} style={styles.dialogButton}>OK</Button>
                            </Dialog.Actions>
                        </Dialog>
                    </Portal>
                </ThemedView>
            </View>
        </PaperProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        paddingHorizontal: 16,
        backgroundColor: 'transparent',
    },
    background: {
        ...StyleSheet.absoluteFillObject,
        position: 'absolute',
        zIndex: -1,
    },
    innerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
        backgroundColor: 'transparent',
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        marginTop: 20,
        color: '#333',
        textAlign: 'center',
    },
    listContainer: {
        paddingVertical: 10,
    },
    card: {
        marginBottom: 16,
        borderRadius: 10,
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 5,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: '500',
        color: '#333',
    },
    description: {
        color: 'gray',
        fontSize: 16,
        marginTop: 8,
    },
    deleteButton: {
        backgroundColor: '#FF6347',
        borderRadius: 5,
    },
    fab: {
        position: 'absolute',
        right: 16,
        bottom: 16,
        backgroundColor: '#FFD700',
        elevation: 6,
    },
    inputContainer: {
        padding: 16,
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        elevation: 5,
    },
    input: {
        marginBottom: 12,
    },
    addButton: {
        marginTop: 16,
    },
    cancelButton: {
        marginTop: 8,
        backgroundColor: '#DCDCDC',
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dialog: {
        backgroundColor: '#fff',
        borderRadius: 10,
    },
    dialogButton: {
        backgroundColor: '#28a745',
        borderRadius: 5,
    },
});

export default TodosScreen;
