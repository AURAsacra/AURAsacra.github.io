// Canonical National Liturgical Calendars & Regional Heritage Resolution Engine
// Ensures every nationality (universal, it, ro, gr, ru, ge, rs, es, fr, de, en, pt),
// Christian faith tradition (catholic, traditional, orthodox, protestant, ecumenical),
// and interface language (it, en, ro, fr, es, pt, de, ru, la) receives accurate saints & feasts.

export const SUPPORTED_NATIONALITIES = [
  'universal', 'it', 'ro', 'gr', 'ru', 'ge', 'rs', 'es', 'fr', 'de', 'en', 'pt'
];

// Days in ORTHODOX_SAINTS_CALENDAR that are Pan-Orthodox / Universal Feasts of the Lord,
// the Mother of God, the Apostles, Prophets, or Early Church Fathers, even if originally
// tagged with a geographic code in the raw table.
export const PAN_ORTHODOX_UNIVERSAL_DATES = new Set([
  '1-1', '1-3', '1-4', '1-5', '1-6', '1-7', '1-8', '1-9', '1-10', '1-11',
  '1-16', '1-17', '1-18', '1-20', '1-21', '1-22', '1-25', '1-26', '1-28', '1-29', '1-30', '1-31',
  '2-1', '2-2', '2-3', '2-5', '2-8', '2-10', '2-11', '2-17', '2-24',
  '3-9', '3-17', '3-18', '3-25', '3-26', '3-30',
  '4-1', '4-23', '4-25', '4-30',
  '5-2', '5-5', '5-6', '5-7', '5-8', '5-9', '5-10', '5-12', '5-13', '5-14', '5-15', '5-16', '5-17', '5-18', '5-19', '5-20', '5-21', '5-22', '5-24', '5-25', '5-26', '5-28', '5-29', '5-30', '5-31',
  '6-1', '6-3', '6-6', '6-8', '6-9', '6-11', '6-12', '6-14', '6-19', '6-24', '6-29', '6-30',
  '7-1', '7-8', '7-11', '7-15', '7-17', '7-20', '7-22', '7-24', '7-25', '7-26', '7-27',
  '8-1', '8-2', '8-6', '8-15', '8-16', '8-29', '8-31',
  '9-1', '9-5', '9-6', '9-8', '9-9', '9-13', '9-14', '9-16', '9-17', '9-20', '9-23', '9-24', '9-26',
  '10-1', '10-2', '10-3', '10-6', '10-9', '10-18', '10-20', '10-23', '10-26', '10-28',
  '11-1', '11-8', '11-11', '11-12', '11-13', '11-14', '11-16', '11-21', '11-24', '11-25', '11-30',
  '12-4', '12-5', '12-6', '12-8', '12-9', '12-12', '12-13', '12-15', '12-17', '12-20', '12-22', '12-24', '12-25', '12-27', '12-28', '12-29', '12-30', '12-31'
]);

// Infers the true historical/national origin of any Western/Ecumenical saint in DAILY_SAINTS_CALENDAR
export function inferSaintNationality(saint, dateKey = '') {
  if (!saint) return 'universal';
  if (saint.nationality && saint.nationality !== 'it') {
    return saint.nationality.toLowerCase();
  }

  const text = `${saint.name || ''} ${saint.name_it || ''} ${saint.title || ''} ${saint.bio || ''}`.toLowerCase();

  // 1. Universal Biblical, Apostolic, Marian (Universal), and Early Church Feasts
  if (
    /mother of god|madre di dio|epiphany|epifania|theophany|baptism of the lord|battesimo del signore|presentation of the lord|presentazione del signore|annunciation|annunciazione|transfiguration|trasfigurazione|exaltation of the holy cross|esaltazione della santa croce|all saints|tutti i santi|all souls|fedeli defunti|immaculate conception|immacolata concezione|nativity of the lord|natale del signore|christmas|holy family|sacra famiglia|holy innocents|santi innocenti|most holy name|santissimo nome|chair of st\. peter|cattedra di san pietro|conversion of st\. paul|conversione di san paolo|guardian angels|angeli custodi|archangels michael|arcangeli michele|synaxis|apostle|apostolo|apostoli|evangelist|evangelista|forerunner|battista|john the baptist|giovanni battista|mary magdalene|maria maddalena|martha|marta|lazarus|lazzaro|stephen|stefano protomartire|joachim and anna|gioacchino e anna|st\. joseph|san giuseppe|assumption of the blessed virgin|assunzione della beata vergine|nativity of the blessed virgin|natività della beata vergine|visitation of the blessed virgin|visitazione della beata vergine|queenship of the blessed virgin|beata vergine maria regina|our lady of sorrows|beata vergine maria addolorata|presentation of the blessed virgin|presentazione della beata vergine|dedication of the lateran|dedicazione della basilica/i.test(text)
  ) {
    return 'universal';
  }

  // Early Church Fathers & Universal Martyrs (Antioch, Smyrna, Alexandria, Cappadocia, Palestine, North Africa, Syria, Myra, Sebaste, Nicomedia)
  if (
    /ignatius of antioch|ignazio di antiochia|polycarp|policarpo|irenaeus|ireneo|athanasius|atanasio|basil the great|basilio magno|gregory nazianzen|gregorio nazianzeno|gregory of nyssa|gregorio di nissa|john chrysostom|giovanni crisostomo|cyril of alexandria|cirillo di alessandria|cyril of jerusalem|cirillo di gerusalemme|ephrem|efrem|john of damascus|giovanni damasceno|anthony the great|antonio abate|pachomius|pacomio|sabbas|saba|nicholas|nicola di bari|nicola di mira|george|giorgio martire|blaise|biagio|agatha|agata|lucy|lucia|sebastian|sebastiano|lawrence|lorenzo|agnes|agnese|cecilia|perpetua|felicity|felicita|cyprian|cipriano|augustine of hippo|agostino d'ippona|monica|jerome|girolamo|justin martyr|giustino|cosmas and damian|cosma e damiano|charbel|barbara|catherine of alexandria|caterina d'alessandria|apollonia|polycarp|three holy hierarchs|tre santi gerarchi|forty martyrs|quaranta martiri/i.test(text)
  ) {
    return 'universal';
  }

  // 2. Romania & Moldavia (ro)
  if (
    /romania|moldavia|moldova|suceava|iași|iasi|putna|cernica|neamț|neamt|tismana|argeș|arges|niculițel|niculitel|durostorum|dobrogea|brâncoveanu|brancoveanu|ștefan cel mare|stephen the great|parascheva|philothea|filofteia|callinicus|calinic|sihla|bistrița|bistrita|partoș|partos|antim ivireanul|șaguna|saguna|dosoftei|varlaam|ghermano|cassian|casian|dionysius exiguus|dionigi il piccolo/i.test(text)
  ) {
    return 'ro';
  }

  // 3. Greece & Mount Athos (gr)
  if (
    /mount athos|monte athos|athonite|atonita|palamas|paisios|paisio|porphyrios|porfirio|nektarios of aegina|nettario di egina|spyridon|spiridione|kefalonia|zakynthos|silouan|silvano del monte athos|hagiorite|aghiorita|nicodemus the hagiorite|photios|fozio|mark of ephesus|marco di efeso|thessalonica|tessalonica|corfu|crete|chios|patmos/i.test(text)
  ) {
    return 'gr';
  }

  // 4. Slavic & Rus Tradition (ru)
  if (
    /sarov|radonezh|radonež|nevsky|nevskij|kiev|kyiv|moscow|mosca|optina|kronstadt|kronštadt|zadonsk|pochayiv|počaev|petersburg|pietroburgo|vladimir|olga|boris and gleb|boris e gleb|rublev|rublëv|chernigov|polotsk|slavs|slavi|cyril and methodius|cirillo e metodio|josaphat|giosafat/i.test(text)
  ) {
    return 'ru';
  }

  // 5. Georgia & Caucasus (ge)
  if (
    /georgia|georgian|nina|nino|tamar|david the builder|davide il costruttore|mtskheta|tbilisi|iveron|abkhazia|caucasus|caucaso/i.test(text)
  ) {
    return 'ge';
  }

  // 6. Serbia & Balkans (rs)
  if (
    /serbia|sava|ostrog|kosovo|ohrid|žiča|zica|velimirović|velimirovic|popović|popovic|ćelije|celije|studenica|nemanjic|nemanja|rila/i.test(text)
  ) {
    return 'rs';
  }

  // 7. Spain & Hispanic Americas (es)
  if (
    /spain|spagna|spanish|spagnolo|ávila|avila|loyola|guzmán|guzman|peñafort|penyafort|seville|siviglia|javier|xavier|saverio|john of the cross|giovanni della croce|teresa of jesus|teresa di gesù|isidore|isidoro|ferdinand|ferdinando|guadalupe|juan diego|lima|rosa da lima|rose of lima|martín de porres|martin de porres|romero|el salvador|claver|pilar|zaragoza|compostela|vicente ferrer|vincenzo ferreri|josé de calasanz|giuseppe calasanzio|turibius|toribio/i.test(text)
  ) {
    return 'es';
  }

  // 8. France & Gallic Tradition (fr)
  if (
    /france|francia|french|francese|lisieux|clairvaux|chiaravalle|vincent de paul|vincenzo de' paoli|vianney|curé d'ars|curato d'ars|francis de sales|francesco di sales|chantal|joan of arc|giovanna d'arco|lourdes|bernadette|alacoque|paray-le-monial|louis ix|ludovico|luigi ix|denis|dionigi di parigi|martin of tours|martino di tours|geneviève|genoveffa|hilary of poitiers|ilario di poitiers|caesarius of arles|cesario di arles|cluny|odilo|taizé|calvin|calvino/i.test(text)
  ) {
    return 'fr';
  }

  // 9. Germany & Central Europe (de)
  if (
    /germany|germania|german|tedesco|boniface|bonifacio|hildegard|ildegarda|bingen|albert the great|alberto magno|cologne|colonia|elizabeth of hungary|elisabetta d'ungheria|thuringia|edith stein|teresa benedetta della croce|kolbe|auschwitz|canisius|canisio|hedwig|edvige|scholastica|bonhoeffer|luther|lutero|wittenberg|reformation|riforma|bach|zinzendorf|melanchthon|ansgar|ansgario|bruno of cologne|bruno di colonia|fidelis of sigmaringen|fedele da sigmaringen|wolfgang|wenceslaus|venceslao|adalbert of prague|adalberto di praga|stanislaus|stanislao|casimir|casimiro|faustina|john paul ii|giovanni paolo ii/i.test(text)
  ) {
    return 'de';
  }

  // 10. Anglosphere & British Isles (en)
  if (
    /ireland|irlanda|irish|england|inghilterra|english|inglese|scotland|scozia|scottish|wales|galles|british|britannico|america|american|americano|patrick|patrizio|brigid of kildare|brigida d'irlanda|columba|colombano|aidan|bede|beda|thomas more|tommaso moro|john fisher|giovanni fisher|thomas becket|tommaso becket|canterbury|newman|wesley|wilberforce|lewis|tyndale|spurgeon|bunyan|müller|muller|elizabeth ann seton|elisabetta anna seton|john neumann|giovanni neumann|kateri|drexel|cabrini|jim elliot|edward the confessor|edoardo il confessore|dunstan|anselm of canterbury|gildas|david of wales|davide di menevia/i.test(text)
  ) {
    return 'en';
  }

  // 11. Portugal & Lusophone Tradition (pt)
  if (
    /portugal|portogallo|portuguese|portoghese|lisbon|lisbona|fátima|fatima|elizabeth of portugal|elisabetta del portogallo|john of god|giovanni di dio|anthony of padua|antonio di padova|anchieta|aparecida|galvão|marto|braga|coimbra/i.test(text)
  ) {
    return 'pt';
  }

  // 12. Italy & Roman Western Tradition (it)
  if (
    /assisi|siena|rome|roma|roman|romano|milan|milano|nursia|norcia|pietrelcina|padre pio|bosco|torino|turin|aquino|aquinas|cascia|rita|philip neri|filippo neri|borromeo|clare|chiara|bonaventure|bonaventura|peter damian|pietro damiani|gregory the great|gregorio magno|leo the great|leone magno|ambrose|ambrogio|januarius|gennaro|naples|napoli|liguori|camillus|camillo|zaccaria|merici|brescia|galgani|lucca|gonzaga|moscati|goretti|florence|firenze|venice|venezia|bologna|padua|padova|vercelli|eusebius of vercelli|eusebio di vercelli|paulinus of nola|paolino di nola|chromatius|cromazio|aquileia/i.test(text)
  ) {
    return 'it';
  }

  return 'universal';
}

