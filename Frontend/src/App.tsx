import Content from "./component/Content"
import { useState, useRef } from "react"
import {
  Menu,
  Activity,
  X,
} from "lucide-react"
import { navigationItems } from "./data/utils"
function App() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [isDetecting, setIsDetecting] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isVideoOpen, setIsVideoOpen] = useState(false)
  const [_, setIsVideoPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

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
                onClick={() => setActiveTab(item.id)}
                className={`${sidebarOpen ? "w-full justify-start px-4" : "w-12 justify-center"} h-12 flex items-center rounded-xl transition-all duration-200 mb-3 ${activeTab === item.id
                  ? "bg-white text-blue-600 shadow-lg"
                  : "text-blue-100 hover:text-white hover:bg-blue-700"
                  }`}
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
            <div>
              <h1 className="text-3xl font-bold text-blue-900">Dashboard Overview</h1>
            </div>
            <div className="text-right ml-auto">
              <div className="text-blue-900 text-sm font-medium">Wed, Sep 10</div>
              <div className="text-blue-600 text-sm">1:54 AM</div>
            </div>
          </div>
        </header>
        <Content activeTab={activeTab} isVideoOpen={isVideoOpen} videoRef={videoRef} isDetecting={isDetecting} setIsDetecting={setIsDetecting} setIsVideoOpen={setIsVideoOpen} setIsVideoPlaying={setIsVideoPlaying} />
      </div>
    </div>
  )
}

export default App
