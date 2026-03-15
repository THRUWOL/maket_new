/**
 * ОТП БАНК — МОБИЛЬНОЕ ПРИЛОЖЕНИЕ
 * Интерактивность и навигация
 * СВЕТЛАЯ ТЕМА
 */

// ========================================
// НАВИГАЦИЯ МЕЖДУ ЭКРАНАМИ
// ========================================

function navigateTo(screenId) {
    // Скрываем все экраны
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });

    // Показываем целевой экран
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
        window.scrollTo(0, 0);
    }

    // Обновляем активный пункт навигации
    updateNavActiveState(screenId);
}

function updateNavActiveState(screenId) {
    const navItems = document.querySelectorAll('.nav-item');

    // Сбрасываем все активные состояния
    navItems.forEach(item => item.classList.remove('active'));

    // Определяем, какой пункт должен быть активным
    const navMapping = {
        'home-screen': 0,
        'history-screen': 1,
        'subscriptions-screen': 2,
        'transfer-screen': 3,
        'chat-screen': 4
    };

    const navIndex = navMapping[screenId];
    if (navIndex !== undefined && navItems[navIndex]) {
        navItems[navIndex].classList.add('active');
    }
}

// ========================================
// ФУНКЦИИ УПРАВЛЕНИЯ ПОДПИСКАМИ
// ========================================

let currentCancelSubId = null;
let currentCancelSubName = '';

// Открытие модального окна отмены подписки
function openCancelModal(subName, subId) {
    currentCancelSubName = subName;
    currentCancelSubId = subId;
    
    document.getElementById('cancel-sub-name').textContent = subName;
    document.getElementById('cancel-subscription-modal').classList.add('active');
}

// Закрытие модального окна отмены подписки
function closeCancelModal() {
    document.getElementById('cancel-subscription-modal').classList.remove('active');
    currentCancelSubId = null;
    currentCancelSubName = '';
    document.getElementById('cancel-reason-select').value = '';
}

// Подтверждение отмены подписки
function confirmCancelSubscription() {
    const reason = document.getElementById('cancel-reason-select').value;
    
    // Находим элемент подписки и помечаем как отменённую
    const subItem = document.querySelector(`.subscription-item[data-id="${currentCancelSubId}"]`);
    if (subItem) {
        subItem.style.opacity = '0.5';
        subItem.style.pointerEvents = 'none';
        
        // Обновляем статус
        const statusEl = subItem.querySelector('.sub-status');
        if (statusEl) {
            statusEl.textContent = 'Отменена';
            statusEl.className = 'sub-status status-cancelled';
            statusEl.style.background = '#E2E3E5';
            statusEl.style.color = '#383D41';
        }
    }
    
    closeCancelModal();
    showToast(`Подписка "${currentCancelSubName}" отменена`);
    
    // Обновляем сумму в сводке
    updateSubscriptionsSummary();
}

// Открытие модального окна добавления подписки
function openAddSubscriptionModal() {
    document.getElementById('add-subscription-modal').classList.add('active');
}

// Закрытие модального окна добавления подписки
function closeAddSubscriptionModal() {
    document.getElementById('add-subscription-modal').classList.remove('active');
    document.getElementById('add-sub-name').value = '';
    document.getElementById('add-sub-amount').value = '';
    document.getElementById('add-sub-date').value = '';
}

// Подтверждение добавления подписки
function confirmAddSubscription() {
    const name = document.getElementById('add-sub-name').value.trim();
    const amount = document.getElementById('add-sub-amount').value.trim();
    const date = document.getElementById('add-sub-date').value;
    const category = document.getElementById('add-sub-category').value;
    
    if (!name || !amount || !date) {
        showToast('Заполните все поля');
        return;
    }
    
    // Создаём новую подписку
    const subscriptionsList = document.querySelector('.subscriptions-list');
    const newSub = document.createElement('div');
    newSub.className = 'subscription-item active';
    newSub.dataset.id = Date.now();
    
    const categoryEmojis = {
        entertainment: '🎬',
        shopping: '🛍️',
        music: '🎵',
        movies: '🎬',
        other: '📦'
    };
    
    newSub.innerHTML = `
        <div class="sub-icon" style="background: var(--purple);">
            <span class="sub-icon-text">${name[0].toUpperCase()}</span>
        </div>
        <div class="sub-content">
            <div class="sub-header">
                <span class="sub-name">${name}</span>
                <span class="sub-status status-active">Активна</span>
            </div>
            <div class="sub-details">
                <span class="sub-amount">${amount} ₽/мес</span>
                <span class="sub-date">Следующее: ${formatDate(date)}</span>
            </div>
            <div class="sub-features">
                <span class="sub-feature">${categoryEmojis[category]} ${getCategoryName(category)}</span>
            </div>
        </div>
        <div class="sub-actions">
            <button class="sub-action-btn notify-on" onclick="toggleNotify(${newSub.dataset.id})">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M12 22C13.1046 22 14 21.1046 14 20H10C10 21.1046 10.8954 22 12 22Z" stroke="currentColor" stroke-width="2"/>
                    <path d="M18 16V10C18 7.23858 15.7614 5 13 5C13 3.89543 12.1046 3 11 3C9.89543 3 9 3.89543 9 5C6.23858 5 4 7.23858 4 10V16L2 18V19H20V18L18 16Z" stroke="currentColor" stroke-width="2"/>
                </svg>
            </button>
            <button class="sub-action-btn cancel-btn" onclick="openCancelModal('${name}', ${newSub.dataset.id})">Отписаться</button>
        </div>
    `;
    
    subscriptionsList.insertBefore(newSub, subscriptionsList.firstChild);
    closeAddSubscriptionModal();
    showToast(`Подписка "${name}" добавлена`);
    
    // Обновляем сводку
    updateSubscriptionsSummary();
}

// Вспомогательные функции
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
}

function getCategoryName(category) {
    const names = {
        entertainment: 'Развлечения',
        shopping: 'Шопинг',
        music: 'Музыка',
        movies: 'Кино',
        other: 'Другое'
    };
    return names[category] || category;
}

// Обновление сводки подписок
function updateSubscriptionsSummary() {
    const activeSubs = document.querySelectorAll('.subscription-item.active:not([style*="opacity: 0.5"])');
    let totalAmount = 0;
    
    activeSubs.forEach(sub => {
        const amountEl = sub.querySelector('.sub-amount');
        if (amountEl) {
            const match = amountEl.textContent.match(/(\d+)/);
            if (match) {
                totalAmount += parseInt(match[1]);
            }
        }
    });
    
    const summaryAmount = document.querySelector('.summary-amount');
    const statValue = document.querySelector('.stat-item .stat-value');
    
    if (summaryAmount) {
        summaryAmount.textContent = `${totalAmount.toLocaleString('ru-RU')} ₽`;
    }
    
    if (statValue) {
        statValue.textContent = activeSubs.length;
    }
}

// Переключение уведомления для подписки
function toggleNotify(subId) {
    const subItem = document.querySelector(`.subscription-item[data-id="${subId}"]`);
    if (!subItem) return;
    
    const btn = subItem.querySelector('.sub-action-btn:first-child');
    if (!btn) return;
    
    const isNotifyOn = btn.classList.contains('notify-on');
    
    if (isNotifyOn) {
        btn.classList.remove('notify-on');
        btn.classList.add('notify-off');
        btn.style.background = 'var(--light-gray)';
        showToast('Уведомления отключены');
    } else {
        btn.classList.remove('notify-off');
        btn.classList.add('notify-on');
        btn.style.background = '';
        showToast('Уведомления включены');
    }
}

// Обновление карты для подписки
function updateCardForSub(subId) {
    showToast('Переход к выбору карты...');
    // Здесь будет логика выбора карты
}

// Переключение уведомлений о подписках
function toggleSubscriptionNotifications() {
    const alertBox = document.querySelector('.subscription-alert');
    if (alertBox) {
        alertBox.style.display = 'none';
    }

    // Включаем все переключатели
    document.querySelectorAll('.subscription-settings input[type="checkbox"]').forEach(cb => {
        cb.checked = true;
    });

    showToast('Уведомления включены');
}

// ========================================
// ФУНКЦИИ ПЕРСОНАЛИЗИРОВАННОГО КЭШБЭКА
// ========================================

let selectedCashbackCategories = 3;

// Открытие настроек кэшбэка
function openCashbackSettings() {
    document.getElementById('cashback-settings-modal').classList.add('active');
    updateSelectedCount();
}

// Закрытие настроек кэшбэка
function closeCashbackSettings() {
    document.getElementById('cashback-settings-modal').classList.remove('active');
}

// Обновление счётчика выбранных категорий
function updateSelectedCount() {
    const checkboxes = document.querySelectorAll('.category-selection-item input[type="checkbox"]:checked');
    selectedCashbackCategories = checkboxes.length;
    document.getElementById('selected-count').textContent = selectedCashbackCategories;
}

// Принятие категорий кэшбэка
function acceptCashbackCategories() {
    showToast('Категории приняты! Кэшбэк активирован.');

    // Анимация принятия
    const notification = document.querySelector('.cashback-notification');
    if (notification) {
        notification.style.background = 'linear-gradient(135deg, #D4EDDA 0%, #C3E6CB 100%)';
        notification.querySelector('.notification-title').textContent = '✅ Категории приняты!';
        notification.querySelector('.notification-text').textContent = 'Кэшбэк активирован до 30 апреля';
    }

    // Скрываем кнопки действий
    const actions = document.querySelector('.cashback-actions');
    if (actions) {
        actions.style.display = 'none';
    }
    
    // Скрываем иконку предупреждения на главном экране
    const cashbackAlertBtn = document.querySelector('.cashback-alert-btn');
    if (cashbackAlertBtn) {
        cashbackAlertBtn.style.display = 'none';
    }
}

// Сохранение выбранных категорий
function saveCashbackCategories() {
    const checkboxes = document.querySelectorAll('.category-selection-item input[type="checkbox"]');
    const selected = Array.from(checkboxes).filter(cb => cb.checked);

    if (selected.length < 3) {
        showToast('Выберите минимум 3 категории');
        return;
    }

    if (selected.length > 5) {
        showToast('Максимум 5 категорий');
        return;
    }

    closeCashbackSettings();
    showToast('Категории сохранены!');

    // Здесь будет логика сохранения на бэкенд
}

