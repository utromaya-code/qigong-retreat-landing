# Загрузка лендинга на GitHub и просмотр сайта

## 1. Создать репозиторий на GitHub

1. Зайдите на [github.com](https://github.com) → **New repository**.
2. Название: `qigong-retreat-landing` (или любое).
3. **Public**, без README (он уже есть в проекте).
4. Нажмите **Create repository**.

## 2. Подключить remote и запушить (из папки проекта)

В терминале из корня проекта `qigong-retreat-landing`:

```bash
cd "/Users/poslednijgeroj/Library/Mobile Documents/com~apple~CloudDocs/qigong-retreat-landing"

# Если ещё не делали: инициализация и первый коммит
git init
git add .
git commit -m "Лендинг ретрита по цигуну Вкус жизни"

# Подставить ВАШ username и имя репозитория
git remote add origin https://github.com/YOUR_USERNAME/qigong-retreat-landing.git

# Пуш с авторизацией через токен (токен НЕ вставлять в команду)
# Вариант A: через переменную (рекомендуется)
export GITHUB_TOKEN="ваш_токен_здесь"
git push https://YOUR_USERNAME:$GITHUB_TOKEN@github.com/YOUR_USERNAME/qigong-retreat-landing.git main

# Или Вариант B: при первом push Git запросит логин и пароль — в поле пароля вставьте токен
git branch -M main
git push -u origin main
```

**Важно:** токен GitHub нигде не храните в коде и не вставляйте в чаты. Создавайте его в GitHub → Settings → Developer settings → Personal access tokens.

## 3. Открыть готовый сайт

### Локально (проверка перед деплоем)

```bash
cd "/Users/poslednijgeroj/Library/Mobile Documents/com~apple~CloudDocs/qigong-retreat-landing"
python3 -m http.server 8080
```

Откройте в браузере: **http://localhost:8080**

### Публичный хостинг (после push)

- **GitHub Pages** (бесплатно): в репозитории **Settings → Pages** → Source: **Deploy from a branch** → Branch: `main`, папка `/ (root)` → Save. Сайт будет по адресу:  
  `https://YOUR_USERNAME.github.io/qigong-retreat-landing/`
- Либо подключите свой домен (Vercel, Netlify, и т.д.) к этому репозиторию.

## 4. Что передать Codex (если он будет пушить сам)

Скопируйте и вставьте в чат Codex:

---

**Задача:** загрузить проект `qigong-retreat-landing` на GitHub и при необходимости подсказать, как открыть сайт.

**Шаги для тебя (Codex):**

1. Убедиться, что в корне `qigong-retreat-landing` есть `.gitignore`, все файлы добавлены и есть коммит (например, `git status`, при необходимости `git init`, `git add .`, `git commit -m "Лендинг ретрита"`).
2. Добавить remote (пользователь должен подставить свой GitHub username и репозиторий):  
   `git remote add origin https://github.com/USERNAME/qigong-retreat-landing.git`
3. Пуш: `git branch -M main && git push -u origin main`.  
   Авторизацию пользователь выполняет сам (токен через переменную окружения или диалог Git). Токен в команды не вставлять и в чат не писать.
4. В README или отдельном файле описать, как включить GitHub Pages (Settings → Pages → branch main, root), чтобы сайт открывался по ссылке вида `https://USERNAME.github.io/qigong-retreat-landing/`.
5. Локальный просмотр: из папки проекта выполнить `python3 -m http.server 8080` и открыть в браузере `http://localhost:8080` (если среда позволяет), либо напомнить пользователю сделать это самому.

---

После этого у вас будет репозиторий на GitHub и инструкция, как открыть готовый сайт (локально или через GitHub Pages).
