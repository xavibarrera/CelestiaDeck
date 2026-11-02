const fs = require('fs');
const path = require('path');

const majorCards = [
  {
    id: 0,
    name: 'El Loco',
    nameEn: 'The Fool',
    arcana: 'major',
    number: 0,
    romanNumeral: '0',
    keywords: ['Nuevos comienzos', 'Espontaneidad', 'Inocencia', 'Confianza'],
    element: 'Aire',
    astrologyRef: 'Urano',
    iconName: 'Compass',
    upright: {
      general: 'Momento de dar un salto de fe guiado por la curiosidad y la pureza de intención.',
      love: 'Apertura a nuevas conexiones sin el peso de patrones del pasado.',
      work: 'Iniciativas frescas, proyectos innovadores y valentía para explorar nuevos caminos.',
      advice: 'Permítete ser principiante sin la exigencia de saberlo todo desde el inicio.'
    },
    reversed: {
      general: 'Dudas o impulsividad no meditada. Necesidad de aterrizar los impulsos con serenidad.',
      advice: 'Tómate una pausa para verificar que tus pasos nacen de la inspiración y no de la prisa por escapar.'
    },
    reflectionQuestion: '¿Qué paso valiente darías hoy si supieras que la experiencia en sí misma es el mayor regalo?'
  },
  {
    id: 1,
    name: 'El Mago',
    nameEn: 'The Magician',
    arcana: 'major',
    number: 1,
    romanNumeral: 'I',
    keywords: ['Manifestación', 'Recursos internos', 'Enfoque', 'Poder creador'],
    element: 'Aire',
    astrologyRef: 'Mercurio',
    iconName: 'Wand2',
    upright: {
      general: 'Cuentas con todas las herramientas necesarias para materializar tu visión.',
      love: 'Comunicación clara, magnetismo y capacidad para alinear afecto y verdad.',
      work: 'Capacidad resolutiva, elocuencia y dominio técnico para sacar adelante tus ideas.',
      advice: 'Concentra tu energía en una sola prioridad a la vez para ver florecer tus dones.'
    },
    reversed: {
      general: 'Dispersión de talento o sensación de no estar aprovechando todo tu potencial.',
      advice: 'Revisa qué recursos ya posees antes de buscar validación o herramientas externas.'
    },
    reflectionQuestion: '¿Cuál de tus habilidades naturales estás subestimando en este momento?'
  },
  {
    id: 2,
    name: 'La Sacerdotisa',
    nameEn: 'The High Priestess',
    arcana: 'major',
    number: 2,
    romanNumeral: 'II',
    keywords: ['Intuición', 'Mundo interior', 'Sabiduría oculta', 'Serenidad'],
    element: 'Agua',
    astrologyRef: 'Luna',
    iconName: 'Moon',
    upright: {
      general: 'Tu brújula interna habla con claridad cuando silencias el ruido exterior.',
      love: 'Conexión profunda y comprensión mutua sin necesidad de sobreexplicarse.',
      work: 'Observa la dinámica antes de actuar; la paciencia estratégica revelará la mejor opción.',
      advice: 'Dedica tiempo al silencio, el descanso consciente y la escucha de tus corazonadas.'
    },
    reversed: {
      general: 'Desconexión de tu intuición por sobreanálisis racional o influencias ajenas.',
      advice: 'Vuelve a tu centro con respiración consciente y confía en lo que sientes en tu cuerpo.'
    },
    reflectionQuestion: '¿Qué verdad interna ya conoces pero aún dudas en reconocer?'
  },
  {
    id: 3,
    name: 'La Emperatriz',
    nameEn: 'The Empress',
    arcana: 'major',
    number: 3,
    romanNumeral: 'III',
    keywords: ['Nutrición', 'Creatividad', 'Abundancia', 'Amor propio'],
    element: 'Tierra',
    astrologyRef: 'Venus',
    iconName: 'Sparkles',
    upright: {
      general: 'Época fértil para crear, embellecer tu entorno y tratarte con profunda amabilidad.',
      love: 'Calidez, ternura y vínculos donde el cuidado mutuo florece con generosidad.',
      work: 'Ideas que maduran con éxito; ambiente propicio para cultivar proyectos sostenibles.',
      advice: 'Honra tus sentidos: aliméntate bien, rodéate de naturaleza y celebra tu cuerpo.'
    },
    reversed: {
      general: 'Desgaste por cuidar a los demás olvidándote de tus propias necesidades.',
      advice: 'Restaura tus reservas energéticas antes de seguir entregando a tu entorno.'
    },
    reflectionQuestion: '¿De qué forma concreta puedes nutrirte hoy como tu propia prioridad?'
  },
  {
    id: 4,
    name: 'El Emperador',
    nameEn: 'The Emperor',
    arcana: 'major',
    number: 4,
    romanNumeral: 'IV',
    keywords: ['Estructura', 'Límites saludables', 'Estabilidad', 'Liderazgo'],
    element: 'Fuego',
    astrologyRef: 'Aries',
    iconName: 'Shield',
    upright: {
      general: 'Capacidad para poner orden con templanza y construir bases firmes a largo plazo.',
      love: 'Seguridad, compromiso y acuerdos claros que brindan tranquilidad al corazón.',
      work: 'Organización metódica, disciplina serena y claridad en la toma de decisiones.',
      advice: 'Establece límites amables pero firmes para proteger tu tiempo y tu paz.'
    },
    reversed: {
      general: 'Rigidez mental o exceso de control que genera tensión innecesaria.',
      advice: 'Aprende a delegar y recuerda que la verdadera fuerza sabe adaptarse al cambio.'
    },
    reflectionQuestion: '¿Qué límite protector te brindaría mayor serenidad en tu día a día?'
  },
  {
    id: 5,
    name: 'El Sumo Sacerdote',
    nameEn: 'The Hierophant',
    arcana: 'major',
    number: 5,
    romanNumeral: 'V',
    keywords: ['Valores', 'Tradición viva', 'Mentores', 'Conocimiento'],
    element: 'Tierra',
    astrologyRef: 'Tauro',
    iconName: 'BookOpen',
    upright: {
      general: 'Búsqueda de significado, aprendizaje de quienes han caminado antes y coherencia ética.',
      love: 'Valores compartidos y construcción de un proyecto vital con cimientos éticos.',
      work: 'Formación continua, trabajo en equipo guiado por principios sólidos.',
      advice: 'Conecta con tus principios fundamentales para tomar decisiones sin vacilar.'
    },
    reversed: {
      general: 'Cuestionamiento de normas rígidas que ya no resuenan con tu evolución.',
      advice: 'Encuentra tu propia filosofía de vida manteniendo el respeto por tu proceso.'
    },
    reflectionQuestion: '¿Qué valor esencial guía tus elecciones cuando las cosas se complican?'
  },
  {
    id: 6,
    name: 'Los Enamorados',
    nameEn: 'The Lovers',
    arcana: 'major',
    number: 6,
    romanNumeral: 'VI',
    keywords: ['Alineación', 'Elección consciente', 'Armonía', 'Vínculo'],
    element: 'Aire',
    astrologyRef: 'Géminis',
    iconName: 'Heart',
    upright: {
      general: 'Integración de polaridades internas y elecciones tomadas desde el corazón auténtico.',
      love: 'Afinidad profunda, complicidad y apertura honesta hacia el otro.',
      work: 'Alianzas fluidas y decisiones profesionales basadas en tus pasiones genuinas.',
      advice: 'Elige siempre aquello que te acerque más a la versión íntegra de ti mismo.'
    },
    reversed: {
      general: 'Dilema interno o discrepancia entre lo que deseas y lo que crees deber hacer.',
      advice: 'Aclara tus prioridades antes de comprometerte para evitar autoengaños.'
    },
    reflectionQuestion: '¿Qué decisión actual te pide elegir desde el amor en lugar de desde el miedo?'
  },
  {
    id: 7,
    name: 'El Carro',
    nameEn: 'The Chariot',
    arcana: 'major',
    number: 7,
    romanNumeral: 'VII',
    keywords: ['Determinación', 'Autodominio', 'Progreso', 'Victoria interior'],
    element: 'Agua',
    astrologyRef: 'Cáncer',
    iconName: 'Milestone',
    upright: {
      general: 'Avance decidido superando contradicciones internas gracias a tu voluntad centrada.',
      love: 'Superación conjunta de obstáculos con honestidad y dirección compartida.',
      work: 'Impulso profesional imparable; tus esfuerzos constantes comienzan a dar frutos.',
      advice: 'Mantén la mirada en tu objetivo sin permitir que las dudas pasajeras te desvíen.'
    },
    reversed: {
      general: 'Sensación de pérdida de control o sobreesfuerzo que agota tu vitalidad.',
      advice: 'Reajusta la velocidad: a veces desacelerar es la forma más rápida de no descarrilar.'
    },
    reflectionQuestion: '¿Hacia dónde estás orientando tu energía principal en esta etapa?'
  },
  {
    id: 8,
    name: 'La Fuerza',
    nameEn: 'Strength',
    arcana: 'major',
    number: 8,
    romanNumeral: 'VIII',
    keywords: ['Compasión', 'Paciencia', 'Valentía suave', 'Aceptación'],
    element: 'Fuego',
    astrologyRef: 'Leo',
    iconName: 'SunMedium',
    upright: {
      general: 'La verdadera fuerza no impone ni domina: acoge con ternura las emociones intensas.',
      love: 'Empatía y calidez que desarman cualquier defensiva en tus relaciones.',
      work: 'Resiliencia ante la frustración; superas retos con serenidad y diplomacia.',
      advice: 'Trata a tus partes más vulnerables con la misma gentileza que tendrías con un amigo.'
    },
    reversed: {
      general: 'Dudas sobre tu propia capacidad o dureza autocrítica innecesaria.',
      advice: 'Sustituye la autoexigencia por la autocompasión; eres más fuerte de lo que crees.'
    },
    reflectionQuestion: '¿Cómo puedes ser hoy más paciente y comprensivo contigo mismo?'
  },
  {
    id: 9,
    name: 'El Ermitaño',
    nameEn: 'The Hermit',
    arcana: 'major',
    number: 9,
    romanNumeral: 'IX',
    keywords: ['Introspección', 'Luz interior', 'Pausa reflexiva', 'Autenticidad'],
    element: 'Tierra',
    astrologyRef: 'Virgo',
    iconName: 'Lantern',
    upright: {
      general: 'Retiro consciente para ordenar tus pensamientos y reencontrarte con tu sabiduría.',
      love: 'Necesidad de espacio personal para comprender tus deseos antes de compartirlos.',
      work: 'Investigación solitaria, análisis reflexivo y trabajo enfocado de alta calidad.',
      advice: 'Valora tus momentos a solas; en el silencio se gestan las respuestas más lúcidas.'
    },
    reversed: {
      general: 'Aislamiento excesivo o resistencia a recibir apoyo cuando lo necesitas.',
      advice: 'Comparte tu luz; reflexionar en soledad es valioso, pero no te cierres al mundo.'
    },
    reflectionQuestion: '¿Qué respuesta estás buscando afuera que solo encontrarás en tu calma interior?'
  },
  {
    id: 10,
    name: 'La Rueda de la Fortuna',
    nameEn: 'Wheel of Fortune',
    arcana: 'major',
    number: 10,
    romanNumeral: 'X',
    keywords: ['Ciclos', 'Cambio evolutivo', 'Oportunidad', 'Fluidez'],
    element: 'Fuego',
    astrologyRef: 'Júpiter',
    iconName: 'RefreshCw',
    upright: {
      general: 'La vida se mueve en espirales naturales; se avecina un cambio favorable si abrazas el flujo.',
      love: 'Giro positivo en la dinámica vincular; sincronicidades y encuentros oportunos.',
      work: 'Nuevas circunstancias que abren puertas que antes parecían cerradas.',
      advice: 'Acepta lo que no puedes controlar y concéntrate en responder con optimismo y madurez.'
    },
    reversed: {
      general: 'Resistencia a un cambio natural que genera sensación de estancamiento.',
      advice: 'Recuerda que cada fase tiene un propósito formativo; confía en el ritmo del proceso.'
    },
    reflectionQuestion: '¿Qué ciclo en tu vida está listo para cerrarse o renovarse?'
  },
  {
    id: 11,
    name: 'La Justicia',
    nameEn: 'Justice',
    arcana: 'major',
    number: 11,
    romanNumeral: 'XI',
    keywords: ['Verdad', 'Equilibrio', 'Causa y efecto', 'Integridad'],
    element: 'Aire',
    astrologyRef: 'Libra',
    iconName: 'Scale',
    upright: {
      general: 'Claridad mental para sopesar opciones con objetividad, honestidad y equidad.',
      love: 'Transparencia, reciprocidad y resolución de desacuerdos con respeto.',
      work: 'Contratos justos, reconocimiento del mérito y decisiones bien fundamentadas.',
      advice: 'Actúa con impecabilidad en tus acuerdos; la verdad siempre simplifica el camino.'
    },
    reversed: {
      general: 'Percepción de injusticia o tendencia a juzgarte con excesiva severidad.',
      advice: 'Evalúa la situación con objetividad y busca el equilibrio interno sin rencores.'
    },
    reflectionQuestion: '¿En qué área de tu vida necesitas restablecer un trato más justo y honesto?'
  },
  {
    id: 12,
    name: 'El Colgado',
    nameEn: 'The Hanged Man',
    arcana: 'major',
    number: 12,
    romanNumeral: 'XII',
    keywords: ['Nueva perspectiva', 'Soltar el control', 'Pausa fértil', 'Rendición'],
    element: 'Agua',
    astrologyRef: 'Neptuno',
    iconName: 'Eye',
    upright: {
      general: 'Ver las cosas desde un ángulo diferente transforma los problemas en aprendizajes.',
      love: 'Paciencia y comprensión; soltar la necesidad de que el otro cambie en tus tiempos.',
      work: 'Pausa productiva; a veces no hacer nada permite que la solución se revele sola.',
      advice: 'Suelta la lucha con la realidad; en la rendición consciente nace la verdadera paz.'
    },
    reversed: {
      general: 'Postergación innecesaria o resistencia a aceptar que se requiere un cambio de enfoque.',
      advice: 'Pregúntate qué ganas manteniendo una postura que ya ha demostrado no funcionar.'
    },
    reflectionQuestion: 'Si miraras tu situación actual con los ojos del agradecimiento, ¿qué verías?'
  },
  {
    id: 13,
    name: 'La Transformación',
    nameEn: 'Death / Transformation',
    arcana: 'major',
    number: 13,
    romanNumeral: 'XIII',
    keywords: ['Renovación', 'Cierre de ciclo', 'Metamorfosis', 'Espacio nuevo'],
    element: 'Agua',
    astrologyRef: 'Escorpio',
    iconName: 'Feather',
    upright: {
      general: 'El otoño de una etapa da paso a una primavera más luminosa y auténtica.',
      love: 'Transformación profunda de dinámicas desgastadas para permitir un vínculo más maduro.',
      work: 'Conclusión natural de un proyecto o rol que ya cumplió su misión educativa.',
      advice: 'Despídete con gratitud de lo que ya fue; estás dejando espacio para lo que mereces.'
    },
    reversed: {
      general: 'Apego a lo familiar por miedo a la incertidumbre del cambio.',
      advice: 'Recuerda que aferrarse a hojas secas no impide que el árbol siga creciendo.'
    },
    reflectionQuestion: '¿Qué creencia o hábito antiguo estás listo para liberar con amor?'
  },
  {
    id: 14,
    name: 'La Templanza',
    nameEn: 'Temperance',
    arcana: 'major',
    number: 14,
    romanNumeral: 'XIV',
    keywords: ['Alquimia', 'Moderación', 'Paz interior', 'Armonización'],
    element: 'Fuego',
    astrologyRef: 'Sagitario',
    iconName: 'Flame',
    upright: {
      general: 'Mezcla armoniosa de contrarios; sanación gradual a través del equilibrio constante.',
      love: 'Diálogo conciliador, ternura cotidiana y complementariedad enriquecedora.',
      work: 'Ritmo sostenible que evita el agotamiento; integración de talento diverso.',
      advice: 'Busca el término medio; la moderación y la calma son tu mejor medicina.'
    },
    reversed: {
      general: 'Extremos emocionales o excesos que desestabilizan tu bienestar integral.',
      advice: 'Vuelve a los hábitos simples de descanso, hidratación y sosiego.'
    },
    reflectionQuestion: '¿Qué dos aspectos de tu vida necesitan hoy encontrarse en un punto medio?'
  },
  {
    id: 15,
    name: 'La Sombra',
    nameEn: 'The Devil / The Shadow',
    arcana: 'major',
    number: 15,
    romanNumeral: 'XV',
    keywords: ['Consciencia de sombra', 'Apegos', 'Liberación', 'Honestidad radical'],
    element: 'Tierra',
    astrologyRef: 'Capricornio',
    iconName: 'Key',
    upright: {
      general: 'Reconocer tus dependencias y miedos ocultos es el primer paso para desarticularlos.',
      love: 'Observa si hay dinámicas de apego ansioso o necesidad de validación externa.',
      work: 'Atención a la autoexigencia obsesiva o al miedo al fracaso que paraliza.',
      advice: 'Mira tu sombra sin culpa: lo que se ilumina con honestidad pierde su poder sobre ti.'
    },
    reversed: {
      general: 'Ruptura de viejas cadenas; toma de consciencia liberadora sobre tus verdaderos deseos.',
      advice: 'Celebra cada paso hacia tu autonomía y perdónate por errores del pasado.'
    },
    reflectionQuestion: '¿A qué pensamiento o hábito le estás entregando tu poder personal?'
  },
  {
    id: 16,
    name: 'El Despertar',
    nameEn: 'The Tower / Awakening',
    arcana: 'major',
    number: 16,
    romanNumeral: 'XVI',
    keywords: ['Revelación', 'Liberación súbita', 'Verdad deslumbrante', 'Reinicio'],
    element: 'Fuego',
    astrologyRef: 'Marte',
    iconName: 'Zap',
    upright: {
      general: 'Derrumbe de ilusiones que permite ver la realidad tal como es, liberándote de ataduras.',
      love: 'Una conversación clarificadora elimina suposiciones y deja ver la verdad del vínculo.',
      work: 'Un cambio inesperado resulta ser la oportunidad perfecta para redefinir tu rumbo.',
      advice: 'No temas al cambio repentino: solo cae aquello construido sobre cimientos falsos.'
    },
    reversed: {
      general: 'Intento de sostener estructuras obsoletas por temor a la reconstrucción.',
      advice: 'Acepta el desenlace natural; cuanto antes sueltes, antes florecerá lo nuevo.'
    },
    reflectionQuestion: '¿Qué verdad incómoda pero liberadora está lista para ser asumida?'
  },
  {
    id: 17,
    name: 'La Estrella',
    nameEn: 'The Star',
    arcana: 'major',
    number: 17,
    romanNumeral: 'XVII',
    keywords: ['Esperanza', 'Sanación', 'Inspiración', 'Propósito'],
    element: 'Aire',
    astrologyRef: 'Acuario',
    iconName: 'Sparkle',
    upright: {
      general: 'Claridad celestial, optimismo sereno y confianza renovada en el porvenir.',
      love: 'Generosidad emocional, autenticidad y fe compartida en un futuro luminoso.',
      work: 'Inspiración artística o profesional; tus talentos se alinean con tu propósito.',
      advice: 'Comparte tu vulnerabilidad con el mundo; tu autenticidad inspira a otros.'
    },
    reversed: {
      general: 'Pesimismo pasajero o desconexión de tus sueños más queridos.',
      advice: 'Recuerda momentos en que todo parecía difícil y lograste salir adelante.'
    },
    reflectionQuestion: '¿Qué sueño olvidado merece hoy un rayo de tu atención y esperanza?'
  },
  {
    id: 18,
    name: 'La Luna',
    nameEn: 'The Moon',
    arcana: 'major',
    number: 18,
    romanNumeral: 'XVIII',
    keywords: ['Inconsciente', 'Imaginación', 'Sensibilidad', 'Misterio'],
    element: 'Agua',
    astrologyRef: 'Piscis',
    iconName: 'MoonStar',
    upright: {
      general: 'Territorio de sueños, emociones profundas e intuiciones sutiles que piden ser sentidas.',
      love: 'Momento de cuidar las interpretaciones erróneas y comunicarse sin proyectar miedos.',
      work: 'Creatividad desbordante; excelente para arte, psicología e investigación introspectiva.',
      advice: 'No tomes decisiones drásticas bajo la niebla emocional; espera a que salga el sol.'
    },
    reversed: {
      general: 'Dispersión de dudas y superación de temores que antes parecían gigantes.',
      advice: 'Distingue entre tus temores imaginados y los hechos tangibles del presente.'
    },
    reflectionQuestion: '¿Qué emoción oculta necesita hoy tu validación sin juicios?'
  },
  {
    id: 19,
    name: 'El Sol',
    nameEn: 'The Sun',
    arcana: 'major',
    number: 19,
    romanNumeral: 'XIX',
    keywords: ['Alegría', 'Claridad', 'Vitalidad', 'Éxito radiante'],
    element: 'Fuego',
    astrologyRef: 'Sol',
    iconName: 'Sun',
    upright: {
      general: 'Luz radiante, calidez en el corazón y celebración de la vida en su plenitud sencilla.',
      love: 'Transparencia, afecto generoso, complicidad y dicha compartida.',
      work: 'Reconocimiento claro, proyectos prósperos y energía desbordante para crear.',
      advice: 'Disfruta el momento presente con gratitud sincera; comparte tu entusiasmo.'
    },
    reversed: {
      general: 'Dificultad temporal para apreciar tus propios logros o cansancio pasajero.',
      advice: 'Sal al aire libre, busca la luz solar y reconecta con actividades lúdicas sencillas.'
    },
    reflectionQuestion: '¿Por qué motivos concretos puedes felicitarte hoy con orgullo y alegría?'
  },
  {
    id: 20,
    name: 'El Juicio',
    nameEn: 'Judgement',
    arcana: 'major',
    number: 20,
    romanNumeral: 'XX',
    keywords: ['Llamado interior', 'Despertar', 'Perdón', 'Renacimiento'],
    element: 'Fuego',
    astrologyRef: 'Plutón',
    iconName: 'Bell',
    upright: {
      general: 'Llamado a elevarte sobre antiguos errores, perdonar el pasado y renacer con lucidez.',
      love: 'Superación de viejos rencores; comprensión madura que renueva el vínculo.',
      work: 'Vocación que se hace evidente; momento de responder a tu auténtico propósito.',
      advice: 'Perdónate con generosidad; cada paso anterior fue necesario para llegar aquí.'
    },
    reversed: {
      general: 'Autojuicio implacable o demora en responder a lo que sabes que debes hacer.',
      advice: 'Silencia el crítico interior y concédete una nueva oportunidad de comenzar.'
    },
    reflectionQuestion: '¿Qué parte de tu historia estás listo para perdonar y soltar definitivamente?'
  },
  {
    id: 21,
    name: 'El Mundo',
    nameEn: 'The World',
    arcana: 'major',
    number: 21,
    romanNumeral: 'XXI',
    keywords: ['Plenitud', 'Integración', 'Culminación', 'Celebración holística'],
    element: 'Tierra',
    astrologyRef: 'Saturno',
    iconName: 'Globe',
    upright: {
      general: 'Cierre de ciclo magistral; todas las piezas encajan y sientes armonía con el universo.',
      love: 'Madurez emocional, plenitud compartida y sensación de hogar interior.',
      work: 'Metas alcanzadas con éxito; sensación de dominio y reconocimiento consolidado.',
      advice: 'Celebra tu recorrido vital; contempla lo lejos que has llegado con admiración.'
    },
    reversed: {
      general: 'Detalles finales pendientes que impiden saborear el éxito completado.',
      advice: 'Asegúrate de atar los últimos cabos para cerrar el ciclo con serenidad total.'
    },
    reflectionQuestion: '¿Qué gran aprendizaje de tu camino merece hoy una celebración íntima?'
  }
];

