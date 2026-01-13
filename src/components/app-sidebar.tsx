import {
    Sidebar,
    SidebarContent, SidebarFooter,
    SidebarHeader,
} from "@/components/ui/sidebar"
import LogoDark from "../assets/logo-dark.webp"
import LogoLight from "../assets/logo-light.webp"
import {useTheme} from "@/providers/theme-provider.tsx";
import {type ComponentProps, type ReactNode} from "react";

export function AppSidebar({children, ...props}: ComponentProps<typeof Sidebar> & { children?: ReactNode }) {
    const {resolvedTheme} = useTheme()
    return (
        <Sidebar variant={"inset"} {...props}>
            <SidebarHeader>
                <div className={"flex items-center gap-3"}>
                    <img
                        src={resolvedTheme === "dark" ? LogoDark : LogoLight}
                        alt={"app-logo"}
                        className={"rounded w-10"}
                    />

                    <span className={"text-2xl"}>Strata</span>
                </div>
            </SidebarHeader>
            <SidebarContent>
                {children}
            </SidebarContent>
            <SidebarFooter>
                {/*TODO About button*/}
            </SidebarFooter>
        </Sidebar>
    )
}