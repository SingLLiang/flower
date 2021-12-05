const ajax = userOptions => {
  return new Promise((resolve, reject) => {
    const DEFAULT = {
      url: '',
      method: 'GET',
      type: '',
      data: {},
      headers: {},
    };

    const { url, method, data, type, headers } = Object.assign(
      {},
      DEFAULT,
      userOptions
    );

    try {
      const xhr = new XMLHttpRequest();

      if (method.toUpperCase() === 'GET') {
        let newUrl = url + '?';
        for (let key in data) {
          newUrl += `${key}=${data[key]}&`;
        }
        newUrl = newUrl.slice(0, -1);
        xhr.open('GET', newUrl, true);
        setHeaders(headers);
        xhr.send(null);
      } else {
        xhr.open(method, url, true);
        setHeaders(headers);
        if (type) {
          xhr.setRequestHeader('Content-Type', 'application/json');
          xhr.send(JSON.stringify(data));
        } else {
          xhr.setRequestHeader(
            'Content-Type',
            'application/x-www-form-urlencoded'
          );
          let postData = '';
          for (let key in data) {
            postData += `${key}=${data[key]}&`;
          }
          postData = postData.slice(0, -1);
          xhr.send(postData);
        }
      }

      xhr.addEventListener('readystatechange', () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            return resolve(JSON.parse(xhr.response));
          } else {
            return reject(JSON.parse(xhr.response));
          }
        }
      });

      //setHeaders封装
      function setHeaders(headers) {
        for (let key in headers) {
          xhr.setRequestHeader(key, headers[key]);
        }
      }
    } catch (error) {
      console.log(error);
    }
  });
};
export default ajax;
