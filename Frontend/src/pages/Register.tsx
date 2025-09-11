import { useState } from "react"
import {
    Menu,
    Activity,
    X,
} from "lucide-react"
import { navigationItems } from "../data/utils"
import { useNavigate } from "react-router"
import RegisterContent from "../component/RegisterContent"
import { useUserStore } from "../store/user"


function Register() {
    const { user } = useUserStore()
    if(user.role !== 'admin'){
        window.location.href = '/auth';
    }
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const route = useNavigate();
    const handleClick = (id: String) => {
        route(`/admin/${id}`);
    }
    const currentRoute = location.pathname.split("/")[2]
    return (
        <div className="min-h-screen bg-white flex">
            <div
                className={`${sidebarOpen ? "w-64" : "w-20"} bg-blue-600 flex flex-col border-r border-blue-500 transition-all duration-300 ease-in-out`}
            >
                <div className="p-4 border-b border-blue-500">
                    <div className="flex items-center justify-between">
                        <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center ${!sidebarOpen && "mx-auto"}`}
                        >
                            <div className="w-8 h-8 bg-blue-900 rounded-full flex items-center justify-center animate-pulse">
                                <Activity className="w-3 h-3 text-white" />
                            </div>
                        </div>
                        {sidebarOpen && <span className="text-white font-bold text-lg ml-2">Attendance System</span>}
                    </div>
                </div>

                <nav className="flex-1 p-4 flex flex-col">
                    {navigationItems.map((item) => {
                        const Icon = item.icon
                        return (
                            <button
                                key={item.id}
                                onClick={() => handleClick(item.id)}
                                className={`${sidebarOpen ? "w-full justify-start px-4" : "w-12 justify-center"} h-12 flex items-center rounded-xl transition-all duration-200 mb-3 
                                    ${currentRoute.toLowerCase() === item.id.toLowerCase()
                                        ? "bg-white text-blue-600 shadow-lg"
                                        : "text-blue-100 hover:text-white hover:bg-blue-700"
                                    }`
                                }
                            >
                                <Icon className="w-5 h-5" />
                                {sidebarOpen && <span className="ml-3 font-medium">{item.label}</span>}
                            </button>
                        )
                    })}
                </nav>
            </div>

            <div className="flex-1 flex flex-col">
                <header className="bg-blue-50 border-b border-blue-200 p-6">
                    <div className="flex items-center">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="text-black hover:bg-blue-700 p-1 rounded-lg transition-colors mr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>

                        <div className="text-right ml-auto">
                            <h1 className="text-3xl font-bold text-blue-900">Register Overview</h1>
                        </div>
                    </div>
                </header>
                <RegisterContent />
            </div>
        </div>
    )
}

export default Register