/**
 * Signatures
 * @author ADAPEI de la Meuse
 */
const RELEASE = "2.1.8"
console.log("Signatures v " + RELEASE);
document.getElementById("appRelease").innerText = RELEASE;

// items présents dans le formulaire (item + "Input" / item + "Output")
const ITEMS = [
  "name",
  "surname",
  "orgTitle",
  "organisation",
  "email",
  "domain",
  "phone",
  "mobile",
  "pole"
];

const SEPARATOR_COLORS = {
  ADAPEI: "#e6b000",
  DIOCESE: "#0b4a6d",
  IDEASLAB: "#1E4E5F"
};

const DEFAULT_IMG_PATH = "img/logos/";

/**
 * hidden -  cache(true) le pole de la liste
 * domaine - permet de selectionner automatiquement le pole en fonction du domaine que l'utilisateur aura rentré dans le champ
 * color - permet de redéfinir la couleur du séparateur de la signature
 * src - DEFAULT_IMG_PATH + src -> Source du logo à afficher
 */
const POLES_ARRAY = [
  adapei = { lib: "Adapei de la Meuse", color : SEPARATOR_COLORS.ADAPEI, src:  "adapei.png"},
  adapei60 = { lib: "[60 ans] Adapei de la Meuse", color : SEPARATOR_COLORS.ADAPEI, src:  "60ans.jpg"},
  retroActif = { lib: "Les rétro actifs", color : SEPARATOR_COLORS.ADAPEI, src:  "retroActif.png"},
  meuseInsertion = { lib: "Meuse Insertion", color : SEPARATOR_COLORS.ADAPEI, src: "meuseInsertion.png"},
  adultesDependants = { lib: "Pôle Adultes Dépendants", color : SEPARATOR_COLORS.ADAPEI, src:  "adultesDependants.png"},
  agricole = { lib: "Pôle Agricole", color : SEPARATOR_COLORS.ADAPEI, src:  "agricole.png"},
  enfance = { lib: "Pôle Enfance", color : SEPARATOR_COLORS.ADAPEI, src: "enfance.png"},
  habitat = { lib: "Pôle Habitat", color : SEPARATOR_COLORS.ADAPEI, src:  "habitat.png"},
  industriel = { lib: "Pôle Industriel", color : SEPARATOR_COLORS.ADAPEI, src: "industriel.png"},
  mobiMeuse = { lib: "Mobi'Meuse", color: SEPARATOR_COLORS.ADAPEI, src: "mobimeuse.png" },
  abri = { lib: "Abri des Pèlerins", color: SEPARATOR_COLORS.ADAPEI, src: "abri.png" },
  pairactifs = { lib: "Pairs'Actifs", color: SEPARATOR_COLORS.DIOCESE, src :"pairsactifs.png"},
  diocese = { lib: "Diocèse", color : SEPARATOR_COLORS.DIOCESE, src:  "diocese.png", hidden: true, domaine: "@catholique55.fr"},
  mda = { lib: "Maison des Adolescents", color : SEPARATOR_COLORS.DIOCESE, src:  "mda.jpg", hidden: true, domaine: "@mda55.fr"},
  amseaa = { lib: "AMSEAA", color : SEPARATOR_COLORS.ADAPEI, src:  "amseaa.jpg", hidden: true, domaine: "@amseaa.fr"},
  ideaslab = { lib: "Ideas Lab", color : SEPARATOR_COLORS.IDEASLAB, src: "ideaslab.png", hidden: true, domaine: "@ideas-lab.tech"},
  handicoeur = { lib: "Handi Coeur", color : SEPARATOR_COLORS.ADAPEI, src:  "handicoeur.jpg", hidden: true, domaine: "@caph-handicoeur.fr"},
  amie55 = { lib: "amie55", color : SEPARATOR_COLORS.ADAPEI, src:  "amie55.jpg", hidden: true, domaine: "@amie55.com"},

// Utilisé pour la selection de l'icone.
var poleInput = document.getElementById("poleInput");

// Checkboxes
var checkMobileInput = document.getElementById("checkMobileInput");
var checkPhoneInput = document.getElementById("checkPhoneInput");

// Désactivation de l'envoi par défaut du formulaire
document.getElementById("inputForm").addEventListener("submit", (e) => e.preventDefault());

// Remplissage du Select
POLES_ARRAY.forEach((pole, index) => {
  let option = addOptionToSelect(poleInput, index, pole.lib);
  if(pole.hidden) {
    hideOption(option);
  }
});

// Binding d'evenement "change" sur les elements du tableau
ITEMS.forEach(item => {
  // Le champ de saisie
  let input = item + "Input";
  // La cible pour l'affichage
  let output = item + "Output";

  document.getElementById(input).addEventListener("change", (e) =>
    displayInputToOutput(e.target, document.getElementById(output))
  );
});

checkMobileInput.addEventListener("change", function(){
  displayNone(document.getElementById("liMobile"));
  updateImageOutput();
});

checkPhoneInput.addEventListener("change", function(){
  displayNone(document.getElementById("liPhone"));
  updateImageOutput();
});

/**
 * 
 * @param {HTMLLIElement} liElement 
 */
function displayNone(liElement){
  liElement.getAttribute("class") === "d-none" ? liElement.setAttribute("class", "d-flex align-items-center") : liElement.setAttribute("class", "d-none");
}

/**
 * Affichage de l'input dans la cible (Image ou texte)
 * @param {HTMLFormElement} input 
 * @param {HTMLElement} output 
 */
function displayInputToOutput(input, output){
  // l'input est vide
  if(!input.value) return;
  if(output.id === "nameOutput" || output.id === "surnameOutput"){
    output.innerText = input.value;
    champEmail = document.getElementById("emailInput")
    champEmail.value = prenomNomToEmail(document.getElementById("nameInput").value, document.getElementById("surnameInput").value);
    champEmail.dispatchEvent(new Event("change"));
  }
  // l'output est une image
  else if(output.nodeName === "IMG"){
    output.src = DEFAULT_IMG_PATH + POLES_ARRAY[input.value].src;
    output.crossOrigin = 'anonymous';
    setSeparatorBorderColor(document.getElementById("separator"), POLES_ARRAY[input.value].color);
  } else {
    
    if(input.id === "domainInput"){
      output.innerText = input.value.toLowerCase();
      selectPoleFromDomaine(input);
    } else {
      output.innerText = input.value;
    }
  }
  // Update de l'image
  updateImageOutput();
}

/**
 * Met à jour l'image de sortie ainsi que son lien de téléchargement
 */
function updateImageOutput(){
  window.scrollTo(0,0);
  html2canvas(document.getElementById("outputCard"), {scale: 0.85}).then(function (canvas){
    lien = canvas.toDataURL("image/jpeg");
    lienSignature = document.getElementById("lienSignature");
    document.getElementById("signatureOutput").src=lien;
    lienSignature.href=lien;
    lienSignature.download=document.getElementById("nameInput").value + "_" + document.getElementById("surnameInput").value + ".jpg";
  });
}

/**
 * Défini la propriété bordercolor sur l'élément separator
 * @param {HTMLDivElement} separator Séparateur logo -> texte
 * @param {String} color code couleur à définir
 */
function setSeparatorBorderColor(separator, color){
  separator.style.borderColor = color;
}

/**
 * Si le domaine est changé -> Check dans le tableau des poles si une entrée correspond.
 * Si c'est le cas -> on change la value du select et on trigger l'evenement change
 * @param {HTMLFormElement} input 
 */
function selectPoleFromDomaine(input){
  POLES_ARRAY.forEach((pole, i) => {
    if(input.value === pole.domaine){
      selectValue(poleInput, i);
    }
  });
}

/**
 * Ajoute une option (valeur + texte) au select
 * @param {HTMLSelectElement} select selectElement dans le quel on doit ajouter l'option
 * @param {String} optionValue 
 * @param {String} optionText 
 */
function addOptionToSelect(select, optionValue, optionText){
  let option = document.createElement('option');
  option.appendChild(document.createTextNode(optionText));
  option.value = optionValue;
  select.appendChild(option);
  return option;
}

/**
 * Empêche l'affichage de l'option dans un select
 * @param {HTMLOptionElement} option 
 */
function hideOption(option){
  option.hidden = true;
}

/**
 * Selectionne la valeur dans un select et déclanche l'évenement
 * @param {HTMLSelectElement} select 
 * @param {String} value
 */
function selectValue(select, value){
  select.value = value;
  select.dispatchEvent(new Event('change'));
}

/**
 * 
 * @param {String} prenom 
 * @param {String} nom 
 */
function prenomNomToEmail(prenom, nom){
  return prenom.toLowerCase()[0] + '.' + nom.toLowerCase();
}
