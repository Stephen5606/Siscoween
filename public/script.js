const echipa = [
    {
        image: "./echipa/iza.jpeg",
        nume_prenume: "Gherghe Maria Izabela",
        varsta: "19",
        rol: "FR"
    },
    {
        image: "./echipa/ivan.jpeg",
        nume_prenume: "Ivan Eric",
        varsta: "19",
        rol: "HR"
    },
    {
        image: "./echipa/gabi.jpeg",
        nume_prenume: "Iugulescu Gabriela Teodora",
        varsta: "19",
        rol: "IP"
    },
    {
        image: "./echipa/franci.jpg",
        nume_prenume: "Francesco Strazzacappa",
        varsta: "20",
        rol: "IT Back End"
    },
    {
        image: "./echipa/alexandra.jpeg",
        nume_prenume: "Alexandra Ionila",
        varsta: "19",
        rol: "FR"
    },
    {
        image: "./echipa/chirita.jpeg",
        nume_prenume: "Chiriță Darius",
        varsta: "18",
        rol: "IP"
    },
    {
        image: "./echipa/nemes.jpeg",
        nume_prenume: "Nemes Ianis",
        varsta: "19",
        rol: "EDU"
    },
    {
        image: "./echipa/vlad_gabriela.jpeg",
        nume_prenume: "Vlad Gabriela-Iulia",
        varsta: "19",
        rol: "HR"
    },
    {
        image:"./echipa/alessia.jpeg",
        nume_prenume: "Alessia Iacomi",
        varsta: "18",
        rol: "HR"
    },
    {
        image: "./echipa/lavinia.jpeg",
        nume_prenume: "Enache Lavinia-Cosmina",
        varsta: "20",
        rol: "HR"
    },
    {
        image: "./echipa/lungu.jpeg",
        nume_prenume: "Lungu Silviu Stefan",
        varsta: "20",
        rol: "IT"
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

const mesaj = document.getElementById("mesaj");
const butonInscriere = formular.querySelector("button[type=submit]");

const raspunsuri = {};
let pas = 0;
let cod = "";

formular.addEventListener("submit", async function(e) {
    e.preventDefault();

    mesaj.textContent = "";
    butonInscriere.disabled = true;

    try {
        const raspuns = await fetch("/api/inscrieri", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                nume: formular.elements["nume"].value,
                prenume: formular.elements["prenume"].value,
                telefon: formular.elements["telefon"].value,
                email: formular.elements["email"].value,
                acord: formular.elements["acord"].checked
            })
        });
        const date = await raspuns.json();

        if (!raspuns.ok) {
            mesaj.textContent = date.mesaj;
            return;
        }

        cod = date.cod;

        const prenume = formular.elements["prenume"].value.trim();
        document.getElementById("succes-prenume").textContent = prenume;
        document.getElementById("final-prenume").textContent = prenume;

        pas = 0;
        urmatorulPopup();
    } catch (eroare) {
        mesaj.textContent = "Nu am putut trimite înscrierea. Încearcă din nou.";
    } finally {
        butonInscriere.disabled = false;
    }
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

    if (cod && Object.keys(raspunsuri).length > 0) {
        fetch("/api/inscrieri/" + cod, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(raspunsuri)
        }).catch(function() {
            mesajSucces.querySelector("p").textContent = "Înscrierea ta e salvată, dar răspunsurile la întrebări nu s-au putut trimite.";
        });
    }
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
