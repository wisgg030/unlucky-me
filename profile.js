// 初始化个人主页功能
function initProfilePage() {
    // 获取URL参数中的userId
    const currentUserId = getCurrentUserId();
    
    // 初始化页面内容
    initTabSwitching();
    
    // 只有当前用户是自己时才显示消息按钮
    if (currentUserId === '000001') {
        initMessages();
    } else {
        // 隐藏消息按钮
        const messagesBtn = document.getElementById('messagesBtn');
        if (messagesBtn) {
            messagesBtn.style.display = 'none';
        }
    }
    
    // 初始化返回按钮
    initBackButton();
    
    // 根据用户ID加载不同的内容
    loadUserContent(currentUserId);
}

// 获取当前用户ID（从URL参数或默认）
function getCurrentUserId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('userId') || '000001';
}

// 初始化返回按钮
function initBackButton() {
    const backBtn = document.getElementById('backBtn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            // 返回当前用户自己的主页
            window.location.href = 'profile.html';
        });
    }
}

// 根据用户ID加载内容
function loadUserContent(userId) {
    // 更新用户头像和ID显示
    const userAvatar = document.querySelector('.user-avatar');
    const profileId = document.querySelector('.profile-id');
    const userInfo = document.querySelector('.user-info');
    const backBtn = document.getElementById('backBtn');
    const messagesBtn = document.getElementById('messagesBtn');
    const placeholderDiv = document.getElementById('placeholderDiv');
    const leftPlaceholderDiv = document.getElementById('leftPlaceholderDiv');
    
    if (userAvatar && profileId) {
        profileId.textContent = userId;
        // 所有用户头像都是🍀
        userAvatar.textContent = '🍀';
    }
    
    // 检查是否是查看其他用户的主页
    if (userId !== '000001') {
        // 显示返回按钮
        if (backBtn) {
            backBtn.style.display = 'flex';
        }
        
        // 确保左侧占位符div显示
        if (leftPlaceholderDiv) {
            leftPlaceholderDiv.style.display = 'flex';
        }
        
        // 隐藏我的消息按钮
        if (messagesBtn) {
            messagesBtn.style.display = 'none';
        }
        
        // 确保占位符div仍然显示，保持布局平衡
        if (placeholderDiv) {
            placeholderDiv.style.display = 'flex';
        }
        
        // 隐藏整个功能模块（发布历史和收藏）
        const profileFunctions = document.querySelector('.profile-functions');
        if (profileFunctions) {
            profileFunctions.style.display = 'none';
        }
        
        // 确保显示的是发布历史
        const contentTabs = document.querySelectorAll('.content-tab');
        
        contentTabs.forEach(tab => {
            tab.classList.remove('active');
            tab.style.display = 'none';
        });
        
        const historyContent = document.getElementById('historyContent');
        if (historyContent) {
            historyContent.classList.add('active');
            historyContent.style.display = 'block';
        }
        
        // 模拟其他用户的内容
        if (historyContent) {
            // 清空现有内容
            const grid = historyContent.querySelector('.profile-content-grid');
            if (grid) {
                grid.innerHTML = '';
                
                // 随机决定是否有内容（50%概率）
                const hasContent = Math.random() > 0.5;
                
                if (hasContent) {
                    // 添加模拟内容
                    const contentCount = Math.floor(Math.random() * 6) + 1; // 1-6个内容
                    for (let i = 0; i < contentCount; i++) {
                        const item = document.createElement('div');
                        item.className = 'content-item';
                        item.style.cursor = 'pointer';
                        item.innerHTML = `<img src="assets/images/feed${(i % 4) + 1}.jpg" alt="用户${userId}的发布内容">`;
                        grid.appendChild(item);
                    }
                } else {
                    // 显示没有内容的提示
                    showEmptyState('historyContent', 'ta似乎什么都不想说...');
                }
            }
        }
    } else {
        // 隐藏返回按钮
        if (backBtn) {
            backBtn.style.display = 'none';
        }
        
        // 确保左侧占位符div仍然显示，保持布局平衡
        if (leftPlaceholderDiv) {
            leftPlaceholderDiv.style.display = 'flex';
        }
        
        // 显示我的消息按钮
        if (messagesBtn) {
            messagesBtn.style.display = 'block';
        }
        
        // 对于当前用户，确保占位符div正常显示（包含消息按钮）
        if (placeholderDiv) {
            placeholderDiv.style.display = 'flex';
        }
        
        // 对于当前用户，确保功能模块可见
        const profileFunctions = document.querySelector('.profile-functions');
        if (profileFunctions) {
            profileFunctions.style.display = 'flex';
        }
    }
}

