"use client"

import { SidebarMenuButton } from "@/components/ui/sidebar"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChevronDown } from "lucide-react"

type SubMenuItem = {
  name: string
  route: string
}

type SidebarMenuButtonWithSubmenu = {
  src: string
  srcHover: string
  name: string
  "data-test"?: string
  subItems: SubMenuItem[]
  path?: string
  onItemClick?: () => void
  collapsed?: boolean
}

export default function SidebarButtonWithSubmenu({ 
  src, 
  srcHover, 
  name, 
  "data-test": dataTest, 
  subItems,
  path, 
  onItemClick, 
  collapsed = false 
}: SidebarMenuButtonWithSubmenu) {
  const [isHover, setIsHover] = useState<string>(src)
  const [isActive, setIsActive] = useState<boolean>(false)
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const router = useRouter()

  useEffect(() => {
    const normalizedName = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    const isCurrentlyActive = path?.startsWith("/" + normalizedName)
    
    setIsActive(!!isCurrentlyActive)
    setIsHover(isCurrentlyActive ? srcHover : src)
    setIsOpen(!!isCurrentlyActive)
  }, [path, name, src, srcHover])

  function handleToggle() {
    if (!collapsed) {
      setIsOpen(!isOpen)
    }
  }

  function handleSubItemClick(route: string) {
    router.push(route)
    if (onItemClick) {
      onItemClick()
    }
  }

  if (collapsed) {
    return (
      <div className="relative group">
        <SidebarMenuButton
          className={`flex justify-center items-center h-[50px] w-[80px] cursor-pointer relative transition-all duration-300 ease-in-out rounded-lg ${
            isActive 
              ? "bg-white hover:bg-[rgba(255,255,255,1)]! shadow-md" 
              : "hover:bg-[rgba(255,255,255,0.08)]! hover:text-inherit!"
          }`}
          onClick={handleToggle}
          data-test={dataTest || "sidebar-menu-button"}
          title={name}
        >
          <img src={isHover} alt={name} className="w-[24px] h-[24px]" />
        </SidebarMenuButton>
        
        {/* Tooltip com sub-itens ao passar o mouse */}
        <div className="absolute left-full ml-2 top-0 hidden group-hover:block z-50">
          <div className="bg-[#1a1f26] rounded-lg shadow-lg py-2 min-w-[180px] border border-gray-700">
            <div className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase">{name}</div>
            {subItems.map((item) => (
              <button
                key={item.route}
                onClick={() => handleSubItemClick(item.route)}
                className={`w-full text-left px-3 py-2 text-sm transition-colors cursor-pointer ${
                  path === item.route
                    ? "bg-white text-black"
                    : "text-gray-300 hover:bg-[rgba(255,255,255,0.08)]"
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <SidebarMenuButton
        className={`text-[17px] pl-[20px] h-[50px] w-[250px] cursor-pointer flex gap-[12px] items-center relative transition-all duration-300 ease-in-out group ${
          isActive 
            ? "bg-white hover:bg-[rgba(255,255,255,1)]! shadow-md" 
            : "hover:bg-[rgba(255,255,255,0.08)]! hover:text-inherit!"
        }`}
        onClick={handleToggle}
        data-test={dataTest || "sidebar-menu-button"}
      >
        <img src={isHover} alt="" className="w-[22px] h-[22px]" />
        <span className={`text-[16px] font-medium flex-1 ${isActive ? "text-black" : "text-[#B4BAC5]"}`}>
          {name}
        </span>
        <ChevronDown 
          className={`w-4 h-4 mr-3 transition-all duration-300 rotate-0 ${isOpen ? "!rotate-180" : ""} ${
            (isActive || isOpen) ? "opacity-100" : "opacity-0"
          } ${
            isActive ? "text-black" : "text-[#B4BAC5]"
          }`}
        />
      </SidebarMenuButton>

      {/* Sub-menu expandido */}
      <div 
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="ml-[34px] mt-0.5 space-y-1">
          {subItems.map((item) => (
            <button
              key={item.route}
              onClick={() => handleSubItemClick(item.route)}
              className={`w-[216px] text-left px-4 py-2 text-[15px] rounded-lg transition-all duration-200 cursor-pointer ${
                path === item.route
                  ? "bg-[rgba(255,255,255,0.12)] text-white font-medium"
                  : "text-[#B4BAC5] hover:bg-[rgba(255,255,255,0.06)] hover:text-white"
              }`}
              data-test={`${dataTest}-subitem-${item.name.toLowerCase()}`}
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>
    </>
  )
}
