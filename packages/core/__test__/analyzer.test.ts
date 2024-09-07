import { describe, expect, it } from 'vitest';
import { createAnalyzerManager } from '../src';

const analyzerManager = createAnalyzerManager();

describe('analyzer', () => {
  it('CSS', async () => {
    const content = await analyzerManager.getString('.box1 .box2@text', '<div class="box1"><div class="box2">content</div></div>');
    expect(content).toEqual('content');
  });

  it('JSONPath', async () => {
    const body =
      '{"firstName":"John","lastName":"doe","age":26,"address":{"streetAddress":"naist street","city":"Nara","postalCode":"123-456"},"phoneNumbers":[{"type":"iPhone","number":"0123-4567-8888"},{"type":"home","number":"0123-4567-8910"}]}';
    const content = await analyzerManager.getString('$.phoneNumbers[:1].type', body);
    expect(content).toEqual('iPhone');
  });

  it('XPath', async () => {
    const body = '<div class="box1"><div class="box2">content2</div><div class="box3">content3</div></div>';
    const content = await analyzerManager.getString('//*[@class="box3"]/text()', body);
    expect(content).toEqual('content3');
  });

  it('JS', async () => {
    const body = '{"a": "c"}';
    const content = await analyzerManager.getString('@js:JSON.parse(result).a', body);
    expect(content).toEqual('c');
  });

  it('JS ES6', async () => {
    const body = '{"a": "c"}';
    const content = await analyzerManager.getString('@js:(() => JSON.parse(result).a)()', body);
    expect(content).toEqual('c');
  });

  it('JS async', async () => {
    const body = '{"a": "c"}';
    const content = await analyzerManager.getString('@js:(async () => JSON.parse(result).a)()', body);
    expect(content).toEqual('c');
  });

  it('JS Promise', async () => {
    const body = '{"a": "c"}';
    const content = await analyzerManager.getString('@js:(() => new Promise(c =>{c(JSON.parse(result).a)}))()', body);
    expect(content).toEqual('c');
  });

  it('JS fetch', async () => {
    const body = '';
    const rule = '@js:typeof fetch';
    const content = await analyzerManager.getString(rule, body);
    expect(content).toEqual('function');
  });

  it('JS cheerio', async () => {
    const body = '<h2 class="title">Hello world</h2>';
    const rule = `@js:(() => cheerio.load(result)('h2.title').text())()`;
    const content = await analyzerManager.getString(rule, body);
    expect(content).toEqual('Hello world');
  });

  it('JS xpath', async () => {
    const body = '<div class="box1"><div class="box2">content2</div><div class="box3">content3</div></div>';
    const rule = `@js:(async() => {
  return await xpath(result, '//*[@class="box3"]/text()')
})()
    `;
    const content = await analyzerManager.getString(rule, body);
    expect(content).toEqual('content3');
  });

  it('JSONPath + CSS', async () => {
    const body = JSON.stringify({
      info: {
        body: '<div class="box1"><div class="box2">content</div></div>'
      }
    });
    const content = await analyzerManager.getString('$.info.body@css:.box1 .box2@text', body);
    expect(content).toEqual('content');
  });

  it('JS CryptoJS', async () => {
    const body = 'U2FsdGVkX1+lzrvaz1MagYswnfRUePbcwyo+fZ90+Qs=';
    const rule = '@js:CryptoJS.AES.decrypt(result, "secret key 123").toString(CryptoJS.enc.Utf8)';
    const content = await analyzerManager.getString(rule, body);
    expect(content).toEqual('hello word');
  });
});
