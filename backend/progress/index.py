import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Manage student progress tracking
    Args: event with httpMethod, body, queryStringParameters
    Returns: HTTP response with progress data
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Student-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    database_url = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(database_url)
    cur = conn.cursor()
    
    try:
        if method == 'GET':
            params = event.get('queryStringParameters') or {}
            student_id = params.get('student_id')
            
            if not student_id:
                cur.execute("""
                    SELECT t.id, t.title, t.description, t.icon, t.tasks_count, t.difficulty,
                           COALESCE(sp.progress_percentage, 0) as progress,
                           COALESCE(sp.completed_tasks, 0) as completed
                    FROM topics t
                    LEFT JOIN student_progress sp ON t.id = sp.topic_id AND sp.student_id = 1
                    ORDER BY t.id
                """)
            else:
                cur.execute("""
                    SELECT t.id, t.title, t.description, t.icon, t.tasks_count, t.difficulty,
                           COALESCE(sp.progress_percentage, 0) as progress,
                           COALESCE(sp.completed_tasks, 0) as completed
                    FROM topics t
                    LEFT JOIN student_progress sp ON t.id = sp.topic_id AND sp.student_id = %s
                    ORDER BY t.id
                """, (student_id,))
            
            rows = cur.fetchall()
            topics = []
            for row in rows:
                topics.append({
                    'id': row[0],
                    'title': row[1],
                    'description': row[2],
                    'icon': row[3],
                    'tasks': row[4],
                    'difficulty': row[5],
                    'progress': row[6],
                    'completed': row[7]
                })
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'topics': topics})
            }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            student_id = body_data.get('student_id', 1)
            topic_id = body_data.get('topic_id')
            completed_tasks = body_data.get('completed_tasks', 0)
            
            cur.execute("SELECT id FROM students WHERE id = %s", (student_id,))
            student_exists = cur.fetchone()
            if not student_exists:
                cur.execute("INSERT INTO students (id, name) VALUES (%s, %s)", (student_id, f'Student {student_id}'))
                conn.commit()
            
            cur.execute("SELECT tasks_count FROM topics WHERE id = %s", (topic_id,))
            result = cur.fetchone()
            if not result:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Topic not found'})
                }
            
            total_tasks = result[0]
            progress = int((completed_tasks / total_tasks) * 100) if total_tasks > 0 else 0
            
            cur.execute("""
                INSERT INTO student_progress (student_id, topic_id, completed_tasks, progress_percentage, last_updated)
                VALUES (%s, %s, %s, %s, CURRENT_TIMESTAMP)
                ON CONFLICT (student_id, topic_id) 
                DO UPDATE SET completed_tasks = %s, progress_percentage = %s, last_updated = CURRENT_TIMESTAMP
            """, (student_id, topic_id, completed_tasks, progress, completed_tasks, progress))
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({
                    'success': True,
                    'progress': progress,
                    'completed_tasks': completed_tasks
                })
            }
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    finally:
        cur.close()
        conn.close()