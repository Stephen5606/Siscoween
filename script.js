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

