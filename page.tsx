import { fetchWeatherApi } from 'openmeteo';
import styles from "./page.module.css";

export default async function Home() {
  const params = {
    "latitude": 19.0728,
    "longitude": 72.8826,
    "daily": "weather_code"
  };

  // Fetch weather data
  const weatherUrl = "https://api.open-meteo.com/v1/forecast";
  const weatherResponses = await fetchWeatherApi(weatherUrl, params);

  // Helper function to form time ranges
  const range = (start: number, stop: number, step: number) =>
    Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

  // Process first location
  const weatherResponse = weatherResponses[0];
  const utcOffsetSeconds = weatherResponse.utcOffsetSeconds();
  const daily = weatherResponse.daily()!;

  const weatherData = {
    daily: {
      time: range(Number(daily.time()), Number(daily.timeEnd()), daily.interval()).map(
        (t) => new Date((t + utcOffsetSeconds) * 1000)
      ),
      weatherCode: daily.variables(0)!.valuesArray()!,
    },
  };

  
  // Prepare content to display weather data
  const weatherDisplay = weatherData.daily.time.map((time, index) => (
    <div key={index} className={styles.weatherEntry}>
      <p><strong>Date:</strong> {time.toISOString().split('T')[0]}</p>
      <p><strong>Weather Code:</strong> {weatherData.daily.weatherCode[index]}</p>
    </div>
  ));



  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Daily Weather Forecast</h1>
        {weatherDisplay}
      
      </main>
    </div>
  );
}
