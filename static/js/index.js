window.onload = event => {
  const startRecordEl = document.getElementById('startRecord');
  startRecordEl.addEventListener('click', startRecording);
};

let mediaRecorder;
let audioChunks = [];
let isRecording = false;
let recordingTimeout;
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

async function recordAudio() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = e => {
      if (e.data.size > 0) {
        audioChunks.push(e.data);
      }
    };

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
      // Upload the recorded audio to the "/upload" API endpoint
      uploadAudio(audioBlob);
    };

    mediaRecorder.start();
    isRecording = true;

    // Set a 3-minute recording timeout
    recordingTimeout = setTimeout(() => {
      stopRecording();
    }, 3 * 60 * 1000); // 3 minutes
  } catch (error) {
    console.error('Error starting recording:', error);
  }
}

const startRecording = () => {
  const heroEl = document.getElementById('hero');
  const recordSec = document.getElementById('rec-audio');

  heroEl.remove();
  recordSec.innerHTML = `<div class="video-container">
      <h2 id="countdown" class="countdown"></h2>
        <strong>Not sure what to say?</strong>
        Try talking about what you want to get done this week.<br /> Don't be afraid to ramble!
      <div class="sound-wave"></div>
        <div class="video-icons-container">
          <div class="video-icons">
            <img class="video-small-icons"
            onClick={window.location.reload()}
              src="https://d1muf25xaso8hp.cloudfront.net/https%3A%2F%2Fa7b19d7a245c07286533d7a21bca9acc.cdn.bubble.io%2Ff1685887680491x688314974321416600%2Frestart%2520button.png?w=24&amp;h=24&amp;auto=compress&amp;dpr=2&amp;fit=max">
            <img class="video-play-icon" id="stopRecord"
              src="https://d1muf25xaso8hp.cloudfront.net/https%3A%2F%2Fa7b19d7a245c07286533d7a21bca9acc.cdn.bubble.io%2Ff1687457916165x876681559944076700%2FStop%2520Recording.png?w=96&amp;h=96&amp;auto=compress&amp;dpr=2&amp;fit=max">
            <img class="video-small-icons"
            onClick={window.location.reload()}
              src="https://d1muf25xaso8hp.cloudfront.net/https%3A%2F%2Fa7b19d7a245c07286533d7a21bca9acc.cdn.bubble.io%2Ff1685887692355x616623671124456600%2Fcancel.png?w=24&amp;h=24&amp;auto=compress&amp;dpr=2&amp;fit=max">
          </div>
        </div>
      </div>`;

  const soundWave = document.querySelector('.sound-wave');
  let html = '';
  for (let i = 1; i <= 20; i++) {
    html += `<div class="bar"></div>`;
  }
  soundWave.innerHTML = html;

  const stopRecordEl = document.getElementById('stopRecord');
  stopRecordEl.addEventListener('click', stopRecording);
  const bar = document.querySelectorAll('.bar');
  for (let i = 0; i < bar.length; i++) {
    bar.forEach((item, j) => {
      // Random move
      item.style.animationDuration = `${Math.random() * (0.7 - 0.2) + 0.2}s`; // Change the numbers for speed / ( max - min ) + min / ex. ( 0.5 - 0.1 ) + 0.1
    });
  }
  startCountdown(2, 59);
  recordAudio();
};

const stopRecording = () => {
  const recordSec = document.getElementById('rec-audio');
  const stopAudio = document.getElementById('stop-audio');

  recordSec.innerHTML='';
  stopAudio.innerHTML = `<div class="video-container">
        <div class="loader-container">
          <div class="bubble-loader">
            <div class="bubble"></div>
            <div class="bubble"></div>
            <div class="bubble"></div>
          </div>
        </div>
        <div>transcribing...</div>
        <button class="underline-button" onClick={window.location.reload()}>cancel</button>
      </div>`;
  if (isRecording) {
    mediaRecorder.stop();
    clearTimeout(recordingTimeout);
    isRecording = false;
  }
};

// Function to start the reverse countdown
function startCountdown(minutes, seconds) {
  let countdownElement = document.getElementById('countdown');
  countdownElement.innerHTML = formatTime(minutes, seconds);

  function updateCountdown() {
    if (minutes === 0 && seconds === 0) {
      stopRecording();
    } else {
      if (seconds === 0) {
        minutes--;
        seconds = 59;
      } else {
        seconds--;
      }
      countdownElement.innerHTML = formatTime(minutes, seconds);
      setTimeout(updateCountdown, 1000); // Update every 1 second (1000 milliseconds)
    }
  }

  setTimeout(updateCountdown, 1000); // Start the countdown
}

// Format time as "mm:ss"
function formatTime(minutes, seconds) {
  return (
    (minutes < 10 ? '0' : '') +
    minutes +
    ':' +
    (seconds < 10 ? '0' : '') +
    seconds
  );
}

async function uploadAudio(audioBlob) {
  try {
    const csrftoken = document.querySelector("[name=csrfmiddlewaretoken]").value;
    const formData = new FormData();
    formData.append('recorded_audio', audioBlob);
    formData.append('csrfmiddlewaretoken',csrftoken)
    const response = await fetch('/upload/', {
      method: 'POST',
      body: formData
    })
    const result = await response.json()


    if (result) {
      const stopAudio = document.getElementById('stop-audio');
      const outptutSec = document.getElementById('output-container');
      stopAudio.innerHTML='';
      outptutSec.className = 'output-container';

      outptutSec.innerHTML = ` <div class="output-heading">Summarized Text</div>
      <div class="output-date">Sep 11, 2023</div>
      <textarea data-gramm_editor="false" id="output-textarea" placeholder="Type here..." rows="1"
        class="output-textarea">${result.message}</textarea>
      <div class="output-divider"></div>
      <button class="output-btn">+ add tag</button>
      <div class="output-icon-wrapper">
        <img
          src="https://d1muf25xaso8hp.cloudfront.net/https%3A%2F%2Fa7b19d7a245c07286533d7a21bca9acc.cdn.bubble.io%2Ff1687598001568x788745454124092400%2Fnew%2520delete.png?w=32&amp;h=32&amp;auto=compress&amp;dpr=2&amp;fit=max"
          alt="delete" width="25" height="25"  onClick={window.location.reload()/>
        <img
          src="https://d1muf25xaso8hp.cloudfront.net/https%3A%2F%2Fa7b19d7a245c07286533d7a21bca9acc.cdn.bubble.io%2Ff1687457615180x934154101628462700%2Fcopy.png?w=32&amp;h=32&amp;auto=compress&amp;dpr=2&amp;fit=max"
          alt="copy note" width="25" height="25"  onClick={window.location.reload()/>
        <img
          src="https://d1muf25xaso8hp.cloudfront.net/https%3A%2F%2Fa7b19d7a245c07286533d7a21bca9acc.cdn.bubble.io%2Ff1687457624652x591242225889318400%2Fsave.png?w=32&amp;h=32&amp;auto=compress&amp;dpr=2&amp;fit=max"
          alt="save" width="25" height="25"  onClick={window.location.reload()/>
      </div>`;

      const outputTextArea = document.getElementById('output-textarea');
      outputTextArea.addEventListener('input', function () {
        this.style.height = 'auto'; // Reset the height to auto
        this.style.height = this.scrollHeight + 'px'; // Set the height based on content
      });

    } else {
      console.error('Failed to upload audio:', response.statusText);
      console.error('Failed to upload audio:', result);
    }
  } catch (error) {
    console.log('Error uploading audio:', error.json());
  }
}