import ajax from './ajax-promise.js';
import { dateTime, hourTime, $toast } from './tools.js';
let date = document.querySelector('#date');
let session = document.querySelector('.content');

let userData = JSON.parse(localStorage.getItem('userData'));
// console.log(userData);
let dateList = [];
let sessionList = [];
//打开时加载
window.onload = async function () {
  let dateRes = await ajax({
    url: 'http://egg.flower.dbice.cn/api/date',
    method: 'GET',
    headers: {
      'x-token': userData.token,
    },
  });
  // console.log(dateRes);
  dateList = dateRes.data
    .filter(item => item.time > +new Date())
    .sort((a, b) => a.time - b.time);
  // console.log(dateList);
  renderDate();

  //  获取当天场次信息
  let sessionRes = await ajax({
    url: 'http://egg.flower.dbice.cn/api/session',
    data: {
      timeId: dateList[0].id,
    },
    headers: {
      'x-token': userData.token,
    },
  });
  sessionList = sessionRes.data.sort(
    (a, b) => a['start_time'] - b['start_time']
  );
  console.log(sessionList);
  renderSessions();
};
//日期切换渲染场次
date.addEventListener('change', async function (e) {
  try {
    let sessionRes = await ajax({
      url: 'http://egg.flower.dbice.cn/api/session',
      data: {
        //option.value
        timeId: e.target.value,
      },
      headers: {
        'x-token': userData.token,
      },
    });
    // console.log(e.target);
    sessionList = sessionRes.data;
    renderSessions();
  } catch (error) {
    console.log(error);
  }
});

//场次预约
session.addEventListener('touchend', async function (e) {
  try {
    let id = e.target.dataset.id;
    // console.log(e.target);
    if (!id || !e.target.dataset.status) return;

    let appointment = await ajax({
      url: `http://egg.flower.dbice.cn/api/appointment/${userData.id}`,
      method: 'PUT',
      data: {
        sessionId: id,
        isAppointment: '1',
      },
      headers: {
        'x-token': userData.token,
      },
    });
    console.log(appointment);
    sessionStorage.setItem('appointment', JSON.stringify(appointment.data));
    $toast('预约成功', 2000);

    setTimeout(function () {
      location.href = './appointment.html';
    }, 2000);
  } catch (error) {
    console.log(error);
    $toast(error.msg, 2000);
  }
});
//渲染日期
function renderDate() {
  for (let v of dateList) {
    let oOption = document.createElement('option');
    oOption.value = v.id;
    oOption.innerText = dateTime(v.time);
    date.appendChild(oOption);
  }
}

//渲染场次
function renderSessions() {
  session.innerHTML = '';
  for (let v of sessionList) {
    let oLi = document.createElement('li');
    oLi.innerHTML = `
    <p >${hourTime(v['start_time'])}-${hourTime(v['end_time'])}</p>
    <p data-id="${v.id}" data-status="${v['is_appointment'] ? true : ''}">${
      v['is_appointment'] ? '可预约' : '已约满'
    }</p>`;
    session.appendChild(oLi);
  }
}
