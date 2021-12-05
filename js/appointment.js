import { dateTime, hourTime } from './tools.js';
let name = document.querySelector('.nameBox');
let welcome = document.querySelector('.welcome');
let qrcode = document.querySelector('.qrcode');

let appointment = JSON.parse(sessionStorage.getItem('appointment'));
console.log(appointment);

window.onload = function () {
  name.innerText = appointment.name;
  welcome.innerHTML = `欢迎您在${dateTime(
    appointment['sessions_time']
  )}${hourTime(
    appointment['sessions_time']
  )}参观2019广州国际花卉艺术展暨中国插花花艺展。`;

  let image = new Image();
  image.src = appointment['qrcode'];

  qrcode.appendChild(image);
};
