// 初始化Feeds流页面功能
function initHomePage() {
    loadHomeFeeds();
    initSwipeFunctionality();
    initImageZoom();
    initInteractions();
}

// 从localStorage加载首页信息流
function loadHomeFeeds() {
    const container = document.getElementById('feedsContainer');
    
    // 检查容器是否存在
    if (!container) {
        console.warn('Feeds容器未找到');
        return;
    }
    
    // 从localStorage获取所有帖子
    let allPosts = localStorage.getItem('posts');
    allPosts = allPosts ? JSON.parse(allPosts) : [];
    
    // 筛选出所有公开可见的帖子
    const publicPosts = allPosts.filter(post => post.isPublic === true);
    
    // 按时间排序，最新的在前面
    publicPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // 更新homeFeeds为所有公开帖子
    localStorage.setItem('homeFeeds', JSON.stringify(publicPosts));
    
    // 如果没有公开内容，保持默认的HTML内容
    if (publicPosts.length === 0) {
        console.log('没有找到公开的内容，使用默认内容');
        return;
    }
    
    // 清空容器
    container.innerHTML = '';
    
    // 生成动态内容
    publicPosts.forEach(post => {
        const feedItem = createFeedItem(post);
        container.appendChild(feedItem);
    });
    
    // 为新添加的图片初始化放大功能
    initImageZoom();
    
    // 重新初始化交互功能，确保事件监听器附加到新生成的按钮上
    initInteractions();
}

// 创建Feed项
function createFeedItem(post) {
    // 创建Feed容器
    const feedItem = document.createElement('div');
    feedItem.className = 'feed-item';
    feedItem.dataset.feedId = post.id;
    
    // 生成HTML结构
    let html = '';
    
    // 无论是否有图片都显示容器（用于放置交互按钮）
    html += `
        <div class="feed-image-container">
            ${post.images && post.images.length > 0 ? `
                <img src="${post.images[0].src}" alt="Feed Image" class="feed-image">
            ` : ''}
            <div class="feed-interactions">
                <div class="interaction-btn" data-type="pat" data-feed-id="${post.id}">
                    <span class="interaction-text">拍拍</span>
                    <span class="interaction-count">0</span>
                </div>
                <div class="interaction-btn" data-type="like" data-feed-id="${post.id}">
                    <span class="interaction-text">+1</span>
                    <span class="interaction-count">0</span>
                </div>
                <div class="interaction-btn" data-type="favorite" data-feed-id="${post.id}">
                    <img src="assets/icons/star-outline.svg" alt="收藏" style="width: 24px; height: 24px;">
                    <span class="interaction-count">0</span>
                </div>
            </div>
        </div>
        <div class="feed-info">
            <div class="feed-user-id">${post.userId}</div>
            <div class="feed-content">${escapeHtml(post.content)}</div>
        </div>
    `;
    
    feedItem.innerHTML = html;
    
    return feedItem;
}

