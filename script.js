document.addEventListener('DOMContentLoaded', function() {
    const fabButton = document.getElementById('fabButton');
    const fabMenu = document.getElementById('fabMenu');
    const chatPanel = document.querySelector('.ai-chat-panel');
    const closeButton = document.querySelector('.close-chat-button');
    const sendButton = document.querySelector('.send-button');
    const textarea = document.querySelector('.chat-input textarea');
    const messagesContainer = document.querySelector('.chat-messages');
    const overlay = document.querySelector('.fab-overlay');
    const body = document.body;
    const resizeHandle = document.querySelector('.chat-panel-resize-handle');
    const mainContainer = document.querySelector('.main-container');

    // ヒントボタンのクリックハンドラ
    fabButton.addEventListener('click', function() {
        fabMenu.classList.toggle('active');
        overlay.classList.toggle('active');
    });

    // メニュー項目のクリックハンドラ
    const menuItems = document.querySelectorAll('.fab-menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            const action = this.dataset.action;
            
            if (action === 'ai') {
                // AIと一緒に進めるを選択した場合
                body.classList.add('chat-panel-open');
                overlay.classList.remove('active'); // オーバーレイは不要
            }
            
            // メニューを閉じる
            fabMenu.classList.remove('active');
        });
    });

    // オーバーレイクリックの処理
    overlay.addEventListener('click', function() {
        // FABメニューを閉じる
        fabMenu.classList.remove('active');
        overlay.classList.remove('active');
    });

    // チャットパネルを閉じる（×ボタン）
    closeButton.addEventListener('click', function() {
        body.classList.remove('chat-panel-open');
    });

    // ESCキーでチャットパネルを閉じる
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && body.classList.contains('chat-panel-open')) {
            body.classList.remove('chat-panel-open');
        }
    });

    // メッセージ送信処理
    function sendMessage() {
        const message = textarea.value.trim();
        if (message) {
            // ユーザーメッセージを追加
            const userMessageHTML = `
                <div class="message user-message">
                    <div class="message-content">${message}</div>
                </div>
            `;
            messagesContainer.insertAdjacentHTML('beforeend', userMessageHTML);
            
            // テキストエリアをクリア
            textarea.value = '';
            
            // 最下部にスクロール
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }

    // 送信ボタンのクリックハンドラ
    sendButton.addEventListener('click', sendMessage);

    // Enterキーでの送信（Shift + Enterで改行）
    textarea.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // ハンバーガーメニューの制御を追加
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-container');

    hamburgerMenu.addEventListener('click', function() {
        sidebar.classList.toggle('active');
        hamburgerMenu.classList.toggle('active');
    });

    // メインコンテンツクリックでメニューを閉じる
    mainContent.addEventListener('click', function() {
        if (sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');
            hamburgerMenu.classList.remove('active');
        }
    });

    // チェックリストモーダルの制御
    const checklistButton = document.getElementById('checklistButton');
    const checklistModal = document.querySelector('.checklist-modal');
    const closeChecklistButton = document.querySelector('.close-checklist-button');

    checklistButton.addEventListener('click', function() {
        checklistModal.classList.add('active');
    });

    closeChecklistButton.addEventListener('click', function() {
        checklistModal.classList.remove('active');
    });

    // モーダル外クリックで閉じる
    checklistModal.addEventListener('click', function(e) {
        if (e.target === checklistModal) {
            checklistModal.classList.remove('active');
        }
    });

    // チャットパネルのリサイズ機能
    if (resizeHandle) {
        let isResizing = false;
        let startX, startWidth;

        resizeHandle.addEventListener('mousedown', function(e) {
            isResizing = true;
            startX = e.clientX;
            startWidth = parseInt(document.defaultView.getComputedStyle(chatPanel).width, 10);
            document.body.classList.add('resizing');
            
            // イベントリスナーを追加
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            e.preventDefault();
        });

        function handleMouseMove(e) {
            if (!isResizing) return;
            
            // マウス移動量から新しい幅を計算
            const width = startWidth - (e.clientX - startX);
            
            // 最小幅と最大幅を設定
            if (width >= 300 && width <= 600) {
                chatPanel.style.width = width + 'px';
                
                // メインコンテナの幅も調整
                if (window.innerWidth > 767) { // モバイル以外の場合のみ
                    mainContainer.style.width = `calc(100% - var(--sidebar-width) - ${width + 60}px)`;
                }
            }
        }

        function handleMouseUp() {
            isResizing = false;
            document.body.classList.remove('resizing');
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        }
    }
}); 