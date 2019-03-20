import React from 'react';
import PropTypes from 'prop-types';

const Header = (props) => (
    <nav className="header navbar navbar-dark bg-info" style={{overflowX: 'hidden'}}>
        <div className="container">
            <div className="brand">
                <i className="brand-icon fa fa-sun-o fa-3x"></i>
                <span className="brand-text" style={{color: 'black'}}>{props.title}</span>
            </div>
        </div>
    </nav>
);

Header.defaultProps = {
    title: 'App'
};

Header.propTypes = {
    title: PropTypes.string
};

export { Header };
