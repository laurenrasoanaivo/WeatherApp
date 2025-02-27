import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, ActivityIndicator, StyleSheet, FlatList, TouchableOpacity, Appearance } from 'react-native';

const API_KEY = '34ac3f73c02b63bccac93714f16e9609';
const SUGGESTED_CITIES = ['Paris', 'Londres', 'New York', 'Tokyo', 'Sydney', 'Berlin', 'Moscou', 'Antananarivo'];

const App = () => {
    const [city, setCity] = useState('');
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(false);
    const [filteredCities, setFilteredCities] = useState([]);
    const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme()); // Obtenir le thème actuel

    useEffect(() => {
        const subscription = Appearance.addChangeListener(({ colorScheme }) => {
            setColorScheme(colorScheme); // Mettre à jour le thème en cas de changement
        });
        return () => subscription.remove();
    }, []);

    const fetchWeather = async () => {
        if (!city) return;
        setLoading(true);
        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=fr`
            );
            const data = await response.json();
            console.log(data); // 🔍 Vérifiez ce qui est retourné
            if (response.ok) {
                setWeather(data);
            } else {
                setWeather(null);
                alert(data.message || "Erreur inconnue");
            }
        } catch (error) {
            console.log(error);
            alert("Erreur de récupération des données.");
        }
        setLoading(false);
    };

    const handleCityChange = (text) => {
        setCity(text);
        if (text.length > 0) {
            const filtered = SUGGESTED_CITIES.filter(c => c.toLowerCase().startsWith(text.toLowerCase()));
            setFilteredCities(filtered);
        } else {
            setFilteredCities([]);
        }
    };

    // Styles conditionnels selon le thème
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
            backgroundColor: colorScheme === 'dark' ? '#2c2c2c' : '#E1C6FF', // Sombre ou clair
        },
        title: {
            fontSize: 24,
            fontWeight: 'bold',
            marginBottom: 10,
            color: colorScheme === 'dark' ? '#D3D3D3' : '#4B0082', // Texte clair ou foncé
        },
        input: {
            width: '100%',
            padding: 10,
            borderWidth: 1,
            borderRadius: 5,
            marginBottom: 10,
            borderColor: colorScheme === 'dark' ? '#8A2BE2' : '#8A2BE2', // Garde la même bordure
            backgroundColor: colorScheme === 'dark' ? '#555' : '#fff', // Sombre ou clair
            color: colorScheme === 'dark' ? '#fff' : '#000', // Texte en fonction du thème
        },
        suggestion: {
            padding: 10,
            borderBottomWidth: 1,
            borderColor: '#8A2BE2',
            width: '100%',
            color: colorScheme === 'dark' ? '#D3D3D3' : '#4B0082', // Texte clair ou foncé
        },
        result: { marginTop: 20, alignItems: 'center' },
        city: {
            fontSize: 20,
            fontWeight: 'bold',
            color: colorScheme === 'dark' ? '#8A2BE2' : '#8A2BE2', // Violet, peu importe le thème
        },
        temp: {
            fontSize: 36,
            fontWeight: 'bold',
            color: colorScheme === 'dark' ? '#8A2BE2' : '#8A2BE2', // Violet pour la température
        },
        desc: {
            fontSize: 18,
            fontStyle: 'italic',
            color: colorScheme === 'dark' ? '#D3D3D3' : '#4B0082', // Violet foncé en clair, clair en sombre
        }
    });

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Météo</Text>
            <TextInput
                style={styles.input}
                placeholder="Entrez une ville"
                value={city}
                onChangeText={handleCityChange}
            />
            {filteredCities.length > 0 && (
                <FlatList
                    data={filteredCities}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => { setCity(item); setFilteredCities([]); }}>
                            <Text style={styles.suggestion}>{item}</Text>
                        </TouchableOpacity>
                    )}
                />
            )}
            <Button title="Rechercher" onPress={fetchWeather} color="#8A2BE2" />
            {loading && <ActivityIndicator size="large" color="#8A2BE2" />}
            {weather && (
                <View style={styles.result}>
                    <Text style={styles.city}>{weather.name}</Text>
                    <Text style={styles.temp}>{weather.main.temp}°C</Text>
                    <Text style={styles.desc}>{weather.weather[0].description}</Text>
                </View>
            )}
        </View>
    );
};

export default App;
