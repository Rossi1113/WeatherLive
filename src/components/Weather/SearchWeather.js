import React, { Component } from 'react';
import { WeatherService } from '../../services/WeatherService';

const weatherService = new WeatherService();
class SearchWeather extends Component {

    constructor(props) {
        super(props);

        this.state = {
            value: '',
            showResult: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        this.setState({value: e.target.value});
    }

    handleSubmit(e) {
        weatherService
            .getWeatherByCityName(this.state.value)
            .then(weather => {
                this.setState(() => ({weather: weather, showResult: true}));
            })
            .catch(error => console.log(error));
        e.preventDefault();
    }

    render() {
        return (
            <div>

                <form onSubmit={this.handleSubmit}>
                    <i>Search weather here</i>
                    <label>
                    CityName:
                        <input type="text" value={this.state.value} onChange={this.handleChange} />
                    </label>
                    <input type="submit" value="Submit"/>
                </form>
                {
                    this.state.showResult &&
                    <div>
                        <div className="searched-city-weather" style={{position: 'relative'}}>
                            <div className="weather-location">{this.state.weather.location.name}</div>
                            <div className="weather-min-max-temp">{this.state.weather.temperature.maximum}&deg; | {this.state.weather.temperature.minimum}&deg;</div>
                            <div className="weather-current">
                                <span className="weather-temp">{parseInt(this.state.weather.temperature.current)} &deg;&nbsp;<sup>c</sup></span>
                            </div>
                            <div className="weather-condition">
                                <img className="weather-icon" src={this.state.weather.icon} />
                                <span className="weather-description">{this.state.weather.condition}</span>
                            </div>
                        </div>
                    </div>
                }
            </div>
        );
    }
}


export { SearchWeather };
