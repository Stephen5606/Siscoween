const echipa = [
    {
        image: "./poze/profil1.jpg",
        nume_prenume: "Andrei Lungu",
        varsta: "20",
        rol: "IP"
    },
    {
        image: "./poze/profil2.avif",
        nume_prenume: "Andrei L",
        varsta: "21",
        rol: "IT-B"
    },
    {
        image: "./poze/profil3.jpg",
        nume_prenume: "Andrei Lu",
        varsta: "22",
        rol: "FR"
    },
    {
        image: "./poze/profil4.avif",
        nume_prenume: "Andrei Lun",
        varsta: "23",
        rol: "IT-F"
    },
    {
        image: "./poze/profil5.png",
        nume_prenume: "Andrei Lung",
        varsta: "24",
        rol: "HR"
    },
    {
        image: "./poze/profil6.avif",
        nume_prenume: "Andrei ungu",
        varsta: "25",
        rol: "EDU"
    }
];

let index = 0;

const membri = document.querySelectorAll(".echipa-box .membru");
const left = document.querySelector(".buton-left");
const right = document.querySelector(".buton-right");

function updateteam() {
    membri.forEach(function(membru, pozitie) {
        const persoana = echipa[(index + pozitie) % echipa.length];
        const image = membru.querySelector("#profile");
        const nume_prenume = membru.querySelector(".nume-prenume");
        const varsta = membru.querySelector(".varsta");
        const rol = membru.querySelector(".rol");

        image.src = persoana.image;
        nume_prenume.textContent =" Nume Prenume: " + persoana.nume_prenume;
        varsta.textContent = "Vârsta: " + persoana.varsta;
        rol.textContent = "Rol: " + persoana.rol;
    });
}

left.addEventListener("click", function() {
    index = (index - 1 + echipa.length) % echipa.length;
    updateteam();
});

right.addEventListener("click", function() {
    index = (index + 1) % echipa.length;
    updateteam();
});

updateteam();

const formular = document.getElementById("formular");
const mesajSucces = document.getElementById("mesaj-succes");
const popupuri = document.querySelectorAll(".popup-intrebare");
const popupFinal = document.getElementById("popup-final");
const popupAflat = document.getElementById("popup-aflat");
const alteleBox = popupAflat.querySelector(".popup-altele");
const alteleText = alteleBox.querySelector("textarea");

const raspunsuri = {};
let pas = 0;

formular.addEventListener("submit", function(e) {
    e.preventDefault();

    const prenume = formular.elements["prenume"].value.trim();
    document.getElementById("succes-prenume").textContent = prenume;
    document.getElementById("final-prenume").textContent = prenume;

    pas = 0;
    urmatorulPopup();
});

popupAflat.addEventListener("change", function(e) {
    if (e.target.name !== "aflat") {
        return;
    }

    const altele = e.target.value === "altele";
    alteleBox.hidden = !altele;
    alteleText.disabled = !altele;

    if (altele) {
        alteleText.focus();
    }
});

function arataSucces() {
    formular.hidden = true;
    mesajSucces.hidden = false;
    mesajSucces.scrollIntoView({ behavior: "smooth", block: "center" });
}

function urmatorulPopup() {
    if (pas >= popupuri.length) {
        arataSucces();
        popupFinal.returnValue = "";
        popupFinal.showModal();
        return;
    }

    const popup = popupuri[pas];
    popup.querySelector(".popup-progres span").style.width = ((pas + 1) / popupuri.length * 100) + "%";
    popup.returnValue = "";
    popup.showModal();
}

popupuri.forEach(function(popup) {
    popup.addEventListener("close", function() {
        if (popup.returnValue !== "next" && popup.returnValue !== "skip") {
            arataSucces();
            mesajSucces.focus();
            return;
        }

        if (popup.returnValue === "next") {
            new FormData(popup.querySelector("form")).forEach(function(valoare, nume) {
                if (valoare.trim() !== "") {
                    raspunsuri[nume] = valoare.trim();
                }
            });
        }

        pas++;
        urmatorulPopup();
    });
});

popupFinal.addEventListener("close", function() {
    mesajSucces.focus();
});
