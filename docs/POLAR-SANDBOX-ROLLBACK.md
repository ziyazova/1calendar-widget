# Polar sandbox → prod откат (полная инструкция)

> Если в Supabase Edge Functions сейчас стоят sandbox-секреты Polar и
> прод checkout не работает — этот документ возвращает прод обратно.

## Шаг 1 — Получи API токен

1. Открой https://polar.sh/dashboard/aliia-ziiazova/settings
2. Листай вниз до раздела **Developer / API Tokens**
3. Нажми **New Token**
4. Имя: `peachy-prod-checkout`
5. Scopes: поставь галочки на `products:read` и `checkouts:write`
6. Нажми **Create** → сразу скопируй (показывается один раз!)

Это будет твой `POLAR_ACCESS_TOKEN`.

## Шаг 2 — Получи Webhook Secret

1. Открой https://polar.sh/dashboard/aliia-ziiazova/settings/webhooks
2. Найди вебхук с URL `https://vyycfwgkawtqkjllvsuc.supabase.co/functions/v1/polar-webhook`
3. Кликни на него → найди поле **Secret** → скопируй

Это будет твой `POLAR_WEBHOOK_SECRET`.

## Шаг 3 — Получи Price ID подписки

1. Открой https://polar.sh/dashboard/aliia-ziiazova/products
2. Найди продукт **Peachy Pro Subscription**
3. Кликни на него → посмотри на URL или на UUID цены внутри продукта

Это будет твой `POLAR_PRO_PRICE_ID`.

## Шаг 4 — Скинь мне три значения в чат

```
POLAR_ACCESS_TOKEN=polar_oat_...
POLAR_WEBHOOK_SECRET=polar_whs_...
POLAR_PRO_PRICE_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

Я сама обновлю Supabase через API — так же как делала в шаге 8.

## Что затронуто — все покупки на сайте

Пока не сделаешь откат, не работают покупки вот этих страниц:

| Шаблон | Ссылка |
|---|---|
| Glow Up Planner ($8) | https://1calendar-widget-aliias-projects-37358320.vercel.app/templates/1775842529 |
| Ultimate Life Planner ($9) | https://1calendar-widget-aliias-projects-37358320.vercel.app/templates/1736107034 |
| Mystic Life Planner ($10) | https://1calendar-widget-aliias-projects-37358320.vercel.app/templates/1737912942 |
| Dark Academia Student ($8) | https://1calendar-widget-aliias-projects-37358320.vercel.app/templates/1787041091 |
| Peachy Pro подписка | кнопка Upgrade на любой странице студии |
