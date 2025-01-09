import { useState, useEffect } from "react";

function useIsDarkTheme() {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;

    setIsDarkTheme(root.classList.contains("dark"));

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          setIsDarkTheme(root.classList.contains("dark"));
        }
      });
    });

    observer.observe(root, { attributes: true });

    return () => observer.disconnect();
  }, []);

  return isDarkTheme;
}

export { useIsDarkTheme };
