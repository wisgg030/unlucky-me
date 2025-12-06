// 初始化我的收藏内容流页面功能
function initFavoritesPage() {
    loadFavorites();
    initInteractions();
}

// 加载用户收藏的内容
function loadFavorites() {
    const container = document.getElementById('feedsContainer');
    container.innerHTML = '';
    
    // 从localStorage获取收藏的feed ID列表
    let favoriteFeedIds = localStorage.getItem('favoriteFeeds');
    favoriteFeedIds = favoriteFeedIds ? JSON.parse(favoriteFeedIds) : [];
    
    // 如果没有收藏内容，显示空状态提示
    if (favoriteFeedIds.length === 0) {
        showEmptyState();
        return;
    }
    
    // 获取所有帖子数据
    let allPosts = localStorage.getItem('posts');
    allPosts = allPosts ? JSON.parse(allPosts) : [];
    
    // 获取收藏的帖子内容
    const favorites = allPosts.filter(post => favoriteFeedIds.includes(post.id.toString()));
    
    // 按照时间倒序排序，最新发布的放在前面
    favorites.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    favorites.forEach(item => {
        const feedItem = createFeedItem(item);
        container.appendChild(feedItem);
    });
}

// 显示空状态提示
function showEmptyState() {
    const container = document.getElementById('feedsContainer');
    const emptyState = document.createElement('div');
    emptyState.className = 'empty-favorites';
    emptyState.textContent = '其实世界没那么坏^ ^';
    container.appendChild(emptyState);
}

// 创建Feed项元素
function createFeedItem(item) {
    const feedItem = document.createElement('div');
    feedItem.className = 'feed-item';
    feedItem.dataset.feedId = item.id;
    
    feedItem.innerHTML = `
        <div class="feed-image-container">
            <img src="${item.image}" alt="Feed Image">
            <div class="feed-interactions">
                <div class="interaction-btn" data-type="pat" data-feed-id="${item.id}">
                    <span class="interaction-text">拍拍</span>
                    <span class="interaction-count">0</span>
                </div>
                <div class="interaction-btn" data-type="like" data-feed-id="${item.id}">
                    <span class="interaction-text">+1</span>
                    <span class="interaction-count">0</span>
                </div>
                <div class="interaction-btn" data-type="favorite" data-feed-id="${item.id}">
                    <img src="assets/icons/star-outline.svg" alt="收藏" style="width: 24px; height: 24px;">
                    <span class="interaction-count">0</span>
                </div>
            </div>
        </div>
        <div class="feed-info">
            <div class="feed-user-id">${item.userId}</div>
            <div class="feed-content">${item.content}</div>
        </div>
    `;
    
    return feedItem;
}

// 初始化交互功能（实现单次交互和取消功能）
function initInteractions() {
    // 从localStorage获取交互数据
    let interactionData = localStorage.getItem('feedInteractions');
    interactionData = interactionData ? JSON.parse(interactionData) : {
        pat: {},
        like: {},
        favorite: {}
    };
    
    // 更新UI
    updateUI();
    
    // 监听交互按钮点击事件
    document.querySelectorAll('.interaction-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const type = this.dataset.type;
            const feedId = this.dataset.feedId;
            
            // 实现单次交互和取消功能
            if (interactionData[type][feedId]) {
                // 如果已经交互过，取消交互
                interactionData[type][feedId] = false;
            } else {
                // 如果没有交互过，进行交互
                interactionData[type][feedId] = true;
            }
            
            // 保存到localStorage
            localStorage.setItem('feedInteractions', JSON.stringify(interactionData));
            
            // 更新UI
            updateUI();
            
            // 如果是取消收藏操作，更新收藏列表并刷新页面
            if (type === 'favorite' && !interactionData[type][feedId]) {
                updateFavoritesList(feedId);
                // 延迟刷新页面，确保收藏列表已更新
                setTimeout(() => {
                    loadFavorites();
                }, 100);
            }
        });
    });
    
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
            Object.values(interactionData[type]).forEach(isActive => {
                if (isActive) {
                    typeCounts[type]++;
                }
            });
        });
        
        // 更新每个按钮的状态和计数
        document.querySelectorAll('.interaction-btn').forEach(btn => {
            const type = btn.dataset.type;
            const feedId = btn.dataset.feedId;
            const isActive = interactionData[type][feedId] || false;
            
            // 更新按钮状态
            if (isActive) {
                btn.classList.add('active');
                // 更新收藏按钮的特殊样式
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
            btn.querySelector('.interaction-count').textContent = typeCounts[type];
        });
    }
    
    // 更新收藏列表
    function updateFavoritesList(feedId) {
        // 从localStorage获取收藏列表
        let favorites = localStorage.getItem('favoriteFeeds');
        favorites = favorites ? JSON.parse(favorites) : [];
        
        // 从收藏列表中移除当前feedId
        favorites = favorites.filter(id => id !== feedId);
        
        // 保存更新后的收藏列表
        localStorage.setItem('favoriteFeeds', JSON.stringify(favorites));
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initFavoritesPage);