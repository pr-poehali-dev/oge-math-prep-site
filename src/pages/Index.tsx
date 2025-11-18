import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Icon from "@/components/ui/icon";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface Topic {
  id: number;
  title: string;
  description: string;
  icon: string;
  progress: number;
  tasks: number;
  completed: number;
  difficulty: "easy" | "medium" | "hard";
}

const BACKEND_URL = "https://functions.poehali.dev/a17bcb9e-7062-4681-a9c2-64d97d56877f";

const Index = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [completedTasks, setCompletedTasks] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      const response = await fetch(BACKEND_URL);
      const data = await response.json();
      setTopics(data.topics);
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить темы",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (topicId: number, completed: number) => {
    try {
      const response = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          student_id: 1,
          topic_id: topicId,
          completed_tasks: completed
        })
      });

      if (response.ok) {
        await fetchTopics();
        toast({
          title: "Прогресс обновлен",
          description: "Ваш прогресс успешно сохранен"
        });
        setSelectedTopic(null);
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить прогресс",
        variant: "destructive"
      });
    }
  };

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

  const calculateOverallProgress = () => {
    if (topics.length === 0) return 0;
    const totalProgress = topics.reduce((sum, topic) => sum + topic.progress, 0);
    return Math.round(totalProgress / topics.length);
  };

  const handleTopicClick = (topic: Topic) => {
    navigate(`/topic/${topic.id}`);
  };

  const handleProgressClick = (e: React.MouseEvent, topic: Topic) => {
    e.stopPropagation();
    setSelectedTopic(topic);
    setCompletedTasks(topic.completed);
  };

  const handleSaveProgress = () => {
    if (selectedTopic) {
      updateProgress(selectedTopic.id, completedTasks);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Icon name="Loader2" className="animate-spin text-primary mx-auto mb-4" size={48} />
          <p className="text-muted-foreground">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white sticky top-0 z-10 shadow-sm">
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
                <p className="text-2xl font-bold text-primary">{calculateOverallProgress()}%</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Разделы теории</h2>
          <p className="text-muted-foreground">Отмечайте выполненные задания, чтобы отслеживать свой прогресс</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((topic) => (
            <Card 
              key={topic.id} 
              className="hover:shadow-lg transition-all duration-300 cursor-pointer group hover:-translate-y-1"
              onClick={() => handleTopicClick(topic)}
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
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Icon name="FileText" size={16} />
                      <span>{topic.tasks} заданий</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-auto p-0 text-primary font-medium hover:underline"
                      onClick={(e) => handleProgressClick(e, topic)}
                    >
                      {topic.completed} / {topic.tasks}
                    </Button>
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

      <Dialog open={!!selectedTopic} onOpenChange={() => setSelectedTopic(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedTopic?.title}</DialogTitle>
            <DialogDescription>
              Отметьте количество выполненных заданий из {selectedTopic?.tasks}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Выполнено заданий</label>
              <Input 
                type="number" 
                min="0" 
                max={selectedTopic?.tasks || 0}
                value={completedTasks}
                onChange={(e) => setCompletedTasks(Math.min(Number(e.target.value), selectedTopic?.tasks || 0))}
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Icon name="Info" size={16} />
              <span>Прогресс: {selectedTopic ? Math.round((completedTasks / selectedTopic.tasks) * 100) : 0}%</span>
            </div>
            <Button onClick={handleSaveProgress} className="w-full">
              Сохранить прогресс
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;