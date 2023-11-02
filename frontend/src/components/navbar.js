import React, { Component } from "react";
import "../css/shared_css/navbar.css";
import { Link } from 'react-router-dom';

class Navbar extends Component {
    state = {clicked: false};

    handleCLick = () => {
        this.setState({clicked: !this.state.clicked})
    }

    logout = () => {
        window.location.href = "/";
        sessionStorage.clear();
    }

    render() { 
    return (
        <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
            <link
                href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;600;700&display=swap"
                rel="stylesheet"
            />
            <link
                rel="stylesheet"
                href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css"
            />
        <nav>
            <div className="nav-links" id="navLinks">
                <ul id="navbar" className={this.state.clicked ? "#navbar active" : "#navbar"}>{/* transition between phone view display on clicking the burger menu */}
                    <li><Link to="/summary" id="homeNav">SUMMARY</Link></li>
                    <li><Link to="/expenses" id="expensesNav">EXPENSES</Link></li>
                    {/* <li><Link to="/give" id="giveNav">GIVE</Link></li>
                    <li><Link to="/grow" id="growNav">GROW</Link></li>
                    <li><Link to="/owe" id="oweNav">OWE</Link></li> */}
                    <li><Link to="/about" id="homeNav">ABOUT</Link></li>
                    <button id="SO-Btn" onClick={this.logout}>Sign out</button>
                </ul>
            </div>
            <div id="menu" onClick={this.handleCLick}>
                <i id="bars" className={this.state.clicked ? "fas fa-times" : "fas fa-bars"}></i> {/*transition between burger and X in phone view */}
            </div>
        </nav>
        </>
    );
}
}

export default Navbar