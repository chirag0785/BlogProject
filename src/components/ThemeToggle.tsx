import { useState } from "react";
import { Button } from "@/primitives/Button";
import { MoonIcon, SunIcon } from "lucide-react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  function changeTheme() {
    const newTheme = theme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", newTheme);
    setTheme(newTheme);
  }

  return (
    <Button
      className="p-2 rounded-md hover:bg-gray-200 active:bg-gray-300 disabled:opacity-50"
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
