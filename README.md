# To run

npm install 

npm run dev

## To check build

npm run build

## Совет для Notion

Если вставляете embed-виджет в Notion, всегда добавляйте уникальный query string, например:

```
https://calendar-widget.vercel.app/embed/calendar?ts=123456789
```

Это поможет избежать кэширования высоты iframe в Notion.