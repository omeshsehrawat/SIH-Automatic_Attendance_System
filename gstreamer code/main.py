from flask import Flask, render_template, Response
import socket
from camera_access import CameraStreamer
import threading
import time

app = Flask(__name__)

streamer = CameraStreamer()
threading.Thread(target=streamer.start, daemon=True).start()

@app.route('/')
def home():
    return render_template('home.html')

@app.route("/video_feed")
def video_feed():
    def gen():
        while True:
            frame = streamer.get_frame()
            if frame:
                yield(b"--frame\r\n"
                      b"Content-Type: image/jpeg\r\n\r\n" + frame + b"\r\n")
            time.sleep(0.03)  # ~30 FPS limiter
    return Response(gen(), mimetype="multipart/x-mixed-replace; boundary=frame")

if __name__ == '__main__':
    app.run(debug=True)