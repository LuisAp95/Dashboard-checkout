import { createContext, useContext, useState, type ReactNode } from "react"

type DeviceType = 'desktop' | 'mobile'

interface DevicePreviewContextType {
    deviceType: DeviceType
    setDeviceType: (type: DeviceType) => void
}

const DevicePreviewContextType = createContext<DevicePreviewContextType | undefined>(undefined)

export function DevicePreviewType({ children }: { children: ReactNode }) {
    const [deviceType, setDeviceType] = useState<DeviceType>("desktop")
 
    return <DevicePreviewContextType.Provider value={{ deviceType, setDeviceType }}> {children}</DevicePreviewContextType.Provider>
}
export function useDivisePreview() {
    const context = useContext(DevicePreviewContextType)
    if (context === undefined) {
        throw new Error("useDivisePreview must be used within a DevicePreviewType")
    }
    return context
}