import { AnalyzerManager } from '../index'

describe('analyzer', () => {
  it('CSS', async () => {
    const analyzer = new AnalyzerManager('<div class="box1"><div class="box2">content</div></div>')
    const content = analyzer.getString('.box1 .box2@text')
    expect(content).toEqual('content')
  })

  it('JSONPath', async () => {
    const analyzer = new AnalyzerManager('{"firstName":"John","lastName":"doe","age":26,"address":{"streetAddress":"naist street","city":"Nara","postalCode":"123-456"},"phoneNumbers":[{"type":"iPhone","number":"0123-4567-8888"},{"type":"home","number":"0123-4567-8910"}]}')
    const content = analyzer.getString('$.phoneNumbers[:1].type')
    expect(content).toEqual('iPhone')
  })

  it('XPath', async () => {
    const analyzer = new AnalyzerManager('<div class="box1"><div class="box2">content2</div><div class="box3">content3</div></div>')
    const content = analyzer.getString('//*[@class="box3"]/text()')
    expect(content).toEqual('content3')
  })

  it('JSONPath + CSS', async () => {
    const analyzer = new AnalyzerManager(JSON.stringify({
      info: {
        body: '<div class="box1"><div class="box2">content</div></div>',
      },
    }))
    const content = analyzer.getString('$.info.body@css:.box1 .box2@text')
    expect(content).toEqual('content')
  })
})
