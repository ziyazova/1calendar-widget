import React, { useEffect, useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { TestWidget } from '../components/widgets/TestWidget';

const GlobalEmbedStyles = createGlobalStyle`
  html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: transparent;
  }
  
  #root {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  
  /* Ensure proper responsive behavior in iframe contexts */
  * {
    box-sizing: border-box;
    max-width: 100%;
    max-height: 100%;
  }
  
  /* Disable viewport zooming that might interfere with embedding */
  body {
    touch-action: manipulation;
    -webkit-text-size-adjust: 100%;
    -ms-text-size-adjust: 100%;
  }
  
  /* Ensure text never overflows */
  * {
    word-wrap: break-word;
    overflow-wrap: break-word;
    hyphens: auto;
  }
  
  /* Prevent any element from growing beyond container */
  img, svg, video, canvas, audio, iframe, embed, object {
    max-width: 100% !important;
    max-height: 100% !important;
    width: auto !important;
    height: auto !important;
  }
  
  /* Ensure flex containers don't overflow */
  div, section, article, aside, main, header, footer, nav {
    min-width: 0;
    min-height: 0;
  }
`;

const EmbedContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  padding: 20px;
  box-sizing: border-box;
`;

const LoaderContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
`;

const Spinner = styled.div`
  border: 6px solid #f3f3f3;
  border-top: 6px solid #3498db;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  animation: spin 1s linear infinite;
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// Функция для уведомления родительского окна о размере
const notifyParentOfSize = () => {
  if (window.parent && window.parent !== window) {
    window.parent.postMessage({
      type: "embed-size",
      height: document.documentElement.scrollHeight
    }, "*");
  }
};

export const TestEmbedPage: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Показываем лоадер минимум 1.2 секунды
    const timer = setTimeout(() => {
      setLoading(false);
      notifyParentOfSize(); // После показа контента еще раз отправляем высоту
    }, 1200);

    // Уведомляем о размере при загрузке
    notifyParentOfSize();

    // Создаем ResizeObserver для отслеживания изменений размера
    const observer = new ResizeObserver(() => {
      notifyParentOfSize();
    });

    // Наблюдаем за изменениями размера body
    observer.observe(document.body);

    // Fallback через setTimeout на случай, если ResizeObserver не сработал
    const fallbackTimer = setTimeout(() => {
      notifyParentOfSize();
    }, 1000);

    // Также слушаем resize и load, как в твоём примере
    window.addEventListener('resize', notifyParentOfSize);
    window.addEventListener('load', notifyParentOfSize);
    // На случай, если шрифты или данные подгружаются чуть позже
    const lateTimer = setTimeout(notifyParentOfSize, 500);

    // Очистка при размонтировании
    return () => {
      clearTimeout(timer);
      observer.disconnect();
      clearTimeout(fallbackTimer);
      clearTimeout(lateTimer);
      window.removeEventListener('resize', notifyParentOfSize);
      window.removeEventListener('load', notifyParentOfSize);
    };
  }, []);

  return (
    <>
      <GlobalEmbedStyles />
      {loading ? (
        <LoaderContainer>
          <Spinner />
        </LoaderContainer>
      ) : (
        <EmbedContainer>
          <TestWidget />
        </EmbedContainer>
      )}
    </>
  );
}; 