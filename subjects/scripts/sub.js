// ======= DOM SELECTORS =======
const tbody = document.querySelector("#notes-area")
const loader = document.querySelector("#loader")
const filterbtn = document.querySelector("#filterbtn")
const titleName = document.querySelector("#subtitle")
const subName = document.querySelector("#sublist")
const sidebtn = document.querySelector("#sidebtn")
const sidebar = document.querySelector(".side-bar")
const closebtn = document.querySelector("#closebtn")


// ======= HANDLING SIDEBAR FUNCTIONALITY =======
sidebtn.addEventListener('click',() => {
    sidebar.classList.add('show')
})
closebtn.addEventListener('click',() => {
    sidebar.classList.remove('show')
})


// ======= CONFIG =======
const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTc_bpeqClFNxqDiNZ6kpYTTLJeQdk__L2ncSqKepNDQTQBkf2wwwTEVepFwbc-SMXu-hYbzmTE1Fc_/pub?output=csv"


// ======= GLOBAL NOTES STORAGE =======
let notesData = []


// ======= FUNCTIONS =======

//To render one row
function renderNoteRow(row){
    const tr = document.createElement('tr')
    const rowHTML =`<td>${row.subject}</td>
                <td>${row.title}</td>
                <td>${row.type}</td>
                <td><a href="${row.link}" target="_blank" rel="noopener noreferrer">Click</a></td>
                <td>${row.uploader}</td>`
    
    tr.innerHTML = rowHTML
    tbody.appendChild(tr)
}

//Function to handle edge case
function renderNoResults(){
    const tr = document.createElement('tr')
    const row ="<td colspan = 5 style='text-align : center'>No results found</td>"
    
    tr.innerHTML = row
    tbody.appendChild(tr)
}

//To apply filters
function applyfilters(notes,title,subject){
    const filtered = notes.filter( (note) => {
        const isTitleSame = title ? note.title.toLowerCase().includes(title.toLowerCase()) : true
        const isSubSame = subject ? note.subject.toLowerCase().includes(subject.toLowerCase()) : true

        return isTitleSame && isSubSame
    })

    return filtered
}

//Function to fetch data and render
async function loadNotes(url) {
    try{
        loader.style.display = 'block';
        const csvData = await fetch(url);
        const rawData = await csvData.text();
        const lines = rawData.trim().split('\n').slice(1);

        notesData = lines.map( (line) => {
            const attr = line.split(',').slice(1)
            return{
                subject : attr[0],
                title : attr[1],
                type : attr[2],
                link : attr[3],
                uploader : attr[4]
            }
        })

        //Rendering all notes
        notesData.forEach((note) => renderNoteRow(note))

        // To handle filtration of notes
        filterbtn.addEventListener('click', () => {
            const subject = subName.value
            const title = titleName.value
            
            tbody.innerHTML = ""
            if(subject === ''){
                notesData.forEach( (note) => renderNoteRow(note))
            }else{
                const notesToRender = applyfilters(notesData,title,subject)

                if(notesToRender.length === 0){
                    renderNoResults()
                }else{
                    notesToRender.forEach( (note) => renderNoteRow(note))
                }
            }
        })
        
    }
    catch(error){
        console.log(error);
    }
    finally{
        loader.style.display = 'none';
    }
}

// ======= INITIALIZE =======
loadNotes(sheetURL);


