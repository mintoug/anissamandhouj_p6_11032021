/*
 * VARIABLES
 */

 const btnContact = document.querySelector(".btn-contact");
 const myContactModal = document.getElementById("formContact");
 const closeBtnFrm = document.querySelector(".close-form");
 const formItems = document.querySelectorAll("input,textarea");
 
 const firstName = document.getElementById("firstName");
 const lastName = document.getElementById("lastName");
 const mail = document.getElementById("eMail");
 const message = document.getElementById("message");
 const btnSubmit = document.querySelector(".btn-submit");
 let mailReg = new RegExp(/^([\w-.]+)@((?:[\w]+\.)+)([a-zA-Z]{2,4})/i);
 let isStrReg = new RegExp(/[0-9]/g);
 
 btnContact.addEventListener("click", function(e) {
     e.preventDefault();
     openContact();
 });
        
 function openContact() {
     myContactModal.style.display= "block";
     firstName.focus();
     myContactModal.setAttribute("aria-hidden", false);
     myContactModal.setAttribute("aria-modal",true); 
     for (let item of formItems) {
         if (item.value !=null) {
             item.value = "";
         }
     }
 }
 
     
 btnSubmit.addEventListener("click",(e) => {
     e.preventDefault();
     if(frmValidation()) {
         console.log("PRENOM : " + firstName.value);
         console.log("NOM : " + lastName.value);
         console.log("EMAIL : " + mail.value);
         console.log("MESSAGE : " + message.value);
         myContactModal.style.display = "none";
     } 
     else {
         firstName.focus();
     }
 });
 
 
 closeBtnFrm.addEventListener("click", function(e) {
     e.preventDefault();
     closeFrmContact();
 });
 
 function closeFrmContact() {
     myContactModal.style.display = "none";
 }
 
 function frmValidation() {
     let valid = true;
     let valFirstName = firstName.value;
     let valLastName = lastName.value;
     let valMessage = message.value;
     let valMail = mail.value;
     let isStr_firstName, isStr_lastName;
 
     // check if there are numbers on first and last name
     (valFirstName.match(isStrReg) == null) ? isStr_firstName = 0 : isStr_firstName = valFirstName.match(isStrReg).length;
     (valLastName.match(isStrReg) == null) ? isStr_lastName = 0 : isStr_lastName = valLastName.match(isStrReg).length;
 
 
     // check by field
     if ((valFirstName == "") || (isStr_firstName > 0 ))  {
         firstName.nextElementSibling.innerHTML = "Veuillez saisir votre prénom (pas de chiffres).";
         firstName.className = "field--error";
         valid = false;
     } else {
         firstName.nextElementSibling.innerHTML = "";
         firstName.classList.remove("field--error");
     }
 
     if ((valLastName == "") || (isStr_lastName > 0 ))  {
         lastName.nextElementSibling.innerHTML = "Veuillez saisir votre nom (pas de chiffres).";
         lastName.className = "field--error";
         valid = false;
     } else {
         lastName.nextElementSibling.innerHTML = "";
         lastName.classList.remove("field--error");
     }
 
     if ((valMail=="") || (!mailReg.test(valMail)))  {
         mail.nextElementSibling.innerHTML = "Veuillez entrer une adresse mail valide.";
         mail.className = "field--error";
         valid = false;
     } else {
         mail.nextElementSibling.innerHTML = "";
         mail.classList.remove("field--error");
     }
     
     if (valMessage=="") {
         message.nextElementSibling.innerHTML = "Veuillez saisir un message pour le photographe.";
         message.className = "field--error";
         valid = false;
     } else {
         message.nextElementSibling.innerHTML = "";
         message.classList.remove("field--error");
     }
     
     return valid;
     
 }
 
 /**
  * KEYBOARD NAVIAGATION - CONFIGURATION 
  * Description :  contact form configuration 
  * Keys :
  *      >> ESCAPE : close the form
  *      >> ENTER : submit the form
  */ 
 
 window.addEventListener("keydown", function(e) {
     if(e.defaultPrevented){
         return;     // comportement par défaut inhibé
     }
     if (e.key === "Escape" || e.key === "Esc") {
         closeFrmContact();
     }  
     if (e.key === "Enter") {
         if(frmValidation()) {
             console.log("PRENOM : " + firstName.value);
             console.log("NOM : " + lastName.value);
             console.log("EMAIL : " + mail.value);
             console.log("MESSAGE : " + message.value);
             myContactModal.style.display = "none";
         } 
     } 
 });
 
 
 
 