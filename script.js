let allSeminarsArray = []

const directionData = document.querySelector('#directionData')
const directionNumber = document.querySelector('#directionNumber')
const participantNumber = document.querySelector('#participantNumber')
const directionButton = document.querySelector('#directionButton')
const seminarData = document.querySelector('#seminarData')

const seminarFacture = document.querySelector('#seminarFacture')
const seminarDate = document.querySelector('#seminarDate')
const seminarParticipantNumber = document.querySelector('#seminarParticipantNumber')
const seminarDiference = document.querySelector('#seminarDiference')
const seminarCity = document.querySelector('#seminarCity')
const seminarButton = document.querySelector('#seminarButton')

const saveBtnToLS = document.querySelector('#saveBtnToLS')
const emailInput = document.querySelector('#emailInput')
const sendMail = document.querySelector('#sendMail')

window.addEventListener('load', () => {
    if (localStorage.getItem("seminari") === null) {
        allSeminarsArray = []
    } else {
        allSeminarsArray = JSON.parse(localStorage.getItem("seminari"))
        createSeminarsTableBody()
    }
  })

directionButton.addEventListener('click', ()=> {
    if (!participantNumber.value){
        alert('You must enter participants number')
    } else if (!directionNumber.value) {
        alert('You must enter office number')
    } else {
        let newDirection = document.createElement('div')
        let dirContent = document.createElement('p')
        dirContent.innerHTML = `<span id='dirNumber'>${directionNumber.value}</span>-<span id='dirParticipantNumber'>${participantNumber.value}</span>`
        dirContent.classList.add('newDirectionContent')
        let closeBtn = document.createElement('p')
        closeBtn.id = 'deleteDirection'
        closeBtn.innerHTML = '&#10008'
        closeBtn.classList.add('newDirectionContent', 'remove-dir')
        closeBtn.addEventListener("click", removeSelf);
        newDirection.append(dirContent, closeBtn)
        seminarData.appendChild(newDirection)
        directionNumber.focus()

        const allParticipants = document.querySelectorAll('#dirParticipantNumber')
        const allParticipantsTogether = []
        for (let i = 0; i < allParticipants.length; i++) {
            allParticipantsTogether.push(parseInt(allParticipants[i].innerHTML))     
            newDirection.id = i 
            newDirection.classList.add('dir') 
            allParticipantsArray =  allParticipantsTogether             
        }        
        function countAll(total, num) {
            return total + num;
        }
        seminarParticipantNumber.value = allParticipantsArray.reduce(countAll)
        seminarDiference.value = (allParticipantsArray.reduce(countAll) * 2950) - seminarFacture.value - (allParticipantsArray.reduce(countAll) * 400)
        
    }

    function removeSelf() {
            
        let child = this.parentElement;
        let parent = this.parentElement.parentElement;
        let curentIndex = parseInt(Array.prototype.indexOf.call(parent.children, child)) - 2  //nalazenje trenutnog indexa this u odnosu na parent,-2 je jer ima dva div-a pre ovih div-ova koje dodajemo i brisemo manuelno
        
        allParticipantsArray.splice(curentIndex, 1)

        if (allParticipantsArray.length === 0) {
            seminarParticipantNumber.value = 0
            seminarDiference.value = 0
        } else {
            seminarParticipantNumber.value = allParticipantsArray.reduce(countAll)
            seminarDiference.value = (allParticipantsArray.reduce(countAll) * 2950) - seminarFacture.value - (allParticipantsArray.reduce(countAll) * 400)
        }
        this.parentElement.remove()  
    }

    seminarFacture.addEventListener('keyup', factureChange)
    function factureChange() {
        seminarDiference.value = (allParticipantsArray.reduce(countAll) * 2950) - seminarFacture.value - (allParticipantsArray.reduce(countAll) * 400)
    }
})

