import React, { useState } from "react";
import "../css/login.css";
import { NavLink, Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
    const navigate = useNavigate();
    // eslint-disable-next-line no-unused-vars
    const [data, setData] = useState({
        email: "",
        password: "",
    });
    
    const [error, setErrorMes] = useState('');
    

    let getMongoRows = async (uid) =>
        {
            try {
                //send post request to the 'api/users' endpoint

                const liveRow = await axios.post('https://main--magnificent-biscotti-63396d.netlify.app/getLiveRow', { 
                    userID: uid,
                });
                const giveRow = await axios.post('https://main--magnificent-biscotti-63396d.netlify.app/getGiveRow', { 
                    userID: uid,
                });
                const growRow = await axios.post('https://main--magnificent-biscotti-63396d.netlify.app/getGrowRow', { 
                    userID: uid,
                });
                const oweRow = await axios.post('https://main--magnificent-biscotti-63396d.netlify.app/getOweRow', { 
                    userID: uid,
                });
                const expenseRow = await axios.post('https://main--magnificent-biscotti-63396d.netlify.app/getExpenseRow', {
                    userID: uid
                })

                const incomeTotal = await axios.post('https://main--magnificent-biscotti-63396d.netlify.app/getSummary', { 
                    userID: uid,
                    type: 'incomeTotal',
                });
                const liveTotal = await axios.post('https://main--magnificent-biscotti-63396d.netlify.app/getSummary', { 
                    userID: uid,
                    type: 'liveTotal',
                });

                const giveTotal = await axios.post('https://main--magnificent-biscotti-63396d.netlify.app/getSummary', { 
                    userID: uid,
                    type: 'giveTotal',
                });

                const growTotal = await axios.post('https://main--magnificent-biscotti-63396d.netlify.app/getSummary', { 
                    userID: uid,
                    type: 'growTotal',
                });
                const oweTotal = await axios.post('https://main--magnificent-biscotti-63396d.netlify.app/getSummary', { 
                    userID: uid,
                    type: 'oweTotal',
                });
                
                //Set session storage items for Expense Table Rows
                sessionStorage.setItem('liveTableRows', JSON.stringify(liveRow.data.data));
                sessionStorage.setItem('giveTableRows', JSON.stringify(giveRow.data.data));
                sessionStorage.setItem('growTableRows', JSON.stringify(growRow.data.data));
                sessionStorage.setItem('oweTableRows', JSON.stringify(oweRow.data.data));
                sessionStorage.setItem('expenseTableRows', JSON.stringify(expenseRow.data.data));

                //Set session storage values for Summary Page Totals
                if (incomeTotal.data.data.length > 0)
                {
                    sessionStorage.setItem('income_value', incomeTotal.data.data[0].financeTotal);
                    sessionStorage.setItem('incomeExists', 1);
                }else{
                    sessionStorage.setItem('incomeExists', 0);
                    sessionStorage.setItem('income_value', '');
                }
                if (liveTotal.data.data.length > 0)
                {
                    sessionStorage.setItem('liveTotal', liveTotal.data.data[0].financeTotal);
                    sessionStorage.setItem('liveExists', 1);

                }else{
                    sessionStorage.setItem('liveExists', 0);
                    sessionStorage.setItem('liveTotal', 0);
                }
                if (giveTotal.data.data.length > 0)
                {
                    sessionStorage.setItem('giveTotal', giveTotal.data.data[0].financeTotal);
                    sessionStorage.setItem('giveExists', 1);

                }else{
                    sessionStorage.setItem('giveExists', 0);
                    sessionStorage.setItem('giveTotal', 0);
                }
                if (growTotal.data.data.length > 0)
                {
                    sessionStorage.setItem('growTotal', growTotal.data.data[0].financeTotal);
                    sessionStorage.setItem('growExists', 1);

                }else{
                    sessionStorage.setItem('growExists', 0);
                    sessionStorage.setItem('growTotal', 0);
                }
                if (oweTotal.data.data.length > 0)
                {
                    sessionStorage.setItem('oweTotal', oweTotal.data.data[0].financeTotal);
                    sessionStorage.setItem('oweExists', 1);
                }else{
                    sessionStorage.setItem('oweExists', 0);
                    sessionStorage.setItem('oweTotal', 0);
                }


            } catch (error) {
                console.error(error);
            }
        }

const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]:input.value });
}
        
const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const url = "https://main--magnificent-biscotti-63396d.netlify.app/findUsers";
        // Send POST request to server to authenticate user
        const response = await axios.post(url, data, {
            header: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, DELETE"
            }
        });
        const { data: responseData } = response;
        console.log("Response data:", responseData);
        
        sessionStorage.setItem("userID", responseData.data.userID);
        await getMongoRows(sessionStorage.getItem('userID')); //retrieves data based on the User token
        navigate("/summary");
        console.log("logged in successfully!");
    } catch (error) {
        if (error.response && error.response.status >= 400 && error.response.status <= 500) {
            setErrorMes(error.response.data.message);
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
                    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;600;700&display=swap"
                        rel="stylesheet" />
                    <link rel="preconnect" href="https://fonts.googleapis.com" />
                    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
                </>

                    <section className="container">
                        <div className="form login">
                            <div className="form-content">
                                <header>Login</header>
                                {error && <div style={{color: "red", textAlign: "center", paddingTop: "15px"}}>{error}</div>} 
                                <form action="#" onSubmit={handleSubmit}>
                                    <div className="field input-field">
                                        <input type="email" placeholder="Email" className="input" name = "email" value={data.email} onChange={handleChange} required />
                                    </div>

                                    <div className="field input-field">
                                        <input type={state ? "text" : "password"} placeholder="Password" className="password" name = "password" value={data.password} onChange={handleChange} required />
                                        <div onClick={toggleBtn}>
                                            <i className={state ? "bx bx-show eye-icon" : "bx bx-hide eye-icon"}></i>
                                        </div>
                                    </div>

                                    <div className="form-link">
                                        <NavLink to="/forgotPassword" className="forgot-pass">Forgot password?</NavLink>
                                    </div>

                                    <div className="field button-field">
                                        <button type="submit">Login</button>
                                    </div>

                                    <div className="form-link">
                                        <span>Don't have an account? <Link to='/Register' className="link sign-up-link">Sign Up</Link></span>
                                    </div>
                                
                                </form>
                            </div>
                        </div>
                    </section>
        </>
    );
}

export default Login;