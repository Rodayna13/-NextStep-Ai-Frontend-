import { useState, useRef, useEffect, useCallback } from 'react';

export const useVideoPlayer = () => {
  const videoRef = useRef(null);
  const videoContainerRef = useRef(null);
  const timelineContainerRef = useRef(null);
  const thumbnailImgRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isMiniPlayer, setIsMiniPlayer] = useState(false);
  const [showCaptions, setShowCaptions] = useState(false);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [progressPosition, setProgressPosition] = useState(0);
  const [previewPosition, setPreviewPosition] = useState(0);

  const wasPausedRef = useRef(false);

  // Format duration helper
  const formatDuration = useCallback((time) => {
    const seconds = Math.floor(time % 60);
    const minutes = Math.floor(time / 60) % 60;
    const hours = Math.floor(time / 3600);

    const leadingZero = (num) => num.toString().padStart(2, '0');

    if (hours === 0) {
      return `${minutes}:${leadingZero(seconds)}`;
    } else {
      return `${hours}:${leadingZero(minutes)}:${leadingZero(seconds)}`;
    }
  }, []);

  // Get volume level for icon display
  const getVolumeLevel = useCallback(() => {
    if (isMuted || volume === 0) return 'muted';
    if (volume >= 0.5) return 'high';
    return 'low';
  }, [isMuted, volume]);

  // Toggle play/pause
  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  }, []);

  // Skip forward/backward
  const skip = useCallback((duration) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime += duration;
  }, []);

  // Toggle mute
  const toggleMute = useCallback(() => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
  }, []);

  // Change volume
  const changeVolume = useCallback((newVolume) => {
    if (!videoRef.current) return;
    videoRef.current.volume = newVolume;
    videoRef.current.muted = newVolume === 0;
  }, []);

  // Change playback speed
  const changePlaybackSpeed = useCallback(() => {
    if (!videoRef.current) return;
    let newRate = playbackRate + 0.25;
    if (newRate > 2) newRate = 0.25;
    videoRef.current.playbackRate = newRate;
    setPlaybackRate(newRate);
  }, [playbackRate]);

  // Toggle captions
  const toggleCaptions = useCallback(() => {
    if (!videoRef.current || !videoRef.current.textTracks[0]) return;
    const captions = videoRef.current.textTracks[0];
    const isHidden = captions.mode === 'hidden';
    captions.mode = isHidden ? 'showing' : 'hidden';
    setShowCaptions(isHidden);
  }, []);

  // Toggle theater mode
  const toggleTheaterMode = useCallback(() => {
    setIsTheaterMode(prev => !prev);
  }, []);

  // Toggle fullscreen
  const toggleFullScreenMode = useCallback(() => {
    if (!videoContainerRef.current) return;

    if (document.fullscreenElement == null) {
      videoContainerRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, []);

  // Toggle mini player (Picture-in-Picture)
  const toggleMiniPlayerMode = useCallback(async () => {
    if (!videoRef.current) return;

    if (document.pictureInPictureElement) {
      await document.exitPictureInPicture();
    } else {
      await videoRef.current.requestPictureInPicture();
    }
  }, []);

  // Handle timeline scrubbing
  const handleTimelineUpdate = useCallback((e) => {
    if (!timelineContainerRef.current || !videoRef.current) return;

    const rect = timelineContainerRef.current.getBoundingClientRect();
    const percent = Math.min(Math.max(0, e.clientX - rect.x), rect.width) / rect.width;

    setPreviewPosition(percent);

    if (isScrubbing) {
      e.preventDefault();
      setProgressPosition(percent);
    }
  }, [isScrubbing]);

  const toggleScrubbing = useCallback((e) => {
    if (!timelineContainerRef.current || !videoRef.current) return;

    const rect = timelineContainerRef.current.getBoundingClientRect();
    const percent = Math.min(Math.max(0, e.clientX - rect.x), rect.width) / rect.width;
    const scrubbing = (e.buttons & 1) === 1;

    setIsScrubbing(scrubbing);

    if (scrubbing) {
      wasPausedRef.current = videoRef.current.paused;
      videoRef.current.pause();
    } else {
      videoRef.current.currentTime = percent * videoRef.current.duration;
      if (!wasPausedRef.current) videoRef.current.play();
    }

    handleTimelineUpdate(e);
  }, [handleTimelineUpdate]);

  // Keyboard shortcuts
  useEffect(() => {
    // const handleKeyDown = (e) => {
    // const tagName = document.activeElement.tagName.toLowerCase();
    // if (tagName === 'input') return;

    // switch (e.key.toLowerCase()) {
    //   case ' ':
    //     if (tagName === 'button') return;
    //     e.preventDefault();
    //     togglePlay();
    //     break;
    //   case 'k':
    //     togglePlay();
    //     break;
    //   case 'f':
    //     toggleFullScreenMode();
    //     break;
    //   case 't':
    //     toggleTheaterMode();
    //     break;
    //   case 'i':
    //     toggleMiniPlayerMode();
    //     break;
    //   case 'm':
    //     toggleMute();
    //     break;
    //   case 'arrowleft':
    //   case 'j':
    //     skip(-5);
    //     break;
    //   case 'arrowright':
    //   case 'l':
    //     skip(5);
    //     break;
    //   case 'c':
    //     toggleCaptions();
    //     break;
    //   default:
    //     break;
    // }
    // };

    // document.addEventListener('keydown', handleKeyDown);
    // return () => document.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, toggleFullScreenMode, toggleTheaterMode, toggleMiniPlayerMode, toggleMute, skip, toggleCaptions]);

  // Video event listeners
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleLoadedData = () => setDuration(video.duration);
    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      setProgressPosition(video.currentTime / video.duration);
    };
    const handleVolumeChange = () => {
      setVolume(video.volume);
      setIsMuted(video.muted);
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('volumechange', handleVolumeChange);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('volumechange', handleVolumeChange);
    };
  }, []);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Picture-in-Picture listeners
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnterPip = () => setIsMiniPlayer(true);
    const handleLeavePip = () => setIsMiniPlayer(false);

    video.addEventListener('enterpictureinpicture', handleEnterPip);
    video.addEventListener('leavepictureinpicture', handleLeavePip);

    return () => {
      video.removeEventListener('enterpictureinpicture', handleEnterPip);
      video.removeEventListener('leavepictureinpicture', handleLeavePip);
    };
  }, []);

  // Scrubbing event listeners
  useEffect(() => {
    const handleMouseUp = (e) => {
      if (isScrubbing) toggleScrubbing(e);
    };

    const handleMouseMove = (e) => {
      if (isScrubbing) handleTimelineUpdate(e);
    };

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isScrubbing, toggleScrubbing, handleTimelineUpdate]);

  return {
    // Refs
    videoRef,
    videoContainerRef,
    timelineContainerRef,
    thumbnailImgRef,

    // State
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    playbackRate,
    isTheaterMode,
    isFullScreen,
    isMiniPlayer,
    showCaptions,
    isScrubbing,
    progressPosition,
    previewPosition,

    // Methods
    togglePlay,
    skip,
    toggleMute,
    changeVolume,
    changePlaybackSpeed,
    toggleCaptions,
    toggleTheaterMode,
    toggleFullScreenMode,
    toggleMiniPlayerMode,
    handleTimelineUpdate,
    toggleScrubbing,
    formatDuration,
    getVolumeLevel,
  };
};
