import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, ActivityIndicator, StyleSheet, FlatList, TouchableOpacity, Appearance, Dimensions, Image } from 'react-native';

import SplashScreen from "react-native-splash-screen";

const API_KEY = '34ac3f73c02b63bccac93714f16e9609';
const SUGGESTED_CITIES = ['Paris', 'Londres', 'New York', 'Tokyo', 'Sydney', 'Berlin', 'Moscou'];

const App = () => {
    const [city, setCity] = useState('');
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(false);
    const [filteredCities, setFilteredCities] = useState([]);
    const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme());
    const [orientation, setOrientation] = useState(Dimensions.get('window').width > Dimensions.get('window').height ? 'landscape' : 'portrait');

    useEffect(() => {
        SplashScreen.hide();
        const subscription = Appearance.addChangeListener(({ colorScheme }) => {
            setColorScheme(colorScheme);
        });

        const orientationChangeListener = () => {
            const { width, height } = Dimensions.get('window');
            setOrientation(width > height ? 'landscape' : 'portrait');
        };

        Dimensions.addEventListener('change', orientationChangeListener);

        return () => {
            subscription.remove();
            Dimensions.removeEventListener('change', orientationChangeListener);
        };
    }, []);

    const fetchWeather = async () => {
        if (!city) return;
        setLoading(true);
        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=fr`
            );
            const data = await response.json();
            console.log(data);
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

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
            backgroundColor: colorScheme === 'dark' ? '#2c2c2c' : '#E1C6FF',
        },
        image: {
            width: 100,
            height: 100,
            marginBottom: 10,
        },
        title: {
            fontSize: 24,
            fontWeight: 'bold',
            marginBottom: 10,
            color: colorScheme === 'dark' ? '#D3D3D3' : '#4B0082',
        },
        input: {
            width: '100%',
            padding: 10,
            borderWidth: 1,
            borderRadius: 5,
            marginBottom: 10,
            borderColor: colorScheme === 'dark' ? '#8A2BE2' : '#8A2BE2',
            backgroundColor: colorScheme === 'dark' ? '#555' : '#fff',
            color: colorScheme === 'dark' ? '#fff' : '#000',
        },
        suggestion: {
            padding: 10,
            borderBottomWidth: 1,
            borderColor: '#8A2BE2',
            width: '100%',
            color: colorScheme === 'dark' ? '#D3D3D3' : '#4B0082',
        },
        result: { marginTop: 20, alignItems: 'center' },
        city: {
            fontSize: 20,
            fontWeight: 'bold',
            color: colorScheme === 'dark' ? '#8A2BE2' : '#8A2BE2',
        },
        temp: {
            fontSize: 36,
            fontWeight: 'bold',
            color: colorScheme === 'dark' ? '#8A2BE2' : '#8A2BE2',
        },
        desc: {
            fontSize: 18,
            fontStyle: 'italic',
            color: colorScheme === 'dark' ? '#D3D3D3' : '#4B0082',
        },
        button: {
            width: orientation === 'portrait' ? '100%' : 'auto',
            marginTop: 10,
        }
    });

    return (
        <View style={styles.container}>
            {orientation === 'portrait' && (
                <Image source={require('./assets/weather.png')} style={styles.image} />
            )}
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
            <Button title="Rechercher" onPress={fetchWeather} color="#8A2BE2" style={styles.button} />
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