// Данные для деталей кэшбэка по категориям
const cashbackDetailsData = {
    restaurants: {
        title: 'Рестораны и кафе',
        icon: '🍔',
        percent: '5%',
        spent: '12 450 ₽',
        earned: '~620 ₽',
        transactions: '24',
        description: 'Кэшбэк начисляется за оплату в ресторанах, кафе, закусочных и других заведениях общественного питания.',
        includes: [
            'Рестораны быстрого питания (фастфуд)',
            'Кафе и столовые',
            'Бары и кофейни',
            'Пиццерии и суши-бары',
            'Доставка еды из ресторанов'
        ],
        excludes: [
            'Покупка продуктов в супермаркетах',
            'Кейтеринговые услуги'
        ]
    },
    taxi: {
        title: 'Такси',
        icon: '🚕',
        percent: '5%',
        spent: '5 670 ₽',
        earned: '~280 ₽',
        transactions: '18',
        description: 'Кэшбэк начисляется за поездки в такси, оформленные через приложения и сервисы.',
        includes: [
            'Яндекс Такси',
            'Uber',
            'Ситимобил',
            'Такси Везёт',
            'Другие агрегаторы такси'
        ],
        excludes: [
            'Оплата наличными водителю',
            'Грузовое такси',
            'Аренда автомобиля'
        ]
    },
    supermarkets: {
        title: 'Супермаркеты',
        icon: '🛒',
        percent: '3%',
        spent: '28 900 ₽',
        earned: '~870 ₽',
        transactions: '42',
        description: 'Кэшбэк начисляется за покупки в супермаркетах, продуктовых магазинах и универсамах.',
        includes: [
            'Пятёрочка',
            'Магнит',
            'Перекрёсток',
            'Лента',
            'Азбука Вкуса',
            'Дикси'
        ],
        excludes: [
            'Заказ продуктов онлайн (СберМаркет, Самокат)',
            'Рестораны при супермаркетах',
            'Оплата подарочными картами'
        ]
    }
};

// Открытие модального окна деталей кэшбэка
function openCashbackDetailModal(category) {
    const data = cashbackDetailsData[category];
    if (!data) return;

    document.getElementById('cashback-detail-title').textContent = data.title;
    document.getElementById('cashback-detail-icon').textContent = data.icon;
    document.getElementById('cashback-detail-percent').textContent = data.percent;
    document.getElementById('cashback-detail-spent').textContent = data.spent;
    document.getElementById('cashback-detail-earned').textContent = data.earned;
    document.getElementById('cashback-detail-transactions').textContent = data.transactions;

    // Формируем описание
    let descriptionHtml = `<p>${data.description}</p>`;
    
    if (data.includes && data.includes.length > 0) {
        descriptionHtml += '<p><strong>Что входит:</strong></p><ul>';
        data.includes.forEach(item => {
            descriptionHtml += `<li>${item}</li>`;
        });
        descriptionHtml += '</ul>';
    }
    
    if (data.excludes && data.excludes.length > 0) {
        descriptionHtml += '<p><strong>Не входит:</strong></p><ul>';
        data.excludes.forEach(item => {
            descriptionHtml += `<li>${item}</li>`;
        });
        descriptionHtml += '</ul>';
    }

    document.getElementById('cashback-detail-description').innerHTML = descriptionHtml;
    document.getElementById('cashback-detail-modal').classList.add('active');
}

// Закрытие модального окна деталей кэшбэка
function closeCashbackDetailModal() {
    document.getElementById('cashback-detail-modal').classList.remove('active');
}

// Добавляем обработчики на чекбоксы
document.addEventListener('DOMContentLoaded', function() {
    const categoryCheckboxes = document.querySelectorAll('.category-selection-item input[type="checkbox"]');
    
    categoryCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const checked = document.querySelectorAll('.category-selection-item input[type="checkbox"]:checked');
            
            // Блокируем выбор более 5
            if (checked.length > 5 && this.checked) {
                this.checked = false;
                showToast('Максимум 5 категорий');
            }
            
            updateSelectedCount();
        });
    });
});

// ========================================
// ЗАКРЕПЛЁННЫЕ ПОЛУЧАТЕЛИ - НОВЫЕ ФУНКЦИИ
// ========================================

// Открытие модального окна избранных платежей
function openPaymentFavoritesModal() {
    showToast('⚙️ Настройка избранных платежей...');
    // Здесь будет логика модального окна настройки избранных платежей
}

// Быстрый платёж из избранного
function openQuickPayment(merchant, amount) {
    showToast(`💳 ${merchant}: ${amount} ₽`);
    // Здесь будет логика быстрого платежа
}

// Открытие модального окна закреплённых получателей
function openFavoritesModal() {
    document.getElementById('favorites-modal').classList.add('active');
}

// Закрытие модального окна закреплённых получателей
function closeFavoritesModal() {
    document.getElementById('favorites-modal').classList.remove('active');
}

// Быстрый перевод
function quickTransfer(name, phone, bank) {
    closeFavoritesModal();
    
    // Показываем модальное окно ввода суммы
    const amount = prompt(`Перевод ${name} (${bank})\nВведите сумму:`, '1000');
    
    if (amount && !isNaN(amount) && amount > 0) {
        showToast(`✅ Перевод ${amount} ₽ → ${name}`);
        // Здесь будет логика реального перевода
    }
}

// Удаление из закреплённых
function removeFavorite(id) {
    if (confirm('Удалить получателя из закреплённых?')) {
        let name = '';
        
        // Если id - это элемент (при удалении из модального окна)
        if (typeof id === 'object') {
            const item = id.closest('.favorite-item');
            if (item) {
                name = item.querySelector('.favorite-name').textContent;
                item.style.opacity = '0';
                item.style.transform = 'translateX(-20px)';
                setTimeout(() => item.remove(), 300);
            }
        } else {
            // Если id - это номер (при удалении с главного экрана)
            const item = document.querySelector(`.favorite-item[onclick*="'${id}'"]`);
            if (item) {
                name = item.querySelector('.favorite-name').textContent;
                item.style.opacity = '0';
                item.style.transform = 'translateX(-20px)';
                setTimeout(() => item.remove(), 300);
            }
        }
        
        // Удаляем из быстрых переводов на главном экране
        if (name) {
            const quickTransferItems = document.querySelectorAll('.quick-transfer-item');
            quickTransferItems.forEach(item => {
                const itemName = item.querySelector('.quick-transfer-name').textContent;
                if (itemName === name) {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => item.remove(), 300);
                }
            });
            
            // Удаляем из экрана переводов
            const transferFavoriteItems = document.querySelectorAll('.transfer-favorite-item');
            transferFavoriteItems.forEach(item => {
                const itemName = item.querySelector('.transfer-favorite-name').textContent;
                if (itemName === name) {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => item.remove(), 300);
                }
            });
        }
        
        showToast('Получатель удалён');
    }
}

// Добавление нового получателя в закреплённые
function addNewFavorite(name, phone, bank) {
    const avatars = ['👤', '👨', '👩', '👦', '👧'];
    const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];
    const formattedPhone = formatPhoneDisplay(phone);
    
    // 1. Добавляем в модальное окно (favorites-list)
    const favoritesList = document.getElementById('favorites-list');
    const newItem = document.createElement('div');
    newItem.className = 'favorite-item';
    newItem.onclick = function() { quickTransfer(name, phone, bank); };
    newItem.innerHTML = `
        <div class="favorite-avatar" style="background: var(--purple-gradient);">
            <span>${randomAvatar}</span>
        </div>
        <div class="favorite-info">
            <span class="favorite-name">${name}</span>
            <span class="favorite-details">${formattedPhone} • ${bank}</span>
        </div>
        <button class="favorite-remove" onclick="event.stopPropagation(); removeFavorite(this)">×</button>
    `;
    favoritesList.insertBefore(newItem, favoritesList.firstChild);
    
    // 2. Добавляем на главный экран (quick-transfers-list)
    const quickTransfersList = document.querySelector('.quick-transfers-list');
    if (quickTransfersList) {
        const quickItem = document.createElement('div');
        quickItem.className = 'quick-transfer-item';
        quickItem.onclick = function() { quickTransfer(name, phone, bank); };
        quickItem.innerHTML = `
            <div class="quick-transfer-avatar" style="background: var(--purple-gradient);">
                <span>${randomAvatar}</span>
            </div>
            <span class="quick-transfer-name">${name}</span>
        `;
        
        // Вставляем перед кнопкой "Ещё"
        const moreButton = quickTransfersList.querySelector('.quick-transfer-item:last-child');
        if (moreButton) {
            quickTransfersList.insertBefore(quickItem, moreButton);
        } else {
            quickTransfersList.appendChild(quickItem);
        }
    }
    
    // 3. Добавляем на экран переводов (transfer-favorites-list)
    const transferFavoritesList = document.querySelector('.transfer-favorites-list');
    if (transferFavoritesList) {
        const transferItem = document.createElement('div');
        transferItem.className = 'transfer-favorite-item';
        transferItem.onclick = function() { quickTransfer(name, phone, bank); };
        transferItem.innerHTML = `
            <div class="transfer-favorite-avatar" style="background: var(--purple-gradient);">
                <span>${randomAvatar}</span>
            </div>
            <div class="transfer-favorite-info">
                <span class="transfer-favorite-name">${name}</span>
                <span class="transfer-favorite-details">${bank}</span>
            </div>
        `;
        
        // Вставляем перед кнопкой "Все"
        const allButton = transferFavoritesList.querySelector('.transfer-favorite-item:last-child');
        if (allButton) {
            transferFavoritesList.insertBefore(transferItem, allButton);
        } else {
            transferFavoritesList.appendChild(transferItem);
        }
    }
    
    showToast(`${name} добавлен в закреплённые`);
}

// Открытие модального окна добавления получателя
function openAddContactModal() {
    document.getElementById('add-contact-modal').classList.add('active');
}

// Закрытие модального окна добавления получателя
function closeAddContactModal() {
    document.getElementById('add-contact-modal').classList.remove('active');
    // Очистка формы
    document.getElementById('new-contact-name').value = '';
    document.getElementById('new-contact-phone').value = '';
    document.getElementById('new-contact-bank').value = '';
}

// Сохранение нового получателя
function saveNewContact() {
    const name = document.getElementById('new-contact-name').value.trim();
    const phone = document.getElementById('new-contact-phone').value.trim();
    const bank = document.getElementById('new-contact-bank').value;
    const isFavorite = document.getElementById('new-contact-favorite').checked;
    
    if (!name || !phone || !bank) {
        showToast('Заполните все поля');
        return;
    }
    
    // Удаляем всё кроме цифр
    const cleanPhone = phone.replace(/\D/g, '');
    const fullPhone = '+7' + cleanPhone;
    
    if (isFavorite) {
        addNewFavorite(name, fullPhone, bank);
    }
    
    closeAddContactModal();
    showToast('Получатель добавлен');
}

