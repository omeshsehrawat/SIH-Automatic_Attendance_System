import React from 'react'
import {
    Camera,
    Play,
    Square,
    CheckCircle,
} from "lucide-react"
import { lastDetection } from "../data/utils"


function Content({
    isVideoOpen,
    videoRef,
    isDetecting,
    setIsDetecting,
    setIsVideoOpen,
    setIsVideoPlaying,
}: {
    isVideoOpen: boolean;
    videoRef: React.RefObject<HTMLVideoElement | null>;
    isDetecting: boolean;
    setIsDetecting: React.Dispatch<React.SetStateAction<boolean>>;
    setIsVideoOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setIsVideoPlaying: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    // const handleVideoToggle = async () => {
    //     if (!isVideoOpen) {
    //         try {
    //             const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    //             if (videoRef?.current) {
    //                 videoRef.current.srcObject = stream;
    //                 await videoRef.current.play();
    //                 setIsVideoOpen(true);
    //                 setIsVideoPlaying(true);
    //             }
    //         } catch (error) {
    //             console.error("Error accessing camera:", error);
    //         }
    //     } else {
    //         if (videoRef?.current && videoRef.current.srcObject) {
    //             const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
    //             tracks.forEach(track => track.stop());
    //             videoRef.current.srcObject = null;
    //         }
    //         setIsVideoOpen(false);
    //         setIsVideoPlaying(false);
    //     }
    // };
    const handleVideoToggle = () => {
        if (!isVideoOpen) {
            setIsVideoOpen(true);
            setIsVideoPlaying(true);
        } else {
            setIsVideoOpen(false);
            setIsVideoPlaying(false);
        }
    };

    return (
        <main className="flex-1 p-6 overflow-auto bg-gray-50">
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
                            <img
                                src={isVideoOpen ? "/video_feed" : ""}
                                alt="Live Camera"
                                className={`w-full h-full object-cover rounded-xl transition-opacity duration-300 ${isVideoOpen ? "opacity-100" : "opacity-0"}`}
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

        </main>
    )
}

export default Content