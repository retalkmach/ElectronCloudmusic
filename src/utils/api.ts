// const createRequest = require("./request");
import createRequest from './request';

const helloworld = () => {
  console.log('hello world');
};
export function api(id:number) {
  const data = {
    ids: `[${id}]`,
    br: 999000,
  };
  console.log(data);
  return createRequest(data, 'https://interface3.music.163.com/eapi/song/enhance/player/url', { api: 'eapi', url: '/api/song/enhance/player/url' });
}