// Форматирование ввода телефона
function formatPhoneInput(input) {
    let value = input.value.replace(/\D/g, '');
    
    if (value.startsWith('7')) {
        value = value.substring(1);
    }
    
    if (value.length > 10) {
        value = value.substring(0, 10);
    }
    
    if (value.length > 0) {
        value = '+7 (' + value.substring(0, 3);
        if (value.length > 9) {
            value += ') ' + value.substring(3, 6);
            if (value.length > 14) {
                value += '-' + value.substring(6, 8);
                if (value.length > 17) {
                    value += '-' + value.substring(8, 10);
                }
            }
        }
    }
    
    input.value = value;
}

// Форматирование телефона для отображения
function formatPhoneDisplay(phone) {
    const digits = phone.replace(/\D/g, '');
    if (digits.length === 11) {
        return `+7 (${digits.substring(1, 4)}) ${digits.substring(4, 7)}-${digits.substring(7, 9)}-${digits.substring(9, 11)}`;
    }
    return phone;
}

// Поиск по закреплённым получателям
function filterFavorites() {
    const searchTerm = document.getElementById('favorites-search-input').value.toLowerCase();
    const favoriteItems = document.querySelectorAll('.favorite-item');
    
    favoriteItems.forEach(item => {
        const name = item.querySelector('.favorite-name').textContent.toLowerCase();
        const details = item.querySelector('.favorite-details').textContent.toLowerCase();
        
        if (name.includes(searchTerm) || details.includes(searchTerm)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

// ========================================
// ФУНКЦИИ ЭКРАНА КАРТЫ
// ========================================

let cardNumberVisible = false;

function toggleCardNumber() {
    const hiddenSpan = document.querySelector('.number-hidden');
    const visibleSpan = document.querySelector('.number-visible');

    if (hiddenSpan && visibleSpan) {
        cardNumberVisible = !cardNumberVisible;

        if (cardNumberVisible) {
            hiddenSpan.style.display = 'none';
            visibleSpan.style.display = 'inline';
        } else {
            hiddenSpan.style.display = 'inline';
            visibleSpan.style.display = 'none';
        }
    }
}

// ========================================
// ЧАТ С ПОДДЕРЖКОЙ
// ========================================

function sendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();

    if (message) {
        addMessage(message, 'user');
        input.value = '';

        // Имитация ответа бота
        setTimeout(() => {
            const responses = [
                'Поняла вас. Сейчас проверю информацию...',
                'Благодарю за ожидание. Нашла следующие данные...',
                'Могу предложить вам следующие варианты решения...',
                'Для решения вашего вопроса мне потребуется уточнить несколько деталей.'
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            addMessage(randomResponse, 'bot');
        }, 1500);
    }
}

function addMessage(text, type) {
    const messagesContainer = document.getElementById('chat-messages');
    const time = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.innerHTML = `
        <div class="message-bubble">${text}</div>
        <span class="message-time">${time}</span>
    `;

    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function sendQuickReply(text) {
    const input = document.getElementById('chat-input');
    input.value = text;
    sendMessage();
}

// ========================================
// УВЕДОМЛЕНИЯ
// ========================================

function markAllAsRead() {
    const unreadItems = document.querySelectorAll('.notification-item.unread');
    unreadItems.forEach(item => {
        item.classList.remove('unread');
        const badge = item.querySelector('.notification-badge-new');
        if (badge) badge.remove();
    });
    showToast('Все уведомления прочитаны');
}

// ========================================
// АНИМАЦИИ ПРИ ЗАГРУЗКЕ
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    // Анимация появления виджетов
    const widgets = document.querySelectorAll('.promo-banner, .balance-widget, .referral-widget, .products-section');

    widgets.forEach((widget, index) => {
        widget.style.opacity = '0';
        widget.style.transform = 'translateY(20px)';

        setTimeout(() => {
            widget.style.transition = 'opacity 0.4s ease-out, transform 0.4s ease-out';
            widget.style.opacity = '1';
            widget.style.transform = 'translateY(0)';
        }, index * 100);
    });

    // Инициализация главного экрана
    navigateTo('home-screen');
    
    // Инициализация виджета валют
    initCurrencyWidget();
});

// ========================================
// ОБРАБОТКА НАВИГАЦИИ
// ========================================

// Добавляем обработчики на все навигационные кнопки
document.addEventListener('DOMContentLoaded', function() {
    const navButtons = document.querySelectorAll('.nav-item');

    navButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            const screenId = this.dataset.screen;
            navigateTo(screenId);
        });
    });
});

// ========================================
// ЗАКРЫТИЕ БАННЕРОВ
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    const closeButtons = document.querySelectorAll('.close-banner');

    closeButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const banner = this.closest('.promo-card-banner');
            if (banner) {
                banner.style.display = 'none';
            }
        });
    });
});

// ========================================
// ПЕРЕКЛЮЧЕНИЕ ЧЕКБОКСОВ
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    const toggles = document.querySelectorAll('.toggle-switch input');

    toggles.forEach(toggle => {
        toggle.addEventListener('change', function() {
            const state = this.checked ? 'включено' : 'выключено';
            showToast(`Уведомления ${state}`);
        });
    });
});

// ========================================
// ПОКАЗ УВЕДОМЛЕНИЯ (TOAST)
// ========================================

