document.addEventListener('DOMContentLoaded', () => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const canvas = document.getElementById('visualizer');
    const ctx = canvas.getContext('2d');
    let source;
  
    // Инициализация аудиопотока
    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
      .then(stream => {
        source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);
        analyser.connect(audioContext.destination);
        visualize();
      })
      .catch(err => console.error("Ошибка доступа к аудио:", err));
  
    // Визуализация аудио
    function visualize() {
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyser.getByteFrequencyData(dataArray);
  
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const barWidth = (canvas.width / bufferLength) * 2.5;
      let x = 0;
  
      for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArray[i] / 2;
        ctx.fillStyle = `rgb(50, 150, ${barHeight + 100})`;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
      }
      requestAnimationFrame(visualize);
    }
  
    // Сброс настроек
    document.getElementById('reset-btn').addEventListener('click', () => {
      document.querySelectorAll('.eq-band').forEach(slider => {
        slider.value = 0;
      });
    });
  });