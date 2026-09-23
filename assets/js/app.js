const cl = console.log;

const studForm = document.getElementById('studForm')
const studentContainer = document.getElementById('studentContainer')
const fname = document.getElementById('fname')
const lname = document.getElementById('lname')
const email = document.getElementById('email')
const contact = document.getElementById('contact')
const addStd = document.getElementById('addStd')
const updateStd = document.getElementById('updateStd')

let base_url = 'https://bhagyashri-s-first-database-default-rtdb.firebaseio.com/'
let std_url = `${base_url}/students.json`

let studentArr = [];


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
            tr.innerHTML = `    <td>${newStud.length}</td>
                                <td>${newStud.fname}</td>
                                <td>${newStud.lname}</td>
                                <td>${newStud.email}</td>
                                <td>${newStud.contact}</td>
                                <td><button onClick="onEditStudent(this)" class="btn btn-block btn-success text-white"><i class="fa-regular fa-pen-to-square fa-2x"></i></button></td>
                                <td><button onClick="onRemoveStudent(this)" class="btn btn-block btn-danger text-white"><i class="fa-solid fa-trash fa-2x"></i></button></td>`
            studentContainer.prepend(tr)
        }else{
            cl('ERROR')
        }
    }  
}

//=================================== Edit ==========================================
function onEditStudent(ele){
    let EDIT_ID = ele.closest("tr").id;
    let EDIT_URL = `${base_url}/students/${EDIT_ID}.json`
    let xhr = new XMLHttpRequest();

    xhr.open("PATCH", EDIT_URL);
    xhr.send(null);
    xhr.onload = function(){
        if(xhr.status >= 200 && xhr.status <= 299){
            let res = JSON.parse(xhr.response);

            //Patching Data
            fname.value = res.fname;
            lname.value = res.lname;
            email.value = res.email;
            contact.value = res.contact;

            localStorage.setItem("EDIT_ID",EDIT_ID)

            addStd.classList.add("d-none")
            updateStd.classList.remove("d-none")
        }
        else{
            cl("Something went wrong")
        }
    }

}

//=================================== Delete ==========================================
function onRemoveStudent(ele){
    let DELETE_ID = ele.closest("tr").id;

    let DELETE_URL = `${base_url}/students/${DELETE_ID}.json`

    let xhr = new XMLHttpRequest();
    xhr.open("DELETE", DELETE_URL);
    xhr.send(null);
    xhr.onload = function(){
        if(xhr.status >= 200 && xhr.status <= 299){
            let res = JSON.parse(xhr.response);
            ele.closest("tr").remove();
        }
        else{
            cl("Something went wrong")
        }
    }
}

studForm.addEventListener('submit', onSubmit)