const suitsInfo = [
  {
    suit: 'copas',
    nameEs: 'Copas',
    element: 'Agua',
    theme: 'Emociones, afecto, intuición y empatía',
    icon: 'HeartHandshake'
  },
  {
    suit: 'oros',
    nameEs: 'Oros',
    element: 'Tierra',
    theme: 'Mundo material, cuerpo, recursos, estabilidad y proyectos',
    icon: 'Coins'
  },
  {
    suit: 'espadas',
    nameEs: 'Espadas',
    element: 'Aire',
    theme: 'Pensamiento, claridad mental, verdad, decisiones y comunicación',
    icon: 'Brain'
  },
  {
    suit: 'bastos',
    nameEs: 'Bastos',
    element: 'Fuego',
    theme: 'Voluntad, creatividad, pasión, entusiasmo y acción',
    icon: 'Flame'
  }
];

const minorRankDescriptions = {
  1: {
    rank: 'As',
    uprightKw: ['Semilla', 'Potencial puro', 'Nuevo inicio'],
    revKw: ['Retraso temporal', 'Energía bloqueada'],
    gen: 'Surge una chispa inicial llena de posibilidades vírgenes.',
    adv: 'Da el primer paso sin esperar tener todas las respuestas resueltas.',
    revGen: 'El impulso existe pero necesita un canal más claro para no dispersarse.',
    revAdv: 'Clarifica tus motivaciones antes de actuar con precipitación.',
    q: '¿Qué nueva oportunidad en esta área de tu vida está esperando tu sí?'
  },
  2: {
    rank: 'Dos',
    uprightKw: ['Dualidad', 'Equilibrio', 'Elección'],
    revKw: ['Desbalance', 'Duda'],
    gen: 'Momento de armonizar dos polos o sopesar una decisión constructiva.',
    adv: 'Encuentra el punto medio donde ambas opciones puedan coexistir.',
    revGen: 'Tensión entre dos alternativas que resta energía a tu día a día.',
    revAdv: 'Prioriza lo que te traiga paz mental a largo plazo.',
    q: '¿Qué equilibrio necesitas restablecer hoy con honestidad?'
  },
  3: {
    rank: 'Tres',
    uprightKw: ['Expansión', 'Comunidad', 'Crecimiento inicial'],
    revKw: ['Falta de sincronía', 'Aislamiento'],
    gen: 'Las primeras manifestaciones se hacen visibles y la energía se multiplica.',
    adv: 'Comparte tus avances y celebra con quienes apoyan tu crecimiento.',
    revGen: 'Pequeñas discrepancias en el grupo que requieren empatía.',
    revAdv: 'Alinea expectativas mediante una conversación pausada.',
    q: '¿Con quiénes puedes colaborar para enriquecer tu camino?'
  },
  4: {
    rank: 'Cuatro',
    uprightKw: ['Estabilidad', 'Consolidación', 'Seguridad'],
    revKw: ['Estancamiento', 'Inflexibilidad'],
    gen: 'Bases firmes que brindan protección y tranquilidad.',
    adv: 'Agradece la estabilidad lograda y descansa en tu estructura.',
    revGen: 'Zona de confort que comienza a sentirse como una jaula sutil.',
    revAdv: 'Abre una ventana a la espontaneidad sin descuidar tu seguridad.',
    q: '¿Qué cimientos te brindan la seguridad necesaria para explorar?'
  },
  5: {
    rank: 'Cinco',
    uprightKw: ['Reto', 'Aprendizaje', 'Punto de inflexión'],
    revKw: ['Conflicto innecesario', 'Fatiga'],
    gen: 'Aparece un desafío que pone a prueba tu resiliencia y te invita a madurar.',
    adv: 'Mira el reto como un maestro que te enseña a afinar tu postura.',
    revGen: 'Desgaste por luchar en batallas que no te corresponden.',
    revAdv: 'Elige tus batallas con sabiduría y preserva tu energía.',
    q: '¿Qué lección valiosa te está enseñando este reto actual?'
  },
  6: {
    rank: 'Seis',
    uprightKw: ['Armonía recuperada', 'Reciprocidad', 'Transición serena'],
    revKw: ['Apego nostálgico', 'Desequilibrio en el dar'],
    gen: 'Las aguas se calman; recibes apoyo y recuperas la confianza.',
    adv: 'Da y recibe en igual medida; permite que otros te ayuden.',
    revGen: 'Quedarte anclado en cómo eran las cosas en lugar de vivirlas hoy.',
    revAdv: 'Agradece el recuerdo pero camina con los pies en el presente.',
    q: '¿De qué manera puedes ofrecer hoy un gesto generoso a tu entorno?'
  },
  7: {
    rank: 'Siete',
    uprightKw: ['Evaluación', 'Estrategia', 'Perseverancia'],
    revKw: ['Dudas', 'Impaciencia'],
    gen: 'Pausa para evaluar si tus métodos siguen alineados con tus metas.',
    adv: 'No te apresures a cosechar antes de que el fruto madure.',
    revGen: 'Frustración por no ver resultados inmediatos a tus esfuerzos.',
    revAdv: 'Confía en los tiempos invisibles de la siembra.',
    q: '¿Qué ajuste estratégico te permitiría cuidar mejor tu tiempo?'
  },
  8: {
    rank: 'Ocho',
    uprightKw: ['Maestría', 'Dedicación', 'Movimiento enfocado'],
    revKw: ['Rutina agotadora', 'Perfeccionismo'],
    gen: 'Compromiso diario con lo que amas; el progreso se vuelve palpable.',
    adv: 'Disfruta del proceso de pulir tus habilidades con paciencia.',
    revGen: 'Perfeccionismo que te roba la alegría del aprendizaje.',
    revAdv: 'Permítete crear sin buscar la perfección absoluta.',
    q: '¿Qué práctica diaria te acerca más a tu maestría interior?'
  },
  9: {
    rank: 'Nueve',
    uprightKw: ['Culminación', 'Resiliencia', 'Satisfacción'],
    revKw: ['Cansancio acumulado', 'Guardia alta'],
    gen: 'Estás a un paso de la meta; contempla con gratitud tu fortaleza.',
    adv: 'Mantén la calma y el aliento final; has superado lo más difícil.',
    revGen: 'Estar a la defensiva por heridas pasadas que ya no están aquí.',
    revAdv: 'Baja las defensas en los espacios seguros y respira hondo.',
    q: '¿Qué logro personal merece hoy tu reconocimiento y respeto?'
  },
  10: {
    rank: 'Diez',
    uprightKw: ['Plenitud', 'Fin de ciclo', 'Legado'],
    revKw: ['Sobrecarga', 'Resistencia a soltar'],
    gen: 'Completitud de una etapa; cosecha abundante y visión compartida.',
    adv: 'Saborea la satisfacción de haber completado este tramo del camino.',
    revGen: 'Cargar con responsabilidades ajenas que no te corresponden.',
    revAdv: 'Aprende a delegar y suelta lo que ya cumplió su función.',
    q: '¿Qué estás listo para completar con honra y gratitud?'
  },
  11: {
    rank: 'Sota',
    uprightKw: ['Curiosidad', 'Mensaje inspirador', 'Mente de aprendiz'],
    revKw: ['Inmadurez', 'Distracción'],
    gen: 'Una actitud fresca y receptiva abre puertas insospechadas.',
    adv: 'Aprende con entusiasmo infantil y haz preguntas sinceras.',
    revGen: 'Dificultad para mantener el enfoque en una sola tarea.',
    revAdv: 'Aterriza tus ideas escribiéndolas y dando un paso a la vez.',
    q: '¿Qué tema o experiencia te despierta genuina curiosidad hoy?'
  },
  12: {
    rank: 'Caballero',
    uprightKw: ['Acción audaz', 'Impulso', 'Búsqueda activa'],
    revKw: ['Precipitación', 'Obstinación'],
    gen: 'Energía en marcha para defender tus ideales y alcanzar tus metas.',
    adv: 'Acompaña tu entusiasmo con prudencia para que la carrera sea duradera.',
    revGen: 'Prisa excesiva que puede provocar tropiezos innecesarios.',
    revAdv: 'Asegúrate de que tu prisa no atropelle tus necesidades básicas.',
    q: '¿Qué causa o proyecto merece hoy tu valentía y dedicación?'
  },
  13: {
    rank: 'Reina',
    uprightKw: ['Madurez interior', 'Comprensión profunda', 'Gracia'],
    revKw: ['Inseguridad oculta', 'Exigencia'],
    gen: 'Dominio sereno de tu elemento; guías con el ejemplo y la calidez.',
    adv: 'Confía en tu autoridad natural basada en la experiencia y la empatía.',
    revGen: 'Dudar de tu propio valor o cerrarte por miedo al juicio ajeno.',
    revAdv: 'Reconecta con tu poder sereno sin necesidad de demostrar nada a nadie.',
    q: '¿Cómo puedes liderar tu vida hoy desde la compasión y la firmeza?'
  },
  14: {
    rank: 'Rey',
    uprightKw: ['Sabiduría consolidada', 'Estabilidad amplia', 'Generosidad'],
    revKw: ['Autoritarismo', 'Desconexión emocional'],
    gen: 'Capacidad de gobernar tu mundo interno con templanza, justicia y visión.',
    adv: 'Usa tu influencia para crear bienestar tanto para ti como para quienes te rodean.',
    revGen: 'Rigidez en los principios que desconecta del sentir del momento.',
    revAdv: 'Flexibiliza tu perspectiva y escucha con el corazón abierto.',
    q: '¿Qué decisión tomada desde tu madurez más profunda resolvería esta situación?'
  }
};

