// content.js

let audioContext;
let gainNode;
let source;

// Function to initialize audio processing
function initializeAudio() {
  // Проверка инициализации (должна быть объявлена вне функции)
  if (window.audioContext && window.gainNode) {
    console.log('Audio context already initialized.');
    return;
  }

  // Создание аудиоконтекста и GainNode
  window.audioContext = new (window.AudioContext || window.webkitAudioContext)();
  window.gainNode = window.audioContext.createGain();
  window.gainNode.connect(window.audioContext.destination);

  console.log('Audio context and GainNode initialized.');

  // Поиск аудио/видео элементов на странице
  const mediaElements = document.querySelectorAll('audio, video');
  mediaElements.forEach(element => {
    try {
      // Проверка, не подключен ли элемент уже к другому источнику
      if (!element._audioSource) {
        const source = window.audioContext.createMediaElementSource(element);
        source.connect(window.gainNode);
        element._audioSource = source; // Помечаем элемент как обработанный
        console.log('Audio source connected:', element);
      }
    } catch (error) {
      console.error('Error creating MediaElementAudioSourceNode:', error);
    }
  });

  if (mediaElements.length === 0) {
    console.warn('No audio or video elements found on this page.');
  }
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