// 初始化标签切换功能
function initTabSwitching() {
    const functionItems = document.querySelectorAll('.function-item');
    const contentTabs = document.querySelectorAll('.content-tab');
    
    functionItems.forEach(item => {
        item.addEventListener('click', function() {
            // 获取当前点击的标签
            const tabId = this.getAttribute('data-tab');
            
            // 移除所有标签的active类
            functionItems.forEach(item => item.classList.remove('active'));
            contentTabs.forEach(tab => tab.classList.remove('active'));
            contentTabs.forEach(tab => tab.style.display = 'none');
            
            // 为当前标签添加active类
            this.classList.add('active');
            
            // 显示对应的内容区域
            const targetTab = document.getElementById(tabId + 'Content');
            if (targetTab) {
                targetTab.classList.add('active');
                targetTab.style.display = 'block';
                
                // 根据标签类型执行不同的初始化逻辑
                switch(tabId) {
                    case 'history':
                        initHistoryTab();
                        break;
                    case 'favorites':
                        initFavoritesTab();
                        break;
                    default:
                        break;
                }
            }
        });
    });
}

// 初始化发布历史标签
function initHistoryTab() {
    console.log('初始化发布历史标签');
    
    // 获取发布历史的网格容器
    const historyGrid = document.querySelector('#historyContent .profile-content-grid');
    if (!historyGrid) {
        console.warn('发布历史网格容器未找到');
        return;
    }
    
    // 从localStorage获取用户发布的内容
    let userPosts = localStorage.getItem('userPosts');
    userPosts = userPosts ? JSON.parse(userPosts) : [];
    
    // 清空现有内容
    historyGrid.innerHTML = '';
    
    // 如果没有发布内容，显示空状态
    if (userPosts.length === 0) {
        showEmptyState('historyContent', '什么都没有，莫非你就是传说中的宇宙幸运王？');
        return;
    }
    
    // 动态生成发布历史内容
    userPosts.forEach(post => {
        const historyItem = createHistoryItem(post);
        historyGrid.appendChild(historyItem);
    });
}

// 创建发布历史项
function createHistoryItem(post) {
    // 创建历史项容器
    const historyItem = document.createElement('div');
    historyItem.className = 'history-item';
    
    // 生成HTML结构
    historyItem.innerHTML = `
        <div class="history-content">
            ${post.content ? `<p>${escapeHtml(post.content)}</p>` : ''}
        </div>
        <div class="history-images">
            ${post.images && post.images.length > 0 ? `
                <img src="${post.images[0]}" alt="发布内容" style="width: 100%; height: auto;">
            ` : ''}
        </div>
        <!-- 自己发布的内容不显示互动按钮 -->
    `;
    
    return historyItem;
}

// 初始化我的收藏标签
function initFavoritesTab() {
    // 在实际应用中，这里应该从服务器获取用户的收藏内容
    // 这里只是模拟数据
    console.log('初始化我的收藏标签');
    
    // 检查是否有收藏内容
    const favoritesGrid = document.querySelector('#favoritesContent .profile-content-grid');
    if (favoritesGrid && favoritesGrid.children.length === 0) {
        // 如果没有收藏内容，显示空状态
        showEmptyState('favoritesContent', '暂无收藏内容');
    }
}

// HTML转义函数
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 显示空状态
function showEmptyState(containerId, message) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // 检查是否已经存在空状态
    if (container.querySelector('.empty-state')) return;
    
    // 创建空状态元素
    const emptyState = document.createElement('div');
    emptyState.className = 'empty-state';
    emptyState.innerHTML = `
        <i class="fas fa-inbox"></i>
        <p>${message}</p>
    `;
    
    // 添加到容器
    container.appendChild(emptyState);
}

// 初始化消息功能
function initMessages() {
    const messagesBtn = document.getElementById('messagesBtn');
    const messagesCard = document.getElementById('messagesCard');
    const closeMessagesBtn = document.getElementById('closeMessagesBtn');
    const interactionsList = document.getElementById('interactionsList');
    
    // 生成模拟的交互消息
    generateMockMessages(interactionsList);
    
    // 显示消息卡片
    messagesBtn.addEventListener('click', function() {
        messagesCard.style.display = 'block';
    });
    
    // 关闭消息卡片
    closeMessagesBtn.addEventListener('click', function() {
        messagesCard.style.display = 'none';
    });
    
    // 点击卡片外部关闭卡片
    window.addEventListener('click', function(event) {
        if (event.target === messagesCard) {
            messagesCard.style.display = 'none';
        }
    });
}

