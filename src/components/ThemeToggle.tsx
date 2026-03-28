import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUiStore } from "@/stores/uiStore";
import { useEffect } from "react";

export function ThemeToggle() {
  const { themeMode, toggleTheme } = useUiStore();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", themeMode === "dark");
  }, [themeMode]);

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
      {themeMode === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}
