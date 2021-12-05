import ajax from '../js/ajax-promise.js';
import { debounce } from '../js/tools.js';

let appoint = document.querySelector('.btnBox .appoint');
let myAppoint = document.querySelector('.btnBox .myAppoint');

const vertify = {
  name(v) {
    return /^[a-z0-9]+$/i.test(v);
  },
  phone(v) {
    return /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/.test(
      v
    );
  },
  idCard(v) {
    return /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/.test(
      v
    );
  },
};

const formRes = {
  name: false,
  phone: false,
  idCard: false,
};
//表单验证
form.name.addEventListener(
  'keyup',
  debounce(function () {
    let res = vertify.name(this.value);
    formRes.name = res;

    this.nextElementSibling.innerText = res ? `姓名正确` : `你的输入有误`;
    this.nextElementSibling.style.color = res ? `green` : `red`;

    // vertify.name(this.value)?this.nextElementSibling.innerText
    // console.log();
  }, 600)
);
form.phone.addEventListener(
  'keyup',
  debounce(function () {
    let res = vertify.phone(this.value);
    formRes.phone = res;
    this.nextElementSibling.innerText = res ? `电话号正确` : `你的输入有误`;
    this.nextElementSibling.style.color = res ? `green` : `red`;
  }, 600)
);
form.idCard.addEventListener(
  'keyup',
  debounce(function () {
    let res = vertify.idCard(this.value);
    formRes.idCard = res;
    this.nextElementSibling.innerText = res ? `身份证号码正确` : `你的输入有误`;
    this.nextElementSibling.style.color = res ? `green` : `red`;
  }, 600)
);
//获取验证码
form.getCode.addEventListener('click', async function () {
  if (this.disabled) return;
  if (!form.phone.value || !formRes.phone) {
    this.nextElementSibling.innerText = `你的输入有误`;
    this.nextElementSibling.style.color = `red`;
    return;
  }

  this.nextElementSibling.innerText = ``;
  this.nextElementSibling.style.color = `red`;

  try {
    let codeRes = await ajax({
      url: 'http://egg.flower.dbice.cn/api/sms',
      data: {
        phone: form.phone.value,
      },
    });
    // console.log(this);
    form.code.value = codeRes.data.code;
    this.innerText = '验证码已发送';
    this.disabled = true;
    setTimeout(() => {
      this.innerText = '再次发送';
      this.disabled = false;
    }, 8000);
  } catch (error) {
    console.log(error);
  }
});

//开始预约
appoint.addEventListener('touchend', async function () {
  // for (let v of formRes) {
  //   console.log(v);
  // }
  for (let k in formRes) {
    if (!formRes[k] && !form.code.value) return console.log('输入有误');
  }
  try {
    let registerRes = await ajax({
      url: 'http://egg.flower.dbice.cn/api/register',
      method: 'POST',
      data: {
        name: form.name.value,
        phone: form.phone.value,
        code: form.code.value,
        idCard: form.idCard.value,
      },
    });

    // console.log(registerRes);
  } catch (error) {
    if (error.code != 409) {
      return console.log(error);
    }
    // console.log(error);
  }

  try {
    let loginRes = await ajax({
      url: 'http://egg.flower.dbice.cn/api/login',
      method: 'POST',
      data: {
        name: form.name.value,
        phone: form.phone.value,
        idCard: form.idCard.value,
      },
    });

    // console.log(loginRes);
    localStorage.setItem('userData', JSON.stringify(loginRes.data));
    location.href = './session.html';
  } catch (error) {
    console.log(error);
  }
});
//我的预约
// appoint.addEventListener('touchend', function () {

// });
