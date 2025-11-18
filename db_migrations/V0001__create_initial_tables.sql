CREATE TABLE IF NOT EXISTS students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS topics (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    tasks_count INTEGER DEFAULT 0,
    difficulty VARCHAR(20) DEFAULT 'medium'
);

CREATE TABLE IF NOT EXISTS student_progress (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id),
    topic_id INTEGER REFERENCES topics(id),
    completed_tasks INTEGER DEFAULT 0,
    progress_percentage INTEGER DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, topic_id)
);

INSERT INTO topics (title, description, icon, tasks_count, difficulty) VALUES
('Числа и вычисления', 'Натуральные числа, дроби, проценты, степени', 'Calculator', 12, 'easy'),
('Алгебраические выражения', 'Преобразование выражений, формулы сокращенного умножения', 'FunctionSquare', 15, 'medium'),
('Уравнения и неравенства', 'Линейные, квадратные уравнения, системы уравнений', 'Equal', 18, 'medium'),
('Функции и графики', 'Линейная, квадратичная, обратная пропорциональность', 'TrendingUp', 10, 'hard'),
('Геометрия: планиметрия', 'Треугольники, четырехугольники, окружности', 'Triangle', 20, 'hard'),
('Статистика и вероятность', 'Анализ данных, комбинаторика, теория вероятностей', 'BarChart3', 8, 'easy');