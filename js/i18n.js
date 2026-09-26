/* Page translations + language detection.
 *
 * English is the source text and lives in index.html itself. Any element
 * with data-i18n="key" gets its innerHTML swapped for STRINGS[lang][key];
 * data-i18n-attr="attr:key;attr:key" does the same for attributes.
 *
 * Which language shows, in order:
 *   1. ?lang=xx in the URL (handy for sharing a link in one language)
 *   2. what the visitor picked in the switcher (remembered in localStorage)
 *   3. the browser language, if it is explicitly uk / es / kk
 *   4. location, read from the device timezone (no network lookup)
 *   5. English
 *
 * This file is loaded synchronously in <head>: it hides the page for a
 * non-English visitor until the text is swapped, so English never flashes.
 */
(function () {
  "use strict";

  var SUPPORTED = ["en", "uk", "es", "kk"];
  var SHORT = { en: "EN", uk: "UA", es: "ES", kk: "KZ" };
  var STORAGE_KEY = "dwiom.lang";

  /* ── location via timezone ─────────────────────────────────────────── */
  var TZ_UK = [
    "Europe/Kyiv", "Europe/Kiev", "Europe/Uzhgorod", "Europe/Zaporozhye"
  ];
  var TZ_KK = [
    "Asia/Almaty", "Asia/Astana", "Asia/Qyzylorda", "Asia/Aqtobe", "Asia/Aqtau",
    "Asia/Atyrau", "Asia/Oral", "Asia/Qostanay"
  ];
  // Spain + Spanish-speaking Latin America
  var TZ_ES = [
    "Europe/Madrid", "Africa/Ceuta", "Atlantic/Canary",
    "America/Mexico_City", "America/Cancun", "America/Merida", "America/Monterrey",
    "America/Matamoros", "America/Chihuahua", "America/Ciudad_Juarez", "America/Ojinaga",
    "America/Mazatlan", "America/Bahia_Banderas", "America/Hermosillo", "America/Tijuana",
    "America/Guatemala", "America/El_Salvador", "America/Tegucigalpa", "America/Managua",
    "America/Costa_Rica", "America/Panama", "America/Havana", "America/Santo_Domingo",
    "America/Puerto_Rico", "America/Bogota", "America/Caracas", "America/Guayaquil",
    "America/Lima", "America/La_Paz", "America/Santiago", "America/Punta_Arenas",
    "America/Asuncion", "America/Montevideo", "Pacific/Galapagos", "Pacific/Easter",
    "Africa/Malabo"
  ];

  function fromTimezone() {
    var tz = "";
    try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ""; } catch (e) {}
    if (TZ_UK.indexOf(tz) > -1) return "uk";
    if (TZ_KK.indexOf(tz) > -1) return "kk";
    if (TZ_ES.indexOf(tz) > -1 || tz.indexOf("America/Argentina/") === 0) return "es";
    return null;
  }

  function fromBrowser() {
    var langs = navigator.languages && navigator.languages.length
      ? navigator.languages : [navigator.language || ""];
    for (var i = 0; i < langs.length; i++) {
      var base = String(langs[i]).toLowerCase().split("-")[0];
      if (base === "uk" || base === "es" || base === "kk") return base;
      // an explicit English preference ends the search; other languages
      // (ru, de …) fall through to location
      if (base === "en") return null;
    }
    return null;
  }

  function stored() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }
  function store(lang) {
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
  }

  function valid(l) { return SUPPORTED.indexOf(l) > -1 ? l : null; }

  function detect() {
    var param = null;
    try { param = new URLSearchParams(location.search).get("lang"); } catch (e) {}
    return valid(param) || valid(stored()) || fromBrowser() || fromTimezone() || "en";
  }

  /* ── strings ───────────────────────────────────────────────────────── */
  var STRINGS = {
    uk: {
      "meta.title": "Don't Worry, It's On Me — боти, що відповідають клієнтам після робочого дня",
      "meta.description": "Втомилися відповідати на повідомлення о 23:00? Ми створимо бота з вашого сайту за кілька хвилин. Він відповідає на типові питання в Telegram, WhatsApp, Instagram і на сайті, збирає дані й передає вам справжні розмови.",
      "lang.aria": "Мова",
      "nav.how": "Як це працює",
      "nav.channels": "Канали",
      "nav.pricing": "Ціни",
      "nav.cta": "Створити бота",
      "hero.eyebrow": "Для клінік, салонів і кожного бізнесу, якому пишуть клієнти",
      "hero.title": "Втомилися відповідати о&nbsp;23:00? <em>Не хвилюйтеся, я про все подбаю.</em>",
      "hero.lead": "Дайте нам посилання на сайт — і за кілька хвилин бот відповідатиме вашим клієнтам у Telegram, WhatsApp, Instagram і на сайті, а потім передасть вам усе, що дізнався.",
      "hero.cta1": "Створити бота",
      "hero.cta2": "Спробувати в Telegram",
      "facts.setup": "<strong>Хвилини</strong> на запуск",
      "facts.shift": "<strong>24/7</strong> на зв'язку",
      "facts.channels": "<strong>4</strong> канали",
      "facts.price": "<strong><span class=\"price-value\">$100</span></strong> на місяць",
      "night.aria": "Приклад: відповідь на повідомлення вночі",
      "night.b1": "Є щось вільне в суботу зранку?",
      "night.b2": "Так — 10:00 або 11:30 з Анною. Забронювати для вас?",
      "night.b3": "10:00, будь ласка!",
      "night.d1": "Відповідь за 4 секунди",
      "night.d2": "Час заброньовано, дані зібрано",
      "night.d3": "У вашому підсумку о 8:00",
      "when.eyebrow": "Коли пишуть клієнти",
      "when.title": "Ваші клієнти не зважають на робочі години.",
      "when.c1.when": "Ще до відкриття",
      "when.c1.msg": "«Ви сьогодні працюєте? Можна прийти без запису?»",
      "when.c2.when": "Ви з клієнтом",
      "when.c2.msg": "«Скільки коштує професійна чистка зубів?»",
      "when.c3.when": "Ви нарешті відпочиваєте",
      "when.c3.msg": "«Є щось вільне в суботу зранку?»",
      "when.c4.time": "Нд 10:15",
      "when.c4.when": "Ваш вихідний",
      "when.c4.msg": "«Мені треба перенести запис із вівторка.»",
      "when.foot": "Кожен отримує відповідь за секунди. І жодного разу вам не треба братися за телефон.",
      "role.eyebrow": "Помічник, а не заміна",
      "role.title": "Він бере нічну зміну. А приходять усе одно до вас.",
      "role.lead": "Бот не робить вашу роботу. Він бере на себе те, що тримає вас біля телефону, — ціни, графік, «чи є вільний час» — і готує все до моменту, коли потрібна людина. Ця людина — ви.",
      "role.f1.h": "Відповідає на типові питання",
      "role.f1.p": "Ціни, графік роботи, як дістатися, що взяти з собою — прямо з вашого сайту.",
      "role.f2.h": "Збирає дані",
      "role.f2.p": "Ім'я, контакт, що потрібно, коли зручно. Ви отримуєте короткий підсумок, а не довге листування.",
      "role.f3.h": "Передає людині",
      "role.f3.p": "Усе медичне, особисте чи неоднозначне — до вас, разом із уже записаним контекстом.",
      "role.f4.h": "Ніколи не прикидається",
      "role.f4.p": "Він представляється вашим помічником і каже лише те, що ви йому розповіли.",
      "demo.eyebrow": "Що відбувається вночі",
      "demo.title": "Записуються о 23:14. Ви читаєте один підсумок о 8:00.",
      "demo.lead": "Бот відповідає як ваш співробітник, бо знає лише те, що ви йому дали. Потім він записує головне, щоб ви могли підтвердити, передзвонити чи відмовити одним дотиком.",
      "demo.cta": "Поговорити з нашим ботом",
      "chat.m1": "Привіт! Є щось на балаяж цієї суботи?",
      "chat.m2": "Привіт! Балаяж — від $140, триває близько 3 годин. У суботу вільно о 10:00 або 13:30. Як вам зручніше?",
      "chat.m3": "О 10. Роблю вперше, волосся досить темне",
      "chat.m4": "Зрозуміло — передам Анні, щоб вона спланувала колір. Можна ваше ім'я та номер, щоб закріпити час?",
      "chat.m5": "Мія, 555 0142",
      "chat.m6": "Дякую, Міє! Субота 10:00 за вами — Анна підтвердить зранку.",
      "brief.aria": "Приклад ранкового підсумку",
      "brief.kicker": "08:00 · Для Анни",
      "brief.tag": "Потрібні ви",
      "brief.who": "Хто",
      "brief.who.v": "Мія · 555 0142",
      "brief.wants": "Що",
      "brief.wants.v": "Балаяж, уперше",
      "brief.when": "Коли",
      "brief.when.v": "Сб 10:00 — заброньовано",
      "brief.note": "Нотатка",
      "brief.note.v": "Темне волосся, спланувати колір",
      "brief.more": "+ ще 7 відповідей за ніч — ціни, графік, паркування. Більше нічого не потребує вашої уваги.",
      "how.eyebrow": "Як це працює",
      "how.title": "Запуск за хвилини, а не тижні.",
      "how.s1.h": "Дайте посилання на сайт",
      "how.s1.p": "Одного посилання досить. Ми беремо послуги, ціни, графік і правила з ваших сторінок. Жодної бази знань писати не треба.",
      "how.s2.h": "Оберіть, де він відповідає",
      "how.s2.p": "Telegram, WhatsApp, Instagram, чат на сайті — або все одразу. Один бот, однакові відповіді всюди.",
      "how.s3.h": "Скажіть, коли кликати вас",
      "how.s3.p": "Опишіть простими словами, що він має збирати і коли підключається людина. Ми все налаштуємо безкоштовно.",
      "ch.eyebrow": "Канали",
      "ch.title": "Один бот — усюди, де вам пишуть.",
      "ch.1.p": "Бот із вашою назвою, якого клієнти можуть знайти, переслати й повернутися до нього.",
      "ch.2.p": "Відповідає з номера, який у клієнтів уже збережений.",
      "ch.3.name": "Instagram Direct",
      "ch.3.p": "Перетворює «скільки коштує?» під вашими дописами на записи, а не на пропущені повідомлення.",
      "ch.4.name": "Чат на сайті",
      "ch.4.p": "Один рядок коду — і той самий бот у куточку вашого сайту.",
      "sec.eyebrow": "Конфіденційність",
      "sec.title": "Один бот. Одне середовище. Один бізнес.",
      "sec.lead": "Імена клієнтів, нотатки до записів і номери телефонів не мають лежати в спільній купі. Ваш бот має власне середовище і власні дані.",
      "sec.c1": "<strong>Нічого не перетинається.</strong> Ваші записи ніколи не стануть доступні боту іншого бізнесу.",
      "sec.c2": "<strong>Ваші дані — ваші.</strong> Ніщо з того, що ви нам даєте, не використовується для навчання спільної моделі.",
      "sec.c3": "<strong>Видалити — означає видалити.</strong> Закриваєте акаунт — середовище зникає разом із ним.",
      "price.eyebrow": "Ціни",
      "price.title": "Один простий тариф.",
      "price.period": "на місяць",
      "price.note": "Оплата щомісяця. Без контракту, без плати за підключення, без оплати за повідомлення. Менше, ніж один пропущений запис на тиждень.",
      "price.cta": "Створити бота",
      "price.i1": "Усі чотири канали — Telegram, WhatsApp, Instagram, сайт",
      "price.i2": "Необмежена кількість розмов, вдень і вночі",
      "price.i3": "Дані клієнтів зібрані й підсумовані для вас",
      "price.i4": "Передача людині — так, як зручно саме вам",
      "price.i5": "Сайт і ціни синхронізовані з ботом",
      "price.i6": "Жива людина, якій можна написати, коли щось треба змінити",
      "faq.eyebrow": "Питання",
      "faq.title": "Що нас часто питають.",
      "faq.q1": "Він замінить мого адміністратора?",
      "faq.a1": "Ні. Він закриває години, коли на рецепції нікого немає, і питання, на які ніхто не мусить відповідати двадцять разів на день. Ваша команда менше відволікається, а клієнти приходять краще підготовленими.",
      "faq.q2": "А якщо він не знає відповіді?",
      "faq.a2": "Він так і скаже, візьме контакти клієнта й передасть розмову вам. Він ніколи не вигадує ціну, час чи діагноз.",
      "faq.q3": "Клієнти знатимуть, що говорять із ботом?",
      "faq.a3": "Так — він представляється вашим помічником. Люди не проти бота; вони проти того, щоб чекати до ранку на «так, у суботу працюємо».",
      "faq.q4": "У мене не клініка й не салон. Мені це підійде?",
      "faq.a4": "Якщо клієнти пишуть вам із питаннями перед покупкою чи записом — підійде. Просто в клініках і салонах повідомлення о 23:00 накопичуються найшвидше.",
      "faq.q5": "Скільки насправді триває налаштування?",
      "faq.a5": "Кілька хвилин до робочого бота з вашого сайту. Якщо потрібні записи, нагадування чи рядок у вашій таблиці — скажіть, і ми додамо це без доплати.",
      "cta.title": "Закривайте ноутбук. <em>Я про все подбаю.</em>",
      "cta.sub": "Вставте посилання на сайт — і бот відповідатиме вже за кілька хвилин. Або заплануйте двадцять хвилин, і ми налаштуємо все разом.",
      "cta.placeholder": "vashbiznes.ua",
      "cta.input": "Ваш сайт",
      "cta.button": "Створити бота",
      "cta.alt": "Ще не готові?",
      "cta.talk": "Спершу поговорити з нами",
      "cta.try": "Спробувати бота в Telegram",
      "footer.aria": "Нижнє меню",
      "footer.pricing": "Ціни",
      "footer.privacy": "Конфіденційність",
      "footer.faq": "Питання",
      "footer.contact": "Контакти"
    },

    es: {
      "meta.title": "Don't Worry, It's On Me — bots que atienden a tus clientes fuera de horario",
      "meta.description": "¿Cansado de responder mensajes a las 11 de la noche? Creamos un bot a partir de tu web en minutos. Responde las preguntas de siempre en Telegram, WhatsApp, Instagram y tu web, recoge los datos y te pasa las conversaciones importantes.",
      "lang.aria": "Idioma",
      "nav.how": "Cómo funciona",
      "nav.channels": "Canales",
      "nav.pricing": "Precios",
      "nav.cta": "Crear mi bot",
      "hero.eyebrow": "Para clínicas, salones y cualquier negocio que recibe mensajes",
      "hero.title": "¿Cansado de responder a las 11 de la&nbsp;noche? <em>Tranquilo, yo me encargo.</em>",
      "hero.lead": "Danos tu web y en minutos un bot atiende a tus clientes en Telegram, WhatsApp, Instagram y tu sitio — y luego te pasa todo lo que averiguó.",
      "hero.cta1": "Crear mi bot",
      "hero.cta2": "Probar en Telegram",
      "facts.setup": "<strong>Minutos</strong> para empezar",
      "facts.shift": "<strong>24/7</strong> de guardia",
      "facts.channels": "<strong>4</strong> canales",
      "facts.price": "<strong><span class=\"price-value\">$100</span></strong> al mes",
      "night.aria": "Ejemplo: un mensaje respondido de noche",
      "night.b1": "¿Tienen algo libre el sábado por la mañana?",
      "night.b2": "Sí — 10:00 u 11:30 con Anna. ¿Te reservo una?",
      "night.b3": "¡Las 10:00, por favor!",
      "night.d1": "Respondido en 4 segundos",
      "night.d2": "Hora reservada, datos recogidos",
      "night.d3": "En tu resumen de las 8:00",
      "when.eyebrow": "Cuándo escriben",
      "when.title": "Tus clientes no tienen horario de oficina.",
      "when.c1.when": "Antes de abrir",
      "when.c1.msg": "«¿Abren hoy? ¿Puedo ir sin cita?»",
      "when.c2.when": "Estás con un cliente",
      "when.c2.msg": "«¿Cuánto cuesta una limpieza dental?»",
      "when.c3.when": "Por fin descansas",
      "when.c3.msg": "«¿Tienen algo libre el sábado por la mañana?»",
      "when.c4.time": "Dom 10:15",
      "when.c4.when": "Tu día libre",
      "when.c4.msg": "«Necesito cambiar mi cita del martes.»",
      "when.foot": "Todos reciben respuesta en segundos. Ninguno necesita que contestes el teléfono.",
      "role.eyebrow": "Ayuda, no reemplazo",
      "role.title": "Cubre el turno de noche. Tú sigues siendo a quien vienen a ver.",
      "role.lead": "El bot no hace tu trabajo. Hace la parte que te tiene pegado al teléfono — los precios, los horarios, el «¿tienes hueco?» — y deja todo listo para cuando hace falta una persona. Esa persona eres tú.",
      "role.f1.h": "Responde lo de siempre",
      "role.f1.p": "Precios, horarios, cómo llegar, qué traer — directamente de tu propia web.",
      "role.f2.h": "Recoge los datos",
      "role.f2.p": "Nombre, contacto, qué necesita, cuándo le va bien. Recibes un resumen claro, no un hilo interminable.",
      "role.f3.h": "Te pasa a una persona",
      "role.f3.p": "Todo lo médico, personal o dudoso llega a ti — con el contexto ya escrito.",
      "role.f4.h": "Nunca finge",
      "role.f4.p": "Se presenta como tu asistente y solo dice lo que tú le has contado.",
      "demo.eyebrow": "Qué pasa por la noche",
      "demo.title": "Reservan a las 23:14. Tú lees un resumen a las 8:00.",
      "demo.lead": "El bot responde como alguien de tu equipo, porque solo sabe lo que tú le diste. Luego anota lo importante para que confirmes, llames o digas que no con un toque.",
      "demo.cta": "Habla con nuestro bot",
      "chat.m1": "¡Hola! ¿Tienen algo para balayage este sábado?",
      "chat.m2": "¡Hola! El balayage cuesta desde $140 y dura unas 3 horas. El sábado hay hueco a las 10:00 o a las 13:30. ¿Cuál te viene mejor?",
      "chat.m3": "A las 10. Es mi primera vez, tengo el pelo bastante oscuro",
      "chat.m4": "Anotado — se lo digo a Anna para que planifique el color. ¿Me das un nombre y un número para reservar la hora?",
      "chat.m5": "Mia, 555 0142",
      "chat.m6": "¡Gracias, Mia! El sábado a las 10:00 es tuyo — Anna lo confirmará a primera hora.",
      "brief.aria": "Ejemplo de resumen matutino",
      "brief.kicker": "08:00 · Para Anna",
      "brief.tag": "Te necesita",
      "brief.who": "Quién",
      "brief.who.v": "Mia · 555 0142",
      "brief.wants": "Quiere",
      "brief.wants.v": "Balayage, primera vez",
      "brief.when": "Cuándo",
      "brief.when.v": "Sáb 10:00 — reservado",
      "brief.note": "Nota",
      "brief.note.v": "Pelo oscuro, planificar el color",
      "brief.more": "+ 7 respuestas más durante la noche — precios, horarios, parking. Nada más te necesita.",
      "how.eyebrow": "Cómo funciona",
      "how.title": "En marcha en minutos, no en semanas.",
      "how.s1.h": "Danos tu web",
      "how.s1.p": "Basta con un enlace. Leemos tus servicios, precios, horarios y políticas de tus propias páginas. Sin base de conocimiento que escribir.",
      "how.s2.h": "Elige dónde responde",
      "how.s2.p": "Telegram, WhatsApp, Instagram, un chat en tu web — o los cuatro. Un solo bot, las mismas respuestas en todas partes.",
      "how.s3.h": "Dinos cuándo avisarte",
      "how.s3.p": "Cuéntanos con tus palabras qué debe recoger y cuándo entra una persona. Lo configuramos gratis.",
      "ch.eyebrow": "Canales",
      "ch.title": "Un bot, dondequiera que te escriban.",
      "ch.1.p": "Un bot con tu nombre que tus clientes pueden encontrar, compartir y volver a usar.",
      "ch.2.p": "Responde en el número que tus clientes ya tienen guardado.",
      "ch.3.name": "Mensajes de Instagram",
      "ch.3.p": "Convierte los «¿cuánto cuesta?» de tus publicaciones en reservas, no en mensajes sin responder.",
      "ch.4.name": "Chat en tu web",
      "ch.4.p": "Una línea de código pone el mismo bot en una esquina de tu web.",
      "sec.eyebrow": "Privacidad",
      "sec.title": "Un bot. Un entorno. Un negocio.",
      "sec.lead": "Los nombres de tus clientes, las notas de sus citas y sus teléfonos no deberían estar en un montón compartido. Tu bot tiene su propio entorno y sus propios datos.",
      "sec.c1": "<strong>Nada se cruza.</strong> Tus registros nunca quedan al alcance del bot de otro negocio.",
      "sec.c2": "<strong>Tus datos son tuyos.</strong> Nada de lo que nos das se usa para entrenar un modelo compartido.",
      "sec.c3": "<strong>Borrar es borrar.</strong> Cierras la cuenta y el entorno desaparece con ella.",
      "price.eyebrow": "Precios",
      "price.title": "Un solo plan, sin complicaciones.",
      "price.period": "al mes",
      "price.note": "Pago mensual. Sin permanencia, sin cuota de alta, sin cobro por mensaje. Menos que una cita perdida a la semana.",
      "price.cta": "Crear mi bot",
      "price.i1": "Los cuatro canales — Telegram, WhatsApp, Instagram y web",
      "price.i2": "Conversaciones ilimitadas, de día y de noche",
      "price.i3": "Datos de clientes recogidos y resumidos para ti",
      "price.i4": "Paso a una persona, adaptado a tu forma de trabajar",
      "price.i5": "Web y precios siempre sincronizados con el bot",
      "price.i6": "Una persona real a quien escribir cuando algo tenga que cambiar",
      "faq.eyebrow": "Preguntas",
      "faq.title": "Lo que nos suelen preguntar.",
      "faq.q1": "¿Va a reemplazar a mi recepcionista?",
      "faq.a1": "No. Cubre las horas en que no hay nadie en recepción y las preguntas que nadie debería responder veinte veces al día. Tu equipo tiene menos interrupciones y los clientes llegan mejor preparados.",
      "faq.q2": "¿Y si no sabe la respuesta?",
      "faq.a2": "Lo dice, toma los datos del cliente y te pasa la conversación. Nunca se inventa un precio, una hora ni un diagnóstico.",
      "faq.q3": "¿Sabrán mis clientes que hablan con un bot?",
      "faq.a3": "Sí — se presenta como tu asistente. A la gente no le molesta un bot; le molesta esperar hasta la mañana para oír «sí, abrimos el sábado».",
      "faq.q4": "No tengo una clínica ni un salón. ¿Me sirve?",
      "faq.a4": "Si tus clientes te escriben con preguntas antes de comprar o reservar, te sirve. Las clínicas y los salones son solo donde los mensajes de las 11 de la noche se acumulan más rápido.",
      "faq.q5": "¿Cuánto tarda de verdad la configuración?",
      "faq.a5": "Unos minutos hasta tener un bot funcionando con tu web. Si quieres reservas, recordatorios o una fila en tu hoja de cálculo, dínoslo y lo añadimos sin coste extra.",
      "cta.title": "Desconéctate. <em>Yo me encargo.</em>",
      "cta.sub": "Pega tu web y ten un bot respondiendo en minutos — o reserva veinte minutos y lo configuramos juntos.",
      "cta.placeholder": "tunegocio.com",
      "cta.input": "Tu web",
      "cta.button": "Crear mi bot",
      "cta.alt": "¿Todavía no?",
      "cta.talk": "Habla primero con nosotros",
      "cta.try": "Prueba nuestro bot en Telegram",
      "footer.aria": "Pie de página",
      "footer.pricing": "Precios",
      "footer.privacy": "Privacidad",
      "footer.faq": "Preguntas",
      "footer.contact": "Contacto"
    },

    kk: {
      "meta.title": "Don't Worry, It's On Me — жұмыс уақытынан тыс клиенттерге жауап беретін боттар",
      "meta.description": "Түнгі 23:00-де хабарламаларға жауап беруден шаршадыңыз ба? Біз сайтыңыздан бірнеше минутта бот жасаймыз. Ол Telegram, WhatsApp, Instagram және сайтта жиі қойылатын сұрақтарға жауап береді, деректерді жинайды және маңызды әңгімелерді сізге береді.",
      "lang.aria": "Тіл",
      "nav.how": "Қалай жұмыс істейді",
      "nav.channels": "Арналар",
      "nav.pricing": "Бағасы",
      "nav.cta": "Бот жасау",
      "hero.eyebrow": "Клиникалар, салондар және клиенттері жазатын кез келген бизнес үшін",
      "hero.title": "Түнгі 23:00-де жауап беруден шаршадыңыз&nbsp;ба? <em>Уайымдамаңыз, бәрін өзім реттеймін.</em>",
      "hero.lead": "Сайтыңыздың сілтемесін беріңіз — бірнеше минуттан кейін бот клиенттеріңізге Telegram, WhatsApp, Instagram және сайтта жауап береді, содан кейін білгенінің бәрін сізге жеткізеді.",
      "hero.cta1": "Бот жасау",
      "hero.cta2": "Telegram-да сынап көру",
      "facts.setup": "<strong>Бірнеше минутта</strong> іске қосу",
      "facts.shift": "<strong>24/7</strong> байланыста",
      "facts.channels": "<strong>4</strong> арна",
      "facts.price": "Айына <strong><span class=\"price-value\">$100</span></strong>",
      "night.aria": "Мысал: түнде келген хабарламаға жауап",
      "night.b1": "Сенбі күні таңертең бос уақыт бар ма?",
      "night.b2": "Иә — 10:00 немесе 11:30, Аннада. Сізге біреуін брондап қояйын ба?",
      "night.b3": "10:00, өтінемін!",
      "night.d1": "4 секундта жауап берілді",
      "night.d2": "Уақыт брондалды, деректер жиналды",
      "night.d3": "Сағат 8:00-дегі қорытындыңызда",
      "when.eyebrow": "Клиенттер қашан жазады",
      "when.title": "Клиенттеріңіз жұмыс кестесіне қарамайды.",
      "when.c1.when": "Ашылмай тұрып",
      "when.c1.msg": "«Бүгін жұмыс істейсіздер ме? Жазылмай-ақ келуге бола ма?»",
      "when.c2.when": "Клиентпен отырсыз",
      "when.c2.msg": "«Тіс тазалау қанша тұрады?»",
      "when.c3.when": "Ақыры демалып жатырсыз",
      "when.c3.msg": "«Сенбі күні таңертең бос уақыт бар ма?»",
      "when.c4.time": "Жс 10:15",
      "when.c4.when": "Демалыс күніңіз",
      "when.c4.msg": "«Сейсенбідегі жазылуымды ауыстыруым керек.»",
      "when.foot": "Әрқайсысы бірнеше секундта жауап алады. Ешқайсысы үшін телефонды алудың қажеті жоқ.",
      "role.eyebrow": "Көмекші, алмастырушы емес",
      "role.title": "Ол түнгі ауысымды алады. Ал клиенттер бәрібір сізге келеді.",
      "role.lead": "Бот сіздің жұмысыңызды істемейді. Ол сізді телефонға байлап қоятын бөлікті — бағаларды, кестені, «бос уақыт бар ма» деген сұрақтарды — өз мойнына алып, адам керек болған сәтке бәрін дайындайды. Ол адам — сізсіз.",
      "role.f1.h": "Күнделікті сұрақтарға жауап береді",
      "role.f1.p": "Бағалар, жұмыс уақыты, мекенжай, өзімен не алу керек — тікелей өз сайтыңыздан.",
      "role.f2.h": "Деректерді жинайды",
      "role.f2.p": "Аты-жөні, байланысы, не керек, қашан ыңғайлы. Сіз ұзын хат алмасуды емес, қысқа қорытындыны аласыз.",
      "role.f3.h": "Адамға береді",
      "role.f3.p": "Медициналық, жеке немесе күмәнді нәрсенің бәрі сізге беріледі — контекст алдын ала жазылып қойылады.",
      "role.f4.h": "Ешқашан өзін адам етіп көрсетпейді",
      "role.f4.p": "Ол өзін сіздің көмекшіңіз ретінде таныстырады және тек сіз айтқанды ғана айтады.",
      "demo.eyebrow": "Түнде не болады",
      "demo.title": "Олар 23:14-те жазылады. Сіз 8:00-де бір ғана қорытынды оқисыз.",
      "demo.lead": "Бот сіздің қызметкеріңіз сияқты жауап береді, өйткені ол тек сіз берген ақпаратты біледі. Содан кейін маңыздысын жазып қояды — сіз бір басумен растай, қайта қоңырау шала немесе бас тарта аласыз.",
      "demo.cta": "Біздің ботпен сөйлесіп көріңіз",
      "chat.m1": "Сәлеметсіз бе! Осы сенбіге балаяжға орын бар ма?",
      "chat.m2": "Сәлеметсіз бе! Балаяж $140-дан басталады, шамамен 3 сағатқа созылады. Сенбіде 10:00 немесе 13:30 бос. Қайсысы ыңғайлы?",
      "chat.m3": "10:00. Алғаш рет жасатамын, шашым қара түсті",
      "chat.m4": "Жазып алдым — Анна түсті алдын ала ойластыруы үшін айтып қоямын. Уақытты бекіту үшін атыңыз бен нөміріңізді жазасыз ба?",
      "chat.m5": "Мия, 555 0142",
      "chat.m6": "Рақмет, Мия! Сенбі 10:00 сізге брондалды — Анна таңертең растайды.",
      "brief.aria": "Таңғы қорытынды мысалы",
      "brief.kicker": "08:00 · Аннаға",
      "brief.tag": "Сіз керексіз",
      "brief.who": "Кім",
      "brief.who.v": "Мия · 555 0142",
      "brief.wants": "Не керек",
      "brief.wants.v": "Балаяж, алғаш рет",
      "brief.when": "Қашан",
      "brief.when.v": "Сб 10:00 — брондалды",
      "brief.note": "Ескерту",
      "brief.note.v": "Шашы қара, түсін ойластыру керек",
      "brief.more": "+ түнде тағы 7 жауап — бағалар, кесте, көлік тұрағы. Басқа ештеңе сізді қажет етпейді.",
      "how.eyebrow": "Қалай жұмыс істейді",
      "how.title": "Апталар емес, бірнеше минутта іске қосылады.",
      "how.s1.h": "Сайтыңызды беріңіз",
      "how.s1.p": "Бір сілтеме жеткілікті. Қызметтеріңізді, бағаларды, кестені және ережелерді өз беттеріңізден аламыз. Білім қорын жазудың қажеті жоқ.",
      "how.s2.h": "Қай жерде жауап беретінін таңдаңыз",
      "how.s2.p": "Telegram, WhatsApp, Instagram, сайттағы чат — немесе төртеуі де. Бір бот, барлық жерде бірдей жауаптар.",
      "how.s3.h": "Сізді қашан шақыру керегін айтыңыз",
      "how.s3.p": "Не жинау керектігін және адам қашан қосылатынын қарапайым тілмен айтыңыз. Біз бәрін тегін баптаймыз.",
      "ch.eyebrow": "Арналар",
      "ch.title": "Сізге қай жерде жазса да — бір бот.",
      "ch.1.p": "Клиенттер тауып, бөлісіп, қайта оралатын сіздің атыңыздағы бот.",
      "ch.2.p": "Клиенттеріңіздің телефонында сақталған нөмірден жауап береді.",
      "ch.3.name": "Instagram Direct",
      "ch.3.p": "Жазбаларыңыздың астындағы «қанша тұрады?» деген сұрақтарды жауапсыз хабарламаға емес, жазылуға айналдырады.",
      "ch.4.name": "Сайттағы чат",
      "ch.4.p": "Бір жол код — және сол бот сайтыңыздың бұрышында пайда болады.",
      "sec.eyebrow": "Құпиялылық",
      "sec.title": "Бір бот. Бір орта. Бір бизнес.",
      "sec.lead": "Клиенттердің аты-жөні, жазылу туралы ескертпелер мен телефон нөмірлері ортақ үйіндіде жатпауы керек. Сіздің ботыңыздың өз ортасы және өз деректері бар.",
      "sec.c1": "<strong>Ешнәрсе араласпайды.</strong> Сіздің деректеріңіз басқа бизнестің ботына ешқашан қолжетімді болмайды.",
      "sec.c2": "<strong>Деректеріңіз — сіздікі.</strong> Бізге берген ештеңеңіз ортақ модельді оқытуға пайдаланылмайды.",
      "sec.c3": "<strong>Жою — шынымен жою.</strong> Аккаунтты жапсаңыз, орта да бірге жойылады.",
      "price.eyebrow": "Бағасы",
      "price.title": "Бір ғана қарапайым тариф.",
      "price.period": "айына",
      "price.note": "Ай сайын төленеді. Келісімшартсыз, қосылу ақысыз, әр хабарлама үшін ақысыз. Аптасына бір жіберіп алған жазылудан да арзан.",
      "price.cta": "Бот жасау",
      "price.i1": "Төрт арнаның бәрі — Telegram, WhatsApp, Instagram, сайт",
      "price.i2": "Шексіз әңгімелер, күндіз де, түнде де",
      "price.i3": "Клиент деректері жиналып, сізге қорытындыланады",
      "price.i4": "Сіздің жұмыс тәсіліңізге сай адамға беру",
      "price.i5": "Сайт пен бағалар ботпен үнемі сәйкес",
      "price.i6": "Бірдеңе өзгерту керек болғанда жазуға болатын нақты адам",
      "faq.eyebrow": "Сұрақтар",
      "faq.title": "Бізден жиі сұрайтындар.",
      "faq.q1": "Ол менің әкімшімді алмастыра ма?",
      "faq.a1": "Жоқ. Ол ресепшнде ешкім жоқ сағаттарды және күніне жиырма рет жауап беруге тура келетін сұрақтарды жабады. Командаңыз аз алаңдайды, ал клиенттер жақсырақ дайындалып келеді.",
      "faq.q2": "Ал жауабын білмесе ше?",
      "faq.a2": "Ол мұны ашық айтады, клиенттің деректерін алып, әңгімені сізге береді. Ол ешқашан бағаны, уақытты немесе диагнозды ойдан шығармайды.",
      "faq.q3": "Клиенттер ботпен сөйлесіп тұрғанын біле ме?",
      "faq.a3": "Иә — ол өзін сіздің көмекшіңіз ретінде таныстырады. Адамдарға бот кедергі емес; оларға «иә, сенбіде жұмыс істейміз» деген жауапты таңертеңге дейін күту ұнамайды.",
      "faq.q4": "Менде клиника да, салон да жоқ. Маған жарай ма?",
      "faq.a4": "Егер клиенттер сатып алмас немесе жазылмас бұрын сізге сұрақпен жазса — жарайды. Жай ғана түнгі 23:00-дегі хабарламалар клиникалар мен салондарда тезірек жиналады.",
      "faq.q5": "Баптау шынымен қанша уақыт алады?",
      "faq.a5": "Сайтыңыздан жұмыс істейтін бот жасауға бірнеше минут кетеді. Жазылу, еске салғыштар немесе кестеңізге жол қосу керек болса — айтыңыз, біз оны қосымша ақысыз қосамыз.",
      "cta.title": "Ноутбукті жабыңыз. <em>Бәрін өзім реттеймін.</em>",
      "cta.sub": "Сайтыңыздың сілтемесін қойыңыз — бот бірнеше минутта жауап бере бастайды. Немесе жиырма минутқа кездесу белгілеңіз, бәрін бірге баптаймыз.",
      "cta.placeholder": "sizdin-biznes.kz",
      "cta.input": "Сіздің сайтыңыз",
      "cta.button": "Бот жасау",
      "cta.alt": "Әлі дайын емессіз бе?",
      "cta.talk": "Алдымен бізбен сөйлесіңіз",
      "cta.try": "Ботымызды Telegram-да сынап көріңіз",
      "footer.aria": "Төменгі мәзір",
      "footer.pricing": "Бағасы",
      "footer.privacy": "Құпиялылық",
      "footer.faq": "Сұрақтар",
      "footer.contact": "Байланыс"
    }
  };

  /* ── apply ─────────────────────────────────────────────────────────── */
  var original = null; // English, read from the page the first time we translate

  function snapshot() {
    original = { html: new Map(), attr: new Map() };
    var meta = document.querySelector('meta[name="description"]');
    original.title = document.title;
    original.description = meta ? meta.getAttribute("content") : "";
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      original.html.set(el, el.innerHTML);
    });
    document.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
      var saved = {};
      el.getAttribute("data-i18n-attr").split(";").forEach(function (pair) {
        var attr = pair.split(":")[0].trim();
        saved[attr] = el.getAttribute(attr);
      });
      original.attr.set(el, saved);
    });
  }

  function apply(lang) {
    if (!original) snapshot();
    var dict = STRINGS[lang] || {};
    var t = function (key, fallback) { return dict[key] != null ? dict[key] : fallback; };

    document.documentElement.lang = lang;
    document.title = t("meta.title", original.title);
    var meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", t("meta.description", original.description));

    original.html.forEach(function (html, el) {
      el.innerHTML = t(el.getAttribute("data-i18n"), html);
    });
    original.attr.forEach(function (saved, el) {
      el.getAttribute("data-i18n-attr").split(";").forEach(function (pair) {
        var parts = pair.split(":");
        var attr = parts[0].trim(), key = parts[1].trim();
        el.setAttribute(attr, t(key, saved[attr]));
      });
    });

    document.querySelectorAll("[data-lang-current]").forEach(function (el) {
      el.textContent = SHORT[lang];
    });
    document.querySelectorAll("[data-set-lang]").forEach(function (btn) {
      var on = btn.getAttribute("data-set-lang") === lang;
      btn.setAttribute("aria-current", on ? "true" : "false");
    });
  }

  function reveal() {
    document.documentElement.classList.remove("i18n-pending");
  }

  function wireSwitcher() {
    document.querySelectorAll("[data-lang-switch]").forEach(function (menu) {
      menu.addEventListener("click", function (e) {
        var btn = e.target.closest("[data-set-lang]");
        if (!btn) return;
        var lang = btn.getAttribute("data-set-lang");
        store(lang);
        apply(lang);
        menu.open = false;
        menu.querySelector("summary").focus();
      });
      menu.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && menu.open) {
          menu.open = false;
          menu.querySelector("summary").focus();
        }
      });
    });
    // close the menu on any click outside it
    document.addEventListener("click", function (e) {
      document.querySelectorAll("[data-lang-switch][open]").forEach(function (menu) {
        if (!menu.contains(e.target)) menu.open = false;
      });
    });
  }

  /* ── boot ──────────────────────────────────────────────────────────── */
  var lang = detect();
  document.documentElement.lang = lang;
  if (lang !== "en") {
    document.documentElement.classList.add("i18n-pending");
    setTimeout(reveal, 1500); // never leave the page hidden if something breaks
  }

  document.addEventListener("DOMContentLoaded", function () {
    try {
      apply(lang);
      wireSwitcher();
    } finally {
      reveal();
    }
  });
})();
