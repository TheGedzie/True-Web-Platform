import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getData, patchData } from '../../services/api';
import CodeEditor from '../../components/CodeEditor/CodeEditor';
import { Button } from '../../components/UI/Button';
import { Title } from '../../components/UI/Title';
import cls from './Challenge.module.css';
import type { IChallenge } from '../../types';
import { fetchChellenge } from '../../services/ChellengeService';

interface UserProgress {
  completedChallenges: number[];
  totalPoints: number;
}

const getLanguage = (category: string): 'html' | 'javascript' => {
  if (category === 'JavaScript') return 'javascript';
  return 'html';
};

export const Challenge = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState<IChallenge | null>(null);
  const [userCode, setUserCode] = useState('');
  const [testResults, setTestResults] = useState<Array<{ passed: boolean; message: string }>>([]);
  const [showHints, setShowHints] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChallenge();
  }, [id]);

const loadChallenge = async () => {
  try {
    const challengeData = await fetchChellenge(id);
    setChallenge(challengeData);
    setUserCode(challengeData.initialCode);
  } catch (error) {
    console.error('Ошибка загрузки:', error);
  } finally {
    setLoading(false);
  }
};

const runTests = () => {
  const results: Array<{ passed: boolean; message: string }> = [];
  const isJavaScript = challenge?.category === 'JavaScript';
  
  if (isJavaScript) {
    // Удаляем старый скрипт если есть
    const oldScript = document.getElementById('user-code-script');
    if (oldScript) oldScript.remove();
    
    // Создаем новый скрипт с кодом пользователя
    const script = document.createElement('script');
    script.id = 'user-code-script';
    script.textContent = userCode;
    document.body.appendChild(script);
    
    // Даем время на загрузку скрипта
    setTimeout(() => {
      try {
        // Запускаем тесты
        challenge?.testCases.forEach(testCase => {
          try {
            // Используем eval в глобальном контексте
            const passed = eval(testCase.check);
            results.push({
              passed,
              message: passed ? `✅ ${testCase.description}` : `❌ ${testCase.description}`
            });
          } catch (error) {
            results.push({
              passed: false,
              message: `❌ ${testCase.description} (Ошибка: ${error.message})`
            });
          }
        });
        
        setTestResults(results);
        
        const allPassed = results.every(r => r.passed);
        if (allPassed && !isCompleted) {
          completeChallenge();
        }
        
        // Удаляем скрипт после тестов
        script.remove();
      } catch (error) {
        results.push({
          passed: false,
          message: `❌ Ошибка: ${error}`
        });
        setTestResults(results);
        script.remove();
      }
    }, 50);
    return;
  }
  
  // HTML код (оставляем как было)
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  document.body.appendChild(iframe);
  
  try {
    const iframeDoc = iframe.contentWindow?.document;
    if (iframeDoc) {
      iframeDoc.open();
      iframeDoc.write(userCode);
      iframeDoc.close();
      
      setTimeout(() => {
        challenge?.testCases.forEach(testCase => {
          try {
            const checkFn = new Function(`return (${testCase.check})`);
            const passed = checkFn.call(iframe.contentWindow);
            results.push({
              passed,
              message: passed ? `✅ ${testCase.description}` : `❌ ${testCase.description}`
            });
          } catch (error) {
            results.push({
              passed: false,
              message: `❌ ${testCase.description} (Ошибка: ${error})`
            });
          }
        });
        
        setTestResults(results);
        
        const allPassed = results.every(r => r.passed);
        if (allPassed && !isCompleted) {
          completeChallenge();
        }
        
        document.body.removeChild(iframe);
      }, 100);
      return;
    }
  } catch (error) {
    results.push({
      passed: false,
      message: `❌ Ошибка: ${error}`
    });
    setTestResults(results);
  }
  
  document.body.removeChild(iframe);
};

  const completeChallenge = async () => {
    try {
      const progressRes = await getData('http://localhost:3000/userProgress');
      const progressData = progressRes.data || progressRes;
      
      const updatedCompleted = [...(progressData.completedChallenges || []), Number(id)];
      
      await patchData('http://localhost:3000/userProgress', {
        completedChallenges: updatedCompleted,
        totalPoints: (progressData.totalPoints || 0) + (challenge?.xpReward || 0)
      });
      
      setIsCompleted(true);
      alert(`🎉 Поздравляю! Ты получил ${challenge?.xpReward} XP!`);
      
      loadChallenge();
    } catch (error) {
      console.error('Ошибка сохранения:', error);
      alert('Ошибка при сохранении прогресса');
    }
  };

  if (loading) return <div className={cls.loading}>📖 Загрузка испытания...</div>;
  if (!challenge) return <div className={cls.error}>⚠️ Испытание не найдено</div>;

  return (
    <div className={cls.challenge}>
      <div className={cls.header}>
        <Button onClick={() => navigate('/challenges')}>← Назад к списку</Button>
        <div className={cls.headerInfo}>
          <span className={cls.difficulty} style={{
            color: challenge.difficulty === 'easy' ? '#59FD7C' : 
                   challenge.difficulty === 'medium' ? '#FDEA59' : '#FD595C'
          }}>
            {challenge.difficulty.toUpperCase()}
          </span>
          <span className={cls.xpReward}>✨ +{challenge.xpReward} XP</span>
        </div>
      </div>

      <div className={cls.content}>
        <div className={cls.leftPanel}>
          <div className={cls.description}>
            <Title level="h2" size="medium" color="white">{challenge.title}</Title>
            <p>{challenge.description}</p>
            <div className={cls.category}>📁 {challenge.category}</div>
          </div>

          <div className={cls.hints}>
            <div className={cls.hintsHeader} onClick={() => setShowHints(!showHints)}>
              <span>💡 Подсказки</span>
              <span>{showHints ? '▲' : '▼'}</span>
            </div>
            {showHints && (
              <ul>
                {challenge.hints.map((hint, i) => (
                  <li key={i}>{hint}</li>
                ))}
              </ul>
            )}
          </div>

          <div className={cls.tests}>
            <h3>🧪 Тесты</h3>
            {testResults.map((result, i) => (
              <div key={i} className={`${cls.testResult} ${result.passed ? cls.passed : cls.failed}`}>
                {result.message}
              </div>
            ))}
            {testResults.length === 0 && (
              <div className={cls.noTests}>Нажми "Проверить", чтобы запустить тесты</div>
            )}
          </div>
        </div>

        <div className={cls.rightPanel}>
          <div className={cls.editorWrapper}>
            <div className={cls.editorHeader}>
              <span>✏️ Редактор кода</span>
              <Button size="small" onClick={runTests} disabled={isCompleted}>
                {isCompleted ? '✅ Выполнено' : '🧪 Проверить'}
              </Button>
            </div>
            <CodeEditor 
              codeValue={userCode} 
              onCodeChange={setUserCode}
              language={getLanguage(challenge.category)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};