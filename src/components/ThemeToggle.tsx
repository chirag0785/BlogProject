import { useState, useEffect } from "react";
import { Button } from "@/primitives/Button";
import { MoonIcon, SunIcon } from "lucide-react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Check for the saved theme in localStorage and set it on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark";
    
    // Set the theme on page load based on saved theme in localStorage
    if (savedTheme) {
      setTheme(savedTheme);
      // Set the correct class on <html>
      if (savedTheme === "dark") {
        document.documentElement.className="dark";
      } else {
        document.documentElement.className="";
      }
    }
  }, []);

  // Change the theme and store it in localStorage
  const changeTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";

    // Add or remove the 'dark' class to the <html> element
    if (newTheme === "dark") {
      document.documentElement.className="dark";
    } else {
      document.documentElement.className="";
    }

    // Update the state and save the theme in localStorage
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <Button
      className="p-2 rounded-md hover:bg-slate-600 active:bg-slate-600 disabled:opacity-50 text-white "
      variant="subtle"
      onClick={changeTheme}
      aria-label="Switch Theme"
    >
      {theme === "dark" ? (
        <SunIcon className="w-4 h-4" />
      ) : (
        <MoonIcon className="w-4 h-4" />
      )}
    </Button>
  );
}
