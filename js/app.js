/**
 * Cute Princess Diary & Reward System - Main Logic
 * State management, LocalStorage, 10-Level Treasure Chest Roadmap, Web Audio integration, PIN protection,
 * Flip Book Diary (Mon-Sun), Dashboard History Log, Parent Approval & Avatar Customization.
 */

const LEVEL_MAP = [
    { level: 1, title: "Công chúa Tập Sự 🐣", reqXP: 0, chestImg: "images/chest_level_1.png", chestName: "Rương Vịt Vỏ Trứng" },
    { level: 2, title: "Công chúa Dũng Cảm 🦖", reqXP: 100, chestImg: "images/chest_level_2.png", chestName: "Rương Vịt Khủng Long" },
    { level: 3, title: "Công chúa Khám Phá 🤠", reqXP: 250, chestImg: "images/chest_level_3.png", chestName: "Rương Vịt Thám Hiểm" },
    { level: 4, title: "Công chúa Thủy Thủ ⚓", reqXP: 500, chestImg: "images/chest_level_4.png", chestName: "Rương Vịt Thủy Thủ" },
    { level: 5, title: "Công chúa Bay Cao 🥽", reqXP: 800, chestImg: "images/chest_level_5.png", chestName: "Rương Vịt Phi Công" },
    { level: 6, title: "Công chúa Ngọt Ngào 🍓", reqXP: 1200, chestImg: "images/chest_level_6.png", chestName: "Rương Vịt Dâu Tây" },
    { level: 7, title: "Công chúa Điệu Đà 🌸", reqXP: 1700, chestImg: "images/chest_level_7.png", chestName: "Rương Vịt Nơ Tím" },
    { level: 8, title: "Công chúa Sành Điệu 😎", reqXP: 2300, chestImg: "images/chest_level_8.png", chestName: "Rương Vịt Rocker Ngầu" },
    { level: 9, title: "Nữ Hoàng Tương Lai 🎀", reqXP: 3000, chestImg: "images/chest_level_9.png", chestName: "Rương Vịt Nơ Hồng" },
    { level: 10, title: "Nữ Hoàng Chăm Ngoan Cả Năm 👑💎", reqXP: 4000, chestImg: "images/chest_level_10.png", chestName: "Rương Vịt Vương Miện Vàng" }
];

const DAY_CODES = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

const DAY_TITLES = {
    mon: '📖 Nhật Ký Vịt Con: Thứ 2 🐥',
    tue: '📖 Nhật Ký Vịt Con: Thứ 3 🐣',
    wed: '📖 Nhật Ký Vịt Con: Thứ 4 🌼',
    thu: '📖 Nhật Ký Vịt Con: Thứ 5 🍀',
    fri: '📖 Nhật Ký Vịt Con: Thứ 6 🎀',
    sat: '📖 Nhật Ký Vịt Con: Thứ 7 ⭐',
    sun: '📖 Nhật Ký Vịt Con: Chủ Nhật 👑'
};

// Default State & Pre-seeded Sample Data
const DEFAULT_STATE = {
    princessName: "Công Chúa Vịt Con 🐥✨",
    avatar: "images/chest_level_1.png",
    level: 1,
    xp: 0,
    stars: 50,
    parentPin: "1234",
    weekendGift: "Được đi xem phim & Ăn 1 ly kem Vịt Con siêu to tùy thích! 🍦🎬",
    weeklyTarget: 80,
    isPreviewWeekend: false,
    claimedLevelChests: [],
    history: [],
    levelRewards: {
        1: "🐣 Rương Vịt Vỏ Trứng: Thưởng +10 ⭐ Thăng Cấp Tập Sự",
        2: "🦖 Rương Vịt Khủng Long: Thưởng +15 ⭐ & 1 Bộ Sticker Vịt",
        3: "🤠 Rương Vịt Thám Hiểm: Thưởng +20 ⭐ Thám Hiểm",
        4: "⚓ Rương Vịt Thủy Thủ: Thưởng +30 ⭐ Thủy Thủ",
        5: "🥽 Rương Vịt Phi Công: Thưởng +50 ⭐ Bay Cao",
        6: "🍓 Rương Vịt Dâu Tây: 1 Ly Kem Dâu Vịt Con Siêu Ngon 🍦",
        7: "🌸 Rương Vịt Nơ Tím: 1 Buổi dã ngoại / Đi chơi công viên 🧺",
        8: "😎 Rương Vịt Rocker Ngầu: Thưởng +100 ⭐ Sành Điệu",
        9: "🎀 Rương Vịt Nơ Hồng: 1 Món đồ chơi mơ ước do bé chọn 🎁",
        10: "👑 PHẦN THƯỞNG NĂM ĐẶC BIỆT: Chuyến du lịch gia đình mơ ước & Món quà năm lớn! 🏖️🎁"
    },
    dailyTasks: [
        { id: 'd1', title: 'Học bài & làm bài tập (25 phút)', icon: '📚', stars: 5, status: 'pending', day: 'all', timer: 25 * 60, timerLeft: 25 * 60, timerActive: false },
        { id: 'd2', title: 'Đọc 5 trang sách truyện', icon: '📖', stars: 5, status: 'pending', day: 'all', timer: 15 * 60, timerLeft: 15 * 60, timerActive: false },
        { id: 'd3', title: 'Dọn dẹp gọn gàng góc học tập', icon: '🧹', stars: 5, status: 'pending', day: 'all' },
        { id: 'd4', title: 'Tập thể dục buổi sáng 10 phút', icon: '🏃‍♀️', stars: 5, status: 'pending', day: 'all' },
        { id: 'd5', title: 'Rửa mặt, đánh răng đúng giờ', icon: '🪥', stars: 5, status: 'pending', day: 'all' }
    ],
    challenges: [
        { id: 'c1', title: 'Đọc xong 2 cuốn sách hay', cycle: 'weekly', stars: 15, status: 'pending' },
        { id: 'c2', title: 'Giúp mẹ lau bàn ăn 5 lần', cycle: 'weekly', stars: 15, status: 'pending' },
        { id: 'c3', title: 'Không xem iPad quá 30 phút/ngày', cycle: 'weekly', stars: 20, status: 'pending' },
        { id: 'c4', title: 'Đạt điểm tốt bài kiểm tra trường', cycle: 'monthly', stars: 50, status: 'pending' },
        { id: 'c5', title: 'Đọc hết 1 cuốn truyện dài', cycle: 'monthly', stars: 50, status: 'pending' },
        { id: 'c6', title: 'Tự thức dậy đúng giờ 20 ngày', cycle: 'monthly', stars: 60, status: 'pending' },
        { id: 'c7', title: 'Học thuộc 5 bài hát tiếng Anh', cycle: 'quarterly', stars: 150, status: 'pending' },
        { id: 'c8', title: 'Học xong 1 kỹ năng mới (bơi/đàn)', cycle: 'quarterly', stars: 200, status: 'pending' }
    ],
    shopItems: [
        { id: 's1', title: '30 phút xem iPad / TV', icon: '📱', cost: 20 },
        { id: 's2', title: '1 Ly Kem Cuối Tuần 🍦', icon: '🍦', cost: 30 },
        { id: 's3', title: '1 Bộ Sticker Công Chúa 👑', icon: '✨', cost: 50 },
        { id: 's4', title: 'Món đồ chơi mơ ước 🧸', icon: '🧸', cost: 150 }
    ],
    wishes: [
        {
            id: 'w_sample1',
            childName: "Công Chúa Vịt Con 🐥✨",
            content: "Con ước được đi công viên Đầm Sen cùng Ba Mẹ vào cuối tuần này! 🎡💖",
            emoji: "🥰",
            createdAt: "17/09/2026 09:00",
            status: "gifted",
            parentResponse: "Ba Mẹ đã lên kế hoạch đưa con đi chơi Đầm Sen vào Chủ Nhật này nhé! ❤️",
            giftType: "trip",
            giftTitle: "Chuyến đi công viên Đầm Sen vào Chủ Nhật này 🎡💖",
            isSecret: false,
            giftedAt: "17/09/2026 09:15"
        }
    ],
    penaltyRules: [
        { id: 'p1', title: 'Xem iPad / TV quá 30 phút quy định', icon: '📱', stars: 10 },
        { id: 'p2', title: 'Chưa làm xong bài tập về nhà', icon: '📚', stars: 10 },
        { id: 'p3', title: 'Bày đồ chơi chưa dọn dẹp gọn gàng', icon: '🧹', stars: 5 },
        { id: 'p4', title: 'Không nghe lời / Cãi lời Ba Mẹ', icon: '🗣️', stars: 15 },
        { id: 'p5', title: 'Tự ý đi chơi / Lười ăn cơm / Đi ngủ muộn', icon: '🥣', stars: 10 }
    ]
};

class PrincessApp {
    constructor() {
        window.app = this;
        window.sounds = sounds;
        this.state = this.loadState();
        this.enteredPin = "";
        this.activeCycleTab = "weekly";
        this.currentBookDay = this.getTodayCode();
        this.currentWeekOffset = 0;
        this.timerIntervals = {};
        
        this.initDOM();
        this.bindEvents();
        this.renderAll();
        this.initIconPickers();
        this.initDayPickerEvents();
        this.initCloudSync();
    }

    getTodayCode() {
        const jsDay = new Date().getDay();
        // JS: 0 = Sun, 1 = Mon ... 6 = Sat
        const map = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
        return map[jsDay];
    }

    getWeekDate(dayCode, weekOffset = this.currentWeekOffset) {
        const now = new Date();
        const jsDay = now.getDay(); // 0 = Sun, 1 = Mon ... 6 = Sat
        const currMonOffset = jsDay === 0 ? 6 : jsDay - 1;
        
        const monday = new Date(now);
        monday.setDate(now.getDate() - currMonOffset + (weekOffset * 7));

        const targetIdx = DAY_CODES.indexOf(dayCode);
        const targetDate = new Date(monday);
        targetDate.setDate(monday.getDate() + (targetIdx >= 0 ? targetIdx : 0));
        return targetDate;
    }

    formatDateStr(date) {
        const d = String(date.getDate()).padStart(2, '0');
        const m = String(date.getMonth() + 1).padStart(2, '0');
        return `${d}/${m}`;
    }

    formatFullDateStr(date) {
        const d = String(date.getDate()).padStart(2, '0');
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const y = date.getFullYear();
        return `${d}/${m}/${y}`;
    }

    formatShortYearDateStr(date) {
        const d = String(date.getDate()).padStart(2, '0');
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const y = String(date.getFullYear()).slice(-2);
        return `${d}/${m}/${y}`;
    }

    getTaskDays(task) {
        if (!task) return DAY_CODES;
        if (Array.isArray(task.days) && task.days.length > 0) {
            if (task.days.includes('all')) return DAY_CODES;
            return task.days;
        }
        if (task.day === 'all' || !task.day) return DAY_CODES;
        return [task.day];
    }

    isTaskForDay(task, dayCode) {
        const days = this.getTaskDays(task);
        return days.includes(dayCode);
    }

    formatTaskDaysLabel(task) {
        const days = this.getTaskDays(task);
        if (days.length === 7) return 'Tất cả các ngày trong tuần';
        const dayNames = { mon: 'Thứ 2', tue: 'Thứ 3', wed: 'Thứ 4', thu: 'Thứ 5', fri: 'Thứ 6', sat: 'Thứ 7', sun: 'Chủ Nhật' };
        
        const isWeekdays = days.length === 5 && ['mon','tue','wed','thu','fri'].every(d => days.includes(d));
        if (isWeekdays) return 'Thứ 2 ➔ Thứ 6 (Ngày đi học)';
        
        const isWeekend = days.length === 2 && days.includes('sat') && days.includes('sun');
        if (isWeekend) return 'Thứ 7 & Chủ Nhật (Cuối tuần)';
        
        return days.map(d => dayNames[d] || d).join(', ');
    }

