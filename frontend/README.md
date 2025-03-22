1. Модель вигляду і вмісту продукту (схема) Product в product.js в models.

2. Доступ до сховища для зберігання фото чи відео продуктів створюється в cloudinary.js в utils. На сайті Cloudinary в налаштуваннях у вклалці Account в полях вводу нвказати країну та ім'я хмарного сховища (там воно dc5ymynbq). У вкладці Security є необхідні ключі. Ім'я та ключі треба внести в .env файл.

3. Маршрути для обміну даними з Cloudinary (ствворення, отримання всіх, отримання одного, редагування та видалення продуктів) створюються в products.js в routes.
   В Cloudinary у вкладці Upload в розділі Uload presets має відображатись ім'я пресету (для цьго проєкту воно online-shop яке використовується в маршрутах). Якщо пресет ще не створено то потрібно натиснути Add upload preset (додати попереднє налаштування для завантаження)і вказати ім'я online-shop та папку Online Shop Create в якій будуть зберіігатися завантажені зображення з даними для магазину продуктів.

4. В index.js бекенду додається const productsRoute = require("./routes/products") і
   app.use("/api/products", productsRoute). productsRoute це перейменований при імпорті productsSlice.

5. CreateProduct.jsx в admin.

6. Products.jsx в admin для відображення сторінки створення продукту (з написом Products і кнопкою Create), під яким завдяки Outlet розміститься CreateProduct

Далі вказівки для створення WorldCarSories:

---

### **1. Реалізація основної сторінки з автомобілями**

- **Що зробимо:**

  - Створимо компонент для відображення списку автомобілів (`CarList`).
  - Реалізуємо пошук та фільтрацію за маркою, роком, або іншими параметрами.
  - Додамо загальну сторінку для перегляду всіх автомобілів.

- **Для цього потрібне:**
  - Підготувати API для отримання автомобілів із сервера.
  - Створити макет карточок для кожного автомобіля.

---

### **2. Сторінка деталей автомобіля**

- **Що зробимо:**

  - Створимо компонент для відображення деталей автомобіля (`CarDetails`).
  - Додамо опис, характеристики, відгуки користувачів, і кнопки (наприклад, "Додати до улюблених" або "Додати в кошик").
  - Зробимо можливість додавання відгуків для авторизованих користувачів.

- **Для цього потрібне:**
  - API для отримання деталей автомобіля (за ID).
  - Створити форму для написання відгуків.

---

### **3. Реалізація чату між користувачами**

- **Що зробимо:**

  - Створимо чат (вкладка в меню).
  - Користувачі зможуть надсилати повідомлення один одному.
  - Використаємо WebSocket (`Socket.IO`) для реального часу.

- **Для цього потрібне:**
  - API для створення чату і збереження повідомлень.
  - Frontend-інтерфейс для чату з переліком діалогів.

---

### **4. Покращення аутентифікації**

- **Що зробимо:**

  - Додамо можливість відновлення пароля (через email або SMS).
  - Зробимо перевірку токена (JWT) при завантаженні сторінок.

- **Для цього потрібне:**
  - Доробити серверну частину для обробки запитів на відновлення.
  - Змінити форми `Login`/`Register`.

---

### **5. Візуальні покращення (UI/UX)**

- **Що зробимо:**
  - Додамо темну/світлу тему з можливістю перемикання.
  - Реалізуємо анімації при переходах між сторінками.
  - Покращимо адаптивність для мобільних пристроїв.

---

### **6. Підключення кошика**

- **Що зробимо:**
  - Додамо функціонал для додавання автомобілів у кошик.
  - Реалізуємо кнопку "Оформити замовлення".
  - Підключимо ваш існуючий API для кошика.

---

### **Що обрати далі?**

- Якщо вашою метою є швидкий запуск, варто почати зі **сторінки з автомобілями**.
- Якщо хочете попрацювати над інтерактивністю, то можна зосередитися на **чаті** або **додаванні відгуків**.

Напишіть, і ми почнемо працювати над вибраним завданням! 😊

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

      <div className={`cars-container`}>
        <h1>Автомобілі</h1>
        <div className="car-list">
          {filteredCars.length > 0 ? (
            filteredCars.map((car) => (
              <CarCard
                key={car._id}
                car={car}
                isFavorite={favorites.includes(car._id)} // Перевіряємо, чи автомобіль улюблений
              />
            ))
          ) : (
            <p className="no-cars-message">Автомобілі не знайдено 😔</p>
          )}
        </div>
      </div>

      <div className={`favorites`}>
        <h1>Мої улюблені автомобілі</h1>
        <div className="fav-list">
          {filteredFavorites.length > 0 ? (
            filteredFavorites.map((favorite) => (
              <CarCard key={favorite.car._id} car={favorite.car} />
            ))
          ) : (
            <p className="no-cars-message">Автомобілі не знайдено 😔</p>
          )}
        </div>
      </div>
