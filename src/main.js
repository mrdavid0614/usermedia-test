import '../style.css'

const app = document.querySelector('#app');
const mediaDevices = navigator.mediaDevices;
const appTitle = document.createElement('h1');
const startCameraBtn = document.createElement('button');

appTitle.appendChild(document.createTextNode('Mi primera app usando getUserMedia'));
startCameraBtn.appendChild(document.createTextNode('Encender cámara'));
app.appendChild(appTitle);
app.appendChild(startCameraBtn);

startCameraBtn.onclick = () => {
  app.removeChild(startCameraBtn);

  mediaDevices.getUserMedia({ video: { echoCancellation: true, noiseSuppression: true }, audio: true })
  .then(stream => {
    const video = document.createElement('video');
    const div = document.createElement('div');
    const closeButton = document.createElement('button');
    const muteButton = document.createElement('button');
    muteButton.appendChild(document.createTextNode('Desactivar micrófono'));
    closeButton.appendChild(document.createTextNode('Apagar cámara'))
    video.srcObject = stream;
    video.autoplay = true;
    let track = stream.getVideoTracks()[0];

    video.oncontextmenu = e => e.preventDefault();

    muteButton.onclick = () => {
      video.muted = !video.muted;
      video.muted ? muteButton.textContent = 'Activar micrófono' : muteButton.textContent = 'Desactivar micrófono'
    }

    closeButton.onclick = () => {
      if (track.readyState === 'ended') {
        mediaDevices.getUserMedia({ video: { echoCancellation: true, noiseSuppression: true }, audio: true })
          .then(newStream => {
            video.srcObject = newStream;
            track = newStream.getVideoTracks()[0];
          })
          .catch(error => {
            const h2 = document.createElement('h2');
            h2.textContent = error.message;
            app.appendChild(h2);
          });
          
          closeButton.textContent = 'Apagar cámara';
          return;
      }
      track.stop();
      closeButton.textContent = 'Encender cámara';
    }

    app.appendChild(div);
    div.appendChild(video);
    div.classList.add('video-container');
    div.appendChild(muteButton);
    div.appendChild(closeButton);
  })
  .catch(error => {
    const h2 = document.createElement('h2');
    h2.textContent = error.message;
    app.appendChild(h2);
  });
}