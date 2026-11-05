const express = require("express");
const path = require("path");
const crypto = require("crypto");
const { DatabaseSync } = require("node:sqlite");

const app = express();
const port = process.env.PORT || 3000;
const db = new DatabaseSync(path.join(__dirname, "inscrieri.db"));

db.exec(`
    CREATE TABLE IF NOT EXISTS inscrieri (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cod TEXT NOT NULL UNIQUE,
        nume TEXT NOT NULL,
        prenume TEXT NOT NULL,
        telefon TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        acord INTEGER NOT NULL,
        aflat TEXT,
        aflat_altele TEXT,
        interesant TEXT,
        varsta INTEGER,
        data TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
    )
`);

const surse = ["instagram", "tiktok", "facebook", "prieteni", "facultate", "altele"];

app.use(express.json({ limit: "10kb" }));
app.use(express.static(path.join(__dirname, "public")));

function text(valoare) {
    return typeof valoare === "string" ? valoare.trim() : "";
}

app.post("/api/inscrieri", function(req, res) {
    const date = req.body || {};
    const nume = text(date.nume);
    const prenume = text(date.prenume);
    const telefon = text(date.telefon);
    const email = text(date.email).toLowerCase();

    if (!nume || !prenume || !telefon || !email) {
        return res.status(400).json({ mesaj: "Completează toate câmpurile." });
    }

    if (nume.length > 50 || prenume.length > 50) {
        return res.status(400).json({ mesaj: "Numele și prenumele pot avea maxim 50 de caractere." });
    }

    if (!/^\+?[0-9\s.\-]{9,18}$/.test(telefon)) {
        return res.status(400).json({ mesaj: "Numărul de telefon nu este valid." });
    }

    if (email.length > 100 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ mesaj: "Adresa de email nu este validă." });
    }

    if (date.acord !== true) {
        return res.status(400).json({ mesaj: "Trebuie să fii de acord cu prelucrarea datelor personale." });
    }

    if (db.prepare("SELECT id FROM inscrieri WHERE email = ?").get(email)) {
        return res.status(409).json({ mesaj: "Există deja o înscriere cu acest email." });
    }

    const cod = crypto.randomUUID();
    db.prepare("INSERT INTO inscrieri (cod, nume, prenume, telefon, email, acord) VALUES (?, ?, ?, ?, ?, 1)")
        .run(cod, nume, prenume, telefon, email);

    res.status(201).json({ cod: cod });
});

app.patch("/api/inscrieri/:cod", function(req, res) {
    const inscriere = db.prepare("SELECT id FROM inscrieri WHERE cod = ?").get(req.params.cod);

    if (!inscriere) {
        return res.status(404).json({ mesaj: "Înscrierea nu a fost găsită." });
    }

    const date = req.body || {};
    const aflat = text(date.aflat);
    const aflatAltele = text(date.aflat_altele);
    const interesant = text(date.interesant);
    const varsta = text(date.varsta);

    if (aflat && !surse.includes(aflat)) {
        return res.status(400).json({ mesaj: "Opțiunea aleasă nu este validă." });
    }

    if (aflatAltele.length > 200 || interesant.length > 1000) {
        return res.status(400).json({ mesaj: "Răspunsul este prea lung." });
    }

    if (varsta && (!/^\d{1,2}$/.test(varsta) || Number(varsta) < 10)) {
        return res.status(400).json({ mesaj: "Vârsta trebuie să fie între 10 și 99 de ani." });
    }

    db.prepare("UPDATE inscrieri SET aflat = ?, aflat_altele = ?, interesant = ?, varsta = ? WHERE id = ?").run(
        aflat || null,
        aflat === "altele" && aflatAltele ? aflatAltele : null,
        interesant || null,
        varsta ? Number(varsta) : null,
        inscriere.id
    );

    res.json({ mesaj: "Răspunsurile au fost salvate." });
});

app.use(function(err, req, res, next) {
    const status = err.status || 500;
    res.status(status).json({ mesaj: status === 500 ? "A apărut o eroare pe server." : "Datele trimise nu sunt valide." });
});

app.listen(port, function() {
    console.log("Serverul merge pe http://localhost:" + port);
});
