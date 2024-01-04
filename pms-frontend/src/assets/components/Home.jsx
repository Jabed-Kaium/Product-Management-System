import { useContext, useEffect, useState } from "react";
import IsLoggedContext from "../context/IsLoggedContext";
import UserContext from "../context/UserContext";
//import '../css/clock.css'

const Home = () => {

    //use global IsLogged context for login-logout state validation
    const {setIsLoggedIn} = useContext(IsLoggedContext);
    //use global User context for Role, Token, Name state
    const {setRole, setToken, name, setName} = useContext(UserContext);

    //date state
    const [date, setDate] = useState('');

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "ThurseDay", "Friday", "Saturday"];

    // function for persistent login
    useEffect(()=>{

        //get current date and details
        const today = new Date();   //get current date
        const day = today.getDay(); //returns in numeric data
        const date = today.getDate();
        const month = today.getMonth();
        const year = today.getFullYear();

        const currentDate = days[day] + ', ' + date + ' ' + months[month] + ', ' + year;

        //set current date to date state
        setDate(currentDate);

        //get data from localStorage
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

    return (
        <section>
            <h1 className="text-center my-5 fw-bold fst-italic">Welcome</h1>
            <h1 className="text-center fw-bold fst-italic" style={{fontSize: "4rem"}}>{name}</h1>
            <h3 className="text-center mt-5">{date}</h3>
        </section>
    );
};

export default Home;