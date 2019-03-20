import React from 'react';
import { Header } from './Header';
import { WeatherDashboard } from './Weather/WeatherDashboard';
import { SearchWeather } from './Weather/SearchWeather';


const App = () => (
    <div>
        <Header title='WeatherLive' />
        <div className="mt-lg-5">
            <div className="col-lg-6 p-0 mx-auto">
                <div className="container">
                    <div className="row">
                        <div className="col-md-6">
                            <WeatherDashboard />
                        </div>
                        <div className="col-md-6">
                            <SearchWeather />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default App;
