export const runJsTests = (code: string, testCases: any[]) => {
  const results: Array<{ passed: boolean; message: string }> = [];

  // ✅ Используем Promise, чтобы дождаться выполнения
  return new Promise((resolve) => {
    try {
      const script = document.createElement("script");
      script.textContent = code;
      document.body.appendChild(script);

      setTimeout(() => {
        try {
          testCases.forEach((testCase) => {
            try {
              const passed = eval(testCase.check);
              results.push({
                passed,
                message: passed
                  ? `✅ ${testCase.description}`
                  : `❌ ${testCase.description}`,
              });
            } catch (error: any) {
              results.push({
                passed: false,
                message: `❌ ${testCase.description} (Ошибка: ${error.message})`,
              });
            }
          });

          script.remove();
          resolve(results); // ✅ Возвращаем результаты
        } catch (error: any) {
          results.push({
            passed: false,
            message: `❌ Ошибка: ${error.message}`,
          });
          script.remove();
          resolve(results);
        }
      }, 50);
    } catch (error: any) {
      results.push({
        passed: false,
        message: `❌ Ошибка в коде: ${error.message}`,
      });
      resolve(results);
    }
  });
};
