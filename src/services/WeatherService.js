import axios from 'axios';

const OPEN_WEATHER_BASE_URL = 'http://api.openweathermap.org/data/2.5';
const OPEN_WEATHER_API_KEY = process.env.OPEN_WEATHER_API_KEY;
const OPEN_WEATHER_IMG_URL = 'http://openweathermap.org/img/w';

const getWeather = (url) => {
    return new Promise((resolve, reject) => {
        axios
            .get(url)
            .then(response => {
                if (response && response.status === 200) {
                    const { id, main, icon } = response.data.weather[0];
                    const { temp, temp_min, temp_max } = response.data.main;
                    const { lon, lat } = response.data.coord;
                    const { dt, name } = response.data;

                    resolve({
                        id: 'wi wi-owm-' + id,
                        condition: main,
                        date: new Date(dt * 1000),
                        icon: `${OPEN_WEATHER_IMG_URL}/${icon}.png`,
                        location: {
                            name: name,
                            latitude: lat,
                            longitude: lon
                        },
                        temperature: {
                            current: temp,
                            minimum: temp_min,
                            maximum: temp_max
                        }
                    });
                } else {
                    reject('Weather data not found');
                }
            })
            .catch(error => reject(error.message));
    });
};


const getDailyWeather = (url) => {
    return new Promise((resolve, reject) => {
        axios
            .get(url)
            .then(response => {
                if (response && response.status === 200) {

                    const location = {
                        name: response.data.city.name,
                        latitude: response.data.city.coord.lat,
                        longitude: response.data.city.coord.lon
                    };

                    var time = new Date(response.data.list[0].dt * 1000).getHours();

                    const validForecasts = response.data.list.filter(
                        fc => {
                            return new Date(fc.dt * 1000).getHours() == time;
                        }
                    );

                    const dailyForecasts = validForecasts.map(fc => {
                        return {
                            condition: fc.weather[0].description,
                            date: new Date(fc.dt * 1000),
                            id: 'wi wi-owm-' + fc.weather[0].id,
                            icon: `${OPEN_WEATHER_IMG_URL}/${fc.weather[0].icon}.png`,
                            location: location,
                            temperature: {
                                minimum: fc.main.temp_min,
                                maximum: fc.main.temp_max
                            }
                        };
                    });

                    resolve(dailyForecasts);
                } else {
                    reject('Weather data not found');
                }
            })
            .catch(error => reject(error.message));
    });
};


const getHourlyWeather = (url) => {
    return new Promise((resolve, reject) => {
        axios
            .get(url)
            .then(response => {
                if (response && response.status === 200) {

                    const location = {
                        name: response.data.city.name,
                        latitude: response.data.city.coord.lat,
                        longitude: response.data.city.coord.lon
                    };

                    const hourlyForecasts = response.data.list.map(fc => {
                        return {
                            condition: fc.weather[0].description,
                            date: new Date(fc.dt * 1000),

                            id: 'wi wi-owm-' + fc.weather[0].id,
                            icon: `${OPEN_WEATHER_IMG_URL}/${fc.weather[0].icon}.png`,
                            location: location,
                            temperature: {
                                current: fc.main.temp
                            }
                        };
                    });

                    resolve(hourlyForecasts);
                } else {
                    reject('Weather data not found');
                }
            })
            .catch(error => reject(error.message));
    });
};

class WeatherService {
    getCurrentWeatherByPosition({latitude, longitude}) {
        if (!latitude) {
            throw Error('Latitude is required');
        }

        if (!longitude) {
            throw Error('Longitude is required');
        }

        const url = `${OPEN_WEATHER_BASE_URL}/weather?appid=${OPEN_WEATHER_API_KEY}&lat=${latitude}&lon=${longitude}&units=metric`;

        return getWeather(url);
    }


    getDailyWeatherByPosition({latitude, longitude}) {
        if (!latitude) {
            throw Error('Latitude is required');
        }

        if (!longitude) {
            throw Error('Longitude is required');
        }

        const url = `${OPEN_WEATHER_BASE_URL}/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${OPEN_WEATHER_API_KEY}`;

        return getDailyWeather(url);
    }


    getHourlyWeatherByPosition({latitude, longitude}) {
        if (!latitude) {
            throw Error('Latitude is required');
        }

        if (!longitude) {
            throw Error('Longitude is required');
        }

        const url = `${OPEN_WEATHER_BASE_URL}/forecast?appid=${OPEN_WEATHER_API_KEY}&lat=${latitude}&lon=${longitude}&units=metric&cnt=12`;

        return getHourlyWeather(url);
    }

    getWeatherByCityName(name){
        if(!name) {
            throw Error('City Name is required');
        }

        const url = `${OPEN_WEATHER_BASE_URL}/weather?appid=${OPEN_WEATHER_API_KEY}&q=${name}&units=metric`;

        return getWeather(url);
    }
}

export { WeatherService };