// Открытие QR-сканера
function openQRScanner() {
    showToast('📷 Открытие сканера QR-кодов...');
    // Здесь будет логика открытия камеры для сканирования QR
    // Для мобильного приложения: navigator.mediaDevices.getUserMedia()
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(26, 26, 26, 0.9);
        color: white;
        padding: 12px 24px;
        border-radius: 12px;
        font-size: 14px;
        font-weight: 500;
        z-index: 3000;
        animation: toastSlide 0.3s ease-out;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s';
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

// Добавляем анимацию для toast
const toastStyle = document.createElement('style');
toastStyle.textContent = `
    @keyframes toastSlide {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }
`;
document.head.appendChild(toastStyle);

// ========================================
// ФОРМАТИРОВАНИЕ ВВОДА
// ========================================

function formatPhoneNumber(input) {
    let value = input.value.replace(/\D/g, '');

    if (value.startsWith('7')) {
        value = value.substring(1);
    }

    if (value.length > 10) {
        value = value.substring(0, 10);
    }

    if (value.length > 0) {
        value = `+7 (${value.substring(0, 3)}`;
        if (value.length > 9) {
            value += `) ${value.substring(3, 6)}`;
            if (value.length > 14) {
                value += `-${value.substring(6, 8)}`;
                if (value.length > 17) {
                    value += `-${value.substring(8, 10)}`;
                }
            }
        }
    }

    return value;
}

// ========================================
// КОПИРОВАНИЕ НОМЕРА КАРТЫ
// ========================================

async function copyCardNumber() {
    const cardNumber = '4582 1234 5678 1337';

    try {
        await navigator.clipboard.writeText(cardNumber);
        showToast('Номер карты скопирован');
    } catch (err) {
        console.error('Не удалось скопировать номер карты');
    }
}

// ========================================
// АВТОПЛАТЕЖИ — ФУНКЦИИ
// ========================================

// Данные для автоплатежей
let currentAutopayOffer = null;

// Данные истории платежей для анализа
const paymentHistoryData = [
    {
        id: 1,
        recipient: 'ЖКХ Услуги',
        category: 'utilities',
        mcc: '4900',
        payments: [
            { date: '2026-02-13', amount: 6800 },
            { date: '2026-01-15', amount: 6800 },
            { date: '2025-12-15', amount: 6500 },
            { date: '2025-11-15', amount: 6500 },
            { date: '2025-10-15', amount: 6200 },
            { date: '2025-09-15', amount: 6200 },
            { date: '2025-08-15', amount: 5800 },
            { date: '2025-07-15', amount: 5800 },
            { date: '2025-06-15', amount: 5800 },
            { date: '2025-05-15', amount: 5800 },
            { date: '2025-04-15', amount: 5800 },
            { date: '2025-03-15', amount: 5800 }
        ]
    },
    {
        id: 2,
        recipient: 'Дом.ру Интернет',
        category: 'internet',
        mcc: '4899',
        payments: [
            { date: '2026-03-05', amount: 550 },
            { date: '2026-02-05', amount: 550 },
            { date: '2026-01-05', amount: 550 },
            { date: '2025-12-05', amount: 550 },
            { date: '2025-11-05', amount: 550 }
        ]
    },
    {
        id: 3,
        recipient: 'МТС Мобильная связь',
        category: 'telecom',
        mcc: '4814',
        payments: [
            { date: '2026-03-10', amount: 350 },
            { date: '2026-02-10', amount: 350 },
            { date: '2026-01-10', amount: 350 },
            { date: '2025-12-10', amount: 350 }
        ]
    },
    {
        id: 4,
        recipient: 'Яндекс Плюс',
        category: 'subscription',
        mcc: '5818',
        payments: [
            { date: '2026-03-25', amount: 299 },
            { date: '2026-02-25', amount: 299 },
            { date: '2026-01-25', amount: 299 }
        ]
    },
    {
        id: 5,
        recipient: 'Папа',
        category: 'transfer',
        mcc: null,
        payments: [
            { date: '2026-03-08', amount: 5000 },
            { date: '2026-02-23', amount: 5000 },
            { date: '2026-02-10', amount: 3000 }
        ]
    },
    {
        id: 6,
        recipient: 'Билайн Интернет',
        category: 'internet',
        mcc: '4899',
        payments: [
            { date: '2026-03-01', amount: 450 }
        ]
    },
    {
        id: 7,
        recipient: 'Мама',
        category: 'transfer',
        mcc: null,
        payments: [
            { date: '2026-03-12', amount: 10000 }
        ]
    }
];

// Анализ платежа и определение типа
function analyzePayment(recipient, amount) {
    const history = paymentHistoryData.find(h => h.recipient === recipient);
    
    if (!history) {
        // Первый платёж новому получателю
        return {
            type: 'first',
            showOffer: true,
            variant: 'before',
            title: 'Настроить автоплатёж?',
            description: 'Вы впервые платите этому получателю. Хотите настроить автоплатёж, чтобы не вводить данные каждый раз?',
            recipient: recipient,
            amount: amount,
            frequency: '—',
            count: 1
        };
    }
    
    const paymentsCount = history.payments.length;
    const avgAmount = history.payments.reduce((sum, p) => sum + p.amount, 0) / paymentsCount;
    
    // Проверка на ЖКХ/интернет по MCC коду
    const isUtility = ['4900', '4901', '4814', '4899'].includes(history.mcc);
    const isSubscription = history.mcc === '5818';
    
    if (isUtility || isSubscription) {
        // ЖКХ/интернет/подписка — всегда предлагаем после первого
        return {
            type: 'utility',
            showOffer: paymentsCount >= 1,
            variant: 'after',
            title: 'Настроить автоплатёж?',
            description: `Вы регулярно платите за ${recipient.toLowerCase()}. Настройте автоплатёж, чтобы не беспокоиться о своевременной оплате.`,
            recipient: recipient,
            amount: Math.round(avgAmount).toLocaleString('ru-RU'),
            frequency: 'Раз в месяц',
            count: paymentsCount
        };
    }
    
    if (paymentsCount >= 3) {
        // Регулярный платёж (3+)
        // Проверяем интервалы между платежами
        const dates = history.payments.map(p => new Date(p.date));
        const intervals = [];
        for (let i = 1; i < dates.length; i++) {
            const diff = Math.abs(dates[i] - dates[i-1]) / (1000 * 60 * 60 * 24);
            intervals.push(diff);
        }
        const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
        
        // Интервал 25-35 дней = ежемесячный
        const isMonthly = avgInterval >= 25 && avgInterval <= 35;
        
        return {
            type: 'regular',
            showOffer: true,
            variant: 'after',
            title: 'Настроить автоплатёж?',
            description: `Мы заметили, что вы платите ${recipient.toLowerCase()} примерно раз в ${Math.round(avgInterval)} дней. Хотите автоматизировать этот процесс?`,
            recipient: recipient,
            amount: Math.round(avgAmount).toLocaleString('ru-RU'),
            frequency: `Раз в ${Math.round(avgInterval)} дней`,
            count: paymentsCount
        };
    }
    
    if (paymentsCount >= 2) {
        // Повторный платёж (2-3)
        return {
            type: 'repeat',
            showOffer: true,
            variant: 'after',
            title: 'Настроить автоплатёж?',
            description: `Вы уже второй раз платите ${recipient.toLowerCase()}. Может, стоит настроить автоплатёж?`,
            recipient: recipient,
            amount: Math.round(avgAmount).toLocaleString('ru-RU'),
            frequency: '—',
            count: paymentsCount
        };
    }
    
    return {
        type: 'unknown',
        showOffer: false,
        variant: null
    };
}

// Открытие модального окна предложения автоплатежа
function openAutopayOfferModal(recipient, amount) {
    const analysis = analyzePayment(recipient, amount);
    
    if (!analysis.showOffer) {
        return;
    }
    
    currentAutopayOffer = analysis;
    
    document.getElementById('autopay-offer-title').textContent = analysis.title;
    document.getElementById('autopay-offer-description').textContent = analysis.description;
    document.getElementById('autopay-recipient').textContent = analysis.recipient;
    document.getElementById('autopay-amount').textContent = `${analysis.amount} ₽`;
    document.getElementById('autopay-frequency').textContent = analysis.frequency;
    document.getElementById('autopay-count').textContent = analysis.count;
    
    document.getElementById('autopay-offer-modal').classList.add('active');
}

// Закрытие модального окна предложения
function closeAutopayOfferModal() {
    document.getElementById('autopay-offer-modal').classList.remove('active');
    currentAutopayOffer = null;
}

// Переход к настройке автоплатежа
function setupAutopay() {
    if (!currentAutopayOffer) return;
    
    document.getElementById('setup-recipient').value = currentAutopayOffer.recipient;
    document.getElementById('setup-amount').value = currentAutopayOffer.amount.replace(/\s/g, '');
    
    closeAutopayOfferModal();
    document.getElementById('autopay-setup-modal').classList.add('active');
}

// Закрытие модального окна настройки
function closeAutopaySetupModal() {
    document.getElementById('autopay-setup-modal').classList.remove('active');
}

// Переключение опций частоты
function toggleFrequencyOptions() {
    const frequency = document.getElementById('setup-frequency').value;
    const customBlock = document.getElementById('custom-frequency-block');
    const dateSelect = document.getElementById('setup-date');
    
    if (frequency === 'custom') {
        customBlock.style.display = 'flex';
        dateSelect.disabled = true;
    } else if (frequency === 'yearly') {
        customBlock.style.display = 'none';
        dateSelect.disabled = false;
        // Для yearly ограничиваем выбор месяца
        dateSelect.innerHTML = `
            <option value="1">Январь</option>
            <option value="2">Февраль</option>
            <option value="3">Март</option>
            <option value="4">Апрель</option>
            <option value="5">Май</option>
            <option value="6">Июнь</option>
            <option value="7">Июль</option>
            <option value="8">Август</option>
            <option value="9">Сентябрь</option>
            <option value="10">Октябрь</option>
            <option value="11">Ноябрь</option>
            <option value="12">Декабрь</option>
        `;
    } else {
        customBlock.style.display = 'none';
        dateSelect.disabled = false;
        // Восстанавливаем обычный список
        dateSelect.innerHTML = `
            <option value="1">1 число каждого месяца</option>
            <option value="5">5 число каждого месяца</option>
            <option value="10">10 число каждого месяца</option>
            <option value="15">15 число каждого месяца</option>
            <option value="20">20 число каждого месяца</option>
            <option value="25">25 число каждого месяца</option>
            <option value="last">Последний день месяца</option>
        `;
    }
}

// Подтверждение настройки автоплатежа
function confirmAutopaySetup() {
    const recipient = document.getElementById('setup-recipient').value;
    const amount = document.getElementById('setup-amount').value;
    const frequency = document.getElementById('setup-frequency').value;
    const date = document.getElementById('setup-date').value;
    const account = document.getElementById('setup-account').value;
    const notify = document.getElementById('setup-notify').checked;
    const confirm = document.getElementById('setup-confirm').checked;
    const insufficient = document.getElementById('setup-insufficient').checked;
    const limit = document.getElementById('setup-limit').value;
    const startDate = document.getElementById('setup-start-date').value;
    const endDate = document.getElementById('setup-end-date').value;
    const customInterval = document.getElementById('setup-custom-interval').value;

    // Получаем текст периодичности
    const frequencyTexts = {
        monthly: 'Ежемесячно',
        quarterly: 'Раз в квартал',
        yearly: 'Раз в год',
        custom: `Раз в ${customInterval || 30} дней`
    };
    const frequencyText = frequencyTexts[frequency] || 'Ежемесячно';

    // Получаем текст даты
    let dateText;
    if (frequency === 'yearly') {
        const months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
                       'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
        dateText = months[parseInt(date) - 1] || '';
    } else {
        dateText = date === 'last' ? 'Последний день' : `${date} число`;
    }

    // Добавляем новый автоплатёж в список
    const autopaymentsList = document.getElementById('autopayments-list');
    const newAutopayment = document.createElement('div');
    newAutopayment.className = 'autopayment-item';
    newAutopayment.dataset.id = Date.now();

    const amountFormatted = parseInt(amount).toLocaleString('ru-RU');
    const limitInfo = limit ? ` (лимит ${parseInt(limit).toLocaleString('ru-RU')} ₽)` : '';

    newAutopayment.innerHTML = `
        <div class="autopayment-icon utilities-bg">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                <path d="M12 6V12L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
        </div>
        <div class="autopayment-info">
            <span class="autopayment-name">${recipient}</span>
            <span class="autopayment-details">${frequencyText}, ${dateText} • ${amountFormatted} ₽${limitInfo}</span>
        </div>
        <div class="autopayment-status">
            <span class="status-badge active">Активен</span>
            <button class="autopayment-menu" onclick="openAutopayMenu(${newAutopayment.dataset.id})">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="1" fill="currentColor"/>
                    <circle cx="19" cy="12" r="1" fill="currentColor"/>
                    <circle cx="5" cy="12" r="1" fill="currentColor"/>
                </svg>
            </button>
        </div>
    `;

    autopaymentsList.insertBefore(newAutopayment, autopaymentsList.firstChild);

    // Обновляем сводку
    updateAutopaymentsSummary();

    closeAutopaySetupModal();
    showToast(`✅ Автоплатёж "${recipient}" создан`);
}

// Открытие меню автоплатежа
function openAutopayMenu(id) {
    const action = confirm('Управление автоплатёжом:\n\nOK — Приостановить/Возобновить\nОтмена — Удалить');
    
    if (action) {
        const item = document.querySelector(`.autopayment-item[data-id="${id}"]`);
        if (item) {
            const badge = item.querySelector('.status-badge');
            if (badge.classList.contains('active')) {
                badge.classList.remove('active');
                badge.classList.add('paused');
                badge.textContent = 'На паузе';
                showToast('Автоплатёж приостановлен');
            } else if (badge.classList.contains('paused')) {
                badge.classList.remove('paused');
                badge.classList.add('active');
                badge.textContent = 'Активен';
                showToast('Автоплатёж возобновлён');
            }
        }
    } else {
        const shouldDelete = confirm('Вы действительно хотите удалить этот автоплатёж?');
        if (shouldDelete) {
            const item = document.querySelector(`.autopayment-item[data-id="${id}"]`);
            if (item) {
                item.style.opacity = '0';
                item.style.transform = 'translateX(-20px)';
                setTimeout(() => {
                    item.remove();
                    updateAutopaymentsSummary();
                }, 300);
                showToast('Автоплатёж удалён');
            }
        }
    }
}

// Открытие модального окна добавления автоплатежа
function openAddAutopayModal() {
    document.getElementById('setup-recipient').value = '';
    document.getElementById('setup-amount').value = '';
    document.getElementById('autopay-setup-modal').classList.add('active');
}

// Обновление сводки автоплатежей
function updateAutopaymentsSummary() {
    const activeItems = document.querySelectorAll('.autopayment-item .status-badge.active');
    const monthlyAmount = Array.from(activeItems).reduce((sum, item) => {
        const details = item.querySelector('.autopayment-details');
        if (details) {
            const match = details.textContent.match(/([\d\s]+) ₽/);
            if (match) {
                return sum + parseInt(match[1].replace(/\s/g, ''));
            }
        }
        return sum;
    }, 0);
    
    document.getElementById('active-autopayments-count').textContent = activeItems.length;
    document.getElementById('monthly-autopayments-amount').textContent = `${monthlyAmount.toLocaleString('ru-RU')} ₽`;
}

// Навигация к экрану автоплатежей
function navigateToAutopayments() {
    navigateTo('autopayments-screen');
}

// ========================================
// НАСТРОЙКА ВАЛЮТ — ФУНКЦИИ
// ========================================

// Данные о курсах валют
const currencyRatesData = {
    USD: { symbol: '$', name: 'Доллар США', buy: 73.50, sell: 87.50 },
    EUR: { symbol: '€', name: 'Евро', buy: 88.50, sell: 96.50 },
    CNY: { symbol: '¥', name: 'Китайский юань', buy: 11.10, sell: 12.30 },
    GBP: { symbol: '£', name: 'Британский фунт', buy: 92.00, sell: 102.00 },
    TRY: { symbol: '₺', name: 'Турецкая лира', buy: 2.10, sell: 2.80 },
    KZT: { symbol: '₸', name: 'Казахский тенге', buy: 0.15, sell: 0.22 },
    BYN: { symbol: 'Br', name: 'Белорусский рубль', buy: 22.50, sell: 26.00 },
    AED: { symbol: 'د.إ', name: 'Дирхам ОАЭ', buy: 20.00, sell: 24.00 },
    THB: { symbol: '฿', name: 'Тайский бат', buy: 2.20, sell: 2.90 },
    INR: { symbol: '₹', name: 'Индийская рупия', buy: 0.85, sell: 1.10 }
};

// Сохранённые валюты пользователя
let userCurrencies = ['USD', 'EUR', 'CNY'];
const MAX_CURRENCIES = 3; // Максимум 3 валюты

// Инициализация виджета валют при загрузке
function initCurrencyWidget() {
    updateCurrencyWidget();
}

// Открытие модального окна всех валют
function openAllCurrenciesModal() {
    const modal = document.getElementById('all-currencies-modal');
    const list = document.getElementById('all-currencies-list');
    
    // Очищаем и заполняем список
    list.innerHTML = '';
    
    Object.keys(currencyRatesData).forEach(currencyCode => {
        const currency = currencyRatesData[currencyCode];
        const isSelected = userCurrencies.includes(currencyCode);
        
        const item = document.createElement('div');
        item.className = 'all-currency-item' + (isSelected ? ' selected' : '');
        item.innerHTML = `
            <span class="currency-selection-flag currency-flag-${currencyCode.toLowerCase()}">${currency.symbol}</span>
            <div class="all-currency-info">
                <span class="all-currency-code">${currencyCode}</span>
                <span class="all-currency-name">${currency.name}</span>
            </div>
            <div class="all-currency-rates">
                <span class="all-currency-rate-buy">${currency.buy.toFixed(2)}</span>
                <span class="all-currency-rate-sell">${currency.sell.toFixed(2)}</span>
            </div>
        `;
        list.appendChild(item);
    });
    
    modal.classList.add('active');
}

// Закрытие модального окна всех валют
function closeAllCurrenciesModal() {
    document.getElementById('all-currencies-modal').classList.remove('active');
}

// Открытие настройки валют
function openCurrencySettings() {
    const modal = document.getElementById('currency-settings-modal');
    const checkboxes = modal.querySelectorAll('.currency-selection-item input[type="checkbox"]');

    checkboxes.forEach(checkbox => {
        checkbox.checked = userCurrencies.includes(checkbox.value);
    });

    // Добавляем обработчики для ограничения выбора
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const checkedCount = modal.querySelectorAll('input[type="checkbox"]:checked').length;
            
            // Блокируем unchecked чекбоксы, если выбрано максимум
            if (checkedCount >= MAX_CURRENCIES) {
                checkboxes.forEach(cb => {
                    if (!cb.checked) {
                        cb.disabled = true;
                    }
                });
            } else {
                checkboxes.forEach(cb => {
                    cb.disabled = false;
                });
            }
        });
    });

    modal.classList.add('active');
}

