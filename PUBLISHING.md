# Подготовка Anostosio° к публикации

Проект статический: его можно загрузить на обычный хостинг, GitHub Pages, Netlify, Cloudflare Pages или российский хостинг без сборки. Корневой файл — `index.html`.

Перед запуском на собственном домене:

1. Загрузите **всё содержимое папки**, сохранив структуру `assets/` и `fonts/`.
2. Подключите HTTPS в панели хостинга.
3. После выбора домена добавьте абсолютные `canonical` и `og:url` в четыре страницы: `index.html`, `portfolio.html`, `price.html`, `brief.html`.
4. Создайте `sitemap.xml` с адресами этих страниц и добавьте строку `Sitemap: https://ваш-домен/sitemap.xml` в `robots.txt`.
5. Сделайте изображение 1200×630 px и укажите его абсолютный URL в `og:image` для красивых превью в соцсетях.
6. Проверьте, что письмо `Anostosio@yandex.ru` и ссылки VK / Telegram актуальны.

Файл `_headers` автоматически добавит базовые заголовки безопасности и кэширование на Netlify и совместимых платформах. На других хостингах он безопасно игнорируется.

Бриф не хранит данные посетителей и не требует сервера: он формирует письмо в почтовой программе пользователя. Если позже понадобится отправка прямо с сайта, потребуется подключить сервис форм или небольшой сервер и добавить политику обработки персональных данных.


## Language versions

The site now includes Russian at `/`, English at `/en/`, and Spanish at `/es/`. Each page has a RU / EN / ES switcher that preserves the page type. Canonical URLs, absolute `hreflang` links, `og:url`, and sitemap entries should be added only after the final domain is confirmed.
