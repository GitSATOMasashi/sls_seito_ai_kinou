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
            
            // 既存の選択肢を非表示にする
            hideAllChoices();
            
            // AIの応答を表示（実際のシステムでは応答生成）
            setTimeout(function() {
                displayAIResponse(message);
            }, 500);
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

    // 選択肢ボタンのクリックイベント
    messagesContainer.addEventListener('click', function(e) {
        if (e.target.classList.contains('choice-button')) {
            const choiceText = e.target.textContent;
            const choicesContainer = e.target.closest('.message-choices');
            
            // ユーザーメッセージとして選択肢を表示
            const userMessageHTML = `
                <div class="message user-message">
                    <div class="message-content">${choiceText}</div>
                </div>
            `;
            messagesContainer.insertAdjacentHTML('beforeend', userMessageHTML);
            
            // 選択肢グループを非表示
            choicesContainer.style.display = 'none';
            
            // 最下部にスクロール
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            
            // AIの応答を表示（実際のシステムでは応答生成）
            setTimeout(function() {
                displayAIResponse(choiceText);
            }, 500);
        }
    });

    // すべての選択肢を非表示にする関数
    function hideAllChoices() {
        const allChoices = document.querySelectorAll('.message-choices');
        allChoices.forEach(choices => {
            choices.style.display = 'none';
        });
    }

    // AIの応答を表示する関数（サンプル）
    function displayAIResponse(userMessage) {
        // ユーザーメッセージに基づいて応答を生成（実際はAIが生成）
        let aiResponse = '';
        let choices = [];
        
        if (userMessage.includes('課題に寄り添う')) {
            aiResponse = '顧客の課題に寄り添うとは、商品やサービスの機能説明ではなく、顧客が抱える本質的な問題を理解し、解決策として提案することです。例えば、「このシステムは多機能です」ではなく、「チームの情報共有の課題を解決し、30%の生産性向上が見込めます」と伝えます。';
            choices = [
                '具体的な事例を教えて', 
                '感情に訴えかける方法は？', 
                'クロージングのコツは？',
                '課題の見つけ方は？',
                '顧客との信頼関係の築き方は？'
            ];
        } else if (userMessage.includes('感情に訴えかける')) {
            aiResponse = '感情に訴えかけるテクニックは、論理的なメリットだけでなく、導入後の感情的な変化や体験を想像させることです。ストーリーテリングやビフォーアフターの対比、共感の言葉を使うことが効果的です。';
            choices = [
                '具体的な言い回しを教えて', 
                '成功事例はありますか？', 
                '他のテクニックはありますか？',
                'ストーリーテリングのコツは？',
                '共感の示し方について詳しく'
            ];
        } else {
            aiResponse = 'クロージングでは、顧客のニーズに合わせた提案と、具体的な次のステップを明確に示すことが重要です。「ぜひ検討してください」ではなく、「来週のミーティングで具体的な導入計画をご提案しますが、水曜日の15時はいかがでしょうか」など、アクションを促す質問が効果的です。';
            choices = [
                '他のクロージング例は？', 
                '断られた場合の対処法は？', 
                'フォローアップの方法は？',
                '価格交渉のテクニックは？',
                '決裁者へのアプローチ方法は？'
            ];
        }
        
        // AIメッセージを追加
        const aiMessageHTML = `
            <div class="message ai-message">
                <div class="message-content">${aiResponse}</div>
                <div class="message-choices">
                    ${choices.map(choice => `<button class="choice-button">${choice}</button>`).join('')}
                </div>
            </div>
        `;
        messagesContainer.insertAdjacentHTML('beforeend', aiMessageHTML);
        
        // 最下部にスクロール
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}); 