// Curated National Patron Saints & Feasts per Nationality (keyed by nationality -> 'M-D' -> array of saints)
// Each entry includes complete 9-language names, titles, quotes, and bios.
export const NATIONAL_SAINTS_BY_DATE = {
  ro: {
    '1-30': [
      {
        traditions: ['orthodox', 'catholic', 'ecumenical', 'all'],
        nationality: 'ro',
        color: 'red',
        rank: 'solemnity',
        name: 'The Three Holy Hierarchs: Basil the Great, Gregory the Theologian & John Chrysostom',
        name_it: 'I Tre Santi Gerarchi: Basilio Magno, Gregorio il Teologo e Giovanni Crisostomo',
        name_ro: 'Sfinții Trei Ierarhi: Vasile cel Mare, Grigorie Teologul și Ioan Gură de Aur',
        name_ru: 'Собор Трех Святителей: Василия Великого, Григория Богослова и Иоанна Златоуста',
        name_la: 'Sancti Tres Hierarchae: Basilius, Gregorius et Ioannes Chrysostomus',
        name_es: 'Los Tres Santos Jerarcas: Basilio el Grande, Gregorio el Teólogo y Juan Crisóstomo',
        name_fr: 'Les Trois Saints Hiérarques : Basile le Grand, Grégoire le Théologien et Jean Chrysostome',
        name_de: 'Die Drei Heiligen Hierarchen: Basilius der Große, Gregor der Theologe und Johannes Chrysostomus',
        name_pt: 'Os Três Santos Hierarcas: Basílio Magno, Gregório o Teólogo e João Crisóstomo',
        title: 'Protectors of Theological Schools & Pillars of Orthodox Faith',
        title_it: 'Patroni delle Scuole Teologiche e Colonne della Fede Ortodossa',
        title_ro: 'Ocrotitorii învățământului teologic românesc și Stâlpii Dreptei Credințe',
        title_ru: 'Вселенские учители и покровители духовного просвещения',
        quote: '«Let us honor in one accord the three great luminaries of the Three-Sun Deity, who enlightened the whole world with rays of divine doctrines.»',
        quote_it: '«Onoriamo insieme i tre massimi luminari della Divinità Trisolare, che hanno illuminato il mondo con i raggi dei divini dogmi.»',
        quote_ro: '«Pe cei trei mari luminători ai Dumnezeirii celei strălucitoare, care au luminat lumea cu razele dumnezeieștilor dogme, să-i lăudăm!»',
        quote_ru: '«Три великие светила Трисолнечного Божества, вселенную лучами божественных догматов просветившие, восхвалим!»',
        bio: 'Venerated with special solemnity in Romania (since the 1639 Monastery of the Three Hierarchs in Iași) as patrons of Christian education and theological unity.',
        bio_it: 'Venerati con speciale solennità in Romania (celebre il Monastero dei Tre Gerarchi a Iași del 1639) come patroni della cultura e della teologia cristiana.',
        bio_ro: 'Sărbătoriți cu o evlavie deosebită în România (cinstiți la Mănăstirea Sfinții Trei Ierarhi din Iași, ctitoria lui Vasile Lupu din 1639) ca ocrotitori ai școlilor teologice.',
        bio_ru: 'Особо торжественно почитаются в Румынии и во всем православном мире как небесные покровители богословских школ.',
        scriptureRef: 'Hebrews 13:7-8'
      }
    ],
    '4-11': [
      {
        traditions: ['orthodox', 'ecumenical', 'all'],
        nationality: 'ro',
        color: 'blue',
        rank: 'feast',
        name: 'St. Callinicus of Cernica, Bishop of Râmnic & Wonderworker',
        name_it: 'San Callinico di Cernica, Vescovo di Râmnic e Taumaturgo',
        name_ro: 'Sfântul Ierarh Calinic de la Cernica, Episcopul Râmnicului',
        name_ru: 'Святитель Каллиник Черникский, епископ Рымникский, чудотворец',
        name_la: 'Sanctus Callinicus Cernicensis Episcopus',
        name_es: 'San Calínico de Cernica, Obispo de Râmnic y Taumaturgo',
        name_fr: 'Saint Callinique de Cernica, Évêque de Râmnic et Thaumaturge',
        name_de: 'Hl. Kallinikos von Cernica, Bischof von Râmnic',
        name_pt: 'São Calínico de Cernica, Bispo de Râmnic e Taumaturgo',
        title: 'Great Hesychast Abbot of Cernica, Builder of Churches & Father of the Poor',
        title_it: 'Grande Abate Esicasta di Cernica, Costruttore di Chiese e Padre dei Poveri',
        title_ro: 'Marele stareț isihast de la Cernica, ctitor de mănăstiri și părinte milostiv al săracilor',
        title_ru: 'Великий игумен Черникский, молитвенник и милостивый архипастырь Румынии',
        quote: '«Nothing belongs to me on this earth; everything I receive I return immediately into the hands of Christ in the poor.»',
        quote_it: '«Nulla mi appartiene su questa terra: tutto ciò che ricevo lo restituisco subito nelle mani di Cristo nei poveri.»',
        quote_ro: '«Nimic nu este al meu pe acest pământ; tot ceea ce primesc întorc îndată în mâinile lui Hristos prin săraci.»',
        quote_ru: '«Ничто не принадлежит мне на земле: все, что получаю, возвращаю в руки Христа через нищих.»',
        bio: 'Abbot of Cernica Monastery for 32 years and Bishop of Râmnic (1787–1868); lived on bread and water, healed the sick through prayer, founded Frăsinei Monastery, and left zero coins at his death.',
        bio_it: 'Abate del monastero di Cernica per 32 anni e vescovo di Râmnic (1787–1868); visse in digiuno e preghiera del cuore, edificò chiese e scuole e donò ogni bene ai bisognosi.',
        bio_ro: 'Stareț al Mănăstirii Cernica timp de 32 de ani și Episcop al Râmnicului (1787–1868); mare postitor, făcător de minuni, ctitor al Mănăstirii Frăsinei și tipograf de cărți sfinte.',
        bio_ru: 'Настоятель монастыря Черника и епископ Рымникский; прославился строгим постом, даром прозорливости и исцелений.',
        scriptureRef: 'Matthew 6:19-21'
      }
    ],
    '5-15': [
      {
        traditions: ['orthodox', 'ecumenical', 'all'],
        nationality: 'ro',
        color: 'blue',
        rank: 'feast',
        name: 'St. Jacob of Putna (Iacob Putneanul), Metropolitan of Moldavia',
        name_it: 'San Giacomo di Putna (Iacob Putneanul), Metropolita di Moldavia',
        name_ro: 'Sfântul Ierarh Iacob Putneanul, Mitropolitul Moldovei',
        name_ru: 'Святитель Иаков Путнянский, митрополит Молдавский',
        name_la: 'Sanctus Iacobus Putnensis, Metropolita Moldaviae',
        name_es: 'San Jacobo de Putna, Metropolitano de Moldavia',
        name_fr: 'Saint Jacques de Putna, Métropolite de Moldavie',
        name_de: 'Hl. Jakob von Putna, Metropolit der Moldau',
        name_pt: 'São Jacó de Putna, Metropolita da Moldávia',
        title: 'Enlightener of Youth, Protector of Putna Monastery & Merciful Hierarch',
        title_it: 'Illuminatore della Gioventù, Custode del Monastero di Putna e Pastore Misericordioso',
        title_ro: 'Luminătorul pruncilor și al școlilor, înnoitorul Mănăstirii Putna și Părintele orfanilor',
        title_ru: 'Просветитель Молдавии, обновитель монастыря Путна и милостивый святитель',
        quote: '«Educate the children in the light of the Gospel and clothe the poor with mercy, for in them Christ Himself knocks at the door of our hearts.»',
        quote_it: '«Istruite i fanciulli nella luce del Vangelo e rivestite i poveri di misericordia, poiché in loro Cristo stesso bussa al nostro cuore.»',
        quote_ro: '«Învățați pe prunci în lumina Evangheliei și îmbrăcați pe cei săraci cu milostenie, căci în ei Însuși Hristos bate la ușa inimii noastre!»',
        quote_ru: '«Наставляйте детей в свете Евангелия и одевайте бедных милосердием, ибо в них Сам Христос стучит в наши сердца.»',
        bio: 'Entered Putna Monastery at age 12 (1719–1778); as Metropolitan of Moldavia he printed the first Romanian school primer (Bucovina/Moldavia, 1755), defended the faithful, restored Putna Monastery, and retired in humble hesychastic prayer.',
        bio_it: 'Entrato a 12 anni nel monastero di Putna (1719–1778), divenne Metropolita di Moldavia; stampò il primo abbecedario in lingua romena per i bambini (1755), restaurò Putna e visse in profonda preghiera esicasta.',
        bio_ro: 'Intrat de la 12 ani în obștea Mănăstirii Putna (1719–1778), a păstorit ca Mitropolit al Moldovei (1750–1760), tipărind primul Abecedar românesc (1755), apărând pe cei săraci și înnoind lavra lui Ștefan cel Mare.',
        bio_ru: 'С 12 лет подвизался в монастыре Путна; будучи митрополитом Молдавским, издал первый румынский букварь, обновил обитель Путна и преставился в схиме.',
        scriptureRef: 'Matthew 19:14'
      }
    ],
    '7-2': [
      {
        traditions: ['orthodox', 'ecumenical', 'all'],
        nationality: 'ro',
        color: 'red',
        rank: 'solemnity',
        name: 'Right-Believing Voivode Stephen the Great and Holy (Ștefan cel Mare și Sfânt)',
        name_it: 'Santo Voivoda Stefano il Grande di Moldavia (Ștefan cel Mare și Sfânt)',
        name_ro: 'Binecredinciosul Voievod Ștefan cel Mare și Sfânt',
        name_ru: 'Благоверный воевода Стефан Великий и Святой, господарь Молдавский',
        name_la: 'Sanctus Stephanus Magnus Palatinus Moldaviae',
        name_es: 'San Esteban el Grande y Santo de Moldavia',
        name_fr: 'Saint Étienne le Grand, Voïvode de Moldavie',
        name_de: 'Hl. Stephan der Große, Woiwode der Moldau',
        name_pt: 'Santo Estêvão o Grande, Voivoda da Moldávia',
        title: 'Defender of Christendom & Builder of Putna and 44 Monasteries',
        title_it: 'Difensore della Cristianità e Fondatore di Putna e di 44 Monasteri',
        title_ro: 'Apărătorul creștinătății și Ctitorul Mănăstirii Putna și a zeci de sfinte lăcașuri',
        title_ru: 'Защитник христианского мира и ктитор монастыря Путна и сорока четырех храмов',
        quote: '«Not by our strength, but by the power of the Lord of Hosts and the prayers of the Mother of God have we conquered; to God alone be the glory!»',
        quote_it: '«Non per la nostra forza, ma per la potenza del Signore degli Eserciti abbiamo vinto: a Dio solo sia la gloria!»',
        quote_ro: '«Nu cu puterea noastră, ci cu ajutorul Domnului Savaot și cu rugăciunile Maicii Domnului am biruit; lui Dumnezeu singur I se cuvine slava!»',
        quote_ru: '«Не нашей силою, но помощью Господа Саваофа мы победили; Единому Богу да будет слава!»',
        bio: 'Ruled Moldavia for 47 years (1457–1504), fasting on bread and water before battles, building a monastery or church after every victory (Putna, Voroneț, Neamț) and richly endowing Mount Athos.',
        bio_it: 'Regnò sulla Moldavia per 47 anni (1457–1504) difendendo l’Europa cristiana; edificò Putna, Voroneț e Neamț con digiuno e umiltà evangelica.',
        bio_ro: 'A domnit în Moldova timp de 47 de ani (1457–1504), apărând neamul și credința creștină; a zidit Mănăstirea Putna, Voronețul și Neamțul, odihnindu-se în pace la Putna.',
        bio_ru: 'Правил Молдавией 47 лет, защищая православную веру и воздвигнув прославленные монастыри Путна, Воронец и Нямц.',
        scriptureRef: 'Psalm 20:7-8'
      }
    ],
    '8-5': [
      {
        traditions: ['orthodox', 'ecumenical', 'all'],
        nationality: 'ro',
        color: 'blue',
        rank: 'feast',
        name: 'St. John Jacob of Neamț ( the Chozebite)',
        name_it: 'San Giovanni Giacomo di Neamț (il Cozebita)',
        name_ro: 'Sfântul Cuvios Ioan Iacob de la Neamț (Hozevitul)',
        name_ru: 'Преподобный Иоанн Иаков Нямецкий (Хозевит)',
        name_la: 'Sanctus Ioannes Iacobus Neamtsensis Chozebita',
        name_es: 'San Juan Jacobo de Neamț (el Cozebita)',
        name_fr: 'Saint Jean-Jacques de Neamț (le Chozébite)',
        name_de: 'Hl. Johannes Jakob von Neamț (der Chozebit)',
        name_pt: 'São João Jacó de Neamț (o Cozebita)',
        title: 'Incorrupt Romanian Hermit of the Jordan & Wadi Qelt',
        title_it: 'Eremita Romeno Incorrotto del Giordano e di Wadi Qelt',
        title_ro: 'Sihastrul român de la Iordan și din peștera Sfântului Gheorghe Hozevitul',
        title_ru: 'Румынский отшельник Иорданский и Хозевитский, нетленный чудотворец',
        quote: '«In the land of the Lord I sought only the tears of repentance, keeping the flame of faith burning in the silence of the cave.»',
        quote_it: '«Nella Terra del Signore ho cercato solo le lacrime del pentimento, custodendo la fiamma della fede nel silenzio della grotta.»',
        quote_ro: '«În Țara Sfântă am căutat doar lacrimile pocăinței, păstrând aprinsă candela credinței în tăcerea peșterii.»',
        quote_ru: '«Во Святой Земле искал я лишь слез покаяния, храня светильник веры в безмолвии пещеры.»',
        bio: 'Born in Crăiniceni, Botoșani (1913–1960), professed at Neamț Monastery, lived in strict asceticism in the Judean Desert at St. Anna Cave in Wadi Qelt; his relics were found completely incorrupt in 1980.',
        bio_it: 'Nato a Botoșani (1913–1960), monaco a Neamț e poi eremita in Terra Santa nella gola di Wadi Qelt; il suo corpo fu ritrovato intatto nel 1980.',
        bio_ro: 'Născut în ținutul Botoșanilor (1913–1960), călugărit la Mănăstirea Neamț, s-a nevoit în Țara Sfântă în pustiul Hozevei; moaștele sale au fost aflate întregi și nestricăcioase în 1980.',
        bio_ru: 'Уроженец Ботошан, постриженик Нямецкой лавры, подвизавшийся в пещере Хозевитского ущелья; его мощи обретены нетленными в 1980 году.',
        scriptureRef: 'Hebrews 11:38'
      }
    ],
    '8-7': [
      {
        traditions: ['orthodox', 'ecumenical', 'all'],
        nationality: 'ro',
        color: 'blue',
        rank: 'feast',
        name: 'St. Theodora of Sihla',
        name_it: 'Santa Teodora di Sihla',
        name_ro: 'Sfânta Cuvioasă Teodora de la Sihla',
        name_ru: 'Преподобная Феодора Сихлийская',
        name_la: 'Sancta Theodora Sihlensis',
        name_es: 'Santa Teodora de Sihla',
        name_fr: 'Sainte Théodora de Sihla',
        name_de: 'Hl. Theodora von Sihla',
        name_pt: 'Santa Teodora de Sihla',
        title: 'Flower of Hesychasm in the Carpathian Mountains',
        title_it: 'Fiore dell’Esicasmo nei Monti Carpazi',
        title_ro: 'Floarea duhovnicească a Carpaților și Mireasa rugăciunii neîncetate din Munții Neamțului',
        title_ru: 'Небесный цветок Карпатских гор и молитвенница безмолвия',
        quote: '«The birds of the forest brought her crumbs from the monastery table, and her cave shone with the uncreated light of prayer.»',
        quote_it: '«Gli uccelli del bosco le portavano le briciole del monastero e la sua grotta risplendeva della luce increata dell’orazione.»',
        quote_ro: '«Păsările cerului îi aduceau firimituri de la masa mănăstirii, iar peștera ei strălucea de lumina necreată a rugăciunii inimii.»',
        quote_ru: '«Птицы небесные приносили ей крохи с монастырской трапезы, а пещера ее сияла нетварным светом молитвы.»',
        bio: 'Daughter of the defender of Neamț Fortress who lived for decades unseen in a high rock cave at Sihla, fed by birds and discovered only before her holy communion and repose.',
        bio_it: 'Vissuta per decenni in solitudine tra le rocce dei Carpazi a Sihla in continua preghiera del cuore, nutrita dagli uccelli del cielo.',
        bio_ro: 'S-a nevoit zeci de ani în munții Sihlei în post și rugăciune de foc, fiind hrănită în chip minunat de păsările cerului și împărtășită cu Sfintele Taine înainte de adormire.',
        bio_ru: 'Десятилетиями подвизалась в уединенной скальной пещере Сихлы в Карпатах, питаемая птицами и прославленная светоносным успением.',
        scriptureRef: 'Matthew 6:26'
      }
    ],
    '8-16': [
      {
        traditions: ['orthodox', 'ecumenical', 'all'],
        nationality: 'ro',
        color: 'red',
        rank: 'solemnity',
        name: 'Holy Brâncoveanu Martyrs: Prince Constantine, His Four Sons Constantine, Ștefan, Radu, Matei & Counselor Ianache',
        name_it: 'Santi Martiri Brâncoveanu: il Principe Costantino, i Quattro Figli e il Consigliere Ianache',
        name_ro: 'Sfinții Martiri Brâncoveni: Constantin Vodă cu cei patru fii ai săi Constantin, Ștefan, Radu și Matei, și sfetnicul Ianache',
        name_ru: 'Святые мученики Брынковяну: господарь Константин, четыре его сына и советник Янаке',
        name_la: 'Sancti Martyres Brancoveni: Constantinus Princeps cum Quattuor Filiis et Ianache',
        name_es: 'Santos Mártires Brâncoveanu: el Príncipe Constantino, sus Cuatro Hijos y el Consejero Ianache',
        name_fr: 'Saints Martyrs Brâncoveanu : le Prince Constantin, ses Quatre Fils et le Conseiller Ianache',
        name_de: 'Hll. Märtyrer Brâncoveanu: Fürst Konstantin mit seinen vier Söhnen und Ratgeber Ianache',
        name_pt: 'Santos Mártires Brâncoveanu: o Príncipe Constantino, seus Quatro Filhos e o Conselheiro Ianache',
        title: 'Confessors of the Christian Faith Beheaded at Constantinople (1714)',
        title_it: 'Martiri della Fede Cristiana Decapitati a Costantinopoli (1714)',
        title_ro: 'Mărturisitorii neînfricați ai credinței creștine încununați prin mucenicie la Constantinopol (1714)',
        title_ru: 'Страстотерпцы и исповедники веры Христовой, усеченные мечом в Константинополе (1714)',
        quote: '«My sons, be courageous! We have lost everything we had in this world; let us at least save our souls and wash our sins in our blood for Christ!»',
        quote_it: '«Figli miei, abbiate coraggio! Abbiamo perso tutto ciò che avevamo in questo mondo; salviamo almeno le nostre anime per Cristo!»',
        quote_ro: '«Fiii mei, fiți cu bărbăție! Am pierdut tot ce aveam în această lume; măcar sufletele noastre să nu le pierdem, ci să le dăm lui Hristos!»',
        quote_ru: '«Дети мои, мужайтесь! Мы потеряли все земное; спасем же души наши во Христе!»',
        bio: 'Prince of Wallachia (1688–1714) who refused to renounce Christ to save his life and the lives of his four sons, witnessing their martyrdom before being beheaded himself on August 15, 1714.',
        bio_it: 'Principe di Valacchia che rifiutò di rinnegare Cristo per avere salva la vita, incoraggiando i suoi quattro figli al martirio a Costantinopoli nel 1714.',
        bio_ro: 'Domnul Țării Românești care a refuzat lepădarea de Hristos, îmbărbătându-și cei patru fii și pe sfetnicul Ianache să primească moartea mucenicească în 1714.',
        bio_ru: 'Господарь Валахии, отказавшийся отречься от Христа ради спасения жизни и принявший мученическую смерть вместе с четырьмя сыновьями.',
        scriptureRef: 'Revelation 2:10'
      }
    ],
    '10-14': [
      {
        traditions: ['orthodox', 'ecumenical', 'all'],
        nationality: 'ro',
        color: 'red',
        rank: 'solemnity',
        name: 'St. Paraskeva the New of Iași (Sfânta Cuvioasă Parascheva)',
        name_it: 'Santa Parasceva la Nuova di Iași (Protettrice della Moldavia)',
        name_ro: 'Sfânta Cuvioasă Parascheva de la Iași (Ocrotitoarea Moldovei)',
        name_ru: 'Преподобная Параскева Сербская (Ясская), покровительница Молдавии',
        name_la: 'Sancta Paraskeva Nova Iassiensis',
        name_es: 'Santa Parasceva de Iași, Protectora de Moldavia',
        name_fr: 'Sainte Parascève de Iași, Protectrice de la Moldavie',
        name_de: 'Hl. Paraskeva von Iași, Beschützerin der Moldau',
        name_pt: 'Santa Parasceva de Iași, Protetora da Moldávia',
        title: 'The Much-Helpful Protectress of Moldavia & Romania',
        title_it: 'La Multiausiliatrice e Patrona della Moldavia e della Romania',
        title_ro: 'Mult-folositoarea și Grabnic Ajutătoarea tuturor credincioșilor români',
        title_ru: 'Многоцелебная заступница Молдавии и всего православного народа',
        quote: '«Having loved the desert and embraced the Cross from youth, O Holy Mother Paraskeva, pray unceasingly to Christ for the peace of our souls!»',
        quote_it: '«Avendo amato la preghiera e abbracciato la Croce fin dalla giovinezza, o Santa Parasceva, intercedi presso Cristo per le nostre anime!»',
        quote_ro: '«Iubind liniștea pustiei și urmând lui Hristos din tinerețe, Sfântă Cuvioasă Maică Parascheva, roagă-te neîncetat pentru sufletele noastre!»',
        quote_ru: '«Пустынное и безмолвное житие возлюбивши и во след Христа усердно потекши, преподобная мати Параскево, моли о спасении душ наших!»',
        bio: 'Gave her royal garments to beggars in childhood and lived in angelic prayer in the Jordan desert; since 1641 her incorrupt wonderworking relics rest in the Metropolitan Cathedral of Iași.',
        bio_it: 'Donava le sue vesti ai poveri fin da fanciulla e visse nel deserto del Giordano; dal 1641 le sue reliquie incorrotte sono venerate nella Cattedrale Metropolitana di Iași.',
        bio_ro: 'Și-a dăruit hainele săracilor din copilărie și s-a nevoit în pustiul Iordanului; din anul 1641 sfintele ei moaște ocrotesc Moldova și întreaga Românie în Catedrala Mitropolitană din Iași.',
        bio_ru: 'С юности раздавала одежды нищим и подвизалась в Иорданской пустыне; с 1641 года ее нетленные мощи почивают в митрополичьем соборе города Яссы.',
        scriptureRef: 'Matthew 25:34-36'
      }
    ],
    '10-27': [
      {
        traditions: ['orthodox', 'ecumenical', 'all'],
        nationality: 'ro',
        color: 'red',
        rank: 'solemnity',
        name: 'St. Demetrius the New of Basarabi, Protector of Bucharest',
        name_it: 'San Demetrio il Nuovo di Basarabi, Patrono di Bucarest',
        name_ro: 'Sfântul Cuvios Dimitrie cel Nou din Basarabi, Ocrotitorul Bucureștilor',
        name_ru: 'Преподобный Димитрий Новый, Басарбовский, покровитель Бухареста',
        name_la: 'Sanctus Demetrius Novus Basarabovensis',
        name_es: 'San Demetrio el Nuevo de Basarabi, Protector de Bucarest',
        name_fr: 'Saint Démétrios le Nouveau de Basarabi, Protecteur de Bucarest',
        name_de: 'Hl. Demetrios der Neue von Basarabi, Patron von Bukarest',
        name_pt: 'São Demétrio o Novo de Basarabi, Protetor de Bucareste',
        title: 'Humble Shepherd & Wonderworking Guardian of the Patriarchal Cathedral',
        title_it: 'Umile Pastore ed Eremita, Custode Taumaturgo di Bucarest',
        title_ro: 'Păstorul cel smerit și Făcătorul de minuni din Catedrala Patriarhală din București',
        title_ru: 'Смиренный пастырь и чудотворец Патриаршего собора в Бухаресте',
        quote: '«God exalts the humble in heart: from a quiet cave by the Lom River, He raised Demetrius as a pillar of consolation for the whole nation.»',
        quote_it: '«Dio innalza gli umili di cuore: dalla silenziosa grotta sul fiume Lom ha elevato Demetrio a colonna di consolazione per il popolo.»',
        quote_ro: '«Dumnezeu înalță pe cei smeriți cu inima: din peștera tăcută de pe râul Lom, L-a așezat pe Cuviosul Dimitrie strajă și mângâiere Bucureștilor!»',
        quote_ru: '«Господь возносит смиренных сердцем: из тихой пещеры на реке Лом Он поставил преподобного Димитрия защитником Бухареста.»',
        bio: 'Humble village shepherd who became a cave-monk fasting in silence; his incorrupt relics were brought to Bucharest in 1774, immediately ending the plague.',
        bio_it: 'Umile pastore divenuto monaco eremita in una grotta; nel 1774 le sue reliquie incorrotte furono portate a Bucarest ponendo subito fine alla peste.',
        bio_ro: 'Păstor smerit devenit monah în peștera de pe valea Lomului; în anul 1774 sfintele sale moaște au fost aduse la București, oprind îndată molima ciumei.',
        bio_ru: 'Смиренный пастух, ставший пещерным иноком; в 1774 году его святые мощи были перенесены в Бухарест, чудесно прекратив эпидемию чумы.',
        scriptureRef: 'Luke 1:52'
      }
    ],
    '11-30': [
      {
        traditions: ['orthodox', 'catholic', 'protestant', 'ecumenical', 'all'],
        nationality: 'ro',
        color: 'red',
        rank: 'solemnity',
        name: 'Holy Apostle Andrew the First-Called, Protector of Romania, & St. Andrei Șaguna',
        name_it: 'Sant’Andrea Apostolo il Primo Chiamato, Patrono della Romania, e Sant’Andrea Șaguna',
        name_ro: 'Sfântul Apostol Andrei, cel Întâi Chemat, Ocrotitorul României, și Sfântul Ierarh Andrei Șaguna',
        name_ru: 'Святой апостол Андрей Первозванный, покровитель Румынии, и святитель Андрей (Шагуна)',
        name_la: 'Sanctus Andreas Apostolus Protocletus, Patronus Romaniae',
        name_es: 'San Andrés Apóstol el Primer Llamado, Patrono de Rumanía',
        name_fr: 'Saint André Apôtre le Premier Appelé, Protecteur de la Roumanie',
        name_de: 'Hl. Apostel Andreas der Erstberufene, Schutzpatron Rumäniens',
        name_pt: 'Santo André Apóstolo o Primeiro Chamado, Padroeiro da Romênia',
        title: 'Apostle of Scythia Minor (Dobrogea) & Patron Saint of the Romanian People',
        title_it: 'Apostolo della Scizia Minore (Dobrogea) e Santo Patrono del Popolo Romeno',
        title_ro: 'Apostolul Sciției Mici (Dobrogea) și Părintele credinței apostolești a poporului român',
        title_ru: 'Апостол Малой Скифии (Добруджи) и небесный покровитель румынского народа',
        quote: '«We have found the Messiah, which is, being interpreted, the Christ! Hail, O Cross, sanctified by the body of my Lord!»',
        quote_it: '«Abbiamo trovato il Messia, che significa il Cristo! Salve, o Croce, santificata dal corpo del mio Signore!»',
        quote_ro: '«Am găsit pe Mesia, care se tâlcuiește Hristos! Bucură-te, Cruce sfințită de trupul Stăpânului meu!»',
        quote_ru: '«Мы нашли Мессию, что значит: Христос! Радуйся, Кресте, освященный плотию Господа моего!»',
        bio: 'First disciple called by Jesus at the Jordan; preached the Gospel in Scythia Minor (Dobrogea, Romania) where his cave stands to this day, and suffered martyrdom on an X-shaped cross in Patras.',
        bio_it: 'Primo discepolo chiamato da Gesù al Giordano; evangelizzò la Scizia Minore (Dobrogea, Romania) dove è venerata la sua grotta, e morì martire a Patrasso.',
        bio_ro: 'Cel dintâi ucenic chemat de Mântuitorul la Iordan; a propovăduit Evanghelia în Sciția Mică (Dobrogea), lăsând poporului român credința apostolică.',
        bio_ru: 'Первый ученик Христов, проповедовавший Евангелие в Малой Скифии (Добрудже) и принявший мученическую кончину на кресте в Патрах.',
        scriptureRef: 'John 1:40-42'
      }
    ],
    '12-7': [
      {
        traditions: ['orthodox', 'ecumenical', 'all'],
        nationality: 'ro',
        color: 'red',
        rank: 'feast',
        name: 'Holy Martyr Philothea of Curtea de Argeș (Sfânta Muceniță Filofteia)',
        name_it: 'Santa Martire Filotea di Curtea de Argeș',
        name_ro: 'Sfânta Muceniță Filofteia de la Curtea de Argeș',
        name_ru: 'Святая мученица Филофея Румынская (Куртя-де-Арджешская)',
        name_la: 'Sancta Philothea Virgo et Martyr Argesensis',
        name_es: 'Santa Filotea de Curtea de Argeș, Virgen y Mártir',
        name_fr: 'Sainte Philothée de Curtea de Argeș, Vierge et Martyre',
        name_de: 'Hl. Philothea von Curtea de Argeș, Jungfrau und Märtyrin',
        name_pt: 'Santa Filoteia de Curtea de Argeș, Virgem e Mártir',
        title: 'Twelve-Year-Old Martyr of Charity & Protectress of Wallachia and Children',
        title_it: 'Fanciulla Martire della Carità a 12 Anni e Protettrice della Valacchia',
        title_ro: 'Copila milostivă de 12 ani, ocrotitoarea Țării Românești, a copiilor și a celor săraci',
        title_ru: 'Двенадцатилетняя отроковица-мученица милосердия, покровительница Валахии',
        quote: '«He who has pity on the poor lends to the Lord! With angelic joy Philothea shared her bread with the hungry.»',
        quote_it: '«Chi ha pietà del povero fa un prestito al Signore! Con gioia angelica Filotea divideva il suo pane con gli affamati.»',
        quote_ro: '«Cel ce are milă de sărac împrumută pe Domnul! Cu bucurie îngerească Sfânta Filofteia și-a împărțit pâinea cu cei flămânzi.»',
        quote_ru: '«Благотворящий бедному дает взаймы Господу! С ангельской радостью святая отроковица Филофея делилась хлебом с голодными.»',
        bio: 'At age twelve she gave the food she carried to the hungry poor; struck down by her wrathful father, her body shone with heavenly light and rests at Curtea de Argeș in Romania since the 14th century.',
        bio_it: 'A dodici anni donava il pane ai mendicanti; colpita a morte dal padre irato, il suo corpo divenne radioso e riposa a Curtea de Argeș in Romania.',
        bio_ro: 'La vârsta de 12 ani împărțea hrana celor flămânzi; lovită de tatăl ei, trupul ei a strălucit de lumină cerească, odihnindu-se la Curtea de Argeș.',
        bio_ru: 'В 12 лет тайно раздавала пищу нищим; приняв смерть от руки жестокого отца, прославилась нетлением и чудесами в Куртя-де-Арджеш.',
        scriptureRef: 'Proverbs 19:17'
      }
    ],
    '12-18': [
      {
        traditions: ['orthodox', 'ecumenical', 'all'],
        nationality: 'ro',
        color: 'blue',
        rank: 'feast',
        name: 'St. Daniel the Hesychast of Voroneț (Sfântul Cuvios Daniil Sihastrul)',
        name_it: 'San Daniele l’Esicasta di Voroneț (Daniil Sihastrul)',
        name_ro: 'Sfântul Cuvios Daniil Sihastrul de la Putna și Voroneț',
        name_ru: 'Преподобный Даниил Исихаст (Сихастру), старец Воронецкий',
        name_la: 'Sanctus Daniel Hesychastes Voronetensis',
        name_es: 'San Daniel el Hesicasta de Voroneț',
        name_fr: 'Saint Daniel l’Hésychaste de Voroneț',
        name_de: 'Hl. Daniel der Hesychast von Voroneț',
        name_pt: 'São Daniel o Hesicasta de Voroneț',
        title: 'Spiritual Father of St. Stephen the Great & Master of Unceasing Prayer',
        title_it: 'Padre Spirituale di Santo Stefano il Grande e Maestro della Preghiera del Cuore',
        title_ro: 'Duhovnicul Sfântului Voievod Ștefan cel Mare și Marele dascăl al rugăciunii lui Iisus în Moldova',
        title_ru: 'Духовный отец святого воеводы Стефана Великого и наставник умной молитвы в Молдавии',
        quote: '«Do not lose heart in the hour of trial: kneel before the Lord in prayer, build a sanctuary to His glory, and He will grant you victory!»',
        quote_it: '«Non perderti d’animo nell’ora della prova: inginocchiati davanti al Signore in preghiera ed Egli ti donerà la vittoria!»',
        quote_ro: '«Nu deznădăjdui în ceasul încercării: pleacă genunchii înaintea Domnului în rugăciune, ridică lăcaș spre slava Lui și El îți va dărui biruința!»',
        quote_ru: '«Не унывай в час испытания: преклони колени пред Господом в молитве, воздвигни храм во славу Его, и Он дарует победу!»',
        bio: 'Carved his stone cell with his own hands at Putna; counseled Voivode Stephen the Great to never surrender and to found Putna and Voroneț Monasteries.',
        bio_it: 'Scavò con le proprie mani la cella nella roccia a Putna; fu guida spirituale di Stefano il Grande e abate del monastero di Voroneț.',
        bio_ro: 'Și-a dăltuit singur chilia în stâncă la Putna; l-a îndrumat duhovnicește pe Sfântul Ștefan cel Mare și a condus obștea Mănăstirii Voroneț.',
        bio_ru: 'Высек себе келью в скале близ Путны; был духовником святого Стефана Великого и игуменом Воронецкого монастыря.',
        scriptureRef: '1 Thessalonians 5:17'
      }
    ]
  },

  it: {
    '1-4': [
      {
        traditions: ['catholic', 'traditional', 'ecumenical', 'all'],
        nationality: 'it',
        color: 'white',
        rank: 'memorial',
        name: 'St. Angela of Foligno',
        name_it: 'Sant’Angela da Foligno',
        name_ro: 'Sfânta Angela din Foligno',
        name_ru: 'Святая Анджела из Фолиньо',
        name_la: 'Sancta Angela de Fulginio',
        name_es: 'Santa Ángela de Foligno',
        name_fr: 'Sainte Angèle de Foligno',
        name_de: 'Hl. Angela von Foligno',
        name_pt: 'Santa Ângela de Foligno',
        title: 'Franciscan Mystic & Teacher of Theologians (Magistra Theologorum)',
        title_it: 'Mistica Francescana dell’Umbria e Maestra dei Teologi',
        title_ro: 'Mistică franciscană din Umbria și Învățătoare a iubirii divine',
        title_ru: 'Францисканская подвижница из Умбрии',
        quote: '«It is not in jest that I have loved you! Look upon the Cross and see how the God-Man emptied Himself out of love for your soul.»',
        quote_it: '«Non ti ho amato per scherzo! Guarda la Croce e contempla con quale immenso amore il Figlio di Dio si è donato per te.»',
        quote_ro: '«Nu te-am iubit în glumă! Privește Crucea și vezi cu ce dragoste nemărginită Fiul lui Dumnezeu S-a dăruit pentru tine.»',
        quote_ru: '«Не в шутку Я возлюбил тебя! Взгляни на Крест и узри безмерную любовь Сына Божия.»',
        bio: 'Umbrian wife and mother who after losing her family embraced Franciscan poverty in Foligno, dictating the luminous Memoriale on the steps of union with Christ Crucified.',
        bio_it: 'Nata a Foligno in Umbria (1248–1309), abbracciò il Terz’Ordine Francescano dedicandosi ai lebbrosi e dettando vette altissime di teologia mistica sulla Passione di Cristo.',
        bio_ro: 'Născută la Foligno în Umbria (1248–1309), a îmbrățișat sărăcia franciscană slujind bolnavilor și lăsând scrieri adânci despre iubirea lui Hristos Răstignit.',
        bio_ru: 'Родилась в Фолиньо (1248–1309), посвятила жизнь служению прокаженным и молитвенному созерцанию Креста Христова.',
        scriptureRef: 'Galatians 2:20'
      }
    ],
    '4-29': [
      {
        traditions: ['catholic', 'traditional', 'ecumenical', 'all'],
        nationality: 'it',
        color: 'red',
        rank: 'solemnity',
        name: 'St. Catherine of Siena, Patroness of Italy & Europe',
        name_it: 'Santa Caterina da Siena, Patrona d’Italia e d’Europa',
        name_ro: 'Sfânta Ecaterina de Siena, Ocrotitoarea Italiei și a Europei',
        name_ru: 'Святая Екатерина Сиенская, покровительница Италии и Европы',
        name_la: 'Sancta Catharina Senensis, Virgo et Ecclesiae Doctor, Patrona Italiae',
        name_es: 'Santa Catalina de Siena, Patrona de Italia y de Europa',
        name_fr: 'Sainte Catherine de Sienne, Patronne de l’Italie et de l’Europe',
        name_de: 'Hl. Katharina von Siena, Schutzpatronin Italiens und Europas',
        name_pt: 'Santa Catarina de Sena, Padroeira da Itália e da Europa',
        title: 'Virgin, Doctor of the Church & Peacemaker of Christendom',
        title_it: 'Vergine, Dottore della Chiesa, Patrona d’Italia e Artisana di Pace',
        title_ro: 'Fecioară, Învățătoare a Bisericii și Făcătoare de pace',
        title_ru: 'Дева, учитель Церкви и миротворица Италии',
        quote: '«Be who God meant you to be, and you will set the whole world ablaze with the fire of charity!»',
        quote_it: '«Se sarete quello che dovete essere, metterete fuoco in tutta Italia e nel mondo intero!»',
        quote_ro: '«Dacă veți fi ceea ce Dumnezeu vă cheamă să fiți, veți aprinde lumea întreagă cu focul iubirii!»',
        quote_ru: '«Будьте тем, кем Бог призвал вас быть, и вы зажжете весь мир огнем любви!»',
        bio: 'Dominican tertiary of Siena (1347–1380) who nursed plague victims, reconciled warring Italian cities, brought the Papacy back to Rome, and authored the Dialogue of Divine Providence.',
        bio_it: 'Terziaria domenicana senese (1347–1380), curò gli appestati, pacificò le città italiane, riportò il Papa da Avignone a Roma e dettò il Dialogo della Divina Provvidenza.',
        bio_ro: 'Tânără din Siena (1347–1380) care a îngrijit bolnavii de ciumă, a adus pacea între cetățile Italiei și a scris Dialogul Divinei Providențe.',
        bio_ru: 'Подвижница из Сиены (1347–1380), служившая больным чумой, примирявшая города Италии и оставившая «Диалог о Божественном Провидении».',
        scriptureRef: '1 John 1:5-7'
      }
    ],
    '10-4': [
      {
        traditions: ['catholic', 'traditional', 'protestant', 'ecumenical', 'all'],
        nationality: 'it',
        color: 'red',
        rank: 'solemnity',
        name: 'St. Francis of Assisi, Primary Patron of Italy',
        name_it: 'San Francesco d’Assisi, Patrono Primario d’Italia',
        name_ro: 'Sfântul Francisc de Assisi, Ocrotitorul Italiei',
        name_ru: 'Святой Франциск Ассизский, покровитель Италии',
        name_la: 'Sanctus Franciscus Asisiensis, Patronus Primarius Italiae',
        name_es: 'San Francisco de Asís, Patrono Principal de Italia',
        name_fr: 'Saint François d’Assise, Patron Principal de l’Italie',
        name_de: 'Hl. Franziskus von Assisi, Hauptpatron Italiens',
        name_pt: 'São Francisco de Assis, Padroeiro Principal da Itália',
        title: 'The Poverello of Assisi, Bearer of the Stigmata & Herald of Gospel Peace',
        title_it: 'Il Poverello d’Assisi, Patrono d’Italia e Araldo della Pace Evangelica',
        title_ro: 'Săracul din Assisi, vestitorul păcii evanghelice și al iubirii față de toată zidirea',
        title_ru: 'Бедняк из Ассизи, проповедник евангельского мира и любви к творению',
        quote: '«Praised be You, my Lord, with all Your creatures! Lord, make me an instrument of Your peace.»',
        quote_it: '«Laudato sie, mi’ Signore, cum tucte le Tue creature! Signore, fa’ di me uno strumento della Tua pace.»',
        quote_ro: '«Lăudat să fii, Domnul meu, cu toate făpturile Tale! Doamne, fă din mine o unealtă a păcii Tale.»',
        quote_ru: '«Хвала Тебе, Господи мой, со всеми творениями Твоими! Господи, соделай меня орудием Твоего мира.»',
        bio: 'Renounced all earthly wealth in Assisi to wed Lady Poverty, rebuilt the Church through radical Gospel humility, composed the Canticle of the Creatures, and bore the wounds of Christ on Mount La Verna.',
        bio_it: 'Spogliatosi di ogni avere ad Assisi per seguire Cristo povero e crocifisso, rinnovò la Chiesa con il Vangelo vivo, compose il Cantico delle Creature e ricevette le stimmate alla Verna.',
        bio_ro: 'A renunțat la toată bogăția în Assisi pentru a-L urma pe Hristos cel sărac și răstignit, înnoind Biserica prin smerenie și compunând Cântarea Făpturilor.',
        bio_ru: 'Оставил земное богатство в Ассизи ради следования Христу в евангельской бедности и сложил «Песнь Творениям».',
        scriptureRef: 'Galatians 6:14-17'
      }
    ],
    '12-7': [
      {
        traditions: ['catholic', 'traditional', 'orthodox', 'protestant', 'ecumenical', 'all'],
        nationality: 'it',
        color: 'red',
        rank: 'feast',
        name: 'St. Ambrose, Bishop of Milan & Doctor of the Church',
        name_it: 'Sant’Ambrogio, Vescovo di Milano e Dottore della Chiesa',
        name_ro: 'Sfântul Ierarh Ambrozie, Episcopul Milanului',
        name_ru: 'Святитель Амвросий, епископ Медиоланский',
        name_la: 'Sanctus Ambrosius, Episcopus Mediolanensis et Ecclesiae Doctor',
        name_es: 'San Ambrosio, Obispo de Milán y Doctor de la Iglesia',
        name_fr: 'Saint Ambroise, Évêque de Milan et Docteur de l’Église',
        name_de: 'Hl. Ambrosius, Bischof von Mailand und Kirchenlehrer',
        name_pt: 'Santo Ambrósio, Bispo de Milão e Doutor da Igreja',
        title: 'Honey-Tongued Shepherd of Milan, Baptizer of Augustine & Defender of the Poor',
        title_it: 'Pastore Intrepido di Milano, Padre dei Poveri e Maestro di Sant’Agostino',
        title_ro: 'Marele Arhipăstor al Milanului, apărătorul săracilor și părintele spiritual al Sfântului Augustin',
        title_ru: 'Великий святитель Медиоланский, защитник православия и креститель блаженного Августина',
        quote: '«Where Peter is, there is the Church; and where the Church is, there is no death, but life eternal. It is not imperial gold, but the poor who are the treasure of the Church.»',
        quote_it: '«Non nella ricchezza, ma nei poveri consiste il tesoro della Chiesa. Cristo è tutto per noi: se vuoi curare le ferite, Egli è medico; se hai sete, Egli è la fonte.»',
        quote_ro: '«Hristos este totul pentru noi: dacă vrei să-ți vindeci rănile, El este doctorul; dacă îți este sete, El este izvorul vieții.»',
        quote_ru: '«Христос есть все для нас: если ты жаждешь исцеления ран — Он врач; если томим жаждой — Он источник.»',
        bio: 'Acclaimed Bishop of Milan by popular voice in 374 while still a catechumen; gave his estates to the poor, melted sacred vessels to ransom captives, composed timeless hymns, and baptized St. Augustine.',
        bio_it: 'Acclamato dal popolo vescovo di Milano nel 374, donò ogni bene ai poveri, difese la libertà della Chiesa di fronte agli imperatori, introdusse il canto ambrosiano e battezzò sant’Agostino.',
        bio_ro: 'Ales de popor episcop al Milanului în anul 374, a apărat dreapta credință în fața împăraților, a răscumpărat captivii și l-a botezat pe Sfântul Augustin.',
        bio_ru: 'Избран народом во епископа Медиолана в 374 году; прославился милосердием к бедным, защитой Церкви и гимнографией.',
        scriptureRef: 'Ephesians 4:11-15'
      }
    ]
  },

  gr: {
    '7-12': [
      {
        traditions: ['orthodox', 'ecumenical', 'all'],
        nationality: 'gr',
        color: 'blue',
        rank: 'feast',
        name: 'St. Paisios the Athonite (of Mount Athos)',
        name_it: 'San Paisios l’Athonita (del Monte Athos)',
        name_ro: 'Sfântul Cuvios Paisie Aghioritul (de la Muntele Athos)',
        name_ru: 'Преподобный Паисий Святогорец (Афонский)',
        name_la: 'Sanctus Paisius Athonita',
        name_es: 'San Paisios del Monte Athos',
        name_fr: 'Saint Païssios du Mont Athos',
        name_de: 'Hl. Paisios vom Berg Athos',
        name_pt: 'São Paíssios do Monte Athos',
        title: 'Contemporary Wonderworker & Comforter of Pain at Panagouda Cell',
        title_it: 'Grande Anziano del Monte Athos e Consolatore dei Sofferenti',
        title_ro: 'Marele duhovnic al Muntelui Athos și Mângâietorul celor îndurerați de la chilia Panaguda',
        title_ru: 'Великий старец Афонский и утешитель страждущих в келлии Панагуда',
        quote: '«Have good thoughts (logismoi) about everyone, and your heart will become a paradise of divine peace and grace!»',
        quote_it: '«Abbiate pensieri buoni verso tutti, e il vostro cuore diventerà un paradiso di pace e di grazia divina!»',
        quote_ro: '«Aveți gânduri bune față de toți oamenii, și inima voastră va deveni un rai al păcii și al harului dumnezeiesc!»',
        quote_ru: '«Имейте добрые помыслы о каждом человеке, и сердце ваше станет раем Божественного мира и благодати!»',
        bio: 'Born in Farasa of Cappadocia (1924–1994) and baptized by St. Arsenios; lived in ascetic prayer on Mount Athos and Sinai, receiving thousands of pilgrims at Panagouda with boundless love and joy.',
        bio_it: 'Nato in Cappadocia (1924–1994) e battezzato da sant’Arsenio, visse in preghiera sul Monte Athos accogliendo migliaia di anime afflitte nella cella di Panagouda.',
        bio_ro: 'Născut în Farasa Capadociei (1924–1994) și botezat de Sf. Arsenie Capadocianul; s-a nevoit pe Muntele Athos la chilia Panaguda, mângâind mii de pelerini.',
        bio_ru: 'Родился в Фарасах Каппадокийских (1924–1994), подвизался на Святой Горе Афон и на Синае, утешая тысячи паломников молитвой и любовью.',
        scriptureRef: 'Philippians 4:8-9'
      }
    ],
    '11-9': [
      {
        traditions: ['orthodox', 'ecumenical', 'all'],
        nationality: 'gr',
        color: 'red',
        rank: 'solemnity',
        name: 'St. Nektarios of Aegina, Metropolitan of Pentapolis & Wonderworker',
        name_it: 'San Nettario di Egina, Metropolita di Pentapoli e Taumaturgo',
        name_ro: 'Sfântul Ierarh Nectarie de la Eghina, Făcătorul de minuni',
        name_ru: 'Святитель Нектарий Эгинский, митрополит Пентапольский, чудотворец',
        name_la: 'Sanctus Nectarius Aeginensis Thaumaturgus',
        name_es: 'San Nectario de Egina, Taumaturgo',
        name_fr: 'Saint Nectaire d’Égine, Thaumaturge',
        name_de: 'Hl. Nektarios von Ägina, Wundertäter',
        name_pt: 'São Nectário de Egina, Taumaturgo',
        title: 'Model of Meekness Under Slander & Healer of Cancer and Uncurable Illnesses',
        title_it: 'Modello di Mansuetudine nella Calunnia e Taumaturgo degli Infermi',
        title_ro: 'Chip al răbdării în prigoane și Tămăduitorul bolnavilor de cancer și suferințe grele',
        title_ru: 'Образ кротости среди клеветы и скорый целитель страждущих недугом рака',
        quote: '«Rejoice, O Unwedded Bride! Pure Virgin Theotokos, shelter beneath your wings all who cry to you in sorrow.»',
        quote_it: '«Rallegrati, Sposa non sposata! Vergine pura Madre di Dio, custodisci sotto il tuo manto chi ti invoca nel dolore.»',
        quote_ro: '«Bucură-te, Mireasă, pururea Fecioară! Maică Preacurată, adăpostește sub acoperământul tău pe toți cei îndurerați.»',
        quote_ru: '«Радуйся, Невесто Неневестная! Пречистая Богородице, укрой под покровом Твоим всех скорбящих.»',
        bio: 'Unjustly slandered and exiled from Alexandria without uttering a word of defense; directed the Rizarios School in Athens, founded Holy Trinity Monastery on Aegina, and composed Agni Parthene.',
        bio_it: 'Calunniato ingiustamente senza mai difendersi, diresse la scuola teologica di Atene, fondò il monastero di Egina e compose l’inno Agni Parthene.',
        bio_ro: 'Prigonit pe nedrept fără a răspunde cu rău, a întemeiat Mănăstirea Sfânta Treime din insula Eghina și a alcătuit imnul Agni Parthene.',
        bio_ru: 'Безропотно перенес клевету и изгнание, основал Свято-Троицкий монастырь на острове Эгина и сложил гимн «Агни Парфене».',
        scriptureRef: 'Matthew 5:10-12'
      }
    ],
    '12-2': [
      {
        traditions: ['orthodox', 'ecumenical', 'all'],
        nationality: 'gr',
        color: 'blue',
        rank: 'feast',
        name: 'St. Porphyrios of Kafsokalyvia (Mount Athos & Milesi)',
        name_it: 'San Porfirio di Kafsokalyvia (Monte Athos)',
        name_ro: 'Sfântul Cuvios Porfirie Kavsokalivitul',
        name_ru: 'Преподобный Порфирий Кавсокаливит',
        name_la: 'Sanctus Porphyrius Kafsokalyvita',
        name_es: 'San Porfirio de Kafsokalyvia',
        name_fr: 'Saint Porphyre de Kafsokalyvia',
        name_de: 'Hl. Porphyrios von Kafsokalyvia',
        name_pt: 'São Porfírio de Kafsokalyvia',
        title: 'Clairvoyant Elder of Joyful Love in Christ & Hospital Chaplain of Athens',
        title_it: 'Anziano Carismatico della Gioia in Cristo e Cappellano degli Ammalati ad Atene',
        title_ro: 'Părintele văzător cu duhul al iubirii bucuroase în Hristos și Mângâietorul bolnavilor din Atena',
        title_ru: 'Прозорливый старец радостной любви во Христе и утешитель больных в Афинах',
        quote: '«Do not fight darkness by striking at the dark: simply open the window to the Light of Christ, and the darkness vanishes by itself!»',
        quote_it: '«Non combattere il buio colpendolo: apri semplicemente la finestra alla Luce di Cristo, e le tenebre svaniranno da sole!»',
        quote_ro: '«Nu te lupta cu întunericul lovindu-l: deschide doar fereastra sufletului către Lumina lui Hristos, și întunericul va pieri de la sine!»',
        quote_ru: '«Не борись с тьмою, ударяя по ней: просто открой окно Свету Христову, и тьма исчезнет сама!»',
        bio: 'Went to Mount Athos at age 12 (1906–1991); served for 33 years as chaplain of the Athens Polyclinic next to Omonia Square, healing and guiding souls through the gift of spiritual discernment.',
        bio_it: 'Salito sul Monte Athos a 12 anni (1906–1991), servì per 33 anni come cappellano del Policlinico di Atene consolando gli infermi con il dono della chiaroveggenza spirituale.',
        bio_ro: 'A plecat în Muntele Athos la 12 ani (1906–1991) și a slujit 33 de ani ca preot al Policlinicii din centrul Atenei, tămăduind sufletele prin iubire și înainte-vedere.',
        bio_ru: 'Ушел на Афон в 12 лет; 33 года служил священником в Афинской поликлинике, исцеляя и наставляя тысячи душ даром прозорливости.',
        scriptureRef: '1 John 4:18'
      }
    ]
  },

  ru: {
    '7-18': [
      {
        traditions: ['orthodox', 'ecumenical', 'all'],
        nationality: 'ru',
        color: 'red',
        rank: 'solemnity',
        name: 'St. Sergius of Radonezh, Wonderworker of All Rus, & Holy Martyr Grand Duchess Elizabeth',
        name_it: 'San Sergio di Radonež, Taumaturgo, e Santa Elisabetta Feodorovna Martire della Carità',
        name_ro: 'Sfântul Cuvios Serghie de Radonej și Sfânta Cuvioasă Muceniță Elisabeta Feodorovna',
        name_ru: 'Преподобный Сергий Радонежский чудотворец и преподобномученица великая княгиня Елисавета',
        name_la: 'Sanctus Sergius Radonezensis et Sancta Elisabetha Martyr',
        name_es: 'San Sergio de Rádonezh y Santa Isabel Románova Mártir de la Caridad',
        name_fr: 'Saint Serge de Radonège et Sainte Élisabeth Féodorovna Martyre de la Charité',
        name_de: 'Hl. Sergius von Radonesch und Hl. Elisabeth von Hessen-Darmstadt',
        name_pt: 'São Sérgio de Radonezh e Santa Isabel Feodorovna Mártir da Caridade',
        title: 'Builder of the Holy Trinity Lavra & Foundress of the Martha and Mary Convent of Mercy',
        title_it: 'Fondatore della Lavra della Trinità e Fondatrice del Convento di Marta e Maria',
        title_ro: 'Ctitorul Lavrei Sfintei Treimi și Întemeietoarea Mănăstirii milosteniei Marta și Maria',
        title_ru: 'Игумен земли Русской и основательница Марфо-Мариинской обители милосердия',
        quote: '«Contemplating the Most Holy Trinity, overcome the hateful division of this world through humility and brotherly love!»',
        quote_it: '«Contemplando la Santissima Trinità, vincete l’odiosa divisione di questo mondo con l’umiltà e l’amore fraterno!»',
        quote_ro: '«Privind la Preasfânta Treime, biruiți dezbinarea acestei lumi prin smerenie și iubire frățească!»',
        quote_ru: '«Воззрением на Святую Троицу побеждайте ненавистную рознь мира сего!»',
        bio: 'Celebrates the finding of the relics of St. Sergius of Radonezh (1422), spiritual heart of the Trinity Lavra, and Grand Duchess Elizabeth who forgave her husband’s assassin and died singing hymns in 1918.',
        bio_it: 'Celebra san Sergio di Radonež, padre del monachesimo della Trinità, e santa Elisabetta Feodorovna che perdonò l’assassino dello sposo e donò la vita ai poveri fino al martirio.',
        bio_ro: 'Pomenirea aflării moaștelor Sf. Serghie de Radonej și a Sfintei Mucenițe Elisabeta care l-a iertat pe ucigașul soțului ei și a slujit săracilor până la mucenicie.',
        bio_ru: 'Обретение честных мощей прп. Сергия Радонежского и память прмц. великой княгини Елисаветы Феодоровны.',
        scriptureRef: 'John 17:21'
      }
    ],
    '7-19': [
      {
        traditions: ['orthodox', 'ecumenical', 'all'],
        nationality: 'ru',
        color: 'red',
        rank: 'solemnity',
        name: 'Uncovering of the Relics of St. Seraphim of Sarov, Wonderworker',
        name_it: 'Ritrovamento delle Reliquie di San Serafino di Sarov, Taumaturgo',
        name_ro: 'Aflarea moaștelor Sfântului Cuvios Serafim de Sarov, Făcătorul de minuni',
        name_ru: 'Обретение мощей преподобного Серафима, Саровского чудотворца',
        name_la: 'Inventio Reliquiarum Sancti Seraphim Saroviensis',
        name_es: 'Hallazgo de las Reliquias de San Serafín de Sarov',
        name_fr: 'Invention des Reliques de Saint Séraphin de Sarov',
        name_de: 'Auffindung der Reliquien des Hl. Seraphim von Sarow',
        name_pt: 'Invenção das Relíquias de São Serafim de Sarov',
        title: 'Elder of Paschal Joy & Teacher of the Acquisition of the Holy Spirit',
        title_it: 'Staretz della Gioia Pasquale e Maestro dell’Acquisizione dello Spirito Santo',
        title_ro: 'Starețul bucuriei pascale și Dascălul dobândirii Duhului Sfânt',
        title_ru: 'Великий старец пасхальной радости и наставник стяжания Духа Святого',
        quote: '«My joy, Christ is Risen! Acquire a peaceful spirit, and thousands around you will find salvation.»',
        quote_it: '«Gioia mia, Cristo è Risorto! Acquisisci lo spirito di pace, e migliaia intorno a te troveranno la salvezza.»',
        quote_ro: '«Bucuria mea, Hristos a Înviat! Dobândește duhul păcii și mii de suflete în jurul tău se vor mântui.»',
        quote_ru: '«Радость моя, Христос Воскресе! Стяжи дух мирен, и тогда тысячи вокруг тебя спасутся.»',
        bio: 'Prayed for 1,000 days and nights upon a granite rock in the Sarov forest; greeted every visitor year-round with "My joy, Christ is Risen!" and shone with the uncreated light of Tabor.',
        bio_it: 'Pregò per mille giorni e mille notti su una roccia nei boschi di Sarov, accogliendo ogni pellegrino in ogni stagione con il saluto pasquale «Gioia mia, Cristo è Risorto!».',
        bio_ro: 'S-a rugat o mie de zile și nopți pe o piatră în pădurea Sarovului, întâmpinând pe fiecare suflet cu salutul pascal «Bucuria mea, Hristos a Înviat!».',
        bio_ru: 'Тысячу дней и ночей молился на камне в саровском лесу и каждого приходящего встречал пасхальным приветствием «Радость моя, Христос Воскресе!».',
        scriptureRef: 'Romans 14:17'
      }
    ],
    '9-25': [
      {
        traditions: ['orthodox', 'ecumenical', 'all'],
        nationality: 'ru',
        color: 'red',
        rank: 'solemnity',
        name: 'Repose of St. Sergius of Radonezh, Abbot & Wonderworker',
        name_it: 'Transito di San Sergio di Radonež, Abate e Taumaturgo',
        name_ro: 'Adormirea Sfântului Cuvios Serghie de Radonej, Făcătorul de minuni',
        name_ru: 'Преставление преподобного Сергия, игумена Радонежского, всея России чудотворца',
        name_la: 'Transitus Sancti Sergii Radonezensis Abbatis',
        name_es: 'Tránsito de San Sergio de Rádonezh, Abad y Taumaturgo',
        name_fr: 'Dormition de Saint Serge de Radonège, Abbé et Thaumaturge',
        name_de: 'Entschlafung des Hl. Sergius von Radonesch',
        name_pt: 'Trânsito de São Sérgio de Radonezh, Abade e Taumaturgo',
        title: 'Builder of the Trinity Lavra & Apostle of Humility and Peace',
        title_it: 'Fondatore della Lavra della Santissima Trinità e Maestro d’Umiltà',
        title_ro: 'Ctitorul Lavrei Sfintei Treimi și Învățătorul smereniei și al păcii',
        title_ru: 'Основатель Свято-Троицкой Сергиевой Лавры и учитель смирения',
        quote: '«Have purity of soul and unfeigned love, and keep the memory of God ever alive in your hearts.»',
        quote_it: '«Custodite la purezza dell’anima e la carità sincera, tenendo sempre viva nel cuore la memoria di Dio.»',
        quote_ro: '«Păziți curăția sufletului și dragostea nefățarnică, având pururea vie în inimă pomenirea lui Dumnezeu.»',
        quote_ru: '«Внимайте себе, братие: имейте чистоту душевную и любовь нелицемерную.»',
        bio: 'Entered the deep forest of Radonezh to build a small wooden chapel to the Holy Trinity (1314–1392); dressed in patched rags while princes sought his blessing, and was visited by the Mother of God.',
        bio_it: 'Si ritirò nella foresta di Radonež costruendo una piccola chiesa lignea alla Santissima Trinità (1314–1392); visse in estrema umiltà e ricevette l’apparizione della Madre di Dio.',
        bio_ro: 'S-a retras în codrii Radonejului ridicând o bisericuță de lemn închinată Sfintei Treimi (1314–1392); s-a învrednicit de cercetarea Maicii Domnului.',
        bio_ru: 'Основал в лесах Маковца храм во имя Живоначальной Троицы, смиренно трудился наравне с братией и сподобился явления Пресвятой Богородицы.',
        scriptureRef: 'Matthew 11:29'
      }
    ]
  },

  es: {
    '5-15': [
      {
        traditions: ['catholic', 'traditional', 'ecumenical', 'all'],
        nationality: 'es',
        color: 'blue',
        rank: 'feast',
        name: 'St. Isidore the Laborer (San Isidro Labrador), Patron of Madrid & Farmers',
        name_it: 'Sant’Isidoro l’Agricoltore (San Isidro Labrador), Patrono di Madrid e degli Agricoltori',
        name_ro: 'Sfântul Isidor Plugarul (San Isidro Labrador), Ocrotitorul Madridului',
        name_ru: 'Святой Исидор Земледелец (Мадридский)',
        name_la: 'Sanctus Isidorus Agricola Matritensis',
        name_es: 'San Isidro Labrador, Patrono de Madrid y de los Agricultores',
        name_fr: 'Saint Isidore le Laboureur, Patron de Madrid et des Agriculteurs',
        name_de: 'Hl. Isidor von Madrid (der Bauer)',
        name_pt: 'Santo Isidoro Lavrador, Padroeiro de Madrid e dos Agricultores',
        title: 'Sanctifier of Daily Work, Friend of the Poor & Patron of Rural Families',
        title_it: 'Santificatore del Lavoro Quotidiano e Padre dei Poveri',
        title_ro: 'Sfințitorul muncii zilnice și prietenul celor săraci',
        title_ru: 'Праведный труженик и милостивый покровитель земледельцев',
        quote: '«Time given to God in morning prayer is never lost: while Isidore prayed in church, angels guided his plow in the field.»',
        quote_it: '«Il tempo donato a Dio nella preghiera del mattino non è mai perduto: mentre Isidoro pregava, gli angeli guidavano il suo aratro.»',
        quote_ro: '«Timpul dăruit lui Dumnezeu în rugăciunea de dimineață nu este niciodată pierdut: îngerii îi călăuzeau plugul pe ogor.»',
        quote_ru: '«Время, посвященное утренней молитве Богу, никогда не пропадает даром.»',
        bio: 'Humble farmworker in Madrid (1080–1130) who with his wife St. María de la Cabeza attended Mass every dawn before working the fields and shared his modest pot of stew with every beggar.',
        bio_it: 'Umile contadino di Madrid (1080–1130) che con la sposa santa Maria della Cabeza unì la preghiera quotidiana all’alba, il lavoro onesto dei campi e la carità verso i poveri.',
        bio_ro: 'Plugar smerit din Madrid (1080–1130) care împreună cu soția sa, Sfânta Maria de la Cabeza, a unit rugăciunea în zori cu munca cinstită și milostenia.',
        bio_ru: 'Благочестивый земледелец из Мадрида (1080–1130), соединивший ежедневную молитву, честный труд и щедрую милостыню нищим.',
        scriptureRef: 'Colossians 3:23-24'
      }
    ],
    '7-25': [
      {
        traditions: ['catholic', 'traditional', 'orthodox', 'protestant', 'ecumenical', 'all'],
        nationality: 'es',
        color: 'red',
        rank: 'solemnity',
        name: 'St. James the Greater, Apostle & Patron of Spain (Santiago Apóstol)',
        name_it: 'San Giacomo il Maggiore, Apostolo e Patrono di Spagna (Santiago de Compostela)',
        name_ro: 'Sfântul Apostol Iacov al lui Zevedeu (Santiago de Compostela)',
        name_ru: 'Святой апостол Иаков Зеведеев (Сантьяго-де-Компостела)',
        name_la: 'Sanctus Iacobus Maior Apostolus, Patronus Hispaniae',
        name_es: 'Santiago el Mayor Apóstol, Patrono de España (Santiago de Compostela)',
        name_fr: 'Saint Jacques le Majeur Apôtre, Patron de l’Espagne (Compostelle)',
        name_de: 'Hl. Jakobus der Ältere, Apostel und Schutzpatron Spaniens',
        name_pt: 'São Tiago Maior Apóstolo, Padroeiro da Espanha (Compostela)',
        title: 'Son of Thunder, Witness of the Transfiguration & Goal of the Camino de Santiago',
        title_it: 'Figlio del Tuono, Testimone del Tabor e Meta del Cammino di Santiago',
        title_ro: 'Fiul Tunetului, Martorul Schimbării la Față și Ocrotitorul pelerinilor de la Compostela',
        title_ru: 'Сын Громов, свидетель Преображения Господня на Фаворе',
        quote: '«Are you able to drink the cup that I am to drink? They said to Him: We are able! And James was the first of the Twelve to seal his faith with his blood.»',
        quote_it: '«Potete bere il calice che io sto per bere? Gli risposero: Lo possiamo! E Giacomo fu il primo dei Dodici a dare la vita per Cristo.»',
        quote_ro: '«Puteți să beți paharul pe care îl voi bea Eu? Ei I-au răspuns: Putem! Și Iacov a fost cel dintâi dintre cei Doisprezece care a mărturisit cu sângele său.»',
        quote_ru: '«Можете ли пить чашу, которую Я буду пить? Они говорят Ему: можем!»',
        bio: 'Brother of St. John the Evangelist, privileged witness of the Transfiguration and Gethsemane, first Apostle martyred in Jerusalem (Acts 12:2), whose shrine at Santiago de Compostela draws pilgrims from all nations.',
        bio_it: 'Fratello di san Giovanni Evangelista, testimone della Trasfigurazione e del Getsemani, primo tra gli Apostoli a subire il martirio a Gerusalemme; venerato a Santiago de Compostela.',
        bio_ro: 'Fratele Sfântului Ioan Evanghelistul, martor al Schimbării la Față pe Tabor și primul dintre cei 12 Apostoli care a primit mucenicia la Ierusalim; cinstit la Santiago de Compostela.',
        bio_ru: 'Брат апостола Иоанна Богослова, очевидец Преображения Господня, первый из двенадцати апостолов, принявший мученическую кончину в Иерусалиме.',
        scriptureRef: 'Matthew 20:22-23; Acts 12:1-2'
      }
    ],
    '10-12': [
      {
        traditions: ['catholic', 'traditional', 'ecumenical', 'all'],
        nationality: 'es',
        color: 'blue',
        rank: 'solemnity',
        name: 'Our Lady of the Pillar of Zaragoza (Nuestra Señora del Pilar)',
        name_it: 'Nostra Signora del Pilar di Saragozza (Patrona della Hispanidad)',
        name_ro: 'Maica Domnului de la Pilar din Zaragoza',
        name_ru: 'Пресвятая Дева Мария дель Пилар (Сарагосская)',
        name_la: 'Beata Maria Virgo de Columna Caesaraugustana',
        name_es: 'Nuestra Señora del Pilar de Zaragoza, Patrona de la Hispanidad',
        name_fr: 'Notre-Dame du Pilier de Saragosse',
        name_de: 'Unsere Liebe Frau auf dem Pfeiler zu Saragossa',
        name_pt: 'Nossa Senhora do Pilar de Saragoça',
        title: 'First Marian Shrine of Christendom on the Banks of the Ebro',
        title_it: 'Primo Santuario Mariano della Cristianità sulle Rive dell’Ebro',
        title_ro: 'Întâiul sanctuar marian pe malul râului Ebro, întărirea Apostolului Iacov',
        title_ru: 'Древнейшая святыня Испании на берегах реки Эбро',
        quote: '«This pillar shall remain here until the end of time, so that the virtue of God may work wonders for those who implore my help.»',
        quote_it: '«Questa colonna rimarrà salda fino alla fine dei tempi, affinché la potenza di Dio operi meraviglie per chi invoca la fede.»',
        quote_ro: '«Această coloană va rămâne neclintită ca semn al credinței nebiruite în Hristos.»',
        quote_ru: '«Столп сей пребудет непоколебим как знамение веры во Христа.»',
        bio: 'Commemorates the console brought by the Blessed Virgin Mary to Apostle James the Greater in 40 AD on the banks of the Ebro at Caesaraugusta (Zaragoza) when his mission seemed hardest.',
        bio_it: 'Celebra il conforto recato dalla Vergine Maria all’apostolo Giacomo sulle rive dell’Ebro a Saragozza nel 40 d.C., incoraggiandolo nella predicazione del Vangelo.',
        bio_ro: 'Amintește de întărirea adusă de Maica Domnului Apostolului Iacov pe malul râului Ebro la Zaragoza în anul 40 d.Hr.',
        bio_ru: 'Память укрепления апостола Иакова Зеведеева в проповеди Евангелия на берегах реки Эбро в Сарагосе в 40 году.',
        scriptureRef: 'Luke 1:46-49'
      }
    ],
    '10-15': [
      {
        traditions: ['catholic', 'traditional', 'protestant', 'ecumenical', 'all'],
        nationality: 'es',
        color: 'red',
        rank: 'solemnity',
        name: 'St. Teresa of Jesus (of Ávila), Virgin & Doctor of the Church',
        name_it: 'Santa Teresa di Gesù (d’Ávila), Vergine e Dottore della Chiesa',
        name_ro: 'Sfânta Tereza de Ávila, Fecioară și Învățătoare a Rugăciunii',
        name_ru: 'Святая Тереза Авильская, учитель молитвы',
        name_la: 'Sancta Teresia a Iesu Abulensis, Virgo et Ecclesiae Doctor',
        name_es: 'Santa Teresa de Jesús (de Ávila), Virgen y Doctora de la Iglesia',
        name_fr: 'Sainte Thérèse d’Ávila (de Jésus), Vierge et Docteur de l’Église',
        name_de: 'Hl. Teresa von Ávila (von Jesus), Jungfrau und Kirchenlehrerin',
        name_pt: 'Santa Teresa de Jesus (de Ávila), Virgem e Doutora da Igreja',
        title: 'Reformer of Carmel & Supreme Teacher of Interior Prayer',
        title_it: 'Riformatrice del Carmelo e Maestra Somma dell’Orazione Interiore',
        title_ro: 'Reformatoarea Carmelului și Maestra rugăciunii lăuntrice',
        title_ru: 'Наставница внутренней молитвы и духовного трезвения',
        quote: '«Let nothing disturb you, let nothing frighten you; all things are passing away: God never changes. Patience obtains all things. Whoever has God lacks nothing; God alone suffices!»',
        quote_it: '«Nulla ti turbi, nulla ti spaventi: tutto passa, solo Dio non cambia. La pazienza ottiene tutto; chi ha Dio non manca di nulla: solo Dio basta!»',
        quote_ro: '«Nimic să nu te tulbure, nimic să nu te înspăimânte: toate trec, Dumnezeu nu Se schimbă. Cine Îl are pe Dumnezeu nu duce lipsă de nimic: Dumnezeu singur îndestulează!»',
        quote_ru: '«Пусть ничто не тревожит тебя и ничто не страшит: все проходит, Бог неизменен. Кто имеет Бога, тот ни в чем не нуждается: одного Бога достаточно!»',
        bio: 'Mystic of Ávila (1515–1582) who reformed the Carmelite Order with St. John of the Cross and wrote The Interior Castle and The Way of Perfection, defining prayer as an intimate friendship with God.',
        bio_it: 'Grande mistica castigliana (1515–1582), riformò il Carmelo con san Giovanni della Croce e scrisse Il Castello Interiore, definendo la preghiera un intimo dialogo d’amicizia con Colui che sappiamo amarci.',
        bio_ro: 'Mistică din Ávila (1515–1582), autoarea Castelului Interior, care a definit rugăciunea ca pe o prietenie vie și neîncetată cu Dumnezeu.',
        bio_ru: 'Уроженка Авилы (1515–1582), автор книги «Внутренний замок», учившая о молитве как о живой беседе любви с Богом.',
        scriptureRef: 'Psalm 73:25-26'
      }
    ]
  },

  fr: {
    '1-3': [
      {
        traditions: ['catholic', 'traditional', 'orthodox', 'ecumenical', 'all'],
        nationality: 'fr',
        color: 'blue',
        rank: 'feast',
        name: 'St. Genevieve, Patroness of Paris (Sainte Geneviève)',
        name_it: 'Santa Genoveffa, Vergine e Patrona di Parigi',
        name_ro: 'Sfânta Cuvioasă Genoveva, Ocrotitoarea Parisului',
        name_ru: 'Преподобная Женевьева (Геновефа) Парижская',
        name_la: 'Sancta Genovefa Virgo Parisiensis',
        name_es: 'Santa Genoveva, Virgen y Patrona de París',
        name_fr: 'Sainte Geneviève, Vierge et Patronne de Paris',
        name_de: 'Hl. Genoveva von Paris, Jungfrau',
        name_pt: 'Santa Genoveva, Virgem e Padroeira de Paris',
        title: 'Consecrated Virgin Who Saved Paris Through Prayer and Fasting (451)',
        title_it: 'Vergine Consacrata che Salvò Parigi con la Preghiera e il Digiuno (451)',
        title_ro: 'Fecioara consacrată care a salvat Parisul prin post și rugăciune în anul 451',
        title_ru: 'Преподобная дева, спасшая Париж молитвой и постом от нашествия Аттилы в 451 году',
        quote: '«Do not flee your homes: let us take up the weapons of fasting, vigils, and tears, and the Lord of Hosts will shield our city!»',
        quote_it: '«Non abbandonate le vostre case: impugniamo le armi del digiuno e della preghiera, e il Signore proteggerà la città!»',
        quote_ro: '«Nu vă părăsiți casele: să luăm armele postului și ale rugăciunii cu lacrimi, și Domnul va păzi cetatea noastră!»',
        quote_ru: '«Возьмем оружие поста и слезной молитвы, и Господь защитит град наш!»',
        bio: 'Consecrated to God at age seven by St. Germanus of Auxerre (422–502); rallied the women of Paris in prayer to turn back Attila the Hun in 451 and brought grain barges to the starving city.',
        bio_it: 'Consacrata a Dio a sette anni da san Germano d’Auxerre (422–502); nel 451 guidò il popolo di Parigi nella preghiera salvando la città da Attila e sfamando gli assediati.',
        bio_ro: 'Consacrată lui Dumnezeu din copilărie de Sfântul Gherman de Auxerre (422–502); în anul 451 a salvat Parisul prin rugăciune în fața lui Attila și a hrănit poporul înfometat.',
        bio_ru: 'С семи лет посвящена Богу святителем Германом Осерским (422–502); молитвой отвела от Парижа войска Аттилы и накормила голодающих жителей.',
        scriptureRef: 'Judith 8:16-17'
      }
    ],
    '5-30': [
      {
        traditions: ['catholic', 'traditional', 'ecumenical', 'all'],
        nationality: 'fr',
        color: 'red',
        rank: 'solemnity',
        name: 'St. Joan of Arc, Virgin & Secondary Patroness of France (Sainte Jeanne d’Arc)',
        name_it: 'Santa Giovanna d’Arco, Vergine e Patrona di Francia',
        name_ro: 'Sfânta Ioana d’Arc, Fecioară și Ocrotitoarea Franței',
        name_ru: 'Святая Жанна д’Арк, дева Орлеанская',
        name_la: 'Sancta Ioanna Arcensis, Virgo et Patrona Galliae',
        name_es: 'Santa Juana de Arco, Virgen y Patrona de Francia',
        name_fr: 'Sainte Jeanne d’Arc, Vierge et Patronne de la France',
        name_de: 'Hl. Johanna von Orléans (Jeanne d’Arc), Jungfrau',
        name_pt: 'Santa Joana d’Arc, Virgem e Padroeira da França',
        title: 'The Maid of Orléans & Witness to the Holy Name of Jesus unto the Stake',
        title_it: 'La Pulzella d’Orléans, Testimone del Nome di Gesù fino al Rogo',
        title_ro: 'Fecioara din Orléans, mărturisitoare a Numelui lui Iisus până în flăcările rugului',
        title_ru: 'Орлеанская дева, с именем Иисуса на устах претерпевшая мученический костер',
        quote: '«In God’s name, the soldiers will fight and God will give the victory! Hold the Cross high before my eyes so I may see it through the flames: Jesus, Jesus!»',
        quote_it: '«Messire Dieu premier servi! Tenete alta la Croce davanti ai miei occhi finché esalerò lo spirito invocando: Gesù, Gesù!»',
        quote_ro: '«Dumnezeu să fie slujit mai întâi! Țineți Crucea sus în fața ochilor mei, ca să-L privesc pe Răstignit prin flăcări: Iisuse, Iisuse!»',
        quote_ru: '«Держите Крест высоко пред глазами моими, чтобы сквозь пламя я взирала на Спасителя: Иисус, Иисус!»',
        bio: 'Peasant girl of Domrémy (1412–1431) who restored hope to France; burned at the stake in Rouen at age 19 while gazing at a crucifix and forgiving her judges, whispering only the Name of Jesus.',
        bio_it: 'Giovane contadina di Domrémy (1412–1431); arsa sul rogo a Rouen a soli 19 anni dopo un processo ingiusto, perdonò i suoi accusatori fissando la Croce e invocando il Nome di Gesù.',
        bio_ro: 'Tânără din Domrémy (1412–1431); arsă pe rug la Rouen la 19 ani, și-a iertat judecătorii privind țintă spre Cruce și chemând Numele lui Iisus.',
        bio_ru: 'Юная крестьянка из Домреми (1412–1431), в 19 лет сожженная на костре в Руане с прощением врагам и именем Иисуса на устах.',
        scriptureRef: 'Philippians 2:9-10'
      }
    ],
    '10-1': [
      {
        traditions: ['catholic', 'traditional', 'ecumenical', 'all'],
        nationality: 'fr',
        color: 'red',
        rank: 'solemnity',
        name: 'St. Thérèse of the Child Jesus (of Lisieux), Patroness of France & the Missions',
        name_it: 'Santa Teresa di Gesù Bambino (di Lisieux), Dottore della Chiesa',
        name_ro: 'Sfânta Tereza a Pruncului Iisus (de Lisieux)',
        name_ru: 'Святая Тереза Младенца Иисуса (Лизьеская)',
        name_la: 'Sancta Teresia a Iesu Infante, Virgo et Ecclesiae Doctor',
        name_es: 'Santa Teresita del Niño Jesús (de Lisieux), Doctora de la Iglesia',
        name_fr: 'Sainte Thérèse de l’Enfant-Jésus (de Lisieux), Patronne de la France et Docteur de l’Église',
        name_de: 'Hl. Theresia vom Kinde Jesus (von Lisieux), Kirchenlehrerin',
        name_pt: 'Santa Teresinha do Menino Jesus (de Lisieux), Doutora da Igreja',
        title: 'Doctor of the Little Way of Spiritual Childhood & Merciful Love',
        title_it: 'Dottore della Piccola Via dell’Infanzia Spirituale e dell’Amore Misericordioso',
        title_ro: 'Învățătoarea Căii celei Mici a copilăriei duhovnicești și a iubirii milostive',
        title_ru: 'Учитель «Малого пути» духовного младенчества и безграничного доверия Богу',
        quote: '«My vocation is Love! In the heart of the Church, my Mother, I will be Love, and thus I will be all things. After my death, I will let fall a shower of roses.»',
        quote_it: '«La mia vocazione è l’Amore! Nel cuore della Chiesa, mia Madre, io sarò l’Amore! Dopo la mia morte farò cadere una pioggia di rose.»',
        quote_ro: '«Chemarea mea este Iubirea! În inima Bisericii, Mama mea, eu voi fi Iubirea! După moartea mea voi face să cadă o ploaie de trandafiri.»',
        quote_ru: '«Мое призвание — Любовь! В сердце Церкви, моей Матери, я буду Любовью!»',
        bio: 'Entered the Carmel of Lisieux at age 15 (1873–1897); revealed in Story of a Soul that the elevator to heaven is the arms of Jesus lifting the smallest souls who trust completely in His mercy.',
        bio_it: 'Entrata a 15 anni nel Carmelo di Lisieux (1873–1897), insegnò nella Storia di un’anima la Piccola Via dell’abbandono fiducioso tra le braccia della Misericordia di Dio.',
        bio_ro: 'A intrat la 15 ani în Carmelul din Lisieux (1873–1897), descoperind în Istoria unui suflet Calea cea Mică a încrederii depline în Milostivirea lui Dumnezeu.',
        bio_ru: 'В 15 лет вступила в монастырь в Лизье (1873–1897), открыв миру «Малый путь» детского доверия милосердию Божию.',
        scriptureRef: 'Isaiah 66:12-13; Matthew 18:3'
      }
    ]
  },

  de: {
    '4-9': [
      {
        traditions: ['protestant', 'ecumenical', 'catholic', 'all'],
        nationality: 'de',
        color: 'red',
        rank: 'feast',
        name: 'Dietrich Bonhoeffer, Pastor, Theologian & Martyr of the Confessing Church',
        name_it: 'Dietrich Bonhoeffer, Pastore, Teologo e Martire della Fede',
        name_ro: 'Dietrich Bonhoeffer, Pastor, Teolog și Martir al Credinței',
        name_ru: 'Дитрих Бонхёффер, пастор, богослов и мученик веры',
        name_la: 'Theodoricus Bonhoeffer, Pastor et Martyr Fidei',
        name_es: 'Dietrich Bonhoeffer, Pastor, Teólogo y Mártir de la Fe',
        name_fr: 'Dietrich Bonhoeffer, Pasteur, Théologien et Martyr de la Foi',
        name_de: 'Dietrich Bonhoeffer, Pastor, Theologe und Märtyrer der Bekennenden Kirche',
        name_pt: 'Dietrich Bonhoeffer, Pastor, Teólogo e Mártir da Fé',
        title: 'Witness of Costly Grace Executed at Flossenbürg (1945)',
        title_it: 'Testimone della «Grazia a Caro Prezzo» Martirizzato a Flossenbürg (1945)',
        title_ro: 'Mărturisitorul «Harului scump plătit», martirizat la Flossenbürg în 1945',
        title_ru: 'Свидетель «дорогостоящей благодати», казненный в концлагере Флоссенбюрг (1945)',
        quote: '«When Christ calls a man, He bids him come and die. This is the end—for me, the beginning of life.»',
        quote_it: '«Quando Cristo chiama un uomo, gli comanda di venire e morire. Questa è la fine: per me, l’inizio della vita.»',
        quote_ro: '«Când Hristos cheamă un om, îl cheamă să vină și să-și ia crucea. Acesta este sfârșitul — pentru mine, începutul vieții!»',
        quote_ru: '«Когда Христос призывает человека, Он повелевает ему прийти и умереть. Для меня это — начало вечной жизни.»',
        bio: 'German Lutheran pastor and author of The Cost of Discipleship and Life Together (1906–1945) who resisted the Nazi regime and knelt in serene prayer before his execution at dawn on April 9, 1945.',
        bio_it: 'Pastore e teologo tedesco (1906–1945), autore di Sequela e Vita Comune, si oppose intrepidamente alla tirannide nazista affrontando il patibolo in profonda preghiera.',
        bio_ro: 'Pastor și teolog german (1906–1945), autorul lucrării Urmarea lui Hristos, care s-a împotrivit tiraniei naziste și a murit în rugăciune senină la 9 aprilie 1945.',
        bio_ru: 'Немецкий пастор и богослов (1906–1945), автор книги «Следование Христу», бесстрашно противостоявший нацизму и принявший смерть в молитве.',
        scriptureRef: 'Luke 9:23-24'
      }
    ],
    '6-5': [
      {
        traditions: ['catholic', 'traditional', 'protestant', 'orthodox', 'ecumenical', 'all'],
        nationality: 'de',
        color: 'red',
        rank: 'solemnity',
        name: 'St. Boniface, Bishop, Martyr & Apostle of the Germans (Hl. Bonifatius)',
        name_it: 'San Bonifacio, Vescovo, Martire e Apostolo della Germania',
        name_ro: 'Sfântul Sfințit Mucenic Bonifaciu, Apostolul Germaniei',
        name_ru: 'Священномученик Бонифаций, архиепископ Майнцский, просветитель Германии',
        name_la: 'Sanctus Bonifatius, Episcopus et Martyr, Apostolus Germaniae',
        name_es: 'San Bonifacio, Obispo, Mártir y Apóstol de Alemania',
        name_fr: 'Saint Boniface, Évêque, Martyr et Apôtre de la Germanie',
        name_de: 'Hl. Bonifatius, Bischof, Märtyrer und Apostel der Deutschen',
        name_pt: 'São Bonifácio, Bispo, Mártir e Apóstolo da Alemanha',
        title: 'Archbishop of Mainz, Founder of Fulda Abbey & Evangelizer of Central Europe',
        title_it: 'Arcivescovo di Magonza, Fondatore di Fulda ed Evangelizzatore dell’Europa Centrale',
        title_ro: 'Arhiepiscop de Mainz, întemeietorul Mănăstirii Fulda și Luminătorul Europei Centrale',
        title_ru: 'Основатель Фульдского монастыря и апостол народов Центральной Европы',
        quote: '«Let us stand fast in what is right and prepare our souls for trial! Be not afraid of those who kill the body, for the eternal day of the Lord is at hand.»',
        quote_it: '«Stiamo saldi nella giustizia e prepariamo l’anima alla prova! L’eterno giorno del Signore è vicino.»',
        quote_ro: '«Să stăm neclintiți în dreptate și să ne pregătim sufletele: ziua cea veșnică a Domnului este aproape!»',
        quote_ru: '«Будем твердо стоять в правде Божией: день вечного Царствия Господня близок!»',
        bio: 'Felled Thor’s Oak at Geismar to show the powerlessness of pagan idols, founded Fulda Abbey, organized the Church in Bavaria, Hesse and Thuringia, and died holding the Gospel book over his head at Dokkum (754).',
        bio_it: 'Abbatté la quercia di Thor a Geismar, fondò l’abbazia di Fulda, evangelizzò la Germania e subì il martirio a Dokkum nel 754 sollevando il libro dei Vangeli.',
        bio_ro: 'A întemeiat vestita mănăstire de la Fulda, a încreștinat popoarele germanice și a primit cununa muceniciei în 754 ținând Evanghelia deasupra capului.',
        bio_ru: 'Просветил народы Германии, основал монастырь Фульда и принял мученическую смерть в 754 году, прикрывая главу книгой Евангелия.',
        scriptureRef: '2 Timothy 4:6-8'
      }
    ],
    '9-17': [
      {
        traditions: ['catholic', 'traditional', 'protestant', 'ecumenical', 'all'],
        nationality: 'de',
        color: 'blue',
        rank: 'feast',
        name: 'St. Hildegard of Bingen, Virgin & Doctor of the Church',
        name_it: 'Santa Ildegarda di Bingen, Vergine e Dottore della Chiesa',
        name_ro: 'Sfânta Hildegard de Bingen, Fecioară și Învățătoare a Bisericii',
        name_ru: 'Святая Хильдегарда Бингенская',
        name_la: 'Sancta Hildegardis Bingensis, Virgo et Ecclesiae Doctor',
        name_es: 'Santa Hildegarda de Bingen, Virgen y Doctora de la Iglesia',
        name_fr: 'Sainte Hildegarde de Bingen, Vierge et Docteur de l’Église',
        name_de: 'Hl. Hildegard von Bingen, Jungfrau und Kirchenlehrerin',
        name_pt: 'Santa Hildegarda de Bingen, Virgem e Doutora da Igreja',
        title: 'Sibyl of the Rhine, Mystic Visionary, Composer & Natural Healer',
        title_it: 'Sibilla del Reno, Mistica della Luce Vivente, Compositrice e Guaritrice',
        title_ro: 'Mistica Luminii celei Vii de pe valea Rinului, imnografă și tămăduitoare',
        title_ru: 'Рейнская подвижница, созерцательница Божественного Света и целительница',
        quote: '«Humanity, take a good look at yourself: inside you both heaven and earth are created, and the Living Light of God breathes greening life (Viriditas) into your soul!»',
        quote_it: '«L’anima è sinfonica! La Luce Vivente di Dio infonde nella creazione la santa forza germinatrice (Viriditas) della grazia.»',
        quote_ro: '«Sufletul este o simfonie! Lumina cea Vie a lui Dumnezeu revarsă în toată făptura puterea dătătoare de viață a harului.»',
        quote_ru: '«Душа человеческая симфонична! Живой Свет Божий наполняет все творение живоносной благодатью.»',
        bio: 'Benedictine abbess on the Rhine (1098–1179) who recorded her visions of the Living Light in Scivias, composed 77 liturgical chants (Symphonia), wrote medical treatises, and preached reform across Germany.',
        bio_it: 'Badessa benedettina sul Reno (1098–1179), autrice dello Scivias, di canti sacri celestiali e di trattati di medicina naturale, proclamata Dottore della Chiesa Universale.',
        bio_ro: 'Stareță benedictină de pe Rin (1098–1179), autoare a viziunilor teologice Scivias, a cântărilor sacre și a tratatelor despre armonia creației lui Dumnezeu.',
        bio_ru: 'Бенедиктинская игумения на Рейне (1098–1179), автор богословских созерцаний «Scivias», духовных песнопений и книг о целебных силах творения.',
        scriptureRef: 'Psalm 36:9; Revelation 22:1-2'
      }
    ],
    '11-17': [
      {
        traditions: ['catholic', 'traditional', 'protestant', 'ecumenical', 'all'],
        nationality: 'de',
        color: 'blue',
        rank: 'feast',
        name: 'St. Elizabeth of Thuringia (of Hungary), Princess of Charity',
        name_it: 'Santa Elisabetta d’Ungheria (di Turingia), Madre dei Poveri',
        name_ro: 'Sfânta Elisabeta de Turingia (a Ungariei), Ocrotitoarea săracilor',
        name_ru: 'Святая Елизавета Тюрингская (Венгерская), матерь бедных',
        name_la: 'Sancta Elisabeth Hungariae et Thuringiae',
        name_es: 'Santa Isabel de Hungría (de Turingia), Madre de los Pobres',
        name_fr: 'Sainte Élisabeth de Hongrie (de Thuringe), Mère des Pauvres',
        name_de: 'Hl. Elisabeth von Thüringen, Mutter der Armen und Kranken',
        name_pt: 'Santa Isabel da Hungria (da Turíngia), Mãe dos Pobres',
        title: 'Landgravine of the Wartburg & Foundress of the Marburg Hospital for the Destitute',
        title_it: 'Principessa della Wartburg e Fondatrice dell’Ospedale di Marburgo per gli Ultimi',
        title_ro: 'Prințesa milostivă de la Wartburg care a zidit spitalul săracilor din Marburg',
        title_ru: 'Княгиня милосердия в Вартбурге, основательница больницы для нищих в Марбурге',
        quote: '«How could I wear a crown of gold and jewels before the King of Heaven who wore a crown of thorns for me? We must make people glad!»',
        quote_it: '«Come potrei portare in chiesa una corona d’oro davanti al mio Re che porta una corona di spine? Dobbiamo rendere felici i poveri di Cristo!»',
        quote_ro: '«Cum aș putea purta o coroană de aur în fața Împăratului meu Care poartă o cunună de spini? Să aducem bucurie săracilor lui Hristos!»',
        quote_ru: '«Как могу я носить золотой венец пред Царем моим, увенчанным тернием ради меня?»',
        bio: 'Carried bread daily down the steep steps of Wartburg Castle to the starving (miracle of the roses), built a 28-bed hospital at Marburg where she personally washed lepers, and died in joy at age 24 (1207–1231).',
        bio_it: 'Portava ogni giorno il pane dal castello della Wartburg ai mendicanti (celebre il miracolo delle rose), fondò l’ospedale di Marburgo curando di persona i lebbrosi e morì santamente a 24 anni.',
        bio_ro: 'Cobora zilnic din cetatea Wartburg cu pâine pentru cei flămânzi (minunea trandafirilor), a întemeiat spitalul din Marburg îngrijind leproșii și a adormit întru Domnul la 24 de ani.',
        bio_ru: 'Ежедневно носила хлеб голодным из замка Вартбург (чудо с розами), построила больницу в Марбурге, где сама служила прокаженным, и мирно почила в 24 года.',
        scriptureRef: 'Matthew 25:35-40'
      }
    ]
  },

  en: {
    '3-17': [
      {
        traditions: ['catholic', 'traditional', 'orthodox', 'protestant', 'ecumenical', 'all'],
        nationality: 'en',
        color: 'red',
        rank: 'solemnity',
        name: 'St. Patrick, Bishop, Confessor & Enlightener of Ireland',
        name_it: 'San Patrizio, Vescovo e Apostolo d’Irlanda',
        name_ro: 'Sfântul Ierarh Patriciu, Luminătorul Irlandei',
        name_ru: 'Святитель Патрикий, просветитель Ирландии',
        name_la: 'Sanctus Patricius, Episcopus et Apostolus Hiberniae',
        name_es: 'San Patricio, Obispo y Apóstol de Irlanda',
        name_fr: 'Saint Patrick, Évêque et Apôtre de l’Irlande',
        name_de: 'Hl. Patrick, Bischof und Apostel Irlands',
        name_pt: 'São Patrício, Bispo e Apóstolo da Irlanda',
        title: 'Author of the Lorica (Breastplate Prayer) & Apostle of the Emerald Isle',
        title_it: 'Autore della Lorica («Cristo con me») e Apostolo dell’Isola Verde',
        title_ro: 'Autorul rugăciunii Lorica («Hristos cu mine») și Apostolul Irlandei',
        title_ru: 'Апостол Ирландии и творец молитвы «Щит святого Патрикия»',
        quote: '«Christ with me, Christ before me, Christ behind me, Christ in me, Christ beneath me, Christ above me, Christ in the heart of everyone who thinks of me!»',
        quote_it: '«Cristo con me, Cristo davanti a me, Cristo dietro di me, Cristo in me, Cristo nel cuore di chiunque pensa a me!»',
        quote_ro: '«Hristos cu mine, Hristos înaintea mea, Hristos în urma mea, Hristos înlăuntrul meu, Hristos în inima fiecărui om care mă întâlnește!»',
        quote_ru: '«Христос со мною, Христос предо мною, Христос позади меня, Христос во мне, Христос в сердце каждого!»',
        bio: 'Kidnapped as a youth to herd sheep on Slemish Mountain where he learned to pray 100 times by day and 100 times by night; escaped, was ordained bishop, and returned to forgive his captors and baptize all Ireland.',
        bio_it: 'Rapito da giovane e ridotto in schiavitù, imparò sui monti a pregare cento volte il giorno e cento la notte; fuggito e divenuto vescovo, tornò tra i suoi rapitori battezzando tutta l’Irlanda.',
        bio_ro: 'Răpit în tinerețe ca rob, a învățat pe munte să se roage de o sută de ori ziua și noaptea; devenit episcop, s-a întors din iubire la cei ce-l robiseră, botezând întreaga Irlandă.',
        bio_ru: 'В юности угнан в плен, где научился творить по сто молитв днем и ночью; став епископом, вернулся к пленившим его народам и крестил всю Ирландию.',
        scriptureRef: 'Ephesians 6:11-17'
      }
    ],
    '5-25': [
      {
        traditions: ['catholic', 'traditional', 'orthodox', 'protestant', 'ecumenical', 'all'],
        nationality: 'en',
        color: 'blue',
        rank: 'feast',
        name: 'St. Bede the Venerable, Priest, Monk of Jarrow & Doctor of the Church',
        name_it: 'San Beda il Venerabile, Sacerdote e Dottore della Chiesa',
        name_ro: 'Sfântul Cuvios Beda Venerabilul, Învățător al Bisericii',
        name_ru: 'Преподобный Беда Достопочтенный, пресвитер Ярроуский',
        name_la: 'Sanctus Beda Venerabilis, Presbyter et Ecclesiae Doctor',
        name_es: 'San Beda el Venerable, Presbítero y Doctor de la Iglesia',
        name_fr: 'Saint Bède le Vénérable, Prêtre et Docteur de l’Église',
        name_de: 'Hl. Beda der Ehrwürdige, Priester und Kirchenlehrer',
        name_pt: 'São Beda o Venerável, Presbítero e Doutor da Igreja',
        title: 'Father of English History & Translator of the Gospel of St. John on His Deathbed',
        title_it: 'Monaco di Wearmouth-Jarrow e Traduttore del Vangelo di Giovanni sul Letto di Morte',
        title_ro: 'Monahul învățat din Jarrow care a tălmăcit Evanghelia Sfântului Ioan până la ultima suflare',
        title_ru: 'Ученый монах из Ярроу, завершивший перевод Евангелия от Иоанна на смертном одре',
        quote: '«It has always been my delight to learn or to teach or to write, while observing the monastic rule and singing daily in the church.»',
        quote_it: '«È sempre stata la mia gioia imparare, insegnare o scrivere le Sacre Scritture, cantando ogni giorno le lodi di Dio in chiesa.»',
        quote_ro: '«Bucuria vieții mele a fost pururea să cercetez Scripturile, să învăț și să cânt zilnic laudele lui Dumnezeu în biserică.»',
        quote_ru: '«Моей радостью всегда было изучать Писание, учить братию и ежедневно воспевать хвалу Богу в храме.»',
        bio: 'Entered the Northumbrian monastery of Wearmouth-Jarrow at age seven (673–735); dictated the final verse of his Old English translation of St. John’s Gospel on Ascension Eve and breathed his last singing the Gloria Patri.',
        bio_it: 'Monaco a Jarrow fin dall’età di sette anni (673–735), dettò l’ultimo versetto della traduzione del Vangelo di Giovanni nella vigilia dell’Ascensione, spirando mentre cantava il Gloria al Padre.',
        bio_ro: 'Monah la Jarrow de la 7 ani (673–735), a dictat ultimul verset al traducerii Evangheliei după Ioan în ajunul Înălțării Domnului, dându-și duhul cu cântarea Slavă Tatălui și Fiului și Sfântului Duh.',
        bio_ru: 'С семи лет жил в монастыре Ярроу (673–735); накануне Вознесения продиктовал последний стих перевода Евангелия от Иоанна и мирно почил со славословием Святой Троице.',
        scriptureRef: '2 Timothy 3:14-17'
      }
    ],
    '11-22': [
      {
        traditions: ['protestant', 'ecumenical', 'catholic', 'all'],
        nationality: 'en',
        color: 'blue',
        rank: 'feast',
        name: 'C.S. Lewis, Christian Apologist & Witness of Eternal Joy',
        name_it: 'C.S. Lewis, Apologeta Cristiano e Testimone della Gioia Eterna',
        name_ro: 'C.S. Lewis, Apologet creștin și Mărturisitor al Bucuriei Veșnice',
        name_ru: 'Клайв Стейплз Льюис, христианский апологет и свидетель надежды',
        name_la: 'Clive Staples Lewis, Defensor Fidei Christianae',
        name_es: 'C.S. Lewis, Apologista Cristiano y Testigo de la Esperanza',
        name_fr: 'C.S. Lewis, Apologiste Chrétien et Témoin de l’Espérance',
        name_de: 'C.S. Lewis, Christlicher Apologet und Zeuge der Hoffnung',
        name_pt: 'C.S. Lewis, Apologista Cristão e Testemunha da Esperança',
        title: 'Author of Mere Christianity & Teacher of Faith at Oxford and Cambridge',
        title_it: 'Autore di «Cristianesimo così com’è» e Docente a Oxford e Cambridge',
        title_ro: 'Autorul lucrării «Creștinismul pur și simplu» și Glasul speranței evanghelice',
        title_ru: 'Автор «Просто христианства» и проповедник живой веры в Оксфорде и Кембридже',
        quote: '«I believe in Christianity as I believe that the sun has risen: not only because I see it, but because by it I see everything else.»',
        quote_it: '«Credo nel Cristianesimo come credo che il sole è sorto: non solo perché lo vedo, ma perché grazie ad esso vedo ogni altra cosa.»',
        quote_ro: '«Cred în Creștinism așa cum cred că a răsărit soarele: nu doar pentru că îl văd, ci pentru că prin lumina lui văd toate celelalte lucruri.»',
        quote_ru: '«Я верю в христианство так, как верю, что взошло солнце: не только потому, что вижу его, но и потому, что в его свете вижу все остальное.»',
        bio: 'Converted from atheism at Oxford (1898–1963); gave away two-thirds of his book royalties to the poor and strengthened millions in wartime and peace through his broadcasts and writings on Christ.',
        bio_it: 'Convertitosi dall’ateismo a Oxford (1898–1963), donò in segreto ai poveri due terzi dei proventi dei suoi libri e condusse milioni di lettori alla luce del Vangelo.',
        bio_ro: 'Convertit la Oxford (1898–1963), a dăruit în taină săracilor două treimi din veniturile cărților sale și a adus milioane de suflete la credința în Hristos.',
        bio_ru: 'Обратившись ко Христу в Оксфорде (1898–1963), тайно раздавал бедным две трети доходов от своих книг и укрепил миллионы сердец в христианской вере.',
        scriptureRef: 'Psalm 36:9; John 8:12'
      }
    ]
  },

  pt: {
    '5-13': [
      {
        traditions: ['catholic', 'traditional', 'ecumenical', 'all'],
        nationality: 'pt',
        color: 'blue',
        rank: 'solemnity',
        name: 'Our Lady of Fátima & Saints Francisco and Jacinta Marto',
        name_it: 'Beata Vergine Maria di Fátima e Santi Francesco e Giacinta Marto',
        name_ro: 'Sfânta Fecioară Maria de la Fátima și Sfinții Francisc și Jacinta Marto',
        name_ru: 'Явление Божией Матери в Фатиме и праведные отроки Франсишку и Жасинта',
        name_la: 'Beata Maria Virgo de Fatima et Sancti Franciscus et Hyacintha Marto',
        name_es: 'Nuestra Señora de Fátima y Santos Francisco y Jacinta Marto',
        name_fr: 'Notre-Dame de Fátima et Saints François et Jacinthe Marto',
        name_de: 'Unsere Liebe Frau von Fátima und Hll. Francisco und Jacinta Marto',
        name_pt: 'Nossa Senhora de Fátima e Santos Pastorinhos Francisco e Jacinta Marto',
        title: 'Queen of Peace at Cova da Iria & Call to Prayer, Penance and Conversion',
        title_it: 'Regina della Pace alla Cova da Iria e Appello alla Preghiera e alla Conversione',
        title_ro: 'Chemarea la rugăciune, pocăință și pace la Cova da Iria în Portugalia',
        title_ru: 'Призыв к покаянию, молитве и миру в Кова-да-Ирия (Португалия)',
        quote: '«Do not be afraid! Pray with all your heart for the conversion of sinners and for peace throughout the world: in the end, God’s mercy will triumph!»',
        quote_it: '«Non abbiate paura! Pregate ogni giorno per la conversione dei peccatori e per la pace nel mondo: alla fine il Cuore Immacolato trionferà!»',
        quote_ro: '«Nu vă temeți! Rugați-vă în fiecare zi pentru întoarcerea păcătoșilor și pentru pacea lumii!»',
        quote_ru: '«Не бойтесь! Молитесь каждый день об обращении грешников и о мире во всем мире!»',
        bio: 'On May 13, 1917, at Cova da Iria in Fátima, Portugal, the Virgin Mary appeared to three humble shepherd children—Lúcia, Francisco, and Jacinta—calling humanity back to prayer, penance, and peace.',
        bio_it: 'Il 13 maggio 1917 alla Cova da Iria a Fátima, in Portogallo, la Vergine Maria apparve ai tre pastorelli Lucia, Francesco e Giacinta, richiamando il mondo alla preghiera e alla pace.',
        bio_ro: 'La 13 mai 1917, la Cova da Iria în Fátima (Portugalia), Fecioara Maria s-a arătat celor trei păstorași Lucia, Francisc și Jacinta, chemând lumea la rugăciune și pace.',
        bio_ru: '13 мая 1917 года в Фатиме (Португалия) трем пастушкам — Лусии, Франсишку и Жасинте — был обращен призыв к непрестанной молитве и покаянию ради мира.',
        scriptureRef: 'Revelation 12:1; Luke 1:48'
      }
    ],
    '6-13': [
      {
        traditions: ['catholic', 'traditional', 'ecumenical', 'all'],
        nationality: 'pt',
        color: 'red',
        rank: 'solemnity',
        name: 'St. Anthony of Lisbon and Padua, Priest & Doctor of the Church (Santo António)',
        name_it: 'Sant’Antonio di Padova (e di Lisbona), Sacerdote e Dottore della Chiesa',
        name_ro: 'Sfântul Anton de Padova (și de Lisabona), Învățător al Evangheliei',
        name_ru: 'Святой Антоний Падуанский (Лиссабонский), проповедник Евангелия',
        name_la: 'Sanctus Antonius Olisiponensis et Patavinus, Doctor Evangelicus',
        name_es: 'San Antonio de Padua (y de Lisboa), Doctor Evangélico',
        name_fr: 'Saint Antoine de Padoue (et de Lisbonne), Docteur Évangélique',
        name_de: 'Hl. Antonius von Padua (und von Lissabon), Kirchenlehrer',
        name_pt: 'Santo António de Lisboa (e de Pádua), Padroeiro de Portugal e Doutor Evangélico',
        title: 'Evangelical Doctor, Wonderworker of the Poor & Beloved Patron of Lisbon',
        title_it: 'Dottore Evangelico, Taumaturgo del Pane dei Poveri e Figlio di Lisbona',
        title_ro: 'Doctorul Evanghelic, ajutătorul săracilor și fiul binecuvântat al Lisabonei',
        title_ru: 'Евангельский учитель, чудотворец и заступник бедных родом из Лиссабона',
        quote: '«Actions speak louder than words; let your words teach and your actions speak! We are rich only in what we give to the poor.»',
        quote_it: '«Vivano le opere e tacciano le parole! Siamo ricchi solo di ciò che doniamo per amore ai poveri di Cristo.»',
        quote_ro: '«Faptele să vorbească mai tare decât cuvintele! Suntem bogați doar prin ceea ce dăruim săracilor lui Hristos.»',
        quote_ru: '«Пусть дела говорят громче слов! Мы богаты лишь тем, что отдаем бедным ради Христа.»',
        bio: 'Born Fernando Martins de Bulhões in Lisbon (1195–1231); became a Franciscan friar after seeing the relics of the Morocco martyrs, preached the Gospel with such power that St. Francis called him "my bishop", and defended debtors and the poor.',
        bio_it: 'Nato a Lisbona (1195–1231) e morto a Padova, frate minore francescano chiamato «Arca del Testamento» per la conoscenza della Bibbia; difese gli indebitati e sfamò gli indigenti.',
        bio_ro: 'Născut la Lisabona (1195–1231) și adormit la Padova, supranumit «Chivotul Testamentului» pentru cunoașterea Scripturilor și apărarea celor săraci.',
        bio_ru: 'Родился в Лиссабоне (1195–1231), прославился глубочайшим знанием Священного Писания, защитой должников и милосердием к нищим.',
        scriptureRef: 'Isaiah 61:1-2; James 2:18'
      }
    ],
    '7-4': [
      {
        traditions: ['catholic', 'traditional', 'ecumenical', 'all'],
        nationality: 'pt',
        color: 'blue',
        rank: 'feast',
        name: 'St. Elizabeth of Portugal, Queen & Peacemaker (Santa Isabel de Portugal)',
        name_it: 'Santa Elisabetta del Portogallo, Regina e Pacificatrice',
        name_ro: 'Sfânta Elisabeta a Portugaliei, Regina făcătoare de pace',
        name_ru: 'Святая Изабелла (Елизавета) Португальская, царица-миротворица',
        name_la: 'Sancta Elisabeth Lusitaniae Regina Pacis',
        name_es: 'Santa Isabel de Portugal, Reina y Pacificadora',
        name_fr: 'Sainte Élisabeth de Portugal, Reine et Artisane de Paix',
        name_de: 'Hl. Elisabeth von Portugal, Königin und Friedensstifterin',
        name_pt: 'Santa Rainha Isabel de Portugal, Mãe dos Pobres e Anjo da Paz',
        title: 'The Holy Queen of Coimbra Who Rode Between Armies to Stop War',
        title_it: 'La Regina Santa di Coimbra che Cavalcò tra gli Eserciti per Fermare la Guerra',
        title_ro: 'Regina Sfântă din Coimbra care a oprit vărsarea de sânge așezându-se între oști',
        title_ru: 'Святая королева Коимбры, остановившая кровопролитие между войсками',
        quote: '«Blessed are the peacemakers, for they shall be called children of God! Where discord reigns, let us ride forth with forgiveness and charity.»',
        quote_it: '«Beati gli operatori di pace, perché saranno chiamati figli di Dio! Dove regna la discordia, portiamo il perdono.»',
        quote_ro: '«Fericiți făcătorii de pace, căci aceia fiii lui Dumnezeu se vor chema! Unde este vrajbă, să aducem iertarea lui Hristos.»',
        quote_ru: '«Блаженны миротворцы, ибо они нарекутся сынами Божиими!»',
        bio: 'Queen of Portugal (1271–1336) and grand-niece of St. Elizabeth of Hungary; rode on a mule directly between the battle lines at Alvalade in 1323 to prevent civil war between her husband and son, and retired to the Poor Clares of Coimbra.',
        bio_it: 'Regina del Portogallo (1271–1336), cavalcò disarmata nel 1323 tra gli eserciti schierati ad Alvalade per impedire la guerra fratricida, consacrando poi la vita ai poveri a Coimbra.',
        bio_ro: 'Regină a Portugaliei (1271–1336), s-a așezat fără teamă între oștile gata de luptă la Alvalade în 1323 pentru a opri războiul dintre tată și fiu, slujind apoi săracilor la Coimbra.',
        bio_ru: 'Королева Португалии (1271–1336), выехавшая верхом между готовыми к битве войсками при Алваладе в 1323 году, чтобы предотвратить братоубийственную войну.',
        scriptureRef: 'Matthew 5:9'
      }
    ]
  },

  ge: {
    '1-14': [
      {
        traditions: ['orthodox', 'catholic', 'ecumenical', 'all'],
        nationality: 'ge',
        color: 'red',
        rank: 'solemnity',
        name: 'St. Nina (Nino), Equal-to-the-Apostles & Enlightener of Georgia',
        name_it: 'Santa Nina (Cristiana), Uguale agli Apostoli e Illuminatrice della Georgia',
        name_ro: 'Sfânta Cuvioasă Nina, Întocmai cu Apostolii, Luminătoarea Georgiei',
        name_ru: 'Святая равноапостольная Нина, просветительница Грузии',
        name_la: 'Sancta Nina (Christiana) Apostolis Aequalis, Illuminatrix Georgiae',
        name_es: 'Santa Nina, Igual a los Apóstoles e Iluminadora de Georgia',
        name_fr: 'Sainte Nino, Égale aux Apôtres et Illuminatrice de la Géorgie',
        name_de: 'Hl. Nina (Nino), Apostelgleiche und Erleuchterin Georgiens',
        name_pt: 'Santa Nina, Igual aos Apóstolos e Iluminadora da Geórgia',
        title: 'Bearer of the Grapevine Cross Bound with Her Hair at Mtskheta',
        title_it: 'Portatrice della Croce di Tralci di Vite a Mtskheta',
        title_ro: 'Purtătoarea Crucii din mlădițe de viță-de-vie legată cu șuvițele părului ei',
        title_ru: 'Апостол Иверии, принесшая в Мцхету крест из виноградной лозы',
        quote: '«Rejoice, ONina, bride of Christ, who with the cross of grapevine branches turned the whole land of Iberia into a flourishing vineyard of the Lord!»',
        quote_it: '«Con la croce di tralci di vite hai trasformato l’intera terra di Georgia in una vigna fiorita del Signore!»',
        quote_ro: '«Cu crucea din mlădițe de viță-de-vie ai prefăcut întregul pământ al Georgiei într-o vie roditoare a Domnului!»',
        quote_ru: '«Крестом из виноградной лозы ты обратила всю землю Иверскую в цветущий виноградник Господень!»',
        bio: 'Sent by the Mother of God with a cross of grapevine shoots bound with her own hair; preached Christ in Mtskheta, leading King Mirian and Queen Nana to baptize Georgia as a Christian nation in 326.',
        bio_it: 'Inviata dalla Madre di Dio con una croce di tralci di vite legata coi propri capelli, annunciò il Vangelo a Mtskheta portando la Georgia al battesimo cristiano nel 326.',
        bio_ro: 'Trimisă de Maica Domnului cu o cruce din viță-de-vie, a vestit Evanghelia în Mtskheta, aducând pe regele Mirian și regina Nana la botezul întregii Georgii în anul 326.',
        bio_ru: 'Врученная Божией Матерью крестом из виноградной лозы, проповедовала Христа во Мцхете и привела царя Мириана и всю Грузию ко святому Крещению в 326 году.',
        scriptureRef: 'John 15:5'
      }
    ],
    '5-1': [
      {
        traditions: ['orthodox', 'ecumenical', 'all'],
        nationality: 'ge',
        color: 'blue',
        rank: 'feast',
        name: 'Holy Right-Believing Queen Tamar the Great of Georgia',
        name_it: 'Santa Regina Tamara la Grande della Georgia',
        name_ro: 'Sfânta Dreptcredincioasă Regină Tamara cea Mare a Georgiei',
        name_ru: 'Святая благоверная царица Тамара Грузинская',
        name_la: 'Sancta Tamara Magna Regina Georgiae',
        name_es: 'Santa Reina Tamara la Grande de Georgia',
        name_fr: 'Sainte Reine Tamar la Grande de Géorgie',
        name_de: 'Hl. Königin Tamar die Große von Georgien',
        name_pt: 'Santa Rainha Tamar a Grande da Geórgia',
        title: 'Mother of Orphans, Abolisher of Death Penalty & Builder of Vardzia',
        title_it: 'Madre degli Orfani, Costruttrice di Vardzia e Sovrana di Misericordia',
        title_ro: 'Maica orfanilor, ctitora mănăstirii în stâncă Vardzia și Pildă de blândețe creștină',
        title_ru: 'Матерь сирот, строительница пещерной лавры Вардзиа и милостивая правительница',
        quote: '«I am the father of orphans and the judge of widows: let no blood be shed in anger, and let no poor soul depart hungry from our gates!»',
        quote_it: '«Io sono padre degli orfani e tutela delle vedove: nessun povero si allontani affamato dalle nostre porte!»',
        quote_ro: '«Să fim părinți ai orfanilor și sprijinitori ai văduvelor: niciun sărac să nu plece flămând de la porțile noastre!»',
        quote_ru: '«Будем отцами сирот и защитниками вдов: да не уйдет ни один нищий голодным от врат наших!»',
        bio: 'Reigned during Georgia’s Golden Age (1184–1213); abolished capital punishment and bodily mutilation, walked barefoot in prayer before her army, sewed garments for beggars by night, and built Vardzia Monastery.',
        bio_it: 'Regnò nell’età d’oro della Georgia (1184–1213), abolì la pena di morte, cuciva di notte vesti per i poveri e fece scavare il monastero rupestre di Vardzia.',
        bio_ro: 'A domnit în epoca de aur a Georgiei (1184–1213), a desființat pedeapsa cu moartea, cosea noaptea haine pentru săraci și a zidit mănăstirea în stâncă de la Vardzia.',
        bio_ru: 'Правила в золотой век Грузии (1184–1213), отменила смертную казнь, ночами шила одежды для нищих и воздвигла пещерный монастырь Вардзиа.',
        scriptureRef: 'Psalm 68:5'
      }
    ]
  },

  rs: {
    '1-14': [
      {
        traditions: ['orthodox', 'ecumenical', 'all'],
        nationality: 'rs',
        color: 'red',
        rank: 'solemnity',
        name: 'St. Sava, First Archbishop & Equal-to-the-Apostles of Serbia',
        name_it: 'San Sava, Primo Arcivescovo e Illuminatore della Serbia',
        name_ro: 'Sfântul Ierarh Sava, Primul Arhiepiscop și Luminătorul Serbiei',
        name_ru: 'Святитель Савва, первый архиепископ и просветитель Сербский',
        name_la: 'Sanctus Sabbas, Primus Archiepiscopus Serbiae',
        name_es: 'San Sava, Primer Arzobispo e Iluminador de Serbia',
        name_fr: 'Saint Sava, Premier Archevêque et Illuminateur de la Serbie',
        name_de: 'Hl. Sava, Erster Erzbischof und Erleuchter Serbiens',
        name_pt: 'São Sava, Primeiro Arcebispo e Iluminador da Sérvia',
        title: 'Royal Prince Who Fled to Mount Athos, Founder of Hilandar & Peacemaker',
        title_it: 'Principe Reale Fuggito sul Monte Athos, Fondatore di Hilandar e Pacificatore',
        title_ro: 'Prințul care a lăsat tronul pentru Muntele Athos, Ctitorul Hilandarului și Făcătorul de pace',
        title_ru: 'Царевич, ушедший на Афон, основатель монастыря Хиландар и примиритель братьев',
        quote: '«Walk in the path of peace and brotherly love, keeping the Orthodox faith undefiled and opening schools and hospitals for all people.»',
        quote_it: '«Camminate nella via della pace e dell’amore fraterno, custodendo intatta la fede e aprendo scuole e ospedali per il popolo.»',
        quote_ro: '«Umblați pe calea păcii și a iubirii frățești, păzind credința neîntinată și ridicând școli și spitale pentru popor.»',
        quote_ru: '«Ходите путем мира и братской любви, храня правую веру и созидая школы и больницы для народа.»',
        bio: 'Born Prince Rastko Nemanjić (1175–1236); left his royal palace at 17 for Mount Athos, founded Hilandar Monastery with his father St. Simeon, reconciled his warring brothers over their father’s relics, and organized the Serbian Church.',
        bio_it: 'Nato principe Rastko Nemanjić (1175–1236), lasciò la reggia a 17 anni per il Monte Athos, fondò il monastero di Hilandar col padre san Simeone, riconciliò i fratelli in guerra e fu il primo arcivescovo della Serbia.',
        bio_ro: 'Născut ca prințul Rastko Nemanjić (1175–1236), a părăsit palatul la 17 ani pentru Muntele Athos, a întemeiat Mănăstirea Hilandar și a împăcat pe frații săi învrăjbiți.',
        bio_ru: 'Младший сын Стефана Немани (1175–1236), тайно ушедший на Афон в 17 лет; основал Хиландар, примирил враждовавших братьев и стал первым архиепископом Сербии.',
        scriptureRef: 'Hebrews 11:24-26'
      }
    ],
    '5-12': [
      {
        traditions: ['orthodox', 'ecumenical', 'all'],
        nationality: 'rs',
        color: 'red',
        rank: 'solemnity',
        name: 'St. Basil of Ostrog the Wonderworker (Sveti Vasilije Ostroški)',
        name_it: 'San Basilio di Ostrog il Taumaturgo',
        name_ro: 'Sfântul Ierarh Vasile de Ostrog, Mare Făcător de minuni',
        name_ru: 'Святитель Василий Острожский чудотворец',
        name_la: 'Sanctus Basilius Ostrogiensis Thaumaturgus',
        name_es: 'San Basilio de Ostrog el Taumaturgo',
        name_fr: 'Saint Basile d’Ostrog le Thaumaturge',
        name_de: 'Hl. Basilius von Ostrog der Wundertäter',
        name_pt: 'São Basílio de Ostrog o Taumaturgo',
        title: 'Metropolitan of Zahumlje & Healer of All Who Climb to Ostrog Cliff Monastery',
        title_it: 'Metropolita e Guaritore Taumaturgo del Monastero Rupestre di Ostrog',
        title_ro: 'Mitropolitul făcător de minuni din mănăstirea săpată în stânca Ostrogului',
        title_ru: 'Митрополит Захолмский и великий целитель скальной обители Острог',
        quote: '«From the high rock of Ostrog a miraculous vine sprouted where no soil existed, witnessing that nothing is impossible to the prayer of faith!»',
        quote_it: '«Dalla nuda roccia di Ostrog è germogliata una vite miracolosa, segno che nulla è impossibile alla preghiera della fede!»',
        quote_ro: '«Din stânca seacă a Ostrogului a răsărit o viță-de-vie minunată, mărturie că nimic nu este cu neputință rugăciunii credinței!»',
        quote_ru: '«Из голой скалы Острога произросла чудесная виноградная лоза — свидетельство того, что нет ничего невозможного для молитвы веры!»',
        bio: 'Lived in a freezing cliff cave high in the mountains of Montenegro (1610–1671), defending his flock during harsh Ottoman persecutions; his incorrupt relics at Ostrog Monastery heal pilgrims of all faiths.',
        bio_it: 'Visse in una grotta scavata a strapiombo sulla parete rocciosa di Ostrog (1610–1671), difendendo il suo popolo; le sue reliquie incorrotte operano innumerevoli guarigioni.',
        bio_ro: 'S-a nevoit într-o peșteră din stânca abruptă de la Ostrog (1610–1671), apărându-și turma în vremuri grele; sfintele sale moaște săvârșesc neîncetat tămăduiri.',
        bio_ru: 'Подвизался в высокой скальной пещере Острога (1610–1671), защищая паству в годы испытаний; у его нетленных мощей совершаются бесчисленные исцеления.',
        scriptureRef: 'Mark 11:22-24'
      }
    ]
  }
};

