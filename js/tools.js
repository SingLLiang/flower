/* 节流 */
function throttle(fn, delay) {
  let lock = true;
  return function () {
    if (!lock) return;
    lock = false;
    setTimeout(function () {
      fn.apply(this, arguments);
      lock = true;
    }, delay);
  };
}

/* 防抖 */
function debounce(fn, delay) {
  let timer = null;
  return function () {
    timer && clearTimeout(timer);
    timer = setTimeout(fn.bind(this, arguments), delay);
  };
}

/* 转换年月日 */
function dateTime(timestamp) {
  let date = new Date(Number(timestamp));
  let year = date.getFullYear();
  let month = (date.getMonth() + 1).toString().padStart(2, 0);
  let days = date.getDate().toString().padStart(2, 0);
  return `${year}年${month}月${days}日`;
}

/* 转换时分 */
function hourTime(timestamp) {
  let date = new Date(Number(timestamp));
  let hour = date.getHours().toString().padStart(2, 0);
  let min = date.getMinutes().toString().padStart(2, 0);
  return `${hour}:${min}`;
}

/* 遮罩层 */
function $toast(msg, delay) {
  let o = document.createElement('div');
  o.innerText = msg;
  o.style.position = 'fixed';
  o.style.left = '0';
  o.style.top = '0';
  o.style.zIndex = '9';
  o.style.color = '#fff';
  o.style.fontSize = '6vw';
  o.style.backgroundColor = 'rgba(0,0,0,.5)';
  o.style.width = '100vw';
  o.style.height = '100vh';
  o.style.display = 'flex';
  o.style.justifyContent = 'center';
  o.style.alignItems = 'center';
  document.body.appendChild(o);

  let timer = setTimeout(function () {
    o.remove();
  }, delay);

  o.addEventListener('touchend', function () {
    this.remove();
    clearTimeout(timer);
  });
}
export { throttle, debounce, dateTime, hourTime, $toast };
