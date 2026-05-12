import {Analytics} from "@vercel/analytics/react"
import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {ThemeProvider} from "@/providers/theme-provider.tsx";
import LandingPage from "@/pages/LandingPage.tsx";
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<LandingPage/>}/>
                    <Route path="/generate" element={<App/>}/>
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
        <Analytics/>
    </StrictMode>
)
