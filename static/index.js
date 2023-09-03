const createTable = (data, render = {}, headerTitle = {}) => {
    const headers = Object.keys(data[0]).filter(key=>headerTitle[key]!==false)
    return `
      <table class="sortable">
        <thead>
            ${headers.map(key => `<th>${headerTitle[key] || key}</th>`).join('')}
        </thead>
        <tbody>
          ${data.map(row => `<tr  class="item">${headers.map(key => `<td>${render[key] ? render[key](row[key], row) : row[key]}</td>`).join('')}</tr>`).join('')}
        </tbody>
      </table>
      `
}

const openWindow = content => {
    const win = document.createElement('div')
    win.className = 'window'

    
    const winBody = document.createElement('div')
    winBody.className = 'win-body'
    
    const button = document.createElement('button')
    button.className = 'win-close-button'
    button.onclick = () => win.remove()
    button.innerText = 'Закрыть'
    
    
    win.append(winBody)
    win.append(button)
    if (typeof content === 'string') {
        winBody.innerHTML = content
    }
    else if (content instanceof Promise) {
        winBody.innerText = 'Загрузка...'
        content.then(x => {
            if (!win) return
            winBody.innerHTML = x
        })
    }
    document.body.append(win)
}

const createTableAsync = async (selector, dataPromise, tableProps, headers) => {
    const el = document.getElementById(selector)
    el.innerText = "Загрузка..."
    const data = await dataPromise
    el.innerHTML = createTable(data, tableProps, headers)
    sorttable.makeSortable(el.getElementsByTagName('table')[0]);

}
const linkToPost = (pid, text) => `<a href="https://vk.com/wall-100407134_${pid}" target="_blank">${text || pid}</a>`

google.charts.load("current", { packages: ["corechart"] });
google.charts.setOnLoadCallback(drawChart);

async function drawChart() {
    let fetched = await (await fetch('api/dailystat')).json()
    const D = fetched.map(x => [new Date(x.day), x.count])
    var data = google.visualization.arrayToDataTable([['X', 'Кол-во постов'], ...D]);

    var options = {
        title: 'Количество постов по дням:',
        height: 700,
        explorer: { actions: ['dragToZoom', 'rightClickToReset'], axis: 'horizontal', maxZoomIn: 40 },
    };

    window.chart = new google.visualization.LineChart(document.getElementById('daily-stat-chart'));
    // The select handler. Call the chart's getSelection() method
    function selectHandler() {
        var selectedItem = chart.getSelection()[0];
        const day = (fetched[selectedItem.row].day)
        const tableProps = { d: d => new Date(d * 1000).toLocaleString(), id: pid => linkToPost(pid) }
        const dataPromise = fetch('api/postsbyday/' + day).then(x => x.json())
        const headers = { l: '💗', d: '🕒', c: '💬', t: '📝' }
        createTableAsync("table-dayly-posts", dataPromise, tableProps, headers)
    }

    // Listen for the 'select' event, and call my function selectHandler() when
    // the user selects something on the chart.
    google.visualization.events.addListener(chart, 'select', selectHandler)
    chart.draw(data, options);

    // let U = await (await fetch('api/usertopposts')).json()
    // document.getElementById("table-users-top-posts").innerHTML = createTable(U, { uid: (uid, row) => `<button onclick="fetchPosts(${uid})">posts</button><a href="http://vk.com/id${uid}" target="_blank">${row.first_name} ${row.last_name}</a>` })
    const tableProps = { uid: (uid, row) => `
        <button onclick="fetchPosts(${uid})">Посты</button>
        <button onclick="fetchWords(${uid})">Слова</button>
        <a href="http://vk.com/id${uid}" target="_blank">${row.first_name} ${row.last_name}</a>
    ` }
    const dataPromise = fetch('api/usertopposts').then(x => x.json())
    createTableAsync("table-users-top-posts", dataPromise, tableProps, {first_name: false, last_name:false})
}

async function fetchWords(uid) {
    openWindow(fetch('api/getUniqUsersWords/' + uid).then(x => x.json()).then(x => (JSON.stringify(x))))
}

async function fetchPosts(uid) {

    //let data = await (await fetch('api/userposts/' + uid)).json()
    const tableProps = { d: d => new Date(d * 1000).toLocaleString(), id: pid => linkToPost(pid) }
    const dataPromise = fetch('api/userposts/' + uid).then(x => x.json())
    const headers = { l: '💗', d: '🕒', c: '💬', t: '📝' }
    createTableAsync("table-users-posts-detail", dataPromise, tableProps, headers)
    //document.getElementById("table-users-posts-detail").innerHTML = createTable(data, { d: d => new Date(d * 1000).toLocaleString(), id: pid=>linkToPost(pid) })
}

const mapUserTop = (data) => data.map(x=>({
    cnt:x.cnt,uid:x.uid,total_likes:x.total_likes,total_comments:x.total_comments,
    name: `${x.first_name} ${x.last_name}`,
    PL: (x.total_likes/x.cnt).toFixed(1),
    PC: (x.total_comments/x.cnt).toFixed(1),
    LW: Math.sqrt(x.total_likes**2+x.cnt**2).toFixed(1),
    CW: Math.sqrt(x.total_comments*x.cnt).toFixed(1),
}))

function loadPostStat() {
    const startDate = document.getElementById('startDate').value
    const endDate = document.getElementById('endDate').value
    const tableProps = { uid: (uid, row) => `
    <button onclick="fetchPosts(${uid})">Посты</button>
    <button onclick="fetchWords(${uid})">Слова</button>
    <a href="http://vk.com/id${uid}" target="_blank">${row.name}</a>
` }
const dataPromise = fetch(`api/usertopposts/${startDate}/${endDate}`).then(x => x.json().then(mapUserTop))
createTableAsync("table-users-top-posts", dataPromise, tableProps, {name: false})
}