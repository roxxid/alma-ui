import { Calendar, Home, Inbox, Search, Settings } from "lucide-react"
import Image from "next/image";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarSeparator,
} from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { logout } from "@/app/login/actions";

// Menu items.
const items = [
    {
        title: "Leads",
        url: "#",
        icon: Inbox,
        active: true,
    },
    {
        title: "Settings",
        url: "#",
        icon: Settings,
        active: false
    },
]

export function AppSidebar() {
    return (
        <Sidebar>
            <SidebarContent className="bg-gradient-to-t from-slate-50 from-80% to-lime-200">
                <SidebarGroup>
                    <SidebarGroupLabel>
                        <div className="mt-10">
                            <Image className="w-auto h-auto" src="/alma_logo.png" width={100} height={100} alt="Logo" priority />
                        </div>
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="mt-24">
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton size="lg" asChild>
                                        <a className={`ml-2 text-black ${item.active ? 'font-bold' : ''}`} href={item.url}>
                                            
                                            <span className="text-lg">{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton size="lg">
                                    <div className="flex flex-row justify-center items-center">
                                        <Avatar>
                                            <AvatarImage src="https://github.com/shadcn.png" />
                                        </Avatar>
                                        <p className="px-4 text-lg font-bold text-black">Admin</p>
                                    </div>
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                side="top"
                                className="w-[--radix-popper-anchor-width]"
                            >
                                <DropdownMenuItem>
                                    <Button type="submit" className="w-full bg-black text-white" onClick={() => logout()}>
                                        Logout
                                    </Button>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <SidebarSeparator />
        </Sidebar>
    )
}
