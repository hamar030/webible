import YAML from 'yaml'

export class Book {
  #Name: string
  //#ShortName: string
  //#Url: string
  //#Language: string
  //#Description: string

  private constructor(data) {
    this.#Name = data.name
  }
  Name
  getCurrent() {
    return ''
  }

  static async initialize(dataUrl: string) {
    try {
      const data = YAML.parse(await (await (await fetch(dataUrl)).blob()).text()).book_list
      return new Book(data)

      if (localStorage.getItem('webibleCurrentData') == null) {
        localStorage.setItem('webibleCurrentData', JSON.stringify(currentData))
      } else {
        let localData = JSON.parse(localStorage.getItem('webibleCurrentData'))
        currentData.book = localData.book
        currentData.part = localData.part
        currentData.script = localData.script
        currentData.chapter = localData.chapter
        currentData.verses = localData.verses
      }
    } catch (error) {
      console.error('bookInit: E[${error}]')
    }
  }
}
