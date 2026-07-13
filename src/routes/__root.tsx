import { useState } from 'react'
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'
import { ThemeProvider } from '@/components/theme-provider'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Sidebar } from '@/components/dashboard/sidebar'
import { Topbar } from '@/components/dashboard/topbar'
import { MobileBottomNav } from '@/components/dashboard/mobile-bottom-nav'

export type RouterContext = {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
})

function RootLayout() {
  const [navOpen, setNavOpen] = useState(false)

  return (
    <ThemeProvider>
      <TooltipProvider>
        <div className="min-h-svh min-w-0">
          <Sidebar open={navOpen} onClose={() => setNavOpen(false)} />
          <div className="min-w-0 lg:pl-[220px]">
            <Topbar onMenu={() => setNavOpen(true)} />
            <Outlet />
          </div>
          <MobileBottomNav />
        </div>
      </TooltipProvider>
    </ThemeProvider>
  )
}
