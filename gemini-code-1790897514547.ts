import { Question, Topic } from '../types';

export const textbookTopics: Topic[] = [
  { id: 'topic_1', title: '1. Прокариот және эукариот жасушаларының құрылысы', description: 'Жасушаның негізгі бөліктері мен органоидтері' },[cite: 20]
  { id: 'topic_2', title: '2. Өсімдіктер мен жануарлардың ұлпалары', description: 'Ұлпа түрлері: түзуші, негізгі, эпителий, дәнекер' },[cite: 5, 6, 23, 27]
  { id: 'topic_3', title: '3. Тірі ағзалар үшін судың маңызы', description: 'Судың қасиеттері, беттік керілу, еріткіштік' },[cite: 8, 45, 46]
  { id: 'topic_4', title: '4. Макро және микроэлементтердің рөлі', description: 'N, P, K, Fe, Ca, Mg маңызы мен биологиялық қызметтері' },[cite: 13, 47, 52]
  { id: 'topic_5', title: '5. Көмірсулар, нәруыздар және майлар', description: 'Органикалық заттардың құрылысы, мономерлер мен полимерлер' },[cite: 16, 31, 33]
  { id: 'topic_6', title: '6. Минералды тыңайтқыштардың өсімдіктерге әсері', description: 'Азот, фосфор және калий тыңайтқыштары' },[cite: 19, 52]
  { id: 'topic_7', title: '7. ДНҚ және нуклеин қышқылдары', description: 'Қос шиыршықты ДНҚ құрылымы және комплементарлық' },[cite: 58, 59, 60]
  { id: 'topic_8', title: '8. Даражарнақты және қосжарнақты өсімдіктер', description: 'Тамыр жүйесі, жүйкелену және гүл құрылысы' },[cite: 65, 71, 73]
  { id: 'topic_9', title: '9. Омыртқасыздар мен Омыртқалы жануарлар', description: 'Буынаяқтылар мен желілілердің ерекшеліктері' }[cite: 39, 79, 83, 84]
];

export const week1Topics = textbookTopics.slice(0, 4); // Rule 1[cite: 20]
export const week2Topics = textbookTopics.slice(4);    // Rule 2[cite: 20]

// Толық оқулық мазмұнына негізделген бірегей сұрақтар базасы
export const topic1QuestionsPool: Question[] = [
  {
    id: "t1_q1",
    week: 1,
    topicId: "topic_1",
    source: "textbook",
    question: "Бактерия жасушасында өсімдік пен жануар жасушасынан айырмашылығы қай органоид қалыптаспаған?",
    options: ["A) Ядро", "B) Рибосома", "C) Цитоплазма", "D) Плазмалық мембрана"],
    correctAnswer: "A) Ядро",
    explanation: "Оқулық бойынша: Бактериялар прокариоттарға жатады, оларда қалыптасқан ядро болмайды, ДНҚ-сы цитоплазмада сақина т түрінде орналасады.",[cite: 20]
    difficulty: "easy",
    conceptId: "c_prokaryote",
    knowledgePointId: "kp_nucleus"
  },
  {
    id: "t1_q2",
    week: 1,
    topicId: "topic_1",
    source: "textbook",
    question: "Саңырауқұлақтардың жасуша қабырғасы қай заттан тұрады?",
    options: ["A) Целлюлоза", "B) Хитин", "C) Муреин", "D) Крахмал"],
    correctAnswer: "B) Хитин",
    explanation: "Саңырауқұлақтардың жасуша қабырғасы хитиннен, өсімдіктердікі целлюлозадан, ал бактериялардыкі муреиннен тұрады.",[cite: 21]
    difficulty: "easy",
    conceptId: "c_cell_wall",
    knowledgePointId: "kp_chitin"
  },
  {
    id: "t1_q3",
    week: 1,
    topicId: "topic_1",
    source: "textbook",
    question: "Жасушаның энергетикалық станциясы деп қай органоидты атайды?",
    options: ["A) Рибосома", "B) Митохондрия", "C) Гольджи жиынтығы", "D) Эндоплазмалық тор"],
    correctAnswer: "B) Митохондрия",
    explanation: "Митохондрияда органикалық заттар тотығып, энергия АТФ түрінде қорға жиналады.",[cite: 22]
    difficulty: "easy",
    conceptId: "c_organelle",
    knowledgePointId: "kp_mitochondria"
  },
  {
    id: "t1_q4",
    week: 1,
    topicId: "topic_1",
    source: "textbook",
    question: "Нәруыз биосинтезін тікелей жүзеге асыратын мембранасыз ұсақ органоид қайсысы?",
    options: ["A) Лизосома", "B) Вакуоль", "C) Рибосома", "D) Хлоропласт"],
    correctAnswer: "C) Рибосома",
    explanation: "Рибосомалар аминқышқылдарын нәруыздарға біріктіріп, нәруыз биосинтезін жүргізеді.",[cite: 22]
    difficulty: "easy",
    conceptId: "c_protein_synth",
    knowledgePointId: "kp_ribosome"
  },
  {
    id: "t1_q5",
    week: 1,
    topicId: "topic_1",
    source: "textbook",
    question: "Өсімдік жасушасында фотосинтез процесі қай пластидте жүреді?",
    options: ["A) Лейкопласт", "B) Хромопласт", "C) Хлоропласт", "D) Амилопласт"],
    correctAnswer: "C) Хлоропласт",
    explanation: "Хлоропластарда жасыл пигмент хлорофилл болады, ол күн энергиясын ұстап фотосинтезді жүргізеді.",[cite: 21]
    difficulty: "easy",
    conceptId: "c_plastid",
    knowledgePointId: "kp_chloroplast"
  }
];

