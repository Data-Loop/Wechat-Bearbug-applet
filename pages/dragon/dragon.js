Page({
  data: {
    health: 10, // 体力
    maxHealth: 10, // 体力上限
    food: 5, // 食物
    weaponDurability: 10, // 武器耐久
    toolDurability: 10, // 工具耐久
    inventory: { // 物品清单
      weapon: [ // 武器属性，改为数组存储多个武器
        {
          count: 1,
          durability: 10
        }, // 第一把武器
      ],
      tool: [ // 工具属性，改为数组存储多个工具
        {
          count: 1,
          durability: 10
        }, // 第一把工具
      ]
    },
    currentWeaponIndex: 0, // 添加当前武器索引
    currentToolIndex: 0,   // 添加当前工具索引
    eventMessage: '', // 当前事件信息
    gameOver: false, // 游戏是否结束
    gameVictory: false, // 游戏是否胜利
    backgroundImage: '', // 当前背景图
    pathChosen: false, // 玩家是否选择了路径
    // huan tu de ding shi qi
    task: null,
    time: 150,
    gj: 0,
    task1: null,
    time1: 100,
    currentBackground: "/images/back.png",
    backgrounds: [
      { id: 'back', path: '/images/back.png', name: '默认背景', price: 0 },
      { id: 'back1', path: '/images/back1.png', name: '限定背景', price: 68, isTrial: true }
    ],
    showBackgroundModal: false,
    currentAvatar: 0,  // 当前头像帧索引
    avatarType: 'gj',  // 当前头像类型
    avatarFrame: 0,    // 当前动画帧
    avatars: [
      { id: 'gj', name: '默认头像', frames: 4, price: 0, type: '动态', preview: '/images/gj0.jpg' },
      { id: 'x', name: '特殊头像', frames: 5, startFrame: 1, price: 88, isTrial: true, type: '动态', preview: '/images/x1.jpg' },
      { id: 'jwj', path: '/images/jwj.jpg', name: '静态头像', price: 128, isTrial: true, type: '静态', preview: '/images/jwj.jpg' }
    ],
    showAvatarModal: false
  },

  // 游戏开始时初始化数据
  onLoad: function (options) {
    this.resetGame();
    this.data.task = setInterval(this.bian, this.data.time)
    this.startAvatarAnimation();
  },

  bian: function () {
    this.setData({
      gj: (this.data.gj + 1) % 4  // 确保gj值在0到3之间循环
    });
  },
  

  // 重置游戏
  resetGame: function () {
    this.setData({
      health: this.data.maxHealth,
      food: 5,
      currentWeaponIndex: 0,
      currentToolIndex: 0,
      inventory: {
        weapon: [{
          count: 1,
          durability: 10
        }],
        tool: [{
          count: 1,
          durability: 10
        }]
      },
      eventMessage: "游戏重置，开始新的冒险！",
      gameOver: false,
      gameVictory: false,
      backgroundImage: "/images/cg0.jpg",
      // 初始背景  
      pathChosen: false
    });
    this.updateStatus();
  },

  // 选择路径
  choosePath: function (e) {
    if (this.data.gameOver) return;
    
    const path = e.currentTarget.dataset.path;
    this.setData({
      pathChosen: true
    });

    // 如果已经胜利，任意选择都返回首页
    if (this.data.gameVictory) {
      wx.redirectTo({
        url: '/pages/index/index'
      });
      return;
    }

    this.triggerRandomEvent(path);
  },

  // 随机事件触发
  triggerRandomEvent: function (path) {
    let eventMessage = "";
    // 增加事件数量，从0-15
    const randomEvent = Math.floor(Math.random() * 16);
    let currentEvent = "";

    try {
      switch (randomEvent) {
        // 原有的战斗事件
        case 0:
          eventMessage = this.handleBattle(2, "恶龙的小喽啰");
          currentEvent = "恶龙的小喽啰";
          break;
        case 1:
          eventMessage = this.handleBattle(4, "恶龙的精锐士兵");
          currentEvent = "恶龙的精锐士兵";
          break;
        case 2:
          eventMessage = this.handleBattle(6, "恶龙的小头目");
          currentEvent = "恶龙的小头目";
          break;
        case 3:
          eventMessage = this.handleBattle(8, "恶龙");
          currentEvent = "恶龙";
          break;

        // 新增事件
        case 4:
          eventMessage = this.handleAncientShrine();
          currentEvent = "古老神殿";
          break;
        case 5:
          eventMessage = this.handleMysteriousChest();
          currentEvent = "神秘宝箱";
          break;
        case 6:
          eventMessage = this.handleWanderingHealer();
          currentEvent = "流浪医者";
          break;
        case 7:
          eventMessage = this.handleAbandonedCamp();
          currentEvent = "废弃营地";
          break;
        
        // 原有的其他事件
        case 8:
          eventMessage = this.handleBlackRain();
          currentEvent = "黑雨";
          break;
        case 9:
          eventMessage = this.handleMysteriousMerchant();
          currentEvent = "神秘商人";
          break;
        case 10:
          eventMessage = this.handleBlacksmith();
          currentEvent = "铁匠";
          break;
        
        // 新增事件
        case 11:
          eventMessage = this.handleMagicSpring();
          currentEvent = "魔法泉水";
          break;
        case 12:
          eventMessage = this.handleDragonEgg();
          currentEvent = "龙蛋";
          break;
        case 13:
          eventMessage = this.handleAncientLibrary();
          currentEvent = "古代图书馆";
          break;
        case 14:
          eventMessage = this.handleMysteriousCave();
          currentEvent = "神秘洞穴";
          break;
        case 15:
          eventMessage = this.handleSacredTree();
          currentEvent = "圣树";
          break;
      }

      // 确保 eventMessage 不为 undefined
      if (!eventMessage) {
        eventMessage = `遇到了${currentEvent}！`;
      }

      this.setData({
        currentEvent,
        eventMessage
      });

      this.checkGameOver();
    } catch (error) {
      console.error('触发事件时出错：', error);
      this.setData({
        currentEvent: "错误",
        eventMessage: "发生了一个错误，请重试！",
        backgroundImage: "/images/cg0.jpg"
      });
    }
  },

  // 处理战斗事件
  handleBattle: function (damage, enemy) {
    // 检查是否是恶龙战斗
    if (enemy === "恶龙") {
      if (this.data.health > damage) {
        // 有足够的生命值战胜恶龙
        this.setData({
          gameVictory: true,
          eventMessage: "你成功战胜了恶龙！",
          backgroundImage: "/images/cg0.jpg"
        });
        
        // 延迟2秒后返回首页
        setTimeout(() => {
          wx.redirectTo({
            url: '/pages/index/index'
          });
        }, 2000);
        
        return "你成功战胜了恶龙！即将返回首页...";
      }
    }

    // 原有的战斗逻辑
    let weaponIndex = this.data.currentWeaponIndex;
    let weapons = this.data.inventory.weapon;
    
    if (weapons[weaponIndex] && weapons[weaponIndex].durability > 0) {
      // 减少武器耐久
      let newWeapons = [...weapons];
      newWeapons[weaponIndex].durability -= 1;

      // 如果当前武器耐久为0，尝试切换到下一个可用武器
      if (newWeapons[weaponIndex].durability <= 0) {
        let nextWeaponIndex = this.findNextUsableWeapon(weaponIndex);
        if (nextWeaponIndex !== -1) {
          this.setData({ currentWeaponIndex: nextWeaponIndex });
        }
      }

      this.setData({
        inventory: {
          ...this.data.inventory,
          weapon: newWeapons
        }
      });

      // 更新显示的耐久度
      this.updateStatus();

      // 计算伤害
      let newHealth = this.data.health - Math.max(1, damage - 1);
      this.setData({
        health: newHealth,
        backgroundImage: this.getBattleBackground(enemy)
      });

      return `你与${enemy}战斗，受到${Math.max(1, damage - 1)}点伤害！`;
    } else {
      // 无可用武器时受到全额伤害
      let newHealth = this.data.health - damage;
      this.setData({
        health: newHealth,
        backgroundImage: this.getBattleBackground(enemy)
      });

      return `你没有可用的武器，与${enemy}战斗受到${damage}点伤害！`;
    }
  },

  // 根据敌人类型选择战斗背景图
  getBattleBackground: function (enemy) {
    const audio = wx.createInnerAudioContext();
    switch (enemy) {
      case "恶龙的小喽啰":
        // 创建音频上下文
        audio.src = "/audio/xll.mp3"; // 设置音频文件路径
        // 播放音效
        audio.play();
        return "/images/zd0.jpg"; // 小喽啰的背景
      case "恶龙的精锐士兵":
       
        audio.src = "/audio/jr.mp3"; // 设置音频文件路径 
        // 播放音效
        audio.play();
        return "/images/zd1.jpg"; // 精锐士兵的背景
      case "恶龙的小头目":
        audio.src = "/audio/jr.mp3"; // 设置音频文件路径 
        // 播放音效
        audio.play();
        return "/images/zd2.jpg"; // 小头目的背景
      case "恶龙":
        return "/images/bj.jpg"; // 恶龙的背景
      default:
        return "/images/zd.jpg"; // 默认背景
    }
  },

  // 获取活跃的物品索引，若无物品返回-1
  getActiveItemIndex: function (itemType) {
    const inventory = this.data.inventory[itemType];
    for (let i = 0; i < inventory.length; i++) {
      if (inventory[i].count > 0 && inventory[i].durability > 0) {
        return i;
      }
    }
    return -1; // 如果没有可用的物品
  },

  // 设置物品的耐久度
  setWeaponDurability: function (index, durability) {
    let inventory = this.data.inventory.weapon;
    inventory[index].durability = durability;
    this.setData({
      'inventory.weapon': inventory
    });
  },

  setToolDurability: function (index, durability) {
    let inventory = this.data.inventory.tool;
    inventory[index].durability = durability;
    this.setData({
      'inventory.tool': inventory
    });
  },

  // 处理黑雨事件
  handleBlackRain: function () {
    const newHealth = this.data.health - 2;
    const newFood = this.data.food - 2;

    // 更新属性
    this.setData({
      health: newHealth,
      food: newFood,
      backgroundImage: "/images/hy.png" // 黑雨背景
    });

    // 创建音频上下文
    const audio = wx.createInnerAudioContext();
    audio.src = "/audio/hy.mp3"; // 设置音频文件路径

    // 播放音效
    audio.play();

    return "天空下起了黑雨，体力减少2，食物减少2。";
  },

  // 处理神秘商人
  handleMysteriousMerchant: function () {
    const newToolCount = this.data.inventory.tool[0].count + 1;
    this.setData({
      inventory: {
        ...this.data.inventory,
        tool: [{
          count: newToolCount,
          durability: this.data.inventory.tool[0].durability
        }]
      },
      backgroundImage: "/images/g1.jpg"  // 使用已有的背景图
    });
    return `神秘商人赠送了你1把工具！现在你拥有了${newToolCount}把工具。`;
  },

  // 处理铁匠商人事件
  handleBlacksmith: function () {
    if (this.data.inventory.tool[0].count > 0) {
      this.addNewWeapon();
      return `铁匠给你提供了一把新的武器！`;
    } else {
      return "铁匠需要工具才能给你武器。";
    }
  },

  // 处理铁匠铺事件
  handleBlacksmithShop: function () {
    const toolIndex = this.getActiveItemIndex('tool');
    if (toolIndex !== -1) {
      const newWeaponCount = this.data.inventory.weapon[0].count + 1;
      this.setData({
        inventory: {
          ...this.data.inventory,
          weapon: [{
            count: newWeaponCount,
            durability: this.data.inventory.weapon[0].durability
          }]
        },
        backgroundImage: "/images/clsb.jpg"  // 使用已有的背景图
      });
      return `你使用工具修复了武器，武器数量增加！现在你拥有了${newWeaponCount}把武器。`;
    } else {
      this.setData({
        backgroundImage: "/images/rldb.jpg"  // 使用已有的背景图
      });
      return "工具数量不足，无法修复武器。";
    }
  },

  // 许愿池事件
  handleWishingWell: function () {
    const random = Math.floor(Math.random() * 4);

    switch (random) {
      case 0:
        this.setData({
          health: this.data.health + 2,
          backgroundImage: "/images/xyc.png"
        });
        return "许愿池给予你2点体力！";
      case 1:
        this.setData({
          food: this.data.food + 2,
          backgroundImage: "/images/xyc.png"
        });
        return "许愿池给予你2份食物！";
      case 2:
        this.setData({
          weaponDurability: this.data.weaponDurability + 1,
          backgroundImage: "/images/xyc.png"
        });
        return "许愿池给予你1点武器耐久！";
      case 3:
        this.setData({
          toolDurability: this.data.toolDurability - 2,
          backgroundImage: "/images/xyc.png"
        });
        return "许愿池让你损失2点工具耐久";
    }
  },

  // 圣光之雨事件
  handleHolyRain: function () {
    this.setData({
      health: this.data.health + 2,
      food: this.data.food + 2,
      backgroundImage: "/images/sg.png" // 圣光之雨背景
    });
    return "天空下起了圣光之雨，体力和食物各增加2点！";
  },

  // 游戏结束检查
  checkGameOver: function () {
    let eventMessage = "";
    let backgroundImage = "";

    // 根据当前事件来生成失败信息
    if (this.data.health <= 0) {
      eventMessage = `你遭遇了${this.data.currentEvent}，体力不足，游戏结束！`;
      backgroundImage = "/images/sb.jpg"; // 失败背景图
    }

    if (this.data.gameVictory) {
      eventMessage = "你战胜了恶龙，赢得了游戏！";
      backgroundImage = "/images/cg0.jpg"; 
    }

    // 如果游戏失败或胜利，更新状态并显示消息
    if (eventMessage) {
      this.setData({
        gameOver: true,
        eventMessage: eventMessage,
        backgroundImage: backgroundImage
      });
    }
  },

  // 处理战胜恶龙事件
  handleBattleWithDragon: function () {
    if (this.data.health > 0) {
      this.setData({
        gameVictory: true
      });
      this.setData({
        eventMessage: "你成功战胜了恶龙！",
        backgroundImage: "/images/dwsb.jpg" // 胜利背景（可自定义）
      });
      this.checkGameOver(); // 直接检查游戏结束
      return "你成功战胜了恶龙！";
    }
  },

  // 使用食物恢复体力
  useFoodForHealth: function () {
    if (this.data.food > 0) {
      let healthRestored = 2; // 每使用一份食物恢复2点体力
      let newHealth = Math.min(this.data.health + healthRestored, this.data.maxHealth); // 确保不超过最大体力
      let newFood = this.data.food - 1; // 消耗1份食物

      this.setData({
        health: newHealth,
        food: newFood,
        eventMessage: `你使用了1份食物，恢复了${healthRestored}点体力！`,
        backgroundImage: "/images/js.jpg" // 食物恢复体力背景
      });
    } else {
      this.setData({
        eventMessage: "你没有足够的食物来恢复体力！",
        backgroundImage: "/images/wfjs.jpg" // 食物不足背景
      });
    }

    // 创建音频上下文
    const audio = wx.createInnerAudioContext();
    audio.src = "/audio/eat.mp3"; // 设置音频文件路径

    // 播放音效
    audio.play();
  },

  // 获取当前武器耐久度
  getCurrentWeaponDurability: function() {
    const weapons = this.data.inventory.weapon;
    const currentIndex = this.data.currentWeaponIndex;
    return weapons[currentIndex]?.durability || 0;
  },

  // 获取当前工具耐久度
  getCurrentToolDurability: function() {
    const tools = this.data.inventory.tool;
    const currentIndex = this.data.currentToolIndex;
    return tools[currentIndex]?.durability || 0;
  },

  // 更新状态显示
  updateStatus: function() {
    this.setData({
      weaponDurability: this.getCurrentWeaponDurability(),
      toolDurability: this.getCurrentToolDurability()
    });
  },

  // 查找下一个可用武器
  findNextUsableWeapon: function(currentIndex) {
    const weapons = this.data.inventory.weapon;
    for (let i = 0; i < weapons.length; i++) {
      if (i !== currentIndex && weapons[i].durability > 0) {
        return i;
      }
    }
    return -1;
  },

  // 添加新武器
  addNewWeapon: function() {
    let weapons = [...this.data.inventory.weapon];
    weapons.push({
      count: 1,
      durability: 10
    });

    this.setData({
      inventory: {
        ...this.data.inventory,
        weapon: weapons
      }
    });

    // 如果当前武器耐久为0，切换到新武器
    if (this.getCurrentWeaponDurability() <= 0) {
      this.setData({
        currentWeaponIndex: weapons.length - 1
      });
    }

    this.updateStatus();
  },

  // 新增事件处理函数
  handleAncientShrine: function() {
    const healthBonus = 3;
    this.setData({
      health: Math.min(this.data.maxHealth, this.data.health + healthBonus),
      backgroundImage: "/images/cg0.jpg"
    });
    return `你在古老神殿中找到了治疗圣水，恢复了${healthBonus}点生命值！`;
  },

  handleMysteriousChest: function() {
    const randomBonus = Math.random() > 0.5;
    if (randomBonus) {
      this.addNewWeapon();
      this.setData({
        backgroundImage: "/images/cg0.jpg"
      });
      return "你打开宝箱，获得了一把新武器！";
    } else {
      this.setData({
        food: this.data.food + 2,
        backgroundImage: "/images/cg0.jpg"
      });
      return "你打开宝箱，找到了2份食物！";
    }
  },

  handleWanderingHealer: function() {
    const healAmount = 4;
    this.setData({
      health: Math.min(this.data.maxHealth, this.data.health + healAmount),
      backgroundImage: "/images/zwsb.jpg"
    });
    return `流浪医者为你治疗，恢复了${healAmount}点生命值！`;
  },

  handleAbandonedCamp: function() {
    this.setData({
      food: this.data.food + 1,
      backgroundImage: "/images/zd0.jpg"
    });
    return "你在废弃营地找到了1份食物和一些补给。";
  },

  handleMagicSpring: function() {
    const weapons = this.data.inventory.weapon;
    const currentIndex = this.data.currentWeaponIndex;
    
    if (weapons[currentIndex]) {
      let newWeapons = [...weapons];
      newWeapons[currentIndex].durability = Math.min(10, newWeapons[currentIndex].durability + 5);
      
      this.setData({
        inventory: {
          ...this.data.inventory,
          weapon: newWeapons
        },
        backgroundImage: "/images/g1.jpg"
      });
      this.updateStatus();
      return "魔法泉水修复了你的武器，恢复了5点耐久度！";
    }
    return "你没有武器可以修复。";
  },

  handleDragonEgg: function() {
    const bonus = Math.floor(Math.random() * 3) + 1;
    this.setData({
      health: Math.min(this.data.maxHealth, this.data.health + bonus),
      food: this.data.food + bonus,
      backgroundImage: "/images/sxc.png"
    });
    return `你发现了一颗龙蛋，获得了${bonus}点生命值和${bonus}份食物！`;
  },

  handleAncientLibrary: function() {
    const weapons = this.data.inventory.weapon;
    const tools = this.data.inventory.tool;
    
    let newWeapons = [...weapons];
    let newTools = [...tools];
    
    // 恢复所有装备的耐久度
    newWeapons = newWeapons.map(w => ({...w, durability: 10}));
    newTools = newTools.map(t => ({...t, durability: 10}));
    
    this.setData({
      inventory: {
        weapon: newWeapons,
        tool: newTools
      },
      backgroundImage: "/images/x3.jpg"
    });
    this.updateStatus();
    return "你在古代图书馆学习到修复技术，所有装备耐久度已完全恢复！";
  },

  handleMysteriousCave: function() {
    const randomEffect = Math.random();
    if (randomEffect > 0.7) {
      this.setData({
        health: Math.min(this.data.maxHealth, this.data.health + 2),
        food: this.data.food + 2,
        backgroundImage: "/images/x4.jpg"
      });
      return "你在洞穴中找到了宝藏，获得2点生命值和2份食物！";
    } else {
      const damage = 1;
      this.setData({
        health: this.data.health - damage,
        backgroundImage: "/images/zd2.jpg"
      });
      return "你在洞穴中遭遇了陷阱，失去1点生命值。";
    }
  },

  handleSacredTree: function() {
    this.setData({
      health: this.data.maxHealth,
      backgroundImage: "/images/zwsb.jpg"
    });
    return "圣树的力量治愈了你，生命值完全恢复！";
  },

  toggleBackgroundModal: function() {
    this.setData({
      showBackgroundModal: !this.data.showBackgroundModal
    });
  },

  changeBackground: function(e) {
    const backgroundId = e.currentTarget.dataset.id;
    const background = this.data.backgrounds.find(bg => bg.id === backgroundId);
    
    if (background) {
      this.setData({
        currentBackground: background.path,
        showBackgroundModal: false
      });
    }
  },

  // 添加头像相关方法
  startAvatarAnimation: function() {
    setInterval(() => {
      const currentAvatar = this.data.avatarType;
      const avatar = this.data.avatars.find(a => a.id === currentAvatar);
      
      if (avatar && avatar.frames) {
        let frame = this.data.avatarFrame + 1;
        if (avatar.startFrame) {
          frame = frame % avatar.frames + avatar.startFrame;
        } else {
          frame = frame % avatar.frames;
        }
        this.setData({
          avatarFrame: frame
        });
      }
    }, 200);
  },

  toggleAvatarModal: function() {
    this.setData({
      showAvatarModal: !this.data.showAvatarModal
    });
  },

  changeAvatar: function(e) {
    const avatarId = e.currentTarget.dataset.id;
    const avatar = this.data.avatars.find(av => av.id === avatarId);
    
    if (avatar) {
      if (avatar.frames) {
        // 动态头像
        this.setData({
          avatarType: avatar.id,
          avatarFrame: avatar.startFrame || 0
        });
      } else {
        // 静态头像
        this.setData({
          avatarType: 'static',
          staticAvatar: avatar.path
        });
      }
      this.setData({
        showAvatarModal: false
      });
    }
  }
});
