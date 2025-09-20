import gi, threading, time
gi.require_version('Gst', '1.0')
from gi.repository import Gst

# Initialize GStreamer
Gst.init(None)

class CameraStreamer:
    def __init__(self):
        self.pipeline = None
        self.frame = None
    
    def start(self):
        pipeline_str = (
            "rtspsrc location=rtsp://192.168.1.71:554/cam/realmonitor?channel=1&subtype=0 "
            "user-id=admin user-pw=frass@123 protocols=tcp latency=50 ! "
            "rtph264depay ! h264parse ! nvh264dec ! "
            "videoconvert ! jpegenc quality=60 ! "
            "appsink name=sink emit-signals=true sync=false drop=false max-buffers=5"
        )

        self.pipeline = Gst.parse_launch(pipeline_str)
        self.appsink = self.pipeline.get_by_name("sink")
        self.appsink.connect("new-sample", self.on_new_sample)
        self.pipeline.set_state(Gst.State.PLAYING)

    def on_new_sample(self, sink):
        sample = sink.emit("pull-sample")
        buf = sample.get_buffer()
        ok, map_info = buf.map(Gst.MapFlags.READ)
        if ok:
            self.frame = bytes(map_info.data)   # store latest JPEG bytes
            buf.unmap(map_info)
        return Gst.FlowReturn.OK

    def get_frame(self):
        return self.frame