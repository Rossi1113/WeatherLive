//import package reference
import React, { Component } from 'react';


//import project reference
import { DailyWeatherDisplay } from './DailyWeatherDisplay';
import { HourlyWeatherDisplay } from './HourlyWeatherDisplay';

//import project services
import { WeatherService } from '../../services/WeatherService';

const weatherService = new WeatherService();
class SearchWeather extends Component {

    constructor(props) {
        super(props);

        this.state = {
            value: '',
            showCurrentWeather: false,
            showDailyWeather: false,
            showHourlyWeather: false,
            error: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        this.setState({value: e.target.value});
    }

    handleSubmit(e) {
        if(this.state.value == ''){
            this.setState({
                error: true ,
                showCurrentWeather: false,
                showDailyWeather: false,
                showHourlyWeather: false
            });
            e.preventDefault();
            return;

        }
        weatherService
            .getWeatherByCityName(this.state.value)
            .then(weather => {
                const position = {
                    latitude: weather.location.latitude,
                    longitude:weather.location.longitude
                };

                this.loadDailyWeatherByPosition(position);
                this.loadHourlyWeatherByPosition(position);
                this.setState(() => ({weather: weather, showCurrentWeather: true , error: false}));

            })
            .catch(error => {
                console.log(error);
                this.setState({error: true, showResult: false});
            });


        e.preventDefault();
    }

    loadDailyWeatherByPosition(position) {

        if (!position) {
            throw Error('A valid position must be specified');
        }

        weatherService
            .getDailyWeatherByPosition(position)
            .then(dailyForecasts => {
                this.setState(() => ({ dailyForecasts: dailyForecasts , showDailyWeather: true}));
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
                this.setState(() => ({ hourlyForecasts: hourlyForecasts , showHourlyWeather: true}));
            })
            .catch(error => console.log(error));
    }

    showWeather() {
        return this.state.showCurrentWeather
            && this.state.showDailyWeather
            && this.state.showHourlyWeather;
    }

    render() {
        return (
            <div>

                <form onSubmit={this.handleSubmit}>
                    <input type="text" placeholder="Search city here..." value={this.state.value} onChange={this.handleChange} />
                    <input type="submit" value="Submit" className="btn btn-primary btn-sm"/>
                </form>
                {
                    this.showWeather() &&
                    <div>
                        <div className="searched-city-weather" style={{position: 'relative',background: '#ECEFF1'}}>
                            <div className="weather-location">{this.state.weather.location.name}</div>
                            <div className="weather-min-max-temp">{this.state.weather.temperature.maximum}&deg; | {this.state.weather.temperature.minimum}&deg;</div>
                            <div className="weather-current">
                                <span className="weather-temp" style={{fontSize:'xx-large'}}>{parseInt(this.state.weather.temperature.current)} &deg;&nbsp;<sup>c</sup></span>
                            </div>
                            <div className="weather-condition">
                                <i className={this.state.weather.id}></i>
                                <span className="weather-description">{this.state.weather.condition}</span>
                            </div>
                            <DailyWeatherDisplay dailyForecasts={this.state.dailyForecasts} />
                            <HourlyWeatherDisplay hourlyForecasts={this.state.hourlyForecasts} />
                        </div>
                    </div>
                }

                {
                    this.state.error &&
                    <p className="text-center">No valid city was found</p>
                }
            </div>
        );
    }
}


export { SearchWeather };
