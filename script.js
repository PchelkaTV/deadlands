/* Функция для переключения между разделами с плавным переходом */
function showSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        if (section.id === sectionId) {
            section.classList.add('active');
        } else {
            section.classList.remove('active');
        }
    });
}

/* --- Код для раздела "Инструменты" --- */

/* Калькулятор Целевого Числа для Стрельбы */
function calculateTN() {
    const distance = parseFloat(document.getElementById('distance').value);
    const weaponRange = parseFloat(document.getElementById('weapon-range').value);
    const hitLocation = document.getElementById('hit-location').value;
    const modifiers = document.querySelectorAll('.modifier:checked');

    if (isNaN(distance) || isNaN(weaponRange) || weaponRange === 0) {
        alert('Пожалуйста, введите корректные значения для дистанции и дальности оружия.');
        return;
    }

    let tn = 5 + (distance / weaponRange);
    let baseTN = tn;

    let modifiersSum = 0;
    modifiers.forEach(mod => {
        modifiersSum += parseFloat(mod.value);
    });

    tn += modifiersSum;
    tn += parseFloat(hitLocation);

    tn = Math.ceil(tn); // Округляем до целого числа вверх

    document.getElementById('tn-result').innerHTML = `Целевое Число (ЦЧ): ${tn}`;
    document.getElementById('tn-result').dataset.tn = tn; // Сохраняем ЦЧ для дальнейшего использования

    // Логируем действие
    logAction(`Рассчитано ЦЧ:
- Базовое ЦЧ = 5 + (дистанция / дальность оружия) = 5 + (${distance} / ${weaponRange}) = ${baseTN.toFixed(2)}
- Сумма модификаторов: ${modifiersSum}
- Место выстрела: +${hitLocation}
- Итоговое ЦЧ: ${tn}`);
}

function checkShooting() {
    const tn = parseFloat(document.getElementById('tn-result').dataset.tn);
    const roll = parseFloat(document.getElementById('shooting-roll').value);

    if (isNaN(tn)) {
        alert('Сначала рассчитайте Целевое Число (ЦЧ).');
        return;
    }

    if (isNaN(roll)) {
        alert('Пожалуйста, введите результат броска стрельбы.');
        return;
    }

    if (roll >= tn) {
        document.getElementById('shooting-result').innerHTML = 'Атака успешна!';
        // Показываем калькулятор урона
        document.getElementById('damage-section').style.display = 'block';

        // Логируем действие
        logAction(`Атака успешна:
- Бросок стрельбы: ${roll}
- ЦЧ: ${tn}
- Результат: ${roll} >= ${tn}`);
    } else {
        document.getElementById('shooting-result').innerHTML = 'Атака неудачна.';
        // Скрываем калькулятор урона
        document.getElementById('damage-section').style.display = 'none';

        // Логируем действие
        logAction(`Атака неудачна:
- Бросок стрельбы: ${roll}
- ЦЧ: ${tn}
- Результат: ${roll} < ${tn}`);
    }

    // Показываем кнопку "Новая Атака"
    document.getElementById('new-attack-button').style.display = 'inline-block';
}

function resetAttack() {
    // Сбрасываем поля ввода
    document.getElementById('distance').value = '';
    document.getElementById('weapon-range').value = '';
    document.getElementById('shooting-roll').value = '';
    document.getElementById('inflicted-damage').value = '';
    document.getElementById('hit-location').selectedIndex = 0;
    document.getElementById('armor-level').selectedIndex = 0;
    document.getElementById('division-number').value = '';

    // Снимаем все модификаторы
    const modifiers = document.querySelectorAll('.modifier');
    modifiers.forEach(mod => {
        mod.checked = false;
    });

    // Очищаем результаты
    document.getElementById('tn-result').innerHTML = '';
    document.getElementById('tn-result').dataset.tn = '';
    document.getElementById('shooting-result').innerHTML = '';
    document.getElementById('wounds-result').innerHTML = '';

    // Скрываем калькулятор урона и кнопку "Новая Атака"
    document.getElementById('damage-section').style.display = 'none';
    document.getElementById('new-attack-button').style.display = 'none';

    // Логируем действие
    logAction('Атака сброшена. Начните новую атаку.');
}

function resetAll() {
    resetAttack();
    // Дополнительно можно сбросить другие разделы или состояния
    // Логируем действие
    logAction('Все данные очищены.');
}

function showAllTools() {
    // Показываем все инструменты
    document.getElementById('damage-section').style.display = 'block';
    document.getElementById('new-attack-button').style.display = 'inline-block';

    // Логируем действие
    logAction('Все инструменты отображены.');
}

/* Калькулятор Урона с Учетом Брони */
function calculateWounds() {
    const damage = parseFloat(document.getElementById('inflicted-damage').value);
    const armor = parseFloat(document.getElementById('armor-level').value);
    const division = parseFloat(document.getElementById('division-number').value);

    if (isNaN(damage) || isNaN(division) || division === 0) {
        alert('Пожалуйста, введите корректные значения.');
        return;
    }

    let netDamage = damage - armor;
    if (netDamage < 0) netDamage = 0;

    const wounds = Math.round(netDamage / division);

    document.getElementById('wounds-result').innerHTML = `Цель получила ${wounds} ран(ы).`;

    // Логируем действие
    logAction(`Расчет ран:
- Нанесенный урон: ${damage}
- Уровень брони: ${armor}
- Число для деления: ${division}
- Итоговый урон после брони: ${netDamage}
- Количество ран: ${wounds}`);
}

/* --- Код для раздела "Лог Боя" --- */
function logAction(action) {
    const timestamp = new Date().toLocaleTimeString();
    const entry = `[${timestamp}] ${action}`;
    const logDiv = document.getElementById('log');
    const entryDiv = document.createElement('div');
    entryDiv.classList.add('log-entry');
    entryDiv.textContent = entry;
    logDiv.appendChild(entryDiv);
    // Прокручиваем лог вниз
    logDiv.scrollTop = logDiv.scrollHeight;
}

/* Инициализация */
document.addEventListener('DOMContentLoaded', () => {
    // Показываем главную секцию
    showSection('home');
});
