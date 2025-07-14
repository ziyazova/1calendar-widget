import React, { useEffect } from 'react';
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
  useEffect(() => {
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

    // Очистка при размонтировании
    return () => {
      observer.disconnect();
      clearTimeout(fallbackTimer);
    };
  }, []);

  return (
    <>
      <GlobalEmbedStyles />
      <EmbedContainer>
        <TestWidget />
      </EmbedContainer>
    </>
  );
}; 