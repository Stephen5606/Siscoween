## Cum il pornesti

1. Instalezi Node.js, versiunea 22.13 sau mai noua.
2. In folderul projectului dai si tu un `npm install`.
3. dupa ii dai `npm start`.
4. deschizi localhost:3000

formul salveaza datele doar daca site-ul e deschis prin server. Daca deschizi index.html direct sau cu Live Server, o sa scrie ca nu a putut trimite inscrierea womp womp

## Cum merge

Cand apesi pe Inscrie-te!, script.js trimite numele, prenumele, telefonul si emailul la `POST /api/inscrieri`. Serverul le verifica (campuri completate, telefon si email valide, acord bifat, email care nu e deja inscris), le salveaza si trimite inapoi un cod al inscrierii. daca ceva nu e bun, mesajul apare in formular :)

rasp din pop-up-uri se trimit la final la `PATCH /api/inscrieri/:cod` si se adauga la aceeasi inscriere. daca cineva inchide pop-up-urile, inscrierea ramane salvata oricum, genius, right?

## Unde sunt datele

inscrierile se salveaza in `inscrieri.db` (SQLite, mi s a zis pr tarziu de MySQL, facem si asa daca e nevoie), care se creeaza singur la prima pornire.il poti deschide cu DB Browser for SQLite ca sa vezi inscrierile.