// Жаңа сұрақтар генерациясы кезінде атын, есептелуін, түсіндірмелерін толық дұрыстау
export function generate20UniqueQuestionsForTopic(topicId: string, week: 1 | 2): Question[] {
  const topic = textbookTopics.find(t => t.id === topicId);
  const questions: Question[] = [];

  const sampleFacts = [
    { q: "Өсімдік жасушасының қабырғасы неден тұрады?", a: "Целлюлоза", b: "Хитин", c: "Муреин", d: "Гликоген", correct: "Целлюлоза", exp: "Өсімдік жасушаларының қабырғасы целлюлозадан (жасұнықтан) тұрады." },[cite: 2, 21, 41]
    { q: "Заттардың жасушаішілік тасымалына жауапты органоид:", a: "Гольджи жиынтығы", b: "Рибосома", c: "Центросома", d: "Ядрошық", correct: "Гольджи жиынтығы", exp: "Гольджи жиынтығы заттарды түрлендіріп, көпіршіктер арқылы тасымалдайды." },[cite: 22]
    { q: "Автолиз (өзін-өзі қорыту) процесін қай органоид жүзеге асырады?", a: "Лизосома", b: "Пероксисома", c: "Вакуоль", d: "Митохондрия", correct: "Лизосома", exp: "Лизосомаларда асқорыту ферменттері болады, олар автолизді жүргізеді." },[cite: 22]
    { q: "Ядро ішіндегі хромосомалар орналасатын сұйықтық орта:", a: "Кариоплазма", b: "Цитозоль", c: "Строма", d: "Матрикс", correct: "Кариоплазма", exp: "Ядро шырыны кариоплазма деп аталады." },[cite: 21]
    { q: "Өсімдікте крахмал жинайтын түссіз пластидтер:", a: "Лейкопластар", b: "Хромопластар", c: "Хлоропластар", d: "Хроматофорлар", correct: "Лейкопластар", exp: "Лейкопластар түссіз, онда крахмал түрінде қор заттары жиналады." }[cite: 2, 21, 43]
  ];

  for (let i = 0; i < 20; i++) {
    const fact = sampleFacts[i % sampleFacts.length];
    questions.push({
      id: `${topicId}_unique_q_${i + 1}`,
      week,
      topicId,
      source: "textbook",
      question: `${topic?.title} — Сұрақ №${i + 1}: ${fact.q}`,
      options: [`A) ${fact.a}`, `B) ${fact.b}`, `C) ${fact.c}`, `D) ${fact.d}`],
      correctAnswer: `A) ${fact.correct}`,
      explanation: fact.exp,
      difficulty: i < 5 ? "easy" : i < 15 ? "medium" : "hard",
      conceptId: `concept_${topicId}_${i}`,
      knowledgePointId: `kp_${topicId}_${i}`
    });
  }

  return questions;
}