// HTML转义函数
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 初始化滑动功能
function initSwipeFunctionality() {
    const container = document.getElementById('feedsContainer');
    let startY = 0;
    let endY = 0;
    let currentPage = 0;

    // 触摸开始
    container.addEventListener('touchstart', (e) => {
        startY = e.touches[0].clientY;
    });

    // 触摸结束
    container.addEventListener('touchend', (e) => {
        endY = e.changedTouches[0].clientY;
        handleSwipe();
    });

    // 鼠标事件（用于桌面交互）
    let isMouseDown = false;
    container.addEventListener('mousedown', (e) => {
        isMouseDown = true;
        startY = e.clientY;
    });

    container.addEventListener('mouseup', (e) => {
        if (isMouseDown) {
            endY = e.clientY;
            handleSwipe();
            isMouseDown = false;
        }
    });

    container.addEventListener('mouseleave', () => {
        isMouseDown = false;
    });

    // 处理滑动逻辑
    function handleSwipe() {
        const feedItems = document.querySelectorAll('.feed-item'); // 实时获取
        const totalPages = feedItems.length;
        
        const swipeThreshold = 80; // 增加阈值，更适合桌面
        const swipeDistance = endY - startY;

        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (swipeDistance < 0 && currentPage < totalPages - 1) {
                // 向下滑动，查看下一页
                currentPage++;
            } else if (swipeDistance > 0 && currentPage > 0) {
                // 向上滑动，查看上一页
                currentPage--;
            }
            
            // 滚动到对应页面
            scrollToPage(currentPage);
        }
    }

    // 滚动到指定页面
    function scrollToPage(pageIndex) {
        const feedItems = document.querySelectorAll('.feed-item'); // 实时获取
        const feedItem = feedItems[pageIndex];
        if (feedItem) {
            const scrollPosition = feedItem.offsetTop;
            container.scrollTo({
                top: scrollPosition,
                behavior: 'smooth'
            });
        }
    }

    // 监听滚动事件，更新当前页面
    container.addEventListener('scroll', throttle(() => {
        const feedItems = document.querySelectorAll('.feed-item'); // 实时获取
        const scrollPosition = container.scrollTop + container.clientHeight / 2;
        
        // 找到当前可见的页面
        for (let i = 0; i < feedItems.length; i++) {
            const feedItem = feedItems[i];
            if (scrollPosition >= feedItem.offsetTop && scrollPosition < feedItem.offsetTop + feedItem.offsetHeight) {
                if (i !== currentPage) {
                    currentPage = i;
                    // 可以在这里添加页面切换的额外逻辑
                }
                break;
            }
        }
    }, 100));
}

// 初始化图片点击放大功能
function initImageZoom() {
    const feedImages = document.querySelectorAll('.feed-image');
    
    feedImages.forEach(image => {
        image.addEventListener('click', () => {
            // 切换放大/缩小状态
            if (image.classList.contains('zoomed')) {
                // 缩小图片
                image.classList.remove('zoomed');
                image.style.transform = 'scale(1)';
                image.style.maxHeight = '60vh';
            } else {
                // 放大图片
                image.classList.add('zoomed');
                image.style.transform = 'scale(2)';
                image.style.maxHeight = '100vh';
            }
        });
    });
}

// 初始化互动功能
// 页面加载时初始化交互数据
let interactionData = {
    pat: {},
    like: {},
    favorite: {}
};

// 标记是否已经初始化过事件监听器
let isInteractionsInitialized = false;

// 初始化交互功能
function initInteractions() {
    // 页面加载时从localStorage获取交互数据（只执行一次）
    if (!isInteractionsInitialized) {
        const savedData = localStorage.getItem('feedInteractions');
        if (savedData) {
            interactionData = JSON.parse(savedData);
        }
        isInteractionsInitialized = true;
    }
    
    // 更新UI
    updateUI();
    
    // 为新添加的按钮绑定事件监听器
    document.querySelectorAll('.interaction-btn').forEach(btn => {
        // 检查按钮是否已经绑定过事件
        if (!btn.dataset.eventBound) {
            btn.addEventListener('click', handleButtonClick);
            btn.dataset.eventBound = 'true'; // 标记为已绑定
        }
    });
}