// Закрытие настройки валют
function closeCurrencySettings() {
    document.getElementById('currency-settings-modal').classList.remove('active');
}

// Сохранение настроек валют
function saveCurrencySettings() {
    const checkboxes = document.querySelectorAll('#currency-selection-list input[type="checkbox"]');
    const selectedCurrencies = [];

    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            selectedCurrencies.push(checkbox.value);
        }
    });

    if (selectedCurrencies.length === 0) {
        showToast('Выберите хотя бы одну валюту');
        return;
    }

    if (selectedCurrencies.length > MAX_CURRENCIES) {
        showToast(`Можно выбрать максимум ${MAX_CURRENCIES} валюты`);
        return;
    }

    userCurrencies = selectedCurrencies;
    updateCurrencyWidget();
    closeCurrencySettings();
    showToast('Настройки валют сохранены');
}

// Обновление виджета валют
function updateCurrencyWidget() {
    const currencyList = document.getElementById('currency-list');
    if (!currencyList) return;

    // Очищаем текущий список
    currencyList.innerHTML = '';

    // Добавляем выбранные валюты
    userCurrencies.forEach(currencyCode => {
        const currency = currencyRatesData[currencyCode];
        if (currency) {
            const currencyItem = document.createElement('div');
            currencyItem.className = 'currency-item';
            currencyItem.dataset.currency = currencyCode;
            currencyItem.innerHTML = `
                <span class="currency-selection-flag currency-flag-${currencyCode.toLowerCase()}">${currency.symbol}</span>
                <span class="currency-code">${currencyCode}</span>
                <div class="currency-rates">
                    <span class="currency-rate">${currency.buy.toFixed(2)}</span>
                    <span class="currency-rate">${currency.sell.toFixed(2)}</span>
                </div>
            `;
            currencyList.appendChild(currencyItem);
        }
    });
}

// ========================================
// КАЛЬКУЛЯТОР ДЛЯ ПЕРЕВОДОВ — ФУНКЦИИ
// ========================================

let calculatorBuffer = [];
let currentInput = '0';

// Открытие экрана перевода
function openTransferCalculator(favoriteName, favoritePhone, favoriteBank) {
    calculatorBuffer = [];
    currentInput = '0';
    
    // Определяем логотип банка
    const bankLogos = {
        'СберБанк': '🟢',
        'Т-Банк': '🟡',
        'Альфа-Банк': '🔴',
        'ВТБ': '🔵'
    };
    const bankLogo = bankLogos[favoriteBank] || '🏦';

    navigateTo('transfer-detail-screen');
    
    // Заполняем данные получателя
    setTimeout(() => {
        document.getElementById('transfer-recipient-name').textContent = favoriteName;
        document.getElementById('transfer-recipient-bank').textContent = favoriteBank;
        document.getElementById('transfer-recipient-logo').textContent = bankLogo;
        document.getElementById('transfer-recipient-phone').textContent = favoritePhone;
    }, 100);
}

// Закрытие калькулятора
function closeTransferCalculator() {
    // Теперь просто возвращаемся на предыдущий экран
    navigateTo('transfer-screen');
}

// Установка суммы
function setAmount(amount) {
    const amountInput = document.getElementById('transfer-amount');
    if (amountInput) {
        amountInput.value = amount;
        updateTransferTotal();
    }
}

// Обновление итоговой суммы
function updateTransferTotal() {
    const amountInput = document.getElementById('transfer-amount');
    const totalAmountEl = document.getElementById('transfer-total-amount');
    const finalAmountEl = document.getElementById('transfer-final-amount');
    
    const amount = amountInput ? parseInt(amountInput.value) || 0 : 0;
    
    if (totalAmountEl) {
        totalAmountEl.textContent = `${amount.toLocaleString('ru-RU')} ₽`;
    }
    if (finalAmountEl) {
        finalAmountEl.textContent = `${amount.toLocaleString('ru-RU')} ₽`;
    }
}

// Переключение калькулятора
function toggleCalculator() {
    const calculator = document.getElementById('embedded-calculator');
    if (calculator) {
        calculator.style.display = calculator.style.display === 'none' ? 'block' : 'none';
    }
}

// Ввод значения в калькулятор
function calculatorInput(value) {
    const expressionEl = document.getElementById('calc-expression');
    const resultEl = document.getElementById('calc-result');

    if (value === 'C') {
        calculatorBuffer = [];
        currentInput = '0';
        expressionEl.textContent = '';
        resultEl.textContent = '0';
        return;
    }

    if (['+', '-', '*', '/'].includes(value)) {
        if (currentInput !== '0') {
            calculatorBuffer.push(currentInput);
            calculatorBuffer.push(value);
            currentInput = '0';
        } else if (calculatorBuffer.length > 0) {
            calculatorBuffer[calculatorBuffer.length - 1] = value;
        }
        expressionEl.textContent = calculatorBuffer.join(' ');
    } else {
        if (currentInput === '0') {
            currentInput = value;
        } else {
            currentInput += value;
        }
        resultEl.textContent = currentInput;
    }
}

// Вычисление результата
function calculateResult() {
    const expressionEl = document.getElementById('calc-expression');
    const resultEl = document.getElementById('calc-result');
    const amountInput = document.getElementById('transfer-amount');

    if (currentInput !== '0') {
        calculatorBuffer.push(currentInput);
    }

    if (calculatorBuffer.length === 0) return;

    const expression = calculatorBuffer.join(' ');
    expressionEl.textContent = expression + ' =';

    try {
        const result = eval(expression.replace(/[^0-9+\-*/.]/g, ''));
        const roundedResult = Math.round(result);
        currentInput = roundedResult.toString();
        resultEl.textContent = roundedResult;
        
        // Автоматически вставляем результат в поле суммы
        if (amountInput) {
            amountInput.value = roundedResult;
            updateTransferTotal();
        }
    } catch (e) {
        resultEl.textContent = 'Ошибка';
        currentInput = '0';
    }

    calculatorBuffer = [];
}

// Применение результата калькулятора
function applyCalculatorResult() {
    // Результат уже применён в calculateResult(), просто закрываем калькулятор
    toggleCalculator();
}

// ========================================
// ВЫБОР КАТЕГОРИИ ПЕРЕВОДА
// ========================================

let selectedTransferCategory = {
    id: 'transfers',
    icon: '💸',
    name: 'Переводы'
};

// Открытие модального окна выбора категории
function openCategoryModal() {
    document.getElementById('transfer-category-modal').classList.add('active');
}

// Закрытие модального окна выбора категории
function closeCategoryModal() {
    document.getElementById('transfer-category-modal').classList.remove('active');
}

// Выбор категории
function selectCategory(id, icon, name) {
    selectedTransferCategory = { id, icon, name };
    
    // Обновляем отображение выбранной категории
    const categoryIcon = document.getElementById('selected-category-icon');
    const categoryName = document.getElementById('selected-category-name');
    
    if (categoryIcon && categoryName) {
        categoryIcon.textContent = icon;
        categoryName.textContent = name;
    }
    
    closeCategoryModal();
    showToast(`Категория: ${name}`);
}

// ========================================
// ДЕТАЛИ ТРАНЗАКЦИИ И АВТОПЛАТЕЖИ
// ========================================

// Данные для отображения в деталях транзакции
let currentTransactionData = null;

