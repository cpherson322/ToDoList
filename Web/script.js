function addItem(initElement, helpingFunc, doNotAssignListener, taskText, taskChecked) {
    if (initElement) {
        initElement.removeEventListener("input", helpingFunc)
    }
    let div = document.createElement("div")
    div.setAttribute("class", "item")
    let checkbox = document.createElement("input")
    checkbox.setAttribute("type", "checkbox")
    div.appendChild(checkbox)
    let p = document.createElement("p")
    p.contentEditable = "plaintext-only"
    if (taskChecked) {
        checkbox.checked = true
        p.contentEditable = false
        p.style.textDecoration = "line-through"
    }
    if (taskText) {
        p.innerText = taskText
    }
    if (taskText == "\n" && !taskChecked) {
        checkbox.style.outline = "2px solid red"
        checkbox.style.height = "13px"
        checkbox.style.marginTop = "19px"
    }
    div.appendChild(p)
    document.getElementById("container").appendChild(div)
    let helperFunc = function(){
        addItem(p, helperFunc)
    }
    if (!doNotAssignListener) {
        p.addEventListener("input", helperFunc)
    }  
}

document.addEventListener("change", (event) => {
    if (event.target.type == "checkbox") {
        let checkbox = event.target
        if (checkbox.checked) {
            if (checkbox.parentElement.children[1].innerHTML == "<br>") {
                checkbox.parentElement.remove()
            }
            checkbox.parentElement.style.textDecoration = "line-through"
            checkbox.parentElement.children[1].contentEditable = false
        } else {
            checkbox.parentElement.style.textDecoration = "none"
            checkbox.parentElement.children[1].contentEditable = "plaintext-only"
        }
    }
    if (event.target.type == "file") {
        event.target.files[0].text().then(text=>{parseJSONIntoToDoList(text)})
        event.target.remove()
    }
})

document.addEventListener("input", (event) => {
    if (event.target.tagName == "P") {
        if (event.target.innerHTML == "<br>") {
            event.target.parentElement.children[0].style.outline = "2px solid red"
            event.target.parentElement.children[0].style.height = "13px"
            event.target.parentElement.children[0].style.marginTop = "19px"
        } else {
            event.target.parentElement.children[0].style.outline = ""
            event.target.parentElement.children[0].style.marginTop = ""
            event.target.parentElement.children[0].style.height = "45px"
        }
    }
})

function serializeToDoList() {
    let toDolistArray = []
    Array.from(document.getElementById("container").children).forEach(child => {
        if (!child.children[1].innerText == '') {
            toDolistArray.push({
                checked: child.children[0].checked,
                text: child.children[1].innerText
            })
        }
    })
    return JSON.stringify(toDolistArray)
}

function downloadLocal() {
    let downloadElement = document.createElement("a")
    downloadElement.href = URL.createObjectURL(new Blob([serializeToDoList()], {type: "text/json"}))
    downloadElement.download = "ToDoList.json"
    document.body.appendChild(downloadElement)
    downloadElement.click()
    setTimeout(() => {
        URL.revokeObjectURL(downloadElement.href)
        document.body.removeChild(downloadElement)
    }, 100)
}

function parseJSONIntoToDoList(JSONString) {
    document.getElementById("container").replaceChildren([])
    JSON.parse(JSONString).forEach(item => {
        addItem(null, null, true, item.text, item.checked)
    })
    addItem()
}

function uploadLocal() {
    let fileGraber = document.createElement("input")
    fileGraber.type = "file"
    fileGraber.accept = "text/json"
    fileGraber.style.display = "none"
    document.body.appendChild(fileGraber)
    fileGraber.click()
}

document.addEventListener('dragover', (event) => {
    event.preventDefault()
})

document.addEventListener('drop', (event) => {
    event.preventDefault()
    event.dataTransfer.files[0].text().then(text=>{parseJSONIntoToDoList(text)})
})

addItem()

function uploadServer() {
    fetch('./api/save-list', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: serializeToDoList()
    }).then(response => {response.json().then(json => {
        console.log(json)
    })})
}

function downloadServer() {
    fetch('./api/get-list').then(response => {response.text().then(data => {
        parseJSONIntoToDoList(data)
    })})
}