import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContextProvider";
import { Moon, Sun, UserRound } from "lucide-react";
import { Button } from "./button";

function NavBar() {
    const { isDark, toggleTheme } = useContext(ThemeContext);
    return <>
   
    </>
}

export default NavBar
