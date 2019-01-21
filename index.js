const LOCALSTORAGE_KEY = "developer-roadmap-ja";
Vue.component("box", {
  template: `
  <g :transform="transform">
    <rect :fill="fillColor" stroke="black" x=0 y=0 width="300" height="40"></rect>
    <a :href="link">
      <text x=150 y=20 dominant-baseline="central" text-anchor="middle">{{label}}</text>
    </a>
    <rect @click="check" fill="white" stroke="black" x=5 y=5 width=20 height=20>
    </rect>
    <path v-if="checked" fill="none" stroke="blue" stroke-width="3" d="M 7,17 L 10,20 L 20,10"></path>
  </g>
  `,
  props: {
    x: Number,
    y: Number,
    label: String,
    type: String,
    storage: Array
  },
  methods: {
    check() {
      const idx = this.storage.indexOf(this.label);
      if (idx >= 0) {
        this.storage.splice(idx, 1);
      } else {
        this.storage.push(this.label);
      }
      localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(this.storage));
    }
  },
  computed: {
    transform() {
      return `translate(${this.x}, ${this.y})`;
    },
    fillColor() {
      if (this.type === "parent") {
        return "#FFFF00";
      }
      return "#FFE599";
    },
    link() {
      return `https://scrapbox.io/developer-roadmap-ja/${this.label}`;
    },
    checked() {
      return this.storage.includes(this.label);
    }
  }
});

Vue.component("tree", {
  template: `<div>
  <svg style="margin: 2rem" width="800" :height="height" :viewBox="viewBox">
    <box :storage="storage" :x="0" :y="0" :label="label" type="parent"></box>
    <g v-for="(item, idx) in children">
      <box :storage="storage" :x="360" :y="idx * 60" :label="item"></box>
      <line stroke="blue" stroke-dasharray="5,5" x1=300 y1=20 x2=360 :y2="20 + 60 * idx"></line>
    </g>
  </svg>
  </div>`,
  props: {
    label: String,
    children: Array,
    storage: Array
  },
  computed: {
    height() {
      return this.children.length * 60;
    },
    viewBox() {
      return `0 0 800 ${this.height}`;
    }
  }
});

Vue.component("tree-section", {
  template: `
  <div>
    <h1>{{treedata.title}}</h1>
    <div v-for="item in treedata.tree">
      <tree :storage="storage" :label="item.label" :children="item.children"></tree>
    </div>
  </div>
  `,
  props: {
    storage: Array,
    treedata: Object
  }
});

new Vue({
  el: "#app",
  data: {
    storage: [],
    treedata: {
      title: "基礎",
      tree: [
        {
          label: "HTML",
          children: [
            "HTMLの基礎",
            "セマンティックなHTMLを書く",
            "基本的なSEO",
            "アクセシビリティ"
          ]
        },
        {
          label: "CSS",
          children: [
            "CSSの基礎",
            "レイアウトを作る",
            "メディアクエリ",
            "CSS3を学ぶ"
          ]
        },
        {
          label: "JavaScriptの基礎",
          children: [
            "基礎的な文法",
            "DOM操作を学ぶ",
            "Fetch APIを学ぶ",
            "ES6とJavaScriptの部品化を学ぶ"
          ]
        }
      ]
    }
  },
  mounted() {
    const local = localStorage.getItem(LOCALSTORAGE_KEY);
    if (local) {
      this.storage = JSON.parse(local);
    }
  }
});
