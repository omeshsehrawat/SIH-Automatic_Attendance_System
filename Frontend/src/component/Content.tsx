import React from 'react'
import {
    Camera,
    Settings,
    Play,
    Square,
    CheckCircle,
    XCircle,
    Search,
    Filter,
} from "lucide-react"
import { attendanceData, lastDetection } from "../data/utils"


function Content({
    activeTab,
    isVideoOpen,
    videoRef,
    isDetecting,
    setIsDetecting,
    setIsVideoOpen,
    setIsVideoPlaying,
}: {
    activeTab: string;
    isVideoOpen: boolean;
    videoRef: React.RefObject<HTMLVideoElement | null>;
    isDetecting: boolean;
    setIsDetecting: React.Dispatch<React.SetStateAction<boolean>>;
    setIsVideoOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setIsVideoPlaying: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const handleVideoToggle = async () => {
        if (!isVideoOpen) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
                if (videoRef?.current) {
                    videoRef.current.srcObject = stream;
                    await videoRef.current.play();
                    setIsVideoOpen(true);
                    setIsVideoPlaying(true);
                }
            } catch (error) {
                console.error("Error accessing camera:", error);
            }
        } else {
            if (videoRef?.current && videoRef.current.srcObject) {
                const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
                tracks.forEach(track => track.stop());
                videoRef.current.srcObject = null;
            }
            setIsVideoOpen(false);
            setIsVideoPlaying(false);
        }
    };
    return (
        <main className="flex-1 p-6 overflow-auto bg-gray-50">
            {activeTab === "dashboard" && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-blue-200 shadow-lg">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-semibold text-blue-900">Live Detection</h3>
                                <button
                                    onClick={handleVideoToggle}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-200 text-sm text-white shadow-lg"
                                >
                                    <Camera className="w-4 h-4" />
                                    {isVideoOpen ? "Close Camera" : "Open Camera"}
                                </button>
                            </div>

                            <div className="bg-blue-50 rounded-xl aspect-[4/2] flex items-center justify-center mb-6 relative overflow-hidden border border-blue-200">
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    muted
                                    className={`w-full h-full object-cover rounded-xl transition-opacity duration-300 ${isVideoOpen ? "opacity-100" : "opacity-0"
                                        }`}
                                />

                                {!isVideoOpen && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-blue-50">
                                        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
                                            <Camera className="w-8 h-8 text-white" />
                                        </div>
                                        <p className="text-blue-900 font-semibold text-lg">Camera Feed</p>
                                        <p className="text-blue-600 text-sm mt-1">Click 'Open Camera' to start</p>
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setIsDetecting(true)}
                                    disabled={isDetecting || !isVideoOpen}
                                    className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg"
                                >
                                    <Play className="w-4 h-4" />
                                    Start Detection
                                </button>
                                <button
                                    onClick={() => setIsDetecting(false)}
                                    disabled={!isDetecting}
                                    className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg"
                                >
                                    <Square className="w-4 h-4" />
                                    Stop Detection
                                </button>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 border border-blue-200 shadow-lg">
                            <h3 className="text-xl font-semibold text-blue-900 mb-6 text-center">Last Detection</h3>
                            <div className="relative mx-auto mb-6 w-fit">
                                <img
                                    src="/pushkar.jpeg"
                                    alt="Student Avatar"
                                    className="w-64 h-64 object-cover border-4 border-blue-500 shadow-lg mx-auto block"
                                />
                                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center shadow-lg">
                                    <CheckCircle className="w-3 h-3 text-white" />
                                </div>
                            </div>
                            <div className="flex flex-col gap-4">
                                <div className="flex justify-between">
                                    <p className="text-xs text-blue-600 uppercase tracking-wide font-semibold">Student Name</p>
                                    <p className="font-semibold text-blue-900 text-lg">{lastDetection.name}</p>
                                </div>

                                <div className="flex justify-between">
                                    <p className="text-xs text-blue-600 uppercase tracking-wide font-semibold">Enrollment ID</p>
                                    <p className="font-semibold text-blue-900">{lastDetection.enrollment}</p>
                                </div>

                                <div className="flex justify-between items-center bg-green-50 p-3 rounded-lg border border-green-200 shadow-lg">
                                    <p className="text-xs text-green-700 uppercase tracking-wide font-semibold">Detection Time</p>
                                    <p className="font-bold text-green-700 text-lg">{lastDetection.time}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === "database" && (
                <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-400" />
                            <input
                                type="text"
                                placeholder="Search students..."
                                className="w-full pl-12 pr-4 py-3 bg-white border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 text-blue-900 shadow-lg placeholder-blue-400 font-medium"
                            />
                        </div>
                        <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-200 shadow-lg border border-blue-500 font-medium">
                            <Filter className="w-4 h-4" />
                            Filter
                        </button>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-blue-200">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-blue-600">
                                    <tr>
                                        <th className="text-left p-4 font-semibold text-white">Enrollment</th>
                                        <th className="text-left p-4 font-semibold text-white">Name</th>
                                        <th className="text-left p-4 font-semibold text-white">Subject</th>
                                        <th className="text-left p-4 font-semibold text-white">Batch</th>
                                        <th className="text-left p-4 font-semibold text-white">Status</th>
                                        <th className="text-left p-4 font-semibold text-white">Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {attendanceData.map((student, index) => (
                                        <tr
                                            key={student.id}
                                            className={`${index % 2 === 0 ? "bg-blue-50" : "bg-white"} hover:bg-blue-100 transition-colors border-b border-blue-200 last:border-b-0`}
                                        >
                                            <td className="p-4 text-blue-700 font-mono text-sm font-medium">{student.id}</td>
                                            <td className="p-4 text-blue-900 font-semibold">{student.name}</td>
                                            <td className="p-4 text-blue-700 font-medium">{student.subject}</td>
                                            <td className="p-4 text-blue-700 font-medium">{student.batch}</td>
                                            <td className="p-4">
                                                <span
                                                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${student.status === "Present"
                                                        ? "bg-green-100 text-green-700 border border-green-300"
                                                        : "bg-red-100 text-red-700 border border-red-300"
                                                        }`}
                                                >
                                                    {student.status === "Present" ? (
                                                        <CheckCircle className="w-3 h-3" />
                                                    ) : (
                                                        <XCircle className="w-3 h-3" />
                                                    )}
                                                    {student.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-blue-700 font-mono text-sm font-medium">{student.time}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {(activeTab === "camera" || activeTab === "settings") && (
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                            {activeTab === "camera" ? (
                                <Camera className="w-10 h-10 text-white" />
                            ) : (
                                <Settings className="w-10 h-10 text-white" />
                            )}
                        </div>
                        <h3 className="text-xl font-semibold text-blue-900 mb-3">
                            {activeTab === "camera" ? "Camera Module" : "Settings Panel"}
                        </h3>
                        <p className="text-blue-700 font-medium">
                            {activeTab === "camera"
                                ? "Advanced camera controls and configuration options will be available here."
                                : "System settings and configuration options will be available here."}
                        </p>
                    </div>
                </div>
            )}
        </main>
    )
}

export default Content