const pomodoro = document.querySelector('.pomodoro');
const title = pomodoro.querySelector('#title');
const audio = document.querySelector('#audioSound');

const breakRange = pomodoro.querySelector('.break_range');
const sessionRange = pomodoro.querySelector('.session_range');

const break_length = pomodoro.querySelector('.break_length');
const session_length = pomodoro.querySelector('.session_length');
const minsDisplay = pomodoro.querySelector('#minutes');
const secsDisplay = pomodoro.querySelector('#seconds');

const startBtn = pomodoro.querySelector('.start_btn');
const pauseBtn = pomodoro.querySelector('.pause_btn');
const resetBtn = pomodoro.querySelector('.reset_btn');

const modal = pomodoro.querySelector('.modal');
const settingsBtn = pomodoro.querySelector('#modal_btn');
const xBtn = pomodoro.querySelector('.close');
const breakMin = pomodoro.querySelector('#breakMin');
var dur = ' minute';
var countTimerDown;
var paused = false;
var tempM, tempS;// hold values of minutes and seconds

function openSettings() {
  modal.style.display = "block";
}

function closeSettings() {
  modal.style.display = "none";
}

//click outside of the modal to close it
window.onclick = function(e) {
  if (e.target == modal) {
    modal.style.display = "none";
  }
}

function handleSessionRangeUpdate() {
  //the content of session_length and
  // timer will be changed
  //as you move the session slider
  session_length.innerHTML = sessionRange.value;
  minsDisplay.innerHTML = parseInt(sessionRange.value) < 10 ? ('0' + sessionRange.value) : sessionRange.value;
}

function handleBreakRangeUpdate() {
  break_length.innerHTML = breakRange.value;
}

//pause the timer
function pause() {
  paused = true;
  clearInterval(countTimerDown);
  //when the timer is paused set the last
  //values of the timer to tempM and tempS
  tempM = +minsDisplay.innerHTML;
  tempS = +secsDisplay.innerHTML;
  console.log(minsDisplay.innerHTML, secsDisplay.innerHTML);
  startBtn.disabled = false;
}
//reset the timer and display it in a digital format
function reset() {
  clearInterval(countTimerDown);
  title.innerHTML = 'Session';
  const curr = parseInt(sessionRange.value) < 10 ? ('0' + sessionRange.value) : sessionRange.value;
  minsDisplay.innerHTML = curr;
  secsDisplay.innerHTML = '00';
  paused = false;
  startBtn.disabled = false;
}

function start() {
  clearInterval(countTimerDown);
  isPressed = true;
  let sessionTime = parseInt(sessionRange.value);

  if(paused === false){
    timer(sessionTime*60,title.innerHTML);
  }else{
    //clear timer and continue timer from the last paused time
    clearInterval(countTimerDown);
    timer(tempM*60+tempS,title.innerHTML);
  }

  console.log(paused);
  startBtn.disabled = true;
}

function timer(seconds, type) {
  //clear any running timers when timer function starts
  clearInterval(countTimerDown);

  const now = Date.now();
  const later = now + seconds * 1000;//gives milliseconds from now
  displayTime(seconds);

  countTimerDown = setInterval(() => {
    //every 1 second 'secondsLeft' will counting down
    const secondsLeft = Math.round((later - Date.now()) / 1000);
    //stop timer when it hits 0
    //replace the title name depending to the previous name
    //and call timer function itself
    if(secondsLeft == 0) audio.play();
    if(secondsLeft < 0) {

      clearInterval(countTimerDown);
      switch (type) {
      case "Session":
          title.innerHTML = 'Break';
          timer(parseInt(breakRange.value*60), "Break");
      break;
      case "Break":
          title.innerHTML = 'Session';
          timer(parseInt(sessionRange.value*60), "Session");
      break;
    }
    return;
    }
    displayTime(secondsLeft);
  }, 1000);
}

//display the timer correctly on the screen in a digital format
function displayTime(seconds) {
  //get minutes and seconds
  const mins = Math.floor(seconds/60);
  const secs = seconds%60;
  //for holding correct digital time format
  const m = `${mins < 10 ? '0' : ''}${mins}`;
  const s = `${secs < 10 ? '0' : ''}${secs}`;

  minsDisplay.innerHTML = m;
  secsDisplay.innerHTML = s;

  document.title = `${m}:${s}`;
}

sessionRange.addEventListener('mousemove', handleSessionRangeUpdate);
breakRange.addEventListener('mousemove', handleBreakRangeUpdate);
resetBtn.addEventListener('click', reset);
pauseBtn.addEventListener('click', pause);
startBtn.addEventListener('click', start);
settingsBtn.addEventListener('click', openSettings);
xBtn.addEventListener('click', closeSettings);
