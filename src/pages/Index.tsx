import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Icon from "@/components/ui/icon";
import { useState } from "react";

interface Topic {
  id: number;
  title: string;
  description: string;
  icon: string;
  progress: number;
  tasks: number;
  difficulty: "easy" | "medium" | "hard";
}

const Index = () => {
  const [topics] = useState<Topic[]>([
    {
      id: 1,
      title: "Числа и вычисления",
      description: "Натуральные числа, дроби, проценты, степени",
      icon: "Calculator",
      progress: 0,
      tasks: 12,
      difficulty: "easy"
    },
    {
      id: 2,
      title: "Алгебраические выражения",
      description: "Преобразование выражений, формулы сокращенного умножения",
      icon: "FunctionSquare",
      progress: 0,
      tasks: 15,
      difficulty: "medium"
    },
    {
      id: 3,
      title: "Уравнения и неравенства",
      description: "Линейные, квадратные уравнения, системы уравнений",
      icon: "Equal",
      progress: 0,
      tasks: 18,
      difficulty: "medium"
    },
    {
      id: 4,
      title: "Функции и графики",
      description: "Линейная, квадратичная, обратная пропорциональность",
      icon: "TrendingUp",
      progress: 0,
      tasks: 10,
      difficulty: "hard"
    },
    {
      id: 5,
      title: "Геометрия: планиметрия",
      description: "Треугольники, четырехугольники, окружности",
      icon: "Triangle",
      progress: 0,
      tasks: 20,
      difficulty: "hard"
    },
    {
      id: 6,
      title: "Статистика и вероятность",
      description: "Анализ данных, комбинаторика, теория вероятностей",
      icon: "BarChart3",
      progress: 0,
      tasks: 8,
      difficulty: "easy"
    }
  ]);

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case "easy": return "bg-green-100 text-green-700 hover:bg-green-100";
      case "medium": return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100";
      case "hard": return "bg-red-100 text-red-700 hover:bg-red-100";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch(difficulty) {
      case "easy": return "Базовый";
      case "medium": return "Средний";
      case "hard": return "Сложный";
      default: return difficulty;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="GraduationCap" className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">ОГЭ Математика</h1>
                <p className="text-sm text-muted-foreground">Теория и практика</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Общий прогресс</p>
                <p className="text-xl font-semibold text-primary">0%</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Разделы теории</h2>
          <p className="text-muted-foreground">Изучай материалы последовательно для эффективной подготовки</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((topic) => (
            <Card 
              key={topic.id} 
              className="hover:shadow-lg transition-all duration-300 cursor-pointer group hover:-translate-y-1"
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Icon name={topic.icon as any} className="text-primary" size={24} />
                  </div>
                  <Badge className={getDifficultyColor(topic.difficulty)}>
                    {getDifficultyText(topic.difficulty)}
                  </Badge>
                </div>
                <CardTitle className="text-xl">{topic.title}</CardTitle>
                <CardDescription className="text-sm">
                  {topic.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Прогресс</span>
                    <span className="font-semibold">{topic.progress}%</span>
                  </div>
                  <Progress value={topic.progress} className="h-2" />
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Icon name="FileText" size={16} />
                    <span>{topic.tasks} заданий</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 bg-primary/5 rounded-2xl p-8 border border-primary/20">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
              <Icon name="Lightbulb" className="text-white" size={32} />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">Советы по подготовке</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Icon name="Check" className="text-primary mt-1" size={16} />
                  <span>Начинай с базовых разделов, постепенно переходя к сложным</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="Check" className="text-primary mt-1" size={16} />
                  <span>Решай задания регулярно, уделяя подготовке минимум 1 час в день</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="Check" className="text-primary mt-1" size={16} />
                  <span>Повторяй пройденный материал для закрепления знаний</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