// 生成实际的交互消息
function generateMockMessages(container) {
    // 获取当前用户ID
    const currentUserId = '000001';
    
    // 从localStorage获取用户的交互消息
    let userInteractions = localStorage.getItem(`userInteractions_${currentUserId}`);
    userInteractions = userInteractions ? JSON.parse(userInteractions) : [];
    
    // 清空容器
    container.innerHTML = '';
    
    // 如果没有消息，显示空状态
    if (userInteractions.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #6b7280; padding: 20px;">暂无交互消息</p>';
        return;
    }
    
    // 按时间倒序排序，最新的消息在前面
    userInteractions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // 生成消息列表
    userInteractions.forEach(interaction => {
        const messageItem = document.createElement('div');
        messageItem.className = 'message-item';
        
        // 根据动作类型生成不同的消息格式
        let messageText;
        if (interaction.action === '表示+1') {
            messageText = interaction.action;
        } else {
            messageText = `${interaction.action}我`;
        }
        
        messageItem.innerHTML = `
            <div class="message-content">
                <span class="message-user" data-user-id="${interaction.userId}">${interaction.userId}</span>
                <span class="message-action">${messageText}</span>
            </div>
        `;
        
        container.appendChild(messageItem);
    });
    
    // 为所有用户ID添加点击事件
    const userIds = container.querySelectorAll('.message-user');
    userIds.forEach(userIdElement => {
        userIdElement.addEventListener('click', function() {
            const userId = this.getAttribute('data-user-id');
            // 跳转到其他用户的个人页面（使用URL参数区分不同用户）
            window.location.href = `profile.html?userId=${userId}`;
        });
    });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initProfilePage();
    initBubbles();
});

// 初始化泡泡装饰功能
function initBubbles() {
    console.log('initBubbles called');
    const bubblesContainer = document.getElementById('bubblesContainer');
    if (!bubblesContainer) {
        console.log('bubblesContainer not found');
        return;
    }
    console.log('bubblesContainer found:', bubblesContainer);
    
    // 创建2-3个大泡泡
    for (let i = 0; i < Math.floor(Math.random() * 2) + 2; i++) {
        createBubble(true);
    }
    
    // 创建2-3个小泡泡
    for (let i = 0; i < Math.floor(Math.random() * 2) + 2; i++) {
        createBubble(false);
    }
    
    // 定期创建新泡泡
    setInterval(() => {
        createBubble(Math.random() > 0.7); // 70%概率创建小泡泡，30%概率创建大泡泡
    }, 5000);
}

// 创建单个泡泡
function createBubble(isLarge) {
    console.log('createBubble called with isLarge:', isLarge);
    const bubblesContainer = document.getElementById('bubblesContainer');
    if (!bubblesContainer) {
        console.log('bubblesContainer not found in createBubble');
        return;
    }
    
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    
    // 设置泡泡大小
    const size = isLarge ? Math.random() * 100 + 80 : Math.random() * 50 + 30;
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    
    // 设置泡泡位置
    bubble.style.left = `${Math.random() * 90}%`;
    
    // 设置泡泡颜色（白色或淡黄色）
    const colorType = Math.random() > 0.3 ? 'white' : 'yellow';
    if (colorType === 'white') {
        bubble.style.background = 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.6))';
    } else {
        bubble.style.background = 'radial-gradient(circle at 30% 30%, rgba(255, 255, 220, 0.9), rgba(255, 240, 180, 0.6))';
    }
    
    // 设置泡泡透明度
    bubble.style.opacity = Math.random() * 0.3 + 0.2;
    
    // 设置泡泡动画持续时间（非常缓慢）
    const duration = Math.random() * 20 + 15; // 15-35秒
    bubble.style.animationDuration = `${duration}s`;
    
    // 设置泡泡动画延迟
    bubble.style.animationDelay = `${Math.random() * 5}s`;
    
    // 添加泡泡到容器
    bubblesContainer.appendChild(bubble);
    
    // 随机时间后让泡泡爆破
    const popTime = Math.random() * 15 + 5; // 5-20秒后爆破
    setTimeout(() => {
        if (bubble.parentElement) {
            bubble.classList.add('pop');
            // 爆破动画结束后移除泡泡
            setTimeout(() => {
                if (bubble.parentElement) {
                    bubble.parentElement.removeChild(bubble);
                }
            }, 1000);
        }
    }, popTime * 1000);
    
    // 动画结束后移除泡泡
    bubble.addEventListener('animationend', () => {
        if (bubble.parentElement) {
            bubble.parentElement.removeChild(bubble);
        }
    });
}