import { Alert } from 'react-native'
import { useEffect, useState } from 'react'
import Loader from './components/loader'
import Weather from './components/weather'
import * as Location from 'expo-location'
import axios from 'axios'

const API_KEY = '79c55b2c4b2772606ccd1d50eed8d89a'

export default function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [location, setLocation] = useState(null)

  const getWeather = async(latitude, longitude) => {
    const { data } = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`)
    setLocation(data)
    setIsLoading(false)
  }

  const setWeather = async query => {
    const { data } = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${API_KEY}&units=metric`)
    setLocation(data)
    setIsLoading(false)
  }

  const getLocation = async() => {
    try {
      const {status} = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied')
        return
      }

      const {coords: {latitude, longitude}} = await Location.getCurrentPositionAsync({})
      getWeather(latitude, longitude)
    } catch (error) {
      Alert.alert("I can't find your current location, so bad ):")
    }
  }

  useEffect(() => {
    getLocation()
  }, [])

  return isLoading ? (
    <Loader />
  ) : (
    <Weather temp={location.main.temp} name={location.name} condition={location.weather[0].main} setWeather={setWeather}/>
  )
}