import React, { useState } from "react";
import "../css/login.css";
import axios from "axios";
import { Link } from "react-router-dom";

function ForgotPassword() {
    // eslint-disable-next-line no-unused-vars
    const [email, setEmail] = useState('');
    const [error, setErrorMes] = useState('');
    const [correct, setCorrectMes] = useState('');
                
        const handleSubmit = async (e) => {
            e.preventDefault();
            console.log("Here")
            try {
                const url = "http://localhost:5000/api/link";
                // Send POST request to server to authenticate user
                const { data } = await axios.post(url, {email});
                setCorrectMes(data.message);
            } catch (error) {
                if (error.response && error.response.status >= 400 && error.response.status <= 500) {
                    setErrorMes(error.response.data.message);
                }
            }
        };

    return (
        <>
                <>
                    <meta charSet="UTF-8" />
                    <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <title>Forgot Password</title>
                    <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet' />
                    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;600;700&display=swap"
                        rel="stylesheet" />
                    <link rel="preconnect" href="https://fonts.googleapis.com" />
                    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
                </>

                    <section className="container">
                        <div className="form login">
                            <div className="form-content">
                                <header>Forgot Password</header>
                                <form action="#" onSubmit={handleSubmit}>
                                    <div className="field input-field">
                                        <input type="email" placeholder="Email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                    </div>
                                    {correct && <div style={{color: "green"}}>{correct}</div>} 
                                    {error && <div style={{color: "red"}}>{error}</div>} 

                                    <div className="field button-field">
                                        <button type="submit">Submit</button>
                                    </div>

                                    <div className="form-link">
                                        <span>Go Back to <Link to='/' className="link sign-up-link"> Login </Link></span>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </section>
        </>
    );
}

export default ForgotPassword;