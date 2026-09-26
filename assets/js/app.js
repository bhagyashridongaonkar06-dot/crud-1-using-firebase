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

let base_url = 'https://bhagyashri-s-first-database-default-rtdb.firebaseio.com'
let std_url = `${base_url}/students.json`

let studentArr = [];

function snackbar(msg, icon) {
    Swal.fire({
        title: msg,
        icon: icon,
        timer: 3000
    })
}
function hideSpinner() {
    spinner.classList.add('d-none')
}

function showSpinner() {
    spinner.classList.remove('d-none')
}

function onSubmit(eve) {
    showSpinner()
    eve.preventDefault();

    let newStud = {
        fname: fname.value,
        lname: lname.value,
        email: email.value,
        contact: contact.value
    }
    studForm.reset()

    // studentArr(newStud)
    let xhr = new XMLHttpRequest();

    xhr.open('POST', std_url, true)

    xhr.send(JSON.stringify(newStud))

    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status <= 299) {
            let res = JSON.parse(xhr.response)
            console.log(res)
            let tr = document.createElement('tr')
            tr.id = res.name
            tr.innerHTML = `    <td>${newStud.length}</td>
                                <td>${newStud.fname}</td>
                                <td>${newStud.lname}</td>
                                <td>${newStud.email}</td>
                                <td>${newStud.contact}</td>
                                <td><button onClick="onEditStudent(this)" class="btn btn-block btn-success text-white"><i class="fa-regular fa-pen-to-square fa-2x"></i></button></td>
                                <td><button onClick="onRemoveStudent(this)" class="btn btn-block btn-danger text-white"><i class="fa-solid fa-trash fa-2x"></i></button></td>`
            studentContainer.prepend(tr)

            let srNo = document.querySelectorAll('#studentContainer tr td:first-child')
            srNo.forEach((e, i) => { e.innerText = i + 1 })
            snackbar(`New student with name ${newStud.fname} ${newStud.lname} added successfully`, 'success')
        } else {
            cl('ERROR')
        }
        hideSpinner()
    }

}

//read
function oncreatestdList(arr) {
    let result = ``

    arr.forEach((ele, i) => {


        result += `
            <tr id="${ele.id}">
                <td>${i + 1}</td>
                <td>${ele.fname}</td>
                <td>${ele.lname}</td>
                <td>${ele.email}</td>
                <td>${ele.contact}</td>
                <td><button onClick="onEditStudent(this)"  class="btn btn-block btn-success text-white"><i class="fa-regular fa-pen-to-square fa-2x"></i></button></td>
                <td><button onClick="onRemoveStudent(this)"  class="btn btn-block btn-danger text-white"><i class="fa-solid fa-trash fa-2x"></i></button></td>
            </tr>`
    })
    studentContainer.innerHTML = result
    //hello     
}



//=================================== Edit ==========================================
function onEditStudent(ele) {
    let EDIT_ID = ele.closest("tr").id;
    let EDIT_URL = `${base_url}/students/${EDIT_ID}.json`
    
    let xhr = new XMLHttpRequest();

    xhr.open("GET", EDIT_URL);
    xhr.send(null);
    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status <= 299) {
            let res = JSON.parse(xhr.response);

            //Patching Data
            fname.value = res.fname;
            lname.value = res.lname;
            email.value = res.email;
            contact.value = res.contact;

            localStorage.setItem("EDIT_ID", EDIT_ID)

            addStd.classList.add("d-none")
            updateStd.classList.remove("d-none")
        }
        else {
            cl("Something went wrong")
        }
    }

}

//=================================== Delete ==========================================
function onRemoveStudent(ele) {
    let DELETE_ID = ele.closest("tr").id;
    
    let DELETE_URL = `${base_url}/students/${DELETE_ID}.json`
    
    
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        showSpinner()
        if (result.isConfirmed) {

            let xhr = new XMLHttpRequest();
            xhr.open("DELETE", DELETE_URL);
            xhr.send(null);
            xhr.onload = function () {
                if (xhr.status >= 200 && xhr.status <= 299) {
                    let res = JSON.parse(xhr.response);
                    snackbar(`student with id ${DELETE_ID} deleted successfully`, 'success')
                    ele.closest("tr").remove();
                    let tds = document.querySelectorAll('#studentContainer tr td:first-child')
                    tds.forEach((e, i) => { e.innerText = i + 1 })

                }
                else {
                    cl("Something went wrong")
                }
                hideSpinner()
            }
            xhr.onerror = function(){
                hideSpinner()
            }
        }
    });

}















function readStd() {
    let xhr = new XMLHttpRequest()

    xhr.open("GET", std_url, true)

    xhr.send(null)

    xhr.onload = function () {
        if (xhr.status === 200) {
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
        } else {
            cl("ERROR")
        }
    }
}
readStd(studentArr)
cl(studentArr)





function onUpdate() {
    showSpinner()
    let update_id = localStorage.getItem('EDIT_ID')
    // cl(update_id)
    let update_url = `${base_url}/students/${update_id}.json`
    let updateObj = {
        fname: fname.value,
        lname: lname.value,
        email: email.value,
        contact: contact.value,
        id: update_id
    }

    studForm.reset()

    let xhr = new XMLHttpRequest();

    xhr.open('PATCH', update_url, true)

    xhr.send(JSON.stringify(updateObj))

    xhr.onload = function () {


        if (xhr.status >= 200 && xhr.status <= 299) {

            let data = JSON.parse(xhr.response)


            let tds = document.getElementById(update_id).children;
            tds[1].innerHTML = data.fname
            tds[2].innerHTML = data.lname
            tds[3].innerHTML = data.email
            tds[4].innerHTML = data.contact

            snackbar(`student with name ${updateObj.fname}   ${updateObj.lname} updated successfully`, 'success')


            addStd.classList.remove('d-none')
            updateStd.classList.add('d-none')
        } else {
            cl('ERROR')
        }
        hideSpinner()
    }
}


studForm.addEventListener('submit', onSubmit)
updateStd.addEventListener('click', onUpdate)    
