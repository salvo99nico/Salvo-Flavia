# Sito matrimonio - Flavia & Salvatore

Pacchetto pronto per GitHub Pages.

## File inclusi
- `index.html` struttura del sito
- `style.css` palette terracotta, layout responsive, animazioni e transizioni
- `script.js` countdown, apertura invito, musica sintetica di sottofondo e RSVP WhatsApp
- `assets/` cartella per foto o file aggiuntivi

## Pubblicazione su GitHub Pages
1. Crea una repository, ad esempio `matrimonio-flavia-salvatore`.
2. Carica `index.html`, `style.css`, `script.js` e la cartella `assets` nella root della repository.
3. Vai in **Settings > Pages**.
4. In **Source**, scegli `Deploy from a branch`.
5. Seleziona branch `main` e folder `/root`, poi salva.

## Musica
La musica è generata dal browser con Web Audio API, quindi non serve caricare un brano e non ci sono problemi di copyright.
Per motivi di sicurezza dei browser, la musica parte solo dopo un'interazione dell'ospite, ad esempio cliccando `Apri l'invito` o il pulsante `Musica`.

## RSVP
Il modulo prepara un messaggio WhatsApp con le risposte. Nessun dato viene salvato online.
Se vuoi inviare il messaggio a un numero specifico, in `script.js` sostituisci:
`https://wa.me/?text=`
con:
`https://wa.me/39NUMEROQUI?text=`

## Mappe
I pulsanti mappe puntano a:
- Parrocchia Sant'Anna, Balestrate
- Borgo degli Angeli, Partinico

## Personalizzazioni rapide
Per modificare testi, orari, programma o sezioni, apri `index.html` e cerca direttamente il testo da cambiare.
