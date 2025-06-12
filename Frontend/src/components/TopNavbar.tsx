import { useContext, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { menu, logo } from "../assets"
import { CustomButton } from "./customButton"
import { navlinks } from "../constants"
import { StateContext } from "../contexts"
import { metamaskWallet } from "@thirdweb-dev/react"

export function TopNavbar() {
    const navigate = useNavigate()
    const [isActive, setIsActive] = useState("dashboard")
    const [toggleDrawer, setToggleDrawer] = useState(false)
    const { address, connect, disconnect , isAdmin, adminCheckCompleted} = useContext(StateContext)


    return (
        <nav className="w-full bg-black text-gray-300 rounded-2xl mx-2 sm:mx-4 mt-4 mb-6 shadow-lg border border-gray-700 max-w-[calc(100vw-16px)] sm:max-w-[calc(100vw-32px)]">
            <div className="w-full px-4 sm:px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex-shrink-0">
                        <img src={logo} alt="logo" className="w-10 h-10 sm:w-12 sm:h-12 hover:scale-105 transition-transform" />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-2">
                        {navlinks.map((link) => (
                            
                            <button
                                key={link.name}
                                onClick={() => {
                                    if (link.name === 'logout') disconnect()
                                    else if (!link.disabled) {
                                        setIsActive(link.name)
                                        navigate(link.link)
                                    }
                                }}
                                className={`flex items-center space-x-2 px-3 lg:px-4 py-2 rounded-xl transition-all duration-200 text-sm font-medium whitespace-nowrap ${
                                    isActive === link.name 
                                        ? 'bg-gray-800 text-green-400 shadow-md' 
                                        : 'text-gray-400 hover:bg-gray-800 hover:text-green-400'
                                } ${link.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
                                disabled={link.disabled}
                            >
                                <img 
                                    src={link.imgUrl} 
                                    alt={link.name} 
                                    className={`w-4 h-4 lg:w-5 lg:h-5 ${!link.disabled && isActive !== link.name ? 'grayscale' : ''}`} 
                                />
                                <span className="hidden lg:inline">{link.name}</span>
                            </button>
                        ))}
                    </div>

                    {/* Wallet Connection */}
                    <div className="hidden md:flex items-center space-x-4 flex-shrink-0">
                        <CustomButton
                            btnType="button"
                            title={address ? 'Create Campaign' : 'Connect Wallet'}
                            handleClick={() => {
                                if (address) navigate('/create-campaign')
                                else connect(metamaskWallet())
                            }}
                            className="bg-green-500 hover:bg-emerald-600 text-white text-sm px-3 lg:px-4 py-2 whitespace-nowrap"
                        />
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button 
                            onClick={() => setToggleDrawer(!toggleDrawer)}
                            className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            <img src={menu} alt="menu" className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Drawer */}
            {toggleDrawer && (
                <div className="md:hidden fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm z-50" onClick={() => setToggleDrawer(false)}>
                    <div className="absolute right-0 top-0 h-full w-80 max-w-[80vw] bg-gray-900 shadow-xl border-l border-gray-700">
                        <div className="p-6">
                            {/* Mobile Header */}
                            <div className="flex items-center justify-between mb-8">
                                <img src={logo} alt="logo" className="w-10 h-10" />
                                <button 
                                    onClick={() => setToggleDrawer(false)}
                                    className="p-2 rounded-lg hover:bg-gray-800"
                                >
                                    <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Mobile Navigation */}
                            <div className="flex flex-col space-y-3">
                                {navlinks.map((link) => (
                                    <button
                                        key={link.name}
                                        onClick={() => {
                                            if (link.name === 'logout') disconnect()
                                            else if (!link.disabled) {
                                                setIsActive(link.name)
                                                navigate(link.link)
                                            }
                                            setToggleDrawer(false)
                                        }}
                                        className={`flex items-center space-x-3 p-4 rounded-xl transition-all duration-200 text-sm font-medium ${
                                            isActive === link.name 
                                                ? 'bg-gray-800 text-green-400 shadow-md' 
                                                : 'text-gray-400 hover:bg-gray-800'
                                        } ${link.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        disabled={link.disabled}
                                    >
                                        <img 
                                            src={link.imgUrl} 
                                            alt={link.name} 
                                            className={`w-6 h-6 ${!link.disabled && isActive !== link.name ? 'grayscale' : ''}`} 
                                        />
                                        <span className="text-lg">{link.name}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Mobile Wallet Connection */}
                            <div className="mt-8">
                                <CustomButton
                                    btnType="button"
                                    title={address ? 'Create Campaign' : 'Connect Wallet'}
                                    handleClick={() => {
                                        if (address) navigate('/create-campaign')
                                        else connect(metamaskWallet())
                                        setToggleDrawer(false)
                                    }}
                                    className="bg-green-500 hover:bg-emerald-600 text-white w-full"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    )
}