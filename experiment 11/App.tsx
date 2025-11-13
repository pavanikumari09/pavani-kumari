import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, ActivityIndicator, StyleSheet } from 'react-native';
import axios from 'axios';

interface WeatherData {
  temperature: number;
  weather_descriptions: string[];
  wind_speed: number;
  humidity: number;
  feelslike: number;
}

const WeatherApp: React.FC = () => {
  const [city, setCity] = useState<string>('New York');
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const fetchWeather = async () => {
  try {
    setLoading(true);
    setError('');

    const API_KEY = 'b585655ba7c822f05372fdb90bc9b3cc';
    const response = await axios.get(
      `http://api.weatherstack.com/current?access_key=${API_KEY}&query=${city}`
    );

    if (response.data.error) {
      setError('City not found or invalid API key');
      setData(null);
    } else {
      setData(response.data.current);
    }
  } catch (err) {
    setError('Error fetching weather data');
    setData(null);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchWeather();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌤 Weather App</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter city name"
        value={city}
        onChangeText={setCity}
      />

      <Button title="Get Weather" onPress={fetchWeather} />

      {loading && <ActivityIndicator size="large" color="#000" />}

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {data && !loading && (
        <View style={styles.card}>
          <Text style={styles.info}>🌡 Temperature: {data.temperature}°C</Text>
          <Text style={styles.info}>💨 Wind Speed: {data.wind_speed} km/h</Text>
          <Text style={styles.info}>💧 Humidity: {data.humidity}%</Text>
          <Text style={styles.info}>🌥 Condition: {data.weather_descriptions[0]}</Text>
          <Text style={styles.info}>🤗 Feels Like: {data.feelslike}°C</Text>
        </View>
      )}
    </View>
  );
};

export default WeatherApp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#E6F2FF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    width: '80%',
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  card: {
    marginTop: 20,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    width: '90%',
    elevation: 3,
  },
  info: {
    fontSize: 16,
    marginBottom: 6,
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
});
