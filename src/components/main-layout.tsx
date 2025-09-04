'use client'

import { useState, useEffect, type ReactNode } from 'react'
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarGroup,
  SidebarGroupLabel,
} from '@/components/ui/sidebar'
import {
  Home,
  FileText,
  DollarSign,
  ShieldCheck,
  UserPlus,
  BarChart2,
  Settings,
  Bell,
} from 'lucide-react'
import { Icons } from '@/components/icons'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { useToast } from '@/hooks/use-toast'

export function MainLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const { toast } = useToast()
  const [expiringClients, setExpiringClients] = useState<any[]>([])
  const notificationCount = expiringClients.length

  useEffect(() => {
    async function fetchExpiringClients() {
      try {
        const response = await fetch('http://127.0.0.1:5000/api/kyc/expiring');
        const data = await response.json();
        setExpiringClients(data.expiring_clients || [])
      } catch (error) {
        console.error('Failed to fetch expiring clients:', error)
        // Fallback to mock data if API fails
        const mockData = { expiring_clients: [
            { client_id: 'CL1003', days_left: 2 },
            { client_id: 'CL1015', days_left: 5 },
            { client_id: 'CL1022', days_left: 10 },
        ] }
        setExpiringClients(mockData.expiring_clients)
      }
    }

    fetchExpiringClients()
  }, [])

  const handleNotifyClient = async (clientId: string) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/clients/notify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ client_id: clientId }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }
      
      toast({
        title: "Notification Sent",
        description: `Notification sent to Client ${clientId}!`,
      });

      setExpiringClients(prevClients => prevClients.filter(client => client.client_id !== clientId));

    } catch (error) {
      console.error('Failed to send notification:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send notification.",
      });
    }
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Icons.logo className="size-8 text-primary" />
            <h1 className="text-xl font-headline font-semibold">BrokerVerse</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
           <SidebarMenu>
             <SidebarMenuItem>
              <Link href="/" passHref>
                <SidebarMenuButton isActive={pathname === '/'} tooltip="Dashboard">
                  <Home />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>

          <SidebarGroup>
            <SidebarGroupLabel>Core Compliance</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <Link href="/onboarding" passHref>
                  <SidebarMenuButton isActive={pathname === '/onboarding'} tooltip="KYC Form Filler">
                    <UserPlus /><span>KYC Form Filler</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="/margin-report" passHref>
                  <SidebarMenuButton isActive={pathname === '/margin-report'} tooltip="Daily Report Generator">
                    <FileText /><span>Daily Report Generator</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="/check-funds" passHref>
                  <SidebarMenuButton isActive={pathname === '/check-funds'} tooltip="Client Funds Checker">
                    <DollarSign /><span>Client Funds Checker</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="/quarterly-settlement" passHref>
                  <SidebarMenuButton isActive={pathname === '/quarterly-settlement'} tooltip="Quarterly Settlement">
                    <FileText /><span>Quarterly Settlement</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Surveillance</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <Link href="/trade-watchdog" passHref>
                  <SidebarMenuButton isActive={pathname === '/trade-watchdog'} tooltip="Trade Watchdog">
                    <ShieldCheck /><span>Trade Watchdog</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
          
          <SidebarGroup>
            <SidebarGroupLabel>New Core Compliance</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <Link href="/margin-report" passHref>
                  <SidebarMenuButton isActive={pathname === '/margin-report'} tooltip="Daily Margin Checker">
                    <BarChart2 /><span>Daily Margin Checker</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>

        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <Link href="#" passHref>
                <SidebarMenuButton tooltip="Settings">
                  <Settings />
                  <span>Settings</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
          <SidebarTrigger className="md:hidden" />
          <div className="flex items-center gap-4 ml-auto">
             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative rounded-full">
                  <Bell className="h-5 w-5" />
                  {notificationCount > 0 && (
                    <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                      {notificationCount}
                    </span>
                  )}
                  <span className="sr-only">Notifications</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Expiring KYC</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notificationCount > 0 ? (
                  expiringClients.map(client => (
                    <DropdownMenuItem key={client.client_id} onSelect={(e) => { e.preventDefault(); handleNotifyClient(client.client_id); }} className="cursor-pointer">
                      Client {client.client_id} expires in {client.days_left} days.
                    </DropdownMenuItem>
                  ))
                ) : (
                  <DropdownMenuItem>No expiring clients</DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src="https://picsum.photos/100/100" alt="User" data-ai-hint="person face" />
                    <AvatarFallback>BR</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
