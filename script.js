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
    markAllAsRead
};

// ========================================
// КОНСОЛЬНЫЕ СООБЩЕНИЯ
// ========================================

console.log('%c ОТП Банк Онлайн ', 'background: #C1FF05; color: #000; font-size: 16px; font-weight: bold; padding: 8px 16px; border-radius: 4px;');
console.log('%c Версия приложения: 2.0.0 (Светлая тема) ', 'color: #8C8C8C; font-size: 12px;');
console.log('%c Дизайн основан на реальном приложении ОТП Банка ', 'color: #8C8C8C; font-size: 12px;');
