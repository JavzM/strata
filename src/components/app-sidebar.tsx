import {
    Sidebar,
    SidebarContent, SidebarFooter,
    SidebarHeader,
} from "@/components/ui/sidebar"
import LogoDark from "../assets/logo-dark.webp"
import LogoLight from "../assets/logo-light.webp"
import {useTheme} from "@/providers/theme-provider.tsx";
import {type ComponentProps, type ReactNode} from "react";
import {Link} from "react-router-dom";

export function AppSidebar({children, ...props}: ComponentProps<typeof Sidebar> & { children?: ReactNode }) {
    const {resolvedTheme} = useTheme()
    return (
        <Sidebar variant={"inset"} {...props}>
            <SidebarHeader>
                <Link to={"/"}>
                    <div className={"flex items-center gap-3 transition rounded hover:bg-black/15"}>
                        <img
                            src={resolvedTheme === "dark" ? LogoDark : LogoLight}
                            alt={"app-logo"}
                            className={"rounded w-10"}
                        />
                        <span className={"text-2xl"}>Strata</span>
                    </div>
                </Link>
            </SidebarHeader>
            <SidebarContent>
                {children}
            </SidebarContent>
            <SidebarFooter className={"text-xs"}>
                <span>© {new Date().getFullYear()} — Javier Martínez</span>
            </SidebarFooter>
        </Sidebar>
    )
}