// Strips foreign local saints from compound Orthodox calendar entries when a specific nationality is selected
// e.g. "Holy Metrophanes of Constantinople & Martyrs Zoticus, Attalus, Camasis and Philip of Niculițel" -> "Holy Metrophanes of Constantinople"
export function cleanOrthodoxSaintForNationality(saint, normNat) {
  if (!saint || !normNat || normNat === 'universal') return saint;

  const copy = { ...saint };

  // Special case: 12-7 has "Holy Great Martyr Philothea of Argeș (Romania) & St. Ambrose, Bishop of Milan"
  if (copy.name && copy.name.includes('Philothea of Argeș') && normNat !== 'ro') {
    copy.name = 'St. Ambrose, Bishop of Milan & Wonderworker';
    copy.name_it = 'Sant’Ambrogio, Vescovo di Milano';
    copy.name_ro = 'Sfântul Ierarh Ambrozie, Episcopul Milanului';
    copy.name_ru = 'Святитель Амвросий, епископ Медиоланский';
    copy.name_la = 'Sanctus Ambrosius Episcopus Mediolanensis';
    copy.name_es = 'San Ambrosio, Obispo de Milán';
    copy.name_fr = 'Saint Ambroise, Évêque de Milan';
    copy.name_de = 'Hl. Ambrosius, Bischof von Mailand';
    copy.name_pt = 'Santo Ambrósio, Bispo de Milão';
    copy.title = 'Champion of Orthodoxy, Father of the Poor & Bishop of Milan';
    copy.title_it = 'Grande Dottore della Chiesa, Padre dei Poveri e Vescovo di Milano';
    copy.title_ro = 'Marele Ierarh al Milanului și Apărătorul Dreptei Credințe';
    copy.title_ru = 'Великий святитель Медиоланский и защитник православия';
    copy.nationality = normNat === 'it' ? 'it' : 'universal';
    return copy;
  }

  // If the entry's raw nationality is different from normNat, check if the name is a compound "Universal & Foreign"
  const rawNat = (copy.nationality || 'universal').toLowerCase();
  if (rawNat !== normNat && rawNat !== 'universal') {
    const foreignPatterns = [
      /\s*(&|and|e|și|и|et|y|und)\s*([^&]*?(Niculițel|Suceava|Tismana|Cernica|Argeș|Neamț|Voroneț|Sihla|Durostorum|Dobrogea|Chernigov|Чернигов|Polotsk|Полоцк|Sarov|Саров|Radonezh|Радонеж|Sofia|Софийск|Bitola|Битольск|Romania|Румын)[^&]*)$/i
    ];
    const nameFields = ['name', 'name_it', 'name_ro', 'name_ru', 'name_la', 'name_es', 'name_fr', 'name_de', 'name_pt'];
    for (const field of nameFields) {
      if (copy[field]) {
        for (const pat of foreignPatterns) {
          copy[field] = copy[field].replace(pat, '').trim();
        }
      }
    }
    copy.nationality = 'universal';
  }

  return copy;
}