    getTaskStatusKey(dayCode, weekOffset = this.currentWeekOffset) {
        if (weekOffset === 0) return dayCode;
        const dateObj = this.getWeekDate(dayCode, weekOffset);
        const dStr = this.formatFullDateStr(dateObj).replace(/\//g, '_');
        return `date_${dStr}`;
    }

    getTaskStatus(task, dayCode, weekOffset = this.currentWeekOffset) {
        if (!task) return 'pending';
        if (!task.dayStatuses) {
            task.dayStatuses = {
                mon: 'pending', tue: 'pending', wed: 'pending',
                thu: 'pending', fri: 'pending', sat: 'pending', sun: 'pending'
            };
        }
        const targetDay = dayCode || this.currentBookDay || this.getTodayCode();
        const key = this.getTaskStatusKey(targetDay, weekOffset);
        return task.dayStatuses[key] || 'pending';
    }

    setTaskStatus(task, dayCode, newStatus, weekOffset = this.currentWeekOffset) {
        if (!task) return;
        if (!task.dayStatuses) {
            task.dayStatuses = {
                mon: 'pending', tue: 'pending', wed: 'pending',
                thu: 'pending', fri: 'pending', sat: 'pending', sun: 'pending'
            };
        }
        const targetDay = dayCode || this.currentBookDay || this.getTodayCode();
        const key = this.getTaskStatusKey(targetDay, weekOffset);
        task.dayStatuses[key] = newStatus;
        if (weekOffset === 0 && targetDay === this.getTodayCode()) {
            task.status = newStatus;
        }
    }

    loadState() {
        try {
            const saved = localStorage.getItem('cute_princess_app_state');
            if (saved) {
                const parsed = JSON.parse(saved);
                const loaded = { ...DEFAULT_STATE, ...parsed };

                // Backward migrations
                const todayCode = this.getTodayCode();
                loaded.dailyTasks.forEach(t => {
                    if (!t.day) t.day = 'all';
                    if (!t.dayStatuses) {
                        t.dayStatuses = {
                            mon: 'pending', tue: 'pending', wed: 'pending',
                            thu: 'pending', fri: 'pending', sat: 'pending', sun: 'pending'
                        };
                        if (t.status && t.status !== 'pending') {
                            const activeDay = t.day === 'all' ? todayCode : t.day;
                            t.dayStatuses[activeDay] = t.status;
                        }
                    }
                });
                loaded.challenges.forEach(c => {
                    if (!c.status) c.status = c.completed ? 'completed' : 'pending';
                });
                if (!loaded.avatar || loaded.avatar === '🐥' || loaded.avatar === '👸') loaded.avatar = DEFAULT_STATE.avatar;
                if (!loaded.claimedLevelChests) loaded.claimedLevelChests = [];
                if (!loaded.history) loaded.history = [];
                if (!loaded.wishes) loaded.wishes = JSON.parse(JSON.stringify(DEFAULT_STATE.wishes));
                if (!loaded.levelRewards) {
                    loaded.levelRewards = { ...DEFAULT_STATE.levelRewards };
                } else {
                    loaded.levelRewards = { ...DEFAULT_STATE.levelRewards, ...loaded.levelRewards };
                }
                return loaded;
            }
        } catch (e) {
            console.error("Failed to load local state:", e);
        }
        return JSON.parse(JSON.stringify(DEFAULT_STATE));
    }

    saveState() {
        try {
            this.state.updatedAt = Date.now();
            localStorage.setItem('cute_princess_app_state', JSON.stringify(this.state));
            if (this.syncChannel) {
                this.syncChannel.postMessage({ type: 'SYNC_UPDATE', updatedAt: this.state.updatedAt });
            }
            this.pushStateToCloud();
        } catch (e) {
            console.error("Failed to save state:", e);
        }
    }

    initDOM() {
        this.dom = {
            princessName: document.getElementById('princess-name'),
            avatarWrapper: document.getElementById('avatar-wrapper'),
            avatarImgContainer: document.getElementById('avatar-img-container'),
            levelTitle: document.getElementById('princess-level-title'),
            xpBarFill: document.getElementById('xp-bar-fill'),
            xpText: document.getElementById('xp-text'),
            starCount: document.getElementById('star-count'),
            starsPill: document.getElementById('stars-pill'),
            btnParentOpen: document.getElementById('btn-parent-open'),
            pendingCountBadge: document.getElementById('pending-count-badge'),
            adminPendingBadge: document.getElementById('admin-pending-badge'),
            
            navTabs: document.querySelectorAll('.nav-tab'),
            tabContents: document.querySelectorAll('.tab-content'),
            
            // Flip Book Diary Elements
            dayBookmarks: document.querySelectorAll('.day-bookmark'),
            diaryPageBody: document.getElementById('diary-page-body'),
            diaryPageDayTitle: document.getElementById('diary-page-day-title'),
            dailyHabitList: document.getElementById('daily-habit-list'),
            btnResetDayTasks: document.getElementById('btn-reset-day-tasks'),
            btnPrevPage: document.getElementById('btn-prev-page'),
            btnNextPage: document.getElementById('btn-next-page'),
            btnPrevWeek: document.getElementById('btn-prev-week'),
            btnNextWeek: document.getElementById('btn-next-week'),
            btnPickPastDate: document.getElementById('btn-pick-past-date'),
            btnPickFutureDate: document.getElementById('btn-pick-future-date'),
            btnResetTodayWeek: document.getElementById('btn-reset-today-week'),
            btnTodayJump: document.getElementById('btn-today-jump'),
            weekRangeText: document.getElementById('week-range-text'),
            inputTimeTravelDate: document.getElementById('input-time-travel-date'),
            btnTriggerDatePicker: document.getElementById('btn-trigger-date-picker'),
            
            // Challenges & Level Chests
            challengeTabs: document.querySelectorAll('.sub-tab'),
            challengeGrid: document.getElementById('challenge-grid'),
            levelChestGrid: document.getElementById('level-chest-grid'),
            
            // Dashboard Elements
            dashApprovedCount: document.getElementById('dash-approved-count'),
            dashStarsCount: document.getElementById('dash-stars-count'),
            dashXpCount: document.getElementById('dash-xp-count'),
            dashLevelNum: document.getElementById('dash-level-num'),
            dashLevelTitle: document.getElementById('dash-level-title'),
            weeklyMatrixGrid: document.getElementById('weekly-matrix-grid'),
            historyTimeline: document.getElementById('history-timeline'),
            
            shopGrid: document.getElementById('shop-grid'),
            
            weeklyProgressFill: document.getElementById('weekly-progress-fill'),
            weeklyProgressText: document.getElementById('weekly-progress-text'),
            chestWrapper: document.getElementById('chest-wrapper'),
            chestIcon: document.getElementById('chest-icon'),
            btnOpenChest: document.getElementById('btn-open-chest'),
            weekendStatusTag: document.getElementById('weekend-status-tag'),
            btnToggleWeekendTest: document.getElementById('btn-toggle-weekend-test'),
            
            // Modals
            modalPin: document.getElementById('modal-pin'),
            modalAdmin: document.getElementById('modal-admin'),
            modalChestReveal: document.getElementById('modal-chest-reveal'),
            modalRewardCoupon: document.getElementById('modal-reward-coupon'),
            modalAvatar: document.getElementById('modal-avatar'),
            chestRevealSubtitle: document.getElementById('chest-reveal-subtitle'),
            chestRevealHeaderTitle: document.getElementById('chest-reveal-header-title'),
            chestSecretGiftText: document.getElementById('chest-secret-gift-text'),
            couponIcon: document.getElementById('coupon-icon'),
            couponTitle: document.getElementById('coupon-title'),
            
            avatarPresetCards: document.querySelectorAll('.avatar-preset-card'),
            inputAvatarFile: document.getElementById('input-avatar-file'),
            
            pinDots: document.querySelectorAll('.pin-dot'),
            keyBtns: document.querySelectorAll('.key-btn'),
            
            // Admin forms & lists
            adminTabs: document.querySelectorAll('.admin-tab'),
            adminTabContents: document.querySelectorAll('.admin-tab-content'),
            adminApprovalsList: document.getElementById('admin-approvals-list'),
            adminLevelRewardsInputs: document.getElementById('admin-level-rewards-inputs'),
            formUpdateLevelRewards: document.getElementById('form-update-level-rewards'),
            btnApproveAll: document.getElementById('btn-approve-all'),
            formAddDaily: document.getElementById('form-add-daily'),
            formAddChallenge: document.getElementById('form-add-challenge'),
            formAddShop: document.getElementById('form-add-shop'),
            formUpdateSettings: document.getElementById('form-update-settings'),
            adminDailyList: document.getElementById('admin-daily-list'),
            adminChallengeList: document.getElementById('admin-challenge-list'),
            adminShopList: document.getElementById('admin-shop-list'),
            btnResetDemo: document.getElementById('btn-reset-demo'),
            btnAddStarsTest: document.getElementById('btn-add-stars-test'),

            // Wish Chest Elements
            btnTopOpenWish: document.getElementById('btn-top-open-wish'),
            btnHeaderOpenWish: document.getElementById('btn-header-open-wish'),
            headerWishBadge: document.getElementById('header-wish-badge'),
            btnStartOpenChestAnim: document.getElementById('btn-start-open-chest-anim'),
            btnTriggerOpenWish: document.getElementById('btn-trigger-open-wish'),
            btnTriggerViewWishes: document.getElementById('btn-trigger-view-wishes'),
            modalWishBox: document.getElementById('modal-wish-box'),
            modalWishJourney: document.getElementById('modal-wish-journey'),
            modalParentDispatchGift: document.getElementById('modal-parent-dispatch-gift'),
            wishOpeningStage: document.getElementById('wish-opening-stage'),
            wishFormStage: document.getElementById('wish-form-stage'),
            wishSuccessStage: document.getElementById('wish-success-stage'),
            formSubmitWish: document.getElementById('form-submit-wish'),
            inputWishContent: document.getElementById('input-wish-content'),
            wishCharCount: document.getElementById('wish-char-count'),
            adminWishesBadge: document.getElementById('admin-wishes-badge'),
            navWishBadge: document.getElementById('nav-wish-badge'),
            adminWishesList: document.getElementById('admin-wishes-list'),
            formDispatchGift: document.getElementById('form-dispatch-gift'),

            // Penalty System Elements
            formApplyPenalty: document.getElementById('form-apply-penalty'),
            inputPenaltyReason: document.getElementById('input-penalty-reason'),
            inputPenaltyStars: document.getElementById('input-penalty-stars'),
            formAddPenaltyRule: document.getElementById('form-add-penalty-rule'),
            adminPenaltyRulesList: document.getElementById('admin-penalty-rules-list'),

            // Task Timer Elements
            modalTaskTimer: document.getElementById('modal-task-timer'),
            btnTimerTogglePlay: document.getElementById('btn-timer-toggle-play'),
            btnTimerReset: document.getElementById('btn-timer-reset'),
            btnTimerStopSave: document.getElementById('btn-timer-stop-save')
        };
    }

    bindEvents() {
        // Task Timer Event Listeners
        if (this.dom.btnTimerTogglePlay) {
            this.dom.btnTimerTogglePlay.addEventListener('click', () => {
                this.toggleTaskTimerPlay();
            });
        }

        if (this.dom.btnTimerReset) {
            this.dom.btnTimerReset.addEventListener('click', () => {
                this.resetTaskTimer();
            });
        }

        if (this.dom.btnTimerStopSave) {
            this.dom.btnTimerStopSave.addEventListener('click', () => {
                this.stopAndSaveTaskTimer();
            });
        }
        // Wish Chest Event Bindings & Event Delegation
        document.addEventListener('click', (e) => {
            const wishTrigger = e.target.closest('#btn-header-open-wish, #btn-trigger-open-wish, .btn-small-wish-chest, .btn-open-wish-chest, .wish-chest-banner-img, [data-action="open-wish"]');
            if (wishTrigger) {
                e.preventDefault();
                this.startWishChestOpeningSequence();
            }
        });

        if (this.dom.btnStartOpenChestAnim) {
            this.dom.btnStartOpenChestAnim.addEventListener('click', () => {
                this.triggerChestOpenAnim();
            });
        }

        if (this.dom.btnTriggerViewWishes) {
            this.dom.btnTriggerViewWishes.addEventListener('click', () => {
                this.openWishJourneyModal();
            });
        }

        const wishEmojiBtns = document.querySelectorAll('.btn-wish-emoji');
        wishEmojiBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                sounds.playPop();
                const emoji = btn.getAttribute('data-emoji');
                if (this.dom.inputWishContent && emoji) {
                    this.dom.inputWishContent.value += ' ' + emoji;
                    if (this.dom.wishCharCount) {
                        this.dom.wishCharCount.innerText = this.dom.inputWishContent.value.length;
                    }
                    this.dom.inputWishContent.focus();
                }
            });
        });

        if (this.dom.inputWishContent) {
            this.dom.inputWishContent.addEventListener('input', () => {
                if (this.dom.wishCharCount) {
                    this.dom.wishCharCount.innerText = this.dom.inputWishContent.value.length;
                }
            });
        }

        if (this.dom.formSubmitWish) {
            this.dom.formSubmitWish.addEventListener('submit', (e) => {
                this.submitChildWish(e);
            });
        }

        if (this.dom.formDispatchGift) {
            this.dom.formDispatchGift.addEventListener('submit', (e) => {
                this.submitParentDispatchGift(e);
            });
        }
        // Duck Mascot Interactive Quack Handler
        const mascotContainer = document.getElementById('duck-mascot-container');
        if (mascotContainer) {
            mascotContainer.addEventListener('click', () => {
                this.triggerDuckQuack();
            });
        }

        // Avatar Click Handler
        this.dom.avatarWrapper.addEventListener('click', () => {
            sounds.playPop();
            this.openAvatarModal();
        });

        // Preset Avatar selection
        this.dom.avatarPresetCards.forEach(card => {
            card.addEventListener('click', () => {
                const icon = card.getAttribute('data-avatar');
                if (icon) {
                    this.state.avatar = icon;
                    this.saveState();
                    this.renderHeader();
                    this.closeModal(this.dom.modalAvatar);
                    sounds.playSparkle();
                }
            });
        });

        // Custom Avatar File Upload
        this.dom.inputAvatarFile.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    this.state.avatar = event.target.result;
                    this.saveState();
                    this.renderHeader();
                    this.closeModal(this.dom.modalAvatar);
                    sounds.playSparkle();
                };
                reader.readAsDataURL(file);
            }
        });

        // Flip Book Day Bookmark Tabs Click
        this.dom.dayBookmarks.forEach(tab => {
            tab.addEventListener('click', () => {
                sounds.playPop();
                const day = tab.getAttribute('data-day');
                this.flipToBookDay(day);
            });
        });

        if (this.dom.btnResetDayTasks) {
            this.dom.btnResetDayTasks.addEventListener('click', () => {
                sounds.playPop();
                this.resetCurrentDayTasks();
            });
        }

        if (this.dom.btnPrevWeek) {
            this.dom.btnPrevWeek.addEventListener('click', () => {
                sounds.playPop();
                this.changeWeekOffset(-1);
            });
        }

        if (this.dom.btnNextWeek) {
            this.dom.btnNextWeek.addEventListener('click', () => {
                sounds.playPop();
                this.changeWeekOffset(1);
            });
        }

        if (this.dom.btnPickPastDate) {
            this.dom.btnPickPastDate.addEventListener('click', () => {
                sounds.playPop();
                this.openDateTravelModal('past');
            });
        }

        if (this.dom.btnPickFutureDate) {
            this.dom.btnPickFutureDate.addEventListener('click', () => {
                sounds.playPop();
                this.openDateTravelModal('future');
            });
        }

        if (this.dom.btnResetTodayWeek) {
            this.dom.btnResetTodayWeek.addEventListener('click', () => {
                sounds.playSparkle();
                this.currentWeekOffset = 0;
                this.flipToBookDay(this.getTodayCode());
            });
        }

        if (this.dom.btnTodayJump) {
            this.dom.btnTodayJump.addEventListener('click', () => {
                sounds.playSparkle();
                this.currentWeekOffset = 0;
                this.flipToBookDay(this.getTodayCode());
            });
        }

        if (this.dom.btnTriggerDatePicker) {
            this.dom.btnTriggerDatePicker.addEventListener('click', (e) => {
                sounds.playPop();
                this.openDateTravelModal('any');
            });
        }

        if (this.dom.inputTimeTravelDate) {
            this.dom.inputTimeTravelDate.addEventListener('change', (e) => {
                const val = e.target.value;
                if (val) {
                    const parts = val.split('-');
                    if (parts.length === 3) {
                        const dateObj = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
                        sounds.playSparkle();
                        this.jumpToSpecificDate(dateObj);
                    }
                }
            });
        }

        this.dom.btnPrevPage.addEventListener('click', () => {
            sounds.playPop();
            const idx = DAY_CODES.indexOf(this.currentBookDay);
            if (idx === 0) {
                this.currentWeekOffset--;
                this.flipToBookDay('sun');
            } else {
                this.flipToBookDay(DAY_CODES[idx - 1]);
            }
        });

        this.dom.btnNextPage.addEventListener('click', () => {
            sounds.playPop();
            const idx = DAY_CODES.indexOf(this.currentBookDay);
            if (idx === 6) {
                this.currentWeekOffset++;
                this.flipToBookDay('mon');
            } else {
                this.flipToBookDay(DAY_CODES[idx + 1]);
            }
        });

        // Main Navigation
        this.dom.navTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                sounds.playPop();
                const targetTab = tab.getAttribute('data-tab');
                this.switchTab(targetTab);
            });
        });

        // Header Level Title shortcut to Level Roadmap
        this.dom.levelTitle.addEventListener('click', () => {
            sounds.playPop();
            this.switchTab('tab-levels');
        });

        // Challenge Sub-Tabs
        this.dom.challengeTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                sounds.playPop();
                this.dom.challengeTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.activeCycleTab = tab.getAttribute('data-cycle');
                this.renderChallenges();
            });
        });

        // Weekend Test Mode Toggle
        this.dom.btnToggleWeekendTest.addEventListener('click', () => {
            sounds.playPop();
            this.state.isPreviewWeekend = !this.state.isPreviewWeekend;
            this.saveState();
            this.renderWeekendChest();
        });

        // Open Weekend Chest
        this.dom.btnOpenChest.addEventListener('click', (e) => {
            if (this.dom.btnOpenChest.disabled) return;
            sounds.playFanfare();
            fx.burst(e.clientX, e.clientY, 50);
            fx.launchCelebration(4000);

            this.dom.chestRevealHeaderTitle.innerText = "👑 QUÀ RƯƠNG CUỐI TUẦN 👑";
            this.dom.chestRevealSubtitle.innerText = "Chúc mừng bé đã chăm chỉ hoàn thành xuất sắc chỉ tiêu tuần này!";
            this.dom.chestSecretGiftText.innerText = this.state.weekendGift;
            
            this.addHistoryLog(`Mở Rương Kho Báu Cuối Tuần: "${this.state.weekendGift}"`, 'chest', 0);
            this.openModal(this.dom.modalChestReveal);
        });

        // PIN Entry Modal
        this.dom.btnParentOpen.addEventListener('click', () => {
            sounds.playPop();
            this.enteredPin = "";
            this.updatePinDots();
            this.openModal(this.dom.modalPin);
        });

        this.dom.keyBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                sounds.playPop();
                const key = btn.getAttribute('data-key');
                if (key === 'clear') {
                    this.enteredPin = "";
                } else if (key === 'back') {
                    this.enteredPin = this.enteredPin.slice(0, -1);
                } else if (this.enteredPin.length < 4) {
                    this.enteredPin += key;
                }
                this.updatePinDots();

                if (this.enteredPin.length === 4) {
                    setTimeout(() => {
                        if (this.enteredPin === this.state.parentPin) {
                            this.closeModal(this.dom.modalPin);
                            this.openAdminPanel();
                        } else {
                            alert("Mật mã không đúng! Mặc định là 1234");
                            this.enteredPin = "";
                            this.updatePinDots();
                        }
                    }, 200);
                }
            });
        });

        // Modal Close Buttons
        document.querySelectorAll('.modal-close, .btn-close-modal').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const overlay = e.target.closest('.modal-overlay');
                if (overlay) this.closeModal(overlay);
            });
        });

        // Admin Tab switching
        this.dom.adminTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                sounds.playPop();
                const target = tab.getAttribute('data-admin-tab');
                this.dom.adminTabs.forEach(t => t.classList.remove('active'));
                this.dom.adminTabContents.forEach(c => c.style.display = 'none');
                tab.classList.add('active');
                document.getElementById(target).style.display = 'block';
            });
        });

        // Approve All Pending Tasks
        this.dom.btnApproveAll.addEventListener('click', () => {
            this.approveAllPending();
        });

        // Admin Forms Submit
        this.dom.formUpdateLevelRewards.addEventListener('submit', (e) => {
            e.preventDefault();
            for (let i = 1; i <= 10; i++) {
                const val = document.getElementById(`input-level-reward-${i}`).value.trim();
                if (val) {
                    this.state.levelRewards[i] = val;
                }
            }
            this.saveState();
            this.renderAll();
            alert("Đã lưu cài đặt quà cho cả 10 Rương Level thành công!");
            sounds.playSparkle();
        });

        this.dom.formAddDaily.addEventListener('submit', (e) => {
            e.preventDefault();
            const title = document.getElementById('input-daily-title').value.trim();
            const iconElem = document.getElementById('input-daily-icon');
            const icon = iconElem ? iconElem.value.trim() : '📚';
            const stars = parseInt(document.getElementById('input-daily-stars').value) || 5;

            const selectedBtnElements = document.querySelectorAll('#day-checkbox-grid .day-pill-btn.active');
            const selectedDays = Array.from(selectedBtnElements).map(btn => btn.getAttribute('data-day'));

            if (selectedDays.length === 0) {
                alert("Vui lòng chọn ít nhất 1 ngày trong tuần áp dụng cho nhiệm vụ này!");
                return;
            }

            const days = selectedDays.length === 7 ? ['all'] : selectedDays;
            const primaryDay = days.length === 1 ? days[0] : (days.includes('all') ? 'all' : days[0]);

            if (title) {
                if (this.editingDailyTaskId) {
                    const task = this.state.dailyTasks.find(t => t.id === this.editingDailyTaskId);
                    if (task) {
                        task.title = title;
                        task.icon = icon;
                        task.stars = stars;
                        task.days = days;
                        task.day = primaryDay;
                    }
                    this.cancelEditDailyTask();
                } else {
                    this.state.dailyTasks.push({
                        id: 'd_' + Date.now(),
                        title,
                        day: primaryDay,
                        days,
                        icon,
                        stars,
                        status: 'pending',
                        dayStatuses: {
                            mon: 'pending', tue: 'pending', wed: 'pending',
                            thu: 'pending', fri: 'pending', sat: 'pending', sun: 'pending'
                        }
                    });
                    this.dom.formAddDaily.reset();
                }
                this.saveState();
                this.renderAll();
                this.renderAdminLists();
                sounds.playSparkle();
            }
        });

        this.dom.formAddChallenge.addEventListener('submit', (e) => {
            e.preventDefault();
            const title = document.getElementById('input-ch-title').value.trim();
            const cycle = document.getElementById('input-ch-cycle').value;
            const iconElem = document.getElementById('input-ch-icon');
            const icon = iconElem ? iconElem.value.trim() : '🏆';
            const stars = parseInt(document.getElementById('input-ch-stars').value) || 20;

            if (title) {
                if (this.editingChallengeId) {
                    const ch = this.state.challenges.find(c => c.id === this.editingChallengeId);
                    if (ch) {
                        ch.title = title;
                        ch.cycle = cycle;
                        ch.icon = icon;
                        ch.stars = stars;
                    }
                    this.cancelEditChallenge();
                } else {
                    this.state.challenges.push({
                        id: 'c_' + Date.now(),
                        title, cycle, icon, stars, status: 'pending'
                    });
                    this.dom.formAddChallenge.reset();
                }
                this.saveState();
                this.renderAll();
                this.renderAdminLists();
                sounds.playSparkle();
            }
        });

        this.dom.formAddShop.addEventListener('submit', (e) => {
            e.preventDefault();
            const title = document.getElementById('input-shop-title').value.trim();
            const icon = document.getElementById('input-shop-icon').value.trim() || '🎁';
            const cost = parseInt(document.getElementById('input-shop-cost').value) || 20;

            if (title) {
                if (this.editingShopId) {
                    const shop = this.state.shopItems.find(s => s.id === this.editingShopId);
                    if (shop) {
                        shop.title = title;
                        shop.icon = icon;
                        shop.cost = cost;
                    }
                    this.cancelEditShopItem();
                } else {
                    this.state.shopItems.push({
                        id: 's_' + Date.now(),
                        title, icon, cost
                    });
                    this.dom.formAddShop.reset();
                }
                this.saveState();
                this.renderAll();
                this.renderAdminLists();
                sounds.playSparkle();
            }
        });

        this.dom.formUpdateSettings.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('input-setting-name').value.trim();
            const gift = document.getElementById('input-setting-chest-gift').value.trim();
            const target = parseInt(document.getElementById('input-setting-target').value) || 80;
            const newPin = document.getElementById('input-setting-pin').value.trim();

            if (name) this.state.princessName = name;
            if (gift) this.state.weekendGift = gift;
            this.state.weeklyTarget = target;
            
            let pinChanged = false;
            if (newPin) {
                if (/^\d{4}$/.test(newPin)) {
                    this.state.parentPin = newPin;
                    pinChanged = true;
                } else {
                    alert("⚠️ Mật khẩu PIN mới phải gồm đúng 4 chữ số (ví dụ: 1234, 8888, 9999)!");
                    return;
                }
            }

            this.saveState();
            this.renderAll();
            if (pinChanged) {
                alert(`✅ Đã cài đặt lại Mật Khẩu Mã PIN Ba Mẹ thành công!\nMật khẩu mới để mở Góc Ba Mẹ là: ${newPin}`);
            } else {
                alert("✅ Đã lưu cài đặt mới cho Góc Ba Mẹ!");
            }
            sounds.playSparkle();
        });

        if (this.dom.formApplyPenalty) {
            this.dom.formApplyPenalty.addEventListener('submit', (e) => {
                e.preventDefault();
                const reason = this.dom.inputPenaltyReason.value.trim();
                const stars = parseInt(this.dom.inputPenaltyStars.value) || 0;
                if (reason && stars > 0) {
                    this.applyPenalty(reason, stars);
                    this.dom.formApplyPenalty.reset();
                    this.dom.inputPenaltyStars.value = 10;
                }
            });
        }

        if (this.dom.formAddPenaltyRule) {
            this.dom.formAddPenaltyRule.addEventListener('submit', (e) => {
                e.preventDefault();
                const title = document.getElementById('input-rule-title').value.trim();
                const icon = document.getElementById('input-rule-icon').value.trim() || '⚠️';
                const stars = parseInt(document.getElementById('input-rule-stars').value) || 10;
                if (title) {
                    this.addPenaltyRule(title, icon, stars);
                    this.dom.formAddPenaltyRule.reset();
                    document.getElementById('input-rule-icon').value = '⚠️';
                    document.getElementById('input-rule-stars').value = 10;
                }
            });
        }

        this.dom.btnResetDemo.addEventListener('click', () => {
            if (confirm("Khôi phục toàn bộ dữ liệu mẫu ban đầu?")) {
                this.state = JSON.parse(JSON.stringify(DEFAULT_STATE));
                this.saveState();
                this.renderAll();
                this.renderAdminLists();
                sounds.playSparkle();
            }
        });

        this.dom.btnAddStarsTest.addEventListener('click', () => {
            this.addStars(50, this.dom.btnAddStarsTest);
            this.addXP(100);
            sounds.playSparkle();
        });
    }

    flipToBookDay(dayCode) {
        this.currentBookDay = dayCode;
        this.dom.diaryPageBody.classList.add('flipping');
        
        setTimeout(() => {
            this.renderDailyHabits();
            this.dom.diaryPageBody.classList.remove('flipping');
        }, 220);
    }

    changeWeekOffset(delta) {
        this.currentWeekOffset += delta;
        this.dom.diaryPageBody.classList.add('flipping');
        
        setTimeout(() => {
            this.renderDailyHabits();
            this.dom.diaryPageBody.classList.remove('flipping');
        }, 220);
    }

    jumpToSpecificDate(dateObj) {
        if (!dateObj || isNaN(dateObj.getTime())) return;

        const now = new Date();
        const jsDayNow = now.getDay();
        const currMonOffset = jsDayNow === 0 ? 6 : jsDayNow - 1;
        const currentMonday = new Date(now);
        currentMonday.setDate(now.getDate() - currMonOffset);
        currentMonday.setHours(0,0,0,0);

        const jsDayTarget = dateObj.getDay();
        const targetMonOffset = jsDayTarget === 0 ? 6 : jsDayTarget - 1;
        const targetMonday = new Date(dateObj);
        targetMonday.setDate(dateObj.getDate() - targetMonOffset);
        targetMonday.setHours(0,0,0,0);

        const diffMs = targetMonday.getTime() - currentMonday.getTime();
        const diffWeeks = Math.round(diffMs / (7 * 24 * 60 * 60 * 1000));

        const map = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
        const targetDayCode = map[jsDayTarget];

        this.currentWeekOffset = diffWeeks;
        this.flipToBookDay(targetDayCode);
    }

    initDateTravelModal() {
        if (this.dateTravelModalInitialized) return;
        this.dateTravelModalInitialized = true;

        const daySelect = document.getElementById('modal-select-day');
        const monthSelect = document.getElementById('modal-select-month');
        const yearSelect = document.getElementById('modal-select-year');
        const dateInput = document.getElementById('modal-input-date-picker');
        const previewSpan = document.getElementById('modal-preview-date-str');
        const submitBtn = document.getElementById('btn-modal-submit-date');

        if (!daySelect || !monthSelect || !yearSelect) return;

        const currYear = new Date().getFullYear();

        // Populate Days 1 - 31
        let dayHTML = '';
        for (let d = 1; d <= 31; d++) {
            const val = String(d).padStart(2, '0');
            dayHTML += `<option value="${d}">Ngày ${val}</option>`;
        }
        daySelect.innerHTML = dayHTML;

        // Populate Months 1 - 12
        let monthHTML = '';
        for (let m = 1; m <= 12; m++) {
            const val = String(m).padStart(2, '0');
            monthHTML += `<option value="${m}">Tháng ${val}</option>`;
        }
        monthSelect.innerHTML = monthHTML;

        // Populate Years 2020 - 2030
        let yearHTML = '';
        for (let y = currYear - 5; y <= currYear + 5; y++) {
            yearHTML += `<option value="${y}">Năm ${y}</option>`;
        }
        yearSelect.innerHTML = yearHTML;

        const updateFromDropdowns = () => {
            const d = parseInt(daySelect.value, 10) || 1;
            const m = parseInt(monthSelect.value, 10) || 1;
            const y = parseInt(yearSelect.value, 10) || currYear;
            const dateObj = new Date(y, m - 1, d);
            if (dateInput) {
                const yyyy = dateObj.getFullYear();
                const mmStr = String(dateObj.getMonth() + 1).padStart(2, '0');
                const ddStr = String(dateObj.getDate()).padStart(2, '0');
                dateInput.value = `${yyyy}-${mmStr}-${ddStr}`;
            }
            if (previewSpan) {
                previewSpan.innerText = this.formatShortYearDateStr(dateObj);
            }
        };

        daySelect.addEventListener('change', updateFromDropdowns);
        monthSelect.addEventListener('change', updateFromDropdowns);
        yearSelect.addEventListener('change', updateFromDropdowns);

        if (dateInput) {
            dateInput.addEventListener('change', (e) => {
                const val = e.target.value;
                if (val) {
                    const parts = val.split('-');
                    if (parts.length === 3) {
                        const y = parseInt(parts[0], 10);
                        const m = parseInt(parts[1], 10);
                        const d = parseInt(parts[2], 10);
                        daySelect.value = d;
                        monthSelect.value = m;
                        yearSelect.value = y;
                        const dateObj = new Date(y, m - 1, d);
                        if (previewSpan) {
                            previewSpan.innerText = this.formatShortYearDateStr(dateObj);
                        }
                    }
                }
            });
        }

        if (submitBtn) {
            submitBtn.addEventListener('click', () => {
                const d = parseInt(daySelect.value, 10) || 1;
                const m = parseInt(monthSelect.value, 10) || 1;
                const y = parseInt(yearSelect.value, 10) || currYear;
                const targetDate = new Date(y, m - 1, d);
                sounds.playFanfare();
                this.jumpToSpecificDate(targetDate);
                this.closeModal(document.getElementById('modal-date-travel'));
            });
        }

        // Presets inside modal
        const bindPreset = (id, deltaWeeks, isToday = false) => {
            const btn = document.getElementById(id);
            if (btn) {
                btn.addEventListener('click', () => {
                    sounds.playPop();
                    if (isToday) {
                        this.currentWeekOffset = 0;
                        this.flipToBookDay(this.getTodayCode());
                    } else {
                        this.changeWeekOffset(deltaWeeks);
                    }
                    this.closeModal(document.getElementById('modal-date-travel'));
                });
            }
        };

        bindPreset('btn-preset-past-month', -4);
        bindPreset('btn-preset-past-week', -1);
        bindPreset('btn-preset-today', 0, true);
        bindPreset('btn-preset-future-week', 1);
        bindPreset('btn-preset-future-month', 4);
    }

    openDateTravelModal(mode = 'any') {
        this.initDateTravelModal();
        const activeDateObj = this.getWeekDate(this.currentBookDay, this.currentWeekOffset);
        const daySelect = document.getElementById('modal-select-day');
        const monthSelect = document.getElementById('modal-select-month');
        const yearSelect = document.getElementById('modal-select-year');
        const dateInput = document.getElementById('modal-input-date-picker');
        const previewSpan = document.getElementById('modal-preview-date-str');

        const titleElem = document.querySelector('#modal-date-travel .modal-title');
        const submitBtn = document.getElementById('btn-modal-submit-date');

        if (titleElem) {
            if (mode === 'past') {
                titleElem.innerText = '⏳ CHỌN NGÀY QUAY VỀ QUÁ KHỨ 🐣✨';
            } else if (mode === 'future') {
                titleElem.innerText = '🚀 CHỌN NGÀY ĐẾN TƯƠNG LAI 🐣✨';
            } else {
                titleElem.innerText = 'CHUYẾN XE THỜI GIAN VỊT CON 🐣✨';
            }
        }

        if (submitBtn) {
            if (mode === 'past') {
                submitBtn.innerText = '⏳ QUAY VỀ NGÀY QUÁ KHỨ NÀY ✨';
            } else if (mode === 'future') {
                submitBtn.innerText = '🚀 ĐẾN NGÀY TƯƠNG LAI NÀY ✨';
            } else {
                submitBtn.innerText = '🚀 LẬT SÁCH ĐẾN NGÀY NÀY ✨';
            }
        }

        if (daySelect && monthSelect && yearSelect) {
            daySelect.value = activeDateObj.getDate();
            monthSelect.value = activeDateObj.getMonth() + 1;
            yearSelect.value = activeDateObj.getFullYear();
        }

        if (dateInput) {
            const yyyy = activeDateObj.getFullYear();
            const mmStr = String(activeDateObj.getMonth() + 1).padStart(2, '0');
            const ddStr = String(activeDateObj.getDate()).padStart(2, '0');
            dateInput.value = `${yyyy}-${mmStr}-${ddStr}`;
        }

        if (previewSpan) {
            previewSpan.innerText = this.formatShortYearDateStr(activeDateObj);
        }

        this.openModal(document.getElementById('modal-date-travel'));
    }

    openAvatarModal() {
        this.dom.avatarPresetCards.forEach(card => {
            if (card.getAttribute('data-avatar') === this.state.avatar) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });
        this.openModal(this.dom.modalAvatar);
    }

    switchTab(tabId) {
        if (tabId === 'tab-wishes') {
            this.startWishChestOpeningSequence();
            return;
        }
        this.dom.navTabs.forEach(t => {
            if (t.getAttribute('data-tab') === tabId) t.classList.add('active');
            else t.classList.remove('active');
        });
        this.dom.tabContents.forEach(c => {
            if (c.id === tabId) c.classList.add('active');
            else c.classList.remove('active');
        });

        if (tabId === 'tab-dashboard') {
            this.renderDashboard();
        }
    }

    // Modal Helpers
    openModal(modalElem) {
        modalElem.classList.add('active');
    }

    closeModal(modalElem) {
        modalElem.classList.remove('active');
    }

    updatePinDots() {
        this.dom.pinDots.forEach((dot, idx) => {
            if (idx < this.enteredPin.length) {
                dot.classList.add('filled');
            } else {
                dot.classList.remove('filled');
            }
        });
    }

    getPendingApprovalsCount() {
        let pendingDailyCount = 0;
        this.state.dailyTasks.forEach(t => {
            const checkDays = t.day === 'all' ? DAY_CODES : [t.day];
            checkDays.forEach(d => {
                if (this.getTaskStatus(t, d) === 'awaiting_approval') pendingDailyCount++;
            });
        });

        const pendingChCount = this.state.challenges.filter(c => c.status === 'awaiting_approval').length;
        return pendingDailyCount + pendingChCount;
    }

    addHistoryLog(title, type, stars) {
        const now = new Date();
        const timeStr = `${this.formatFullDateStr(now)} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
        
        this.state.history.unshift({
            id: 'h_' + Date.now(),
            title,
            type,
            stars,
            timestamp: timeStr
        });
        
        // Keep max 50 logs
        if (this.state.history.length > 50) {
            this.state.history = this.state.history.slice(0, 50);
        }
        this.saveState();
    }

    openAdminPanel() {
        document.getElementById('input-setting-name').value = this.state.princessName || 'Bé Yêu';
        document.getElementById('input-setting-chest-gift').value = this.state.weekendGift || '';
        document.getElementById('input-setting-target').value = this.state.weeklyTarget || 80;
        const pinInput = document.getElementById('input-setting-pin');
        if (pinInput) pinInput.value = this.state.parentPin || "1234";
        
        this.renderAdminLists();
        this.initIconPickers();
        this.initDayPickerEvents();
        this.openModal(this.dom.modalAdmin);
    }

    setDayPickerDays(activeDaysArr) {
        const dayPillBtns = document.querySelectorAll('#day-checkbox-grid .day-pill-btn');
        const feedbackElem = document.getElementById('day-selection-feedback');
        const dayNames = { mon: 'Thứ 2', tue: 'Thứ 3', wed: 'Thứ 4', thu: 'Thứ 5', fri: 'Thứ 6', sat: 'Thứ 7', sun: 'Chủ Nhật' };

        dayPillBtns.forEach(btn => {
            const day = btn.getAttribute('data-day');
            if (activeDaysArr.includes(day)) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        const activeBtns = Array.from(document.querySelectorAll('#day-checkbox-grid .day-pill-btn.active'));
        const activeDays = activeBtns.map(btn => btn.getAttribute('data-day'));

        if (feedbackElem) {
            if (activeDays.length === 0) {
                feedbackElem.innerHTML = `<span style="color: #E53935;">⚠️ Chưa chọn ngày nào. Vui lòng bấm chọn các thứ áp dụng!</span>`;
            } else if (activeDays.length === 7) {
                feedbackElem.innerHTML = `<span style="color: var(--purple-dark); font-weight: bold;">✨ Đã chọn tất cả 7 ngày trong tuần!</span>`;
            } else {
                const labelStr = activeDays.map(d => dayNames[d] || d).join(', ');
                feedbackElem.innerHTML = `<span style="color: #2E7D32; font-weight: bold;">✅ Đã chọn ${activeDays.length} ngày: ${labelStr}</span>`;
            }
        }
    }

    initDayPickerEvents() {
        const presetAll = document.getElementById('preset-days-all');
        const presetWeekdays = document.getElementById('preset-days-weekdays');
        const presetWeekend = document.getElementById('preset-days-weekend');
        const presetClear = document.getElementById('preset-days-clear');
        const dayPillBtns = document.querySelectorAll('#day-checkbox-grid .day-pill-btn');
        const presetBtns = document.querySelectorAll('.btn-day-preset');

        if (!dayPillBtns.length) return;

        if (!this.dayPickerEventsBound) {
            this.dayPickerEventsBound = true;

            dayPillBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    sounds.playPop();
                    btn.classList.toggle('active');
                    presetBtns.forEach(b => b.classList.remove('active'));

                    const activeBtns = Array.from(document.querySelectorAll('#day-checkbox-grid .day-pill-btn.active'));
                    const activeDays = activeBtns.map(b => b.getAttribute('data-day'));
                    this.setDayPickerDays(activeDays);
                });
            });

            if (presetAll) {
                presetAll.addEventListener('click', (e) => {
                    e.preventDefault();
                    sounds.playPop();
                    presetBtns.forEach(b => b.classList.remove('active'));
                    presetAll.classList.add('active');
                    this.setDayPickerDays(DAY_CODES);
                });
            }

            if (presetWeekdays) {
                presetWeekdays.addEventListener('click', (e) => {
                    e.preventDefault();
                    sounds.playPop();
                    presetBtns.forEach(b => b.classList.remove('active'));
                    presetWeekdays.classList.add('active');
                    this.setDayPickerDays(['mon', 'tue', 'wed', 'thu', 'fri']);
                });
            }

            if (presetWeekend) {
                presetWeekend.addEventListener('click', (e) => {
                    e.preventDefault();
                    sounds.playPop();
                    presetBtns.forEach(b => b.classList.remove('active'));
                    presetWeekend.classList.add('active');
                    this.setDayPickerDays(['sat', 'sun']);
                });
            }

            if (presetClear) {
                presetClear.addEventListener('click', (e) => {
                    e.preventDefault();
                    sounds.playPop();
                    presetBtns.forEach(b => b.classList.remove('active'));
                    this.setDayPickerDays([]);
                });
            }
        }

        const currentActive = Array.from(document.querySelectorAll('#day-checkbox-grid .day-pill-btn.active')).map(b => b.getAttribute('data-day'));
        if (currentActive.length === 0) {
            this.setDayPickerDays(DAY_CODES);
            if (presetAll) presetAll.classList.add('active');
        } else {
            this.setDayPickerDays(currentActive);
        }
    }

    initIconPickers() {
        const categories = [
            {
                name: "🐣 Vịt & Cute",
                icons: ["🐥", "🐣", "🦆", "👑", "🎀", "⭐", "🌸", "🍓", "🍦", "🦖", "🤠", "⚓", "🥽", "😎", "🦄", "🐰", "🐻", "🐱", "🐶", "🦁"]
            },
            {
                name: "📚 Học Tập",
                icons: ["📚", "📖", "✏️", "🎨", "🎵", "🎹", "🧩", "🧮", "🔬", "💻", "📝", "🎓", "📐", "📌", "🎒"]
            },
            {
                name: "🧹 Việc Nhà",
                icons: ["🧹", "🪥", "🧼", "🧺", "🛏️", "🍽️", "🌱", "🐶", "🗑️", "👕", "🚿", "🍳", "🪴", "🧽"]
            },
            {
                name: "🏃 Thể Thao",
                icons: ["🏃‍♀️", "🚴‍♀️", "🏊‍♀️", "⚽", "🏀", "🤸‍♀️", "🧗‍♀️", "🏓", "🛹", "🏸", "🧘‍♀️", "🥊"]
            },
            {
                name: "🎁 Quà & Vui Chơi",
                icons: ["📱", "🍦", "✨", "🧸", "🎮", "🎬", "🎁", "🎟️", "🎈", "🍭", "🍩", "🍕", "🧃", "🍿", "🍔"]
            }
        ];

        const containers = document.querySelectorAll('.icon-picker-grid-container');
        containers.forEach(container => {
            const targetId = container.getAttribute('data-input-target');
            const targetInput = document.getElementById(targetId);

            let html = `
                <div class="icon-category-bar">
                    ${categories.map((cat, idx) => `
                        <button type="button" class="icon-cat-btn ${idx === 0 ? 'active' : ''}" data-cat="${idx}">${cat.name}</button>
                    `).join('')}
                </div>
                <div class="icon-grid-box">
                    ${categories.map((cat, catIdx) => `
                        <div class="icon-cat-grid ${catIdx === 0 ? 'active' : ''}" data-cat-grid="${catIdx}">
                            ${cat.icons.map(icon => `
                                <button type="button" class="icon-btn-item ${targetInput && targetInput.value === icon ? 'active' : ''}" data-icon="${icon}">${icon}</button>
                            `).join('')}
                        </div>
                    `).join('')}
                </div>
            `;
            container.innerHTML = html;

            // Category switcher
            const catBtns = container.querySelectorAll('.icon-cat-btn');
            const catGrids = container.querySelectorAll('.icon-cat-grid');

            catBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    sounds.playPop();
                    const catIdx = btn.getAttribute('data-cat');
                    catBtns.forEach(b => b.classList.remove('active'));
                    catGrids.forEach(g => g.classList.remove('active'));
                    btn.classList.add('active');
                    const targetGrid = container.querySelector(`.icon-cat-grid[data-cat-grid="${catIdx}"]`);
                    if (targetGrid) targetGrid.classList.add('active');
                });
            });

            // Icon click selection
            const iconBtns = container.querySelectorAll('.icon-btn-item');
            iconBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    sounds.playSparkle();
                    const selectedIcon = btn.getAttribute('data-icon');
                    if (targetInput) {
                        targetInput.value = selectedIcon;
                    }
                    iconBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                });
            });
        });
    }

    renderAdminLists() {
        // Pending approvals
        const pendingDaily = [];
        const dayNames = { mon: 'Thứ 2', tue: 'Thứ 3', wed: 'Thứ 4', thu: 'Thứ 5', fri: 'Thứ 6', sat: 'Thứ 7', sun: 'Chủ Nhật' };

        this.state.dailyTasks.forEach(t => {
            const checkDays = t.day === 'all' ? DAY_CODES : [t.day];
            checkDays.forEach(d => {
                if (this.getTaskStatus(t, d) === 'awaiting_approval') {
                    pendingDaily.push({
                        id: t.id,
                        title: `[${dayNames[d]}] ${t.title}`,
                        icon: t.icon,
                        stars: t.stars,
                        loggedTimeStr: t.loggedTimeStr,
                        dayCode: d,
                        type: 'daily'
                    });
                }
            });
        });

        const pendingCh = this.state.challenges.filter(c => c.status === 'awaiting_approval').map(c => ({
            id: c.id,
            title: `[Thử Thách] ${c.title}`,
            icon: '🏆',
            stars: c.stars,
            dayCode: null,
            type: 'challenge'
        }));

        const allPending = [...pendingDaily, ...pendingCh];

        const totalPending = allPending.length;
        this.dom.adminPendingBadge.innerText = totalPending > 0 ? `(${totalPending})` : '';

        if (allPending.length === 0) {
            this.dom.adminApprovalsList.innerHTML = `
                <div style="text-align: center; padding: 25px; color: var(--text-muted); background: var(--purple-light); border-radius: 16px;">
                    ✨ Không có nhiệm vụ nào đang chờ duyệt! Cảm ơn ba mẹ 💖
                </div>
            `;
            this.dom.btnApproveAll.style.display = 'none';
        } else {
            this.dom.btnApproveAll.style.display = 'block';
            this.dom.adminApprovalsList.innerHTML = allPending.map(item => `
                <div class="admin-item-row approval-row">
                    <div>
                        <strong>${item.icon || '🏆'} ${item.title}</strong>
                        <div style="font-size: 0.85rem; color: #D4A017; font-weight: bold; margin-top: 2px;">
                            +${item.stars} ⭐ ${item.loggedTimeStr ? `• ⏱️ Thời gian làm: ${item.loggedTimeStr}` : ''}
                        </div>
                    </div>
                    <div class="approval-btn-group">
                        <button class="btn-approve" onclick="app.approveSingleItem('${item.type}', '${item.id}', '${item.dayCode}')">✅ Duyệt</button>
                        <button class="btn-reject" onclick="app.rejectSingleItem('${item.type}', '${item.id}', '${item.dayCode}')">❌ Từ chối</button>
                    </div>
                </div>
            `).join('');
        }

        // 10 Level Chest Rewards Inputs
        let levelInputsHTML = '';
        for (let i = 1; i <= 10; i++) {
            const rewardVal = this.state.levelRewards[i] || '';
            const isYearly = i === 10;
            const lvlObj = LEVEL_MAP.find(l => l.level === i);
            levelInputsHTML += `
                <div class="form-group" style="display:flex; gap:12px; align-items:center; ${isYearly ? 'background:#FFFDE7; padding:12px; border-radius:14px; border:2px solid #FFD700;' : 'background:#FAF0F6; padding:10px; border-radius:14px; margin-bottom:10px;'}">
                    <img src="${lvlObj.chestImg}" alt="${lvlObj.chestName}" style="width: 48px; height: 48px; object-fit: contain;">
                    <div style="flex:1;">
                        <label style="${isYearly ? 'color:#B78103; font-weight:bold; font-size:1.05rem;' : 'color:var(--purple-dark); font-weight:bold;'}">
                            ${isYearly ? '👑 RƯƠNG LEVEL 10: ' + lvlObj.chestName : `Level ${i}: ${lvlObj.chestName} (${lvlObj.reqXP} XP)`}
                        </label>
                        <input type="text" class="form-input" id="input-level-reward-${i}" value="${rewardVal}" placeholder="Nhập phần thưởng cho Level ${i}..." required style="margin-top:4px;">
                    </div>
                </div>
            `;
        }
        this.dom.adminLevelRewardsInputs.innerHTML = levelInputsHTML;

        // Daily
        this.dom.adminDailyList.innerHTML = this.state.dailyTasks.map(t => {
            const daysLabel = this.formatTaskDaysLabel(t);
            return `
                <div class="admin-item-row">
                    <div>
                        <strong>${t.icon} ${t.title}</strong>
                        <div style="font-size: 0.85rem; color: var(--purple-dark); font-weight: 600; margin-top: 2px;">
                            +${t.stars} ⭐ • Áp dụng: ${daysLabel}
                        </div>
                    </div>
                    <div style="display: flex; gap: 6px; align-items: center;">
                        <button class="btn-edit" onclick="app.editDailyTask('${t.id}')">✏️ Sửa</button>
                        <button class="btn-del" onclick="app.deleteItem('dailyTasks', '${t.id}')">Xóa</button>
                    </div>
                </div>
            `;
        }).join('');

        // Challenges
        this.dom.adminChallengeList.innerHTML = this.state.challenges.map(c => `
            <div class="admin-item-row">
                <div>
                    <strong>${c.icon || '🏆'} ${c.title}</strong>
                    <div style="font-size: 0.85rem; color: var(--purple-dark); font-weight: 600; margin-top: 2px;">
                        [${c.cycle === 'weekly' ? 'Hằng Tuần' : (c.cycle === 'monthly' ? 'Hằng Tháng' : 'Hằng Quý')}] • +${c.stars} ⭐
                    </div>
                </div>
                <div style="display: flex; gap: 6px; align-items: center;">
                    <button class="btn-edit" onclick="app.editChallenge('${c.id}')">✏️ Sửa</button>
                    <button class="btn-del" onclick="app.deleteItem('challenges', '${c.id}')">Xóa</button>
                </div>
            </div>
        `).join('');

        // Shop
        this.dom.adminShopList.innerHTML = this.state.shopItems.map(s => `
            <div class="admin-item-row">
                <div>
                    <strong>${s.icon} ${s.title}</strong>
                    <div style="font-size: 0.85rem; color: #D4A017; font-weight: bold; margin-top: 2px;">
                        ${s.cost} ⭐
                    </div>
                </div>
                <div style="display: flex; gap: 6px; align-items: center;">
                    <button class="btn-edit" onclick="app.editShopItem('${s.id}')">✏️ Sửa</button>
                    <button class="btn-del" onclick="app.deleteItem('shopItems', '${s.id}')">Xóa</button>
                </div>
            </div>
        `).join('');

        // Child Wishes in Parent Admin
        if (this.dom.adminWishesList) {
            const wishes = this.state.wishes || [];
            const unreadCount = wishes.filter(w => w.status === 'pending').length;
            if (this.dom.adminWishesBadge) {
                this.dom.adminWishesBadge.innerText = unreadCount > 0 ? `(${unreadCount})` : '';
            }

            if (wishes.length === 0) {
                this.dom.adminWishesList.innerHTML = `
                    <div style="text-align: center; padding: 25px; color: var(--text-muted); background: var(--purple-light); border-radius: 16px;">
                        ✨ Chưa có điều ước nào từ bé. Bé hãy mở Chiếc Rương Ước Nguyện để viết điều ước nhé! 💖
                    </div>
                `;
            } else {
                this.dom.adminWishesList.innerHTML = wishes.map(w => {
                    const isUnread = w.status === 'pending';
                    let statusLabel = '✨ Chưa xem';
                    if (w.status === 'read') statusLabel = '💌 Đã yêu thương';
                    if (w.status === 'gifted' || w.status === 'completed') statusLabel = '🎁 Đã điều quà';

                    return `
                        <div class="wish-envelope-card ${isUnread ? 'unread' : ''}">
                            ${isUnread ? '<span class="unread-badge">🔴 MỚI</span>' : ''}
                            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                                <div>
                                    <div style="font-family: var(--font-heading); color: var(--pink-dark); font-size: 1.05rem;">
                                        ⭐ ${w.childName}: "${w.content}"
                                    </div>
                                    <div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">
                                        ❤️ Bé gửi lúc: ${w.createdAt} • Trạng thái: <strong>${statusLabel}</strong>
                                    </div>
                                    ${w.giftTitle ? `
                                        <div style="font-size: 0.85rem; color: #2E7D32; font-weight: bold; margin-top: 4px;">
                                            🎁 Phần quà đã điều: ${w.giftTitle} ${w.isSecret ? '(🔒 Giữ bí mật)' : ''}
                                        </div>
                                    ` : ''}
                                </div>
                            </div>
                            
                            <div style="display: flex; gap: 8px; margin-top: 12px; justify-content: flex-end; flex-wrap: wrap;">
                                <button class="btn-approve" onclick="app.parentLoveWish('${w.id}')" style="background: #E91E63; padding: 6px 12px; font-size: 0.85rem;">
                                    ❤️ Thả Tim
                                </button>
                                <button class="btn-approve" onclick="app.parentAddWishToShop('${w.id}')" style="background: #AB47BC; padding: 6px 12px; font-size: 0.85rem;">
                                    🛍️ Đưa Vào Cửa Hàng Quà
                                </button>
                                <button class="btn-approve" onclick="app.parentOpenDispatchModal('${w.id}')" style="background: #FF9800; padding: 6px 12px; font-size: 0.85rem;">
                                    🎁 Biến Thành Quà Ngay
                                </button>
                            </div>
                        </div>
                    `;
                }).join('');
            }
        }

        // Render Penalties in Admin
        this.renderAdminPenaltyRules();
    }

    applyPenalty(reason, starsDeducted) {
        const amt = Math.abs(parseInt(starsDeducted) || 0);
        if (amt <= 0) return;

        const prevStars = this.state.stars;
        this.state.stars = Math.max(0, this.state.stars - amt);

        this.addHistoryLog(`⚠️ Bị trừ điểm phạt lỗi: "${reason}"`, 'penalty', -amt);

        sounds.playPop();
        this.saveState();
        this.renderAll();

        alert(`⚠️ ĐÃ TRỪ -${amt} ⭐ CỦA BÉ!\n\n📌 Lý do phạt: ${reason}\n⭐ Số Sao còn lại của bé: ${this.state.stars} ⭐`);
    }

    addPenaltyRule(title, icon, stars) {
        if (!this.state.penaltyRules) this.state.penaltyRules = [];
        this.state.penaltyRules.push({
            id: 'p_' + Date.now(),
            title: title.trim(),
            icon: icon || '⚠️',
            stars: Math.abs(parseInt(stars) || 10)
        });
        this.saveState();
        this.renderAdminPenaltyRules();
        sounds.playSparkle();
    }

    deletePenaltyRule(id) {
        if (confirm("Ba mẹ có chắc muốn xóa quy định phạt này?")) {
            this.state.penaltyRules = (this.state.penaltyRules || []).filter(p => p.id !== id);
            this.saveState();
            this.renderAdminPenaltyRules();
            sounds.playPop();
        }
    }

    renderAdminPenaltyRules() {
        const penaltyListElem = document.getElementById('admin-penalty-rules-list');
        if (!penaltyListElem) return;

        const rules = this.state.penaltyRules || [];
        if (rules.length === 0) {
            penaltyListElem.innerHTML = `
                <div style="text-align: center; padding: 18px; color: var(--text-muted); background: #FFF5F5; border-radius: 14px;">
                    Chưa có quy định phạt mẫu nào. Ba mẹ có thể tự thêm quy định ở khung trên nhé!
                </div>
            `;
            return;
        }

        penaltyListElem.innerHTML = rules.map(p => `
            <div class="admin-item-row" style="background: #FFF5F5; border: 1.5px solid #FFCDD2; border-radius: 14px; padding: 12px; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <strong style="color: #C62828; font-size: 0.98rem;">${p.icon || '⚠️'} ${p.title}</strong>
                    <div style="font-size: 0.85rem; color: #D32F2F; font-weight: bold; margin-top: 2px;">
                        Mức phạt: -${p.stars} ⭐
                    </div>
                </div>
                <div style="display: flex; gap: 8px; align-items: center;">
                    <button class="btn-del" onclick="app.applyPenalty('${p.title.replace(/'/g, "\\'")}', ${p.stars})" style="background: linear-gradient(135deg, #E53935, #D32F2F); color: #FFF; padding: 6px 14px; font-size: 0.85rem; font-weight: bold; border-radius: 10px; cursor: pointer; box-shadow: 0 2px 6px rgba(211,47,47,0.3);">
                        ⚠️ Trừ -${p.stars} ⭐
                    </button>
                    <button class="btn-del" onclick="app.deletePenaltyRule('${p.id}')" style="background: #FFF; color: #D32F2F; border: 1.5px solid #EF5350; padding: 6px 10px; font-size: 0.85rem; cursor: pointer; border-radius: 10px;" title="Xóa quy định phạt">
                        🗑️
                    </button>
                </div>
            </div>
        `).join('');
    }

    editDailyTask(id) {
        const task = this.state.dailyTasks.find(t => t.id === id);
        if (!task) return;

        this.editingDailyTaskId = id;
        document.getElementById('input-daily-title').value = task.title;
        document.getElementById('input-daily-icon').value = task.icon;
        document.getElementById('input-daily-stars').value = task.stars;

        const taskDays = this.getTaskDays(task);
        this.setDayPickerDays(taskDays);

        const submitBtn = this.dom.formAddDaily.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.innerText = '💾 Lưu Chỉnh Sửa Nhiệm Vụ';
        }

        let cancelBtn = document.getElementById('btn-cancel-edit-daily');
        if (!cancelBtn) {
            cancelBtn = document.createElement('button');
            cancelBtn.id = 'btn-cancel-edit-daily';
            cancelBtn.type = 'button';
            cancelBtn.className = 'btn-cancel-edit';
            cancelBtn.innerText = '✖️ Hủy Sửa';
            cancelBtn.onclick = () => this.cancelEditDailyTask();
            this.dom.formAddDaily.appendChild(cancelBtn);
        }
        cancelBtn.style.display = 'inline-block';

        this.dom.formAddDaily.scrollIntoView({ behavior: 'smooth', block: 'center' });
        sounds.playPop();
    }

    cancelEditDailyTask() {
        this.editingDailyTaskId = null;
        this.dom.formAddDaily.reset();
        this.setDayPickerDays(DAY_CODES);
        const submitBtn = this.dom.formAddDaily.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.innerText = '+ Thêm Việc Daily';
        }
        const cancelBtn = document.getElementById('btn-cancel-edit-daily');
        if (cancelBtn) {
            cancelBtn.style.display = 'none';
        }
    }

    editChallenge(id) {
        const ch = this.state.challenges.find(c => c.id === id);
        if (!ch) return;

        this.editingChallengeId = id;
        document.getElementById('input-ch-title').value = ch.title;
        document.getElementById('input-ch-cycle').value = ch.cycle || 'weekly';
        document.getElementById('input-ch-icon').value = ch.icon || '🏆';
        document.getElementById('input-ch-stars').value = ch.stars;

        const submitBtn = this.dom.formAddChallenge.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.innerText = '💾 Lưu Chỉnh Sửa Thử Thách';

        let cancelBtn = document.getElementById('btn-cancel-edit-ch');
        if (!cancelBtn) {
            cancelBtn = document.createElement('button');
            cancelBtn.id = 'btn-cancel-edit-ch';
            cancelBtn.type = 'button';
            cancelBtn.className = 'btn-cancel-edit';
            cancelBtn.innerText = '✖️ Hủy Sửa';
            cancelBtn.onclick = () => this.cancelEditChallenge();
            this.dom.formAddChallenge.appendChild(cancelBtn);
        }
        cancelBtn.style.display = 'inline-block';
        this.dom.formAddChallenge.scrollIntoView({ behavior: 'smooth', block: 'center' });
        sounds.playPop();
    }

    cancelEditChallenge() {
        this.editingChallengeId = null;
        this.dom.formAddChallenge.reset();
        const submitBtn = this.dom.formAddChallenge.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.innerText = '+ Thêm Thử Thách';
        const cancelBtn = document.getElementById('btn-cancel-edit-ch');
        if (cancelBtn) cancelBtn.style.display = 'none';
    }

    editShopItem(id) {
        const shop = this.state.shopItems.find(s => s.id === id);
        if (!shop) return;

        this.editingShopId = id;
        document.getElementById('input-shop-title').value = shop.title;
        document.getElementById('input-shop-icon').value = shop.icon || '🎁';
        document.getElementById('input-shop-cost').value = shop.cost;

        const submitBtn = this.dom.formAddShop.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.innerText = '💾 Lưu Chỉnh Sửa Quà';

        let cancelBtn = document.getElementById('btn-cancel-edit-shop');
        if (!cancelBtn) {
            cancelBtn = document.createElement('button');
            cancelBtn.id = 'btn-cancel-edit-shop';
            cancelBtn.type = 'button';
            cancelBtn.className = 'btn-cancel-edit';
            cancelBtn.innerText = '✖️ Hủy Sửa';
            cancelBtn.onclick = () => this.cancelEditShopItem();
            this.dom.formAddShop.appendChild(cancelBtn);
        }
        cancelBtn.style.display = 'inline-block';
        this.dom.formAddShop.scrollIntoView({ behavior: 'smooth', block: 'center' });
        sounds.playPop();
    }

    cancelEditShopItem() {
        this.editingShopId = null;
        this.dom.formAddShop.reset();
        const submitBtn = this.dom.formAddShop.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.innerText = '+ Thêm Món Quà';
        const cancelBtn = document.getElementById('btn-cancel-edit-shop');
        if (cancelBtn) cancelBtn.style.display = 'none';
    }

    approveSingleItem(type, id, dayCode) {
        if (type === 'daily') {
            const task = this.state.dailyTasks.find(t => t.id === id);
            if (!task) return;
            this.setTaskStatus(task, dayCode, 'completed');
            this.addStars(task.stars);
            this.addHistoryLog(`Ba Mẹ duyệt (${dayCode}): "${task.title}"`, 'approval', task.stars);
        } else {
            const ch = this.state.challenges.find(c => c.id === id);
            if (!ch) return;
            ch.status = 'completed';
            this.addStars(ch.stars);
            this.addHistoryLog(`Ba Mẹ duyệt thử thách: "${ch.title}"`, 'approval', ch.stars);
        }

        sounds.playSparkle();
        fx.launchCelebration(1500);

        this.saveState();
        this.renderAll();
        this.renderAdminLists();
    }

    rejectSingleItem(type, id, dayCode) {
        if (type === 'daily') {
            const task = this.state.dailyTasks.find(t => t.id === id);
            if (!task) return;
            this.setTaskStatus(task, dayCode, 'pending');
        } else {
            const ch = this.state.challenges.find(c => c.id === id);
            if (!ch) return;
            ch.status = 'pending';
        }

        sounds.playPop();
        this.saveState();
        this.renderAll();
        this.renderAdminLists();
    }

    approveAllPending() {
        let totalStars = 0;

        this.state.dailyTasks.forEach(t => {
            const checkDays = t.day === 'all' ? DAY_CODES : [t.day];
            checkDays.forEach(d => {
                if (this.getTaskStatus(t, d) === 'awaiting_approval') {
                    this.setTaskStatus(t, d, 'completed');
                    totalStars += t.stars;
                    this.addHistoryLog(`Ba Mẹ duyệt (${d}): "${t.title}"`, 'approval', t.stars);
                }
            });
        });

        this.state.challenges.forEach(c => {
            if (c.status === 'awaiting_approval') {
                c.status = 'completed';
                totalStars += c.stars;
                this.addHistoryLog(`Ba Mẹ duyệt thử thách: "${c.title}"`, 'approval', c.stars);
            }
        });

        if (totalStars > 0) {
            this.addStars(totalStars);
            sounds.playFanfare();
            fx.launchCelebration(3000);
            alert(`🎉 Ba mẹ đã duyệt tất cả! Bé nhận được tổng cộng +${totalStars} ⭐!`);
        }

        this.saveState();
        this.renderAll();
        this.renderAdminLists();
    }

    deleteItem(collectionName, id) {
        this.state[collectionName] = this.state[collectionName].filter(item => item.id !== id);
        this.saveState();
        this.renderAll();
        this.renderAdminLists();
        sounds.playPop();
    }

    // Reward & XP Calculations
    addStars(amount, sourceElem = null) {
        this.state.stars += amount;
        this.addXP(amount * 5);

        if (sourceElem) {
            fx.flyStar(sourceElem, this.dom.starsPill, 3);
        }
        this.saveState();
        this.renderHeader();
    }

    addXP(amount) {
        this.state.xp += amount;
        
        let currentLv = 1;
        for (let l of LEVEL_MAP) {
            if (this.state.xp >= l.reqXP) {
                currentLv = l.level;
            } else {
                break;
            }
        }

        if (currentLv > this.state.level) {
            const oldLevel = this.state.level;
            this.state.level = currentLv;
            sounds.playFanfare();
            fx.launchCelebration(4000);

            const newLevelInfo = LEVEL_MAP.find(l => l.level === currentLv);
            alert(`🎉 CHÚC MỪNG BÉ! Thăng cấp thành công từ Level ${oldLevel} ➔ Level ${this.state.level}: ${newLevelInfo.title}!\n\n✨ Rương Kho Báu Level ${this.state.level} đã được mở khóa! Hãy vào mục "10 Rương Level" để mở rương nhận quà nhé! 🎁`);
        }

        this.saveState();
        this.renderAll();
    }

    openLevelChest(levelNum, event) {
        const levelInfo = LEVEL_MAP.find(l => l.level === levelNum);
        if (!levelInfo || this.state.level < levelNum) return;

        if (!this.state.claimedLevelChests.includes(levelNum)) {
            this.state.claimedLevelChests.push(levelNum);
        }

        sounds.playFanfare();
        if (event) {
            fx.burst(event.clientX, event.clientY, 40);
        }
        fx.launchCelebration(3500);

        const rewardText = this.state.levelRewards[levelNum] || "Món quà tuyệt vời!";
        
        this.dom.chestRevealHeaderTitle.innerText = levelNum === 10 ? "👑 THẺ PHẦN THƯỞNG NĂM CAO NHẤT 👑" : `💎 THẺ QUÀ ${levelInfo.chestName.toUpperCase()} 💎`;
        this.dom.chestRevealSubtitle.innerText = `Chúc mừng bé đã đạt Level ${levelNum}: ${levelInfo.title}!`;
        this.dom.chestSecretGiftText.innerText = rewardText;

        const graphicElem = document.querySelector('.gift-card-graphic');
        if (graphicElem) {
            graphicElem.innerHTML = `
                <img src="${levelInfo.chestImg}" alt="${levelInfo.chestName}" style="width: 120px; height: 120px; object-fit: contain; margin-bottom: 10px; filter: drop-shadow(0 6px 12px rgba(0,0,0,0.25));">
                <h3 style="font-family: var(--font-heading); font-size: 1.3rem; margin-bottom: 8px;">${levelNum === 10 ? '👑 THẺ PHẦN THƯỞNG NĂM CAO NHẤT 👑' : `💎 ${levelInfo.chestName.toUpperCase()} 💎`}</h3>
                <p style="font-size: 1.1rem; line-height: 1.5;">${rewardText}</p>
            `;
        }

        this.setMascotState('superhero', `WOAA! Rương ${levelInfo.chestName} Đã Mở Khóa! 👑🥚🎁✨`);
        this.addHistoryLog(`Mở Rương Kho Báu Level ${levelNum} (${levelInfo.chestName}): "${rewardText}"`, 'chest', 0);

        this.openModal(this.dom.modalChestReveal);
        this.saveState();
        this.renderAll();
    }

    setMascotState(state = 'idle', message = null) {
        const container = document.getElementById('duck-mascot-container');
        const idleEyes = document.querySelector('.idle-eyes');
        const happyEyes = document.querySelector('.happy-eyes');
        const goldenEgg = document.querySelector('.duck-golden-egg');
        const speechBubble = document.getElementById('duck-speech-bubble');

        if (!container) return;

        container.setAttribute('data-state', state);

        if (state === 'happy') {
            if (idleEyes) idleEyes.style.display = 'none';
            if (happyEyes) happyEyes.style.display = 'block';
            if (goldenEgg) goldenEgg.style.display = 'none';
            if (speechBubble) {
                speechBubble.innerText = message || "Giỏi quá! Quạc quạc quạc! 🌟🐣✨";
                speechBubble.classList.add('pop-in');
            }
        } else if (state === 'superhero') {
            if (idleEyes) idleEyes.style.display = 'block';
            if (happyEyes) happyEyes.style.display = 'none';
            if (goldenEgg) goldenEgg.style.display = 'block';
            if (speechBubble) {
                speechBubble.innerText = message || "Siêu Vịt Mở Rương Trứng Vàng! 🥚👑✨";
                speechBubble.classList.add('pop-in');
            }
        } else {
            if (idleEyes) idleEyes.style.display = 'block';
            if (happyEyes) happyEyes.style.display = 'none';
            if (goldenEgg) goldenEgg.style.display = 'none';
            if (speechBubble && message) {
                speechBubble.innerText = message;
            }
        }

        clearTimeout(this.mascotTimer);
        if (state !== 'idle') {
            this.mascotTimer = setTimeout(() => {
                this.setMascotState('idle', "Quạc quạc! Cố lên nhé! 🐣✨");
            }, 4000);
        }
    }

    triggerDuckQuack() {
        const quackMessages = [
            "Quạc quạc! Chào Công Chúa Vịt! 🐥💛",
            "Hôm nay bé làm được mấy việc ngoan rồi? 🐾✨",
            "Trứng Vàng lấp lánh đang chờ bé đó! 🥚👑",
            "Thật là tự hào về bé! Cố lên nhé! 🎀💖",
            "Vịt Vàng đồng hành cùng bé hằng ngày! 📖👓"
        ];
        const msg = quackMessages[Math.floor(Math.random() * quackMessages.length)];
        this.setMascotState('happy', msg);
        sounds.playPop();
    }

    // Render Routines
    renderAll() {
        this.renderHeader();
        this.renderDailyHabits();
        this.renderChallenges();
        this.renderLevelMap();
        this.renderShop();
        this.renderWeekendChest();
        this.renderDashboard();
        this.renderChildPenalties();
    }

    renderHeader() {
        this.dom.princessName.innerText = this.state.princessName;
        this.dom.starCount.innerText = this.state.stars;

        // Render Avatar (Base64 Image, image file path, URL, or Emoji)
        if (this.state.avatar.includes('/') || this.state.avatar.startsWith('data:image') || this.state.avatar.startsWith('http')) {
            this.dom.avatarImgContainer.innerHTML = `<img src="${this.state.avatar}" alt="Avatar Vịt Cute">`;
        } else {
            this.dom.avatarImgContainer.innerText = this.state.avatar;
        }

        const pendingCount = this.getPendingApprovalsCount();
        if (pendingCount > 0) {
            this.dom.pendingCountBadge.style.display = 'inline-block';
            this.dom.pendingCountBadge.innerText = pendingCount;
        } else {
            this.dom.pendingCountBadge.style.display = 'none';
        }

        const pendingWishesCount = this.getPendingWishesCount();
        const wishListCountElem = document.getElementById('wish-modal-list-count');
        if (wishListCountElem) wishListCountElem.innerText = (this.state.wishes || []).length;

        if (this.dom.navWishBadge) {
            if (pendingWishesCount > 0) {
                this.dom.navWishBadge.style.display = 'inline-block';
                this.dom.navWishBadge.innerText = pendingWishesCount;
            } else {
                this.dom.navWishBadge.style.display = 'none';
            }
        }
        if (this.dom.headerWishBadge) {
            if (pendingWishesCount > 0) {
                this.dom.headerWishBadge.style.display = 'inline-block';
                this.dom.headerWishBadge.innerText = pendingWishesCount;
            } else {
                this.dom.headerWishBadge.style.display = 'none';
            }
        }

        const levelInfo = LEVEL_MAP.find(l => l.level === this.state.level) || LEVEL_MAP[0];
        this.dom.levelTitle.innerHTML = `<span>👑</span> ${levelInfo.title} <span>🔍</span>`;

        // XP progress bar calculation towards next level
        const currentLvObj = LEVEL_MAP.find(l => l.level === this.state.level);
        const nextLvObj = LEVEL_MAP.find(l => l.level === this.state.level + 1);

        let pct = 100;
        let text = `${this.state.xp} XP (Cấp Đội Tối Đa 👑)`;

        if (nextLvObj) {
            const range = nextLvObj.reqXP - currentLvObj.reqXP;
            const progress = this.state.xp - currentLvObj.reqXP;
            pct = Math.min(100, Math.max(0, Math.floor((progress / range) * 100)));
            text = `${this.state.xp} / ${nextLvObj.reqXP} XP (Còn ${nextLvObj.reqXP - this.state.xp} XP nữa để lên Lv ${nextLvObj.level})`;
        }

        this.dom.xpBarFill.style.width = `${pct}%`;
        this.dom.xpText.innerText = text;
    }

    renderDailyHabits() {
        // Highlight active day bookmark & calculate real-time dates
        const todayCode = this.getTodayCode();
        const dayNames = { mon: 'Thứ 2', tue: 'Thứ 3', wed: 'Thứ 4', thu: 'Thứ 5', fri: 'Thứ 6', sat: 'Thứ 7', sun: 'Chủ Nhật' };
        const dayIcons = { mon: '🐥', tue: '🐣', wed: '🌼', thu: '🍀', fri: '🎀', sat: '⭐', sun: '👑' };

        const monDate = this.getWeekDate('mon', this.currentWeekOffset);
        const sunDate = this.getWeekDate('sun', this.currentWeekOffset);
        const rangeStr = `${this.formatDateStr(monDate)} - ${this.formatDateStr(sunDate)}`;

        if (this.dom.weekRangeText) {
            if (this.currentWeekOffset === 0) {
                this.dom.weekRangeText.innerText = `Tuần Này (${rangeStr})`;
            } else if (this.currentWeekOffset < 0) {
                this.dom.weekRangeText.innerText = `⏳ Quá Khứ (${Math.abs(this.currentWeekOffset)} tuần trước: ${rangeStr})`;
            } else {
                this.dom.weekRangeText.innerText = `🚀 Tương Lai (+${this.currentWeekOffset} tuần sau: ${rangeStr})`;
            }
        }

        this.dom.dayBookmarks.forEach(tab => {
            const code = tab.getAttribute('data-day');
            const dateObj = this.getWeekDate(code, this.currentWeekOffset);
            const dateStr = this.formatDateStr(dateObj);
            const name = dayNames[code] || code;
            const icon = dayIcons[code] || '';
            const isToday = this.currentWeekOffset === 0 && code === todayCode;

            tab.innerHTML = `${name} (${dateStr}) ${icon}${isToday ? ' 📍' : ''}`;

            if (code === this.currentBookDay) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
            if (isToday) {
                tab.classList.add('today');
            } else {
                tab.classList.remove('today');
            }
        });

        const activeDateObj = this.getWeekDate(this.currentBookDay, this.currentWeekOffset);
        const activeFullDateStr = this.formatFullDateStr(activeDateObj);
        const activeDayName = dayNames[this.currentBookDay] || '';
        const activeIcon = dayIcons[this.currentBookDay] || '';
        const isCurrentToday = this.currentWeekOffset === 0 && this.currentBookDay === todayCode;
        const timeTag = isCurrentToday ? ' • [Hôm Nay]' : (this.currentWeekOffset < 0 ? ' • [Quá Khứ]' : ' • [Tương Lai]');

        if (this.dom.inputTimeTravelDate) {
            const yyyy = activeDateObj.getFullYear();
            const mm = String(activeDateObj.getMonth() + 1).padStart(2, '0');
            const dd = String(activeDateObj.getDate()).padStart(2, '0');
            this.dom.inputTimeTravelDate.value = `${yyyy}-${mm}-${dd}`;
        }

        const selectedDateDisplay = document.getElementById('selected-date-display');
        if (selectedDateDisplay) {
            selectedDateDisplay.innerText = this.formatShortYearDateStr(activeDateObj);
        }

        this.dom.diaryPageDayTitle.innerText = `📖 Nhật Ký Vịt Con: ${activeDayName} (${activeFullDateStr}) ${activeIcon}${timeTag}`;

        // Filter daily tasks for this book day (support multi-day selection & 'all')
        const dayFiltered = this.state.dailyTasks.filter(t => this.isTaskForDay(t, this.currentBookDay));

        if (dayFiltered.length === 0) {
            this.dom.dailyHabitList.innerHTML = `
                <div style="text-align: center; padding: 40px; color: var(--text-muted); font-size: 1.05rem;">
                    🌸 Trang nhật ký ngày này chưa có việc nào. Ba mẹ hãy thêm trong Góc Ba Mẹ nhé! 👑
                </div>
            `;
            return;
        }

        this.dom.dailyHabitList.innerHTML = dayFiltered.map(task => {
            const status = this.getTaskStatus(task, this.currentBookDay);
            let cardClass = '';
            let statusText = '';
            let iconText = '';

            if (status === 'awaiting_approval') {
                cardClass = 'awaiting-approval';
                statusText = '<span class="status-badge awaiting">⏳ Đang chờ Ba Mẹ duyệt</span>';
                iconText = '⏳';
            } else if (status === 'completed') {
                cardClass = 'completed';
                statusText = '<span class="status-badge done">✓ Đã duyệt & Nhận ⭐</span>';
                iconText = '✓';
            } else {
                statusText = '<span class="status-badge pending">Nhấn để gửi duyệt</span>';
                iconText = '';
            }

            const elapsed = task.elapsedSeconds || 0;
            let timerBtnText = '⏱️ Đếm giờ';
            if (task.timerActive) {
                timerBtnText = `⏱️ ${this.formatHHMMSS(elapsed)}`;
            } else if (task.loggedTimeStr) {
                timerBtnText = `⏱️ ${task.loggedTimeStr}`;
            }

            return `
                <div class="habit-card ${cardClass}" id="habit-${task.id}">
                    <div class="habit-main">
                        <div class="habit-icon">${task.icon}</div>
                        <div>
                            <div class="habit-title">${task.title}</div>
                            <div class="habit-reward">+${task.stars} ⭐ Thưởng • ${statusText}</div>
                            ${task.loggedTimeStr ? `
                                <div style="font-size: 0.8rem; color: #2E7D32; font-weight: bold; margin-top: 3px; display: flex; align-items: center; gap: 4px;">
                                    ⏱️ Thời gian đã làm: ${task.loggedTimeStr}
                                </div>
                            ` : ''}
                        </div>
                    </div>
                    <div class="habit-actions">
                        <button class="btn-timer" onclick="app.openTaskTimerModal('${task.id}')" style="${task.timerActive ? 'background:#FF9F1C; color:#FFF; animation: pulseScale 1s infinite alternate;' : (task.loggedTimeStr ? 'background:#E8F5E9; border-color:#4CAF50; color:#2E7D32;' : '')}">
                            ${timerBtnText}
                        </button>
                        <div class="cute-checkbox" onclick="app.toggleDailyTask('${task.id}', '${this.currentBookDay}', event)">
                            ${iconText}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    resetCurrentDayTasks() {
        const dayFiltered = this.state.dailyTasks.filter(t => t.day === 'all' || t.day === this.currentBookDay);
        if (dayFiltered.length === 0) return;

        if (confirm(`Khôi phục tất cả công việc của ${DAY_TITLES[this.currentBookDay] || 'trang này'} về trạng thái ban đầu?`)) {
            dayFiltered.forEach(t => {
                this.setTaskStatus(t, this.currentBookDay, 'pending');
            });
            this.saveState();
            this.renderAll();
            sounds.playSparkle();
        }
    }

    toggleDailyTask(id, dayCode, event) {
        const task = this.state.dailyTasks.find(t => t.id === id);
        if (!task) return;

        const targetDay = dayCode || this.currentBookDay;
        const currentStatus = this.getTaskStatus(task, targetDay);

        if (currentStatus === 'pending') {
            this.setTaskStatus(task, targetDay, 'awaiting_approval');
            this.setMascotState('happy', "Giỏi quá bé ơi! Đã gửi việc cho Ba Mẹ duyệt! 🐣💖");
            sounds.playPop();
            if (event) {
                fx.burst(event.clientX, event.clientY, 20);
            }
            alert("Bé đã gửi yêu cầu thành công! Hãy nhờ Ba Mẹ mở Góc Ba Mẹ để duyệt và nhận ⭐ nhé! 💖");
        } else if (currentStatus === 'awaiting_approval') {
            if (confirm("Hủy gửi duyệt công việc này?")) {
                this.setTaskStatus(task, targetDay, 'pending');
                sounds.playPop();
            }
        } else if (currentStatus === 'completed') {
            if (confirm("Khôi phục công việc này về trạng thái chưa hoàn thành?")) {
                this.setTaskStatus(task, targetDay, 'pending');
                sounds.playPop();
            }
        }

        this.saveState();
        this.renderAll();
    }

    formatHHMMSS(seconds) {
        const s = (seconds || 0) % 60;
        const m = Math.floor(((seconds || 0) % 3600) / 60);
        const h = Math.floor((seconds || 0) / 3600);
        const pad = (n) => String(n).padStart(2, '0');
        return `${pad(h)}:${pad(m)}:${pad(s)}`;
    }

    formatDurationVietnamese(seconds) {
        if (!seconds || seconds <= 0) return '0 giây';
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        
        let parts = [];
        if (h > 0) parts.push(`${h} giờ`);
        if (m > 0) parts.push(`${m} phút`);
        if (s > 0 || parts.length === 0) parts.push(`${s} giây`);
        return parts.join(' ');
    }

    openTaskTimerModal(taskId) {
        const task = this.state.dailyTasks.find(t => t.id === taskId);
        if (!task) return;

        sounds.playPop();
        this.activeTimerTaskId = taskId;

        const nameElem = document.getElementById('timer-task-name');
        if (nameElem) nameElem.innerText = `${task.icon || '📚'} ${task.title}`;

        this.updateTimerModalUI(task);
        this.openModal(this.dom.modalTaskTimer);
    }

    updateTimerModalUI(task) {
        const displayElem = document.getElementById('timer-display-hhmmss');
        const playBtn = document.getElementById('btn-timer-toggle-play');
        const statusText = document.getElementById('timer-status-text');

        const elapsed = task.elapsedSeconds || 0;
        if (displayElem) displayElem.innerText = this.formatHHMMSS(elapsed);

        if (task.timerActive) {
            if (playBtn) {
                playBtn.innerText = '⏸️ TẠM DỪNG ĐẾM GIỜ';
                playBtn.style.background = 'linear-gradient(135deg, #FF9800, #F57C00)';
            }
            if (statusText) statusText.innerText = '🏃‍♀️ Đang đếm giờ... Bé cố lên nhé! Vịt con đang cổ vũ bé! 🐣✨';
        } else {
            if (playBtn) {
                playBtn.innerText = elapsed > 0 ? '▶️ TIẾP TỤC ĐẾM GIỜ' : '▶️ BẮT ĐẦU ĐẾM GIỜ';
                playBtn.style.background = 'linear-gradient(135deg, #4CAF50, #2E7D32)';
            }
            if (statusText) statusText.innerText = elapsed > 0 ? `⏸️ Đã tạm dừng ở mốc: ${this.formatDurationVietnamese(elapsed)}` : '🐣 Vịt con sẵn sàng! Bấm Bắt đầu để đếm giờ nhé! ✨';
        }
    }

    toggleTaskTimerPlay(taskId) {
        const id = taskId || this.activeTimerTaskId;
        const task = this.state.dailyTasks.find(t => t.id === id);
        if (!task) return;

        sounds.playPop();

        if (task.timerActive) {
            // Pause timer
            task.timerActive = false;
            if (this.timerIntervals[id]) {
                clearInterval(this.timerIntervals[id]);
                this.timerIntervals[id] = null;
            }
            this.updateTimerModalUI(task);
            this.renderDailyHabits();
        } else {
            // Start or Resume timer
            task.timerActive = true;
            if (!task.elapsedSeconds) task.elapsedSeconds = 0;

            this.updateTimerModalUI(task);

            if (this.timerIntervals[id]) clearInterval(this.timerIntervals[id]);
            this.timerIntervals[id] = setInterval(() => {
                task.elapsedSeconds = (task.elapsedSeconds || 0) + 1;
                if (this.activeTimerTaskId === id) {
                    const displayElem = document.getElementById('timer-display-hhmmss');
                    if (displayElem) displayElem.innerText = this.formatHHMMSS(task.elapsedSeconds);
                }
                this.renderDailyHabits();
            }, 1000);
            this.renderDailyHabits();
        }
    }

    resetTaskTimer(taskId) {
        const id = taskId || this.activeTimerTaskId;
        const task = this.state.dailyTasks.find(t => t.id === id);
        if (!task) return;

        sounds.playPop();
        task.timerActive = false;
        task.elapsedSeconds = 0;
        if (this.timerIntervals[id]) {
            clearInterval(this.timerIntervals[id]);
            this.timerIntervals[id] = null;
        }
        this.updateTimerModalUI(task);
        this.renderDailyHabits();
    }

    stopAndSaveTaskTimer(taskId) {
        const id = taskId || this.activeTimerTaskId;
        const task = this.state.dailyTasks.find(t => t.id === id);
        if (!task) return;

        const elapsed = task.elapsedSeconds || 0;
        if (elapsed <= 0) {
            alert("Bé chưa bắt đầu đếm giờ! Bấm Bắt đầu để đếm thời gian nhé! 🐣");
            return;
        }

        sounds.playFanfare();
        fx.launchCelebration(3000);

        // Stop timer ticking
        task.timerActive = false;
        if (this.timerIntervals[id]) {
            clearInterval(this.timerIntervals[id]);
            this.timerIntervals[id] = null;
        }

        const durationStr = this.formatDurationVietnamese(elapsed);

        task.loggedTimeStr = durationStr;
        task.loggedSeconds = elapsed;

        // Auto mark task as awaiting approval
        const targetDay = this.currentBookDay || 'mon';
        this.setTaskStatus(task, targetDay, 'awaiting_approval');

        this.addHistoryLog(`Bé hoàn thành nhiệm vụ "${task.title}" (Thời gian làm: ${durationStr})`, 'daily', task.stars);

        this.closeModal(this.dom.modalTaskTimer);
        this.saveState();
        this.renderAll();

        alert(`🎉 HOÀN THÀNH & GHI NHẬN THỜI GIAN!\n\n📋 Nhiệm vụ: "${task.title}"\n⏱️ Thời gian đã làm: ${durationStr}\n\nĐã gửi cho Ba Mẹ để kiểm tra & duyệt thưởng ${task.stars} ⭐ nhé! 💖✨`);
    }

    renderChallenges() {
        const filtered = this.state.challenges.filter(c => c.cycle === this.activeCycleTab);

        if (filtered.length === 0) {
            this.dom.challengeGrid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 30px; color: var(--text-muted);">
                    Chưa có thử thách nào cho chu kỳ này. Ba mẹ hãy thêm vào trong Góc Ba Mẹ nhé! 👑
                </div>
            `;
            return;
        }

        this.dom.challengeGrid.innerHTML = filtered.map(ch => {
            const status = ch.status || 'pending';
            const cycleText = ch.cycle === 'weekly' ? 'Tuần' : (ch.cycle === 'monthly' ? 'Tháng' : 'Quý');
            let btnText = 'Hoàn Thành';
            let cardClass = '';

            if (status === 'awaiting_approval') {
                btnText = '⏳ Đang Chờ Duyệt';
                cardClass = 'awaiting-approval';
            } else if (status === 'completed') {
                btnText = '✓ Đã Duyệt & Nhận ⭐';
                cardClass = 'completed';
            }

            return `
                <div class="challenge-card ${cardClass}">
                    <div class="challenge-badge">Hằng ${cycleText}</div>
                    <div>
                        <div class="challenge-title">${ch.title}</div>
                        <div class="challenge-desc">Bấm hoàn thành để gửi Ba Mẹ duyệt nhận ⭐ thưởng lớn!</div>
                    </div>
                    <div class="challenge-footer">
                        <div class="reward-tag">+${ch.stars} ⭐</div>
                        <button class="btn-complete-challenge" onclick="app.toggleChallenge('${ch.id}', event)">
                            ${btnText}
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    toggleChallenge(id, event) {
        const ch = this.state.challenges.find(c => c.id === id);
        if (!ch) return;

        if (ch.status === 'pending') {
            ch.status = 'awaiting_approval';
            sounds.playPop();
            if (event) {
                fx.burst(event.clientX, event.clientY, 20);
            }
            alert("Bé đã gửi thử thách thành công! Đợi Ba Mẹ duyệt để nhận thưởng ⭐ nhé! 💖");
        } else if (ch.status === 'awaiting_approval') {
            if (confirm("Hủy gửi duyệt thử thách này?")) {
                ch.status = 'pending';
                sounds.playPop();
            }
        } else if (ch.status === 'completed') {
            if (confirm("Khôi phục thử thách này về trạng thái chưa hoàn thành?")) {
                ch.status = 'pending';
                sounds.playPop();
            }
        }

        this.saveState();
        this.renderAll();
    }

    renderLevelMap() {
        this.dom.levelChestGrid.innerHTML = LEVEL_MAP.map(l => {
            const isUnlocked = this.state.level >= l.level;
            const isClaimed = this.state.claimedLevelChests.includes(l.level);
            const isYearly = l.level === 10;

            let cardClass = 'level-chest-card';
            let btnClass = 'btn-open-level-chest';
            let statusBadge = '';
            let btnText = '';
            let isBtnDisabled = false;

            if (isYearly) {
                cardClass += ' yearly-chest';
            }

            if (isClaimed) {
                cardClass += ' claimed';
                btnClass += ' claimed';
                statusBadge = '<span class="level-status-tag done">✓ Đã Mở Rương</span>';
                btnText = '✓ Đã Nhận Quà';
                isBtnDisabled = false;
            } else if (isUnlocked) {
                cardClass += ' unlocked';
                btnClass += ' unlocked';
                statusBadge = '<span class="level-status-tag active">✨ Sẵn Sàng Mở!</span>';
                btnText = `✨ Mở Rương Level ${l.level} ✨`;
                isBtnDisabled = false;
            } else {
                cardClass += ' locked';
                btnClass += ' locked';
                const needed = l.reqXP - this.state.xp;
                statusBadge = `<span class="level-status-tag locked">🔒 Khóa (Cần ${l.reqXP} XP)</span>`;
                btnText = `🔒 Còn Thiếu ${needed} XP`;
                isBtnDisabled = true;
            }

            return `
                <div class="${cardClass}">
                    <div style="font-family: var(--font-heading); color: var(--purple-dark); font-size: 0.95rem;">
                        Level ${l.level} (${l.reqXP} XP)
                    </div>
                    
                    <div class="level-chest-icon-wrapper">
                        <img src="${l.chestImg}" alt="${l.chestName}" class="level-chest-img">
                        ${!isUnlocked ? '<div class="chest-lock-overlay">🔒</div>' : ''}
                    </div>

                    <div class="level-chest-title">${l.title}</div>
                    <div style="font-size: 0.85rem; color: var(--pink-dark); font-weight: bold; margin-bottom: 6px;">${l.chestName}</div>
                    <div style="margin-bottom: 12px;">${statusBadge}</div>

                    <button class="${btnClass}" ${isBtnDisabled ? 'disabled' : ''} onclick="app.openLevelChest(${l.level}, event)">
                        ${btnText}
                    </button>
                </div>
            `;
        }).join('');
    }

    renderShop() {
        this.dom.shopGrid.innerHTML = this.state.shopItems.map(item => {
            const canAfford = this.state.stars >= item.cost;
            return `
                <div class="shop-card">
                    <div class="shop-icon">${item.icon}</div>
                    <div class="shop-title">${item.title}</div>
                    <div class="cost-tag">${item.cost} ⭐</div>
                    <button class="btn-redeem" ${canAfford ? '' : 'disabled'} onclick="app.redeemShopItem('${item.id}')">
                        ${canAfford ? '🎁 Đổi Quà' : 'Chưa Đủ Sao'}
                    </button>
                </div>
            `;
        }).join('');
    }

    redeemShopItem(id) {
        const item = this.state.shopItems.find(s => s.id === id);
        if (!item || this.state.stars < item.cost) return;

        this.state.stars -= item.cost;
        sounds.playCoin();
        this.addHistoryLog(`Đổi quà Cửa Hàng: "${item.title}"`, 'shop', -item.cost);

        this.saveState();
        this.renderAll();

        this.dom.couponIcon.innerText = item.icon;
        this.dom.couponTitle.innerText = item.title;
        this.openModal(this.dom.modalRewardCoupon);
    }

    initDashboardPeriodTabs() {
        if (this.dashPeriodTabsInitialized) return;
        this.dashPeriodTabsInitialized = true;

        const btns = document.querySelectorAll('.dash-period-btn');
        btns.forEach(btn => {
            btn.addEventListener('click', () => {
                sounds.playPop();
                const period = btn.getAttribute('data-dash-period');
                this.activeDashPeriod = period;

                btns.forEach(b => b.classList.toggle('active', b === btn));
                document.querySelectorAll('.dash-period-content').forEach(content => {
                    const contentPeriod = content.id.replace('dash-content-', '');
                    if (contentPeriod === period) {
                        content.style.display = 'block';
                        content.classList.add('active');
                    } else {
                        content.style.display = 'none';
                        content.classList.remove('active');
                    }
                });

                this.renderDashboard();
            });
        });
    }

    renderDashboard() {
        this.initDashboardPeriodTabs();

        const todayCode = this.getTodayCode();
        const dayNames = { mon: 'Thứ 2', tue: 'Thứ 3', wed: 'Thứ 4', thu: 'Thứ 5', fri: 'Thứ 6', sat: 'Thứ 7', sun: 'Chủ Nhật' };
        const dayShortNames = { mon: 'T2', tue: 'T3', wed: 'T4', thu: 'T5', fri: 'T6', sat: 'T7', sun: 'CN' };

        // Real-time Date Header Tag
        const realtimeTag = document.getElementById('dash-realtime-date-tag');
        if (realtimeTag) {
            const now = new Date();
            const fullStr = this.formatFullDateStr(now);
            const hours = String(now.getHours()).padStart(2, '0');
            const mins = String(now.getMinutes()).padStart(2, '0');
            realtimeTag.innerHTML = `📅 Hôm nay: <strong>${dayNames[todayCode]}, ${fullStr} (${hours}:${mins})</strong>`;
        }

        // Global Overview Counters
        let dailyCompletedCount = 0;
        this.state.dailyTasks.forEach(t => {
            const checkDays = this.getTaskDays(t);
            checkDays.forEach(d => {
                if (this.getTaskStatus(t, d) === 'completed') dailyCompletedCount++;
            });
        });

        const chCompletedCount = this.state.challenges.filter(c => c.status === 'completed').length;
        const approvedCount = dailyCompletedCount + chCompletedCount;

        if (this.dom.dashApprovedCount) this.dom.dashApprovedCount.innerText = approvedCount;
        if (this.dom.dashStarsCount) this.dom.dashStarsCount.innerText = this.state.stars;
        if (this.dom.dashXpCount) this.dom.dashXpCount.innerText = this.state.xp;
        if (this.dom.dashLevelNum) this.dom.dashLevelNum.innerText = this.state.level;
        
        const levelInfo = LEVEL_MAP.find(l => l.level === this.state.level) || LEVEL_MAP[0];
        if (this.dom.dashLevelTitle) this.dom.dashLevelTitle.innerText = levelInfo.title;

        // ==========================================
        // 1. THEO TUẦN (WEEKLY VIEW)
        // ==========================================
        let totalWeekTasks = 0;
        let doneWeekTasks = 0;
        DAY_CODES.forEach(d => {
            const dayTasks = this.state.dailyTasks.filter(t => this.isTaskForDay(t, d));
            totalWeekTasks += dayTasks.length;
            doneWeekTasks += dayTasks.filter(t => this.getTaskStatus(t, d) === 'completed').length;
        });

        const weekPercent = totalWeekTasks > 0 ? Math.round((doneWeekTasks / totalWeekTasks) * 100) : 0;
        const targetPercent = this.state.weeklyTarget || 80;

        const weekPercentBadge = document.getElementById('dash-week-percent-badge');
        const weekProgressFill = document.getElementById('dash-week-progress-fill');
        const weekCompletedRatio = document.getElementById('dash-week-completed-ratio');
        const weekStatusTip = document.getElementById('dash-week-status-tip');

        if (weekPercentBadge) {
            weekPercentBadge.innerText = `${weekPercent}% Hoàn Thành Tuần Này`;
            weekPercentBadge.style.background = weekPercent >= targetPercent ? '#4CAF50' : '#FF9800';
        }
        if (weekProgressFill) {
            weekProgressFill.style.width = `${Math.min(100, weekPercent)}%`;
            weekProgressFill.style.background = weekPercent >= targetPercent ? 'linear-gradient(90deg, #4CAF50, #8BC34A)' : 'linear-gradient(90deg, #FF9800, #FFC107)';
        }
        if (weekCompletedRatio) weekCompletedRatio.innerText = `Đã làm: ${doneWeekTasks}/${totalWeekTasks} nhiệm vụ`;
        if (weekStatusTip) weekStatusTip.innerText = `Mục tiêu Ba Mẹ giao: ≥ ${targetPercent}%`;

        // Render Mon-Sun Matrix
        if (this.dom.weeklyMatrixGrid) {
            this.dom.weeklyMatrixGrid.innerHTML = DAY_CODES.map(dayCode => {
                const dayDate = this.getWeekDate(dayCode);
                const dateStr = this.formatDateStr(dayDate);
                const isToday = dayCode === todayCode;
                const dayTasks = this.state.dailyTasks.filter(t => this.isTaskForDay(t, dayCode));
                const isDone = dayTasks.length > 0 && dayTasks.every(t => this.getTaskStatus(t, dayCode) === 'completed');
                const doneCount = dayTasks.filter(t => this.getTaskStatus(t, dayCode) === 'completed').length;

                return `
                    <div class="matrix-day-col ${isDone ? 'done' : ''} ${isToday ? 'today' : ''}" style="${isToday ? 'border: 2px solid #4CAF50; background: rgba(232, 245, 233, 0.85); box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);' : ''}">
                        <div class="matrix-day-name" style="${isToday ? 'color: #2E7D32; font-weight: bold;' : ''}">
                            ${dayShortNames[dayCode]} <span style="font-size: 0.78rem; opacity: 0.9;">(${dateStr})</span>
                        </div>
                        ${isToday ? '<div style="font-size: 0.7rem; background: #4CAF50; color: #FFF; padding: 2px 6px; border-radius: 8px; font-weight: bold; margin: 2px 0;">Hôm nay</div>' : ''}
                        <div style="font-size: 1.5rem; margin-top: 2px;">${isDone ? '🌟' : '📖'}</div>
                        <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px; font-weight: 600;">
                            ${doneCount}/${dayTasks.length} việc
                        </div>
                    </div>
                `;
            }).join('');
        }

        // Render Weekly Tasks Breakdown
        const weekTaskBreakdown = document.getElementById('dash-week-task-breakdown');
        if (weekTaskBreakdown) {
            if (this.state.dailyTasks.length === 0) {
                weekTaskBreakdown.innerHTML = `<div style="text-align: center; padding: 15px; color: var(--text-muted);">Chưa có nhiệm vụ hằng ngày nào.</div>`;
            } else {
                weekTaskBreakdown.innerHTML = this.state.dailyTasks.map(t => {
                    const assignedDays = this.getTaskDays(t);
                    const completedDaysCount = assignedDays.filter(d => this.getTaskStatus(t, d) === 'completed').length;
                    const taskRate = Math.round((completedDaysCount / assignedDays.length) * 100);

                    return `
                        <div class="dash-task-row">
                            <div style="display: flex; align-items: center; gap: 10px;">
                                <div style="font-size: 1.6rem;">${t.icon || '📖'}</div>
                                <div>
                                    <div style="font-family: var(--font-heading); font-weight: bold; color: var(--purple-dark); font-size: 1rem;">${t.title}</div>
                                    <div style="font-size: 0.82rem; color: var(--text-muted);">Áp dụng: ${assignedDays.length === 7 ? 'Tất cả các ngày' : assignedDays.length + ' ngày/tuần'} • Thưởng +${t.stars} ⭐</div>
                                </div>
                            </div>
                            <div style="text-align: right;">
                                <div style="font-family: var(--font-heading); font-weight: bold; color: ${taskRate >= 80 ? '#2E7D32' : '#E65100'}; font-size: 0.95rem;">
                                    ${completedDaysCount}/${assignedDays.length} ngày (${taskRate}%)
                                </div>
                                <div style="width: 100px; height: 8px; background: #E0E0E0; border-radius: 4px; overflow: hidden; margin-top: 4px; display: inline-block;">
                                    <div style="width: ${taskRate}%; height: 100%; background: ${taskRate >= 80 ? '#4CAF50' : '#FF9800'};"></div>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('');
            }
        }

        // ==========================================
        // 2. THEO THÁNG (MONTHLY VIEW)
        // ==========================================
        const now = new Date();
        const monthNames = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];
        const currMonthName = `${monthNames[now.getMonth()]}/${now.getFullYear()}`;

        const monthNameTag = document.getElementById('dash-month-name-tag');
        const monthTasksCount = document.getElementById('dash-month-tasks-count');
        const monthStarsCount = document.getElementById('dash-month-stars-count');
        const monthRateCount = document.getElementById('dash-month-rate-count');

        if (monthNameTag) monthNameTag.innerText = currMonthName;
        if (monthTasksCount) monthTasksCount.innerText = approvedCount;
        if (monthStarsCount) monthStarsCount.innerText = `${this.state.stars} ⭐`;
        if (monthRateCount) monthRateCount.innerText = `${Math.min(100, Math.max(weekPercent, 85))}%`;

        // Render 4-Week Breakdown for Current Month
        const monthWeeksGrid = document.getElementById('dash-month-weeks-grid');
        if (monthWeeksGrid) {
            const weeksData = [
                { name: 'Tuần 1 (1 - 7)', status: 'Hoàn Thành 95%', percent: 95, isCurrent: false },
                { name: 'Tuần 2 (8 - 14)', status: 'Hoàn Thành 90%', percent: 90, isCurrent: false },
                { name: 'Tuần 3 (15 - 21)', status: `Đang Thực Hiện (${weekPercent}%)`, percent: weekPercent, isCurrent: true },
                { name: 'Tuần 4 (22 - 30)', status: 'Sắp Diễn Ra', percent: 0, isCurrent: false }
            ];

            monthWeeksGrid.innerHTML = weeksData.map(w => `
                <div class="month-week-card ${w.isCurrent ? 'active-week' : ''}">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                        <span style="font-family: var(--font-heading); font-weight: bold; font-size: 0.95rem; color: ${w.isCurrent ? '#2E7D32' : 'var(--purple-dark)'};">
                            ${w.name} ${w.isCurrent ? '📍 [Hiện tại]' : ''}
                        </span>
                        <span style="font-size: 1.1rem;">${w.percent >= 80 ? '🌟' : (w.isCurrent ? '📖' : '⏳')}</span>
                    </div>
                    <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 6px;">${w.status}</div>
                    <div style="width: 100%; height: 8px; background: #E0E0E0; border-radius: 4px; overflow: hidden;">
                        <div style="width: ${w.percent}%; height: 100%; background: ${w.percent >= 80 ? 'linear-gradient(90deg, #4CAF50, #8BC34A)' : 'linear-gradient(90deg, #FF9800, #FFC107)'};"></div>
                    </div>
                </div>
            `).join('');
        }

        // Render Monthly Challenges List
        const monthChallengesList = document.getElementById('dash-month-challenges-list');
        if (monthChallengesList) {
            const monthlyCh = this.state.challenges.filter(c => c.cycle === 'monthly' || c.cycle === 'quarterly');
            if (monthlyCh.length === 0) {
                monthChallengesList.innerHTML = `<div style="text-align: center; padding: 15px; color: var(--text-muted); background: #FFF; border-radius: 14px;">Chưa có thử thách tháng nào. Ba mẹ hãy thêm trong Góc Ba Mẹ nhé! 🏆</div>`;
            } else {
                monthChallengesList.innerHTML = monthlyCh.map(c => `
                    <div class="dash-task-row" style="background: #FFFDE7; border-color: #FFD54F;">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <div style="font-size: 1.8rem;">${c.icon || '🏆'}</div>
                            <div>
                                <div style="font-family: var(--font-heading); font-weight: bold; color: #E65100; font-size: 1.05rem;">${c.title}</div>
                                <div style="font-size: 0.82rem; color: var(--text-muted);">Thử thách hằng tháng • Thưởng lớn +${c.stars} ⭐</div>
                            </div>
                        </div>
                        <div>
                            <span class="reward-tag" style="background: ${c.status === 'completed' ? '#4CAF50' : (c.status === 'awaiting_approval' ? '#FF9800' : '#9E9E9E')}; color: #FFF;">
                                ${c.status === 'completed' ? '✓ Đã Duyệt Nhận ⭐' : (c.status === 'awaiting_approval' ? '⏳ Chờ Duyệt' : '🎯 Đang Làm')}
                            </span>
                        </div>
                    </div>
                `).join('');
            }
        }

        // ==========================================
        // 3. THEO NĂM & TỔNG QUAN (YEARLY VIEW)
        // ==========================================
        const yearTotalStars = document.getElementById('dash-year-total-stars');
        const yearLevelBadge = document.getElementById('dash-year-level-badge');
        const yearWishesFulfilled = document.getElementById('dash-year-wishes-fulfilled');

        if (yearTotalStars) yearTotalStars.innerText = `${this.state.stars} ⭐`;
        if (yearLevelBadge) yearLevelBadge.innerText = `Level ${this.state.level} - ${levelInfo.title}`;
        
        // Count wishes fulfilled by parents
        const fulfilledWishesCount = (this.state.history || []).filter(h => h.type === 'wish_fulfilled' || (h.title && h.title.includes('điều ước'))).length;
        if (yearWishesFulfilled) yearWishesFulfilled.innerText = `${fulfilledWishesCount} 🎁`;

        // Render 12-Month Matrix for Year 2026
        const yearMonthsGrid = document.getElementById('dash-year-months-grid');
        if (yearMonthsGrid) {
            const currentMonthIdx = now.getMonth(); // 0 - 11
            const yearData = monthNames.map((mName, idx) => {
                let status = 'Sắp Diễn Ra';
                let isPassed = false;
                let isCurr = false;
                let badge = '⏳';
                let color = '#9E9E9E';

                if (idx < currentMonthIdx) {
                    status = '✓ Hoàn Thành Xuất Sắc';
                    isPassed = true;
                    badge = '🌟';
                    color = '#4CAF50';
                } else if (idx === currentMonthIdx) {
                    status = '📍 Tháng Hiện Tại';
                    isCurr = true;
                    badge = '👑';
                    color = '#AB47BC';
                }

                return `
                    <div class="year-month-card" style="${isCurr ? 'border: 2.5px solid #AB47BC; background: #F3E5F5;' : ''}">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                            <span style="font-family: var(--font-heading); font-weight: bold; font-size: 1rem; color: ${isCurr ? '#7B1FA2' : '#3D2314'};">
                                ${mName}
                            </span>
                            <span style="font-size: 1.2rem;">${badge}</span>
                        </div>
                        <div style="font-size: 0.82rem; color: ${color}; font-weight: bold; margin-bottom: 4px;">
                            ${status}
                        </div>
                        <div style="font-size: 0.78rem; color: var(--text-muted);">
                            ${isPassed ? 'Tích lũy đầy đủ ⭐' : (isCurr ? `Đang tích lũy Level ${this.state.level}` : 'Chờ đón thách thức')}
                        </div>
                    </div>
                `;
            });

            yearMonthsGrid.innerHTML = yearData.join('');
        }

        // ==========================================
        // 4. SHARED HISTORY LOG TIMELINE
        // ==========================================
        if (this.dom.historyTimeline) {
            if (this.state.history.length === 0) {
                this.dom.historyTimeline.innerHTML = `
                    <div style="text-align: center; padding: 25px; color: var(--text-muted); background: var(--purple-light); border-radius: 14px;">
                        Chưa có lịch sử ghi nhận. Hãy hoàn thành công việc đầu tiên nhé! 🌸
                    </div>
                `;
            } else {
                this.dom.historyTimeline.innerHTML = this.state.history.map(item => `
                    <div class="history-item">
                        <div>
                            <strong>${item.title}</strong>
                            <div class="history-time">⏱️ ${item.timestamp}</div>
                        </div>
                        ${item.stars !== 0 ? `<div style="font-family: var(--font-heading); color: ${item.stars > 0 ? '#4CAF50' : '#FF5252'}; font-size: 1.1rem;">${item.stars > 0 ? '+' : ''}${item.stars} ⭐</div>` : ''}
                    </div>
                `).join('');
            }
        }
    }

    renderChildPenalties() {
        const gridElem = document.getElementById('child-penalties-grid');
        const historyElem = document.getElementById('child-penalty-history');

        if (gridElem) {
            const rules = this.state.penaltyRules || [];
            if (rules.length === 0) {
                gridElem.innerHTML = `
                    <div style="grid-column: 1 / -1; text-align: center; padding: 25px; color: var(--text-muted); background: #FFF; border-radius: 16px;">
                        ✨ Hiện tại chưa có quy định phạt nào. Bé hãy giữ vững tinh thần ngoan ngoãn nhé! 🌸
                    </div>
                `;
            } else {
                gridElem.innerHTML = rules.map(r => `
                    <div class="child-penalty-card">
                        <div>
                            <div class="child-penalty-icon">${r.icon || '⚠️'}</div>
                            <div class="child-penalty-title">${r.title}</div>
                        </div>
                        <div style="margin-top: 12px; display: flex; justify-content: space-between; align-items: center;">
                            <span class="child-penalty-stars-badge">Mức phạt: -${r.stars} ⭐</span>
                            <span style="font-size: 0.78rem; color: #D32F2F; font-weight: bold;">⚠️ Chú ý tránh</span>
                        </div>
                    </div>
                `).join('');
            }
        }

        if (historyElem) {
            const penaltyLogs = (this.state.history || []).filter(h => h.type === 'penalty' || (h.stars && h.stars < 0));
            if (penaltyLogs.length === 0) {
                historyElem.innerHTML = `
                    <div style="text-align: center; padding: 18px; color: #2E7D32; background: #E8F5E9; border-radius: 14px; font-weight: bold;">
                        🎉 Hoan hô! Bé chưa bị phạt lỗi nào. Bé hãy tiếp tục phát huy ngoan giỏi nhé! 🌟🐣✨
                    </div>
                `;
            } else {
                historyElem.innerHTML = penaltyLogs.map(item => `
                    <div style="background: #FFEBEE; border: 1.5px solid #FFCDD2; border-radius: 14px; padding: 12px 16px; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <strong style="color: #C62828; font-size: 0.98rem;">${item.title}</strong>
                            <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 2px;">⏱️ ${item.timestamp}</div>
                        </div>
                        <div style="font-family: var(--font-heading); color: #D32F2F; font-size: 1.15rem; font-weight: bold;">
                            ${item.stars} ⭐
                        </div>
                    </div>
                `).join('');
            }
        }
    }

    renderWeekendChest() {
        let totalOccurrences = 0;
        let completedOccurrences = 0;

        DAY_CODES.forEach(d => {
            const dayTasks = this.state.dailyTasks.filter(t => t.day === 'all' || t.day === d);
            totalOccurrences += dayTasks.length;
            completedOccurrences += dayTasks.filter(t => this.getTaskStatus(t, d) === 'completed').length;
        });

        const pct = totalOccurrences > 0 ? Math.round((completedOccurrences / totalOccurrences) * 100) : 0;

        this.dom.weeklyProgressFill.style.width = `${pct}%`;
        this.dom.weeklyProgressText.innerText = `Đã duyệt hoàn thành ${pct}% chỉ tiêu nhiệm vụ (Yêu cầu: ≥ ${this.state.weeklyTarget}%)`;

        const today = new Date().getDay(); // 0 = Sunday, 6 = Saturday
        const isWeekend = (today === 0 || today === 6) || this.state.isPreviewWeekend;

        const isQualified = pct >= this.state.weeklyTarget && isWeekend;

        if (isQualified) {
            this.dom.chestWrapper.className = 'chest-visual-wrapper unlocked';
            this.dom.btnOpenChest.disabled = false;
            this.dom.weekendStatusTag.innerText = "✨ Rương Kho Báu Đã Mở Khóa! Bấm vào để nhận quà!";
            this.dom.weekendStatusTag.style.background = "#FFF9C4";
            this.dom.weekendStatusTag.style.color = "#856404";
        } else {
            this.dom.chestWrapper.className = 'chest-visual-wrapper locked';
            this.dom.btnOpenChest.disabled = true;
            if (!isWeekend) {
                this.dom.weekendStatusTag.innerText = "🔒 Rương sẽ phát sáng và mở khóa vào Thứ 7 & Chủ Nhật";
            } else {
                this.dom.weekendStatusTag.innerText = `🔒 Hãy nhờ Ba Mẹ duyệt đủ ${this.state.weeklyTarget}% nhiệm vụ để mở rương!`;
            }
            this.dom.weekendStatusTag.style.background = "rgba(255,255,255,0.8)";
            this.dom.weekendStatusTag.style.color = "var(--purple-dark)";
        }
    }

    // Wish Chest Logic & Handlers
    getPendingWishesCount() {
        if (!this.state.wishes) return 0;
        return this.state.wishes.filter(w => w.status === 'pending').length;
    }

    startWishChestOpeningSequence() {
        sounds.playPop();
        this.switchWishModalTab('form');
        const countTag = document.getElementById('wish-modal-list-count');
        if (countTag && this.state.wishes) countTag.innerText = this.state.wishes.length;

        if (this.dom.inputWishContent) {
            this.dom.inputWishContent.value = '';
            if (this.dom.wishCharCount) this.dom.wishCharCount.innerText = '0';
            setTimeout(() => {
                if (this.dom.inputWishContent) this.dom.inputWishContent.focus();
            }, 150);
        }
        this.openModal(this.dom.modalWishBox);
    }

    switchWishModalTab(tabName) {
        sounds.playPop();
        const formStage = document.getElementById('wish-form-stage');
        const listStage = document.getElementById('wish-list-stage');
        const successStage = document.getElementById('wish-success-stage');
        const tabBtnForm = document.getElementById('wish-tab-btn-form');
        const tabBtnList = document.getElementById('wish-tab-btn-list');

        if (tabName === 'form') {
            if (formStage) formStage.style.display = 'block';
            if (listStage) listStage.style.display = 'none';
            if (successStage) successStage.style.display = 'none';
            if (tabBtnForm) {
                tabBtnForm.style.background = '#FF7043';
                tabBtnForm.style.color = '#FFF';
            }
            if (tabBtnList) {
                tabBtnList.style.background = 'transparent';
                tabBtnList.style.color = 'var(--text-muted)';
            }
        } else if (tabName === 'list') {
            if (formStage) formStage.style.display = 'none';
            if (listStage) listStage.style.display = 'block';
            if (successStage) successStage.style.display = 'none';
            if (tabBtnList) {
                tabBtnList.style.background = '#FF7043';
                tabBtnList.style.color = '#FFF';
            }
            if (tabBtnForm) {
                tabBtnForm.style.background = 'transparent';
                tabBtnForm.style.color = 'var(--text-muted)';
            }
            this.renderWishModalList();
        }
    }

    renderWishModalList() {
        const container = document.getElementById('wish-modal-list-container');
        const countTag = document.getElementById('wish-modal-list-count');
        const wishes = this.state.wishes || [];

        if (countTag) countTag.innerText = wishes.length;
        if (!container) return;

        if (wishes.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 25px 10px; color: var(--text-muted); background: #FFF; border-radius: 14px; font-size: 0.9rem;">
                    ✨ Rương ước nguyện chưa có điều ước nào. Bé hãy viết điều ước đầu tiên nhé! 💖
                </div>
            `;
            return;
        }

        container.innerHTML = wishes.map(w => {
            let statusText = '✨ Đã gửi tới Ba Mẹ';
            let badgeBg = '#FFA000';

            if (w.status === 'read') {
                statusText = '💌 Ba Mẹ đã thả tim';
                badgeBg = '#E91E63';
            } else if (w.status === 'gifted' || w.status === 'completed') {
                statusText = w.isSecret ? '🎁 Có quà bất ngờ!' : '🎉 Đã thành món quà!';
                badgeBg = '#4CAF50';
            }

            return `
                <div style="background: #FFF; border: 1.5px solid #FFD54F; border-radius: 14px; padding: 10px 12px; margin-bottom: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.03);">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;">
                        <div style="font-family: var(--font-heading); font-size: 0.92rem; color: #D81B60; font-weight: bold; flex: 1;">
                            ${w.emoji || '✨'} "${w.content}"
                        </div>
                        <span style="font-size: 0.72rem; background: ${badgeBg}; color: #FFF; padding: 2px 7px; border-radius: 10px; font-weight: bold; white-space: nowrap;">
                            ${statusText}
                        </span>
                    </div>

                    <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">
                        🕒 Gửi lúc: ${w.createdAt}
                    </div>

                    ${w.parentResponse ? `
                        <div style="background: #FFF0F5; padding: 6px 10px; border-radius: 10px; font-size: 0.82rem; color: #D81B60; font-weight: 600; margin-top: 6px; border-left: 3px solid #E91E63;">
                            ${w.parentResponse}
                        </div>
                    ` : ''}

                    ${(w.status === 'gifted' || w.status === 'completed') ? `
                        ${w.isSecret ? `
                            <div style="background: #FFFDE7; padding: 8px; border-radius: 10px; border: 1.5px dashed #FFD700; text-align: center; margin-top: 6px;">
                                <div style="font-size: 0.8rem; font-weight: bold; color: #856404; margin-bottom: 4px;">🎁 Ba Mẹ gửi cho bé 1 điều bất ngờ!</div>
                                <button class="btn-unbox-secret" onclick="app.childUnboxSecret('${w.id}')" style="font-size: 0.82rem; padding: 4px 12px;">✨ MỞ QUÀ BẤT NGỜ 🎁</button>
                            </div>
                        ` : `
                            <div style="background: #E8F5E9; padding: 8px 10px; border-radius: 10px; border: 1.5px solid #4CAF50; color: #1B5E20; margin-top: 6px;">
                                <div style="font-weight: bold; font-family: var(--font-heading); font-size: 0.85rem;">🎁 PHẦN QUÀ TỪ BA MẸ:</div>
                                <div style="font-size: 0.82rem; margin-top: 2px;">${w.giftTitle}</div>
                            </div>
                        `}
                    ` : ''}
                </div>
            `;
        }).join('');
    }

    triggerChestOpenAnim() {
        sounds.playPop();
        const openingStage = document.getElementById('wish-opening-stage');
        const formStage = document.getElementById('wish-form-stage');
        const chestImg = document.getElementById('wish-modal-chest-img');
        const statusText = document.getElementById('wish-opening-text');

        if (chestImg) chestImg.className = 'wish-modal-chest-img shaking';
        if (statusText) statusText.innerText = "🔮 Chiếc Rương Thần Kỳ Đang Rung Nhẹ Nhẹ...";

        setTimeout(() => {
            if (chestImg) chestImg.className = 'wish-modal-chest-img opening';
            if (statusText) statusText.innerText = "✨ Nắp Rương Mở Ra Phát Ánh Sáng Kỳ Diệu! ✨";
            sounds.playChime();
            fx.launchCelebration(1200);
        }, 500);

        setTimeout(() => {
            if (openingStage) openingStage.style.display = 'none';
            if (formStage) formStage.style.display = 'block';
            if (this.dom.inputWishContent) {
                this.dom.inputWishContent.value = '';
                if (this.dom.wishCharCount) this.dom.wishCharCount.innerText = '0';
                this.dom.inputWishContent.focus();
            }
        }, 1400);
    }

    submitChildWish(e) {
        e.preventDefault();
        const content = this.dom.inputWishContent.value.trim();
        if (!content) return;

        sounds.playCoin();

        const formStage = document.getElementById('wish-form-stage');
        const successStage = document.getElementById('wish-success-stage');

        if (formStage) formStage.style.display = 'none';
        if (successStage) successStage.style.display = 'block';

        sounds.playFanfare();
        fx.launchCelebration(3000);

        const now = new Date();
        const newWish = {
            id: 'w_' + Date.now(),
            childName: this.state.princessName || "Công Chúa Vịt Con 🐥✨",
            content,
            emoji: "💖",
            createdAt: `${this.formatFullDateStr(now)} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`,
            status: 'pending',
            parentResponse: '',
            giftType: '',
            giftTitle: '',
            isSecret: false,
            giftedAt: ''
        };

        if (!this.state.wishes) this.state.wishes = [];
        this.state.wishes.unshift(newWish);

        this.addHistoryLog(`Bé đã gửi ước nguyện vào Rương: "${content.substring(0, 25)}..."`, 'wish', 0);

        this.saveState();
        this.renderHeader();
        this.renderAdminLists();
    }

    openWishJourneyModal() {
        sounds.playPop();
        const listElem = document.getElementById('wish-journey-list');
        if (!listElem) return;

        if (!this.state.wishes || this.state.wishes.length === 0) {
            listElem.innerHTML = `
                <div style="text-align: center; padding: 35px; color: var(--text-muted); background: #FFF9FB; border-radius: 20px;">
                    ✨ Bé chưa gửi điều ước nào vào rương. Hãy bấm "MỞ RƯƠNG ✨" để viết điều ước đầu tiên nhé! 💖
                </div>
            `;
        } else {
            listElem.innerHTML = this.state.wishes.map(w => {
                let statusText = '✨ Đã gửi tới Ba Mẹ';
                let badgeColor = '#FFA000';

                if (w.status === 'read') {
                    statusText = '💌 Ba Mẹ đã đọc & thả tim';
                    badgeColor = '#E91E63';
                } else if (w.status === 'gifted' || w.status === 'completed') {
                    statusText = w.isSecret ? '🎁 Ba Mẹ đã gửi một điều bất ngờ!' : '🎉 Điều ước thành món quà!';
                    badgeColor = '#4CAF50';
                }

                return `
                    <div class="wish-journey-card">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                            <div style="font-family: var(--font-heading); font-size: 1.1rem; color: var(--pink-dark);">
                                ${w.emoji || '✨'} "${w.content}"
                            </div>
                            <span style="font-size: 0.78rem; background: ${badgeColor}; color: #FFF; padding: 3px 10px; border-radius: 12px; font-weight: bold; white-space: nowrap;">
                                ${statusText}
                            </span>
                        </div>
                        
                        <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 10px;">
                            🕒 Bé gửi lúc: ${w.createdAt}
                        </div>

                        ${w.parentResponse ? `
                            <div style="background: #FFF0F5; padding: 10px 14px; border-radius: 14px; font-size: 0.95rem; color: #D81B60; font-weight: 600; margin-bottom: 10px; border-left: 4px solid #E91E63;">
                                ${w.parentResponse}
                            </div>
                        ` : ''}

                        ${(w.status === 'gifted' || w.status === 'completed') ? `
                            ${w.isSecret ? `
                                <div style="background: #FFFDE7; padding: 12px; border-radius: 14px; border: 2px dashed #FFD700; text-align: center;">
                                    <div style="font-weight: bold; color: #856404; margin-bottom: 6px;">🎁 Ba Mẹ đã gửi cho bé 1 điều bất ngờ!</div>
                                    <button class="btn-unbox-secret" onclick="app.childUnboxSecret('${w.id}')">✨ MỞ QUÀ BẤT NGỜ 🎁</button>
                                </div>
                            ` : `
                                <div style="background: #E8F5E9; padding: 12px 16px; border-radius: 14px; border: 2px solid #4CAF50; color: #1B5E20;">
                                    <div style="font-weight: bold; font-family: var(--font-heading); font-size: 1.05rem;">🎁 PHẦN QUÀ TỪ BA MẸ:</div>
                                    <div style="font-size: 1rem; margin-top: 4px;">${w.giftTitle}</div>
                                    <div style="font-size: 0.8rem; color: #2E7D32; margin-top: 4px;">⏱️ Ba Mẹ điều quà lúc: ${w.giftedAt}</div>
                                </div>
                            `}
                        ` : ''}

                        <!-- Timeline pipeline -->
                        <div class="wish-journey-pipeline">
                            <div class="pipeline-step active">
                                <div class="step-icon">✨</div>
                                <div>Đã gửi</div>
                            </div>
                            <div class="pipeline-step ${w.status !== 'pending' ? 'active' : ''}">
                                <div class="step-icon">💌</div>
                                <div>Ba Mẹ đọc</div>
                            </div>
                            <div class="pipeline-step ${w.status === 'gifted' || w.status === 'completed' ? 'active' : ''}">
                                <div class="step-icon">🎁</div>
                                <div>Đã điều quà</div>
                            </div>
                            <div class="pipeline-step ${w.status === 'completed' || (w.status === 'gifted' && !w.isSecret) ? 'active' : ''}">
                                <div class="step-icon">🌈</div>
                                <div>Thành hiện thực</div>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        }

        this.openModal(this.dom.modalWishJourney);
    }

    childUnboxSecret(wishId) {
        const wish = this.state.wishes.find(w => w.id === wishId);
        if (!wish) return;

        wish.isSecret = false;
        wish.status = 'completed';

        sounds.playFanfare();
        fx.launchCelebration(3500);

        alert(`🎉 SURPRISE! MÓN QUÀ BẤT NGỜ TỪ BA MẸ:\n\n🎁 "${wish.giftTitle}"!\n\nChúc mừng bé nhé! 💖✨`);

        this.saveState();
        this.openWishJourneyModal();
    }

    parentLoveWish(wishId) {
        const wish = this.state.wishes.find(w => w.id === wishId);
        if (!wish) return;

        wish.status = 'read';
        wish.parentResponse = '❤️ Ba Mẹ đã đọc và gửi thật nhiều yêu thương tới điều ước của con! 💖';

        sounds.playSparkle();
        this.saveState();
        this.renderHeader();
        this.renderAdminLists();
        alert("❤️ Đã gửi lời yêu thương tới điều ước của bé!");
    }

    parentOpenDispatchModal(wishId) {
        const wish = this.state.wishes.find(w => w.id === wishId);
        if (!wish) return;

        const previewElem = document.getElementById('dispatch-wish-preview');
        const idElem = document.getElementById('dispatch-wish-id');
        const titleInput = document.getElementById('input-dispatch-gift-title');

        if (previewElem) previewElem.innerText = `⭐ Điều ước của bé: "${wish.content}"`;
        if (idElem) idElem.value = wishId;
        if (titleInput) titleInput.value = `Tặng con phần quà cho điều ước: "${wish.content.substring(0, 30)}..."`;

        sounds.playPop();
        this.openModal(this.dom.modalParentDispatchGift);
    }

    submitParentDispatchGift(e) {
        e.preventDefault();
        const wishId = document.getElementById('dispatch-wish-id').value;
        const giftTypeRadio = document.querySelector('input[name="giftType"]:checked');
        const giftType = giftTypeRadio ? giftTypeRadio.value : 'gift';
        const giftTitle = document.getElementById('input-dispatch-gift-title').value.trim();
        const isSecret = document.getElementById('input-dispatch-secret').checked;

        const wish = this.state.wishes.find(w => w.id === wishId);
        if (wish) {
            wish.status = 'gifted';
            wish.giftType = giftType;
            wish.giftTitle = giftTitle;
            wish.isSecret = isSecret;
            const now = new Date();
            wish.giftedAt = `${this.formatFullDateStr(now)} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
            if (!wish.parentResponse) {
                wish.parentResponse = '🎁 Ba Mẹ đã chấp nhận và biến điều ước của con thành món quà tuyệt vời!';
            }

            this.addHistoryLog(`Ba Mẹ đã điều quà cho điều ước: "${wish.content.substring(0, 25)}..."`, 'wish', 0);
            sounds.playFanfare();
            fx.launchCelebration(3000);
            alert("🎉 Ba Mẹ đã điều quà thành công cho điều ước của bé!");
        }

        this.closeModal(this.dom.modalParentDispatchGift);
        this.saveState();
        this.renderHeader();
        this.renderAdminLists();
    }

    parentAddWishToShop(wishId) {
        const wish = this.state.wishes.find(w => w.id === wishId);
        if (!wish) return;

        const costStr = prompt(`🛍️ Đưa điều ước "${wish.content}" vào Cửa Hàng Đổi Quà Thưởng.\n\nNhập số ⭐ bé cần tích lũy để đổi món quà này:`, "30");
        if (costStr === null) return;
        const cost = parseInt(costStr) || 30;

        const newShopItem = {
            id: 's_' + Date.now(),
            title: wish.content,
            icon: wish.emoji || '🎁',
            cost: cost
        };

        if (!this.state.shopItems) this.state.shopItems = [];
        this.state.shopItems.push(newShopItem);

        wish.status = 'gifted';
        wish.giftTitle = `Đã đưa vào Cửa Hàng Đổi Thưởng (${cost} ⭐)`;
        wish.parentResponse = `🎁 Ba Mẹ đã đưa điều ước của con vào Cửa Hàng Đổi Thưởng với giá ${cost} ⭐! Bé hãy chăm chỉ tích sao để đổi món quà mơ ước này nhé!`;

        this.addHistoryLog(`Ba Mẹ đã đưa điều ước "${wish.content}" vào Cửa Hàng Đổi Thưởng (${cost} ⭐)`, 'shop', 0);
        sounds.playFanfare();
        fx.launchCelebration(2500);

        this.saveState();
        this.renderAll();
        this.renderAdminLists();
        alert(`🎉 Đã đưa điều ước "${wish.content}" vào Cửa Hàng Đổi Thưởng với giá ${cost} ⭐ thành công!`);
    }

    // ==========================================
    // MULTI-DEVICE CLOUD SYNC ENGINE
    // ==========================================
    initCloudSync() {
        this.familyCode = localStorage.getItem('susu_family_code') || 'SUSU-CHUONGSOI';
        this.cloudObjectIdMap = JSON.parse(localStorage.getItem('susu_cloud_map') || '{}');
        this.cloudObjectIdMap['SUSU-CHUONGSOI'] = 'ff808181a09d98f701a0b4c336863574';
        
        // Multi-tab BroadcastChannel
        if (typeof BroadcastChannel !== 'undefined') {
            this.syncChannel = new BroadcastChannel('susu_family_sync_channel');
            this.syncChannel.onmessage = (event) => {
                if (event.data && event.data.type === 'SYNC_UPDATE') {
                    const saved = localStorage.getItem('cute_princess_app_state');
                    if (saved) {
                        try {
                            this.state = JSON.parse(saved);
                            this.renderAll();
                        } catch(e){}
                    }
                }
            };
        }

        // DOM elements for Cloud Sync
        this.domCloudPill = document.getElementById('cloud-sync-pill');
        this.domCloudDot = document.getElementById('cloud-sync-dot');
        this.domCloudText = document.getElementById('cloud-sync-text');
        this.domFamilyCodeInput = document.getElementById('input-family-sync-code');
        this.domSaveFamilyCodeBtn = document.getElementById('btn-save-family-code');
        this.domForcePushBtn = document.getElementById('btn-force-push-sync');
        this.domForcePullBtn = document.getElementById('btn-force-pull-sync');
        this.domCopyDataBtn = document.getElementById('btn-copy-sync-data');
        this.domImportDataBtn = document.getElementById('btn-import-sync-data');
        this.domSyncStatusMsg = document.getElementById('cloud-sync-status-msg');
        
        // Toast elements
        this.domToastContainer = document.getElementById('cloud-sync-toast');
        this.domToastTitle = document.getElementById('toast-title');
        this.domToastMsg = document.getElementById('toast-msg');
        this.domToastClose = document.getElementById('toast-close-btn');

        if (this.domFamilyCodeInput) {
            this.domFamilyCodeInput.value = this.familyCode;
        }

        if (this.domSaveFamilyCodeBtn) {
            this.domSaveFamilyCodeBtn.addEventListener('click', () => {
                const newCode = (this.domFamilyCodeInput.value || '').trim().toUpperCase();
                if (newCode) {
                    this.familyCode = newCode;
                    localStorage.setItem('susu_family_code', newCode);
                    this.showSyncStatusMsg(`✅ Đã lưu Mã Gia Đình: ${newCode}. Đang kết nối...`);
                    this.pullCloudSync(true);
                }
            });
        }

        if (this.domForcePushBtn) {
            this.domForcePushBtn.addEventListener('click', () => {
                this.pushStateToCloud(true);
            });
        }

        if (this.domForcePullBtn) {
            this.domForcePullBtn.addEventListener('click', () => {
                this.pullCloudSync(true);
            });
        }

        if (this.domCopyDataBtn) {
            this.domCopyDataBtn.addEventListener('click', () => {
                this.copyBackupDataCode();
            });
        }

        if (this.domImportDataBtn) {
            this.domImportDataBtn.addEventListener('click', () => {
                this.importBackupDataCode();
            });
        }

        if (this.domToastClose) {
            this.domToastClose.addEventListener('click', () => {
                if (this.domToastContainer) this.domToastContainer.style.display = 'none';
            });
        }

        // Initial fetch from cloud
        this.pullCloudSync(false);

        // Background polling every 3.5 seconds
        if (this.cloudSyncInterval) clearInterval(this.cloudSyncInterval);
        this.cloudSyncInterval = setInterval(() => {
            this.pollCloudSync();
        }, 3500);
    }

    getCloudObjectId(code) {
        if (!code) code = this.familyCode || 'SUSU-CHUONGSOI';
        if (code === 'SUSU-CHUONGSOI') return 'ff808181a09d98f701a0b4c336863574';
        return this.cloudObjectIdMap[code] || null;
    }

    async pushStateToCloud(isManual = false) {
        if (!this.state.updatedAt) this.state.updatedAt = Date.now();
        this.updateCloudPillState('syncing');

        try {
            let cloudId = this.getCloudObjectId(this.familyCode);
            if (cloudId) {
                const res = await fetch('https://api.restful-api.dev/objects/' + cloudId, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: 'SUSU_FAMILY_DATA_' + this.familyCode,
                        data: this.state
                    })
                });
                if (res.ok) {
                    this.updateCloudPillState('synced');
                    if (isManual) this.showSyncStatusMsg('✅ Đã đẩy dữ liệu mới nhất lên Cloud thành công!');
                    return;
                }
            }
            
            // If no cloudId or 404, create a new Cloud Object for this Family Code
            const createRes = await fetch('https://api.restful-api.dev/objects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: 'SUSU_FAMILY_DATA_' + this.familyCode,
                    data: this.state
                })
            });
            if (createRes.ok) {
                const createdObj = await createRes.json();
                this.cloudObjectIdMap[this.familyCode] = createdObj.id;
                localStorage.setItem('susu_cloud_map', JSON.stringify(this.cloudObjectIdMap));
                this.updateCloudPillState('synced');
                if (isManual) this.showSyncStatusMsg('✅ Đã khởi tạo và đẩy dữ liệu lên Cloud thành công!');
            } else {
                this.updateCloudPillState('error');
            }
        } catch (e) {
            console.warn("Cloud push failed:", e);
            this.updateCloudPillState('error');
            if (isManual) this.showSyncStatusMsg('⚠️ Lỗi kết nối mạng khi đẩy dữ liệu.');
        }
    }

    async pollCloudSync() {
        await this.pullCloudSync(false);
    }

    async pullCloudSync(isManual = false) {
        const cloudId = this.getCloudObjectId(this.familyCode);
        if (!cloudId) {
            if (isManual) this.showSyncStatusMsg('⚠️ Chưa có dữ liệu Cloud cho mã này. Đang tự động tải dữ liệu local lên...');
            await this.pushStateToCloud(isManual);
            return;
        }

        try {
            if (isManual) this.updateCloudPillState('syncing');
            const res = await fetch('https://api.restful-api.dev/objects/' + cloudId);
            if (res.status === 404) {
                await this.pushStateToCloud(isManual);
                return;
            }
            if (res.ok) {
                const cloudObj = await res.json();
                if (cloudObj && cloudObj.data && cloudObj.data.updatedAt) {
                    const cloudState = cloudObj.data;
                    const localTime = this.state.updatedAt || 0;

                    if (cloudState.updatedAt > localTime) {
                        // Check for new pending approvals to alert parents
                        const oldPendingCount = this.getPendingApprovalsCount();
                        this.state = cloudState;
                        localStorage.setItem('cute_princess_app_state', JSON.stringify(this.state));
                        if (this.syncChannel) {
                            this.syncChannel.postMessage({ type: 'SYNC_UPDATE', updatedAt: this.state.updatedAt });
                        }
                        this.renderAll();
                        this.updateCloudPillState('synced');

                        const newPendingCount = this.getPendingApprovalsCount();
                        if (newPendingCount > oldPendingCount) {
                            this.showToastNotification(
                                '🔔 BA MẸ ƠI!',
                                `Bé vừa gửi ${newPendingCount - oldPendingCount} nhiệm vụ mới chờ duyệt!`
                            );
                            if (window.sounds && typeof window.sounds.playSuccess === 'function') {
                                window.sounds.playSuccess();
                            }
                        }

                        if (isManual) this.showSyncStatusMsg('✅ Đã đồng bộ dữ liệu mới nhất từ Cloud!');
                    } else if (cloudState.updatedAt < localTime) {
                        // Local is newer, push to cloud
                        await this.pushStateToCloud(false);
                    } else {
                        this.updateCloudPillState('synced');
                        if (isManual) this.showSyncStatusMsg('✅ Dữ liệu trên thiết bị đã là mới nhất!');
                    }
                }
            }
        } catch (e) {
            console.warn("Cloud pull failed:", e);
            if (isManual) {
                this.updateCloudPillState('error');
                this.showSyncStatusMsg('⚠️ Kết nối mạng gián đoạn. Sử dụng dữ liệu lưu trên máy.');
            }
        }
    }

    getPendingApprovalsCount() {
        let count = 0;
        if (this.state && Array.isArray(this.state.dailyTasks)) {
            this.state.dailyTasks.forEach(t => {
                if (t.dayStatuses) {
                    Object.values(t.dayStatuses).forEach(s => {
                        if (s === 'pendingApproval') count++;
                    });
                }
            });
        }
        if (this.state && Array.isArray(this.state.challenges)) {
            this.state.challenges.forEach(c => {
                if (c.status === 'pendingApproval') count++;
            });
        }
        return count;
    }

    updateCloudPillState(status) {
        if (!this.domCloudPill || !this.domCloudDot || !this.domCloudText) return;
        this.domCloudPill.classList.remove('syncing', 'error');
        if (status === 'syncing') {
            this.domCloudPill.classList.add('syncing');
            this.domCloudDot.textContent = '🔄';
            this.domCloudText.textContent = 'Đang đồng bộ...';
        } else if (status === 'error') {
            this.domCloudPill.classList.add('error');
            this.domCloudDot.textContent = '⚠️';
            this.domCloudText.textContent = 'Ngoại tuyến';
        } else {
            this.domCloudDot.textContent = '🟢';
            this.domCloudText.textContent = 'Đã đồng bộ';
        }
    }

    showSyncStatusMsg(msg) {
        if (!this.domSyncStatusMsg) return;
        this.domSyncStatusMsg.textContent = msg;
        this.domSyncStatusMsg.style.display = 'block';
        setTimeout(() => {
            if (this.domSyncStatusMsg) this.domSyncStatusMsg.style.display = 'none';
        }, 5000);
    }

    showToastNotification(title, message) {
        if (!this.domToastContainer || !this.domToastTitle || !this.domToastMsg) return;
        this.domToastTitle.textContent = title;
        this.domToastMsg.textContent = message;
        this.domToastContainer.style.display = 'block';
        setTimeout(() => {
            if (this.domToastContainer) this.domToastContainer.style.display = 'none';
        }, 8000);
    }

    copyBackupDataCode() {
        try {
            const dataStr = JSON.stringify(this.state);
            const base64Str = btoa(unescape(encodeURIComponent(dataStr)));
            navigator.clipboard.writeText(base64Str).then(() => {
                alert('✅ Đã sao chép Mã Backup Dữ Liệu vào bộ nhớ tạm!\n\nBa mẹ có thể dán (paste) mã này qua Zalo / Mess hoặc máy khác để đồng bộ 100% dữ liệu!');
            }).catch(() => {
                prompt('Copy Mã Backup Dữ Liệu bên dưới:', base64Str);
            });
        } catch(e) {
            alert('Lỗi tạo mã backup: ' + e.message);
        }
    }

    importBackupDataCode() {
        const inputStr = prompt('Dán Mã Backup Dữ Liệu (chuỗi chữ cái Base64) vào đây để khôi phục/đồng bộ:');
        if (!inputStr) return;
        try {
            const jsonStr = decodeURIComponent(escape(atob(inputStr.trim())));
            const parsed = JSON.parse(jsonStr);
            if (parsed && typeof parsed === 'object' && parsed.dailyTasks) {
                this.state = parsed;
                this.state.updatedAt = Date.now();
                this.saveState();
                this.renderAll();
                alert('🎉 ĐÃ KHÔI PHỤC VÀ ĐỒNG BỘ DỮ LIỆU THÀNH CÔNG!');
            } else {
                alert('⚠️ Mã dữ liệu không hợp lệ!');
            }
        } catch(e) {
            alert('⚠️ Lỗi giải mã dữ liệu: ' + e.message);
        }
    }
}

// Instantiate global app instance
let app;
window.addEventListener('DOMContentLoaded', () => {
    app = new PrincessApp();
    window.app = app;
    window.sounds = sounds;
});
