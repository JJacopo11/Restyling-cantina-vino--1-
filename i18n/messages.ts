// UI-chrome translations sourced from the original static site's I18N object (IT/EN/FR/DE).
// Long-form content (wine notes, vintage notes, story bodies) has no source translation and stays Italian.
export const messages = {
    it: {
      nav: { azienda: 'Azienda', territorio: 'Territorio', vini: 'Vini', annate: 'Annate', esperienze: 'Esperienze', contatti: 'Contatti' },
      hero: {
        kicker: 'Cialla · Colli Orientali del Friuli',
        title: 'Ronchi di Cialla',
        sub: 'Produzione di vini solo da varietà autoctone nei Colli Orientali del Friuli dal 1970.',
        cta1: 'Scopri i vini',
        cta2: 'Prenota un’esperienza'
      },
      story: { kicker: 'Dal 1970 · Famiglia Rapuzzi', title: 'Un’azienda-famiglia tra i ronchi di Cialla' },
      pillars: { kicker: 'Il nostro mondo', title: 'Tre radici, una sola filosofia', readMore: 'Approfondisci', schioppettino: 'Lo Schioppettino', biodiversity: 'Biodiversity Friend' },
      territory: { kicker: 'Il territorio', title: 'La mappa dei nostri vigneti' },
      wines: { kicker: 'I nostri vini', title: 'Vitigni autoctoni, vini di Cialla' },
      vintages: {
        kicker: 'Vini d’Annata',
        title: 'Mezzo secolo di vendemmie',
        sub: 'Dal 1977 a oggi: la verticale storica dello Schioppettino di Cialla, annata per annata. Seleziona un decennio e apri una scheda.',
        notesLabel: 'Note di vendemmia',
        reqBtn: 'Richiedi questa annata'
      },
      experiences: {
        kicker: 'Esperienze in cantina',
        title: 'Vieni a Cialla',
        sub: 'Tre modi per incontrare i nostri vini, nel cuore della valle.',
        formKicker: 'Prenota la tua esperienza',
        formExp: 'Esperienza', formDate: 'Data', formGuests: 'Persone', formName: 'Nome e cognome', formEmail: 'Email',
        formSubmit: 'Invia richiesta', submitting: 'Invio in corso…',
        book: 'Prenota', selected: 'Selezionata ✓',
        confTitle: 'Richiesta inviata',
        confText: 'Grazie! Ti risponderemo via email per confermare disponibilità e dettagli dell’esperienza.',
        confAnother: 'Invia un’altra richiesta',
        sendError: 'Invio non riuscito, riprova',
        validateError: 'Completa data, nome ed email',
        perPerson: 'a persona', onRequest: 'Su richiesta',
        items: {
          classica: { name: 'Degustazione Classica', meta: '45 min · 4 vini', desc: 'Quattro vini in degustazione guidata, accompagnati dai sapori del territorio.' },
          verticale: { name: 'Verticale di Schioppettino', meta: '90 min · 3 annate', desc: 'Tre annate di Schioppettino di Cialla a confronto, raccontate in cantina.' },
          sumisura: { name: 'Su Misura', meta: 'Su appuntamento', desc: 'Un’esperienza costruita su di te: pranzo in vigna, cene, visite private. Concordabile via mail.' }
        }
      },
      footer: { explore: 'Esplora', rights: 'Tutti i diritti riservati', winesLabel: 'Vini' },
      backToTop: 'Torna su',
      prenota: {
        back: 'Torna al sito',
        kicker: 'Esperienze in cantina', title: 'Vieni a Cialla',
        sub: 'Scegli il tuo momento tra i ronchi. Ti ricontatteremo via email per confermare disponibilità e dettagli della visita.',
        step1: '01 · La tua esperienza', step1title: 'Prenota con calma',
        chooseOffer: 'Scegli una proposta', chooseDate: 'Scegli una data', guestsLabel: 'Numero di persone',
        nameLabel: 'Nome e cognome', emailLabel: 'Email', submit: 'Invia richiesta',
        step2: '02 · Riepilogo', date: 'Data', guests: 'Persone', duration: 'Durata', price: 'Prezzo',
        selectDate: 'Seleziona una data',
        note: 'La richiesta non comporta alcun pagamento. Riceverai conferma di disponibilità via email.',
        confirmation: 'Grazie. La tua richiesta è stata ricevuta. Ti risponderemo presto via email.',
        submitting: 'Invio in corso…', sent: 'Richiesta inviata',
        validateError: 'Completa data, nome ed email', sendError: 'Invio non riuscito, riprova',
        person: 'persona', persons: 'persone'
      }
    },
    en: {
      nav: { azienda: 'Estate', territorio: 'Territory', vini: 'Wines', annate: 'Vintages', esperienze: 'Experiences', contatti: 'Contact' },
      hero: {
        kicker: 'Cialla · Colli Orientali del Friuli',
        title: 'Born on the vine',
        sub: 'Since 1970 we have tended the native grapes of a small Friulian valley, crafting age-worthy wines of the highest quality.',
        cta1: 'Discover the wines',
        cta2: 'Book an experience'
      },
      story: { kicker: 'Since 1970 · The Rapuzzi Family', title: 'A family estate among the ronchi of Cialla' },
      pillars: { kicker: 'Our world', title: 'Three roots, one philosophy', readMore: 'Read more', schioppettino: 'The Schioppettino', biodiversity: 'Biodiversity Friend' },
      territory: { kicker: 'Territory', title: 'The map of our vineyards' },
      wines: { kicker: 'Our wines', title: 'Native grapes, wines of Cialla' },
      vintages: {
        kicker: 'Library Vintages',
        title: 'Half a century of harvests',
        sub: 'From 1977 to today: the historic vertical of Schioppettino di Cialla, vintage by vintage. Pick a decade and open a card.',
        notesLabel: 'Harvest notes',
        reqBtn: 'Request this vintage'
      },
      experiences: {
        kicker: 'Cellar experiences',
        title: 'Come to Cialla',
        sub: 'Three ways to meet our wines, in the heart of the valley.',
        formKicker: 'Book your experience',
        formExp: 'Experience', formDate: 'Date', formGuests: 'Guests', formName: 'Full name', formEmail: 'Email',
        formSubmit: 'Send request', submitting: 'Sending…',
        book: 'Book', selected: 'Selected ✓',
        confTitle: 'Request sent',
        confText: 'Thank you! We’ll email you to confirm availability and details of the experience.',
        confAnother: 'Send another request',
        sendError: 'Sending failed, try again',
        validateError: 'Fill in date, name and email',
        perPerson: 'per person', onRequest: 'On request',
        items: {
          classica: { name: 'Classic Tasting', meta: '45 min · 4 wines', desc: 'Four wines in a guided tasting, paired with local flavours.' },
          verticale: { name: 'Schioppettino Vertical', meta: '90 min · 3 vintages', desc: 'Three vintages of Schioppettino di Cialla compared, told in the cellar.' },
          sumisura: { name: 'Bespoke', meta: 'By appointment', desc: 'An experience built around you: lunch in the vineyard, dinners, private visits. Arranged by email.' }
        }
      },
      footer: { explore: 'Explore', rights: 'All rights reserved', winesLabel: 'Wines' },
      backToTop: 'Back to top',
      prenota: {
        back: 'Back to site',
        kicker: 'Cellar experiences', title: 'Come to Cialla',
        sub: 'Choose your moment among the ronchi. We’ll get back to you by email to confirm availability and visit details.',
        step1: '01 · Your experience', step1title: 'Book at your ease',
        chooseOffer: 'Choose an option', chooseDate: 'Choose a date', guestsLabel: 'Number of guests',
        nameLabel: 'Full name', emailLabel: 'Email', submit: 'Send request',
        step2: '02 · Summary', date: 'Date', guests: 'Guests', duration: 'Duration', price: 'Price',
        selectDate: 'Select a date',
        note: 'The request involves no payment. You’ll receive availability confirmation by email.',
        confirmation: 'Thank you. Your request has been received. We’ll reply soon by email.',
        submitting: 'Sending…', sent: 'Request sent',
        validateError: 'Fill in date, name and email', sendError: 'Sending failed, try again',
        person: 'guest', persons: 'guests'
      }
    },
    fr: {
      nav: { azienda: 'Domaine', territorio: 'Territoire', vini: 'Vins', annate: 'Millésimes', esperienze: 'Expériences', contatti: 'Contact' },
      hero: {
        kicker: 'Cialla · Colli Orientali del Friuli',
        title: 'Nés sur la vigne',
        sub: 'Depuis 1970, nous veillons sur les cépages autochtones d’une petite vallée du Frioul, pour des vins de garde de très haute qualité.',
        cta1: 'Découvrir les vins',
        cta2: 'Réserver une expérience'
      },
      story: { kicker: 'Depuis 1970 · Famille Rapuzzi', title: 'Un domaine familial parmi les ronchi de Cialla' },
      pillars: { kicker: 'Notre monde', title: 'Trois racines, une philosophie', readMore: 'En savoir plus', schioppettino: 'Le Schioppettino', biodiversity: 'Biodiversity Friend' },
      territory: { kicker: 'Le territoire', title: 'La carte de nos vignes' },
      wines: { kicker: 'Nos vins', title: 'Cépages autochtones, vins de Cialla' },
      vintages: {
        kicker: 'Millésimes d’Annata',
        title: 'Un demi-siècle de vendanges',
        sub: 'De 1977 à aujourd’hui : la verticale historique du Schioppettino di Cialla, millésime par millésime. Choisissez une décennie.',
        notesLabel: 'Notes de vendange',
        reqBtn: 'Demander ce millésime'
      },
      experiences: {
        kicker: 'Expériences au chai',
        title: 'Venez à Cialla',
        sub: 'Trois façons de rencontrer nos vins, au cœur de la vallée.',
        formKicker: 'Réservez votre expérience',
        formExp: 'Expérience', formDate: 'Date', formGuests: 'Personnes', formName: 'Nom et prénom', formEmail: 'Email',
        formSubmit: 'Envoyer la demande', submitting: 'Envoi en cours…',
        book: 'Réserver', selected: 'Sélectionnée ✓',
        confTitle: 'Demande envoyée',
        confText: 'Merci ! Nous vous répondrons par email pour confirmer la disponibilité et les détails de l’expérience.',
        confAnother: 'Envoyer une autre demande',
        sendError: 'Échec de l’envoi, réessayez',
        validateError: 'Complétez date, nom et email',
        perPerson: 'par personne', onRequest: 'Sur demande',
        items: {
          classica: { name: 'Dégustation Classique', meta: '45 min · 4 vins', desc: 'Quatre vins en dégustation guidée, accompagnés des saveurs du terroir.' },
          verticale: { name: 'Verticale de Schioppettino', meta: '90 min · 3 millésimes', desc: 'Trois millésimes de Schioppettino di Cialla comparés, racontés au chai.' },
          sumisura: { name: 'Sur Mesure', meta: 'Sur rendez-vous', desc: 'Une expérience sur mesure : déjeuner dans la vigne, dîners, visites privées. À convenir par email.' }
        }
      },
      footer: { explore: 'Explorer', rights: 'Tous droits réservés', winesLabel: 'Vins' },
      backToTop: 'Haut de page',
      prenota: {
        back: 'Retour au site',
        kicker: 'Expériences au chai', title: 'Venez à Cialla',
        sub: 'Choisissez votre moment parmi les ronchi. Nous vous recontacterons par email pour confirmer la disponibilité et les détails de la visite.',
        step1: '01 · Votre expérience', step1title: 'Réservez en toute tranquillité',
        chooseOffer: 'Choisissez une proposition', chooseDate: 'Choisissez une date', guestsLabel: 'Nombre de personnes',
        nameLabel: 'Nom et prénom', emailLabel: 'Email', submit: 'Envoyer la demande',
        step2: '02 · Récapitulatif', date: 'Date', guests: 'Personnes', duration: 'Durée', price: 'Prix',
        selectDate: 'Sélectionnez une date',
        note: 'La demande n’implique aucun paiement. Vous recevrez une confirmation de disponibilité par email.',
        confirmation: 'Merci. Votre demande a été reçue. Nous vous répondrons bientôt par email.',
        submitting: 'Envoi en cours…', sent: 'Demande envoyée',
        validateError: 'Complétez date, nom et email', sendError: 'Échec de l’envoi, réessayez',
        person: 'personne', persons: 'personnes'
      }
    },
    de: {
      nav: { azienda: 'Weingut', territorio: 'Terroir', vini: 'Weine', annate: 'Jahrgänge', esperienze: 'Erlebnisse', contatti: 'Kontakt' },
      hero: {
        kicker: 'Cialla · Colli Orientali del Friuli',
        title: 'Im Weinberg geboren',
        sub: 'Seit 1970 pflegen wir die autochthonen Reben eines kleinen friaulischen Tals – für lagerfähige Weine von höchster Qualität.',
        cta1: 'Weine entdecken',
        cta2: 'Erlebnis buchen'
      },
      story: { kicker: 'Seit 1970 · Familie Rapuzzi', title: 'Ein Familienweingut in den ronchi von Cialla' },
      pillars: { kicker: 'Unsere Welt', title: 'Drei Wurzeln, eine Philosophie', readMore: 'Mehr erfahren', schioppettino: 'Der Schioppettino', biodiversity: 'Biodiversity Friend' },
      territory: { kicker: 'Das Terroir', title: 'Die Karte unserer Weinberge' },
      wines: { kicker: 'Unsere Weine', title: 'Autochthone Reben, Weine aus Cialla' },
      vintages: {
        kicker: 'Alte Jahrgänge',
        title: 'Ein halbes Jahrhundert Ernten',
        sub: 'Von 1977 bis heute: die historische Vertikale des Schioppettino di Cialla, Jahrgang für Jahrgang. Wählen Sie ein Jahrzehnt.',
        notesLabel: 'Erntenotizen',
        reqBtn: 'Diesen Jahrgang anfragen'
      },
      experiences: {
        kicker: 'Erlebnisse im Keller',
        title: 'Kommen Sie nach Cialla',
        sub: 'Drei Wege, unsere Weine zu erleben – im Herzen des Tals.',
        formKicker: 'Erlebnis buchen',
        formExp: 'Erlebnis', formDate: 'Datum', formGuests: 'Personen', formName: 'Vor- und Nachname', formEmail: 'E-Mail',
        formSubmit: 'Anfrage senden', submitting: 'Senden…',
        book: 'Buchen', selected: 'Ausgewählt ✓',
        confTitle: 'Anfrage gesendet',
        confText: 'Danke! Wir melden uns per E-Mail, um Verfügbarkeit und Details des Erlebnisses zu bestätigen.',
        confAnother: 'Weitere Anfrage senden',
        sendError: 'Senden fehlgeschlagen, erneut versuchen',
        validateError: 'Datum, Name und E-Mail ausfüllen',
        perPerson: 'pro Person', onRequest: 'Auf Anfrage',
        items: {
          classica: { name: 'Klassische Verkostung', meta: '45 Min · 4 Weine', desc: 'Vier Weine in einer geführten Verkostung mit regionalen Spezialitäten.' },
          verticale: { name: 'Schioppettino-Vertikale', meta: '90 Min · 3 Jahrgänge', desc: 'Drei Jahrgänge Schioppettino di Cialla im Vergleich, erzählt im Keller.' },
          sumisura: { name: 'Maßgeschneidert', meta: 'Nach Vereinbarung', desc: 'Ein Erlebnis nach Maß: Essen im Weinberg, Dinner, private Besuche. Per E-Mail vereinbar.' }
        }
      },
      footer: { explore: 'Entdecken', rights: 'Alle Rechte vorbehalten', winesLabel: 'Weine' },
      backToTop: 'Nach oben',
      prenota: {
        back: 'Zurück zur Website',
        kicker: 'Erlebnisse im Keller', title: 'Kommen Sie nach Cialla',
        sub: 'Wählen Sie Ihren Moment zwischen den ronchi. Wir melden uns per E-Mail, um Verfügbarkeit und Details des Besuchs zu bestätigen.',
        step1: '01 · Ihr Erlebnis', step1title: 'Buchen Sie in Ruhe',
        chooseOffer: 'Wählen Sie ein Angebot', chooseDate: 'Wählen Sie ein Datum', guestsLabel: 'Anzahl der Personen',
        nameLabel: 'Vor- und Nachname', emailLabel: 'E-Mail', submit: 'Anfrage senden',
        step2: '02 · Zusammenfassung', date: 'Datum', guests: 'Personen', duration: 'Dauer', price: 'Preis',
        selectDate: 'Datum auswählen',
        note: 'Die Anfrage ist unverbindlich. Sie erhalten eine Verfügbarkeitsbestätigung per E-Mail.',
        confirmation: 'Danke. Ihre Anfrage ist eingegangen. Wir antworten bald per E-Mail.',
        submitting: 'Senden…', sent: 'Anfrage gesendet',
        validateError: 'Datum, Name und E-Mail ausfüllen', sendError: 'Senden fehlgeschlagen, erneut versuchen',
        person: 'Person', persons: 'Personen'
      }
    }
}
