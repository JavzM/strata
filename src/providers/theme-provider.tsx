import {createContext, type ReactNode, useContext, useEffect, useState} from "react"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
    children: ReactNode
    defaultTheme?: Theme
    storageKey?: string
}

type ThemeProviderState = {
    theme: Theme
    resolvedTheme: "dark" | "light"
    setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
    theme: "system",
    resolvedTheme: "light",
    setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
                                  children,
                                  defaultTheme = "system",
                                  storageKey = "vite-ui-theme",
                                  ...props
                              }: ThemeProviderProps) {
    const [theme, setTheme] = useState<Theme>(
        () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
    )

    const [systemTheme, setSystemTheme] = useState<"light" | "dark">(() =>
        window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    );

    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const listener = (e: MediaQueryListEvent) => {
            setSystemTheme(e.matches ? "dark" : "light");
        };
        mediaQuery.addEventListener("change", listener);
        return () => {
            mediaQuery.removeEventListener("change", listener);
        };
    }, []);

    const resolvedTheme = theme === "system" ? systemTheme : theme;

    useEffect(() => {
        const root = window.document.documentElement
        root.classList.remove("light", "dark")
        root.classList.add(resolvedTheme)
    }, [resolvedTheme])


    const value = {
        theme,
        resolvedTheme,
        setTheme: (theme: Theme) => {
            localStorage.setItem(storageKey, theme)
            setTheme(theme)
        },
    }

    return (
        <ThemeProviderContext.Provider {...props} value={value}>
            {children}
        </ThemeProviderContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
    const context = useContext(ThemeProviderContext)

    if (context === undefined)
        throw new Error("useTheme must be used within a ThemeProvider")

    return context
}
