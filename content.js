// content.js

let audioContext;
let gainNode;
let source;

// Function to initialize audio processing
function initializeAudio() {
  if (audioContext) {
    console.log('Audio context already initialized.');
    return;
  }

  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  gainNode = audioContext.createGain();

  // Request access to the audio stream from the current tab
  chrome.tabCapture.capture({
    video: false,
    audio: true
  }, (stream) => {
    if (!stream) {
      console.error('Error capturing tab audio:', chrome.runtime.lastError);
      return;
    }

    // Create a MediaStreamAudioSourceNode from the captured stream
    source = audioContext.createMediaStreamSource(stream);

    // Connect the source to the gain node
    source.connect(gainNode);

    // Connect the gain node to the audio context destination (speakers)
    gainNode.connect(audioContext.destination);

    console.log('Audio stream captured and connected.');
  });
}

// Initialize audio processing when the script is injected
initializeAudio();

// Listen for messages from the popup or background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.command === "setVolume") {
    if (gainNode) {
      // Set the gain value (volume)
      gainNode.gain.value = request.volume;
      console.log('Volume set to:', request.volume);
    } else {
      console.warn('GainNode not initialized yet.');
    }
  }
});