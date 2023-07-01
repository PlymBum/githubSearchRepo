const FETCH_URL = 'https://api.github.com/search/repositories'

const input=document.querySelector('.search__input')
const autocomplit=document.querySelector('.autocomplit')
const savedRepos=document.querySelector('.saved-repo__list')

let tempAutocomplit=[]

function addAutocomplitItem(el){
    const li = document.createElement('li')
    li.classList.add('autocomplit__item')
    li.textContent=el['name']
    autocomplit.insertAdjacentElement("afterbegin",li)
}

function saveRepo(el){
    const li = document.createElement('li')
    li.classList.add('saved-repo__item')

    const div = document.createElement('div')
    div.classList.add('repo__info')

    const repoName = document.createElement('span')
    repoName.textContent='Name: ' + el['name']

    const repoOwner = document.createElement('span')
    repoOwner.textContent='Owner: ' + el['owner'].login

    const repoStars = document.createElement('span')
    repoStars.textContent='Stars: ' + el['stargazers_count']

    div.insertAdjacentElement("beforeend",repoName)
    div.insertAdjacentElement("beforeend",repoOwner)
    div.insertAdjacentElement("beforeend",repoStars)

    const repoRemove = document.createElement('button')
    repoRemove.classList.add('repo__remove')

    li.insertAdjacentElement("beforeend", div)
    li.insertAdjacentElement("beforeend", repoRemove)
    savedRepos.insertAdjacentElement("beforeend", li)
}




function getRepo(url,repoName){
    return fetch(url+`?q=${repoName}`).then(responce=>{
        return responce.json()
    })
}

function showAutocomplit(data){
    
    autocomplit.replaceChildren();

    let resultCount=0

    data['total_count']>=4?resultCount=4:resultCount=data['total_count']
    if(data['total_count']) {
        for (let i=0;i<=resultCount;i++){
            addAutocomplitItem(data.items[i])
            tempAutocomplit.push(data.items[i])
        }
    }
}


function debounce(cb, interval) {
    let timer = null
    return (...args) => {
      clearTimeout(timer)
      return new Promise((resolve) => {
        timer = setTimeout(
          () => resolve(cb(...args)),
          interval)
      })
    }
  }

const debounceGetRepo = debounce(getRepo,500)

input.addEventListener('input',(e)=>{
    if (input.value!==' ') debounceGetRepo(FETCH_URL,input.value).then(data=>showAutocomplit(data))})

autocomplit.addEventListener('click', (e)=>{
    let repo = tempAutocomplit.filter(el=>el['name']===e.target.textContent)
    saveRepo(repo[0])
    input.value=''
    autocomplit.replaceChildren();

})

savedRepos.addEventListener('click', (e)=>{
    if(e.target.className==='repo__remove'){
        savedRepos.removeChild(e.target.parentNode)
    }
    
})