//clear inputs - pozivamo je na klik 'Snimi seminar button'
function clearInputs() {
    directionNumber.value = ''
    participantNumber.value = ''
    seminarFacture.value = 0
    seminarDate.value = ''
    seminarParticipantNumber.value = 0
    seminarDiference.value = 0
    seminarCity.value = ''
    const dirDiv = document.querySelectorAll('.dir')
    for (let i = 0; i < dirDiv.length; i++) {
           dirDiv[i].remove()
    }
}
//snimanje seminara
function saveSeminar() {
   var seminarAllDir = []
   const dirDiv = document.querySelectorAll('.dir')
   for (let i = 0; i < dirDiv.length; i++) {      
        seminarAllDir.push(dirDiv[i].children[0].children[0].innerHTML + '-' + dirDiv[i].children[0].children[1].innerHTML)  
   }

   var Sem = {
        date: seminarDate.value,
        city: seminarCity.value,
        facture: seminarFacture.value,
        number: seminarParticipantNumber.value,
        difernce: seminarDiference.value,
        directions: seminarAllDir
    }

  allSeminarsArray.push(Sem)
  clearInputs()
  createSeminarsTableBody()
  saveBtnToLS.style.display = 'inline-block'
}

seminarButton.addEventListener('click', saveSeminar)


//funkcije za kreiranje table body iz array "allSeminarsArray" - pozivamo je na klik 'Snimi seminar' button i brisanje iz tabele
function createSeminarsTableBody() {
    let seminarAccounts = ''
    for (let i = 0; i < allSeminarsArray.length; i++) {
        const account = allSeminarsArray[i]
        
        seminarAccounts +=`
        <tr id=${i}>
        <td>${account.date}</td>
        <td>${account.city}</td>
        <td>${account.facture}</td>
        <td>${account.number}</td>
        <td>${account.difernce}</td>
        <td>${account.directions}</td>
        <td><button class="delete-account" id=${i}>Delete</button></td>
    </tr>
        `
    }
    allSeminarsTableBody.innerHTML = seminarAccounts

    
    const allDelBtns = document.querySelectorAll('.delete-account')
    for (let i = 0; i < allDelBtns.length; i++) {
        allDelBtns[i].addEventListener('click', deleteAccount)
        
    }    
}

function deleteAccount() {
    let confirmDelete = confirm("Do you really want to delete this seminar?");
    if (confirmDelete) {
        let clickedIndex = parseInt(Array.prototype.indexOf.call(this.parentElement.parentElement.parentElement.children, this.parentElement.parentElement)) //nalazenje trenutnog indexa this u odnosu na parent
        allSeminarsArray.splice(clickedIndex, 1)
        createSeminarsTableBody()
        saveBtnToLS.style.display = 'inline-block'
    } else {
        alert('The seminar was not deleted')
    }
  }

//snimi u local storage
saveBtnToLS.addEventListener('click', saveToLS)
function saveToLS() {
    if (allSeminarsArray.length === 0) {
        localStorage.removeItem('seminari')
        saveBtnToLS.style.display = 'none'
        alert('All deleted from local storage')
    } else {
        localStorage.setItem('seminari', JSON.stringify(allSeminarsArray));
        saveBtnToLS.style.display = 'none'
        alert('Saved in local storage')
    }
}

//posalji mail
emailInput.addEventListener('focusin', mailFunction )
async function mailFunction() {
    let emailText = []
    for (let i = 0; i < allSeminarsArray.length; i++) {
        mailContent =  allSeminarsArray[i].city + ' '  + allSeminarsArray[i].date + ' - Monetary difference: ' + allSeminarsArray[i].difernce + ' rsd (Number of participants: ' + allSeminarsArray[i].number + ' / Invoice: ' + allSeminarsArray[i].facture + ' rsd / Offices: ' + allSeminarsArray[i].directions + ')' + '%0D%0A'
        emailText.push(mailContent)
    }  
    sendMail.style.display = 'inline-block'
    sendMail.addEventListener('click', mailBtnClick)
    function mailBtnClick() {
        sendMail.href =`mailto:${emailInput.value}?subject=Seminari&body=${emailText}`
        sendMail.style.display = 'none'
    }
}
