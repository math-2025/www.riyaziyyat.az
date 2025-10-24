import { type Exam, type Group, type Student } from "@/types";

export const mockExams: Exam[] = [
  {
    id: "algebra-basics-1",
    title: "Cəbrə Giriş",
    description: "Əsas cəbri anlayışlar, tənliklər və ifadələr üzrə biliklərinizi yoxlayın. Bu test başlanğıc səviyyə üçün nəzərdə tutulub.",
    durationInMinutes: 20,
    questions: [
      {
        id: "q1",
        questionText: "2x + 5 = 15 tənliyində x-in qiymətini tapın.",
        options: ["3", "5", "7", "10"],
        correctAnswerIndex: 1,
        explanation: "Tənliyi həll etmək üçün: 2x = 15 - 5 => 2x = 10 => x = 10 / 2 => x = 5. Düzgün cavab 5-dir."
      },
      {
        id: "q2",
        questionText: "(a+b)² ifadəsinin açılışı hansıdır?",
        options: ["a² + b²", "a² - 2ab + b²", "a² + 2ab + b²", "a² - b²"],
        correctAnswerIndex: 2,
        explanation: "Müxtəsər vurma düsturuna görə (a+b)² = a² + 2ab + b²."
      },
      {
        id: "q3",
        questionText: "3(y - 4) = 9 ifadəsini y üçün həll edin.",
        options: ["5", "6", "7", "8"],
        correctAnswerIndex: 2,
        explanation: "Hər tərəfi 3-ə bölək: y - 4 = 3. Sonra y = 3 + 4 => y = 7."
      }
    ]
  },
  {
    id: "geometry-shapes-1",
    title: "Həndəsi fiqurlar",
    description: "Üçbucaqlar, dördbucaqlılar və dairələr haqqında əsas biliklərinizi sınayın. Perimetr və sahə hesablama bacarıqları yoxlanılacaq.",
    durationInMinutes: 25,
    questions: [
      {
        id: "q1",
        questionText: "Tərəfi 6 sm olan kvadratın sahəsi nə qədərdir?",
        options: ["12 sm²", "24 sm²", "36 sm²", "6 sm²"],
        correctAnswerIndex: 2,
        explanation: "Kvadratın sahəsi tərəfinin kvadratına bərabərdir: S = a² = 6² = 36 sm²."
      },
      {
        id: "q2",
        questionText: "Radiusu 5 sm olan dairənin çevrəsinin uzunluğunu tapın (π ≈ 3.14).",
        options: ["15.7 sm", "31.4 sm", "78.5 sm", "25 sm"],
        correctAnswerIndex: 1,
        explanation: "Çevrənin uzunluğu düsturu L = 2πr. L = 2 * 3.14 * 5 = 31.4 sm."
      },
      {
        id: "q3",
        questionText: "Katetləri 3 sm və 4 sm olan düzbucaqlı üçbucağın hipotenuzunu tapın.",
        options: ["5 sm", "6 sm", "7 sm", "25 sm"],
        correctAnswerIndex: 0,
        explanation: "Pifaqor teoreminə görə c² = a² + b² => c² = 3² + 4² = 9 + 16 = 25. Buradan c = √25 = 5 sm."
      }
    ]
  }
];


export const mockGroups: Group[] = [
    { id: 'group-a', name: 'Qrup A' },
    { id: 'group-b', name: 'Qrup B' },
    { id: 'group-c', name: 'Qrup C' },
];

export const mockStudents: Student[] = [
    { id: 'student-1', fullName: 'Vəliyev Vəli', group: 'Qrup A', username: 'veli.v', status: 'active' },
    { id: 'student-2', fullName: 'Səmədova Səma', group: 'Qrup B', username: 'sema.s', status: 'active' },
    { id: 'student-3', fullName: 'Quliyev Qulu', group: 'Qrup A', username: 'qulu.q', status: 'inactive' },
    { id: 'student-4', fullName: 'Nəbiyeva Nərgiz', group: 'Qrup C', username: 'nergiz.n', status: 'active' },
];
