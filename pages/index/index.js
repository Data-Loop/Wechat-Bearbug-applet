// 获取应用实例
const app = getApp()

Page({
  data: {
    searchText: '',
    word: {
      animal: '动物识别宠物猫狗',
      plant: '植物识别花草树叶',
      car: '车辆识别汽车轿车',
      face: '人脸识别对比照片',
      dragon: '游戏挑战恶龙',
      word: '文字识别扫描阅读文本'
    },
    items: [
      { type: 'animal', image: '/images/dwsb.jpg', title: '动物识别', price: '0.66', row: 1, isGame: false },
      { type: 'plant', image: '/images/zwsb.jpg', title: '植物识别', price: '0.88', row: 1, isGame: false },
      { type: 'car', image: '/images/clsb.jpg', title: '车辆识别', price: '0.99', row: 2, isGame: false },
      { type: 'face', image: '/images/rldb.jpg', title: '人脸对比', price: '1.01', row: 2, isGame: false },
      { type: 'dragon', image: '/images/tjel.jpg', title: '挑战恶龙', price: '1.99', row: 3, isGame: true },
      { type: 'word', image: '/images/word.jpg', title: '文字识别', price: '1.11', row: 3, isGame: false }
    ],
    filteredItems: [],
    isExactMatch: false,
    showLoading: false,
    currentImageIndex: 1,
    posX: 0,
    posY: 0,
    speedX: 5,
    speedY: 5,
    bounceStyle: '',
    screenWidth: 0,
    screenHeight: 0,
    isSpecialPlay: false,  // 是否在播放特殊图片序列
    specialImageIndex: 1,  // 特殊图片序列的当前索引
    isPaused: false       // 是否暂停弹跳
  },

  onLoad(){
    this.data.audio=wx.createInnerAudioContext()
    this.data.audio.src='/audio/ciallo～(∠・ω- )⌒☆__爱给网_aigei_com.mp3'
    this.setData({
      filteredItems: this.data.items
    });
    
    // 获取屏幕尺寸
    const systemInfo = wx.getSystemInfoSync();
    this.setData({
      screenWidth: systemInfo.windowWidth,
      screenHeight: systemInfo.windowHeight
    });

    // 图片切换定时器
    this.imageInterval = setInterval(() => {
      this.setData({
        currentImageIndex: this.data.currentImageIndex % 5 + 1
      });
    }, 100);

    // 初始化位置
    this.initRandomPosition();
    // 开始动画
    this.startBounceAnimation();
  },

  initRandomPosition() {
    const maxWidth = this.data.screenWidth - 100;
    const maxHeight = this.data.screenHeight - 100;

    const posX = maxWidth / 2;
    const posY = maxHeight / 2;

    // 减小初始速度
    const speedX = (Math.random() > 0.5 ? 1 : -1) * 3;
    const speedY = (Math.random() > 0.5 ? 1 : -1) * 3;

    this.setData({
      posX,
      posY,
      speedX,
      speedY,
      bounceStyle: `left: ${posX}px; top: ${posY}px;`
    });
  },

  // 通用的页面跳转方法
  navigateTo(url) {
    this.setData({ showLoading: true });
    wx.navigateTo({
      url: url,
      complete: () => {
        // 确保在跳转完成后隐藏loading
        setTimeout(() => {
          this.setData({ showLoading: false });
        }, 500);
      }
    });
  },

  // 事件处理函数
  goanimal() {
    this.navigateTo('/pages/animal/animal');
  },

  goword() {
    this.navigateTo('/pages/word/word');
  },

  gocar() {
    this.navigateTo('/pages/car/car');
  },

  goplant() {
    this.navigateTo('/pages/plant/plant');
  },

  goface() {
    this.navigateTo('/pages/face/face');
  },

  godragon() {
    this.navigateTo('/pages/dragon/dragon');
  },

  play(){
    this.data.audio.play()
  },

  // 切换搜索模式
  toggleSearchMode() {
    this.setData({
      isExactMatch: !this.data.isExactMatch
    }, () => {
      // 切换后重新执行搜索
      if(this.data.searchText) {
        this.searchInput({ detail: { value: this.data.searchText } });
      }
    });
  },

  // 搜索处理
  searchInput(e) {
    let text = e.detail.value.trim();
    this.setData({ searchText: text });
    
    if(!text) {
      this.setData({
        filteredItems: this.data.items
      });
      return;
    }

    // 先找出匹配的项目
    const filtered = this.data.items.filter(item => 
      this.zhao(text, item.type)
    );

    // 重新分配行号
    const reorderedItems = filtered.map((item, index) => ({
      ...item,
      row: Math.floor(index / 2) + 1  // 每行两个项目
    }));

    this.setData({
      filteredItems: reorderedItems
    });
  },

  // 搜索匹配函数
  zhao(text, type) {
    if(this.data.isExactMatch) {
      // 精准匹配：完整词语必须出现在关键词中
      return this.data.word[type].includes(text);
    } else {
      // 模糊匹配：任意字符匹配即可
      for(let i = 0; i < text.length; i++) {
        if(this.data.word[type].indexOf(text[i]) !== -1) {
          return true;
        }
      }
      return false;
    }
  },

  startBounceAnimation() {
    this.animationInterval = setInterval(() => {
      // 如果在暂停状态，不更新位置
      if (this.data.isPaused) return;

      let { posX, posY, speedX, speedY } = this.data;
      const maxWidth = this.data.screenWidth - 100;
      const maxHeight = this.data.screenHeight - 100;

      // 更新位置
      posX += speedX;
      posY += speedY;

      // 碰撞检测和反弹
      if (posX <= 0) {
        posX = 0;
        speedX = Math.abs(speedX);
      } else if (posX >= maxWidth) {
        posX = maxWidth;
        speedX = -Math.abs(speedX);
      }

      if (posY <= 0) {
        posY = 0;
        speedY = Math.abs(speedY);
      } else if (posY >= maxHeight) {
        posY = maxHeight;
        speedY = -Math.abs(speedY);
      }

      // 更新状态
      this.setData({
        posX,
        posY,
        speedX,
        speedY,
        bounceStyle: `left: ${posX}px; top: ${posY}px;`
      });
    }, 16); // 约60fps的更新频率
  },

  // 添加点击处理函数
  handleBounceClick() {
    if (this.data.isPaused) return; // 如果已经在特殊播放状态，忽略点击

    // 暂停弹跳和普通图片播放
    this.setData({ 
      isPaused: true,
      isSpecialPlay: true,
      specialImageIndex: 1
    });

    // 清除原有的图片切换定时器
    clearInterval(this.imageInterval);

    // 开始播放特殊图片序列
    this.specialInterval = setInterval(() => {
      let nextIndex = this.data.specialImageIndex + 1;
      if (nextIndex > 6) {
        nextIndex = 1;
      }
      this.setData({
        specialImageIndex: nextIndex
      });
    }, 100);  // 特殊图片切换间隔

    // 5秒后恢复原状
    setTimeout(() => {
      // 清除特殊图片播放定时器
      clearInterval(this.specialInterval);

      // 恢复原始状态
      this.setData({
        isPaused: false,
        isSpecialPlay: false,
        currentImageIndex: 1
      });

      // 重新开始普通图片切换
      this.imageInterval = setInterval(() => {
        this.setData({
          currentImageIndex: this.data.currentImageIndex % 5 + 1
        });
      }, 100);

    }, 3000);  // 3秒后恢复
  },

  onUnload() {
    // 清理所有定时器
    if (this.imageInterval) {
      clearInterval(this.imageInterval);
    }
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
    }
    if (this.specialInterval) {
      clearInterval(this.specialInterval);
    }
  }
})
