import { useState, useEffect, useRef, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import '../css/Register.css'
import axios from "../api/Axios";
import { Link, useNavigate } from "react-router-dom";
import IsLoggedContext from "../context/IsLoggedContext";
import UserContext from "../context/UserContext";

const LOGIN_URL = "/auth/login";

const Login = () => {
    
    //use global IsLogged context for login-logout state validation
    const {setIsLoggedIn} = useContext(IsLoggedContext);

    //use global User context for Role, Token, Name state
    const {setRole, setToken, setName} = useContext(UserContext);

    const navigate = useNavigate();

    const emailRef = useRef();
    const errorRef = useRef();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    //email input field focused with emailRef at the time of app start
    useEffect(() => {
        emailRef.current.focus();
    }, []);

    // useEffect(() => {
    //     setErrorMessage('');
    // }, [email, password]);


    // function for persistent login
    useEffect(()=>{
        const loginState = localStorage.getItem("loginState"); //true or false
        const role = localStorage.getItem("role");
        const token = localStorage.getItem("token");
        const name = localStorage.getItem("name");
        //console.log(loginState);
        if(loginState) {
            setIsLoggedIn(true);
            setRole(role);
            setToken(token);
            setName(name);
        }
    }, []);

    //submit form function
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const user = {email, password};
            const response = await axios.post(LOGIN_URL, user);

            // console.log(email);
            // console.log(password);
            // console.log(user);

            // console.log(response.data);
            // console.log('authority: ' + response.data.user.authority.authority);
            // console.log('token: ' + response.data.jwt);

            const userRole = response.data.user.authority.authority;
            const token = response.data.jwt;
            const name = response.data.user.name;

            //if user doesn't exists
            if(response.data.jwt === '') {
                setErrorMessage("Login failed");
                errorRef.current.focus();   //show error message
            }
            else {
                setErrorMessage("");
                setIsLoggedIn(true); //set the state of IsLogged context true
                setRole(userRole); //set the Role state of User context
                setToken(token); //set the Token state of User context
                setName(name); //set Name state of User context
                setEmail('');
                setPassword('');

                // save login details to localStorage
                localStorage.setItem("loginState", true);
                localStorage.setItem("role", userRole);
                localStorage.setItem("token", token);
                localStorage.setItem("name", name);

                navigate('/home');
            }

            
        } catch (error) {
            if(!error?.response) {
                setErrorMessage('No server response');
            } else if(error.response?.status === 400) {
                setErrorMessage('Missing email or password');
            } else if(error.response?.status === 401) {
                setErrorMessage('Unauthorized');
            } else {
                setErrorMessage('Login failed');
            }
            errorRef.current.focus();
        }
    }

    return (
        <div className="signup-form">
            <p ref={errorRef} className={errorMessage ? 'errormessage' : 'offscreen'} aria-live="assertive">{errorMessage}</p>
            <form onSubmit={handleSubmit}>
                <h2>Login</h2>
                <p>Please fill in this form to create an account!</p>
                <hr />
                <div className="form-group">
                    <div className="input-group">
                        <div className="input-group-prepend">
                            <span className="input-group-text">
                                <FontAwesomeIcon icon={faEnvelope} />
                            </span>
                        </div>
                        <input 
                            type="text"
                            className="form-control"
                            name="email"
                            placeholder="Enter email"
                            ref={emailRef}
                            autoComplete="off"
                            required
                            onChange={(e)=>setEmail(e.target.value)}
                            value={email}
                        />
                    </div>
                </div>
                <div className="form-group">
                    <div className="input-group">
                        <div className="input-group-prepend">
                            <span className="input-group-text">
                                <FontAwesomeIcon icon={faLock} />
                            </span>
                        </div>
                        <input 
                            type="password"
                            className="form-control"
                            name="password"
                            placeholder="Enter password"
                            required
                            onChange={(e)=>setPassword(e.target.value)}
                            value={password}
                        />
                    </div>
                </div>

                <button type="submit" className="btn btn-success mb-3">Sign In</button>
            </form>
            <p>Need an account? 
                <Link to="/register"> Sign Up</Link>
            </p>
        </div>
    );
};

export default Login;