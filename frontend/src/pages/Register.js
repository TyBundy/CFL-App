/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import "../css/login.css";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

function Register() {
    const navigate = useNavigate();

    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    })
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setErrorMessage] = useState('');

    const handleChange = ({currentTarget: input }) => {
        setData({ ...data, [input.name]:input.value });
    }

    const handleSubmit = async (e) => { //onSubmit --> post
        e.preventDefault();

        if (data.password !== confirmPassword) {
            setErrorMessage("Passwords do not match");
            return;
        } else {
            try{
                
                const url = "http://localhost:5000/api/users";
                //send post request to the 'api/users' endpoint
                const { data: { user } } = await axios.post(url, data);
                
                sessionStorage.setItem('userID', user._id);
                console.log(user._id);
                navigate('/summary');
            } catch (error) {
                if (error.response && error.response.status >= 400 && error.response.status <= 500) {
                    setErrorMessage(error.response.data.message);
                }
            }
        }
    };

    //show or hide password
    const [state, setState] = useState(false);

    const toggleBtn = () => {
        setState(prevState => !prevState);
    }

    return (
        <>
            <>
                <meta charSet="UTF-8" />
                <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Sign in/Sign Up</title>
                <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet' />
                <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;600;700&display=swap" rel="stylesheet" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
            </>

            <section className="container">
                <div className="form login" id="regis">
                    <div className="form-content">
                        <header>Register</header>
                        {error && <div style={{color:"red", textAlign: "center", paddingTop: "15px"}}>{error}</div>}
                        <form action="#" onSubmit={handleSubmit}>
                            <div className="field input-field">
                                <input
                                    type="text"
                                    placeholder="First Name"
                                    className="input"
                                    name = "firstName"
                                    value={data.firstName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="field input-field">
                                <input
                                    type="text"
                                    placeholder="Last Name"
                                    className="input"
                                    name = "lastName"
                                    value={data.lastName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="field input-field">
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className="input"
                                    name = "email"
                                    value={data.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="field input-field">
                                <input
                                    type={state ? "text" : "password"}
                                    placeholder="Password"
                                    className="password"
                                    name = "password"
                                    value={data.password}
                                    onChange={handleChange}
                                    required
                                />
                                <div onClick={toggleBtn}>
                                    <i className={state ? "bx bx-show eye-icon" : "bx bx-hide eye-icon"}></i>
                                </div>
                            </div>
                            <div className="field input-field">
                                <input
                                    type={state ? "text" : "password"}
                                    placeholder="Confirm Password"
                                    className="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                                <div onClick={toggleBtn}>
                                    <i className={state ? "bx bx-show eye-icon" : "bx bx-hide eye-icon"}></i>
                                </div>
                            </div>

                           

                            <div className="field button-field">
                                <button type="submit">Register</button>
                                
                            </div>

                            <div className="form-link">
                                <span>Already have an account? <Link to="/" className="link login-link">Login</Link></span>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Register;