// Открытие деталей транзакции
function openTransactionDetail(transaction) {
    currentTransactionData = transaction;
    
    // Заполняем данные
    const amountEl = document.getElementById('detail-amount');
    const cashbackEl = document.getElementById('detail-cashback');
    const cashbackAmountEl = document.getElementById('detail-cashback-amount');
    const categoryIconEl = document.getElementById('detail-category-icon');
    const categoryNameEl = document.getElementById('detail-category-name');
    const categoryFullEl = document.getElementById('detail-category-full');
    const merchantEl = document.getElementById('detail-merchant');
    const messageEl = document.getElementById('detail-message');
    const datetimeEl = document.getElementById('detail-datetime');
    const mccEl = document.getElementById('detail-mcc');
    const typeEl = document.getElementById('detail-type');
    
    const isIncome = transaction.amount < 0;
    const displayAmount = Math.abs(transaction.amount);
    
    if (amountEl) {
        amountEl.textContent = `${isIncome ? '+' : '-'}${displayAmount.toLocaleString('ru-RU')} ₽`;
        amountEl.style.color = isIncome ? '#28A745' : 'var(--white)';
    }
    
    // Показываем/скрываем кэшбэк
    if (cashbackEl) {
        if (transaction.cashback && transaction.cashback > 0 && !isIncome) {
            cashbackEl.textContent = `+${transaction.cashback.toLocaleString('ru-RU')} ₽ кэшбэк`;
            cashbackEl.style.display = 'inline';
        } else {
            cashbackEl.style.display = 'none';
        }
    }
    if (cashbackAmountEl) {
        cashbackAmountEl.textContent = transaction.cashback ? `+${transaction.cashback.toLocaleString('ru-RU')} ₽` : '+0 ₽';
    }
    
    if (categoryIconEl) categoryIconEl.textContent = transaction.category?.icon || '💸';
    if (categoryNameEl) categoryNameEl.textContent = transaction.category?.name || 'Переводы';
    if (categoryFullEl) categoryFullEl.textContent = getCategoryFullName(transaction.category?.id);
    if (merchantEl) merchantEl.textContent = transaction.recipient || 'Мерчант';
    if (messageEl) messageEl.textContent = transaction.message || (transaction.message === '' ? '—' : '');
    if (datetimeEl) datetimeEl.textContent = formatTransactionDate(new Date());
    
    // MCC и тип операции
    if (mccEl) mccEl.textContent = isIncome ? 'Не применимо' : '5411';
    if (typeEl) typeEl.textContent = isIncome ? 'Зачисление' : 'Покупка';
    
    // Заполняем данные для автоплатежа
    if (document.getElementById('autopay-recipient-name')) {
        document.getElementById('autopay-recipient-name').textContent = transaction.recipient || 'Мерчант';
    }
    if (document.getElementById('autopay-recipient-icon')) {
        document.getElementById('autopay-recipient-icon').textContent = transaction.category?.icon || '💸';
    }
    if (document.getElementById('autopay-amount')) {
        document.getElementById('autopay-amount').value = displayAmount || '';
    }
    
    navigateTo('transaction-detail-screen');
}

// Получение полного названия категории
function getCategoryFullName(categoryId) {
    const names = {
        transfers: 'Переводы и платежи',
        education: 'Образование и обучение',
        family: 'Семья и дети',
        rent: 'Аренда жилья',
        gifts: 'Подарки и праздники',
        charity: 'Благотворительность',
        services: 'Услуги и сервис',
        health: 'Здоровье и медицина',
        beauty: 'Красота и уход',
        sport: 'Спорт и фитнес',
        pets: 'Товары для животных',
        other: 'Другое',
        food: 'Продукты питания',
        transport: 'Транспорт и такси',
        shop: 'Покупки и магазины',
        utilities: 'ЖКХ и связь',
        pharmacy: 'Аптеки',
        entertainment: 'Развлечения'
    };
    return names[categoryId] || categoryId;
}

