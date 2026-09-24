const cl = console.log;

const studForm = document.getElementById('studForm')
const studentContainer = document.getElementById('studentContainer')
const fname = document.getElementById('fname')
const lname = document.getElementById('lname')
const email = document.getElementById('email')
const contact = document.getElementById('contact')
const addStd = document.getElementById('addStd')
const updateStd = document.getElementById('updateStd')
const spinner = document.getElementById('spinner')

let base_url = 'https://bhagyashri-s-first-database-default-rtdb.firebaseio.com/'
let std_url = `${base_url}/students.json`

let studentArr = [];

function snackbar(msg, icon){
    Swal.fire({
        title : msg,
        icon : icon,
        timer : 3000
    })
}
function hideSpinner(){
    spinner.classList.add('d-none')  
}

function showSpinner(){
    spinner.classList.remove('d-none')
}

function onSubmit(eve){
    eve.preventDefault();

    let newStud = {
        fname : fname.value,
        lname : lname.value,
        email : email.value,
        contact : contact.value
    }

    // studentArr(newStud)

    let xhr = new XMLHttpRequest();

    xhr.open('POST', std_url, true)

    xhr.send(JSON.stringify(newStud))

    xhr.onload = function(){
        if(xhr.status >= 200 && xhr.status <= 299){
            let res = JSON.parse(xhr.response)

            let tr = document.createElement('tr')
            tr.id = res.newStud
            tr.innerHTML = `<td>${newStud.length}</td>
                                <td>${newStud.fname}</td>
                                <td>${newStud.lname}</td>
                                <td>${newStud.email}</td>
                                <td>${newStud.contact}</td>
                                <td><button class="btn btn-block btn-success text-white"><i class="fa-regular fa-pen-to-square fa-2x"></i></button></td>
                                <td><button class="btn btn-block btn-danger text-white"><i class="fa-solid fa-trash fa-2x"></i></button></td>`
            studentContainer.prepend(tr)
        }else{
            cl('ERROR')
        }
    }
    
}

//read
function oncreatestdList(arr){
    let result = ``
    
    arr.forEach((ele,i)=>{

        
        result += `
            <tr id="${ele.id}">
                <td>${i+1}</td>
                <td>${ele.fname}</td>
                <td>${ele.lname}</td>
                <td>${ele.email}</td>
                <td>${ele.contact}</td>
                <td><button class="btn btn-block btn-success text-white"><i class="fa-regular fa-pen-to-square fa-2x"></i></button></td>
                <td><button class="btn btn-block btn-danger text-white"><i class="fa-solid fa-trash fa-2x"></i></button></td>
            </tr>`
    })
    studentContainer.innerHTML = result
    //hello
}

function readStd(){
    let xhr = new XMLHttpRequest()

    xhr.open("GET",std_url,true)

    xhr.send(null)

    xhr.onload = function(){
        if(xhr.status === 200){
            let res = JSON.parse(xhr.response)
            cl(res)
            for (const key in res) {
                // cl(key)
                res[key].id = key
                // cl(res)
                studentArr.push(res[key])
                cl(studentArr)
            }
            oncreatestdList(studentArr)
        }else{
            cl("ERROR")
        }
    }
}
readStd(studentArr)
cl(studentArr)

studForm.addEventListener('submit', onSubmit)           