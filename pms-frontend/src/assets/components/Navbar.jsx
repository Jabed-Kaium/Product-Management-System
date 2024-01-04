import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import '../css/Navbar.css'
import IsLoggedContext from "../context/IsLoggedContext";
import UserContext from "../context/UserContext";

const Navbar = () => {

    const navigate = useNavigate();

    //destructuring objets from IsLogged context
    const {isLoggedIn, setIsLoggedIn} = useContext(IsLoggedContext);

    //destructuring objects from User context
    const {role, setRole, setToken} = useContext(UserContext);

    //logout function
    const logout = () => {
        setIsLoggedIn(false);
        setRole('');
        setToken('');
        localStorage.clear();
        navigate('/');
    }

    return (
        <div>
            <nav className="navbar navbar-expand-lg bg-success">
                <div className="container">
                    <Link className="navbar-brand text-light" to="/">PMS</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0 fs-5">
                            {
                                //with IsLogged context manipulating navbar
                                (isLoggedIn) 
                                ?
                                <>
                                    {/* Role based menu */}
                                    {
                                        (role === 'ADMIN')
                                        ?
                                        <>
                                            <li className="nav-item">
                                                <Link className="nav-link text-light" to="/home"><span className="nav-text">Home</span></Link>
                                            </li>
                                            <li className="nav-item">
                                                <Link className="nav-link text-light" to="/products"><span className="nav-text">Products</span></Link>
                                            </li>
                                            <li className="nav-item">
                                                <Link className="nav-link text-light" to="/dashboard"><span className="nav-text">Dashboard</span></Link>
                                            </li>
                                        </>
                                        :
                                        <>
                                            <li className="nav-item">
                                                <Link className="nav-link text-light" to="/home"><span className="nav-text">Home</span></Link>
                                            </li>
                                            <li className="nav-item">
                                                <Link className="nav-link text-light" to="/products"><span className="nav-text">Products</span></Link>
                                            </li>
                                        </>
                                    }

                                    {/* Logout button */}
                                    <li className="nav-item">
                                        <button className="btn btn-danger" onClick={logout}>Logout</button>
                                    </li>
                                </>
                                :
                                <>
                                    <li className="nav-item">
                                        <Link className="nav-link text-light" aria-current="page" to="/login"><span className="nav-text">Login</span></Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link text-light" to="/register"><span className="nav-text">Sign Up</span></Link>
                                    </li>
                                </>
                            }
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;