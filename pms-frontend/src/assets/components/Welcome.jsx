import { useContext, useEffect } from "react";
import IsLoggedContext from "../context/IsLoggedContext";
import UserContext from "../context/UserContext";

const Welcome = () => {

    const {setIsLoggedIn} = useContext(IsLoggedContext);
    const {setRole, setToken} = useContext(UserContext);

     // function for persistent login
    useEffect(()=>{
        const loginState = localStorage.getItem("loginState"); //true or false
        const role = localStorage.getItem("role");
        const token = localStorage.getItem("token");
        //console.log(loginState);
        if(loginState) {
            setIsLoggedIn(true);
            setRole(role);
            setToken(token);
        }
    }, []);

    return (
        <section>
            <div className="container my-5">
                <h1 className="text-center">Welcome to <br /> Product Management System</h1>
            </div>
        </section>
    );
};

export default Welcome;