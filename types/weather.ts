export interface WeatherData {
  location: string
  temperature: number
  condition: string
  humidity: number
  windSpeed: number
  precipitation: number
  icon: string
  pressure?: number
  visibility?: number
  uvIndex?: number
  dewPoint?: number
  feelsLike?: number
  timestamp: string
}

export interface WeatherForecast extends WeatherData {
  date: string
  minTemperature: number
  maxTemperature: number
  precipitationProbability: number
  sunrise: string
  sunset: string
}

export interface WeatherPattern {
  date: string
  minTemp: number
  maxTemp: number
  avgTemp: number
  precipitation: number
  humidity: number
  et0: number
}
