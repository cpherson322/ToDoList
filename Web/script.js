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
        event.target.files[0].text().then(text=>{parseXMLIntoToDoList(text)})
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
    let toDoListDocument = document.implementation.createDocument(null, "ToDoList", null)
    Array.from(document.getElementById("container").children).forEach(child => {
        let item = toDoListDocument.createElement("item")
        if (child.children[0].checked) {
            item.setAttribute("checked", "true")
        }
        item.textContent = child.children[1].innerText
        if (!child.children[1].innerText == '') {
            toDoListDocument.documentElement.appendChild(item)
        }
    })
    let serializer = new XMLSerializer()
    return serializer.serializeToString(toDoListDocument)
}

function downloadLocal() {
    let downloadElement = document.createElement("a")
    downloadElement.href = URL.createObjectURL(new Blob([serializeToDoList()], {type: "text/xml"}))
    downloadElement.download = "ToDoList.xml"
    document.body.appendChild(downloadElement)
    downloadElement.click()
    setTimeout(() => {
        URL.revokeObjectURL(downloadElement.href)
        document.body.removeChild(downloadElement)
    }, 100)
}

function parseXMLIntoToDoList(XMLString) {
    let parser = new DOMParser()
    let toDoListDocument = parser.parseFromString(XMLString, "text/xml")
    document.getElementById("container").replaceChildren([])
    Array.from(toDoListDocument.documentElement.children).forEach((child) => {
        addItem(null, null, true, child.textContent, child.getAttribute("checked"))
    })
    addItem()
}

function uploadLocal() {
    let fileGraber = document.createElement("input")
    fileGraber.type = "file"
    fileGraber.accept = "text/xml"
    fileGraber.style.display = "none"
    document.body.appendChild(fileGraber)
    fileGraber.click()
}

document.addEventListener('dragover', (event) => {
    event.preventDefault()
})

document.addEventListener('drop', (event) => {
    event.preventDefault()
    event.dataTransfer.files[0].text().then(text=>{parseXMLIntoToDoList(text)})
})

addItem()