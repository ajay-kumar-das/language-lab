import * as React from "react"

/**
 * Hook to detect if device is mobile based on screen width
 * @param breakpoint - The breakpoint for mobile detection (default: 768px)
 * @returns Boolean indicating if device is mobile
 */
export function useIsMobile(breakpoint: number = 768): boolean {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)

  React.useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < breakpoint)
    }

    // Check initial state
    checkIsMobile()

    // Listen for window resize
    window.addEventListener("resize", checkIsMobile)

    // Cleanup
    return () => window.removeEventListener("resize", checkIsMobile)
  }, [breakpoint])

  return isMobile
}
