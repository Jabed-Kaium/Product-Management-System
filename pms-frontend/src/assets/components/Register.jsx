import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope, faLock, faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import '../css/Register.css'
import axios from "../api/Axios";
import { Link } from "react-router-dom";

//backend register endpoint URL
const REGISTER_URL = "/auth/register";

//regular expression for email validation
const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

//regular expression for password validation
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const Register = () => {

    const nameRef = useRef();
    const errorRef = useRef();

    //name state
    const [name, setName] = useState("");

    //email state
    const [email, setEmail] = useState("");
    const [validEmail, setValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);

    //password state
    const [password, setPassword] = useState("");
    const [validPassword, setValidPassword] = useState(false);
    const [passwordfocus, setPasswordFocus] = useState(false);

    //password match state
    const [matchPassword, setMatchPassword] = useState('');
    const [validMatchPassword, setValidMatchPassword] = useState(false);
    const [matchPasswordFocus, setMatchPasswordFocus] = useState(false);

    //error message state
    const [errorMessage, setErrorMessage] = useState('');

    //name input field focused with nameRef at the time of app starts
    useEffect(() => {
        nameRef.current.focus();
    }, []);

    //validate email on change
    useEffect(()=>{
        setValidEmail(EMAIL_REGEX.test(email));
    }, [email]);


    //validate password and matchPassword on change
    useEffect(() => {
        setValidPassword(PASSWORD_REGEX.test(password));
        setValidMatchPassword(password === matchPassword)
    }, [password, matchPassword])
    
    //if any of email, password or matchPassword changed
    useEffect(() => {
        setErrorMessage('');
    }, [email, password, matchPassword]);

    //submit form function
    const handleSubmit = async (e) => {
        e.preventDefault();

        //if button enabled with JS hack
        const v1 = EMAIL_REGEX.test(email);
        const v2 = PASSWORD_REGEX.test(password);
        if(!v1 || !v2) {
            setErrorMessage('Invalid entry');
            return;
        }

        try {
            const user = {name, email, password}
            const response = await axios.post(REGISTER_URL, user);

                // console.log(response.data);
                // console.log(response.data.authority)

                //clear state and controlled input
                //need value attribute on inputs for this
                setName('');
                setEmail('');
                setPassword('');
                setMatchPassword('');
        } catch (error) {
            if(!error?.response) {
                setErrorMessage('No server response');
            } else if (error.response?.status === 409) {
                setErrorMessage('Email taken');
            } else {
                setErrorMessage('Registration failed.');
            }
            errorRef.current.focus();
        }
    }

    return (
        <div className="signup-form">
            <p ref={errorRef} className={errorMessage ? 'errormessage' : 'offscreen'} aria-live='assertive'>{errorMessage}</p>
            <form onSubmit={handleSubmit}>
                <h2>Sign Up</h2>
                <p>Please fill in this form to create an account!</p>
                <hr />
                <div className="form-group">
                    <div className="input-group">
                        <div className="input-group-prepend">
                            <span className="input-group-text">
                                <FontAwesomeIcon icon={faUser} className="input-icon" />
                            </span>
                        </div>
                        <input 
                            type="text"
                            ref={nameRef}
                            autoComplete='off'
                            className="form-control"
                            name="name"
                            placeholder="Enter your name"
                            required
                            onChange={(e)=>setName(e.target.value)}
                            value={name}
                        />
                    </div>
                </div>
                <div className="form-group">
                    <div className="input-group">
                        <div className="input-group-prepend">
                            <span className="input-group-text">
                                <FontAwesomeIcon icon={
                                        !email ? faEnvelope : validEmail ? faCheck : faTimes
                                    }
                                />
                                
                            </span>
                        </div>
                        <input 
                            type="text"
                            className="form-control"
                            name="email"
                            placeholder="Enter email"
                            required
                            autoComplete='off'
                            onChange={(e)=>setEmail(e.target.value)}
                            value={email}
                            aria-invalid={validEmail ? 'false' : 'true'}
                            aria-describedby='emailNote'
                            onFocus={()=>setEmailFocus(true)}
                            onBlur={()=>setEmailFocus(false)}
                        />
                    </div>
                    <p id='emailNote' className={emailFocus && email && !validEmail ? 'instructions' : 'offscreen'}>
                                <FontAwesomeIcon icon={faInfoCircle}/>
                                Lowercase latters <br />
                                Uppercase letters <br />
                                Special characters are allowed.
                    </p>
                </div>
                <div className="form-group">
                    <div className="input-group">
                        <div className="input-group-prepend">
                            <span className="input-group-text">
                            <FontAwesomeIcon icon={
                                        !password ? faLock : validPassword ? faCheck : faTimes
                                    }
                                />
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
                            aria-invalid={validPassword ? 'false' : 'true'}
                            aria-describedby='passwordNote'
                            onFocus={()=>setPasswordFocus(true)}
                            onBlur={()=>setPasswordFocus(false)}
                        />
                    </div>
                    <p id='passwordNote' className={passwordfocus && !validPassword ? 'instructions' : 'offscreen'}>
                                <FontAwesomeIcon icon={faInfoCircle} />
                                Must include uppercase and lowercase letters, a number and a special character.<br />
                                Allowed special characters: <span aria-label='exclamation mark'>!</span> <span aria-label='at symbol'>@</span> <span aria-label='hashtag'>#</span> <span aria-label='dollar sign'>$</span> <span aria-label='percent'>%</span>
                    </p>
                </div>
                <div className="form-group">
                    <div className="input-group">
                        <div className="input-group-prepend">
                            <span className="input-group-text">
                            <FontAwesomeIcon icon={
                                        !matchPassword ? faLock : validMatchPassword ? faCheck : faTimes
                                    }
                                />
                            </span>
                        </div>
                        <input 
                            type="password"
                            className="form-control"
                            name="matchPassword"
                            placeholder="Confirm password"
                            required
                            onChange={(e)=>setMatchPassword(e.target.value)}
                            value={matchPassword}
                            aria-invalid={validMatchPassword ? 'false' : 'true'}
                            aria-describedby='confirmPasswordNote'
                            onFocus={()=>setMatchPasswordFocus(true)}
                            onBlur={()=>setMatchPasswordFocus(false)}
                        />
                    </div>
                    <p id='confirmPasswordNote' className={!validMatchPassword && matchPasswordFocus ? 'instructions' : 'offscreen'}>
                                <FontAwesomeIcon icon={faInfoCircle} />
                                Must match the first password input field.
                    </p>
                </div>

                <button type="submit" className="btn btn-success mb-3" disabled={!validEmail || !validPassword || !validMatchPassword ? true : false}>Sign Up</button>
            </form>
            <p>Already registered? 
                <Link to="/login"> Login</Link>
            </p>
        </div>
    );
};

export default Register;