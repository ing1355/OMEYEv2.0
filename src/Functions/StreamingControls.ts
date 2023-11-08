import axios, { CancelTokenSource } from "axios";
import { StopVMSVideoApi } from "../Constants/ApiRoutes";
const Buffer = require('buffer').Buffer

declare global {
  interface Window {
    Hls: any;
  }
}

type StreamingType = 'hls' | 'webrtc'

const atob = (b64Str: string) => {
  return Buffer.from(b64Str, "base64").toString("utf8");
}

const btoa = (str: string) => {
  return Buffer.from(str, "utf8").toString("base64");
}

export default class RtspPlayer {
  private webrtc: RTCPeerConnection | null = null;
  private mediaStream: MediaStream | null = null;
  private type: StreamingType | null = null;
  private channel: number = 0;
  private hls: Window['Hls'] = null;
  private canplaythroughTime: number | null = null;
  private cancelToken: CancelTokenSource | null = null;
  videoElement: HTMLVideoElement | null = null;
  private stunUrl = "stun:stun.l.google.com:19302";
  private uuid: string | null = null;
  private webrtcConfig = {
    iceServers: [
      {
        urls: ["turn:125.138.98.82:3478"],
        username: "oms",
        credential: "oms",
      }
    ],
    sdpSemantics: "unified-plan",
  };
  static types = {
    WEBRTC: "webrtc" as StreamingType,
    HLS: "hls" as StreamingType,
  };

  async setRemoteDescription() {
    let url =
      "/stream/" +
      this.uuid +
      "/channel/" +
      this.channel +
      "/webrtc?uuid=" +
      this.uuid +
      "&channel=" +
      this.channel;
    if (!this.webrtc!.localDescription) {
      let offer = await this.webrtc!.createOffer({ iceRestart: true });
      await this.webrtc!.setLocalDescription(offer);
    }
    return axios.post(url, new URLSearchParams({
      data: btoa(this.webrtc?.localDescription?.sdp as string),
    }), {
      cancelToken: this.cancelToken?.token,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      }
    }).then(res => {
      if (res.data.includes("payload") || !this.webrtc) {
        return console.error("request Fail!!");
      }
      if (this.webrtc && this.webrtc.signalingState !== "closed") {
        this.webrtc.setRemoteDescription(
          new RTCSessionDescription({
            type: "answer",
            sdp: atob(res.data),
          })
        );
      }
    }).catch(err => {
      console.error('description err : ', err)
    })
  }

  loadeddataEventCallback(e: any) {
    e.target.play();
  }

  videoErrorEventCallback(e: any) {
    if (e.target.error) {
      
    }
  }

  constructor(element: HTMLVideoElement, type: StreamingType, uuid: string) {
    this.videoElement = element;
    this.type = type;
    this.uuid = uuid;
    this.startPlay();
  }

  destroy() {
    if (this.videoElement) {
      this.videoElement.removeEventListener(
        "loadeddata",
        this.loadeddataEventCallback
      );
      this.videoElement.removeEventListener(
        "error",
        this.videoErrorEventCallback
      );
    }
    switch (this.type) {
      case "webrtc":
        if (this.webrtc) {
          if(this.videoElement) this.videoElement.srcObject = null
          if (this.cancelToken) this.cancelToken.cancel()
          this.cancelToken = null
          this.webrtc.onnegotiationneeded = null
          this.webrtc.ontrack = null
          const senders = this.webrtc.getSenders()
          senders.forEach(sender => {
            sender.replaceTrack(null)
            this.webrtc?.removeTrack(sender)
          })
          this.webrtc.getReceivers().forEach(receiver => {
            receiver.track.stop()
          })
          this.mediaStream = null;
          this.webrtc.close();
          this.webrtc = null;
        }
        break;
      case "hls":
        if (this.hls) {
          this.hls.stopLoad();
          this.hls.detachMedia();
          this.hls.destroy();
          if (this.videoElement) {
            this.videoElement.onprogress = null
            this.videoElement.oncanplaythrough = null
          }
          if (this.videoElement) this.videoElement.src = '';
          this.hls = null;
        }
        break;
      default:
        break;
    }
    this.videoElement = null
  }

  changeStream(uuid: string, el: HTMLVideoElement) {
    switch (this.type) {
      case "webrtc":
        this.destroy();
        this.uuid = uuid;
        this.videoElement = el;
        this.startPlay();
        break;
      case "hls":
        this.uuid = uuid;
        this.videoElement = el;
        this.startPlay(el);
        break;
      default:
        break;
    }
    return this;
  }

  async startPlay(el?: HTMLVideoElement) {
    const element = this.videoElement || el
    if (!element) {
      return console.error("Video Element Is Not Exist");
    } else {
      element.addEventListener(
        "loadeddata",
        this.loadeddataEventCallback
      );
      element.addEventListener("error", this.videoErrorEventCallback);
    }
    switch (this.type) {
      case "webrtc":
        this.cancelToken = axios.CancelToken.source();
        this.webrtc = new RTCPeerConnection(this.webrtcConfig);
        this.webrtc.onnegotiationneeded = this.handleNegotiationNeeded.bind(this)
        // this.webrtc.addEventListener(
        //   "negotiationneeded",
        //   this.handleNegotiationNeeded.bind(this)
        // );
        this.webrtc.ontrack = this.ontrack.bind(this)
        // this.webrtc.addEventListener("track", this.ontrack.bind(this));
        this.webrtc.addTransceiver("video", {
          direction: "recvonly",
        });
        break;
      case "hls":
        let url =
          "/stream/" +
          this.uuid +
          "/channel/" +
          this.channel +
          "/hls/live/index.m3u8";
        if (element.canPlayType("application/vnd.apple.mpegurl")) {
          element.src = url;
          element.load();
        } else if (window.Hls && window.Hls.isSupported()) {
          this.hls = new window.Hls({ manifestLoadingTimeOut: 60000 });
          this.hls.loadSource(url);
          this.hls.attachMedia(element);
          this.hls.on("error", function (e: any) {
            console.error(e);
          });
          element.onprogress = this.HlsProgressEventCallback.bind(this)
          element.oncanplaythrough = this.HlsCanplaythroughEventcallback.bind(this)
        } else {
          console.error("Your browser don`t support hls");
        }
        break;
      default:
        break;
    }
  }

  pause() {
    if (this.videoElement) this.videoElement.pause();
  }

  ontrack(event: RTCTrackEvent) {
    this.mediaStream = new MediaStream(event.streams[0]);
    this.videoElement!.srcObject = this.mediaStream;
  }

  async handleNegotiationNeeded() {
    if (this.webrtc!.signalingState === "closed") {
      console.error("can't make offer!!");
      this.webrtc!.close();
      return;
    }
    await this.setRemoteDescription();
  }

  HlsProgressEventCallback() {
    if (
      typeof document.hidden !== "undefined" &&
      document.hidden &&
      this.canplaythroughTime != null
    ) {
      //no sound, browser paused video without sound in background
      this.videoElement!.currentTime =
        this.videoElement!.buffered.end(
          this.videoElement!.buffered.length - 1
        ) - this.canplaythroughTime!;
    }
  }

  HlsCanplaythroughEventcallback() {
    if (this.canplaythroughTime == null) {
      this.canplaythroughTime = this.videoElement!.buffered.end(
        this.videoElement!.buffered.length - 1
      );
    }
  }
}