// Форматирование даты транзакции
function formatTransactionDate(date) {
    const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day} ${month} ${year}, ${hours}:${minutes}`;
}

// Открытие модального окна автоплатежа
function openAutopayModal() {
    updateAutopayFirstPayment();
    document.getElementById('autopay-modal').classList.add('active');
}

// Закрытие модального окна автоплатежа
function closeAutopayModal() {
    document.getElementById('autopay-modal').classList.remove('active');
}

// Обновление даты первого платежа
function updateAutopayFirstPayment() {
    const dateSelect = document.getElementById('autopay-date');
    const frequencyRadios = document.querySelectorAll('input[name="autopay-frequency"]');
    const firstPaymentEl = document.getElementById('autopay-first-payment');
    
    if (!dateSelect || !firstPaymentEl) return;
    
    const day = parseInt(dateSelect.value);
    let isWeekly = false;
    frequencyRadios.forEach(radio => {
        if (radio.checked && radio.value === 'week') isWeekly = true;
    });
    
    const now = new Date();
    const firstPayment = new Date(now);
    
    if (isWeekly) {
        // Раз в неделю - следующий тот же день недели
        firstPayment.setDate(firstPayment.getDate() + 7);
    } else {
        // Раз в месяц
        firstPayment.setDate(day);
        if (firstPayment <= now) {
            firstPayment.setMonth(firstPayment.getMonth() + 1);
        }
    }
    
    const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
    firstPaymentEl.textContent = `${firstPayment.getDate()} ${months[firstPayment.getMonth()]} ${firstPayment.getFullYear()}`;
}

// Сохранение автоплатежа
function saveAutopay() {
    const amount = document.getElementById('autopay-amount').value;
    const frequencyRadios = document.querySelectorAll('input[name="autopay-frequency"]');
    const dateSelect = document.getElementById('autopay-date');
    const notifyBefore = document.getElementById('autopay-notify-before').checked;
    const notifyAfter = document.getElementById('autopay-notify-after').checked;
    
    if (!amount || parseInt(amount) <= 0) {
        showToast('Введите сумму автоплатежа');
        return;
    }
    
    let frequency = 'month';
    frequencyRadios.forEach(radio => {
        if (radio.checked) frequency = radio.value;
    });
    
    const frequencyText = frequency === 'week' ? 'еженедельно' : 'ежемесячно';
    const dateText = dateSelect.options[dateSelect.selectedIndex].text;
    
    closeAutopayModal();
    showToast(`✅ Автоплатёж настроен: ${frequencyText} ${dateText}`);
}

// Обработчики для автоплатежа
document.addEventListener('DOMContentLoaded', function() {
    const dateSelect = document.getElementById('autopay-date');
    const frequencyRadios = document.querySelectorAll('input[name="autopay-frequency"]');
    
    if (dateSelect) {
        dateSelect.addEventListener('change', updateAutopayFirstPayment);
    }
    
    frequencyRadios.forEach(radio => {
        radio.addEventListener('change', updateAutopayFirstPayment);
    });
});

// Действия с транзакцией
function openTransactionActions() {
    showToast('Действия с операцией');
}

function shareTransaction() {
    showToast('📤 Поделиться операцией...');
}

function downloadReceipt() {
    showToast('📄 Скачивание чека...');
}

function reportProblem() {
    showToast('⚠️ Сообщить о проблеме');
}

// Подтверждение перевода
function confirmTransfer() {
    const amountInput = document.getElementById('transfer-amount');
    const messageInput = document.getElementById('transfer-message');
    const recipientName = document.getElementById('transfer-recipient-name').textContent;

    const amount = amountInput ? parseInt(amountInput.value) : 0;

    if (!amount || amount <= 0) {
        showToast('Введите сумму перевода');
        return;
    }

    const message = messageInput ? messageInput.value : '';
    const category = selectedTransferCategory;

    let confirmationMsg = `✅ Перевод ${amount.toLocaleString('ru-RU')} ₽ → ${recipientName}`;
    if (message) {
        confirmationMsg += `\n💬 Сообщение: ${message}`;
    }
    confirmationMsg += `\n📁 Категория: ${category.name}`;

    showToast(confirmationMsg);

    // Добавляем транзакцию в историю с выбранной категорией
    addTransactionToHistory({
        recipient: recipientName,
        amount: amount,
        message: message,
        category: category
    });

    // Предлагаем настроить распределение зарплаты при крупном переводе на счёт
    if (amount >= 10000) {
        setTimeout(() => {
            const shouldSetup = confirm('💰 Хотите настроить автоматическое распределение зарплаты?\n\nВы делаете крупные переводы на счёт. Настройте автопополнение в день зарплаты!');
            if (shouldSetup) {
                openSalaryDistributionModal();
            }
        }, 1000);
    }

    // Возврат на главный экран
    setTimeout(() => {
        navigateTo('home-screen');
    }, 1500);
}

// Обновлённая функция quickTransfer для открытия калькулятора
function quickTransfer(name, phone, bank) {
    closeFavoritesModal();
    openTransferCalculator(name, phone, bank);
}

// ========================================
// PULL TO REFRESH (имитация)
// ========================================

let startY = 0;
let isPulling = false;

document.addEventListener('touchstart', function(e) {
    if (window.scrollY === 0) {
        startY = e.touches[0].clientY;
        isPulling = true;
    }
}, { passive: true });

document.addEventListener('touchmove', function(e) {
    if (isPulling) {
        const currentY = e.touches[0].clientY;
        const diff = currentY - startY;

        if (diff > 100) {
            isPulling = false;
            showRefreshIndicator();
        }
    }
}, { passive: true });

document.addEventListener('touchend', function() {
    isPulling = false;
});

function showRefreshIndicator() {
    console.log('Обновление данных...');
    showToast('Данные обновлены');
}

// ========================================
// ЭКСПОРТ ФУНКЦИЙ
// ========================================

window.OTPBankApp = {
    navigateTo,
    toggleCardNumber,
    showToast,
    copyCardNumber,
    markAllAsRead,
    // Автоплатежи
    openAutopayOfferModal,
    closeAutopayOfferModal,
    setupAutopay,
    navigateToAutopayments,
    analyzePayment,
    // Валюты
    openCurrencySettings,
    closeCurrencySettings,
    saveCurrencySettings,
    // Калькулятор переводов
    openTransferCalculator,
    closeTransferCalculator,
    quickTransfer,
    // QR-сканер
    openQRScanner
};

// ========================================
// ИНТЕГРАЦИЯ АВТОПЛАТЕЖЕЙ С ТРАНЗАКЦИЯМИ
// ========================================

// Добавляем обработчик на транзакции для предложения автоплатежа
document.addEventListener('DOMContentLoaded', function() {
    // Находим все транзакции и добавляем возможность предложения автоплатежа
    const transactionItems = document.querySelectorAll('.transaction-item');
    
    transactionItems.forEach(item => {
        item.addEventListener('click', function() {
            const merchant = this.querySelector('.transaction-merchant');
            const amount = this.querySelector('.amount-value');
            
            if (merchant && amount) {
                const merchantName = merchant.textContent;
                const amountText = amount.textContent.replace(/[^0-9]/g, '');
                const amountValue = parseInt(amountText) || 1000;
                
                // Проверяем, не является ли это доходом
                if (!amount.classList.contains('positive')) {
                    // Показываем предложение автоплатежа после просмотра транзакции
                    setTimeout(() => {
                        openAutopayOfferModal(merchantName, amountValue);
                    }, 500);
                }
            }
        });
    });
});

// ========================================
// КОНСОЛЬНЫЕ СООБЩЕНИЯ
// ========================================

// ========================================
// EDIT MODE — РЕЖИМ РЕДАКТИРОВАНИЯ ЭКРАНА
// ========================================

let editMode = false;
let draggedBlock = null;

// Блоки для редактирования
const editableBlocks = [
    { id: 'promo-banners', selector: '.promo-banners', name: 'Промо-баннеры' },
    { id: 'balance-widget', selector: '.balance-widget', name: 'Виджет баланса' },
    { id: 'quick-transfers', selector: '.quick-transfers-section', name: 'Быстрые переводы' },
    { id: 'cards', selector: '.cards-section', name: 'Карты' },
    { id: 'credits', selector: '.credits-section', name: 'Кредиты' },
    { id: 'deposits', selector: '.deposits-section', name: 'Вклады и счета' },
    { id: 'currency-widget', selector: '.currency-widget', name: 'Курсы валют' },
    { id: 'useful-widget', selector: '.useful-widget', name: 'Полезное' },
    { id: 'cta-button', selector: '.cta-button', name: 'Кнопка продукта' }
];

// Включение/выключение режима редактирования
function toggleEditMode() {
    editMode = !editMode;
    
    const editPanel = document.getElementById('edit-panel');
    const editBtn = document.getElementById('edit-screen-btn');
    const contentScroll = document.querySelector('.content-scroll');
    
    if (editMode) {
        // Включаем режим редактирования
        editPanel.style.display = 'block';
        contentScroll.classList.add('edit-mode');
        editBtn.style.background = 'var(--lime)';
        editBtn.style.color = 'var(--black)';
        
        // Удаляем индикатор на время редактирования
        const indicator = editBtn.querySelector('.notification-badge');
        if (indicator) indicator.remove();
        
        // Показываем все скрытые блоки на время редактирования
        editableBlocks.forEach(block => {
            const element = document.querySelector(block.selector);
            if (element && element.classList.contains('hidden-block')) {
                element.style.display = 'block';
            }
        });
        
        // Добавляем контролы к блокам
        setupEditableBlocks();
        showToast('Режим редактирования включён');
    } else {
        // Выключаем режим редактирования
        editPanel.style.display = 'none';
        contentScroll.classList.remove('edit-mode');
        editBtn.style.background = '';
        editBtn.style.color = '';
        
        // Восстанавливаем видимость скрытых блоков
        editableBlocks.forEach(block => {
            const element = document.querySelector(block.selector);
            if (element && element.classList.contains('hidden-block')) {
                element.style.display = 'none';
            }
        });
        
        // Удаляем контролы
        removeEditableControls();
    }
}

// Настройка редактируемых блоков
function setupEditableBlocks() {
    editableBlocks.forEach(block => {
        const element = document.querySelector(block.selector);
        if (!element) return;
        
        // Добавляем класс для редактирования
        element.classList.add('editable-block');
        
        // Добавляем кнопку перетаскивания
        const dragHandle = document.createElement('div');
        dragHandle.className = 'drag-handle';
        dragHandle.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="9" cy="6" r="2" fill="currentColor"/>
                <circle cx="15" cy="6" r="2" fill="currentColor"/>
                <circle cx="9" cy="12" r="2" fill="currentColor"/>
                <circle cx="15" cy="12" r="2" fill="currentColor"/>
                <circle cx="9" cy="18" r="2" fill="currentColor"/>
                <circle cx="15" cy="18" r="2" fill="currentColor"/>
            </svg>
        `;
        dragHandle.onclick = (e) => e.stopPropagation();
        
        // Добавляем кнопку скрытия/показа
        const visibilityToggle = document.createElement('div');
        visibilityToggle.className = 'visibility-toggle';
        visibilityToggle.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
            </svg>
        `;
        visibilityToggle.onclick = (e) => {
            e.stopPropagation();
            toggleBlockVisibility(element, block.id);
        };
        
        // Добавляем drag-and-drop
        element.draggable = true;
        element.addEventListener('dragstart', handleBlockDragStart);
        element.addEventListener('dragend', handleBlockDragEnd);
        element.addEventListener('dragover', handleBlockDragOver);
        element.addEventListener('drop', handleBlockDrop);
        element.addEventListener('dragleave', handleBlockDragLeave);
        
        // Touch события для мобильных
        element.addEventListener('touchstart', handleBlockTouchStart, { passive: true });
        element.addEventListener('touchmove', handleBlockTouchMove, { passive: true });
        element.addEventListener('touchend', handleBlockTouchEnd);
        
        element.appendChild(dragHandle);
        element.appendChild(visibilityToggle);
    });
}

// Удаление контролов
function removeEditableControls() {
    editableBlocks.forEach(block => {
        const element = document.querySelector(block.selector);
        if (!element) return;
        
        element.classList.remove('editable-block');
        element.draggable = false;
        
        // Удаляем обработчики
        element.removeEventListener('dragstart', handleBlockDragStart);
        element.removeEventListener('dragend', handleBlockDragEnd);
        element.removeEventListener('dragover', handleBlockDragOver);
        element.removeEventListener('drop', handleBlockDrop);
        element.removeEventListener('dragleave', handleBlockDragLeave);
        element.removeEventListener('touchstart', handleBlockTouchStart);
        element.removeEventListener('touchmove', handleBlockTouchMove);
        element.removeEventListener('touchend', handleBlockTouchEnd);
        
        // Удаляем контролы
        const dragHandle = element.querySelector('.drag-handle');
        const visibilityToggle = element.querySelector('.visibility-toggle');
        if (dragHandle) dragHandle.remove();
        if (visibilityToggle) visibilityToggle.remove();
    });
}

// Переключение видимости блока
function toggleBlockVisibility(element, blockId) {
    const isHidden = element.classList.contains('hidden-block');
    
    if (isHidden) {
        element.classList.remove('hidden-block');
        element.style.display = 'block';
    } else {
        element.classList.add('hidden-block');
        element.style.display = 'none';
    }
}

// Drag-and-drop обработчики
let blockTouchStartY = 0;

function handleBlockDragStart(e) {
    draggedBlock = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => this.style.opacity = '0.5', 0);
}

function handleBlockDragEnd(e) {
    this.classList.remove('dragging');
    this.style.opacity = '';
    document.querySelectorAll('.editable-block').forEach(block => {
        block.classList.remove('drag-over');
    });
    draggedBlock = null;
}

function handleBlockDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (this !== draggedBlock) {
        this.classList.add('drag-over');
    }
}

function handleBlockDragLeave(e) {
    this.classList.remove('drag-over');
}

function handleBlockDrop(e) {
    e.preventDefault();
    this.classList.remove('drag-over');
    
    if (draggedBlock && this !== draggedBlock) {
        // Меняем блоки местами в DOM
        const parent = draggedBlock.parentNode;
        const draggedNext = draggedBlock.nextSibling;
        const thisNext = this.nextSibling;
        
        if (draggedNext === this) {
            // Соседние элементы
            parent.insertBefore(this, draggedBlock);
        } else if (thisNext === draggedBlock) {
            parent.insertBefore(draggedBlock, this);
        } else {
            parent.insertBefore(draggedBlock, thisNext);
            parent.insertBefore(this, draggedNext);
        }
        
        showToast('Блоки перемещены');
    }
}

// Touch обработчики для мобильных
function handleBlockTouchStart(e) {
    draggedBlock = this;
    blockTouchStartY = e.touches[0].clientY;
    this.classList.add('dragging');
}

function handleBlockTouchMove(e) {
    if (!draggedBlock) return;
    
    const touch = e.touches[0];
    const target = document.elementFromPoint(touch.clientX, touch.clientY);
    const blockItem = target?.closest('.editable-block');
    
    document.querySelectorAll('.editable-block').forEach(block => {
        block.classList.remove('drag-over');
    });
    
    if (blockItem && blockItem !== draggedBlock) {
        blockItem.classList.add('drag-over');
    }
}

function handleBlockTouchEnd(e) {
    if (!draggedBlock) return;
    
    const touch = e.changedTouches[0];
    const target = document.elementFromPoint(touch.clientX, touch.clientY);
    const blockItem = target?.closest('.editable-block');
    
    if (blockItem && blockItem !== draggedBlock) {
        const parent = draggedBlock.parentNode;
        const draggedNext = draggedBlock.nextSibling;
        const thisNext = blockItem.nextSibling;
        
        if (draggedNext === blockItem) {
            parent.insertBefore(blockItem, draggedBlock);
        } else if (thisNext === draggedBlock) {
            parent.insertBefore(draggedBlock, blockItem);
        } else {
            parent.insertBefore(draggedBlock, thisNext);
            parent.insertBefore(blockItem, draggedNext);
        }
        
        showToast('Блоки перемещены');
    }
    
    draggedBlock.classList.remove('dragging');
    draggedBlock = null;
    blockTouchStartY = 0;
    
    document.querySelectorAll('.editable-block').forEach(block => {
        block.classList.remove('drag-over');
    });
}

// Отмена режима редактирования
function cancelEditMode() {
    toggleEditMode();
    showToast('Изменения отменены');
}

// Показать все блоки (сбросить скрытые)
function showAllBlocks() {
    editableBlocks.forEach(block => {
        const element = document.querySelector(block.selector);
        if (element) {
            element.classList.remove('hidden-block');
            element.style.display = 'block';
        }
    });
    
    // Сохраняем
    localStorage.setItem('screenLayout', JSON.stringify({
        order: editableBlocks.map(b => b.id),
        hidden: []
    }));
    
    updateHiddenIndicator(0);
    showToast('Все блоки показаны');
}

// Сохранение режима редактирования
function saveEditMode() {
    // Сохраняем порядок блоков
    const contentScroll = document.querySelector('.content-scroll');
    const blocks = Array.from(contentScroll.querySelectorAll('.editable-block'));
    const order = blocks.map(block => {
        const found = editableBlocks.find(b => b.selector === block.selector);
        return found ? found.id : null;
    }).filter(id => id);
    
    // Сохраняем скрытые блоки
    const hidden = editableBlocks
        .filter(block => {
            const element = document.querySelector(block.selector);
            return element && element.classList.contains('hidden-block');
        })
        .map(block => block.id);
    
    // Сохраняем в localStorage
    const layout = { order, hidden };
    localStorage.setItem('screenLayout', JSON.stringify(layout));
    
    // Обновляем индикатор
    updateHiddenIndicator(hidden.length);
    
    toggleEditMode();
    showToast('Макет сохранён');
}

// Обновление индикатора скрытых блоков
function updateHiddenIndicator(count) {
    const editBtn = document.getElementById('edit-screen-btn');
    if (!editBtn) return;
    
    // Удаляем старый индикатор
    const oldIndicator = editBtn.querySelector('.notification-badge');
    if (oldIndicator) oldIndicator.remove();
    
    // Добавляем новый, если есть скрытые
    if (count > 0) {
        const indicator = document.createElement('span');
        indicator.className = 'notification-badge';
        indicator.textContent = count;
        indicator.style.position = 'absolute';
        indicator.style.top = '4px';
        indicator.style.right = '4px';
        indicator.style.width = '18px';
        indicator.style.height = '18px';
        indicator.style.fontSize = '10px';
        editBtn.style.position = 'relative';
        editBtn.appendChild(indicator);
    }
}

// Загрузка сохранённого макета
function loadScreenLayout() {
    try {
        const saved = localStorage.getItem('screenLayout');
        if (!saved) return;
        
        const layout = JSON.parse(saved);
        const contentScroll = document.querySelector('.content-scroll');
        
        // Восстанавливаем порядок
        if (layout.order) {
            layout.order.forEach(blockId => {
                const block = editableBlocks.find(b => b.id === blockId);
                if (block) {
                    const element = document.querySelector(block.selector);
                    if (element) {
                        contentScroll.appendChild(element);
                    }
                }
            });
        }
        
        // Восстанавливаем скрытые блоки
        if (layout.hidden) {
            layout.hidden.forEach(blockId => {
                const block = editableBlocks.find(b => b.id === blockId);
                if (block) {
                    const element = document.querySelector(block.selector);
                    if (element) {
                        element.classList.add('hidden-block');
                        element.style.display = 'none';
                    }
                }
            });
            
            // Показываем индикатор на кнопке редактирования
            const editBtn = document.getElementById('edit-screen-btn');
            if (editBtn && !editBtn.querySelector('.hidden-indicator')) {
                const indicator = document.createElement('span');
                indicator.className = 'notification-badge';
                indicator.textContent = layout.hidden.length;
                indicator.style.position = 'absolute';
                indicator.style.top = '4px';
                indicator.style.right = '4px';
                indicator.style.width = '18px';
                indicator.style.height = '18px';
                indicator.style.fontSize = '10px';
                editBtn.style.position = 'relative';
                editBtn.appendChild(indicator);
            }
        }
    } catch (e) {
        console.error('Ошибка загрузки макета:', e);
    }
}

// Загрузка при старте
document.addEventListener('DOMContentLoaded', loadScreenLayout);

// ========================================
// ЭКСПОРТ ФУНКЦИЙ
// ========================================

window.OTPBankApp = {
    navigateTo,
    toggleCardNumber,
    showToast,
    copyCardNumber,
    markAllAsRead,
    // Автоплатежи
    openAutopayOfferModal,
    closeAutopayOfferModal,
    setupAutopay,
    navigateToAutopayments,
    analyzePayment,
    // Валюты
    openCurrencySettings,
    closeCurrencySettings,
    saveCurrencySettings,
    initCurrencyWidget,
    openAllCurrenciesModal,
    closeAllCurrenciesModal,
    // Калькулятор переводов
    openTransferCalculator,
    closeTransferCalculator,
    quickTransfer,
    // QR-сканер
    openQRScanner,
    // Платежи
    openPaymentFavoritesModal,
    openQuickPayment,
    // Конструктор экрана
    toggleEditMode,
    cancelEditMode,
    saveEditMode,
    // Переводы
    toggleCalculator,
    calculatorInput,
    calculateResult,
    applyCalculatorResult,
    updateTransferTotal,
    // Распределение зарплаты
    openSalaryDistributionModal,
    closeSalaryDistributionModal,
    toggleSalaryType,
    setSalaryValue,
    saveSalaryDistribution
};

// ========================================
// РАСПРЕДЕЛЕНИЕ ЗАРПЛАТЫ — ФУНКЦИИ
// ========================================

const SALARY_AMOUNT = 85000; // Предполагаемая зарплата

// Открытие модального окна распределения зарплаты
function openSalaryDistributionModal() {
    updateSalaryPrediction();
    document.getElementById('salary-distribution-modal').classList.add('active');
}

// Закрытие модального окна
function closeSalaryDistributionModal() {
    document.getElementById('salary-distribution-modal').classList.remove('active');
}

// Переключение типа распределения
function toggleSalaryType() {
    const isPercent = document.querySelector('input[name="salary-type"][value="percent"]').checked;
    const label = document.getElementById('salary-value-label');
    const suffix = document.getElementById('salary-value-suffix');
    const presets = document.querySelectorAll('.salary-preset-chip');
    
    if (isPercent) {
        label.textContent = 'Процент от зарплаты';
        suffix.textContent = '%';
        presets.forEach((chip, index) => {
            chip.textContent = [5, 10, 15, 20][index] + '%';
            chip.onclick = function() { setSalaryValue([5, 10, 15, 20][index]); };
        });
    } else {
        label.textContent = 'Сумма';
        suffix.textContent = '₽';
        presets.forEach((chip, index) => {
            const values = [5000, 10000, 15000, 20000];
            chip.textContent = values[index].toLocaleString('ru-RU') + ' ₽';
            chip.onclick = function() { setSalaryValue(values[index]); };
        });
    }
    
    updateSalaryPrediction();
}

// Установка значения
function setSalaryValue(value) {
    document.getElementById('salary-value').value = value;
    updateSalaryPrediction();
}

// Обновление прогноза
function updateSalaryPrediction() {
    const isPercent = document.querySelector('input[name="salary-type"][value="percent"]').checked;
    const value = parseInt(document.getElementById('salary-value').value) || 0;
    
    let monthlyAmount;
    if (isPercent) {
        monthlyAmount = Math.round(SALARY_AMOUNT * (value / 100));
    } else {
        monthlyAmount = value;
    }
    
    const yearlyAmount = monthlyAmount * 12;
    
    document.getElementById('salary-prediction-amount').textContent = monthlyAmount.toLocaleString('ru-RU') + ' ₽';
    document.getElementById('salary-prediction-monthly').textContent = monthlyAmount.toLocaleString('ru-RU') + ' ₽';
    document.getElementById('salary-prediction-yearly').textContent = yearlyAmount.toLocaleString('ru-RU') + ' ₽';
}

// Сохранение настроек
function saveSalaryDistribution() {
    const isPercent = document.querySelector('input[name="salary-type"][value="percent"]').checked;
    const value = parseInt(document.getElementById('salary-value').value) || 0;
    const targetAccount = document.getElementById('salary-target-account').value;
    
    if (value <= 0) {
        showToast('Введите значение больше 0');
        return;
    }
    
    closeSalaryDistributionModal();
    
    const typeText = isPercent ? `${value}% от зарплаты` : `${value.toLocaleString('ru-RU')} ₽`;
    showToast(`✅ Распределение настроено: ${typeText}`);
}

// Добавляем обработчик на изменение суммы
document.addEventListener('DOMContentLoaded', function() {
    const amountInput = document.getElementById('transfer-amount');
    if (amountInput) {
        amountInput.addEventListener('input', updateTransferTotal);
    }
});

// ========================================
// ДОБАВЛЕНИЕ ТРАНЗАКЦИИ В ИСТОРИЮ
// ========================================

/**
 * Добавляет новую транзакцию в историю операций
 * @param {Object} transaction - Данные транзакции
 */
function addTransactionToHistory(transaction) {
    const transactionsList = document.querySelector('.transactions-list');
    if (!transactionsList) return;

    const { recipient, amount, message, category } = transaction;
    const today = new Date();
    const dateStr = today.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
    const cashback = Math.round(amount * 0.01); // 1% кэшбэк

    // Проверяем, есть ли уже заголовок "Сегодня"
    let todayHeader = document.querySelector('.transaction-date-header');
    if (!todayHeader) {
        todayHeader = document.createElement('div');
        todayHeader.className = 'transaction-date-header';
        todayHeader.innerHTML = `<span>Сегодня, ${dateStr}</span>`;
        transactionsList.insertBefore(todayHeader, transactionsList.firstChild);
    }

    // Создаём новую транзакцию
    const newTransaction = document.createElement('div');
    newTransaction.className = 'transaction-item';
    newTransaction.onclick = function() { 
        openTransactionDetail({
            recipient: recipient,
            amount: amount,
            message: message || '',
            category: category,
            cashback: cashback
        });
    };

    // Определяем иконку и цвет в зависимости от категории
    const categoryIcons = {
        transfers: { icon: '💸', class: 'transport-icon' },
        education: { icon: '📚', class: 'food-icon' },
        family: { icon: '👨‍👩‍👧', class: 'food-icon' },
        rent: { icon: '🏠', class: 'utilities-icon' },
        gifts: { icon: '🎁', class: 'shop-icon' },
        charity: { icon: '❤️', class: 'food-icon' },
        services: { icon: '🛠️', class: 'utilities-icon' },
        health: { icon: '🏥', class: 'pharmacy-icon' },
        beauty: { icon: '💅', class: 'shop-icon' },
        sport: { icon: '⚽', class: 'transport-icon' },
        pets: { icon: '🐾', class: 'food-icon' },
        other: { icon: '📦', class: 'transport-icon' }
    };

    const categoryData = categoryIcons[category.id] || categoryIcons.transfers;

    newTransaction.innerHTML = `
        <div class="transaction-icon ${categoryData.class}">
            <span style="font-size: 16px;">${categoryData.icon}</span>
        </div>
        <div class="transaction-details">
            <span class="transaction-merchant">${recipient}</span>
            <span class="transaction-category">${category.name}${message ? ' • ' + message : ''}</span>
        </div>
        <div class="transaction-amount">
            <span class="amount-value">-${amount.toLocaleString('ru-RU')} ₽</span>
        </div>
    `;

    // Вставляем после заголовка даты
    transactionsList.insertBefore(newTransaction, todayHeader.nextSibling);

    // Анимация появления
    newTransaction.style.opacity = '0';
    newTransaction.style.transform = 'translateX(-20px)';
    setTimeout(() => {
        newTransaction.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        newTransaction.style.opacity = '1';
        newTransaction.style.transform = 'translateX(0)';
    }, 10);
}

console.log('%c ОТП Банк Онлайн ', 'background: #C1FF05; color: #000; font-size: 16px; font-weight: bold; padding: 8px 16px; border-radius: 4px;');
console.log('%c Версия приложения: 2.0.0 (Светлая тема) ', 'color: #8C8C8C; font-size: 12px;');
console.log('%c Дизайн основан на реальном приложении ОТП Банка ', 'color: #8C8C8C; font-size: 12px;');
