import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import Icon from "@/components/ui/icon";
import { useToast } from "@/hooks/use-toast";

interface Topic {
  id: number;
  title: string;
  description: string;
  icon: string;
  progress: number;
  tasks: number;
  completed: number;
  difficulty: string;
}

interface TheorySection {
  id: string;
  title: string;
  content: string;
  examples?: string[];
  tasks?: string[];
}

const BACKEND_URL = "https://functions.poehali.dev/a17bcb9e-7062-4681-a9c2-64d97d56877f";

const topicTheory: Record<number, TheorySection[]> = {
  1: [
    {
      id: "natural",
      title: "Натуральные числа",
      content: "Натуральные числа — это числа, которые используются для счёта предметов: 1, 2, 3, 4, 5 и т.д. Ноль не является натуральным числом.",
      examples: [
        "Сложение: 125 + 378 = 503",
        "Вычитание: 500 - 234 = 266",
        "Умножение: 23 × 15 = 345"
      ]
    },
    {
      id: "fractions",
      title: "Обыкновенные дроби",
      content: "Дробь — это число, состоящее из числителя и знаменателя. Числитель показывает, сколько частей взято, а знаменатель — на сколько частей разделено целое.",
      examples: [
        "Сложение: 1/4 + 1/4 = 2/4 = 1/2",
        "Вычитание: 3/5 - 1/5 = 2/5",
        "Умножение: 2/3 × 3/4 = 6/12 = 1/2"
      ]
    },
    {
      id: "percent",
      title: "Проценты",
      content: "Процент — это сотая часть числа. Обозначается знаком %. Чтобы найти процент от числа, нужно умножить это число на процент и разделить на 100.",
      examples: [
        "10% от 200 = 200 × 10 / 100 = 20",
        "Увеличить 50 на 20% = 50 × 1.2 = 60",
        "Уменьшить 100 на 15% = 100 × 0.85 = 85"
      ]
    }
  ],
  2: [
    {
      id: "basics",
      title: "Основные алгебраические преобразования",
      content: "Алгебраические выражения состоят из чисел, переменных и знаков операций. Важно уметь упрощать выражения, раскрывать скобки и приводить подобные слагаемые.",
      examples: [
        "2x + 3x = 5x",
        "3(x + 2) = 3x + 6",
        "x² - 4 = (x - 2)(x + 2)"
      ]
    },
    {
      id: "formulas",
      title: "Формулы сокращённого умножения",
      content: "ФСУ помогают быстро выполнять умножение и разложение на множители. Основные формулы нужно знать наизусть.",
      examples: [
        "(a + b)² = a² + 2ab + b²",
        "(a - b)² = a² - 2ab + b²",
        "a² - b² = (a - b)(a + b)"
      ]
    }
  ],
  3: [
    {
      id: "linear",
      title: "Линейные уравнения",
      content: "Линейное уравнение — это уравнение вида ax + b = 0. Для решения нужно перенести все слагаемые с x в одну сторону, числа в другую.",
      examples: [
        "2x + 5 = 11 → 2x = 6 → x = 3",
        "5x - 7 = 3x + 1 → 2x = 8 → x = 4",
        "3(x - 2) = 9 → x - 2 = 3 → x = 5"
      ]
    },
    {
      id: "quadratic",
      title: "Квадратные уравнения",
      content: "Квадратное уравнение имеет вид ax² + bx + c = 0. Решается через дискриминант D = b² - 4ac. Если D > 0, два корня; D = 0, один корень; D < 0, нет корней.",
      examples: [
        "x² - 5x + 6 = 0 → D = 25 - 24 = 1 → x₁ = 2, x₂ = 3",
        "x² - 4x + 4 = 0 → D = 0 → x = 2",
        "x² + x + 1 = 0 → D = -3 < 0 → нет решений"
      ]
    }
  ],
  4: [
    {
      id: "linear-function",
      title: "Линейная функция",
      content: "Линейная функция имеет вид y = kx + b, где k — угловой коэффициент, b — точка пересечения с осью OY. График — прямая линия.",
      examples: [
        "y = 2x + 1 (k = 2, b = 1)",
        "y = -x + 3 (убывающая функция)",
        "y = 5 (горизонтальная прямая)"
      ]
    },
    {
      id: "quadratic-function",
      title: "Квадратичная функция",
      content: "Функция вида y = ax² + bx + c. График — парабола. Если a > 0, ветви вверх; если a < 0, ветви вниз. Вершина параболы находится в точке x = -b/(2a).",
      examples: [
        "y = x² (парабола с вершиной в (0,0))",
        "y = -x² + 4 (парабола ветвями вниз)",
        "y = (x - 2)² + 1 (сдвиг вершины)"
      ]
    }
  ],
  5: [
    {
      id: "triangles",
      title: "Треугольники",
      content: "Треугольник — фигура с тремя сторонами и тремя углами. Сумма углов треугольника равна 180°. Виды: равносторонний, равнобедренный, прямоугольный.",
      examples: [
        "Площадь: S = (a × h) / 2",
        "Теорема Пифагора: a² + b² = c²",
        "Периметр: P = a + b + c"
      ]
    },
    {
      id: "quadrilaterals",
      title: "Четырёхугольники",
      content: "Четырёхугольник — фигура с четырьмя сторонами. Виды: квадрат, прямоугольник, параллелограмм, ромб, трапеция.",
      examples: [
        "Площадь квадрата: S = a²",
        "Площадь прямоугольника: S = a × b",
        "Площадь трапеции: S = (a + b) × h / 2"
      ]
    },
    {
      id: "circles",
      title: "Окружность и круг",
      content: "Окружность — множество точек, равноудалённых от центра. Круг — часть плоскости, ограниченная окружностью.",
      examples: [
        "Длина окружности: C = 2πr",
        "Площадь круга: S = πr²",
        "Диаметр: d = 2r"
      ]
    }
  ],
  6: [
    {
      id: "statistics",
      title: "Статистические характеристики",
      content: "Среднее арифметическое — сумма всех чисел, делённая на их количество. Мода — наиболее часто встречающееся значение. Медиана — среднее значение ряда.",
      examples: [
        "Среднее: (2 + 4 + 6 + 8) / 4 = 5",
        "Мода ряда 1, 2, 2, 3 = 2",
        "Медиана ряда 1, 3, 5, 7 = 4"
      ]
    },
    {
      id: "probability",
      title: "Теория вероятностей",
      content: "Вероятность события — отношение числа благоприятных исходов к общему числу возможных исходов. P(A) = m/n, где 0 ≤ P ≤ 1.",
      examples: [
        "Вероятность выпадения 6 на кубике = 1/6",
        "Вероятность чётного числа на кубике = 3/6 = 1/2",
        "Сумма вероятностей всех событий = 1"
      ]
    }
  ]
};

const TopicDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    fetchTopic();
  }, [id]);

  const fetchTopic = async () => {
    try {
      const response = await fetch(BACKEND_URL);
      const data = await response.json();
      const foundTopic = data.topics.find((t: Topic) => t.id === Number(id));
      if (foundTopic) {
        setTopic(foundTopic);
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить тему",
        variant: "destructive"
      });
    }
  };

  const toggleSection = (sectionId: string) => {
    const newCompleted = new Set(completedSections);
    if (newCompleted.has(sectionId)) {
      newCompleted.delete(sectionId);
    } else {
      newCompleted.add(sectionId);
    }
    setCompletedSections(newCompleted);
    updateProgress(newCompleted.size);
  };

  const updateProgress = async (completed: number) => {
    if (!topic) return;
    
    try {
      await fetch(BACKEND_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          student_id: 1,
          topic_id: topic.id,
          completed_tasks: completed
        })
      });
      await fetchTopic();
    } catch (error) {
      console.error('Failed to update progress:', error);
    }
  };

  if (!topic) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Icon name="Loader2" className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  const theory = topicTheory[topic.id] || [];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/')}>
              <Icon name="ArrowLeft" size={20} />
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{topic.title}</h1>
              <p className="text-sm text-muted-foreground">{topic.description}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="Target" className="text-primary" size={24} />
              Ваш прогресс
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Изучено материалов</span>
                <span className="font-semibold">{completedSections.size} / {theory.length}</span>
              </div>
              <Progress 
                value={(completedSections.size / theory.length) * 100} 
                className="h-2" 
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-4">Теоретический материал</h2>
            <Accordion type="single" collapsible className="space-y-4">
              {theory.map((section) => (
                <AccordionItem 
                  key={section.id} 
                  value={section.id}
                  className="border rounded-lg px-6 bg-white"
                >
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3 text-left">
                      <Checkbox 
                        checked={completedSections.has(section.id)}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSection(section.id);
                        }}
                      />
                      <span className="font-semibold">{section.title}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4">
                    <div className="space-y-4 pl-9">
                      <p className="text-muted-foreground leading-relaxed">
                        {section.content}
                      </p>
                      
                      {section.examples && section.examples.length > 0 && (
                        <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <Icon name="Lightbulb" className="text-primary" size={18} />
                            Примеры
                          </h4>
                          <ul className="space-y-2">
                            {section.examples.map((example, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <Icon name="Check" className="text-primary mt-1 flex-shrink-0" size={16} />
                                <code className="text-sm bg-white px-2 py-1 rounded">
                                  {example}
                                </code>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

        <div className="mt-8 bg-blue-50 rounded-lg p-6 border border-blue-200">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon name="BookOpen" className="text-white" size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">Рекомендации по изучению</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Внимательно изучите теорию, прежде чем переходить к практике</li>
                <li>• Разберите все примеры и попробуйте решить их самостоятельно</li>
                <li>• Отмечайте изученные разделы для отслеживания прогресса</li>
                <li>• Регулярно возвращайтесь к материалу для повторения</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TopicDetail;
