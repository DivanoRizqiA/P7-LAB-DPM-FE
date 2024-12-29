import React, { useState } from 'react';
import { StyleSheet, View, TextInput, FlatList } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Button, Card, Divider, IconButton } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

const ExploreScreen = () => {
    const [searchText, setSearchText] = useState('');
    const [data, setData] = useState([
        { id: '1', title: 'Rendang, Sumatera Barat', description: 'Masakan daging sapi khas Minangkabau yang dimasak dengan santan dan rempah-rempah hingga kering.' },
        { id: '2', title: 'Sate, Indonesia', description: 'Hidangan daging yang ditusuk dan dibakar, disajikan dengan bumbu kacang atau kecap.' },
        { id: '3', title: 'Nasi Goreng, Indonesia', description: 'Nasi yang digoreng dengan campuran bumbu, kecap, dan tambahan seperti ayam, udang, atau telur.' },
        { id: '4', title: 'Pempek, Palembang', description: 'Makanan khas Palembang yang terbuat dari ikan dan sagu, disajikan dengan kuah cuko yang asam manis.' },
        { id: '5', title: 'Gado-Gado, Indonesia', description: 'Salad khas Indonesia yang terdiri dari sayuran rebus, tahu, tempe, dan telur, disajikan dengan saus kacang.' },
        { id: '6', title: 'Gudeg, Yogyakarta', description: 'Hidangan khas Yogyakarta yang berbahan dasar nangka muda, dimasak dengan santan hingga empuk dan manis.' },
        { id: '7', title: 'Soto, Indonesia', description: 'Sup khas Indonesia dengan berbagai variasi, seperti Soto Ayam, Soto Betawi, atau Soto Lamongan.' },
        { id: '8', title: 'Bakso, Indonesia', description: 'Bola daging yang disajikan dalam kuah kaldu hangat dengan mie, tahu, dan pelengkap lainnya.' },
        { id: '9', title: 'Ayam Betutu, Bali', description: 'Hidangan ayam khas Bali yang dimasak dengan bumbu rempah lengkap dan dibungkus daun pisang.' },
        { id: '10', title: 'Es Cendol, Indonesia', description: 'Minuman segar dengan campuran cendol, santan, dan gula aren, sering dinikmati di hari panas.' },
    ]);

    const [filteredData, setFilteredData] = useState(data);

    const handleSearch = () => {
        if (searchText.trim() === '') {
            setFilteredData(data);
        } else {
            const filtered = data.filter(item =>
                item.title.toLowerCase().includes(searchText.toLowerCase())
            );
            setFilteredData(filtered);
        }
    };

    const handleTextChange = (text: string) => {
        setSearchText(text);
        if (text.trim() === '') {
            setFilteredData(data);
        }
    };

    return (
        <ThemedView style={styles.container}>
            <View style={styles.header}>
                <MaterialIcons name="restaurant-menu" size={36} color="#FF6347" />
                <ThemedText style={styles.welcomeText}>Welcome to Explore!</ThemedText>
                <ThemedText style={styles.subText}>Discover new foods and experiences</ThemedText>
            </View>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search Foods..."
                    value={searchText}
                    onChangeText={handleTextChange}
                    onSubmitEditing={handleSearch}
                />
            <IconButton
                icon="magnify"
                size={28}
                onPress={handleSearch}
                style={[styles.searchIcon, { backgroundColor: '#FF6347' }]}
            />

            </View>
            <FlatList
                data={filteredData}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <Card style={styles.card}>
                        <Card.Title
                            title={item.title}
                            titleStyle={styles.cardTitle}
                            left={() => <MaterialIcons name="fastfood" size={28} color="#FF6347" />}
                        />
                        <Divider />
                        <Card.Content>
                            <ThemedText style={styles.descriptionText}>{item.description}</ThemedText>
                        </Card.Content>
                    </Card>
                )}
                ListEmptyComponent={
                    <ThemedText style={styles.emptyText}>No Foods found</ThemedText>
                }
            />
        </ThemedView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#FFF',
    },
    header: {
        marginBottom: 20,
        alignItems: 'center',
    },
    welcomeText: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#FF6347',
        marginTop: 10,
    },
    subText: {
        fontSize: 16,
        color: '#555',
        marginTop: 5,
    },
    searchContainer: {
        flexDirection: 'row',
        marginBottom: 16,
        alignItems: 'center',
    },
    searchInput: {
        flex: 1,
        borderColor: '#FF6347',
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        backgroundColor: '#FFF',
        marginRight: 8,
    },
    searchIcon: {
        borderRadius: 50,
        elevation: 3,
        padding: 4,
    },
    card: {
        marginBottom: 16,
        borderRadius: 12,
        elevation: 5,
        backgroundColor: '#FFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    cardTitle: {
        fontWeight: 'bold',
        fontSize: 18,
        color: '#333',
    },
    descriptionText: {
        fontSize: 14,
        color: '#555',
    },
    emptyText: {
        marginTop: 20,
        textAlign: 'center',
        fontSize: 16,
        color: '#FF6347',
    },
});

export default ExploreScreen;
