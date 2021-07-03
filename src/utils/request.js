// const encrypt = require('./crypto');
const axios = require('axios');
const queryString = require('querystring');
const encrypt = require('./crypto');

const createRequest = (data, url, option) => new Promise((resolve, reject) => {
  // 设置请求头
  const header = {
    Referer: 'https://music.163.com',
    Cookie: global.cookie || option.cookie || '',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.72 Safari/537.36 Edg/90.0.818.41',
  };
  // 设置 axios 的参数
  const config = {
    method: option.method || 'post',
    url,
    headers: header,
  };
  let encryptedData;
  switch (option.api) {
    case 'eapi':
      const header = {
        osver: undefined,
        deviceID: undefined,
        appver: '8.0.0',
        versioncode: '140',
        mobilename: undefined,
        buildver: Date.now().toString().substr(0, 10),
        resolution: '1920*1080',
        __csrf: '',
        os: 'pc',
        channel: undefined,
        requestId: `${Date.now()}_${Math.floor(Math.random() * 1000)
          .toString()
          .padStart(4, '0')}`,
      };
      // data.header = header;
      encryptedData = encrypt.eapi(data, option.url);
      console.log(encryptedData);
      break;
    case 'api':
      // encryptedData = queryString.stringify(data);
      encryptedData = data;
      console.log(typeof data);
      break;
    default:
    { encryptedData = encrypt.weapi(data); }
  }
  config.data = queryString.stringify(encryptedData);
  console.log(config);
  axios(config)
    .then((response) => {
      console.log(response);
      const answer = { data: response.data };
      if (response.headers['set-cookie']) {
        console.log(response.headers['set-cookie']);
        answer.cookie = response.headers['set-cookie'];
      }
      console.log(data);
      console.log(response.data);
      resolve(answer);
    })
    .catch((response) => {
      const answer = { data: response.data };
      reject(answer);
    });
});
module.exports = createRequest;