const minorCards = [];
let cardId = 22;

suitsInfo.forEach((suitObj) => {
  for (let num = 1; num <= 14; num++) {
    const desc = minorRankDescriptions[num];
    const name = `${desc.rank} de ${suitObj.nameEs}`;
    const nameEn = `${desc.rank} of ${suitObj.suit}`;

    let specificLove = '';
    let specificWork = '';

    if (suitObj.suit === 'copas') {
      specificLove = `Conexión emocional profunda y diálogo afectivo honesto. ${desc.adv}`;
      specificWork = `Inspiración empática y relaciones de trabajo armoniosas.`;
    } else if (suitObj.suit === 'oros') {
      specificLove = `Estabilidad tangible, gestos prácticos de cuidado y lealtad.`;
      specificWork = `Resultados concretos, orden financiero y crecimiento profesional seguro.`;
    } else if (suitObj.suit === 'espadas') {
      specificLove = `Conversaciones que aclaran malentendidos y establecen acuerdos sanos.`;
      specificWork = `Estrategia brillante, agudeza intelectual y toma de decisiones objetiva.`;
    } else {
      specificLove = `Pasión compartida, entusiasmo renovado y proyectos ilusionantes juntos.`;
      specificWork = `Creatividad enérgica, liderazgo motivador y audacia para innovar.`;
    }

    minorCards.push({
      id: cardId++,
      name: name,
      nameEn: nameEn,
      arcana: 'minor',
      suit: suitObj.suit,
      number: num,
      keywords: desc.uprightKw,
      element: suitObj.element,
      astrologyRef: `${desc.rank} (${suitObj.element})`,
      iconName: suitObj.icon,
      upright: {
        general: `${desc.gen} En el ámbito de ${suitObj.nameEs.toLowerCase()}, resalta ${suitObj.theme.toLowerCase()}.`,
        love: specificLove,
        work: specificWork,
        advice: desc.adv
      },
      reversed: {
        general: `${desc.revGen} Señal de reflexión sobre cómo gestionas tu energía en esta área.`,
        advice: desc.revAdv
      },
      reflectionQuestion: desc.q
    });
  }
});

const allCards = [...majorCards, ...minorCards];
console.log('Total cards generated:', allCards.length);

const outPath = path.join(__dirname, '../src/utils/tarotDeck.json');
fs.writeFileSync(outPath, JSON.stringify(allCards, null, 2));
console.log('Successfully wrote:', outPath);