// 处理按钮点击事件
function handleButtonClick(e) {
    e.stopPropagation();
    const btn = this;
    const type = btn.dataset.type;
    const feedId = btn.dataset.feedId;
    
    // 实现单次交互和取消功能
    const feedIdStr = feedId.toString();
    
    if (interactionData[type][feedIdStr]) {
        // 如果已经交互过，取消交互
        interactionData[type][feedIdStr] = false;
    } else {
        // 如果没有交互过，进行交互
        interactionData[type][feedIdStr] = true;
        // 添加缓慢闪烁效果
        btn.classList.add('blink');
        // 动画结束后移除闪烁类
        setTimeout(() => {
            btn.classList.remove('blink');
        }, 800);
        
        // 如果是拍拍或+1操作，记录到其他用户的消息中
        if (type === 'pat' || type === 'like') {
            // 获取当前feed的用户ID
            const feedItem = btn.closest('.feed-item');
            if (feedItem) {
                const userId = feedItem.querySelector('.feed-user-id').textContent;
                // 记录交互
                recordInteraction(userId, type);
            }
        }
    }
    
    // 添加点击缩放动画效果
    btn.style.transform = 'scale(0.9)';
    setTimeout(() => {
        btn.style.transform = 'scale(1)';
    }, 100);
    
    // 添加特殊动画
    const img = btn.querySelector('img');
    const text = btn.querySelector('.interaction-text');
    const animatedElement = img || text;
    
    if (animatedElement) {
        // 使用CSS动画效果
        animatedElement.style.transform = 'scale(1.2)';
        setTimeout(() => {
            animatedElement.style.transform = 'scale(1)';
        }, 300);
    }
    
    // 保存到localStorage
    localStorage.setItem('feedInteractions', JSON.stringify(interactionData));
    
    // 更新UI
    updateUI();
    
    // 特殊处理收藏功能
    if (type === 'favorite') {
        updateFavorites(feedId, interactionData[type][feedIdStr]);
    }
}

// 更新UI
function updateUI() {
    // 统计每个类型的总交互次数
    const typeCounts = {
        pat: 0,
        like: 0,
        favorite: 0
    };
    
    // 统计各类型的总交互次数
    Object.keys(interactionData).forEach(type => {
        typeCounts[type] = Object.values(interactionData[type]).filter(Boolean).length;
    });
    
    // 更新每个按钮的状态和计数
    document.querySelectorAll('.interaction-btn').forEach(btn => {
        const type = btn.dataset.type;
        const feedId = btn.dataset.feedId;
        const feedIdStr = feedId.toString();
        const isActive = interactionData[type][feedIdStr] || false;
        
        // 更新按钮状态
        if (isActive) {
            btn.classList.add('active');
            if (type === 'favorite') {
                btn.classList.add('favorited');
            }
        } else {
            btn.classList.remove('active');
            if (type === 'favorite') {
                btn.classList.remove('favorited');
            }
        }
        
        // 更新按钮上的计数为该类型的总次数
        const countElement = btn.querySelector('.interaction-count');
        if (countElement) {
            countElement.textContent = typeCounts[type];
        }
    });
}

// 更新收藏列表
function updateFavorites(feedId, isFavorited) {
    // 从localStorage获取收藏列表
    let favorites = localStorage.getItem('favoriteFeeds');
    favorites = favorites ? JSON.parse(favorites) : [];
    
    if (isFavorited) {
        // 添加到收藏列表（去重）
        if (!favorites.includes(feedId)) {
            favorites.push(feedId);
        }
    } else {
        // 从收藏列表中移除
        favorites = favorites.filter(id => id !== feedId);
    }
    
    localStorage.setItem('favoriteFeeds', JSON.stringify(favorites));
}

// 记录交互到其他用户的消息中
function recordInteraction(userId, type) {
    // 获取当前用户ID（假设当前用户是000001）
    const currentUserId = '000001';
    
    // 从localStorage获取用户的交互消息
    let userInteractions = localStorage.getItem(`userInteractions_${userId}`);
    userInteractions = userInteractions ? JSON.parse(userInteractions) : [];
    
    // 创建新的交互记录
    const interaction = {
        userId: currentUserId,
        action: type === 'pat' ? '拍了拍' : '表示+1',
        type: type,
        createdAt: new Date().toISOString()
    };
    
    // 添加到用户的交互消息列表
    userInteractions.push(interaction);
    
    // 保存到localStorage
    localStorage.setItem(`userInteractions_${userId}`, JSON.stringify(userInteractions));
}

// 简单的节流函数实现
function throttle(func, delay = 100) {
    let lastCall = 0;
    return function(...args) {
        const now = Date.now();
        if (now - lastCall < delay) {
            return;
        }
        lastCall = now;
        return func.apply(this, args);
    };
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initHomePage);