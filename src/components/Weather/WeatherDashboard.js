// IMPORT PACKAGE REFERENCES
import React, { Component } from 'react';

// IMPORT PROJECT REFERENCES
import { CurrentWeatherDisplay } from './CurrentWeatherDisplay';
import { DailyWeatherDisplay } from './DailyWeatherDisplay';
import { HourlyWeatherDisplay } from './HourlyWeatherDisplay';


// IMPORT PROJECT SERVICES
import { WeatherService } from '../../services/WeatherService';
import { GeolocationService } from '../../services/GeolocationService';

// INITIALIZE SERVICES
const weatherService = new WeatherService();
const geolocationService = new GeolocationService();

const CelciusToFahrenheit = (temperature) => {
    return Math.round(temperature*9/5 + 32);
};

const FahrenheitToCelcius = (temperature) => {
    return Math.round(temperature*5/9 - 32*5/9);
};

class WeatherDashboard extends Component {

    constructor(props) {
        super(props);

        this.state = {
            showCurrentWeather: false,
            showDailyWeather: false,
            showHourlyWeather: false,
            showCelcuis: true
        };

        this.handleOnRefresh = this.handleOnRefresh.bind(this);
    }


    componentDidMount() {

        geolocationService
            .getCurrentPosition()
            .then(position => {
                this.loadCurrentWeatherByPosition(position);
                this.loadDailyWeatherByPosition(position);
                this.loadHourlyWeatherByPosition(position);
            })
            .catch(error => console.log(error));
    }


    loadCurrentWeatherByPosition(position) {

        if (!position) {
            throw Error('A valid position must be specified');
        }

        weatherService
            .getCurrentWeatherByPosition(position)
            .then(weather => {
                this.setState(() => ({ weather: weather, showCurrentWeather: true }));
            })
            .catch(error => console.log(error));
    }


    loadDailyWeatherByPosition(position) {

        if (!position) {
            throw Error('A valid position must be specified');
        }

        weatherService
            .getDailyWeatherByPosition(position)
            .then(dailyForecasts => {
                this.setState(() => ({ dailyForecasts: dailyForecasts, showDailyWeather: true }));
            })
            .catch(error => console.log(error));
    }


    loadHourlyWeatherByPosition(position) {

        if (!position) {
            throw Error('A valid position must be specified');
        }

        weatherService
            .getHourlyWeatherByPosition(position)
            .then(hourlyForecasts => {
                this.setState(() => ({ hourlyForecasts: hourlyForecasts, showHourlyWeather: true }));
            })
            .catch(error => console.log(error));
    }


    handleOnRefresh() {
        let newWeather = Object.assign({}, this.state.weather);
        if(this.state.showCelcuis){
            newWeather.temperature.current = CelciusToFahrenheit(this.state.weather.temperature.current);
            newWeather.temperature.minimum = CelciusToFahrenheit(this.state.weather.temperature.minimum);
            newWeather.temperature.maximum = CelciusToFahrenheit(this.state.weather.temperature.maximum);

        } else {
            newWeather.temperature.current = FahrenheitToCelcius(this.state.weather.temperature.current);
            newWeather.temperature.minimum = FahrenheitToCelcius(this.state.weather.temperature.minimum);
            newWeather.temperature.maximum = FahrenheitToCelcius(this.state.weather.temperature.maximum);
        }
        const newDaily = this.state.dailyForecasts.map( fc => {
            if(this.state.showCelcuis){
                return{
                    condition: fc.condition,
                    date: fc.date,
                    id: fc.id,
                    icon: fc.icon,
                    location: fc.location,
                    temperature: {
                        minimum: CelciusToFahrenheit(fc.temperature.minimum),
                        maximum: CelciusToFahrenheit(fc.temperature.maximum)
                    }
                };
            } else {
                return{
                    condition: fc.condition,
                    date: fc.date,
                    id: fc.id,
                    icon: fc.icon,
                    location: fc.location,
                    temperature: {
                        minimum: FahrenheitToCelcius(fc.temperature.minimum),
                        maximum: FahrenheitToCelcius(fc.temperature.maximum)
                    }
                };
            }
        });

        const newHourly = this.state.hourlyForecasts.map( fc => {
            if(this.state.showCelcuis){
                return{
                    condition: fc.condition,
                    date: fc.date,
                    id: fc.id,
                    icon: fc.icon,
                    location: fc.location,
                    temperature: {
                        current: CelciusToFahrenheit(fc.temperature.current)
                    }
                };
            } else {
                return{
                    condition: fc.condition,
                    date: fc.date,
                    id: fc.id,
                    icon: fc.icon,
                    location: fc.location,
                    temperature: {
                        current: FahrenheitToCelcius(fc.temperature.current)
                    }
                };
            }
        });


        this.setState(()=>({
            weather:newWeather,
            dailyForecasts:newDaily,
            hourlyForecasts:newHourly,
            showCelcuis:!this.state.showCelcuis
        }));
    }


    showWeather() {
        return this.state.showCurrentWeather
            && this.state.showDailyWeather
            && this.state.showHourlyWeather;
    }


    showSpinner() {
        return !this.state.showCurrentWeather
            || !this.state.showDailyWeather
            || !this.state.showHourlyWeather;
    }


    render() {
        return (
            <div>
                {
                    this.showWeather() &&
                    <div>
                        <CurrentWeatherDisplay weather={this.state.weather} onRefresh={this.handleOnRefresh} units={this.state.showCelcuis} />
                        <DailyWeatherDisplay dailyForecasts={this.state.dailyForecasts} />
                        <HourlyWeatherDisplay hourlyForecasts={this.state.hourlyForecasts} />
                    </div>
                }
                {
                    this.showSpinner() &&
                    <div className="w-100 text-center mt-5">
                        <i className="fa fa-spinner fa-spin fa-3x fa-fw"></i>
                    </div>
                }
            </div>
        );
    }
}


export { WeatherDashboard };
